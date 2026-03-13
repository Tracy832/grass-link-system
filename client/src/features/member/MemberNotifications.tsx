import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react';

// 🚨 FIX: Component now accepts userId as a prop
const MemberNotifications: React.FC<{ userId?: string | number }> = ({ userId = 2 }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiClient(`/notifications/${userId}`, { method: 'GET' });
        setNotifications(Array.isArray(data) ? data : (data.items || []));
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      // Optimistic UI update: Mark it read instantly on the frontend
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true, read: true } : n)
      );
      
      // Fire the exact PATCH request from your Swagger docs
      await apiClient(`/notifications/${notificationId}/read`, { method: 'PATCH' });
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read && !n.read).length;

  return (
    <div className="bg-white rounded-4xl p-8 shadow-xl border border-slate-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-500 relative">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Alerts</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">System Notifications</p>
          </div>
        </div>
        <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
          {unreadCount} Unread
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
        {isLoading ? (
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center py-8">Checking messages...</p>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-400 opacity-50 py-10 space-y-3">
            <Bell size={32} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-widest text-center">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notif, i) => {
            const isRead = notif.is_read || notif.read;
            const date = new Date(notif.created_at || notif.date).toLocaleDateString();

            return (
              <div key={notif.id || i} className={`p-4 rounded-2xl border transition-all flex justify-between gap-4 ${isRead ? 'bg-slate-50/50 border-slate-100 opacity-70' : 'bg-blue-50/30 border-blue-100 shadow-sm'}`}>
                <div className="flex gap-3 items-start">
                  <div className={`mt-0.5 shrink-0 ${isRead ? 'text-slate-400' : 'text-blue-500'}`}>
                    {isRead ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  </div>
                  <div>
                    <h4 className={`text-xs font-black uppercase mb-1 ${isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                      {notif.title || 'System Alert'}
                    </h4>
                    <p className={`text-[10px] font-bold leading-relaxed ${isRead ? 'text-slate-400' : 'text-slate-600'}`}>
                      {notif.message || notif.content}
                    </p>
                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-2">
                      {date}
                    </p>
                  </div>
                </div>
                
                {!isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="shrink-0 h-fit text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 bg-blue-100/50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MemberNotifications;