import React from "react";
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaTable, FaAlignLeft } from "react-icons/fa";

/**
 * ProductDescriptionBuilder Component
 * Enables admins to construct structured descriptions containing ordered TEXT and TABLE sections.
 * Supports dynamic column & row editing for tables.
 */
export default function ProductDescriptionBuilder({ value, onChange }) {
  // Normalize incoming description state to structured format
  const descriptionState = typeof value === "object" && value !== null
    ? { short: value.short || "", sections: Array.isArray(value.sections) ? value.sections : [] }
    : {
        short: typeof value === "string" ? value : "",
        sections: typeof value === "string" && value.trim() ? [{ type: "TEXT", title: "Description", content: value }] : []
      };

  const updateShort = (shortText) => {
    onChange({
      ...descriptionState,
      short: shortText
    });
  };

  const updateSections = (newSections) => {
    onChange({
      ...descriptionState,
      sections: newSections
    });
  };

  // Section additions
  const addTextSection = () => {
    const newSection = {
      type: "TEXT",
      title: "",
      content: ""
    };
    updateSections([...descriptionState.sections, newSection]);
  };

  const addTableSection = () => {
    const newSection = {
      type: "TABLE",
      title: "Specifications",
      columns: ["Feature", "Value"],
      rows: [
        ["Feature 1", "Value 1"],
        ["Feature 2", "Value 2"]
      ]
    };
    updateSections([...descriptionState.sections, newSection]);
  };

  const removeSection = (index) => {
    const updated = descriptionState.sections.filter((_, i) => i !== index);
    updateSections(updated);
  };

  const moveSection = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= descriptionState.sections.length) return;

    const sections = [...descriptionState.sections];
    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;
    updateSections(sections);
  };

  const updateSectionField = (index, field, val) => {
    const sections = [...descriptionState.sections];
    sections[index] = { ...sections[index], [field]: val };
    updateSections(sections);
  };

  // Table Helpers
  const addColumn = (sectionIndex) => {
    const sections = [...descriptionState.sections];
    const sec = sections[sectionIndex];
    const colName = `Column ${sec.columns.length + 1}`;
    const newCols = [...sec.columns, colName];
    const newRows = sec.rows.map((row) => [...row, ""]);
    sections[sectionIndex] = { ...sec, columns: newCols, rows: newRows };
    updateSections(sections);
  };

  const removeColumn = (sectionIndex, colIndex) => {
    const sections = [...descriptionState.sections];
    const sec = sections[sectionIndex];
    if (sec.columns.length <= 1) return; // Keep at least 1 column

    const newCols = sec.columns.filter((_, i) => i !== colIndex);
    const newRows = sec.rows.map((row) => row.filter((_, i) => i !== colIndex));
    sections[sectionIndex] = { ...sec, columns: newCols, rows: newRows };
    updateSections(sections);
  };

  const updateColumnName = (sectionIndex, colIndex, name) => {
    const sections = [...descriptionState.sections];
    const sec = sections[sectionIndex];
    const newCols = [...sec.columns];
    newCols[colIndex] = name;
    sections[sectionIndex] = { ...sec, columns: newCols };
    updateSections(sections);
  };

  const addRow = (sectionIndex) => {
    const sections = [...descriptionState.sections];
    const sec = sections[sectionIndex];
    const emptyRow = new Array(sec.columns.length).fill("");
    sections[sectionIndex] = { ...sec, rows: [...sec.rows, emptyRow] };
    updateSections(sections);
  };

  const removeRow = (sectionIndex, rowIndex) => {
    const sections = [...descriptionState.sections];
    const sec = sections[sectionIndex];
    const newRows = sec.rows.filter((_, i) => i !== rowIndex);
    sections[sectionIndex] = { ...sec, rows: newRows };
    updateSections(sections);
  };

  const updateCell = (sectionIndex, rowIndex, colIndex, val) => {
    const sections = [...descriptionState.sections];
    const sec = sections[sectionIndex];
    const newRows = sec.rows.map((r, rIdx) => {
      if (rIdx !== rowIndex) return r;
      const updatedRow = [...r];
      updatedRow[colIndex] = val;
      return updatedRow;
    });
    sections[sectionIndex] = { ...sec, rows: newRows };
    updateSections(sections);
  };

  return (
    <div className="space-y-4">
      {/* Short Summary */}
      <div>
        <label className="block font-semibold text-text-base mb-1">
          Short Overview / Summary (Optional)
        </label>
        <textarea
          rows={2}
          value={descriptionState.short}
          onChange={(e) => updateShort(e.target.value)}
          placeholder="Brief 1-2 sentence overview of the product..."
          className="w-full rounded-lg border border-border-base bg-bg-base px-3 py-1.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block font-bold text-text-base uppercase tracking-wider text-[11px]">
            Content Sections ({descriptionState.sections.length})
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addTextSection}
              className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <FaAlignLeft size={10} /> + Text Section
            </button>
            <button
              type="button"
              onClick={addTableSection}
              className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <FaTable size={10} /> + Table Section
            </button>
          </div>
        </div>

        {descriptionState.sections.length === 0 ? (
          <div className="p-4 border-2 border-dashed border-border-base rounded-xl text-center text-text-muted text-xs">
            No description sections added. Click "+ Text Section" or "+ Table Section" above.
          </div>
        ) : (
          descriptionState.sections.map((section, idx) => (
            <div key={idx} className="border border-border-base rounded-xl p-3.5 bg-bg-surface space-y-3 shadow-2xs">
              {/* Section Header */}
              <div className="flex items-center justify-between gap-2 border-b border-border-base/50 pb-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-primary">
                  {section.type === "TEXT" ? <FaAlignLeft size={11} /> : <FaTable size={11} />}
                  {section.type} SECTION #{idx + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveSection(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded text-text-muted hover:text-text-base disabled:opacity-30 cursor-pointer"
                  >
                    <FaArrowUp size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 1)}
                    disabled={idx === descriptionState.sections.length - 1}
                    className="p-1 rounded text-text-muted hover:text-text-base disabled:opacity-30 cursor-pointer"
                  >
                    <FaArrowDown size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(idx)}
                    className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer ml-1"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              </div>

              {/* Title Field */}
              <div>
                <input
                  type="text"
                  value={section.title || ""}
                  onChange={(e) => updateSectionField(idx, "title", e.target.value)}
                  placeholder="Section Title (e.g. Overview or Technical Specifications)"
                  className="w-full rounded-lg border border-border-base bg-bg-base px-2.5 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* TEXT Section Builder */}
              {section.type === "TEXT" && (
                <div>
                  <textarea
                    rows={4}
                    value={section.content || ""}
                    onChange={(e) => updateSectionField(idx, "content", e.target.value)}
                    placeholder="Write detailed section content here..."
                    className="w-full rounded-lg border border-border-base bg-bg-base p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {/* TABLE Section Builder */}
              {section.type === "TABLE" && (
                <div className="space-y-3">
                  <div className="overflow-x-auto border border-border-base rounded-lg bg-bg-base">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border-base bg-gray-50/50">
                          {(section.columns || []).map((col, cIdx) => (
                            <th key={cIdx} className="p-2 border-r border-border-base/50 min-w-[120px]">
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={col}
                                  onChange={(e) => updateColumnName(idx, cIdx, e.target.value)}
                                  className="w-full bg-white border border-border-base rounded px-1.5 py-0.5 text-xs font-bold text-text-base focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                {section.columns.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeColumn(idx, cIdx)}
                                    className="text-red-500 hover:text-red-700 p-0.5"
                                    title="Delete column"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </th>
                          ))}
                          <th className="p-2 w-10 text-center"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(section.rows || []).map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-border-base/50 last:border-0 hover:bg-white/40">
                            {(section.columns || []).map((_, cIdx) => (
                              <td key={cIdx} className="p-1.5 border-r border-border-base/50">
                                <input
                                  type="text"
                                  value={row[cIdx] || ""}
                                  onChange={(e) => updateCell(idx, rIdx, cIdx, e.target.value)}
                                  placeholder="Cell value..."
                                  className="w-full bg-white border border-border-base/70 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </td>
                            ))}
                            <td className="p-1.5 text-center">
                              <button
                                type="button"
                                onClick={() => removeRow(idx, rIdx)}
                                className="text-red-500 hover:text-red-700 font-bold px-1"
                                title="Delete row"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Control Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addRow(idx)}
                      className="px-2.5 py-1 rounded bg-white border border-border-base text-text-base font-bold text-[10px] hover:bg-gray-50 cursor-pointer"
                    >
                      + Add Row
                    </button>
                    <button
                      type="button"
                      onClick={() => addColumn(idx)}
                      className="px-2.5 py-1 rounded bg-white border border-border-base text-text-base font-bold text-[10px] hover:bg-gray-50 cursor-pointer"
                    >
                      + Add Column
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
