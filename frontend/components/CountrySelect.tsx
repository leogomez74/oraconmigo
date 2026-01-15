'use client';

import { useState, useRef, useEffect } from 'react';
import { countries } from '@/lib/countries';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function CountrySelect({ value, onChange, error }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (countryName: string) => {
    onChange(countryName);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 max-h-[600px]:px-3 max-h-[600px]:py-2.5 sm:px-5 sm:py-3.5 md:px-5 md:py-4 text-sm sm:text-base md:text-base text-left border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 ${
          value ? 'text-black' : 'text-gray-400'
        } ${error ? 'border-red-500' : 'border-blue-300'}`}
      >
        {value || 'Selecciona tu país'}
      </button>

      {error && (
        <p className="mt-2 text-xs sm:text-sm text-red-600">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-blue-300 rounded-xl shadow-lg max-h-80 overflow-hidden">
          <div className="p-3 sm:p-4 md:p-4 border-b border-blue-200 sticky top-0 bg-white">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar país..."
              className="w-full px-4 py-3 max-h-[600px]:px-3 max-h-[600px]:py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base text-black bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              autoFocus
            />
          </div>

          <div className="overflow-y-auto max-h-64 hide-scrollbar">
            {filteredCountries.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-500 text-sm sm:text-base">
                No se encontraron países
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country.name)}
                  className={`w-full px-4 py-3.5 max-h-[600px]:px-3 max-h-[600px]:py-3 sm:px-5 sm:py-4 text-left text-sm sm:text-base hover:bg-blue-50 active:bg-blue-100 transition-all duration-150 ${
                    value === country.name ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {country.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
