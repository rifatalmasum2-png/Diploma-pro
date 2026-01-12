
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { JobUpdate, Department } from '../types';

const HomePage: React.FC = () => {
  const [latestJobs, setLatestJobs] = useState<JobUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  const departments = [
    { name: Department.Computer, icon: 'fa-laptop-code', color: 'bg-blue-50 text-blue-600' },
    { name: Department.Civil, icon: 'fa-building', color: 'bg-orange-50 text-orange-600' },
    { name: Department.Electrical, icon: 'fa-bolt', color: 'bg-yellow-50 text-yellow-600' },
    { name: Department.Mechanical, icon: 'fa-gears', color: 'bg-red-50 text-red-600' },
  ];

  useEffect(() => {
    const jobsRef = collection(db, 'jobs');
    
    const unsubscribe = onSnapshot(jobsRef, (querySnapshot) => {
      const allJobs: JobUpdate[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        let createdTime: number;
        if (data.createdAt && typeof data.createdAt.toMillis === 'function') {
          createdTime = data.createdAt.toMillis();
        } else if (typeof data.createdAt === 'number') {
          createdTime = data.createdAt;
        } else {
          createdTime = Date.now();
        }

        allJobs.push({ 
          id: String(doc.id), 
          title: String(data.title || 'Untitled Job'),
          description: String(data.description || ''),
          link: data.link ? String(data.link) : undefined,
          imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
          createdAt: createdTime
        });
      });

      allJobs.sort((a, b) => b.createdAt - a.createdAt);

      setLatestJobs(allJobs.slice(0, 3));
      setLoading(false);
    }, (error: any) => {
      console.error("Home sync error:", error?.message || "Unknown error");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleJobClick = (link?: string) => {
    if (link && link.trim() !== '') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="pb-24">
      <section className="px-4 py-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-1 tracking-tight">Diploma Pro</h2>
            <p className="opacity-70 text-xs font-medium uppercase tracking-widest">Future Engineers Hub</p>
          </div>
          <i className="fas fa-graduation-cap absolute -bottom-6 -right-6 text-white opacity-10 text-9xl transform -rotate-12"></i>
        </div>

        <h3 className="text-lg font-black text-gray-800 mb-5 flex items-center gap-2 px-1">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          Departments
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-10">
          {departments.map((dept) => (
            <Link 
              key={dept.name} 
              to={`/department/${dept.name}`}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center gap-4 active:scale-95 transition-all hover:shadow-xl hover:shadow-gray-100 group"
            >
              <div className={`${dept.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                <i className={`fas ${dept.icon} text-2xl`}></i>
              </div>
              <span className="font-black text-gray-700 text-sm uppercase tracking-tighter">{dept.name}</span>
            </Link>
          ))}
        </div>

        <div className="flex justify-between items-end mb-5 px-1">
          <div>
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
              Job Updates
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase ml-3.5">Recently Published</p>
          </div>
          <Link to="/jobs" className="text-blue-600 text-[10px] font-black bg-blue-50 px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm">View All</Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {latestJobs.length === 0 ? (
              <div className="bg-white p-8 rounded-[2rem] border border-dashed border-gray-200 text-center">
                <p className="text-gray-400 text-sm font-bold italic">No recent job updates.</p>
              </div>
            ) : (
              latestJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleJobClick(job.link)}
                >
                  {job.imageUrl ? (
                    <img 
                      src={job.imageUrl} 
                      className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shrink-0 shadow-sm" 
                      alt="Job" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f1f5f9/64748b?text=Job';
                      }}
                    />
                  ) : (
                    <div className="bg-green-100 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                      <i className="fas fa-briefcase text-xl"></i>
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-black text-gray-800 mb-0.5 line-clamp-1 text-xs uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 line-clamp-2 mb-2 leading-relaxed italic">{job.description}</p>
                    <div className="text-[10px] text-blue-600 font-black uppercase tracking-widest flex items-center gap-1">
                      View Details <i className="fas fa-chevron-right text-[8px]"></i>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
