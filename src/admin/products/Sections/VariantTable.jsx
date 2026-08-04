import React, { useState } from "react";
import { FaTrash, FaPlus, FaCheckCircle, FaEyeSlash, FaBox, FaDollarSign, FaImages } from "react-icons/fa";
import MediaLibraryModal from "../../../components/modal/MediaLibraryModal.jsx";

function VariantTable({
    products,
    setProducts,
    deleteVariant,
    handleVariantChange,
    handleVariantImageUpload,
    handleVariantImageDelete,
    variantUploadingIndex,
}) {
    const [bulkPrice, setBulkPrice] = useState("");
    const [bulkOriginalPrice, setBulkOriginalPrice] = useState("");
    const [bulkStock, setBulkStock] = useState("");
    const [activeVariantMediaIndex, setActiveVariantMediaIndex] = useState(null);

    const handleSelectVariantMedia = (selectedUrls) => {
        if (activeVariantMediaIndex === null || !selectedUrls) return;
        const urls = (Array.isArray(selectedUrls) ? selectedUrls : [selectedUrls])
            .flat(Infinity)
            .filter(u => typeof u === 'string' && u.trim() !== '');
        if (urls.length === 0) return;

        const updatedVariants = (products.variants || []).map((v, i) => {
            if (i === activeVariantMediaIndex) {
                const existing = (Array.isArray(v.images) ? v.images : [])
                    .flat(Infinity)
                    .filter(u => typeof u === 'string' && u.trim() !== '');
                const merged = Array.from(new Set([...existing, ...urls]));
                return {
                    ...v,
                    images: merged
                };
            }
            return v;
        });

        setProducts({ ...products, variants: updatedVariants });
        setActiveVariantMediaIndex(null);
    };

    const applyBulkPrice = () => {
        if (!bulkPrice || isNaN(Number(bulkPrice))) return;
        const newVariants = (products.variants || []).map(v => ({
            ...v,
            price: Number(bulkPrice)
        }));
        setProducts({ ...products, variants: newVariants });
    };

    const applyBulkOriginalPrice = () => {
        if (!bulkOriginalPrice || isNaN(Number(bulkOriginalPrice))) return;
        const newVariants = (products.variants || []).map(v => ({
            ...v,
            originalPrice: Number(bulkOriginalPrice)
        }));
        setProducts({ ...products, variants: newVariants });
    };

    const applyBulkStock = () => {
        if (bulkStock === "" || isNaN(Number(bulkStock))) return;
        const newVariants = (products.variants || []).map(v => ({
            ...v,
            inStock: Number(bulkStock)
        }));
        setProducts({ ...products, variants: newVariants });
    };

    if (!products.variants || products.variants.length === 0) {
        return (
            <div className="bg-bg-surface border border-border-base rounded-2xl shadow-xs text-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border-base bg-bg-base/30">
                    <h2 className="text-sm font-black text-text-base flex items-center gap-2">
                        <FaBox className="text-primary" /> Generated Variant Inventory
                    </h2>
                    <p className="text-[10px] text-text-muted mt-0.5">
                        Generate combinations to manage pricing, stock, and individual variant images.
                    </p>
                </div>

                <div className="py-12 text-center bg-bg-base/20 border-2 border-dashed border-border-base/60 m-4 rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-border-base/40 text-text-muted flex items-center justify-center mx-auto mb-2">
                        <FaBox size={20} />
                    </div>
                    <h3 className="font-bold text-text-base text-xs">
                        No Variant Inventory Generated
                    </h3>
                    <p className="text-[10px] text-text-muted mt-1 max-w-xs mx-auto">
                        Click <strong>Generate Combinations</strong> in the section above to generate individual SKUs.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-bg-surface border border-border-base rounded-2xl shadow-xs text-xs overflow-hidden space-y-0">

            {/* Header */}
            <div className="px-5 py-4 border-b border-border-base flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-base/30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-xs">
                        <FaBox size={16} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-black text-text-base">
                                Variant Inventory Grid
                            </h2>
                            <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                                {products.variants.length} SKU{products.variants.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <p className="text-[10px] text-text-muted mt-0.5">
                            Set price, original MRP, stock, images, and publishing status for every combination.
                        </p>
                    </div>
                </div>

                {/* Bulk Quick Action Bar */}
                <div className="flex flex-wrap items-center gap-2 bg-bg-surface p-2 rounded-xl border border-border-base/80">
                    <span className="text-[9.5px] font-black text-text-muted uppercase tracking-wider px-1">
                        Bulk Fill:
                    </span>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            value={bulkPrice}
                            onChange={(e) => setBulkPrice(e.target.value)}
                            placeholder="Price ₹"
                            className="w-20 px-2 py-1 rounded-lg border border-border-base bg-bg-base text-[11px] font-semibold outline-none focus:border-primary"
                        />
                        <button
                            type="button"
                            onClick={applyBulkPrice}
                            className="px-2 py-1 bg-primary text-compli text-[10px] font-extrabold rounded-lg hover:opacity-90 transition cursor-pointer"
                        >
                            Apply
                        </button>
                    </div>

                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            value={bulkStock}
                            onChange={(e) => setBulkStock(e.target.value)}
                            placeholder="Stock"
                            className="w-16 px-2 py-1 rounded-lg border border-border-base bg-bg-base text-[11px] font-semibold outline-none focus:border-primary"
                        />
                        <button
                            type="button"
                            onClick={applyBulkStock}
                            className="px-2 py-1 bg-primary text-compli text-[10px] font-extrabold rounded-lg hover:opacity-90 transition cursor-pointer"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop View (Table Layout) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border-base bg-bg-base/60 text-text-muted text-[10px] uppercase tracking-wider font-extrabold">
                            <th className="px-5 py-3">Variant Attributes</th>
                            <th className="px-3 py-3 text-center">Images</th>
                            <th className="px-3 py-3 text-center">Price (₹)</th>
                            <th className="px-3 py-3 text-center">MRP (₹)</th>
                            <th className="px-3 py-3 text-center">Stock</th>
                            <th className="px-3 py-3 text-center">Publish Status</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border-base/50">
                        {products.variants.map((variant, index) => {
                            const isVariantActive = variant.isActive !== false && variant.isAvailable !== false;
                            const stockNum = Number(variant.inStock || 0);

                            return (
                                <tr
                                    key={index}
                                    className="hover:bg-bg-base/40 transition-colors"
                                >
                                    {/* Variant attributes */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-wrap gap-1.5">
                                            {Object.entries(variant.attributes || {}).map(([key, value]) => (
                                                <span
                                                    key={key}
                                                    className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[10.5px] font-bold"
                                                >
                                                    {key}: <span className="font-extrabold">{value}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Variant Images */}
                                    <td className="px-3 py-3.5 text-center">
                                        <div className="flex flex-col items-center justify-center gap-1.5">
                                            {variant.images && variant.images.length > 0 && (
                                                <div className="flex flex-wrap items-center justify-center gap-1 max-w-[120px]">
                                                    {variant.images.map((url, imgIdx) => (
                                                        <div key={imgIdx} className="relative group w-8 h-8 rounded-lg border border-border-base overflow-hidden bg-bg-base shadow-xs">
                                                            <img src={url} alt="Variant" className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleVariantImageDelete(index, imgIdx)}
                                                                className="absolute inset-0 bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                                                title="Delete Image"
                                                            >
                                                                <FaTrash size={9} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-1">
                                                <label className="relative flex items-center justify-center cursor-pointer px-2 py-1 rounded-lg bg-bg-base hover:bg-border-base border border-border-base transition text-[10px] font-bold gap-1 text-text-muted active:scale-95">
                                                    {variantUploadingIndex === index ? (
                                                        <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                                                    ) : (
                                                        <FaImages size={10} />
                                                    )}
                                                    <span>{variantUploadingIndex === index ? 'Uploading...' : 'Upload'}</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => handleVariantImageUpload(index, e)}
                                                        className="hidden"
                                                        disabled={variantUploadingIndex !== null}
                                                    />
                                                </label>

                                                <button
                                                    type="button"
                                                    onClick={() => setActiveVariantMediaIndex(index)}
                                                    className="px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition text-[10px] font-extrabold flex items-center gap-1 cursor-pointer active:scale-95"
                                                    title="Select from Media Library"
                                                >
                                                    <FaImages size={10} /> Library
                                                </button>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Price */}
                                    <td className="px-3 py-3.5">
                                        <div className="relative max-w-[100px] mx-auto">
                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted font-bold text-[11px]">₹</span>
                                            <input
                                                type="number"
                                                value={variant.price ?? ""}
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        index,
                                                        "price",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full pl-6 pr-2 py-1.5 rounded-xl border border-border-base bg-bg-base text-center font-bold text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            />
                                        </div>
                                    </td>

                                    {/* Original Price */}
                                    <td className="px-3 py-3.5">
                                        <div className="relative max-w-[100px] mx-auto">
                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted font-bold text-[11px]">₹</span>
                                            <input
                                                type="number"
                                                value={variant.originalPrice ?? ""}
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        index,
                                                        "originalPrice",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                placeholder="Optional"
                                                className="w-full pl-6 pr-2 py-1.5 rounded-xl border border-border-base bg-bg-base text-center font-semibold text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-muted"
                                            />
                                        </div>
                                    </td>

                                    {/* Stock */}
                                    <td className="px-3 py-3.5">
                                        <input
                                            type="number"
                                            value={variant.inStock ?? ""}
                                            onChange={(e) =>
                                                handleVariantChange(
                                                    index,
                                                    "inStock",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className={`w-20 mx-auto block rounded-xl border px-2 py-1.5 text-center font-extrabold text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                                                stockNum === 0
                                                    ? "bg-rose-50 dark:bg-rose-950/20 border-rose-300 text-rose-600"
                                                    : stockNum < 5
                                                    ? "bg-amber-50 dark:bg-amber-950/20 border-amber-300 text-amber-600"
                                                    : "bg-bg-base border-border-base text-text-base"
                                            }`}
                                        />
                                    </td>

                                    {/* Live vs Draft Status Toggle */}
                                    <td className="px-3 py-3.5 text-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleVariantChange(
                                                    index,
                                                    "isActive",
                                                    !isVariantActive
                                                )
                                            }
                                            className={`px-3 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer border inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 mx-auto active:scale-95 ${
                                                isVariantActive
                                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                    : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                                            }`}
                                            title={isVariantActive ? "Click to set Draft mode" : "Click to set Live (Published)"}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isVariantActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                                            <span>{isVariantActive ? "Live" : "Draft"}</span>
                                        </button>
                                    </td>

                                    {/* Delete */}
                                    <td className="px-4 py-3.5 text-center">
                                        <button
                                            type="button"
                                            onClick={() => deleteVariant(index)}
                                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                            title="Delete Variant"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Card Layout) */}
            <div className="md:hidden divide-y divide-border-base">
                {products.variants.map((variant, index) => {
                    const isVariantActive = variant.isActive !== false && variant.isAvailable !== false;

                    return (
                        <div key={index} className="p-4 bg-bg-surface flex flex-col gap-3">
                            {/* Header: Attributes & Actions */}
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex flex-wrap gap-1.5">
                                    {Object.entries(variant.attributes || {}).map(([key, value]) => (
                                        <span
                                            key={key}
                                            className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold border border-primary/20"
                                        >
                                            {key}: {value}
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleVariantChange(
                                                index,
                                                "isActive",
                                                !isVariantActive
                                            )
                                        }
                                        className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-black transition-all cursor-pointer border ${
                                            isVariantActive
                                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                                : "bg-slate-100 text-slate-600 border-slate-300"
                                        }`}
                                    >
                                        {isVariantActive ? "Ready to Publish" : "Draft"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => deleteVariant(index)}
                                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                                        title="Delete Variant"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Variant Images */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] text-text-muted font-extrabold uppercase tracking-wider">Images</span>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {variant.images && variant.images.map((url, imgIdx) => (
                                        <div key={imgIdx} className="relative group w-12 h-12 rounded-xl border border-border-base overflow-hidden bg-bg-base shadow-xs">
                                            <img src={url} alt="Variant" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleVariantImageDelete(index, imgIdx)}
                                                className="absolute inset-0 bg-rose-600/90 text-white flex items-center justify-center opacity-100 transition-opacity cursor-pointer"
                                                title="Delete Image"
                                            >
                                                <FaTrash size={10} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="relative flex flex-col items-center justify-center cursor-pointer w-12 h-12 rounded-xl bg-bg-base hover:bg-border-base border border-border-base transition text-[9px] font-bold text-text-muted gap-0.5 active:scale-95">
                                        {variantUploadingIndex === index ? (
                                            <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                                        ) : (
                                            <>
                                                <FaImages size={12} />
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
                                    <label className="block text-[9.5px] text-text-muted mb-1 font-bold uppercase tracking-wider">Selling Price ₹</label>
                                    <input
                                        type="number"
                                        value={variant.price ?? ""}
                                        onChange={(e) =>
                                            handleVariantChange(
                                                index,
                                                "price",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full rounded-xl border border-border-base bg-bg-base px-2 py-1.5 text-center font-bold text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9.5px] text-text-muted mb-1 font-bold uppercase tracking-wider">Original MRP ₹</label>
                                    <input
                                        type="number"
                                        value={variant.originalPrice ?? ""}
                                        onChange={(e) =>
                                            handleVariantChange(
                                                index,
                                                "originalPrice",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full rounded-xl border border-border-base bg-bg-base px-2 py-1.5 text-center font-semibold text-xs focus:ring-2 focus:ring-primary/20 outline-none text-text-muted"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9.5px] text-text-muted mb-1 font-bold uppercase tracking-wider">Stock Qty</label>
                                    <input
                                        type="number"
                                        value={variant.inStock ?? ""}
                                        onChange={(e) =>
                                            handleVariantChange(
                                                index,
                                                "inStock",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full rounded-xl border border-border-base bg-bg-base px-2 py-1.5 text-center font-extrabold text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <MediaLibraryModal
                isOpen={activeVariantMediaIndex !== null}
                onClose={() => setActiveVariantMediaIndex(null)}
                onSelectImages={handleSelectVariantMedia}
                multiple={true}
            />
        </div>
    );
}

export default VariantTable;