import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';
import { apiClient } from '../../services/api';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Send the data as standard JSON, matching the database columns
      const data = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ 
          email: adminId, 
          password: password 
        })
      });

      // Save the REAL tokens securely
      localStorage.setItem('userToken', data.access_token);
      localStorage.setItem('userRole', data.user?.role || 'admin'); 
      localStorage.setItem('userName', data.user?.name || 'System Admin');
      localStorage.setItem('userId', data.user?.id?.toString() || '');

      // 🚨 NEW: Save the Branch Data for the Multi-Tenant Dashboard
      localStorage.setItem('branch_id', data.user?.branch_id?.toString() || '1');
      localStorage.setItem('branch_name', data.user?.branch_name || 'Main Headquarters');

      // Redirect to the protected dashboard
      navigate('/admin'); 

    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs border border-slate-700">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-4 rounded-full shadow-sm" />
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Admin Portal</h2>
          <p className="text-[10px] text-slate-400 font-semibold tracking-widest mt-1 uppercase">Management Access Only</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded-r-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input 
            type="text" 
            required 
            placeholder="Admin ID (Email)" 
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#03ac13] outline-none transition-all" 
          />
          <input 
            type="password" 
            required 
            placeholder="Access Key" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#03ac13] outline-none transition-all" 
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-all text-xs shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;