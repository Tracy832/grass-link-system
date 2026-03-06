import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

// Modular Component Imports
import UserTable from './components/UserTable';
import ProductCatalog from './components/ProductCatalog';
import InventoryAlerts from './components/InventoryAlerts';
import InventoryTable from './components/InventoryTable';
import StkPush from './components/StkPush';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. SHARED DATA STATE
  const [users] = useState([
    { name: "Tracy Kibue", id: "GI-001", email: "tracy@gmail.com", star: 3, ppv: 1250, gpv: 8450 },
    { name: "Baraka Roney", id: "GI-002", email: "baraka@gmail.com", star: 2, ppv: 900, gpv: 4200 },
    { name: "Evans Kip", id: "GI-003", email: "evans@gmail.com", star: 1, ppv: 450, gpv: 1200 },
  ]);

  const [inventory] = useState([
    { name: "Co-enzyme tablets", stock: 120, distributor: 2500, pvs: 20, type: 'supplement' },
    { name: "Cordycep tablets", stock: 15, distributor: 2500, pvs: 20, type: 'supplement' },
    { name: "Purchase Oxometer Machine", stock: 5, distributor: 1250, pvs: 10, type: 'machine' },
    { name: "Big Reflexology Machine", stock: 1, distributor: 75000, pvs: 600, type: 'machine' },
    { name: "Massage Chair", stock: 1, distributor: 625000, pvs: 5000, type: 'chair' },
  ]);

  // 2. DOMAIN LOGIC: Filter for low stock alert
  const lowStockProducts = useMemo(() => {
    return inventory.filter(item => {
      if (item.type === 'supplement' && item.stock < 50) return true;
      if (item.type === 'machine' && item.stock < 2) return true;
      if (item.type === 'chair' && item.stock < 1) return true;
      return false;
    });
  }, [inventory]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/admin/auth');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative">
      
      {/* GLOBAL WATERMARK */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] grayscale">
        <h1 className="text-[10vw] font-black uppercase text-slate-300 transform -rotate-12 tracking-[0.2em]">
          Grass International
        </h1>
      </div>

      {/* HEADER */}
      <header className="bg-white px-8 py-3 border-b flex justify-between items-center shadow-sm sticky top-0 z-50 relative">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full object-cover border shadow-sm" />
          <div className="leading-tight">
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter">System Admin</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator Clearance</p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="text-slate-400 hover:text-red-600 font-black text-[10px] uppercase transition-colors"
        >
          Logout ➔
        </button>
      </header>

      {/* NAVIGATION TABS */}
      <div className="px-8 pt-8 relative">
        <h2 className="text-3xl font-black text-slate-900 uppercase mb-8 tracking-tight">Admin Dashboard</h2>
        <nav className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide">
          {['users', 'products', 'inventory', 'STK push'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border-2 transition-all 
                ${activeTab === tab 
                  ? 'bg-[#1d3557] text-white border-[#1d3557] shadow-lg shadow-blue-100' 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN DYNAMIC CONTENT */}
      <main className="flex-1 px-8 pb-12 relative">
        
        {/* USERS TAB */}
        {activeTab === 'users' && (
          <UserTable 
            users={users} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <ProductCatalog 
            onOpenModal={() => setIsModalOpen(true)} 
          />
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <InventoryAlerts lowStockItems={lowStockProducts} />
            <InventoryTable 
              inventory={inventory} 
              onOpenModal={() => setIsModalOpen(true)} 
            />
          </div>
        )}

        {/* STK PUSH TAB */}
        {activeTab === 'STK push' && (
          <StkPush />
        )}

      </main>

      {/* ADD PRODUCT MODAL PLACEHOLDER */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
            <h4 className="text-xl font-black text-slate-900 uppercase mb-6">Manage Item</h4>
            <p className="text-sm text-slate-500 font-bold mb-8 italic">Add or update inventory levels and pricing.</p>
            {/* Modal Form could go here */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-[#1d3557] text-white py-4 rounded-2xl font-black text-[10px] uppercase"
            >
              Close Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;