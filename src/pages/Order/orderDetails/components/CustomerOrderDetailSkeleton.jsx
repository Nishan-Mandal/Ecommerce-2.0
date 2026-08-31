import React from "react";

export default function CustomerOrderDetailSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-surface border border-border-base/70 rounded-2xl p-5 shadow-xs">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-border-base/50 rounded" />
          <div className="h-6 w-64 bg-border-base/70 rounded" />
          <div className="h-3.5 w-32 bg-border-base/40 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-border-base/60 rounded-xl" />
          <div className="h-9 w-32 bg-border-base/60 rounded-xl" />
        </div>
      </div>

      {/* Delivery Address Card Skeleton */}
      <div className="bg-bg-surface border border-border-base/70 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="h-4 w-36 bg-border-base/60 rounded" />
        <div className="space-y-1.5 pt-1">
          <div className="h-5 w-48 bg-border-base/70 rounded" />
          <div className="h-3.5 w-full max-w-md bg-border-base/40 rounded" />
          <div className="h-3.5 w-40 bg-border-base/40 rounded" />
        </div>
      </div>

      {/* Main Item & Tracking Card Skeleton */}
      <div className="bg-bg-surface border border-border-base/70 rounded-2xl p-5 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-border-base/40 shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="h-5 w-3/4 bg-border-base/70 rounded" />
            <div className="h-4 w-32 bg-border-base/50 rounded" />
            <div className="h-6 w-24 bg-border-base/80 rounded" />
          </div>
        </div>

        {/* Timeline Stepper Skeleton */}
        <div className="grid grid-cols-5 gap-2 pt-4 border-t border-border-base/50">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-border-base/60" />
              <div className="h-3 w-14 bg-border-base/40 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Price & Payment Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-surface border border-border-base/70 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="h-4 w-32 bg-border-base/60 rounded" />
          <div className="space-y-2 pt-2">
            <div className="h-3.5 w-full bg-border-base/40 rounded" />
            <div className="h-3.5 w-full bg-border-base/40 rounded" />
            <div className="h-5 w-full bg-border-base/60 rounded pt-2" />
          </div>
        </div>
        <div className="bg-bg-surface border border-border-base/70 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="h-4 w-36 bg-border-base/60 rounded" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-40 bg-border-base/50 rounded" />
            <div className="h-4 w-52 bg-border-base/50 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
