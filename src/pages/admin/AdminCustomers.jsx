import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCustomers()
      .then(setCustomers)
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-dark-500">{customers.length} customers registered</p>
      </div>

      {customers.length === 0 ? (
        <div className="card text-center py-16">
          <Users size={48} className="mx-auto text-dark-600 mb-4" />
          <p className="text-dark-500">No customers yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer, i) => (
            <div key={customer.id} className="card hover:border-dark-600 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-500/10 text-primary-400 rounded-xl flex items-center justify-center font-bold text-sm">
                  {customer.first_name?.[0]}{customer.last_name?.[0]}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{customer.first_name} {customer.last_name}</div>
                </div>
              </div>
              <div className="space-y-2 text-xs text-dark-500">
                <div className="flex items-center gap-2">
                  <Mail size={11} /> <span className="text-dark-400">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={11} /> <span className="text-dark-400">{customer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={11} /> Joined {new Date(customer.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
