
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import { Department, Semesters } from '../types';

const AdminPage: React.FC = () => {
  const [pin, setPin] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [resTitle, setResTitle] = useState('');
  const [resCategory, setResCategory] = useState<Department>(Department.Computer);
  const [resSemester, setResSemester] = useState<string>(Semesters[0]);
  const [resLink, setResLink] = useState('');
  const [resSubmitting, setResSubmitting] = useState(false);

  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [jobImg, setJobImg] = useState('');
  const [jobSubmitting, setJobSubmitting] = useState(false);

  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeText, setNoticeText] = useState('');
  const [noticeSubmitting, setNoticeSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid PIN. Please try again.');
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle || !resLink) return alert('Please fill all fields');
    setResSubmitting(true);
    try {
      await addDoc(collection(db, 'resources'), {
        title: resTitle.trim(),
        category: resCategory,
        semester: resSemester,
        pdfLink: resLink.trim(),
        createdAt: serverTimestamp()
      });
      alert('Resource added successfully!');
      setResTitle('');
      setResLink('');
    } catch (err: any) {
      console.error("Add Resource Error:", err?.message || "Failed");
      alert('Failed to add resource.');
    } finally {
      setResSubmitting(false);
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDesc) return alert('Please fill title and description');
    setJobSubmitting(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        title: jobTitle.trim(),
        description: jobDesc.trim(),
        link: jobLink.trim() || '',
        imageUrl: jobImg.trim() || '',
        createdAt: serverTimestamp()
      });
      alert('Job update posted successfully!');
      setJobTitle('');
      setJobDesc('');
      setJobLink('');
      setJobImg('');
    } catch (err: any) {
      console.error("Add Job Error:", err?.message || "Failed");
      alert('Failed to post job update');
    } finally {
      setJobSubmitting(false);
    }
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeText) return alert('Please enter both title and message');
    setNoticeSubmitting(true);
    try {
      await addDoc(collection(db, 'notices'), {
        title: noticeTitle.trim(),
        text: noticeText.trim(),
        createdAt: serverTimestamp()
      });

      const noticesRef = collection(db, 'notices');
      const q = query(noticesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      if (snapshot.size > 10) {
        const docsToDelete = snapshot.docs.slice(10);
        const deletePromises = docsToDelete.map(docSnap => deleteDoc(doc(db, 'notices', docSnap.id)));
        await Promise.all(deletePromises);
      }

      alert('Notice sent successfully!');
      setNoticeTitle('');
      setNoticeText('');
    } catch (err: any) {
      console.error("Add Notice Error:", err?.message || "Failed");
      alert('Failed to send notice');
    } finally {
      setNoticeSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-600 text-white p-4 rounded-2xl mb-4 shadow-lg">
              <i className="fas fa-lock text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-gray-500 text-sm">Enter secret PIN to access dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter 4-digit PIN"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest outline-none"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all">Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 py-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-black text-gray-800">Admin Panel</h2>
          <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Session</p>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-bold text-xs uppercase transition-all active:scale-95">Logout</button>
      </div>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-800 mb-6">Post Job Opportunity</h3>
          <form onSubmit={handleAddJob} className="space-y-4">
            <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" placeholder="Job Position" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" rows={3} placeholder="Description..." value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} />
            <input type="url" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" placeholder="Web Link" value={jobLink} onChange={(e) => setJobLink(e.target.value)} />
            <input type="url" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" placeholder="Image URL" value={jobImg} onChange={(e) => setJobImg(e.target.value)} />
            <button type="submit" disabled={jobSubmitting} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl">
              {jobSubmitting ? 'Posting...' : 'Publish Job'}
            </button>
          </form>
        </section>

        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-800 mb-6">Broadcast Notice</h3>
          <form onSubmit={handleAddNotice} className="space-y-4">
            <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" placeholder="Notice Title" value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} />
            <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" placeholder="Message..." rows={2} value={noticeText} onChange={(e) => setNoticeText(e.target.value)} />
            <button type="submit" disabled={noticeSubmitting} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl">
              {noticeSubmitting ? 'Sending...' : 'Send Notice'}
            </button>
          </form>
        </section>

        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-800 mb-6">Post Study Materials</h3>
          <form onSubmit={handleAddResource} className="space-y-4">
            <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" placeholder="Material Name" value={resTitle} onChange={(e) => setResTitle(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <select className="p-4 bg-gray-50 border border-gray-100 rounded-2xl" value={resCategory} onChange={(e) => setResCategory(e.target.value as Department)}>
                {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select className="p-4 bg-gray-50 border border-gray-100 rounded-2xl" value={resSemester} onChange={(e) => setResSemester(e.target.value)}>
                {Semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <input type="url" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" placeholder="Drive Link" value={resLink} onChange={(e) => setResLink(e.target.value)} />
            <button type="submit" disabled={resSubmitting} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl">
              {resSubmitting ? 'Saving...' : 'Publish Resource'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
