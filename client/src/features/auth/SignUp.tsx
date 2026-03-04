import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    // New users are always distributors
    const newUser = {
      name: name,
      email: email.toLowerCase(),
      role: "distributor",
      isLoggedIn: true
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    alert("Account created successfully!");
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 uppercase text-center mb-2">Join Grass</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-8">Start your journey today</p>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            required
            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#03ac13] outline-none text-sm font-bold transition-all"
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#03ac13] outline-none text-sm font-bold transition-all"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="w-full bg-[#03ac13] text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-green-700 transition-all">
            Create Account
          </button>
        </form>
        <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase">
          Already a member? <Link to="/" className="text-[#1d3557]">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;