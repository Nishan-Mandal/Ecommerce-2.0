import React from "react";

function CouponValidity({
    coupon,
    setCoupon,
}) {
    const isExpired =
        coupon.validUntil &&
        new Date(coupon.validUntil) < new Date();

    return (
        <div className="bg-bg-base border border-border-base rounded-xl text-xs shadow-xs">

            {/* Header */}
            <div className="border-b border-border-base px-3 py-2">
                <h3 className="font-bold text-text-base">
                    Validity
                </h3>
                <p className="text-[10px] text-text-muted mt-0.5">
                    Configure when this coupon becomes available and when it expires.
                </p>
            </div>

            {/* Body */}
            <div className="p-3 space-y-3">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {/* Valid From */}
                    <div>
                        <label className="block font-semibold mb-1">
                            Valid From
                        </label>
                        <input
                            type="datetime-local"
                            value={coupon.validFrom || ""}
                            onChange={(e) =>
                                setCoupon((prev) => ({
                                    ...prev,
                                    validFrom: e.target.value,
                                }))
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-border-base bg-bg-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                        />
                    </div>

                    {/* Valid Until */}
                    <div>
                        <label className="block font-semibold mb-1">
                            Valid Until
                        </label>
                        <input
                            type="datetime-local"
                            value={coupon.validUntil || ""}
                            onChange={(e) =>
                                setCoupon((prev) => ({
                                    ...prev,
                                    validUntil: e.target.value,
                                }))
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-border-base bg-bg-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                        />
                    </div>

                </div>

                {/* Summary Row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-border-base bg-bg-surface p-2.5">
                        <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Starts</p>
                        <h4 className="font-semibold mt-1 break-words text-[10px]">
                            {coupon.validFrom
                                ? new Date(coupon.validFrom).toLocaleDateString()
                                : "--"}
                        </h4>
                    </div>

                    <div className="rounded-lg border border-border-base bg-bg-surface p-2.5">
                        <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Ends</p>
                        <h4 className="font-semibold mt-1 break-words text-[10px]">
                            {coupon.validUntil
                                ? new Date(coupon.validUntil).toLocaleDateString()
                                : "--"}
                        </h4>
                    </div>

                    <div className="rounded-lg border border-border-base bg-bg-surface p-2.5 flex flex-col justify-between">
                        <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Status</p>
                        <span
                            className={`inline-flex mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-center justify-center uppercase ${
                                !coupon.isActive
                                    ? "bg-gray-100 text-gray-700"
                                    : isExpired
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                            }`}
                        >
                            {!coupon.isActive ? "Inactive" : isExpired ? "Expired" : "Active"}
                        </span>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default CouponValidity;