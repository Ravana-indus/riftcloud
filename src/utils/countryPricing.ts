// Remove incorrect import and define our own interface
// import { GeolocationResponse } from '@vercel/edge';

// Define our own geo response interface
export interface GeolocationResponse {
  country?: string;
  city?: string;
  region?: string;
}

export interface PricingOption {
  normalPrice: string;
  discountedPrice: string;
  currency: string;
  currencySymbol: string;
  hasInPerson: boolean;
  inPersonNormalPrice?: string;
  inPersonDiscountedPrice?: string;
}

export interface CountryPricing {
  [key: string]: PricingOption;
}

export const COUNTRY_PRICING: CountryPricing = {
  'LK': {
    normalPrice: '9999',
    discountedPrice: '7999',
    currency: 'LKR',
    currencySymbol: 'Rs.',
    hasInPerson: true,
    inPersonNormalPrice: '12999',
    inPersonDiscountedPrice: '9999'
  },
  'EU': {
    normalPrice: '130',
    discountedPrice: '99',
    currency: 'EUR',
    currencySymbol: '€',
    hasInPerson: false
  },
  'GB': {
    normalPrice: '120',
    discountedPrice: '89',
    currency: 'GBP',
    currencySymbol: '£',
    hasInPerson: false
  },
  'CA': {
    normalPrice: '130',
    discountedPrice: '99',
    currency: 'CAD',
    currencySymbol: 'CA$',
    hasInPerson: false
  },
  'IN': {
    normalPrice: '3500',
    discountedPrice: '2350',
    currency: 'INR',
    currencySymbol: '₹',
    hasInPerson: false
  },
  'default': {
    normalPrice: '130',
    discountedPrice: '99',
    currency: 'USD',
    currencySymbol: '$',
    hasInPerson: false
  }
};

// European Union country codes
export const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

export function getPricingByCountry(countryCode: string | undefined): PricingOption {
  if (!countryCode) return COUNTRY_PRICING.default;
  
  // Check if it's an EU country
  if (EU_COUNTRIES.includes(countryCode)) {
    return COUNTRY_PRICING.EU;
  }
  
  return COUNTRY_PRICING[countryCode] || COUNTRY_PRICING.default;
}

// Function to format price with currency symbol
export function formatPrice(price: string, currencySymbol: string): string {
  return `${currencySymbol} ${price}`;
}

// Define a pricing multiplier for different course types
export const COURSE_TYPE_MULTIPLIERS = {
  'Weekdays Intensive': 1.0,  // Base price (no change)
  'Weekend Intensive': 1.1,   // 10% more expensive
  'Weekdays Extensive': 1.2,  // 20% more expensive
  'Weekend Extensive': 1.3,   // 30% more expensive
};

// Constants for discounts
export const FAMILY_DISCOUNT = 0.10; // 10% discount for family registration
export const PROMO_CODE_DISCOUNT = 0.15; // 15% discount for valid promo codes

/**
 * Verify if a promo code is valid by checking against the API
 * @param promoCode - The promo code to verify
 * @returns Promise resolving to boolean indicating validity
 */
export async function verifyPromoCode(promoCode: string): Promise<boolean> {
  if (!promoCode) return false;
  
  try {
    // API endpoint to verify coupon code
    const API_BASE_URL = 'https://portal.riftuni.com/api';
    
    // Check if coupon code exists
    const response = await fetch(`${API_BASE_URL}/resource/Coupon Code?filters=[["coupon_code","=","${promoCode}"]]`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'token ' + 'a9612959b012965:a6662956880fba6', // Should ideally be from an environment variable
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify promo code');
    }
    
    const data = await response.json();
    
    // If data.data is an array and has at least one entry, the code is valid
    return data.data && Array.isArray(data.data) && data.data.length > 0;
  } catch (error) {
    console.error('Error verifying promo code:', error);
    return false;
  }
}

/**
 * Calculate the final price based on all factors
 * @param countryCode - Country code for location-based pricing
 * @param preferredMode - 'Online' or 'In-Person'
 * @param preferredType - Course speed/type
 * @param withFamily - Whether registering with a family member
 * @param promoCode - Promo code (optional)
 * @param promoCodeVerified - Whether promo code has been verified (optional)
 * @returns Object with amount, currency, and formatted price
 */
export function calculateFinalPrice(
  countryCode: string,
  preferredMode: 'Online' | 'In-Person',
  preferredType: 'Weekdays Intensive' | 'Weekend Intensive' | 'Weekdays Extensive' | 'Weekend Extensive',
  withFamily: boolean,
  promoCode?: string,
  promoCodeVerified?: boolean
): { amount: number; currency: string; formattedPrice: string; discounts: { family: boolean; promoCode: boolean } } {
  // Get base pricing for the country
  const pricing = getPricingByCountry(countryCode);
  
  // Determine base price based on mode (online or in-person)
  let basePrice: number;
  if (preferredMode === 'Online') {
    basePrice = parseFloat(pricing.discountedPrice);
  } else {
    // In-person mode - if not available for this country, default to online
    basePrice = pricing.hasInPerson && pricing.inPersonDiscountedPrice 
      ? parseFloat(pricing.inPersonDiscountedPrice) 
      : parseFloat(pricing.discountedPrice);
  }
  
  // Create discount tracker
  const discounts = {
    family: false,
    promoCode: false
  };
  
  // Apply course type multiplier for Extensive courses only
  // As per requirements: "same for Intensive, non intensive"
  if (preferredType.includes('Extensive')) {
    const typeMultiplier = COURSE_TYPE_MULTIPLIERS[preferredType];
    basePrice = basePrice * typeMultiplier;
  }
  
  // Start with base price
  let finalPrice = basePrice;
  
  // Apply family discount if applicable
  if (withFamily) {
    finalPrice = finalPrice * (1 - FAMILY_DISCOUNT);
    discounts.family = true;
  }
  
  // Apply promo code discount if verified
  if (promoCode && promoCodeVerified) {
    finalPrice = finalPrice * (1 - PROMO_CODE_DISCOUNT);
    discounts.promoCode = true;
  }
  
  // Round to 2 decimal places
  finalPrice = Math.round(finalPrice * 100) / 100;
  
  // Format for display
  const formattedPrice = formatPrice(finalPrice.toString(), pricing.currencySymbol);
  
  return {
    amount: finalPrice,
    currency: pricing.currency,
    formattedPrice: formattedPrice,
    discounts
  };
} 