import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminLayout from './adminLayout/AdminLayout';

function Admin() {
    const [activeView, setActiveView] = useState('overview');
    const location = useLocation();

    // Determine the active view to highlight on the sidebar
    const getActiveView = () => {
        if (location.pathname === '/addproduct' || location.pathname === '/updateproduct') {
            return 'products';
        }
        if (location.pathname.startsWith('/coupons')) {
            return 'coupons';
        }
        if (location.pathname === '/review') {
            return 'reviews';
        }
        if (location.pathname === '/configure') {
            return 'configure';
        }
        return activeView;
    };

    return (
        <AdminLayout activeView={getActiveView()} onViewChange={setActiveView}>
            <Outlet context={{ activeView, setActiveView }} />
        </AdminLayout>
    );
}

export default Admin;