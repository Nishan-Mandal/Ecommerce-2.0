import React from "react";
import {
    FaArrowLeft,
    FaBoxOpen,
    FaSave
} from "react-icons/fa";

function ProductHeader({
    title = "Add Product",
    description = "Create a new product for your catalog with images, pricing and variants.",
    uploading,
    handleCancel,
    addProduct
}) {
    return (
        <div className="">

            <div className="px-1 py-1 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* Left */}

                <div className="flex items-center gap-5">

                    <div className="  bg-primary/10 flex items-center justify-center">

                        <FaBoxOpen
                            size={30}
                            className="text-primary"
                        />

                    </div>

                    <div>

                        <h1 className="text-lg font-black text-text-base">
                            {title}
                        </h1>

                        <p className="text-text-muted text-xs  ">
                            {description}
                        </p>

                    </div>

                </div>

                {/* Right */}

                <div className="flex gap-2 text-sm">
                    <button
                        disabled={uploading}
                        onClick={addProduct}
                        className="px-3 py-1  text-sm rounded-lg bg-primary hover:bg-primary-hover text-compli font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2 transition"
                    >
                        <FaSave className="text-xs" />

                        {uploading
                            ? "Uploading..."
                            : "Save Product"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ProductHeader;