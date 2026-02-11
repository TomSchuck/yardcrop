"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Listing, ListingCardData, CreateListingInput, ProduceType } from "@/lib/types";
import { MOCK_LISTINGS, calculateDistance, formatDistance } from "@/lib/mock-data";

interface ListingsContextValue {
  listings: Listing[];
  addListing: (input: CreateListingInput) => Listing;
  updateListing: (id: string, input: Partial<CreateListingInput>) => Listing | null;
  deleteListing: (id: string) => boolean;
  toggleListingActive: (id: string) => Listing | null;
  getListingById: (id: string) => Listing | null;
  getFilteredListings: (
    filters?: { category?: ProduceType | "all"; searchQuery?: string },
    userLocation?: { latitude: number; longitude: number }
  ) => ListingCardData[];
  getCategoryCounts: () => Record<ProduceType | "all", number>;
  getUserCreatedListings: () => Listing[];
  userCreatedCount: number;
}

const ListingsContext = createContext<ListingsContextValue | null>(null);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([...MOCK_LISTINGS]);

  const addListing = useCallback((input: CreateListingInput): Listing => {
    const newListing: Listing = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isActive: true,
      isUserCreated: true,
      contactRevealCount: 0,
    };
    setListings((prev) => [newListing, ...prev]);
    return newListing;
  }, []);

  const updateListing = useCallback(
    (id: string, input: Partial<CreateListingInput>): Listing | null => {
      let updatedListing: Listing | null = null;
      setListings((prev) =>
        prev.map((listing) => {
          if (listing.id === id) {
            updatedListing = { ...listing, ...input };
            return updatedListing;
          }
          return listing;
        })
      );
      return updatedListing;
    },
    []
  );

  const deleteListing = useCallback((id: string): boolean => {
    let deleted = false;
    setListings((prev) => {
      const filtered = prev.filter((listing) => listing.id !== id);
      deleted = filtered.length < prev.length;
      return filtered;
    });
    return deleted;
  }, []);

  const toggleListingActive = useCallback((id: string): Listing | null => {
    let toggledListing: Listing | null = null;
    setListings((prev) =>
      prev.map((listing) => {
        if (listing.id === id) {
          toggledListing = {
            ...listing,
            isActive: listing.isActive === false ? true : false,
          };
          return toggledListing;
        }
        return listing;
      })
    );
    return toggledListing;
  }, []);

  const getListingById = useCallback(
    (id: string): Listing | null => {
      return listings.find((l) => l.id === id) || null;
    },
    [listings]
  );

  const getFilteredListings = useCallback(
    (
      filters?: { category?: ProduceType | "all"; searchQuery?: string },
      userLocation?: { latitude: number; longitude: number }
    ): ListingCardData[] => {
      // Only show active listings (or those without isActive set, for backward compat)
      let results = listings.filter((l) => l.isActive !== false);

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

      // Map to card data with distance
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

      // Sort by distance if available
      if (userLocation) {
        withDistance.sort((a, b) => {
          const distA = parseFloat(a.distance?.replace(" mi", "") || "999");
          const distB = parseFloat(b.distance?.replace(" mi", "") || "999");
          return distA - distB;
        });
      }

      return withDistance;
    },
    [listings]
  );

  const getCategoryCounts = useCallback((): Record<ProduceType | "all", number> => {
    // Only count active listings
    const activeListings = listings.filter((l) => l.isActive !== false);
    const counts: Record<ProduceType | "all", number> = {
      all: activeListings.length,
      fruit: 0,
      vegetables: 0,
      herbs: 0,
      eggs: 0,
      other: 0,
    };

    activeListings.forEach((listing) => {
      counts[listing.produceType]++;
    });

    return counts;
  }, [listings]);

  const getUserCreatedListings = useCallback((): Listing[] => {
    return listings.filter((l) => l.isUserCreated === true);
  }, [listings]);

  const userCreatedCount = listings.filter((l) => l.isUserCreated === true).length;

  return (
    <ListingsContext.Provider
      value={{
        listings,
        addListing,
        updateListing,
        deleteListing,
        toggleListingActive,
        getListingById,
        getFilteredListings,
        getCategoryCounts,
        getUserCreatedListings,
        userCreatedCount,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error("useListings must be used within a ListingsProvider");
  }
  return context;
}
