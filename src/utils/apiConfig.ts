/**
 * API Configuration for Ravana Institute of Future
 */

/**
 * Base URL for Frappe API
 */
// Check if we're in a browser environment and handle accordingly
const isBrowser = typeof window !== 'undefined';

// Safe way to access window variables with TypeScript
const getWindowVar = (name: string, defaultValue: string): string => {
  if (!isBrowser) return defaultValue;
  return (window as any)[name] || defaultValue;
};

// Use environment variables safely with fallbacks
export const API_BASE_URL = isBrowser 
  ? getWindowVar('FRAPPE_API_URL', 'https://portal.riftuni.com/api')
  : (process.env.NEXT_PUBLIC_FRAPPE_API_URL || 'https://portal.riftuni.com/api');

/**
 * API Key for Frappe API
 */
export const API_KEY = isBrowser
  ? getWindowVar('FRAPPE_API_KEY', '0d596da8ae9f32d')
  : (process.env.FRAPPE_API_KEY || '0d596da8ae9f32d');

/**
 * API Secret for Frappe API
 */
export const API_SECRET = isBrowser
  ? getWindowVar('FRAPPE_API_SECRET', 'ce5ef45704aab11')
  : (process.env.FRAPPE_API_SECRET || 'ce5ef45704aab11');

/**
 * Get headers for Frappe API with authentication
 */
export const getApiHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `token ${API_KEY}:${API_SECRET}`
  };
};

/**
 * Error handling helper for API requests
 * @param error The error object
 * @returns Standardized error response
 */
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  return {
    success: false,
    error: error.message || 'An unknown error occurred',
    statusCode: error.statusCode || 500,
  };
};

/**
 * API Response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export default {
  API_BASE_URL,
  API_KEY,
  API_SECRET,
  getApiHeaders,
  handleApiError,
}; 