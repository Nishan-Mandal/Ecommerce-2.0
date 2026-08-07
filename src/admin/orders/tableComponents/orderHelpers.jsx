import React from "react";
import { FaCheckCircle, FaTruck, FaBoxOpen, FaClock, FaTimesCircle } from "react-icons/fa";

/**
 * Format variant details safely whether string or object
 */
export function formatVariantName(variant) {
    if (!variant) return "";
    if (typeof variant === "string") return variant;
    if (typeof variant === "object") {
        return Object.entries(variant)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" • ");
    }
    return String(variant);
}

/**
 * Format date & time into "Aug 2, 6:16 PM"
 */
export function formatTableDateTime(dateVal) {
    if (!dateVal) return "N/A";
    let dateObj = null;
    if (dateVal?.seconds !== undefined) {
        dateObj = new Date(dateVal.seconds * 1000);
    } else if (dateVal?.toDate && typeof dateVal.toDate === "function") {
        dateObj = dateVal.toDate();
    } else if (typeof dateVal === "number" || typeof dateVal === "string") {
        dateObj = new Date(dateVal);
    } else if (dateVal instanceof Date) {
        dateObj = dateVal;
    }

    if (!dateObj || isNaN(dateObj.getTime())) return "N/A";

    return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

/**
 * Format items summary e.g. "T-Shirt (+2)"
 */
export function formatItemsSummary(items, isCustom, itemInfo) {
    if (isCustom) {
        return itemInfo?.selectedDrawingType || "Custom Artwork";
    }
    if (!Array.isArray(items) || items.length === 0) return "No items";
    const firstTitle = items[0].productName || items[0].title || items[0].name || "Product Item";
    const extraCount = items.length - 1;
    if (extraCount > 0) {
        return `${firstTitle} (+${extraCount})`;
    }
    return firstTitle;
}

/**
 * Format dates safely
 */
export function safeFormatDate(dateVal, customFormatFn) {
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

/**
 * Normalize Order object structure
 */
export function normalizeOrder(allorder) {
    const sAddr = allorder.shippingAddress || {};
    const aInfo = allorder.addressInfo || {};

    const name = aInfo.name || aInfo.fullName || sAddr.fullName || allorder.userProfile?.name || 'N/A';
    const email =
        allorder.email ||
        allorder.userEmail ||
        allorder.customerEmail ||
        allorder.userProfile?.email ||
        aInfo.email ||
        aInfo.userEmail ||
        sAddr.email ||
        sAddr.userEmail ||
        allorder.user?.email ||
        allorder.userInfo?.email ||
        'N/A';
    const phone = aInfo.phoneNumber || aInfo.phone || sAddr.phone || allorder.userProfile?.phone || '';
    
    const streetAddress = aInfo.address || [sAddr.houseNo, sAddr.street, sAddr.landmark, sAddr.city, sAddr.state].filter(Boolean).join(', ') || 'N/A';
    const pincode = aInfo.pincode || sAddr.pincode || 'N/A';

    const rawAmount = allorder.totalAmount ?? allorder.pricing?.grandTotal ?? allorder.amount ?? 0;
    const totalAmount = typeof rawAmount === 'number' ? rawAmount : (parseFloat(rawAmount) || 0);

    const paymentMode = allorder.paymentMode || allorder.paymentInfo?.method || allorder.payment?.gateway || 'Online Payment';
    const paymentId = allorder.paymentId || allorder.payment?.paymentId || allorder.gatewayOrderId || allorder.orderId || '';

    const dateVal = allorder.date || allorder.createdAt;
    const rawStatus = (allorder.orderStatus || allorder.status || '').toUpperCase();
    const paymentStat = (allorder.paymentStatus || allorder.payment?.status || '').toUpperCase();

    let orderStatus = rawStatus;
    if (!orderStatus || orderStatus === 'PENDING') {
        if (paymentStat === 'PENDING' || paymentStat === 'FAILED' || orderStatus === 'PENDING') {
            orderStatus = 'PAYMENT_PENDING';
        } else {
            orderStatus = 'PLACED';
        }
    } else if (paymentStat === 'PENDING') {
        orderStatus = 'PAYMENT_PENDING';
    }

    const targetId = allorder.docId || allorder.id || allorder.orderId || paymentId;
    const displayId = allorder.orderId || allorder.docId || allorder.id || 'N/A';

    return {
        targetId,
        displayId,
        orderStatus,
        paymentStatus: paymentStat,
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

/**
 * Get distinct status badge style without background fill for maximum clarity
 */
export function getStatusBadge(status) {
    let s = (status || 'PLACED').toUpperCase().trim();
    if (s === 'ORDER PLACED' || s === 'ORDER_PLACED') s = 'PLACED';
    if (s === 'ORDER CANCELLED' || s === 'ORDER_CANCELLED') s = 'CANCELLED';
    if (s === 'ORDER DELIVERED' || s === 'ORDER_DELIVERED') s = 'DELIVERED';
    if (s === 'ORDER SHIPPED' || s === 'ORDER_SHIPPED') s = 'SHIPPED';

    switch (s) {
        case "DELIVERED":
            return {
                label: "Delivered",
                icon: <FaCheckCircle className="text-emerald-500" size={11} />,
                className: "bg-transparent text-emerald-600 dark:text-emerald-400 font-extrabold border border-emerald-500/30"
            };
        case "OUT_FOR_DELIVERY":
            return {
                label: "Out For Delivery",
                icon: <FaTruck className="text-amber-500" size={11} />,
                className: "bg-transparent text-amber-600 dark:text-amber-400 font-extrabold border border-amber-500/30"
            };
        case "SHIPPED":
        case "IN_TRANSIT":
            return {
                label: "Shipped",
                icon: <FaTruck className="text-sky-500" size={11} />,
                className: "bg-transparent text-sky-600 dark:text-sky-400 font-extrabold border border-sky-500/30"
            };
        case "PACKED":
            return {
                label: "Packed",
                icon: <FaBoxOpen className="text-purple-500" size={11} />,
                className: "bg-transparent text-purple-600 dark:text-purple-400 font-extrabold border border-purple-500/30"
            };
        case "CONFIRMED":
            return {
                label: "Confirmed",
                icon: <FaCheckCircle className="text-indigo-500" size={11} />,
                className: "bg-transparent text-indigo-600 dark:text-indigo-400 font-extrabold border border-indigo-500/30"
            };
        case "PLACED":
            return {
                label: "Placed",
                icon: <FaClock className="text-blue-500 animate-pulse" size={11} />,
                className: "bg-transparent text-blue-600 dark:text-blue-400 font-extrabold border border-blue-500/30"
            };
        case "PAYMENT_PENDING":
            return {
                label: "Payment Pending",
                icon: <FaClock className="text-amber-500 animate-pulse" size={11} />,
                className: "bg-transparent text-amber-600 dark:text-amber-400 font-extrabold border border-amber-500/30"
            };
        case "CANCELLED":
            return {
                label: "Cancelled",
                icon: <FaTimesCircle className="text-rose-500" size={11} />,
                className: "bg-transparent text-rose-600 dark:text-rose-400 font-extrabold border border-rose-500/30"
            };
        default:
            return {
                label: status.replace(/_/g, " "),
                icon: <FaClock className="text-slate-400" size={11} />,
                className: "bg-transparent text-text-muted font-extrabold border border-border-base"
            };
    }
}
