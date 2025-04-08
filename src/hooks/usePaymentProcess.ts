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
      const registeredCustomerName = leadData.lead_name || `${leadData.first_name} ${leadData.last_name}`;
      console.log('Registered customer name:', registeredCustomerName);
      
      // 1. Create a customer in the ERP system
      const customerData: CustomerData = {
        customer_name: registeredCustomerName,
        email: leadData.email_id,
        phone: leadData.mobile_no,
        country: leadData.preferred_time_zone?.toString() || 'Sri Lanka'
      };
      
      // Use the registered customer name as fallback
      let customerName = registeredCustomerName;
      
      try {
        const customerResponse = await createCustomer(customerData);
        
        if (customerResponse.success && customerResponse.data) {
          console.log('Customer created successfully:', customerResponse.data);
          // Get the customer name from the response and clean it
          customerName = cleanCustomerName(customerResponse.data.name);
          console.log('Using customer name:', customerName);
        } else {
          console.warn('Failed to create customer, using registered name as fallback:', customerResponse.error);
        }
      } catch (customerError) {
        console.warn('Error creating customer, using registered name as fallback:', customerError);
      }
      
      // 2. Create a sales order first
      const orderId = `ORDER-${leadId}-${Date.now()}`;
      const currency = leadData.custom_currency || 'LKR';
      const amount = leadData.custom_amount || 0;
      const courseType = `${leadData.custom_preferred_mode || ''} - ${leadData.custom_preferred_type || ''}`.trim();
      
      // Determine the correct item code based on country and mode
      // For now, using a default item code
      const itemCode = 'RIFT-DS-LK-ON-25'; 
      
      // Format date as YYYY-MM-DD for Frappe API
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      let salesOrderId = null;
      
      try {
        const salesOrderData: SalesOrderData = {
          naming_series: 'SAL-ORD-.YYYY.-',
          transaction_date: formattedDate,
          delivery_date: formattedDate,
          customer: customerName,
          order_type: 'Sales',
          currency: currency,
          items: [
            {
              item_code: itemCode,
              qty: 1,
              rate: amount,
              amount: amount
            }
          ],
          taxes: [
            {
              charge_type: 'On Net Total',
              account_head: 'VAT - RU',
              description: 'VAT Tax'
            }
          ],
          disable_rounded_total: 1,
          custom_lead_reference: leadId
        };
        
        console.log('Creating sales order:', salesOrderData);
        const salesOrderResponse = await createSalesOrder(salesOrderData);
        
        if (!salesOrderResponse.success || !salesOrderResponse.data) {
          console.warn('Failed to create sales order, continuing with payment:', salesOrderResponse.error);
        } else {
          // Store sales order ID for later reference
          salesOrderId = salesOrderResponse.data.name;
          setPendingSalesOrderId(salesOrderId);
          console.log('Sales order created successfully:', salesOrderId);
        }
      } catch (salesOrderError) {
        console.warn('Error creating sales order:', salesOrderError);
        // Continue with payment anyway
      }
      
      // 3. Prepare payment data for Payhere
      const baseUrl = window.location.origin;
      
      // Include sales order ID in URLs if we have one
      const successParams = salesOrderId ? `&sales_order=${salesOrderId}` : '';
      const cancelParams = salesOrderId ? `&sales_order=${salesOrderId}` : '';
      
      // Create unique order ID with timestamp to ensure uniqueness
      const uniqueOrderId = `${orderId}-${Date.now()}`;
      
      const paymentData: Omit<PaymentData, 'hash' | 'merchant_secret'> = {
        merchant_id: PAYHERE_MERCHANT_ID,
        return_url: `${baseUrl}/thank-you?lead=${leadId}&payment=success${successParams}`,
        cancel_url: `${baseUrl}/thank-you?lead=${leadId}&payment=cancelled${cancelParams}`,
        notify_url: `${baseUrl}/api/payment/notify`, // Server-side notification endpoint
        order_id: uniqueOrderId,
        items: `Registration for ${courseType || 'RIFT Course'}`,
        currency: currency,
        amount: amount,
        first_name: leadData.first_name || '',
        last_name: leadData.last_name || '',
        email: leadData.email_id || '',
        phone: leadData.mobile_no || '',
        // Optional fields - might not be present in all lead data
        address: '', // No address in lead data
        city: '',    // No city in lead data
        country: leadData.preferred_time_zone?.toString() || 'Sri Lanka',
        custom_1: leadId, // Store lead ID as custom parameter
        custom_2: customerName, // Store customer name as custom parameter
      };
      
      // Add sales order ID reference if we have one
      if (salesOrderId) {
        paymentData.custom_3 = salesOrderId;
      }
      
      // 4. Initiate Payhere checkout - hash will be generated server-side
      console.log('Initiating PayHere checkout with data:', {
        orderId: uniqueOrderId,
        amount,
        currency,
        customerName
      });
      await initiatePayhereCheckout(paymentData);
      
      // The rest of the process will be handled in the return_url
      // We'll create the payment entry when the user returns from the payment gateway
      
    } catch (err) {
      console.error('Payment processing error:', err);
      setError(err instanceof Error ? err.message : 'Unknown payment processing error');
      throw err; // Re-throw to allow handling by the component
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