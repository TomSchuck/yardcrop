import { Listing, ProduceType, ListingFilters, MapBounds, ListingCardData } from "./types";
import { MOCK_LISTINGS, calculateDistance, formatDistance } from "./mock-data";

// Simulate network delay for realistic feel
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get all listings with optional filters
export async function getListings(
  filters?: ListingFilters,
  userLocation?: { latitude: number; longitude: number }
): Promise<ListingCardData[]> {
  await delay(100); // Simulate network delay

  let results = [...MOCK_LISTINGS];

  // Apply category filter
  if (filters?.category && filters.category !== "all") {
    results = results.filter((listing) => listing.produceType === filters.category);
  }

  // Apply search filter
  if (filters?.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    results = results.filter(
      (listing) =>
        listing.produceName.toLowerCase().includes(query) ||
        listing.neighborhood.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query)
    );
  }

  // Calculate distances if user location provided
  const withDistance: ListingCardData[] = results.map((listing) => {
    const distance = userLocation
      ? formatDistance(
          calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            listing.latitude,
            listing.longitude
          )
        )
      : undefined;

    return {
      id: listing.id,
      produceName: listing.produceName,
      produceType: listing.produceType,
      growerName: listing.growerName,
      neighborhood: listing.neighborhood,
      latitude: listing.latitude,
      longitude: listing.longitude,
      distance,
      availability: listing.availability,
      photoUrl: listing.photoUrl,
    };
  });

  // Sort by distance if available, otherwise by created date
  if (userLocation) {
    withDistance.sort((a, b) => {
      const distA = parseFloat(a.distance?.replace(" mi", "") || "999");
      const distB = parseFloat(b.distance?.replace(" mi", "") || "999");
      return distA - distB;
    });
  }

  return withDistance;
}

// Get listings within map bounds
export async function getListingsInBounds(
  bounds: MapBounds,
  filters?: ListingFilters
): Promise<ListingCardData[]> {
  await delay(50);

  let results = MOCK_LISTINGS.filter(
    (listing) =>
      listing.latitude >= bounds.south &&
      listing.latitude <= bounds.north &&
      listing.longitude >= bounds.west &&
      listing.longitude <= bounds.east
  );

  // Apply category filter
  if (filters?.category && filters.category !== "all") {
    results = results.filter((listing) => listing.produceType === filters.category);
  }

  // Apply search filter
  if (filters?.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    results = results.filter(
      (listing) =>
        listing.produceName.toLowerCase().includes(query) ||
        listing.neighborhood.toLowerCase().includes(query)
    );
  }

  return results.map((listing) => ({
    id: listing.id,
    produceName: listing.produceName,
    produceType: listing.produceType,
    growerName: listing.growerName,
    neighborhood: listing.neighborhood,
    latitude: listing.latitude,
    longitude: listing.longitude,
    availability: listing.availability,
    photoUrl: listing.photoUrl,
  }));
}

// Get single listing by ID
export async function getListingById(id: string): Promise<Listing | null> {
  await delay(50);
  return MOCK_LISTINGS.find((listing) => listing.id === id) || null;
}

// Search listings
export async function searchListings(query: string): Promise<ListingCardData[]> {
  return getListings({ category: "all", searchQuery: query });
}

// Get listings by category
export async function getListingsByCategory(
  category: ProduceType
): Promise<ListingCardData[]> {
  return getListings({ category, searchQuery: "" });
}

// Get category counts for filter badges
export async function getCategoryCounts(): Promise<Record<ProduceType | "all", number>> {
  await delay(50);

  const counts: Record<ProduceType | "all", number> = {
    all: MOCK_LISTINGS.length,
    fruit: 0,
    vegetables: 0,
    herbs: 0,
    eggs: 0,
    other: 0,
  };

  MOCK_LISTINGS.forEach((listing) => {
    counts[listing.produceType]++;
  });

  return counts;
}

// Get unique neighborhoods (for future autocomplete)
export async function getNeighborhoods(): Promise<string[]> {
  await delay(50);
  const neighborhoods = new Set(MOCK_LISTINGS.map((l) => l.neighborhood));
  return Array.from(neighborhoods).sort();
}
