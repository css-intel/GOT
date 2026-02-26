import { useState, useEffect } from 'react';
import { MapPin, Clock, Car, HeartPulse, ChevronDown, DollarSign } from 'lucide-react';
import api from '../../utils/api';
import { useMvp } from '../../context/MvpContext';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function AdminRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { mvpUnlocked } = useMvp();

  useEffect(() => {
    api.getRides()
      .then(setRides)
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (rideId, newStatus) => {
    if (!mvpUnlocked) {
      return toast.error('Demo mode — MVP payment required');
    }
    try {
      const updated = await api.updateRideStatus(rideId, newStatus);
      setRides(prev => prev.map(r => r.id === rideId ? { ...r, ...updated } : r));
      toast.success(`Ride status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleConfirmPayment = async (rideId) => {
    if (!mvpUnlocked) {
      return toast.error('Demo mode — MVP payment required');
    }
    try {
      const updated = await api.confirmPayment(rideId);
      setRides(prev => prev.map(r => r.id === rideId ? { ...r, ...updated } : r));
      toast.success('Payment confirmed — ride status updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = filter === 'all' ? rides : rides.filter(r => r.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...statuses].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === s
                ? 'bg-primary-500 text-white'
                : 'bg-dark-800 text-dark-400 border border-dark-700 hover:border-dark-600'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s === 'all' ? ` (${rides.length})` : ` (${rides.filter(r => r.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Car size={48} className="mx-auto text-dark-600 mb-4" />
          <p className="text-dark-500">No rides found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ride, i) => (
            <div key={ride.id} className="card hover:border-dark-600 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${ride.service_type === 'medical_courier' ? 'bg-rose-500/10' : 'bg-primary-500/10'}`}>
                    {ride.service_type === 'medical_courier' ? (
                      <HeartPulse size={16} className="text-rose-400" />
                    ) : (
                      <Car size={16} className="text-primary-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {ride.first_name} {ride.last_name}
                    </div>
                    <div className="text-xs text-dark-500">{ride.email} · {ride.phone || 'No phone'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={statusColors[ride.status]}>{ride.status}</span>
                  <div className="relative">
                    <select
                      value={ride.status}
                      onChange={(e) => handleStatusChange(ride.id, e.target.value)}
                      disabled={!mvpUnlocked}
                      className="appearance-none bg-dark-800 border border-dark-700 rounded-xl px-3 py-1.5 pr-8 text-xs font-medium text-dark-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-dark-600"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0" />
                  <span className="text-dark-400 text-xs">{ride.pickup_address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                  <span className="text-dark-400 text-xs">{ride.dropoff_address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-dark-800 text-xs text-dark-600">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {ride.is_asap ? 'ASAP' : new Date(ride.scheduled_at).toLocaleString()}
                  {' · '}{new Date(ride.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  {ride.payment_status !== 'paid' && (
                    <button
                      onClick={() => handleConfirmPayment(ride.id)}
                      disabled={!mvpUnlocked}
                      className="inline-flex items-center gap-1 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-xs font-semibold transition-colors disabled:opacity-40"
                      title="Mark Venmo payment as received"
                    >
                      <DollarSign size={11} /> Venmo Received
                    </button>
                  )}
                  {ride.payment_status === 'paid' && (
                    <span className="badge bg-primary-500/10 text-primary-400 border border-primary-500/20">Paid</span>
                  )}
                  <span className="font-bold text-primary-400 text-sm">${parseFloat(ride.fare_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
