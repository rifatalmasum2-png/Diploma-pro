
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ to, icon, label }: { to: string, icon: string, label: string }) => (
    <Link to={to} className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${isActive(to) ? 'text-amber-500' : 'text-gray-400'}`}>
      <div className={`p-2 rounded-xl ${isActive(to) ? 'bg-amber-500/10' : ''}`}>
        <i className={`fas ${icon} text-xl`}></i>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </Link>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 flex justify-around items-center py-3 pb-safe z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
      <NavItem to="/" icon="fa-home" label="Home" />
      <NavItem to="/jobs" icon="fa-briefcase" label="Jobs" />
      <NavItem to="/resources" icon="fa-book-open" label="Resources" />
    </nav>
  );
};

export default BottomNav;
