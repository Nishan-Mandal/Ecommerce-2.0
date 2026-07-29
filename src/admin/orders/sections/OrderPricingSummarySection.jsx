import React from "react";
import { FaReceipt } from "react-icons/fa";

export default function OrderPricingSummarySection({
  subtotal,
  couponDiscount,
  shippingCharge,
  grandTotal
}) {
  return (
    <div className="bg-bg-surface p-6 rounded-2xl border border-border-base shadow-xs space-y-4">
      <h2 className="text-sm font-bold text-text-base flex items-center gap-2">
        <FaReceipt className="text-primary" /> Pricing Summary
      </h2>
      <div className="h-px bg-border-base/60" />

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
          <span className="font-semibold text-text-base">₹{shippingCharge.toLocaleString("en-IN")}</span>
        </div>

        <div className="border-t border-border-base pt-2.5 flex justify-between items-center">
          <span className="text-sm font-extrabold text-text-base">Grand Total</span>
          <span className="text-lg font-extrabold text-primary">₹{grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
