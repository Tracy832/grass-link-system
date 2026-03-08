import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';
import supplementsBg from '../../assets/suplements.jpeg';

const MemberLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Create a "Fake" token for now (In the future, this comes from Django)
    localStorage.setItem('userToken', 'grass_international_session_abc123');
    localStorage.setItem('userRole', 'member');
    
    // Set default name if not present
    if (!localStorage.getItem('userName')) {
      localStorage.setItem('userName', 'Valued Member');
    }
    
    navigate('/dashboard'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${supplementsBg})` }}>
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-xs border border-white/30">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain mb-4 mx-auto rounded-full" />
          <h2 className="text-xl font-bold text-green-900 tracking-tight text-center">Member Login</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input required type="email" placeholder="Email Address" className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl outline-none" />
          <input required type="password" placeholder="Card Number" className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl outline-none" />
          <button type="submit" className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-all text-xs shadow-lg">LOG IN</button>
        </form>
        <div className="mt-8 text-center text-[11px] text-gray-600">
          New here? <Link to="/signup" className="text-green-800 font-bold hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default MemberLogin;