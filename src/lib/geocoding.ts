// Mapbox Geocoding API helper
// Uses Mapbox Geocoding API v5 (free tier: 100k requests/month)

export interface GeocodingResult {
  id: string;
  placeName: string;
  text: string;
  latitude: number;
  longitude: number;
  placeType: string[];
}

export interface GeocodingResponse {
  features: GeocodingResult[];
  query: string[];
}

// North County San Diego bounding box and center
const NORTH_COUNTY_SD = {
  // Bias results toward this center point
  proximity: { lng: -117.27, lat: 33.13 },
  // Limit results to this bounding box (roughly San Diego County)
  bbox: [-117.6, 32.8, -116.9, 33.5] as [number, number, number, number],
};

/**
 * Geocode a search query using Mapbox Geocoding API
 * Results are biased toward North County San Diego
 */
export async function geocodeSearch(query: string): Promise<GeocodingResult[]> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    console.error("Mapbox token not configured");
    return [];
  }

  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      access_token: token,
      proximity: `${NORTH_COUNTY_SD.proximity.lng},${NORTH_COUNTY_SD.proximity.lat}`,
      bbox: NORTH_COUNTY_SD.bbox.join(","),
      limit: "5",
      types: "address,postcode,place,neighborhood,locality",
      country: "US",
    });

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query.trim())}.json?${params}`
    );

    if (!response.ok) {
      console.error("Geocoding API error:", response.status);
      return [];
    }

    const data = await response.json();

    return data.features.map((feature: {
      id: string;
      place_name: string;
      text: string;
      center: [number, number];
      place_type: string[];
    }) => ({
      id: feature.id,
      placeName: feature.place_name,
      text: feature.text,
      longitude: feature.center[0],
      latitude: feature.center[1],
      placeType: feature.place_type,
    }));
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
}

/**
 * Check if a search query looks like it might be a location
 * (zip code, address-like pattern, or known city names)
 */
export function mightBeLocation(query: string): boolean {
  const trimmed = query.trim();

  // Zip code pattern (5 digits or 5+4)
  if (/^\d{5}(-\d{4})?$/.test(trimmed)) {
    return true;
  }

  // Contains numbers (likely an address)
  if (/\d/.test(trimmed) && trimmed.length >= 5) {
    return true;
  }

  // Common location keywords
  const locationKeywords = [
    "street", "st", "avenue", "ave", "road", "rd", "drive", "dr",
    "lane", "ln", "boulevard", "blvd", "way", "court", "ct",
    "place", "pl", "circle", "cir"
  ];

  const lowerQuery = trimmed.toLowerCase();
  if (locationKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return true;
  }

  return false;
}
