import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api';
import { PackageSearch, AlertCircle, X, PlusCircle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  fixed_pv: number;
  pv?: number;
  distributor_price: number;
  non_member_price: number;
  stock_quantity: number;
}

const InventoryTable: React.FC = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- RESTOCK MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [restockAmount, setRestockAmount] = useState('10');

  // FETCH LIVE INVENTORY
  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient('/products/', { method: 'GET' });
      const extractedProducts = Array.isArray(data) ? data : (data.items || data.products || data.data || []);
      setInventory(extractedProducts);
    } catch (err: any) {
      setError("Failed to load inventory from the database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // HANDLE RESTOCK SUBMISSION
  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Calls your PATCH endpoint. Note: FastAPI expects 'quantity' as a query parameter here!
      await apiClient(`/products/${selectedProductId}/restock?quantity=${restockAmount}`, {
        method: 'PATCH',
      });
      
      setIsModalOpen(false);
      setSelectedProductId('');
      setRestockAmount('10');
      fetchInventory(); // Instantly refresh the table to show the new stock!
    } catch (err: any) {
      setError(err.message || "Failed to restock product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in duration-500 relative">
      <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#1d3557] rounded-full"></div>
          <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter">Inventory Ledger</h3>
          <span className="ml-2 px-3 py-1 bg-white rounded-full text-[10px] text-slate-400 border border-slate-200 shadow-sm">
            {isLoading ? '...' : inventory.length} Items
          </span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1d3557] flex items-center gap-2 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg hover:scale-105 transition-all"
        >
          <PlusCircle size={14} /> Receive Shipment (Restock)
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-600">
          <AlertCircle size={16} />
          <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto min-h-[300px]">
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
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Loading physical inventory counts...
                </td>
              </tr>
            )}

            {!isLoading && inventory.map((item) => {
              const pv = item.fixed_pv || item.pv || 0;
              const stock = item.stock_quantity || 0;
              const price = item.distributor_price || 0;
              
              // Smart Low Stock Logic: High PV items (machines) threshold is 2. Supplements threshold is 20.
              const threshold = pv > 100 ? 2 : 20;
              const isLow = stock < threshold;

              return (
                <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${isLow ? 'bg-red-50/20' : ''}`}>
                  <td className="p-8 font-black text-sm text-slate-900 uppercase tracking-tight">{item.name}</td>
                  <td className="p-8 text-center">
                    <span className={`font-mono text-sm font-black px-4 py-2 rounded-xl inline-block ${isLow ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-800'}`}>
                      {stock}
                    </span>
                  </td>
                  <td className="p-8 font-bold text-xs text-slate-600">KES {price.toLocaleString()}</td>
                  <td className="p-8 font-black text-sm text-[#03ac13]">{pv} PV</td>
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

      {/* --- RESTOCK MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter">
                Receive Shipment
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Select Product to Restock</label>
                <select 
                  required 
                  value={selectedProductId} 
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-[#1d3557] transition-all font-bold text-slate-800"
                >
                  <option value="" disabled>-- Select an item --</option>
                  {inventory.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Current: {p.stock_quantity})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Quantity Received</label>
                <input 
                  required 
                  type="number" 
                  min="1" 
                  value={restockAmount} 
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full px-4 py-3 text-lg bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-[#1d3557] transition-all font-black text-[#1d3557]" 
                />
              </div>

              <button type="submit" disabled={isSubmitting || !selectedProductId} className="w-full mt-2 flex items-center justify-center gap-2 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:opacity-90 disabled:opacity-50 transition-all bg-[#1d3557]">
                {isSubmitting ? 'Updating...' : <><PlusCircle size={16} /> Add to Inventory</>}
              </button>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};

export default InventoryTable;