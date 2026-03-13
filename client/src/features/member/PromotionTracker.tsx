import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { Target, Zap, ChevronRight } from 'lucide-react';

const PromotionTracker: React.FC<{ userId?: string | number }> = ({ userId = 2 }) => {
  const [promoData, setPromoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPromoStatus = async () => {
      try {
        const data = await apiClient(`/distributors/${userId}/promotion-status`, { method: 'GET' });
        setPromoData(data);
      } catch (err) {
        console.error("Failed to load promotion status", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchPromoStatus();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="rounded-3xl p-8 shadow-xl bg-[#1d3557] animate-pulse flex items-center justify-center min-h-[160px]">
        <p className="text-white/50 text-xs font-black uppercase tracking-widest">Calculating next rank...</p>
      </div>
    );
  }

  // Fallbacks in case the backend returns empty or null
  if (!promoData) return null;

  // Assuming your backend returns something like: 
  // { current_rank: "1 Star", next_rank: "2 Star", current_pv: 150, required_pv: 500, shortfall: 350 }
  const currentRank = promoData.current_rank || "Current Rank";
  const nextRank = promoData.next_rank || "Next Rank";
  const currentPv = promoData.current_pv || 0;
  const requiredPv = promoData.required_pv || 1; // avoid division by zero
  const shortfall = promoData.shortfall || (requiredPv - currentPv);
  
  // Calculate percentage for the progress bar (cap at 100%)
  const rawPercentage = (currentPv / requiredPv) * 100;
  const percentage = Math.min(Math.max(rawPercentage, 0), 100);

  return (
    <div className="rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden" style={{ backgroundColor: '#1d3557' }}>
      {/* Background flair */}
      <div className="absolute right-[-20px] top-[-20px] text-9xl opacity-5 rotate-12 pointer-events-none">
        🎯
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#03ac13] mb-1 flex items-center gap-1">
              <Target size={12} /> Next Rank Advisor
            </p>
            <h3 className="text-xl md:text-2xl font-black leading-tight flex items-center gap-2">
              {currentRank} <ChevronRight size={20} className="text-white/30" /> {nextRank}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white">{percentage.toFixed(0)}%</p>
            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Completed</p>
          </div>
        </div>

        {/* The Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden border border-white/5">
          <div 
            className="bg-[#03ac13] h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer effect inside the bar */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
          <div className="bg-amber-500/20 text-amber-400 p-2 rounded-lg">
            <Zap size={16} />
          </div>
          <p className="text-xs font-bold leading-relaxed text-white/90">
            You are exactly <span className="text-amber-400 font-black">{shortfall.toLocaleString()} PV</span> away from hitting <span className="text-white font-black">{nextRank}</span>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromotionTracker;