import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useOfflineSync } from '../../context/OfflineSyncContext';
import { VoiceButton } from '../common/VoiceButton';
import { CollectorBottomNav } from './CollectorBottomNav';
import { ApiService } from '../../services/api';
import {
  Camera,
  TrendingUp,
  Building2,
  Package,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  MapPin
} from 'lucide-react';

export const CollectorHome: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { syncStatus } = useOfflineSync();
  const navigate = useNavigate();
  const [monthlyEarnings, setMonthlyEarnings] = useState<number>(18450);

  useEffect(() => {
    // Fetch live Khata earnings
    ApiService.getCollectorKhata('col-ramesh-1')
      .then((data) => {
        if (data && data.summary && data.summary.thisMonthEarnings) {
          setMonthlyEarnings(data.summary.thisMonthEarnings);
        }
      })
      .catch(() => {});
  }, []);

  const welcomeText = language === 'hi'
    ? `नमस्ते, ${user.name}! कबाड़ीवाला कनेक्ट में आपका स्वागत है। ई-कचरा बेचने के लिए नीचे दिए गए बटन को दबाएं।`
    : language === 'mr'
    ? `नमस्कार, ${user.name}! कबाडीवाला कनेक्टमध्ये आपले स्वागत आहे. ई-कचरा विकण्यासाठी खालील बटण दाबा.`
    : `Welcome ${user.name} to Kabadiwala Connect. Tap the button below to start selling e-waste safely.`;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top Greeting & Status Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 sm:p-7 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {t('collector_role')}
              </span>
              {syncStatus === 'synced' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('online')}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Offline Mode</span>
                </span>
              )}
              <VoiceButton textToSpeak={welcomeText} size="sm" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
              {t('greeting')}, {user.name.split(' ')[0]}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-200/90 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>Dharavi Sector 3, Mumbai</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-300">Live GPS</span>
            </div>
          </div>

          {/* Quick Monthly Earnings Teaser */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between sm:min-w-[240px] gap-4">
            <div>
              <span className="text-[10px] text-emerald-200 font-bold block uppercase tracking-wider">
                {t('this_month_earnings')}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                ₹{monthlyEarnings.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={() => navigate('/khata')}
              className="px-3 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1 transition shadow-sm"
              aria-label="View Passbook"
            >
              <span>{t('nav_khata')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Action Section */}
      <div className="mt-5 space-y-3.5">
        {/* DOMINANT HERO CTA: SELL E-WASTE */}
        <div
          onClick={() => navigate('/sell')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/sell')}
          className="group cursor-pointer bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 text-white rounded-3xl p-5 sm:p-6 shadow-lg shadow-emerald-900/15 border border-emerald-400/40 hover:brightness-105 active:scale-[0.99] transition relative overflow-hidden"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white text-emerald-700 rounded-2xl flex items-center justify-center shadow-md font-black flex-shrink-0 group-hover:scale-105 transition-transform">
                <Camera className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-300/90 text-emerald-950 font-black text-[10px] uppercase tracking-wide mb-1">
                  <Sparkles className="w-3 h-3 fill-current" />
                  <span>AI Valuation</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                  {t('card_sell_title')}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
                  {t('card_sell_sub')}
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-emerald-700 flex-shrink-0 transition">
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </div>

        {/* 2x2 COMPACT GRID */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* CARD 1: PRICE */}
          <div
            onClick={() => navigate('/prices')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/prices')}
            className="group cursor-pointer bg-white hover:bg-slate-50 text-slate-900 rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200 hover:border-amber-300 active:scale-[0.98] transition flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
            </div>
            <div className="mt-3">
              <h4 className="text-base font-black text-slate-900 leading-snug">
                {t('card_price_title')}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                {t('card_price_sub')}
              </p>
            </div>
          </div>

          {/* CARD 2: RECYCLER */}
          <div
            onClick={() => navigate('/recyclers')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/recyclers')}
            className="group cursor-pointer bg-white hover:bg-slate-50 text-slate-900 rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200 hover:border-blue-300 active:scale-[0.98] transition flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
            </div>
            <div className="mt-3">
              <h4 className="text-base font-black text-slate-900 leading-snug">
                {t('card_recycler_title')}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                {t('card_recycler_sub')}
              </p>
            </div>
          </div>

          {/* CARD 3: MY LOTS */}
          <div
            onClick={() => navigate('/lots')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/lots')}
            className="group cursor-pointer bg-white hover:bg-slate-50 text-slate-900 rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200 hover:border-indigo-300 active:scale-[0.98] transition flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
            </div>
            <div className="mt-3">
              <h4 className="text-base font-black text-slate-900 leading-snug">
                {t('card_lots_title')}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                {t('card_lots_sub')}
              </p>
            </div>
          </div>

          {/* CARD 4: MY KHATA */}
          <div
            onClick={() => navigate('/khata')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/khata')}
            className="group cursor-pointer bg-white hover:bg-slate-50 text-slate-900 rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200 hover:border-purple-300 active:scale-[0.98] transition flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
            </div>
            <div className="mt-3">
              <h4 className="text-base font-black text-slate-900 leading-snug">
                {t('card_khata_title')}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                {t('card_khata_sub')}
              </p>
            </div>
          </div>
        </div>

        {/* DEDICATED SAFETY CARD (Full-Width) */}
        <div
          onClick={() => navigate('/safety')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/safety')}
          className="group cursor-pointer bg-white hover:bg-slate-50 text-slate-900 rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200 hover:border-rose-300 active:scale-[0.99] transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-slate-900">
                  {t('card_safety_title')}
                </h4>
                <span className="hidden sm:inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  +5% Bonus Safe Handling
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t('card_safety_sub')}
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-rose-100 group-hover:text-rose-700 flex items-center justify-center text-slate-400 transition">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      <CollectorBottomNav />
    </div>
  );
};
