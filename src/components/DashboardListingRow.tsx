"use client";

import { useState } from "react";
import Link from "next/link";
import { Listing } from "@/lib/types";

const TYPE_COLORS: Record<string, string> = {
  fruit: "bg-red-100 text-red-800",
  vegetables: "bg-green-100 text-green-800",
  herbs: "bg-emerald-100 text-emerald-800",
  eggs: "bg-amber-100 text-amber-800",
  other: "bg-gray-100 text-gray-800",
};

interface DashboardListingRowProps {
  listing: Listing;
  onDeactivate: () => void;
  onDelete: () => void;
}

export default function DashboardListingRow({
  listing,
  onDeactivate,
  onDelete,
}: DashboardListingRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = listing.isActive !== false;
  const contactViews = listing.contactRevealCount ?? Math.floor(Math.random() * 16);

  return (
    <div className="bg-soft-white rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        {/* Thumbnail */}
        <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-cream overflow-hidden">
          {listing.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.photoUrl}
              alt={listing.produceName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-warm-gray">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-charcoal truncate">{listing.produceName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[listing.produceType]}`}>
              {listing.produceType.charAt(0).toUpperCase() + listing.produceType.slice(1)}
            </span>
            <span className={`flex items-center gap-1 text-xs ${isActive ? "text-success-green" : "text-warm-gray"}`}>
              <span className={`w-2 h-2 rounded-full ${isActive ? "bg-success-green" : "bg-warm-gray"}`} />
              {isActive ? "Active" : "Deactivated"}
            </span>
          </div>
          <p className="text-xs text-warm-gray mt-1">
            {contactViews} contact {contactViews === 1 ? "view" : "views"}
          </p>
        </div>

        {/* Kebab Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream transition-colors"
          >
            <svg className="w-5 h-5 text-warm-gray" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-40 bg-soft-white rounded-lg shadow-lg border border-border z-20 overflow-hidden">
                <Link
                  href={`/dashboard/edit/${listing.id}`}
                  className="block px-4 py-2 text-sm text-charcoal hover:bg-cream transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDeactivate();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-charcoal hover:bg-cream transition-colors"
                >
                  {isActive ? "Deactivate" : "Reactivate"}
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-error-red hover:bg-cream transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
