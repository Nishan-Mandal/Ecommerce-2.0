import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import WarningModal from '../../components/modal/WarningModal';
import TableSkeleton from '../../components/loader/SkeletonLoader/TableSkeleton';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../Components/common/StatusBadge';
import DataTable from '../Components/common/DataTable';

/**
 * Helper to render stock badge indicator using StatusBadge
 */
export function renderStockBadge(stockCount) {
    if (stockCount <= 0) {
        return <StatusBadge status="OUT_OF_STOCK" size="sm" />;
    }
    if (stockCount <= 5) {
        return <StatusBadge status="LOW_STOCK" label={`${stockCount} left`} size="sm" />;
    }
    return <StatusBadge status="IN_STOCK" label={`${stockCount} in stock`} size="sm" />;
}

/**
 * ProductDetailTable Component
 * Renders the products management panel.
 * Uses shared DataTable and StatusBadge components for unified UI consistency.
 */
function ProductDetailTable({ mode, product = [], loading = false, onAddClick, onEditClick, deleteProduct, toggleActiveStatus, formatDate }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Reset to page 1 if products list length changes
    useEffect(() => {
        setCurrentPage(1);
    }, [product.length]);

    const handleDeleteClick = (item) => {
        setSelectedProductToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedProductToDelete && deleteProduct) {
            deleteProduct(selectedProductToDelete);
        }
        setIsDeleteModalOpen(false);
        setSelectedProductToDelete(null);
    };

    if (loading) {
        return <TableSkeleton rows={pageSize} columns={8} />;
    }

    // Paginated subset
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = product.slice(startIndex, startIndex + pageSize);

    const columns = [
        {
            key: 'sno',
            header: 'S.No',
            align: 'center',
            className: 'w-14 hidden lg:table-cell',
            cellClassName: 'text-text-muted font-bold text-center hidden lg:table-cell',
            render: (item, idx) => startIndex + idx + 1,
        },
        {
            key: 'image',
            header: 'Image',
            className: 'w-16',
            render: (item) => (
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-border-base bg-bg-base flex items-center justify-center p-0.5 shadow-xs">
                    <img className="w-full h-full object-contain rounded-lg" src={item.imageUrl} alt={item.title} />
                </div>
            ),
        },
        {
            key: 'title',
            header: 'Title',
            cellClassName: 'font-extrabold text-text-base max-w-[200px] truncate',
            render: (item) => <span title={item.title}>{item.title}</span>,
        },
        {
            key: 'price',
            header: 'Price',
            className: 'w-24',
            cellClassName: 'font-extrabold text-text-base',
            render: (item) => `₹${Number(item.price).toLocaleString('en-IN')}`,
        },
        {
            key: 'stock',
            header: 'Stock',
            align: 'center',
            className: 'w-28 text-center',
            cellClassName: 'text-center',
            render: (item) => {
                const stockCount = item.hasVariants && Array.isArray(item.variants) && item.variants.length > 0
                    ? item.variants.reduce((acc, v) => acc + Number(v.inStock || v.quantity || 0), 0)
                    : Number(item.inStock ?? item.stock ?? 0);
                return renderStockBadge(stockCount);
            },
        },
        {
            key: 'category',
            header: 'Category',
            className: 'w-28',
            render: (item) => (
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-primary border border-primary/30 font-semibold text-[10px] whitespace-nowrap">
                    {item.category}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            align: 'center',
            className: 'w-28 text-center',
            cellClassName: 'text-center',
            render: (item) => (
                <button
                    type="button"
                    onClick={() => toggleActiveStatus && toggleActiveStatus(item)}
                    className="cursor-pointer inline-flex items-center"
                    title={item.isActive !== false ? "Click to set Draft mode" : "Click to set Live (Published)"}
                >
                    <StatusBadge status={item.isActive !== false ? 'LIVE' : 'DRAFT'} size="sm" />
                </button>
            ),
        },
        {
            key: 'date',
            header: 'Date Added',
            className: 'w-32 hidden xl:table-cell',
            cellClassName: 'text-text-muted hidden xl:table-cell',
            render: (item) => formatDate(item.date),
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'center',
            className: 'w-24 text-center',
            cellClassName: 'text-center',
            render: (item) => (
                <div className="flex items-center justify-center gap-1.5">
                    <button
                        onClick={() => onEditClick(item)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer"
                        title="Edit Product"
                    >
                        <FaEdit size={14} />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(item)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title="Delete Product"
                    >
                        <FaTrash size={12} />
                    </button>
                </div>
            ),
        },
    ];

    const mobileCardRender = (item, index) => {
        const { title, price, imageUrl, category, date, isActive, hasVariants, variants, inStock, stock } = item;
        const isItemActive = isActive !== false;
        const stockCount = hasVariants && Array.isArray(variants) && variants.length > 0
            ? variants.reduce((acc, v) => acc + Number(v.inStock || v.quantity || 0), 0)
            : Number(inStock ?? stock ?? 0);

        return (
            <div
                key={index}
                className="group bg-bg-surface rounded-2xl border border-border-base/60 shadow-xs hover:shadow-md transition-all duration-300 p-4"
            >
                <div className="flex gap-3">
                    <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-border-base bg-bg-base shrink-0 flex items-center justify-center relative">
                        <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-sm sm:text-base text-text-base line-clamp-2" title={title}>
                                {title}
                            </h3>
                            <button
                                type="button"
                                onClick={() => toggleActiveStatus && toggleActiveStatus(item)}
                                className="shrink-0 cursor-pointer"
                            >
                                <StatusBadge status={isItemActive ? 'LIVE' : 'DRAFT'} size="sm" />
                            </button>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-primary border border-primary/30 text-[10px] font-semibold whitespace-nowrap">
                                {category}
                            </span>
                            {renderStockBadge(stockCount)}
                            <span className="text-base font-extrabold text-text-base ml-auto">
                                ₹{Number(price).toLocaleString("en-IN")}
                            </span>
                        </div>

                        <p className="mt-2 text-xs text-text-muted">
                            Added • {formatDate(date)}
                        </p>
                    </div>
                </div>

                <div className="my-4 border-t border-border-base/60" />

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onEditClick(item)}
                        className="h-11 rounded-xl bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/20 transition cursor-pointer"
                    >
                        <FaEdit size={14} /> Edit
                    </button>
                    <button
                        onClick={() => handleDeleteClick(item)}
                        className="h-11 rounded-xl text-rose-500 font-semibold text-sm flex items-center justify-center cursor-pointer gap-2 hover:bg-rose-100 transition"
                    >
                        <FaTrash size={14} /> Delete
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="mb-12 space-y-4">
            {/* Reusable Data Table */}
            <DataTable
                columns={columns}
                data={paginatedProducts}
                emptyMessage="No products available."
                mobileCardRender={mobileCardRender}
            />

            {/* Universal Pagination */}
            <Pagination
                currentPage={currentPage}
                totalItems={product.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                }}
            />

            {/* Confirmation delete modal */}
            <WarningModal
                isOpen={isDeleteModalOpen}
                message={`Are you sure you want to delete "${selectedProductToDelete?.title}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedProductToDelete(null);
                }}
                confirmText="Delete"
                mode={mode}
            />
        </div>
    );
}

export default ProductDetailTable;
