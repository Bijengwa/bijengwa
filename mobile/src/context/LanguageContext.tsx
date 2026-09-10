import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

export type Language = 'en' | 'sw';

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
  isSwahili: boolean;
};

const LanguageContext =
  createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((current) =>
      current === 'en' ? 'sw' : 'en'
    );
  };

  const value = useMemo(
    () => ({
      language,
      toggleLanguage,
      setLanguage,
      isSwahili: language === 'sw',
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider'
    );
  }

  return context;
}