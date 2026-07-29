import React from "react";
import { FaReceipt, FaCreditCard, FaCopy } from "react-icons/fa";

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
  return (
    <div className="bg-bg-surface px-4 py-4 rounded-2xl border border-border-base shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-text-base flex items-center gap-2">
          <FaReceipt className="text-primary" /> Payment & Pricing Summary
        </h2>
        <span className="px-2 py-0.5 rounded-md text-[9.5px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
          {paymentGateway}
        </span>
      </div>

      <div className="h-px bg-border-base/60" />

      {/* Pricing Breakdown */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-text-muted">
          <span>Subtotal</span>
          <span className="font-semibold text-text-base">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Coupon Savings</span>
            <span>- ₹{couponDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex justify-between text-text-muted">
          <span>Shipping Charge</span>
          <span className="font-semibold text-text-base">
            {shippingCharge === 0 ? "FREE" : `₹${shippingCharge.toLocaleString("en-IN")}`}
          </span>
        </div>

        <div className="border-t border-border-base pt-2.5 flex justify-between items-center">
          <span className="text-xs font-extrabold text-text-base">Grand Total</span>
          <span className="text-base font-extrabold text-primary">₹{grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="h-px bg-border-base/60" />

      {/* Payment Details */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center text-text-muted">
          <span>Payment Method</span>
          <span className="font-bold text-text-base">{paymentMethod}</span>
        </div>

        {paymentId && paymentId !== "N/A" && (
          <div className="space-y-1 pt-1">
            <label className="text-[9.5px] font-bold text-text-muted uppercase tracking-wider block">Payment ID</label>
            <div className="flex items-center justify-between p-2 rounded-xl bg-bg-base border border-border-base font-mono text-[10px]">
              <span className="truncate text-text-base">{paymentId}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(paymentId, "Payment ID copied!")}
                className="text-text-muted hover:text-primary transition p-1 cursor-pointer"
                title="Copy Payment ID"
              >
                <FaCopy size={11} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
