import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import { apiClient } from '../services/api';
// 🚨 IMPORTED LUCIDE ICONS
import { Home, Network, ScrollText, Gift, User, LogOut, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlerts, setShowAlerts] = useState(false);
  
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const storedUserId = localStorage.getItem('userId');
  const loggedInUserId = storedUserId ? parseInt(storedUserId, 10) : 2; 

  const colors = { navy: '#1d3557', green: '#03ac13' };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiClient(`/notifications/${loggedInUserId}`, { method: 'GET' });
        setNotifications(Array.isArray(data) ? data : (data.items || []));
      } catch (err) {
        console.error("Layout failed to load notifications", err);
      }
    };
    fetchNotifications();
    
    const intervalId = setInterval(fetchNotifications, 60000);
    return () => clearInterval(intervalId);
  }, [loggedInUserId]);

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.is_read && !n.read).length;

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
          <button 
            onClick={() => navigate('/dashboard')} 
            className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-3 ${location.pathname === '/dashboard' ? 'bg-white/10 border-l-4' : 'opacity-60 hover:bg-white/5 border-l-4 border-transparent'}`}
            style={{ borderColor: location.pathname === '/dashboard' ? colors.green : 'transparent' }}
          >
            <Home size={16} /> Dashboard
          </button>

          <button 
            onClick={() => navigate('/tree')} 
            className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-3 ${location.pathname === '/tree' ? 'bg-white/10 border-l-4' : 'opacity-60 hover:bg-white/5 border-l-4 border-transparent'}`}
            style={{ borderColor: location.pathname === '/tree' ? colors.green : 'transparent' }}
          >
            <Network size={16} /> My Team Tree
          </button>

          <button 
            onClick={() => navigate('/qualifications')} 
            className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-3 ${location.pathname === '/qualifications' ? 'bg-white/10 border-l-4' : 'opacity-60 hover:bg-white/5 border-l-4 border-transparent'}`}
            style={{ borderColor: location.pathname === '/qualifications' ? colors.green : 'transparent' }}
          >
            <ScrollText size={16} /> Qualifications
          </button>

          <button 
            onClick={() => navigate('/promotions')} 
            className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-3 ${location.pathname === '/promotions' ? 'bg-white/10 border-l-4' : 'opacity-60 hover:bg-white/5 border-l-4 border-transparent'}`}
            style={{ borderColor: location.pathname === '/promotions' ? colors.green : 'transparent' }}
          >
            <Gift size={16} /> Rewards & Promos
          </button>

          <button 
            onClick={() => navigate('/profile')} 
            className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-3 ${location.pathname === '/profile' ? 'bg-white/10 border-l-4' : 'opacity-60 hover:bg-white/5 border-l-4 border-transparent'}`}
            style={{ borderColor: location.pathname === '/profile' ? colors.green : 'transparent' }}
          >
            <User size={16} /> My Profile
          </button>
        </nav>

        {/* SIDEBAR LOGOUT (Desktop) */}
        <div className="p-4 border-t border-white/10 mt-auto">
          <button 
            onClick={handleLogout} 
            className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3"
          >
            <LogOut size={16} /> Logout Session
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 relative">
        {/* TOP RIGHT NOTIFICATION BELL */}
        <div className="fixed top-6 right-6 z-[60] print:hidden">
          <button 
            onClick={() => setShowAlerts(!showAlerts)}
            className="bg-white p-3 rounded-full shadow-lg border border-slate-100 relative hover:scale-105 transition-transform text-[#1d3557]"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {showAlerts && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recent Activity</h3>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{unreadCount} Unread</span>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <p className="text-[10px] font-bold text-center text-slate-400 py-4 uppercase tracking-widest">No alerts yet!</p>
                ) : (
                  notifications.slice(0, 3).map((notif, i) => {
                    const isRead = notif.is_read || notif.read;
                    return (
                      <div key={notif.id || i} className={`text-[10px] font-bold p-3 rounded-xl border-l-4 ${isRead ? 'bg-slate-50 border-slate-300 text-slate-500' : 'bg-blue-50 border-blue-500 text-slate-800'}`}>
                        <p className="uppercase tracking-widest text-[9px] mb-1 opacity-60">{notif.title || 'System Alert'}</p>
                        {notif.message || notif.content}
                      </div>
                    );
                  })
                )}
              </div>
              
              {notifications.length > 3 && (
                <button 
                  onClick={() => { setShowAlerts(false); navigate('/dashboard'); }} 
                  className="w-full mt-3 text-center text-[9px] font-black uppercase text-blue-500 hover:text-blue-600 transition-colors"
                >
                  View All Alerts on Dashboard
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dynamic content renders here */}
        {children}
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-1 py-3 flex justify-between items-center md:hidden z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.08)] overflow-x-auto scrollbar-hide">
        <button onClick={() => navigate('/dashboard')} className={`flex flex-col items-center min-w-[64px] flex-1 transition-all ${location.pathname === '/dashboard' ? 'text-[#03ac13] scale-110' : 'text-slate-400'}`}>
          <Home size={22} className="mb-1" />
          <span className="text-[8px] font-black uppercase">Home</span>
        </button>

        <button onClick={() => navigate('/tree')} className={`flex flex-col items-center min-w-[64px] flex-1 transition-all ${location.pathname === '/tree' ? 'text-[#03ac13] scale-110' : 'text-slate-400'}`}>
          <Network size={22} className="mb-1" />
          <span className="text-[8px] font-black uppercase">Tree</span>
        </button>

        <button onClick={() => navigate('/qualifications')} className={`flex flex-col items-center min-w-[64px] flex-1 transition-all ${location.pathname === '/qualifications' ? 'text-[#03ac13] scale-110' : 'text-slate-400'}`}>
          <ScrollText size={22} className="mb-1" />
          <span className="text-[8px] font-black uppercase">Rules</span>
        </button>

        <button onClick={() => navigate('/promotions')} className={`flex flex-col items-center min-w-[64px] flex-1 transition-all ${location.pathname === '/promotions' ? 'text-[#03ac13] scale-110' : 'text-slate-400'}`}>
          <Gift size={22} className="mb-1" />
          <span className="text-[8px] font-black uppercase">Promos</span>
        </button>

        <button onClick={() => navigate('/profile')} className={`flex flex-col items-center min-w-[64px] flex-1 transition-all ${location.pathname === '/profile' ? 'text-[#03ac13] scale-110' : 'text-slate-400'}`}>
          <User size={22} className="mb-1" />
          <span className="text-[8px] font-black uppercase">Profile</span>
        </button>

        <button onClick={handleLogout} className="flex flex-col items-center min-w-[64px] flex-1 text-red-400 active:scale-95">
          <LogOut size={22} className="mb-1" />
          <span className="text-[8px] font-black uppercase">Exit</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardLayout;