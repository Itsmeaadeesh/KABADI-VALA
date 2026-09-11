import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import type { Lot } from '../../types/schema';
import {
  Package,
  Truck,
  Scale,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const RecyclerDashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getLots()
      .then((data) => setLots(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    { label: 'Incoming Lots', val: '42', sub: '8 awaiting quote', icon: Package, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending Pickups', val: '12', sub: '3 scheduled today', icon: Truck, color: 'text-amber-600 bg-amber-50' },
    { label: 'This Month Weight', val: '2.8 Tonnes', sub: '+18% vs last month', icon: Scale, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Purchase Value', val: '₹4.7 Lakh', sub: 'Verified payouts', icon: DollarSign, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Handover Quick Action */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4 border border-blue-900/40">
        <div>
          <span className="text-xs font-bold text-blue-400 tracking-wider uppercase block mb-1">
            Recycler Operations Portal
          </span>
          <h1 className="text-2xl font-black tracking-tight">
            Facility Logistics & Handover Desk
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Sourcing secondary raw materials directly from informal aggregators and waste pickers under CPCB compliance guidelines.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/recycler/handover')}
            className="py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 transition active:scale-95"
          >
            <Scale className="w-4 h-4" />
            <span>Scale & Verify Handover</span>
          </button>
          <button
            onClick={() => navigate('/recycler/prices')}
            className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition"
          >
            <DollarSign className="w-4 h-4" />
            <span>Manage Buy Rates</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {kpi.label}
                </span>
                <div className={`p-2.5 rounded-2xl ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {kpi.val}
                </div>
                <span className="text-xs text-slate-500 font-medium block mt-0.5">
                  {kpi.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Incoming Lots Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Live Incoming E-Waste Lots
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Lots created by nearby aggregators and kabadiwalas
            </p>
          </div>
          <button
            onClick={() => navigate('/recycler/lots')}
            className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Lots</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Lot ID</th>
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Collector</th>
                <th className="py-3 px-4">Estimated Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {lots.slice(0, 5).map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {l.code}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800">{l.material_name || 'Circuit Board'}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{l.material_code || 'PCB'}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    {l.weight} KG
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {l.collector_name || 'Ramesh (Dharavi)'}
                  </td>
                  <td className="py-3.5 px-4 font-black text-brand-700">
                    ₹{(l.final_price || l.estimated_price).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    {l.status === 'COMPLETED' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Verified & Paid
                      </span>
                    ) : l.status === 'PICKUP_SCHEDULED' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        Pickup Scheduled
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        New Lot
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate('/recycler/lots')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-[11px] transition"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
