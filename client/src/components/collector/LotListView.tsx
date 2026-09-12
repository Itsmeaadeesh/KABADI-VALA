import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { CollectorBottomNav } from './CollectorBottomNav';
import { QRModal } from '../common/QRModal';
import type { Lot } from '../../types/schema';
import { Package, Plus, QrCode, ChevronRight, Clock, CheckCircle2, Truck, ArrowLeft } from 'lucide-react';

export const LotListView: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQrLot, setActiveQrLot] = useState<Lot | null>(null);

  const loadLots = () => {
    setLoading(true);
    ApiService.getLots({ collectorId: 'col-ramesh-1' })
      .then((data) => setLots(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLots();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('status_verified_paid')}</span>
          </span>
        );
      case 'PICKUP_SCHEDULED':
      case 'PICKED_UP':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Truck className="w-3.5 h-3.5" />
            <span>{t('status_pickup_scheduled')}</span>
          </span>
        );
      case 'LOCAL_PENDING_SYNC':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span>{t('status_saved_locally')}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('status_new_lot')}</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-collector-nav max-w-4xl mx-auto px-3 sm:px-6 sm:border-x sm:border-slate-200">
      {/* Header */}
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
              {t('nav_lots')}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
              {lots.length} {t('lots_registered_count')}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/sell')}
          className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-md shadow-emerald-600/20 active:scale-95 transition touch-manipulation flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('card_sell_title')}</span>
        </button>
      </div>

      {/* Lot List */}
      <div className="p-3 sm:p-4 space-y-3">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm font-medium">
            {t('syncing')}
          </div>
        ) : lots.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 mb-1">{t('no_lots_title')}</h3>
            <p className="text-xs text-slate-400 mb-4">
              {t('no_lots_desc')}
            </p>
            <button
              onClick={() => navigate('/sell')}
              className="py-3 px-6 bg-emerald-600 text-white font-black rounded-xl text-xs"
            >
              {t('sell_first_lot')}
            </button>
          </div>
        ) : (
          lots.map((lot) => (
            <div
              key={lot.id}
              onClick={() => navigate(`/lots/${lot.id}`)}
              className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs hover:border-emerald-400 transition cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-xs font-bold text-slate-500">
                  {lot.code}
                </span>
                {getStatusBadge(lot.status)}
              </div>

              <div className="flex items-center gap-3">
                {lot.photo_url ? (
                  <img
                    src={lot.photo_url}
                    alt={lot.code}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 font-bold">
                    <Package className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-black text-slate-900 truncate">
                    {language === 'hi'
                      ? lot.material_name_hi || lot.material_name
                      : language === 'mr'
                      ? lot.material_name_hi || lot.material_name
                      : lot.material_name || 'E-Waste Material'}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {t('weight_kg')}: <span className="font-bold text-slate-800">{lot.weight} KG</span>
                  </p>
                  <div className="text-base font-black text-emerald-700 mt-1">
                    ₹{(lot.final_price || lot.estimated_price).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveQrLot(lot);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Show Handover QR"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activeQrLot && (
        <QRModal
          lotCode={activeQrLot.code}
          weight={activeQrLot.weight}
          materialName={activeQrLot.material_name || 'E-Waste'}
          estimatedPrice={activeQrLot.final_price || activeQrLot.estimated_price}
          onClose={() => setActiveQrLot(null)}
        />
      )}

      <CollectorBottomNav />
    </div>
  );
};
