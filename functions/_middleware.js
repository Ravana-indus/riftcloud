// Middleware function to ensure correct MIME types for JavaScript files
export async function onRequest({ request, next }) {
  // Get the response from the origin
  const response = await next();
  
  // Get the URL and pathname
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Create a new response with the correct Content-Type header
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers)
  });
  
  // Set security headers for all responses
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Handle JavaScript files
  if (pathname.endsWith('.js') || pathname.endsWith('.mjs')) {
    newResponse.headers.set('Content-Type', 'application/javascript; charset=utf-8');
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Handle API routes
  if (pathname.startsWith('/api/')) {
    newResponse.headers.set('Cache-Control', 'no-store, no-cache');
    newResponse.headers.set('Pragma', 'no-cache');
    newResponse.headers.set('Expires', '0');
    // Set CORS headers for API routes if needed
    if (process.env.ALLOWED_ORIGINS) {
      newResponse.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS);
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }
  }
  
  return newResponse;
}
