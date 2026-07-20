import React from 'react';
import ProductVariants from './ProductPurchase/ProductVariants';

/**
 * ProductInfo
 * Displays product headers, ratings, dynamic variant-dependent prices/discounts,
 * price range fallbacks, and the variant select options shifted from purchase section.
 */
export default function ProductInfo({
  product,
  rating = 4.8,
  selectedVariant = null,
  priceInfo = null,
  isComplete = false,
  selectedOptions = {},
  isOptionEnabled = () => true,
  selectOption = () => {}
}) {
  if (!product) return null;

  const calculateDiscount = (originalPrice, price) => {
    const o = Number(originalPrice);
    const p = Number(price);
    if (!o || !p || o <= p) return null;
    return Math.round(((o - p) / o) * 100);
  };

  // Determine pricing display conditions
  const showVariantPrice = isComplete && selectedVariant;
  const activePrice = showVariantPrice ? selectedVariant.price : null;
  const activeOriginalPrice = showVariantPrice ? (selectedVariant.originalPrice || selectedVariant.price) : null;
  const discountPct = showVariantPrice ? calculateDiscount(activeOriginalPrice, activePrice) : null;

  // Determine availability and stock states for helper message
  const hasVariants = product.variantTypes && product.variantTypes.length > 0;
  const isOutOfStock = isComplete && selectedVariant && (selectedVariant.inStock <= 0 || selectedVariant.isActive === false || selectedVariant.isAvailable === false);

  let actionMessage = '';
  if (hasVariants && !isComplete) {
    actionMessage = 'Please select all options';
  } else if (isOutOfStock) {
    actionMessage = 'Currently unavailable';
  } else if (selectedVariant) {
    actionMessage = selectedVariant.inStock <= 5 
      ? `Only ${selectedVariant.inStock} left in stock!` 
      : 'In Stock';
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {/* Brand / Category */}
        <div className="space-y-1">
          {(product.brand || product.category) && (
            <p className="text-primary text-sm font-medium tracking-wider uppercase ">
              {product.brand || product.category}
            </p>
          )}

          {/* Product Title */}
          <h1 className="text-3xl font-semibold text-text-base">{product.title}</h1>
        </div>

        {/* Rating Row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center gap-1 px-2 bg-[#007432] rounded-md py-1">
            <span
              className="material-symbols-outlined text-white icon-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-bold text-white text-sm">{rating}</span>
          </div>
          <p className="text-sm">483 Reviews</p>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-4 pt-1">
          {showVariantPrice ? (
            <>
              <span className="text-3xl font-bold text-text-base">
                ₹{Number(activePrice).toLocaleString('en-IN')}
              </span>
              {discountPct && (
                <>
                  <span className="text-text-muted line-through text-sm">
                    ₹{Number(activeOriginalPrice).toLocaleString('en-IN')}
                  </span>
                  <span className="bg-green-200 text-green-800 font-bold px-3 py-1 rounded-full text-xs">
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </>
          ) : (
            <div>
              <span className="text-2xl font-bold text-text-base">
                {priceInfo?.isRange ? (
                  `₹${priceInfo.minPrice.toLocaleString('en-IN')} - ₹${priceInfo.maxPrice.toLocaleString('en-IN')}`
                ) : (
                  `Starting from ₹${(priceInfo?.startingPrice || product.price || 0).toLocaleString('en-IN')}`
                )}
              </span>
              <p className="text-xs text-text-muted mt-1">Select variant options to see exact pricing.</p>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Product Variant Options */}
      <div className="pt-2">
        <ProductVariants
          product={product}
          selectedOptions={selectedOptions}
          isOptionEnabled={isOptionEnabled}
          selectOption={selectOption}
        />
      </div>

      {/* Helper Status Message */}
      {actionMessage && (
        <p className={`text-sm font-semibold mt-2 ${isOutOfStock || (!isComplete && hasVariants) ? 'text-red-500' : 'text-emerald-600'}`}>
          {actionMessage}
        </p>
      )}
    </div>
  );
}
