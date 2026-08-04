import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaLayerGroup, FaMagic, FaTag, FaInfoCircle } from "react-icons/fa";

/**
 * Enhanced tag-based variant values input component.
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
        <div className="space-y-2">
            <input
                type="text"
                value={inputValue}
                placeholder="e.g. Small, Medium, Large (comma separated)"
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-xl border border-border-base bg-bg-surface px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-xs"
            />
            {values && values.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {values.map((val, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold"
                        >
                            <FaTag size={8} /> {val}
                        </span>
                    ))}
                </div>
            )}
        </div>
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
    // Quick option presets helper
    const applyPreset = (name, presetValues) => {
        const existingIndex = products.variantTypes?.findIndex(
            v => v.name?.toLowerCase() === name.toLowerCase()
        );
        if (existingIndex !== undefined && existingIndex >= 0) {
            handleVariantTypeValuesChange(existingIndex, presetValues);
        } else {
            const newIndex = products.variantTypes?.length || 0;
            addVariantType();
            setTimeout(() => {
                handleVariantTypeNameChange(newIndex, name);
                handleVariantTypeValuesChange(newIndex, presetValues);
            }, 50);
        }
    };

    return (
        <div className="bg-bg-surface border border-border-base rounded-2xl shadow-xs text-xs overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-base bg-bg-base/30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <FaLayerGroup size={14} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-text-base flex items-center gap-2">
                            Product Variant Options
                        </h2>
                        <p className="text-[10px] text-text-muted mt-0.5">
                            Define option attributes like Size, Color, or Material to generate combinations.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={addVariantType}
                    className="flex items-center gap-1.5 bg-primary text-compli px-3 py-1.5 rounded-xl font-extrabold hover:bg-primary-hover transition text-xs shadow-xs cursor-pointer active:scale-95"
                >
                    <FaPlus size={10} />
                    Add Option Attribute
                </button>
            </div>

            <div className="p-5 space-y-4">

                {/* Preset Suggestions */}
                <div className="flex flex-wrap items-center gap-2 bg-bg-base/50 p-2.5 rounded-xl border border-border-base/60">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <FaInfoCircle size={10} /> Quick Presets:
                    </span>
                    <button
                        type="button"
                        onClick={() => applyPreset("Size", ["S", "M", "L", "XL"])}
                        className="px-2.5 py-1 rounded-lg bg-bg-surface border border-border-base text-[10px] font-semibold text-text-base hover:border-primary/50 transition cursor-pointer"
                    >
                        + Size (S, M, L, XL)
                    </button>
                    <button
                        type="button"
                        onClick={() => applyPreset("Color", ["Black", "White", "Blue", "Red"])}
                        className="px-2.5 py-1 rounded-lg bg-bg-surface border border-border-base text-[10px] font-semibold text-text-base hover:border-primary/50 transition cursor-pointer"
                    >
                        + Color (Black, White, Blue)
                    </button>
                    <button
                        type="button"
                        onClick={() => applyPreset("Storage", ["64GB", "128GB", "256GB"])}
                        className="px-2.5 py-1 rounded-lg bg-bg-surface border border-border-base text-[10px] font-semibold text-text-base hover:border-primary/50 transition cursor-pointer"
                    >
                        + Storage (64GB, 128GB)
                    </button>
                </div>

                {/* Variant Types List */}
                <div className="space-y-3">
                    {(!products.variantTypes || products.variantTypes.length === 0) && (
                        <div className="border-2 border-dashed border-border-base rounded-2xl py-8 text-center bg-bg-base/20">
                            <div className="w-10 h-10 rounded-full bg-border-base/40 text-text-muted flex items-center justify-center mx-auto mb-2">
                                <FaLayerGroup size={16} />
                            </div>
                            <h3 className="font-bold text-text-base text-xs">
                                No Option Attributes Defined Yet
                            </h3>
                            <p className="text-[10px] text-text-muted mt-1 max-w-xs mx-auto">
                                Click <strong>Add Option Attribute</strong> or select a quick preset above to get started.
                            </p>
                        </div>
                    )}

                    {products.variantTypes?.map((variant, index) => (
                        <div
                            key={index}
                            className="border border-border-base/80 rounded-2xl p-4 bg-bg-base/40 space-y-3 hover:border-primary/30 transition-all shadow-xs"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">
                                    Option #{index + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => deleteVariantType(index)}
                                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                    title="Delete Option Attribute"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Option Name */}
                                <div className="sm:col-span-1">
                                    <label className="block font-bold text-text-base mb-1 text-[11px]">
                                        Attribute Name
                                    </label>
                                    <input
                                        type="text"
                                        value={variant.name}
                                        placeholder="e.g. Size, Color"
                                        onChange={(e) =>
                                            handleVariantTypeNameChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-border-base bg-bg-surface px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                {/* Values */}
                                <div className="sm:col-span-2">
                                    <label className="block font-bold text-text-base mb-1 text-[11px]">
                                        Option Values
                                    </label>
                                    <VariantValuesInput
                                        index={index}
                                        values={variant.values}
                                        onChange={handleVariantTypeValuesChange}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Generator Call to Actions */}
                {products.variantTypes?.length > 0 && (
                    <div className="pt-2 border-t border-border-base space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-primary/5 p-3 rounded-2xl border border-primary/20">
                            <div>
                                <h4 className="font-extrabold text-xs text-text-base">
                                    Generate Combination Grid
                                </h4>
                                <p className="text-[10px] text-text-muted mt-0.5">
                                    Combines all attribute options to generate individual SKU items below.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={generateCombinations}
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-extrabold transition text-xs shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95"
                                >
                                    <FaMagic size={12} />
                                    Generate Combinations
                                </button>

                                <button
                                    type="button"
                                    onClick={addManualVariant}
                                    className="flex items-center gap-1.5 bg-bg-surface hover:bg-bg-base text-text-base border border-border-base px-3 py-2 rounded-xl font-bold transition text-xs cursor-pointer active:scale-95"
                                >
                                    <FaPlus size={10} />
                                    Add Custom
                                </button>
                            </div>
                        </div>

                        {/* Summary Badges */}
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="rounded-xl bg-bg-base/60 border border-border-base/60 p-2.5">
                                <p className="text-[9px] uppercase font-bold text-text-muted">Option Attributes</p>
                                <p className="text-sm font-black text-text-base mt-0.5">{products.variantTypes.length}</p>
                            </div>
                            <div className="rounded-xl bg-bg-base/60 border border-border-base/60 p-2.5">
                                <p className="text-[9px] uppercase font-bold text-text-muted">Generated Variants</p>
                                <p className="text-sm font-black text-primary mt-0.5">{products.variants?.length || 0}</p>
                            </div>
                            <div className="rounded-xl bg-bg-base/60 border border-border-base/60 p-2.5">
                                <p className="text-[9px] uppercase font-bold text-text-muted">Publish Status</p>
                                <p className={`text-xs font-black mt-1 ${products.isActive !== false ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                                    {products.isActive !== false ? "Live" : "Draft"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ProductVariants;