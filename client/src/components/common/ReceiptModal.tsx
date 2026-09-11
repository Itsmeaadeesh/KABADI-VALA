import React from 'react';
import { X, CheckCircle2, Download, Printer, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ReceiptModalProps {
  receiptData: {
    lotCode: string;
    materialName: string;
    initialWeight: number;
    verifiedWeight: number;
    finalPrice: number;
    paymentMethod: string;
    referenceId: string;
    collectorName: string;
    recyclerName: string;
    recyclerAuthNo?: string;
    date?: string;
  };
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receiptData, onClose }) => {
  const { t } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative animate-scale-up print:shadow-none print:border-none print:w-full max-h-[92vh] overflow-y-auto my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header */}
        <div className="text-center pb-4 border-b border-slate-200">
          <div className="w-12 h-12 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-7 h-7 text-brand-600" />
          </div>
          <span className="text-[11px] font-bold text-brand-700 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            CPCB / JNARDDC E-WASTE MANIFEST
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">
            {t('receipt_title')}
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Ref: {receiptData.referenceId}
          </p>
        </div>

        {/* Receipt Body */}
        <div className="py-4 space-y-3 text-sm">
          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Lot Identifier</span>
            <span className="font-mono font-bold text-slate-900">{receiptData.lotCode}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Material Type</span>
            <span className="font-bold text-slate-900">{receiptData.materialName}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Declared Weight</span>
              <span className="font-bold text-slate-700 text-sm">{receiptData.initialWeight} KG</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Verified Scale Weight</span>
              <span className="font-black text-brand-700 text-sm">{receiptData.verifiedWeight} KG</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Seller (Collector)</span>
            <span className="font-semibold text-slate-800">{receiptData.collectorName}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Authorized Facility</span>
            <span className="font-semibold text-slate-800 text-right">{receiptData.recyclerName}</span>
          </div>

          {receiptData.recyclerAuthNo && (
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">CPCB Registration</span>
              <span className="font-mono text-xs font-bold text-slate-700">{receiptData.recyclerAuthNo}</span>
            </div>
          )}

          {/* Amount Paid Box */}
          <div className="bg-brand-50 border-2 border-brand-300 p-4 rounded-2xl text-center mt-3">
            <span className="text-xs font-bold text-brand-800 uppercase tracking-wider block">
              Total Amount Paid
            </span>
            <div className="text-3xl font-black text-brand-700 my-1">
              ₹{receiptData.finalPrice.toLocaleString('en-IN')}
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-brand-800 text-xs font-bold border border-brand-200">
              <span>{receiptData.paymentMethod} Payment Confirmed</span>
            </div>
          </div>
        </div>

        {/* Footer & Actions */}
        <div className="pt-3 border-t border-slate-200 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-4">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Ministry of Mines / JNARDDC Traceable EPR Record</span>
          </div>

          <div className="flex gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-brand-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
