import { useState, useEffect } from 'react';
import { GeolocationResponse } from '@/utils/countryPricing';

export function useGeoLocation() {
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGeoLocation() {
      try {
        // Using ipinfo.io as a free geolocation API
        const response = await fetch('https://ipinfo.io/json?token=16e37cef5507f5');
        
        if (!response.ok) {
          throw new Error('Failed to fetch geolocation data');
        }
        
        const data = await response.json();
        setCountry(data.country);
      } catch (err) {
        console.error('Error fetching geolocation:', err);
        setError('Failed to detect your location. Please select your country manually.');
      } finally {
        setLoading(false);
      }
    }

    fetchGeoLocation();
  }, []);

  return { country, loading, error };
} 