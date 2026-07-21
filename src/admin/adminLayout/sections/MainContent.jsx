import React from 'react';

/**
 * MainContent Component
 * Restricts maximum layout widths and applies responsive padding.
 */
export default function MainContent({ children }) {
    return (
        <div className="w-full max-w-[1600px] mx-auto p-4 pb-24 md:p-6 lg:p-8">
            {children}
        </div>
    );
}
