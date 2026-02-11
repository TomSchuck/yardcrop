"use client";

import { useState, useEffect } from "react";
import { useListings } from "@/contexts/ListingsContext";

interface ListingDetailProps {
  listingId: string;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  fruit: "bg-red-100 text-red-800",
  vegetables: "bg-green-100 text-green-800",
  herbs: "bg-emerald-100 text-emerald-800",
  eggs: "bg-amber-100 text-amber-800",
  other: "bg-gray-100 text-gray-800",
};

export default function ListingDetail({ listingId, onClose }: ListingDetailProps) {
  const { getListingById } = useListings();
  const [showContact, setShowContact] = useState(false);

  // Reset contact visibility when listing changes
  useEffect(() => {
    setShowContact(false);
  }, [listingId]);

  const listing = getListingById(listingId);

  if (!listing) {
    return (
      <div className="bg-soft-white h-full flex items-center justify-center">
        <div className="text-warm-gray">Listing not found</div>
      </div>
    );
  }

  return (
    <div className="bg-soft-white h-full flex flex-col overflow-hidden">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-warm-gray hover:text-charcoal transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Photo placeholder */}
        <div className="relative h-48 bg-cream flex items-center justify-center">
          {listing.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.photoUrl}
              alt={listing.produceName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-warm-gray">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {/* Type badge */}
          <span
            className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${TYPE_COLORS[listing.produceType]}`}
          >
            {listing.produceType.charAt(0).toUpperCase() + listing.produceType.slice(1)}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Title and grower */}
          <div>
            <h2 className="text-2xl font-bold text-charcoal">{listing.produceName}</h2>
            <p className="text-soil-brown">
              {listing.growerName} · {listing.neighborhood}
            </p>
          </div>

          {/* Availability badge */}
          <div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                listing.availability === "now"
                  ? "bg-success-green/10 text-success-green"
                  : "bg-harvest-gold/10 text-harvest-gold"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  listing.availability === "now" ? "bg-success-green" : "bg-harvest-gold"
                }`}
              />
              {listing.availability === "now" ? "Available Now" : "Coming Soon"}
            </span>
            {listing.availabilityDetails && (
              <p className="text-sm text-warm-gray mt-1">{listing.availabilityDetails}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-charcoal mb-1">About</h3>
            <p className="text-charcoal leading-relaxed">{listing.description}</p>
          </div>

          {/* Pickup instructions */}
          <div>
            <h3 className="font-semibold text-charcoal mb-1">Pickup Instructions</h3>
            <p className="text-charcoal leading-relaxed">{listing.pickupInstructions}</p>
          </div>

          {/* Contact section */}
          <div className="pt-4 border-t border-border">
            {!showContact ? (
              <button
                onClick={() => setShowContact(true)}
                className="w-full bg-harvest-gold text-charcoal py-3 px-4 rounded-lg font-semibold hover:bg-harvest-gold/90 transition-colors"
              >
                Show Contact Info
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-warm-gray">Contact {listing.growerName}:</p>
                {listing.contactPhone && (
                  <a
                    href={`tel:${listing.contactPhone}`}
                    className="flex items-center gap-3 p-3 bg-cream rounded-lg hover:bg-cream/80 transition-colors"
                  >
                    <svg className="w-5 h-5 text-garden-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-charcoal font-medium">{listing.contactPhone}</span>
                  </a>
                )}
                {listing.contactEmail && (
                  <a
                    href={`mailto:${listing.contactEmail}`}
                    className="flex items-center gap-3 p-3 bg-cream rounded-lg hover:bg-cream/80 transition-colors"
                  >
                    <svg className="w-5 h-5 text-garden-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-charcoal font-medium">{listing.contactEmail}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Report link */}
          <div className="pt-4 text-center">
            <button className="text-sm text-warm-gray hover:text-error-red transition-colors">
              Report this listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
