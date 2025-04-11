import { createSuccessPaymentEntry } from '@/services/paymentService';
import { createSalesOrder } from '@/services/salesOrderService';
import crypto from 'crypto';

// Get Payhere merchant secret from environment variables with fallback for development
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || 'NjY5MTg5ODgyMjQzNjkyMzMyMTExNDA0MjYyMDM0NzA3NDg2Nzc=';

// Check if we're in a browser environment (this API should run server-side)
const isBrowser = typeof window !== 'undefined';

// Verify the PayHere hash to prevent tampering
const verifyPayhereHash = (merchantId: string, orderId: string, amount: string, currency: string, hash: string): boolean => {
  // Ensure amount is properly formatted as a string with no trailing zeros
  const formattedAmount = parseFloat(amount).toString();
  
  // Create the string to hash according to PayHere docs
  const stringToHash = `${merchantId}${orderId}${formattedAmount}${currency}${PAYHERE_MERCHANT_SECRET}`;
  
  // Generate MD5 hash
  const calculatedHash = crypto.createHash('md5').update(stringToHash).digest('hex');
  
  // Compare the calculated hash with the received hash
  return calculatedHash.toLowerCase() === hash.toLowerCase();
};

export default async function handler(req, res) {
  // This endpoint should only run on the server
  if (isBrowser) {
    console.error('This API endpoint should only be called server-side');
    return res.status(500).json({ message: 'This endpoint cannot be called from the browser' });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Payment notification received:', req.body);

  try {
    // Extract data from request
    const {
      payment_id,
      merchant_id,
      order_id,
      amount,
      currency,
      status_code,
      status_message,
      custom_1: leadId,
      custom_2: customerName,
      custom_3: existingSalesOrderId,
      hash
    } = req.body;

    // Verify the hash if provided
    if (hash) {
      const isValidHash = verifyPayhereHash(merchant_id, order_id, amount, currency, hash);
      if (!isValidHash) {
        console.error('Invalid hash received, potential tampering detected');
        return res.status(400).json({ message: 'Invalid hash, payment verification failed' });
      }
      console.log('Payment hash verified successfully');
    } else {
      console.warn('No hash provided in the payment notification');
    }

    const paymentAmount = parseFloat(amount) || 0;
    const paymentReference = payment_id || `PAYHERE-${Date.now()}`;
    
    console.log('Processing payment with data:', {
      leadId,
      customerName,
      existingSalesOrderId,
      paymentAmount,
      currency,
      paymentReference
    });

    // Check if payment is successful (status_code == 2)
    if (status_code == 2) {
      console.log('Payment successful, processing...');
      
      let salesOrderId = existingSalesOrderId;

      // Only create new sales order if one doesn't exist
      if (!salesOrderId) {
        console.log('No existing sales order found, creating new one...');
        const salesOrderResult = await createSalesOrder({
          leadId,
          customerName,
          itemCode: 'RIFT-DS-LK-ON-25', // Updated item code
          amount: paymentAmount,
          currency
        });

        if (!salesOrderResult.success) {
          console.error('Failed to create sales order:', salesOrderResult.message);
          return res.status(500).json({
            message: 'Payment processed but sales order creation failed',
            error: salesOrderResult.message
          });
        }

        salesOrderId = salesOrderResult.salesOrderId;
        console.log('Created new sales order:', salesOrderId);
      } else {
        console.log('Using existing sales order:', salesOrderId);
      }

      // Create payment entry using the sales order ID
      console.log('Creating payment entry for sales order:', salesOrderId);
      const paymentResult = await createSuccessPaymentEntry(
        salesOrderId,
        paymentAmount,
        currency,
        customerName,
        paymentReference
      );

      if (!paymentResult.success) {
        console.error('Failed to create payment entry:', paymentResult.message);
        return res.status(500).json({
          message: 'Payment processed but entry creation failed',
          salesOrderId,
          error: paymentResult.message
        });
      }

      console.log('Payment entry created successfully:', paymentResult);
      
      // Return success response
      return res.status(200).json({
        message: 'Payment processed successfully',
        salesOrderId,
        paymentId: paymentResult.paymentId
      });
    } else {
      console.log('Payment notification received but status code is not success:', status_code);
      return res.status(200).json({
        message: 'Payment notification received but not processed (status not success)',
        status_code,
        status_message
      });
    }
  } catch (error) {
    console.error('Error processing payment notification:', error);
    return res.status(500).json({
      message: 'Error processing payment notification',
      error: error.message || 'Unknown error'
    });
  }
}