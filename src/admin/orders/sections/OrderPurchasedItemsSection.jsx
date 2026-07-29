import React from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaExternalLinkAlt } from "react-icons/fa";

export default function OrderPurchasedItemsSection({ productsList = [] }) {
  return (
    <div className="bg-bg-surface p-6 rounded-2xl border border-border-base shadow-xs space-y-4">
      <h2 className="text-sm font-bold text-text-base flex items-center gap-2">
        <FaBoxOpen className="text-primary" /> Purchased Items ({productsList.length})
      </h2>
      <div className="h-px bg-border-base/60" />

      <div className="space-y-3">
        {productsList.length === 0 ? (
          <p className="text-xs text-text-muted">No items available in this order.</p>
        ) : (
          productsList.map((item, idx) => {
            const img = item.productImage || item.imageUrl || item.image || item.images?.[0] || "https://via.placeholder.com/100";
            const title = item.productName || item.title || item.name || "Product Item";
            const category = item.category || "General";
            const variantName = item.variantName || (item.options ? Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(" | ") : "");
            const sku = item.sku || item.variantId || "N/A";
            const pid = item.productId || item.id || "";

            const itemPrice = Number(item.price || item.unitPrice || item.sellingPrice || 0);
            const origPrice = Number(item.originalPrice || itemPrice);
            const qty = Number(item.quantity || 1);
            const itemTotal = itemPrice * qty;

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border-base bg-bg-base hover:border-primary/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={img}
                    alt={title}
                    className="w-16 h-16 rounded-xl object-cover border border-border-base bg-white shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-xs font-bold text-text-base truncate">{title}</h3>
                    <div className="flex items-center gap-2 flex-wrap text-[10px] text-text-muted">
                      <span className="bg-bg-surface px-2 py-0.5 rounded-md border border-border-base font-semibold">{category}</span>
                      {variantName && <span className="text-primary font-bold">{variantName}</span>}
                      <span>SKU: <strong className="font-mono text-text-base">{sku}</strong></span>
                    </div>
                    {pid && (
                      <p className="text-[9.5px] font-mono text-text-muted/70">ID: {pid}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-border-base/40">
                  <div className="text-right">
                    <p className="text-xs font-bold text-text-base">
                      ₹{itemPrice.toLocaleString("en-IN")} × {qty}
                    </p>
                    {origPrice > itemPrice && (
                      <p className="text-[10px] text-text-muted line-through">₹{origPrice.toLocaleString("en-IN")}</p>
                    )}
                    <p className="text-xs font-extrabold text-primary mt-0.5">₹{itemTotal.toLocaleString("en-IN")}</p>
                  </div>
                  {pid && (
                    <Link
                      to={`/productdetails/${pid}`}
                      target="_blank"
                      className="p-2 rounded-lg border border-border-base text-text-muted hover:text-primary hover:border-primary transition"
                      title="View Product Details"
                    >
                      <FaExternalLinkAlt size={11} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
