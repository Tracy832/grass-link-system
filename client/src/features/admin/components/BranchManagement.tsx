import React, { useState, useEffect } from 'react';
import { Building2, Plus, MapPin, CheckCircle2, X, UserCog, Edit3, Trash2 } from 'lucide-react';
import { apiClient } from '../../../services/api';

interface Branch {
  id: number;
  name: string;
  code: string;
  location: string;
  is_active: boolean;
}

const BranchManagement: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Create Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerPassword, setManagerPassword] = useState('');

  // 🚨 NEW: Edit Modal State
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [editForm, setEditForm] = useState({ name: '', code: '', location: '' });

  const fetchBranches = async () => {
    try {
      const data = await apiClient('/branches/', { method: 'GET' });
      setBranches(data);
    } catch (error) {
      console.error("Failed to fetch branches", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient('/branches/', {
        method: 'POST',
        body: JSON.stringify({ name, code, location, manager_name: managerName, manager_email: managerEmail, manager_phone: managerPhone, manager_password: managerPassword })
      });
      setName(''); setCode(''); setLocation('');
      setManagerName(''); setManagerEmail(''); setManagerPhone(''); setManagerPassword('');
      setIsCreating(false);
      fetchBranches();
      alert("Success! Branch opened and Manager credentials created.");
    } catch (error: any) {
      alert(error.message || "Failed to create branch. Check your inputs.");
    }
  };

  // 🚨 NEW: Handle Update Branch
  const handleUpdateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;
    try {
      await apiClient(`/branches/${editingBranch.id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm)
      });
      setEditingBranch(null);
      fetchBranches();
    } catch (error: any) {
      alert(error.message || "Failed to update branch.");
    }
  };

  // 🚨 NEW: Handle Delete Branch
  const handleDeleteBranch = async () => {
    if (!editingBranch) return;
    if (!window.confirm(`Are you absolutely sure you want to delete ${editingBranch.name}? This cannot be undone.`)) return;
    
    try {
      await apiClient(`/branches/${editingBranch.id}`, { method: 'DELETE' });
      setEditingBranch(null);
      fetchBranches();
    } catch (error: any) {
      alert(error.message || "Failed to delete branch.");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 p-6 md:p-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl shadow-inner">
            <Building2 size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Branch Network</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage Sub-Branches & Global Stock</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-amber-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2"
        >
          {isCreating ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Open New Branch</>}
        </button>
      </div>

      {/* CREATE NEW BRANCH FORM (Hidden when editing) */}
      {isCreating && !editingBranch && (
        <form onSubmit={handleCreateBranch} className="mb-10 p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-3xl animate-in slide-in-from-top-4 shadow-inner">
          <div className="mb-6">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Building2 size={16} className="text-amber-500" /> 1. Branch Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Branch Name</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mombasa Hub" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold" /></div>
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Branch Code</label><input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. MSA-001" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold uppercase" /></div>
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Physical Location</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Nyali, Mombasa" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold" /></div>
            </div>
          </div>
          <hr className="border-slate-200 my-6" />
          <div className="mb-8">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <UserCog size={16} className="text-blue-500" /> 2. Primary Manager Credentials
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Manager Full Name</label><input type="text" required value={managerName} onChange={(e) => setManagerName(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold" /></div>
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Login Email</label><input type="email" required value={managerEmail} onChange={(e) => setManagerEmail(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold" /></div>
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</label><input type="tel" required value={managerPhone} onChange={(e) => setManagerPhone(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold" /></div>
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Initial Password</label><input type="text" required value={managerPassword} onChange={(e) => setManagerPassword(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold" /></div>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#1d3557] text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">Authorize & Open Branch</button>
        </form>
      )}

      {/* EXISTING BRANCHES GRID */}
      {isLoading ? (
        <div className="text-center py-10 text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Network...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-amber-200 hover:shadow-xl transition-all relative overflow-hidden group flex flex-col h-full">
              
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Building2 size={80} />
              </div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">
                  {branch.code}
                </div>
                {branch.is_active ? (
                  <span className="flex items-center gap-1 text-[9px] font-black text-[#03ac13] uppercase tracking-widest bg-green-50 px-2 py-1 rounded-md">
                    <CheckCircle2 size={12} /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[9px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-1 rounded-md">
                    <X size={12} /> Closed
                  </span>
                )}
              </div>
              
              <div className="relative z-10 flex-1">
                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-1">{branch.name}</h4>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-6">
                  <MapPin size={14} /> {branch.location || 'Location Not Set'}
                </div>
              </div>
              
              {/* 🚨 UPDATED: Button now triggers the modal */}
              <button 
                onClick={() => {
                  setEditingBranch(branch);
                  setEditForm({ name: branch.name, code: branch.code, location: branch.location || '' });
                  setIsCreating(false);
                }}
                className="w-full py-2.5 mt-auto bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors border border-slate-200 flex justify-center items-center gap-2 relative z-10"
              >
                <Edit3 size={14} /> Manage Branch
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🚨 NEW: EDIT/DELETE MODAL OVERLAY */}
      {editingBranch && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Edit3 size={18} className="text-blue-500" /> Edit Branch
              </h3>
              <button onClick={() => setEditingBranch(null)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateBranch} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Branch Name</label>
                <input type="text" required value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Branch Code</label>
                <input type="text" required value={editForm.code} onChange={(e) => setEditForm({...editForm, code: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Physical Location</label>
                <input type="text" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 bg-[#1d3557] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-900 transition-all">
                  Save Changes
                </button>
                
                {/* Prevent deleting HQ directly from the UI */}
                {editingBranch.id !== 1 && (
                  <button type="button" onClick={handleDeleteBranch} className="px-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 flex items-center justify-center">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;