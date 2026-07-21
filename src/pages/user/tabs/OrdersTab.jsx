import React from "react";
import { FaShoppingBag } from "react-icons/fa";

const STATUS_STYLES = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
    Delivered: "bg-blue-100 text-blue-700",
    Processing: "bg-purple-100 text-purple-700",
};

function getStatusStyle(status) {
    if (!status) return STATUS_STYLES["Paid"];
    const key = Object.keys(STATUS_STYLES).find(
        (k) => k.toLowerCase() === status.toLowerCase()
    );
    return key ? STATUS_STYLES[key] : "bg-gray-100 text-gray-600";
}

function EmptyOrders() {
    return (
        <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div className="w-16 h-16 rounded-full bg-bg-base border border-border-base flex items-center justify-center">
                <FaShoppingBag className="text-2xl text-text-muted/40" />
            </div>
            <p className="text-sm font-semibold text-text-muted">No orders yet</p>
            <p className="text-[10px] text-text-muted/60 text-center max-w-[180px]">
                When you place an order, it will appear here.
            </p>
        </div>
    );
}

function OrderCard({ o }) {
    return (
        <div className="rounded-xl border border-border-base bg-bg-base overflow-hidden">
            {/* Card Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-bg-surface border-b border-border-base/50">
                <span className="font-mono text-[10px] font-bold text-primary truncate max-w-[160px]">
                    {o.paymentId || "COD-ORDER"}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getStatusStyle(o.status || "Paid")}`}>
                    {o.status || "Paid"}
                </span>
            </div>

            {/* Card Body */}
            <div className="px-3.5 py-3 space-y-2.5">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                        <p className="text-[9px] text-text-muted uppercase font-semibold tracking-wide mb-0.5">Date</p>
                        <p className="text-[11px] font-semibold text-text-base">{o.date || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-text-muted uppercase font-semibold tracking-wide mb-0.5">Payment</p>
                        <p className="text-[11px] font-semibold text-text-base uppercase">{o.paymentInfo?.method || "COD"}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border-base/40">
                    <p className="text-[10px] text-text-muted font-semibold">Total Amount</p>
                    <p className="text-sm font-bold text-text-base">₹{Number(o.totalAmount || 0).toLocaleString("en-IN")}</p>
                </div>
            </div>
        </div>
    );
}

export default function OrdersTab({ orders }) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-text-base">Your Orders</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
                </div>
            </div>

            <div className="h-px bg-border-base/60" />

            {orders.length === 0 ? (
                <EmptyOrders />
            ) : (
                <>
                    {/* Mobile View — Card Stack */}
                    <div className="space-y-3 md:hidden">
                        {orders.map((o, idx) => (
                            <OrderCard key={o.orderId || idx} o={o} />
                        ))}
                    </div>

                    {/* Desktop View — Table */}
                    <div className="hidden md:block overflow-x-auto rounded-xl border border-border-base">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-bg-base border-b border-border-base">
                                    <th className="px-4 py-3 text-[10px] text-text-muted uppercase font-bold tracking-wider">Order ID</th>
                                    <th className="px-4 py-3 text-[10px] text-text-muted uppercase font-bold tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-[10px] text-text-muted uppercase font-bold tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-[10px] text-text-muted uppercase font-bold tracking-wider">Payment</th>
                                    <th className="px-4 py-3 text-[10px] text-text-muted uppercase font-bold tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-base/50">
                                {orders.map((o, idx) => (
                                    <tr key={o.orderId || idx} className="hover:bg-bg-base/50 transition-colors">
                                        <td className="px-4 py-3 font-mono font-bold text-[10px] text-primary max-w-[140px] truncate">
                                            {o.paymentId || "COD-ORDER"}
                                        </td>
                                        <td className="px-4 py-3 text-text-muted">{o.date || "N/A"}</td>
                                        <td className="px-4 py-3 font-bold text-text-base">
                                            ₹{Number(o.totalAmount || 0).toLocaleString("en-IN")}
                                        </td>
                                        <td className="px-4 py-3 uppercase font-bold text-text-muted text-[10px]">
                                            {o.paymentInfo?.method || "COD"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getStatusStyle(o.status || "Paid")}`}>
                                                {o.status || "Paid"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
