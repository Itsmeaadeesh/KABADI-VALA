import React from 'react';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Truck,
  Star,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const FacilityProfile: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-3xl flex items-center justify-center font-black">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CPCB AUTHORIZED</span>
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.85 / 5.0</span>
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 leading-tight">
                GreenCycle E-Waste Recyclers Pvt Ltd
              </h1>
              <p className="text-xs font-mono font-semibold text-slate-500 mt-0.5">
                Reg No: CPCB/E-WASTE/2023/MH-092
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Attributes */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Facility Address</span>
            <span className="font-bold text-slate-800 mt-0.5 block leading-relaxed">
              Plot 44, TTC Industrial Area, MIDC Mahape, Navi Mumbai - 400710
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">GPS Coordinates</span>
            <span className="font-mono font-bold text-slate-800 mt-0.5 block">
              19.1120° N, 73.0180° E
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Logistics Radius</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              35.0 KM (MMR Region Coverage)
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Authorized Contact</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              +91 98200 11223 (Rajesh Sharma)
            </span>
          </div>
        </div>
      </div>

      {/* Compliance & Materials Accepted */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>E-Waste Management Rules 2022 Compliance</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Authorized for R-1 to R-5 recovery processes (Hydrometallurgical & pyrometallurgical)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Valid Consent to Operate (CTO) from Maharashtra Pollution Control Board (MPCB)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Connected to CPCB Central EPR Portal for verified recycling credits generation</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 block mb-2">
            Authorized Material Categories Accepted
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'Motherboards & High-Grade PCBs',
              'Lithium-Ion & LFP Battery Packs',
              'Copper Insulated Power Wires',
              'Electric Motors & Alternators',
              'LCD Panels & Display Glass',
              'Lead-Acid Inverter Batteries'
            ].map((mat, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
