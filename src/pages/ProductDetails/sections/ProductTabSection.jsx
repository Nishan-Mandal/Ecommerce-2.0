import React, { useState } from 'react'
import ReviewCard from './Reviews/ReviewCard';
import ReviewsTab from './Reviews/Reviews';
import DescriptionTab from './DescriptionTab';


// ── Main Tabbed Component ─────────────────────────────────────────
const TABS = ['Details', 'Reviews',];

export default function ProductTabSection({ description, specifications, reviews }) {
  const [activeTab, setActiveTab] = useState('Details');

  return (
    <div className="mt-16 border-t border-gray-200">
      {/* Tab Bar */}
      <div className="flex gap-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-3 pt-4 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'text-gray-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {/* Active underline */}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'Details'  && <DescriptionTab  description={description} specifications={specifications} />}
        {activeTab === 'Reviews'  && <ReviewsTab  reviews={reviews} />}
      </div>
    </div>
  );
}
