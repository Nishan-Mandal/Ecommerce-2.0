import React from 'react';
import { FaSearch } from 'react-icons/fa';

/**
 * FilterBar Component
 * A generic, premium, and highly responsive filter bar with a search input and configurable select dropdowns.
 */
function FilterBar({ search, setSearch, searchPlaceholder = "Search...", filters = [] }) {
    return (
        <div className="">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
                {/* Search Input */}
                <div className="relative w-full sm:flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xs" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={search || ""}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border-base bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#17700d]/10 focus:border-[#17700d] transition-all"
                    />
                </div>

                {/* Dropdowns */}
                {filters.length > 0 && (
                    <div className="flex flex-row flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                        {filters.map((filter, index) => (
                            <select
                                key={index}
                                value={filter.value}
                                onChange={(e) => filter.onChange(e.target.value)}
                                className="flex-1 min-w-[120px] sm:flex-initial sm:w-auto h-11 rounded-xl border border-border-base bg-white px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#17700d]/10 focus:border-[#17700d] transition-all cursor-pointer font-bold text-text-base"
                            >
                                {filter.options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterBar;
