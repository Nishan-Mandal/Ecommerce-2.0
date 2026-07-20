import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function CouponTable({
    coupons = [],
    onEdit,
    onDelete,
}) {
    const getStatus = (coupon) => {
        if (!coupon.isActive)
            return {
                label: "Inactive",
                className: "bg-gray-100 text-gray-700 border-gray-200/50",
            };

        if (
            coupon.validUntil &&
            new Date(coupon.validUntil) < new Date()
        ) {
            return {
                label: "Expired",
                className: "bg-red-50 text-red-700 border-red-100",
            };
        }

        return {
            label: "Active",
            className: "bg-emerald-50 text-[#17700d] border-emerald-100",
        };
    };

    return (
        <div className="w-full">
            {/* Mobile Cards (Visible only on mobile) */}
            <div className="block md:hidden space-y-4">
                {coupons.map((coupon) => {
                    const status = getStatus(coupon);
                    return (
                        <div key={coupon.couponId} className="bg-white p-6 rounded-2xl border border-border-base shadow-xs space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-text-base bg-emerald-50/50 px-2.5 py-1 rounded-lg border border-emerald-100/50 text-[#17700d]">
                                    {coupon.code}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.className}`}>
                                    {status.label}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-xl text-xs">
                                <div>
                                    <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Discount</span>
                                    <span className="font-bold text-text-base text-sm mt-0.5 block">
                                        {coupon.type === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Min Order</span>
                                    <span className="font-bold text-text-base text-sm mt-0.5 block">₹{coupon.minimumOrderAmount}</span>
                                </div>
                                <div className="mt-2">
                                    <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Usage</span>
                                    <span className="font-bold text-text-base mt-0.5 block">{coupon.currentUsage} / {coupon.usageLimit}</span>
                                </div>
                                <div className="mt-2">
                                    <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Applies To</span>
                                    <span className="font-bold text-text-base mt-0.5 block truncate">{coupon.appliesTo}</span>
                                </div>
                            </div>

                            <div className="text-xs text-text-muted flex justify-between gap-2 pl-1">
                                <div>From: <span className="font-semibold text-text-base">{coupon.validFrom ? new Date(coupon.validFrom).toLocaleDateString() : "--"}</span></div>
                                <div>Until: <span className="font-semibold text-text-base">{coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : "--"}</span></div>
                            </div>

                            <div className="border-t border-border-base my-2"></div>

                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => onEdit(coupon)} 
                                    className="flex-1 h-11 flex items-center justify-center gap-2 text-[#17700d] bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-xl text-sm font-bold transition duration-150 cursor-pointer"
                                >
                                    <FaEdit size={14} />
                                    <span>Edit</span>
                                </button>
                                <button 
                                    onClick={() => onDelete(coupon)} 
                                    className="flex-1 h-11 flex items-center justify-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-xl text-sm font-bold transition duration-150 cursor-pointer"
                                >
                                    <FaTrash size={12} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
                {coupons.length === 0 && (
                    <div className="bg-white p-8 text-center text-text-muted rounded-2xl border border-border-base shadow-xs">
                        No Coupons Found
                    </div>
                )}
            </div>

            {/* Desktop/Tablet Table (Hidden on mobile) */}
            <div className="hidden md:block bg-white border border-border-base rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-base bg-gray-50/50 text-text-muted text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Coupon</th>
                                <th className="px-6 py-4">Discount</th>
                                <th className="px-6 py-4 hidden lg:table-cell">Min Order</th>
                                <th className="px-6 py-4">Usage</th>
                                <th className="px-6 py-4">Validity</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border-base text-sm text-text-base">
                            {coupons.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-text-muted"
                                    >
                                        No Coupons Found
                                    </td>
                                </tr>
                            )}

                            {coupons.map((coupon) => {
                                const status = getStatus(coupon);
                                return (
                                    <tr
                                        key={coupon.couponId}
                                        className="hover:bg-gray-50/20 transition-colors"
                                    >
                                        {/* Coupon */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-text-base">
                                                    {coupon.code}
                                                </p>
                                                <p className="text-xs text-text-muted mt-1">
                                                    Applies to: {coupon.appliesTo}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Discount */}
                                        <td className="px-6 py-4 font-bold">
                                            {coupon.type === "PERCENTAGE"
                                                ? `${coupon.discountValue}% OFF`
                                                : `₹${coupon.discountValue} OFF`}
                                        </td>

                                        {/* Minimum */}
                                        <td className="px-6 py-4 text-text-muted hidden lg:table-cell">
                                            ₹{coupon.minimumOrderAmount}
                                        </td>

                                        {/* Usage */}
                                        <td className="px-6 py-4 text-text-muted font-medium">
                                            {coupon.currentUsage} / {coupon.usageLimit}
                                        </td>

                                        {/* Validity */}
                                        <td className="px-6 py-4">
                                            <div className="text-xs space-y-0.5">
                                                <div>
                                                    From: <span className="font-semibold text-text-base">{coupon.validFrom ? new Date(coupon.validFrom).toLocaleDateString() : "--"}</span>
                                                </div>
                                                <div className="text-text-muted">
                                                    Until: <span className="font-semibold text-text-base">{coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : "--"}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${status.className}`}
                                            >
                                                {status.label}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => onEdit(coupon)}
                                                    className="w-9 h-9 flex items-center justify-center text-[#17700d] hover:bg-emerald-50 rounded-xl transition duration-150 cursor-pointer"
                                                    title="Edit Coupon"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(coupon)}
                                                    className="w-9 h-9 flex items-center justify-center text-rose-600 hover:bg-rose-50 rounded-xl transition duration-150 cursor-pointer"
                                                    title="Delete Coupon"
                                                    type="button"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CouponTable;