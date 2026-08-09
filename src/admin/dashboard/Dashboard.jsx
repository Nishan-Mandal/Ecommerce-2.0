import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaBoxes, FaUsers, FaRupeeSign, FaPlus, FaTicketAlt } from 'react-icons/fa';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import useProducts from '../../hooks/product/useProducts';
import useOrders from '../../hooks/order/useOrders';
import useAdmin from '../../hooks/auth/useAdmin';
import { userService } from '../../services/user/userService';

import DashboardCard from './DashboardCard';
import DashboardAnalytics from './components/DashboardAnalytics';
import RecentActivityFeed from './components/RecentActivityFeed';
import RecentOrdersTable from './components/RecentOrdersTable';
import Products from '../products/Products';
import Orders from '../orders/Orders';
import UserDetailTable from '../User/UserDetailTable';
import DashboardSkeleton from '../../components/loader/SkeletonLoader/DashboardSkeleton';
import { activityService } from '../../services/activity/activityService';

/**
 * Dashboard Component
 * Renders the main admin management view.
 * Redesigned for high density, clear layouts, Recharts analytics, audit logs, and quick action shortcuts.
 */
function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { mode } = useTheme();
    const { products, loading: productsLoading } = useProducts();
    const { orders, loading: ordersLoading } = useOrders();
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [activities, setActivities] = useState([]);

    const adminHook = useAdmin();

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const data = await userService.getUsers();
            setUsers(data || []);
        } catch (err) {
            console.error("Error loading users: ", err);
        } finally {
            setUsersLoading(false);
        }
    };

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await activityService.getRecentActivities(10);
                setActivities(data);
            } catch (err) {
                console.warn("Error loading activities: ", err);
            }
        };

        fetchUsers();
        fetchActivities();
    }, []);

    // Calculate total revenue from valid orders
    const totalRevenue = orders.reduce((acc, allorder) => {
        const status = (allorder.orderStatus || allorder.status || '').toUpperCase();
        const paymentStat = (allorder.paymentStatus || allorder.payment?.status || '').toUpperCase();
        if (status === 'CANCELLED' || status === 'REFUNDED' || status === 'PAYMENT_FAILED' || paymentStat === 'FAILED') {
            return acc;
        }
        const raw = allorder.totalAmount ?? allorder.pricing?.grandTotal ?? allorder.amount ?? allorder.total ?? 0;
        const amt = typeof raw === 'number' ? (isNaN(raw) ? 0 : raw) : (parseFloat(String(raw).replace(/[^0-9.]/g, '')) || 0);
        return acc + amt;
    }, 0);

    const handleAddClick = () => {
        adminHook.resetForm();
        navigate('/addproduct');
    };

    // Helper to format dates safely
    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';
        if (typeof dateValue.toDate === 'function') {
            return dateValue.toDate().toLocaleString();
        }
        return String(dateValue);
    };

    const dashboardMetrics = [
        {
            title: "Total Products",
            value: products.length,
            icon: <FaBoxes size={18} />,
        },
        {
            title: "Total Orders",
            value: orders.length,
            icon: <FaShoppingCart size={18} />,
        },
        {
            title: "Total Users",
            value: users.length,
            icon: <FaUsers size={18} />,
        },
        {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            icon: <FaRupeeSign size={18} />,
        },
    ];

    const isOverviewLoading = productsLoading && ordersLoading && usersLoading;

    return (
        isOverviewLoading ? (
            <DashboardSkeleton />
        ) : (
            <section className="space-y-6 lg:space-y-8 mt-1 px-4 md:px-0">

                {/* Quick Action Buttons Strip */}
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 sm:p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-base font-black text-text-base flex items-center gap-2">
                                <span>Quick Actions</span>
                            </h2>
                            <p className="text-xs text-text-muted mt-0.5">
                                Fast shortcuts to manage inventory, coupons, orders, and customers
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Add Product Button */}
                            <button
                                onClick={handleAddClick}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-compli rounded-xl font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
                            >
                                <FaPlus size={12} />
                                <span>Add Product</span>
                            </button>

                            {/* Add Coupon Button */}
                            <button
                                onClick={() => navigate('/coupons/add')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
                            >
                                <FaTicketAlt size={12} />
                                <span>Add Coupon</span>
                            </button>

                            {/* See Orders Button */}
                            <button
                                onClick={() => navigate('/orders')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
                            >
                                <FaShoppingCart size={12} />
                                <span>See Orders</span>
                            </button>

                            {/* Manage Users Button */}
                            <button
                                onClick={() => navigate('/users')}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-surface hover:bg-bg-base text-text-base border border-border-base rounded-xl font-bold text-xs transition cursor-pointer shadow-2xs active:scale-95"
                            >
                                <FaUsers size={12} />
                                <span>Users</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Top KPI Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {dashboardMetrics.map((metric, index) => (
                        <DashboardCard
                            key={index}
                            title={metric.title}
                            value={metric.value}
                            icon={metric.icon}
                        />
                    ))}
                </div>
                {/* Recharts Analytics Charts */}
                <DashboardAnalytics orders={orders} products={products} />

                {/* 2-Column Grid: Recent Orders & Audit Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-7">
                        <RecentOrdersTable orders={orders} onViewAll={() => navigate("/orders")} />
                    </div>
                    <div className="lg:col-span-5">
                        <RecentActivityFeed activities={activities} />
                    </div>
                </div>
            </section>
        )
    );
}

export default Dashboard;