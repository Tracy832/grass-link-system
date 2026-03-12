import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api';
import { AlertCircle, PackageSearch, X, Edit2, Plus, Save } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  fixed_pv: number;
  pv?: number;
  distributor_price: number;
  non_member_price: number;
  stock_quantity: number;
}

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    name: '', distributor_price: '', non_member_price: '', fixed_pv: '', stock_quantity: ''
  });

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient('/products/', { method: 'GET' });
      const extractedProducts = Array.isArray(data) ? data : (data.items || data.products || data.data || []);
      setProducts(extractedProducts);
    } catch (err: any) {
      setError("Failed to load the product catalog from the database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- MODAL HANDLERS ---
  const handleAddNewClick = () => {
    setEditingProduct(null); // Null means we are creating a NEW product
    setFormData({ name: '', distributor_price: '', non_member_price: '', fixed_pv: '', stock_quantity: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product); // We are editing an EXISTING product
    setFormData({
      name: product.name,
      distributor_price: product.distributor_price?.toString() || '0',
      non_member_price: product.non_member_price?.toString() || '0',
      fixed_pv: (product.fixed_pv || product.pv || 0).toString(),
      stock_quantity: (product.stock_quantity || 0).toString(),
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      name: formData.name,
      distributor_price: parseFloat(formData.distributor_price),
      non_member_price: parseFloat(formData.non_member_price),
      fixed_pv: parseFloat(formData.fixed_pv),
      stock_quantity: parseInt(formData.stock_quantity, 10)
    };

    try {
      if (editingProduct) {
        // UPDATE EXISTING PRODUCT
        // Note: Make sure your FastAPI backend has a PUT or PATCH endpoint at /products/{id}
        await apiClient(`/products/${editingProduct.id}`, {
          method: 'PUT', // or 'PATCH' depending on your backend
          body: JSON.stringify(payload)
        });
      } else {
        // CREATE NEW PRODUCT
        await apiClient('/products/', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      
      setIsModalOpen(false);
      fetchProducts(); // Refresh the table automatically!
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save product. Check backend endpoints.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in duration-500 relative">
      
      {/* HEADER */}
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter flex items-center gap-2">
            <PackageSearch size={20} className="text-[#03ac13]" /> Product Catalog
            <span className="ml-2 px-3 py-1 bg-white rounded-full text-[10px] text-slate-400 border border-slate-200 shadow-sm">
              {isLoading ? '...' : products.length} Items
            </span>
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Master Inventory & Price List</p>
        </div>
        <button 
          onClick={handleAddNewClick} 
          className="bg-[#03ac13] flex items-center gap-2 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-green-100 hover:scale-105 transition-all"
        >
          <Plus size={14} /> Add New Item
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-600">
          <AlertCircle size={16} />
          <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
              <th className="p-8">Product Name</th>
              <th className="p-8">Member / Non-Member (KES)</th> {/* 👈 Updated Label */}
              <th className="p-8 text-center">PV Value</th>
              <th className="p-8 text-center">Inventory Stock</th>
              <th className="p-8 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Loading inventory from database...
                </td>
              </tr>
            )}

            {!isLoading && products.map((p) => {
              const memPrice = p.distributor_price || 0;
              const nonMemPrice = p.non_member_price || 0;
              const pv = p.fixed_pv || p.pv || 0;
              const stock = p.stock_quantity || 0;

              return (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-8 font-black text-sm text-slate-900 group-hover:text-[#1d3557]">{p.name}</td>
                  <td className="p-8">
                    <div className="flex flex-col gap-1">
                      {/* 👈 Updated Pricing Tags */}
                      <span className="text-[10px] font-black text-[#03ac13] bg-green-50 px-2 py-1 rounded-md w-max">
                        Member: {memPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-md w-max">
                        Non-Member: {nonMemPrice.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-8 text-center font-black text-sm text-[#1d3557]">{pv}</td>
                  <td className="p-8 text-center">
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg ${stock < 10 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                      {stock}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    <button 
                      onClick={() => handleEditClick(p)}
                      className="p-2 text-slate-400 hover:text-[#1d3557] hover:bg-slate-100 rounded-lg transition-all group-hover:rotate-12"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* --- ADD / EDIT MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-[#03ac13] transition-all font-bold text-slate-800" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Member Price (KES)</label>
                  <input required type="number" min="0" value={formData.distributor_price} onChange={e => setFormData({...formData, distributor_price: e.target.value})} className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-[#03ac13] transition-all font-black text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Non-Member Price (KES)</label>
                  <input required type="number" min="0" value={formData.non_member_price} onChange={e => setFormData({...formData, non_member_price: e.target.value})} className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-[#03ac13] transition-all font-black text-slate-800" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">PV Value</label>
                  <input required type="number" min="0" step="0.1" value={formData.fixed_pv} onChange={e => setFormData({...formData, fixed_pv: e.target.value})} className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-blue-500 transition-all font-black text-blue-700" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Stock Quantity</label>
                  <input required type="number" min="0" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-amber-500 transition-all font-black text-amber-600" />
                </div>
              </div>

              <button type="submit" disabled={isSaving} className="w-full mt-6 flex items-center justify-center gap-2 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:opacity-90 disabled:opacity-50 transition-all bg-[#03ac13]">
                {isSaving ? 'Saving...' : <><Save size={16} /> Save Product</>}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProductCatalog;