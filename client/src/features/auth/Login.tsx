import React from 'react';
import supplementsBg from '../../assets/suplements.jpeg';

const Login = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${supplementsBg})` }}
    >
      {/* Clean Glass Container */}
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-xs border border-white/30 relative">
        
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-green-900 tracking-tight">
            Welcome Back!
          </h2>
          <p className="text-[10px] text-green-800/60 font-semibold tracking-widest mt-1 uppercase">
            Log in to your account
          </p>
        </div>

        <form className="space-y-4">
          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Email Address</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" 
            />
          </div>

          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Password</label>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-gray-300 font-light" 
            />
          </div>

          <button className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-all text-xs shadow-lg mt-4 active:scale-95">
            LOG IN
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-gray-600">
            Don't have an account? 
            <a href="/signup" className="ml-1 text-green-800 font-bold hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;