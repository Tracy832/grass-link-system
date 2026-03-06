import React from 'react';

// 1. UPDATE THE INTERFACE to include inventory
interface InventoryTableProps {
  onOpenModal: () => void;
  inventory: any[]; // Add this line to resolve the 'inventory' error
}

const InventoryTable: React.FC<InventoryTableProps> = ({ onOpenModal, inventory }) => {
  
  // 2. Use the passed 'inventory' prop if it has data, otherwise fallback to your list
  // This makes the component flexible!
  const displayData = inventory && inventory.length > 0 ? inventory : [
    { name: "Co-enzyme tablets", stock: 120, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Pure ginseng", stock: 95, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Cordycep tablets", stock: 15, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Licorice", stock: 210, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Glucosamine tablets", stock: 80, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Vitamin E soft gel", stock: 65, dist: 3125, pv: 25, type: 'supplement' },
    { name: "Probiotic tablets", stock: 44, dist: 3750, pv: 30, type: 'supplement' },
    { name: "Broken garnoderma", stock: 30, dist: 5000, pv: 40, type: 'supplement' },
    { name: "Polypeptide tablets", stock: 25, dist: 3750, pv: 30, type: 'supplement' },
    { name: "Milk Mineral tablets", stock: 90, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Chinese wolfberry", stock: 55, dist: 1875, pv: 15, type: 'supplement' },
    { name: "Kuding tea", stock: 100, dist: 1000, pv: 8, type: 'supplement' },
    { name: "Coffee", stock: 85, dist: 1875, pv: 15, type: 'supplement' },
    { name: "Vitamin C tablets", stock: 70, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Toothpaste", stock: 150, dist: 625, pv: 5, type: 'supplement' },
    { name: "Grass soap", stock: 200, dist: 500, pv: 4, type: 'supplement' },
    { name: "Alkaline cup", stock: 60, dist: 6250, pv: 50, type: 'machine' },
    { name: "Omega 3", stock: 40, dist: 3125, pv: 25, type: 'supplement' },
    { name: "Spirulina tablet", stock: 110, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Chitosan tablets", stock: 30, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Collagen tablets", stock: 45, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Prostate relax", stock: 20, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Aloevera tablets", stock: 55, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Soybean", stock: 60, dist: 2500, pv: 20, type: 'supplement' },
    { name: "Alkaline baskets", stock: 15, dist: 625, pv: 5, type: 'machine' },
    { name: "Livercare tea", stock: 35, dist: 1250, pv: 10, type: 'supplement' },
    { name: "Rose tea", stock: 40, dist: 1250, pv: 10, type: 'supplement' },
    { name: "Kelp strings", stock: 90, dist: 500, pv: 4, type: 'supplement' },
    { name: "Green tea", stock: 35, dist: 1250, pv: 10, type: 'supplement' },
    { name: "Purchase oxometer machine", stock: 5, dist: 1250, pv: 10, type: 'machine' },
    { name: "Big reflexology machine", stock: 1, dist: 75000, pv: 600, type: 'machine' },
    { name: "Small reflexology machine", stock: 4, dist: 50000, pv: 400, type: 'machine' },
    { name: "Big massage gun", stock: 3, dist: 10000, pv: 80, type: 'machine' },
    { name: "Small massage gun", stock: 5, dist: 6250, pv: 50, type: 'machine' },
    { name: "Car washing machine", stock: 2, dist: 10000, pv: 80, type: 'machine' },
    { name: "Massage chair", stock: 1, dist: 625000, pv: 5000, type: 'chair' },
  ];

  return (
    <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#1d3557] rounded-full"></div>
          <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter">Inventory Ledger</h3>
        </div>
        <button 
          onClick={onOpenModal}
          className="bg-[#1d3557] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg hover:scale-105 transition-all"
        >
          Update Stock Levels
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
              <th className="p-8">Product Name</th>
              <th className="p-8 text-center">Stock Count</th>
              <th className="p-8">Price (KES)</th>
              <th className="p-8">PV Value</th>
              <th className="p-8 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {displayData.map((item: any, i: number) => { // Changed to displayData
              const isLow = (item.type === 'supplement' && item.stock < 50) || 
                            (item.type === 'machine' && item.stock < 2) ||
                            (item.type === 'chair' && item.stock < 1);

              return (
                <tr key={i} className={`hover:bg-slate-50 transition-colors ${isLow ? 'bg-red-50/30' : ''}`}>
                  <td className="p-8 font-black text-sm text-slate-900 uppercase tracking-tight">{item.name}</td>
                  <td className="p-8 text-center">
                    <span className={`font-mono text-sm font-black px-4 py-2 rounded-xl inline-block ${isLow ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-800'}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="p-8 font-bold text-xs text-slate-600">KES {item.dist.toLocaleString()}</td>
                  <td className="p-8 font-black text-sm text-[#03ac13]">{item.pv} PV</td>
                  <td className="p-8 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {isLow ? 'Low Stock' : 'Optimal'}
                    </span>
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