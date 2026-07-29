import React from "react";
import { FaCreditCard, FaCopy } from "react-icons/fa";

export default function OrderPaymentDetailsSection({
  paymentGateway,
  paymentMethod,
  paymentId,
  copyToClipboard
}) {
  return (
    <div className="bg-bg-surface p-6 rounded-2xl border border-border-base shadow-xs space-y-4">
      <h2 className="text-sm font-bold text-text-base flex items-center gap-2">
        <FaCreditCard className="text-primary" /> Payment Details
      </h2>
      <div className="h-px bg-border-base/60" />

      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-text-muted">Gateway</span>
          <span className="font-bold text-text-base uppercase">{paymentGateway}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-muted">Method</span>
          <span className="font-bold text-text-base">{paymentMethod}</span>
        </div>

        {paymentId && paymentId !== "N/A" && (
          <div className="space-y-1 pt-1">
            <label className="text-[9.5px] font-bold text-text-muted uppercase tracking-wider block">Payment ID</label>
            <div className="flex items-center justify-between p-2 rounded-lg bg-bg-base border border-border-base font-mono text-[10px]">
              <span className="truncate">{paymentId}</span>
              <button
                onClick={() => copyToClipboard(paymentId, "Payment ID copied!")}
                className="text-text-muted hover:text-primary transition p-1 cursor-pointer"
              >
                <FaCopy size={10} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
