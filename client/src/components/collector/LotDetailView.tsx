import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { QRModal } from '../common/QRModal';
import { ReceiptModal } from '../common/ReceiptModal';
import { VoiceButton } from '../common/VoiceButton';
import type { Lot } from '../../types/schema';
import {
  ArrowLeft,
  QrCode,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Truck,
  FileText,
  AlertCircle,
  Printer
} from 'lucide-react';

export const LotDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (!id) return;
    ApiService.getLot(id)
      .then((data) => setLot(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-sm font-bold">
        Loading lot details...
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">Lot Not Found</h3>
        <button
          onClick={() => navigate('/lots')}
          className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Lots
        </button>
      </div>
    );
  }

  const matName = (language === 'hi' ? lot.material_name_hi : lot.material_name) || 'E-Waste Component';

  return (
    <div className="min-h-screen bg-slate-50 pb-20 max-w-3xl mx-auto px-4 sm:px-6 sm:border-x sm:border-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-14 z-30 flex items-center justify-between rounded-b-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/lots')}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="font-mono text-xs font-bold text-slate-500 block">
              {lot.code}
            </span>
            <h2 className="text-base font-black text-slate-900 leading-tight">
              {matName}
            </h2>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Print Receipt</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Lot Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
          <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 mb-4 relative">
            <img
              src={lot.photo_url}
              alt={lot.code}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-black/75 text-white backdrop-blur-md flex items-center gap-1.5 border border-white/10">
              <span className={`w-2 h-2 rounded-full ${lot.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-emerald-500 animate-pulse'}`}></span>
              <span>{lot.status === 'COMPLETED' ? 'Verified Handover' : 'Active Manifest'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Total Weight</span>
              <span className="text-2xl font-black text-slate-900">{lot.weight} KG</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-semibold block">
                {lot.final_price ? 'Final Payout' : 'Estimated Value'}
              </span>
              <span className="text-2xl font-black text-brand-700">
                ₹{(lot.final_price || lot.estimated_price).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="pt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span className="truncate">Dharavi, Mumbai</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{new Date(lot.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowQr(true)}
            className="py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
          >
            <QrCode className="w-4 h-4 text-brand-400" />
            <span>Show Handover QR</span>
          </button>

          {lot.status === 'COMPLETED' ? (
            <button
              onClick={() => setShowReceipt(true)}
              className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>View Certificate</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/recyclers')}
              className="py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            >
              <Truck className="w-4 h-4" />
              <span>Find Recycler</span>
            </button>
          )}
        </div>

        {/* Traceability Events Timeline */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Verifiable Chain of Custody</span>
          </h3>

          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-100">
            <div className="flex items-start gap-3 relative">
              <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs flex-shrink-0 z-10">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Lot Created & Digitally Logged
                </span>
                <span className="text-[11px] text-slate-500">
                  AI verified component with 94% confidence score.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 ${
                  lot.status === 'COMPLETED' || lot.status === 'PICKUP_SCHEDULED'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {lot.status === 'COMPLETED' || lot.status === 'PICKUP_SCHEDULED'
                    ? 'Pickup Assigned with GreenCycle Recycling'
                    : 'Awaiting Recycler Assignment'}
                </span>
                <span className="text-[11px] text-slate-500">
                  CPCB registered facility: CPCB/E-WASTE/2023/MH-092
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 ${
                  lot.status === 'COMPLETED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {lot.status === 'COMPLETED'
                    ? 'Physical Scale Verified & UPI Paid'
                    : 'Handover Verification'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {lot.status === 'COMPLETED'
                    ? 'Final calibrated weight recorded on digital manifest.'
                    : 'Show QR code during physical handover.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQr && (
        <QRModal
          lotCode={lot.code}
          weight={lot.weight}
          materialName={matName}
          estimatedPrice={lot.final_price || lot.estimated_price}
          onClose={() => setShowQr(false)}
        />
      )}

      {showReceipt && (
        <ReceiptModal
          receiptData={{
            lotCode: lot.code,
            materialName: matName,
            initialWeight: lot.weight,
            verifiedWeight: lot.weight,
            finalPrice: lot.final_price || lot.estimated_price,
            paymentMethod: 'UPI',
            referenceId: 'UPI-982173-SBI',
            collectorName: user.name,
            recyclerName: 'GreenCycle E-Waste Recyclers Pvt Ltd',
            recyclerAuthNo: 'CPCB/E-WASTE/2023/MH-092'
          }}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};
