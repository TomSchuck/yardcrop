"use client";

import Link from "next/link";

export default function FloatingActionButton() {
  return (
    <Link
      href="/create"
      className="w-14 h-14 bg-harvest-gold rounded-full shadow-lg flex items-center justify-center text-charcoal hover:bg-harvest-gold/90 transition-colors active:scale-95"
      aria-label="Post Your Produce"
    >
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </Link>
  );
}
