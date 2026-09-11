import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import type { RecyclerFacility } from '../../types/schema';
import {
  ShieldCheck,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  MapPin
} from 'lucide-react';

export const RecyclerComplianceAudit: React.FC = () => {
  const [recyclers, setRecyclers] = useState<RecyclerFacility[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadRecyclers = () => {
    setLoading(true);
    ApiService.getRecyclers()
      .then((data) => setRecyclers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRecyclers();
  }, []);

  const handleToggleStatus = async (recyclerId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'AUTHORIZED' ? 'SUSPENDED' : 'AUTHORIZED';
    try {
      const res = await fetch(`/api/recyclers/${recyclerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        loadRecyclers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = recyclers.filter(
    (r) =>
      r.facility_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.authorization_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            CPCB / SPCB Authorized Recyclers Registry
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ministry of Mines & Central Pollution Control Board statutory accreditation compliance audit.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search facility, reg no, city..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
          />
        </div>
      </div>

      {/* Facilities Table */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/70 text-slate-400 font-bold border-b border-slate-700">
                <th className="py-3 px-4">Facility Name</th>
                <th className="py-3 px-4">CPCB Authorization</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Radius</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 font-medium">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-700/30 transition">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span>{r.facility_name}</span>
                      <span className="text-[10px] text-slate-400 block">{r.contact_phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-purple-300">
                    {r.authorization_number}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {r.city}, {r.state}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {r.service_radius} KM
                  </td>
                  <td className="py-3.5 px-4 text-amber-400 font-bold">
                    ⭐ {r.rating}
                  </td>
                  <td className="py-3.5 px-4">
                    {r.authorization_status === 'AUTHORIZED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>AUTHORIZED</span>
                      </span>
                    ) : r.authorization_status === 'PENDING' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        <span>PENDING AUDIT</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3 h-3" />
                        <span>SUSPENDED</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(r.id, r.authorization_status)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                        r.authorization_status === 'AUTHORIZED'
                          ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                      }`}
                    >
                      {r.authorization_status === 'AUTHORIZED' ? 'Suspend' : 'Accredit'}
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
