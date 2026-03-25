import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api';
import { FileText, Download, TrendingUp, Package, Loader2, Calendar } from 'lucide-react';

const AdminReports: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [dailySales, setDailySales] = useState<any[]>([]);
  const [isLoadingSales, setIsLoadingSales] = useState(true);

  // Fetch Visual Daily Sales Data
  useEffect(() => {
    const fetchDailySales = async () => {
      try {
        const data = await apiClient('/payments/history', { method: 'GET' });
        const txs = Array.isArray(data) ? data : (data.items || []);
        
        const today = new Date().toLocaleDateString();
        const todaysSales = txs.filter((tx: any) => 
          tx.status === 'COMPLETED' && 
          new Date(tx.created_at).toLocaleDateString() === today
        );
        
        setDailySales(todaysSales);
      } catch (err) {
        console.error("Failed to load daily sales", err);
      } finally {
        setIsLoadingSales(false);
      }
    };
    fetchDailySales();
  }, []);

  // Secure File Download Handler
  const handleDownloadPVs = async () => {
    setIsDownloading(true);
    try {
      // 🚨 THE FIX: Added 'userToken' to match your localStorage exactly!
      const token = 
        localStorage.getItem('userToken') || 
        localStorage.getItem('adminToken') || 
        localStorage.getItem('admin_token') || 
        localStorage.getItem('token') || 
        localStorage.getItem('access_token');

      if (!token) {
        alert("Security token missing! Please log out and log back into the Admin Dashboard.");
        setIsDownloading(false);
        return;
      }

      const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'; 
      const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
      
      const response = await fetch(`${baseUrl}/admin/reports/daily-pvs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("401 Unauthorized: Your admin session may have expired.");
        throw new Error(`Failed to download report. Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Daily_PV_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error: any) {
      console.error("Download Error:", error);
      alert(error.message || "There was an issue downloading the report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const totalRevenueToday = dailySales.reduce((sum, sale) => sum + (sale.amount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 space-y-8">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-50 rounded-2xl text-blue-500 font-bold">
          <TrendingUp size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Reports & Analytics</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Daily Sales & Downloads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: DOWNLOADS */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <FileText size={80} />
            </div>
            
            <h4 className="text-sm font-black text-[#1d3557] uppercase tracking-widest mb-6 relative z-10">Export Center</h4>
            
            <div className="space-y-4 relative z-10">
              {/* Daily PVs Report Card */}
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-200 transition-colors">
                <h5 className="font-black text-slate-800 uppercase text-xs">Daily PVs Summary</h5>
                <p className="text-[10px] font-bold text-slate-400 mt-1 mb-4 leading-relaxed">Download a complete breakdown of all Personal Volume generated today by distributors.</p>
                
                <button 
                  onClick={handleDownloadPVs}
                  disabled={isDownloading}
                  className="w-full bg-[#1d3557] hover:bg-blue-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all flex justify-center items-center gap-2 disabled:opacity-50 shadow-md shadow-blue-900/20"
                >
                  {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <><Download size={16} /> Download Report</>}
                </button>
              </div>

              {/* Placeholder for future reports */}
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl opacity-60">
                <h5 className="font-black text-slate-500 uppercase text-xs">Monthly Inventory Audit</h5>
                <p className="text-[10px] font-bold text-slate-400 mt-1 mb-4">Export full stock levels.</p>
                <button disabled className="w-full bg-slate-200 text-slate-400 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em]">Coming Soon</button>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: DAILY SALES DISPLAY */}
        <div className="lg:col-span-2">
          <section className="bg-[#1d3557] rounded-[2.5rem] shadow-xl overflow-hidden text-white flex flex-col h-full min-h-[500px]">
            <div className="p-8 border-b border-white/10 bg-white/5 shrink-0 flex justify-between items-end">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tighter text-blue-100">Today's Sales Activity</h3>
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-1 flex items-center gap-1">
                  <Calendar size={12} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-1">Total Revenue</p>
                <p className="text-3xl font-black text-green-400">KES {totalRevenueToday.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4 custom-scrollbar">
              {isLoadingSales ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="animate-spin text-blue-300" size={32} />
                </div>
              ) : dailySales.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50 p-8">
                  <Package size={48} className="mb-4 text-blue-300" />
                  <p className="text-sm font-black uppercase tracking-widest">No Sales Yet Today</p>
                  <p className="text-[10px] font-bold mt-2">Waiting for new STK push completions...</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-[#1d3557] z-10 shadow-sm">
                    <tr className="text-[9px] font-black text-blue-300 uppercase tracking-[0.2em] border-b border-white/10">
                      <th className="p-4">Customer / Member</th>
                      <th className="p-4">Time</th>
                      <th className="p-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {dailySales.map((sale, idx) => (
                      <tr key={sale.id || idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <p className="font-black text-sm uppercase">{sale.distributor_name || 'Walk-in Customer'}</p>
                          {sale.company_id && sale.company_id !== 'N/A' && (
                            <p className="text-[9px] font-bold text-blue-300 tracking-widest mt-0.5">ID: {sale.company_id}</p>
                          )}
                        </td>
                        <td className="p-4 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                          {new Date(sale.created_at).toLocaleTimeString()}
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-black bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs">
                            + KES {sale.amount?.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default AdminReports