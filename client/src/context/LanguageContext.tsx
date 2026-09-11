import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types/schema';
import { translations } from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kabadiwala_lang');
    return (saved as Language) || 'hi'; // Default to Hindi for inclusive Bharat experience
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kabadiwala_lang', lang);
  };

  const t = (key: string): string => {
    const langDict = (translations as any)[language] || translations.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    return (translations.en as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
