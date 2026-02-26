import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Car, ArrowRight, ExternalLink, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const VENMO_USERNAME = 'Dexter-Price-3';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const amount = searchParams.get('amount');
  const bookingRef = id?.slice(0, 8).toUpperCase();

  const venmoUrl = `https://venmo.com/?txn=pay&audience=private&recipients=${VENMO_USERNAME}&amount=${amount || '0'}&note=${encodeURIComponent(`GOT Transportation Ride #${bookingRef}`)}`;

  const copyId = () => { navigator.clipboard.writeText(bookingRef); toast.success('Copied!'); };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="card max-w-lg w-full text-center animate-fade-in-up">
        {/* Success icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-5">
          <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          <div className="relative bg-primary-500/10 border border-primary-500/30 rounded-full p-4">
            <CheckCircle size={40} className="text-primary-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h1>
        <p className="text-dark-500 mb-6">Your ride has been booked successfully.</p>

        <div className="bg-dark-800/60 border border-dark-700/50 rounded-2xl p-4 mb-5 text-left">
          <div className="text-xs text-dark-500 uppercase tracking-wider mb-1">Booking ID</div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-white">{bookingRef}</span>
            <button onClick={copyId} className="text-dark-500 hover:text-primary-400 transition-colors"><Copy size={14} /></button>
          </div>
        </div>

        {/* Venmo Payment */}
        <div className="bg-[#008CFF]/5 border border-[#008CFF]/20 rounded-2xl p-6 mb-6">
          <p className="text-sm font-semibold text-white mb-2">Complete Your Payment via Venmo</p>
          <p className="text-xs text-dark-400 mb-4">
            Send <span className="font-bold text-white">{amount ? `$${parseFloat(amount).toFixed(2)}` : 'your fare'}</span> to <span className="font-mono font-bold text-[#008CFF]">@{VENMO_USERNAME}</span>
          </p>
          <a
            href={venmoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#008CFF] hover:bg-[#0074d4] text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            <ExternalLink size={18} /> Open Venmo & Pay
          </a>
          <p className="text-[11px] text-dark-600 mt-3">Your ride will be confirmed once payment is received.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/my-rides" className="flex-1 bg-primary-500 hover:bg-primary-400 text-white font-bold py-3.5 px-6 rounded-full transition-all hover:shadow-glow-green flex items-center justify-center gap-2 text-sm">
            <Car size={16} /> View My Rides
          </Link>
          <Link to="/book" className="btn-outline flex-1 flex items-center justify-center gap-2 text-sm">
            Book Another <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
