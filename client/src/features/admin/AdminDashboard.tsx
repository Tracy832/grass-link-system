import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';
import bgImage from '../../assets/suplements.jpeg';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  
  // Product State - Pre-loaded with your data
  const [products, setProducts] = useState([
    { name: "Green Tea", pvs: 10, distributor: 1250, nonMember: 3000 },
    { name: "Pure Ginseng", pvs: 20, distributor: 2500, nonMember: 4000 },
    { name: "Massage Chair", pvs: 5000, distributor: 625000, nonMember: 800000 },
  ]);

  const [users] = useState([
    { name: "Tracy Kibue", id: "GI-001", email: "tracy@gmail.com", star: 3, ppv: 1250 },
    { name: "Baraka Roney", id: "GI-002", email: "baraka@gmail.com", star: 2, ppv: 900 },
  ]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/admin/auth');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* HEADER SECTION */}
      <header className="bg-white px-8 py-3 border-b flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#1d3557] flex items-center justify-center text-white font-black text-xs">SA</div>
          <div className="leading-tight">
            <h1 className="text-sm font-black text-slate-900 uppercase">System Admin</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-slate-500 font-black text-[10px] uppercase flex items-center gap-2 hover:text-red-600 transition-colors">
          Logout <span>➔</span>
        </button>
      </header>

      {/* DASHBOARD NAVIGATION */}
      <div className="px-8 pt-8">
        <h2 className="text-3xl font-black text-slate-900 uppercase mb-8 tracking-tight">Admin Dashboard</h2>
        <nav className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {['users', 'products', 'inventory', 'STK push'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all
                ${activeTab === tab ? 'bg-[#1d3557] text-white border-[#1d3557] shadow-lg' : 'bg-white text-slate-400 border-slate-100'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <main className="flex-1 px-8 pb-12 space-y-8">
        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="p-8">Name</th>
                    <th className="p-8">Grass ID</th>
                    <th className="p-8 text-center">Star Level</th>
                    <th className="p-8">Personal PV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50/80">
                      <td className="p-8 font-black text-slate-900">{u.name}</td>
                      <td className="p-8 font-mono text-xs text-slate-500">{u.id}</td>
                      <td className="p-8 text-center">
                        <span className={`w-2.5 h-2.5 inline-block rounded-full mr-2 ${u.star === 3 ? 'bg-[#03ac13]' : 'bg-[#03ac13]'}`}></span>
                        <span className="text-[10px] font-black uppercase text-slate-700">Level {u.star}</span>
                      </td>
                      <td className="p-8 font-black text-sm text-[#03ac13]">{u.ppv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter">Product Price List</h3>
              <button className="bg-[#03ac13] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">+ New Product</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="p-8">Product</th>
                    <th className="p-8 text-center">PV</th>
                    <th className="p-8">Distributor (KES)</th>
                    <th className="p-8">Non-Member (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/80">
                      <td className="p-8 font-black text-slate-800">{p.name}</td>
                      <td className="p-8 text-center font-black text-[#03ac13]">{p.pvs}</td>
                      <td className="p-8 font-bold text-slate-600">{p.distributor.toLocaleString()}</td>
                      <td className="p-8 font-bold text-slate-400">{p.nonMember.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;