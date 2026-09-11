import React from 'react';
import { useVoice } from '../../context/VoiceContext';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2 } from 'lucide-react';

interface VoiceButtonProps {
  textToSpeak: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  textToSpeak,
  className = '',
  size = 'md',
  label
}) => {
  const { speak, isSpeaking, activeText } = useVoice();
  const { language, t } = useLanguage();

  const isCurrentActive = isSpeaking && activeText === textToSpeak;

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'px-2.5 py-1.5 text-xs',
    lg: 'px-4 py-2.5 text-sm'
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        speak(textToSpeak, language);
      }}
      className={`inline-flex items-center gap-1.5 font-bold rounded-xl transition-all shadow-sm active:scale-95 ${
        isCurrentActive
          ? 'bg-amber-500 text-white animate-pulse ring-2 ring-amber-300'
          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
      } ${sizeClasses[size]} ${className}`}
      title={label || t('listen')}
    >
      <Volume2 className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isCurrentActive ? 'animate-bounce' : ''}`} />
      <span>{label || (isCurrentActive ? t('speaking') : t('listen'))}</span>
    </button>
  );
};
