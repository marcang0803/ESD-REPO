import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'user') navigate('/dashboard');
    else if (role === 'provider') navigate('/provider-dashboard');
    else if (role === 'admin') navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">FitFlow</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-2 mb-8 bg-navy-light rounded-xl p-1">
          {['user', 'provider', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors capitalize ${
                role === r
                  ? 'bg-cyan text-navy-dark'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Email</label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-3 text-cyan" />
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-navy-light border border-navy-light rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Password</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-3 text-cyan" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-navy-light border border-navy-light rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan text-navy-dark font-bold py-3 rounded-xl hover:bg-cyan-light transition-colors flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight size={20} />
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="bg-navy-light rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-2">Demo Credentials:</p>
          <p className="text-xs text-cyan font-mono">demo@fitflow.com</p>
          <p className="text-xs text-cyan font-mono">password123</p>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <button className="text-cyan font-semibold hover:text-cyan-light transition-colors">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
