import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';
// Note: Make sure the path to your image is correct!
import supplementsBg from '../../assets/suplements.jpeg'; 
import { apiClient } from '../../services/api';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 1. Added phone to the state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '', 
    cardNumber: ''
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 2. Send data to the FastAPI registration endpoint
      await apiClient('/distributors/register', {
        method: 'POST',
        body: JSON.stringify({
          full_name: formData.username, 
          email: formData.email,
          phone: formData.phone,
          password: formData.cardNumber 
        })
      });

      // 3. On success, send them to the login page to authenticate
      navigate('/login');

    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${supplementsBg})` }}>
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-xs border border-white/30 relative">
        
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain mb-3 rounded-full shadow-sm" />
          <h2 className="text-xl font-bold text-green-900 leading-tight text-center">Join <br/> Grass International</h2>
        </div>

        {/* Display backend errors */}
        {error && (
          <div className="mb-4 p-3 bg-red-50/90 border-l-4 border-red-500 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded-r-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* USERNAME / FULL NAME */}
          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Business or Full Name" 
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

          {/* PHONE (NEW) */}
          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Phone Number</label>
            <input 
              required
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+254..." 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800" 
            />
          </div>

          {/* PASSWORD */}
          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Access Key (Password)</label>
            <input 
              required
              type="password" 
              value={formData.cardNumber}
              onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
              placeholder="Create a strong password" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full py-3 rounded-xl font-bold text-xs shadow-lg mt-4 text-white bg-green-700 hover:bg-green-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] text-gray-800 font-medium">
          Already a member? <Link to="/login" className="text-green-900 font-black hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;