import React, { type ReactNode } from 'react';
import bgImage from '../../../assets/suplements.jpeg'; 

// 1. DEFINING THE INTERFACE
interface InventoryAlertsProps {
  lowStockItems: any[]; 
}

const InventoryAlerts: React.FC<InventoryAlertsProps> = ({ lowStockItems }) => {
  // If no items are low, the component stays hidden
  if (!lowStockItems || lowStockItems.length === 0) return null;

  return (
    <section className="p-8 rounded-[2rem] border-2 border-red-100 shadow-sm bg-red-50/30 mb-10 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* 2. BACKGROUND DECORATION */}
      <img 
        src={bgImage} 
        alt="" 
        className="absolute -right-10 -bottom-10 w-64 opacity-[0.05] pointer-events-none grayscale" 
      />
      
      {/* 3. HEADER AREA */}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <span className="text-red-500 text-2xl animate-pulse">⚠️</span>
        <h3 className="text-lg font-black text-red-600 uppercase tracking-tight">
          Critical Low Stock Alert
        </h3>
      </div>
      
      <p className="text-sm font-bold text-slate-500 mb-6 relative z-10">
        The following <span className="text-red-600">{lowStockItems.length} products</span> are below the required safety threshold:
      </p>
      
      {/* 4. ALERT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {lowStockItems.map((p, i) => (
          <div 
            key={i} 
            className="bg-white p-6 rounded-2xl border border-red-50 flex justify-between items-center shadow-sm hover:border-red-200 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-xl text-red-500 font-bold group-hover:scale-110 transition-transform">
                📦
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-tight">{p.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                   Threshold: {p.type === 'machine' ? '< 2 units' : '< 50 units'}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <span className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-md shadow-red-100">
                {p.stock} units
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InventoryAlerts;