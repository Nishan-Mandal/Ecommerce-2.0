import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import FilterBar from '../Components/FilterBar';
import OrderMobileCard from './tableComponents/OrderMobileCard';
import OrderTableRow from './tableComponents/OrderTableRow';
import { normalizeOrder } from './tableComponents/orderHelpers';
import { toast } from 'react-toastify';
import { FaClock } from 'react-icons/fa';
import TableSkeleton from '../../components/loader/SkeletonLoader/TableSkeleton';
import Pagination from '../../components/common/Pagination';
import ToggleButton from '../../components/Common/ToggleButton';

/**
 * OrderDetailTable Component
 * Redesigned clean, informative Admin Orders Table with skeleton loading and pagination.
 */
function OrderDetailTable({ mode, order = [], loading = false, formatDate }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [paymentFilter, setPaymentFilter] = useState('ALL');
    const [showPendingOrders, setShowPendingOrders] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handleCopy = (e, text, id) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleNavigate = (targetId) => {
        if (targetId) {
            navigate(`/admin/order/${targetId}`);
        }
    };

    // Helper to check if order is pending
    const checkIsPending = (norm) => {
        return norm.orderStatus === 'PAYMENT_PENDING' || norm.orderStatus === 'PENDING' || norm.paymentStatus === 'PENDING' || norm.paymentStatus === 'FAILED';
    };

    // Calculate count of pending orders
    const pendingCount = useMemo(() => {
        return order.filter((o) => {
            const norm = normalizeOrder(o);
            return checkIsPending(norm);
        }).length;
    }, [order]);

    // Filter logic
    const filteredOrders = useMemo(() => {
        return order.filter((o) => {
            const norm = normalizeOrder(o);
            const isPending = checkIsPending(norm);

            // By default hide pending orders unless explicitly toggled OR status filter is PAYMENT_PENDING
            if (!showPendingOrders && isPending && statusFilter !== 'PAYMENT_PENDING') {
                return false;
            }

            const searchLower = search.toLowerCase().trim();
            const matchSearch = !search ||
                norm.displayId.toLowerCase().includes(searchLower) ||
                norm.name.toLowerCase().includes(searchLower) ||
                norm.email.toLowerCase().includes(searchLower) ||
                norm.phone.toLowerCase().includes(searchLower) ||
                norm.paymentId.toLowerCase().includes(searchLower) ||
                norm.items.some((item) => (item.title || item.productName || item.name || '').toLowerCase().includes(searchLower));

            const matchStatus = statusFilter === 'ALL' || norm.orderStatus === statusFilter;
            const matchPayment = paymentFilter === 'ALL' ||
                (paymentFilter === 'Online' && (norm.paymentMode.toUpperCase().includes('ONLINE') || norm.paymentMode.toUpperCase().includes('RAZORPAY'))) ||
                (paymentFilter === 'COD' && norm.paymentMode.toUpperCase().includes('COD'));

            return matchSearch && matchStatus && matchPayment;
        });
    }, [order, showPendingOrders, statusFilter, paymentFilter, search]);

    // Reset pagination to page 1 when filtered dataset size changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredOrders.length]);

    const filtersConfig = [
        {
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { value: "ALL", label: "All Status" },
                { value: "PLACED", label: "Placed" },
                { value: "CONFIRMED", label: "Confirmed" },
                { value: "SHIPPED", label: "Shipped" },
                { value: "DELIVERED", label: "Delivered" },
                { value: "PAYMENT_PENDING", label: "Payment Pending" },
                { value: "CANCELLED", label: "Cancelled" }
            ]
        },
        {
            value: paymentFilter,
            onChange: setPaymentFilter,
            options: [
                { value: "ALL", label: "All Payments" },
                { value: "Online", label: "Online Payment" },
                { value: "COD", label: "Cash On Delivery" }
            ]
        }
    ];

    if (loading) {
        return (
            <div className="space-y-5">
                <Header
                    title="Customer Orders Management"
                    description="Monitor customer orders, fulfillment statuses, customer details, and payment receipts."
                />
                <TableSkeleton rows={pageSize} columns={7} />
            </div>
        );
    }

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

    return (
        <div className="space-y-5 ">
            <Header
                title="Customer Orders Management"
                description="Monitor customer orders, fulfillment statuses, customer details, and payment receipts."
            />

            {/* Filter Bar & Show Pending Orders Toggle Row */}
            <FilterBar
                search={search}
                setSearch={setSearch}
                searchPlaceholder="Search by Order ID, customer name, items, or payment ID..."
                filters={filtersConfig}
            >
                {/* Show Pending Orders Toggle Card */}
                <div
                    className={`flex items-center justify-between gap-3 px-3 py-1.5 h-11 rounded-xl border transition-all duration-300 w-full sm:w-auto shrink-0 shadow-2xs ${
                        showPendingOrders
                            ? "border-amber-300/80 bg-amber-500/10 shadow-amber-500/10"
                            : "border-border-base bg-white hover:border-border-base/80"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-base tracking-tight whitespace-nowrap">
                            Pending Orders
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black border border-amber-200">
                            {pendingCount}
                        </span>
                    </div>

                    <ToggleButton
                        checked={showPendingOrders}
                        onChange={setShowPendingOrders}
                        size="sm"
                        color="primary"
                        onLabel="ON"
                        offLabel="OFF"
                        labelPosition="left"
                    />
                </div>
            </FilterBar>

            {/* Mobile Responsive Cards */}
            <div className="block md:hidden space-y-4">
                {paginatedOrders.map((allorder, index) => (
                    <OrderMobileCard
                        key={allorder.docId || allorder.id || index}
                        allorder={allorder}
                        index={startIndex + index}
                        copiedId={copiedId}
                        onCopy={handleCopy}
                        onNavigate={handleNavigate}
                    />
                ))}

                {filteredOrders.length === 0 && (
                    <div className="bg-bg-surface p-8 text-center text-text-muted rounded-2xl border border-border-base shadow-xs text-xs font-bold">
                        No confirmed orders found matching criteria.
                    </div>
                )}
            </div>

            {/* Desktop Data Table */}
            <div className="hidden md:block bg-bg-surface rounded-2xl border border-border-base shadow-xs overflow-hidden text-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-base bg-bg-base/70 text-text-muted text-[11px] font-black uppercase tracking-wider">
                                <th className="px-5 py-3.5 w-36">Order ID</th>
                                <th className="px-5 py-3.5 w-36">Customer</th>
                                <th className="px-5 py-3.5 font-black">Items</th>
                                <th className="px-5 py-3.5 w-28">Total Price</th>
                                <th className="px-5 py-3.5 w-32">Status</th>
                                <th className="px-5 py-3.5 w-40">Order Date</th>
                                <th className="px-5 py-3.5 w-16 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base/60 text-text-base">
                            {paginatedOrders.map((allorder, index) => (
                                <OrderTableRow
                                    key={allorder.docId || allorder.id || index}
                                    allorder={allorder}
                                    index={startIndex + index}
                                    formatDate={formatDate}
                                    copiedId={copiedId}
                                    onCopy={handleCopy}
                                    onNavigate={handleNavigate}
                                />
                            ))}

                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-text-muted font-bold text-xs">
                                        No confirmed orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Universal Pagination */}
            <Pagination
                currentPage={currentPage}
                totalItems={filteredOrders.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                }}
            />
        </div>
    );
}

export default OrderDetailTable;
