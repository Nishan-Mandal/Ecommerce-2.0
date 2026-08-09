import React from 'react';
import CommonProductCard from '../../../components/Common/ProductCard';

/**
 * AllProductsGrid
 * Renders the products header counters, the sort select options, and loops cards.
 */
export default function AllProductsGrid({
  loading = false,
  filteredAndSorted = [],
  totalProductsCount = 0,
  sortBy,
  setSortBy,
  addCart,
  onMobileFilterToggle
}) {
  return (
    <div className="lg:col-span-9 w-full space-y-6 ">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border-base">

        <p className="text-xs sm:text-sm font-semibold text-text-muted">
          <span className="text-primary">{filteredAndSorted.length}</span> Out of{" "}
          <span className="text-primary">{totalProductsCount}</span>
        </p>

        {/* Sort and Filters */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-text-muted w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full sm:w-32 border border-border-base rounded-xl px-2 py-2 pr-10 bg-bg-surface text-text-base text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="Featured">Sort By</option>
              <option value="Price: Low to High">
                Price: Low to High
              </option>
              <option value="Price: High to Low">
                Price: High to Low
              </option>
            </select>

            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-lg text-text-muted pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Mobile Filters Toggle Button */}
          <button
            onClick={onMobileFilterToggle}
            className="lg:hidden flex items-center gap-1.5 border border-border-base rounded-xl px-3 py-2 bg-bg-surface text-text-base text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-bold">filter_alt</span>
            <span>Filters</span>
          </button>
        </div>

      </div>

      {/* Products Grid or Skeleton Loader */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 2xl:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-border-base/40 animate-pulse" />
          ))}
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="py-16 sm:py-20 rounded-2xl border border-border-base bg-bg-surface text-center">
          <span className="material-symbols-outlined text-5xl text-text-muted">
            sentiment_dissatisfied
          </span>

          <p className="mt-3 text-sm sm:text-base font-medium text-text-muted">
            No products match your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 2xl:gap-6">
          {filteredAndSorted.map((item, index) => (
            <CommonProductCard
              key={index}
              item={item}
              index={index}
              addCart={addCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
