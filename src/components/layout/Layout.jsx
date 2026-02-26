import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'glass-nav shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 group">
              <img src="/logo.png" alt="G.O.T Transportation" className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/book', label: 'Book a Ride' },
                ...(user ? [{ to: '/my-rides', label: 'My Rides' }] : []),
                ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel' }] : []),
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? 'bg-white/10 text-white'
                      : 'text-dark-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="w-px h-6 bg-dark-700 mx-2" />

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800/60 border border-dark-700/50">
                    <div className="w-6 h-6 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center text-xs font-bold">
                      {user.firstName?.[0]}
                    </div>
                    <span className="text-sm text-dark-300 font-medium">{user.firstName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-dark-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                    title="Log out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white transition-colors">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary !py-2.5 !px-5 text-sm inline-flex items-center gap-1.5">
                    Sign up <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-xl text-dark-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden bg-dark-950/98 backdrop-blur-2xl border-t border-dark-800/50 animate-fade-in-down">
            <div className="px-4 py-4 space-y-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/book', label: 'Book a Ride' },
                ...(user ? [{ to: '/my-rides', label: 'My Rides' }] : []),
                ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel' }] : []),
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.to
                      ? 'bg-white/10 text-white'
                      : 'text-dark-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="glow-line my-3" />
              {user ? (
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 font-medium transition-all">
                  Log Out
                </button>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="btn-outline flex-1 text-center !py-3">Log In</Link>
                  <Link to="/register" className="btn-primary flex-1 text-center !py-3">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-[72px]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark-950 border-t border-dark-800/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <img src="/logo.png" alt="G.O.T Transportation" className="h-20 w-auto object-contain" />
              </div>
              <p className="text-dark-500 text-sm leading-relaxed max-w-sm">
                Professional personal and medical transportation services. Safe, reliable, and always on time.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-white text-xs tracking-widest uppercase mb-4">Quick Links</h4>
              <div className="space-y-3">
                <Link to="/book" className="block text-sm text-dark-400 hover:text-primary-400 transition-colors">Book a Ride</Link>
                <Link to="/register" className="block text-sm text-dark-400 hover:text-primary-400 transition-colors">Create Account</Link>
                <Link to="/login" className="block text-sm text-dark-400 hover:text-primary-400 transition-colors">Sign In</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white text-xs tracking-widest uppercase mb-4">Contact</h4>
              <div className="space-y-3 text-sm text-dark-400">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-dark-600" />
                  support@gottransportation.com
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-dark-600" />
                  Available 24/7
                </div>
              </div>
            </div>
          </div>

          <div className="glow-line mt-10 mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-dark-600">
              &copy; {new Date().getFullYear()} Nita Jr. Get On Through (G.O.T) Transportation. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs text-dark-700">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
