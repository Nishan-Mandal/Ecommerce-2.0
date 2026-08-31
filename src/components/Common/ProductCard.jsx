import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * ProductCard
 * Renders a premium, interactive product catalog item.
 * Features hover transformations, dynamic rating stars, category labels, and cart add triggers.
 * Enforces uniform height and alignment across grid layouts.
 */
function ProductCard({ item = {}, index, addCart }) {
    const navigate = useNavigate();
    const { title = '', price = 0, description = '', imageUrl = '', images = [], category = '', averageRating, rating } = item;
    const displayImage = imageUrl || (Array.isArray(images) && images.length > 0 ? images[0] : '');

    const ratingValue = Number(averageRating || rating || 0);
    const hasRating = !isNaN(ratingValue) && ratingValue > 0;

    const descText = typeof description === "object"
        ? (description?.short || "")
        : (typeof description === "string" ? description : "");

    return (
        <div
            onClick={() => navigate(`/productdetails/${item.id}`)}
            key={index}
            className="group flex flex-col h-full cursor-pointer overflow-hidden rounded-2xl bg-bg-surface border border-border-base/40 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-2.5"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-bg-base/30 rounded-xl flex items-center justify-center p-2">
                <img
                    src={displayImage}
                    alt={title}
                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Category Tag */}
                {category && (
                    <span className="absolute top-2 left-2 bg-bg-surface/90 backdrop-blur px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold uppercase tracking-wide text-primary shadow-xs border border-border-base/10 whitespace-nowrap max-w-[65%] truncate">
                        {category}
                    </span>
                )}

                {/* Floating Rating Badge (Functional: only displays authentic star rating if reviews exist) */}
                {hasRating && (
                    <div className="absolute top-2 right-2 bg-bg-surface/90 backdrop-blur px-1.5 py-0.5 rounded-md text-[9px] font-bold text-amber-500 flex items-center gap-0.5 shadow-xs border border-border-base/10 shrink-0">
                        <span
                            className="material-symbols-outlined text-[11px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            star
                        </span>
                        <span>{ratingValue.toFixed(1)}</span>
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-1 justify-between pt-2.5 space-y-1.5">
                <div className="space-y-1.5">
                    {/* Title (fixed uniform 2-line height for perfect horizontal alignment) */}
                    <h2 className="text-xs sm:text-sm font-bold text-text-base line-clamp-2 group-hover:text-primary transition-colors duration-200 h-9 sm:h-10 leading-snug flex items-start overflow-hidden">
                        {title}
                    </h2>

                    {/* Description (fixed uniform 2-line height for perfect horizontal alignment) */}
                    <p className="text-[10px] sm:text-[11px] text-text-muted line-clamp-2 leading-relaxed h-8 sm:h-9 overflow-hidden">
                        {descText || "Experience premium build quality and exceptional performance."}
                    </p>
                </div>

                {/* Price and Cart Action (pinned to bottom) */}
                <div className="flex items-center justify-between pt-2.5 mt-auto border-t border-border-base/30 shrink-0">
                    <div>
                        <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-text-muted font-bold">
                            Price
                        </span>
                        <span className="text-xs sm:text-sm lg:text-base font-extrabold text-text-base">
                            ₹{Number(price).toLocaleString("en-IN")}
                        </span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            addCart(item);
                        }}
                        className="w-8 h-8 sm:w-9 h-9 rounded-xl bg-primary text-compli flex items-center justify-center hover:bg-primary-hover active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base sm:text-lg">
                            add_shopping_cart
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard