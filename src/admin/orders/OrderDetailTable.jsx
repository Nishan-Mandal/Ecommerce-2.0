import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import FilterBar from '../Components/FilterBar';

/**
 * OrderDetailTable Component
 * Displays client order lists inside the admin dashboard.
 * Designed with search/filters, modern responsive cards, and tables.
 */
function safeFormatDate(dateVal, customFormatFn) {
    if (typeof customFormatFn === 'function') {
        try {
            const res = customFormatFn(dateVal);
            if (res && res !== 'N/A') return res;
        } catch (e) {
            // Fallback
        }
    }
    if (!dateVal) return "N/A";
    if (typeof dateVal === "string") return dateVal;
    if (typeof dateVal === "number") return new Date(dateVal).toLocaleDateString("en-IN");
    if (dateVal?.seconds !== undefined) {
        return new Date(dateVal.seconds * 1000).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }
    if (dateVal?.toDate && typeof dateVal.toDate === "function") {
        return dateVal.toDate().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }
    if (dateVal instanceof Date) return dateVal.toLocaleDateString("en-IN");
    return "N/A";
}

function normalizeOrder(allorder) {
    const sAddr = allorder.shippingAddress || {};
    const aInfo = allorder.addressInfo || {};

    const name = aInfo.name || aInfo.fullName || sAddr.fullName || allorder.userProfile?.name || 'N/A';
    const email = allorder.email || allorder.userEmail || allorder.userProfile?.email || 'N/A';
    const phone = aInfo.phoneNumber || aInfo.phone || sAddr.phone || allorder.userProfile?.phone || '';
    
    const streetAddress = aInfo.address || [sAddr.houseNo, sAddr.street, sAddr.landmark, sAddr.city, sAddr.state].filter(Boolean).join(', ') || 'N/A';
    const pincode = aInfo.pincode || sAddr.pincode || 'N/A';

    const rawAmount = allorder.totalAmount ?? allorder.pricing?.grandTotal ?? allorder.amount ?? 0;
    const totalAmount = typeof rawAmount === 'number' ? rawAmount : (parseFloat(rawAmount) || 0);

    const paymentMode = allorder.paymentMode || allorder.paymentInfo?.method || allorder.payment?.gateway || 'Online Payment';
    const paymentId = allorder.paymentId || allorder.payment?.paymentId || allorder.gatewayOrderId || allorder.orderId || '';

    const dateVal = allorder.date || allorder.createdAt;

    return {
        name,
        email,
        phone,
        streetAddress,
        pincode,
        totalAmount,
        paymentMode,
        paymentId,
        dateVal,
        items: allorder.products || allorder.items || allorder.cart || [],
        isCustom: Boolean(allorder.isCustom),
        image: allorder.image,
        itemInfo: allorder.itemInfo,
    };
}

function OrderDetailTable({ mode, order = [], formatDate }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('ALL');

    // Filter logic
    const filteredOrders = order.filter(o => {
        const norm = normalizeOrder(o);
        const searchLower = search.toLowerCase();
        const matchSearch = !search ||
            norm.name.toLowerCase().includes(searchLower) ||
            norm.email.toLowerCase().includes(searchLower) ||
            norm.phone.toLowerCase().includes(searchLower) ||
            norm.paymentId.toLowerCase().includes(searchLower) ||
            norm.items.some(item => (item.title || item.productName || '').toLowerCase().includes(searchLower));

        const matchPayment = paymentFilter === 'ALL' || norm.paymentMode === paymentFilter || (paymentFilter === 'Online Payment' && norm.paymentMode.toUpperCase().includes('ONLINE')) || (paymentFilter === 'Cash On Delivery' && norm.paymentMode.toUpperCase().includes('COD'));
        return matchSearch && matchPayment;
    });

    const filtersConfig = [
        {
            value: paymentFilter,
            onChange: setPaymentFilter,
            options: [
                { value: "ALL", label: "All Payments" },
                { value: "Online Payment", label: "Online" },
                { value: "Cash On Delivery", label: "COD" }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <Header title="Order Details" description="View and track customer orders, payment receipts, and delivery shipping addresses." />

            {/* Reusable Filter Bar */}
            <FilterBar
                search={search}
                setSearch={setSearch}
                searchPlaceholder="Search orders by customer name, email, phone, items, or payment ID..."
                filters={filtersConfig}
            />

            {/* Mobile Cards (Visible only on mobile) */}
            <div className="block md:hidden space-y-4">
                {filteredOrders.map((allorder, index) => {
                    const norm = normalizeOrder(allorder);
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-border-base shadow-xs space-y-4">
                            {/* Card Header */}
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-muted font-bold">Order #{index + 1}</span>
                                <span className="text-text-muted font-semibold">{safeFormatDate(norm.dateVal, formatDate)}</span>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-gray-50/50 p-4 rounded-xl space-y-1.5">
                                <div className="font-bold text-sm text-text-base">{norm.name}</div>
                                <div className="text-xs text-text-muted">{norm.email}</div>
                                {norm.phone && <div className="text-xs font-bold text-[#17700d]">{norm.phone}</div>}
                            </div>

                            {/* Shipping Address */}
                            <div className="text-xs text-text-muted leading-relaxed space-y-1 pl-1">
                                <div className="font-bold text-text-base uppercase tracking-wider text-[10px]">Shipping to:</div>
                                <div>{norm.streetAddress}</div>
                                <div className="font-bold text-text-base">Pincode: {norm.pincode}</div>
                            </div>

                            {/* Ordered Items */}
                            <div className="space-y-2 pl-1">
                                <div className="font-bold text-text-base uppercase tracking-wider text-[10px]">Items:</div>
                                {norm.isCustom ? (
                                    <div className="flex items-center gap-3 bg-gray-50/30 p-3 rounded-xl border border-border-base/50">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-border-base bg-white flex items-center justify-center p-1 shrink-0">
                                            <img className="w-full h-full object-contain" src={norm.image || '/placeholder.png'} alt="custom" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-xs text-text-base">{norm.itemInfo?.selectedDrawingType}</div>
                                            <div className="text-[10px] text-rose-600 font-bold mt-0.5">Custom: {norm.itemInfo?.selectedSheetType}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {norm.items.map((item, itemIdx) => (
                                            <div key={itemIdx} className="flex items-center gap-3 bg-gray-50/30 p-2.5 rounded-xl border border-border-base/50">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-border-base bg-white flex items-center justify-center p-1 shrink-0">
                                                    <img className="w-full h-full object-contain" src={item.imageUrl || item.image || item.productImage || '/placeholder.png'} alt={item.title || item.productName} />
                                                </div>
                                                <div className="leading-tight min-w-0">
                                                    <div className="font-bold text-xs text-text-base truncate">{item.title || item.productName || 'Product Item'}</div>
                                                    <div className="text-[10px] text-text-muted mt-0.5">{item.category || (item.quantity ? `Qty: ${item.quantity}` : '')}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-border-base my-2"></div>

                            {/* Pricing & Payment Status */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] text-text-muted uppercase tracking-wider block">Total Amount</span>
                                    <span className="font-extrabold text-base text-text-base">₹{norm.totalAmount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                                        norm.paymentMode.toUpperCase().includes('ONLINE') || norm.paymentMode.toUpperCase().includes('RAZORPAY')
                                        ? 'bg-emerald-50 text-[#17700d] border-emerald-100' 
                                        : 'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                        {norm.paymentMode}
                                    </span>
                                    {norm.paymentId && (
                                        <div className="text-[10px] text-text-muted mt-1 font-mono truncate max-w-[140px]">ID: {norm.paymentId}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filteredOrders.length === 0 && (
                    <div className="bg-white p-8 text-center text-text-muted rounded-2xl border border-border-base shadow-xs">
                        No orders placed yet.
                    </div>
                )}
            </div>

            {/* Desktop Table (Hidden on mobile) */}
            <div className="hidden md:block bg-white rounded-2xl border border-border-base shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-base bg-gray-50/50 text-text-muted text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4 w-16 hidden lg:table-cell">S.No</th>
                                <th className="px-6 py-4 w-44">Customer</th>
                                <th className="px-6 py-4 w-60">Shipping Address</th>
                                <th className="px-6 py-4">Ordered Items</th>
                                <th className="px-6 py-4 w-32">Total Price</th>
                                <th className="px-6 py-4 w-40">Payment Info</th>
                                <th className="px-6 py-4 w-40 hidden xl:table-cell">Order Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base text-sm text-text-base">
                            {filteredOrders.map((allorder, index) => {
                                const norm = normalizeOrder(allorder);
                                const targetId = allorder.docId || allorder.id || allorder.orderId || norm.paymentId;
                                return (
                                    <tr
                                        key={index}
                                        onClick={() => targetId && navigate(`/admin/order/${targetId}`)}
                                        className="hover:bg-gray-50/60 transition-colors align-top cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-text-muted text-center hidden lg:table-cell">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-text-base">{norm.name}</div>
                                            <div className="text-xs text-text-muted mt-0.5">{norm.email}</div>
                                            {norm.phone && <div className="text-xs font-bold text-[#17700d] mt-1">{norm.phone}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-text-muted leading-relaxed">
                                            <div>{norm.streetAddress}</div>
                                            <div className="mt-1 font-bold text-xs text-text-base">Pincode: {norm.pincode}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {norm.isCustom ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-border-base bg-white flex items-center justify-center p-1 shrink-0">
                                                        <img className="w-full h-full object-contain" src={norm.image || '/placeholder.png'} alt="custom" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-text-base">{norm.itemInfo?.selectedDrawingType}</div>
                                                        <div className="text-xs text-rose-600 font-bold mt-0.5">Custom: {norm.itemInfo?.selectedSheetType}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2.5">
                                                    {norm.items.map((item, itemIdx) => (
                                                        <div key={itemIdx} className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-border-base bg-white flex items-center justify-center p-1 shrink-0">
                                                                <img className="w-full h-full object-contain" src={item.imageUrl || item.image || item.productImage || '/placeholder.png'} alt={item.title || item.productName} />
                                                            </div>
                                                            <div className="leading-tight">
                                                                <div className="font-bold text-text-base">{item.title || item.productName || 'Product Item'}</div>
                                                                <div className="text-xs text-text-muted mt-0.5">{item.category || (item.quantity ? `Qty: ${item.quantity}` : '')}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-text-base">
                                            ₹{norm.totalAmount.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                                                norm.paymentMode.toUpperCase().includes('ONLINE') || norm.paymentMode.toUpperCase().includes('RAZORPAY')
                                                ? 'bg-emerald-50 text-[#17700d] border-emerald-100' 
                                                : 'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                                {norm.paymentMode}
                                            </span>
                                            {norm.paymentId && (
                                                <div className="text-xs text-text-muted mt-1 font-mono break-all">ID: {norm.paymentId}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-text-muted hidden xl:table-cell">
                                            {safeFormatDate(norm.dateVal, formatDate)}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-text-muted">
                                        No orders placed yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailTable;
