import React from "react";
import { useSiteConfig } from "../../../context/SiteConfigContext";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function OrderSummaryCard({
  subtotal, productDiscount, couponDiscount, shippingCharge, estimatedTotal,
  appliedCoupon, cartCount, onProceed, stage, paymentMethod = "ONLINE", onSelectPaymentMethod,
  codHandlingFee = 0, finalTotal: propFinalTotal,
  couponCode = "", couponLoading = false, couponError = "", onChangeCoupon, onApplyCoupon, onRemoveCoupon
}) {
  const { config } = useSiteConfig();
  // Admin-controlled payment method flags (default both enabled when not yet configured)
  const enableOnline = config?.paymentMethods?.enableOnline !== false;
  const enableCod    = config?.paymentMethods?.enableCod    !== false;

  const isBusy = stage === "submitting" || stage === "payment_modal" || stage === "processing";
  const totalSavings = (productDiscount || 0) + (couponDiscount || 0);
  const finalTotal = propFinalTotal !== undefined ? propFinalTotal : (paymentMethod === "COD" ? estimatedTotal + codHandlingFee : estimatedTotal);

  return (
    <div className="space-y-6">
      <div className="bg-bg-surface rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-border-base overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border-base flex items-center justify-between">
          <h2 className="font-bold text-xl text-text-base">Order Summary</h2>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Price Breakdown */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm text-text-muted">
              <span>Subtotal (MRP)</span>
              <span className="text-text-base font-bold">₹{fmt(subtotal + productDiscount)}</span>
            </div>

            {productDiscount > 0 && (
              <div className="flex justify-between items-center text-sm text-text-muted">
                <span>Product Discount</span>
                <span className="text-green-600 dark:text-green-400 font-bold">- ₹{fmt(productDiscount)}</span>
              </div>
            )}

            {couponDiscount > 0 && (
              <div className="flex justify-between items-center text-sm text-text-muted">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span className="text-green-600 dark:text-green-400 font-bold">- ₹{fmt(couponDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm text-text-muted">
              <span>Shipping Charge</span>
              <span className="text-green-600 dark:text-green-400 font-bold tracking-widest text-xs uppercase">
                {shippingCharge === 0 ? "FREE" : `₹${fmt(shippingCharge)}`}
              </span>
            </div>

            {paymentMethod === "COD" && codHandlingFee > 0 && (
              <div className="flex justify-between items-center text-sm text-text-muted">
                <span>COD Handling Fee</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">₹{fmt(codHandlingFee)}</span>
              </div>
            )}

            {/* Coupon Code Box */}
            {onChangeCoupon && (
              <div className="flex flex-col gap-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-500/40 rounded-xl text-xs shadow-2xs">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-emerald-900 text-sm tracking-wider uppercase">
                          {appliedCoupon.code}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[9px] font-black uppercase tracking-wider shadow-2xs">
                          Active
                        </span>
                      </div>
                      {couponDiscount > 0 && (
                        <p className="text-xs font-bold text-emerald-800">
                          Coupon Applied: <strong className="font-black text-emerald-950">-₹{fmt(couponDiscount)}</strong>
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={onRemoveCoupon}
                      className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 font-extrabold text-xs transition-all cursor-pointer shadow-2xs shrink-0 hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <div className="flex-1 relative group">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => onChangeCoupon(e.target.value.toUpperCase())}
                          placeholder="Enter Code"
                          onKeyDown={(e) => e.key === "Enter" && onApplyCoupon && onApplyCoupon()}
                          className="w-full h-10 px-3 rounded-lg border border-border-base bg-bg-base focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-xs font-bold uppercase tracking-widest text-text-base placeholder:normal-case placeholder:tracking-normal placeholder:font-normal"
                        />
                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted opacity-40 text-[18px]">
                          sell
                        </span>
                      </div>
                      <button
                        onClick={onApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 h-10 bg-text-base text-bg-surface rounded-lg font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {couponLoading ? "..." : "APPLY"}
                      </button>
                    </div>

                    {couponError && <p className="text-xs text-red-500 font-semibold">{couponError}</p>}
                  </>
                )}
              </div>
            )}

            {/* Grand Total */}
            <div className="flex flex-col gap-1 pt-2 border-t border-border-base/40">
              <div className="flex justify-between items-end">
                <span className="font-bold text-xl text-text-base">Grand Total</span>
                <span className="text-2xl font-black text-primary">
                  ₹{fmt(finalTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector — only shown when at least one method is enabled */}
          {(enableOnline || enableCod) && (
            <div className="flex flex-col gap-2.5 pt-2 border-t border-border-base/50">
              {/* Heading shown only when both methods are available (user must pick) */}
              {enableOnline && enableCod && (
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Select Payment Method</span>
              )}

              {/* Option 1: Online Payment */}
              {enableOnline && (
                <label
                  onClick={() => onSelectPaymentMethod && onSelectPaymentMethod("ONLINE")}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === "ONLINE"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border-base bg-bg-base/60 hover:border-primary/40 hover:bg-bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[22px] transition-colors ${
                        paymentMethod === "ONLINE" ? "text-primary" : "text-text-muted"
                      }`}
                      style={{ fontVariationSettings: paymentMethod === "ONLINE" ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {paymentMethod === "ONLINE" ? "radio_button_checked" : "radio_button_unchecked"}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-text-base">Online Payment</span>
                      <span className="text-[10px] text-text-muted">UPI, Cards, NetBanking, Wallets</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Instant
                  </span>
                </label>
              )}

              {/* Option 2: Cash on Delivery (COD) */}
              {enableCod && (
                <label
                  onClick={() => onSelectPaymentMethod && onSelectPaymentMethod("COD")}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === "COD"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border-base bg-bg-base/60 hover:border-primary/40 hover:bg-bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[22px] transition-colors ${
                        paymentMethod === "COD" ? "text-primary" : "text-text-muted"
                      }`}
                      style={{ fontVariationSettings: paymentMethod === "COD" ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {paymentMethod === "COD" ? "radio_button_checked" : "radio_button_unchecked"}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-text-base">Cash on Delivery (COD)</span>
                      <span className="text-[10px] text-text-muted">Pay with cash when order arrives</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    codHandlingFee > 0 ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"
                  }`}>
                    {codHandlingFee > 0 ? `+₹${fmt(codHandlingFee)}` : "Free"}
                  </span>
                </label>
              )}
            </div>
          )}

          {/* Fallback: no method enabled — admin misconfiguration notice */}
          {!enableOnline && !enableCod && (
            <div className="p-4 bg-rose-50 border border-rose-300/60 rounded-xl text-xs text-rose-700 font-semibold">
              ⚠ No payment methods are currently enabled. Please contact the store admin.
            </div>
          )}


          {/* CTA Area */}
          <div className="flex flex-col">
            <button
              onClick={onProceed}
              disabled={isBusy}
              className="group relative w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-sm sm:text-base transition-all shadow-[0_10px_20px_rgba(21,128,61,0.15)] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              <span>
                {isBusy
                  ? "Processing..."
                  : paymentMethod === "COD"
                  ? "Place Cash on Delivery Order"
                  : "Proceed To Payment"}
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}



