import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';
import supplementsBg from '../../assets/suplements.jpeg';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    cardNumber: ''
  });

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save all details to session
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', 'member');
    localStorage.setItem('userName', formData.username);
    localStorage.setItem('userEmail', formData.email);

    // Simulate creation delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${supplementsBg})` }}>
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-xs border border-white/30 relative">
        
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain mb-3 rounded-full shadow-sm" />
          <h2 className="text-xl font-bold text-green-900 leading-tight text-center">Join <br/> Grass International</h2>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* USERNAME */}
          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Username</label>
            <input 
              required
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Business Name" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800" 
            />
          </div>

          {/* EMAIL */}
          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="example@mail.com" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800" 
            />
          </div>

          {/* CARD NUMBER (PASSWORD) */}
          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Card Number (Password)</label>
            <input 
              required
              type="password" 
              value={formData.cardNumber}
              onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
              placeholder="GI-XXXX-2026" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full py-3 rounded-xl font-bold text-xs shadow-lg mt-4 text-white bg-green-700 hover:bg-green-800 transition-all active:scale-95"
          >
            {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] text-gray-600">
          Already a member? <Link to="/login" className="text-green-800 font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;