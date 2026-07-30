import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * DescriptionTab
 * Renders structured product description sections (Text & Table)
 * with complete backward compatibility for legacy string/markdown descriptions.
 */
export default function DescriptionTab({ description, specifications }) {
    if (!description && (!specifications || specifications.length === 0)) {
        return (
            <div className="py-12 text-center text-text-muted text-sm italic font-medium">
                No details available for this product.
            </div>
        );
    }

    // Legacy Markdown String Fallback
    if (typeof description === "string") {
        return (
            <div className="py-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {description}
                </ReactMarkdown>
            </div>
        );
    }

    const shortOverview = description?.short || "";
    const sections = Array.isArray(description?.sections) ? description.sections : [];

    return (
        <div className="py-6 space-y-8">
            {/* Short Overview Summary */}
            {shortOverview && (
                <div className="bg-bg-base/40 border border-border-base/50 rounded-2xl p-4 sm:p-5">
                    <p className="text-sm sm:text-base text-text-base leading-relaxed font-medium">
                        {shortOverview}
                    </p>
                </div>
            )}

            {/* Structured Sections */}
            {sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-3">
                    {section.title && (
                        <h3 className="text-lg sm:text-xl font-bold text-text-base pb-2 border-b border-border-base/40">
                            {section.title}
                        </h3>
                    )}

                    {/* TEXT Section */}
                    {section.type === "TEXT" && section.content && (
                        <div className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                            {section.content}
                        </div>
                    )}

                    {/* TABLE Section */}
                    {section.type === "TABLE" && (
                        <div className="overflow-x-auto rounded-2xl border border-border-base/60 bg-bg-surface shadow-2xs">
                            <table className="w-full text-left text-xs sm:text-sm border-collapse">
                                <thead>
                                    <tr className="bg-bg-base/80 border-b border-border-base/60">
                                        {(section.columns || []).map((col, cIdx) => (
                                            <th
                                                key={cIdx}
                                                className="px-4 py-3 font-extrabold text-text-base uppercase tracking-wider text-[11px] border-r border-border-base/40 last:border-0"
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(section.rows || []).map((row, rIdx) => (
                                        <tr
                                            key={rIdx}
                                            className="border-b border-border-base/40 last:border-0 hover:bg-bg-base/40 transition-colors"
                                        >
                                            {(row || []).map((cell, cIdx) => (
                                                <td
                                                    key={cIdx}
                                                    className={`px-4 py-3 border-r border-border-base/30 last:border-0 ${
                                                        cIdx === 0 ? "font-bold text-text-base" : "text-text-muted"
                                                    }`}
                                                >
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}