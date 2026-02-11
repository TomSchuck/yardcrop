"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";
import { ListingFlag, ReportReason } from "@/lib/types";
import { useListings } from "./ListingsContext";

interface FlagsContextValue {
  flags: ListingFlag[];
  sessionUserId: string;
  addFlag: (listingId: string, reason: ReportReason, details?: string) => boolean;
  hasUserFlagged: (listingId: string) => boolean;
  getFlagCount: (listingId: string) => number;
}

const FlagsContext = createContext<FlagsContextValue | null>(null);

const FLAG_THRESHOLD = 3; // Auto-hide listing after this many flags

export function FlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<ListingFlag[]>([]);
  const { toggleListingActive, getListingById } = useListings();

  // Generate a session-based user ID (persists during page session)
  const sessionUserId = useMemo(() => crypto.randomUUID(), []);

  const hasUserFlagged = useCallback(
    (listingId: string): boolean => {
      return flags.some(
        (flag) => flag.listingId === listingId && flag.userId === sessionUserId
      );
    },
    [flags, sessionUserId]
  );

  const getFlagCount = useCallback(
    (listingId: string): number => {
      return flags.filter((flag) => flag.listingId === listingId).length;
    },
    [flags]
  );

  const addFlag = useCallback(
    (listingId: string, reason: ReportReason, details?: string): boolean => {
      // Check if user already flagged this listing
      if (hasUserFlagged(listingId)) {
        return false;
      }

      const newFlag: ListingFlag = {
        id: crypto.randomUUID(),
        listingId,
        userId: sessionUserId,
        reason,
        details,
        createdAt: new Date().toISOString(),
      };

      setFlags((prev) => {
        const updated = [...prev, newFlag];

        // Check if we've hit the threshold for this listing
        const listingFlagCount = updated.filter((f) => f.listingId === listingId).length;

        if (listingFlagCount >= FLAG_THRESHOLD) {
          // Auto-hide listing - check if it's currently active first
          const listing = getListingById(listingId);
          if (listing && listing.isActive !== false) {
            // Schedule the toggle to happen after state update
            setTimeout(() => {
              toggleListingActive(listingId);
            }, 0);
          }
        }

        return updated;
      });

      return true;
    },
    [hasUserFlagged, sessionUserId, getListingById, toggleListingActive]
  );

  return (
    <FlagsContext.Provider
      value={{
        flags,
        sessionUserId,
        addFlag,
        hasUserFlagged,
        getFlagCount,
      }}
    >
      {children}
    </FlagsContext.Provider>
  );
}

export function useFlags() {
  const context = useContext(FlagsContext);
  if (!context) {
    throw new Error("useFlags must be used within a FlagsProvider");
  }
  return context;
}
