import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { Flame, Gift, Coins, Tag, Clock, Loader2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout'; // 🚨 NEW: Imported your Sidebar Layout

interface Promo {
  id: number;
  title: string;
  description: string;
  promo_type: string;
  expires_at: string | null;
}

const PromotionsCenter: React.FC = () => {
  const [todaysPV, setTodaysPV] = useState(0);
  const [promotions, setPromotions] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const pvGoal = 100;
  
  // 🚨 FIXED: Now dynamically grabs the actual logged-in user's ID!
  const storedUserId = localStorage.getItem('userId');
  const currentMemberId = storedUserId ? parseInt(storedUserId, 10) : 1; 

  useEffect(() => {
    const fetchPromosAndStatus = async () => {
      try {
        const [statusData, promoData] = await Promise.all([
          apiClient(`/promotions/daily-status/${currentMemberId}`, { method: 'GET' }),
          apiClient('/promotions/', { method: 'GET' })
        ]);
        
        setTodaysPV(statusData.pv_today || 0);
        setPromotions(promoData || []);
      } catch (error) {
        console.error("Failed to load promotions", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromosAndStatus();
  }, [currentMemberId]);

  const progressPercentage = Math.min((todaysPV / pvGoal) * 100, 100);

  // 🚨 NEW: Filter out any promotions that are past their expiry date
  const now = new Date();
  const activePromotions = promotions.filter(promo => {
    if (!promo.expires_at) return true; // Keep it if it has no expiry date
    return new Date(promo.expires_at) > now; // Only keep if expiry is in the future
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-orange-500" size={40} /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white shadow-lg shadow-orange-500/30">
            <Flame size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Rewards & Promos</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Maximize your daily earnings</p>
          </div>
        </div>

        {/* DAILY 1000 KES HUSTLE TRACKER */}
        <div className="bg-[#1d3557] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Coins size={150} />
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Daily Cash Bonus</h3>
                <p className="text-xs font-bold text-blue-300 mt-1">Hit 100 PV in a single day to earn instant cash.</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-4xl font-black text-green-400">1,000 KES</p>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Manual Physical Payout</p>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="bg-black/40 rounded-full h-8 w-full p-1.5 mb-3 relative overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3 shadow-lg shadow-green-500/50"
                style={{ width: `${Math.max(progressPercentage, 5)}%` }} // Minimum 5% just so the bubble is visible
              >
                 <span className="text-[10px] font-black text-green-900">{todaysPV} PV</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-blue-200 px-2">
              <span>0 PV</span>
              <span>{todaysPV >= pvGoal ? 'GOAL MET!' : `${pvGoal - todaysPV} PV to go!`}</span>
              <span>100 PV</span>
            </div>
          </div>
        </div>

        {/* DYNAMIC PROMOTIONS GRID */}
        <div className="pt-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Tag size={16} /> Active Special Offers
          </h3>
          
          {/* 🚨 FIXED: Now maps over the filtered activePromotions array */}
          {activePromotions.length === 0 ? (
            <div className="text-center p-10 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active promotions right now. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activePromotions.map((promo) => (
                <div key={promo.id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
                  
                  {promo.expires_at && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-bl-2xl z-10 flex items-center gap-1">
                      <Clock size={12} /> Ends {new Date(promo.expires_at).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div className="flex items-start gap-5 mt-2">
                    <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl group-hover:scale-110 transition-transform">
                      <Gift size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{promo.title}</h4>
                      <p className="text-xs font-bold text-slate-500 mt-2 leading-relaxed">{promo.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default PromotionsCenter;