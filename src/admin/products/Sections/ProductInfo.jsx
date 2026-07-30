import ProductDescriptionBuilder from "./ProductDescriptionBuilder";

function ProductBasicInfo({
    products,
    setProducts,
    handleTagsChange
}) {
    return (
        <div className="bg-bg-surface border border-border-base rounded-xl shadow-xs text-xs">

            {/* Header */}
            <div className="px-4 py-2.5 border-b border-border-base flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-bold text-text-base">
                        Product Information
                    </h2>
                    <p className="text-[10px] text-text-muted mt-0.5">
                        Enter the basic details of your product.
                    </p>
                </div>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">

                    {/* Brand */}
                    <div>
                        <label className="block font-semibold text-text-base mb-1">
                            Brand Name
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
                            placeholder="Apple"
                            className="w-full rounded-lg border border-border-base bg-bg-base px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block font-semibold text-text-base mb-1">
                            Category
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
                            placeholder="Electronics"
                            className="w-full rounded-lg border border-border-base bg-bg-base px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Product Title */}
                    <div className="md:col-span-2">
                        <label className="block font-semibold text-text-base mb-1">
                            Product Title
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
                            placeholder="Premium Wireless Headphones"
                            className="w-full rounded-lg border border-border-base bg-bg-base px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Variant Configuration Toggle */}
                    <div className="md:col-span-2 bg-bg-base/60 border border-border-base/70 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h4 className="text-xs font-bold text-text-base flex items-center gap-1.5">
                                Product Type & Variants Mode
                            </h4>
                            <p className="text-[10px] text-text-muted mt-0.5">
                                {products.hasVariants
                                    ? "This product has multiple option combinations (e.g. Size, Color, Storage) with individual prices and inventory."
                                    : "This is a single standalone product with one fixed price and stock quantity."}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 bg-bg-surface border border-border-base p-1 rounded-lg shrink-0">
                            <button
                                type="button"
                                onClick={() => setProducts({ ...products, hasVariants: false })}
                                className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                                    !products.hasVariants
                                        ? "bg-primary text-compli shadow-xs"
                                        : "text-text-muted hover:text-text-base"
                                }`}
                            >
                                Single Product
                            </button>
                            <button
                                type="button"
                                onClick={() => setProducts({ ...products, hasVariants: true })}
                                className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                                    products.hasVariants
                                        ? "bg-primary text-compli shadow-xs"
                                        : "text-text-muted hover:text-text-base"
                                }`}
                            >
                                Has Variants
                            </button>
                        </div>
                    </div>

                    {/* Single Product Price & Stock Inputs */}
                    {!products.hasVariants ? (
                        <>
                            <div>
                                <label className="block font-semibold text-text-base mb-1">
                                    Selling Price (₹) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-semibold">
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
                                        className="w-full pl-7 rounded-lg border border-border-base bg-bg-base px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-text-base mb-1">
                                    Original MRP Price (₹) <span className="text-text-muted text-[10px] font-normal">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-semibold">
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
                                        className="w-full pl-7 rounded-lg border border-border-base bg-bg-base px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-text-base mb-1">
                                    In-Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={products.inStock ?? ""}
                                    onChange={(e) =>
                                        setProducts({
                                            ...products,
                                            inStock: e.target.value
                                        })
                                    }
                                    placeholder="25"
                                    className="w-full rounded-lg border border-border-base bg-bg-base px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="md:col-span-2  p-1 text-[11px]  font-medium">
                         <span className="text-red-500">*</span>Prices, Original MRP, and Stock Quantities are managed per-variant in the <strong>Product Variants</strong> section below.
                        </div>
                    )}

                    {/* Tags */}
                    <div className={!products.hasVariants ? "" : "md:col-span-2"}>
                        <label className="block font-semibold text-text-base mb-1">
                            Search Tags
                        </label>
                        <input
                            type="text"
                            value={products.tags?.join(", ") || ""}
                            onChange={handleTagsChange}
                            placeholder="wireless, gaming, bluetooth"
                            className="w-full rounded-lg border border-border-base bg-bg-base px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Description Builder */}
                    <div className="md:col-span-2 border-t border-border-base/50 pt-3 mt-1">
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
            </div>

        </div>
    );
}

export default ProductBasicInfo;