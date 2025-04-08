import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import ContentSection from '@/components/ui/ContentSection';
import FeaturedContent from '@/components/ui/FeaturedContent';
import KeyStatsGrid from '@/components/ui/KeyStatsGrid';
import CompactCourseModules from '@/components/ui/CompactCourseModules';
import { Shield, Award, Users, BookOpen, CheckCircle, Calendar, MoveRight, Target, Lightbulb, UserCheck, Laptop, VideoIcon, MapPin, Monitor, Globe } from 'lucide-react';

const DigitalSafetyCourse = () => {
  const moduleImages = [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop',
  ];

  const formatImages = [
    'https://images.unsplash.com/photo-1557989048-03456d01a26e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581547848438-56681f9cdce0??q=80&w=600&auto=format&fit=crop',
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
      
      <main className="pt-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-institutional to-institutional-dark text-white py-24">
          <div className="container-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="lg:pr-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-up">Digital Safety for the Modern World</h1>
                <p className="text-xl mb-8 opacity-90 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                  Practical skills for navigating technology with confidence, designed specifically for adults 45+ in Sri Lanka.
                </p>
                <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                  <a href="#course-overview" className="bg-white text-institutional hover:bg-institutional-50 hover:text-white px-6 py-3 rounded-md font-medium transition duration-300">
                    View Course Details
                  </a>
                  <a href="/registration" className="bg-institutional-500 hover:bg-institutional-600 text-white px-6 py-3 rounded-md font-medium transition duration-300 border border-institutional-400">
                    Register Now
                  </a>
                </div>
              </div>
              <div className="relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="rounded-xl overflow-hidden shadow-elegant relative">
                  <img 
                    src="https://images.unsplash.com/photo-1540294668169-b6743bd0e94e?q=80&w=800&auto=format&fit=crop"
                    alt="Senior adults learning digital skills" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-institutional-200 bg-opacity-20 rounded-full -z-10"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-institutional-600 bg-opacity-20 rounded-full -z-10"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course Overview Section */}
        <ContentSection 
          id="course-overview" 
          title="Course Overview" 
          subtitle="Practical skills for navigating technology with confidence"
          titleAlignment="left"
          background="white"
          imageAlt="Adults learning digital safety"
          imageCaption="Our hands-on approach makes learning digital safety skills accessible and engaging for adults 45+."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate">
              <p className="text-gray-600 mb-6">
                Technology offers incredible benefits—staying connected with family, accessing services, and finding information. 
                But it also presents challenges, especially for those who didn't grow up using digital tools. 
                Our course provides straightforward, practical guidance on using technology safely and confidently.
              </p>
              
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">This Course Is Perfect For:</h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Adults 45+ who want to use technology more confidently</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>People concerned about online scams and digital security</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Individuals wanting to understand AI and how it affects them</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Family members who help older relatives with technology</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Business professionals needing to protect sensitive information</span>
                </li>
              </ul>
              <a href="/registration" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 inline-flex items-center">
                Register for Next Course <MoveRight size={18} className="ml-2" />
              </a>
            </div>
            
            <div className="scroll-animate" style={{ transitionDelay: '300ms' }}>
              <div className="glass-card p-8 rounded-lg shadow-elegant">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">By the End of This Course, You Will:</h3>
                <ul className="space-y-4">
                  {[
                    "Recognize and avoid sophisticated digital scams targeting older adults",
                    "Set up strong security measures on your devices and accounts",
                    "Use AI tools safely while understanding their limitations",
                    "Evaluate online information for reliability and accuracy",
                    "Create your personal digital safety plan",
                    "Help family members and friends stay safe online"
                  ].map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <Target size={20} className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </ContentSection>
        
        {/* Course Structure Section */}
        <ContentSection 
          id="course-modules" 
          title="Course Modules" 
          subtitle="A comprehensive curriculum designed for practical application"
          titleAlignment="left"
          imageAlt="Course curriculum"
          imageCaption="Our curriculum covers essential digital safety topics from the basics to advanced protection strategies."
        >
          <div className="scroll-animate">
            <CompactCourseModules 
              modules={[
                {
                  number: 1,
                  title: "Digital Basics & AI Fundamentals",
                  description: "Essential technology concepts explained simply",
                  points: [
                    "Understanding what AI is and how it's used daily",
                    "Technology terms in plain language",
                    "Building a foundation for digital confidence"
                  ]
                },
                {
                  number: 2,
                  title: "Recognizing and Avoiding Scams",
                  description: "Common scams targeting Sri Lankan adults 45+",
                  points: [
                    "Red flags in messages, calls, and emails",
                    "How to verify legitimate communications",
                    "New AI-powered scams (deepfakes, voice cloning)"
                  ]
                },
                {
                  number: 3,
                  title: "Protecting Your Finances Online",
                  description: "Securing banking apps and online accounts",
                  points: [
                    "Safe online shopping practices",
                    "Spotting financial fraud attempts",
                    "Recovering from financial scams"
                  ]
                },
                {
                  number: 4,
                  title: "Helpful Digital Tools & AI Applications",
                  description: "Digital tools that make life easier",
                  points: [
                    "Setting privacy controls correctly",
                    "Getting benefits while minimizing risks",
                    "Hands-on practice with useful applications"
                  ]
                },
                {
                  number: 5,
                  title: "Critical Thinking Online",
                  description: "Spotting misinformation and manipulation",
                  points: [
                    "Understanding AI content and its limitations",
                    "Fact-checking techniques anyone can use",
                    "Protecting yourself from manipulation"
                  ]
                },
                {
                  number: 6,
                  title: "Creating Your Secure Digital Environment",
                  description: "Setting up security on your specific devices",
                  points: [
                    "Managing your online presence",
                    "Protecting your personal information",
                    "Creating your incident response plan"
                  ]
                },
                {
                  number: 7,
                  title: "Becoming a Digital Guide",
                  description: "Sharing knowledge with family and friends",
                  points: [
                    "Supporting others with technology questions",
                    "Finding ongoing learning resources",
                    "Building a support network"
                  ]
                }
              ]}
            />
          </div>
        </ContentSection>
        
        {/* Course Formats Section */}
        <ContentSection 
          id="course-formats" 
          title="Choose Your Learning Experience" 
          subtitle="Learning options that fit your life and preferences"
          titleAlignment="left"
          background="white"
          imageAlt="Learning formats"
          imageCaption="We offer both in-person and online learning experiences to suit your schedule and learning preferences."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="glass-card p-8 rounded-lg shadow-elegant scroll-animate">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Users size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">In-Person Learning</h3>
              </div>
              <img 
                src={formatImages[0]} 
                alt="In-person class setting" 
                className="w-full h-48 object-cover rounded-md mb-6"
              />
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Calendar size={20} className="text-institutional mr-2 mt-1 flex-shrink-0" />
                  <span>3 Saturdays/Sundays, 4 hours per session (12 hours total)</span>
                </li>
                <li className="flex items-start">
                  <Users size={20} className="text-institutional mr-2 mt-1 flex-shrink-0" />
                  <span>Small groups of maximum 15 participants</span>
                </li>
                <li className="flex items-start">
                  <Laptop size={20} className="text-institutional mr-2 mt-1 flex-shrink-0" />
                  <span>Hands-on practice with instructor guidance</span>
                </li>
                <li className="flex items-start">
                  <Target size={20} className="text-institutional mr-2 mt-1 flex-shrink-0" />
                  <span>Located at our Colombo City Centre facility</span>
                </li>
                <li className="flex items-start">
                  <Award size={20} className="text-institutional mr-2 mt-1 flex-shrink-0" />
                  <span>Official certificate of completion</span>
                </li>
              </ul>
              <div className="text-center mt-6">
                <a href="/registration" className="bg-institutional hover:bg-institutional-dark text-white px-6 py-3 rounded-md font-medium transition duration-300 inline-flex items-center">
                  Choose In-Person Learning
                </a>
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-lg shadow-elegant scroll-animate" style={{ transitionDelay: '200ms' }}>
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <VideoIcon size={32} className="text-indigo-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Online Learning</h3>
              </div>
              <img 
                src={formatImages[1]} 
                alt="Online learning experience" 
                className="w-full h-48 object-cover rounded-md mb-6"
              />
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Calendar size={20} className="text-institutional mr-2 mt-1 flex-shrink-0" />
                  <span>5 weekdays, 2 hours per session (10 hours total)</span>
                </li>
                <li className="flex items-start">
                  <VideoIcon size={20} className="text-institutional mr-2 mt-1 flex-shrink-0" />
                  <span>Interactive video sessions with live instruction</span>
                </li>
                <li className="flex items-start">
                  <Laptop size={20} className="text-institutional mr-2 mt-1 flex-shrink-0" />
                  <span>Practice exercises and discussion opportunities</span>
                </li>
                <li className="flex items-start">
                  <Target size={20} className="text-institutional mr-2 mt-1 flex-shrink-0" />
                  <span>Convenient participation from your home</span>
                </li>
                <li className="flex items-start">
                  <Award size={20} className="text-institutional mr-2 mt-1 flex-shrink-0" />
                  <span>Digital certificate upon completion</span>
                </li>
              </ul>
              <div className="text-center mt-6">
                <a href="/registration" className="bg-institutional hover:bg-institutional-dark text-white px-6 py-3 rounded-md font-medium transition duration-300 inline-flex items-center">
                  Choose Online Learning
                </a>
              </div>
            </div>
          </div>
        </ContentSection>
        
        {/* Teaching Approach Section */}
        <ContentSection 
          id="teaching-approach" 
          title="Our Teaching Philosophy" 
          subtitle="An approach designed with you in mind"
          titleAlignment="left"
          imageAlt="Teaching approach"
          imageCaption="Our teaching methods are designed specifically for adults 45+ with limited technology experience."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Target size={40} />, title: "Practical Focus", description: "Skills you can use immediately in your daily life." },
              { icon: <UserCheck size={40} />, title: "Patient Instruction", description: "Comfortable pace for adults with limited tech experience." },
              { icon: <Lightbulb size={40} />, title: "Local Context", description: "Examples and scenarios from Sri Lankan daily life." },
              { icon: <Laptop size={40} />, title: "Learn By Doing", description: "Extensive practice with your own devices." },
              { icon: <Shield size={40} />, title: "Ongoing Support", description: "Access to resources and help after the course ends." },
              { icon: <BookOpen size={40} />, title: "Multilingual", description: "Teaching available in English, Sinhala, and Tamil." }
            ].map((item, index) => (
              <div 
                key={index}
                className="glass-card p-8 flex flex-col items-center text-center scroll-animate"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-blue-600 mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </ContentSection>
        
        {/* Testimonials Section
        <ContentSection 
          id="testimonials" 
          title="Success Stories from Participants" 
          subtitle="Hear from others who've completed our courses"
          titleAlignment="left"
          background="white"
          imageUrl="https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=800&auto=format&fit=crop"
          imageAlt="Course participants"
          imageCaption="Our courses have helped hundreds of adults 45+ gain confidence with technology."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Anura P., 63",
                role: "Retired Bank Manager",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
                testimonial: "I was embarrassed after falling for a phone scam last year. This course not only taught me how to spot scams but also gave me back my confidence with technology."
              },
              {
                name: "Kumari S., 58",
                role: "Retired Teacher",
                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop",
                testimonial: "The way complex concepts were explained made perfect sense to me. Now I'm the one my friends call when they have questions about online security!"
              },
              {
                name: "Jayanthi M., 52",
                role: "Small Business Owner",
                image: "https://images.unsplash.com/photo-1563452965085-2e77e5bf2607?q=80&w=200&auto=format&fit=crop",
                testimonial: "The business security section alone saved me from potential disaster. I've completely changed how we handle customer information and online payments."
              },
              {
                name: "Rajan K., 67",
                role: "Retired Government Official",
                image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop",
                testimonial: "I was skeptical about AI and avoided using helpful tools. Now I understand both the benefits and risks, allowing me to use technology that makes my life easier."
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="glass-card p-8 rounded-lg shadow-elegant scroll-animate"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "{testimonial.testimonial}"
                </p>
              </div>
            ))}
          </div>
        </ContentSection>
         */}
        {/* FAQ Section */}
        <ContentSection 
          id="faq" 
          title="Common Questions" 
          subtitle="Get answers to frequently asked questions about our course"
          titleAlignment="left"
          imageAlt="FAQ"
          imageCaption="We're here to answer all your questions about our digital safety course."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Do I need advanced technology skills to take this course?",
                answer: "Not at all. Our course is specifically designed for beginners. We start with the basics and progress at a comfortable pace."
              },
              {
                question: "What devices should I bring?",
                answer: "For in-person sessions, please bring the devices you use regularly (smartphone, tablet, or laptop). For online sessions, you'll need a device with internet access and video capability."
              },
              {
                question: "What if I can't attend all sessions?",
                answer: "We recommend attending all sessions for the full benefit, but we provide detailed materials to help you catch up if you miss one. Sessions are also recorded for online participants."
              },
              {
                question: "Will I get course materials to keep?",
                answer: "Yes, all participants receive comprehensive course materials in both digital and printed formats that you can reference anytime."
              },
              {
                question: "How large are the classes?",
                answer: "In-person sessions are limited to 15 participants to ensure personal attention. Online sessions are capped at 20 participants."
              },
              {
                question: "Is there help available after the course ends?",
                answer: "Yes, all participants gain access to our community forum where you can ask questions. Instructors remain available by email for 30 days after course completion."
              },
              {
                question: "Can I bring someone to help me during the course?",
                answer: "Yes, we offer a companion rate for family members. Many participants find it helpful to attend with a spouse, child, or friend."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="glass-card p-6 rounded-lg shadow-elegant scroll-animate"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </ContentSection>
        

        <ContentSection 
          id="upcoming-sessions" 
          title="Upcoming Course Dates" 
          titleSize="default"
          subtitle="Secure your spot in our next session"
          titleAlignment="left"
          background="white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <MapPin size={24} />, 
                title: "In-Person (Sri Lanka)", 
                dates: "April 7, 14, 21, 2025",
                spots: "11 spots remaining" 
              },
              { 
                icon: <Monitor size={24} />, 
                title: "Online (Sri Lankan time)", 
                dates: "May 20-04, 2025",
                spots: "07 spots remaining" 
              },
              { 
                icon: <Globe size={24} />, 
                title: "Online (European time)", 
                dates: "April 3-7, 2025",
                spots: "15 spots remaining" 
              },
              { 
                icon: <Globe size={24} />, 
                title: "Online (North American time)", 
                dates: "April 3-7, 2025",
                spots: "15 spots remaining" 
              },
              { 
                icon: <Globe size={24} />, 
                title: "Online (Australia/New Zealand time)", 
                dates: "April 3-7, 2025",
                spots: "12 spots remaining" 
              },
              { 
                icon: <Globe size={24} />, 
                title: "Online (Malaysia/Singapore time)", 
                dates: "April 3-7, 2025",
                spots: "14 spots remaining" 
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
                  Reserve Your Spot
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center scroll-animate" style={{ transitionDelay: '300ms' }}>
          <a href="/registration" className="bg-institutional hover:bg-institutional-dark text-white px-8 py-4 rounded-md font-medium text-lg transition duration-300 inline-flex items-center">
                  Secure Your Spot Now <MoveRight size={20} className="ml-2" />
                </a>
                <p className="mt-4 text-gray-500">
                  Questions? Contact us at <a href="mailto:info@riftuni.com" className="text-institutional hover:underline">info@riftuni.com</a> or call +94 11 234 5678
                </p>
          </div>
        </ContentSection>       



       
      </main>
      
      <Footer />
    </div>
  );
};

export default DigitalSafetyCourse; 