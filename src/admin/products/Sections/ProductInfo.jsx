import React from "react";
import ProductDescriptionBuilder from "./ProductDescriptionBuilder";
import { FaTag, FaBoxOpen, FaLayerGroup, FaDollarSign, FaFileAlt, FaCheck, FaInfoCircle } from "react-icons/fa";

/**
 * Section 2: Basic Information
 */
export function ProductBasicInfo({ products, setProducts, handleTagsChange }) {
    return (
        <div className="bg-bg-surface border border-border-base rounded-2xl shadow-xs overflow-hidden text-xs">
            {/* Section 2 Header */}
            <div className="px-5 py-3.5 border-b border-border-base flex items-center justify-between bg-bg-base/30">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                        2
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-text-base flex items-center gap-2">
                            Basic Information
                        </h2>
                        <p className="text-[10px] text-text-muted mt-0.5">
                            Define the product brand, title, category, and search keywords.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Brand */}
                    <div>
                        <label className="block font-bold text-text-base mb-1.5">
                            Brand Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={products.brand || ""}
                            onChange={(e) =>
                                setProducts({
                                    ...products,
                                    brand: e.target.value
                                })
                            }
                            placeholder="e.g. Apple, Nike, Samsung"
                            className="w-full rounded-xl border border-border-base bg-bg-base px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block font-bold text-text-base mb-1.5">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={products.category || ""}
                            onChange={(e) =>
                                setProducts({
                                    ...products,
                                    category: e.target.value
                                })
                            }
                            placeholder="e.g. Electronics, Footwear, Fashion"
                            className="w-full rounded-xl border border-border-base bg-bg-base px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                        />
                    </div>

                    {/* Product Title */}
                    <div className="md:col-span-2">
                        <label className="block font-bold text-text-base mb-1.5">
                            Product Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={products.title || ""}
                            onChange={(e) =>
                                setProducts({
                                    ...products,
                                    title: e.target.value
                                })
                            }
                            placeholder="e.g. Premium Noise Cancelling Headphones"
                            className="w-full rounded-xl border border-border-base bg-bg-base px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 font-extrabold text-sm"
                        />
                    </div>

                    {/* Tags / Search Keywords */}
                    <div className="md:col-span-2">
                        <label className="block font-bold text-text-base mb-1.5">
                            Search Tags & Keywords <span className="text-text-muted text-[10px] font-normal">(Comma separated)</span>
                        </label>
                        <input
                            type="text"
                            value={typeof products.tags === 'string' ? products.tags : (Array.isArray(products.tags) ? products.tags.join(", ") : "")}
                            onChange={handleTagsChange}
                            placeholder="e.g. wireless, bluetooth, gaming, bass"
                            className="w-full rounded-xl border border-border-base bg-bg-base px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                        />
                        {(() => {
                            const badges = typeof products.tags === 'string'
                                ? products.tags.split(',').map(t => t.trim()).filter(Boolean)
                                : (Array.isArray(products.tags) ? products.tags : []);
                            if (badges.length === 0) return null;
                            return (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {badges.map((tag, idx) => (
                                        <span key={idx} className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Section 3: Variants or Single Product Mode Switch
 */
export function ProductModeSection({ products, setProducts }) {
    const isVariants = Boolean(products.hasVariants);

    return (
        <div className="bg-bg-surface border border-border-base rounded-2xl shadow-xs overflow-hidden text-xs">
            {/* Section 3 Header */}
            <div className="px-5 py-3.5 border-b border-border-base flex items-center justify-between bg-bg-base/30">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                        3
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-text-base">
                            Variants or Single Product
                        </h2>
                        <p className="text-[10px] text-text-muted mt-0.5">
                            Choose whether this product is a single SKU or has multiple options (e.g. Size, Color, Storage).
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Single Product Card */}
                    <div
                        onClick={() => setProducts({ ...products, hasVariants: false })}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                            !isVariants
                                ? "border-primary bg-primary/5 shadow-xs"
                                : "border-border-base bg-bg-base hover:border-primary/50"
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            !isVariants ? "bg-primary text-white" : "bg-bg-surface text-text-muted border border-border-base"
                        }`}>
                            <FaBoxOpen size={16} />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-extrabold text-xs text-text-base">
                                    Single Standalone Product
                                </h3>
                                {!isVariants && <FaCheck className="text-primary" size={12} />}
                            </div>
                            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                                Standard item with 1 fixed selling price, 1 MRP, and 1 stock quantity. No size or color variants.
                            </p>
                        </div>
                    </div>

                    {/* Product with Variants Card */}
                    <div
                        onClick={() => setProducts({ ...products, hasVariants: true })}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                            isVariants
                                ? "border-primary bg-primary/5 shadow-xs"
                                : "border-border-base bg-bg-base hover:border-primary/50"
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isVariants ? "bg-primary text-white" : "bg-bg-surface text-text-muted border border-border-base"
                        }`}>
                            <FaLayerGroup size={16} />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-extrabold text-xs text-text-base">
                                    Product with Variants
                                </h3>
                                {isVariants && <FaCheck className="text-primary" size={12} />}
                            </div>
                            <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                                Multi-SKU product with custom option attributes (e.g., Size, Color, Storage) with per-variant prices and inventory.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Section 4: Pricing and Inventory (Single Product Mode)
 */
export function ProductPricingSection({ products, setProducts }) {
    if (products.hasVariants) {
        return (
            <div className="bg-bg-surface border border-border-base rounded-2xl shadow-xs overflow-hidden text-xs">
                {/* Section 4 Header */}
                <div className="px-5 py-3.5 border-b border-border-base flex items-center justify-between bg-bg-base/30">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-primary text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                            4
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-text-base">
                                Pricing and Inventory
                            </h2>
                            <p className="text-[10px] text-text-muted mt-0.5">
                                Prices, MRP, and stock inventory are managed per-variant in the matrix below.
                            </p>
                        </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold">
                        Multi-Variant Inventory
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-bg-surface border border-border-base rounded-2xl shadow-xs overflow-hidden text-xs">
            {/* Section 4 Header */}
            <div className="px-5 py-3.5 border-b border-border-base flex items-center justify-between bg-bg-base/30">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                        4
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-text-base">
                            Pricing and Inventory
                        </h2>
                        <p className="text-[10px] text-text-muted mt-0.5">
                            Set standalone selling price, original MRP, and stock quantity.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Selling Price */}
                    <div>
                        <label className="block font-bold text-text-base mb-1.5">
                            Selling Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted font-black text-sm">
                                ₹
                            </span>
                            <input
                                type="number"
                                value={products.price ?? ""}
                                onChange={(e) =>
                                    setProducts({
                                        ...products,
                                        price: e.target.value
                                    })
                                }
                                placeholder="499"
                                className="w-full pl-8 rounded-xl border border-border-base bg-bg-base px-3.5 py-2 text-xs font-black focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                            />
                        </div>
                    </div>

                    {/* Original MRP */}
                    <div>
                        <label className="block font-bold text-text-base mb-1.5">
                            Original MRP (₹) <span className="text-text-muted text-[10px] font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted font-black text-sm">
                                ₹
                            </span>
                            <input
                                type="number"
                                value={products.originalPrice ?? ""}
                                onChange={(e) =>
                                    setProducts({
                                        ...products,
                                        originalPrice: e.target.value
                                    })
                                }
                                placeholder="799"
                                className="w-full pl-8 rounded-xl border border-border-base bg-bg-base px-3.5 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-muted"
                            />
                        </div>
                    </div>

                    {/* Stock Qty */}
                    <div>
                        <label className="block font-bold text-text-base mb-1.5">
                            In-Stock Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={products.inStock ?? ""}
                            onChange={(e) =>
                                setProducts({
                                    ...products,
                                    inStock: e.target.value
                                })
                            }
                            placeholder="25"
                            className="w-full rounded-xl border border-border-base bg-bg-base px-3.5 py-2 text-xs font-black focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Section 5: Description / Content
 */
export function ProductContentSection({ products, setProducts }) {
    return (
        <div className="bg-bg-surface border border-border-base rounded-2xl shadow-xs overflow-hidden text-xs">
            {/* Section 5 Header */}
            <div className="px-5 py-3.5 border-b border-border-base flex items-center justify-between bg-bg-base/30">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                        5
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-text-base">
                            Description / Content
                        </h2>
                        <p className="text-[10px] text-text-muted mt-0.5">
                            Provide product summary and construct structured text or specifications table sections.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <ProductDescriptionBuilder
                    value={products.description}
                    onChange={(newDesc) =>
                        setProducts({
                            ...products,
                            description: newDesc
                        })
                    }
                />
            </div>
        </div>
    );
}

export default ProductBasicInfo;