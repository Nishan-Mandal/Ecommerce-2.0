import React from "react";
import { FaArrowLeft, FaSyncAlt, FaPrint, FaDownload, FaCopy } from "react-icons/fa";

export default function OrderDetailHeaderSection({
  orderId,
  createdAt,
  updatedAt,
  currentStatus,
  paymentStatus,
  statusBadgeStyles,
  paymentBadgeStyles,
  formatDate,
  copyToClipboard,
  onBack,
  onRefresh,
  onPrint,
  loading
}) {
  return (
    <div className="space-y-6">
      {/* ── Top Nav Bar ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border-base bg-bg-surface text-xs font-semibold text-text-muted hover:text-text-base hover:border-primary/40 transition active:scale-95 cursor-pointer"
        >
          <FaArrowLeft size={11} /> Back
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-base bg-bg-surface text-xs font-semibold text-text-muted hover:text-primary hover:border-primary/40 transition active:scale-95 cursor-pointer"
          >
            <FaSyncAlt size={11} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          {/* <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-base bg-bg-surface text-xs font-semibold text-text-muted hover:text-primary hover:border-primary/40 transition active:scale-95 cursor-pointer"
          >
            <FaPrint size={11} /> Print Invoice
          </button>
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:opacity-90 transition active:scale-95 cursor-pointer"
          >
            <FaDownload size={11} /> Download Invoice
          </button> */}
        </div>
      </div>

      {/* ── Main Order Header Card ── */}
      <div className="bg-bg-surface p-3 rounded-2xl border border-border-base shadow-xs space-y-4 ">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-xl font-mono font-extrabold text-text-base">#{orderId}</h1>
              <button
                onClick={() => copyToClipboard(orderId, "Order ID copied!")}
                className="text-text-muted hover:text-primary transition p-1 cursor-pointer"
                title="Copy Order ID"
              >
                <FaCopy size={13} />
              </button>
            </div>
            <p className="text-xs text-text-muted">
              Created: <span className="font-semibold text-text-base">{formatDate(createdAt)}</span>
              {updatedAt && (
                <span className="ml-3">Updated: <span className="font-semibold text-text-base">{formatDate(updatedAt)}</span></span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusBadgeStyles[currentStatus] || "bg-gray-100 text-gray-700"}`}>
              {currentStatus}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${paymentBadgeStyles[paymentStatus] || "bg-gray-100 text-gray-700"}`}>
              Payment: {paymentStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
