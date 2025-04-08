import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import ContentSection from '@/components/ui/ContentSection';
import FeaturedContent from '@/components/ui/FeaturedContent';
import KeyStatsGrid from '@/components/ui/KeyStatsGrid';
import { Calendar, BookOpen, Shield, Globe, Users, MoveRight, MapPin, Award, Monitor, MessageSquare, Phone, Clock } from 'lucide-react';
import { useTranslation } from '@/lib/translation';

const Index = () => {
  const { t } = useTranslation();
  
  // Updated program images for Digital Safety course
  const programImages = [
    'https://images.unsplash.com/photo-1554224155-8d04cb21ed6c?q=80&w=600&auto=format&fit=crop', // Digital safety
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=600&auto=format&fit=crop', // Online learning
    'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=600&auto=format&fit=crop', // Seniors with technology
  ];

  // Updated course format images
  const courseFormatImages = [
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop', // In-person class
    'https://images.unsplash.com/photo-1610851467983-db88ad7e97f7?q=80&w=600&auto=format&fit=crop', // Online learning
  ];
  
  // Resources images
  const resourceImages = [
    'https://images.unsplash.com/photo-1586769852836-bc069f19e1be?q=80&w=600&auto=format&fit=crop', // Guides
    'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=600&auto=format&fit=crop', // Videos
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop', // Blog
  ];

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
        {/* Custom Hero Section based on website content */}
        <HeroSection />
        
        <ContentSection 
          id="about" 
          title={t("Ravana Institute of Future")}
          titleSize="large"
          subtitle={t("Founded to bridge the digital and language divide in the world.")}
          titleAlignment="left"
          background="white"
          imageUrl="https://images.unsplash.com/photo-1624963146266-4481df1e40b5?q=80&w=800&auto=format&fit=crop"
          imageAlt={t("Institute building")}
          imageCaption={t("Our institute focuses on practical digital skills for all Sri Lankans")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t("Our Mission")}</h3>
              <p className="text-gray-600 mb-6">
                {t("To empower people with the knowledge and skills to navigate the future world safely and confidently, creating more inclusive access to technology and language's benefits across all age groups and communities.")}
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t("Our Values")}</h3>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li className="flex items-start">
                  <span className="text-institutional mr-2">•</span> 
                  <span>{t("Inclusive Access: Making technology and language education available to everyone")}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-institutional mr-2">•</span> 
                  <span>{t("Practical Application: Teaching real-world skills for immediate use with the help of AI")}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-institutional mr-2">•</span> 
                  <span>{t("Cultural Relevance: Creating learning experiences that reflect local contexts")}</span>
                </li>
              </ul>
              <a href="/about" className="button-institutional inline-flex">
                {t("Learn About Our Mission")} <MoveRight size={18} className="ml-2" />
              </a>
            </div>
            
            <div className="relative scroll-animate" style={{ transitionDelay: '200ms' }}>
              <div className="relative z-10 rounded-lg overflow-hidden shadow-elegant">
                <img 
                  src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=800&auto=format&fit=crop" 
                  alt={t("Technology education for adults")}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-institutional-100 rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-institutional-200 rounded-full -z-10"></div>
            </div>
          </div>
        </ContentSection>
        
        <ContentSection 
          id="benefits" 
          title={t("Why Learn Digital Safety")}
          subtitle={t("Essential skills for navigating today's digital world with confidence")}
          titleSize="large"
          titleAlignment="left"
          imageUrl="https://images.unsplash.com/photo-1626384933011-8b4560eadc84?q=80&w=800&auto=format&fit=crop"
          imageAlt={t("Digital safety benefits")}
          imageCaption={t("Practical training helps adults protect themselves online and use technology confidently.")}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Shield size={40} />, 
                title: t("Stay Protected"), 
                description: t("Learn to identify and avoid digital scams targeting older Sri Lankan adults") 
              },
              { 
                icon: <Award size={40} />, 
                title: t("Build Confidence"), 
                description: t("Master essential digital skills through step-by-step, hands-on practice") 
              },
              { 
                icon: <Globe size={40} />, 
                title: t("Connect Securely"), 
                description: t("Use online banking, video calls, and social media safely and confidently") 
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="glass-card p-8 flex flex-col items-center text-center scroll-animate"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-institutional mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </ContentSection>

        <ContentSection 
          id="upcoming-sessions" 
          title={t("Upcoming Course Dates")}
          titleSize="large"
          subtitle={t("Secure your spot in our next session")}
          titleAlignment="left"
          background="white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <MapPin size={24} />, 
                title: t("In-Person (Colombo)"), 
                dates: t("May 7, 14, 21, 2025"),
                spots: t("12 spots remaining")
              },
              { 
                icon: <Monitor size={24} />, 
                title: t("Online (Sri Lanka time)"), 
                dates: t("May 10-14, 2025"),
                spots: t("15 spots remaining")
              },
              { 
                icon: <Globe size={24} />, 
                title: t("Online (Europe time)"), 
                dates: t("June 3-7, 2025"),
                spots: t("20 spots remaining")
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="glass-card p-8 scroll-animate"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-institutional-100 rounded-full text-institutional mr-3">{item.icon}</div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                </div>
                <p className="text-gray-600 mb-2"><Calendar size={16} className="inline mr-2" /> {item.dates}</p>
                <p className="text-gray-600 mb-6"><Users size={16} className="inline mr-2" /> {item.spots}</p>
                <a href="/registration" className="button-institutional-outline w-full text-center block">
                  {t("Reserve Your Spot")}
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center scroll-animate" style={{ transitionDelay: '300ms' }}>
            <a href="/registration" className="button-institutional inline-flex">
              {t("Secure Your Spot")} <MoveRight size={18} className="ml-2" />
            </a>
          </div>
        </ContentSection>
        
        
        <ContentSection 
          id="course-formats" 
          title={t("Our Courses")}
          titleSize="large"
          subtitle={t("Explore our diverse range of AI-enhanced courses")}
          titleAlignment="left"
          background="white"
          imageUrl="https://images.unsplash.com/photo-1551739502-2af0c32df4d5?q=80&w=800&auto=format&fit=crop"
          imageAlt={t("Courses banner")}
          imageCaption={t("Explore our diverse range of AI-enhanced courses.")}
        >
          <div className="scroll-animate">
            <FeaturedContent
              items={[
                {
                  imageUrl: "https://images.unsplash.com/photo-1563309480-5aca14189417?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder for German Language Courses
                  title: t("German Language Courses with AI"),
                  description: t("Get access to Germany's free higher education with full confidence."),
                  link: ""
                },
                {
                  imageUrl: "https://images.unsplash.com/photo-1517849325426-6eac321919a0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder for IELTS Coaching
                  title: t("IELTS Coaching with AI"),
                  description: t("Prepare for your IELTS exam with tailored AI support and resources."),
                  link: ""
                },
                {
                  imageUrl: "https://images.unsplash.com/photo-1612117150828-78a83cd63ef2?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder for AI for Kids
                  title: t("AI for Kids"),
                  description: t("Engaging AI courses designed to introduce children to technology."),
                  link: ""
                },
                {
                  imageUrl: "https://images.unsplash.com/photo-1525338078858-d762b5e32f2c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder for AI for Adults
                  title: t("AI for Adults"),
                  description: t("Learn how to leverage AI tools for personal growth."),
                  link: ""
                },
                {
                  imageUrl: "https://images.unsplash.com/photo-1652565437094-ce12e77dcf0e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder for AI at Work
                  title: t("AI at Work"),
                  description: t("Discover how AI can enhance productivity and efficiency in the workplace."),
                  link: ""
                },
                {
                  imageUrl: "https://images.unsplash.com/photo-1600437493529-cbab154790be?q=80&w=3734&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder for Coding for Kids and Teens
                  title: t("Coding for Kids and Teens"),
                  description: t("Fun and interactive coding courses designed for young learners."),
                  link: ""
                }
              ]}
            />
          </div>
          
         
        </ContentSection>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
