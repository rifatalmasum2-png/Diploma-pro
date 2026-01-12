
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { Resource } from '../types';

const ResourceListPage: React.FC = () => {
  const { deptId, semester } = useParams<{ deptId: string; semester: string }>();
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deptId || !semester) return;
    
    setLoading(true);
    const decodedSemester = decodeURIComponent(semester);
    
    const resourcesRef = collection(db, 'resources');
    
    const unsubscribe = onSnapshot(resourcesRef, (querySnapshot) => {
      const fetched: Resource[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as any;
        
        const docDept = data.category || data.department || '';
        const docSem = data.semester || '';

        const isCorrectDept = String(docDept).toLowerCase() === String(deptId).toLowerCase();
        const isCorrectSem = String(docSem).toLowerCase() === String(decodedSemester).toLowerCase();

        if (isCorrectDept && isCorrectSem) {
          fetched.push({ 
            id: String(doc.id), 
            title: String(data.title || 'Untitled Resource'),
            pdfLink: String(data.pdfLink || '#'),
            category: String(data.category || ''),
            semester: String(data.semester || ''),
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (typeof data.createdAt === 'number' ? data.createdAt : Date.now())
          } as Resource);
        }
      });
      
      fetched.sort((a, b) => b.createdAt - a.createdAt);
      
      setResources(fetched);
      setLoading(false);
    }, (error) => {
      console.error("[Firebase Error] Details:", error.message || String(error));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [deptId, semester]);

  return (
    <div className="pb-20">
      <div className="bg-blue-600 text-white px-4 py-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-blue-500 rounded-full transition-colors">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-xl font-bold line-clamp-1">{decodeURIComponent(semester || '')}</h2>
          <p className="text-blue-100 text-xs">{deptId} Department</p>
        </div>
      </div>

      <div className="px-4 py-6">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {resources.length === 0 ? (
              <div className="text-center py-12">
                <i className="far fa-folder-open text-5xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 font-bold text-lg">No links found yet</p>
                <p className="text-sm text-gray-400 mt-2 px-10">
                  Make sure materials are added with correct Department and Semester names in the Admin panel.
                </p>
              </div>
            ) : (
              resources.map((res) => (
                <div key={res.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all animate-fadeIn">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 text-red-600 w-12 h-12 rounded-xl flex items-center justify-center">
                      <i className="far fa-file-pdf text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 line-clamp-1 text-sm sm:text-base">{res.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400 font-medium uppercase">Resource</span>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Synced</span>
                      </div>
                    </div>
                  </div>
                  <a 
                    href={res.pdfLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    View
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceListPage;
