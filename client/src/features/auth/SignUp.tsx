import React from 'react';
import supplementsBg from '../../assets/suplements.jpeg';

const SignUp = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${supplementsBg})` }}
    >
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-xs border border-white/30 relative">
        
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-green-900 leading-tight">
            Welcome to <br/> Grass International
          </h2>
          <p className="text-[10px] text-green-800/60 font-semibold tracking-widest mt-1 uppercase">
            Start your journey
          </p>
        </div>

        <form className="space-y-4">
          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Username</label>
            <input 
              type="text" 
              placeholder="Business Name" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" 
            />
          </div>

          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Email</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" 
            />
          </div>

          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Password</label>
            <input 
              type="password" 
              placeholder="Card No" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-gray-300 font-light" 
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