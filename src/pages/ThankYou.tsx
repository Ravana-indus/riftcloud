import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContentSection from '@/components/ui/ContentSection';
import { Check, ArrowRight, Calendar, Mail, Phone, CreditCard, AlertCircle, Building } from 'lucide-react';
import { usePaymentProcess } from '@/hooks/usePaymentProcess';
import { API_BASE_URL } from '@/utils/apiConfig';

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [leadId, setLeadId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [salesOrderId, setSalesOrderId] = useState<string | null>(null);
  const [isCreatingMockPayment, setIsCreatingMockPayment] = useState(false);
  const { processPaymentReturn } = usePaymentProcess();
  
  // Extract lead ID, payment status, and sales order ID from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const lead = queryParams.get('lead');
    const payment = queryParams.get('payment');
    const salesOrder = queryParams.get('sales_order');
    
    if (lead) {
      setLeadId(lead);
    }
    
    if (payment) {
      setPaymentStatus(payment);
    }
    
    if (salesOrder) {
      setSalesOrderId(salesOrder);
      console.log('Sales Order ID:', salesOrder);
    }
    
    // In development mode, create a payment entry for successful/cancelled payments
    if (process.env.NODE_ENV === 'development' && payment && salesOrder) {
      createPaymentEntryForReturn(lead, salesOrder, payment);
    }
  }, [location]);
  
  // Function to create payment entries when returning from payment gateway
  const createPaymentEntryForReturn = async (leadId: string | null, salesOrderId: string, paymentStatus: string) => {
    if (!leadId || !salesOrderId) return;
    
    try {
      setIsCreatingMockPayment(true);
      
      // Get amount and currency from URL parameters
      const queryParams = new URLSearchParams(location.search);
      const amount = parseFloat(queryParams.get('amount') || '0');
      const currency = queryParams.get('currency') || 'LKR';
      
      // Use the direct payment entry creation method
      await processPaymentReturn(
        leadId,
        salesOrderId,
        paymentStatus === 'success' ? 'success' : 'cancelled',
        'Individual', // Using default customer
        amount, // Use actual amount from URL
        currency // Use actual currency from URL
      );
      
      console.log(`Payment entry created for ${paymentStatus} payment`);
    } catch (error) {
      console.error('Error creating payment entry:', error);
    } finally {
      setIsCreatingMockPayment(false);
    }
  };
  
  // Animation code for page elements
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
        threshold: 0.1 // Trigger when at least 10% of element is visible
      }
    );

    // Observe all elements with the .scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach((elem) => {
      observer.observe(elem);
    });

    // Clean up observer on unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      <main className="pt-9">
        {/* Hero Banner */}
        <div className={`bg-gradient-to-r ${paymentStatus === 'success' ? 'from-green-700 to-green-900' : paymentStatus === 'cancelled' ? 'from-yellow-700 to-yellow-900' : 'from-blue-700 to-blue-900'} text-white py-24`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                {paymentStatus === 'success' ? (
                  <div className="bg-green-500 rounded-full p-3">
                    <Check className="h-12 w-12 text-white" />
                  </div>
                ) : paymentStatus === 'cancelled' ? (
                  <div className="bg-yellow-500 rounded-full p-3">
                    <AlertCircle className="h-12 w-12 text-white" />
                  </div>
                ) : (
                  <div className="bg-green-500 rounded-full p-3">
                    <Check className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 scroll-animate">
                {paymentStatus === 'success' 
                  ? 'Payment Successful!' 
                  : paymentStatus === 'cancelled' 
                  ? 'Payment Cancelled' 
                  : 'Registration Successful!'}
              </h1>
              <p className="text-xl mb-4 scroll-animate" style={{ transitionDelay: '100ms' }}>
                {paymentStatus === 'success' 
                  ? 'Thank you for your payment. Your registration is now complete.' 
                  : paymentStatus === 'cancelled' 
                  ? 'Your payment was cancelled. You can try again or choose another payment method.' 
                  : 'Thank you for registering for our Digital Safety Course'}
              </p>
              <p className="text-xl mb-4 scroll-animate" style={{ transitionDelay: '100ms' }}></p>
              <p className="text-lg mb-8 scroll-animate" style={{ transitionDelay: '200ms' }}>
                {leadId ? `Your registration ID is: ${leadId}` : 'Your registration has been received'}
              </p>
              {salesOrderId && (
                <p className="text-lg mb-8 scroll-animate" style={{ transitionDelay: '300ms' }}>
                  Sales Order: {salesOrderId}
                </p>
              )}
              {!paymentStatus && (
                <p className="text-lg mb-8 scroll-animate" style={{ transitionDelay: '300ms' }}>
                  Please make bank transfer using the information below
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Payment Status Section - Only shown when payment was attempted */}
        {paymentStatus && (
          <ContentSection 
            id="payment-status" 
            title="Payment Information" 
            subtitle="Details about your payment and order"
            titleAlignment="center"
            background="gray-50"
          >
            <div className="max-w-4xl mx-auto">
              {isCreatingMockPayment ? (
                <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-200 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-700">Creating payment record...</p>
                    <p className="text-sm text-gray-500 mt-2">This will only take a moment</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-200 scroll-animate">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Status</h3>
                    <div className="flex items-center">
                      {paymentStatus === 'success' ? (
                        <>
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <Check className="h-5 w-5 text-green-600" />
                          </div>
                          <span className="text-green-700">Payment Completed Successfully</span>
                        </>
                      ) : (
                        <>
                          <div className="bg-yellow-100 p-2 rounded-full mr-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                          </div>
                          <span className="text-yellow-700">Payment Not Completed</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {paymentStatus === 'success' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Date</h4>
                          <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h4>
                          <p className="text-gray-900">Online Payment (Payhere)</p>
                        </div>
                        {salesOrderId && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Sales Order</h4>
                            <p className="text-gray-900">{salesOrderId}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
                        <ul className="space-y-3">
                          <li className="flex">
                            <div className="flex-shrink-0 text-green-500 mr-2">
                              <Check className="h-5 w-5" />
                            </div>
                            <span>Your payment has been recorded</span>
                          </li>
                          <li className="flex">
                            <div className="flex-shrink-0 text-green-500 mr-2">
                              <Check className="h-5 w-5" />
                            </div>
                            <span>Your sales order has been confirmed</span>
                          </li>
                          <li className="flex">
                            <div className="flex-shrink-0 text-green-500 mr-2">
                              <Check className="h-5 w-5" />
                            </div>
                            <span>You will receive a confirmation email with your receipt</span>
                          </li>
                          <li className="flex">
                            <div className="flex-shrink-0 text-green-500 mr-2">
                              <Check className="h-5 w-5" />
                            </div>
                            <span>Our team will contact you to schedule your course sessions</span>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                  
                  {paymentStatus === 'cancelled' && (
                    <div className="mt-4">
                      <p className="text-gray-700 mb-4">Don't worry! You can try the payment again or choose a different payment method.</p>
                      <div className="flex flex-wrap gap-3">
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                          onClick={() => navigate(`/payment-review?lead=${leadId}&sales_order=${salesOrderId}`)}
                        >
                          <CreditCard className="h-5 w-5 mr-2" />
                          Try Payment Again
                        </button>
                        
                        <button 
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
                          onClick={() => window.scrollTo({ top: document.getElementById('bank-transfer')?.offsetTop, behavior: 'smooth' })}
                        >
                          <Building className="h-5 w-5 mr-2" />
                          Use Bank Transfer Instead
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ContentSection>
        )}
        
        {/* What's Next Section */}
        <ContentSection 
          id="whats-next" 
          title="What's Next" 
          subtitle="Here's what you can expect in the coming days"
          titleAlignment="center"
          background="white"
        >
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 shadow-sm text-center scroll-animate">
                  <div className="bg-blue-100 rounded-full p-3 inline-flex mb-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Confirmation Email</h3>
                  <p className="text-blue-800">
                    {paymentStatus === 'success' 
                      ? 'You\'ll receive a payment receipt and course details within 24 hours.' 
                      : 'You\'ll receive a confirmation email within 24 hours with payment instructions.'}
                  </p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 shadow-sm text-center scroll-animate" style={{ transitionDelay: '100ms' }}>
                  <div className="bg-blue-100 rounded-full p-3 inline-flex mb-4">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Course Coordinator Call</h3>
                  <p className="text-blue-800">A course coordinator will contact you to discuss your preferences and answer any questions.</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 shadow-sm text-center scroll-animate" style={{ transitionDelay: '200ms' }}>
                  <div className="bg-blue-100 rounded-full p-3 inline-flex mb-4">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Course Materials</h3>
                  <p className="text-blue-800">You'll receive your course materials 3 days before your first session.</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-8 scroll-animate">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Important Information</h3>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  {paymentStatus !== 'success' && (
                    <li>Please complete your payment within 3 days to secure your spot.</li>
                  )}
                  <li>If you need to change your course format or dates, please contact us as soon as possible.</li>
                  <li>Prepare a quiet space with a reliable internet connection for your online sessions.</li>
                  <li>Don't hesitate to reach out if you have any questions or concerns.</li>
                </ul>
              </div>
            </div>
          </div>
        </ContentSection>

        {/* Only show bank transfer info if payment not successful */}
        {paymentStatus !== 'success' && (
          <ContentSection 
            id="bank-transfer" 
            title="Bank Transfer Information" 
            subtitle="Please use the details corresponding to your region"
            titleAlignment="center"
            className="bg-gray-50"
          >
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Sri Lanka */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm scroll-animate">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Sri Lanka (LKR)</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Account Name:</strong> Ravana Industries (Pvt) Ltd</p>
                  <p><strong>Bank:</strong> DFCC Bank</p>
                  <p><strong>Branch:</strong> Nugegoda</p>
                  <p><strong>Account Number:</strong> 101001048164</p>
                  <hr className="my-3"/>
                  <p><strong>Account Name:</strong> Ravana Industries (Pvt) Ltd</p>
                  <p><strong>Bank:</strong> HNB</p>
                  <p><strong>Branch:</strong> Wellawatta</p>
                  <p><strong>Account Number:</strong> 00901050121271</p>
                </div>
              </div>

              {/* EU */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm scroll-animate" style={{ transitionDelay: '100ms' }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Europe (EUR)</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Name:</strong> Ravana Industries Inc.</p>
                  <p><strong>IBAN:</strong> BE22 9052 9519 4447</p>
                  <p><strong>Swift/BIC (outside SEPA):</strong> TRWIBEB1XXX</p>
                  <p><strong>Bank:</strong> Wise</p>
                  <p><strong>Bank Address:</strong> Rue du Trône 100, 3rd floor, Brussels, 1050, Belgium</p>
                </div>
              </div>

              {/* Canada */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm scroll-animate" style={{ transitionDelay: '200ms' }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Canada (CAD)</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Name:</strong> Ravana Industries Inc.</p>
                  <p><strong>Account Number:</strong> 200116729924</p>
                  <p><strong>Institution Number:</strong> 621</p>
                  <p><strong>Transit Number:</strong> 16001</p>
                  <p><strong>Swift/BIC (outside Canada):</strong> TRWICAW1XXX</p>
                  <p><strong>Bank:</strong> Wise Payments Canada Inc.</p>
                  <p><strong>Bank Address:</strong> 99 Bank Street, Suite 1420, Ottawa, ON, K1P 1H4, Canada</p>
                </div>
              </div>

              {/* UK */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm scroll-animate" style={{ transitionDelay: '300ms' }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">United Kingdom (GBP)</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Name:</strong> Ravana Industries Inc.</p>
                  <p><strong>Account Number:</strong> 91228740</p>
                  <p><strong>Sort Code (UK):</strong> 23-08-01</p>
                  <p><strong>IBAN:</strong> GB66 TRWI 2308 0191 2287 40</p>
                  <p><strong>Swift/BIC (outside UK):</strong> TRWIGB2LXXX</p>
                  <p><strong>Bank:</strong> Wise Payments Limited</p>
                  <p><strong>Bank Address:</strong> 1st Floor, Worship Square, 65 Clifton Street, London, EC2A 4JE, United Kingdom</p>
                </div>
              </div>

              {/* Rest of the World (USD) */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm scroll-animate" style={{ transitionDelay: '400ms' }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Rest of World (USD)</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Name:</strong> Ravana Industries Inc.</p>
                  <p><strong>Account Number:</strong> 834262475232753</p>
                  <p><strong>Account Type (US):</strong> Deposit</p>
                  <p><strong>Routing Number (US Wire/ACH):</strong> 084009519</p>
                  <p><strong>Swift/BIC (outside US):</strong> TRWIUS35XXX</p>
                  <p><strong>Bank:</strong> Wise US Inc</p>
                  <p><strong>Address:</strong> 30 W. 26th Street, Sixth Floor, New York, NY, 10010, United States</p>
                </div>
              </div>

            </div>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mt-12 scroll-animate">
                <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-300 flex items-center">
                  Return to Home <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                
                <Link to="/contact" className="text-blue-600 hover:text-blue-800 font-medium py-3 px-6 transition duration-300">
                  Contact Support
                </Link>
              </div>
          </ContentSection>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ThankYou;