import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../../services/api';
import { Smartphone, CheckCircle2, AlertCircle, Loader2, Search, UserCheck, Users, Tag, Gift, Hash } from 'lucide-react';

const StkPush: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]); 
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [buyerType, setBuyerType] = useState<'member' | 'walk-in'>('member');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState<number>(1); 
  
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [showMemberDropdown, setShowMemberDropdown] = useState(false); 
  const [selectedUserObj, setSelectedUserObj] = useState<any>(null);
  const memberDropdownRef = useRef<HTMLDivElement>(null);

  const [referrerSearchTerm, setReferrerSearchTerm] = useState('');
  const [showReferrerDropdown, setShowReferrerDropdown] = useState(false);
  const [selectedReferrerObj, setSelectedReferrerObj] = useState<any>(null);
  const referrerDropdownRef = useRef<HTMLDivElement>(null);
  
  const [isPushing, setIsPushing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [usersData, productsData, txData] = await Promise.all([
        apiClient('/distributors/', { method: 'GET' }),
        apiClient('/products/', { method: 'GET' }),
        apiClient('/payments/history', { method: 'GET' }).catch(() => []) 
      ]);
      setUsers(Array.isArray(usersData) ? usersData : (usersData.items || []));
      setProducts(Array.isArray(productsData) ? productsData : (productsData.items || []));
      setTransactions(Array.isArray(txData) ? txData : (txData.items || txData.data || []));
    } catch (err: any) {
      console.error("Failed to load data for STK Push", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target as Node)) {
        setShowMemberDropdown(false);
      }
      if (referrerDropdownRef.current && !referrerDropdownRef.current.contains(event.target as Node)) {
        setShowReferrerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterUsers = (term: string) => {
    const q = term.toLowerCase();
    return users.filter(u => 
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.company_id?.toLowerCase().includes(q) ||
      u.id?.toString().includes(q)
    );
  };

  useEffect(() => {
    if (selectedProductId) {
      const selectedProd = products.find(p => p.id.toString() === selectedProductId);
      if (selectedProd) {
        const basePrice = buyerType === 'member' 
          ? (selectedProd.distributor_price || selectedProd.price || 0)
          : (selectedProd.non_member_price || selectedProd.distributor_price || selectedProd.price || 0);
        
        setAmount((basePrice * quantity).toString()); 
      }
    } else {
      setAmount('');
    }
  }, [buyerType, selectedProductId, products, quantity]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
  };

  const activeProduct = products.find(p => p.id.toString() === selectedProductId);
  const minPriceAllowed = activeProduct ? (activeProduct.distributor_price || activeProduct.price || 0) * quantity : 0;
  const isPriceTooLow = buyerType === 'walk-in' && activeProduct && parseFloat(amount) < minPriceAllowed;
  const livePV = activeProduct ? (activeProduct.fixed_pv || activeProduct.pv || 0) * quantity : 0; 

  let pvRecipient = 'Pending Details...';
  if (activeProduct) {
    if (buyerType === 'member' && selectedUserObj) pvRecipient = selectedUserObj.full_name;
    else if (buyerType === 'walk-in') {
      pvRecipient = selectedReferrerObj ? `${selectedReferrerObj.full_name} (Referrer)` : 'Company (No PV Assigned)';
    }
  }

  const handleSendStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPushing(true); setError(null); setSuccess(null);

    if (!phoneNumber.startsWith('254') || phoneNumber.length !== 12) {
      setError("Phone number must be in the format 2547XXXXXXXX");
      setIsPushing(false); return;
    }

    if (buyerType === 'member' && !selectedUserId) {
      setError("You must select a target member from the dropdown.");
      setIsPushing(false); return;
    }

    if (!selectedProductId || quantity < 1) {
      setError("You must select a product and a valid quantity.");
      setIsPushing(false); return;
    }

    if (isPriceTooLow) {
      setError(`Retail price cannot be lower than the wholesale price (KES ${minPriceAllowed.toLocaleString()}).`);
      setIsPushing(false); return;
    }

    try {
      // 🚨 FIX: Constructing exact URL parameters to match your live Python backend
      const queryParams = new URLSearchParams();
      queryParams.append('phone_number', phoneNumber);
      queryParams.append('amount', amount);
      queryParams.append('quantity', quantity.toString());

      if (buyerType === 'member') {
        queryParams.append('distributor_id', selectedUserId);
      } else if (buyerType === 'walk-in') {
        queryParams.append('is_walk_in', 'true');
        if (selectedReferrerObj) {
          queryParams.append('distributor_id', selectedReferrerObj.id.toString()); 
        }
      }

      // 🚨 FIX: Sending data strictly via URL, NOT JSON Body
      await apiClient(`/payments/stk-push-v2/${selectedProductId}?${queryParams.toString()}`, {
        method: 'POST'
      });
      
      setSuccess(`STK Push successfully sent to ${phoneNumber} for ${quantity}x item(s) totaling KES ${amount}!`);
      
      setPhoneNumber(''); setAmount(''); setSelectedProductId(''); setQuantity(1);
      setSelectedUserId(''); setMemberSearchTerm(''); setSelectedUserObj(null);
      setReferrerSearchTerm(''); setSelectedReferrerObj(null);
      fetchData(); 
    } catch (err: any) {
      // Graceful error display
      if (Array.isArray(err.message)) {
        const errorStrings = err.message.map((m: any) => `${m.loc[1]}: ${m.msg}`);
        setError(`Validation Error: ${errorStrings.join(' | ')}`);
      } else {
        setError(err.message || "Failed to initiate STK Push.");
      }
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        <section className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 h-fit">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-green-50 rounded-2xl text-[#03ac13] font-bold">
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">M-Pesa STK Push</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct to Customer Phone</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button 
              type="button"
              onClick={() => { setBuyerType('member'); setError(null); setSuccess(null); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all ${buyerType === 'member' ? 'bg-white text-[#1d3557] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <UserCheck size={16} /> Registered Member
            </button>
            <button 
              type="button"
              onClick={() => { setBuyerType('walk-in'); setError(null); setSuccess(null); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all ${buyerType === 'walk-in' ? 'bg-[#f59e0b] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Users size={16} /> Walk-in Customer
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3 text-red-700 animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3 text-green-700 animate-in slide-in-from-top-2">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{success}</p>
            </div>
          )}

          <form onSubmit={handleSendStkPush} className="space-y-6">
            
            {buyerType === 'member' ? (
              <div className="space-y-1.5 relative" ref={memberDropdownRef}>
                <label className="text-[10px] font-black uppercase text-[#1d3557] tracking-widest pl-1">Target Member Account</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={memberSearchTerm}
                    onChange={(e) => {
                      setMemberSearchTerm(e.target.value);
                      setShowMemberDropdown(true);
                      setSelectedUserId('');
                      setSelectedUserObj(null);
                    }}
                    onFocus={() => setShowMemberDropdown(true)}
                    placeholder={isLoadingData ? "Loading members..." : "Search Name, Email, or 7-Digit ID..."}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border focus:ring-2 outline-none text-sm font-bold text-slate-700 transition-all ${selectedUserId ? 'border-[#03ac13] ring-1 ring-[#03ac13]/20 bg-green-50/30' : 'border-slate-200 focus:border-[#1d3557]'}`}
                  />
                  {selectedUserId ? <CheckCircle2 size={16} className="absolute left-4 top-4 text-[#03ac13]" /> : <Search size={16} className="absolute left-4 top-4 text-slate-400" />}
                </div>

                {showMemberDropdown && (
                  <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    {filterUsers(memberSearchTerm).map(u => (
                      <div 
                        key={u.id}
                        onClick={() => {
                          setSelectedUserId(u.id.toString());
                          setSelectedUserObj(u);
                          setMemberSearchTerm(`${u.full_name} (GI-${u.company_id || u.id}-2026)`);
                          setShowMemberDropdown(false);
                        }}
                        className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                      >
                        <p className="text-sm font-black text-slate-800 uppercase">{u.full_name}</p>
                        <p className="text-[10px] font-bold text-[#03ac13] tracking-widest">GI-{u.company_id || u.id}-2026 • {u.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1.5 relative animate-in fade-in slide-in-from-right-4" ref={referrerDropdownRef}>
                <label className="text-[10px] font-black uppercase text-[#f59e0b] tracking-widest pl-1">Referring Member (Optional - Earns PV)</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={referrerSearchTerm}
                    onChange={(e) => {
                      setReferrerSearchTerm(e.target.value);
                      setShowReferrerDropdown(true);
                      setSelectedReferrerObj(null);
                    }}
                    onFocus={() => setShowReferrerDropdown(true)}
                    placeholder="Search Referrer Name or ID (Leave blank if none)..."
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-amber-50/30 border focus:ring-2 outline-none text-sm font-bold text-slate-700 transition-all ${selectedReferrerObj ? 'border-[#f59e0b] ring-1 ring-[#f59e0b]/20' : 'border-amber-200 focus:border-[#f59e0b]'}`}
                  />
                  {selectedReferrerObj ? <Gift size={16} className="absolute left-4 top-4 text-[#f59e0b]" /> : <Search size={16} className="absolute left-4 top-4 text-amber-400" />}
                </div>

                {showReferrerDropdown && (
                  <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    {filterUsers(referrerSearchTerm).map(u => (
                      <div 
                        key={u.id}
                        onClick={() => {
                          setSelectedReferrerObj(u);
                          setReferrerSearchTerm(`${u.full_name} (GI-${u.company_id || u.id}-2026)`);
                          setShowReferrerDropdown(false);
                        }}
                        className="p-4 hover:bg-amber-50 cursor-pointer border-b border-slate-50 last:border-0"
                      >
                        <p className="text-sm font-black text-slate-800 uppercase">{u.full_name}</p>
                        <p className="text-[10px] font-bold text-[#f59e0b] tracking-widest">GI-{u.company_id || u.id}-2026 • {u.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Customer's M-Pesa Phone</label>
              <input 
                required 
                type="tel" 
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="254700000000" 
                maxLength={12}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#03ac13] outline-none text-sm font-black text-slate-800 tracking-wider transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Quantity</label>
                <div className="relative">
                  <input 
                    required 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full p-4 pl-10 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#03ac13] outline-none text-sm font-black text-slate-800 transition-all text-center"
                  />
                  <Hash size={16} className="absolute left-3 top-4 text-slate-400" />
                </div>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Select Product</label>
                <select required value={selectedProductId} onChange={handleProductChange} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#03ac13] outline-none text-sm font-bold text-slate-700 transition-all">
                  <option value="" disabled>-- Choose a Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - KES {p.distributor_price?.toLocaleString()} | {p.fixed_pv || p.pv} PV</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest pl-1 flex justify-between items-center text-slate-400">
                <span>Total Amount to Bill (KES)</span>
                {buyerType === 'walk-in' && <span className="text-[#f59e0b]">Editable Retail Price</span>}
              </label>
              <div className="relative">
                <input 
                  required 
                  type="number" 
                  min={minPriceAllowed}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  disabled={buyerType === 'member'} 
                  placeholder="Enter amount" 
                  className={`w-full p-4 pl-12 rounded-xl border outline-none text-lg font-black transition-all ${
                    buyerType === 'member' 
                      ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed' 
                      : isPriceTooLow ? 'bg-red-50 border-red-400 text-red-600 focus:ring-red-200' : 'bg-amber-50 border-amber-200 text-[#f59e0b] focus:border-[#f59e0b] focus:ring-2 focus:ring-amber-100'
                  }`}
                />
                <Tag size={20} className={`absolute left-4 top-[1.1rem] ${buyerType === 'member' ? 'text-slate-400' : isPriceTooLow ? 'text-red-400' : 'text-[#f59e0b]'}`} />
              </div>
              {isPriceTooLow && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1">Minimum strict wholesale price: KES {minPriceAllowed.toLocaleString()}</p>}
            </div>

            <div className="bg-[#1d3557] rounded-2xl p-4 flex items-center justify-between shadow-inner">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-300">Live PV Routing</p>
                <p className="text-xs font-black text-white mt-0.5 truncate max-w-[200px]">{pvRecipient}</p>
              </div>
              <div className="text-right">
                <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-black shadow-md shadow-green-500/20">
                  +{livePV} PV
                </span>
              </div>
            </div>

            <button disabled={isPushing || isPriceTooLow} type="submit" className="w-full bg-[#03ac13] hover:bg-green-700 text-white py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] transition-all shadow-lg shadow-green-100 mt-2 flex justify-center items-center gap-2 disabled:opacity-50">
              {isPushing ? <><Loader2 size={16} className="animate-spin" /> Initiating Daraja...</> : 'Send STK Push Request'}
            </button>
          </form>
        </section>

        <section className="bg-[#1d3557] rounded-[2.5rem] shadow-xl overflow-hidden text-white flex flex-col h-[700px]">
          <div className="p-8 border-b border-white/10 bg-white/5 shrink-0">
            <h3 className="text-lg font-black uppercase tracking-tighter text-blue-100">Live Payments Ledger</h3>
            <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-1">Awaiting M-Pesa Callbacks</p>
          </div>
          
          <div className="overflow-y-auto flex-1 p-4 custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-[#1d3557] z-10 shadow-sm">
                <tr className="text-[9px] font-black text-blue-300 uppercase tracking-[0.2em] border-b border-white/10">
                  <th className="p-4">Member Info</th>
                  <th className="p-4">Transaction</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoadingData && (
                   <tr>
                     <td colSpan={3} className="p-8 text-center text-xs font-bold text-blue-300 uppercase tracking-widest">
                       Loading logs...
                     </td>
                   </tr>
                )}

                {!isLoadingData && transactions.length === 0 && (
                   <tr>
                     <td colSpan={3} className="p-8 text-center text-xs font-bold text-blue-300 uppercase tracking-widest">
                       No transactions found.
                     </td>
                   </tr>
                )}

                {transactions.map((tx, i) => {
                  const name = tx.distributor_name || tx.name || 'Walk-in Customer';
                  const amount = tx.amount || 0;
                  const status = tx.status || 'PENDING';
                  const dateRaw = tx.created_at || tx.date;
                  const displayDate = dateRaw ? new Date(dateRaw).toLocaleString() : 'Just now';

                  const isSuccess = status.toUpperCase() === 'COMPLETED' || status.toUpperCase() === 'SUCCESS';
                  const isFailed = status.toUpperCase() === 'FAILED' || status.toUpperCase() === 'CANCELLED';

                  return (
                    <tr key={tx.id || i} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="font-black text-sm uppercase truncate max-w-[150px]">{name}</p>
                        <p className="text-[9px] font-bold text-blue-300 mt-0.5">{displayDate}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-black text-sm text-white">KES {amount.toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mt-0.5">M-Pesa</p>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          isSuccess ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
                          isFailed ? 'bg-red-500/20 text-red-300 border-red-500/30' : 
                          'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default StkPush;