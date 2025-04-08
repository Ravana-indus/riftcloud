import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import indusLogo from '../../img/indus_logo.png';
import { useTranslation } from '@/lib/translation';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const opacity = 1 - (scrollY / 500);
      const transform = `translateY(${scrollY * 0.4}px)`;
      
      if (heroRef.current) {
        heroRef.current.style.opacity = Math.max(opacity, 0).toString();
        heroRef.current.style.transform = transform;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-institutional-50 rounded-bl-[50%] opacity-70 z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-institutional-100 rounded-tr-[50%] opacity-60 z-0"></div>
      
      {/* Hero image */}
      <div className="absolute right-0 bottom-0 w-3/5 h-5/5 z-0 opacity-10 hidden lg:block">
        <img 
          src={indusLogo}
          alt={t("Senior adult using technology")}
          className="w-full h-full object-contain object-bottom"
        />
      </div>
      
      <div className="container-content relative z-10">
        <div 
          ref={heroRef}
          className="max-w-3xl transition-transform duration-200 ease-out"
        >
          <div className="animate-fade-in">
            <div className="inline-block px-4 py-1.5 text-institutional-900 font-medium bg-institutional-100 rounded-full mb-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {t("Digital Safety, AI Skills & Language For All")}
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              {t("Be Ready for Future")}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl animate-fade-up" style={{ animationDelay: '0.6s' }}>
              {t("Practical, AI powered education to prepare you for the future with multi industry skills in a non traditional way for Sri Lankans")}
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.8s' }}>
              <a href="#course-formats" className="button-institutional">
                {t("View Course Details")} <ArrowRight size={16} className="ml-2" />
              </a>
              <a href="/registration" className="button-institutional-outline">
                {t("Register Now")}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center pt-2">
          <div className="w-1 h-3 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
