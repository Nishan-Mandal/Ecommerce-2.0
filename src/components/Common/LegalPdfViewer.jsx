import React from "react";
import { FaFilePdf, FaExternalLinkAlt, FaDownload } from "react-icons/fa";

/**
 * LegalPdfViewer
 * Renders uploaded PDF files in a clean, responsive viewer.
 * Includes direct open & download actions for universal accessibility.
 */
export default function LegalPdfViewer({ pdfUrl, title = "Legal Document" }) {
  if (!pdfUrl) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-text-muted p-8 text-center bg-bg-surface rounded-2xl border border-border-base/60 my-6">
        <FaFilePdf size={48} className="text-primary/40 mb-3" />
        <h2 className="text-xl font-bold text-text-base mb-1">{title}</h2>
        <p className="text-xs text-text-muted max-w-md">
          This document has not been uploaded yet. Please check back soon or visit the admin configuration page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-4">
      {/* Document Header & Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-bg-surface border border-border-base/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
            <FaFilePdf size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-base leading-tight">{title}</h1>
            <p className="text-[11px] text-text-muted mt-0.5">Official PDF Policy Document</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial h-9 px-3.5 rounded-xl border border-border-base bg-white dark:bg-bg-base hover:bg-gray-50 text-text-base text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <FaExternalLinkAlt size={11} />
            <span>Open PDF</span>
          </a>
          <a
            href={pdfUrl}
            download={`${title.toLowerCase().replace(/\s+/g, "_")}.pdf`}
            className="flex-1 sm:flex-initial h-9 px-3.5 rounded-xl bg-primary text-compli hover:bg-primary-hover text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <FaDownload size={11} />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* PDF Responsive Embedded Viewport */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-border-base/80 bg-white shadow-sm min-h-[75vh]">
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=0`}
          title={title}
          className="w-full h-[78vh] border-0"
        />
      </div>
    </div>
  );
}
