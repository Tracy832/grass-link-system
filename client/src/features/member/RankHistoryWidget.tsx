import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { Award, TrendingUp, Calendar } from 'lucide-react';


const RankHistoryWidget: React.FC<{ userId?: string | number }> = ({ userId = 2 }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiClient(`/history/${userId}`, { method: 'GET' });
        setHistory(Array.isArray(data) ? data : (data.items || []));
      } catch (err) {
        console.error("Failed to load rank history", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchHistory();
    }
  }, [userId]); // React re-fetches if the userId changes!

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 h-full">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
        <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
          <TrendingUp size={20} />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Rank Progression</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Your Growth Timeline</p>
        </div>
      </div>

      <div className="relative pl-4 border-l-2 border-slate-100 space-y-8 mt-4">
        {isLoading ? (
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No rank advancements yet. Keep pushing!</p>
        ) : (
          history.map((record, i) => {
            const date = new Date(record.created_at || record.date).toLocaleDateString();
            return (
              <div key={record.id || i} className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full bg-amber-500 border-4 border-white shadow-sm" />
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-amber-200 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-sm font-black text-slate-800 uppercase flex items-center gap-2">
                        <Award size={14} className="text-amber-500" /> 
                        Advanced to {record.new_rank || record.rank_name}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-500 mt-1 leading-relaxed">
                        {record.description || 'Congratulations on reaching a new milestone in the network!'}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1 justify-end">
                        <Calendar size={10} /> {date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RankHistoryWidget;