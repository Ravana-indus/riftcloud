import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContentSection from '@/components/ui/ContentSection';
import { CalendarDays, Users, Check, CreditCard, Building, Circle, HelpCircle, Info, Clock, Phone, Mail, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CountrySelector from '@/components/CountrySelector';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { getPricingByCountry, formatPrice, PricingOption, calculateFinalPrice, verifyPromoCode } from '@/utils/countryPricing';
import { LeadData } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useLeadRegistration } from '@/hooks/useApi';
import { usePaymentProcess } from '@/hooks/usePaymentProcess';

const Registration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Add country detection
  const { country: detectedCountry, loading: locationLoading, error: locationError } = useGeoLocation();
  const [selectedCountry, setSelectedCountry] = useState<string>('default');

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    language: '',
    timeZone: '',
    referralSource: '',
    specialRequirements: '',
    agreedToTerms: false,
    custom_preferred_mode: '' as 'Online' | 'In-Person' | '',
    custom_preferred_type: '' as 'Weekdays Intensive' | 'Weekend Intensive' | 'Weekdays Extensive' | 'Weekend Extensive' | '',
    custom_payment_method: '' as 'Bank Transfer' | 'CC/DC - Payhere' | 'CC/DC - Stripe' | '',
    custom_registering_with_a_family_member: false,
    custom_family_member_name: '',
    custom_promo_code: '',
    custom_address: '',
    custom_city: '',
    custom_country: 'default'  // Initialize with default
  });
  
  // Use the lead registration hook
  const { 
    submitRegistration, 
    isSubmitting, 
    error: submissionError, 
    success,
    leadId 
  } = useLeadRegistration();
  
  // Use the payment process hook
  const {
    processPayherePayment,
    isProcessing: isProcessingPayment,
    error: paymentError
  } = usePaymentProcess();
  
  const [pricingInfo, setPricingInfo] = useState<PricingOption>(getPricingByCountry('default'));
  
  // Add state for calculated price
  const [calculatedPrice, setCalculatedPrice] = useState<{
    amount: number;
    currency: string;
    formattedPrice: string;
    discounts: { family: boolean; promoCode: boolean };
  } | null>(null);
  
  // Add state for promo code verification
  const [isVerifyingPromoCode, setIsVerifyingPromoCode] = useState<boolean>(false);
  const [isPromoCodeValid, setIsPromoCodeValid] = useState<boolean | null>(null);

  // Set country from geolocation when available
  useEffect(() => {
    if (detectedCountry) {
      setSelectedCountry(detectedCountry);
      setPricingInfo(getPricingByCountry(detectedCountry));
    }
  }, [detectedCountry]);

  // Update pricing when country changes
  useEffect(() => {
    setPricingInfo(getPricingByCountry(selectedCountry));
    
    // If the selected country doesn't support in-person courses,
    // force online course type using the new state field
    const pricing = getPricingByCountry(selectedCountry);
    if (!pricing.hasInPerson && formData.custom_preferred_mode === 'In-Person') {
      setFormData(prev => ({ ...prev, custom_preferred_mode: 'Online' }));
    }
    // Dependency array needs formData.custom_preferred_mode now
  }, [selectedCountry, formData.custom_preferred_mode]);

  // Verify promo code when it changes
  useEffect(() => {
    const verifyCode = async () => {
      if (!formData.custom_promo_code || formData.custom_promo_code.trim() === '') {
        setIsPromoCodeValid(null);
        return;
      }
      
      setIsVerifyingPromoCode(true);
      try {
        const isValid = await verifyPromoCode(formData.custom_promo_code);
        setIsPromoCodeValid(isValid);
      } catch (error) {
        console.error('Error verifying promo code:', error);
        setIsPromoCodeValid(false);
      } finally {
        setIsVerifyingPromoCode(false);
      }
    };
    
    // Add a debounce to avoid too many API calls while typing
    const timeoutId = setTimeout(() => {
      verifyCode();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [formData.custom_promo_code]);

  // Calculate price when relevant form fields change
  useEffect(() => {
    if (
      selectedCountry && 
      formData.custom_preferred_mode && 
      formData.custom_preferred_type
    ) {
      const result = calculateFinalPrice(
        selectedCountry === 'default' ? 'US' : selectedCountry,
        formData.custom_preferred_mode,
        formData.custom_preferred_type,
        formData.custom_registering_with_a_family_member,
        formData.custom_promo_code,
        isPromoCodeValid === true // Only pass true if promo code is verified
      );
      
      setCalculatedPrice(result);
    } else {
      setCalculatedPrice(null);
    }
  }, [
    selectedCountry, 
    formData.custom_preferred_mode, 
    formData.custom_preferred_type, 
    formData.custom_registering_with_a_family_member,
    formData.custom_promo_code,
    isPromoCodeValid
  ]);

  // Show toast when submission is successful or has an error
  useEffect(() => {
    if (success && leadId) {
      // Prepare lead data for navigation
      const leadData: LeadData = {
        lead_name: `${formData.firstName} ${formData.lastName}`,
        company_name: "Individual",
        first_name: formData.firstName,
        last_name: formData.lastName,
        email_id: formData.email,
        mobile_no: formData.phone,
        course_interest: 'Digital Safety & AI Awareness',
        preferred_language: formData.language,
        preferred_time_zone: formData.timeZone as 'United Kingdom' | 'India' | 'European Union' | 'Sri Lanka' | 'Canada' | undefined,
        age: formData.age,
        special_requirements: formData.specialRequirements,
        referral_source: formData.referralSource,
        custom_preferred_mode: formData.custom_preferred_mode || undefined,
        custom_preferred_type: formData.custom_preferred_type || undefined,
        custom_payment_method: formData.custom_payment_method || undefined,
        custom_registering_with_a_family_member: formData.custom_registering_with_a_family_member ? 1 : 0,
        custom_family_member_name: formData.custom_registering_with_a_family_member ? formData.custom_family_member_name : undefined,
        custom_promo_code: formData.custom_promo_code || undefined,
        custom_amount: calculatedPrice?.amount,
        custom_currency: calculatedPrice?.currency as 'LKR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'INR' | undefined,
        custom_address: formData.custom_address,
        custom_city: formData.custom_city,
        custom_country: formData.custom_country
      };
      
      // Show success message
      toast({
        title: "Registration Successful",
        description: "Please review your information before proceeding to payment.",
        variant: "default",
      });
      
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        language: '',
        timeZone: '',
        referralSource: '',
        specialRequirements: '',
        agreedToTerms: false,
        custom_preferred_mode: '',
        custom_preferred_type: '',
        custom_payment_method: '',
        custom_registering_with_a_family_member: false,
        custom_family_member_name: '',
        custom_promo_code: '',
        custom_address: '',
        custom_city: '',
        custom_country: selectedCountry || 'default'
      });
      
      // Navigate to the payment review page with lead data
      navigate('/payment-review', {
        state: {
          leadData,
          leadId
        }
      });
    }
    
    if (submissionError) {
      toast({
        title: "Registration Failed",
        description: submissionError || "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    }
  }, [success, submissionError, leadId, toast, formData, calculatedPrice, navigate]);

  // Check for retry parameter in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const retryLeadId = queryParams.get('retry');
    
    if (retryLeadId) {
      toast({
        title: "Previous Registration Found",
        description: "Please review your information and try a different payment method if needed.",
        variant: "default",
      });
    }
  }, [location, toast]);

  // Original animation code
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

  // Handler for country change
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (name === 'custom_registering_with_a_family_member') { // Handle the boolean checkbox specifically
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast({
        title: "Terms and Conditions",
        description: "You must agree to the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if custom_preferred_mode is selected
    if (!formData.custom_preferred_mode) {
      toast({
        title: "Course Mode Required",
        description: "Please select either Online or In-Person course mode.",
        variant: "destructive",
      });
      return;
    }

    // Check if custom_preferred_type is selected
    if (!formData.custom_preferred_type) {
      toast({
        title: "Course Speed Required",
        description: "Please select your preferred course speed (e.g., Weekdays Intensive).",
        variant: "destructive",
      });
      return;
    }
    
    // Check if custom_payment_method is selected
    if (!formData.custom_payment_method) {
      toast({
        title: "Payment Method Required",
        description: "Please select your preferred payment method.",
        variant: "destructive",
      });
      return;
    }
    
    // Prepare lead data based on form inputs - using new fields
    const leadData: LeadData = {
      lead_name: `${formData.firstName} ${formData.lastName}`,
      company_name: "Individual",
      first_name: formData.firstName,
      last_name: formData.lastName,
      email_id: formData.email,
      mobile_no: formData.phone,
      course_interest: 'Digital Safety & AI Awareness',
      preferred_language: formData.language,
      preferred_time_zone: formData.timeZone as 'United Kingdom' | 'India' | 'European Union' | 'Sri Lanka' | 'Canada' | undefined,
      age: formData.age,
      special_requirements: formData.specialRequirements,
      referral_source: formData.referralSource,
      custom_preferred_mode: formData.custom_preferred_mode || undefined,
      custom_preferred_type: formData.custom_preferred_type || undefined,
      custom_payment_method: formData.custom_payment_method || undefined,
      custom_registering_with_a_family_member: formData.custom_registering_with_a_family_member ? 1 : 0,
      custom_family_member_name: formData.custom_registering_with_a_family_member ? formData.custom_family_member_name : undefined,
      custom_promo_code: formData.custom_promo_code || undefined,
      custom_amount: calculatedPrice?.amount,
      custom_currency: calculatedPrice?.currency as 'LKR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'INR' | undefined,
      custom_address: formData.custom_address,
      custom_city: formData.custom_city,
      custom_country: formData.custom_country
    };
    
    // Submit the lead registration using the hook
    await submitRegistration(leadData);
  };

  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      <main className="pt-9">
        {/* Hero Banner */}
        <div className="bg-institutional-dark text-white py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 scroll-animate">Register for Our Digital Safety Course</h1>
              <p className="text-xl mb-8 scroll-animate" style={{ transitionDelay: '100ms' }}>
                Learning that fits your schedule and preferences
              </p>
              <p className="text-lg mb-8 scroll-animate" style={{ transitionDelay: '200ms' }}>
                Select your preferred course format, language, and dates below. 
                Our team will confirm your registration within 24 hours.
              </p>
            </div>
          </div>
        </div>
        
        {/* Course Options Section */}
        <ContentSection 
          id="course-options" 
          title="Available Course Sessions" 
          subtitle="Choose the format that works best for you"
          titleAlignment="center"
          background="white"
        >
          {/* Add Location & Currency option as a small tab */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
              <div className="mb-3 md:mb-0">
                <h3 className="text-sm font-medium text-blue-800">Your Location & Currency</h3>
                <p className="text-xs text-blue-600">
                  {locationLoading ? 
                    'Detecting your location...' : 
                    locationError ? 
                    'Please select your country' : 
                    `Prices shown in ${pricingInfo.currencySymbol} based on your location`}
                </p>
              </div>
              <CountrySelector 
                selectedCountry={selectedCountry} 
                onChange={handleCountryChange}
                compact={true}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingInfo.hasInPerson && (
              <div 
                className={`glass-card p-8 rounded-lg shadow-elegant scroll-animate relative overflow-hidden ${formData.custom_preferred_mode === 'In-Person' ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, custom_preferred_mode: 'In-Person' }))}
              >
                {formData.custom_preferred_mode === 'In-Person' && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="text-white w-4 h-4" />
                  </div>
                )}
                
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold">In-Person Format</h3>
                </div>
                
                <p className="text-blue-600 font-medium mb-6">Within 5km from your home</p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CalendarDays className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Schedule</p>
                      <p className="text-gray-600">Saturdays/Sundays, 9:00 AM - 1:00 PM</p>
                      <p className="text-gray-600 text-sm">(3 sessions, 12 hours total)</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Users className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Group Size</p>
                      <p className="text-gray-600">Maximum 15 participants</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CreditCard className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Price</p>
                      {calculatedPrice && formData.custom_preferred_mode === 'In-Person' ? (
                        <div>
                          <p className="text-gray-600">
                            <span className="line-through">{pricingInfo.currencySymbol} {pricingInfo.inPersonNormalPrice}</span>{' '}
                            <span className="font-semibold">{calculatedPrice.formattedPrice}</span> per participant
                          </p>
                          {formData.custom_registering_with_a_family_member && (
                            <p className="text-green-600 text-sm">Family discount applied</p>
                          )}
                          {calculatedPrice.discounts.promoCode && (
                            <p className="text-green-600 text-sm">Promo code discount applied</p>
                          )}
                        </div>
                      ) : pricingInfo.hasInPerson ? (
                        <p className="text-gray-600">
                          <span className="line-through">{pricingInfo.currencySymbol} {pricingInfo.inPersonNormalPrice}</span>{' '}
                          <span className="font-semibold">{pricingInfo.currencySymbol} {pricingInfo.inPersonDiscountedPrice}</span> per participant
                        </p>
                      ) : (
                        <p className="text-gray-600">Not available in your region</p>
                      )}
                    </div>
                  </li>
                </ul>
                
                <div className="space-y-2">
                  <p className="font-medium">Upcoming Sessions:</p>
                  <div className="border border-gray-200 rounded-md p-3">
                    <p>April 20, 27, May 4, 2025</p>
                    <p className="text-blue-600 font-medium">12 spots remaining</p>
                  </div>
                  <div className="border border-gray-200 rounded-md p-3">
                    <p>May 11, 18, 25, 2025</p>
                    <p className="text-blue-600 font-medium">15 spots remaining</p>
                  </div>
                </div>
              </div>
            )}
            
            <div 
              className={`glass-card p-8 rounded-lg shadow-elegant scroll-animate relative overflow-hidden ${formData.custom_preferred_mode === 'Online' ? 'ring-2 ring-indigo-500' : ''} ${!pricingInfo.hasInPerson ? 'md:col-span-2 mx-auto max-w-xl' : ''}`}
              style={{ transitionDelay: '200ms' }}
              onClick={() => setFormData(prev => ({ ...prev, custom_preferred_mode: 'Online' }))}
            >
              {formData.custom_preferred_mode === 'Online' && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Check className="text-white w-4 h-4" />
                </div>
              )}
              
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <svg
                    className="h-6 w-6 text-indigo-600"
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
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold">Online Format</h3>
              </div>
              
              <p className="text-indigo-600 font-medium mb-6">Live Video Conferencing</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CalendarDays className="text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Schedule</p>
                    <p className="text-gray-600">Weekdays, 6:00 PM - 8:00 PM</p>
                    <p className="text-gray-600 text-sm">(5 sessions, 10 hours total)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Group Size</p>
                    <p className="text-gray-600">Maximum 20 participants</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CreditCard className="text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Price</p>
                    {calculatedPrice && formData.custom_preferred_mode === 'Online' ? (
                      <div>
                        <p className="text-gray-600">
                          <span className="line-through">{pricingInfo.currencySymbol} {pricingInfo.normalPrice}</span>{' '}
                          <span className="font-semibold">{calculatedPrice.formattedPrice}</span> per participant
                        </p>
                        {formData.custom_registering_with_a_family_member && (
                          <p className="text-green-600 text-sm">Family discount applied</p>
                        )}
                        {calculatedPrice.discounts.promoCode && (
                          <p className="text-green-600 text-sm">Promo code discount applied</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        <span className="line-through">{pricingInfo.currencySymbol} {pricingInfo.normalPrice}</span>{' '}
                        <span className="font-semibold">{pricingInfo.currencySymbol} {pricingInfo.discountedPrice}</span> per participant
                      </p>
                    )}
                  </div>
                </li>
              </ul>
              
              <div className="space-y-2">
                <p className="font-medium">Upcoming Sessions:</p>
                <div className="border border-gray-200 rounded-md p-3">
                  <p>April 20-24, 2025</p>
                  <p className="text-indigo-600 font-medium">15 spots remaining</p>
                </div>
                <div className="border border-gray-200 rounded-md p-3">
                  <p>April 27-May 1, 2025</p>
                  <p className="text-indigo-600 font-medium">18 spots remaining</p>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>
        
        {/* Registration Form Section */}
        <ContentSection 
          id="registration-form" 
          title="Your Information" 
          subtitle="Please complete all fields to register for the course"
          titleAlignment="left"
          imageAlt="Registration form"
          imageCaption="Complete your registration to secure your spot in our upcoming course."
        >
          <div className="max-w-3xl">
            <div className="glass-card p-8 rounded-lg shadow-elegant scroll-animate">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      className="w-full"
                      required
                    />
                    <Input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      className="w-full"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <Input 
                      type="number" 
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Your age"
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                    <select 
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      required
                    >
                      <option value="">Select a language</option>
                      <option value="English">English</option>
                      <option value="Sinhala">Sinhala</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <Input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <Input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+94 7X XXX XXXX"
                      className="w-full"
                      required
                    />
                  </div>
                </div>
                
                {formData.custom_preferred_mode === 'Online' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                    <select 
                      name="timeZone"
                      value={formData.timeZone}
                      onChange={handleInputChange}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      required
                    >
                      <option value="">Select a time zone</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="India">India</option>
                      <option value="European Union">European Union</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Speed</label>
                  <select 
                    name="custom_preferred_type"
                    value={formData.custom_preferred_type}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="">Select your preferred course speed</option>
                    <option value="Weekdays Intensive">Weekdays Intensive</option>
                    <option value="Weekend Intensive">Weekend Intensive</option>
                    <option value="Weekdays Extensive">Weekdays Extensive</option>
                    <option value="Weekend Extensive">Weekend Extensive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select 
                    name="custom_payment_method"
                    value={formData.custom_payment_method}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="">Select payment method</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    {selectedCountry === 'LK' ? (
                      <option value="CC/DC - Payhere">Credit/Debit Card (Payhere)</option>
                    ) : (
                      <option value="CC/DC - Stripe">Credit/Debit Card (Stripe)</option>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                  <select 
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="">Please select</option>
                    <option value="friend">Friend/Family</option>
                    <option value="social">Social Media</option>
                    <option value="newspaper">Newspaper</option>
                    <option value="radio">Radio</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Needs</label>
                  <textarea 
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    placeholder="Please let us know if you have any accessibility requirements or other special needs"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                    rows={3}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Input 
                    type="text" 
                    name="custom_address"
                    value={formData.custom_address}
                    onChange={handleInputChange}
                    placeholder="Your address"
                    className="w-full"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <Input 
                      type="text" 
                      name="custom_city"
                      value={formData.custom_city}
                      onChange={handleInputChange}
                      placeholder="Your city"
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <Input 
                      type="text" 
                      name="custom_country"
                      value={formData.custom_country}
                      onChange={handleInputChange}
                      placeholder="Your country"
                      className="w-full"
                      required
                    />
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg mb-4">
                  <label className="flex items-start">
                    <input 
                      type="checkbox" 
                      checked={formData.custom_registering_with_a_family_member} 
                      onChange={() => setFormData(prev => ({ ...prev, custom_registering_with_a_family_member: !prev.custom_registering_with_a_family_member }))}
                      className="mt-1 mr-3" 
                    />
                    <div>
                      <p className="font-medium">I'm registering with a family member (10% discount)</p>
                      <p className="text-gray-600 text-sm">Many participants find it helpful to attend with a spouse, child, or friend.</p>
                    </div>
                  </label>
                  
                  {formData.custom_registering_with_a_family_member && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Companion Name</label>
                      <Input 
                        type="text" 
                        name="custom_family_member_name"
                        value={formData.custom_family_member_name}
                        onChange={handleInputChange}
                        placeholder="Full name of your companion"
                        className="w-full"
                        required={formData.custom_registering_with_a_family_member}
                      />
                    </div>
                  )}
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <label className="flex items-start">
                    <input 
                      type="checkbox" 
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleInputChange}
                      className="mt-1 mr-3" 
                      required 
                    />
                    <div>
                      <p>I agree to the <a href="/privacy-policy-terms" className="text-blue-600 hover:underline">terms and conditions</a></p>
                      <p className="text-gray-500 text-sm">By checking this box, you agree to our Privacy Policy and Terms of Service.</p>
                    </div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code (Optional)</label>
                  <div className="relative">
                    <Input 
                      type="text" 
                      name="custom_promo_code"
                      value={formData.custom_promo_code}
                      onChange={handleInputChange}
                      placeholder="Enter promo code if you have one"
                      className={`w-full ${isPromoCodeValid === true ? 'border-green-500' : isPromoCodeValid === false ? 'border-red-500' : ''}`}
                    />
                    {isVerifyingPromoCode && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      </div>
                    )}
                    {!isVerifyingPromoCode && isPromoCodeValid === true && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                    {!isVerifyingPromoCode && isPromoCodeValid === false && formData.custom_promo_code && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-red-500 text-xs">Invalid code</span>
                      </div>
                    )}
                  </div>
                  {isPromoCodeValid && (
                    <p className="text-green-600 text-xs mt-1">15% discount will be applied!</p>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 flex justify-center items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Complete Registration'}
                </button>
              </form>
            </div>
          </div>
        </ContentSection>
        
        {/* Payment Information - Temporarily remove complex content */}
        <ContentSection 
          id="payment-info" 
          title="Payment Information" 
          subtitle="Details will be provided after registration"
          titleAlignment="left"
          background="white"
        >
          <div className="max-w-3xl scroll-animate">
             <p className="text-gray-600 mb-4">
               After submitting your registration, you will receive an email with detailed payment instructions based on your selected method ({formData.custom_payment_method || 'Not Selected'}). 
             </p>
             
             {/* Add price summary */}
             {calculatedPrice && (
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                 <h3 className="text-lg font-semibold mb-2">Price Summary</h3>
                 <div className="space-y-2">
                   <div className="flex justify-between">
                     <span>Base price ({formData.custom_preferred_mode} - {formData.custom_preferred_type}):</span>
                     <span>{calculatedPrice.formattedPrice}</span>
                   </div>
                   
                   {calculatedPrice.discounts.family && (
                     <div className="flex justify-between text-green-600">
                       <span>Family discount (10%):</span>
                       <span>Applied</span>
                     </div>
                   )}
                   
                   {calculatedPrice.discounts.promoCode && (
                     <div className="flex justify-between text-green-600">
                       <span>Promo code discount (15%):</span>
                       <span>Applied</span>
                     </div>
                   )}
                   
                   <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                     <span>Total:</span>
                     <span>{calculatedPrice.formattedPrice}</span>
                   </div>
                 </div>
               </div>
             )}
             
             <p className="text-gray-600">
               For Credit/Debit Card payments, you will receive a secure payment link. For Bank Transfers, account details will be provided. 
               Please ensure you complete the payment to confirm your spot.
             </p>
             {/* Keep Payment Policies? Or simplify? */}
             <div className="mt-8">
               <h3 className="text-xl font-semibold mb-4">Payment Policies Summary</h3>
               <ul className="list-disc list-inside text-gray-600 space-y-2">
                 <li>Full payment or a 50% deposit may be required to confirm your spot (details in confirmation email).</li>
                 <li>A 10% discount is available when registering with a family member (applied during payment).</li>
                 <li>Cancellation Policy: Full refund (minus processing fees) if 7+ days before start; 50% refund 3-7 days before; No refund &lt; 3 days before.</li>
               </ul>
             </div>
          </div>
        </ContentSection>
        
        {/* What Happens Next */}
        <ContentSection 
          id="next-steps" 
          title="What Happens Next" 
          subtitle="Your journey with Ravana Institute of Future"
          titleAlignment="center"
          background="white"
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: "Submit Registration",
                  description: "Complete the form above with your details and course preferences"
                },
                {
                  step: 2,
                  title: "Receive Confirmation",
                  description: "Get a confirmation email within 24 hours with payment instructions"
                },
                {
                  step: 3,
                  title: "Preparation Materials",
                  description: "Receive preparation materials 3 days before your first class"
                },
                {
                  step: 4,
                  title: "Join Your First Session",
                  description: "Start your journey to digital safety with confidence"
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className="scroll-animate"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                      <span className="text-purple-700 font-bold">{step.step}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                    
                    {index < 3 && (
                      <div className="hidden md:block w-24 h-0.5 bg-purple-200 absolute right-[-3rem] top-6"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ContentSection>
        
        {/* Registration Support */}
        <ContentSection 
          id="registration-support" 
          title="Need Help Registering?" 
          subtitle="Our team is ready to assist you with the registration process"
          titleAlignment="center"
          background="white"
        >
          <div className="max-w-3xl mx-auto text-center scroll-animate">
            <p className="text-gray-600 mb-8">
              If you have questions or need assistance completing your registration, 
              our team is available to help through multiple channels.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {[
                {
                  icon: <Phone size={24} />,
                  title: "Phone Assistance",
                  description: "+94 11 258 1181",
                },
                {
                  icon: <Mail size={24} />,
                  title: "Email Help",
                  description: "info@riftuni.com",
                },
                {
                  icon: <MessageSquare size={24} />,
                  title: "Live Chat",
                  description: "Available weekdays 9:00 AM - 5:00 PM",
                }
              ].map((support, index) => (
                <div 
                  key={index}
                  className="glass-card p-6 rounded-lg flex flex-col items-center"
                >
                  <div className="bg-purple-100 p-3 rounded-full mb-4">
                    <div className="text-purple-600">{support.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{support.title}</h3>
                  <p className="text-gray-600">{support.description}</p>
                </div>
              ))}
            </div>
            
            <p className="text-gray-500">
              You can also visit our Colombo location for in-person assistance with your registration.
            </p>
          </div>
        </ContentSection>
      </main>
      
      <Footer />
    </div>
  );
};

export default Registration;

function MessageSquare(props) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function Smartphone(props) {
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
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}