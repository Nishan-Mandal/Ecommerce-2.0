import React, { useState } from 'react';
import { FaCartPlus, FaTrash, FaEdit } from 'react-icons/fa';
import WarningModal from '../../components/modal/WarningModal';

/**
 * ProductDetailTable Component
 * Renders the products management panel.
 * Designed with a clean structure, alternating rows, and brand indicators.
 */
function ProductDetailTable({ mode, product, onAddClick, onEditClick, deleteProduct, toggleActiveStatus, formatDate }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);

    const handleDeleteClick = (item) => {
        setSelectedProductToDelete(item);
        setIsDeleteModalOpen(true);
    }

    const handleConfirmDelete = () => {
        if (selectedProductToDelete && deleteProduct) {
            deleteProduct(selectedProductToDelete);
        }
        setIsDeleteModalOpen(false);
        setSelectedProductToDelete(null);
    }

    return (
        <div className="mb-12">

            {/* Mobile Cards (Visible only on mobile) */}
            <div className="block md:hidden space-y-4">
                {product.map((item, index) => {
                    const { title, price, imageUrl, category, date, isActive } = item;
                    const isItemActive = isActive !== false;
                    return (
                        <div
                            key={index}
                            className="group bg-bg-surface rounded-2xl border border-border-base/60 shadow-sm hover:shadow-md transition-all duration-300 p-4"
                        >
                            {/* Product Info */}
                            <div className="flex gap-3">

                                {/* Image */}
                                <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-border-base bg-bg-base shrink-0 flex items-center justify-center relative">
                                    <img
                                        src={imageUrl}
                                        alt={title}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">

                                    <div className="flex items-center justify-between gap-2">
                                        <h3
                                            className="font-bold text-sm sm:text-base text-text-base line-clamp-2"
                                            title={title}
                                        >
                                            {title}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => toggleActiveStatus && toggleActiveStatus(item)}
                                            className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-black shrink-0 transition-all cursor-pointer border inline-flex items-center gap-1 whitespace-nowrap ${
                                                isItemActive
                                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                    : "bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400"
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isItemActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                                            <span>{isItemActive ? "Live" : "Draft"}</span>
                                        </button>
                                    </div>

                                    <div className="mt-2 flex flex-wrap items-center gap-2">

                                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                                            {category}
                                        </span>

                                        <span className="text-lg font-bold text-text-base">
                                            ₹{Number(price).toLocaleString("en-IN")}
                                        </span>

                                    </div>

                                    <p className="mt-2 text-xs text-text-muted">
                                        Added • {formatDate(date)}
                                    </p>

                                </div>
                            </div>

                            {/* Divider */}
                            <div className="my-4 border-t border-border-base/60" />

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => onEditClick(item)}
                                    className=" h-11 rounded-xl bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/20 transition cursor-pointer "     >
                                    <FaEdit size={14} />
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDeleteClick(item)}
                                    className=" h-11 rounded-xl text-red-400 font-semibold text-sm flex items-center justify-center cursor-pointer gap-2 hover:bg-rose-100 transition"
                                >
                                    <FaTrash size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
                {product.length === 0 && (
                    <div className="bg-bg-surface p-8 text-center text-text-muted rounded-2xl border border-border-base/60">
                        No products available.
                    </div>
                )}
            </div>

            {/* Desktop/Tablet Table (Hidden on mobile) */}
            <div className="hidden md:block relative overflow-hidden bg-bg-surface rounded-2xl border border-border-base/60 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-base bg-primary/5 text-text-base uppercase text-[10px] tracking-wider font-extrabold">
                                <th className="px-5 py-4 w-16 text-center hidden lg:table-cell">S.No</th>
                                <th className="px-5 py-4 w-20">Image</th>
                                <th className="px-5 py-4">Title</th>
                                <th className="px-5 py-4 w-24">Price</th>
                                 <th className="px-5 py-4 w-32">Category</th>
                                <th className="px-5 py-4 w-32 text-center">Status</th>
                                <th className="px-5 py-4 w-36 hidden xl:table-cell">Date Added</th>
                                <th className="px-5 py-4 w-24 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base/40 text-text-base font-semibold">
                            {product.map((item, index) => {
                                const { title, price, imageUrl, category, date, isActive } = item;
                                const isItemActive = isActive !== false;
                                return (
                                    <tr key={index} className="hover:bg-bg-base/30 transition-colors duration-150">
                                        <td className="px-5 py-3.5 text-text-muted font-bold text-center hidden lg:table-cell">{index + 1}.</td>
                                        <td className="px-5 py-3.5">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-border-base bg-bg-base flex items-center justify-center p-0.5 shadow-inner">
                                                <img className="w-full h-full object-contain rounded-lg" src={imageUrl} alt={title} />
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 font-extrabold text-text-base max-w-[200px] truncate" title={title}>{title}</td>
                                        <td className="px-5 py-3.5 font-extrabold text-text-base">₹{Number(price).toLocaleString('en-IN')}</td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                                                {category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <button
                                                type="button"
                                                onClick={() => toggleActiveStatus && toggleActiveStatus(item)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer border inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 mx-auto ${
                                                    isItemActive
                                                        ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                        : "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400"
                                                }`}
                                                title={isItemActive ? "Click to set Draft mode" : "Click to set Live (Published)"}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isItemActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                                                <span>{isItemActive ? "Live" : "Draft"}</span>
                                            </button>
                                        </td>
                                        <td className="px-5 py-3.5 text-text-muted hidden xl:table-cell">{formatDate(date)}</td>
                                        <td className="px-5 py-3.5 text-center">
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
                                        </td>
                                    </tr>
                                );
                            })}
                            {product.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-5 py-8 text-center text-text-muted">
                                        No products available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
