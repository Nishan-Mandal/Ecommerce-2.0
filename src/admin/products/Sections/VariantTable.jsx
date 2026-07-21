import React from "react";
import { FaTrash } from "react-icons/fa";

function VariantTable({
    products,
    setProducts,
    deleteVariant,
    handleVariantChange,
    handleVariantImageUpload,
    handleVariantImageDelete,
    variantUploadingIndex,
}) {
    if (!products.variants || products.variants.length === 0) {
        return (
            <div className="bg-bg-surface border border-border-base rounded-xl shadow-xs text-xs">
                <div className="px-4 py-2.5 border-b border-border-base">
                    <h2 className="text-sm font-bold">
                        Generated Variants
                    </h2>
                    <p className="text-[10px] text-text-muted mt-0.5">
                        Generate combinations to manage product inventory.
                    </p>
                </div>

                <div className="py-8 text-center">
                    <h3 className="font-semibold text-xs">
                        No Variants Generated
                    </h3>
                    <p className="text-[10px] text-text-muted mt-1">
                        Click <strong>Generate Variants</strong> above.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-bg-surface border border-border-base rounded-xl shadow-xs text-xs">

            {/* Header */}
            <div className="px-4 py-2.5 border-b border-border-base flex justify-between items-center">
                <div>
                    <h2 className="text-sm font-bold">
                        Variant Inventory
                    </h2>
                    <p className="text-[10px] text-text-muted mt-0.5">
                        Manage pricing and inventory for every combination.
                    </p>
                </div>

                <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-semibold">
                    {products.variants.length} Variants
                </div>
            </div>

            {/* Desktop View (Table Layout) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border-base bg-bg-base">
                            <th className="text-left px-4 py-2 text-xs font-bold">
                                Variant
                            </th>
                            <th className="text-center px-2 py-2 text-xs font-bold">
                                Images
                            </th>
                            <th className="text-center px-2 py-2 text-xs font-bold">
                                Price
                            </th>
                            <th className="text-center px-2 py-2 text-xs font-bold">
                                Original Price
                            </th>
                            <th className="text-center px-2 py-2 text-xs font-bold">
                                Stock
                            </th>
                            <th className="text-center px-2 py-2 text-xs font-bold">
                                Status
                            </th>
                            <th className="text-center px-2 py-2 text-xs font-bold">
                                Delete
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.variants.map((variant, index) => (
                            <tr
                                key={index}
                                className="border-b border-border-base hover:bg-bg-base/40 transition"
                            >
                                {/* Variant attributes */}
                                <td className="px-4 py-1.5">
                                    <div className="flex flex-wrap gap-1">
                                        {Object.entries(variant.attributes || {}).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-semibold"
                                            >
                                                {key}: {value}
                                            </div>
                                        ))}
                                    </div>
                                </td>

                                {/* Variant Images */}
                                <td className="px-2 py-1.5 text-center">
                                    <div className="flex flex-col items-center justify-center gap-1.5">
                                        {/* Thumbnails row */}
                                        {variant.images && variant.images.length > 0 && (
                                            <div className="flex flex-wrap items-center justify-center gap-1 max-w-[120px]">
                                                {variant.images.map((url, imgIdx) => (
                                                    <div key={imgIdx} className="relative group w-8 h-8 rounded border border-border-base overflow-hidden bg-bg-base">
                                                        <img src={url} alt="Variant" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleVariantImageDelete(index, imgIdx)}
                                                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                            title="Delete Image"
                                                        >
                                                            <FaTrash className="text-[9px]" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Upload button */}
                                        <label className="relative flex items-center justify-center cursor-pointer px-2 py-1 rounded bg-bg-base hover:bg-border-base border border-border-base transition text-[10px] font-semibold gap-1 text-text-muted">
                                            {variantUploadingIndex === index ? (
                                                <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                                            ) : (
                                                <svg className="w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            )}
                                            <span>{variantUploadingIndex === index ? 'Uploading...' : 'Add'}</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => handleVariantImageUpload(index, e)}
                                                className="hidden"
                                                disabled={variantUploadingIndex !== null}
                                            />
                                        </label>
                                    </div>
                                </td>

                                {/* Price */}
                                <td className="px-2 py-1.5">
                                    <input
                                        type="text"
                                        value={variant.price}
                                        onChange={(e) =>
                                            handleVariantChange(
                                                index,
                                                "price",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-18 mx-auto block rounded border border-border-base bg-bg-base px-2 py-1 text-center text-xs focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </td>

                                {/* Original Price */}
                                <td className="px-2 py-1.5">
                                    <input
                                        type="text"
                                        value={variant.originalPrice}
                                        onChange={(e) =>
                                            handleVariantChange(
                                                index,
                                                "originalPrice",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-18 mx-auto block rounded border border-border-base bg-bg-base px-2 py-1 text-center text-xs focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </td>

                                {/* Stock */}
                                <td className="px-2 py-1.5">
                                    <input
                                        type="text"
                                        value={variant.inStock}
                                        onChange={(e) =>
                                            handleVariantChange(
                                                index,
                                                "inStock",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-16 mx-auto block rounded border border-border-base bg-bg-base px-2 py-1 text-center text-xs focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </td>

                                {/* Active Toggle */}
                                <td className="px-2 py-1.5 text-center">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={variant.isActive !== false && variant.isAvailable !== false}
                                            onChange={(e) =>
                                                handleVariantChange(
                                                    index,
                                                    "isActive",
                                                    e.target.checked
                                                )
                                            }
                                            className="w-4 h-4 accent-primary"
                                        />
                                    </label>
                                </td>

                                {/* Delete */}
                                <td className="px-2 py-1.5 text-center">
                                    <button
                                        onClick={() => deleteVariant(index)}
                                        className="w-6 h-6 rounded bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center mx-auto transition"
                                    >
                                        <FaTrash className="text-[10px]" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Card Layout) */}
            <div className="md:hidden divide-y divide-border-base">
                {products.variants.map((variant, index) => (
                    <div key={index} className="p-4 bg-bg-surface flex flex-col gap-3">
                        {/* Header: Attributes & Actions */}
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex flex-wrap gap-1">
                                {Object.entries(variant.attributes || {}).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-semibold"
                                    >
                                        {key}: {value}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="inline-flex items-center cursor-pointer" title="Status">
                                    <input
                                        type="checkbox"
                                        checked={variant.isActive !== false && variant.isAvailable !== false}
                                        onChange={(e) =>
                                            handleVariantChange(
                                                index,
                                                "isActive",
                                                e.target.checked
                                            )
                                        }
                                        className="w-4 h-4 accent-primary"
                                    />
                                </label>
                                <button
                                    onClick={() => deleteVariant(index)}
                                    className="w-6 h-6 rounded bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                                >
                                    <FaTrash className="text-[10px]" />
                                </button>
                            </div>
                        </div>

                        {/* Variant Images */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] text-text-muted font-bold">Images</span>
                            <div className="flex flex-wrap items-center gap-1.5">
                                {variant.images && variant.images.map((url, imgIdx) => (
                                    <div key={imgIdx} className="relative group w-12 h-12 rounded border border-border-base overflow-hidden bg-bg-base">
                                        <img src={url} alt="Variant" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleVariantImageDelete(index, imgIdx)}
                                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-100 transition-opacity duration-200"
                                            title="Delete Image"
                                        >
                                            <FaTrash className="text-[9px]" />
                                        </button>
                                    </div>
                                ))}
                                <label className="relative flex flex-col items-center justify-center cursor-pointer w-12 h-12 rounded bg-bg-base hover:bg-border-base border border-border-base transition text-[9px] font-semibold text-text-muted gap-1">
                                    {variantUploadingIndex === index ? (
                                        <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            <svg className="w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span>Add</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleVariantImageUpload(index, e)}
                                        className="hidden"
                                        disabled={variantUploadingIndex !== null}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Fields Section (Grid of 3 columns for numeric values) */}
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-[10px] text-text-muted mb-1 font-semibold">Price</label>
                                <input
                                    type="text"
                                    value={variant.price}
                                    onChange={(e) =>
                                        handleVariantChange(
                                            index,
                                            "price",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full rounded border border-border-base bg-bg-base px-2 py-1 text-center text-xs focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-text-muted mb-1 font-semibold">Original Price</label>
                                <input
                                    type="text"
                                    value={variant.originalPrice}
                                    onChange={(e) =>
                                        handleVariantChange(
                                            index,
                                            "originalPrice",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full rounded border border-border-base bg-bg-base px-2 py-1 text-center text-xs focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-text-muted mb-1 font-semibold">Stock</label>
                                <input
                                    type="text"
                                    value={variant.inStock}
                                    onChange={(e) =>
                                        handleVariantChange(
                                            index,
                                            "inStock",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full rounded border border-border-base bg-bg-base px-2 py-1 text-center text-xs focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default VariantTable;