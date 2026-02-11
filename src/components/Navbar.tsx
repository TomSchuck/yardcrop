"use client";

import Link from "next/link";
import { useListings } from "@/contexts/ListingsContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { userCreatedCount } = useListings();
  const { user, isAuthenticated, logout } = useAuth();

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
        {isAuthenticated ? (
          <>
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

            {/* User display name - desktop only */}
            <span className="hidden lg:block text-sm text-cream/90">
              {user?.displayName}
            </span>

            {/* Logout button */}
            <button
              onClick={logout}
              className="text-sm hover:text-cream/80 transition-colors"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            {/* Login link */}
            <Link
              href="/login"
              className="text-sm hover:text-cream/80 transition-colors"
            >
              Log In
            </Link>

            {/* Sign up button */}
            <Link
              href="/signup"
              className="bg-white/10 px-3 py-1.5 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
