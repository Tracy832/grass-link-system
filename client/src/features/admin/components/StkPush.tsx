import React, { useState, type ReactNode } from 'react';

const StkPush = () => {
  const [transactions] = useState([
    { name: "Tracy Kibue", amount: 2500, pvs: 250, date: "2026-03-07", time: "10:30 AM", status: "Success" },
    { name: "Baraka Roney", amount: 1250, pvs: 125, date: "2026-03-06", time: "02:15 PM", status: "Success" },
  ]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* M-PESA STK PUSH FORM (Matches image_6f4667.png) */}
      <section className="bg-white rounded-[2rem] p-10 shadow-xl border border-slate-100 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-900 font-bold">📱</div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">M-Pesa STK Push</h3>
        </div>

        <form className="space-y-6">
          {/* User Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Select User</label>
            <select className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#03ac13] outline-none text-sm font-bold text-slate-400">
              <option>Search by name, ID, or phone</option>
              <option>Tracy Kibue (GI-001)</option>
              <option>Baraka Roney (GI-002)</option>
            </select>
          </div>

          {/* Product Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Select Product (Optional)</label>
            <select className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#03ac13] outline-none text-sm font-bold text-slate-400">
              <option>Choose a product</option>
              <option>Co-enzyme tablets (20 PV)</option>
              <option>Pure ginseng (20 PV)</option>
            </select>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Custom Amount (KES)</label>
            <input 
              type="number" 
              placeholder="Enter amount" 
              className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#03ac13] outline-none text-sm font-bold"
            />
            <p className="text-[10px] font-bold text-slate-400">PV will be calculated as: Amount ÷ 10</p>
          </div>

          {/* Action Button (Matches image_6f4667.png Green) */}
          <button className="w-full bg-[#8fb094] hover:bg-[#7a9d80] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.1em] transition-all shadow-lg shadow-green-50 mt-4">
            Send STK Push
          </button>
        </form>
      </section>

      {/* RECENT TRANSACTIONS LEDGER */}
      <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="p-8">Member Name</th>
                <th className="p-8">Amount Paid</th>
                <th className="p-8">PVs Awarded</th>
                <th className="p-8">Date & Time</th>
                <th className="p-8 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((tx, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-8 font-black text-sm text-slate-900">{tx.name}</td>
                  <td className="p-8 font-black text-sm text-slate-600">KES {tx.amount.toLocaleString()}</td>
                  <td className="p-8 font-black text-sm text-[#03ac13]">+{tx.pvs} PV</td>
                  <td className="p-8">
                    <p className="text-xs font-bold text-slate-900">{tx.date}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{tx.time}</p>
                  </td>
                  <td className="p-8 text-right">
                    <span className="bg-green-100 text-[#03ac13] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default StkPush;