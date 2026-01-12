
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-3 pb-safe z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      <Link to="/" className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`}>
        <i className="fas fa-home text-2xl"></i>
        <span className="text-[10px] font-bold uppercase tracking-wide">Home</span>
      </Link>
      <Link to="/jobs" className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${isActive('/jobs') ? 'text-blue-600' : 'text-gray-400'}`}>
        <i className="fas fa-briefcase text-2xl"></i>
        <span className="text-[10px] font-bold uppercase tracking-wide">Jobs</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
