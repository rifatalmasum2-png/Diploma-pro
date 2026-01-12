
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from '../firebase';
import { Notice } from '../types';

const Header: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const noticesRef = collection(db, 'notices');
    const q = query(noticesRef, orderBy('createdAt', 'desc'), limit(15));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotices: Notice[] = [];
      const lastRead = localStorage.getItem('lastNoticeReadAt') || '0';
      const lastReadTime = parseInt(lastRead);
      
      let count = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        let createdTime: number;
        if (data.createdAt && typeof data.createdAt.toMillis === 'function') {
          createdTime = data.createdAt.toMillis();
        } else if (typeof data.createdAt === 'number') {
          createdTime = data.createdAt;
        } else {
          createdTime = Date.now();
        }

        const noticeBody = data.text || data.description || data.message || data.details || 'Click for details';

        fetchedNotices.push({
          id: String(doc.id),
          title: String(data.title || 'Official Update'),
          text: String(noticeBody),
          createdAt: createdTime
        });

        if (createdTime > lastReadTime) {
          count++;
        }
      });
      
      setNotices(fetchedNotices);
      setUnreadCount(count);
    }, (error: any) => {
      console.error("Notice stream error:", error?.message || "Unknown error");
    });

    return () => unsubscribe();
  }, []);

  const handleBellClick = () => {
    setIsDrawerOpen(true);
    localStorage.setItem('lastNoticeReadAt', Date.now().toString());
    setUnreadCount(0);
  };

  const formatTime = (createdAt: number) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40 px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-xl shadow-sm">
            <i className="fas fa-graduation-cap text-xl"></i>
          </div>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Diploma <span className="text-blue-600">Pro</span></h1>
        </div>
        <div className="relative cursor-pointer group" onClick={handleBellClick}>
          <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <i className="fas fa-bell text-2xl text-gray-400 group-hover:text-blue-600 transition-colors"></i>
          </div>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center min-w-[18px] animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </header>

      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[60] transition-opacity animate-fadeIn"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col animate-slideInRight"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
              <h2 className="text-xl font-black">Latest Notices</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="bg-white/10 p-2 rounded-full active:scale-90"><i className="fas fa-times"></i></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {notices.length === 0 ? (
                <div className="text-center py-12 opacity-30">
                  <i className="fas fa-bell-slash text-5xl mb-3"></i>
                  <p className="font-bold">No notifications</p>
                </div>
              ) : (
                notices.map((notice) => (
                  <div key={notice.id} className="bg-white p-5 rounded-[1.8rem] border border-gray-100 shadow-sm animate-fadeIn">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-black text-gray-800 text-sm uppercase tracking-tight pr-4">{notice.title}</h4>
                      <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md">
                        {formatTime(notice.createdAt)}
                      </span>
                    </div>
                    <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50">
                      <p className="text-gray-700 text-xs leading-relaxed font-medium">
                        {notice.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <button onClick={() => setIsDrawerOpen(false)} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-widest shadow-lg shadow-blue-100">Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Header;
