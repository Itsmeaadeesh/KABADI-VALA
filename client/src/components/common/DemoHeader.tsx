import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useOfflineSync } from '../../context/OfflineSyncContext';
import { SyncIndicator } from './SyncIndicator';
import { JuryTourModal } from './JuryTourModal';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Recycle,
  Smartphone,
  Building2,
  Landmark,
  Globe,
  Award
} from 'lucide-react';
import type { UserRole, Language } from '../../types/schema';

export const DemoHeader: React.FC = () => {
  const { user, switchDemoRole } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { toggleSimulateOffline } = useOfflineSync();
  const [showJuryModal, setShowJuryModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (role: UserRole) => {
    switchDemoRole(role);
    if (role === 'COLLECTOR') navigate('/collector');
    else if (role === 'RECYCLER') navigate('/recycler');
    else if (role === 'ADMIN') navigate('/admin');
  };

  const isCollectorActive =
    user.role === 'COLLECTOR' &&
    (location.pathname === '/collector' ||
      ['/sell', '/lots', '/prices', '/recyclers', '/khata', '/safety'].some((p) =>
        location.pathname.startsWith(p)
      ));

  const isRecyclerActive =
    user.role === 'RECYCLER' || location.pathname.startsWith('/recycler');

  const isAdminActive =
    user.role === 'ADMIN' || location.pathname.startsWith('/admin');

  return (
    <>
      {/* EXACTLY ONE COMPACT UNIFIED HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Left: Brand + Small SIH Badge */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer select-none group flex-shrink-0"
            title="Go to Public Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-600 group-hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black shadow-md shadow-emerald-950/40 transition flex-shrink-0">
              <Recycle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-base font-black tracking-tight leading-none text-white truncate max-w-[85px] xs:max-w-[130px] sm:max-w-none">
                  Kabadiwala Connect
                </h1>
                <span className="hidden xl:inline-block text-[9px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded tracking-wide uppercase">
                  SIH #26229
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Ministry of Mines / JNARDDC
              </p>
            </div>
          </div>

          {/* Center: Role Switcher (Compact Segments) */}
          <div className="flex items-center bg-slate-800/90 p-0.5 sm:p-1 rounded-xl border border-slate-700/80 flex-shrink-0">
            <button
              onClick={() => handleRoleChange('COLLECTOR')}
              className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                isCollectorActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Switch to Collector role"
              aria-label="Collector Portal"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
              <span className="hidden sm:inline">Collector</span>
            </button>

            <button
              onClick={() => handleRoleChange('RECYCLER')}
              className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                isRecyclerActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Switch to Recycler role"
              aria-label="Recycler Portal"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" />
              <span className="hidden sm:inline">Recycler</span>
            </button>

            <button
              onClick={() => handleRoleChange('ADMIN')}
              className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                isAdminActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Switch to Admin role"
              aria-label="Admin Portal"
            >
              <Landmark className="w-3.5 h-3.5 text-purple-300 flex-shrink-0" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          {/* Right: Sync Status + Jury Flow + Language Switcher */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Global Sync Indicator (Clickable to toggle offline simulation) */}
            <div
              onClick={toggleSimulateOffline}
              className="cursor-pointer"
              title="Click to toggle offline simulation"
            >
              <SyncIndicator compact={true} />
            </div>

            {/* Jury Flow Quick Trigger */}
            <button
              onClick={() => setShowJuryModal(true)}
              className="inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-xs"
              title="3-Minute Live Jury Presentation Flow"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Jury Flow</span>
            </button>

            {/* Single Global Language Switcher */}
            <div className="inline-flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[11px] sm:text-xs">
              <Globe className="w-3 h-3 text-slate-400 ml-1 hidden sm:inline" />
              {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-1.5 sm:px-2 py-1 sm:py-0.5 font-bold rounded-md transition ${
                    language === lang
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'HI' : 'MR'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {showJuryModal && (
        <JuryTourModal
          onClose={() => setShowJuryModal(false)}
          onNavigate={(path) => navigate(path)}
        />
      )}
    </>
  );
};

