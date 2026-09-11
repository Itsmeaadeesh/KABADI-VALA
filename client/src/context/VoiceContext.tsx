import React, { createContext, useContext, useState, useEffect } from 'react';
import { VoiceService } from '../services/voice';
import { useLanguage } from './LanguageContext';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceContextType {
  isSpeaking: boolean;
  activeText: string;
  speak: (text: string, lang?: 'en' | 'hi' | 'mr') => void;
  stop: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeText, setActiveText] = useState('');

  useEffect(() => {
    const unsubscribe = VoiceService.subscribe((speaking, text) => {
      setIsSpeaking(speaking);
      setActiveText(text);
    });
    return unsubscribe;
  }, []);

  const speak = (text: string, lang?: 'en' | 'hi' | 'mr') => {
    VoiceService.speak(text, lang || language);
  };

  const stop = () => {
    VoiceService.stop();
  };

  return (
    <VoiceContext.Provider value={{ isSpeaking, activeText, speak, stop }}>
      {children}
      {/* Floating Subtitle / Voice Toast for low-literacy assistance */}
      {isSpeaking && activeText && (
        <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-brand-500/30 backdrop-blur-md animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-600 rounded-full animate-pulse text-white flex-shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-0.5">
                आवाज सहायता / Voice Assistant
              </p>
              <p className="text-sm font-medium leading-snug">{activeText}</p>
            </div>
            <button
              onClick={stop}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              title="Stop voice"
            >
              <VolumeX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) throw new Error('useVoice must be used within VoiceProvider');
  return context;
};
