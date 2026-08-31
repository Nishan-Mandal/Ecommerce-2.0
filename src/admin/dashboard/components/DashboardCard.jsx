import React from 'react';

/**
 * DashboardCard Component
 * Displays summary analytics metrics.
 * Uses design system classes and animations for high visual fidelity.
 */
function DashboardCard({ title, value, icon }) {
    return (
        <div className="group bg-bg-surface rounded-2xl border border-border-base/60 transition-all duration-300 p-4 sm:p-2 lg:p-2">
            <div className="flex items-center justify-between gap-4">
                {/* Left */}
                <div className="flex items-center  min-w-0">
                    <div className=" flex items-center justify-center  px-2 py-2 rounded-xl  bg-primary/10 text-primary transition-all duration-300 group-hover:text-compli shrink-0">
                        {icon}
                    </div>

                    <span className="text-xs sm:text-sm font-extrabold  text-text-muted truncate">
                        {title}
                    </span>
                </div>
                {/* Right */}
                <h2 className="text-lg sm:text-xl lg:text-xl font-black tracking-tight text-text-base whitespace-nowrap">{value}</h2>
            </div>
        </div>
    );
}

export default DashboardCard;
