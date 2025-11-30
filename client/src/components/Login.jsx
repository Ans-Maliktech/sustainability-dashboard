import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // DEMO CREDENTIALS
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('auth', 'true');
      setIsAuthenticated(true);
      navigate('/'); // Go to Dashboard
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">System Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm">Username</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 text-white focus:border-blue-500 outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input 
                type="password" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 text-white focus:border-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold transition">
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;