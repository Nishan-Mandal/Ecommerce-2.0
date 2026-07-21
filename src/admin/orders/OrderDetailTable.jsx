import React, { useState } from 'react';
import Header from '../Components/Header';
import FilterBar from '../Components/FilterBar';

/**
 * OrderDetailTable Component
 * Displays client order lists inside the admin dashboard.
 * Designed with search/filters, modern responsive cards, and tables.
 */
function OrderDetailTable({ mode, order = [], formatDate }) {
    const [search, setSearch] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('ALL');

    // Filter logic
    const filteredOrders = order.filter(o => {
        const searchLower = search.toLowerCase();
        const matchSearch = !search ||
            o.addressInfo?.name?.toLowerCase().includes(searchLower) ||
            o.email?.toLowerCase().includes(searchLower) ||
            o.addressInfo?.phoneNumber?.toLowerCase().includes(searchLower) ||
            o.paymentId?.toLowerCase().includes(searchLower) ||
            (o.items || []).some(item => item.title?.toLowerCase().includes(searchLower));

        const matchPayment = paymentFilter === 'ALL' || o.paymentMode === paymentFilter;
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
                    const { addressInfo, email, paymentMode, paymentId, totalAmount, date, isCustom } = allorder;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-border-base shadow-xs space-y-4">
                            {/* Card Header */}
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-muted font-bold">Order #{index + 1}</span>
                                <span className="text-text-muted font-semibold">{formatDate(date)}</span>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-gray-50/50 p-4 rounded-xl space-y-1.5">
                                <div className="font-bold text-sm text-text-base">{addressInfo?.name || 'N/A'}</div>
                                <div className="text-xs text-text-muted">{email}</div>
                                <div className="text-xs font-bold text-[#17700d]">{addressInfo?.phoneNumber}</div>
                            </div>

                            {/* Shipping Address */}
                            <div className="text-xs text-text-muted leading-relaxed space-y-1 pl-1">
                                <div className="font-bold text-text-base uppercase tracking-wider text-[10px]">Shipping to:</div>
                                <div>{addressInfo?.address}</div>
                                <div className="font-bold text-text-base">Pincode: {addressInfo?.pincode}</div>
                            </div>

                            {/* Ordered Items */}
                            <div className="space-y-2 pl-1">
                                <div className="font-bold text-text-base uppercase tracking-wider text-[10px]">Items:</div>
                                {isCustom ? (
                                    <div className="flex items-center gap-3 bg-gray-50/30 p-3 rounded-xl border border-border-base/50">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-border-base bg-white flex items-center justify-center p-1 shrink-0">
                                            <img className="w-full h-full object-contain" src={allorder.image} alt="custom" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-xs text-text-base">{allorder.itemInfo?.selectedDrawingType}</div>
                                            <div className="text-[10px] text-rose-600 font-bold mt-0.5">Custom: {allorder.itemInfo?.selectedSheetType}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {(allorder.items || []).map((item, itemIdx) => (
                                            <div key={itemIdx} className="flex items-center gap-3 bg-gray-50/30 p-2.5 rounded-xl border border-border-base/50">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-border-base bg-white flex items-center justify-center p-1 shrink-0">
                                                    <img className="w-full h-full object-contain" src={item.imageUrl} alt={item.title} />
                                                </div>
                                                <div className="leading-tight min-w-0">
                                                    <div className="font-bold text-xs text-text-base truncate">{item.title}</div>
                                                    <div className="text-[10px] text-text-muted mt-0.5">{item.category}</div>
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
                                    <span className="font-extrabold text-base text-text-base">₹{Number(totalAmount).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                                        paymentMode === 'Online Payment' 
                                        ? 'bg-emerald-50 text-[#17700d] border-emerald-100' 
                                        : 'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                        {paymentMode}
                                    </span>
                                    {paymentId && (
                                        <div className="text-[10px] text-text-muted mt-1 font-mono truncate max-w-[140px]">ID: {paymentId}</div>
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
                                const { addressInfo, email, paymentMode, paymentId, totalAmount, date, isCustom } = allorder;
                                return (
                                    <tr key={index} className="hover:bg-gray-50/20 transition-colors align-top">
                                        <td className="px-6 py-4 text-text-muted text-center hidden lg:table-cell">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-text-base">{addressInfo?.name || 'N/A'}</div>
                                            <div className="text-xs text-text-muted mt-0.5">{email}</div>
                                            <div className="text-xs font-bold text-[#17700d] mt-1">{addressInfo?.phoneNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 text-text-muted leading-relaxed">
                                            <div>{addressInfo?.address}</div>
                                            <div className="mt-1 font-bold text-xs text-text-base">Pincode: {addressInfo?.pincode}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isCustom ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-border-base bg-white flex items-center justify-center p-1 shrink-0">
                                                        <img className="w-full h-full object-contain" src={allorder.image} alt="custom" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-text-base">{allorder.itemInfo?.selectedDrawingType}</div>
                                                        <div className="text-xs text-rose-600 font-bold mt-0.5">Custom: {allorder.itemInfo?.selectedSheetType}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2.5">
                                                    {(allorder.items || []).map((item, itemIdx) => (
                                                        <div key={itemIdx} className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-border-base bg-white flex items-center justify-center p-1 shrink-0">
                                                                <img className="w-full h-full object-contain" src={item.imageUrl} alt={item.title} />
                                                            </div>
                                                            <div className="leading-tight">
                                                                <div className="font-bold text-text-base">{item.title}</div>
                                                                <div className="text-xs text-text-muted mt-0.5">{item.category}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-text-base">
                                            ₹{Number(totalAmount).toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                                                paymentMode === 'Online Payment' 
                                                ? 'bg-emerald-50 text-[#17700d] border-emerald-100' 
                                                : 'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                                {paymentMode}
                                            </span>
                                            {paymentId && (
                                                <div className="text-xs text-text-muted mt-1 font-mono break-all">ID: {paymentId}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-text-muted hidden xl:table-cell">
                                            {formatDate(date)}
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
