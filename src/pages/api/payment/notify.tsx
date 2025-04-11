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
  if (isBrowser) {
    console.error('This API endpoint should only be called server-side');
    return res.status(500).json({ message: 'This endpoint cannot be called from the browser' });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
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

    console.log('Payment notification received:', {
      payment_id,
      order_id,
      amount,
      currency,
      status_code,
      leadId,
      customerName,
      existingSalesOrderId
    });

    // Validate required fields
    if (!payment_id || !amount || !currency || !existingSalesOrderId) {
      console.error('Missing required fields in payment notification');
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields: {
          payment_id: !payment_id,
          amount: !amount,
          currency: !currency,
          salesOrderId: !existingSalesOrderId
        }
      });
    }

    const paymentAmount = parseFloat(amount) || 0;
    const paymentReference = payment_id || `PAYHERE-${Date.now()}`;

    if (status_code == 2) { // Payment successful
      console.log('Payment successful, processing payment entry creation...');
      
      // Create payment entry with all required information
      const paymentResult = await createSuccessPaymentEntry(
        existingSalesOrderId,
        paymentAmount,
        currency,
        customerName || 'Individual',
        paymentReference
      );

      if (!paymentResult.success) {
        console.error('Failed to create payment entry:', paymentResult.message);
        return res.status(500).json({
          message: 'Payment processed but entry creation failed',
          error: paymentResult.message,
          salesOrderId: existingSalesOrderId
        });
      }

      console.log('Payment entry created successfully:', {
        paymentId: paymentResult.paymentId,
        salesOrderId: existingSalesOrderId,
        amount: paymentAmount,
        currency
      });
      
      return res.status(200).json({
        message: 'Payment processed and recorded successfully',
        salesOrderId: existingSalesOrderId,
        paymentId: paymentResult.paymentId
      });
    } else {
      console.log(`Payment not successful (status: ${status_code}), creating zero payment entry...`);
      
      // For non-successful payments, create a zero payment entry
      const zeroPaymentResult = await createZeroPaymentEntry(
        existingSalesOrderId,
        currency,
        customerName || 'Individual'
      );

      if (!zeroPaymentResult.success) {
        console.error('Failed to create zero payment entry:', zeroPaymentResult.message);
      } else {
        console.log('Zero payment entry created for unsuccessful payment');
      }

      return res.status(200).json({
        message: `Payment not successful (status: ${status_code})`,
        status_message,
        zeroPaymentCreated: zeroPaymentResult.success
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