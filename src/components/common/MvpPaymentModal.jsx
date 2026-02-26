import { useState, useEffect } from 'react';
import { useMvp } from '../../context/MvpContext';
import { ExternalLink, ArrowRight, ArrowLeft, CheckCircle, Rocket, Wrench, Database } from 'lucide-react';

const VENMO_USERNAME = 'Dexter-Price-3';
const MVP_AMOUNT = '450.00';
const MVP_NOTE = 'GOT Transportation - Interface Development Payment';
const VENMO_URL = `https://venmo.com/?txn=pay&audience=private&recipients=${VENMO_USERNAME}&amount=${MVP_AMOUNT}&note=${encodeURIComponent(MVP_NOTE)}`;

const STEPS = [
  {
    id: 'overview',
    title: 'Your MVP Is Ready',
    subtitle: 'Here\'s how we move forward',
  },
  {
    id: 'step1',
    title: 'Step 1 — Interface Development',
    subtitle: 'Current phase',
  },
  {
    id: 'step2',
    title: 'Step 2 — Full Development & Deployment',
    subtitle: 'Coming next',
  },
  {
    id: 'payment',
    title: 'Complete Payment',
    subtitle: 'Interface Development',
  },
];

export default function MvpPaymentModal() {
  const { mvpUnlocked } = useMvp();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (mvpUnlocked || dismissed) return;

    const timer = setTimeout(() => {
      setShow(true);
    }, 120000);

    return () => clearTimeout(timer);
  }, [mvpUnlocked, dismissed]);

  if (!show || mvpUnlocked) return null;

  const currentStep = STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-dark-950/90 backdrop-blur-md" />

      <div className="relative bg-dark-900 border border-dark-800 rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="relative p-8 pb-5 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent" />
          <div className="relative">
            <img src="/logo.png" alt="G.O.T Transportation" className="h-20 w-auto object-contain mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-1">{currentStep.title}</h2>
            <p className="text-dark-500 text-sm">{currentStep.subtitle}</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 px-8 pb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-primary-500' : i < step ? 'w-4 bg-primary-500/40' : 'w-4 bg-dark-700'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-8 pb-8">

          {/* ─── STEP 0: Overview ─── */}
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="bg-dark-800/60 border border-dark-700/50 rounded-2xl p-5 mb-5 text-center">
                <p className="text-dark-400 text-sm mb-4">
                  You're reviewing the MVP for <span className="font-semibold text-white">G.O.T Transportation</span>. The project is split into two clear phases:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-dark-900/60 rounded-xl text-left">
                    <div className="w-10 h-10 bg-primary-500/15 rounded-xl flex items-center justify-center shrink-0">
                      <Wrench size={18} className="text-primary-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Interface Development</div>
                      <div className="text-xs text-dark-500">UI design, pages, booking flow</div>
                    </div>
                    <div className="ml-auto text-lg font-bold text-primary-400">$450</div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-dark-900/60 rounded-xl text-left">
                    <div className="w-10 h-10 bg-blue-500/15 rounded-xl flex items-center justify-center shrink-0">
                      <Database size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Full Development & Deploy</div>
                      <div className="text-xs text-dark-500">Database, backend, go live</div>
                    </div>
                    <div className="ml-auto text-lg font-bold text-blue-400">$450</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="w-full bg-white hover:bg-dark-100 text-dark-950 font-bold py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2"
              >
                See Details <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* ─── STEP 1: Interface Development ─── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="bg-dark-800/60 border border-primary-500/20 rounded-2xl p-5 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <Wrench size={16} className="text-white" />
                  </div>
                  <div className="text-lg font-bold text-white">$450</div>
                  <span className="ml-auto badge bg-primary-500/15 text-primary-400 border border-primary-500/20 text-[10px]">CURRENT PHASE</span>
                </div>
                <p className="text-dark-400 text-sm mb-3">This covers everything you see now:</p>
                <ul className="space-y-2">
                  {[
                    'Complete UI/UX design & branding',
                    'Home, booking, confirmation pages',
                    'Admin dashboard & ride management',
                    'Login & registration system',
                    'Venmo payment integration',
                    'Mobile-responsive design',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-dark-300">
                      <CheckCircle size={14} className="text-primary-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="px-5 py-3.5 rounded-full border border-dark-700 text-dark-400 hover:text-white hover:border-dark-500 transition-all text-sm font-medium"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-white hover:bg-dark-100 text-dark-950 font-bold py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2"
                >
                  What's Next <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Full Development ─── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="bg-dark-800/60 border border-blue-500/20 rounded-2xl p-5 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Rocket size={16} className="text-white" />
                  </div>
                  <div className="text-lg font-bold text-white">$450</div>
                  <span className="ml-auto badge bg-blue-500/15 text-blue-400 border border-blue-500/20 text-[10px]">NEXT PHASE</span>
                </div>
                <p className="text-dark-400 text-sm mb-3">After interface approval, this phase includes:</p>
                <ul className="space-y-2">
                  {[
                    'Database setup & wiring (Supabase)',
                    'Full backend API deployment',
                    'User authentication (live)',
                    'Real ride booking & tracking',
                    'Admin controls fully operational',
                    'Production deployment & domain setup',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-dark-300">
                      <div className="w-3.5 h-3.5 rounded-full border border-dark-600 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3.5 rounded-full border border-dark-700 text-dark-400 hover:text-white hover:border-dark-500 transition-all text-sm font-medium"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-primary-500 hover:bg-primary-400 text-white font-bold py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2"
                >
                  Approve & Pay $450 <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Payment ─── */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="bg-dark-800/60 border border-dark-700/50 rounded-2xl p-5 mb-5 text-center">
                <div className="text-xs text-dark-600 uppercase tracking-wider mb-2">Interface Development</div>
                <div className="text-4xl font-extrabold text-white mb-1">$450</div>
                <p className="text-dark-500 text-sm">
                  Covers the complete interface you've just reviewed.
                </p>
                <div className="glow-line my-4" />
                <p className="text-xs text-dark-600">
                  Full development & deployment ($450) will be invoiced separately once this phase is approved.
                </p>
              </div>

              <a
                href={VENMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#008CFF] hover:bg-[#0074d4] text-white font-bold py-4 px-6 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg mb-3"
              >
                <ExternalLink size={22} />
                Pay $450 via Venmo
              </a>

              <div className="flex items-center justify-center gap-1 text-xs text-dark-600">
                Send to <span className="font-mono font-bold text-[#008CFF]">@{VENMO_USERNAME}</span>
              </div>

              <button
                onClick={() => setStep(0)}
                className="w-full mt-4 text-dark-600 hover:text-dark-400 text-xs font-medium transition-colors"
              >
                ← Back to overview
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
