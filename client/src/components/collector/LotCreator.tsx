import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { VoiceButton } from '../common/VoiceButton';
import { VoiceService } from '../../services/voice';
import { ApiService } from '../../services/api';
import { AIClassifierService, SAMPLE_EWASTE_PHOTOS, type ClassificationResult } from '../../services/aiClassifier';
import type { Material } from '../../types/schema';
import confetti from 'canvas-confetti';
import {
  Camera,
  Upload,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Minus,
  Check,
  ShieldAlert,
  Cpu,
  Zap,
  BatteryCharging,
  Cog,
  Magnet,
  Tv,
  Monitor,
  Battery,
  Radio,
  Layers
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Cpu,
  Zap,
  BatteryCharging,
  Cog,
  Magnet,
  Tv,
  Monitor,
  Battery,
  Radio,
  Layers
};

export const LotCreator: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Photo & AI
  const [selectedPhoto, setSelectedPhoto] = useState<string>(SAMPLE_EWASTE_PHOTOS[0].thumbnail);
  const [aiResult, setAiResult] = useState<ClassificationResult>(SAMPLE_EWASTE_PHOTOS[0].result);
  const [analyzingAi, setAnalyzingAi] = useState(false);

  // Step 2: Category
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('mat-pcb');

  // Step 3: Weight & Condition
  const [weight, setWeight] = useState<number>(12.5);
  const [condition, setCondition] = useState<'INTACT' | 'DAMAGED' | 'STRIPPED'>('INTACT');

  useEffect(() => {
    ApiService.getMaterials().then((data) => {
      if (data && data.length > 0) {
        setMaterials(data);
      }
    });
  }, []);

  // Handle Photo selection and trigger AI classification
  const handleSelectSamplePhoto = async (sample: typeof SAMPLE_EWASTE_PHOTOS[0]) => {
    setSelectedPhoto(sample.thumbnail);
    setAnalyzingAi(true);
    const result = await AIClassifierService.classifyImage(sample.thumbnail);
    setAiResult(result);
    setSelectedMaterialId(result.materialId);
    setCondition(result.suggestedCondition);
    setAnalyzingAi(false);
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedPhoto(dataUrl);
      setAnalyzingAi(true);
      const result = await AIClassifierService.classifyImage(dataUrl);
      setAiResult(result);
      setSelectedMaterialId(result.materialId);
      setAnalyzingAi(false);
    };
    reader.readAsDataURL(file);
  };

  // Current selected material object
  const currentMaterial = materials.find((m) => m.id === selectedMaterialId || m.code === selectedMaterialId) || materials[0];

  // Price Calculation
  const baseRate = currentMaterial?.benchmark_rate || currentMaterial?.benchmark_price || 410;
  const conditionMultiplier = condition === 'INTACT' ? 1.05 : condition === 'STRIPPED' ? 0.85 : 1.0;
  const estimatedRate = Math.round(baseRate * conditionMultiplier);
  const estimatedTotal = Math.round(weight * estimatedRate);

  // Vernacular price announcement phrase
  const priceSpeechPhrase = currentMaterial
    ? VoiceService.getEstimatePhrase(
        weight,
        language === 'hi' ? currentMaterial.name_hi : language === 'mr' ? currentMaterial.name_mr : currentMaterial.name,
        estimatedTotal,
        language
      )
    : '';

  // Submit Lot
  const handleSubmitLot = async () => {
    if (!currentMaterial || weight <= 0) return;
    setSubmitting(true);

    try {
      const created = await ApiService.createLot({
        collector_id: 'col-ramesh-1',
        material_id: currentMaterial.id,
        weight,
        condition,
        estimated_price: estimatedTotal,
        photo_url: selectedPhoto,
        ai_predicted_category: aiResult.name,
        ai_confidence: aiResult.confidence
      });

      // Confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Navigate to detail
      setTimeout(() => {
        navigate(`/lots/${created.id}`);
      }, 700);
    } catch (err) {
      console.error('Failed to submit lot:', err);
      alert('Error creating lot. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 max-w-3xl mx-auto px-4 sm:px-6 sm:border-x sm:border-slate-200">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-14 z-30 flex items-center justify-between rounded-b-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (step > 1 ? setStep((s) => (s - 1) as any) : navigate('/collector'))}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">
              {t('create_lot_title')}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[11px] font-bold ${step === 1 ? 'text-brand-700' : 'text-slate-400'}`}>
                {t('step_1_photo')}
              </span>
              <span className="text-slate-300">•</span>
              <span className={`text-[11px] font-bold ${step === 2 ? 'text-brand-700' : 'text-slate-400'}`}>
                {t('step_2_category')}
              </span>
              <span className="text-slate-300">•</span>
              <span className={`text-[11px] font-bold ${step === 3 ? 'text-brand-700' : 'text-slate-400'}`}>
                {t('step_3_weight')}
              </span>
            </div>
          </div>
        </div>

        <VoiceButton
          textToSpeak={
            step === 1
              ? 'सामान की फोटो खींचें या नीचे दिए गए कंपोनेंट्स में से चुनें।'
              : step === 2
              ? 'सही श्रेणी चुनें ताकि आपको उचित दाम मिल सके।'
              : priceSpeechPhrase
          }
          size="sm"
        />
      </div>

      {/* STEP 1: PHOTO & AI CLASSIFICATION */}
      {step === 1 && (
        <div className="p-4 space-y-4 animate-fade-in">
          {/* Photo Preview & Capture Box */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 flex items-center justify-center mb-3">
              <img
                src={selectedPhoto}
                alt="Selected E-Waste"
                className="w-full h-full object-cover"
              />
              {analyzingAi && (
                <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-xs font-bold text-brand-300">
                    AI Scanning Component...
                  </span>
                </div>
              )}
            </div>

            {/* AI Classification Card */}
            <div className="bg-brand-50 border-2 border-brand-300 rounded-2xl p-3.5 text-left mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-brand-800 bg-white px-2 py-0.5 rounded-full border border-brand-200">
                  <Sparkles className="w-3 h-3 text-brand-600 fill-current" />
                  {t('ai_classification')}
                </span>
                <span className="text-xs font-black text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                  {Math.round(aiResult.confidence * 100)}% {t('confidence')}
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900">
                {language === 'hi' ? aiResult.nameHi : language === 'mr' ? aiResult.nameMr : aiResult.name}
              </h4>
              <p className="text-xs text-brand-800 font-medium mt-0.5">
                {aiResult.subGrade}
              </p>

              {/* Critical Minerals Chips */}
              <div className="mt-2.5 pt-2 border-t border-brand-200/60 flex flex-wrap gap-1.5">
                {aiResult.criticalMinerals.map((cm, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-slate-800 border border-brand-200 shadow-2xs flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block"></span>
                    <span>{cm}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Custom Photo Upload buttons */}
            <div className="grid grid-cols-2 gap-2">
              <label className="cursor-pointer py-3 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95">
                <Camera className="w-4 h-4 text-brand-400" />
                <span>{t('take_photo')}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />
              </label>

              <label className="cursor-pointer py-3 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95">
                <Upload className="w-4 h-4 text-slate-600" />
                <span>{t('choose_photo')}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Demo Gallery Quick Chips */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-600 block mb-2.5">
              {t('sample_photos')}
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {SAMPLE_EWASTE_PHOTOS.map((sample) => {
                const isSelected = selectedPhoto === sample.thumbnail;
                return (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSamplePhoto(sample)}
                    className={`p-2 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-300'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={sample.thumbnail}
                      alt={sample.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {language === 'hi' ? sample.nameHi : sample.name}
                      </span>
                      <span className="text-[10px] text-brand-700 font-semibold block">
                        94% Match
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => setStep(2)}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-black rounded-2xl shadow-xl shadow-brand-600/20 text-base flex items-center justify-center gap-2 transition"
          >
            <span>{t('next_step')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 2: CATEGORY CONFIRMATION */}
      {step === 2 && (
        <div className="p-4 space-y-4 animate-fade-in">
          <div className="space-y-2.5">
            {materials.map((mat) => {
              const isSelected = mat.id === selectedMaterialId || mat.code === selectedMaterialId;
              const IconComp = ICON_MAP[mat.icon] || Cpu;

              return (
                <div
                  key={mat.id}
                  onClick={() => setSelectedMaterialId(mat.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-400 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        {language === 'hi' ? mat.name_hi : language === 'mr' ? mat.name_mr : mat.name}
                      </h4>
                      <span className="text-xs font-bold text-brand-700">
                        ₹{mat.benchmark_price} / {mat.unit}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-brand-600 text-white' : 'border border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setStep(1)}
              className="py-3.5 px-5 bg-white border border-slate-300 text-slate-700 font-bold rounded-2xl text-sm"
            >
              {t('back')}
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl shadow-xl shadow-brand-600/20 text-sm flex items-center justify-center gap-2"
            >
              <span>{t('next_step')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: WEIGHT, CONDITION & INSTANT PRICING */}
      {step === 3 && (
        <div className="p-4 space-y-4 animate-fade-in">
          {/* Big Weight Counter */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              {t('enter_weight')}
            </span>

            {/* Giant Display */}
            <div className="text-5xl font-black text-slate-900 font-mono tracking-tight my-2">
              {weight.toFixed(1)} <span className="text-2xl text-slate-400 font-sans">KG</span>
            </div>

            {/* Quick Step Buttons */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              <button
                type="button"
                onClick={() => setWeight((w) => Math.max(0.5, Math.round((w - 5) * 10) / 10))}
                className="py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-2xl font-black text-sm text-slate-800 transition"
              >
                -5 KG
              </button>
              <button
                type="button"
                onClick={() => setWeight((w) => Math.max(0.5, Math.round((w - 1) * 10) / 10))}
                className="py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-2xl font-black text-sm text-slate-800 transition"
              >
                -1 KG
              </button>
              <button
                type="button"
                onClick={() => setWeight((w) => Math.round((w + 1) * 10) / 10)}
                className="py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-2xl font-black text-sm text-slate-800 transition"
              >
                +1 KG
              </button>
              <button
                type="button"
                onClick={() => setWeight((w) => Math.round((w + 5) * 10) / 10)}
                className="py-3 bg-brand-100 hover:bg-brand-200 text-brand-900 active:scale-95 rounded-2xl font-black text-sm transition"
              >
                +5 KG
              </button>
            </div>

            {/* Numeric input slider */}
            <input
              type="range"
              min="0.5"
              max="150"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full mt-4 accent-brand-600"
            />
          </div>

          {/* Condition Selector */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              {t('condition_label')}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCondition('INTACT')}
                className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                  condition === 'INTACT'
                    ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-300'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-emerald-500 mb-2 mx-auto block shadow-xs"></span>
                <span>{t('condition_intact')}</span>
              </button>

              <button
                type="button"
                onClick={() => setCondition('DAMAGED')}
                className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                  condition === 'DAMAGED'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-300'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-amber-500 mb-2 mx-auto block shadow-xs"></span>
                <span>{t('condition_damaged')}</span>
              </button>

              <button
                type="button"
                onClick={() => setCondition('STRIPPED')}
                className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                  condition === 'STRIPPED'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-300'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-rose-500 mb-2 mx-auto block shadow-xs"></span>
                <span>{t('condition_stripped')}</span>
              </button>
            </div>
          </div>

          {/* INSTANT PRICE ESTIMATOR CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950 text-white p-5 rounded-3xl shadow-xl border border-brand-500/30 text-center relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-brand-400 uppercase tracking-widest">
                {t('estimated_value')}
              </span>
              <VoiceButton textToSpeak={priceSpeechPhrase} size="sm" />
            </div>

            <div className="text-4xl font-black text-white my-1 tracking-tight">
              ≈ ₹{estimatedTotal.toLocaleString('en-IN')}
            </div>

            <p className="text-xs text-brand-200/90 font-medium">
              {weight} KG × ₹{estimatedRate}/KG ({condition === 'INTACT' ? '+5% Intact Bonus' : 'Standard Rate'})
            </p>

            {/* Strategic Critical Mineral Warning */}
            <div className="mt-4 pt-3 border-t border-white/10 bg-white/5 rounded-2xl p-2.5 text-left text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{t('contains_critical')}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? currentMaterial?.hazards_hi
                  : language === 'mr'
                  ? currentMaterial?.hazards_mr
                  : currentMaterial?.hazards}
              </p>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="py-4 px-5 bg-white border border-slate-300 text-slate-700 font-bold rounded-2xl text-sm"
            >
              {t('back')}
            </button>
            <button
              onClick={handleSubmitLot}
              disabled={submitting}
              className="flex-1 py-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-black rounded-2xl shadow-xl shadow-brand-600/20 text-base flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {submitting ? (
                <span>{t('submitting')}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t('submit_lot')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
