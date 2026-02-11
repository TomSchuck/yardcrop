"use client";

import { AvailabilityStatus } from "@/lib/types";

interface AvailabilitySelectorProps {
  value: AvailabilityStatus;
  onChange: (value: AvailabilityStatus) => void;
  details: string;
  onDetailsChange: (value: string) => void;
}

export default function AvailabilitySelector({
  value,
  onChange,
  details,
  onDetailsChange,
}: AvailabilitySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-charcoal">
        Availability <span className="text-error-red">*</span>
      </label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="availability"
            value="now"
            checked={value === "now"}
            onChange={() => onChange("now")}
            className="w-4 h-4 text-garden-green focus:ring-garden-green"
          />
          <span className="text-sm text-charcoal">Available Now</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="availability"
            value="upcoming"
            checked={value === "upcoming"}
            onChange={() => onChange("upcoming")}
            className="w-4 h-4 text-garden-green focus:ring-garden-green"
          />
          <span className="text-sm text-charcoal">Coming Soon</span>
        </label>
      </div>
      {value === "upcoming" && (
        <input
          type="text"
          value={details}
          onChange={(e) => onDetailsChange(e.target.value)}
          placeholder="e.g., Ready next weekend, Saturdays only"
          maxLength={100}
          className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
        />
      )}
    </div>
  );
}
