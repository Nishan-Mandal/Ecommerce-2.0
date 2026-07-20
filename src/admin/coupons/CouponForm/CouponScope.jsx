import React from "react";

function CouponScope({
    coupon,
    setCoupon,
    products = [],
    categories = [],
}) {
    const updateField = (field, value) => {
        setCoupon((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const toggleProduct = (id) => {
        const exists = (coupon.applicableProducts || []).includes(id);
        updateField(
            "applicableProducts",
            exists
                ? coupon.applicableProducts.filter((p) => p !== id)
                : [...(coupon.applicableProducts || []), id]
        );
    };

    const toggleCategory = (id) => {
        const exists = (coupon.applicableCategories || []).includes(id);
        updateField(
            "applicableCategories",
            exists
                ? coupon.applicableCategories.filter((c) => c !== id)
                : [...(coupon.applicableCategories || []), id]
        );
    };

    return (
        <div className="bg-bg-base border border-border-base rounded-xl text-xs shadow-xs">

            {/* Header */}
            <div className="border-b border-border-base px-3 py-2">
                <h3 className="font-bold text-text-base">
                    Coupon Scope
                </h3>
                <p className="text-[10px] text-text-muted mt-0.5">
                    Select where this coupon can be applied.
                </p>
            </div>

            {/* Body */}
            <div className="p-3 space-y-3">

                {/* Applies To */}
                <div>
                    <label className="block font-semibold mb-2">
                        Applies To
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                            { value: "ALL", label: "All Products" },
                            { value: "PRODUCT", label: "Selected Products" },
                            { value: "CATEGORY", label: "Selected Categories" },
                        ].map((item) => (
                            <label
                                key={item.value}
                                className={`border rounded-lg p-2.5 cursor-pointer transition flex items-center justify-between ${
                                    coupon.appliesTo === item.value
                                        ? "border-primary bg-primary/5 text-primary font-bold"
                                        : "border-border-base bg-bg-surface"
                                }`}
                            >
                                <input
                                    type="radio"
                                    className="hidden"
                                    checked={coupon.appliesTo === item.value}
                                    onChange={() => updateField("appliesTo", item.value)}
                                />
                                <span>{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Applicable Products Selection list */}
                {coupon.appliesTo === "PRODUCT" && (
                    <div>
                        <label className="block font-semibold mb-1.5">
                            Applicable Products
                        </label>
                        <div className="max-h-48 overflow-y-auto border border-border-base rounded-lg bg-bg-surface">
                            {products.length === 0 && (
                                <div className="p-3 text-[10px] text-text-muted text-center">
                                    No Products Found
                                </div>
                            )}

                            {products.map((product) => (
                                <label
                                    key={product.productId}
                                    className="flex items-center justify-between px-3 py-1.5 border-b border-border-base last:border-0 hover:bg-bg-base cursor-pointer"
                                >
                                    <span className="text-[11px] truncate mr-2">
                                        {product.title}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={(coupon.applicableProducts || []).includes(product.productId)}
                                        onChange={() => toggleProduct(product.productId)}
                                        className="w-3.5 h-3.5 accent-primary"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Applicable Categories Selection list */}
                {coupon.appliesTo === "CATEGORY" && (
                    <div>
                        <label className="block font-semibold mb-1.5">
                            Applicable Categories
                        </label>
                        <div className="max-h-48 overflow-y-auto border border-border-base rounded-lg bg-bg-surface">
                            {categories.length === 0 && (
                                <div className="p-3 text-[10px] text-text-muted text-center">
                                    No Categories Found
                                </div>
                            )}

                            {categories.map((category) => (
                                <label
                                    key={category.categoryId}
                                    className="flex items-center justify-between px-3 py-1.5 border-b border-border-base last:border-0 hover:bg-bg-base cursor-pointer"
                                >
                                    <span className="text-[11px] truncate mr-2">
                                        {category.name}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={(coupon.applicableCategories || []).includes(category.categoryId)}
                                        onChange={() => toggleCategory(category.categoryId)}
                                        className="w-3.5 h-3.5 accent-primary"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}

export default CouponScope;