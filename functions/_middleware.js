// Middleware function to ensure correct MIME types for JavaScript files
export async function onRequest({ request, next }) {
  // Get the response from the origin
  const response = await next();
  
  // Get the URL and pathname
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Only modify JavaScript files
  if (pathname.endsWith('.js') || pathname.endsWith('.mjs')) {
    // Create a new response with the correct Content-Type header
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers)
    });
    
    // Set the correct MIME type for JavaScript
    newResponse.headers.set('Content-Type', 'application/javascript; charset=utf-8');
    
    return newResponse;
  }
  
  // Return the original response for other file types
  return response;
}
