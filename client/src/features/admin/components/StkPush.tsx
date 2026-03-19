import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../../services/api';
import { Smartphone, CheckCircle2, AlertCircle, Loader2, Search } from 'lucide-react';

const StkPush: React.FC = () => {
  // --- LIVE DATA STATE ---
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]); 
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- FORM STATE ---
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  
  // --- SMART SEARCH STATE ---
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // --- SUBMISSION STATE ---
  const [isPushing, setIsPushing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // FETCH EVERYTHING ON LOAD
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

  useEffect(() => {
    fetchData();
  }, []);

  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMemberDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🚨 UPDATED: SMART FILTER FOR USERS NOW SEARCHES COMPANY_ID
  const filteredUsers = users.filter(u => {
    const q = memberSearchTerm.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.company_id?.toLowerCase().includes(q) || // Hunts for the 7-digit ID
      u.id?.toString().includes(q) // Fallback
    );
  });

  // SMART AUTO-FILL: When a product is selected, auto-fill the price
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prodId = e.target.value;
    setSelectedProductId(prodId);
    
    if (prodId) {
      const selectedProd = products.find(p => p.id.toString() === prodId);
      if (selectedProd) {
        setAmount((selectedProd.distributor_price || 0).toString());
      }
    } else {
      setAmount(''); 
    }
  };

  // HANDLE STK PUSH SUBMISSION
  const handleSendStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPushing(true); setError(null); setSuccess(null);

    if (!phoneNumber.startsWith('254') || phoneNumber.length !== 12) {
      setError("Phone number must be in the format 2547XXXXXXXX");
      setIsPushing(false); return;
    }

    if (!selectedUserId) {
      setError("You must select a target member from the dropdown.");
      setIsPushing(false); return;
    }

    if (!selectedProductId) {
      setError("You must select a product to generate an STK Push.");
      setIsPushing(false); return;
    }

    try {
      const queryParams = new URLSearchParams({
        distributor_id: selectedUserId, // Still sending the internal ID for backend logic
        phone_number: phoneNumber,
        amount: amount
      }).toString();

      await apiClient(`/payments/stk-push/${selectedProductId}?${queryParams}`, {
        method: 'POST'
      });
      
      setSuccess(`STK Push successfully sent to ${phoneNumber} for KES ${amount}!`);
      
      // Reset form & refresh the ledger to check for new transactions
      setPhoneNumber(''); setAmount(''); setSelectedProductId(''); 
      setSelectedUserId(''); setMemberSearchTerm('');
      fetchData(); 
    } catch (err: any) {
      setError(err.message || "Failed to initiate STK Push. Check Daraja credentials.");
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT COLUMN: M-PESA STK PUSH FORM */}
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

          <form onSubmit={handleSendStkPush} className="space-y-5">
            
            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Target Member</label>
              <div className="relative">
                <input 
                  type="text"
                  value={memberSearchTerm}
                  onChange={(e) => {
                    setMemberSearchTerm(e.target.value);
                    setShowMemberDropdown(true);
                    setSelectedUserId('');
                  }}
                  onFocus={() => setShowMemberDropdown(true)}
                  placeholder={isLoadingData ? "Loading members..." : "Search Name, Email, or 7-Digit ID..."}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#03ac13] outline-none text-sm font-bold text-slate-700 transition-all"
                />
                <Search size={16} className="absolute left-4 top-4 text-slate-400" />
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
                          setSelectedUserId(u.id.toString());
                          // 🚨 UPDATED: Displays the 7-digit ID in the input box when clicked
                          setMemberSearchTerm(`${u.full_name} (GI-${u.company_id || u.id}-2026)`);
                          setShowMemberDropdown(false);
                        }}
                        className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <p className="text-sm font-black text-slate-800 uppercase">{u.full_name}</p>
                        {/* 🚨 UPDATED: Displays the 7-digit ID in the dropdown */}
                        <p className="text-[10px] font-bold text-[#03ac13] tracking-widest">GI-{u.company_id || u.id}-2026 • {u.email}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">M-Pesa Phone Number</label>
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

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Link Product</label>
              <select required value={selectedProductId} onChange={handleProductChange} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#03ac13] outline-none text-sm font-bold text-slate-700 transition-all">
                <option value="" disabled>-- Choose a Product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - KES {p.distributor_price?.toLocaleString()} | {p.fixed_pv || p.pv} PV</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Amount to Bill (KES)</label>
              <input 
                required 
                type="number" 
                min="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount" 
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#03ac13] outline-none text-lg font-black text-[#03ac13] transition-all"
              />
            </div>

            <button disabled={isPushing} type="submit" className="w-full bg-[#03ac13] hover:bg-green-700 text-white py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] transition-all shadow-lg shadow-green-100 mt-2 flex justify-center items-center gap-2 disabled:opacity-50">
              {isPushing ? <><Loader2 size={16} className="animate-spin" /> Initiating Daraja...</> : 'Send STK Push Request'}
            </button>
          </form>
        </section>

        {/* RIGHT COLUMN: RECENT TRANSACTIONS LEDGER */}
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
                  const name = tx.distributor_name || tx.name || 'Member';
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