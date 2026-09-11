import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import type { Lot } from '../../types/schema';
import {
  PackageSearch,
  Filter,
  CheckCircle2,
  Truck,
  XCircle,
  Clock,
  Eye,
  X,
  Scale,
  DollarSign,
  AlertTriangle,
  Phone,
  ShieldCheck
} from 'lucide-react';

export const IncomingLots: React.FC = () => {
  const navigate = useNavigate();
  const [lots, setLots] = useState<Lot[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedLotForInspection, setSelectedLotForInspection] = useState<Lot | null>(null);
  const [offeredCustomRate, setOfferedCustomRate] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadLots = () => {
    setLoading(true);
    ApiService.getLots()
      .then((data) => setLots(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLots();
  }, []);

  const handleUpdateStatus = async (lotId: string, newStatus: string, notes?: string) => {
    try {
      const res = await fetch(`/api/lots/${lotId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          actorId: 'rec-greencycle-mum',
          actorRole: 'RECYCLER',
          recyclerId: 'rec-greencycle-mum',
          notes: notes || `Recycler set status to ${newStatus}`
        })
      });
      if (res.ok) {
        setActionSuccess(`Lot updated to ${newStatus}`);
        loadLots();
        setTimeout(() => {
          setActionSuccess(null);
          setSelectedLotForInspection(null);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLots = lots.filter((l) => {
    if (filterStatus === 'ALL') return true;
    return l.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Incoming E-Waste Lots Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Filter, inspect AI component classifications, schedule pickups, or verify handovers.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 text-xs font-bold shadow-2xs">
          {['ALL', 'NEW', 'PICKUP_SCHEDULED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl transition ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Lots' : st === 'NEW' ? 'New Offers' : st === 'PICKUP_SCHEDULED' ? 'Scheduled Pickups' : 'Completed'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Manifest ID</th>
                <th className="py-3 px-4">Photo</th>
                <th className="py-3 px-4">Material & Grade</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Estimated Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLots.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {l.code}
                  </td>
                  <td className="py-3.5 px-4">
                    <img
                      src={l.photo_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80'}
                      alt={l.code}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">
                      {l.material_name || 'Circuit Board'}
                    </span>
                    <span className="text-[10px] text-brand-700 font-semibold">
                      {l.ai_predicted_category || 'AI Verified'} (94%)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {l.weight} KG
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        l.condition === 'INTACT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : l.condition === 'STRIPPED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {l.condition}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-brand-700 text-sm">
                    ₹{(l.final_price || l.estimated_price).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    {l.status === 'COMPLETED' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified & Paid</span>
                      </span>
                    ) : l.status === 'PICKUP_SCHEDULED' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 inline-flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        <span>Pickup Scheduled</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>New Offer</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedLotForInspection(l)}
                      className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lot Inspection & Action Modal */}
      {selectedLotForInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 relative animate-scale-up">
            <button
              onClick={() => setSelectedLotForInspection(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {actionSuccess ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-3 animate-bounce" />
                <h3 className="text-xl font-black text-slate-900">{actionSuccess}</h3>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {selectedLotForInspection.code}
                    </span>
                    <h2 className="text-lg font-black text-slate-900 leading-tight">
                      {selectedLotForInspection.material_name || 'E-Waste Lot'}
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800">
                    {selectedLotForInspection.status}
                  </span>
                </div>

                {/* Photo & AI result */}
                <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 mb-4">
                  <img
                    src={selectedLotForInspection.photo_url}
                    alt={selectedLotForInspection.code}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Declared Weight</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedLotForInspection.weight} KG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Physical Condition</span>
                    <span className="font-bold text-slate-900">{selectedLotForInspection.condition} (+5% Bonus)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Estimated Value</span>
                    <span className="font-black text-brand-700 text-base">
                      ₹{selectedLotForInspection.estimated_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">Aggregator (Collector)</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedLotForInspection.collector_name || 'Ramesh Kumar (9999999999)'}
                    </span>
                  </div>
                </div>

                {/* Recycler Decision Actions */}
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedLotForInspection.id, 'ACCEPTED', 'Facility accepted lot price')}
                      className="py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-black shadow-md shadow-brand-600/20 flex items-center justify-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Lot</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedLotForInspection.id, 'PICKUP_SCHEDULED', 'Logistics pickup truck dispatched')}
                      className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Schedule Pickup</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedLotForInspection(null);
                        navigate('/recycler/handover');
                      }}
                      className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition"
                    >
                      <Scale className="w-4 h-4 text-brand-400" />
                      <span>Verify on Scale</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedLotForInspection.id, 'CANCELLED', 'Lot rejected due to non-conforming hazardous elements')}
                      className="py-3 px-4 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Lot</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
