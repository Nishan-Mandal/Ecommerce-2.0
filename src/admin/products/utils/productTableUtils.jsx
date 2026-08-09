import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import StatusBadge from '../../Components/common/StatusBadge';

/**
 * Product Table Utilities (Admin Products Module)
 * Helper functions for computing stock totals, price displays, date formatting, and table columns.
 */

/**
 * Calculates total stock for a product (handles single product stock and multi-variant stock arrays)
 */
export function getProductStockCount(item) {
  if (!item) return 0;
  if (item.hasVariants && Array.isArray(item.variants) && item.variants.length > 0) {
    return item.variants.reduce((acc, v) => acc + Number(v.inStock || v.quantity || 0), 0);
  }
  return Number(item.inStock ?? item.stock ?? 0);
}

/**
 * Calculates display price for a product (variant price or base price)
 */
export function getProductDisplayPrice(item) {
  if (!item) return 0;
  if (item.hasVariants && Array.isArray(item.variants) && item.variants.length > 0) {
    return item.variants[0].price;
  }
  return item.price;
}

/**
 * Gets props for rendering stock badge indicator using StatusBadge
 */
export function getStockBadgeProps(stockCount) {
  if (stockCount <= 0) {
    return {
      status: "OUT_OF_STOCK",
      size: "sm",
    };
  }
  if (stockCount <= 5) {
    return {
      status: "LOW_STOCK",
      label: `${stockCount} left`,
      size: "sm",
    };
  }
  return {
    status: "IN_STOCK",
    label: `${stockCount} in stock`,
    size: "sm",
  };
}

/**
 * Formats product creation dates safely
 */
export function formatProductDate(dateVal, formatDateFn) {
  if (typeof formatDateFn === 'function') {
    return formatDateFn(dateVal);
  }
  if (!dateVal) return 'N/A';
  if (typeof dateVal === 'string') return dateVal;
  if (typeof dateVal === 'number') return new Date(dateVal).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  if (dateVal?.seconds) return new Date(dateVal.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  if (dateVal instanceof Date) return dateVal.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return String(dateVal);
}

/**
 * Builds table column definitions for desktop view
 */
