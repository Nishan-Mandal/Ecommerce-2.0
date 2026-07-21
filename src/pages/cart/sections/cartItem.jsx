import React from 'react';
import QuantitySelector from '../../../components/Common/QuantitySelector';

/**
 * CartItem
 * Displays individual cart items with variant specifications, quantity counters,
 * and remove controls.
 */
export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const displayName = item.title || 'Product';
  const displayImage = item.imageUrl || '';
  const displayVariant = item.selectedVariant 
    ? Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(' | ') 
    : 'Standard';

  return (
    <div className="group bg-bg-surface p-3 shadow-lg rounded-[20px] flex flex-col sm:flex-row gap-6 items-center transition-all duration-300 border border-border-base/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      {/* Product Thumbnail */}
      <div className="w-24 h-24 flex-shrink-0 bg-bg-base/20 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-border-base/20">
        <img className="max-h-full max-w-full object-contain" alt={displayName} src={displayImage} />
      </div>

      {/* Product info and actions */}
      <div className="flex-grow w-full">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-wider mb-1 block font-bold">
              {item.category || 'ReadyMade'}
            </span>
            <h3 className="text-base font-bold text-text-base">{displayName}</h3>
            <p className="text-xs text-text-muted mt-1 font-medium">Variant: {displayVariant}</p>
          </div>
          
          <button 
            onClick={() => onRemove(item)}
            className="text-text-muted hover:text-rose-600 transition-all px-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-95"
            aria-label="Remove item"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>

        <div className="flex justify-between items-end mt-4">
          {/* Quantity selector */}
          <QuantitySelector
            quantity={item.quantity}
            onChange={(newQty) => onUpdateQuantity(item, newQty)}
          />

          <span className="text-base text-primary font-extrabold">
            ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}