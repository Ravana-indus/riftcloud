import React, { useState, useEffect } from 'react';
import { getCurrentLanguage, setLanguage, getAvailableLanguages, Language } from '../lib/translations/translation';

// Style constants
const styles = {
  container: {
    position: 'relative' as const,
    display: 'inline-block',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    color: 'inherit',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'background-color 0.2s',
  },
  dropdown: {
    position: 'absolute' as const,
    right: 0,
    top: 'calc(100% + 0.5rem)',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    width: '10rem',
    zIndex: 100,
  },
  option: {
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  selected: {
    backgroundColor: '#f3f4f6',
  },
  globe: {
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
  }
};

interface LanguageSelectorProps {
  onLanguageChange?: (language: Language) => void;
  isDarkMode?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  onLanguageChange,
  isDarkMode = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const languages = getAvailableLanguages();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && !(event.target as Element).closest('.language-selector')) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Initialize current language
  useEffect(() => {
    const lang = getCurrentLanguage();
    setCurrentLang(lang);
  }, []);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSelectLanguage = (lang: Language) => {
    setCurrentLang(lang);
    setLanguage(lang);
    setIsOpen(false);
    
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    
    // Reload the page to apply language change throughout the app
    window.location.reload();
  };
  
  const getCurrentLanguageDisplay = () => {
    const current = languages.find(lang => lang.code === currentLang);
    return current ? current.name : 'English';
  };
  
  return (
    <div className="language-selector" style={styles.container}>
      <button 
        onClick={toggleDropdown}
        style={{
          ...styles.button,
          color: isDarkMode ? 'white' : 'inherit',
        }}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={styles.globe}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        {getCurrentLanguageDisplay()}
      </button>
      
      {isOpen && (
        <div style={{
          ...styles.dropdown,
          backgroundColor: isDarkMode ? '#1f2937' : 'white',
        }}>
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              style={{
                ...styles.option,
                ...(lang.code === currentLang ? styles.selected : {}),
                backgroundColor: lang.code === currentLang 
                  ? (isDarkMode ? '#374151' : '#f3f4f6') 
                  : 'transparent',
                color: isDarkMode ? 'white' : 'inherit',
              }}
            >
              {lang.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 