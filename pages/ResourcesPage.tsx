
import React from 'react';
import { Link } from 'react-router-dom';
import { Department } from '../types';

const ResourcesPage: React.FC = () => {
  const departments = [
    { name: Department.Computer, icon: 'fa-laptop-code', color: 'bg-blue-500', desc: 'Programming, Software & Hardware' },
    { name: Department.Civil, icon: 'fa-building', color: 'bg-amber-500', desc: 'Construction, Design & Planning' },
    { name: Department.Electrical, icon: 'fa-bolt', color: 'bg-yellow-500', desc: 'Power, Circuits & Control' },
    { name: Department.Mechanical, icon: 'fa-gears', color: 'bg-red-500', desc: 'Machines, Tools & Manufacturing' },
  ];

  return (
    <div className="px-6 py-8 space-y-8 animate-fadeIn">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-black text-navy-800 dark:text-white tracking-tight">রিসোর্স লাইব্রেরি</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">আপনার ডিপার্টমেন্ট অনুযায়ী প্রয়োজনীয় নোটস এবং বই খুঁজে নিন</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <Link 
            key={dept.name} 
            to={`/department/${dept.name}`} 
            className="bg-white dark:bg-navy-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-6 hover:shadow-xl hover:border-amber-500/20 transition-all active:scale-95 group"
          >
            <div className={`${dept.color} w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform`}>
              <i className={`fas ${dept.icon} text-3xl`}></i>
            </div>
            <div>
              <h3 className="font-black text-navy-800 dark:text-white text-xl uppercase tracking-tighter">{dept.name}</h3>
              <p className="text-xs text-gray-400 mt-1 font-medium">{dept.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
