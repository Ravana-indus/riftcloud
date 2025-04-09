// API Service for Ravana Institute of Future
// This file contains functions to interact with the backend API

import { 
  API_BASE_URL, 
  getApiHeaders, 
  handleApiError, 
  ApiResponse 
} from '@/utils/apiConfig';

// Interface for Lead data
export interface LeadData {
  lead_name: string;
  company_name: string; // Keep for now, default to "Individual"
  first_name: string;
  last_name: string;
  email_id: string;
  mobile_no: string;
  preferred_language: string;
  preferred_time_zone?: 'United Kingdom' | 'India' | 'European Union' | 'Sri Lanka' | 'Canada';
  age: string;
  special_requirements?: string;
  referral_source: string;

  // Location fields
  custom_address?: string;
  custom_city?: string;
  custom_country?: string;

  // Course and payment fields
  custom_preferred_mode?: 'Online' | 'In-Person';
  custom_preferred_type?: 'Weekdays Intensive' | 'Weekend Intensive' | 'Weekdays Extensive' | 'Weekend Extensive';
  custom_payment_method?: 'Bank Transfer' | 'CC/DC - Payhere' | 'CC/DC - Stripe';
  custom_registering_with_a_family_member?: 0 | 1;
  custom_family_member_name?: string;
  custom_promo_code?: string;
  custom_amount?: number;
  custom_currency?: 'LKR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'INR';
  course_interest: string;
}

/**
 * Submit a new lead registration
 * @param leadData - The lead data to be submitted
 * @returns Promise with the API response
 */
export const submitLeadRegistration = async (leadData: LeadData): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/resource/Lead`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        message: errorData.exception || 'Failed to submit lead registration',
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

/**
 * Convert a lead to a student
 * @param leadName - The name of the lead to convert
 * @returns Promise with the API response
 */
export const convertLeadToStudent = async (leadName: string): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/method/ravana_institute.api.lead_to_student.convert_lead_to_student`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({ lead_name: leadName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        message: errorData.exception || 'Failed to convert lead to student',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.message, // Returns the student ID
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all course categories
 * @returns Promise with the API response containing course categories
 */
export const getCourseCategories = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/resource/Course Category`, {
      headers: getApiHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        message: errorData.exception || 'Failed to fetch course categories',
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

/**
 * Get course formats
 * @returns Promise with the API response containing course formats
 */
export const getCourseFormats = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/resource/Course Format`, {
      headers: getApiHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        message: errorData.exception || 'Failed to fetch course formats',
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

/**
 * Get time zones
 * @returns Promise with the API response containing time zones
 */
export const getTimeZones = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/resource/Course Time Zone`, {
      headers: getApiHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        message: errorData.exception || 'Failed to fetch time zones',
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

/**
 * Get available course batches for a program
 * @param programName - The program name to filter batches
 * @returns Promise with the API response containing available batches
 */
export const getAvailableBatches = async (programName: string): Promise<ApiResponse<any>> => {
  try {
    const filters = encodeURIComponent(JSON.stringify([["program","=",programName],["status","=","Upcoming"]]));
    const response = await fetch(`${API_BASE_URL}/resource/Course Batch?filters=${filters}`, {
      headers: getApiHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        message: errorData.exception || 'Failed to fetch available batches',
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

export default {
  submitLeadRegistration,
  convertLeadToStudent,
  getCourseCategories,
  getCourseFormats,
  getTimeZones,
  getAvailableBatches,
};