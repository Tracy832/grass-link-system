import React, { useState, type ReactNode } from 'react';

interface CreditItem {
  name: string;
  products: string;
  total: number;
  date: string;
  status: string;
}

const CreditManagement = () => {
  const [credits, setCredits] = useState<CreditItem[]>([
    { name: "Tracy Kibue", products: "Big Massage Gun", total: 10000, date: "2026-03-07", status: "Pending" },
    { name: "Baraka Roney", products: "Pure Ginseng (x2)", total: 5000, date: "2026-03-06", status: "Pending" },
  ]);

  // Modal State
  const [modal, setModal] = useState<{ isOpen: boolean; type: 'paid' | 'return' | null; data: CreditItem | null }>({
    isOpen: false,
    type: null,
    data: null
  });

  const [message, setMessage] = useState<string | null>(null);

  const openModal = (type: 'paid' | 'return', item: CreditItem) => {
    setModal({ isOpen: true, type, data: item });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, data: null });
  };

  const handleConfirm = () => {
    if (!modal.data) return;
    
    const actionText = modal.type === 'paid' ? 'marked as PAID' : 'marked as RETURNED';
    setMessage(`Success: Transaction for ${modal.data.name} has been ${actionText}.`);
    
    // Auto-hide message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
    closeModal();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* SUCCESS MESSAGE TOAST */}
      {message && (
        <div className="fixed top-24 right-8 bg-[#1d3557] text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] font-black text-[10px] uppercase tracking-widest animate-bounce">
          {message}
        </div>
      )}

      <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-amber-400 rounded-full"></div>
          <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter">Pending Credit Transactions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="p-8">Username</th>
                <th className="p-8">Products Taken</th>
                <th className="p-8">Total Value (KES)</th>
                <th className="p-8">Date Issued</th>
                <th className="p-8">Status</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {credits.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-8 font-black text-sm text-slate-900">{c.name}</td>
                  <td className="p-8 text-xs font-bold text-slate-500 uppercase">{c.products}</td>
                  <td className="p-8 font-black text-sm text-[#1d3557]">{c.total.toLocaleString()}</td>
                  <td className="p-8 text-[11px] font-bold text-slate-400">{c.date}</td>
                  <td className="p-8">
                    <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-8 text-right flex justify-end gap-3">
                    {/* RETURNED BUTTON */}
                    <button 
                      onClick={() => openModal('return', c)}
                      className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                    >
                      <span>✕</span> Returned
                    </button>
                    {/* PAID BUTTON */}
                    <button 
                      onClick={() => openModal('paid', c)}
                      className="flex items-center gap-2 bg-green-50 text-[#03ac13] px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-[#03ac13] hover:text-white transition-all shadow-sm"
                    >
                      <span>✓</span> Paid
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CONFIRMATION DIALOG BOX */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h4 className="text-xl font-black text-slate-900 uppercase mb-4 tracking-tighter">
              {modal.type === 'paid' ? 'Confirm Payment' : 'Confirm Return'}
            </h4>
            <p className="text-sm text-slate-500 font-bold mb-8">
              {modal.type === 'paid' 
                ? "Are you sure payment has been received? This will mark the credit transaction as paid." 
                : "Are you sure the goods have been returned? This will mark the credit transaction as returned."}
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={closeModal}
                className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm}
                className={`flex-1 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg transition-all hover:scale-105 ${
                  modal.type === 'paid' ? 'bg-[#03ac13] shadow-green-100' : 'bg-red-600 shadow-red-100'
                }`}
              >
                {modal.type === 'paid' ? 'Confirm Payment' : 'Confirm Return'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditManagement;