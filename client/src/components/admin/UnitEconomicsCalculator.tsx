import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Building,
  Coins
} from 'lucide-react';

export const UnitEconomicsCalculator: React.FC = () => {
  const [lotWeightKg, setLotWeightKg] = useState<number>(100);
  const [middlemanCutPct, setMiddlemanCutPct] = useState<number>(16);
  const [qualityBonusPct, setQualityBonusPct] = useState<number>(5);

  // Baseline benchmark price for mixed circuit boards (₹50 / KG)
  const benchmarkRatePerKg = 55;
  const grossValue = lotWeightKg * benchmarkRatePerKg;

  // 1. Informal Channel Calculation
  const informalMiddlemanDeduction = Math.round(grossValue * (middlemanCutPct / 100));
  const informalCollectorPayout = grossValue - informalMiddlemanDeduction;

  // 2. Formal Platform Channel Calculation
  const formalQualityBonus = Math.round(grossValue * (qualityBonusPct / 100));
  const formalCollectorPayout = grossValue + formalQualityBonus;

  // Net Gain for the Grassroots Collector
  const netGainAmount = formalCollectorPayout - informalCollectorPayout;
  const netGainPercentage = Math.round((netGainAmount / informalCollectorPayout) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-400 tracking-wider uppercase block mb-1">
            Economic Inclusion & Formalization Model
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Unit Economics & Collector Surplus Calculator
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Demonstrating how eliminating multi-tiered speculative scrap middlemen delivers higher net payouts to informal kabadiwalas while preserving platform self-sustainability.
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
          <Calculator className="w-6 h-6" />
        </div>
      </div>

      {/* Interactive Control Sliders */}
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-lg space-y-5">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 fill-current" />
          <span>Simulation Parameters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div>
            <div className="flex justify-between font-bold text-slate-300 mb-1.5">
              <span>Lot Weight</span>
              <span className="text-white font-black text-sm">{lotWeightKg} KG</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={lotWeightKg}
              onChange={(e) => setLotWeightKg(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-300 mb-1.5">
              <span>Informal Middleman Cut</span>
              <span className="text-rose-400 font-black text-sm">{middlemanCutPct}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="35"
              step="1"
              value={middlemanCutPct}
              onChange={(e) => setMiddlemanCutPct(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-300 mb-1.5">
              <span>Intact Quality Bonus</span>
              <span className="text-emerald-400 font-black text-sm">+{qualityBonusPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={qualityBonusPct}
              onChange={(e) => setQualityBonusPct(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Comparison Grid: Informal vs Formal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informal Card */}
        <div className="bg-slate-800/80 rounded-3xl p-6 border-2 border-rose-500/30 shadow-lg relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <span className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>Informal Status Quo</span>
            </span>
            <span className="text-xs font-mono text-slate-400">Cash / Middlemen</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Gross Material Value</span>
              <span className="font-bold text-white">₹{grossValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-rose-400 font-semibold">
              <span>Aggregator Cash Discount ({middlemanCutPct}%)</span>
              <span>-₹{informalMiddlemanDeduction.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Health & Safety Hazard Cost</span>
              <span className="text-rose-400 font-bold">Unmitigated Exposure</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Formal Bank Credit Footprint</span>
              <span>₹0 (Zero record)</span>
            </div>

            <div className="pt-4 border-t border-slate-700 text-center">
              <span className="text-[11px] uppercase font-bold text-slate-400 block">
                Net Collector Payout
              </span>
              <div className="text-3xl font-black text-slate-200 mt-1 font-mono">
                ₹{informalCollectorPayout.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Formal Platform Card */}
        <div className="bg-slate-800/80 rounded-3xl p-6 border-2 border-emerald-500/50 shadow-lg shadow-emerald-900/10 relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Kabadiwala Connect Channel</span>
            </span>
            <span className="text-xs font-mono text-emerald-300">CPCB Authorized</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Direct Benchmark Value</span>
              <span className="font-bold text-white">₹{grossValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Intact Non-Smash Bonus (+{qualityBonusPct}%)</span>
              <span>+₹{formalQualityBonus.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Platform Fee (Borne by Recycler)</span>
              <span className="text-emerald-400 font-bold">₹0 for Collector</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Verifiable Digital Khata Record</span>
              <span className="text-emerald-400 font-bold">Bank Statement Ready</span>
            </div>

            <div className="pt-4 border-t border-slate-700 text-center">
              <span className="text-[11px] uppercase font-bold text-emerald-400 block">
                Net Collector Payout
              </span>
              <div className="text-3xl font-black text-emerald-400 mt-1 font-mono">
                ₹{formalCollectorPayout.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Net Surplus Summary Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-2 border-emerald-500/40 p-5 rounded-3xl text-center shadow-xl">
        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">
          Net Collector Economic Gain
        </span>
        <div className="text-4xl font-black text-white my-1 font-mono">
          +₹{netGainAmount.toLocaleString('en-IN')}{' '}
          <span className="text-xl text-emerald-400 font-sans font-bold">
            (+{netGainPercentage}%)
          </span>
        </div>
        <p className="text-xs text-slate-300 font-medium">
          Delivered directly into the informal collector’s bank account via digital scale verification.
        </p>
      </div>

      {/* Four Pillars of Platform Sustainability */}
      <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-lg space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-purple-400" />
          <span>Platform Self-Sustainability Revenue Streams</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
            <span className="font-black text-purple-400 block mb-1">
              1. Recycler Transaction Fee (1.5% - 2.5%)
            </span>
            <p className="text-slate-400 leading-relaxed">
              Authorized facilities pay a small sourcing fee for access to steady, clean, presorted secondary e-waste streams.
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
            <span className="font-black text-emerald-400 block mb-1">
              2. EPR Credit Facilitation
            </span>
            <p className="text-slate-400 leading-relaxed">
              Electronics producers (OEMs) purchase verified traceability manifests to fulfill Central Pollution Control Board EPR obligations.
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
            <span className="font-black text-blue-400 block mb-1">
              3. Recycler SaaS Logistics Tier
            </span>
            <p className="text-slate-400 leading-relaxed">
              Premium dashboard capabilities including dynamic route dispatching, CPCB Form 6 automated generation, and scale IoT integration.
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
            <span className="font-black text-amber-400 block mb-1">
              4. Institutional R&D Grants
            </span>
            <p className="text-slate-400 leading-relaxed">
              Ministry of Mines / JNARDDC strategic metal recovery data and supply chain security research grants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
