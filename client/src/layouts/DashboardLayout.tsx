import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpeg';

interface LayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlerts, setShowAlerts] = useState(false);

  const colors = { navy: '#1d3557', green: '#03ac13' };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pb-24 md:pb-0">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="w-64 text-white hidden md:flex flex-col shadow-2xl shrink-0 h-screen sticky top-0" style={{ backgroundColor: colors.navy }}>
        <div className="p-8 border-b border-white/10 flex flex-col items-center">
          <div className="bg-white p-1 rounded-full mb-4 shadow-lg">
            <img src={logo} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
          </div>
          <h2 className="text-[10px] font-black tracking-widest leading-tight uppercase text-center">
            Grass <span style={{ color: colors.green }}>International</span>
          </h2>
        </div>

        <nav className="flex-1 p-4 mt-4 space-y-2">
          <button onClick={() => navigate('/dashboard')} className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${location.pathname === '/dashboard' ? 'bg-white/10 border-l-4' : 'opacity-60 hover:bg-white/5'}`} style={{ borderColor: location.pathname === '/dashboard' ? colors.green : 'transparent' }}>Dashboard</button>
          <button onClick={() => navigate('/tree')} className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${location.pathname === '/tree' ? 'bg-white/10 border-l-4' : 'opacity-60 hover:bg-white/5'}`} style={{ borderColor: location.pathname === '/tree' ? colors.green : 'transparent' }}>My Team Tree</button>
          <button onClick={() => navigate('/qualifications')} className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${location.pathname === '/qualifications' ? 'bg-white/10 border-l-4' : 'opacity-60 hover:bg-white/5'}`} style={{ borderColor: location.pathname === '/qualifications' ? colors.green : 'transparent' }}>Qualifications</button>
        </nav>

        {/* Desktop Logout at bottom of sidebar */}
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase text-red-400 hover:bg-red-500/10 transition-all">
            🚪 Logout Session
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 relative">
        {/* Top Header with Notification Only */}
        <div className="fixed top-6 right-6 z-[60] print:hidden">
          <button 
            onClick={() => setShowAlerts(!showAlerts)}
            className="bg-white p-3 rounded-full shadow-lg border border-slate-100 relative hover:scale-105 transition-transform"
          >
            🔔
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {showAlerts && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Notifications</h3>
              <div className="text-[11px] font-bold p-2 bg-slate-50 rounded-lg border-l-4 border-green-500">
                Weekly maintenance PV updated.
              </div>
            </div>
          )}
        </div>

        {children}
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-3 flex justify-between items-center md:hidden z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
        <button onClick={() => navigate('/dashboard')} className={`flex flex-col items-center flex-1 ${location.pathname === '/dashboard' ? 'text-[#03ac13]' : 'text-slate-400'}`}>
          <span className="text-xl">🏠</span>
          <span className="text-[8px] font-black uppercase mt-1">Home</span>
        </button>

        <button onClick={() => navigate('/tree')} className={`flex flex-col items-center flex-1 ${location.pathname === '/tree' ? 'text-[#03ac13]' : 'text-slate-400'}`}>
          <span className="text-xl">🌳</span>
          <span className="text-[8px] font-black uppercase mt-1">Tree</span>
        </button>

        <button onClick={() => navigate('/qualifications')} className={`flex flex-col items-center flex-1 ${location.pathname === '/qualifications' ? 'text-[#03ac13]' : 'text-slate-400'}`}>
          <span className="text-xl">📜</span>
          <span className="text-[8px] font-black uppercase mt-1">Rules</span>
        </button>

        {/* Mobile Logout as the last item */}
        <button onClick={handleLogout} className="flex flex-col items-center flex-1 text-red-400">
          <span className="text-xl">🚪</span>
          <span className="text-[8px] font-black uppercase mt-1">Exit</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardLayout;