import React from "react";

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

                    {/* Price */}
                    <div>
                        <label className="block font-semibold text-text-base mb-1">
                            Base Price
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-semibold">
                                ₹
                            </span>
                            <input
                                type="text"
                                value={products.price || ""}
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

                    {/* Tags */}
                    <div>
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

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block font-semibold text-text-base mb-1">
                            Product Description
                        </label>
                        <textarea
                            rows={4}
                            value={products.description || ""}
                            onChange={(e) =>
                                setProducts({
                                    ...products,
                                    description: e.target.value
                                })
                            }
                            placeholder="Write a detailed description..."
                            className="w-full rounded-lg border border-border-base bg-bg-base px-3 py-1.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                </div>
            </div>

        </div>
    );
}

export default ProductBasicInfo;