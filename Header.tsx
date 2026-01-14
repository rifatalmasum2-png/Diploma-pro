
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from '../firebase';
import { Notice } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const location = useLocation();

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
        let createdTime = data.createdAt?.toMillis ? data.createdAt.toMillis() : (typeof data.createdAt === 'number' ? data.createdAt : Date.now());
        
        fetchedNotices.push({
          id: String(doc.id),
          title: String(data.title || 'Update'),
          text: String(data.text || ''),
          createdAt: createdTime
        });

        if (createdTime > lastReadTime) count++;
      });
      
      setNotices(fetchedNotices);
      setUnreadCount(count);
    });

    return () => unsubscribe();
  }, []);

  const handleBellClick = () => {
    setIsDrawerOpen(true);
    localStorage.setItem('lastNoticeReadAt', Date.now().toString());
    setUnreadCount(0);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Notices', path: '#', onClick: handleBellClick },
    { name: 'Jobs', path: '/jobs' },
  ];

  return (
    <>
      <header className="bg-navy-800 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-amber-500 text-navy-900 p-2 rounded-xl">
            <i className="fas fa-graduation-cap text-xl"></i>
          </div>
          <h1 className="text-xl font-black tracking-tighter">Diploma-<span className="text-amber-500">Pro</span></h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.path !== '#' ? (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-sm font-bold uppercase tracking-widest hover:text-amber-500 transition-colors ${location.pathname === link.path ? 'text-amber-500 border-b-2 border-amber-500 pb-1' : (location.pathname.startsWith(link.path) && link.path !== '/' ? 'text-amber-500 border-b-2 border-amber-500 pb-1' : 'text-gray-300')}`}
              >
                {link.name}
              </Link>
            ) : (
              <button key={link.name} onClick={link.onClick} className="text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-amber-500 transition-colors">
                {link.name}
              </button>
            )
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
          </button>
          
          <div className="relative cursor-pointer" onClick={handleBellClick}>
            <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <i className="fas fa-bell text-xl text-gray-300"></i>
            </div>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-amber-500 text-navy-900 text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-navy-800">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/10 flex items-center justify-center overflow-hidden">
            <i className="fas fa-user text-sm"></i>
          </div>
        </div>
      </header>

      {/* Notice Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setIsDrawerOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-md bg-white dark:bg-navy-800 shadow-2xl flex flex-col animate-slideLeft" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-navy-800 text-white flex justify-between items-center">
              <h2 className="text-xl font-black">Latest Notices</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="bg-white/10 p-2 rounded-full"><i className="fas fa-times"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-navy-900">
              {notices.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <i className="fas fa-bell-slash text-4xl mb-4"></i>
                  <p className="font-bold">No notifications yet</p>
                </div>
              ) : notices.map((notice) => (
                <div key={notice.id} className="bg-white dark:bg-navy-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
                  <h4 className="font-black text-navy-800 dark:text-white text-sm mb-2">{notice.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{notice.text}</p>
                  <span className="text-[9px] text-gray-400 font-bold block mt-3">{new Date(notice.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideLeft { animation: slideLeft 0.3s ease-out; }
      `}</style>
    </>
  );
};

export default Header;
