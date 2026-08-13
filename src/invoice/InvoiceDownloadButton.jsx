import React, { useState, useEffect } from "react";
import { FaFileDownload, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { invoiceService } from "../services/invoice/invoiceService.js";
import { configureService } from "../services/configure/configureService.js";
import { normalizeInvoiceData } from "./invoiceDataUtils.js";
import { ACTIVE_INVOICE_TEMPLATE } from "./templates/index.js";
import InvoiceRenderer from "./InvoiceRenderer.jsx";
import getFriendlyErrorMessage from "../utils/firebaseErrorHandler.js";

/**
 * InvoiceDownloadButton Component
 * Renders a client-facing Download Invoice button with dual-source decision engine:
 * 1. Admin Uploaded PDF -> Fetch from Storage & Download.
 * 2. System Generated -> Render InvoiceRenderer & Download locally using ACTIVE_INVOICE_TEMPLATE.
 */
export default function InvoiceDownloadButton({
  order,
  siteConfig: propSiteConfig,
  templateKey,
  buttonClass = "px-3.5 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer",
  showIcon = true,
  label = "Download Invoice"
}) {
  const [downloading, setDownloading] = useState(false);
  const [siteConfig, setSiteConfig] = useState(propSiteConfig || null);
  const [showHiddenTemplate, setShowHiddenTemplate] = useState(false);

  // Sync siteConfig if not passed as prop
  useEffect(() => {
    if (!propSiteConfig) {
      configureService.getSiteConfig()
        .then((cfg) => {
          if (cfg) setSiteConfig(cfg);
        })
        .catch(() => {});
    }
  }, [propSiteConfig]);

  if (!order) return null;

  const isUploaded = Boolean(order.invoice?.uploaded && order.invoice?.storagePath);
  const activeTemplateKey = templateKey || siteConfig?.invoiceTemplate || ACTIVE_INVOICE_TEMPLATE;
  const normalizedData = normalizeInvoiceData(order, siteConfig);
  const fileName = `Invoice-${normalizedData.invoiceNumber}.pdf`;

  const handleDownload = async (e) => {
    if (e) e.stopPropagation();
    if (downloading) return;

    try {
      setDownloading(true);

      if (isUploaded) {
        // Source A: Admin Uploaded Invoice File
        const storagePath = order.invoice.storagePath;
        const uploadFileName = order.invoice.fileName || fileName;
        await invoiceService.downloadUploadedInvoice(storagePath, uploadFileName);
        toast.success("Invoice downloaded successfully!");
      } else {
        // Source B: Render Exact HTML Invoice Template UI for PDF Conversion
        setShowHiddenTemplate(true);
        await new Promise((resolve) => setTimeout(resolve, 150));
        await invoiceService.generateClientInvoicePdf(order, siteConfig);
        toast.success("Invoice downloaded successfully!");
      }
    } catch (err) {
      console.error("Invoice download error:", err);
      const friendlyMsg = getFriendlyErrorMessage(err);
      toast.error(friendlyMsg || "Failed to download invoice. Please try again.");
    } finally {
      setDownloading(false);
      setShowHiddenTemplate(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className={`${buttonClass} ${downloading ? "opacity-75 cursor-not-allowed" : ""}`}
        title="Download Tax Invoice"
      >
        {downloading ? (
          <>
            <FaSpinner className="animate-spin" size={12} />
            <span>Preparing...</span>
          </>
        ) : (
          <>
            {showIcon && <FaFileDownload size={12} />}
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Hidden Invoice Template for PDF Conversion */}
      {showHiddenTemplate && !isUploaded && (
        <div style={{ position: "fixed", left: "-9999px", top: "0px", width: "800px", pointerEvents: "none" }}>
          <InvoiceRenderer invoiceData={normalizedData} templateKey={activeTemplateKey} />
        </div>
      )}
    </>
  );
}
