"use client";

import { useState } from "react";
import { ReportReason } from "@/lib/types";

interface ReportModalProps {
  isOpen: boolean;
  listingId: string;
  listingName: string;
  onClose: () => void;
  onSubmit: (reason: ReportReason, details?: string) => void;
}

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "inappropriate_content", label: "Inappropriate content" },
  { value: "incorrect_info", label: "Incorrect information" },
  { value: "spam", label: "Spam or scam" },
  { value: "safety_concern", label: "Safety concern" },
  { value: "other", label: "Other" },
];

export default function ReportModal({
  isOpen,
  listingName,
  onClose,
  onSubmit,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | "">("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason) return;

    setIsSubmitting(true);

    // Simulate a small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    onSubmit(selectedReason, selectedReason === "other" ? details : undefined);

    // Reset form
    setSelectedReason("");
    setDetails("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setSelectedReason("");
    setDetails("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-charcoal">Report Listing</h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream transition-colors"
          >
            <svg className="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-sm text-warm-gray">
            Report <span className="font-medium text-charcoal">&quot;{listingName}&quot;</span> for:
          </p>

          {/* Reason options */}
          <div className="space-y-2">
            {REPORT_REASONS.map((reason) => (
              <label
                key={reason.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedReason === reason.value
                    ? "border-garden-green bg-garden-green/5"
                    : "border-border hover:bg-cream"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onChange={(e) => setSelectedReason(e.target.value as ReportReason)}
                  className="w-4 h-4 text-garden-green focus:ring-garden-green"
                />
                <span className="text-charcoal">{reason.label}</span>
              </label>
            ))}
          </div>

          {/* Details textarea (shown when "other" is selected) */}
          {selectedReason === "other" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-charcoal">
                Please describe the issue
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell us more about the problem..."
                rows={3}
                className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green resize-none"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg text-charcoal font-medium hover:bg-cream transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedReason || isSubmitting}
              className="flex-1 px-4 py-2.5 bg-error-red text-white rounded-lg font-medium hover:bg-error-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>

          <p className="text-xs text-warm-gray text-center">
            Reports are reviewed by our team. False reports may result in action against your account.
          </p>
        </form>
      </div>
    </div>
  );
}
