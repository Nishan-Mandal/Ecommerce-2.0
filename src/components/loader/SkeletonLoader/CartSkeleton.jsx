import React from 'react';

/**
 * CartSkeleton
 * Renders a placeholder skeleton matching the Cart layout (Cart Items list, Cross-sell items, Order Summary sidebar).
 */
export default function CartSkeleton() {
  return (
    <div className="bg-bg-base text-text-base flex flex-col transition-colors duration-300 animate-pulse">
      <main className="flex-grow md:px-6 max-w-8xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Stack: Shopping Cart Items Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title Header Skeleton */}
            <div className="h-8 w-48 bg-border-base/40 rounded-xl mb-4" />

            {/* Cart Item Cards Skeleton */}
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-bg-surface p-4 rounded-2xl border border-border-base/40 flex flex-col sm:flex-row items-center gap-4"
                >
                  <div className="w-20 h-20 bg-border-base/30 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2 w-full">
                    <div className="h-4 w-3/4 bg-border-base/40 rounded" />
                    <div className="h-3 w-1/3 bg-border-base/30 rounded" />
                    <div className="h-4 w-20 bg-border-base/40 rounded" />
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="h-8 w-24 bg-border-base/30 rounded-xl" />
                    <div className="w-8 h-8 rounded-full bg-border-base/30 shrink-0" />
                  </div>
                </div>
              ))}
            </div>

            {/* Cross-Sell Section Skeleton */}
            <div className="pt-6 space-y-4 border-t border-border-base/30">
              <div className="h-5 w-44 bg-border-base/40 rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 bg-bg-surface rounded-2xl border border-border-base/30 p-3 flex gap-3">
                    <div className="w-20 h-full bg-border-base/30 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-full bg-border-base/40 rounded" />
                      <div className="h-3 w-1/2 bg-border-base/30 rounded" />
                      <div className="h-6 w-20 bg-border-base/40 rounded-lg mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Stack: Order Summary Sidebar Skeleton */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-bg-surface p-6 rounded-2xl border border-border-base/40 space-y-5">
              <div className="h-6 w-36 bg-border-base/40 rounded" />
              
              <div className="space-y-3 pt-3 border-t border-border-base/30">
                <div className="flex justify-between">
                  <div className="h-3.5 w-20 bg-border-base/30 rounded" />
                  <div className="h-3.5 w-16 bg-border-base/30 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3.5 w-24 bg-border-base/30 rounded" />
                  <div className="h-3.5 w-12 bg-border-base/30 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3.5 w-16 bg-border-base/30 rounded" />
                  <div className="h-3.5 w-14 bg-border-base/30 rounded" />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-border-base/40">
                <div className="h-5 w-24 bg-border-base/40 rounded" />
                <div className="h-5 w-20 bg-border-base/40 rounded" />
              </div>

              <div className="h-12 w-full bg-border-base/40 rounded-xl mt-4" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
