import { FaExclamationTriangle } from "react-icons/fa";

function DeleteCoupon({
    open,
    coupon,
    deleting = false,
    onClose,
    onDelete,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="w-full max-w-sm bg-bg-surface border border-border-base rounded-xl shadow-lg text-xs overflow-hidden">

                {/* Header */}
                <div className="p-5 text-center">

                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                        <FaExclamationTriangle size={20} />
                    </div>

                    <h2 className="text-base font-bold mt-3">
                        Delete Coupon?
                    </h2>

                    <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
                        Are you sure you want to permanently delete
                        <span className="font-bold text-text-base">
                            {" "}
                            {coupon?.code}
                        </span>
                        ?
                        <br />
                        This action cannot be undone.
                    </p>

                </div>

                {/* Coupon Info */}
                {coupon && (
                    <div className="mx-4 mb-4 rounded-lg border border-border-base bg-bg-base p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-text-base">
                                    {coupon.code}
                                </h4>
                                <p className="text-[10px] text-text-muted mt-0.5">
                                    {coupon.type === "PERCENTAGE"
                                        ? `${coupon.discountValue}% OFF`
                                        : `₹${coupon.discountValue} OFF`}
                                </p>
                            </div>

                            <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    coupon.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {coupon.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="border-t border-border-base p-4 flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleting}
                        className="flex-1 py-1.5 rounded-lg border border-border-base bg-bg-base hover:bg-bg-base/70 transition font-semibold disabled:opacity-50 text-xs"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={deleting}
                        className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50 text-xs"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>

            </div>

        </div>
    );
}

export default DeleteCoupon;