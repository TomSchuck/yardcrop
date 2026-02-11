"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FilterChips, { FilterCategory } from "@/components/FilterChips";
import ListingCard from "@/components/ListingCard";
import ListingDetail from "@/components/ListingDetail";
import MobileTabBar from "@/components/MobileTabBar";
import FloatingActionButton from "@/components/FloatingActionButton";
import { ListingCardData } from "@/lib/types";
import { useListings } from "@/contexts/ListingsContext";
import { FlyToLocation } from "@/components/Map";

// Dynamic import for Map to avoid SSR issues with Mapbox
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-cream flex items-center justify-center">
      <div className="text-warm-gray">Loading map...</div>
    </div>
  ),
});

// Default user location (center of North County SD)
const DEFAULT_LOCATION = {
  latitude: 33.13,
  longitude: -117.27,
};

// Component that handles URL params (needs Suspense)
function SearchParamsHandler({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const selectedParam = searchParams.get("selected");
    if (selectedParam) {
      onSelect(selectedParam);
      // Clear the URL parameter without causing a navigation
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams, onSelect]);

  return null;
}

function HomeContent() {
  const { getFilteredListings, getCategoryCounts } = useListings();

  // UI state
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Map location state (for geocoding)
  const [flyToLocation, setFlyToLocation] = useState<FlyToLocation | null>(null);

  // Get listings from context (reactive to context changes)
  const listings: ListingCardData[] = getFilteredListings(
    { category: activeFilter, searchQuery },
    DEFAULT_LOCATION
  );
  const categoryCounts = getCategoryCounts();

  // Handle URL parameter selection
  const handleUrlSelect = useCallback((id: string) => {
    setSelectedListingId(id);
    setShowDetail(true);
  }, []);

  // Handle listing selection
  const handleListingSelect = useCallback((id: string) => {
    setSelectedListingId(id);
    setShowDetail(true);
  }, []);

  // Handle closing detail view
  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filter: FilterCategory) => {
    setActiveFilter(filter);
    setSelectedListingId(null);
    setShowDetail(false);
  }, []);

  // Handle search change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setSelectedListingId(null);
    setShowDetail(false);
  }, []);

  // Handle location selection from geocoding
  const handleLocationSelect = useCallback(
    (location: { latitude: number; longitude: number; placeName: string }) => {
      setFlyToLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: 14,
      });
      // Clear the flyTo after a short delay to allow re-triggering same location
      setTimeout(() => setFlyToLocation(null), 100);
    },
    []
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <svg
        className="w-16 h-16 text-warm-gray mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-charcoal mb-2">No produce found</h3>
      <p className="text-warm-gray text-sm max-w-xs">
        {searchQuery
          ? `No results for "${searchQuery}". Try a different search term.`
          : `No ${activeFilter === "all" ? "" : activeFilter} listings nearby. Try zooming out or changing filters.`}
      </p>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Handle URL params */}
      <Suspense fallback={null}>
        <SearchParamsHandler onSelect={handleUrlSelect} />
      </Suspense>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Desktop & Tablet */}
        <div className="hidden md:flex md:w-[40%] lg:w-[40%] flex-col bg-soft-white border-r border-border">
          {/* Detail View (slides over cards) */}
          {showDetail && selectedListingId ? (
            <ListingDetail listingId={selectedListingId} onClose={handleCloseDetail} />
          ) : (
            <>
              {/* Search & Filters */}
              <div className="p-4 border-b border-border space-y-3">
                <SearchBar
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onLocationSelect={handleLocationSelect}
                />
                <FilterChips
                  activeFilter={activeFilter}
                  onFilterChange={handleFilterChange}
                  counts={categoryCounts}
                />
              </div>

              {/* Listing Cards */}
              <div className="flex-1 overflow-y-auto p-4">
                <h2 className="text-lg font-bold text-charcoal mb-4">
                  Nearby Produce
                  <span className="text-warm-gray font-normal text-sm ml-2">
                    ({listings.length} {listings.length === 1 ? "listing" : "listings"})
                  </span>
                </h2>

                {listings.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        isSelected={selectedListingId === listing.id}
                        onClick={() => handleListingSelect(listing.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Map - Desktop & Tablet */}
        <div className="hidden md:block md:w-[60%] lg:w-[60%]">
          <Map
            className="w-full h-full"
            listings={listings}
            selectedListingId={selectedListingId}
            onListingSelect={handleListingSelect}
            flyToLocation={flyToLocation}
          />
        </div>

        {/* Mobile Layout */}
        <div className="flex-1 md:hidden flex flex-col relative">
          {/* Mobile Detail View (full screen overlay) */}
          {showDetail && selectedListingId && (
            <div className="absolute inset-0 z-20 bg-soft-white">
              <ListingDetail listingId={selectedListingId} onClose={handleCloseDetail} />
            </div>
          )}

          {/* Mobile: Map View */}
          {mobileTab === "map" && (
            <div className="flex-1 relative">
              {/* Floating Search & Filters */}
              <div className="absolute top-0 left-0 right-0 z-10 p-3 space-y-2">
                <SearchBar
                  className="shadow-md"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onLocationSelect={handleLocationSelect}
                />
                <FilterChips
                  activeFilter={activeFilter}
                  onFilterChange={handleFilterChange}
                />
              </div>

              {/* Map */}
              <Map
                className="w-full h-full"
                listings={listings}
                selectedListingId={selectedListingId}
                onListingSelect={handleListingSelect}
                flyToLocation={flyToLocation}
              />

              {/* Floating Action Button */}
              <div className="absolute bottom-4 right-4 z-10">
                <FloatingActionButton />
              </div>
            </div>
          )}

          {/* Mobile: List View */}
          {mobileTab === "list" && (
            <div className="flex-1 flex flex-col bg-soft-white">
              {/* Search & Filters */}
              <div className="p-3 border-b border-border space-y-2">
                <SearchBar
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onLocationSelect={handleLocationSelect}
                />
                <FilterChips
                  activeFilter={activeFilter}
                  onFilterChange={handleFilterChange}
                  counts={categoryCounts}
                />
              </div>

              {/* Listing Cards */}
              <div className="flex-1 overflow-y-auto p-3">
                <h2 className="text-lg font-bold text-charcoal mb-3">
                  Nearby Produce
                  <span className="text-warm-gray font-normal text-sm ml-2">
                    ({listings.length})
                  </span>
                </h2>

                {listings.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-3">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        isSelected={selectedListingId === listing.id}
                        onClick={() => handleListingSelect(listing.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Floating Action Button */}
              <div className="absolute bottom-20 right-4 z-10">
                <FloatingActionButton />
              </div>
            </div>
          )}

          {/* Mobile Tab Bar */}
          <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
