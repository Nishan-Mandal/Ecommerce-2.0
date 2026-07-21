import React from 'react'

/**
 * SearchBar Component
 * Reusable full-text search input with styling for consistent look.
 */
function SearchBar({ searchkey, setSearchkey, searchClass}) {
    return (
        <div className="space-y-2">
            <div className={`relative flex items-center border border-border-base rounded-full bg-bg-base focus-within:ring-2 focus-within:ring-primary/20 transition-all  ${searchClass}`}>
                <span className="material-symbols-outlined text-text-muted text-lg mr-2 pointer-events-none">
                    search
                </span>
                <input
                    type="text"
                    value={searchkey}
                    onChange={(e) => setSearchkey(e.target.value)}
                    placeholder="Type to search..."
                    className="bg-transparent border-none text-xs w-full focus:outline-none focus:ring-0 text-text-base font-semibold"
                />
            </div>
        </div>
    )
}

export default SearchBar