"use client";

interface MobileTabBarProps {
  activeTab: "map" | "list";
  onTabChange: (tab: "map" | "list") => void;
}

export default function MobileTabBar({ activeTab, onTabChange }: MobileTabBarProps) {
  return (
    <div className="bg-soft-white border-t border-border h-14 flex items-center justify-around">
      <button
        onClick={() => onTabChange("map")}
        className={`flex flex-col items-center gap-1 px-6 py-2 ${
          activeTab === "map" ? "text-garden-green" : "text-warm-gray"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <span className="text-xs font-medium">Map</span>
      </button>

      <button
        onClick={() => onTabChange("list")}
        className={`flex flex-col items-center gap-1 px-6 py-2 ${
          activeTab === "list" ? "text-garden-green" : "text-warm-gray"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <span className="text-xs font-medium">List</span>
      </button>
    </div>
  );
}
