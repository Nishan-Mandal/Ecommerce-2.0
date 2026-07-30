import React from "react";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function OrderSummaryCard({
  subtotal, productDiscount, couponDiscount, shippingCharge, estimatedTotal,
  appliedCoupon, cartCount, onProceed, stage, paymentMethod,
  couponCode = "", couponLoading = false, couponError = "", onChangeCoupon, onApplyCoupon, onRemoveCoupon
}) {
  const isBusy = stage === "submitting" || stage === "payment_modal" || stage === "processing";
  const totalSavings = (productDiscount || 0) + (couponDiscount || 0);
  const finalTotal = paymentMethod === "COD" ? estimatedTotal + 40 : estimatedTotal;

  const quickCoupons = [
    { code: "FIRST50", label: "50% Off" },
    { code: "HOLIDAY20", label: "Save more" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-bg-surface rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-border-base overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border-base flex items-center justify-between">
          <h2 className="font-bold text-xl text-text-base">Order Summary</h2>
          {/* <div className="w-7 h-7 rounded-full bg-text-base text-bg-surface text-[12px] flex items-center justify-center font-bold">
            {cartCount}
          </div> */}
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Savings Alert
          {totalSavings > 0 && (
            <div className="flex items-center gap-3 bg-green-600/10 p-4 rounded-xl border border-green-600/20">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-[18px]">verified</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-bold">
                Total Savings: ₹{fmt(totalSavings)}!
              </p>
            </div>
          )} */}

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

            {paymentMethod === "COD" && (
              <div className="flex justify-between items-center text-sm text-text-muted">
                <span>COD Handling Fee</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">₹40.00</span>
              </div>
            )}

            {/* Coupon Code Box */}
            {onChangeCoupon && (
              <div className="flex flex-col gap-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-600/10 border border-green-600/20 rounded-lg p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600 dark:text-green-400">{appliedCoupon.code}</span>
                      <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded font-bold">APPLIED</span>
                    </div>
                    <button onClick={onRemoveCoupon} className="text-red-500 font-bold hover:underline">Remove</button>
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
                        className="px-4 h-10 bg-text-base text-bg-surface rounded-lg font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                      >
                        {couponLoading ? "..." : "APPLY"}
                      </button>
                    </div>

                    {/* Quick Coupons
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {quickCoupons.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => onChangeCoupon(item.code)}
                          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded border border-dashed border-green-600/40 bg-green-600/5 hover:bg-green-600/10 transition-colors"
                        >
                          <span className="text-[10px] font-bold text-green-600 dark:text-green-400">{item.code}</span>
                          <span className="text-[9px] text-green-600/70 dark:text-green-400/70">{item.label}</span>
                        </button>
                      ))}
                    </div> */}

                    {couponError && <p className="text-xs text-red-500 font-semibold">{couponError}</p>}
                  </>
                )}
              </div>
            )}

            {/* Grand Total */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-end">
                <span className="font-bold text-xl text-text-base">Grand Total</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{fmt(finalTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Option (Online Only) */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border-base/50">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Payment Option</span>
            <div className="p-3.5 rounded-xl border-2 border-primary bg-primary/5 flex items-center justify-between transition-all">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  radio_button_checked
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-base">Online Payment (Razorpay)</span>
                  <span className="text-[10px] text-text-muted">UPI, Credit/Debit Cards, NetBanking</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">
                Instant
              </span>
            </div>
          </div>

          {/* CTA Area */}
          <div className="flex flex-col">
            <button
              onClick={onProceed}
              disabled={isBusy}
              className="group relative w-full py-3 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-base hover:bg-green-700 transition-all shadow-[0_10px_20px_rgba(21,128,61,0.15)] active:scale-[0.98] disabled:opacity-60"
            >
              <span>{isBusy ? "Processing..." : "Proceed To Payment"}</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}



