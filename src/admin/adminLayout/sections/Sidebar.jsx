import React from 'react';

/**
 * Sidebar Component
 * Fixed left sidebar for desktop and tablet screens (collapsible on tablet).
 */
export default function Sidebar({
    sidebarItems,
    activeView,
    sidebarCollapsed,
    handleNavClick,
    config,
    handleLogout
}) {
    return (
        <aside
            className={`
                hidden md:flex flex-col fixed inset-y-0 left-0 z-40 bg-bg-surface border-r border-border-base transition-all duration-200
                ${sidebarCollapsed ? 'md:w-20 lg:w-[260px]' : 'md:w-[260px] lg:w-[260px]'}
            `}
        >
            {/* Logo & Company Name */}
            <div className="px-6 py-5 border-b border-border-base flex items-center gap-3 h-16 shrink-0">
                {config.companyLogo ? (
                    <img src={config.companyLogo} alt={config.companyName} className="w-8 h-8 object-contain rounded-lg" />
                ) : (
                    <span className="material-symbols-outlined text-primary text-[28px]">settings_suggest</span>
                )}
                <span className={`font-bold text-[16px] text-text-base uppercase tracking-tight truncate transition-opacity duration-200 ${
                    sidebarCollapsed ? 'md:hidden lg:block' : 'block'
                }`}>
                    {config.companyName || "Admin Panel"}
                </span>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer text-sm font-semibold ${
                                isActive 
                                    ? 'bg-primary text-compli' 
                                    : 'text-text-muted hover:bg-gray-50 hover:text-text-base'
                            }`}
                        >
                            <span className={isActive ? 'text-compli' : 'text-text-muted'}>
                                {item.icon}
                            </span>
                            <span className={`transition-opacity duration-200 ${
                                sidebarCollapsed ? 'md:hidden lg:block' : 'block'
                            }`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-border-base space-y-1 shrink-0">
                <a
                    href="/"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:bg-gray-50 hover:text-text-base transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">storefront</span>
                    <span className={`transition-opacity duration-200 ${
                        sidebarCollapsed ? 'md:hidden lg:block' : 'block'
                    }`}>
                        View Store
                    </span>
                </a>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-550/10 transition-all font-extrabold cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span className={`transition-opacity duration-200 ${
                        sidebarCollapsed ? 'md:hidden lg:block' : 'block'
                    }`}>
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}
