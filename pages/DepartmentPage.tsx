
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Semesters } from '../types';

const DepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="pb-20">
      <div className="bg-blue-600 text-white px-4 py-6 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-blue-500 rounded-full transition-colors">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-xl font-bold">{id} Department</h2>
          <p className="text-blue-100 text-xs">Select your semester</p>
        </div>
      </div>

      <div className="px-4 py-6">
        <h3 className="text-gray-800 font-bold mb-4">Choose Semester</h3>
        <div className="grid grid-cols-2 gap-4">
          {Semesters.map((semester) => (
            <Link
              key={semester}
              to={`/department/${id}/${encodeURIComponent(semester)}`}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-3 active:scale-95 transition-all hover:border-blue-200"
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {semester.split(' ')[0]}
              </div>
              <span className="text-sm font-semibold text-gray-700">{semester}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage;
