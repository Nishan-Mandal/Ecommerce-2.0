/**
 * Product Data Utility Helpers
 * Calculates denormalized scalar fields for server-side Firestore filtering & sorting.
 */

/**
 * Calculates the minimum price for a product across all variants or root price.
 * @param {Object} productData 
 * @returns {number}
 */
export function computeMinPrice(productData) {
  if (!productData) return 0;
  
  if (productData.hasVariants && Array.isArray(productData.variants) && productData.variants.length > 0) {
    const prices = productData.variants
      .map(v => Number(v.price))
      .filter(p => !isNaN(p) && p > 0);
    if (prices.length > 0) {
      return Math.min(...prices);
    }
  }

  const rootPrice = Number(productData.price);
  return !isNaN(rootPrice) ? rootPrice : 0;
}

/**
 * Calculates total available stock for a product across all variants or root stock.
 * @param {Object} productData 
 * @returns {number}
 */
export function computeTotalStock(productData) {
  if (!productData) return 0;

  if (productData.hasVariants && Array.isArray(productData.variants) && productData.variants.length > 0) {
    return productData.variants.reduce((acc, v) => {
      const stock = Number(v.inStock ?? v.quantity ?? 0);
      return acc + (isNaN(stock) ? 0 : stock);
    }, 0);
  }

  const rootStock = Number(productData.inStock ?? productData.stock ?? 0);
  return !isNaN(rootStock) ? rootStock : 0;
}
