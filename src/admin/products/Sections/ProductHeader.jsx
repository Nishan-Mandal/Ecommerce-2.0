import React from "react";
import {
    FaBoxOpen,
    FaSave,
    FaCheckCircle,
    FaEyeSlash
} from "react-icons/fa";

function ProductHeader({
    title = "Add Product",
    description = "Create a new product for your catalog with images, pricing and variants.",
    uploading,
    handleCancel,
    addProduct,
    products,
    setProducts
}) {
    const isLive = products ? products.isActive !== false : true;

    return (
        <div className="bg-bg-surface border border-border-base rounded-2xl p-4 shadow-xs">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                {/* Left */}
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FaBoxOpen
                            size={24}
                            className="text-primary"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-base font-black text-text-base">
                                {title}
                            </h1>

                            {/* Live / Draft Badge Indicator */}
                            {products && (
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border inline-flex items-center gap-1.5 ${
                                    isLive
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                                    {isLive ? "Live" : "Draft"}
                                </span>
                            )}
                        </div>

                        <p className="text-text-muted text-xs mt-0.5">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2.5 shrink-0">
                    {/* Top Status Switch Button */}
                    {products && setProducts && (
                        <button
                            type="button"
                            onClick={() => setProducts({ ...products, isActive: products.isActive === false ? true : false })}
                            className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2 border shadow-xs active:scale-95 ${
                                isLive
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-emerald-600/20"
                                    : "bg-slate-800 hover:bg-slate-900 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900 shadow-slate-800/20"
                            }`}
                            title={isLive ? "Click to set Draft mode" : "Click to set Live (Published)"}
                        >
                            <span className={`w-2 h-2 rounded-full ${isLive ? "bg-white animate-pulse" : "bg-slate-400"}`} />
                            <span>{isLive ? "Status: Live" : "Status: Draft"}</span>
                        </button>
                    )}

                    {/* Save Button */}
                    <button
                        disabled={uploading}
                        onClick={addProduct}
                        className="px-4 py-2 text-xs rounded-xl bg-primary hover:bg-primary-hover text-compli font-extrabold shadow-md disabled:opacity-50 flex items-center gap-2 transition active:scale-95 cursor-pointer"
                    >
                        <FaSave size={12} />
                        <span>{uploading ? "Uploading..." : "Save Product"}</span>
                    </button>
                </div>

            </div>

        </div>
    );
}

export default ProductHeader;