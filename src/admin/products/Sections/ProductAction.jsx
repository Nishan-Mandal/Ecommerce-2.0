import React from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";

function ProductActions({
    uploading,
    handleCancel,
    addProduct
}) {
    return (
       <>
    {/* Desktop / Tablet */}
    <div className="hidden md:block sticky bottom-0 z-40">
        <div className="bg-bg-surface/95 backdrop-blur-xl border border-border-base rounded-xl shadow-md">
            <div className="px-6 py-3 flex items-center justify-between">

                <div>
                    <h3 className="text-sm font-bold text-text-base">
                        Ready to Publish?
                    </h3>

                    <p className="text-xs text-text-muted">
                        Review your information before saving this product.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-xl border border-border-base bg-bg-base hover:bg-bg-base/70 transition font-semibold flex items-center gap-2"
                    >
                        <FaArrowLeft />
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={uploading}
                        onClick={addProduct}
                        className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-compli font-semibold flex items-center gap-2 disabled:opacity-50"
                    >
                        <FaSave />
                        {uploading ? "Saving..." : "Save Product"}
                    </button>
                </div>

            </div>
        </div>
    </div>

    {/* Mobile */}
    <div className="md:hidden  bottom-16 left-0 right-0 z-40 ">
        <div className="p-3 grid grid-cols-2 gap-4">

            <button
                type="button"
                onClick={handleCancel}
                className="flex-1 h-8 rounded-xl border border-border-base bg-bg-base font-semibold"
            >
                Cancel
            </button>

            <button
                type="button"
                disabled={uploading}
                onClick={addProduct}
                className="flex-[2] h-8 rounded-xl bg-primary text-compli font-semibold disabled:opacity-50"
            >
                {uploading ? "Saving..." : "Save Product"}
            </button>

        </div>
    </div>

    {/* Mobile Spacer */}
    <div className="h-20 md:hidden" />
</>
    );
}

export default ProductActions;