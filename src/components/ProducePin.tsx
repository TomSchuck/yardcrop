"use client";

import { ProduceType } from "@/lib/types";

interface ProducePinProps {
  produceType: ProduceType;
  isSelected?: boolean;
  onClick?: () => void;
}

// Colors for each produce type
const TYPE_COLORS: Record<ProduceType, { bg: string; border: string }> = {
  fruit: { bg: "#FEE2E2", border: "#EF4444" }, // Red
  vegetables: { bg: "#DCFCE7", border: "#22C55E" }, // Green
  herbs: { bg: "#D1FAE5", border: "#10B981" }, // Emerald
  eggs: { bg: "#FEF3C7", border: "#F59E0B" }, // Amber
  other: { bg: "#F3F4F6", border: "#6B7280" }, // Gray
};

// Icons for each produce type (simple SVG paths)
const TYPE_ICONS: Record<ProduceType, React.ReactNode> = {
  fruit: (
    // Apple icon
    <path
      d="M12 2C13.1 2 14 2.9 14 4C14 4.7 13.6 5.4 13 5.7V6C15.8 6 18 8.2 18 11C18 14.5 15.5 17.5 12 20C8.5 17.5 6 14.5 6 11C6 8.2 8.2 6 11 6V5.7C10.4 5.4 10 4.7 10 4C10 2.9 10.9 2 12 2Z"
      fill="currentColor"
    />
  ),
  vegetables: (
    // Carrot icon
    <path
      d="M16 4L14 6L12 4L10 6L8 4L6 6L7 7L4 18C4 18 7 20 12 20C17 20 20 18 20 18L17 7L18 6L16 4ZM12 17C10 17 8 16 8 16L10 9L12 11L14 9L16 16C16 16 14 17 12 17Z"
      fill="currentColor"
    />
  ),
  herbs: (
    // Leaf icon
    <path
      d="M17 8C8 10 5.9 16.2 5.3 19.5C5.1 20.4 5.9 21.2 6.8 21C10.1 20.4 16.3 18.3 18.3 9.3C18.5 8.4 17.9 7.7 17 8ZM7 17C7.5 14.5 9 12 12 10C10 13 9 15.5 8.5 17.5L7 17Z"
      fill="currentColor"
    />
  ),
  eggs: (
    // Egg icon
    <path
      d="M12 3C8.5 3 6 8 6 12.5C6 16.6 8.7 20 12 20C15.3 20 18 16.6 18 12.5C18 8 15.5 3 12 3Z"
      fill="currentColor"
    />
  ),
  other: (
    // Basket icon
    <path
      d="M5.5 21C4.7 21 4 20.3 4 19.5L5 10H19L20 19.5C20 20.3 19.3 21 18.5 21H5.5ZM12 3L4 10H20L12 3ZM8 14H16V16H8V14Z"
      fill="currentColor"
    />
  ),
};

export default function ProducePin({ produceType, isSelected, onClick }: ProducePinProps) {
  const colors = TYPE_COLORS[produceType];

  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer transform transition-all duration-150
        ${isSelected ? "scale-125 z-10" : "hover:scale-110"}
      `}
      style={{ marginTop: "-20px", marginLeft: "-16px" }} // Center the pin on coordinates
    >
      {/* Pin container */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "32px",
          height: "40px",
        }}
      >
        {/* Pin shape */}
        <svg
          width="32"
          height="40"
          viewBox="0 0 32 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Drop shadow */}
          <ellipse cx="16" cy="38" rx="6" ry="2" fill="rgba(0,0,0,0.2)" />

          {/* Pin body */}
          <path
            d="M16 0C7.16 0 0 7.16 0 16C0 24 16 40 16 40C16 40 32 24 32 16C32 7.16 24.84 0 16 0Z"
            fill={colors.bg}
            stroke={colors.border}
            strokeWidth="2"
          />
        </svg>

        {/* Icon inside pin */}
        <div
          className="absolute top-1.5 left-1/2 transform -translate-x-1/2"
          style={{ color: colors.border }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            {TYPE_ICONS[produceType]}
          </svg>
        </div>
      </div>

      {/* Selected indicator ring */}
      {isSelected && (
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border-2 animate-pulse"
          style={{
            borderColor: colors.border,
            marginTop: "-4px",
            marginLeft: "0px",
          }}
        />
      )}
    </div>
  );
}

// Simple marker for clustered pins (future use)
export function ClusterMarker({ count }: { count: number }) {
  return (
    <div className="bg-garden-green text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">
      {count}
    </div>
  );
}
