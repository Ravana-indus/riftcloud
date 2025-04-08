import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContentSection from '@/components/ui/ContentSection';
import { Phone, Mail, Clock, MapPin, Facebook, Linkedin, Youtube, Instagram, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/translation';

const Contact = () => {
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
      
      <main className="pt-9">
        {/* Hero Banner */}
        <div className="bg-institutional-dark text-white py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 scroll-animate">{t('Contact Us')}</h1>
              <p className="text-xl mb-8 scroll-animate" style={{ transitionDelay: '100ms' }}>
                {t('We\'re here to help')}
              </p>
              <p className="text-lg mb-8 scroll-animate" style={{ transitionDelay: '200ms' }}>
                {t('Have questions about our courses, resources, or digital safety in general? Our team is ready to assist you. Choose your preferred contact method below.')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Contact Information Section */}
        <ContentSection 
          id="contact-info" 
          title={t('Reach Us Directly')}
          subtitle={t('Multiple ways to get in touch with our team')}
          titleAlignment="center"
          background="white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Phone size={24} />,
                title: t('Phone'),
                info: "+94 11 258 1181",
                action: {
                  text: t('Call Us'),
                  link: "tel:+94112581181"
                },
                color: "blue"
              },
              {
                icon: <Mail size={24} />,
                title: t('Email'),
                info: "info@riftuni.com",
                action: {
                  text: t('Send Email'),
                  link: "mailto:info@riftuni.com"
                },
                color: "indigo"
              },
              {
                icon: <Clock size={24} />,
                title: t('Hours'),
                info: t('Monday to Friday, 9:00 AM - 5:00 PM'),
                action: {
                  text: "",
                },
                color: "teal"
              },
              {
                icon: <MapPin size={24} />,
                title: t('Address'),
                info: t('No 10, 30/1/1 Pamankada Ln, Colombo 00600, Sri Lanka'),
                action: {
                  text: t('Get Directions'),
                  link: "https://g.co/kgs/mV83cgz"
                },
                color: "emerald"
              }
            ].map((contact, index) => (
              <div 
                key={index}
                className="glass-card p-8 rounded-lg text-center scroll-animate"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-${contact.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <div className={`text-${contact.color}-600`}>{contact.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{contact.title}</h3>
                <p className="text-gray-600 mb-4">{contact.info}</p>
                <a 
                  href={contact.action.link} 
                  className={`text-${contact.color}-600 hover:text-${contact.color}-800 font-medium`}
                >
                  {contact.action.text}
                </a>
              </div>
            ))}
          </div>
        </ContentSection>
        
        {/* Contact Form Section */}
        <ContentSection 
          id="contact-form" 
          title={t('Send a Message')}
          subtitle={t('We\'ll respond to your inquiry within 24 hours')}
          titleAlignment="left"
          imageAlt={t('Contact our team')}
          imageCaption={t('Our team is ready to answer your questions about digital safety education.')}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="glass-card p-8 rounded-lg shadow-elegant scroll-animate">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Full Name')}</label>
                  <Input 
                    type="text" 
                    placeholder={t('Your name')}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Email Address')}</label>
                  <Input 
                    type="email" 
                    placeholder={t('your.email@example.com')}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Phone Number')}</label>
                  <Input 
                    type="tel" 
                    placeholder={t('+94 7X XXX XXXX')}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Inquiry Type')}</label>
                  <select 
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="">{t('Select an option')}</option>
                    <option value="course">{t('Course Information')}</option>
                    <option value="business">{t('Business Training')}</option>
                    <option value="technical">{t('Technical Question')}</option>
                    <option value="other">{t('Other')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Message')}</label>
                  <textarea 
                    rows={5} 
                    placeholder={t('How can we help you?')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">{t('Preferred Contact Method')}</label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input type="radio" name="contactMethod" value="email" className="mr-2" />
                      <span>{t('Email')}</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="contactMethod" value="phone" className="mr-2" />
                      <span>{t('Phone')}</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-300"
                  >
                    {t('Send Message')}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="scroll-animate" style={{ transitionDelay: '300ms' }}>
              <h3 className="text-2xl font-semibold mb-6">{t('Frequently Asked Questions')}</h3>
              
              <div className="space-y-6">
                {[
                  {
                    question: t('How do I sign up for a course?'),
                    answer: t('You can register directly through our website, call us at +94 11 234 5678, or visit our institute in person.')
                  },
                  {
                    question: t('Do you offer training for businesses?'),
                    answer: t('Yes, we provide customized digital safety training for organizations of all sizes. Contact us for a tailored proposal.')
                  },
                  {
                    question: t('Who can attend your courses?'),
                    answer: t('Our Digital Safety & AI Awareness course is designed for adults 45 and older, but we welcome anyone who feels the content would benefit them.')
                  },
                  {
                    question: t('Can you conduct training at our location?'),
                    answer: t('Yes, for groups of 10 or more, we can arrange on-site training at your location in the Colombo area.')
                  }
                ].map((faq, index) => (
                  <div key={index} className="glass-card p-6 rounded-lg">
                    <div className="flex items-start">
                      <HelpCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-lg font-semibold mb-2">{faq.question}</h4>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ContentSection>
        
        {/* Map Section */}
        <ContentSection 
          id="location" 
          title={t('Visit Our Location')}
          subtitle={t('We\'re conveniently located in central Colombo')}
          titleAlignment="center"
          background="white"
        >
          <div className="max-w-5xl mx-auto scroll-animate">
            <div className="glass-card p-4 rounded-lg shadow-elegant overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31687.525501258412!2d79.84100139371744!3d6.911962336483721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259251b57a431%3A0x8f43a4ca8b3a1e03!2sColombo%2004%2C%20Colombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('Our location')}
                ></iframe>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                <strong>{t('Directions:')}</strong> {t('Our institute is located near Liberty Plaza, a 5-minute walk from Colpetty Junction. Parking is available on-site, and we\'re accessible via multiple bus routes.')}
              </p>
              <a 
                href="https://goo.gl/maps/123" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium transition duration-300"
              >
                {t('Get Directions')} <MapPin size={18} className="ml-2" />
              </a>
            </div>
          </div>
        </ContentSection>
        
        {/* Social Media Section */}
        <ContentSection 
          id="social-media" 
          title={t('Connect With Us')}
          subtitle={t('Follow us on social media for the latest updates and digital safety tips')}
          titleAlignment="center"
          background="white"
        >
          <div className="max-w-3xl mx-auto text-center scroll-animate">
            <p className="text-gray-600 mb-8">
              {t('Stay updated with the latest digital safety information, upcoming courses, and free resources by following us on social media.')}
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {[
                { icon: <Facebook size={32} />, name: t('Facebook'), url: "#", color: "blue" },
                { icon: <Linkedin size={32} />, name: t('LinkedIn'), url: "#", color: "blue" },
                { icon: <Youtube size={32} />, name: t('YouTube'), url: "#", color: "red" },
                { icon: <Instagram size={32} />, name: t('Instagram'), url: "#", color: "pink" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  className={`flex flex-col items-center group`}
                >
                  <div className={`w-16 h-16 rounded-full bg-${social.color}-100 flex items-center justify-center mb-2 group-hover:bg-${social.color}-200 transition duration-300`}>
                    <div className={`text-${social.color}-600`}>{social.icon}</div>
                  </div>
                  <span className="text-gray-700">{social.name}</span>
                </a>
              ))}
            </div>
            
            <div className="glass-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{t('Join Our Newsletter')}</h3>
              <p className="text-gray-600 mb-6">
                {t('Subscribe to receive digital safety tips, course updates, and free resources directly to your inbox.')}
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4">
                <Input 
                  type="email" 
                  placeholder={t('Your email address')}
                  className="flex-grow"
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 whitespace-nowrap"
                >
                  {t('Subscribe')}
                </button>
              </form>
            </div>
          </div>
        </ContentSection>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact; 