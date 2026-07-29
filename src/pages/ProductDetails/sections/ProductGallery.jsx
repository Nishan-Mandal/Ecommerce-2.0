import React from 'react';

/**
 * ProductGallery
 * Props:
 *  - images: string[]       — array of extra image URLs (Firestore `images` field)
 *  - imageUrl: string       — primary/fallback image URL
 *  - title: string          — product title for alt text
 *  - selectedImage: string  — currently displayed image URL
 *  - setSelectedImage: fn   — setter to change displayed image
 */
export default function ProductGallery({
  images = [],
  imageUrl = '',
  title = 'Product Image',
  selectedImage,
  setSelectedImage,
}) {
  // Merge primary image with extra images, deduplicate
  const allImages = imageUrl
    ? [imageUrl, ...images.filter((img) => img !== imageUrl)]
    : images;

  const displaySrc = selectedImage || imageUrl;
  const activeIndex = allImages.indexOf(displaySrc);
  const displayIndex = activeIndex !== -1 ? activeIndex + 1 : 1;

  return (
    <div className="flex gap-4 lg:flex-row flex-col-reverse">
      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 w-full lg:w-20 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${displaySrc === img
                  ? 'border-primary shadow-xs'
                  : 'border-border-base/50 hover:border-primary/50 bg-bg-surface/50'
                }`}
            >
              <img
                className="w-full h-full object-contain p-1 hover:scale-105 transition-transform duration-300"
                src={img}
                alt={`${title} thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Display Image — fixed height so it never shifts with different images */}
      <div className="relative flex-1 bg-bg-base/30 border border-border-base/40 rounded-2xl overflow-hidden flex items-center justify-center"
           style={{ height: 'clamp(240px, 45vw, 480px)', minHeight: '240px', maxHeight: '480px' }}>
        <img
          src={displaySrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-contain p-3 sm:p-4 lg:p-6 transition-all duration-500 ease-out"
        />

        {allImages.length > 0 && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-bg-surface/85 backdrop-blur px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-xs border border-border-base/10 text-text-muted z-10">
            {displayIndex}/{allImages.length}
          </div>
        )}
      </div>
    </div>
  );
}
