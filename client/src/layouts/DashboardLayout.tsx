import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlerts, setShowAlerts] = useState(false);

  const colors = { navy: '#1d3557', green: '#03ac13' };

  // Clear session and go to login
  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-0">
      {/* Top Header / Actions */}
      <div className="fixed top-6 right-6 z-[60] flex gap-3 print:hidden">
        {/* Notification Bell */}
        <button 
          onClick={() => setShowAlerts(!showAlerts)}
          className="bg-white p-3 rounded-full shadow-lg border border-slate-100 relative hover:scale-105 transition-transform"
        >
          🔔
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="bg-white px-4 py-2 rounded-full shadow-lg border border-slate-100 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 transition-colors"
        >
          Logout
        </button>

        {showAlerts && (
          <div className="absolute right-0 mt-14 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-[11px] font-bold p-2 bg-slate-50 rounded-lg border-l-4 border-green-500">
                New member joined Leg C
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Dynamic Content Area */}
      <div className="w-full">
        {children}
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      {/* We use fixed paths here that MUST match your App.tsx routes */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center md:hidden z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        
        {/* Home */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className={`flex flex-col items-center transition-all ${location.pathname === '/dashboard' ? 'text-[#03ac13] scale-110' : 'text-slate-400'}`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[8px] font-black uppercase mt-1">Home</span>
        </button>

        {/* Team Tree */}
        <button 
          onClick={() => navigate('/tree')} 
          className={`flex flex-col items-center transition-all ${location.pathname === '/tree' ? 'text-[#03ac13] scale-110' : 'text-slate-400'}`}
        >
          <span className="text-xl">🌳</span>
          <span className="text-[8px] font-black uppercase mt-1">Tree</span>
        </button>

        {/* Qualifications (The page that was redirecting) */}
        <button 
          onClick={() => navigate('/qualifications')} 
          className={`flex flex-col items-center transition-all ${location.pathname === '/qualifications' ? 'text-[#03ac13] scale-110' : 'text-slate-400'}`}
        >
          <span className="text-xl">📜</span>
          <span className="text-[8px] font-black uppercase mt-1">Rules</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardLayout;