import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  BarChart3,
  Map,
  Gem,
  Calculator,
  ShieldCheck,
  Building,
  Sparkles,
  Landmark
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Executive Overview', path: '/admin', icon: BarChart3 },
    { label: 'Regional Heatmap', path: '/admin/heatmap', icon: Map },
    { label: 'Critical Minerals', path: '/admin/minerals', icon: Gem },
    { label: 'Unit Economics', path: '/admin/economics', icon: Calculator },
    { label: 'Recycler Compliance', path: '/admin/compliance', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top Ministry Banner */}
      <div className="bg-slate-950 border-b border-slate-800 px-3.5 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/10 border border-amber-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center text-amber-400 font-black flex-shrink-0">
              <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-amber-400 uppercase block font-bold truncate">
                MINISTRY OF MINES • JNARDDC OVERSIGHT
              </span>
              <h1 className="text-sm sm:text-lg font-black tracking-tight text-white leading-tight truncate">
                National E-Waste Formalization & Critical Mineral Tracking System
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>SIH ID: 26229 Live Audit Console</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-14 z-30 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 sm:gap-2 touch-manipulation active:scale-95 flex-shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-3 sm:p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};
