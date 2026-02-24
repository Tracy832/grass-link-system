import React from 'react';
import logo from '../../assets/logo.jpeg';
import supplementsBg from '../../assets/suplements.jpeg';

const SignUp = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${supplementsBg})` }}
    >
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-xs border border-white/30 relative">
        
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain mb-3 drop-shadow-sm" />
          <h2 className="text-xl font-bold text-green-900 leading-tight text-center">Join <br/> Grass International</h2>
        </div>

        <form className="space-y-4">
          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Username</label>
            <input 
              type="text" 
              placeholder="Business Name" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none placeholder:text-gray-400 text-gray-800" 
            />
          </div>

          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Email</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none placeholder:text-gray-400 text-gray-800" 
            />
          </div>

          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Password</label>
            <input 
              type="password" 
              placeholder="Enter Card No" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none placeholder:text-gray-400 text-gray-800" 
            />
          </div>

          <button className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-all text-xs shadow-lg mt-4 active:scale-95">
            CREATE ACCOUNT
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] text-gray-600">
          Already a member? <a href="/" className="text-green-800 font-bold hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;