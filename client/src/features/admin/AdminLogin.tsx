import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set Admin specific session
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('userName', 'System Admin');

    navigate('/admin'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs border border-slate-700">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-4 rounded-full" />
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Admin Portal</h2>
          <p className="text-[10px] text-slate-400 font-semibold tracking-widest mt-1 uppercase">Management Access Only</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input type="text" required placeholder="Admin ID" className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="password" required placeholder="Access Key" className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-all text-xs shadow-lg">AUTHENTICATE</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;