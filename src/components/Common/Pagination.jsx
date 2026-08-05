import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * Reusable Pagination Component
 * Supports page selection, page size dropdown, total items counter, and prev/next controls.
 */
function Pagination({
    currentPage = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100],
    className = "",
}) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(totalItems, currentPage * pageSize);

    if (totalItems === 0) return null;

    const handlePrev = () => {
        if (currentPage > 1 && onPageChange) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages && onPageChange) {
            onPageChange(currentPage + 1);
        }
    };

    // Calculate page range buttons to display
    const getPageNumbers = () => {
        const pages = [];
        const delta = 1; // Number of pages before and after current page
        const range = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift('...');
        }
        if (currentPage + delta < totalPages - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (totalPages > 1) {
            range.push(totalPages);
        }

        return range;
    };

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-xs text-text-muted ${className}`}>
            {/* Info & Page Size */}
            <div className="flex items-center gap-3">
                <span>
                    Showing <strong className="font-extrabold text-text-base">{startItem}</strong> to{" "}
                    <strong className="font-extrabold text-text-base">{endItem}</strong> of{" "}
                    <strong className="font-extrabold text-text-base">{totalItems}</strong> entries
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
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
                {/* Prev Button */}
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-border-base bg-bg-surface text-text-base hover:bg-bg-base disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="Previous Page"
                >
                    <FaChevronLeft size={10} />
                </button>

                {/* Page Number Buttons */}
                {getPageNumbers().map((page, idx) => {
                    if (page === '...') {
                        return (
                            <span key={`dots-${idx}`} className="px-2 text-text-muted select-none">
                                ...
                            </span>
                        );
                    }
                    const isCurrent = page === currentPage;
                    return (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange && onPageChange(page)}
                            className={`min-w-[32px] h-8 px-2.5 rounded-lg text-xs font-extrabold transition ${
                                isCurrent
                                    ? "bg-primary text-white shadow-xs"
                                    : "bg-bg-surface border border-border-base text-text-base hover:bg-bg-base"
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next Button */}
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-border-base bg-bg-surface text-text-base hover:bg-bg-base disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="Next Page"
                >
                    <FaChevronRight size={10} />
                </button>
            </div>
        </div>
    );
}

export default Pagination;
