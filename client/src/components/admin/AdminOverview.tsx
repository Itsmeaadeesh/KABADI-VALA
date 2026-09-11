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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Users,
  Scale,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getAnalytics()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm font-bold">
        Aggregating national secondary raw material flow metrics...
      </div>
    );
  }

  const kpis = [
    { label: 'Collectors Formalized', val: data.kpis.collectorsFormalized.toLocaleString('en-IN'), sub: 'Direct bank & digital ID verified', icon: Users, color: 'text-purple-400 bg-purple-500/10' },
    { label: 'E-Waste Diverted', val: `${data.kpis.eWasteDivertedTonnes} Tonnes`, sub: 'Channeled from informal dumps', icon: Scale, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Verified Transactions', val: data.kpis.verifiedTransactions.toLocaleString('en-IN'), sub: 'With immutable digital manifests', icon: CheckCircle2, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Direct Value Delivered', val: `₹${data.kpis.purchaseValueLakhs} Lakh`, sub: 'Zero middleman deductions', icon: DollarSign, color: 'text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700 shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {kpi.label}
                </span>
                <div className={`p-2.5 rounded-2xl ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white tracking-tight">
                  {kpi.val}
                </div>
                <span className="text-xs text-slate-400 font-medium block mt-0.5">
                  {kpi.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Diverted Tonnage Chart */}
        <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-white">
                Monthly E-Waste Diverted (Tonnes)
              </h3>
              <p className="text-xs text-slate-400">
                Secondary collection volume growth across Maharashtra
              </p>
            </div>
            <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              +78% FY26
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val} Tonnes`, 'Diverted']}
                />
                <Bar dataKey="diverted" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Material Distribution Breakdown */}
        <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-white">
                Material Flow Composition
              </h3>
              <p className="text-xs text-slate-400">
                Segregated proportion of high-value e-scrap
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              JNARDDC AUDITED
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.materialBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.materialBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val}%`, 'Composition']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-700/60 text-xs">
            {data.materialBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name}</span>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
        ℹ️ {data.disclaimer}
      </div>
    </div>
  );
};
