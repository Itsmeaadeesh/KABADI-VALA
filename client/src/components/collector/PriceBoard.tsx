import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { VoiceService } from '../../services/voice';
import { useLanguage } from '../../context/LanguageContext';
import { VoiceButton } from '../common/VoiceButton';
import { CollectorBottomNav } from './CollectorBottomNav';
import type { PriceRecord } from '../../types/schema';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Cpu,
  Zap,
  BatteryCharging,
  Cog,
  Info,
  ArrowLeft
} from 'lucide-react';

export const PriceBoard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [prices, setPrices] = useState<PriceRecord[]>([]);
  const [historyDays, setHistoryDays] = useState<7 | 30>(30);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedChartMat, setSelectedChartMat] = useState<string>('PCB');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ApiService.getPrices(),
      ApiService.getPriceHistory(undefined, historyDays)
    ])
      .then(([pricesRes, historyRes]) => {
        setPrices(pricesRes);
        if (historyRes && historyRes.chartData) {
          setChartData(historyRes.chartData);
        }
      })
      .finally(() => setLoading(false));
  }, [historyDays]);

  const getTrendIcon = (dir: string, pct: number) => {
    if (dir === 'UP') {
      return (
        <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-full">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+{pct}%</span>
        </span>
      );
    }
    if (dir === 'DOWN') {
      return (
        <span className="inline-flex items-center gap-0.5 text-rose-600 font-bold text-xs bg-rose-50 px-2 py-0.5 rounded-full">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>{pct}%</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-slate-500 font-bold text-xs bg-slate-100 px-2 py-0.5 rounded-full">
        <Minus className="w-3.5 h-3.5" />
        <span>0.0%</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-collector-nav max-w-4xl mx-auto px-3 sm:px-6 sm:border-x sm:border-slate-200">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 p-3 sm:p-4 sticky top-14 z-30 flex items-center justify-between rounded-b-2xl shadow-xs">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={() => navigate('/collector')}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition touch-manipulation active:scale-95 flex-shrink-0"
            aria-label="Back to Collector Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl font-black text-slate-900 leading-tight truncate">
              {t('price_board_title')}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
              {t('price_board_sub')}
            </p>
          </div>
        </div>

        <VoiceButton
          textToSpeak={
            language === 'hi'
              ? 'तांबे की केबल ₹520 प्रति किलो और हाई ग्रेड पीसीबी ₹410 प्रति किलो चल रही है।'
              : language === 'mr'
              ? 'तांब्याची केबल ₹520 प्रति किलो आणि हाय ग्रेड पीसीबी ₹410 प्रति किलो सुरू आहे.'
              : 'Copper cable is trading at ₹520/kg and high grade PCB is trading at ₹410/kg.'
          }
          size="sm"
        />
      </div>

      <div className="p-3 sm:p-4 space-y-3.5 sm:space-y-4">
        {/* Interactive Chart Box */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 fill-current" />
              <span>{t('historical_trend')}</span>
            </span>

            {/* 7d vs 30d toggle */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setHistoryDays(7)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  historyDays === 7 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setHistoryDays(30)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  historyDays === 30 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                30D
              </button>
            </div>
          </div>

          {/* Material Selectors for Chart */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
            {[
              { code: 'PCB', label: language === 'hi' ? 'सर्किट बोर्ड' : language === 'mr' ? 'सर्किट बोर्ड' : 'Motherboard', color: '#16a34a' },
              { code: 'CABLE_CU', label: language === 'hi' ? 'तांबा केबल' : language === 'mr' ? 'तांबे केबल' : 'Copper Cable', color: '#ea580c' },
              { code: 'BAT_LI', label: language === 'hi' ? 'लिथियम बैटरी' : language === 'mr' ? 'लिथियम बॅटरी' : 'Li-ion Battery', color: '#9333ea' },
              { code: 'MOTORS', label: language === 'hi' ? 'मोटर्स' : language === 'mr' ? 'मोटर्स' : 'Motors', color: '#0284c7' }
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => setSelectedChartMat(item.code)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                  selectedChartMat === item.code
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Recharts Curve */}
          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => d.slice(8)}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  formatter={(val: any) => [`₹${val} / KG`, selectedChartMat]}
                />
                <Line
                  type="monotone"
                  dataKey={selectedChartMat}
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#16a34a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Material Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prices.map((p) => {
            const matName = language === 'hi' ? p.name_hi : language === 'mr' ? p.name_mr : p.name;
            const phrase = VoiceService.getPricePhrase(matName, p.benchmark_rate, language);

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center justify-between hover:border-brand-400 transition"
              >
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {p.code}
                    </span>
                    {getTrendIcon(p.trend_direction, p.trend_percentage)}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {matName}
                  </h4>
                  <div className="text-xl font-black text-brand-700 mt-1">
                    ₹{p.benchmark_rate}{' '}
                    <span className="text-xs font-semibold text-slate-500 font-sans">
                      / {p.unit}
                    </span>
                  </div>
                </div>

                <VoiceButton textToSpeak={phrase} size="sm" />
              </div>
            );
          })}
        </div>
      </div>

      <CollectorBottomNav />
    </div>
  );
};
