"use client";

import { useState, useEffect, useRef } from "react";
import { geocodeSearch, GeocodingResult, mightBeLocation } from "@/lib/geocoding";

interface SearchBarProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: { latitude: number; longitude: number; placeName: string }) => void;
  debounceMs?: number;
}

export default function SearchBar({
  className,
  value,
  onChange,
  onLocationSelect,
  debounceMs = 300,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const [geocodingResults, setGeocodingResults] = useState<GeocodingResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingGeocode, setIsLoadingGeocode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local value with external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange, debounceMs]);

  // Fetch geocoding suggestions when input might be a location
  useEffect(() => {
    const fetchGeocode = async () => {
      if (!localValue || localValue.trim().length < 3) {
        setGeocodingResults([]);
        return;
      }

      // Only geocode if it looks like a location or after typing 5+ chars
      if (!mightBeLocation(localValue) && localValue.trim().length < 5) {
        setGeocodingResults([]);
        return;
      }

      setIsLoadingGeocode(true);
      try {
        const results = await geocodeSearch(localValue);
        setGeocodingResults(results);
        if (results.length > 0) {
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        setGeocodingResults([]);
      } finally {
        setIsLoadingGeocode(false);
      }
    };

    const timer = setTimeout(fetchGeocode, debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, debounceMs]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    setGeocodingResults([]);
    setShowDropdown(false);
  };

  const handleLocationSelect = (result: GeocodingResult) => {
    if (onLocationSelect) {
      onLocationSelect({
        latitude: result.latitude,
        longitude: result.longitude,
        placeName: result.placeName,
      });
    }
    setLocalValue(result.text);
    setShowDropdown(false);
    setGeocodingResults([]);
  };

  const handleFocus = () => {
    if (geocodingResults.length > 0) {
      setShowDropdown(true);
    }
  };

  const getPlaceTypeIcon = (placeType: string[]) => {
    if (placeType.includes("postcode")) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    // Default location pin for addresses/places
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search icon */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={handleFocus}
        placeholder="Search produce, neighborhood, or address..."
        className="w-full bg-cream border border-border rounded-lg pl-10 pr-10 py-2.5 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
      />

      {/* Clear button or loading/location icon */}
      {localValue ? (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray hover:text-charcoal transition-colors"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      ) : isLoadingGeocode ? (
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )}

      {/* Geocoding results dropdown */}
      {showDropdown && geocodingResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-soft-white border border-border rounded-lg shadow-lg z-50 overflow-hidden"
        >
          <div className="px-3 py-2 text-xs text-warm-gray border-b border-border">
            Locations
          </div>
          {geocodingResults.map((result) => (
            <button
              key={result.id}
              onClick={() => handleLocationSelect(result)}
              className="w-full px-3 py-2.5 flex items-start gap-3 hover:bg-cream transition-colors text-left"
            >
              <span className="text-garden-green mt-0.5 flex-shrink-0">
                {getPlaceTypeIcon(result.placeType)}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-charcoal truncate">
                  {result.text}
                </div>
                <div className="text-xs text-warm-gray truncate">
                  {result.placeName}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
