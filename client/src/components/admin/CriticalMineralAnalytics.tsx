import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import type { AnalyticsData } from '../../types/schema';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { Gem, ShieldCheck, Sparkles, AlertCircle, Info } from 'lucide-react';

export const CriticalMineralAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    ApiService.getAnalytics().then((res) => setData(res));
  }, []);

  if (!data) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm font-bold">
        Computing critical mineral yield matrices...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-blue-950 p-6 rounded-3xl border border-purple-800/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
              DEMO / ESTIMATED ANALYTICS
            </span>
            <span className="text-xs text-purple-300 font-semibold">
              JNARDDC Mineral Recovery Models
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Strategic Critical Mineral Recovery Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Urban mining yield predictions from formalized secondary raw materials. Tracks domestic mineral retention vital for India's clean energy transition and EV manufacturing.
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
          <Gem className="w-7 h-7" />
        </div>
      </div>

      {/* Critical Mineral Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.criticalMinerals.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700 shadow-lg relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs text-white" style={{ backgroundColor: item.color }}>
                  {item.symbol}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                  {item.strategicGrade}
                </span>
              </div>

              <h3 className="text-sm font-black text-white">
                {item.mineral}
              </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60">
              <span className="text-2xl font-black text-white font-mono tracking-tight">
                {item.amount.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-sans text-slate-400 uppercase">{item.unit}</span>
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Recovered through formal e-waste
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Visualization */}
      <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-white">
              Estimated Yield Comparison (Scaled Metric)
            </h3>
            <p className="text-xs text-slate-400">
              Relative extraction ratio per 100 tonnes of diversified electronic scrap
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            JNARDDC BENCHMARK
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.criticalMinerals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="symbol" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(val: any, _name: any, props: any) => [
                  `${val} ${props.payload.unit}`,
                  props.payload.mineral
                ]}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {data.criticalMinerals.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Methodology Disclaimer */}
      <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Mandatory Hackathon Disclosure:</strong> Mineral recovery quantities shown are algorithmic estimates based on verified lot weight compositions and laboratory hydrometallurgical recovery efficiencies established by JNARDDC research benchmarks. Real-world assay variances may apply.
        </p>
      </div>
    </div>
  );
};
