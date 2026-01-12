
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { JobUpdate } from '../types';

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jobsRef = collection(db, 'jobs');
    
    const unsubscribe = onSnapshot(jobsRef, (querySnapshot) => {
      const fetchedJobs: JobUpdate[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        const createdAt = data.createdAt?.toMillis ? data.createdAt.toMillis() : (typeof data.createdAt === 'number' ? data.createdAt : Date.now());
        
        fetchedJobs.push({ 
          id: String(doc.id), 
          title: String(data.title || ''),
          description: String(data.description || ''),
          link: data.link ? String(data.link) : undefined,
          imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
          createdAt: createdAt
        });
      });

      fetchedJobs.sort((a, b) => b.createdAt - a.createdAt);

      setJobs(fetchedJobs);
      setLoading(false);
    }, (error: any) => {
      console.error("Jobs sync error:", error.message || "Unknown error");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openLink = (url?: string) => {
    if (url && url.trim() !== '') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="pb-24 px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Job Board</h2>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Available Opportunities</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-gray-200">
              <i className="fas fa-briefcase text-5xl text-gray-100 mb-4"></i>
              <p className="text-gray-400 font-bold">No jobs posted yet</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden animate-fadeIn flex flex-col">
                {job.imageUrl && (
                  <div 
                    className="relative h-48 w-full overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => openLink(job.link)}
                  >
                    <img 
                      src={job.imageUrl} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                      alt="Circular" 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f1f5f9/64748b?text=Job+Circular'; }}
                    />
                    <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase shadow-lg">Click to View</div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 
                      className="text-lg font-black text-gray-800 leading-tight pr-4 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => openLink(job.link)}
                    >
                      {job.title}
                    </h3>
                    <div className="shrink-0 flex items-center gap-1.5 bg-green-50 text-green-600 text-[10px] px-2.5 py-1 rounded-lg font-black uppercase">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>Active
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 cursor-pointer" onClick={() => openLink(job.link)}>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap italic">{job.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Posted On</span>
                      <span className="text-[10px] text-gray-500 font-bold">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {job.link && (
                      <button 
                        onClick={() => openLink(job.link)}
                        className="bg-blue-600 text-white px-7 py-3 rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-100 active:scale-95 transition-all"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JobsPage;
