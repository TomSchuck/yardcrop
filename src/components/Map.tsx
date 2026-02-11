"use client";

import { useState, useCallback, useEffect } from "react";
import { Map as MapGL, NavigationControl, GeolocateControl, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { ListingCardData } from "@/lib/types";
import ProducePin from "./ProducePin";

// North County San Diego center coordinates
const INITIAL_VIEW = {
  latitude: 33.13,
  longitude: -117.27,
  zoom: 11,
};

interface MapProps {
  className?: string;
  listings?: ListingCardData[];
  selectedListingId?: string | null;
  onListingSelect?: (id: string) => void;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

export default function Map({
  className,
  listings = [],
  selectedListingId,
  onListingSelect,
  onBoundsChange,
}: MapProps) {
  const [viewState, setViewState] = useState(INITIAL_VIEW);

  const handleMove = useCallback(
    (evt: { viewState: typeof viewState }) => {
      setViewState(evt.viewState);
    },
    []
  );

  // Notify parent of bounds changes (for spatial queries)
  const handleMoveEnd = useCallback(() => {
    if (onBoundsChange) {
      // Calculate bounds from center and zoom
      // This is a simplified calculation
      const latRange = 180 / Math.pow(2, viewState.zoom);
      const lngRange = 360 / Math.pow(2, viewState.zoom);
      onBoundsChange({
        north: viewState.latitude + latRange / 2,
        south: viewState.latitude - latRange / 2,
        east: viewState.longitude + lngRange / 2,
        west: viewState.longitude - lngRange / 2,
      });
    }
  }, [viewState, onBoundsChange]);

  // Center map on selected listing
  useEffect(() => {
    if (selectedListingId) {
      const listing = listings.find((l) => l.id === selectedListingId);
      if (listing) {
        setViewState((prev) => ({
          ...prev,
          latitude: listing.latitude,
          longitude: listing.longitude,
          zoom: Math.max(prev.zoom, 13), // Zoom in if zoomed out
        }));
      }
    }
  }, [selectedListingId, listings]);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return (
      <div className={`flex items-center justify-center bg-cream ${className}`}>
        <div className="text-center p-8">
          <p className="text-charcoal font-semibold mb-2">Mapbox token not configured</p>
          <p className="text-warm-gray text-sm">
            Add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <MapGL
        {...viewState}
        onMove={handleMove}
        onMoveEnd={handleMoveEnd}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Render listing pins */}
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            latitude={listing.latitude}
            longitude={listing.longitude}
            anchor="bottom"
          >
            <ProducePin
              produceType={listing.produceType}
              isSelected={selectedListingId === listing.id}
              onClick={() => onListingSelect?.(listing.id)}
            />
          </Marker>
        ))}

        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation
          showUserHeading
        />
      </MapGL>
    </div>
  );
}
