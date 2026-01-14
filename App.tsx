
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import ResourcesPage from './pages/ResourcesPage';
import DepartmentPage from './pages/DepartmentPage';
import ResourceListPage from './pages/ResourceListPage';
import AdminPage from './pages/AdminPage'; // Re-importing AdminPage
import { db, requestForToken, onMessageListener } from './firebase';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const setupNotifications = async () => {
      const token = await requestForToken();
      if (token) {
        try {
          await setDoc(doc(db, 'fcm_tokens', token), {
            token: token,
            updatedAt: Date.now()
          });
        } catch (error) {
          console.error("Error saving FCM token:", error);
        }
      }
    };
    setupNotifications();

    onMessageListener().then((payload: any) => {
      if (Notification.permission === 'granted') {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/favicon.ico'
        });
      }
    }).catch(err => console.log('failed: ', err));
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-navy-900 transition-colors duration-300 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col min-h-screen bg-white dark:bg-navy-800 shadow-2xl relative">
          <Header isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
          <main className="flex-1 pb-24 md:pb-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/department/:id" element={<DepartmentPage />} />
              <Route path="/department/:deptId/:semester" element={<ResourceListPage />} />
              
              {/* Secret Admin Route - No link in the UI */}
              <Route path="/admin-private-portal" element={<AdminPage />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <div className="md:hidden">
            <BottomNav />
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
