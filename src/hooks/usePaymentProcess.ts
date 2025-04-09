import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  createCustomer, 
  initiatePayhereCheckout,
  openTestCheckout,
  createPaymentEntry,
  createSalesOrder,
  CustomerData,
  PaymentData,
  PaymentEntryData,
  SalesOrderData,
  createSuccessPaymentEntry as apiCreateSuccessPaymentEntry,
  createZeroPaymentEntry as apiCreateZeroPaymentEntry,
  PAYHERE_MERCHANT_ID
} from '@/services/paymentService';
import { LeadData } from '@/services/api';
import { API_BASE_URL, getApiHeaders } from '@/utils/apiConfig';
import { cleanCustomerName } from '@/utils/customerUtils';

export const usePaymentProcess = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);
  const [pendingSalesOrderId, setPendingSalesOrderId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  /**
   * Process a Payhere payment
   * @param leadData The submitted lead data
   * @param leadId The lead ID returned from the API
   */
  const processPayherePayment = async (leadData: LeadData, leadId: string): Promise<void> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Detect if we're running in development environment
      const isDevelopment = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1';
      
      console.log(`Running in ${isDevelopment ? 'development' : 'production'} environment`);
      
      // Get the registered customer name to use as fallback
      const customerName = `${leadData.first_name} ${leadData.last_name}`;
      const currency = leadData.custom_currency || 'LKR';
      const amount = leadData.custom_amount || 0;
      const courseType = `${leadData.custom_preferred_mode || ''} - ${leadData.custom_preferred_type || ''}`.trim();
      
      // Create a unique order ID
      const orderId = `ORDER-${leadId}-${Date.now()}`;
      
      // Prepare payment data for Payhere
      const baseUrl = window.location.origin;
      
      const paymentData: Omit<PaymentData, 'hash' | 'merchant_secret'> = {
        merchant_id: PAYHERE_MERCHANT_ID,
        return_url: `${baseUrl}/thank-you?lead=${leadId}&payment=success`,
        cancel_url: `${baseUrl}/thank-you?lead=${leadId}&payment=cancelled`,
        notify_url: `${baseUrl}/api/payment/notify`,
        order_id: orderId,
        items: `Registration for ${courseType || 'RIFT Course'}`,
        currency: currency,
        amount: amount,
        first_name: leadData.first_name || '',
        last_name: leadData.last_name || '',
        email: leadData.email_id || '',
        phone: leadData.mobile_no || '',
        address: leadData.custom_address || '',
        city: leadData.custom_city || '',
        country: leadData.custom_country || leadData.preferred_time_zone?.toString() || 'Sri Lanka',
        custom_1: leadId,  // Pass leadId for reference
        custom_2: customerName,  // Pass customer name
      };
      
      // Initiate Payhere checkout - hash will be generated server-side
      console.log('Initiating PayHere checkout with data:', {
        orderId: orderId,
        amount,
        currency,
        customerName
      });
      
      await initiatePayhereCheckout(paymentData);
      
      // The rest of the process (sales order and payment entry creation) 
      // will be handled in the notification handler after successful payment
      
    } catch (err) {
      console.error('Payment processing error:', err);
      setError(err instanceof Error ? err.message : 'Unknown payment processing error');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };
  
  /**
   * Create a payment entry for a successful payment
   * @param salesOrderId The ID of the sales order
   * @param amount The payment amount
   * @param currency The payment currency
   * @param customerName The customer name
   * @param paymentReference The payment reference
   */
  const createSuccessPaymentEntry = async (
    salesOrderId: string,
    amount: number,
    currency: string,
    customerName: string,
    paymentReference: string
  ): Promise<string | null> => {
    try {
      // Clean the customer name to ensure it's valid
      customerName = cleanCustomerName(customerName);
      console.log('Using customer name for payment entry:', customerName);
      
      // Create payment entry using the API function
      console.log('Creating payment entry with params:', {
        salesOrderId, amount, currency, customerName, paymentReference
      });
      
      const paymentResponse = await apiCreateSuccessPaymentEntry(
        salesOrderId,
        amount,
        currency,
        customerName,
        paymentReference
      );
      
      if (!paymentResponse.success) {
        console.error('Failed to create payment entry:', paymentResponse.message);
        return null;
      }
      
      const paymentId = paymentResponse.paymentId;
      console.log('Payment entry created successfully:', paymentId);
      return paymentId || null;
    } catch (error) {
      console.error('Error creating payment entry:', error);
      return null;
    }
  };
  
  /**
   * Create a zero-amount payment entry for a failed or cancelled payment
   * @param salesOrderId The ID of the sales order
   * @param currency The payment currency
   * @param customerName The customer name
   */
  const createZeroPaymentEntry = async (
    salesOrderId: string,
    currency: string,
    customerName: string
  ): Promise<string | null> => {
    try {
      // Clean the customer name to ensure it's valid
      customerName = cleanCustomerName(customerName);
      console.log('Using customer name for zero payment entry:', customerName);
      
      // Create zero payment entry using API function
      console.log('Creating zero payment entry with params:', {
        salesOrderId, currency, customerName
      });
      
      const paymentResponse = await apiCreateZeroPaymentEntry(
        salesOrderId,
        currency,
        customerName
      );
      
      if (!paymentResponse.success) {
        console.error('Failed to create zero-amount payment entry:', paymentResponse.message);
        return null;
      }
      
      const paymentId = paymentResponse.paymentId;
      console.log('Zero-amount payment entry created successfully:', paymentId);
      return paymentId || null;
    } catch (error) {
      console.error('Error creating zero-amount payment entry:', error);
      return null;
    }
  };
  
  /**
   * Process payment return from Payhere (called when returning from payment gateway)
   * @param leadId The lead ID
   * @param salesOrderId The sales order ID
   * @param paymentStatus The payment status ('success' or 'cancelled')
   * @param customerName The customer name
   * @param amount The payment amount
   * @param currency The payment currency
   */
  const processPaymentReturn = async (
    leadId: string,
    salesOrderId: string,
    paymentStatus: 'success' | 'cancelled',
    customerName: string,
    amount: number,
    currency: string
  ): Promise<void> => {
    try {
      if (!salesOrderId) {
        console.error('No sales order ID provided for payment return processing');
        return;
      }
      
      // Fetch the sales order details to get the exact customer name
      let exactCustomerName = customerName;
      try {
        console.log('Fetching sales order details to get exact customer name...');
        const salesOrderResponse = await fetch(`${API_BASE_URL}/resource/Sales Order/${salesOrderId}`, {
          headers: getApiHeaders()
        });
        
        const salesOrderData = await salesOrderResponse.json();
        
        if (salesOrderResponse.ok && salesOrderData && salesOrderData.data && salesOrderData.data.customer) {
          exactCustomerName = salesOrderData.data.customer;
          console.log('Retrieved exact customer name from sales order:', exactCustomerName);
        } else {
          console.warn('Could not retrieve exact customer name from sales order, using original:', exactCustomerName);
        }
      } catch (error) {
        console.error('Error retrieving exact customer name from sales order:', error);
        console.warn('Using original customer name:', exactCustomerName);
      }
      
      // Clean customer name to ensure compatibility with Frappe API
      exactCustomerName = cleanCustomerName(exactCustomerName);
      console.log('Using cleaned customer name for payment processing:', exactCustomerName);
      
      if (paymentStatus === 'success') {
        const paymentReference = `PAYHERE-${Date.now()}`;
        await createSuccessPaymentEntry(
          salesOrderId,
          amount,
          currency,
          exactCustomerName,
          paymentReference
        );
      } else {
        await createZeroPaymentEntry(
          salesOrderId,
          currency,
          exactCustomerName
        );
      }
    } catch (error) {
      console.error('Error processing payment return:', error);
    }
  };
  
  return {
    processPayherePayment,
    createSuccessPaymentEntry,
    createZeroPaymentEntry,
    processPaymentReturn,
    isProcessing,
    error,
    pendingPaymentId,
    pendingSalesOrderId
  };
};

export default usePaymentProcess;