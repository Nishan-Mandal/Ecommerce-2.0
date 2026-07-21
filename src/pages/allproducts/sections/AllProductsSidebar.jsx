import React from 'react';
import SearchBar from '../../../components/Common/SearchBar';

/**
 * AllProductsSidebar
 * Renders the filter panels including full-text search, category tags, price point selections, and clear buttons.
 */
export default function AllProductsSidebar({
  searchkey,
  setSearchkey,
  filterType,
  setFilterType,
  filterPrice,
  setFilterPrice,
  uniqueCategory = [],
  uniquePrices = [],
  isMobileOpen = false,
  onClose
}) {
  return (
    <aside className={`w-full bg-bg-surface border border-border-base lg:rounded-2xl lg:shadow-sm p-4 sm:p-5 space-y-5 lg:col-span-3 lg:sticky lg:top-28 transition-all duration-300 z-50 lg:z-auto ${
      isMobileOpen 
        ? "fixed bottom-0 left-0 right-0 max-h-[75vh] overflow-y-auto rounded-t-3xl border-t border-border-base shadow-2xl translate-y-0" 
        : "hidden lg:block"
    }`}>

      {/* Drawer Mobile Header */}
      <div className="flex items-center justify-between lg:hidden pb-2 border-b border-border-base">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-base">Filters</h2>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-bg-base text-text-muted hover:text-text-base transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* Search */}
      <div className="space-y-2 hidden">
        <h3 className=" text-xs font-bold uppercase tracking-wider text-text-muted">
          Search Products
        </h3>

        <SearchBar
          searchkey={searchkey}
          setSearchkey={setSearchkey}
          searchClass="px-3 py-2"
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Category
        </h3>

        <div className="flex flex-wrap lg:flex-col gap-2">

          <button
            onClick={() => setFilterType("")}
            className={`px-4 py-2 rounded-full text-xs font-medium border transition ${filterType === ""
                ? "bg-primary text-compli border-primary"
                : "border-border-base hover:bg-bg-base text-text-muted"
              }`}
          >
            All
          </button>

          {uniqueCategory.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setFilterType(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition ${filterType === cat
                  ? "bg-primary text-compli border-primary"
                  : "border-border-base hover:bg-bg-base text-text-muted"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      {(() => {
        const numericPrices = uniquePrices
          .map(Number)
          .filter((n) => !isNaN(n));

        const minPriceInCatalog =
          numericPrices.length > 0 ? Math.min(...numericPrices) : 0;

        const maxPriceInCatalog =
          numericPrices.length > 0 ? Math.max(...numericPrices) : 100000;

        return (
          <div className="space-y-4">

            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Price
              </h3>

              {filterPrice && (
                <button
                  onClick={() => setFilterPrice("")}
                  className="text-[10px] font-semibold text-red-500 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <input
              type="range"
              min={minPriceInCatalog}
              max={maxPriceInCatalog}
              value={
                filterPrice
                  ? Number(filterPrice)
                  : maxPriceInCatalog
              }
              onChange={(e) =>
                setFilterPrice(e.target.value)
              }
              className="w-full accent-primary"
            />

            <div className="flex justify-between text-[10px] sm:text-xs text-text-muted">
              <span>
                ₹{minPriceInCatalog.toLocaleString("en-IN")}
              </span>

              <span className="font-bold text-primary">
                ₹
                {Number(
                  filterPrice || maxPriceInCatalog
                ).toLocaleString("en-IN")}
              </span>

              <span>
                ₹{maxPriceInCatalog.toLocaleString("en-IN")}
              </span>
            </div>

          </div>
        );
      })()}

      {/* Clear Filters */}
      {(filterType || filterPrice || searchkey) && (
        <button
          onClick={() => {
            setFilterType("");
            setFilterPrice("");
            setSearchkey("");
          }}
          className="w-full py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold transition"
        >
          Clear All Filters
        </button>
      )}

    </aside>
  );
}
