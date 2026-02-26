import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMvp } from '../../context/MvpContext';
import { LayoutDashboard, MapPin, Users, LogOut, ArrowLeft, Menu, X, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { mvpUnlocked } = useMvp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/rides', icon: MapPin, label: 'Rides' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
  ];

  return (
    <div className="min-h-screen flex bg-dark-950">
      {/* Demo watermark */}
      {!mvpUnlocked && (
        <div className="watermark-overlay">
          <div className="watermark-text">Demo Version – Awaiting Approval Payment</div>
        </div>
      )}

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-dark-900 border-r border-dark-800 text-white flex flex-col fixed h-full z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-5 border-b border-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="G.O.T" className="w-10 h-10 rounded-xl object-contain" />
            <div>
              <span className="font-bold text-sm block text-white">G.O.T Admin</span>
              <span className="text-[10px] text-dark-500 uppercase tracking-wider">Management Panel</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-dark-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                location.pathname === to
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-dark-500 hover:text-white hover:bg-dark-800/60'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-800 space-y-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-dark-500 hover:text-primary-400 transition-colors">
            <ArrowLeft size={16} /> Back to Site
          </Link>
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-600 truncate">{user?.email}</span>
            <button onClick={() => { logout(); navigate('/'); }} className="text-dark-600 hover:text-rose-400 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-dark-900/50 backdrop-blur-lg border-b border-dark-800 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-dark-400 hover:text-white transition-colors">
                <Menu size={22} />
              </button>
              <h1 className="text-lg font-bold text-white">
                {links.find(l => l.to === location.pathname)?.label || 'Admin'}
              </h1>
            </div>
            {!mvpUnlocked && (
              <span className="badge bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs">Demo Mode</span>
            )}
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
