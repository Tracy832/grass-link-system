import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { Target, Zap, ChevronRight, Users } from 'lucide-react';

const PromotionTracker: React.FC<{ userId?: string | number }> = ({ userId }) => {
  const [promoData, setPromoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPromoStatus = async () => {
      try {
        // 🚨 THE FIX: We fetch the exact live dashboard data to guarantee 100% accuracy
        const data = await apiClient('/distributors/my-dashboard', { method: 'GET' });
        
        // Extract exact live PV
        const currentStarString = data.star_level || "Star 0";
        const match = currentStarString.match(/\d+/);
        const currentStar = match ? parseInt(match[0], 10) : 0;
        const currentPv = data.personal_pv || 0;

        // 🚨 THE OFFICIAL ML-M PERSONAL PV TARGETS
        const PPV_TARGETS: Record<number, number> = {
          0: 1,       // 0 -> Star 1
          1: 200,     // Star 1 -> Star 2
          2: 1000,    // Star 2 -> Star 3
          3: 3800,    // Star 3 -> Star 4
          4: 16000,   // Star 4 -> Star 5
          5: 60000,   // Star 5 -> Star 6
          6: 200000,  // Star 6 -> Star 7
          7: 500000,  // Star 7 -> Star 8
          8: 500000   // Max Rank
        };

        const targetPv = PPV_TARGETS[currentStar] || 500000;
        const nextStar = currentStar < 8 ? currentStar + 1 : 8;
        
        // Calculate exact shortfall
        const shortfall = Math.max(targetPv - currentPv, 0);

        setPromoData({
          current_rank: `Star ${currentStar}`,
          next_rank: `Star ${nextStar}`,
          current_pv: currentPv,
          required_pv: targetPv,
          shortfall: shortfall,
          isMaxRank: currentStar === 8
        });

      } catch (err) {
        console.error("Failed to load promotion status", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromoStatus();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="rounded-3xl p-8 shadow-xl bg-[#1d3557] animate-pulse flex items-center justify-center min-h-[160px]">
        <p className="text-white/50 text-xs font-black uppercase tracking-widest">Analyzing network rank...</p>
      </div>
    );
  }

  if (!promoData) return null;

  const { current_rank, next_rank, current_pv, required_pv, shortfall, isMaxRank } = promoData;
  
  // Calculate percentage for the progress bar (cap at 100%)
  const rawPercentage = (current_pv / required_pv) * 100;
  const percentage = Math.min(Math.max(rawPercentage, 0), 100);

  if (isMaxRank) {
    return (
      <div className="rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-600">
        <div className="relative z-10 text-center">
          <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Maximum Rank Achieved</h3>
          <p className="text-sm font-bold opacity-90">You are a Star 8 Global Leader. Congratulations!</p>
        </div>
      </div>
    );
  }

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
              {current_rank} <ChevronRight size={20} className="text-white/30" /> {next_rank}
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

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 text-amber-400 p-2 rounded-lg shrink-0">
              <Zap size={16} />
            </div>
            <p className="text-xs font-bold leading-relaxed text-white/90">
              Personal Route: Need <span className="text-amber-400 font-black">{shortfall.toLocaleString()} PPV</span> to hit <span className="text-white font-black">{next_rank}</span>.
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 opacity-60 ml-10 md:ml-0">
             <Users size={12} />
             <p className="text-[9px] font-black uppercase tracking-widest">Or rank up via Team GPV</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionTracker;