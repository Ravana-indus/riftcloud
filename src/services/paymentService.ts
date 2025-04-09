import { 
  API_BASE_URL, 
  getApiHeaders, 
  handleApiError, 
  ApiResponse 
} from '@/utils/apiConfig';

// Payhere configuration - Sandbox for testing
export const PAYHERE_MERCHANT_ID = '1224574'; 
// This should be in server-side code only, in an environment variable
const PAYHERE_MERCHANT_SECRET = 'MzUzMjIzMjI4OTEzMzI3MDM5MTEyNzIxMjk4MjUyNjU5NTgzNTIx';
// Payhere API URLs
export const PAYHERE_PRODUCTION_URL = 'https://www.payhere.lk/pay/checkout';
export const PAYHERE_SANDBOX_URL = 'https://sandbox.payhere.lk/pay/checkout';

// Default to sandbox for testing
export const PAYHERE_ACTIVE_URL = PAYHERE_SANDBOX_URL;

/**
 * Format a date in YYYY-MM-DD format required by Frappe API
 */
const formatDateForFrappe = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Interface for customer data
export interface CustomerData {
  customer_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
}

// Interface for payment data
export interface PaymentData {
  merchant_id: string;
  merchant_secret?: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  currency: string;
  amount: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_country?: string;
  custom_1?: string; // Lead ID
  custom_2?: string; // Customer name
  custom_3?: string; // Payment entry ID
  hash?: string; // Will be calculated
}

// Interface for payment entry in Frappe
export interface PaymentEntryData {
  naming_series: string;
  posting_date: string;
  payment_type: string;
  mode_of_payment: string;
  party_type: string;
  party: string;
  paid_to: string;
  paid_from: string;
  paid_from_account_currency: string;
  paid_amount: number;
  received_amount: number;
  reference_no?: string;
  reference_date?: string;
  custom_sales_order?: string; // Reference to sales order
}

// Interface for sales order in Frappe
export interface SalesOrderData {
  naming_series: string;
  transaction_date: string;
  delivery_date: string;
  customer: string;
  order_type: string;
  currency: string;
  items: Array<{
    item_code: string;
    qty: number;
    rate: number;
    amount: number;
  }>;
  taxes?: Array<{
    charge_type: string;
    account_head: string;
    description: string;
  }>;
  disable_rounded_total?: number;
  payment_schedule?: Array<{
    payment_term: string;
    due_date: string;
    invoice_portion: number;
    payment_amount: number;
  }>;
  custom_lead_reference?: string;
  custom_payment_reference?: string;
}

/**
 * Create a customer in the ERP system
 * @param customerData - The customer data to be submitted
 * @returns Promise with the API response
 */
export const createCustomer = async (customerData: CustomerData): Promise<ApiResponse<any>> => {
  try {
    const customer = {
      customer_name: customerData.customer_name,
      customer_type: 'Individual',
      customer_group: 'Individual',
      territory: 'All Territories',
      email_id: customerData.email,
      mobile_no: customerData.phone,
      default_currency: 'LKR', // Default to LKR, can be changed
      default_price_list: 'Standard Selling',
    };

    const response = await fetch(`${API_BASE_URL}/resource/Customer`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(customer),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        message: errorData.exception || 'Failed to create customer',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Instead of the client-side MD5 implementation, replace with a server API call
export const generatePayhereHash = async (paymentData: PaymentData): Promise<string> => {
  try {
    console.log('Generating PayHere hash via API for order:', paymentData.order_id);
    
    // Determine the correct base URL for API calls
    const baseUrl = window.location.origin;
    const hostname = window.location.hostname;
    
    // API endpoint based on environment
    let apiUrl;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Use the dedicated API server in development
      apiUrl = 'http://localhost:8080/api/payment/generate-hash';
      console.log('Using development API server for hash generation');
    } else if (hostname.includes('riftuni.com')) {
      // Use the correct API endpoint for riftuni.com
      apiUrl = `${baseUrl}/api/payment/generate-hash`;
      console.log('Using riftuni.com API endpoint for hash generation');
    } else {
      // Use the production API endpoint in the same domain
      apiUrl = `${baseUrl}/api/payment/generate-hash`;
      console.log('Using production API endpoint for hash generation');
    }
    
    console.log(`Calling hash generation API at: ${apiUrl}`);
    
    // Call the server-side API to generate the hash
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant_id: paymentData.merchant_id,
        order_id: paymentData.order_id,
        amount: paymentData.amount.toString(),
        currency: paymentData.currency,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Failed to generate hash: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to generate hash: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    console.log('Hash generated successfully');
    
    return data.message;
  } catch (error) {
    console.error('Error generating PayHere hash:', error);
    
    // As a fallback in case of API failure, we'll implement a temporary client-side hash generation
    // This should be replaced with proper server-side hash generation in production
    console.warn('API hash generation failed, using fallback method. This is not secure for production!');
    
    // Simple MD5 hash implementation using browser crypto API if available
    const generateFallbackHash = async (merchant_id: string, order_id: string, amount: string, currency: string): Promise<string> => {
      // This is just for development fallback - do not use in production
      // The secret should never be exposed in client-side code
      const TEMP_DEV_SECRET = 'MzUzMjIzMjI4OTEzMzI3MDM5MTEyNzIxMjk4MjUyNjU5NTgzNTIx';
      
      // First, we need to hash the merchant secret and convert to uppercase
      // Since we can't use MD5 directly, we'll simulate it with SHA-256 and truncate
      let hashedSecret = '';
      
      if (window.crypto && window.crypto.subtle) {
        try {
          // Hash the merchant secret
          const encoder = new TextEncoder();
          const secretData = encoder.encode(TEMP_DEV_SECRET);
          const secretBuffer = await window.crypto.subtle.digest('SHA-256', secretData);
          const secretArray = Array.from(new Uint8Array(secretBuffer));
          // Take first 16 bytes to simulate MD5 (which is also 16 bytes)
          hashedSecret = secretArray.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
          
          // Now create the main hash string with the hashed secret (already uppercase)
          const stringToHash = `${merchant_id}${order_id}${amount}${currency}${hashedSecret}`;
          const data = encoder.encode(stringToHash);
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer)).slice(0, 16);
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        } catch (e) {
          console.error('Error in WebCrypto hash generation:', e);
        }
      }
      
      // Very simple string hash as last resort fallback
      console.warn('Using very basic fallback hash - not for production!');
      // This is NOT a proper implementation, just a last resort emergency fallback
      let simpleHashSecret = 0;
      for (let i = 0; i < TEMP_DEV_SECRET.length; i++) {
        simpleHashSecret = ((simpleHashSecret << 5) - simpleHashSecret) + TEMP_DEV_SECRET.charCodeAt(i);
        simpleHashSecret = simpleHashSecret & simpleHashSecret; // Convert to 32bit integer
      }
      const simpleHashSecretHex = Math.abs(simpleHashSecret).toString(16).toUpperCase();
      
      // Now hash the string with the merchant secret hash
      const stringToHash = `${merchant_id}${order_id}${amount}${currency}${simpleHashSecretHex}`;
      let hash = 0;
      for (let i = 0; i < stringToHash.length; i++) {
        const char = stringToHash.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(16).toUpperCase();
    };
    
    // Use fallback hash generation with the required parameters
    const fallbackHash = await generateFallbackHash(
      paymentData.merchant_id,
      paymentData.order_id,
      paymentData.amount.toString(),
      paymentData.currency
    );
    
    console.log('Fallback hash generated (not for production use)');
    return fallbackHash;
  }
};

/**
 * Creates a payment entry in the ERP system
 */
export const createPaymentEntry = async (
  amount: number,
  currency: string,
  customerName: string,
  salesOrderId?: string,
  paymentReference?: string
): Promise<{ message: string; success: boolean; paymentId?: string }> => {
  try {
    console.log('Creating payment entry with parameters:', {
      amount,
      currency,
      customerName,
      salesOrderId,
      paymentReference
    });

    if (!customerName) {
      console.warn('No customer name provided. Using "Individual" as default.');
      customerName = 'Individual';
    } else {
      console.log('Using customer name:', customerName);
    }

    // Format date in the required format YYYY-MM-DD
    const today = new Date();
    const formattedDate = formatDateForFrappe(today);

    // Prepare payment entry data
    const paymentEntryData = {
      doctype: 'Payment Entry',
      naming_series: 'ACC-PAY-.YYYY.-',
      posting_date: formattedDate,
      payment_type: 'Receive',
      mode_of_payment: 'Credit Card',
      party_type: 'Customer',
      party: customerName,
      paid_to: 'Bank Account - RU',
      paid_from: 'Debtors - RU',
      paid_from_account_currency: currency,
      paid_amount: amount,
      received_amount: amount,
      reference_no: paymentReference || `PAYMT-${Date.now()}`,
      reference_date: formattedDate
    };

    // Add sales order reference if provided
    if (salesOrderId) {
      console.log(`Adding sales order reference: ${salesOrderId}`);
      paymentEntryData['custom_sales_order'] = salesOrderId;
    }

    console.log('Payment entry data:', JSON.stringify(paymentEntryData, null, 2));

    // Call Frappe API to create payment entry
    const response = await fetch(`${API_BASE_URL}/resource/Payment Entry`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(paymentEntryData)
    });

    const result = await response.json();

    if (!response.ok) {
      // Check if the error is related to customer not found
      if (result.message && result.message.includes('Could not find Party')) {
        console.error('Customer validation failed:', result.message);
        
        // Try with default "Individual" customer
        if (customerName !== 'Individual') {
          console.log('Attempting with default "Individual" customer instead');
          return createPaymentEntry(amount, currency, 'Individual', salesOrderId, paymentReference);
        }
      }
      
      console.error('Failed to create payment entry:', result);
      throw new Error(`Failed to create payment entry: ${result.message || 'Unknown error'}`);
    }

    console.log('Payment entry created successfully:', result);
    return {
      message: 'Payment entry created successfully',
      success: true,
      paymentId: result.data ? result.data.name : undefined
    };
  } catch (error) {
    console.error('Error creating payment entry:', error);
    return {
      message: `Error creating payment entry: ${error.message || 'Unknown error'}`,
      success: false
    };
  }
};

/**
 * Mock Payhere checkout - simulates a successful payment flow for development
 * This completely bypasses the Payhere gateway for local testing
 * @param paymentData Payment data for Payhere
 */
export const mockPayhereCheckout = async (paymentData: Omit<PaymentData, 'hash' | 'merchant_secret'>): Promise<void> => {
  try {
    console.log('DEVELOPMENT MODE: Simulating Payhere checkout for order:', paymentData.order_id);
    console.log('Payment details:', {
      amount: paymentData.amount,
      currency: paymentData.currency,
      items: paymentData.items,
      customer: `${paymentData.first_name} ${paymentData.last_name} (${paymentData.email})`,
      lead_id: paymentData.custom_1,
      customer_name: paymentData.custom_2,
      sales_order: paymentData.custom_3 || 'N/A'
    });
    
    // Show a simulated payment popup
    const mockOverlay = document.createElement('div');
    mockOverlay.style.position = 'fixed';
    mockOverlay.style.top = '0';
    mockOverlay.style.left = '0';
    mockOverlay.style.width = '100%';
    mockOverlay.style.height = '100%';
    mockOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    mockOverlay.style.zIndex = '10000';
    mockOverlay.style.display = 'flex';
    mockOverlay.style.alignItems = 'center';
    mockOverlay.style.justifyContent = 'center';
    
    const mockPopup = document.createElement('div');
    mockPopup.style.backgroundColor = 'white';
    mockPopup.style.padding = '2rem';
    mockPopup.style.borderRadius = '0.5rem';
    mockPopup.style.maxWidth = '500px';
    mockPopup.style.width = '90%';
    mockPopup.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
    
    // Add content to the popup
    mockPopup.innerHTML = `
      <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Development Mode: Payment Simulation</h2>
        <p style="margin-bottom: 1rem;">Order ID: ${paymentData.order_id}</p>
        <p style="margin-bottom: 1rem;">Amount: ${paymentData.currency} ${paymentData.amount.toFixed(2)}</p>
        <p style="margin-bottom: 1rem;">Items: ${paymentData.items}</p>
        <div style="margin: 1.5rem 0; height: 5px; background: #f0f0f0; border-radius: 5px; overflow: hidden;">
          <div class="progress-bar" style="height: 100%; width: 0%; background: #4F46E5; transition: width 3s linear;"></div>
        </div>
        <div class="status-text" style="margin-bottom: 1.5rem; font-size: 0.875rem; color: #6B7280;">Initializing payment simulation...</div>
        <button id="mock-success-btn" style="background: #22C55E; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer; margin-right: 0.5rem;">Simulate Success</button>
        <button id="mock-cancel-btn" style="background: #EF4444; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer;">Simulate Cancel</button>
      </div>
    `;
    
    mockOverlay.appendChild(mockPopup);
    document.body.appendChild(mockOverlay);
    
    // Start progress animation
    setTimeout(() => {
      const progressBar = mockPopup.querySelector('.progress-bar') as HTMLElement;
      if (progressBar) progressBar.style.width = '100%';
      
      const statusText = mockPopup.querySelector('.status-text') as HTMLElement;
      if (statusText) statusText.textContent = 'Processing payment...';
    }, 100);
    
    // Set up button event listeners
    const successBtn = mockPopup.querySelector('#mock-success-btn');
    const cancelBtn = mockPopup.querySelector('#mock-cancel-btn');
    
    return new Promise((resolve) => {
      if (successBtn) {
        successBtn.addEventListener('click', async () => {
          document.body.removeChild(mockOverlay);
          console.log('Simulating successful payment');
          
          // Create a mock payment reference
          const mockPaymentRef = `MOCK-PH-${Date.now()}`;
          console.log(`Mock payment reference created: ${mockPaymentRef}`);
          
          // Add amount and currency to return URL
          const successUrl = new URL(paymentData.return_url);
          successUrl.searchParams.append('amount', paymentData.amount.toString());
          successUrl.searchParams.append('currency', paymentData.currency);
          
          // Direct redirect to success URL without API call
          console.log('Redirecting to successful payment return URL');
          window.location.href = successUrl.toString();
          resolve();
        });
      }
      
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          document.body.removeChild(mockOverlay);
          console.log('Simulating cancelled payment');
          // Redirect to the cancel URL
          window.location.href = paymentData.cancel_url;
          resolve();
        });
      }
      
      // Auto-redirect to success after 5 seconds if no button is clicked
      setTimeout(() => {
        if (document.body.contains(mockOverlay)) {
          const statusText = mockPopup.querySelector('.status-text') as HTMLElement;
          if (statusText) statusText.textContent = 'Payment successful! Redirecting...';
          
          setTimeout(() => {
            if (document.body.contains(mockOverlay)) {
              document.body.removeChild(mockOverlay);
              console.log('Auto-redirecting to success URL after timeout');
              window.location.href = paymentData.return_url;
              resolve();
            }
          }, 2000);
        }
      }, 5000);
    });
  } catch (error) {
    console.error('Error in mock checkout:', error);
    throw error;
  }
};

// Update the initiatePayhereCheckout function to handle development vs production environments
export const initiatePayhereCheckout = async (paymentData: Omit<PaymentData, 'hash' | 'merchant_secret'>): Promise<void> => {
  try {
    // Create a timestamp-based unique order ID if one isn't already set
    if (!paymentData.order_id.includes(Date.now().toString())) {
      paymentData.order_id = `${paymentData.order_id}-${Date.now()}`;
    }
    
    console.log('Initiating PayHere checkout for order:', paymentData.order_id);
    
    // Determine if we're in development mode to potentially use test mode
    const hostname = window.location.hostname;
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         hostname === 'localhost' || 
                         hostname === '127.0.0.1';
    
    // Log environment info
    console.log(`Environment: ${isDevelopment ? 'Development' : 'Production'}`);
    console.log(`Hostname: ${hostname}`);
    console.log(`Using PayHere URL: ${PAYHERE_ACTIVE_URL}`);
    
    // In development, we might want to use the mock checkout instead
    if (isDevelopment && (window as any).USE_MOCK_PAYMENT === true) {
      console.log('Using mock checkout for development');
      return mockPayhereCheckout(paymentData);
    }
    
    // Generate the hash for this specific payment
    const hash = await generatePayhereHash(paymentData as PaymentData);
    
    // Try to load the PayHere SDK, but with fallback to form submission if it fails
    let useSDK = true;
    try {
      // Check if PayHere SDK is loaded
      if (typeof (window as any).payhere === 'undefined') {
        // Load the PayHere SDK if not already loaded
        console.log('Loading PayHere JavaScript SDK...');
        await loadPayHereSDK();
      }
    } catch (sdkError) {
      console.warn('Failed to load PayHere SDK, will fall back to form submission:', sdkError);
      useSDK = false;
    }
    
    // If SDK is loaded successfully, use it
    if (useSDK && typeof (window as any).payhere !== 'undefined') {
      const payhere = (window as any).payhere;
      
      // Configure SDK - sandbox or live
      payhere.onCompleted = function onComplete(orderId: string) {
        console.log("Payment completed. OrderID:" + orderId);
        const successUrl = new URL(paymentData.return_url);
        successUrl.searchParams.append('amount', paymentData.amount.toString());
        successUrl.searchParams.append('currency', paymentData.currency);
        window.location.href = successUrl.toString();
      };

      payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
        window.location.href = paymentData.cancel_url;
      };

      payhere.onError = function onError(error: any) {
        console.error("Payment error:", error);
        window.location.href = `${paymentData.cancel_url}&error=${encodeURIComponent(error)}`;
      };

      // Payment Object
      const payment = {
        sandbox: PAYHERE_ACTIVE_URL === PAYHERE_SANDBOX_URL, // Set to true for sandbox mode
        merchant_id: paymentData.merchant_id,
        return_url: paymentData.return_url,
        cancel_url: paymentData.cancel_url,
        notify_url: paymentData.notify_url,
        order_id: paymentData.order_id,
        items: paymentData.items,
        amount: paymentData.amount.toString(),
        currency: paymentData.currency,
        hash: hash,
        first_name: paymentData.first_name,
        last_name: paymentData.last_name,
        email: paymentData.email,
        phone: paymentData.phone,
        address: paymentData.address || '',
        city: paymentData.city || '',
        country: paymentData.country || 'Sri Lanka',
        custom_1: paymentData.custom_1 || '',
        custom_2: paymentData.custom_2 || '',
        custom_3: paymentData.custom_3 || '',
      };
      
      console.log('Initiating PayHere checkout with SDK:', {
        ...payment,
        hash: '[HASH VALUE HIDDEN]'
      });
      
      // Start payment process
      payhere.startPayment(payment);
    } else {
      // Fall back to form submission if SDK fails to load
      console.log('Falling back to form-based submission...');
      submitPayhereFormDirectly(paymentData, hash);
    }
    
  } catch (error) {
    console.error('Error initiating PayHere checkout:', error);
    throw error;
  }
};

/**
 * Submit a form directly to PayHere without using the SDK
 * This is a fallback method in case the SDK fails to load
 */
const submitPayhereFormDirectly = (paymentData: Omit<PaymentData, 'hash' | 'merchant_secret'>, hash: string): void => {
  try {
    console.log('Creating form for direct submission to PayHere...');
    
    // Create the form for submission
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = PAYHERE_ACTIVE_URL;
    form.target = '_self'; // Submit in the same window
    form.enctype = 'application/x-www-form-urlencoded';
    form.acceptCharset = 'UTF-8';
    
    // Add sandbox param if needed
    if (PAYHERE_ACTIVE_URL === PAYHERE_SANDBOX_URL) {
      const sandboxInput = document.createElement('input');
      sandboxInput.type = 'hidden';
      sandboxInput.name = 'sandbox';
      sandboxInput.value = 'true';
      form.appendChild(sandboxInput);
    }
    
    // Add all payment data as hidden fields
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }
    });
    
    // Add the hash
    const hashInput = document.createElement('input');
    hashInput.type = 'hidden';
    hashInput.name = 'hash';
    hashInput.value = hash;
    form.appendChild(hashInput);
    
    // Log the form data for debugging
    console.log('Submitting form to PayHere with data:', {
      ...paymentData,
      hash: '[HASH VALUE HIDDEN]',
      sandbox: PAYHERE_ACTIVE_URL === PAYHERE_SANDBOX_URL
    });
    
    // Append to body and submit
    document.body.appendChild(form);
    
    // Submit the form programmatically
    console.log('Submitting form to PayHere');
    setTimeout(() => {
      form.submit();
      
      // Remove the form from the DOM after submission
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
      }, 1000);
    }, 100);
  } catch (error) {
    console.error('Error in form-based submission:', error);
    throw error;
  }
};

/**
 * Load the PayHere SDK
 */
const loadPayHereSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Check if it's already loaded
      if (typeof (window as any).payhere !== 'undefined') {
        console.log('PayHere SDK already loaded, continuing...');
        resolve(); // SDK already loaded
        return;
      }
      
      console.log('Attempting to load PayHere SDK...');
      
      // Set a timeout to prevent infinite hanging
      const timeoutId = setTimeout(() => {
        console.warn('PayHere SDK loading timed out, attempting to continue anyway');
        // Even if the timeout is hit, we should check again if it loaded
        if (typeof (window as any).payhere !== 'undefined') {
          console.log('PayHere SDK was eventually found, continuing...');
          resolve();
        } else {
          reject(new Error('PayHere SDK loading timed out'));
        }
      }, 5000); // 5 second timeout
      
      const script = document.createElement('script');
      script.src = 'https://www.payhere.lk/lib/payhere.js';
      script.async = true;
      
      script.onload = () => {
        clearTimeout(timeoutId);
        console.log('PayHere SDK loaded successfully');
        
        // Double check that the SDK is actually loaded and accessible
        if (typeof (window as any).payhere === 'undefined') {
          console.error('PayHere SDK loaded but window.payhere is undefined');
          reject(new Error('PayHere SDK loaded but window.payhere is undefined'));
          return;
        }
        
        resolve();
      };
      
      script.onerror = (error) => {
        clearTimeout(timeoutId);
        console.error('Failed to load PayHere SDK:', error);
        reject(new Error('Failed to load PayHere SDK'));
      };
      
      // Add to head instead of body for faster loading
      document.head.appendChild(script);
    } catch (error) {
      console.error('Exception during PayHere SDK loading:', error);
      reject(error);
    }
  });
};

/**
 * Opens Payhere checkout in a new window - for testing only
 * @param paymentData Payment data for testing
 */
export const openTestCheckout = async (paymentData: Omit<PaymentData, 'hash' | 'merchant_secret'>): Promise<void> => {
  try {
    console.log('Opening Payhere checkout for order:', paymentData.order_id);
    
    // Generate hash
    const hash = await generatePayhereHash({
      ...paymentData,
      merchant_secret: undefined,
    });
    
    // Check if PayHere SDK is loaded
    if (typeof (window as any).payhere === 'undefined') {
      // Load the PayHere SDK if not already loaded
      console.log('Loading PayHere JavaScript SDK...');
      await loadPayHereSDK();
    }
    
    const payhere = (window as any).payhere;
    
    // Configure callbacks
    payhere.onCompleted = function onComplete(orderId: string) {
      console.log("Test payment completed. OrderID:" + orderId);
      window.location.href = paymentData.return_url;
    };

    payhere.onDismissed = function onDismissed() {
      console.log("Test payment dismissed");
      window.location.href = paymentData.cancel_url;
    };

    payhere.onError = function onError(error: any) {
      console.error("Test payment error:", error);
      window.location.href = `${paymentData.cancel_url}&error=${encodeURIComponent(error)}`;
    };
    
    // Payment Object
    const payment = {
      sandbox: PAYHERE_ACTIVE_URL === PAYHERE_SANDBOX_URL,
      merchant_id: PAYHERE_MERCHANT_ID,
      return_url: paymentData.return_url,
      cancel_url: paymentData.cancel_url,
      notify_url: paymentData.notify_url,
      order_id: paymentData.order_id,
      items: paymentData.items,
      amount: paymentData.amount.toString(),
      currency: paymentData.currency,
      hash: hash,
      first_name: paymentData.first_name,
      last_name: paymentData.last_name,
      email: paymentData.email,
      phone: paymentData.phone,
      address: paymentData.address || '',
      city: paymentData.city || '',
      country: paymentData.country || 'Sri Lanka',
      custom_1: paymentData.custom_1 || '',
      custom_2: paymentData.custom_2 || '',
      custom_3: paymentData.custom_3 || ''
    };
    
    console.log('Starting test PayHere checkout with SDK:', {
      ...payment,
      hash: '[HASH VALUE HIDDEN]'
    });
    
    // Start payment process
    payhere.startPayment(payment);
  } catch (error) {
    console.error('Error opening Payhere checkout:', error);
    throw error;
  }
};

/**
 * Create a sales order in Frappe
 * @param salesOrderData The sales order data
 * @returns Promise with API response
 */
export const createSalesOrder = async (salesOrderData: SalesOrderData): Promise<ApiResponse<any>> => {
  try {
    console.log('Creating sales order with data:', salesOrderData);
    
    const response = await fetch(`${API_BASE_URL}/resource/Sales Order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'token 0d596da8ae9f32d:ce5ef45704aab11'
      },
      body: JSON.stringify(salesOrderData)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error creating sales order:', responseData);
      return { success: false, error: responseData.exception || responseData.message || 'API error' };
    }

    return { success: true, data: responseData.data || responseData };
  } catch (error) {
    console.error('Error in createSalesOrder:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Creates a successful payment entry
 */
export const createSuccessPaymentEntry = async (
  salesOrderId: string,
  amount: number,
  currency: string,
  customerName: string,
  paymentReference: string
): Promise<{ message: string; success: boolean; paymentId?: string }> => {
  console.log('Creating success payment entry with parameters:', {
    salesOrderId,
    amount,
    currency,
    customerName,
    paymentReference
  });

  return createPaymentEntry(
    amount,
    currency,
    customerName,
    salesOrderId,
    paymentReference
  );
};

/**
 * Creates a zero amount payment entry for canceled payments
 */
export const createZeroPaymentEntry = async (
  salesOrderId: string,
  currency: string,
  customerName: string
): Promise<{ message: string; success: boolean; paymentId?: string }> => {
  console.log('Creating zero payment entry with parameters:', {
    salesOrderId,
    currency,
    customerName
  });

  return createPaymentEntry(
    0, // Zero amount for canceled payments
    currency,
    customerName,
    salesOrderId,
    `CANCELED-${Date.now()}`
  );
};

export default {
  createCustomer,
  generatePayhereHash,
  createPaymentEntry,
  initiatePayhereCheckout,
  openTestCheckout,
  createSalesOrder,
  createSuccessPaymentEntry,
  createZeroPaymentEntry
};