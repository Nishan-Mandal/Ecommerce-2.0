import React from "react";
import { FaMagic, FaPlus, FaTrash } from "react-icons/fa";

/**
 * VariantGeneratorBar Component
 * Renders combination generator actions (Generate, Custom, Clear) and summary counters.
 */
export default function VariantGeneratorBar({
  optionCount,
  variantCount,
  isActive,
  generateCombinations,
  addManualVariant,
  onClearAll,
}) {
  return (
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

          {variantCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-xl font-bold transition text-xs cursor-pointer active:scale-95"
              title="Clear all generated variant combinations"
            >
              <FaTrash size={10} />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Summary Badges */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-bg-base/60 border border-border-base/60 p-2.5">
          <p className="text-[9px] uppercase font-bold text-text-muted">Option Attributes</p>
          <p className="text-sm font-black text-text-base mt-0.5">{optionCount}</p>
        </div>
        <div className="rounded-xl bg-bg-base/60 border border-border-base/60 p-2.5">
          <p className="text-[9px] uppercase font-bold text-text-muted">Generated Variants</p>
          <p className="text-sm font-black text-primary mt-0.5">{variantCount}</p>
        </div>
        <div className="rounded-xl bg-bg-base/60 border border-border-base/60 p-2.5">
          <p className="text-[9px] uppercase font-bold text-text-muted">Publish Status</p>
          <p className={`text-xs font-black mt-1 ${isActive !== false ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {isActive !== false ? "Live" : "Draft"}
          </p>
        </div>
      </div>
    </div>
  );
}
