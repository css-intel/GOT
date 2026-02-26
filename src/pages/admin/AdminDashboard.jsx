import { useState, useEffect } from 'react';
import { DollarSign, Car, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import api from '../../utils/api';
import { useMvp } from '../../context/MvpContext';

export default function AdminDashboard() {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const { mvpUnlocked } = useMvp();

  useEffect(() => {
    api.getRevenue()
      .then(setRevenue)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-400 border-t-transparent" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: `$${(revenue?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'bg-primary-500/10 text-primary-400' },
    { label: 'Total Rides', value: revenue?.totalRides || 0, icon: Car, color: 'bg-accent-blue/10 text-accent-blue' },
    { label: 'Completed', value: revenue?.completedRides || 0, icon: CheckCircle, color: 'bg-accent-purple/10 text-accent-purple' },
    { label: 'Pending', value: revenue?.pendingRides || 0, icon: Clock, color: 'bg-accent-amber/10 text-accent-amber' },
  ];

  return (
    <div>
      {!mvpUnlocked && (
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="bg-rose-500/10 p-2.5 rounded-xl"><Clock size={18} className="text-rose-400" /></div>
          <div>
            <p className="font-semibold text-rose-400 text-sm">Demo Mode Active</p>
            <p className="text-dark-500 text-xs">Full admin functionality will be enabled after MVP approval payment.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className="card hover:border-dark-600 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-dark-500 uppercase tracking-wider font-medium">{label}</span>
              <div className={`p-2 rounded-xl ${color}`}><Icon size={16} /></div>
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={18} className="text-primary-400" />
          <h2 className="text-base font-bold text-white">Revenue Summary</h2>
        </div>
        <div className="bg-dark-800/60 border border-dark-700/50 rounded-2xl p-8 text-center">
          <div className="text-5xl font-extrabold text-primary-400 mb-2">${(revenue?.totalRevenue || 0).toFixed(2)}</div>
          <p className="text-dark-500 text-sm">Total revenue from completed rides</p>
          <div className="flex justify-center gap-10 mt-6">
            <div>
              <div className="text-xl font-bold text-white">{revenue?.completedRides || 0}</div>
              <div className="text-xs text-dark-600 uppercase tracking-wider">Completed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{revenue?.pendingRides || 0}</div>
              <div className="text-xs text-dark-600 uppercase tracking-wider">Pending</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{revenue?.totalRides || 0}</div>
              <div className="text-xs text-dark-600 uppercase tracking-wider">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
