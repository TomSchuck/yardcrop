"use client";

import { ListingCardData } from "@/lib/types";

interface ListingCardProps {
  listing: ListingCardData;
  onClick?: () => void;
  isSelected?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  fruit: "bg-red-100 text-red-800",
  vegetables: "bg-green-100 text-green-800",
  herbs: "bg-emerald-100 text-emerald-800",
  eggs: "bg-amber-100 text-amber-800",
  other: "bg-gray-100 text-gray-800",
};

export default function ListingCard({ listing, onClick, isSelected }: ListingCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-soft-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden
        ${isSelected ? "ring-2 ring-garden-green" : ""}
      `}
    >
      {/* Image */}
      <div className="relative h-32 bg-cream">
        {listing.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.photoUrl}
            alt={listing.produceName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-warm-gray">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[listing.produceType]}`}
        >
          {listing.produceType.charAt(0).toUpperCase() + listing.produceType.slice(1)}
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-charcoal">{listing.produceName}</h3>
        <p className="text-sm text-soil-brown">
          {listing.growerName} · {listing.neighborhood}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-warm-gray">{listing.distance || "—"}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              listing.availability === "now"
                ? "bg-success-green/10 text-success-green"
                : "bg-harvest-gold/10 text-harvest-gold"
            }`}
          >
            {listing.availability === "now" ? "Available Now" : "Upcoming"}
          </span>
        </div>
      </div>
    </div>
  );
}
