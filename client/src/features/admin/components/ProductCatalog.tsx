import React from 'react';

interface ProductCatalogProps {
  onOpenModal: () => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ onOpenModal }) => {
  // The full master list based on your provided data
  const catalogData = [
    { name: "Co-enzyme tablets", pv: 20, dist: 2500, member: 4000, stock: 120 },
    { name: "Pure ginseng", pv: 20, dist: 2500, member: 4000, stock: 95 },
    { name: "Cordycep tablets", pv: 20, dist: 2500, member: 4000, stock: 15 },
    { name: "Licorice", pv: 20, dist: 2500, member: 4000, stock: 210 },
    { name: "Glucosamine tablets", pv: 20, dist: 2500, member: 4000, stock: 80 },
    { name: "Vitamin E soft gel", pv: 25, dist: 3125, member: 4500, stock: 65 },
    { name: "Probiotic tablets", pv: 30, dist: 3750, member: 5000, stock: 44 },
    { name: "Broken garnoderma", pv: 40, dist: 5000, member: 6500, stock: 30 },
    { name: "Polypeptide tablets", pv: 30, dist: 3750, member: 5500, stock: 25 },
    { name: "Milk Mineral tablets", pv: 20, dist: 2500, member: 4000, stock: 90 },
    { name: "Chinese wolfberry", pv: 15, dist: 1875, member: 3500, stock: 55 },
    { name: "Kuding tea", pv: 8, dist: 1000, member: 2500, stock: 100 },
    { name: "Coffee", pv: 15, dist: 1875, member: 3500, stock: 85 },
    { name: "Vitamin C tablets", pv: 20, dist: 2500, member: 4000, stock: 70 },
    { name: "Toothpaste", pv: 5, dist: 625, member: 1200, stock: 150 },
    { name: "Grass soap", pv: 4, dist: 500, member: 1000, stock: 200 },
    { name: "Alkaline cup", pv: 50, dist: 6250, member: 12000, stock: 60 },
    { name: "Omega 3", pv: 25, dist: 3125, member: 4500, stock: 40 },
    { name: "Spirulina tablet", pv: 20, dist: 2500, member: 4000, stock: 110 },
    { name: "Chitosan tablets", pv: 20, dist: 2500, member: 4500, stock: 30 },
    { name: "Collagen tablets", pv: 20, dist: 2500, member: 4500, stock: 45 },
    { name: "Prostate relax", pv: 20, dist: 2500, member: 4500, stock: 20 },
    { name: "Aloevera tablets", pv: 20, dist: 2500, member: 4000, stock: 55 },
    { name: "Soybean", pv: 20, dist: 2500, member: 4500, stock: 60 },
    { name: "Alkaline baskets", pv: 5, dist: 625, member: 1200, stock: 15 },
    { name: "Livercare tea", pv: 10, dist: 1250, member: 3000, stock: 35 },
    { name: "Rose tea", pv: 10, dist: 1250, member: 3000, stock: 40 },
    { name: "Kelp strings", pv: 4, dist: 500, member: 1000, stock: 90 },
    { name: "Green tea", pv: 10, dist: 1250, member: 3000, stock: 35 },
    { name: "Purchase oxometer machine", pv: 10, dist: 1250, member: 3000, stock: 5 },
    { name: "Big reflexology machine", pv: 600, dist: 75000, member: 100000, stock: 1 },
    { name: "Small reflexology machine", pv: 400, dist: 50000, member: 70000, stock: 4 },
    { name: "Big massage gun", pv: 80, dist: 10000, member: 20000, stock: 3 },
    { name: "Small massage gun", pv: 50, dist: 6250, member: 15000, stock: 5 },
    { name: "Car washing machine", pv: 80, dist: 10000, member: 20000, stock: 2 },
    { name: "Massage chair", pv: 5000, dist: 625000, member: 800000, stock: 1 },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter">Product Catalog</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Inventory & Price List</p>
        </div>
        <button 
          onClick={onOpenModal} 
          className="bg-[#03ac13] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-green-100 hover:scale-105 transition-all"
        >
          + Add New Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
              <th className="p-8">Product Name</th>
              <th className="p-8">Distributor / Member (KES)</th>
              <th className="p-8 text-center">PV Value</th>
              <th className="p-8 text-center">Stock</th>
              <th className="p-8 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {catalogData.map((p, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="p-8 font-black text-sm text-slate-900 group-hover:text-[#1d3557]">{p.name}</td>
                <td className="p-8">
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-1 rounded-md">D: {p.dist.toLocaleString()}</span>
                    <span className="text-[10px] font-black text-[#03ac13] bg-green-50 px-2 py-1 rounded-md">M: {p.member.toLocaleString()}</span>
                  </div>
                </td>
                <td className="p-8 text-center font-black text-sm text-[#1d3557]">{p.pv}</td>
                <td className="p-8 text-center">
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg ${p.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-8 text-right">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all group-hover:rotate-12">
                    <span className="text-xl">🖊️</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductCatalog;