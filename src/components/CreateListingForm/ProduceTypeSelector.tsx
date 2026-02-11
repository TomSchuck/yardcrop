"use client";

import { ProduceType } from "@/lib/types";

const PRODUCE_TYPES: { value: ProduceType; label: string }[] = [
  { value: "fruit", label: "Fruit" },
  { value: "vegetables", label: "Vegetables" },
  { value: "herbs", label: "Herbs" },
  { value: "eggs", label: "Eggs" },
  { value: "other", label: "Other" },
];

interface ProduceTypeSelectorProps {
  value: ProduceType | "";
  onChange: (value: ProduceType) => void;
}

export default function ProduceTypeSelector({ value, onChange }: ProduceTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-charcoal">
        Produce Type <span className="text-error-red">*</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {PRODUCE_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              value === type.value
                ? "bg-garden-green text-white"
                : "bg-cream text-charcoal border border-border hover:bg-cream/80"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
