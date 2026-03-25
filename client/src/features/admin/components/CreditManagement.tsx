import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../../services/api';
import { PackageOpen, AlertCircle, CheckCircle2, CalendarDays, Receipt, ShieldAlert, FileText, Search, Clock, CheckCircle, X, Smartphone } from 'lucide-react';

const CreditManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consignment' | 'reconciliation' | 'ledger'>('consignment');
  const [isLoading, setIsLoading] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isLoadingLedger, setIsLoadingLedger] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const colors = { navy: '#1d3557', green: '#03ac13', orange: '#f59e0b', red: '#dc2626', blue: '#3b82f6' };

  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [consignments, setConsignments] = useState<any[]>([]);

  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [dueDate, setDueDate] = useState('');

  const [reconPv, setReconPv] = useState('');
  const [reconReceipt, setReconReceipt] = useState('');
  const [reconMessage, setReconMessage] = useState('');

  // 🚨 SETTLEMENT MODAL STATE (NOW WITH M-PESA FIELDS)
  const [settleModal, setSettleModal] = useState<{isOpen: boolean, consignment: any | null}>({isOpen: false, consignment: null});
  const [qtySold, setQtySold] = useState<number>(0);
  const [qtyReturned, setQtyReturned] = useState<number>(0);
  const [settlePhone, setSettlePhone] = useState<string>('');
  const [settleReceipt, setSettleReceipt] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsFetchingData(true);
      try {
        const [productsData, usersData] = await Promise.all([
          apiClient('/products/', { method: 'GET' }),
          apiClient('/distributors/', { method: 'GET' })
        ]);
        setProducts(Array.isArray(productsData) ? productsData : (productsData.items || productsData.data || []));
        setUsers(Array.isArray(usersData) ? usersData : (usersData.items || []));
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchData();
  }, []);

  const fetchUserConsignments = async () => {
    if (!selectedUser) return;
    setIsLoadingLedger(true);
    const targetId = selectedUser.company_id || selectedUser.id; 
    try {
      const data = await apiClient(`/consignments/distributor/${targetId}`, { method: 'GET' });
      setConsignments(Array.isArray(data) ? data : (data.items || data.data || []));
    } catch (err: any) {
      setConsignments([]);
    } finally {
      setIsLoadingLedger(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ledger' && selectedUser) {
      fetchUserConsignments();
    }
  }, [activeTab, selectedUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMemberDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = users.filter(u => {
    const q = memberSearchTerm.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.company_id?.toLowerCase().includes(q) ||
      u.id?.toString().includes(q) 
    );
  });

  const handleIssueConsignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return setError("Please select a target member from the search bar.");
    
    setIsLoading(true); setError(null); setSuccess(null);
    const targetCompanyId = selectedUser.company_id || String(selectedUser.id).padStart(7, '0');
    
    try {
      await apiClient('/consignments/issue', {
        method: 'POST',
        body: JSON.stringify({
          company_id: targetCompanyId, 
          product_id: parseInt(productId),
          quantity: parseInt(quantity),
          days_to_pay: 30 
        })
      });
      
      const selectedProduct = products.find(p => p.id === parseInt(productId));
      setSuccess(`Success: ${quantity}x ${selectedProduct?.name || 'Product'} issued to ${selectedUser.full_name}.`);
      setProductId(''); setQuantity('1'); setDueDate('');
    } catch (err: any) {
      setError(err.message || "Failed to issue consignment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconciliation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return setError("Please select a target member from the search bar.");

    setIsLoading(true); setError(null); setSuccess(null);
    try {
      await apiClient('/distributors/admin/reconcile-payment', {
        method: 'POST',
        body: JSON.stringify({
          email: selectedUser.email, 
          pv_amount: parseFloat(reconPv),
          mpesa_receipt_number: reconReceipt.trim().toUpperCase(),
          payment_message: reconMessage.trim()
        })
      });
      setSuccess(`Success: ${reconPv} PV instantly minted and credited to ${selectedUser.full_name}.`);
      setReconPv(''); setReconReceipt(''); setReconMessage('');
    } catch (err: any) {
      setError(err.message || "Reconciliation failed. Receipt might be duplicated.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🚨 NEW: TRIGGERS THE M-PESA PROMPT DIRECTLY FROM THE MODAL
  const handleSendStkPrompt = async () => {
    if (!settleModal.consignment || !settlePhone) return;
    setIsPushing(true);
    try {
      await apiClient(`/consignments/${settleModal.consignment.id}/stk-push`, {
        method: 'POST',
        body: JSON.stringify({
          quantity_sold: qtySold,
          phone_number: settlePhone
        })
      });
      alert(`STK Push successfully sent to ${settlePhone}! Once the customer enters their PIN, the PV will mint automatically.`);
    } catch (err: any) {
      alert(err.message || "Failed to send M-Pesa prompt.");
    } finally {
      setIsPushing(false);
    }
  };

  // 🚨 UPDATED: SUBMITS SETTLEMENT & OPTIONALLY REQUIRES RECEIPT FOR AUDIT
  const handleSettleSubmit = async () => {
    const c = settleModal.consignment;
    if (!c) return;

    const totalTaken = c.quantity_taken || 1;
    if (qtySold + qtyReturned !== totalTaken) {
      alert(`Math Error: Sold (${qtySold}) + Returned (${qtyReturned}) must equal Total Taken (${totalTaken}).`);
      return;
    }

    setIsLoading(true);
    try {
      await apiClient(`/consignments/${c.id}/settle`, {
        method: 'POST',
        body: JSON.stringify({
          quantity_sold: qtySold,
          quantity_returned: qtyReturned,
          mpesa_receipt_number: qtySold > 0 ? settleReceipt.trim().toUpperCase() : null
        })
      });
      
      setSettleModal({isOpen: false, consignment: null});
      setSuccess(`Consignment #${c.id} successfully settled! PV minted and inventory updated.`);
      fetchUserConsignments(); 
    } catch (err: any) {
      alert(err.message || "Failed to settle consignment. If manual, ensure the receipt code is valid.");
    } finally {
      setIsLoading(false);
    }
  };

  // Live Math Calculations for the Modal
  const activeProduct = products.find(p => p.id === settleModal.consignment?.product_id);
  const livePvEarned = qtySold * (activeProduct?.fixed_pv || activeProduct?.pv || 0);
  const liveCashOwed = qtySold * (activeProduct?.distributor_price || activeProduct?.price || 0);

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto relative">
      
      {/* 🚨 THE UPGRADED SETTLEMENT MODAL WITH M-PESA */}
      {settleModal.isOpen && settleModal.consignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#1d3557] uppercase tracking-tight">Settle & Mint PV</h3>
              <button onClick={() => setSettleModal({isOpen: false, consignment: null})} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Items Taken</p>
                <p className="text-2xl font-black text-slate-800">{settleModal.consignment.quantity_taken}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#03ac13]">Live PV Calculation</p>
                <p className="text-2xl font-black text-[#03ac13]">+{livePvEarned} PV</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 pl-1">Quantity Sold</label>
                <input 
                  type="number" min="0" max={settleModal.consignment.quantity_taken} 
                  value={qtySold} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setQtySold(val);
                    setQtyReturned(Math.max(0, settleModal.consignment.quantity_taken - val));
                  }}
                  className="w-full bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center text-xl font-black text-blue-700 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 pl-1">Returned (Restock)</label>
                <input 
                  type="number" min="0" max={settleModal.consignment.quantity_taken} 
                  value={qtyReturned} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setQtyReturned(val);
                    setQtySold(Math.max(0, settleModal.consignment.quantity_taken - val));
                  }}
                  className="w-full bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center text-xl font-black text-amber-700 outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* 🚨 STK PUSH & PAYMENT SECTION */}
            {qtySold > 0 && (
              <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 mb-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Cash Owed</span>
                  <span className="text-lg font-black text-slate-900">KES {liveCashOwed.toLocaleString()}</span>
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="tel" 
                    placeholder="2547..." 
                    value={settlePhone}
                    onChange={(e) => setSettlePhone(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:border-green-500 font-bold"
                  />
                  <button 
                    onClick={handleSendStkPrompt}
                    disabled={isPushing || !settlePhone || liveCashOwed <= 0}
                    className="px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 whitespace-nowrap flex items-center gap-1"
                  >
                    <Smartphone size={14}/> Ping Phone
                  </button>
                </div>

                <div className="pt-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-red-500 pl-1">Manual Audit Verification (Optional if Ping Works)</label>
                  <input 
                    type="text" 
                    placeholder="Enter M-Pesa Receipt Code (e.g. QWE123RTY4)" 
                    value={settleReceipt}
                    onChange={(e) => setSettleReceipt(e.target.value)}
                    className="w-full px-4 py-3 mt-1 text-sm bg-white border border-red-100 rounded-xl outline-none focus:ring-2 focus:border-red-500 font-bold uppercase tracking-wider"
                  />
                </div>
              </div>
            )}

            <button 
              onClick={handleSettleSubmit}
              disabled={isLoading || (qtySold + qtyReturned !== settleModal.consignment.quantity_taken)}
              className="w-full bg-[#1d3557] hover:bg-blue-900 text-white font-black text-xs uppercase tracking-widest py-5 rounded-xl transition-all disabled:opacity-50 mt-4"
            >
              {isLoading ? 'Processing...' : 'Manual Verify & Close Ledger'}
            </button>
          </div>
        </div>
      )}

      {/* --- STANDARD PAGE CONTENT CONTINUES BELOW --- */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: colors.navy }}>
            Financial Operations
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Consignment Ledger & Payment Reconciliation
          </p>
        </div>

        <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => { setActiveTab('consignment'); setError(null); setSuccess(null); }}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap rounded-lg transition-all ${activeTab === 'consignment' ? 'bg-[#f59e0b] text-white shadow-md' : 'text-slate-400 hover:text-slate-700'}`}
          >
            Issue Consignment
          </button>
          <button 
            onClick={() => { setActiveTab('reconciliation'); setError(null); setSuccess(null); }}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap rounded-lg transition-all ${activeTab === 'reconciliation' ? 'bg-[#dc2626] text-white shadow-md' : 'text-slate-400 hover:text-slate-700'}`}
          >
            M-Pesa Reconciliation
          </button>
          <button 
            onClick={() => { setActiveTab('ledger'); setError(null); setSuccess(null); }}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap rounded-lg transition-all ${activeTab === 'ledger' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-slate-400 hover:text-slate-700'}`}
          >
            Account Ledger
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        <div className="lg:col-span-3 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[500px] flex flex-col">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3 text-red-700 shrink-0">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3 text-green-700 shrink-0">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{success}</p>
            </div>
          )}

          <div className="mb-8 shrink-0">
            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Member Account</label>
              <div className="relative">
                <input 
                  type="text"
                  value={memberSearchTerm}
                  onChange={(e) => {
                    setMemberSearchTerm(e.target.value);
                    setShowMemberDropdown(true);
                    setSelectedUser(null);
                  }}
                  onFocus={() => setShowMemberDropdown(true)}
                  placeholder={isFetchingData ? "Loading database..." : "Search Name, Email, or 7-Digit ID..."}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border outline-none text-sm font-bold text-slate-700 transition-all ${selectedUser ? 'border-[#03ac13] ring-1 ring-[#03ac13]/20 bg-green-50/30' : 'border-slate-200 focus:border-[#1d3557] focus:ring-2'}`}
                />
                {selectedUser ? (
                  <CheckCircle2 size={16} className="absolute left-4 top-4 text-[#03ac13]" />
                ) : (
                  <Search size={16} className="absolute left-4 top-4 text-slate-400" />
                )}
              </div>

              {showMemberDropdown && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="p-4 text-xs font-bold text-slate-400 text-center uppercase tracking-widest">No members found</div>
                  ) : (
                    filteredUsers.map(u => (
                      <div 
                        key={u.id}
                        onClick={() => {
                          setSelectedUser(u);
                          setMemberSearchTerm(`${u.full_name} (GI-${u.company_id || u.id}) - ${u.email}`);
                          setShowMemberDropdown(false);
                        }}
                        className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <p className="text-sm font-black text-slate-800 uppercase">{u.full_name}</p>
                        <p className="text-[10px] font-bold text-[#1d3557] tracking-widest">GI-{u.company_id || u.id}-2026 • {u.email}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {activeTab === 'consignment' && (
            <div className="animate-in fade-in slide-in-from-left-4 flex-1">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-4 text-[#f59e0b] flex items-center gap-2">
                <PackageOpen size={16} /> Issue Products on Credit
              </h3>
              <form onSubmit={handleIssueConsignment} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Select Product</label>
                  <select required value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full px-4 py-4 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-[#f59e0b] transition-all font-bold text-slate-800">
                    <option value="" disabled>-- Choose a product --</option>
                    {isFetchingData && <option disabled>Loading products...</option>}
                    {!isFetchingData && products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - KES {(p.price || p.distributor_price || p.non_member_price || 0).toLocaleString()} | {p.fixed_pv || p.pv || 0} PV</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Quantity</label>
                    <input required type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-4 py-4 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-[#f59e0b] transition-all font-black" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1"><CalendarDays size={12}/> Due Date</label>
                    <input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-4 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-[#f59e0b] transition-all font-bold text-slate-600" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading || !selectedUser} className="w-full mt-4 flex items-center justify-center gap-2 text-white py-5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:opacity-90 disabled:opacity-50 transition-all" style={{ backgroundColor: colors.orange }}>
                  {isLoading ? 'Processing...' : <><Receipt size={16} /> Issue Consignment</>}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'reconciliation' && (
            <div className="animate-in fade-in slide-in-from-right-4 flex-1">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-4 text-red-600 flex items-center gap-2">
                <ShieldAlert size={16} /> M-Pesa Fail Switch
              </h3>
              <form onSubmit={handleReconciliation} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Missing PV</label>
                    <input required type="number" min="1" step="0.1" value={reconPv} onChange={(e) => setReconPv(e.target.value)} placeholder="e.g. 150" className="w-full px-4 py-4 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-red-500 transition-all font-black" />
                  </div>
                  <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">M-Pesa Receipt Code</label>
                    <input required type="text" minLength={8} value={reconReceipt} onChange={(e) => setReconReceipt(e.target.value)} placeholder="QWE123RTY4" className="w-full px-4 py-4 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-red-500 transition-all font-bold uppercase tracking-wider" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1"><FileText size={12}/> Paste Full M-Pesa SMS</label>
                  <textarea required rows={4} value={reconMessage} onChange={(e) => setReconMessage(e.target.value)} placeholder="Paste the exact SMS..." className="w-full px-4 py-4 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-red-500 transition-all font-medium text-slate-600 resize-none leading-relaxed" />
                </div>
                <button type="submit" disabled={isLoading || !selectedUser} className="w-full mt-4 flex items-center justify-center gap-2 text-white py-5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:opacity-90 disabled:opacity-50 transition-all" style={{ backgroundColor: colors.red }}>
                  {isLoading ? 'Verifying...' : 'Reconcile Payment & Mint PV'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="animate-in fade-in zoom-in-95 flex-1 flex flex-col h-full">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-4 text-blue-500 flex items-center gap-2 shrink-0">
                <FileText size={16} /> Physical Consignment Ledger
              </h3>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 max-h-[400px]">
                {!selectedUser ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-4 py-12">
                    <Search size={48} strokeWidth={1} />
                    <p className="text-xs font-black uppercase tracking-widest">Select a member above</p>
                  </div>
                ) : isLoadingLedger ? (
                  <div className="h-full flex flex-col items-center justify-center text-blue-500 space-y-4 py-12">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                ) : consignments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-4 py-12">
                    <FileText size={48} strokeWidth={1} />
                    <p className="text-xs font-black uppercase tracking-widest text-center">No active or past consignments<br/>for this member.</p>
                  </div>
                ) : (
                  consignments.map((c, i) => {
                    const isSettled = c.status?.toUpperCase() === 'SETTLED';
                    const amount = c.amount || c.total_value || c.total_price || 0;
                    const displayDate = c.created_at || c.issue_date || c.issued_at ? new Date(c.created_at || c.issue_date || c.issued_at).toLocaleDateString() : 'Unknown';

                    return (
                      <div key={c.id || i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className={`p-3 rounded-xl ${isSettled ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                            {isSettled ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 uppercase">Consignment #{c.id}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                              Issued: {displayDate} | Qty: {c.quantity_taken}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                          <div className="text-left sm:text-right">
                            <p className="text-sm font-black text-slate-900">KES {amount.toLocaleString()}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${isSettled ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {isSettled ? 'Settled' : 'Pending'}
                            </span>
                          </div>
                          
                          {/* 🚨 OPENS THE MODAL AND PRE-FILLS PHONE */}
                          {!isSettled && (
                            <button 
                              onClick={() => {
                                setSettleModal({ isOpen: true, consignment: c });
                                setQtySold(c.quantity_taken || 1); 
                                setQtyReturned(0);
                                setSettlePhone(selectedUser?.phone || ''); // Pre-fills the user's phone!
                                setSettleReceipt('');
                              }}
                              className="px-4 py-2 bg-[#1d3557] hover:bg-blue-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-md"
                            >
                              Settle
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* DYNAMIC INFO CARD */}
        <div className={`lg:col-span-2 rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden flex flex-col justify-center transition-colors duration-500 ${
          activeTab === 'consignment' ? 'bg-[#f59e0b]' : 
          activeTab === 'reconciliation' ? 'bg-[#dc2626]' : 
          'bg-[#3b82f6]'
        }`}>
          <div className="absolute right-[-20px] top-[-20px] text-9xl opacity-10 rotate-12 pointer-events-none">
            {activeTab === 'consignment' ? '📦' : activeTab === 'reconciliation' ? '⚠️' : '📖'}
          </div>
          <div className="relative z-10 animate-in fade-in zoom-in-95">
            {activeTab === 'consignment' && (
              <>
                <h3 className="text-2xl font-black mb-3 leading-tight tracking-tighter">Consignment Rules</h3>
                <p className="text-white/90 text-sm leading-relaxed font-bold mb-4">Products are released from physical inventory and marked as unpaid debt on the member's ledger. <br/><br/>PV is strictly withheld by the system until the debt is officially settled.</p>
              </>
            )}
            {activeTab === 'reconciliation' && (
              <>
                <h3 className="text-2xl font-black mb-3 leading-tight tracking-tighter">Strict Audit Protocol</h3>
                <p className="text-white/90 text-sm leading-relaxed font-bold mb-4">This logs the M-Pesa receipt directly into the Payment Audit Ledger. <br/><br/>Strict database deduplication prevents double-crediting of PVs. Use only for failed STK pushes.</p>
                <p className="text-white bg-black/20 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest mt-6">Admin ID permanently logged.</p>
              </>
            )}
            {activeTab === 'ledger' && (
              <>
                <h3 className="text-2xl font-black mb-3 leading-tight tracking-tighter">Account Ledger</h3>
                <p className="text-white/90 text-sm leading-relaxed font-bold mb-4">When a distributor brings back payment or unsold goods, use the 'Settle' button. <br/><br/>The system will ping their phone for payment. Enter the receipt code to instantly mint the PV for sold units and restock returns.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditManagement;