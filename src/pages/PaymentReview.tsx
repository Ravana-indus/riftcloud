import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContentSection from '@/components/ui/ContentSection';
import { Check, ArrowRight, AlertCircle, CreditCard, Building, ShieldCheck, Bug } from 'lucide-react';
import { LeadData } from '@/services/api';
import { usePaymentProcess } from '@/hooks/usePaymentProcess';
import { useToast } from '@/hooks/use-toast';
import { PAYHERE_SANDBOX_URL, PAYHERE_ACTIVE_URL } from '@/services/paymentService';

// Add a preload hint for the PayHere SDK
const preloadPayHereSDK = () => {
  try {
    console.log('Preloading PayHere SDK...');
    
    // Add preload link
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = 'https://www.payhere.lk/lib/payhere.js';
    document.head.appendChild(link);
    
    // Also add the script tag to start loading it immediately
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('PayHere SDK preloaded successfully');
    };
    
    script.onerror = (error) => {
      console.error('Failed to preload PayHere SDK:', error);
      // Non-blocking, so we don't need to throw or reject here
    };
    
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error preloading PayHere SDK:', error);
    // Non-blocking, so we don't need to throw or reject here
  }
};

const PaymentReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registrationData, setRegistrationData] = useState<LeadData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentAttempted, setPaymentAttempted] = useState(false);
  const [salesOrderId, setSalesOrderId] = useState<string | null>(null);
  const [paymentErrorDetails, setPaymentErrorDetails] = useState<string | null>(null);
  
  const {
    processPayherePayment,
    isProcessing,
    error
  } = usePaymentProcess();
  
  // Preload the PayHere SDK when the component mounts
  useEffect(() => {
    preloadPayHereSDK();
  }, []);
  
  useEffect(() => {
    // Check for lead ID and sales order ID in URL query params
    const queryParams = new URLSearchParams(location.search);
    const leadIdFromQuery = queryParams.get('lead');
    const salesOrder = queryParams.get('sales_order');
    
    // If we have a sales order ID, store it
    if (salesOrder) {
      setSalesOrderId(salesOrder);
      console.log('Retrying payment with existing sales order:', salesOrder);
    }
    
    // Get registration data from state or API
    if (location.state?.leadData && location.state?.leadId) {
      setRegistrationData(location.state.leadData);
      setIsLoading(false);
    } else if (leadIdFromQuery) {
      // TODO: Fetch lead data from API using leadIdFromQuery
      // For now, we just redirect to registration
      toast({
        title: "Information Missing",
        description: "Registration information is missing. Please fill out the registration form again.",
        variant: "destructive",
      });
      navigate('/registration');
    } else {
      // If no data in state or query, redirect back to registration
      toast({
        title: "Information Missing",
        description: "Registration information is missing. Please fill out the registration form.",
        variant: "destructive",
      });
      navigate('/registration');
    }
  }, [location, navigate, toast]);
  
  useEffect(() => {
    // Show error if payment processing fails
    if (error) {
      setPaymentErrorDetails(error);
      toast({
        title: "Payment Processing Failed",
        description: "There was an error processing your payment. You can try again or use bank transfer.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const handleProceedToPayment = async () => {
    if (!registrationData || !location.state?.leadId) {
      toast({
        title: "Missing Information",
        description: "Registration information is missing. Please return to the registration form.",
        variant: "destructive",
      });
      return;
    }
    
    setPaymentAttempted(true);
    setPaymentErrorDetails(null);
    
    if (registrationData.custom_payment_method === 'CC/DC - Payhere') {
      try {
        // Show loading state
        setIsLoading(true);
        
        // Process payment via Payhere
        await processPayherePayment(registrationData, location.state.leadId);
        
        // The user will be redirected to Payhere, so no need to update UI here
      } catch (err) {
        console.error('Payment initiation error:', err);
        
        // Set detailed error message for debugging
        if (err instanceof Error) {
          setPaymentErrorDetails(err.message);
        } else {
          setPaymentErrorDetails('Unknown payment error');
        }
        
        setIsLoading(false);
        
        toast({
          title: "Payment Gateway Error",
          description: "We're experiencing technical issues with our payment gateway. Please try again later or use bank transfer instead.",
          variant: "destructive",
        });
        
        // Don't navigate away so user can choose another option
      }
    } else {
      // For bank transfer or other methods, go directly to thank you page
      navigate(`/thank-you?lead=${location.state.leadId}${salesOrderId ? `&sales_order=${salesOrderId}` : ''}`);
    }
  };
  
  const formatPrice = (amount: number, currency: string): string => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
    });
    
    return formatter.format(amount);
  };
  
  const renderPaymentMethodInfo = () => {
    const paymentMethod = registrationData?.custom_payment_method;
    
    if (paymentMethod === 'CC/DC - Payhere') {
      return (
        <div className="flex items-start mb-4">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Credit/Debit Card via Payhere</h4>
            <p className="text-gray-600 text-sm">
              You will be redirected to Payhere's secure payment gateway to complete your payment.
              After payment, you'll be returned to our site.
            </p>
            <p className="text-gray-600 text-sm mt-1">
              <ShieldCheck className="h-4 w-4 inline mr-1 text-green-600" />
              Secured by PayHere JavaScript SDK for enhanced security and user experience.
            </p>
            {salesOrderId && (
              <p className="text-green-600 text-sm mt-2">
                <Check className="h-4 w-4 inline mr-1" />
                Sales order already created (ID: {salesOrderId})
              </p>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-start mb-4">
        <div className="bg-gray-100 p-2 rounded-full mr-3">
          <Building className="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Bank Transfer</h4>
          <p className="text-gray-600 text-sm">
            After submission, you'll receive bank details to complete your payment.
            Your spot will be secured once payment is confirmed.
          </p>
        </div>
      </div>
    );
  };
  
  // Add this function to render payment error details
  const renderPaymentError = () => {
    if (!paymentErrorDetails) return null;
    
    return (
      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <div>
            <h4 className="font-semibold text-red-700">Payment Processing Error</h4>
            <p className="text-sm text-red-600 mt-1">
              We encountered an issue while setting up your payment:
            </p>
            <div className="mt-2 p-2 bg-red-100 rounded text-xs font-mono text-red-800 overflow-auto max-h-24">
              {paymentErrorDetails}
            </div>
            <p className="text-sm mt-2">
              This is likely a temporary issue. You can try again or use bank transfer as an alternative payment method.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      <main className="pt-9">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Review Your Registration
              </h1>
              <p className="text-xl mb-0">
                Please verify your information before proceeding to payment
              </p>
              
              {/* Development & Sandbox indicator */}
              <div className="mt-4 flex items-center justify-center space-x-2">
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-yellow-600 text-white text-sm py-1 px-3 rounded-full inline-flex items-center">
                    <Bug className="h-3 w-3 mr-1" />
                    Development Mode
                  </div>
                )}
                <div className="bg-purple-600 text-white text-sm py-1 px-3 rounded-full inline-flex items-center">
                  <CreditCard className="h-3 w-3 mr-1" />
                  Sandbox Payment
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Review Section */}
        <ContentSection
          id="registration-review"
          title="Registration Details"
          subtitle="Please review the following information"
          titleAlignment="center"
          background="white"
        >
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-800 font-medium">{registrationData?.lead_name}</p>
                    
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">{registrationData?.email_id}</p>
                    
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800 font-medium">{registrationData?.mobile_no}</p>
                    
                    <p className="text-sm text-gray-500">Age Group</p>
                    <p className="text-gray-800 font-medium">{registrationData?.age}</p>
                    
                    <p className="text-sm text-gray-500">Time Zone</p>
                    <p className="text-gray-800 font-medium">{registrationData?.preferred_time_zone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Course Preferences</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Course Type</p>
                    <p className="text-gray-800 font-medium">{registrationData?.custom_preferred_type}</p>
                    
                    <p className="text-sm text-gray-500">Course Mode</p>
                    <p className="text-gray-800 font-medium">{registrationData?.custom_preferred_mode}</p>
                    
                    <p className="text-sm text-gray-500">Preferred Language</p>
                    <p className="text-gray-800 font-medium">{registrationData?.preferred_language}</p>
                    
                    {registrationData?.custom_registering_with_a_family_member && (
                      <>
                        <p className="text-sm text-gray-500">Family Member</p>
                        <p className="text-gray-800 font-medium">{registrationData.custom_family_member_name}</p>
                      </>
                    )}
                    
                    {registrationData?.special_requirements && (
                      <>
                        <p className="text-sm text-gray-500">Special Requirements</p>
                        <p className="text-gray-800 font-medium">{registrationData.special_requirements}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 border-b border-blue-100 pb-2">Payment Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">Course Fee</p>
                  <p className="text-gray-800 font-medium">
                    {registrationData?.custom_amount && registrationData?.custom_currency
                      ? formatPrice(registrationData.custom_amount, registrationData.custom_currency)
                      : 'N/A'}
                  </p>
                </div>
                
                {registrationData?.custom_registering_with_a_family_member === 1 && (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">Family Discount</p>
                    <p className="text-green-600 font-medium">Applied</p>
                  </div>
                )}
                
                {registrationData?.custom_promo_code && (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">Promo Code</p>
                    <p className="text-green-600 font-medium">{registrationData.custom_promo_code}</p>
                  </div>
                )}
                
                <div className="border-t border-blue-100 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-800 font-semibold">Total Amount</p>
                    <p className="text-blue-800 font-bold text-xl">
                      {registrationData?.custom_amount && registrationData?.custom_currency
                        ? formatPrice(registrationData.custom_amount, registrationData.custom_currency)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Payment Error Display */}
              {paymentErrorDetails && renderPaymentError()}
              
              <div className="border-t border-blue-100 pt-4 mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Payment Method</h4>
                {renderPaymentMethodInfo()}
                
                {/* Sandbox testing instructions */}
                <div className="mt-4 bg-purple-50 border border-purple-100 p-4 rounded-md">
                  <h5 className="font-semibold text-purple-800 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Sandbox Testing Cards
                  </h5>
                  <p className="text-sm mt-1 text-gray-700">
                    This is a test environment. Use these cards to test different payment scenarios:
                  </p>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="bg-white p-2 rounded border border-purple-100">
                      <p className="font-medium text-green-700">Successful Payment:</p>
                      <ul className="mt-1 space-y-1 text-gray-700">
                        <li>Card: 4916 0000 0000 0000</li>
                        <li>Expiry: Any future date</li>
                        <li>CVV: Any 3 digits</li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border border-purple-100">
                      <p className="font-medium text-red-700">Failed Payment:</p>
                      <ul className="mt-1 space-y-1 text-gray-700">
                        <li>Card: 4916 0000 0000 0004</li>
                        <li>Expiry: Any future date</li>
                        <li>CVV: Any 3 digits</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start mt-4 bg-blue-100 p-3 rounded-md">
                <ShieldCheck className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Your personal and payment information is secure. We use industry-standard encryption to protect your data.
                </p>
              </div>
              
              {/* Add troubleshooting info */}
              {registrationData?.custom_payment_method === 'CC/DC - Payhere' && (
                <div className="mt-4 border-t border-blue-100 pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Payment Issues?</h4>
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      If you encounter any issues with the payment gateway:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Ensure your browser is not blocking popups</li>
                      <li>Try using a different browser</li>
                      <li>You can also complete your payment via bank transfer</li>
                    </ul>
                    <p className="mt-2">
                      Your registration information is saved, and our team can assist you if needed.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mt-6">
              <Link 
                to="/registration" 
                className="text-blue-600 border border-blue-300 bg-white hover:bg-blue-50 font-medium py-3 px-6 rounded-md transition duration-300 w-full md:w-auto text-center"
              >
                Edit Registration
              </Link>
              
              {/* Payment action buttons */}
              <div className="mt-6 flex flex-col space-y-4">
                <button
                  onClick={handleProceedToPayment}
                  disabled={isProcessing || isLoading}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
                
                <Link
                  to="/"
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </ContentSection>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentReview; 