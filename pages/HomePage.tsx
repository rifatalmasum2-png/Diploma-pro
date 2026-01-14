
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from '../firebase';
import { JobUpdate, Department, Notice } from '../types';

const HomePage: React.FC = () => {
  const [latestJobs, setLatestJobs] = useState<JobUpdate[]>([]);
  const [latestNotices, setLatestNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const jobsRef = collection(db, 'jobs');
    const noticesRef = collection(db, 'notices');
    
    const unsubscribeJobs = onSnapshot(query(jobsRef, orderBy('createdAt', 'desc'), limit(3)), (snap) => {
      const jobs: JobUpdate[] = [];
      snap.forEach(d => jobs.push({ id: d.id, ...d.data() } as JobUpdate));
      setLatestJobs(jobs);
      setLoading(false);
    });

    const unsubscribeNotices = onSnapshot(query(noticesRef, orderBy('createdAt', 'desc'), limit(4)), (snap) => {
      const notices: Notice[] = [];
      snap.forEach(d => notices.push({ id: d.id, ...d.data() } as Notice));
      setLatestNotices(notices);
    });

    return () => { unsubscribeJobs(); unsubscribeNotices(); };
  }, []);

  const departments = [
    { name: Department.Computer, icon: 'fa-laptop-code', color: 'bg-blue-500' },
    { name: Department.Civil, icon: 'fa-building', color: 'bg-amber-500' },
    { name: Department.Electrical, icon: 'fa-bolt', color: 'bg-yellow-500' },
    { name: Department.Mechanical, icon: 'fa-gears', color: 'bg-red-500' },
  ];

  const QuickCard = ({ title, icon, color, to }: { title: string, icon: string, color: string, to: string }) => (
    <Link to={to} className="bg-white dark:bg-navy-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-3 cursor-pointer hover:shadow-lg transition-all active:scale-95 group shrink-0">
      <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:rotate-12 transition-transform`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <span className="font-bold text-gray-800 dark:text-white text-xs whitespace-nowrap">{title}</span>
    </Link>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <section className="bg-navy-800 p-8 md:p-12 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              ডিপ্লোমা প্রকৌশলীদের <br />
              <span className="text-amber-500">অনন্য ডিজিটাল প্ল্যাটফর্ম</span>
            </h2>
            <div className="relative max-w-md mx-auto md:mx-0">
              <input 
                type="text" 
                placeholder="বিষয় বা নোটিশ খুঁজুন..." 
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-6 text-sm backdrop-blur-md focus:bg-white focus:text-navy-900 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-amber-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/online-education-2868615-2384462.png" className="relative z-10 w-full animate-float" alt="Edu" />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 text-white/5 text-[15rem] font-black pointer-events-none">PRO</div>
      </section>

      {/* Quick Access Grid */}
      <section className="px-6 -mt-8 relative z-20">
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
          <QuickCard title="রিসোর্স লাইব্রেরি" icon="fa-book-open" color="bg-blue-600" to="/resources" />
          <QuickCard title="চাকরির খবর" icon="fa-briefcase" color="bg-green-600" to="/jobs" />
          <QuickCard title="ডিপার্টমেন্টাল" icon="fa-microchip" color="bg-purple-600" to="/resources" />
          <QuickCard title="সাম্প্রতিক নোটিশ" icon="fa-bullhorn" color="bg-red-600" to="/" />
        </div>
      </section>

      <div className="px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        {/* Left: Latest Notices */}
        <div>
          <h3 className="text-lg font-black text-navy-800 dark:text-white mb-5 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
            সাম্প্রতিক নোটিশ
          </h3>
          <div className="space-y-4">
            {loading ? <SkeletonLoader count={3} /> : latestNotices.map(notice => (
              <div key={notice.id} className="bg-white dark:bg-navy-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 flex gap-4 hover:border-amber-500/30 transition-all">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
                  <i className="fas fa-bullhorn text-amber-500"></i>
                </div>
                <div>
                  <h4 className="font-bold text-navy-800 dark:text-white text-sm mb-1">{notice.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{notice.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Job Updates */}
        <div>
          <h3 className="text-lg font-black text-navy-800 dark:text-white mb-5 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            চাকরির খবর
          </h3>
          <div className="space-y-4">
            {loading ? <SkeletonLoader count={2} /> : latestJobs.map(job => (
              <div key={job.id} className="bg-white dark:bg-navy-800 p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4 hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-navy-50 dark:bg-navy-900 rounded-2xl flex items-center justify-center shrink-0">
                  <i className="fas fa-briefcase text-xl text-blue-600"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-navy-800 dark:text-white text-sm line-clamp-1">{job.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">Engineer's Co.</p>
                </div>
                <Link to="/jobs" className="bg-navy-800 dark:bg-amber-500 dark:text-navy-900 text-white p-3 rounded-xl active:scale-90 transition-all">
                  <i className="fas fa-chevron-right text-xs"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Departments Section */}
      <section className="px-6 pb-20">
        <h3 className="text-lg font-black text-navy-800 dark:text-white mb-6">আমাদের ডিপার্টমেন্টসমূহ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {departments.map((dept) => (
            <Link key={dept.name} to={`/department/${dept.name}`} className="bg-white dark:bg-navy-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center gap-4 active:scale-95 transition-all">
              <div className={`${dept.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <i className={`fas ${dept.icon} text-2xl`}></i>
              </div>
              <span className="font-black text-navy-800 dark:text-white text-xs uppercase tracking-tighter">{dept.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const SkeletonLoader = ({ count }: { count: number }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="h-20 bg-gray-200 dark:bg-navy-700 rounded-[2rem] animate-pulse"></div>
    ))}
  </div>
);

export default HomePage;
