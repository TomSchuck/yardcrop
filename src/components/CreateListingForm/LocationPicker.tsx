"use client";

import { useState, useCallback } from "react";
import { Map as MapGL, Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

// North County San Diego center
const DEFAULT_CENTER = {
  latitude: 33.13,
  longitude: -117.27,
};

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const [viewState, setViewState] = useState({
    latitude: latitude || DEFAULT_CENTER.latitude,
    longitude: longitude || DEFAULT_CENTER.longitude,
    zoom: latitude ? 14 : 11,
  });

  const handleClick = useCallback(
    (e: { lngLat: { lat: number; lng: number } }) => {
      onChange(e.lngLat.lat, e.lngLat.lng);
    },
    [onChange]
  );

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-charcoal">
          Location <span className="text-error-red">*</span>
        </label>
        <div className="h-48 bg-cream rounded-lg flex items-center justify-center">
          <p className="text-warm-gray text-sm">Map unavailable - Mapbox token not configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-charcoal">
        Location <span className="text-error-red">*</span>
      </label>
      <p className="text-xs text-warm-gray">Tap the map to set your pickup location</p>
      <div className="h-48 rounded-lg overflow-hidden border border-border">
        <MapGL
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={handleClick}
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          style={{ width: "100%", height: "100%" }}
        >
          {latitude && longitude && (
            <Marker latitude={latitude} longitude={longitude} anchor="bottom">
              <div className="w-8 h-8 bg-garden-green rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Marker>
          )}
          <NavigationControl position="top-right" showCompass={false} />
        </MapGL>
      </div>
      {latitude && longitude && (
        <p className="text-xs text-warm-gray">
          Selected: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
      )}
    </div>
  );
}
