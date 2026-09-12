import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  PackageSearch,
  Truck,
  QrCode,
  DollarSign,
  Building2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const RecyclerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { label: 'Dashboard', path: '/recycler', icon: LayoutDashboard },
    { label: 'Incoming Lots', path: '/recycler/lots', icon: PackageSearch },
    { label: 'Pickups', path: '/recycler/pickups', icon: Truck },
    { label: 'Handover & Scale', path: '/recycler/handover', icon: QrCode },
    { label: 'Price Management', path: '/recycler/prices', icon: DollarSign },
    { label: 'Facility Profile', path: '/recycler/profile', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar / Mobile Nav Header */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-800">
        {/* Facility Info Card */}
        <div className="p-3.5 sm:p-5 border-b border-slate-800 flex items-center justify-between md:block">
          <div>
            <div className="flex items-center gap-1.5 mb-1 md:mb-2">
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                CPCB AUTHORIZED
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-tight leading-snug">
              GreenCycle E-Waste Recyclers
            </h2>
            <p className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-0.5 hidden sm:block">
              CPCB/E-WASTE/2023/MH-092
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 md:mt-1 text-right md:text-left">
            Navi Mumbai Facility
          </p>
        </div>

        {/* Navigation Links (Horizontal scroll on mobile, vertical stack on desktop) */}
        <nav className="p-2 md:p-3 flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex-shrink-0 md:w-full flex items-center justify-between px-3.5 py-2.5 md:p-3 rounded-xl md:rounded-2xl text-xs font-bold transition touch-manipulation active:scale-95 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 md:gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-blue-200 hidden md:inline ml-2" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area with generous mobile bottom clearance */}
      <main className="flex-1 min-w-0 p-3 sm:p-5 md:p-8 max-w-7xl mx-auto w-full pb-28 md:pb-12 pb-safe">
        <Outlet />
      </main>
    </div>
  );
};
