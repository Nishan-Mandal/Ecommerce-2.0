import React, { useState } from "react";
import { FaFilePdf, FaFileUpload, FaTrashAlt, FaDownload, FaSpinner, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { invoiceService } from "../../../services/invoice/invoiceService.js";
import getFriendlyErrorMessage from "../../../utils/firebaseErrorHandler.js";

/**
 * OrderInvoiceAdminSection Component
 * Allows admins to view current invoice status, upload custom PDF invoices,
 * replace existing invoices, or remove uploaded invoices.
 */
export default function OrderInvoiceAdminSection({ order, onRefresh }) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  if (!order) return null;

  const orderId = order.id || order.docId || order.orderId;
  const isUploaded = Boolean(order.invoice?.uploaded && order.invoice?.storagePath);
  const fileName = order.invoice?.fileName || "Uploaded Invoice.pdf";
  const uploadedAt = order.invoice?.uploadedAt
    ? new Date(order.invoice.uploadedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : null;

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const currentStoragePath = order.invoice?.storagePath || null;
      await invoiceService.uploadAdminInvoice(orderId, file, currentStoragePath);
      toast.success(`Uploaded "${file.name}" as official order invoice!`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Admin invoice upload error:", err);
      const msg = getFriendlyErrorMessage(err);
      toast.error(msg || "Failed to upload invoice PDF.");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset file input
    }
  };

  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to remove the uploaded invoice? The system will revert to the default system-generated invoice.")) {
      return;
    }

    try {
      setRemoving(true);
      const currentStoragePath = order.invoice?.storagePath || null;
      await invoiceService.removeAdminInvoice(orderId, currentStoragePath);
      toast.success("Uploaded invoice removed. Client will receive system-generated invoice.");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Admin invoice removal error:", err);
      const msg = getFriendlyErrorMessage(err);
      toast.error(msg || "Failed to remove invoice.");
    } finally {
      setRemoving(false);
    }
  };

  const handleDownloadUploaded = async () => {
    try {
      await invoiceService.downloadUploadedInvoice(order.invoice.storagePath, fileName);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="bg-bg-surface border border-border-base rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-base pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <FaFilePdf size={16} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-text-base">Order Invoice Management</h3>
           
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${
          isUploaded
            ? "bg-emerald-100 text-emerald-800 border-emerald-300 "
            : "bg-indigo-100 text-indigo-800 border-indigo-300 "
        }`}>
          {isUploaded ? "Custom Uploaded PDF" : "System Generated"}
        </span>
      </div>

      {/* Body Status Content */}
      {isUploaded ? (
        <div className="p-4 rounded-xl bg-bg-base/60 border border-border-base/70 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <FaFilePdf size={20} />
              </div>
              <div>
                <p className="font-extrabold text-xs text-text-base truncate max-w-xs">{fileName}</p>
                {uploadedAt && <p className="text-[10px] text-text-muted mt-0.5">Uploaded: {uploadedAt}</p>}
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                  <FaCheckCircle size={10} /> Active for Client Download
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadUploaded}
              className="px-3 py-1.5 rounded-lg bg-bg-surface border border-border-base text-text-base text-xs font-bold hover:bg-bg-base transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FaDownload size={11} className="text-primary" />
              <span>Download</span>
            </button>
          </div>

          <div className="pt-3 border-t border-border-base/60 flex items-center justify-between gap-3">
            <label className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
              {uploading ? <FaSpinner className="animate-spin" size={12} /> : <FaFileUpload size={12} />}
              <span>{uploading ? "Replacing..." : "Replace PDF"}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={uploading || removing}
                onChange={handleFileSelect}
              />
            </label>

            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading || removing}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-rose-200"
            >
              {removing ? <FaSpinner className="animate-spin" size={12} /> : <FaTrashAlt size={11} />}
              <span>Remove Upload</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-bg-base/40 border border-border-base/60 space-y-3">
          <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
            <FaInfoCircle size={14} className="text-primary shrink-0" />
            <span>Currently using <strong>System-Generated Tax Invoice</strong>. Clients can generate and download their invoice on demand.</span>
          </div>

          <div>
            <label className="w-full px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs">
              {uploading ? <FaSpinner className="animate-spin" size={14} /> : <FaFileUpload size={14} />}
              <span>{uploading ? "Uploading Invoice PDF..." : "Upload Custom Invoice PDF"}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={uploading}
                onChange={handleFileSelect}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
