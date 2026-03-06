import React from 'react';

interface InventoryAlertsProps {
  lowStockItems: any[];
}

const InventoryAlerts: React.FC<InventoryAlertsProps> = ({ lowStockItems }) => {
  if (lowStockItems.length === 0) return null;

  return (
    <div className="p-8 rounded-[2rem] border-2 border-red-100 bg-red-50/20 flex flex-col gap-6 mb-10 shadow-lg shadow-red-50/50">
      <div className="flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <h3 className="text-red-600 font-black uppercase text-sm tracking-widest">
          Critical Stock Alert: {lowStockItems.length} items requiring attention
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lowStockItems.map((item) => (
          <div key={item.name} className="bg-white p-5 rounded-2xl border border-red-100 flex justify-between items-center shadow-sm group hover:border-red-300 transition-all">
            <div className="space-y-1">
              <p className="text-[11px] font-black text-slate-800 uppercase leading-tight">{item.name}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">
                Threshold Alert ({item.type === 'machine' ? '2' : '50'})
              </p>
            </div>
            <span className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black shadow-md">
              {item.stock} LEFT
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryAlerts;