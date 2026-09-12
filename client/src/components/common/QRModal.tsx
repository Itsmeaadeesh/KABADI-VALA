import React from 'react';
import { X, QrCode, ShieldCheck, Copy, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface QRModalProps {
  lotCode: string;
  weight: number;
  materialName: string;
  estimatedPrice: number;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({
  lotCode,
  weight,
  materialName,
  estimatedPrice,
  onClose
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(lotCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-sm w-full p-4 sm:p-6 pb-8 shadow-2xl border border-slate-100 text-center relative animate-scale-up max-h-[90vh] overflow-y-auto my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-brand-100 text-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-1">
          {t('handover_title')}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          {t('handover_qr_hint')}
        </p>

        {/* QR Simulation Box */}
        <div className="bg-slate-900 p-4 rounded-2xl inline-block mx-auto mb-4 shadow-inner">
          <div className="bg-white p-3 rounded-xl flex flex-col items-center">
            {/* Visual SVG QR representation */}
            <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" fill="white" />
              {/* Corner 1 */}
              <rect x="5" y="5" width="26" height="26" fill="black" />
              <rect x="8" y="8" width="20" height="20" fill="white" />
              <rect x="11" y="11" width="14" height="14" fill="black" />
              {/* Corner 2 */}
              <rect x="69" y="5" width="26" height="26" fill="black" />
              <rect x="72" y="8" width="20" height="20" fill="white" />
              <rect x="75" y="11" width="14" height="14" fill="black" />
              {/* Corner 3 */}
              <rect x="5" y="69" width="26" height="26" fill="black" />
              <rect x="8" y="72" width="20" height="20" fill="white" />
              <rect x="11" y="75" width="14" height="14" fill="black" />
              {/* Random deterministic matrix grid */}
              <rect x="36" y="8" width="6" height="6" fill="black" />
              <rect x="46" y="8" width="6" height="6" fill="black" />
              <rect x="56" y="14" width="6" height="6" fill="black" />
              <rect x="36" y="24" width="6" height="6" fill="black" />
              <rect x="46" y="28" width="6" height="6" fill="black" />
              <rect x="56" y="34" width="6" height="6" fill="black" />
              <rect x="12" y="38" width="6" height="6" fill="black" />
              <rect x="22" y="44" width="6" height="6" fill="black" />
              <rect x="36" y="44" width="8" height="8" fill="#16a34a" />
              <rect x="46" y="44" width="8" height="8" fill="#16a34a" />
              <rect x="40" y="52" width="10" height="6" fill="#16a34a" />
              <rect x="64" y="44" width="6" height="6" fill="black" />
              <rect x="74" y="44" width="6" height="6" fill="black" />
              <rect x="84" y="38" width="6" height="6" fill="black" />
              <rect x="36" y="64" width="6" height="6" fill="black" />
              <rect x="46" y="74" width="6" height="6" fill="black" />
              <rect x="56" y="84" width="6" height="6" fill="black" />
              <rect x="68" y="72" width="6" height="6" fill="black" />
              <rect x="84" y="84" width="6" height="6" fill="black" />
            </svg>
            <span className="text-[10px] font-mono tracking-wider font-bold text-slate-700 mt-2">
              CPCB VERIFIED DIGITAL MANIFEST
            </span>
          </div>
        </div>

        {/* Lot Details Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-semibold">{t('lot_id_label')}</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="font-mono text-base font-black text-slate-900 tracking-wide">
            {lotCode}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-xs">
            <span className="font-bold text-slate-700">{materialName}</span>
            <span className="font-black text-brand-700">{weight} KG ≈ ₹{estimatedPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>JNARDDC Traceable Chain of Custody</span>
        </div>
      </div>
    </div>
  );
};
