import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api';
import { PackageOpen, AlertCircle, CheckCircle2, CalendarDays, Receipt, ShieldAlert, FileText } from 'lucide-react';

const CreditManagement: React.FC = () => {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState<'consignment' | 'reconciliation'>('consignment');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true); // <-- ADDED THIS
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const colors = { navy: '#1d3557', green: '#03ac13', orange: '#f59e0b', red: '#dc2626' };

  // --- DYNAMIC PRODUCTS STATE ---
  const [products, setProducts] = useState<any[]>([]);

  // --- CONSIGNMENT STATE ---
  const [consignmentEmail, setConsignmentEmail] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [dueDate, setDueDate] = useState('');

  // --- RECONCILIATION STATE ---
  const [reconEmail, setReconEmail] = useState('');
  const [reconPv, setReconPv] = useState('');
  const [reconReceipt, setReconReceipt] = useState('');
  const [reconMessage, setReconMessage] = useState('');

  // FETCH PRODUCTS ON LOAD
  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetchingProducts(true);
      try {
        const data = await apiClient('/products/', { method: 'GET' });
        
        //  DEVELOPER DEBUG: Check your browser console (F12) to see this!
        console.log("RAW PRODUCT DATA FROM BACKEND:", data);

        const extractedProducts = Array.isArray(data) ? data : (data.items || data.products || data.data || []);
        setProducts(extractedProducts);
      } catch (err) {
        console.error("Failed to load products from database", err);
      } finally {
        setIsFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // --- HANDLERS ---
  const handleIssueConsignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(null); setSuccess(null);
    try {
      await apiClient('/consignments/issue', {
        method: 'POST',
        body: JSON.stringify({
          distributor_email: consignmentEmail, 
          product_id: parseInt(productId),
          quantity: parseInt(quantity),
          due_date: dueDate
        })
      });
      
      const selectedProduct = products.find(p => p.id === parseInt(productId));
      setSuccess(`Success: ${quantity}x ${selectedProduct?.name || 'Product'} issued on credit to ${consignmentEmail}.`);
      setConsignmentEmail(''); setProductId(''); setQuantity('1'); setDueDate('');
    } catch (err: any) {
      setError(err.message || "Failed to issue consignment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconciliation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(null); setSuccess(null);
    try {
      await apiClient('/distributors/admin/reconcile-payment', {
        method: 'POST',
        body: JSON.stringify({
          email: reconEmail, 
          pv_amount: parseFloat(reconPv),
          mpesa_receipt_number: reconReceipt.trim().toUpperCase(),
          payment_message: reconMessage.trim()
        })
      });
      setSuccess(`Reconciliation Success: ${reconPv} PV credited to ${reconEmail}.`);
      setReconEmail(''); setReconPv(''); setReconReceipt(''); setReconMessage('');
    } catch (err: any) {
      setError(err.message || "Reconciliation failed. Check receipt duplicate status.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: colors.navy }}>
            Financial Operations
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Consignment Ledger & Payment Reconciliation
          </p>
        </div>

        {/* SUB-NAVIGATION TOGGLE */}
        <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
          <button 
            onClick={() => { setActiveTab('consignment'); setError(null); setSuccess(null); }}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'consignment' ? 'bg-[#f59e0b] text-white shadow-md' : 'text-slate-400 hover:text-slate-700'}`}
          >
            Product Consignment
          </button>
          <button 
            onClick={() => { setActiveTab('reconciliation'); setError(null); setSuccess(null); }}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'reconciliation' ? 'bg-[#dc2626] text-white shadow-md' : 'text-slate-400 hover:text-slate-700'}`}
          >
            Payment Reconciliation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* DYNAMIC FORM AREA */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3 text-red-700">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3 text-green-700">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{success}</p>
            </div>
          )}

          {/* TAB 1: CONSIGNMENT FORM */}
          {activeTab === 'consignment' && (
            <div className="animate-in fade-in slide-in-from-left-4">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-4 text-[#f59e0b] flex items-center gap-2">
                <PackageOpen size={16} /> Issue Products on Credit
              </h3>
              <form onSubmit={handleIssueConsignment} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Distributor Email</label>
                  <input required type="email" value={consignmentEmail} onChange={(e) => setConsignmentEmail(e.target.value)} placeholder="distributor@example.com" className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-[#f59e0b] transition-all font-bold" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Select Product</label>
                  <select required value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-[#f59e0b] transition-all font-bold text-slate-800">
                    <option value="" disabled>-- Choose a product --</option>
                    
                    {/* SMART LOADING CHECKS */}
                    {isFetchingProducts && <option disabled>Loading products...</option>}
                    {!isFetchingProducts && products.length === 0 && <option disabled>No products in database!</option>}
                    
                    {!isFetchingProducts && products.map(p => {
                      const displayPrice = p.price || p.distributor_price || p.non_member_price || 0;
                      
                      
                      const displayPv = p.fixed_pv || p.pv || 0; 
                      
                      return (
                        <option key={p.id} value={p.id}>
                          {p.name} - KES {displayPrice.toLocaleString()} | {displayPv} PV
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Quantity</label>
                    <input required type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-[#f59e0b] transition-all font-black" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1"><CalendarDays size={12}/> Due Date</label>
                    <input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-[#f59e0b] transition-all font-bold text-slate-600" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full mt-4 flex items-center justify-center gap-2 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: colors.orange }}>
                  {isLoading ? 'Processing...' : <><Receipt size={14} /> Issue Consignment</>}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: RECONCILIATION FORM */}
          {activeTab === 'reconciliation' && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-4 text-red-600 flex items-center gap-2">
                <ShieldAlert size={16} /> M-Pesa Fail Switch
              </h3>
              <form onSubmit={handleReconciliation} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Distributor Email</label>
                    <input required type="email" value={reconEmail} onChange={(e) => setReconEmail(e.target.value)} placeholder="user@email.com" className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-red-500 transition-all font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Missing PV</label>
                    <input required type="number" min="1" step="0.1" value={reconPv} onChange={(e) => setReconPv(e.target.value)} placeholder="150" className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-red-500 transition-all font-black" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">M-Pesa Receipt Number</label>
                  <input required type="text" minLength={8} value={reconReceipt} onChange={(e) => setReconReceipt(e.target.value)} placeholder="QWE123RTY4" className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-red-500 transition-all font-bold uppercase tracking-wider" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1"><FileText size={12}/> Paste Full M-Pesa SMS</label>
                  <textarea required rows={3} value={reconMessage} onChange={(e) => setReconMessage(e.target.value)} placeholder="Paste the exact SMS..." className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-red-500 transition-all font-medium text-slate-600 resize-none leading-relaxed" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full mt-4 flex items-center justify-center gap-2 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: colors.red }}>
                  {isLoading ? 'Verifying...' : 'Reconcile Payment & Mint PV'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* DYNAMIC INFO CARD */}
        <div className="lg:col-span-2 bg-[#1d3557] rounded-3xl p-8 shadow-lg text-white relative overflow-hidden flex flex-col justify-center">
          <div className="absolute right-[-20px] top-[-20px] text-9xl opacity-5 rotate-12 pointer-events-none">
            {activeTab === 'consignment' ? '📦' : '⚠️'}
          </div>
          <div className="relative z-10 animate-in fade-in">
            {activeTab === 'consignment' ? (
              <>
                <h3 className="text-lg font-black mb-3 leading-tight text-[#f59e0b]">Consignment Rules</h3>
                <p className="text-blue-100 text-xs leading-relaxed font-medium mb-4">Products are released from physical inventory and marked as unpaid debt. PV is strictly withheld until the debt is settled.</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-black mb-3 leading-tight text-red-400">Strict Audit Protocol</h3>
                <p className="text-blue-100 text-xs leading-relaxed font-medium mb-4">This logs the M-Pesa receipt directly into the Payment Audit Ledger. Strict deduplication prevents double-crediting.</p>
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest pt-4 border-t border-white/10">Admin ID is permanently attached to this action.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditManagement;