import React from "react";
import { FaArrowLeft, FaSyncAlt, FaPrint, FaCopy, FaCheck } from "react-icons/fa";

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
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    copyToClipboard(orderId, "Order ID copied!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Nav Action Row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border-base bg-bg-surface text-xs font-bold text-text-muted hover:text-text-base hover:border-primary/40 transition active:scale-95 cursor-pointer shadow-2xs"
        >
          <FaArrowLeft size={11} /> Back to Orders
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-base bg-bg-surface text-xs font-bold text-text-muted hover:text-primary hover:border-primary/40 transition active:scale-95 cursor-pointer shadow-2xs"
          >
            <FaSyncAlt size={11} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-extrabold shadow-sm hover:bg-primary-hover transition active:scale-95 cursor-pointer"
          >
            <FaPrint size={11} />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Order Info Banner */}
      <div className="bg-bg-surface p-5 rounded-2xl border border-border-base shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-mono font-black text-text-base tracking-tight">
                #{orderId}
              </h1>
              <button
                type="button"
                onClick={handleCopy}
                className="text-text-muted hover:text-primary transition p-1 cursor-pointer"
                title="Copy Order ID"
              >
                {copied ? <FaCheck className="text-emerald-500" size={13} /> : <FaCopy size={13} />}
              </button>
            </div>

            <p className="text-xs text-text-muted">
              Placed On: <span className="font-bold text-text-base">{formatDate(createdAt)}</span>
              {updatedAt && (
                <span className="ml-3">Updated: <span className="font-bold text-text-base">{formatDate(updatedAt)}</span></span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${statusBadgeStyles[currentStatus] || "bg-gray-100 text-gray-700"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{currentStatus.replace(/_/g, " ")}</span>
            </span>

            <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${paymentBadgeStyles[paymentStatus] || "bg-gray-100 text-gray-700"}`}>
              Payment: {paymentStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
