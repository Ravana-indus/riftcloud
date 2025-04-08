import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContentSection from '@/components/ui/ContentSection';
import KeyStatsGrid from '@/components/ui/KeyStatsGrid';
import { Building, MoveRight, Users, Award, Book, GraduationCap, Globe, MapPin, Target, Heart, Laptop } from 'lucide-react';

const About = () => {
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6 scroll-animate">Bridging the Divide</h1>
              <p className="text-xl mb-8 scroll-animate" style={{ transitionDelay: '100ms' }}>
                Technology and language education for all Sri Lankans
              </p>
              <p className="text-lg mb-8 scroll-animate" style={{ transitionDelay: '200ms' }}>
                Ravana Institute of Future was established with a clear purpose by Ravana Industries Group: to provide technology education that's accessible, 
                practical, and culturally relevant to Sri Lankans. We believe that digital skills should be available to everyone, 
                regardless of age, background, or previous experience.
              </p>
            </div>
          </div>
        </div>
        
        {/* Mission Section */}
        <ContentSection 
          id="mission" 
          title="Our Mission" 
          subtitle="What drives us every day"
          titleAlignment="center"
          background="white"
        >
          <div className="max-w-4xl mx-auto text-center scroll-animate">
            <div className="glass-card p-10 rounded-lg shadow-elegant">
              <p className="text-xl text-gray-700 italic mb-6">
                "To empower Sri Lankans with the knowledge and skills to navigate the digital world safely and confidently, 
                creating more inclusive access to technology's benefits across all age groups and communities."
              </p>
              <div className="h-0.5 w-24 bg-blue-500 mx-auto mb-6"></div>
              <p className="text-gray-600">
                Every program we develop, every course we teach, and every resource we create is guided by this 
                mission to make technology accessible and beneficial for all Sri Lankans.
              </p>
            </div>
          </div>
        </ContentSection>
        
        {/* Values Section */}
        <ContentSection 
          id="values" 
          title="What We Stand For" 
          subtitle="Our core values define how we operate"
          titleAlignment="left"
          imageAlt="Our values in action"
          imageCaption="Our team works together to create inclusive learning experiences for all."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <Users size={36} />, 
                title: "Inclusive Access", 
                description: "Making technology education available to everyone, especially those most affected by the digital divide."
              },
              { 
                icon: <Target size={36} />, 
                title: "Practical Application", 
                description: "Teaching real-world skills that can be immediately applied in daily life."
              },
              { 
                icon: <Heart size={36} />, 
                title: "Cultural Relevance", 
                description: "Creating learning experiences that respect and reflect Sri Lankan contexts."
              },
              { 
                icon: <Book size={36} />, 
                title: "Lifelong Learning", 
                description: "Supporting continuous skill development as technology evolves."
              },
              { 
                icon: <Building size={36} />, 
                title: "Community Impact", 
                description: "Spreading digital knowledge that strengthens families and communities."
              },
              { 
                icon: <Award size={36} />, 
                title: "Excellence", 
                description: "Striving for the highest standards in our educational programs and materials."
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="glass-card p-8 flex flex-col items-center text-center scroll-animate"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-blue-600 mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </ContentSection>
        
        {/* Team Section */}
       
       
        {/* Approach Section */}
        <ContentSection 
          id="approach" 
          title="How We Teach" 
          subtitle="Our approach to effective technology education"
          titleAlignment="left"
          background="white"
          imageAlt="Our teaching approach"
          imageCaption="We focus on practical, hands-on learning that builds confidence with technology."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Skills-First Learning", 
                description: "We focus on practical abilities rather than technical theory, ensuring you can apply what you learn immediately."
              },
              { 
                title: "Tailored Teaching", 
                description: "Our methods adapt to suit different ages and experience levels, providing personalized support."
              },
              { 
                title: "Local Context", 
                description: "All examples and scenarios come from Sri Lankan daily life, making learning relevant and immediately applicable."
              },
              { 
                title: "Question-Friendly Environment", 
                description: "We create spaces where no question is too basic, encouraging full participation and understanding."
              },
              { 
                title: "Continuous Support", 
                description: "Learning doesn't end when class finishes - we provide resources for ongoing skill development."
              },
              { 
                title: "Multilingual Instruction", 
                description: "Courses and materials available in English, Sinhala, and Tamil to ensure accessibility for all."
              }
            ].map((approach, index) => (
              <div 
                key={index}
                className="glass-card p-6 rounded-lg shadow-elegant scroll-animate"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{approach.title}</h3>
                <p className="text-gray-600">{approach.description}</p>
              </div>
            ))}
          </div>
        </ContentSection>
        
        {/* Facilities Section */}
        <ContentSection 
          id="facilities" 
          title="Our Learning Spaces" 
          subtitle="Purpose-built environments for effective technology education"
          titleAlignment="left"
          imageAlt="Our facilities"
          imageCaption="Our modern learning spaces are designed to make technology learning accessible and engaging."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin size={40} />,
                title: "Convenient Location",
                description: "Centrally located in Colombo with easy access via public transport and ample parking.",
              },
              {
                icon: <Building size={40} />,
                title: "Purpose-Built Classrooms",
                description: "Spaces specifically designed for technology education with optimal seating and visibility.",
              },
              {
                icon: <Laptop size={40} />,
                title: "Current Technology",
                description: "Up-to-date devices and software ensure you learn on systems relevant to today's digital environment.",
              },
            ].map((facility, index) => (
              <div 
                key={index}
                className="glass-card p-8 rounded-lg shadow-elegant flex flex-col items-center text-center scroll-animate"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-blue-600 mb-4">{facility.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{facility.title}</h3>
                <p className="text-gray-600">{facility.description}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              {
                icon: <Users size={40} />,
                title: "Accessibility Features",
                description: "Facilities designed for participants of all abilities with ramps, accessible restrooms, and assistive technology.",
              },
              {
                icon: <Globe size={40} />,
                title: "Digital Platform",
                description: "State-of-the-art online learning environment for remote participants with intuitive interfaces.",
              },
              {
                icon: <Coffee size={40} />,
                title: "Comfortable Environment",
                description: "Break areas, refreshment facilities, and comfortable seating to enhance the learning experience.",
              },
            ].map((facility, index) => (
              <div 
                key={index}
                className="glass-card p-8 rounded-lg shadow-elegant flex flex-col items-center text-center scroll-animate"
                style={{ transitionDelay: `${(index + 3) * 150}ms` }}
              >
                <div className="text-blue-600 mb-4">{facility.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{facility.title}</h3>
                <p className="text-gray-600">{facility.description}</p>
              </div>
            ))}
          </div>
        </ContentSection>
        
        {/* CTA Section */}
        <ContentSection 
          id="contact-cta" 
          title="Want to Learn More?" 
          subtitle="We're happy to answer your questions"
          titleAlignment="center"
          background="white"
        >
          <div className="max-w-xl mx-auto text-center scroll-animate">
            <p className="text-gray-600 mb-8">
              Contact our team to learn more about our mission, programs, or how you can get involved with the Ravana Institute of Future.
            </p>
            <a href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-medium text-lg transition duration-300 inline-flex items-center">
              Contact Us <MoveRight size={20} className="ml-2" />
            </a>
          </div>
        </ContentSection>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;

function Coffee(props) {
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
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  )
} 