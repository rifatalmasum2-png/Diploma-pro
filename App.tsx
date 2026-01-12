import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import AdminPage from './pages/AdminPage';
import DepartmentPage from './pages/DepartmentPage';
import ResourceListPage from './pages/ResourceListPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="max-w-md mx-auto min-h-screen relative flex flex-col shadow-2xl bg-white">
        <Header />
        <main className="flex-1 bg-slate-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/department/:id" element={<DepartmentPage />} />
            <Route path="/department/:deptId/:semester" element={<ResourceListPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
};

export default App;