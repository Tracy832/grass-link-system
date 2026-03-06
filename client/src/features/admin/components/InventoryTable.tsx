import React from 'react';

interface InventoryTableProps {
  inventory: any[];
  onOpenModal: () => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory, onOpenModal }) => {
  return (
    <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Table Header/Controls */}
      <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-wrap justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#1d3557] rounded-full"></div>
          <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter">Inventory Ledger</h3>
        </div>
        
        <button 
          onClick={onOpenModal} 
          className="bg-[#03ac13] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-green-100 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          + Register Stock
        </button>
      </div>

      {/* Master Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
              <th className="p-8">Product Name</th>
              <th className="p-8 text-center">Stock Count</th>
              <th className="p-8">Price (KES)</th>
              <th className="p-8">PV Value</th>
              <th className="p-8 text-center">Status</th>
              <th className="p-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inventory.map((item, i) => {
              // Apply your specific threshold rules
              const isLow = (item.type === 'supplement' && item.stock < 50) || 
                            (item.type === 'machine' && item.stock < 2) ||
                            (item.type === 'chair' && item.stock < 1);

              return (
                <tr key={i} className={`hover:bg-slate-50/80 transition-colors ${isLow ? 'bg-red-50/20' : ''}`}>
                  <td className="p-8 font-black text-sm text-slate-900">{item.name}</td>
                  <td className="p-8 text-center">
                    <span className={`font-mono text-sm font-black p-3 rounded-xl ${isLow ? 'text-red-600 bg-red-50' : 'text-slate-900 bg-slate-100'}`}>
                      {item.stock.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-8 font-bold text-xs text-slate-600">{item.distributor.toLocaleString()}</td>
                  <td className="p-8 font-black text-sm text-[#03ac13]">{item.pvs}</td>
                  <td className="p-8 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {isLow ? 'Low Stock' : 'Optimal'}
                    </span>
                  </td>
                  <td className="p-8 text-right space-x-2">
                    <button className="text-[10px] font-black uppercase text-[#1d3557] hover:underline">
                      🖊️ Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default InventoryTable;