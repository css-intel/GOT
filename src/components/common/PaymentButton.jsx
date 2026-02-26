import { useState } from 'react';
import { DollarSign, ExternalLink, X, ChevronUp } from 'lucide-react';

const VENMO_USERNAME = 'Dexter-Price-3';
const MVP_AMOUNT = '450.00';
const VENMO_URL = `https://venmo.com/?txn=pay&audience=private&recipients=${VENMO_USERNAME}&amount=${MVP_AMOUNT}&note=${encodeURIComponent('GOT Transportation - Interface Development Payment')}`;

export default function PaymentButton() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-24 z-[85]">
      {/* Expanded card */}
      {expanded && (
        <div className="absolute bottom-16 right-0 w-72 bg-dark-900 border border-dark-700/80 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-fade-in-up mb-2">
          <div className="relative bg-gradient-to-b from-[#008CFF]/10 to-transparent px-5 pt-4 pb-3">
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-3 right-3 text-dark-500 hover:text-white transition-colors p-1"
            >
              <X size={14} />
            </button>
            <h3 className="text-sm font-bold text-white mb-1">Ready to Get Started?</h3>
            <p className="text-xs text-dark-500">Approve the interface & move forward</p>
          </div>

          <div className="px-5 pb-5">
            <div className="text-center mb-3">
              <div className="text-2xl font-extrabold text-white">$450</div>
              <div className="text-[10px] text-dark-500">Interface Development Phase</div>
            </div>

            <a
              href={VENMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#008CFF] hover:bg-[#0074d4] text-white font-bold py-3 px-5 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
            >
              <ExternalLink size={16} /> Pay with Venmo
            </a>

            <p className="text-[10px] text-dark-600 text-center mt-2">
              Send to <span className="font-mono text-[#008CFF]">@{VENMO_USERNAME}</span>
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="group relative"
        aria-label="Payment options"
      >
        <div className={`relative text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
          expanded
            ? 'bg-dark-700 hover:bg-dark-600 shadow-dark-900/30'
            : 'bg-[#008CFF] hover:bg-[#0074d4] shadow-[#008CFF]/30 hover:shadow-[#008CFF]/50'
        }`}>
          {expanded ? <ChevronUp size={20} /> : <DollarSign size={22} />}
        </div>
      </button>
    </div>
  );
}
