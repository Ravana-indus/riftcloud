// API endpoint to act as a CORS proxy for Payhere
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests for actual proxying
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { url, method = 'POST', body = {}, headers = {} } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    console.log(`Proxying request to: ${url}`);
    console.log('Request body:', body);

    // Make the actual request to the target URL
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    // Get response data
    const data = await response.json().catch(() => ({}));
    
    // Return the proxied response
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      message: 'Error proxying request',
      error: error.message
    });
  }
} 