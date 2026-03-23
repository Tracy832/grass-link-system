import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api';
import { Megaphone, Send, CheckCircle2, AlertCircle, Loader2, Package } from 'lucide-react';

const AdminPromotions: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [promoType, setPromoType] = useState('BOGO');
  const [productId, setProductId] = useState(''); // 🚨 NEW: Holds the selected product
  const [expiry, setExpiry] = useState('');
  
  const [products, setProducts] = useState<any[]>([]); // 🚨 NEW: Stores products from DB
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [isPushing, setIsPushing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 🚨 NEW: Fetch products when the component loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient('/products/', { method: 'GET' });
        setProducts(Array.isArray(data) ? data : (data.items || []));
      } catch (err) {
        console.error("Failed to load products for promotions", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPushing(true); setError(null); setSuccess(null);

    try {
      const payload = {
        title,
        description,
        promo_type: promoType,
        product_id: productId ? parseInt(productId) : null, // 🚨 NEW: Sends the Product ID
        expires_at: expiry ? new Date(expiry).toISOString() : null
      };

      await apiClient(`/promotions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      setSuccess(`Promotion "${title}" created! Notifications blasted to all members.`);
      
      // Reset form
      setTitle(''); setDescription(''); setPromoType('BOGO'); setExpiry(''); setProductId('');
    } catch (err: any) {
      setError(err.message || "Failed to create promotion.");
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500 space-y-8">
      <section className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-50 rounded-2xl text-orange-500 font-bold">
            <Megaphone size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Blast New Promotion</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Send instant push to all members</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-xl flex items-start gap-3 text-green-700">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{success}</p>
          </div>
        )}

        <form onSubmit={handleCreatePromo} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-[#1d3557] tracking-widest pl-1">Promo Catchy Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Flash Sale: Buy 1 Get 1 Free!" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-orange-400 outline-none text-sm font-black text-slate-800 transition-all" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-[#1d3557] tracking-widest pl-1">Full Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Details about the promotion..." className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-orange-400 outline-none text-sm font-bold text-slate-700 transition-all" />
          </div>

          {/* 🚨 NEW: PRODUCT SELECTOR GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-black uppercase text-[#1d3557] tracking-widest pl-1">Target Product (Optional)</label>
              <select 
                value={productId} 
                onChange={e => setProductId(e.target.value)} 
                className="w-full p-4 pl-10 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-orange-400 outline-none text-sm font-bold text-slate-700 transition-all appearance-none"
              >
                <option value="">-- Apply to All / No Specific Product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <Package size={16} className="absolute left-4 top-[2.2rem] text-slate-400 pointer-events-none" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[#1d3557] tracking-widest pl-1">Promo Type</label>
              <select value={promoType} onChange={e => setPromoType(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-orange-400 outline-none text-sm font-bold text-slate-700 transition-all">
                <option value="BOGO">Buy 1 Get 1 (BOGO)</option>
                <option value="DISCOUNT">Discounted Price</option>
                <option value="DOUBLE_PV">Double PV</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-[#1d3557] tracking-widest pl-1">Expiry Date (Optional)</label>
            <input type="datetime-local" value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-orange-400 outline-none text-sm font-bold text-slate-700 transition-all" />
          </div>

          <button disabled={isPushing || isLoadingProducts} type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] transition-all shadow-lg shadow-orange-500/30 flex justify-center items-center gap-2 disabled:opacity-50">
            {isPushing ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Broadcast Promotion</>}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminPromotions;