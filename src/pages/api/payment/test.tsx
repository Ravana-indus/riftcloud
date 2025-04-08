import { createSuccessPaymentEntry } from '@/services/paymentService';
import { createSalesOrder } from '@/services/salesOrderService';
import { API_BASE_URL, getApiHeaders } from '@/utils/apiConfig';
import { cleanCustomerName } from '@/utils/customerUtils';
import crypto from 'crypto';

// Get Payhere merchant secret from environment variables with fallback for development
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || 'NjY5MTg5ODgyMjQzNjkyMzMyMTExNDA0MjYyMDM0NzA3NDg2Nzc=';
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '1224574';

// Check for development environment safely
const isDevelopment = typeof process !== 'undefined' && process.env 
  ? process.env.NODE_ENV === 'development' 
  : true; // Default to true in browser for testing

// Generate PayHere hash securely on the server
const generatePayhereHash = (orderId: string, amount: number, currency: string): string => {
  // Ensure amount is properly formatted as a string with no trailing zeros
  const formattedAmount = parseFloat(amount.toString()).toString();
  
  // Create the string to hash according to PayHere docs
  const stringToHash = `${PAYHERE_MERCHANT_ID}${orderId}${formattedAmount}${currency}${PAYHERE_MERCHANT_SECRET}`;
  
  // Generate MD5 hash
  return crypto.createHash('md5').update(stringToHash).digest('hex');
};

export default async function handler(req, res) {
  // Ensure this endpoint is only accessible in development
  if (!isDevelopment) {
    return res.status(403).json({ message: 'This endpoint is only available in development environment' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Testing payment and sales order creation with parameters:', req.body);

    // Extract test parameters from request body, or use defaults
    const lead_id = req.body.lead_id || 'TEST-LEAD-123';
    const customer_name_raw = req.body.customer_name || 'John Doe';
    // Clean the customer name to prevent any issues with numbers or special characters
    const customer_name = cleanCustomerName(customer_name_raw);
    
    console.log('Original customer name:', customer_name_raw);
    console.log('Cleaned customer name:', customer_name);
    
    const amount = parseFloat(req.body.amount) || 100;
    const currency = req.body.currency || 'LKR';
    // Create a unique payment reference with timestamp
    const payment_reference = req.body.payment_reference || `TEST-PAYMENT-${Date.now()}`;
    const item_code = req.body.item_code || 'COURSE-001';
    // Create a unique order ID with timestamp
    const order_id = `TEST-ORDER-${Date.now()}`;
    
    console.log('Test parameters:', {
      lead_id,
      customer_name,
      amount,
      currency,
      payment_reference,
      item_code,
      order_id
    });
    
    // Generate hash for this test payment
    const hash = generatePayhereHash(order_id, amount, currency);
    console.log('Generated hash for test payment (hash value not logged for security)');

    // Step 1: Create a sales order
    console.log('Creating test sales order...');
    const salesOrderResult = await createSalesOrder({
      leadId: lead_id,
      customerName: customer_name,
      itemCode: item_code,
      amount,
      currency
    });

    if (!salesOrderResult.success) {
      console.error('Failed to create test sales order:', salesOrderResult.message);
      return res.status(500).json({
        message: 'Failed to create test sales order',
        error: salesOrderResult.message
      });
    }

    const salesOrderId = salesOrderResult.salesOrderId;
    console.log('Test sales order created successfully:', salesOrderId);

    // Step 2: Fetch the sales order to get the exact customer name
    let exactCustomerName = customer_name;
    try {
      console.log('Fetching sales order details to get exact customer name...');
      const salesOrderResponse = await fetch(`${API_BASE_URL}/resource/Sales Order/${salesOrderId}`, {
        headers: getApiHeaders()
      });
      
      const salesOrderData = await salesOrderResponse.json();
      
      if (salesOrderResponse.ok && salesOrderData && salesOrderData.data && salesOrderData.data.customer) {
        const rawCustomerName = salesOrderData.data.customer;
        // Clean the customer name again to ensure no numbers or special characters
        exactCustomerName = cleanCustomerName(rawCustomerName);
        console.log('Retrieved exact customer name from sales order:', rawCustomerName);
        console.log('Cleaned exact customer name:', exactCustomerName);
      } else {
        console.warn('Could not retrieve exact customer name from sales order, using original:', exactCustomerName);
      }
    } catch (error) {
      console.error('Error retrieving exact customer name from sales order:', error);
      console.warn('Using original customer name:', exactCustomerName);
    }

    // Step 3: Create a payment entry using the sales order ID and exact customer name
    console.log('Creating test payment entry with exact customer name:', exactCustomerName);
    const paymentResult = await createSuccessPaymentEntry(
      salesOrderId as string,
      amount,
      currency,
      exactCustomerName,
      payment_reference
    );

    if (!paymentResult.success) {
      console.error('Failed to create test payment entry:', paymentResult.message);
      return res.status(500).json({
        message: 'Sales order created but payment entry creation failed',
        salesOrderId,
        error: paymentResult.message
      });
    }

    console.log('Test payment entry created successfully:', paymentResult);
    
    // Return success response with both sales order and payment information
    return res.status(200).json({
      message: 'Test payment and sales order created successfully',
      salesOrderId,
      paymentId: paymentResult.paymentId,
      customer: exactCustomerName,
      order_id,
      hash_generated: true // Don't include the actual hash in the response
    });
  } catch (error) {
    console.error('Error in test payment endpoint:', error);
    return res.status(500).json({
      message: 'Error processing test payment',
      error: error.message || 'Unknown error'
    });
  }
} 