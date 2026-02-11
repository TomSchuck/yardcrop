"use client";

import Link from "next/link";
import { useListings } from "@/contexts/ListingsContext";

export default function Navbar() {
  const { userCreatedCount } = useListings();

  return (
    <nav className="bg-garden-green text-white h-14 flex items-center justify-between px-4 shadow-md z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold">YardCrop</span>
      </Link>

      {/* Tagline - hidden on mobile */}
      <div className="hidden md:block text-cream/90 text-sm">
        What&apos;s growing near you?
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* My Listings - desktop only */}
        <Link
          href="/dashboard"
          className="hidden lg:flex items-center gap-1.5 text-sm hover:text-cream/80 transition-colors"
        >
          My Listings
          {userCreatedCount > 0 && (
            <span className="bg-harvest-gold text-charcoal text-xs font-bold px-1.5 py-0.5 rounded-full">
              {userCreatedCount}
            </span>
          )}
        </Link>

        {/* Post button - desktop only */}
        <Link
          href="/create"
          className="hidden lg:block bg-harvest-gold text-charcoal px-4 py-2 rounded-lg font-semibold text-sm hover:bg-harvest-gold/90 transition-colors"
        >
          Post Your Produce
        </Link>

        {/* Auth buttons (placeholder) */}
        <button className="text-sm hover:text-cream/80 transition-colors">
          Log In
        </button>
        <button className="bg-white/10 px-3 py-1.5 rounded-lg text-sm hover:bg-white/20 transition-colors">
          Sign Up
        </button>
      </div>
    </nav>
  );
}
