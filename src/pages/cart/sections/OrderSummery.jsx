import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { paymentService } from '../../../services/payment/paymentService';
import { couponService } from '../../../services/coupon/couponService';
import { validateAndCalculateCoupon } from '../../../utils/couponValidation';

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * OrderSummary
 * Displays subtotal, shipping fees, tax rates, promo code triggers, and checkout buttons.
 * Supports standard checkout and prefilled WhatsApp Order routing.
 * Desktop: Sidebar block.
 * Mobile: Expandable floating bottom sheet that sits above the bottom navigation bar.
 */
export default function OrderSummary({ subtotal, shippingFee, taxRate, cartItems = [], onCheckout }) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [applying, setApplying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const estimatedTax = subtotal * taxRate;
  const grandTotal = Math.max(0, subtotal - discountAmount + (shippingFee === 'Free' ? 0 : Number(shippingFee || 0)));

  // Sync / load saved coupon on mount or subtotal change
  React.useEffect(() => {
    const saved = sessionStorage.getItem('appliedCoupon');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.code) {
          setAppliedCoupon(parsed);
          setPromoCode(parsed.code);
          let discount = Number(parsed.discountAmount || 0);
          if (parsed.type === 'PERCENTAGE' || parsed.type === 'percentage') {
            const val = Number(parsed.discountValue || parsed.value || 0);
            discount = (subtotal * val) / 100;
          }
          setDiscountAmount(discount);
        }
      } catch (e) {
        console.warn("Failed to parse stored coupon:", e);
      }
    }
  }, [subtotal]);

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setApplying(true);
    try {
      // Validate via Cloud Function
      const res = await paymentService.validateCoupon(promoCode.trim(), subtotal);
      if (res && res.valid) {
        const couponObj = {
          code: res.code,
          type: res.type,
          value: res.discountValue,
          discountValue: res.discountValue,
          discountAmount: res.discountAmount
        };
        setAppliedCoupon(couponObj);
        setDiscountAmount(res.discountAmount);
        sessionStorage.setItem('appliedCoupon', JSON.stringify(couponObj));
        toast.success(`Coupon ${res.code} applied! Saved ₹${formatCurrency(res.discountAmount)}`);
      } else {
        toast.error(res?.message || 'Invalid or expired coupon code');
        setAppliedCoupon(null);
        setDiscountAmount(0);
        sessionStorage.removeItem('appliedCoupon');
      }
    } catch (err) {
      console.error("Error validating coupon via Cloud Function:", err);
      toast.error(err?.message || 'Invalid or expired coupon code');
      setAppliedCoupon(null);
      setDiscountAmount(0);
      sessionStorage.removeItem('appliedCoupon');
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setPromoCode('');
    sessionStorage.removeItem('appliedCoupon');
    toast.info('Coupon removed');
  };

  const handlePayViaWhatsApp = () => {
    if (cartItems.length === 0) return;

    const itemsText = cartItems
      .map(item => {
        const variantStr = item.selectedVariant
          ? Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(', ')
          : 'Standard';
        return `• ${item.title} (${variantStr}) x ${item.quantity} = ₹${formatCurrency(Number(item.price) * item.quantity)}`;
      })
      .join('\n');

    const message = `Hi, I would like to place an order:\n\n${itemsText}\n\nSubtotal: ₹${formatCurrency(subtotal)}${discountAmount > 0 ? `\nDiscount (${appliedCoupon?.code}): -₹${formatCurrency(discountAmount)}` : ''}\nEstimated Taxes (5%): ₹${formatCurrency(estimatedTax)}\nGrand Total: ₹${formatCurrency(grandTotal)}\n\nPlease confirm my order. Thanks!`;

    window.open(`https://wa.me/9564140786?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/order', { state: { appliedCoupon } });
    }
  };

  return (
    <>
      {/* 1. Desktop Sidebar View */}
      <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-[120px] space-y-6 w-full">
        <div className="bg-bg-surface p-4 rounded-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-border-base/40">
          <h2 className="text-xl font-bold text-text-base mb-2">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-text-muted">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-sm font-bold text-text-base">₹{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-₹{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-text-muted">
              <span className="text-sm font-medium">Shipping</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{shippingFee}</span>
            </div>
            {/* <div className="flex justify-between items-center text-text-muted">
              <span className="text-sm font-medium">Estimated Taxes</span>
              <span className="text-sm font-bold text-text-base">₹{formatCurrency(estimatedTax)}</span>
            </div> */}
            <div className="pt-4 border-t border-border-base/40 flex justify-between items-center">
              <span className="text-lg font-bold text-text-base">Total</span>
              <span className="text-xl text-primary font-black">₹{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <div className="space-y-3">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl text-xs shadow-2xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-emerald-800 dark:text-emerald-300 text-sm tracking-wider uppercase">{appliedCoupon.code}</span>
                    <span className="px-1.5 py-0.2 bg-emerald-500 text-white rounded text-[9px] font-black uppercase">Active</span>
                  </div>
                  <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    Coupon Applied: <strong className="font-extrabold">-₹{formatCurrency(discountAmount)}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/30 font-extrabold text-[11px] transition-all cursor-pointer shadow-2xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  className="flex-grow bg-bg-base border border-border-base/40 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs text-text-base"
                  placeholder="Promo Code"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={applying}
                  className="bg-primary hover:bg-primary-hover text-compli px-4 py-2.5 rounded-xl font-bold text-xs transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {applying ? "Checking..." : "Apply"}
                </button>
              </div>
            )}

            <button
              onClick={handleCheckout}
              className="w-full bg-green-400 hover:bg-green-500 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-primary/10 cursor-pointer"
            >
              Checkout Now
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>

            {/* <button
              onClick={handlePayViaWhatsApp}
              className="w-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <i className="fa-brands fa-whatsapp fa-lg"></i>
              Pay via WhatsApp
            </button> */}
          </div>

          <div className="mt-2 pt-2 grid grid-cols-3 gap-2">
            {[
              { icon: 'verified_user', label: 'Secure Checkout' },
              { icon: 'package_2', label: 'Easy Returns' },
              { icon: 'local_shipping', label: 'Free Delivery' }
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col border border-border-base rounded-xl items-center gap-1 py-2 text-text-muted">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {badge.icon}
                </span>
                <p className="text-xs font-bold">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Mobile Floating Drawer Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-35 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* 3. Mobile Floating Drawer View */}
      <div
        className={`lg:hidden fixed left-4 right-4 z-40 transition-all duration-300 bg-primary text-white rounded-2xl shadow-xl border border-primary/20 overflow-hidden ${isExpanded ? "bottom-[76px] max-h-[80vh] overflow-y-auto" : "bottom-[76px] h-16"
          }`}
      >
        {/* Toggle Header */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-16 px-5 flex items-center justify-between cursor-pointer select-none border-b border-white/10"
        >
          <div className="flex flex-col">
            <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
            </span>
            <span className="text-base sm:text-lg font-black leading-tight">₹{formatCurrency(grandTotal)}</span>
          </div>

          <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition text-[11px] font-bold">
            <span>{isExpanded ? "Hide Summary" : "View Summary"}</span>
            <span className="material-symbols-outlined text-base">
              {isExpanded ? "expand_more" : "expand_less"}
            </span>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="p-5 space-y-5 bg-bg-surface text-text-base max-h-[60vh] overflow-y-auto border-t border-border-base/30">
            {/* Calculations */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-text-muted">
                <span>Subtotal</span>
                <span className="font-bold text-text-base">₹{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-text-muted">
                <span>Shipping</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{shippingFee}</span>
              </div>
              {/* <div className="flex justify-between items-center text-text-muted">
                <span>Estimated Taxes</span>
                <span className="font-bold text-text-base">₹{formatCurrency(estimatedTax)}</span>
              </div> */}
              <div className="pt-3 border-t border-border-base/40 flex justify-between items-center text-sm font-extrabold text-text-base">
                <span>Total</span>
                <span className="text-base text-primary font-black">₹{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Promo & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <input
                  className="flex-grow bg-bg-base border border-border-base/40 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs text-text-base placeholder:text-text-muted/50"
                  placeholder="Promo Code"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyCoupon();
                  }}
                  disabled={applying}
                  className="bg-primary hover:bg-primary-hover text-compli px-4 py-2 rounded-xl font-bold text-xs transition active:scale-95 border border-border-base/40 disabled:opacity-50 cursor-pointer"
                >
                  {applying ? "Checking..." : "Apply"}
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout();
                }}
                className="w-full bg-primary hover:bg-primary-hover py-3 rounded-xl font-bold text-xs text-compli flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-md shadow-primary/10 cursor-pointer"
              >
                Checkout Now
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
              </button>

              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePayViaWhatsApp();
                }}
                className="w-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition active:scale-[0.98] cursor-pointer"
              >
                <i className="fa-brands fa-whatsapp fa-lg"></i>
                Pay via WhatsApp
              </button> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}