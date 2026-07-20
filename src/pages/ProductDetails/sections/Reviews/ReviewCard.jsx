import React from 'react';

// ── Individual Review Card ────────────────────────────────────────
function ReviewItem({ review, index }) {
  

  // Generate avatar initials + deterministic bg colour
  const COLORS = [
    'bg-violet-100 text-violet-700',
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
  ];
  const displayName = review.userName || 'Anonymous';
  const displayReview = review.review || '';
  const displayRating = review.rating || 0;
  const colorClass = COLORS[index % COLORS.length];
  const initials = displayName
    ? displayName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  let dateStr = 'Recently';
  if (review.createdAt) {
    try {
      if (typeof review.createdAt.toDate === 'function') {
        dateStr = review.createdAt.toDate().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } else if (review.createdAt.seconds) {
        dateStr = new Date(review.createdAt.seconds * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } else if (review.createdAt instanceof Date) {
        dateStr = review.createdAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch (e) {
      console.error("Error formatting review date:", e);
    }
  }

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 last:border-0">
      {/* Avatar */}
      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${colorClass}`}>
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name + Date */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900 text-sm">{displayName}</span>
          <span className="text-gray-400 text-xs">{dateStr}</span>
        </div>

        {/* Stars */}
        <div className="flex gap-0.5 mt-1">
          {Array(5).fill(null).map((_, i) => (
            <span
              key={i}
              className={`text-base ${i < displayRating ? 'text-amber-400' : 'text-gray-200'}`}
              style={{ fontVariationSettings: i < displayRating ? "'FILL' 1" : "'FILL' 0" }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment */}
        <p className="mt-2 text-sm text-gray-700 leading-relaxed font-medium">{displayReview}</p>
      </div>
    </div>
  );
}

export default ReviewItem;