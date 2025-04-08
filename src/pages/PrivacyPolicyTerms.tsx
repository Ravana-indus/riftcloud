import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContentSection from '@/components/ui/ContentSection';
import { Shield, File, Check, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/lib/translation';

const PrivacyPolicyTerms = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  const { t } = useTranslation();

  useEffect(() => {
    // Add a base class to all elements that should animate
    document.querySelectorAll('.scroll-animate').forEach((elem) => {
      elem.classList.add('transition-all', 'duration-700', 'ease-in-out');
      // Ensure elements start invisible
      elem.classList.add('opacity-0', 'translate-y-8');
    });

    // Create the intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When element is visible, remove the translate and add opacity
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            entry.target.classList.add('opacity-100', 'translate-y-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px' 
      }
    );

    // Observe all elements with the scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach((elem) => {
      observer.observe(elem);
    });

    // Cleanup function
    return () => {
      document.querySelectorAll('.scroll-animate').forEach((elem) => {
        observer.unobserve(elem);
      });
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 scroll-animate">{t('Privacy Policy & Terms')}</h1>
              <p className="text-xl mb-8 scroll-animate" style={{ transitionDelay: '100ms' }}>
                {t('Information about how we handle your data and the terms governing course participation')}
              </p>
              <p className="text-lg mb-8 scroll-animate" style={{ transitionDelay: '200ms' }}>
                {t('Last Updated')}: June 1, 2025
              </p>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <button
                className={`py-4 px-6 font-medium text-lg ${
                  activeTab === 'privacy'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('privacy')}
              >
                {t('Privacy Policy')}
              </button>
              
              <button
                className={`py-4 px-6 font-medium text-lg ${
                  activeTab === 'terms'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('terms')}
              >
                {t('Terms of Service')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Privacy Policy Content */}
        {activeTab === 'privacy' && (
          <>
            <ContentSection 
              id="privacy-intro" 
              title={t('Privacy Policy')}
              subtitle={t('How we collect, use, and protect your information')}
              titleAlignment="left"
              background="white"
              imageUrl="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
              imageAlt="Privacy policy"
              imageCaption={t('We take the privacy and security of your personal information seriously.')}
            >
              <div className="max-w-4xl scroll-animate">
                <div className="flex items-start mb-8">
                  <Shield className="text-blue-600 w-8 h-8 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-4">{t('Your Privacy Matters')}</h3>
                    <p className="text-gray-600 mb-4">
                      {t('This Privacy Policy explains how we collect, use, and protect your personal information.')}
                    </p>
                    <p className="text-gray-600">
                      {t('By using our services, you consent to the data practices described in this policy.')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Information We Collect')}</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Contact information (name, email, phone number)')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Demographic information (age, education level)')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Payment information for course registration')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Course participation and progress data')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Feedback and survey responses')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('How We Use Your Information')}</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('To process your registration and payments')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('To provide and improve our educational services')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('To communicate with you about courses and events')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('To analyze and improve our website and services')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('To comply with legal obligations')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Information Sharing')}</h3>
                    <p className="text-gray-600 mb-4">{t('We may share your information with:')}</p>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Service providers who help us operate our business')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Educational partners for course delivery')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Government authorities when required by law')}</span>
                      </li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      {t('We do not sell or rent your personal information to third parties.')}
                    </p>
                  </div>
                  
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Data Security')}</h3>
                    <p className="text-gray-600 mb-4">{t('We implement security measures to protect your information:')}</p>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('We use encryption to protect sensitive data')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('We use current security measures to protect your information')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('We restrict access to personal data')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('We have procedures for handling potential data breaches')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Your Rights')}</h3>
                    <p className="text-gray-600 mb-4">{t('You have the right to:')}</p>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Access and review your personal information')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Correct any inaccurate information')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Request deletion of your data')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Object to certain data processing')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Request data portability')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Withdraw consent at any time')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Contact for Privacy Questions')}</h3>
                    <p className="text-gray-600 mb-4">
                      {t('If you have any questions about our privacy practices or wish to exercise your rights, please contact us:')}
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>Email:</strong> {t('privacy@ravanaiof.org')}</li>
                      <li><strong>Phone:</strong> {t('+94 11 234 5678')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ContentSection>
          </>
        )}
        
        {/* Terms of Service Content */}
        {activeTab === 'terms' && (
          <>
            <ContentSection 
              id="terms-intro" 
              title={t('Terms of Service')}
              subtitle={t('The agreement between participants and the Ravana Institute of Future')}
              titleAlignment="left"
              background="white"
              imageUrl="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
              imageAlt="Terms of service"
              imageCaption={t('Please read these terms carefully as they contain important information about your rights and obligations.')}
            >
              <div className="max-w-4xl scroll-animate">
                <div className="flex items-start mb-8">
                  <File className="text-blue-600 w-8 h-8 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-4">{t('Introduction')}</h3>
                    <p className="text-gray-600 mb-4">
                      {t('These Terms of Service govern your participation in courses offered by the Ravana Institute of Future.')}
                    </p>
                    <p className="text-gray-600">
                      {t('By registering for our courses, you agree to these terms, which constitute a binding agreement.')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Registration & Eligibility')}</h3>
                    <p className="text-gray-600 mb-4">{t('To participate in our courses, you must:')}</p>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Have confirmed payment or an approved payment plan')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Provide accurate registration information')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Be at least 45+ years of age (unless specifically exempted)')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Not transfer your registration without prior approval')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Payment Terms')}</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Full payment or approved deposit is required to secure enrollment')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('All fees must be paid before course completion')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Payment plans are available upon request and approval')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Cancellation & Refunds')}</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Cancellations made 14+ days before course start: Full refund minus processing fee')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Cancellations 7-13 days before course start: 50% refund')}</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Cancellations less than 7 days before course start: No refund')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Special circumstances may be considered at our discretion')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Attendance & Participation')}</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Participants are expected to attend all scheduled sessions')}</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Disruptive behavior may result in removal without refund')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Consistent non-attendance may affect certification eligibility')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Course Materials')}</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('All materials are protected by copyright and for personal use only')}</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Sharing or distributing materials is prohibited')}</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Recording of sessions is not permitted without explicit permission')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Liability Limitations')}</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('The Ravana Institute is not responsible for personal items')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('We are not liable for technical issues beyond our control')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Our liability is limited to the amount paid for the course')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Terms Updates')}</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Terms may be updated with notice to participants')}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{t('Continued participation indicates acceptance of revised terms')}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{t('Contact for Terms Questions')}</h3>
                    <p className="text-gray-600 mb-4">
                      {t('For questions about these terms, please contact:')}
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>Email:</strong> {t('terms@ravanaiof.org')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ContentSection>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicyTerms;

function Info(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
} 