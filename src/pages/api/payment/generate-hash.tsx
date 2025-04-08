import crypto from 'crypto';

// Get Payhere merchant secret from environment variables with fallback for development
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET 
// Check if we're in a browser environment (this API should run server-side)
const isBrowser = typeof window !== 'undefined';

export default async function handler(req, res) {
  // This endpoint should only run on the server
  if (isBrowser) {
    console.error('This API endpoint should only be called server-side');
    return res.status(500).json({ message: 'This endpoint cannot be called from the browser' });
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get data from the request body
    const { merchant_id, order_id, amount, currency } = req.body;

    // Validate required fields
    if (!merchant_id || !order_id || amount === undefined || !currency) {
      console.error('Missing required fields for hash generation:', { merchant_id, order_id, amount, currency });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure amount is properly formatted as a string with no trailing zeros
    const formattedAmount = parseFloat(amount).toString();

    console.log('Generating hash for:', { merchant_id, order_id, amount: formattedAmount, currency });

    // Create the string to hash according to PayHere docs
    const stringToHash = `${merchant_id}${order_id}${formattedAmount}${currency}${PAYHERE_MERCHANT_SECRET}`;
    
    // Generate MD5 hash
    const hash = crypto.createHash('md5').update(stringToHash).digest('hex');
    
    console.log('Hash generated successfully');

    // Return the hash (not logging the hash for security)
    return res.status(200).json({ message: hash });
  } catch (error) {
    console.error('Error generating hash:', error);
    return res.status(500).json({ message: 'Error generating hash' });
  }
} 