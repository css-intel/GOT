import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, HeartPulse, Clock, Calendar, DollarSign, ExternalLink, ArrowRight, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function BookRide() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    serviceType: 'personal',
    scheduleType: 'asap',
    scheduledAt: '',
  });
  const [fare, setFare] = useState(null);
  const [fareLoading, setFareLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  // Google Maps Autocomplete
  useEffect(() => {
    if (window.google?.maps?.places) {
      initAutocomplete();
    } else if (import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    }
  }, []);

  function initAutocomplete() {
    if (!window.google?.maps?.places) return;
    const options = { types: ['address'], componentRestrictions: { country: 'us' } };

    const pickupAuto = new window.google.maps.places.Autocomplete(pickupRef.current, options);
    pickupAuto.addListener('place_changed', () => {
      const place = pickupAuto.getPlace();
      if (place.formatted_address) {
        setForm(f => ({ ...f, pickupAddress: place.formatted_address }));
      }
    });

    const dropoffAuto = new window.google.maps.places.Autocomplete(dropoffRef.current, options);
    dropoffAuto.addListener('place_changed', () => {
      const place = dropoffAuto.getPlace();
      if (place.formatted_address) {
        setForm(f => ({ ...f, dropoffAddress: place.formatted_address }));
      }
    });
  }

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const calculateFare = useCallback(async () => {
    if (!form.pickupAddress || !form.dropoffAddress) {
      return toast.error('Please enter both pickup and dropoff addresses');
    }
    setFareLoading(true);
    try {
      const result = await api.estimateFare({
        pickupAddress: form.pickupAddress,
        dropoffAddress: form.dropoffAddress,
        serviceType: form.serviceType,
      });
      setFare(result);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFareLoading(false);
    }
  }, [form.pickupAddress, form.dropoffAddress, form.serviceType]);

  const handleBook = async () => {
    if (!fare) return toast.error('Please calculate fare first');
    setBooking(true);
    try {
      const result = await api.createRide({
        pickupAddress: form.pickupAddress,
        dropoffAddress: form.dropoffAddress,
        serviceType: form.serviceType,
        isAsap: form.scheduleType === 'asap',
        scheduledAt: form.scheduleType === 'scheduled' ? form.scheduledAt : null,
        distanceMiles: fare.distanceMiles,
        fareAmount: fare.fareAmount,
      });
      toast.success('Ride booked! Opening Venmo to pay...');
      if (result.venmoUrl) {
        window.open(result.venmoUrl, '_blank');
      }
      navigate(`/booking-confirmation/${result.ride.id}?amount=${fare.fareAmount}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] py-10 md:py-16 px-4">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="section-heading !text-3xl md:!text-4xl mb-3">Book a Ride</h1>
          <p className="text-dark-500">Safe, reliable transportation at your fingertips</p>
        </div>

        <div className="card animate-fade-in-up space-y-6" style={{ animationDelay: '0.1s' }}>
          {/* Route inputs */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full" />
              <input
                ref={pickupRef}
                type="text"
                value={form.pickupAddress}
                onChange={update('pickupAddress')}
                className="input-field !pl-11"
                placeholder="Pickup location"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-rose-500 rounded-full" />
              <input
                ref={dropoffRef}
                type="text"
                value={form.dropoffAddress}
                onChange={update('dropoffAddress')}
                className="input-field !pl-11"
                placeholder="Dropoff destination"
                required
              />
            </div>
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Service Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, serviceType: 'personal' }))}
                className={`p-4 rounded-2xl border transition-all text-center group ${
                  form.serviceType === 'personal'
                    ? 'border-primary-500/50 bg-primary-500/10'
                    : 'border-dark-700 hover:border-dark-600'
                }`}
              >
                <Car size={28} className={`mx-auto mb-2 ${form.serviceType === 'personal' ? 'text-primary-400' : 'text-dark-500'}`} />
                <div className={`font-semibold text-sm ${form.serviceType === 'personal' ? 'text-primary-400' : 'text-dark-300'}`}>Personal</div>
                <div className="text-xs text-dark-600 mt-0.5">Standard ride</div>
              </button>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, serviceType: 'medical_courier' }))}
                className={`p-4 rounded-2xl border transition-all text-center group ${
                  form.serviceType === 'medical_courier'
                    ? 'border-rose-500/50 bg-rose-500/10'
                    : 'border-dark-700 hover:border-dark-600'
                }`}
              >
                <HeartPulse size={28} className={`mx-auto mb-2 ${form.serviceType === 'medical_courier' ? 'text-rose-400' : 'text-dark-500'}`} />
                <div className={`font-semibold text-sm ${form.serviceType === 'medical_courier' ? 'text-rose-400' : 'text-dark-300'}`}>Medical Courier</div>
                <div className="text-xs text-dark-600 mt-0.5">+$10 flat fee</div>
              </button>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">When</label>
            <div className="flex gap-3 mb-3">
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, scheduleType: 'asap' }))}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                  form.scheduleType === 'asap'
                    ? 'border-primary-500/50 bg-primary-500/10 text-primary-400'
                    : 'border-dark-700 text-dark-400 hover:border-dark-600'
                }`}
              >
                <Clock size={15} /> ASAP
              </button>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, scheduleType: 'scheduled' }))}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                  form.scheduleType === 'scheduled'
                    ? 'border-primary-500/50 bg-primary-500/10 text-primary-400'
                    : 'border-dark-700 text-dark-400 hover:border-dark-600'
                }`}
              >
                <Calendar size={15} /> Schedule
              </button>
            </div>
            {form.scheduleType === 'scheduled' && (
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={update('scheduledAt')}
                className="input-field"
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            )}
          </div>

          {/* Get Fare */}
          <button
            onClick={calculateFare}
            disabled={fareLoading || !form.pickupAddress || !form.dropoffAddress}
            className="btn-outline w-full flex items-center justify-center gap-2"
          >
            {fareLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <><DollarSign size={16} /> Get Price Estimate</>
            )}
          </button>

          {/* Fare Display */}
          {fare && (
            <div className="bg-dark-800/60 border border-dark-700/50 rounded-2xl p-5 animate-fade-in-up">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                <Navigation size={16} className="text-primary-400" /> Fare Breakdown
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-dark-500">Distance</span><span className="text-dark-300 font-medium">{fare.distanceMiles} mi</span></div>
                <div className="flex justify-between"><span className="text-dark-500">Base Fare</span><span className="text-dark-300 font-medium">${fare.baseFare.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-dark-500">Mileage ({fare.distanceMiles} mi × ${fare.perMileRate})</span><span className="text-dark-300 font-medium">${(fare.distanceMiles * fare.perMileRate).toFixed(2)}</span></div>
                {fare.medicalSurcharge > 0 && (
                  <div className="flex justify-between"><span className="text-dark-500">Medical Courier Fee</span><span className="text-rose-400 font-medium">${fare.medicalSurcharge.toFixed(2)}</span></div>
                )}
                <div className="border-t border-dark-700 pt-3 mt-3 flex justify-between">
                  <span className="font-bold text-white">Total</span>
                  <span className="text-2xl font-extrabold text-primary-400">${fare.fareAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Book Button */}
          {fare && (
            <button
              onClick={handleBook}
              disabled={booking}
              className="w-full bg-primary-500 hover:bg-primary-400 text-white font-bold py-4 px-8 rounded-full text-base transition-all duration-300 hover:shadow-glow-green flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {booking ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>Book & Pay via Venmo — ${fare.fareAmount.toFixed(2)} <ArrowRight size={18} /></>
              )}
            </button>
          )}

          {/* Venmo info */}
          {fare && (
            <div className="flex items-center justify-center gap-2 text-xs text-dark-500">
              <ExternalLink size={12} />
              Payment via Venmo to <span className="font-mono font-bold text-[#008CFF]">@Dexter-Price-3</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
