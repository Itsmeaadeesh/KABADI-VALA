import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Home, IndianRupee, Package, BookOpen, ShieldCheck } from 'lucide-react';

export const CollectorBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { label: t('nav_home'), path: '/collector', icon: Home },
    { label: t('nav_prices'), path: '/prices', icon: IndianRupee },
    { label: t('nav_lots'), path: '/lots', icon: Package },
    { label: t('nav_khata'), path: '/khata', icon: BookOpen },
    { label: t('nav_safety'), path: '/safety', icon: ShieldCheck }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/collector' && location.pathname === '/');
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? 'text-brand-700 font-black'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-brand-100 text-brand-700' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              </div>
              <span className="text-[10px] leading-tight truncate px-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
