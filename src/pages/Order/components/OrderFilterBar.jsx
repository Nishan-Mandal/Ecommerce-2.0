import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

function OrderFilterBar({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  tabCounts = {}
}) {
  const tabs = [
    { id: "ALL", label: "All Orders", count: tabCounts.ALL || 0 },
    { id: "PROCESSING", label: "Placed / Processing", count: tabCounts.PROCESSING || 0 },
    { id: "SHIPPED", label: "Shipped", count: tabCounts.SHIPPED || 0 },
    { id: "DELIVERED", label: "Delivered", count: tabCounts.DELIVERED || 0 },
    { id: "CANCELLED", label: "Cancelled", count: tabCounts.CANCELLED || 0 },
  ];

  return (
    <div className="space-y-4">
      {/* Top Search Field & Mobile Filter Select */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, item title, or status..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border-base bg-bg-surface text-text-base text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-base p-1"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-border-base/50">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-primary text-white shadow-xs"
                  : "bg-bg-surface text-text-muted hover:text-text-base border border-border-base/60 hover:bg-bg-base"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-bg-base text-text-muted border border-border-base/50"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default OrderFilterBar;
