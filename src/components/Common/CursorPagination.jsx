import React from 'react';
import { FaChevronLeft, FaChevronRight, FaSyncAlt, FaSpinner } from 'react-icons/fa';

/**
 * Reusable Cursor-Based Pagination Component
 * Works with Firestore startAfter() cursor pagination for zero-read backward/forward navigation.
 */
function CursorPagination({
    pageIndex = 0,
    hasMore = false,
    isFetching = false,
    onPrev,
    onNext,
    onRefresh,
    pageSize = 10,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50],
    className = "",
}) {
    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-xs text-text-muted ${className}`}>
            {/* Page Info & Page Size */}
            <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-medium">
                    Showing Page <strong className="font-extrabold text-text-base">{pageIndex + 1}</strong>
                    {isFetching && <FaSpinner className="animate-spin text-primary ml-1" size={12} />}
                </span>

                {onPageSizeChange && (
                    <div className="flex items-center gap-1.5 ml-2">
                        <span className="text-[11px]">Show:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="px-2 py-1 bg-bg-surface border border-border-base rounded-lg text-xs font-bold text-text-base focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt} per page
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Pagination & Refresh Controls */}
            <div className="flex items-center gap-2">
                {onRefresh && (
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={isFetching}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border-base bg-bg-surface text-text-base hover:bg-bg-base disabled:opacity-40 disabled:cursor-not-allowed transition font-semibold"
                        title="Refresh Current Page"
                    >
                        <FaSyncAlt size={10} className={isFetching ? "animate-spin" : ""} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                )}

                {/* Prev Button */}
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={pageIndex === 0 || isFetching}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-base bg-bg-surface text-text-base hover:bg-bg-base disabled:opacity-40 disabled:cursor-not-allowed transition font-bold"
                    title="Previous Page"
                >
                    <FaChevronLeft size={10} />
                    <span>Previous</span>
                </button>

                {/* Next Button */}
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!hasMore || isFetching}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-base bg-bg-surface text-text-base hover:bg-bg-base disabled:opacity-40 disabled:cursor-not-allowed transition font-bold"
                    title="Next Page"
                >
                    <span>Next</span>
                    <FaChevronRight size={10} />
                </button>
            </div>
        </div>
    );
}

export default CursorPagination;
