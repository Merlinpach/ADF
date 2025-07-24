import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import type { Translations, LanguageContextType } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

const LanguageContext = createContext<LanguageContextType | null>(null);

// Helper to get nested values from the translation object
const getNestedValue = (obj: { [key: string]: any }, key: string): string => {
  return key.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'he');
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide initial static loader from index.html
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) {
      initialLoader.style.display = 'none';
    }

    setIsLoading(true);
    fetch(`/translations/${language}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok for ${language}.json`);
        }
        return response.json();
      })
      .then(data => {
        setTranslations(data);
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
        document.title = data.app?.docTitle || "IDF Handbook";
      })
      .catch(error => console.error(`Could not load translation file for ${language}:`, error))
      .finally(() => setIsLoading(false));
  }, [language]);

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    let translation = getNestedValue(translations, key);

    if (translation === undefined) {
      console.warn(`Translation key "${key}" not found for language "${language}".`);
      return key;
    }

    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, String(options[optionKey]));
      });
    }

    return translation;
  }, [translations, language]);

  const value = { language, setLanguage, translations, t };

  return (
    <LanguageContext.Provider value={value}>
      {isLoading ? <LoadingSpinner /> : children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};