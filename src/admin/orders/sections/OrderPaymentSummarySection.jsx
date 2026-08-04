import React, { useState } from "react";
import { FaReceipt, FaCopy, FaCheck } from "react-icons/fa";

export default function OrderPaymentSummarySection({
  subtotal,
  couponDiscount,
  shippingCharge,
  grandTotal,
  paymentGateway,
  paymentMethod,
  paymentId,
  copyToClipboard
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyPaymentId = () => {
    copyToClipboard(paymentId, "Payment ID copied!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-bg-surface p-5 rounded-2xl border border-border-base shadow-xs space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-base/70">
        <h2 className="text-sm font-black text-text-base flex items-center gap-2">
          <FaReceipt className="text-primary" /> Payment & Pricing
        </h2>
        <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase bg-primary/10 text-primary border border-primary/20">
          {paymentGateway}
        </span>
      </div>

      {/* Financial Breakdown */}
      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between text-text-muted">
          <span>Items Subtotal</span>
          <span className="font-extrabold text-text-base">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-extrabold">
            <span>Coupon Discount</span>
            <span>- ₹{couponDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="flex justify-between text-text-muted">
          <span>Shipping Fee</span>
          <span className="font-extrabold text-text-base">
            {shippingCharge === 0 ? "FREE" : `₹${shippingCharge.toLocaleString("en-IN")}`}
          </span>
        </div>

        <div className="border-t border-border-base/70 pt-3 flex justify-between items-center">
          <span className="text-xs font-black text-text-base">Grand Total</span>
          <span className="text-lg font-black text-primary">₹{grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-border-base/70 space-y-2 text-xs">
        <div className="flex justify-between items-center text-text-muted">
          <span>Payment Method</span>
          <span className="font-black text-text-base">{paymentMethod}</span>
        </div>

        {paymentId && paymentId !== "N/A" && (
          <div className="space-y-1 pt-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Payment Transaction ID
            </label>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-base/60 border border-border-base/70 font-mono text-[11px]">
              <span className="truncate font-extrabold text-text-base">{paymentId}</span>
              <button
                type="button"
                onClick={handleCopyPaymentId}
                className="text-text-muted hover:text-primary transition p-1 cursor-pointer shrink-0 ml-2"
                title="Copy Payment ID"
              >
                {copied ? <FaCheck className="text-emerald-500" size={11} /> : <FaCopy size={11} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
