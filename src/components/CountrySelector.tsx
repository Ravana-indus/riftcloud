import React from 'react';
import { COUNTRY_PRICING, EU_COUNTRIES } from '@/utils/countryPricing';
import { GlobeIcon } from 'lucide-react';

interface CountrySelectorProps {
  selectedCountry: string;
  onChange: (countryCode: string) => void;
  compact?: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onChange,
  compact = false
}) => {
  // Create list of country options
  const countryOptions = [
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'EU', name: 'European Union' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'IN', name: 'India' },
    { code: 'default', name: 'Rest of World' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`flex items-center space-x-2 ${compact ? '' : 'mt-1'}`}>
      <div className={`${compact ? 'bg-blue-50' : 'bg-blue-100'} p-2 rounded-full`}>
        <GlobeIcon className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600`} />
      </div>
      <select
        value={selectedCountry}
        onChange={handleChange}
        className={`${compact ? 'h-8 text-xs' : 'h-10 text-sm'} rounded-md border border-input bg-background px-3 py-1 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {countryOptions.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name} {COUNTRY_PRICING[country.code]?.currencySymbol && `(${COUNTRY_PRICING[country.code].currencySymbol})`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector; 