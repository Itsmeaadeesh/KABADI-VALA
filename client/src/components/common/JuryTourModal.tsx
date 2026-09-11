import React, { useState } from 'react';
import { X, Award, ArrowRight, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface JuryTourModalProps {
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const JuryTourModal: React.FC<JuryTourModalProps> = ({ onClose, onNavigate }) => {
  const { switchDemoRole } = useAuth();
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { step: 1, title: 'Collector Login', desc: 'Login as Ramesh (Kabadiwala) with phone 9999999999 & OTP 123456.', role: 'COLLECTOR', path: '/' },
    { step: 2, title: 'Open "Sell E-Waste"', desc: 'Tap the large green tactile Sell card on the home screen.', role: 'COLLECTOR', path: '/sell' },
    { step: 3, title: 'Select PCB Image', desc: 'Choose the Motherboard component in Step 1 (Photo).', role: 'COLLECTOR', path: '/sell' },
    { step: 4, title: 'AI Classification', desc: 'Observe demo AI result: High Grade PCB with 94% confidence.', role: 'COLLECTOR', path: '/sell' },
    { step: 5, title: 'Weight Input (12.5 KG)', desc: 'Use [-1] [+1] [-5] [+5] KG quick stepper to select 12.5 KG.', role: 'COLLECTOR', path: '/sell' },
    { step: 6, title: 'Instant Price Calculation', desc: 'Live estimate computed: 12.5 KG × ₹425/KG = ~₹5,312.', role: 'COLLECTOR', path: '/sell' },
    { step: 7, title: 'Critical Mineral Alert', desc: 'View strategic mineral tags: Copper (22%), Gold (250g/t), Tantalum (0.4%).', role: 'COLLECTOR', path: '/sell' },
    { step: 8, title: 'Find Recycler Map', desc: 'Explore Leaflet map with CPCB authorized facilities.', role: 'COLLECTOR', path: '/recyclers' },
    { step: 9, title: 'Select "Best Match"', desc: 'View 5-factor scoring highlighting GreenCycle Recycling as top match.', role: 'COLLECTOR', path: '/recyclers' },
    { step: 10, title: 'Request Pickup', desc: 'Submit doorstep pickup request with selected recycler.', role: 'COLLECTOR', path: '/recyclers' },
    { step: 11, title: 'Generate Digital Lot', desc: 'Receive verifiable manifest code e.g. LOT-2026-MH-4821 and QR code.', role: 'COLLECTOR', path: '/lots' },
    { step: 12, title: 'Switch to Recycler Portal', desc: 'One-click switch to GreenCycle Recycling dashboard.', role: 'RECYCLER', path: '/recycler/lots' },
    { step: 13, title: 'Inspect Incoming Lot', desc: 'See the newly created lot in the recycler’s live incoming queue.', role: 'RECYCLER', path: '/recycler/lots' },
    { step: 14, title: 'Verify Handover on Scale', desc: 'Open verification scanner, enter 12.2 KG scale weight.', role: 'RECYCLER', path: '/recycler/handover' },
    { step: 15, title: 'Generate Digital Receipt', desc: 'Issue verifiable certificate with CPCB registration details.', role: 'RECYCLER', path: '/recycler/handover' },
    { step: 16, title: 'Confirm UPI Payment', desc: 'Record instant payment with reference ID UPI-982173.', role: 'RECYCLER', path: '/recycler/handover' },
    { step: 17, title: 'Return to Collector', desc: 'Switch back to Ramesh to verify digital record preservation.', role: 'COLLECTOR', path: '/khata' },
    { step: 18, title: 'Updated Mera Khata', desc: 'Verified payment reflects immediately in monthly earnings passbook.', role: 'COLLECTOR', path: '/khata' },
    { step: 19, title: 'Open Admin Dashboard', desc: 'Switch to Ministry of Mines / JNARDDC oversight portal.', role: 'ADMIN', path: '/admin' },
    { step: 20, title: 'National Strategic Impact', desc: 'Review diverted e-waste, critical minerals recovered, and unit economics.', role: 'ADMIN', path: '/admin' }
  ];

  const currentStepData = steps[activeStep - 1];

  const handleExecuteStep = (stepObj: typeof steps[0]) => {
    switchDemoRole(stepObj.role as any);
    onNavigate(stepObj.path);
    if (activeStep < steps.length) {
      setActiveStep(stepObj.step + 1);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/85 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-3.5 sm:p-6 bg-gradient-to-r from-slate-900 to-brand-950 text-white flex items-center justify-between border-b border-brand-900/50">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-500/20 text-brand-400 rounded-xl flex items-center justify-center border border-brand-500/30 flex-shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-brand-400 tracking-wider uppercase block truncate">
                SIH Problem Statement 26229
              </span>
              <h2 className="text-sm sm:text-lg font-black leading-tight truncate">20-Step Live Jury Presentation Flow</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Step Banner */}
        <div className="p-3 sm:p-4 bg-brand-50 border-b border-brand-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs font-bold text-brand-800 uppercase tracking-wider block">
              Step {currentStepData.step} of 20: {currentStepData.title}
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-700 mt-0.5">
              {currentStepData.desc}
            </p>
          </div>
          <button
            onClick={() => handleExecuteStep(currentStepData)}
            className="w-full sm:w-auto px-3.5 sm:px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 transition flex-shrink-0 touch-manipulation active:scale-95"
          >
            <span>Jump to Step</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Scrollable Step List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100">
          {steps.map((s) => (
            <div
              key={s.step}
              onClick={() => handleExecuteStep(s)}
              className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition ${
                s.step === activeStep
                  ? 'bg-brand-100/60 border border-brand-300'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 ${
                    s.step < activeStep
                      ? 'bg-brand-600 text-white'
                      : s.step === activeStep
                      ? 'bg-brand-700 text-white ring-2 ring-brand-400'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {s.step < activeStep ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{s.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                      {s.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{s.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Click any step to auto-switch role and screen</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
