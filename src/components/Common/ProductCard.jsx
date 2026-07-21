import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * ProductCard
 * Renders a premium, interactive product catalog item.
 * Features hover transformations, dynamic rating stars, category labels, and cart add triggers.
 */
function ProductCard({ item, index, addCart }) {
    const navigate = useNavigate();
    const { title, price, description, imageUrl, category, averageRating } = item;

    return (
        <div
            onClick={() => navigate(`/productdetails/${item.id}`)}
            key={index}
            className="group flex flex-col cursor-pointer overflow-hidden rounded-2xl bg-bg-surface border border-border-base/40 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-2.5"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-base/30 rounded-xl flex items-center justify-center p-2">
                <img
                    src={imageUrl}
                    alt={title}
                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Category Tag */}
                {category && (
                    <span className="absolute top-2 left-2 bg-bg-surface/90 backdrop-blur px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold uppercase tracking-wide text-primary shadow-xs border border-border-base/10">
                        {category}
                    </span>
                )}

                {/* Floating Rating Badge */}
                <div className="absolute top-2 right-2 bg-bg-surface/90 backdrop-blur px-1.5 py-0.5 rounded-md text-[9px] font-bold text-amber-500 flex items-center gap-0.5 shadow-xs border border-border-base/10">
                    <span
                        className="material-symbols-outlined text-[11px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                        star
                    </span>
                    <span>{averageRating ? averageRating.toFixed(1) : "4.8"}</span>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow pt-2.5 space-y-1.5">

                {/* Title */}
                <h2 className="text-xs sm:text-sm font-bold text-text-base line-clamp-2 group-hover:text-primary transition-colors duration-200 min-h-[2rem] sm:min-h-[2.5rem] leading-snug">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-[10px] sm:text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                    {description || "Experience premium build quality and exceptional cooling performance designed for modern homes."}
                </p>

                {/* Price and Cart Action */}
                <div className="flex items-center justify-between pt-2 mt-auto border-t border-border-base/30">
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