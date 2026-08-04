import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaBoxes, FaUsers, FaRupeeSign, FaChartBar } from 'react-icons/fa';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import useProducts from '../../hooks/product/useProducts';
import useOrders from '../../hooks/order/useOrders';
import useAuth from '../../hooks/auth/useAuth';
import useAdmin from '../../hooks/auth/useAdmin';
import { userService } from '../../services/user/userService';

import DashboardCard from './DashboardCard';
import Products from '../products/Products';
import Orders from '../orders/Orders';
import UserDetailTable from '../User/UserDetailTable';

/**
 * Dashboard Component
 * Renders the main admin management view.
 * Redesigned for high density, clear layouts, and brand color alignment.
 */
function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { mode } = useTheme();
    const { products } = useProducts();
    const { orders } = useOrders();
    const [users, setUsers] = useState([]);

    const adminHook = useAdmin();
    const { activeView, setActiveView } = useOutletContext();

    useEffect(() => {
        if (location.state?.activeView) {
            setActiveView(location.state.activeView);
        }
    }, [location.state, setActiveView]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getUsers();
                setUsers(data);
            } catch (err) {
                console.error("Error loading users: ", err);
            }
        };
        fetchUsers();
    }, []);

    // Calculate total revenue from all orders
    const totalRevenue = orders.reduce((acc, allorder) => {
        return acc + (Number(allorder.totalAmount) || 0);
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

    return (
        <>
            {activeView === "overview" && (
                <section className="space-y-6 lg:space-y-8 mt-5">

                    {/* Welcome Banner */}
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 sm:p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-text-base">
                                    Welcome back, Admin!
                                </h2>

                                <p className="mt-1 text-sm text-text-muted">
                                    Here's what's happening with your store today.
                                </p>
                            </div>

                            <button
                                onClick={handleAddClick}
                                className="w-full md:w-auto flex items-center justify-center gap-2 px-2 py-3 bg-primary hover:bg-primary-hover text-compli rounded-xl font-bold text-sm transition cursor-pointer"
                            >
                                <span>Add Product</span>

                                <span className="material-symbols-outlined text-lg">
                                    add_box
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Analytics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
                        <DashboardCard
                            title="Total Products"
                            value={products.length}
                            icon={<FaBoxes size={18} />}
                        />

                        <DashboardCard
                            title="Total Orders"
                            value={orders.length}
                            icon={<FaShoppingCart size={18} />}
                        />

                        <DashboardCard
                            title="Total Users"
                            value={users.length}
                            icon={<FaUsers size={18} />}
                        />

                        <DashboardCard
                            title="Total Revenue"
                            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
                            icon={<FaRupeeSign size={18} />}
                        />
                    </div>
                </section>
            )}

            {activeView === "products" && (
                <Products
                    mode={mode}
                    formatDate={formatDate}
                />
            )}

            {activeView === "orders" && (
                <Orders
                    mode={mode}
                    order={orders}
                    formatDate={formatDate}
                />
            )}

            {activeView === "users" && (
                <UserDetailTable
                    mode={mode}
                    user={users}
                    formatDate={formatDate}
                />
            )}
        </>
    );
}

export default Dashboard;