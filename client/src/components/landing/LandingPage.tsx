import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ApiService } from '../../services/api';
import type { PriceRecord, UserRole } from '../../types/schema';
import {
  Recycle,
  Search,
  ChevronRight,
  ChevronDown,
  Leaf,
  Users,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Building2,
  Scale,
  Award,
  Globe,
  X,
  Phone,
  CheckCircle2,
  Clock,
  Layers,
  Truck,
  DollarSign,
  Smartphone
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchDemoRole, user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [prices, setPrices] = useState<PriceRecord[]>([]);

  useEffect(() => {
    ApiService.getPrices()
      .then((data) => {
        if (data && data.length > 0) setPrices(data);
      })
      .catch(() => {});
  }, []);

  const handleRoleLogin = (role: UserRole) => {
    switchDemoRole(role);
    setShowLoginModal(false);
    if (role === 'COLLECTOR') navigate('/collector');
    else if (role === 'RECYCLER') navigate('/recycler');
    else if (role === 'ADMIN') navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      {/* 1. HERO SECTION (Focused strictly on Problem Statement 26229) */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline, CTAs, 3 Core Pillars */}
            <div className="lg:col-span-6 space-y-6">
              {/* Context Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>SIH Problem Statement 26229 • Ministry of Mines / JNARDDC</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-[1.15]">
                  Kabadiwala Connect
                  <span className="text-emerald-600 block mt-1">
                    From Kabadiwala to Circular Economy
                  </span>
                </h1>

                <p className="mt-3 text-base text-slate-600 font-medium leading-relaxed max-w-lg">
                  Bringing informal e-waste collectors into India's formal recycling value chain with benchmark pricing, digital scale receipts, and critical mineral recovery.
                </p>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 pt-1">
                <button
                  onClick={() => navigate('/sell')}
                  className="w-full xs:w-auto px-6 sm:px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-95 transition-all touch-manipulation"
                >
                  <span>Start Selling E-Waste</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  onClick={() => navigate('/recyclers')}
                  className="w-full xs:w-auto px-6 sm:px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border-2 border-slate-200 shadow-xs active:scale-95 transition-all touch-manipulation text-center"
                >
                  Find Authorized Recycler
                </button>
              </div>

              {/* Three Core Benefits (PS Requirements) */}
              <div className="pt-5 grid grid-cols-3 gap-2.5 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block leading-tight">
                      Fair Price
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                      Benchmark rates
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100/80 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block leading-tight">
                      Safe Recycling
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                      +5% intact bonus
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100/80 text-purple-700 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block leading-tight">
                      Digital Traceability
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                      Verified receipts
                    </span>
                  </div>
                </div>
              </div>

              {/* Formal Chain Flow Banner */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between gap-1 overflow-x-auto">
                <span className="text-emerald-700">Collector</span>
                <span className="text-slate-400">→</span>
                <span className="text-blue-700">Recycler</span>
                <span className="text-slate-400">→</span>
                <span className="text-amber-700">Verified Handover</span>
                <span className="text-slate-400">→</span>
                <span className="text-purple-700">Formal Refining</span>
              </div>
            </div>

            {/* Right Column: High-Res Circular Economy Infographic Diagram */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-white">
                <img
                  src="/assets/landing-hero.jpg"
                  alt="Kabadiwala Connect Circular Economy Pipeline"
                  className="w-full h-auto object-cover select-none"
                />

                {/* Subtle overlay badge */}
                <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>JNARDDC Pilot Framework</span>
                </div>
              </div>

              <p className="text-[11px] text-center text-slate-400 font-medium mt-2">
                Digital bridge connecting informal scrap pickers directly to CPCB-registered recycling infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE BENCHMARK RATES TICKER */}
      <section className="bg-slate-900 text-white py-6 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Government Benchmark Rates (Ministry of Mines / JNARDDC Verified)
              </span>
            </div>
            <button
              onClick={() => navigate('/prices')}
              className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>View Full Price Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {prices.slice(0, 6).map((p) => (
              <div
                key={p.id}
                onClick={() => navigate('/prices')}
                className="bg-slate-800/90 hover:bg-slate-800 rounded-2xl p-3 border border-slate-700/80 transition cursor-pointer"
              >
                <span className="font-mono text-[10px] text-slate-400 block truncate">
                  {p.code}
                </span>
                <span className="text-xs font-bold text-slate-200 block truncate">
                  {language === 'hi' ? p.name_hi : language === 'mr' ? p.name_mr : p.name}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-black text-brand-400 font-mono">
                    ₹{p.benchmark_rate}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">
                    +{p.trend_percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THREE STAKEHOLDER EXPERIENCES (PC & Phone Ready) */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Three Distinct Portals
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-3 tracking-tight">
              An Integrated Circular Ecosystem
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Designed to connect the informal grassroot collector directly to formal industrial recyclers and government oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Collector PWA */}
            <div className="bg-slate-50 hover:bg-brand-50/40 rounded-3xl p-8 border border-slate-200 transition-all hover:shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-black mb-6 group-hover:scale-105 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  Informal Collector (Kabadiwala)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Mobile-first, voice-assisted PWA built for low-literacy users in Hindi, Marathi, and English. Create digital lots, estimate values, and get paid directly via bank/UPI.
                </p>
                <ul className="mt-5 space-y-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Instant AI Component Classification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Offline-First (IndexedDB Storage)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Vernacular Speech Synthesis (Listen Buttons)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  switchDemoRole('COLLECTOR');
                  navigate('/collector');
                }}
                className="mt-8 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>Enter Collector Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Authorized Recycler */}
            <div className="bg-slate-50 hover:bg-blue-50/40 rounded-3xl p-8 border border-slate-200 transition-all hover:shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black mb-6 group-hover:scale-105 transition-transform">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  CPCB Authorized Recycler
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Desktop logistics portal for authorized collection centers and smelters. Inspect incoming batches, configure dynamic buy rates, and reconcile weights on digital scales.
                </p>
                <ul className="mt-5 space-y-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Calibrated Digital Scale Verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Dynamic Per-KG Buy Price Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Verifiable Handover Manifest Certificates</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  switchDemoRole('RECYCLER');
                  navigate('/recycler');
                }}
                className="mt-8 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>Enter Recycler Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Ministry & JNARDDC */}
            <div className="bg-slate-50 hover:bg-purple-50/40 rounded-3xl p-8 border border-slate-200 transition-all hover:shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black mb-6 group-hover:scale-105 transition-transform">
                  <Scale className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  Ministry of Mines / JNARDDC
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Government oversight and circular economy analytics. Track critical mineral retention (Copper, Lithium, Cobalt, Gold), regional scrap movement, and formalization KPIs.
                </p>
                <ul className="mt-5 space-y-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>Critical Mineral Recovery Estimation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>Geospatial Heatmap & Material Flow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>Unit Economics & Sustainability Model</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  switchDemoRole('ADMIN');
                  navigate('/admin');
                }}
                className="mt-8 w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>Enter Governance Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INSTITUTIONAL FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-1">
              <Recycle className="w-5 h-5 text-brand-500" />
              <span>Kabadiwala Connect</span>
            </div>
            <p className="text-slate-500 max-w-md">
              Developed for Smart India Hackathon Problem Statement 26229: “Bringing the Informal Collector into the Formal Recycling Chain” issued by Ministry of Mines (MoM) / JNARDDC.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 font-semibold">
            <button onClick={() => navigate('/prices')} className="hover:text-white transition">
              Price Board
            </button>
            <button onClick={() => navigate('/recyclers')} className="hover:text-white transition">
              Authorized Recyclers
            </button>
            <button onClick={() => navigate('/safety')} className="hover:text-white transition">
              Safety Protocols
            </button>
            <button onClick={() => navigate('/admin/economics')} className="hover:text-white transition">
              Formalization Economics
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-slate-900 text-center text-slate-500 text-[11px]">
          DEMO ENVIRONMENT: Data shown is simulated for demonstration purposes under Smart India Hackathon Problem Statement 26229.
        </div>
      </footer>

      {/* LOGIN & QUICK DEMO ROLE MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-scale-up">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-[10px] font-mono tracking-widest text-brand-700 uppercase font-black px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200">
                SIH DEMO AUTHENTICATION
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Select Your Access Role
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulated authentication with predefined demo accounts (OTP: 123456)
              </p>
            </div>

            <div className="py-4 space-y-3">
              <button
                onClick={() => handleRoleLogin('COLLECTOR')}
                className="w-full p-4 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 text-left transition flex items-center justify-between group"
              >
                <div>
                  <span className="text-sm font-black text-slate-900 block">
                    Ramesh Kumar (Informal Collector)
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Phone: 9999999999 • Dharavi, Mumbai
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600 transition" />
              </button>

              <button
                onClick={() => handleRoleLogin('RECYCLER')}
                className="w-full p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition flex items-center justify-between group"
              >
                <div>
                  <span className="text-sm font-black text-slate-900 block">
                    GreenCycle Recycling (Authorized Facility)
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Phone: 8888888888 • CPCB Reg: MH-092
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" />
              </button>

              <button
                onClick={() => handleRoleLogin('ADMIN')}
                className="w-full p-4 rounded-2xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 text-left transition flex items-center justify-between group"
              >
                <div>
                  <span className="text-sm font-black text-slate-900 block">
                    Dr. S. K. Verma (JNARDDC / Ministry of Mines)
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Phone: 7777777777 • Government Oversight
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-scale-up">
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-brand-600" />
              <span>Search Platform</span>
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search materials (e.g. PCB, Copper Cable, Battery) or Recyclers..."
                className="w-full p-3.5 border border-slate-300 rounded-2xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                autoFocus
              />

              <div className="pt-2 text-xs font-bold text-slate-500">
                Popular Quick Links:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setShowSearchModal(false);
                    navigate('/prices');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800"
                >
                  PCB Buy Rates
                </button>
                <button
                  onClick={() => {
                    setShowSearchModal(false);
                    navigate('/recyclers');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800"
                >
                  Nearby Recyclers
                </button>
                <button
                  onClick={() => {
                    setShowSearchModal(false);
                    navigate('/safety');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800"
                >
                  Hazard Safety Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
