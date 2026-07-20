import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaLayerGroup, FaMagic } from "react-icons/fa";

/**
 * Local helper input component to allow typing commas and spaces in React controlled input.
 */
function VariantValuesInput({ index, values, onChange }) {
    const [inputValue, setInputValue] = useState(values?.join(", ") || "");

    useEffect(() => {
        const currentString = values?.join(", ") || "";
        const cleanedInput = inputValue.split(",").map(v => v.trim()).filter(Boolean).join(", ");
        const cleanedProp = values?.filter(Boolean).join(", ") || "";
        if (cleanedInput !== cleanedProp) {
            setInputValue(currentString);
        }
    }, [values]);

    const handleChange = (e) => {
        const val = e.target.value;
        setInputValue(val);

        const parsedArray = val
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);

        onChange(index, parsedArray);
    };

    const handleBlur = () => {
        const cleanedValues = inputValue
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
        
        onChange(index, cleanedValues);
        setInputValue(cleanedValues.join(", "));
    };

    return (
        <input
            type="text"
            value={inputValue}
            placeholder="S, M, L, XL"
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-border-base bg-bg-surface px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none"
        />
    );
}

function ProductVariants({
    products,
    addVariantType,
    deleteVariantType,
    handleVariantTypeNameChange,
    handleVariantTypeValuesChange,
    generateCombinations,
    addManualVariant,
}) {
    return (
        <div className="bg-bg-surface border border-border-base rounded-xl shadow-xs text-xs">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-base">
                <div>
                    <h2 className="text-sm font-bold text-text-base flex items-center gap-1.5">
                        <FaLayerGroup className="text-primary" />
                        Product Variants
                    </h2>
                    <p className="text-[10px] text-text-muted mt-0.5">
                        Configure options like Size, Color, Material, etc.
                    </p>
                </div>

                <button
                    onClick={addVariantType}
                    className="flex items-center gap-1.5 bg-primary text-compli px-2.5 py-1 rounded-lg font-semibold hover:bg-primary-hover transition text-[11px]"
                >
                    <FaPlus className="text-[9px]" />
                    Add Option
                </button>
            </div>

            <div className="p-4">

                {/* Variant Types */}
                <div className="space-y-3">
                    {products.variantTypes?.length === 0 && (
                        <div className="border border-dashed border-border-base rounded-xl py-6 text-center">
                            <h3 className="font-semibold text-text-base text-xs">
                                No Variant Options
                            </h3>
                            <p className="text-[10px] text-text-muted mt-1">
                                Click <strong>Add Option</strong> to start.
                            </p>
                        </div>
                    )}

                    {products.variantTypes?.map((variant, index) => (
                        <div
                            key={index}
                            className="border border-border-base rounded-xl p-3 bg-bg-base"
                        >
                            <div className="flex items-start gap-3">
                                {/* Option Name */}
                                <div className="flex-1">
                                    <label className="block font-semibold mb-1">
                                        Option Name
                                    </label>
                                    <input
                                        type="text"
                                        value={variant.name}
                                        placeholder="Size"
                                        onChange={(e) =>
                                            handleVariantTypeNameChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-border-base bg-bg-surface px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </div>

                               
                                {/* Values */}
                                <div className="flex-[2]">
                                    <label className="block font-semibold mb-1">
                                        Values
                                    </label>

                                    <VariantValuesInput
                                        index={index}
                                        values={variant.values}
                                        onChange={handleVariantTypeValuesChange}
                                    />

                                    <p className="text-[9px] text-text-muted mt-1">
                                        Separate values using comma (,).
                                    </p>
                                </div>

                                {/* Delete */}
                                <button
                                    type="button"
                                    onClick={() => deleteVariantType(index)}
                                    className="mt-5 h-7 w-7 rounded bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                                >
                                    <FaTrash className="text-xs" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                {products.variantTypes?.length > 0 && (
                    <>
                        <div className="border-t border-border-base my-4"></div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2.5">
                            <button
                                type="button"
                                onClick={generateCombinations}
                                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold transition text-xs"
                            >
                                <FaMagic />
                                Generate Variants
                            </button>

                            <button
                                type="button"
                                onClick={addManualVariant}
                                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-semibold transition text-xs"
                            >
                                <FaPlus />
                                Add Manual
                            </button>
                        </div>

                        {/* Summary */}
                        <div className="mt-4 grid grid-cols-3 gap-3">
                            <div className="rounded-lg bg-bg-base border border-border-base p-2">
                                <div className="text-[10px] text-text-muted">
                                    Option Types
                                </div>
                                <div className="text-base font-bold mt-0.5">
                                    {products.variantTypes.length}
                                </div>
                            </div>

                            <div className="rounded-lg bg-bg-base border border-border-base p-2">
                                <div className="text-[10px] text-text-muted">
                                    Variants
                                </div>
                                <div className="text-base font-bold mt-0.5">
                                    {products.variants?.length || 0}
                                </div>
                            </div>

                            <div className="rounded-lg bg-bg-base border border-border-base p-2">
                                <div className="text-[10px] text-text-muted">
                                    Status
                                </div>
                                <div className="text-xs font-semibold mt-1 text-primary">
                                    Ready
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

export default ProductVariants;