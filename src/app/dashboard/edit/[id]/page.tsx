"use client";

import { use } from "react";
import Link from "next/link";
import { useListings } from "@/contexts/ListingsContext";
import CreateListingForm from "@/components/CreateListingForm";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditListingPage({ params }: EditPageProps) {
  const { id } = use(params);
  const { getListingById } = useListings();

  const listing = getListingById(id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-soft-white">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-soft-white border-b border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <Link
              href="/dashboard"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cream transition-colors"
            >
              <svg className="w-6 h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-bold text-charcoal">Edit Listing</h1>
          </div>
        </header>

        {/* Not Found */}
        <main className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-charcoal mb-2">Listing not found</h2>
          <p className="text-warm-gray mb-6">
            This listing may have been deleted or doesn&apos;t exist.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-garden-green text-white font-semibold px-6 py-3 rounded-lg hover:bg-garden-green/90 transition-colors"
          >
            Back to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-soft-white border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/dashboard"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cream transition-colors"
          >
            <svg className="w-6 h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-charcoal">Edit Listing</h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <CreateListingForm initialListing={listing} />
      </main>
    </div>
  );
}
