import { navTranslations } from './nav';
import { homeTranslations } from './home';
import { courseTranslations } from './course';
import { aboutTranslations } from './about';
import { resourcesTranslations } from './resources';
import { contactTranslations } from './contact';
import { registrationTranslations } from './registration';
import { privacyTranslations } from './privacy';
import { termsTranslations } from './terms';
import { dashboardTranslations } from './dashboard';
import { commonTranslations } from './common';
import { footerTranslations } from './footer';

// Define language type
export type Language = 'en' | 'si' | 'ta';

// Merge all translations
export const translations = {
  ...navTranslations,
  ...homeTranslations,
  ...courseTranslations,
  ...aboutTranslations,
  ...resourcesTranslations,
  ...contactTranslations,
  ...registrationTranslations,
  ...privacyTranslations,
  ...termsTranslations,
  ...dashboardTranslations,
  ...commonTranslations,
  ...footerTranslations
};

/**
 * Translate a key to the specified language
 * @param key The translation key
 * @param lang The language to translate to (defaults to current language)
 * @returns The translated string or the key if translation not found
 */
export function t(key: string, lang: Language = getCurrentLanguage()): string {
  // If the key doesn't exist in our translations
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  // If the language doesn't exist for this key
  if (!translations[key][lang]) {
    console.warn(`No ${lang} translation for key: ${key}`);
    return translations[key]['en'] || key;
  }

  return translations[key][lang];
}

/**
 * Get the current language from localStorage or default to English
 */
export function getCurrentLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const storedLang = localStorage.getItem('language') as Language;
  return storedLang || 'en';
}

/**
 * Set the current language in localStorage
 */
export function setLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): { code: Language; name: string }[] {
  return [
    { code: 'en', name: 'English' },
    { code: 'si', name: 'සිංහල' },   // Sinhala
    { code: 'ta', name: 'தமிழ்' }    // Tamil
  ];
} 