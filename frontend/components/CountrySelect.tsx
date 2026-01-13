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
        className={`w-full px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base text-left border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-800 ${
          value ? 'text-white' : 'text-gray-500'
        } ${error ? 'border-red-500' : 'border-gray-700'}`}
      >
        {value || 'Selecciona tu país'}
      </button>

      {error && (
        <p className="mt-2 text-xs sm:text-sm text-red-600">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-lg max-h-80 overflow-hidden">
          <div className="p-2 sm:p-3 border-b border-gray-700 sticky top-0 bg-gray-800">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar país..."
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder:text-gray-500"
              autoFocus
            />
          </div>

          <div className="overflow-y-auto max-h-64 hide-scrollbar">
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400 text-sm sm:text-base">
                No se encontraron países
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country.name)}
                  className={`w-full px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base hover:bg-gray-700 active:bg-gray-600 transition-all duration-150 ${
                    value === country.name ? 'bg-gray-700 text-yellow-500 font-medium' : 'text-gray-300'
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
