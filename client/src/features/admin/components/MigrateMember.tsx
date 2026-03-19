import React, { useState } from 'react';
import { apiClient } from '../../../services/api';
import { ShieldAlert, UploadCloud, FileSpreadsheet, Download, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';

const MigrateMember: React.FC = () => {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- SINGLE IMPORT STATE ---
  const [formData, setFormData] = useState({
    companyId: '',
    fullName: '',
    email: '',
    phone: '',
    sponsorCompanyId: '',
    personalPv: '0',
    groupPv: '0',
    starLevel: '1',
  });

  // --- BULK IMPORT STATE ---
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadStats, setUploadStats] = useState<{ total: number, success: number, failed: number } | null>(null);

  // --- HANDLERS: SINGLE IMPORT ---
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(null); setSuccess(null);

    try {
      await apiClient('/distributors/admin/migrate-member', {
        method: 'POST',
        body: JSON.stringify({
          company_id: formData.companyId,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          sponsor_company_id: formData.sponsorCompanyId || null,
          personal_pv: parseInt(formData.personalPv),
          group_pv: parseInt(formData.groupPv),
          star_level: formData.starLevel
        })
      });

      setSuccess(`Successfully imported ${formData.fullName} (GI-${formData.companyId}).`);
      setFormData({ companyId: '', fullName: '', email: '', phone: '', sponsorCompanyId: '', personalPv: '0', groupPv: '0', starLevel: '1' });
    } catch (err: any) {
      setError(err.message || 'Failed to migrate member.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLERS: BULK IMPORT ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      setError(null);
      setSuccess(null);
      setUploadStats(null);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      setError("Please select a CSV file to upload.");
      return;
    }

    setIsLoading(true); setError(null); setSuccess(null); setUploadStats(null);

    const formDataPayload = new FormData();
    formDataPayload.append('file', csvFile);

    try {
      const response = await apiClient('/distributors/admin/migrate-bulk-csv', {
        method: 'POST',
        body: formDataPayload,
      });

      setSuccess("Bulk migration completed!");
      setUploadStats({
        total: response.total_processed,
        success: response.successful_imports,
        failed: response.failed_imports
      });
      setCsvFile(null);

    } catch (err: any) {
      setError(err.message || 'Fatal error processing CSV file. Check file formatting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="bg-white rounded-4xl p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-6 items-center">
        <div className="p-4 bg-red-50 rounded-2xl text-red-500 shrink-0">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-[#1d3557]">Historical Data Migration</h2>
          <p className="text-sm font-bold text-slate-500 leading-relaxed mt-1">
            This is a highly-secured Admin bypass tool. It creates users without an M-Pesa receipt and assigns them a default password <span className="text-red-500 font-black tracking-widest">( Grass@2026! )</span>.
          </p>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 mb-8 w-fit mx-auto overflow-hidden">
        <button 
          onClick={() => { setActiveTab('single'); setError(null); setSuccess(null); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'single' ? 'bg-[#1d3557] text-white shadow-md' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <UserPlus size={16} /> Surgical Import
        </button>
        <button 
          onClick={() => { setActiveTab('bulk'); setError(null); setSuccess(null); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'bulk' ? 'bg-[#03ac13] text-white shadow-md' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <UploadCloud size={16} /> Bulk CSV Import
        </button>
      </div>

      {/* GLOBAL NOTIFICATIONS */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3 text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200 flex items-start gap-3 text-green-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">{success}</p>
            {uploadStats && (
              <div className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-80 flex gap-4">
                <span>Total Processed: {uploadStats.total}</span>
                <span className="text-green-600">Success: {uploadStats.success}</span>
                {uploadStats.failed > 0 && <span className="text-red-500">Failed: {uploadStats.failed}</span>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 1: SINGLE SURGICAL IMPORT */}
      {activeTab === 'single' && (
        <form onSubmit={handleSingleSubmit} className="bg-white rounded-4xl p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-left-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[10px] font-black uppercase tracking-widest text-center mb-8 shadow-inner">
            Rule of Law: You MUST import a sponsor into the database before you can import their downlines. Work from the top of the tree downwards!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">7-Digit Company ID</label>
              <input required maxLength={7} type="text" value={formData.companyId} onChange={e => setFormData({...formData, companyId: e.target.value})} placeholder="e.g. 0012345" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#1d3557] outline-none text-sm font-black text-slate-800 tracking-widest transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Full Name</label>
              <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#1d3557] outline-none text-sm font-bold text-slate-800 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Email Address</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#1d3557] outline-none text-sm font-bold text-slate-800 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Phone Number</label>
              <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+254..." className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#1d3557] outline-none text-sm font-bold text-slate-800 transition-all" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-[#03ac13] tracking-widest pl-1">Sponsor's 7-Digit ID (Leave blank if top of tree)</label>
              <input maxLength={7} type="text" value={formData.sponsorCompanyId} onChange={e => setFormData({...formData, sponsorCompanyId: e.target.value})} placeholder="e.g. 0012344" className="w-full p-4 rounded-xl bg-green-50/50 border border-green-200 focus:ring-2 focus:border-[#03ac13] outline-none text-sm font-black text-slate-800 tracking-widest transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Personal PV</label>
              <input required type="number" min="0" value={formData.personalPv} onChange={e => setFormData({...formData, personalPv: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#1d3557] outline-none text-sm font-black text-slate-800 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Group PV</label>
              <input required type="number" min="0" value={formData.groupPv} onChange={e => setFormData({...formData, groupPv: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#1d3557] outline-none text-sm font-black text-slate-800 transition-all" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Current Rank (Star Level)</label>
              <select required value={formData.starLevel} onChange={e => setFormData({...formData, starLevel: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:border-[#1d3557] outline-none text-sm font-bold text-slate-800 transition-all">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <option key={num} value={num}>Star {num}</option>
                ))}
              </select>
            </div>
          </div>

          <button disabled={isLoading} type="submit" className="w-full mt-8 bg-[#1d3557] hover:bg-blue-900 text-white py-5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl disabled:opacity-50 transition-all">
            {isLoading ? 'Importing Member...' : 'Bypass Auth & Import Member'}
          </button>
        </form>
      )}

      {/* TAB 2: BULK CSV IMPORT */}
      {activeTab === 'bulk' && (
        <div className="bg-white rounded-4xl p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-right-4">
          
          <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1d3557] mb-4 flex items-center gap-2">
              <FileSpreadsheet size={16} /> Required CSV Format
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
              Your CSV file must include these exact column headers in the first row. The system will process the file row by row, from top to bottom. <strong className="text-red-500">Ensure root sponsors are at the top of the sheet!</strong>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left bg-white border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="p-3">company_id</th>
                    <th className="p-3">full_name</th>
                    <th className="p-3">email</th>
                    <th className="p-3">phone</th>
                    <th className="p-3">sponsor_company_id</th>
                    <th className="p-3">personal_pv</th>
                    <th className="p-3">group_pv</th>
                    <th className="p-3">star_level</th>
                  </tr>
                </thead>
                <tbody className="text-[10px] font-bold text-slate-700 font-mono">
                  <tr>
                    <td className="p-3 border-t">0012345</td>
                    <td className="p-3 border-t">Jane Doe</td>
                    <td className="p-3 border-t">jane@mail.com</td>
                    <td className="p-3 border-t">254700000000</td>
                    <td className="p-3 border-t">0012344</td>
                    <td className="p-3 border-t">200</td>
                    <td className="p-3 border-t">400</td>
                    <td className="p-3 border-t">2</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#03ac13] hover:text-green-700 transition-colors">
              <Download size={14} /> Download Sample Template
            </button>
          </div>

          <form onSubmit={handleBulkSubmit}>
            <div className="relative border-2 border-dashed border-slate-300 hover:border-[#03ac13] bg-slate-50 rounded-3xl p-12 text-center transition-colors group cursor-pointer">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <div className={`p-4 rounded-full mb-4 transition-colors ${csvFile ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400 group-hover:text-[#03ac13] shadow-sm'}`}>
                  {csvFile ? <FileSpreadsheet size={32} /> : <UploadCloud size={32} />}
                </div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">
                  {csvFile ? 'File Selected' : 'Upload CSV Database'}
                </h4>
                <p className="text-xs font-bold text-slate-400">
                  {csvFile ? csvFile.name : 'Drag and drop your file here, or click to browse'}
                </p>
              </div>
            </div>

            <button disabled={isLoading || !csvFile} type="submit" className="w-full mt-6 bg-[#03ac13] hover:bg-green-700 text-white py-5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl disabled:opacity-50 transition-all flex justify-center items-center gap-2">
              {isLoading ? 'Running Mass Migration...' : 'Execute Bulk Upload'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default MigrateMember;