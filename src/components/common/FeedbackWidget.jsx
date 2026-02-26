import { useState, useEffect, useRef } from 'react';
import { MessageSquarePlus, X, Mic, MicOff, Send, Check, ExternalLink, Sparkles, ChevronRight, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const VENMO_USERNAME = 'Dexter-Price-3';
const MAX_FREE_EDITS = 3;
const STORAGE_KEY = 'got_client_feedback';

function getFeedback() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveFeedback(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState(getFeedback);
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pulse, setPulse] = useState(true);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  const editsUsed = feedback.length;
  const editsLeft = Math.max(0, MAX_FREE_EDITS - editsUsed);
  const allUsed = editsUsed >= MAX_FREE_EDITS;

  // Pulse the button for first 10 seconds to attract attention
  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-focus textarea when panel opens
  useEffect(() => {
    if (open && !allUsed && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [open, allUsed]);

  // ── Voice Recognition ──────────────────────────────────────
  const SpeechRecognition = typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

  const startRecording = () => {
    if (!SpeechRecognition) {
      toast.error('Voice input not supported in this browser');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = text;

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? ' ' : '') + transcript;
        } else {
          interim = transcript;
        }
      }
      setText(finalTranscript + (interim ? ' ' + interim : ''));
    };

    recognition.onerror = () => {
      setRecording(false);
      toast.error('Voice recognition error — try again');
    };

    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  // ── Submit Feedback ─────────────────────────────────────────
  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return toast.error('Please enter your feedback');
    if (allUsed) return;

    setSubmitting(true);

    // Simulate a brief processing delay
    await new Promise(r => setTimeout(r, 800));

    const newItem = {
      id: Date.now(),
      text: trimmed,
      timestamp: new Date().toISOString(),
      editNumber: editsUsed + 1,
    };

    const updated = [...feedback, newItem];
    setFeedback(updated);
    saveFeedback(updated);
    setText('');
    setSubmitting(false);
    setJustSubmitted(true);

    // If this was the 3rd edit, show payment after a beat
    if (updated.length >= MAX_FREE_EDITS) {
      setTimeout(() => {
        setJustSubmitted(false);
        setShowPayment(true);
      }, 2000);
    } else {
      setTimeout(() => setJustSubmitted(false), 2000);
      toast.success(`Edit ${updated.length} of ${MAX_FREE_EDITS} submitted!`);
    }
  };

  const venmoUrl = `https://venmo.com/?txn=pay&audience=private&recipients=${VENMO_USERNAME}&amount=450.00&note=${encodeURIComponent('GOT Transportation - Interface Development Payment')}`;

  // ── Render ──────────────────────────────────────────────────
  return (
    <>
      {/* ═══ Floating Button ═══ */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[90] group"
          aria-label="Give feedback"
        >
          {/* Pulse ring */}
          {pulse && (
            <span className="absolute inset-0 rounded-full bg-primary-500/30 animate-ping" style={{ animationDuration: '2s' }} />
          )}
          <div className="relative bg-primary-500 hover:bg-primary-400 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110">
            <MessageSquarePlus size={24} />
          </div>
          {/* Badge */}
          <div className={`absolute -top-1 -right-1 min-w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold px-1 ${
            allUsed
              ? 'bg-rose-500 text-white'
              : 'bg-white text-dark-950'
          }`}>
            {allUsed ? '!' : editsLeft}
          </div>
        </button>
      )}

      {/* ═══ Panel ═══ */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[90] w-[380px] max-w-[calc(100vw-48px)] animate-fade-in-up">
          <div className="bg-dark-900 border border-dark-700/80 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">

            {/* ── Header ── */}
            <div className="relative bg-gradient-to-b from-primary-500/10 to-transparent px-5 pt-5 pb-4">
              <button
                onClick={() => { setOpen(false); setShowPayment(false); }}
                className="absolute top-4 right-4 text-dark-500 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-500/15 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-primary-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {showPayment ? 'Ready to Build?' : 'Request Changes'}
                  </h3>
                  <p className="text-xs text-dark-500">
                    {showPayment
                      ? 'Let\'s bring your vision to life'
                      : allUsed
                        ? 'All free edits used'
                        : `${editsLeft} complimentary edit${editsLeft !== 1 ? 's' : ''} remaining`
                    }
                  </p>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {Array.from({ length: MAX_FREE_EDITS }).map((_, i) => (
                  <div key={i} className="flex-1 flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${
                      i < editsUsed
                        ? 'bg-primary-500 text-white scale-100'
                        : i === editsUsed && !allUsed
                          ? 'bg-primary-500/20 border-2 border-primary-500/50 text-primary-400'
                          : 'bg-dark-800 text-dark-600 border border-dark-700'
                    }`}>
                      {i < editsUsed ? <Check size={12} /> : i + 1}
                    </div>
                    {i < MAX_FREE_EDITS - 1 && (
                      <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${
                        i < editsUsed - 1 ? 'bg-primary-500' : 'bg-dark-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Feedback History ── */}
            {feedback.length > 0 && !showPayment && (
              <div className="px-5 pt-3 max-h-[180px] overflow-y-auto scrollbar-thin">
                <div className="space-y-2">
                  {feedback.map((item, i) => (
                    <div key={item.id} className="flex gap-2.5 animate-fade-in">
                      <div className="w-5 h-5 bg-primary-500/15 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={10} className="text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-dark-300 leading-relaxed line-clamp-2">{item.text}</div>
                        <div className="text-[10px] text-dark-600 mt-0.5">
                          Edit {item.editNumber} · {new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Success animation (after submit) ── */}
            {justSubmitted && (
              <div className="px-5 py-8 text-center animate-fade-in">
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-3">
                  <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping" style={{ animationDuration: '1.5s' }} />
                  <div className="relative bg-primary-500/15 border border-primary-500/30 rounded-full p-3">
                    <Check size={28} className="text-primary-400" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-white">Edit #{editsUsed} Received!</p>
                <p className="text-xs text-dark-500 mt-1">
                  {editsLeft > 0
                    ? `${editsLeft} edit${editsLeft !== 1 ? 's' : ''} remaining`
                    : 'Preparing your next steps...'
                  }
                </p>
              </div>
            )}

            {/* ── Input Area (edits remaining, not just submitted) ── */}
            {!allUsed && !justSubmitted && (
              <div className="px-5 py-4">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={3}
                    className="w-full bg-dark-800/60 border border-dark-700 rounded-2xl px-4 py-3 pr-24 text-sm text-white placeholder-dark-600 resize-none focus:outline-none focus:border-primary-500/50 transition-colors"
                    placeholder={recording ? '🎙️ Listening...' : 'Describe the changes you\'d like...'}
                    disabled={submitting}
                  />
                  {/* Voice + Send buttons */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                    {SpeechRecognition && (
                      <button
                        onClick={recording ? stopRecording : startRecording}
                        disabled={submitting}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          recording
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-dark-700 text-dark-400 hover:text-white hover:bg-dark-600'
                        }`}
                        title={recording ? 'Stop recording' : 'Voice input'}
                      >
                        {recording ? <MicOff size={14} /> : <Mic size={14} />}
                      </button>
                    )}
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !text.trim()}
                      className="w-8 h-8 rounded-full bg-primary-500 hover:bg-primary-400 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-primary-500"
                    >
                      {submitting ? (
                        <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                      ) : (
                        <Send size={14} />
                      )}
                    </button>
                  </div>
                </div>
                {recording && (
                  <div className="flex items-center gap-2 mt-2 px-1">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    <span className="text-[11px] text-rose-400 font-medium">Recording — speak your changes</span>
                  </div>
                )}
              </div>
            )}

            {/* ── All Edits Used (no payment yet) ── */}
            {allUsed && !justSubmitted && !showPayment && (
              <div className="px-5 py-5 text-center">
                <div className="bg-dark-800/60 border border-dark-700/50 rounded-2xl p-4 mb-4">
                  <Lock size={20} className="mx-auto text-dark-500 mb-2" />
                  <p className="text-xs text-dark-400">
                    You've used all <span className="font-bold text-white">{MAX_FREE_EDITS} complimentary edits</span>.
                  </p>
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-primary-500 hover:bg-primary-400 text-white font-bold py-3 px-6 rounded-full transition-all hover:shadow-glow-green flex items-center justify-center gap-2 text-sm"
                >
                  See How to Continue <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* ═══ PAYMENT CTA ═══ */}
            {showPayment && (
              <div className="px-5 pb-6 pt-2 animate-fade-in">
                {/* Value proposition */}
                <div className="bg-dark-800/60 border border-primary-500/20 rounded-2xl p-4 mb-4">
                  <p className="text-sm text-white font-semibold mb-3 text-center">
                    Everything you've reviewed — built for real.
                  </p>
                  <div className="space-y-2">
                    {[
                      'All your requested edits implemented',
                      'Fully functional booking & payment system',
                      'Admin dashboard with ride management',
                      'Unlimited future revisions included',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-dark-300">
                        <Check size={12} className="text-primary-400 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-extrabold text-white">$450</div>
                  <div className="text-xs text-dark-500">Interface Development Phase</div>
                </div>

                {/* Venmo Button */}
                <a
                  href={venmoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#008CFF] hover:bg-[#0074d4] text-white font-bold py-3.5 px-6 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                >
                  <ExternalLink size={16} /> Pay with Venmo
                </a>

                <p className="text-[10px] text-dark-600 text-center mt-3">
                  Payment to <span className="font-mono text-[#008CFF]">@{VENMO_USERNAME}</span> · Secure & instant
                </p>

                {/* Your submitted edits summary */}
                <div className="mt-4 pt-3 border-t border-dark-800">
                  <p className="text-[10px] text-dark-600 uppercase tracking-wider font-semibold mb-2">Your Requested Edits</p>
                  {feedback.map((item, i) => (
                    <div key={item.id} className="flex items-start gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-primary-400 shrink-0 mt-px">{item.editNumber}.</span>
                      <span className="text-[11px] text-dark-400 line-clamp-1">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Footer hint ── */}
            {!showPayment && !justSubmitted && !allUsed && (
              <div className="px-5 pb-4">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-dark-600">
                  <Mic size={10} />
                  <span>Tap the mic to use voice input</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
