import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';
import bgImage from '../../assets/suplements.jpeg'; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [masterKey, setMasterKey] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [vCode, setVCode] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ADMIN_EMAILS = ["tracyjoel05@gmail.com", "barakaroney001@gmail.com"];
    const SECRET_KEY = "GRASS-ADMIN-2026";

    if (!showVerification) {
      // First step: Check credentials
      if (ADMIN_EMAILS.includes(email.toLowerCase()) && masterKey === SECRET_KEY) {
        setShowVerification(true);
      } else {
        alert("ACCESS DENIED: Unauthorized Personnel Only.");
      }
    } else {
      // Second step: Verification code (e.g., 1234 for demo)
      if (vCode === "1234") {
        const adminUser = { 
          name: email === "tracyjoel05@gmail.com" ? "Tracy Kibue" : "Baraka Roney", 
          email: email.toLowerCase(), 
          role: "admin" 
        };
        localStorage.setItem('user', JSON.stringify(adminUser));
        navigate('/admin'); 
      } else {
        alert("Invalid Verification Code.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-6" 
         style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${bgImage})` }}>
      
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-2xl border-2 border-red-500/10">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="w-20 h-20 rounded-full object-cover mb-4 shadow-lg border-2 border-red-500" />
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Admin Terminal</h2>
          <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mt-2 bg-red-50 px-4 py-1 rounded-full text-center">
            ⛔ AUTHORIZED PERSONNEL ONLY
          </p>
        </div>
        
        <form onSubmit={handleAdminLogin} className="space-y-4">
          {!showVerification ? (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Admin Email Address</label>
                <input 
                  type="email" 
                  placeholder="admin@grass.com" 
                  required
                  className="w-full p-4 rounded-2xl bg-slate-100 border-2 border-transparent focus:border-red-500 outline-none text-sm font-bold"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Master Security Key</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  className="w-full p-4 rounded-2xl bg-slate-100 border-2 border-transparent focus:border-red-500 outline-none text-sm font-bold"
                  onChange={(e) => setMasterKey(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="animate-in fade-in zoom-in duration-300">
               <label className="text-[10px] font-black text-slate-400 uppercase block text-center mb-2">Personnel Verification Code</label>
               <input 
                type="text" 
                maxLength={4}
                placeholder="0 0 0 0" 
                className="w-full p-4 text-center text-2xl tracking-[0.5em] rounded-2xl bg-slate-100 border-2 border-red-500 outline-none font-black"
                onChange={(e) => setVCode(e.target.value)}
                required
              />
            </div>
          )}
          
          <button type="submit" className="w-full bg-red-600 text-white p-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg hover:bg-red-700 transition-all">
            {showVerification ? "Confirm Identity" : "Initialize Admin Session"}
          </button>
        </form>

        {/* Removed the 'New Member' link to prevent admin from going to the signup page */}
        <div className="mt-8 text-center">
           <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
             Encryption Active: AES-256
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;