import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Search, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/lib/translation';
import logoImage from '@/img/Rift-UNI.png';

// Create a language context for the application
const LanguageContext = React.createContext({
  language: 'en',
  setLanguage: (lang: string) => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('en');
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => React.useContext(LanguageContext);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsLanguageMenuOpen(false);
  }, [location]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  const navLinks = [
    { name: t('Digital Safety Course'), path: '/digital-safety-course' },
    { name: t('About'), path: '/about' },
    { name: t('Contact'), path: '/contact' },
    { name: t('Register'), path: '/registration' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'si', name: 'සිංහල' },
    { code: 'ta', name: 'தமிழ்' },
  ];

  const isNotHome = location.pathname !== '/'; // Check if not on home page

  return (
    <>
      {/* Sub header for portal logins */}
      <div className="bg-institutional text-white py-1 fixed top-0 left-0 right-0 z-50">
        <div className="container-content">
          <div className="flex justify-end items-center text-sm">
            <a href="https://portal.riftuni.com/" className="px-3 py-1 text-white hover:text-institutional-100 transition-colors duration-300">{t('User Portal Login')}</a>
            <span className="text-institutional-300">|</span>
            <a href="https://portal.riftuni.com/lms/courses" className="px-3 py-1 text-white hover:text-institutional-100 transition-colors duration-300">{t('LMS Login')}</a>
          </div>
        </div>
      </div>
      
      <header 
        className={cn(
          "fixed left-0 right-0 z-40 transition-all duration-300 ease-in-out", 
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-subtle py-3 top-7" 
            : isNotHome 
              ? "bg-transparent py-6 top-7 mb-[30px]"
              : "bg-transparent py-6 top-7" 
        )}
      >
        <div className="container-content">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <Link to="/" className="flex items-center">
                <div className={cn("font-semibold text-2xl tracking-tight", isScrolled && isNotHome ? "text-black" : isNotHome ? "text-white" : "text-institutional", "hover:text-institutional-100")}>
                  <img 
                    src={logoImage} 
                    alt={t('RavanUNI Logo')}
                    className="h-10 w-auto"
                  />
                </div>
              </Link>
              
              <nav className="hidden md:flex space-x-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={cn(
                      "nav-link",
                      location.pathname === link.path ? "nav-link-active" : "",
                      isScrolled && isNotHome ? "text-black hover:text-institutional-600" : isNotHome ? "text-white hover:text-institutional-100" : "text-institutional hover:text-institutional-100"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                className={cn("p-2 transition-colors duration-300", isNotHome ? "text-white hover:text-institutional-100" : "text-gray-600 hover:text-institutional")}
                aria-label={t('Search')}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search size={20} />
              </button>
              <div className="relative">
                <button 
                  className={cn("p-2 transition-colors duration-300", isNotHome ? "text-white hover:text-institutional-100" : "text-gray-600 hover:text-institutional")}
                  aria-label={t('Language selection')}
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                >
                  <Globe size={20} />
                </button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden z-50">
                    <div className="py-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={cn(
                            "w-full text-left px-4 py-2 hover:bg-institutional-50 transition-colors",
                            language === lang.code && "bg-institutional-100 text-institutional"
                          )}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="md:hidden p-2 text-gray-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={t('Toggle menu')}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-24">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t('Search')}</h2>
                <button onClick={() => setIsSearchOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSearchSubmit}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('Search the website...')}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-institutional"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="bg-institutional text-white px-4 py-2 rounded-lg hover:bg-institutional-600 transition-colors"
                  >
                    {t('Search')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        <div 
          className={cn(
            "md:hidden fixed inset-0 bg-white z-40 pt-20 px-6 transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          )}
        >
          <nav className="flex flex-col space-y-6 text-xl">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={cn(
                  "nav-link py-3 inline-block",
                  location.pathname === link.path && "nav-link-active"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
