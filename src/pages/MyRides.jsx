import { useState, useEffect } from 'react';
import { MapPin, Clock, Car, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

export default function MyRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRides()
      .then(setRides)
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] py-10 md:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <h1 className="section-heading !text-3xl">My Rides</h1>
          <Link to="/book" className="bg-primary-500 hover:bg-primary-400 text-white font-bold py-2.5 px-6 rounded-full text-sm transition-all hover:shadow-glow-green">Book Ride</Link>
        </div>

        {rides.length === 0 ? (
          <div className="card text-center py-16 animate-fade-in-up">
            <Car size={48} className="mx-auto text-dark-600 mb-4" />
            <p className="text-dark-500 mb-4">No rides yet. Book your first ride!</p>
            <Link to="/book" className="bg-primary-500 hover:bg-primary-400 text-white font-bold py-3 px-8 rounded-full text-sm transition-all hover:shadow-glow-green inline-flex items-center gap-2">
              <Car size={16} /> Get Started
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rides.map((ride, i) => (
              <div key={ride.id} className="card hover:border-dark-600 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${ride.service_type === 'medical_courier' ? 'bg-rose-500/10' : 'bg-primary-500/10'}`}>
                      {ride.service_type === 'medical_courier' ? (
                        <HeartPulse size={16} className="text-rose-400" />
                      ) : (
                        <Car size={16} className="text-primary-400" />
                      )}
                    </div>
                    <span className="font-semibold text-white text-sm">
                      {ride.service_type === 'medical_courier' ? 'Medical Courier' : 'Personal'}
                    </span>
                  </div>
                  <span className={statusColors[ride.status]}>{ride.status}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 bg-primary-500 rounded-full mt-1.5 shrink-0" />
                    <div>
                      <div className="text-[10px] text-dark-600 uppercase tracking-wider">Pickup</div>
                      <div className="text-dark-300 text-xs">{ride.pickup_address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                    <div>
                      <div className="text-[10px] text-dark-600 uppercase tracking-wider">Dropoff</div>
                      <div className="text-dark-300 text-xs">{ride.dropoff_address}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-800">
                  <span className="text-xs text-dark-600 flex items-center gap-1">
                    <Clock size={11} />
                    {ride.is_asap ? 'ASAP' : new Date(ride.scheduled_at).toLocaleString()}
                    {' · '}{new Date(ride.created_at).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-primary-400">${parseFloat(ride.fare_amount).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
