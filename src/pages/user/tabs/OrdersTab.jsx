import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";

const STATUS_STYLES = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
    Delivered: "bg-blue-100 text-blue-700",
    Processing: "bg-purple-100 text-purple-700",
};

function formatDate(dateVal) {
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

function getOrderItems(o) {
    if (Array.isArray(o.products) && o.products.length > 0) return o.products;
    if (Array.isArray(o.items) && o.items.length > 0) return o.items;
    if (Array.isArray(o.cart) && o.cart.length > 0) return o.cart;
    return [];
}

function OrderCard({ o }) {
    const items = getOrderItems(o);
    return (
        <div className="rounded-xl border border-border-base bg-bg-base overflow-hidden shadow-sm">
            {/* Card Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-bg-surface border-b border-border-base/50">
                <span className="font-mono text-[10px] font-bold text-primary truncate max-w-[160px]">
                    {o.orderId || o.paymentId || "COD-ORDER"}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getStatusStyle(o.status || o.orderStatus || "Paid")}`}>
                    {o.status || o.orderStatus || "Paid"}
                </span>
            </div>

            {/* Products List */}
            <div className="px-3.5 py-3 space-y-3">
                {items.length > 0 ? (
                    items.map((item, i) => {
                        const img = item.productImage || item.imageUrl || item.images?.[0] || "https://via.placeholder.com/100";
                        const title = item.productName || item.title || item.name || "Product Item";
                        const qty = Number(item.quantity || item.qty || 1) || 1;
                        let price = Number(
                          item.price ??
                          item.sellingPrice ??
                          item.unitPrice ??
                          item.offerPrice ??
                          item.discountPrice ??
                          item.salePrice ??
                          item.finalPrice ??
                          item.productPrice ??
                          item.priceAtPurchase ??
                          item.selectedVariant?.price ??
                          0
                        );
                        let itemTotal = Number(item.totalPrice ?? item.total ?? item.amount ?? (price * qty));

                        if (!price && itemTotal) {
                          price = itemTotal / qty;
                        } else if (!price && (item.originalPrice || item.mrp)) {
                          price = Number(item.originalPrice || item.mrp);
                          itemTotal = price * qty;
                        } else if (!itemTotal && price) {
                          itemTotal = price * qty;
                        }

                        const variant = item.variantName || (item.options ? Object.values(item.options).filter(Boolean).join(" / ") : "");
                        const pid = item.productId || item.id || "";

                        const itemContent = (
                            <div className="flex items-center gap-3 group/item cursor-pointer hover:bg-bg-surface p-1.5 rounded-lg transition-colors">
                                <img src={img} alt={title} className="w-12 h-12 rounded-lg object-cover border border-border-base/60 shrink-0 group-hover/item:border-primary/40 transition-colors" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-text-base truncate group-hover/item:text-primary transition-colors">{title}</p>
                                    {variant && <p className="text-[10px] text-text-muted">{variant}</p>}
                                    <p className="text-[10px] text-text-muted">Qty: {qty}</p>
                                </div>
                                <p className="text-xs font-bold text-text-base shrink-0">₹{price.toLocaleString("en-IN")}</p>
                            </div>
                        );

                        if (pid) {
                            return (
                                <Link key={i} to={`/productdetails/${pid}`} title="View Product Details">
                                    {itemContent}
                                </Link>
                            );
                        }

                        return <div key={i}>{itemContent}</div>;
                    })
                ) : (
                    <p className="text-xs text-text-muted">No item details available</p>
                )}

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-border-base/40">
                    <div>
                        <p className="text-[9px] text-text-muted uppercase font-semibold tracking-wide mb-0.5">Date</p>
                        <p className="text-[11px] font-semibold text-text-base">{formatDate(o.date || o.createdAt)}</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-text-muted uppercase font-semibold tracking-wide mb-0.5">Payment</p>
                        <p className="text-[11px] font-semibold text-text-base uppercase">{o.paymentMode || o.paymentInfo?.method || o.payment?.gateway || "COD"}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border-base/40">
                    <p className="text-[10px] text-text-muted font-semibold">Total Amount</p>
                    <p className="text-sm font-bold text-text-base">₹{Number(o.totalAmount || o.pricing?.grandTotal || 0).toLocaleString("en-IN")}</p>
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
                            <OrderCard key={o.orderId || o.paymentId || idx} o={o} />
                        ))}
                    </div>

                    {/* Desktop View — Table */}
                    <div className="hidden md:block overflow-x-auto rounded-xl border border-border-base">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-bg-base border-b border-border-base">
                                    <th className="px-4 py-3 text-[10px] text-text-muted uppercase font-bold tracking-wider">Order ID</th>
                                    <th className="px-4 py-3 text-[10px] text-text-muted uppercase font-bold tracking-wider">Items</th>
                                    <th className="px-4 py-3 text-[10px] text-text-muted uppercase font-bold tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-[10px] text-text-muted uppercase font-bold tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-[10px] text-text-muted uppercase font-bold tracking-wider">Payment</th>
                                    <th className="px-4 py-3 text-[10px] text-text-muted uppercase font-bold tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-base/50">
                                {orders.map((o, idx) => {
                                    const items = getOrderItems(o);
                                    return (
                                        <tr key={o.orderId || o.paymentId || idx} className="hover:bg-bg-base/50 transition-colors">
                                            <td className="px-4 py-3 font-mono font-bold text-[10px] text-primary max-w-[140px] truncate">
                                                {o.orderId || o.paymentId || "COD-ORDER"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="space-y-2 max-w-[260px]">
                                                    {items.map((item, i) => {
                                                        const img = item.productImage || item.imageUrl || item.images?.[0] || "https://via.placeholder.com/100";
                                                        const title = item.productName || item.title || item.name || "Product Item";
                                                        const qty = item.quantity || 1;
                                                        const variant = item.variantName || (item.options ? Object.values(item.options).filter(Boolean).join(" / ") : "");
                                                        const pid = item.productId || item.id || "";

                                                        const itemContent = (
                                                            <div className="flex items-center gap-2 group/item cursor-pointer hover:bg-bg-base/70 p-1 rounded-md transition-colors">
                                                                <img src={img} alt={title} className="w-8 h-8 rounded-md object-cover border border-border-base/60 shrink-0 group-hover/item:border-primary/40 transition-colors" />
                                                                <div className="min-w-0">
                                                                    <p className="text-[11px] font-semibold text-text-base truncate group-hover/item:text-primary transition-colors">{title}</p>
                                                                    <p className="text-[9px] text-text-muted">
                                                                        Qty: {qty} {variant && `• ${variant}`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );

                                                        if (pid) {
                                                            return (
                                                                <Link key={i} to={`/productdetails/${pid}`} title="View Product Details">
                                                                    {itemContent}
                                                                </Link>
                                                            );
                                                        }

                                                        return <div key={i}>{itemContent}</div>;
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-text-muted">{formatDate(o.date || o.createdAt)}</td>
                                            <td className="px-4 py-3 font-bold text-text-base">
                                                ₹{Number(o.totalAmount || o.pricing?.grandTotal || 0).toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-4 py-3 uppercase font-bold text-text-muted text-[10px]">
                                                {o.paymentMode || o.paymentInfo?.method || o.payment?.gateway || "COD"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getStatusStyle(o.status || o.orderStatus || "Paid")}`}>
                                                    {o.status || o.orderStatus || "Paid"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
