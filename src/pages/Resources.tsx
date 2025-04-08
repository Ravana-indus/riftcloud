import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContentSection from '@/components/ui/ContentSection';
import { AlertTriangle, FileText, Video, Link2, Download, ChevronRight, ExternalLink, BookOpen, MoveRight } from 'lucide-react';





const Resources = () => {
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6 scroll-animate">Free Digital Safety Resources</h1>
              <p className="text-xl mb-8 scroll-animate" style={{ transitionDelay: '100ms' }}>
                Practical tools for staying safe online
              </p>
              <p className="text-lg mb-8 scroll-animate" style={{ transitionDelay: '200ms' }}>
                Browse our collection of free resources designed specifically for Sri Lankan adults. 
                Use these materials to protect yourself online and share important security information with family and friends.
              </p>
            </div>
          </div>
        </div>
        
        {/* Scam Alerts Section */}
        <ContentSection 
          id="scam-alerts" 
          title="Current Scam Warnings" 
          subtitle="Stay informed about active scams currently targeting Sri Lankans"
          titleAlignment="left"
          background="white"
          imageUrl="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop"
          imageAlt="Digital scam warning"
          imageCaption="Staying informed about current threats is your first line of defense."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Banking Verification Fraud",
                what: "Calls claiming to be from your bank requesting OTP or verification codes",
                warnings: "Urgency, threats about account closure, requests for verification codes",
                protection: "Never share OTPs, call your bank directly using official numbers",
                color: "red"
              },
              {
                title: "Utility Payment Scams",
                what: "Messages about urgent electricity or water bill payments",
                warnings: "Unusual payment methods, threatening immediate disconnection",
                protection: "Verify bills through official company websites or offices",
                color: "amber"
              },
              {
                title: "Government Impersonation",
                what: "Callers pretending to be from government departments demanding payment",
                warnings: "Threats of arrest, requests for immediate payment",
                protection: "Verify with official government offices, never pay over the phone",
                color: "orange"
              },
              {
                title: "WhatsApp Account Hijacking",
                what: "Scammers taking over WhatsApp accounts through verification codes",
                warnings: "Contacts asking for verification codes sent to your phone",
                protection: "Never share verification codes, enable two-factor authentication",
                color: "yellow"
              }
            ].map((alert, index) => (
              <div 
                key={index}
                className={`glass-card p-6 rounded-lg border-l-4 border-${alert.color}-500 shadow-elegant scroll-animate`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start mb-4">
                  <AlertTriangle className={`text-${alert.color}-500 mr-3 flex-shrink-0`} />
                  <h3 className="text-xl font-semibold text-gray-900">{alert.title}</h3>
                </div>
                
                <div className="ml-9">
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700">What it is:</p>
                    <p className="text-gray-600">{alert.what}</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700">Warning signs:</p>
                    <p className="text-gray-600">{alert.warnings}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Protection steps:</p>
                    <p className="text-gray-600">{alert.protection}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContentSection>
        
        {/* Guides & Checklists Section */}
        <ContentSection 
          id="guides" 
          title="Quick Reference Guides" 
          subtitle="Download, print, and share these practical security guides"
          titleAlignment="left"
          imageUrl="https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop"
          imageAlt="Security guides"
          imageCaption="Our downloadable guides make it easy to reference important security information anytime."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Digital Safety Essentials",
                description: "Basic practices everyone should follow",
                format: "Printable PDF guide",
                icon: <FileText size={24} />
              },
              {
                title: "Scam Detection Checklist",
                description: "Easy-to-use reference for spotting suspicious communications",
                format: "Wallet-sized PDF card",
                icon: <FileText size={24} />
              },
              {
                title: "Strong Password Guide",
                description: "Simple methods for creating and managing secure passwords",
                format: "Illustrated PDF guide",
                icon: <FileText size={24} />
              },
              {
                title: "Phone Security Setup",
                description: "Step-by-step instructions for securing your mobile device",
                format: "PDF with screenshots",
                icon: <FileText size={24} />
              },
              {
                title: "Banking Safety Guide",
                description: "Protecting your financial information online",
                format: "Detailed PDF guide",
                icon: <FileText size={24} />
              },
              {
                title: "Family Safety Discussion Guide",
                description: "How to talk about digital safety with family members",
                format: "Conversation guide PDF",
                icon: <FileText size={24} />
              }
            ].map((guide, index) => (
              <div 
                key={index}
                className="glass-card p-6 scroll-animate"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    {guide.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                    <p className="text-gray-500 text-xs mb-4">{guide.format}</p>
                    
                    <a 
                      href="#" 
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      <Download size={16} className="mr-1" /> Download PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContentSection>
        
        {/* Video Tutorials Section */}
        <ContentSection 
          id="videos" 
          title="Watch and Learn" 
          subtitle="Short, clear video explanations of key digital safety topics"
          titleAlignment="left"
          background="white"
          imageUrl="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop"
          imageAlt="Video tutorials"
          imageCaption="Our video tutorials make complex topics easy to understand through clear visual demonstrations."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Spotting Scam Messages",
                description: "How to identify suspicious SMS and WhatsApp communications",
                length: "4 minutes",
                thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=600&auto=format&fit=crop"
              },
              {
                title: "Securing Your Smartphone",
                description: "Essential security settings everyone should enable",
                length: "6 minutes",
                thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop"
              },
              {
                title: "Banking Safely Online",
                description: "Protecting your accounts and transactions",
                length: "5 minutes",
                thumbnail: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=600&auto=format&fit=crop"
              },
              {
                title: "Password Security Made Simple",
                description: "Creating strong, memorable passwords without confusion",
                length: "3 minutes",
                thumbnail: "https://images.unsplash.com/photo-1633265486501-b404a8e73cfe?q=80&w=600&auto=format&fit=crop"
              },
              {
                title: "Social Media Privacy",
                description: "Controlling who sees your personal information",
                length: "7 minutes",
                thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=600&auto=format&fit=crop"
              }
            ].map((video, index) => (
              <div 
                key={index}
                className="scroll-animate"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative rounded-lg overflow-hidden mb-4 group">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center group-hover:bg-opacity-100 transition duration-300">
                      <Video className="text-blue-600 h-8 w-8" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {video.length}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                <p className="text-gray-600 text-sm">{video.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 scroll-animate" style={{ transitionDelay: '500ms' }}>
            <a 
              href="#" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 inline-flex items-center"
            >
              View All Videos <ChevronRight size={18} className="ml-1" />
            </a>
          </div>
        </ContentSection>
        
        {/* Official Resources Section */}
        <ContentSection 
          id="official-resources" 
          title="Trusted Information Sources" 
          subtitle="Links to official security resources in Sri Lanka"
          titleAlignment="left"
          imageUrl="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=800&auto=format&fit=crop"
          imageAlt="Official resources"
          imageCaption="Official government and institutional resources provide reliable information on digital safety."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Sri Lanka CERT",
                description: "Official Computer Emergency Readiness Team providing security guidance and alerts",
                url: "https://www.cert.gov.lk/"
              },
              {
                title: "Central Bank Security Advisories",
                description: "Banking security guidance and alerts from Sri Lanka's Central Bank",
                url: "https://www.cbsl.gov.lk/"
              },
              {
                title: "Telecommunications Commission",
                description: "Communication safety information and telecommunications regulations",
                url: "https://www.trc.gov.lk/"
              },
              {
                title: "Cybercrime Police Division",
                description: "Official reporting procedures and cybercrime awareness resources",
                url: "https://www.police.lk/"
              }
            ].map((resource, index) => (
              <div 
                key={index}
                className="glass-card p-6 rounded-lg scroll-animate"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <Link2 className="text-blue-600 mr-3" />
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4 ml-9">{resource.description}</p>
                <div className="ml-9">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Visit Official Website <ExternalLink size={16} className="ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </ContentSection>
        
        {/* Blog Section */}
        <ContentSection 
          id="blog" 
          title="Digital Safety Articles" 
          subtitle="Practical advice and current information about digital safety in Sri Lanka"
          titleAlignment="left"
          background="white"
          imageUrl="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop"
          imageAlt="Digital safety articles"
          imageCaption="Our articles provide in-depth information on important digital safety topics."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Helping Older Family Members Recognize Scams",
                description: "Effective approaches for safety conversations with relatives",
                date: "June 15, 2025",
                image: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?q=80&w=600&auto=format&fit=crop"
              },
              {
                title: "Voice Clone Scams: The New Threat",
                description: "How AI voice impersonation works and how to protect yourself",
                date: "June 8, 2025",
                image: "https://images.unsplash.com/photo-1593697972672-b1c1666b3886?q=80&w=600&auto=format&fit=crop"
              },
              {
                title: "5 Security Settings to Change Today",
                description: "Quick changes that dramatically improve your online safety",
                date: "June 1, 2025",
                image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop"
              },
              {
                title: "Two-Factor Authentication Explained Simply",
                description: "Understanding this important security feature in plain language",
                date: "May 25, 2025",
                image: "https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=600&auto=format&fit=crop"
              }
            ].map((article, index) => (
              <div 
                key={index}
                className="glass-card overflow-hidden rounded-lg scroll-animate"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <p className="text-sm text-blue-600 mb-2">{article.date}</p>
                  <h3 className="text-xl font-semibold mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  
                  <a 
                    href="#" 
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    Read Article <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 scroll-animate" style={{ transitionDelay: '600ms' }}>
            <a 
              href="#" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 inline-flex items-center"
            >
              View All Articles <ChevronRight size={18} className="ml-1" />
            </a>
          </div>
        </ContentSection>
        
        {/* CTA Section */}
        <ContentSection 
          id="course-cta" 
          title="Need More Comprehensive Help?" 
          subtitle="Our structured course provides hands-on guidance"
          titleAlignment="center"
          background="gray-50"
        >
          <div className="max-w-3xl mx-auto text-center scroll-animate">
            <div className="glass-card p-8 rounded-lg shadow-elegant">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <BookOpen className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold mb-4">Digital Safety & AI Awareness Course</h3>
              <p className="text-gray-600 mb-8">
                While these resources are helpful, our comprehensive course provides personalized guidance,
                hands-on practice, and in-depth learning to build your confidence with technology.
                Join our next session to get the full benefit of our expert instruction.
              </p>
              
              <a 
                href="/digital-safety-course" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-medium text-lg transition duration-300 inline-flex items-center"
              >
                Explore Course Options <MoveRight size={20} className="ml-2" />
              </a>
            </div>
          </div>
        </ContentSection>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resources; 