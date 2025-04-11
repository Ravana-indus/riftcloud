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
   * Creates a sales order for a lead before initiating payment
   * @param leadData The lead data
   * @param leadId The lead ID
   */
  const createOrderForLead = async (
    leadData: LeadData,
    leadId: string
  ): Promise<string | null> => {
    try {
      console.log('Creating sales order for lead:', leadId);
      const customerName = `${leadData.first_name} ${leadData.last_name}`;
      const cleanedCustomerName = cleanCustomerName(customerName);
      
      // Create customer first
      console.log('Creating customer:', cleanedCustomerName);
      const customerResult = await createCustomer({
        customer_name: cleanedCustomerName,
        email: leadData.email_id || '',
        phone: leadData.mobile_no || '',
        address: leadData.custom_address,
        city: leadData.custom_city,
        country: leadData.custom_country || leadData.preferred_time_zone?.toString() || 'Sri Lanka'
      });

      if (!customerResult.success) {
        console.error('Failed to create customer:', customerResult.error);
        // Continue with 'Individual' customer as fallback
        console.log('Using "Individual" customer as fallback');
      }

      const formattedDate = (() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })();
      
      // Prepare sales order data with correct item code
      const salesOrderData: SalesOrderData = {
        naming_series: 'SAL-ORD-.YYYY.-',
        transaction_date: formattedDate,
        delivery_date: formattedDate,
        customer: customerResult.success ? cleanedCustomerName : 'Individual',
        order_type: 'Sales',
        currency: leadData.custom_currency || 'LKR',
        items: [
          {
            item_code: 'RIFT-DS-LK-ON-25', // Updated item code
            qty: 1,
            rate: leadData.custom_amount || 0,
            amount: leadData.custom_amount || 0
          }
        ],
        custom_lead_reference: leadId
      };
      
      // Create sales order
      console.log('Submitting sales order:', salesOrderData);
      const response = await createSalesOrder(salesOrderData);
      
      if (!response.success || !response.data || !response.data.name) {
        console.error('Failed to create sales order:', response.error);
        return null;
      }
      
      const salesOrderId = response.data.name;
      console.log('Sales order created successfully:', salesOrderId);
      setPendingSalesOrderId(salesOrderId);
      
      return salesOrderId;
    } catch (error) {
      console.error('Error creating sales order:', error);
      return null;
    }
  };
  
  /**
   * Process a Payhere payment
   * @param leadData The submitted lead data
   * @param leadId The lead ID returned from the API
   */
  const processPayherePayment = async (leadData: LeadData, leadId: string): Promise<void> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Create sales order first
      console.log('Creating sales order before payment...');
      const salesOrderId = await createOrderForLead(leadData, leadId);
      
      if (!salesOrderId) {
        throw new Error('Failed to create sales order. Cannot proceed with payment.');
      }

      console.log(`Successfully created sales order ${salesOrderId}, proceeding with payment...`);
      
      // Get the registered customer name
      const customerName = `${leadData.first_name} ${leadData.last_name}`;
      const currency = leadData.custom_currency || 'LKR';
      const amount = leadData.custom_amount || 0;
      
      // Create a unique order ID that includes the sales order reference
      const orderId = `ORDER-${salesOrderId}-${Date.now()}`;
      
      // Prepare payment data for Payhere
      const baseUrl = window.location.origin;
      
      const returnUrl = new URL(`${baseUrl}/thank-you`);
      returnUrl.searchParams.append('lead', leadId);
      returnUrl.searchParams.append('payment', 'success');
      returnUrl.searchParams.append('salesOrder', salesOrderId);
      
      const cancelUrl = new URL(`${baseUrl}/thank-you`);
      cancelUrl.searchParams.append('lead', leadId);
      cancelUrl.searchParams.append('payment', 'cancelled');
      cancelUrl.searchParams.append('salesOrder', salesOrderId);

      const paymentData: Omit<PaymentData, 'hash' | 'merchant_secret'> = {
        merchant_id: PAYHERE_MERCHANT_ID,
        return_url: returnUrl.toString(),
        cancel_url: cancelUrl.toString(),
        notify_url: `${baseUrl}/api/payment/notify`,
        order_id: orderId,
        items: `Registration for ${leadData.custom_preferred_mode || 'RIFT'} Course`,
        currency,
        amount,
        first_name: leadData.first_name || '',
        last_name: leadData.last_name || '',
        email: leadData.email_id || '',
        phone: leadData.mobile_no || '',
        address: leadData.custom_address || '',
        city: leadData.custom_city || '',
        country: leadData.custom_country || leadData.preferred_time_zone?.toString() || 'Sri Lanka',
        custom_1: leadId,
        custom_2: customerName,
        custom_3: salesOrderId // Always include the sales order ID
      };

      console.log('Initiating PayHere checkout with data:', {
        orderId,
        amount,
        currency,
        customerName,
        salesOrderId
      });
      
      await initiatePayhereCheckout(paymentData);
      
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
      // Validate parameters
      if (!salesOrderId) {
        console.error('No sales order ID provided for payment entry');
        throw new Error('No sales order ID provided for payment entry');
      }
      
      if (amount <= 0) {
        console.error('Invalid payment amount:', amount);
        throw new Error('Invalid payment amount');
      }
      
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
      setPendingPaymentId(paymentId || null);
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
      // Validate parameters
      if (!salesOrderId) {
        console.error('No sales order ID provided for zero payment entry');
        throw new Error('No sales order ID provided for zero payment entry');
      }
      
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
      setPendingPaymentId(paymentId || null);
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
      console.log('Processing payment return:', {
        leadId,
        salesOrderId,
        paymentStatus,
        customerName,
        amount,
        currency
      });
      
      if (!salesOrderId) {
        console.error('No sales order ID provided for payment return processing');
        
        // We don't have a sales order ID, so we need to create one
        console.log('No sales order ID found, attempting to create a new sales order...');
        
        // Fetch lead data if needed to create a sales order
        try {
          const leadResponse = await fetch(`${API_BASE_URL}/resource/Lead/${leadId}`, {
            headers: getApiHeaders()
          });
          
          if (!leadResponse.ok) {
            throw new Error(`Failed to fetch lead data: ${leadResponse.statusText}`);
          }
          
          const leadData = await leadResponse.json();
          
          if (!leadData || !leadData.data) {
            throw new Error('No lead data found');
          }
          
          // Create a new sales order with correct item code
          console.log('Creating new sales order from lead data...');
          const newSalesOrderData: SalesOrderData = {
            naming_series: 'SAL-ORD-.YYYY.-',
            transaction_date: formatDateForFrappe(new Date()),
            delivery_date: formatDateForFrappe(new Date()),
            customer: customerName || 'Individual',
            order_type: 'Sales',
            currency: currency || 'LKR',
            items: [
              {
                item_code: 'RIFT-DS-LK-ON-25', // Updated item code
                qty: 1,
                rate: amount || 0,
                amount: amount || 0
              }
            ],
            custom_lead_reference: leadId
          };
          
          const salesOrderResponse = await createSalesOrder(newSalesOrderData);
          
          if (!salesOrderResponse.success || !salesOrderResponse.data || !salesOrderResponse.data.name) {
            throw new Error('Failed to create sales order');
          }
          
          salesOrderId = salesOrderResponse.data.name;
          console.log('Created new sales order:', salesOrderId);
          setPendingSalesOrderId(salesOrderId);
        } catch (error) {
          console.error('Error creating sales order during payment return:', error);
          setError('Failed to create sales order for payment');
          return;
        }
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
        const paymentId = await createSuccessPaymentEntry(
          salesOrderId,
          amount,
          currency,
          exactCustomerName,
          paymentReference
        );
        
        if (!paymentId) {
          console.error('Failed to create payment entry, but payment was successful');
          setError('Failed to record payment in system, but your payment was successful');
        } else {
          console.log('Payment entry created successfully:', paymentId);
        }
      } else {
        const paymentId = await createZeroPaymentEntry(
          salesOrderId,
          currency,
          exactCustomerName
        );
        
        if (!paymentId) {
          console.error('Failed to create zero payment entry for cancelled payment');
        } else {
          console.log('Zero payment entry created successfully for cancelled payment:', paymentId);
        }
      }
    } catch (error) {
      console.error('Error processing payment return:', error);
      setError(`Error processing payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  /**
   * Format a date in YYYY-MM-DD format required by Frappe API
   */
  const formatDateForFrappe = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return {
    processPayherePayment,
    createOrderForLead,
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