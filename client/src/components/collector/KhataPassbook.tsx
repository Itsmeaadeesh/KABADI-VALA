import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { CollectorBottomNav } from './CollectorBottomNav';
import { VoiceButton } from '../common/VoiceButton';
import type { Transaction } from '../../types/schema';
import {
  BookOpen,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  X,
  ArrowLeft
} from 'lucide-react';

export const KhataPassbook: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    thisMonthEarnings: 18450,
    pendingAmount: 3250,
    completedLotsCount: 17,
    inTransitCount: 2
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStatementModal, setShowStatementModal] = useState(false);

  useEffect(() => {
    ApiService.getCollectorKhata('col-ramesh-1')
      .then((data) => {
        if (data.summary) setSummary(data.summary);
        if (data.transactions) setTransactions(data.transactions);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const speechPhrase = language === 'hi'
    ? `मेरा खाता: इस महीने की कुल कमाई ₹${summary.thisMonthEarnings.toLocaleString('en-IN')} है, और ₹${summary.pendingAmount.toLocaleString('en-IN')} सत्यापन में बाकी है।`
    : `Mera Khata: Total earnings this month is ₹${summary.thisMonthEarnings.toLocaleString('en-IN')}, with ₹${summary.pendingAmount.toLocaleString('en-IN')} pending verification.`;

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
              {t('khata_title')}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Verifiable digital earnings & passbook
            </p>
          </div>
        </div>

        <VoiceButton textToSpeak={speechPhrase} size="sm" />
      </div>

      <div className="p-4 space-y-4">
        {/* Main Earnings Card */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-emerald-800/40 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              {t('this_month_earnings')} (Sept 2026)
            </span>
            <span className="text-[10px] bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-slate-950" />
              <span>Verified Bank Sync</span>
            </span>
          </div>

          <div className="text-4xl font-black text-white my-1 tracking-tight">
            ₹{summary.thisMonthEarnings.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Recorded through authorized recycling manifests
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
            <div className="bg-white/5 p-2 rounded-2xl">
              <span className="text-[10px] text-purple-200 block uppercase font-bold">Pending</span>
              <span className="text-sm font-black text-amber-400">
                ₹{summary.pendingAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-white/5 p-2 rounded-2xl">
              <span className="text-[10px] text-purple-200 block uppercase font-bold">Completed</span>
              <span className="text-sm font-black text-emerald-400">
                {summary.completedLotsCount}
              </span>
            </div>
            <div className="bg-white/5 p-2 rounded-2xl">
              <span className="text-[10px] text-purple-200 block uppercase font-bold">In Transit</span>
              <span className="text-sm font-black text-blue-400">
                {summary.inTransitCount}
              </span>
            </div>
          </div>
        </div>

        {/* Download Statement CTA */}
        <button
          onClick={() => setShowStatementModal(true)}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl text-xs font-black text-slate-800 shadow-xs flex items-center justify-center gap-2 transition active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4 text-purple-600" />
          <span>{t('download_statement')}</span>
        </button>

        {/* Transaction History Feed */}
        <div className="space-y-2.5">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider block px-1">
            {t('transaction_history')}
          </span>

          {transactions.length === 0 ? (
            <div className="p-4 bg-white rounded-2xl text-center text-xs text-slate-400">
              No completed transactions yet.
            </div>
          ) : (
            transactions.map((txn) => (
              <div
                key={txn.id}
                className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {language === 'hi' ? txn.material_name_hi : txn.material_name || 'E-Waste'}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {txn.recycler_facility_name || 'Authorized Recycler'} • {txn.weight ? `${txn.weight} KG` : '12.2 KG'}
                    </p>
                    <span className="font-mono text-[10px] text-brand-700 font-bold block mt-0.5">
                      Ref: {txn.reference_id}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-emerald-700 block">
                    +₹{txn.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {new Date(txn.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Official Income Statement Modal */}
      {showStatementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-scale-up print:shadow-none print:border-none">
            <button
              onClick={() => setShowStatementModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-3 border-b border-slate-200">
              <span className="text-[10px] font-bold text-brand-700 uppercase tracking-widest bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                SIH #26229 • CIRCULAR ECONOMY LEDGER (DEMO)
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                Digital Earnings Record (Demo Data)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Collector: Ramesh Kumar • Phone: 9999999999
              </p>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl flex justify-between font-bold">
                <span>Total Formalized Tonnage Diverted</span>
                <span className="text-brand-700">0.42 Tonnes (420 KG)</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl flex justify-between font-bold">
                <span>Total Certified Transactions</span>
                <span className="text-slate-900">17 Transactions</span>
              </div>
              <div className="bg-brand-50 p-3.5 rounded-2xl flex justify-between font-black text-sm text-brand-900 border border-brand-200">
                <span>Total Earnings Deposited (UPI)</span>
                <span>₹{summary.thisMonthEarnings.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl flex justify-between font-bold border border-emerald-200">
                <span className="text-emerald-900">Estimated Loan Readiness</span>
                <span className="text-emerald-700 font-black">Tier-2 Ready (Simulated)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-center">
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                This simulated record demonstrates verifiable transaction history of secondary raw material recovery and regular earnings under Extended Producer Responsibility (EPR) guidelines for SIH Problem Statement 26229.
              </p>

              <div className="flex gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CollectorBottomNav />
    </div>
  );
};
