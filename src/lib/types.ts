// Produce categories
export type ProduceType = "fruit" | "vegetables" | "herbs" | "eggs" | "other";

// Availability status
export type AvailabilityStatus = "now" | "upcoming";

// Contact method preference
export type ContactMethod = "phone" | "email" | "both";

// Full listing type
export interface Listing {
  id: string;
  produceName: string;
  produceType: ProduceType;
  description: string;
  growerName: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  availability: AvailabilityStatus;
  availabilityDetails?: string; // e.g., "Saturdays 9am-12pm"
  pickupInstructions: string;
  contactMethod: ContactMethod;
  contactPhone?: string;
  contactEmail?: string;
  photoUrl?: string;
  createdAt: string;
  // Dashboard fields
  isActive?: boolean; // Defaults to true, false when deactivated
  isUserCreated?: boolean; // True for session-created listings
  contactRevealCount?: number; // Mock metric for dashboard
}

// For card display (subset of full listing)
export interface ListingCardData {
  id: string;
  produceName: string;
  produceType: ProduceType;
  growerName: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  distance?: string; // Computed client-side
  availability: AvailabilityStatus;
  photoUrl?: string;
}

// Filter options
export interface ListingFilters {
  category: ProduceType | "all";
  searchQuery: string;
}

// Map bounds for spatial queries
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Input for creating a new listing (omits auto-generated fields)
export interface CreateListingInput {
  produceName: string;
  produceType: ProduceType;
  description: string;
  growerName: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  availability: AvailabilityStatus;
  availabilityDetails?: string;
  pickupInstructions: string;
  contactMethod: ContactMethod;
  contactPhone?: string;
  contactEmail?: string;
  photoUrl?: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  neighborhood: string;
  createdAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  displayName: string;
  neighborhood: string;
  agreedToGuidelines: boolean;
}
