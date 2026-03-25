import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/logo.jpeg';
import supplementsBg from '../../assets/suplements.jpeg';
import { apiClient } from '../../services/api';

const MemberLogin: React.FC = () => {
  const navigate = useNavigate();

  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ 
          email: identifier, 
          password: password 
        })
      });

      
      localStorage.setItem('userToken', data.access_token);
      localStorage.setItem('userRole', data.user?.role || 'member');
      localStorage.setItem('userName', data.user?.name || 'Valued Member');
      localStorage.setItem('userId', data.user?.id); // Keep internal ID for safety
      localStorage.setItem('companyId', data.user?.company_id); // The new star of the show!
      
      navigate('/dashboard'); 

    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${supplementsBg})` }}>
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-xs border border-white/30 relative">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain mb-4 mx-auto rounded-full shadow-sm" />
          <h2 className="text-xl font-bold text-green-900 tracking-tight text-center">Member Login</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50/90 border-l-4 border-red-500 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded-r-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          
          <input 
            required 
            type="text" 
            placeholder="Email or Official ID (e.g. 0012345)" 
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.trim())}
            className="w-full px-4 py-2.5 text-sm bg-white/50 border border-white/50 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-gray-800" 
          />
          
          {/* Password Input Wrapper */}
          <div className="relative">
            <input 
              required 
              type={showPassword ? "text" : "password"} 
              placeholder="Card Number / Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 text-sm bg-white/50 border border-white/50 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-gray-800" 
            />
            <button
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-900/60 hover:text-green-900 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-all text-xs shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'AUTHENTICATING...' : 'LOG IN'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-[11px] text-gray-800 font-medium">
          New here? <Link to="/signup" className="text-green-900 font-black hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default MemberLogin;