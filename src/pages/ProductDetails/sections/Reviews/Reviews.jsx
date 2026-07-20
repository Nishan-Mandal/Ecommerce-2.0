import React, { useState } from 'react';
import ReviewItem from './ReviewCard';

// ── Tab: Reviews ──────────────────────────────────────────────────
function ReviewsTab({ reviews = [] }) {
  const [sortBy, setSortBy] = useState('Newest');
  const SORT_OPTIONS = ['Newest', 'Oldest', 'Highest', 'Lowest'];

  const FALLBACK = [
    { 
      userName: 'Happy Customer', 
      rating: 5, 
      review: 'Great product! Exactly as described and fast delivery.',
      createdAt: { seconds: Date.now() / 1000 }
    },
  ];

  // Normalize review objects to support both Firestore models and static fallbacks
  const list = (reviews && reviews.length > 0 ? reviews : FALLBACK).map(r => ({
    userName: r.userName || r.name || 'Anonymous',
    rating: Number(r.rating !== undefined ? r.rating : (r.stars !== undefined ? r.stars : 5)),
    review: r.review || r.comment || '',
    createdAt: r.createdAt || null
  }));

  // Sort logic based on selected filter
  const sorted = [...list].sort((a, b) => {
    if (sortBy === 'Newest') {
      const timeA = a.createdAt?.seconds || a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || b.createdAt?.seconds || 0;
      return timeB - timeA;
    }
    if (sortBy === 'Oldest') {
      const timeA = a.createdAt?.seconds || a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || b.createdAt?.seconds || 0;
      return timeA - timeB;
    }
    if (sortBy === 'Highest') return b.rating - a.rating;
    if (sortBy === 'Lowest') return a.rating - b.rating;
    return 0;
  });

  // Aggregate statistics
  const totalReviews = list.length;
  const avgStars = list.reduce((s, r) => s + r.rating, 0) / totalReviews || 0;
  const distMap = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  list.forEach((r) => { 
    if (distMap[r.rating] !== undefined) distMap[r.rating]++; 
  });

  return (
    <div className="py-6">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Review List</h3>
          <p className="text-xs text-gray-400 mt-0.5">Showing 1–{sorted.length} of {totalReviews} results</p>
        </div>
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none border border-gray-200 rounded-lg px-3 py-1.5 pr-7 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-base text-gray-400 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Review list */}
        <div className="md:col-span-2">
          {sorted.length === 0 ? (
            <p className="text-text-muted italic text-sm">No reviews yet for this product.</p>
          ) : (
            sorted.map((review, index) => (
              <ReviewItem key={index} review={review} index={index} />
            ))
          )}
        </div>

        {/* Right: Aggregate score card */}
        <div className="md:col-span-1">
          <div className="border border-gray-200 rounded-2xl p-6 sticky top-32 bg-white">
            {/* Big Score */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-bold text-gray-900">{avgStars.toFixed(1)}</span>
              <span className="text-gray-400 text-sm font-medium">out of 5</span>
            </div>

            {/* Star row */}
            <div className="flex gap-0.5 mb-1">
              {Array(5).fill(null).map((_, i) => (
                <span key={i} className={`text-2xl ${i < Math.round(avgStars) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-5">({totalReviews} Reviews)</p>

            {/* Star distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = totalReviews > 0 ? Math.round((distMap[star] / totalReviews) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-gray-500 font-medium">{star}</span>
                    <span className="text-amber-400 text-xs">★</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-7 text-right text-gray-400">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewsTab;