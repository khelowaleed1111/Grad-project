import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('aqar_language') || 'en';
    setLanguage(savedLanguage);
    setIsRTL(savedLanguage === 'ar');
    
    // Apply dir attribute to document root
    document.documentElement.setAttribute('dir', savedLanguage === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', savedLanguage);
  }, []);

  // Toggle between English and Arabic
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    const newIsRTL = newLanguage === 'ar';
    
    setLanguage(newLanguage);
    setIsRTL(newIsRTL);
    
    // Persist preference in localStorage
    localStorage.setItem('aqar_language', newLanguage);
    
    // Apply dir attribute to document root
    document.documentElement.setAttribute('dir', newIsRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLanguage);
  };

  // Set specific language
  const setLang = (lang) => {
    if (lang !== 'en' && lang !== 'ar') {
      console.warn('Invalid language. Use "en" or "ar".');
      return;
    }
    
    const newIsRTL = lang === 'ar';
    
    setLanguage(lang);
    setIsRTL(newIsRTL);
    
    // Persist preference in localStorage
    localStorage.setItem('aqar_language', lang);
    
    // Apply dir attribute to document root
    document.documentElement.setAttribute('dir', newIsRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  };

  const value = {
    language,
    isRTL,
    toggleLanguage,
    setLanguage: setLang,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
};

export default LanguageContext;
