import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

// Modular Imports
import UserTable from './components/UserTable';
import ProductCatalog from './components/ProductCatalog';
import InventoryAlerts from './components/InventoryAlerts';
import InventoryTable from './components/InventoryTable';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // DATA STATE
  const [users] = useState([
    { name: "Tracy Kibue", id: "GI-001", email: "tracy@gmail.com", star: 3, ppv: 1250, gpv: 8450 },
    { name: "Baraka Roney", id: "GI-002", email: "baraka@gmail.com", star: 2, ppv: 900, gpv: 4200 },
  ]);

  const [inventory] = useState([
    { name: "Green tea", pvs: 10, distributor: 1250, member: 3000, stock: 35, type: 'supplement' },
    { name: "Purchase oxometer machine", pvs: 10, distributor: 1250, member: 3000, stock: 1, type: 'machine' },
    { name: "Massage chair", pvs: 5000, distributor: 625000, member: 800000, stock: 1, type: 'chair' },
    // Add all other items here...
  ]);

  // LOW STOCK LOGIC (Passed to Alerts)
  const lowStockItems = useMemo(() => {
    return inventory.filter(item => {
      if (item.type === 'supplement' && item.stock < 50) return true;
      if (item.type === 'machine' && item.stock < 2) return true;
      if (item.type === 'chair' && item.stock < 1) return true;
      return false;
    });
  }, [inventory]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative">
      {/* WATERMARK */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] grayscale">
        <h1 className="text-[10vw] font-black uppercase text-slate-300 transform -rotate-12 tracking-[0.2em]">Grass International</h1>
      </div>

      <header className="bg-white px-8 py-3 border-b flex justify-between items-center sticky top-0 z-50 shadow-sm relative">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full object-cover border" />
          <div className="leading-tight">
            <h1 className="text-sm font-black text-slate-900 uppercase">System Admin</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator</p>
          </div>
        </div>
        <button onClick={() => navigate('/admin/auth')} className="text-slate-400 font-black text-[10px] uppercase hover:text-red-600">Logout ➔</button>
      </header>

      <div className="px-8 pt-8 relative">
        <h2 className="text-3xl font-black text-slate-900 uppercase mb-8">Admin Dashboard</h2>
        <nav className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide">
          {['users', 'products', 'inventory', 'STK push'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border-2 transition-all 
                ${activeTab === tab ? 'bg-[#1d3557] text-white border-[#1d3557] shadow-lg scale-105' : 'bg-white text-slate-400 border-slate-100'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <main className="flex-1 px-8 pb-12 relative">
        {activeTab === 'users' && <UserTable users={users} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        {activeTab === 'products' && <ProductCatalog onOpenModal={() => setIsModalOpen(true)} />}
        {activeTab === 'inventory' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <InventoryAlerts lowStockItems={lowStockItems} />
            <InventoryTable inventory={inventory} onOpenModal={() => setIsModalOpen(true)} />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;