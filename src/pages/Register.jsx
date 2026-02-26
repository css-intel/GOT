import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password });
      toast.success('Account created successfully!');
      navigate('/book');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="card max-w-md w-full animate-fade-in-up">
        <div className="text-center mb-8">
          <img src="/icon.png" alt="G.O.T" className="w-20 h-20 mx-auto mb-4 rounded-2xl object-contain" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h1>
          <p className="text-dark-500 text-sm mt-2">Join G.O.T Transportation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">First Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-600" />
                <input type="text" value={form.firstName} onChange={update('firstName')} required className="input-field !pl-11" placeholder="John" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Last Name</label>
              <input type="text" value={form.lastName} onChange={update('lastName')} required className="input-field" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-600" />
              <input type="email" value={form.email} onChange={update('email')} required className="input-field !pl-11" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Phone <span className="text-dark-600 normal-case">(optional)</span></label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-600" />
              <input type="tel" value={form.phone} onChange={update('phone')} className="input-field !pl-11" placeholder="(555) 123-4567" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-600" />
              <input type="password" value={form.password} onChange={update('password')} required className="input-field !pl-11" placeholder="At least 6 characters" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-600" />
              <input type="password" value={form.confirm} onChange={update('confirm')} required className="input-field !pl-11" placeholder="Re-enter password" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 !mt-6">
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-dark-950 border-t-transparent" />
            ) : (
              <>Create Account <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="glow-line my-6" />

        <p className="text-center text-sm text-dark-500">
          Already have an account? <Link to="/login" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
