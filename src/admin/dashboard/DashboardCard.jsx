import React from 'react';

/**
 * DashboardCard Component
 * Displays summary analytics metrics.
 * Uses design system classes and animations for high visual fidelity.
 */
function DashboardCard({ title, value, icon }) {
    return (
        <div className="group bg-bg-surface rounded-2xl border border-border-base/60 shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-4">
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className=" flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl  bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-compli shrink-0">
                        {icon}
                    </div>

                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-text-muted truncate">
                        {title}
                    </span>
                </div>
                {/* Right */}
                <h2 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-text-base whitespace-nowrap">{value}</h2>
            </div>
        </div>
    );
}

export default DashboardCard;
