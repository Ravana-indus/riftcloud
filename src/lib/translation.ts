import { useLanguage } from "@/components/layout/Navbar";
import { translations } from './translations/translation';

type TranslationKey = string;

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: TranslationKey): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    return translations[key][language] || translations[key]['en'] || key;
  };
  
  return { t, language };
}; 