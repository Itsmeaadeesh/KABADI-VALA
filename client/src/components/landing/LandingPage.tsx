import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ApiService } from '../../services/api';
import type { PriceRecord, UserRole } from '../../types/schema';
import {
  Recycle,
  ChevronRight,
  Leaf,
  Users,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Building2,
  Scale,
  DollarSign,
  Smartphone,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  Flame,
  Globe
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchDemoRole } = useAuth();
  const { t, language } = useLanguage();
  const [prices, setPrices] = useState<PriceRecord[]>([]);

  useEffect(() => {
    ApiService.getPrices()
      .then((data) => {
        if (data && data.length > 0) setPrices(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-slate-900 font-sans selection:bg-brand-500 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-10 sm:pt-10 sm:pb-14 lg:pt-14 lg:pb-18">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Left Column: Headline, CTAs, 3 Core Pillars */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              {/* Context Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] sm:text-xs font-bold text-emerald-800 max-w-full truncate">
                <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">{t('landing_sih_badge')}</span>
              </div>

              <div>
                <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-[1.15]">
                  {t('landing_hero_title')}
                  <span className="text-emerald-600 block mt-1">
                    {t('landing_hero_sub')}
                  </span>
                </h1>

                <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-slate-600 font-medium leading-relaxed max-w-lg">
                  {t('landing_hero_desc')}
                </p>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 pt-1">
                <button
                  onClick={() => navigate('/sell')}
                  className="w-full xs:w-auto px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-95 transition-all touch-manipulation"
                >
                  <span>{t('landing_cta_sell')}</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  onClick={() => navigate('/recyclers')}
                  className="w-full xs:w-auto px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border-2 border-slate-200 shadow-xs active:scale-95 transition-all touch-manipulation text-center"
                >
                  {t('landing_cta_find_recycler')}
                </button>
              </div>

              {/* Three Core Pillars (Bilingual & Compact for Mobile) */}
              <div className="pt-3 sm:pt-4 grid grid-cols-3 gap-1.5 sm:gap-3 border-t border-slate-100">
                <div className="flex flex-col xs:flex-row items-center xs:items-start text-center xs:text-left gap-1 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] sm:text-xs font-black text-slate-900 block leading-tight truncate">
                      {t('landing_pillar_price')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium hidden xs:block truncate">
                      {t('landing_pillar_price_sub')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col xs:flex-row items-center xs:items-start text-center xs:text-left gap-1 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] sm:text-xs font-black text-slate-900 block leading-tight truncate">
                      {t('landing_pillar_safe')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium hidden xs:block truncate">
                      {t('landing_pillar_safe_sub')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col xs:flex-row items-center xs:items-start text-center xs:text-left gap-1 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] sm:text-xs font-black text-slate-900 block leading-tight truncate">
                      {t('landing_pillar_trace')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium hidden xs:block truncate">
                      {t('landing_pillar_trace_sub')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formal Chain Flow Banner (Responsive & Localized) */}
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 text-[10px] sm:text-xs font-bold text-slate-700 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
                <span className="text-emerald-700">{t('landing_flow_collector')}</span>
                <span className="text-slate-400">→</span>
                <span className="text-blue-700">{t('landing_flow_recycler')}</span>
                <span className="text-slate-400">→</span>
                <span className="text-amber-700">{t('landing_flow_handover')}</span>
                <span className="text-slate-400">→</span>
                <span className="text-purple-700">{t('landing_flow_refining')}</span>
              </div>
            </div>

            {/* Right Column: Fully Bilingual Vector Circular Economy Infographic Card */}
            <div className="lg:col-span-6 relative w-full max-w-full">
              <div className="rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-4 sm:p-7 relative overflow-hidden">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t('landing_hero_badge')}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">SIH 26229</span>
                </div>

                <h3 className="text-base sm:text-xl font-black text-white mb-3 sm:mb-4 tracking-tight">
                  {t('landing_pipe_title')}
                </h3>

                {/* 3 Step Interactive Flow Cards */}
                <div className="space-y-2.5 sm:space-y-3">
                  {/* Step 1 */}
                  <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center flex-shrink-0 font-black">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-white truncate">
                          1. {t('landing_pipe_step1')}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                          AI Scan
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-slate-300 truncate">
                        {t('landing_pipe_step1_sub')}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center flex-shrink-0 font-black">
                      <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-white truncate">
                          2. {t('landing_pipe_step2')}
                        </span>
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded">
                          CPCB Scale
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-slate-300 truncate">
                        {t('landing_pipe_step2_sub')}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center flex-shrink-0 font-black">
                      <Recycle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-white truncate">
                          3. {t('landing_pipe_step3')}
                        </span>
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded">
                          98% Recovery
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-slate-300 truncate">
                        {t('landing_pipe_step3_sub')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics Summary Strip */}
                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs">
                  <div>
                    <span className="text-emerald-400 font-mono font-bold block text-xs sm:text-sm">
                      100%
                    </span>
                    <span className="text-slate-400 text-[9px] sm:text-[10px]">Direct UPI</span>
                  </div>
                  <div>
                    <span className="text-blue-400 font-mono font-bold block text-xs sm:text-sm">
                      0%
                    </span>
                    <span className="text-slate-400 text-[9px] sm:text-[10px]">Acid Waste</span>
                  </div>
                  <div>
                    <span className="text-purple-400 font-mono font-bold block text-xs sm:text-sm">
                      Cu, Li, Au
                    </span>
                    <span className="text-slate-400 text-[9px] sm:text-[10px]">Retained</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-center text-slate-400 font-medium mt-2 px-2">
                {t('landing_hero_caption')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE BENCHMARK RATES TICKER */}
      <section className="bg-slate-900 text-white py-5 sm:py-6 border-y border-slate-800 w-full">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 truncate">
                {t('landing_rates_title')}
              </span>
            </div>
            <button
              onClick={() => navigate('/prices')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 flex-shrink-0"
            >
              <span className="hidden xs:inline">{t('landing_rates_view_all')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            {prices.slice(0, 6).map((p) => (
              <div
                key={p.id}
                onClick={() => navigate('/prices')}
                className="bg-slate-800/90 hover:bg-slate-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-slate-700/80 transition cursor-pointer"
              >
                <span className="font-mono text-[9px] sm:text-[10px] text-slate-400 block truncate">
                  {p.code}
                </span>
                <span className="text-xs font-bold text-slate-200 block truncate">
                  {language === 'hi' ? p.name_hi : language === 'mr' ? p.name_mr : p.name}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">
                    ₹{p.benchmark_rate}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-emerald-400">
                    +{p.trend_percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THREE STAKEHOLDER EXPERIENCES (PC & Phone Ready) */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-[11px] sm:text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {t('landing_portals_badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 mt-3 tracking-tight">
              {t('landing_portals_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 px-2">
              {t('landing_portals_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Collector PWA */}
            <div className="bg-slate-50 hover:bg-emerald-50/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200 transition-all hover:shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-5 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                  {t('landing_card1_title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('landing_card1_desc')}
                </p>
                <ul className="mt-4 sm:mt-5 space-y-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t('landing_card1_f1')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t('landing_card1_f2')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{t('landing_card1_f3')}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  switchDemoRole('COLLECTOR');
                  navigate('/collector');
                }}
                className="mt-6 sm:mt-8 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>{t('landing_card1_btn')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Authorized Recycler */}
            <div className="bg-slate-50 hover:bg-blue-50/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200 transition-all hover:shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black mb-5 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                  {t('landing_card2_title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('landing_card2_desc')}
                </p>
                <ul className="mt-4 sm:mt-5 space-y-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{t('landing_card2_f1')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{t('landing_card2_f2')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{t('landing_card2_f3')}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  switchDemoRole('RECYCLER');
                  navigate('/recycler');
                }}
                className="mt-6 sm:mt-8 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>{t('landing_card2_btn')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Ministry & JNARDDC */}
            <div className="bg-slate-50 hover:bg-purple-50/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200 transition-all hover:shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black mb-5 group-hover:scale-105 transition-transform">
                  <Scale className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                  {t('landing_card3_title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('landing_card3_desc')}
                </p>
                <ul className="mt-4 sm:mt-5 space-y-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>{t('landing_card3_f1')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>{t('landing_card3_f2')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>{t('landing_card3_f3')}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  switchDemoRole('ADMIN');
                  navigate('/admin');
                }}
                className="mt-6 sm:mt-8 w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>{t('landing_card3_btn')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INSTITUTIONAL FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-xs w-full">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-1">
              <Recycle className="w-5 h-5 text-emerald-500" />
              <span>{t('app_name')}</span>
            </div>
            <p className="text-slate-400 max-w-md text-[11px] sm:text-xs">
              {t('footer_tagline')}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6 font-semibold text-xs">
            <button onClick={() => navigate('/prices')} className="hover:text-white transition">
              {t('nav_prices')}
            </button>
            <button onClick={() => navigate('/recyclers')} className="hover:text-white transition">
              {t('locator_title')}
            </button>
            <button onClick={() => navigate('/safety')} className="hover:text-white transition">
              {t('nav_safety')}
            </button>
            <button onClick={() => navigate('/collector')} className="hover:text-white transition">
              {t('collector_tab')}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-slate-900 text-center text-slate-400 text-[10px] sm:text-[11px]">
          {t('footer_disclaimer')}
        </div>
      </footer>
    </div>
  );
};
