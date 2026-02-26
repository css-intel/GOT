import { Link } from 'react-router-dom';
import { Shield, Clock, MapPin, HeartPulse, ArrowRight, Zap, Star, ChevronRight, Car } from 'lucide-react';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative hero-gradient min-h-[90vh] flex items-start">
        {/* Background effects */}
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[112px] pb-20 md:pb-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left — Copy */}
            <div className="flex flex-col items-start justify-start animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 px-4 py-2 rounded-full text-xs font-semibold tracking-wide mb-6">
                <span className="inline-block w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                NOW ACCEPTING RIDES
              </div>

              {/* Logo — upper-left, aligned to headline left margin */}
              <div className="mb-6">
                <img src="/logo.png" alt="G.O.T Transportation" className="w-full max-w-md md:max-w-lg h-auto object-contain" />
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
                Get On<br />
                <span className="gradient-text">Through.</span>
              </h1>

              <p className="text-lg md:text-xl text-dark-400 leading-relaxed mb-10 max-w-lg">
                Professional transportation for personal rides and medical courier needs. Safe, on-time, every single time.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book"
                  className="btn-primary !py-4 !px-8 text-base inline-flex items-center gap-2 group"
                >
                  Request a Ride
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="btn-outline !py-4 !px-8 text-base inline-flex items-center gap-2"
                >
                  Create Account
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-10">
                {[
                  { icon: Shield, text: 'Insured & Licensed' },
                  { icon: Clock, text: '24/7 Available' },
                  { icon: Zap, text: 'Instant Booking' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-dark-500 text-xs font-medium">
                    <Icon size={14} className="text-dark-600" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual card */}
            <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                {/* Floating card */}
                <div className="glass-card rounded-3xl p-8 animate-float">
                  <div className="flex items-center gap-3 mb-6">
                    <img src="/icon.png" alt="G.O.T" className="w-12 h-12 rounded-2xl object-contain" />
                    <div>
                      <div className="font-bold text-white">Quick Ride</div>
                      <div className="text-xs text-dark-500">Estimated arrival: 8 min</div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                      <div className="w-3 h-3 bg-primary-500 rounded-full" />
                      <span className="text-sm text-dark-300">123 Main St, Columbia SC</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                      <div className="w-3 h-3 bg-rose-500 rounded-full" />
                      <span className="text-sm text-dark-300">456 Oak Ave, Columbia SC</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                    <div>
                      <div className="text-xs text-dark-500">Estimated Fare</div>
                      <div className="text-2xl font-bold text-primary-400">$20.50</div>
                    </div>
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                      <ArrowRight size={20} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Decorative rings */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border border-primary-500/10 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 border border-primary-500/5 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="relative py-24 md:py-32 bg-dark-950">
        <div className="glow-line mb-24" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">Why Choose G.O.T?</h2>
            <p className="section-subheading mx-auto">Transportation you can depend on, every time</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Safe & Reliable',
                desc: 'Licensed, insured, and background-checked. Your safety is our top priority on every ride.',
                gradient: 'from-primary-500/20 to-sky-500/20',
                iconBg: 'bg-primary-500/15 text-primary-400',
              },
              {
                icon: Clock,
                title: 'Always On Time',
                desc: 'Whether ASAP or scheduled ahead, we arrive on time. Your schedule matters to us.',
                gradient: 'from-blue-500/20 to-cyan-500/20',
                iconBg: 'bg-blue-500/15 text-blue-400',
              },
              {
                icon: HeartPulse,
                title: 'Medical Transport',
                desc: 'Specialized medical courier services with professional care for sensitive deliveries.',
                gradient: 'from-rose-500/20 to-pink-500/20',
                iconBg: 'bg-rose-500/15 text-rose-400',
              },
            ].map(({ icon: Icon, title, desc, iconBg }) => (
              <div key={title} className="card card-hover group cursor-default">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${iconBg} transition-all duration-300 group-hover:scale-110`}>
                  <Icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="relative py-24 md:py-32 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">How It Works</h2>
            <p className="section-subheading mx-auto">Three simple steps to your ride</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', icon: MapPin, title: 'Enter Locations', desc: 'Tell us your pickup and dropoff addresses' },
              { step: '02', icon: Star, title: 'Get Your Fare', desc: 'See transparent pricing before you book' },
              { step: '03', icon: Car, title: 'Enjoy the Ride', desc: 'We pick you up and get you there safely' },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <div key={step} className="text-center group">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center group-hover:border-primary-500/50 group-hover:shadow-glow-green transition-all duration-500 group-hover:bg-primary-500/5">
                    <Icon size={28} className="text-dark-400 group-hover:text-primary-400 transition-colors duration-300" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary-500 text-white rounded-lg text-xs font-bold flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-dark-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link to="/book" className="btn-primary inline-flex items-center gap-2 !py-4 !px-8 text-base group">
              Book Your Ride Now
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="relative py-24 md:py-32 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">Simple, Transparent Pricing</h2>
            <p className="section-subheading mx-auto">No hidden fees. Know your fare before you ride.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Personal */}
            <div className="card card-hover group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-500/15 text-primary-400 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                  <Car size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Personal</h3>
                  <p className="text-xs text-dark-500">Standard transportation</p>
                </div>
              </div>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between items-center py-2 border-b border-dark-800">
                  <span className="text-dark-400">Base Fare</span>
                  <span className="font-semibold text-white">$8.00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-dark-400">Per Mile</span>
                  <span className="font-semibold text-white">$2.50</span>
                </div>
              </div>
              <Link to="/book" className="btn-primary w-full text-center block">Book Now</Link>
            </div>

            {/* Medical */}
            <div className="card border-rose-500/20 card-hover group">
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Specialized
                </span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-rose-500/15 text-rose-400 rounded-2xl flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                  <HeartPulse size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Medical Courier</h3>
                  <p className="text-xs text-dark-500">Professional medical transport</p>
                </div>
              </div>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between items-center py-2 border-b border-dark-800">
                  <span className="text-dark-400">Base Fare</span>
                  <span className="font-semibold text-white">$8.00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dark-800">
                  <span className="text-dark-400">Per Mile</span>
                  <span className="font-semibold text-white">$2.50</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-dark-400">Medical Fee</span>
                  <span className="font-semibold text-rose-400">+$10.00</span>
                </div>
              </div>
              <Link to="/book" className="w-full text-center block py-3.5 px-7 rounded-full font-semibold text-sm bg-rose-500 hover:bg-rose-400 text-white transition-all duration-300">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 bg-dark-900/50 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[150px]" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-heading mb-6">Ready to Ride?</h2>
          <p className="text-dark-400 text-lg mb-10 max-w-xl mx-auto">
            Join G.O.T Transportation today and experience reliable, professional transportation at your fingertips.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book" className="btn-primary !py-4 !px-10 text-base inline-flex items-center gap-2 group">
              Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
