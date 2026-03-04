import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';
// Ensure you have a suplements image in your assets
import bgImage from '../../assets/suplements.jpeg'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [cardNo, setCardNo] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic: Save as distributor and go to dashboard
    const sessionUser = { name: "Member", email, role: "distributor" };
    localStorage.setItem('user', JSON.stringify(sessionUser));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-6" 
         style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgImage})` }}>
      
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-2xl border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="w-20 h-20 rounded-full object-cover mb-4 shadow-lg" />
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Member Login</h2>
          <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mt-2">
            ⚠️ Unauthorized Personnel Prohibited
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            className="w-full p-4 rounded-2xl bg-slate-100 border-2 border-transparent focus:border-[#03ac13] outline-none text-sm font-bold"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Enter Card No. (GI-XXXX-2026)" 
            required
            className="w-full p-4 rounded-2xl bg-slate-100 border-2 border-transparent focus:border-[#03ac13] outline-none text-sm font-bold"
            onChange={(e) => setCardNo(e.target.value)}
          />
          <button type="submit" className="w-full bg-[#1d3557] text-white p-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg hover:bg-slate-800 transition-all">
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase">
          New to Grass? <Link to="/signup" className="text-[#03ac13]">Join Now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;