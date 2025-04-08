import { useState, useEffect } from 'react';
import { ApiResponse } from '@/utils/apiConfig';
import apiService from '@/services/api';

/**
 * Hook for fetching course categories
 * @returns Course categories and loading state
 */
export const useCourseCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCourseCategories();
        
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch course categories');
        }
      } catch (err: any) {
        console.error('Error fetching course categories:', err);
        setError(err.message || 'An error occurred while fetching course categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

/**
 * Hook for fetching course formats
 * @returns Course formats and loading state
 */
export const useCourseFormats = () => {
  const [formats, setFormats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormats = async () => {
      try {
        const response = await apiService.getCourseFormats();
        
        if (response.success && response.data) {
          setFormats(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch course formats');
        }
      } catch (err: any) {
        console.error('Error fetching course formats:', err);
        setError(err.message || 'An error occurred while fetching course formats');
      } finally {
        setLoading(false);
      }
    };

    fetchFormats();
  }, []);

  return { formats, loading, error };
};

/**
 * Hook for fetching time zones
 * @returns Time zones and loading state
 */
export const useTimeZones = () => {
  const [timeZones, setTimeZones] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeZones = async () => {
      try {
        const response = await apiService.getTimeZones();
        
        if (response.success && response.data) {
          setTimeZones(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch time zones');
        }
      } catch (err: any) {
        console.error('Error fetching time zones:', err);
        setError(err.message || 'An error occurred while fetching time zones');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeZones();
  }, []);

  return { timeZones, loading, error };
};

/**
 * Hook for fetching available batches for a program
 * @param programName - The program name to filter batches
 * @returns Available batches and loading state
 */
export const useAvailableBatches = (programName: string) => {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      if (!programName) {
        setBatches([]);
        setLoading(false);
        return;
      }
      
      try {
        const response = await apiService.getAvailableBatches(programName);
        
        if (response.success && response.data) {
          setBatches(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch available batches');
        }
      } catch (err: any) {
        console.error('Error fetching available batches:', err);
        setError(err.message || 'An error occurred while fetching available batches');
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [programName]);

  return { batches, loading, error };
};

/**
 * Hook for handling lead registration submission
 * @returns Lead registration functions and state
 */
export const useLeadRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [leadId, setLeadId] = useState<string | null>(null);

  const submitRegistration = async (leadData: any): Promise<ApiResponse<any>> => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    setLeadId(null);
    
    try {
      const response = await apiService.submitLeadRegistration(leadData);
      
      if (response.success && response.data) {
        setSuccess(true);
        setLeadId(response.data.name);
      } else {
        throw new Error(response.error || 'Failed to submit registration');
      }
      
      return response;
    } catch (err: any) {
      console.error('Error submitting registration:', err);
      setError(err.message || 'An error occurred while submitting your registration');
      
      return {
        success: false,
        error: err.message || 'An error occurred while submitting your registration'
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    submitRegistration, 
    isSubmitting, 
    error, 
    success, 
    leadId,
    reset: () => {
      setError(null);
      setSuccess(false);
      setLeadId(null);
    }
  };
}; 