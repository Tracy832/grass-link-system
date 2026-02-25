import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlerts, setShowAlerts] = useState(false);

  const colors = { navy: '#1d3557', green: '#03ac13' };

  const notifications = [
    { id: 1, text: "Sarah Wanjiku is 20 PV from Star 3!", type: "goal" },
    { id: 2, text: "New member joined Leg C", type: "info" },
    { id: 3, text: "Mandatory PV due in 4 days", type: "warning" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* NOTIFICATION BELL (Top Right) */}
      <div className="fixed top-6 right-6 z-[60] print:hidden">
        <button 
          onClick={() => setShowAlerts(!showAlerts)}
          className="bg-white p-3 rounded-full shadow-lg border border-slate-100 relative hover:scale-110 transition-transform"
        >
          <span className="text-xl">🔔</span>
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {showAlerts && (
          <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 animate-bounce-in">
            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest text-center">Activity Center</h3>
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className="text-[11px] font-bold p-3 bg-slate-50 rounded-xl border-l-4 shadow-sm" style={{ borderColor: n.type === 'goal' ? colors.green : '#3b82f6' }}>
                  {n.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RENDER THE ACTUAL PAGE CONTENT HERE */}
      <div className="pb-20 md:pb-0">
        {children}
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-8 py-3 flex justify-between items-center md:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button onClick={() => navigate('/dashboard')} className={`flex flex-col items-center ${location.pathname === '/dashboard' ? 'opacity-100' : 'opacity-30'}`}>
          <span className="text-xl">🏠</span>
          <span className="text-[8px] font-black uppercase mt-1" style={{ color: colors.navy }}>Home</span>
        </button>
        <button onClick={() => navigate('/tree')} className={`flex flex-col items-center ${location.pathname === '/tree' ? 'opacity-100' : 'opacity-30'}`}>
          <span className="text-xl">🌳</span>
          <span className="text-[8px] font-black uppercase mt-1" style={{ color: colors.navy }}>Tree</span>
        </button>
        <button onClick={() => navigate('/qualifications')} className={`flex flex-col items-center ${location.pathname === '/qualifications' ? 'opacity-100' : 'opacity-30'}`}>
          <span className="text-xl">📜</span>
          <span className="text-[8px] font-black uppercase mt-1" style={{ color: colors.navy }}>Rules</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardLayout;