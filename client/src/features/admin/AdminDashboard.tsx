import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';
import bgImage from '../../assets/suplements.jpeg';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [starFilter, setStarFilter] = useState('All');

  const colors = { navy: '#1d3557', green: '#03ac13', red: '#e63946' };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/admin/auth');
  };

  // Mock Data for User Management
  const users = [
    { name: "Tracy Kibue", id: "GI-001-2026", email: "tracy@gmail.com", phone: "0712345678", star: 3, ppv: 1200, gpv: 4295 },
    { name: "Baraka Roney", id: "GI-002-2026", email: "baraka@gmail.com", phone: "0787654321", star: 2, ppv: 850, gpv: 2100 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* 1. TOP MOST HEADER */}
      <header className="bg-white px-8 py-4 border-b flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1d3557] flex items-center justify-center text-white font-black text-xs border-2 border-slate-200">
            SA
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-black text-slate-800 uppercase tracking-tighter">System Admin</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Administrator</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all font-black text-[10px] uppercase"
        >
          Logout <span className="text-lg">➔</span>
        </button>
      </header>

      {/* 2. DASHBOARD TITLE & NAV */}
      <div className="px-8 py-6">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Admin Dashboard</h2>
        
        {/* COMMAND NAVBAR */}
        <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['users', 'products', 'inventory', 'STK push', 'credit'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 
                ${activeTab === tab 
                  ? 'bg-[#1d3557] text-white border-[#1d3557] shadow-lg' 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <main className="flex-1 px-8 pb-10 space-y-8">
        
        {/* 3. DOWNLOAD PDF SECTION (Reporting) */}
        <section className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm relative overflow-hidden">
          {/* Subtle Supplement Background Watermark */}
          <img src={bgImage} alt="" className="absolute right-0 top-0 w-64 opacity-[0.03] pointer-events-none grayscale" />
          
          <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Branch Performance Report</h3>
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase">Shop ID</p>
                  <p className="text-xs font-bold text-slate-800">THIKA-MAIN-01</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase">Total Branch PV</p>
                  <p className="text-xs font-black text-[#03ac13]">12,450 PV</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase">Report Date</p>
                  <p className="text-xs font-bold text-slate-800">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <button className="bg-[#03ac13] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-green-100 flex items-center gap-2">
              📄 Download PDF Report
            </button>
          </div>
        </section>

        {/* 4. USER MANAGEMENT SECTION */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-wrap justify-between items-center gap-4">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-tight">User Management</h3>
              
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Search Name, ID, or Email..."
                  className="px-5 py-2.5 rounded-xl bg-white border-2 border-slate-100 outline-none focus:border-[#03ac13] text-[10px] font-bold w-64"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select 
                  className="px-5 py-2.5 rounded-xl bg-white border-2 border-slate-100 outline-none text-[10px] font-black uppercase text-slate-500"
                  onChange={(e) => setStarFilter(e.target.value)}
                >
                  <option>All Star Levels</option>
                  <option>Star 1</option>
                  <option>Star 2</option>
                  <option>Star 3</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto px-4 pb-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="p-6">Name</th>
                    <th className="p-6">Grass ID</th>
                    <th className="p-6">Email / Tel</th>
                    <th className="p-6">Star Level</th>
                    <th className="p-6">Personal PV</th>
                    <th className="p-6">Group PV</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {users.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                      <td className="p-6 font-black text-sm">{u.name}</td>
                      <td className="p-6 font-mono text-xs text-slate-500">{u.id}</td>
                      <td className="p-6 leading-tight">
                        <p className="text-xs font-bold">{u.email}</p>
                        <p className="text-[9px] text-slate-400 font-bold">{u.phone}</p>
                      </td>
                      <td className="p-6">
                        <span className="bg-[#1d3557] text-white px-3 py-1 rounded-full text-[9px] font-black">Star {u.star}</span>
                      </td>
                      <td className="p-6 font-black text-xs text-slate-800">{u.ppv}</td>
                      <td className="p-6 font-black text-xs text-[#03ac13]">{u.gpv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LOGO FOOTER */}
        <div className="flex flex-col items-center opacity-20 py-10">
          <img src={logo} alt="" className="w-12 h-12 rounded-full grayscale mb-2" />
          <p className="text-[8px] font-black uppercase tracking-[0.4em]">Grass Link Management System</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;