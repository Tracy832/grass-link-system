import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';
import supplementsBg from '../../assets/suplements.jpeg';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // SAVE THE NAME FOR THE DASHBOARD
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', 'member');
    localStorage.setItem('userName', username); // <--- SAVING THE USERNAME

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
          <div className="group">
            <label className="text-[10px] font-bold text-green-900 uppercase ml-1 opacity-60">Username</label>
            <input 
              required
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} // <--- CAPTURING INPUT
              placeholder="Business Name" 
              className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800" 
            />
          </div>
          {/* ... email and password inputs stay the same ... */}
          <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl font-bold text-xs shadow-lg mt-4 text-white bg-green-700">
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