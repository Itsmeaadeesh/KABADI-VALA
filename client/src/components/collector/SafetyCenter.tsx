import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { CollectorBottomNav } from './CollectorBottomNav';
import { VoiceButton } from '../common/VoiceButton';
import type { SafetyGuide } from '../../types/schema';
import {
  ShieldAlert,
  Flame,
  FlaskConical,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Flame,
  FlaskConical,
  AlertTriangle,
  ShieldCheck,
  Sparkles
};

export const SafetyCenter: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [guides, setGuides] = useState<SafetyGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getSafetyGuides()
      .then((data) => setGuides(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const donts = guides.filter((g) => g.type === 'DONT');
  const dos = guides.filter((g) => g.type === 'DO');

  return (
    <div className="min-h-screen bg-slate-50 pb-24 max-w-4xl mx-auto px-4 sm:px-6 sm:border-x sm:border-slate-200">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-14 z-30 flex items-center justify-between rounded-b-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/collector')}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition"
            aria-label="Back to Collector Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">
              {t('safety_title')}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Safe e-waste handling & health guidelines
            </p>
          </div>
        </div>

        <VoiceButton
          textToSpeak={
            language === 'hi'
              ? 'सुरक्षा केंद्र: तेजाब और आग से दूर रहें। सुरक्षित हैंडलिंग से 5% अतिरिक्त बोनस मिलता है।'
              : 'Safety Center: Avoid acid baths and open burning. Safe certified handling grants +5% bonus on your scrap.'
          }
          size="sm"
        />
      </div>

      <div className="p-4 space-y-5">
        {/* Intro banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 text-emerald-900 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            {t('safety_desc')}
          </p>
        </div>

        {/* Prohibited Practices */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <XCircle className="w-4 h-4 text-rose-600 stroke-[2.5]" />
            <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider">
              {t('dont_heading')}
            </h3>
          </div>

          {donts.map((guide) => {
            const IconComp = ICON_MAP[guide.icon] || Flame;
            const title = language === 'hi' ? guide.title_hi : language === 'mr' ? guide.title_mr : guide.title;
            const desc = language === 'hi' ? guide.description_hi : language === 'mr' ? guide.description_mr : guide.description;

            return (
              <div
                key={guide.id}
                className="bg-white rounded-3xl p-4 border-2 border-rose-100 hover:border-rose-300 shadow-xs transition"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1 inline-flex items-center gap-1 border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block"></span>
                      <span>PROHIBITED / HAZARD</span>
                    </span>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {title}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
                  <VoiceButton textToSpeak={`${title}. ${desc}`} size="sm" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended Practices */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 px-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <h3 className="text-sm font-black text-emerald-900 uppercase tracking-wider">
              {t('do_heading')}
            </h3>
          </div>

          {dos.map((guide) => {
            const IconComp = ICON_MAP[guide.icon] || ShieldCheck;
            const title = language === 'hi' ? guide.title_hi : language === 'mr' ? guide.title_mr : guide.title;
            const desc = language === 'hi' ? guide.description_hi : language === 'mr' ? guide.description_mr : guide.description;

            return (
              <div
                key={guide.id}
                className="bg-white rounded-3xl p-4 border-2 border-emerald-100 hover:border-emerald-300 shadow-xs transition"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1 inline-flex items-center gap-1 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                      <span>RECOMMENDED (+5% BONUS)</span>
                    </span>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {title}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
                  <VoiceButton textToSpeak={`${title}. ${desc}`} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CollectorBottomNav />
    </div>
  );
};
