import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';
import { Building2, ShieldAlert } from 'lucide-react';

// Modular Imports
import UserTable from './components/UserTable';
import ProductCatalog from './components/ProductCatalog';
import InventoryAlerts from './components/InventoryAlerts';
import InventoryTable from './components/InventoryTable';
import StkPush from './components/StkPush';
import CreditManagement from './components/CreditManagement';
import MigrateMember from './components/MigrateMember';
import AdminPromotions from './components/AdminPromotions';
import AdminReports from './components/AdminReports';
import BranchManagement from './components/BranchManagement'; // 👈 Imported perfectly

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory'); 
  const [searchQuery, setSearchQuery] = useState('');

  // Identify the Admin and their Branch Level
  const branchName = localStorage.getItem('branch_name') || 'Main Headquarters';
  const branchId = localStorage.getItem('branch_id') || '1';
  const currentAdminName = localStorage.getItem('userName') || 'System Admin';
  
  // 🚨 SUPER ADMIN DETECTION
  const isSuperAdmin = branchId === '1' || branchName.includes('Headquarters');

  // 🚨 SECURITY LOCKDOWN: Dynamically build the tabs based on access level
  const superAdminTabs = ['users', 'migration', 'products', 'inventory', 'STK push', 'credit', 'promotions', 'reports', 'branches'];
  const branchAdminTabs = ['users', 'inventory', 'STK push', 'credit', 'reports']; // Restricted View!
  
  const adminTabs = isSuperAdmin ? superAdminTabs : branchAdminTabs;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/auth');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative">
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] grayscale">
        <h1 className="text-[10vw] font-black uppercase text-slate-300 transform -rotate-12 tracking-[0.2em]">Grass International</h1>
      </div>

      <header className="bg-white px-8 py-3 border-b flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full object-cover border" />
          <div className="leading-tight">
            <h1 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
              {currentAdminName}
              {isSuperAdmin && (
                <span className="bg-amber-100 text-amber-600 text-[8px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldAlert size={10} /> SUPER ADMIN
                </span>
              )}
            </h1>
            
            <p className={`text-[10px] font-black uppercase tracking-widest ${isSuperAdmin ? 'text-amber-500' : 'text-[#03ac13]'}`}>
              {branchName} {isSuperAdmin ? '' : 'Branch'}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-slate-400 font-black text-[10px] uppercase hover:text-red-500 transition-colors">
          Logout ➔
        </button>
      </header>

      <div className="px-8 pt-8 relative">
        <h2 className="text-3xl font-black text-slate-900 uppercase mb-8">
          {isSuperAdmin ? 'Master Dashboard' : 'Branch Dashboard'}
        </h2>
        
        <nav className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide">
          {adminTabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border-2 transition-all whitespace-nowrap
                ${activeTab === tab 
                  ? (tab === 'branches' ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-[#1d3557] text-white border-[#1d3557] shadow-lg shadow-blue-50') 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'}`}
            >
              {tab === 'branches' && <Building2 size={12} className="inline mr-1.5 mb-0.5" />}
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <main className="flex-1 px-8 pb-12 relative">
        {activeTab === 'users' && <UserTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        
        {activeTab === 'migration' && isSuperAdmin && (
          <div className="animate-in fade-in duration-500 pt-4">
            <MigrateMember />
          </div>
        )}

        {activeTab === 'products' && isSuperAdmin && <ProductCatalog />}
        
        {activeTab === 'inventory' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <InventoryAlerts lowStockItems={[]} />
            <InventoryTable />
          </div>
        )}

        {activeTab === 'STK push' && <StkPush />}
        
        {activeTab === 'credit' && <CreditManagement />}

        {activeTab === 'promotions' && isSuperAdmin && <AdminPromotions />}

        {activeTab === 'reports' && <AdminReports />}

        {activeTab === 'branches' && isSuperAdmin && (
           <div className="animate-in fade-in duration-500 pt-4">
             <BranchManagement /> 
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;