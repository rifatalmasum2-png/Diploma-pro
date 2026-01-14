
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import { JobUpdate } from '../types';

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const fetched: JobUpdate[] = [];
      snap.forEach(d => fetched.push({ id: d.id, ...d.data() } as JobUpdate));
      setJobs(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="pb-24 px-6 py-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black text-navy-800 dark:text-white tracking-tight">জব বোর্ড</h2>
        <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mt-1">ক্যারিয়ার গড়ার সেরা সুযোগ</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-200 dark:bg-navy-700 rounded-[2.5rem] animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-navy-800 rounded-[2.5rem] shadow-xl shadow-gray-200/20 dark:shadow-none border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col group">
              {job.imageUrl && (
                <div className="relative h-44 overflow-hidden bg-navy-50">
                  <img src={job.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Job" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="bg-amber-500 text-navy-900 text-[9px] font-black px-3 py-1 rounded-full uppercase">Update</span>
                  </div>
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-black text-navy-800 dark:text-white leading-tight mb-3 line-clamp-2">{job.title}</h3>
                <div className="bg-slate-50 dark:bg-navy-900 rounded-2xl p-4 mb-6 italic text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {job.description}
                </div>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  <a href={job.link} target="_blank" className="bg-navy-800 dark:bg-amber-500 dark:text-navy-900 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase shadow-lg shadow-navy-100 dark:shadow-none active:scale-95 transition-all">Apply Now</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage;
