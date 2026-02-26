import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Shield, Users, Code, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showDevLogin, setShowDevLogin] = useState(false);
  const [devUser, setDevUser] = useState('');
  const [devPass, setDevPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const quickLogin = async (email, password, label) => {
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome, ${user.firstName}!`);
      navigate(user.role === 'admin' || user.role === 'developer' ? '/admin' : '/book');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = async (e) => {
    e.preventDefault();
    if (!devUser.trim() || !devPass.trim()) return toast.error('Enter credentials');
    await quickLogin(devUser.trim(), devPass.trim(), 'Developer');
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="card max-w-md w-full animate-fade-in-up">
        <div className="text-center mb-8">
          <img src="/icon.png" alt="G.O.T" className="w-20 h-20 mx-auto mb-4 rounded-2xl object-contain" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome to G.O.T</h1>
          <p className="text-dark-500 text-sm mt-2">Choose how you'd like to explore the demo</p>
        </div>

        <div className="space-y-3">
          {/* Admin login */}
          <button
            onClick={() => quickLogin('admin@gottransportation.com', 'admin123', 'Admin')}
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-glow-green flex items-center gap-4 group disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
              <Shield size={22} />
            </div>
            <div className="text-left flex-1">
              <div className="text-base font-bold">Sign in as Admin</div>
              <div className="text-xs text-white/60">Manage rides, customers & revenue</div>
            </div>
            <ArrowRight size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Demo rider login */}
          <button
            onClick={() => quickLogin('demo@example.com', 'demo123', 'Demo Rider')}
            disabled={loading}
            className="w-full bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-dark-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center gap-4 group disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center shrink-0">
              <Users size={22} className="text-primary-400" />
            </div>
            <div className="text-left flex-1">
              <div className="text-base font-bold">Sign in as Rider</div>
              <div className="text-xs text-dark-500">Book rides, view history & pay</div>
            </div>
            <ArrowRight size={18} className="text-dark-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-dark-500">
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-400 border-t-transparent" />
            Signing in...
          </div>
        )}

        <div className="glow-line my-6" />

        <p className="text-center text-sm text-dark-500">
          New user? <Link to="/register" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">Create an Account</Link>
        </p>

        {/* Developer login section */}
        <div className="mt-4 pt-4 border-t border-dark-800/50">
          <button
            onClick={() => setShowDevLogin(!showDevLogin)}
            className="w-full flex items-center justify-center gap-2 text-xs text-dark-600 hover:text-dark-400 transition-colors"
          >
            <Code size={12} />
            <span>Developer Access</span>
          </button>

          {showDevLogin && (
            <form onSubmit={handleDevLogin} className="mt-3 space-y-2 animate-fade-in">
              <input
                type="text"
                value={devUser}
                onChange={e => setDevUser(e.target.value)}
                placeholder="Username"
                className="w-full bg-dark-800/60 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-600 focus:outline-none focus:border-primary-500/50 transition-colors"
              />
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={devPass}
                  onChange={e => setDevPass(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-dark-800/60 border border-dark-700 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-dark-600 focus:outline-none focus:border-primary-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-600 hover:text-dark-400 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dark-800 hover:bg-dark-700 border border-dark-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Code size={14} /> Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
