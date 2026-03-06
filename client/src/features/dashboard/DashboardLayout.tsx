import React from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Helper to highlight active links
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="bg-white px-8 py-3 border-b flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Grass Logo" className="w-10 h-10 rounded-full border shadow-sm" />
          <div className="leading-tight">
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Member Portal</h1>
            <p className="text-[10px] font-bold text-[#03ac13] uppercase tracking-widest">Grass International</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/dashboard" 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive('/dashboard') ? 'bg-slate-100 text-[#1d3557]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Overview
            </Link>
            <Link 
              to="/dashboard/qualifications" 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive('/dashboard/qualifications') ? 'bg-slate-100 text-[#1d3557]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Qualifications
            </Link>
            <Link 
              to="/dashboard/team" 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive('/dashboard/team') ? 'bg-slate-100 text-[#1d3557]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              My Team
            </Link>
          </nav>
          
          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-600 font-black text-[10px] uppercase transition-colors flex items-center gap-2 border-l pl-6"
          >
            Logout <span>➔</span>
          </button>
        </div>
      </header>

      {/* 2. DYNAMIC CONTENT AREA */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* The <Outlet /> is where the child components 
            (Qualifications, TeamTree, etc.) will be rendered.
        */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="py-8 px-8 border-t bg-white/50 text-center">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Powered by Grass Link System
        </p>
      </footer>
    </div>
  );
};

export default DashboardLayout;