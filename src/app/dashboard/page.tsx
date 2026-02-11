"use client";

import { useState } from "react";
import Link from "next/link";
import { useListings } from "@/contexts/ListingsContext";
import DashboardListingRow from "@/components/DashboardListingRow";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Listing } from "@/lib/types";

export default function DashboardPage() {
  const { getUserCreatedListings, toggleListingActive, deleteListing } = useListings();
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);

  const userListings = getUserCreatedListings();

  const handleDeactivate = (id: string) => {
    toggleListingActive(id);
  };

  const handleDeleteClick = (listing: Listing) => {
    setDeleteTarget(listing);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteListing(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-soft-white border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cream transition-colors"
          >
            <svg className="w-6 h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-charcoal">My Listings</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {userListings.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-xl font-bold text-charcoal mb-2">No listings yet</h2>
            <p className="text-warm-gray mb-6">
              Share your homegrown produce with neighbors!
            </p>
            <Link
              href="/create"
              className="inline-block bg-garden-green text-white font-semibold px-6 py-3 rounded-lg hover:bg-garden-green/90 transition-colors"
            >
              Post Your First Listing
            </Link>
          </div>
        ) : (
          /* Listings */
          <div className="space-y-4">
            {userListings.map((listing) => (
              <DashboardListingRow
                key={listing.id}
                listing={listing}
                onDeactivate={() => handleDeactivate(listing.id)}
                onDelete={() => handleDeleteClick(listing)}
              />
            ))}

            {/* Add New Listing Button */}
            <Link
              href="/create"
              className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-border rounded-lg text-warm-gray hover:border-garden-green hover:text-garden-green transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Post New Produce</span>
            </Link>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        listingName={deleteTarget?.produceName || ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
