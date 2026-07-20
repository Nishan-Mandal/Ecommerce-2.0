import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * OrderSummary
 * Displays subtotal, shipping fees, tax rates, promo code triggers, and checkout buttons.
 * Supports standard checkout and prefilled WhatsApp Order routing.
 * Desktop: Sidebar block.
 * Mobile: Expandable floating bottom sheet that sits above the bottom navigation bar.
 */
export default function OrderSummary({ subtotal, shippingFee, taxRate, cartItems = [], onCheckout }) {
  const [promoCode, setPromoCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const estimatedTax = subtotal * taxRate;
  const total = subtotal + (shippingFee === 'Free' ? 0 : Number(shippingFee || 0)) + estimatedTax;

  const handlePayViaWhatsApp = () => {
    if (cartItems.length === 0) return;

    const itemsText = cartItems
      .map(item => {
        const variantStr = item.selectedVariant 
          ? Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(', ') 
          : 'Standard';
        return `• ${item.title} (${variantStr}) x ${item.quantity} = ₹${(Number(item.price) * item.quantity).toLocaleString('en-IN')}`;
      })
      .join('\n');

    const message = `Hi, I would like to place an order:\n\n${itemsText}\n\nSubtotal: ₹${subtotal.toLocaleString('en-IN')}\nEstimated Taxes (5%): ₹${estimatedTax.toLocaleString('en-IN')}\nGrand Total: ₹${total.toLocaleString('en-IN')}\n\nPlease confirm my order. Thanks!`;
    
    window.open(`https://wa.me/9564140786?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/order');
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
              <span className="text-sm font-bold text-text-base">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-text-muted">
              <span className="text-sm font-medium">Shipping</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{shippingFee}</span>
            </div>
            <div className="flex justify-between items-center text-text-muted">
              <span className="text-sm font-medium">Estimated Taxes</span>
              <span className="text-sm font-bold text-text-base">₹{estimatedTax.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-4 border-t border-border-base/40 flex justify-between items-center">
              <span className="text-lg font-bold text-text-base">Total</span>
              <span className="text-xl text-primary font-black">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input 
                className="flex-grow bg-bg-base border border-border-base/40 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs text-text-base" 
                placeholder="Promo Code" 
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button className="bg-gray-400 text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors active:scale-95 border border-border-base/40">
                Apply
              </button>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-green-400 hover:bg-green-500 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-primary/10 cursor-pointer"
            >
              Checkout Now
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
            
            <button 
              onClick={handlePayViaWhatsApp}
              className="w-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <i className="fa-brands fa-whatsapp fa-lg"></i>
              Pay via WhatsApp
            </button>
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
        className={`lg:hidden fixed left-4 right-4 z-40 transition-all duration-300 bg-primary text-white rounded-2xl shadow-xl border border-primary/20 overflow-hidden ${
          isExpanded ? "bottom-[76px] max-h-[80vh] overflow-y-auto" : "bottom-[76px] h-16"
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
            <span className="text-base sm:text-lg font-black leading-tight">₹{total.toLocaleString('en-IN')}</span>
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
                <span className="font-bold text-text-base">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-text-muted">
                <span>Shipping</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{shippingFee}</span>
              </div>
              <div className="flex justify-between items-center text-text-muted">
                <span>Estimated Taxes</span>
                <span className="font-bold text-text-base">₹{estimatedTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-3 border-t border-border-base/40 flex justify-between items-center text-sm font-extrabold text-text-base">
                <span>Total</span>
                <span className="text-base text-primary font-black">₹{total.toLocaleString('en-IN')}</span>
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
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-xl font-bold text-xs transition active:scale-95 border border-border-base/40"
                >
                  Apply
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
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePayViaWhatsApp();
                }}
                className="w-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition active:scale-[0.98] cursor-pointer"
              >
                <i className="fa-brands fa-whatsapp fa-lg"></i>
                Pay via WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}