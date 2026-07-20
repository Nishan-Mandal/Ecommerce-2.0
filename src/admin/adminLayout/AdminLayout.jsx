import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/auth/useAuth';
import { FaShoppingCart, FaBoxes, FaUsers, FaChartBar, FaStar, FaBandcamp } from 'react-icons/fa';
import { RiCoupon2Fill } from "react-icons/ri";
import { useSiteConfig } from '../../context/SiteConfigContext';

// Import Layout Sections
import Sidebar from './sections/Sidebar';
import MobileDrawer from './sections/MobileDrawer';
import Header from './sections/Header';
import BottomNavigation from './sections/BottomNavigation';
import MainContent from './sections/MainContent';

/**
 * AdminLayout Component
 * A restructured, highly responsive, production-ready SaaS administration dashboard template.
 * Composes subcomponents: Sidebar, MobileDrawer, Header, BottomNavigation, and MainContent.
 */
export default function AdminLayout({ children, activeView = 'products', onViewChange }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { config } = useSiteConfig();
    
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const sidebarItems = [
        { id: 'overview', label: 'Dashboard', icon: <FaChartBar size={16} /> },
        { id: 'products', label: 'Products', icon: <FaBoxes size={16} /> },
        { id: 'orders', label: 'Orders', icon: <FaShoppingCart size={16} /> },
        { id: 'users', label: 'Users', icon: <FaUsers size={16} /> },
        { id: 'coupons', label: 'Coupons', icon: <RiCoupon2Fill size={16} /> },
        { id: 'reviews', label: 'Reviews', icon: <FaStar size={16} /> },
        { id: 'configure', label: 'Configure', icon: <FaBandcamp size={16} /> }
    ];

    const handleNavClick = (id) => {
        if (id === 'coupons') {
            navigate('/coupons');
            return;
        }
        if (id === 'reviews') {
            navigate('/review');
            return;
        }
        if (id === 'configure') {
            navigate('/configure');
            return;
        }
        if (id === 'store') {
            navigate('/');
            return;
        }
        if (location.pathname === '/dashboard') {
            if (onViewChange) onViewChange(id);
        } else {
            navigate('/dashboard', { state: { activeView: id } });
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const getHeaderTitle = () => {
        if (location.pathname === '/addproduct') return 'Add New Product';
        if (location.pathname === '/updateproduct') return 'Update Product Details';
        if (activeView === 'overview') return 'Dashboard';
        return `${activeView.charAt(0).toUpperCase() + activeView.slice(1)}`;
    };

    return (
        <div className="h-screen overflow-hidden bg-bg-base text-text-base flex">
            {/* 1. Mobile Drawer Navigation */}
            <MobileDrawer
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
                sidebarItems={sidebarItems}
                activeView={activeView}
                handleNavClick={handleNavClick}
                config={config}
                handleLogout={handleLogout}
            />

            {/* 2. Mobile Bottom Navigation */}
            <BottomNavigation
                activeView={activeView}
                handleNavClick={handleNavClick}
            />

            {/* 3. Desktop/Tablet Sidebar */}
            <Sidebar
                sidebarItems={sidebarItems}
                activeView={activeView}
                sidebarCollapsed={sidebarCollapsed}
                handleNavClick={handleNavClick}
                config={config}
                handleLogout={handleLogout}
            />

            {/* 4. Main Panel Workspace */}
            <div
                className={`
                    flex-1 flex flex-col h-full overflow-hidden transition-all duration-200 ml-0
                    ${sidebarCollapsed ? 'md:ml-20 lg:ml-[260px]' : 'md:ml-[260px] lg:ml-[260px]'}
                `}
            >
                {/* Fixed Top Header (never scrolls) */}
                <Header
                    setDrawerOpen={setDrawerOpen}
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                    title={getHeaderTitle()}
                />

                {/* Scrollable Main Content Container */}
                <div className="flex-1 overflow-y-auto">
                    <MainContent>
                        {children}
                    </MainContent>
                </div>
            </div>
        </div>
    );
}
