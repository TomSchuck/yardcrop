"use client";

import { ProduceType } from "@/lib/types";

export type FilterCategory = ProduceType | "all";

const CATEGORIES: { id: FilterCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "fruit", label: "Fruit" },
  { id: "vegetables", label: "Vegetables" },
  { id: "herbs", label: "Herbs" },
  { id: "eggs", label: "Eggs" },
  { id: "other", label: "Other" },
];

interface FilterChipsProps {
  className?: string;
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
  counts?: Record<FilterCategory, number>;
}

export default function FilterChips({
  className,
  activeFilter,
  onFilterChange,
  counts,
}: FilterChipsProps) {
  return (
    <div className={`flex gap-2 overflow-x-auto pb-2 scrollbar-hide ${className}`}>
      {CATEGORIES.map((category) => {
        const count = counts?.[category.id];
        return (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${
                activeFilter === category.id
                  ? "bg-garden-green text-white"
                  : "bg-cream text-charcoal border border-border hover:bg-cream/80"
              }
            `}
          >
            {category.label}
            {count !== undefined && count > 0 && (
              <span
                className={`text-xs ${
                  activeFilter === category.id ? "text-white/80" : "text-warm-gray"
                }`}
              >
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
