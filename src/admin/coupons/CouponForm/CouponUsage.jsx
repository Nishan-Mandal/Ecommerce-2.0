import React from "react";

function CouponUsage({
    coupon,
    setCoupon,
}) {
    return (
        <div className="bg-bg-base border border-border-base rounded-xl text-xs shadow-xs">

            {/* Header */}
            <div className="border-b border-border-base px-3 py-2">
                <h3 className="font-bold text-text-base">
                    Usage Limits
                </h3>
                <p className="text-[10px] text-text-muted mt-0.5">
                    Control how many times this coupon can be redeemed.
                </p>
            </div>

            {/* Body */}
            <div className="p-3">

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    {/* Usage Limit */}
                    <div>
                        <label className="block font-semibold mb-1">
                            Total Usage Limit
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={coupon.usageLimit}
                            onChange={(e) =>
                                setCoupon((prev) => ({
                                    ...prev,
                                    usageLimit: Number(e.target.value),
                                }))
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-border-base bg-bg-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                            placeholder="100"
                        />
                        <p className="text-[9px] text-text-muted mt-1">
                            Maximum redemptions.
                        </p>
                    </div>

                    {/* Usage Per User */}
                    <div>
                        <label className="block font-semibold mb-1">
                            Usage Per User
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={coupon.usagePerUser}
                            onChange={(e) =>
                                setCoupon((prev) => ({
                                    ...prev,
                                    usagePerUser: Number(e.target.value),
                                }))
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-border-base bg-bg-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                            placeholder="1"
                        />
                        <p className="text-[9px] text-text-muted mt-1">
                            Allowed uses per user.
                        </p>
                    </div>

                    {/* Current Usage */}
                    <div>
                        <label className="block font-semibold mb-1">
                            Current Usage
                        </label>
                        <input
                            type="number"
                            value={coupon.currentUsage}
                            disabled
                            className="w-full px-3 py-1.5 rounded-lg border border-border-base bg-bg-base text-text-muted cursor-not-allowed text-xs font-semibold"
                        />
                        <p className="text-[9px] text-text-muted mt-1">
                            Redemption counter.
                        </p>
                    </div>

                </div>

                {/* Summary Metrics */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-border-base bg-bg-surface p-2.5">
                        <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">
                            Total Limit
                        </p>
                        <h3 className="text-base font-bold mt-1 text-text-base">
                            {coupon.usageLimit}
                        </h3>
                    </div>

                    <div className="rounded-lg border border-border-base bg-bg-surface p-2.5">
                        <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">
                            Per User
                        </p>
                        <h3 className="text-base font-bold mt-1 text-text-base">
                            {coupon.usagePerUser}
                        </h3>
                    </div>

                    <div className="rounded-lg border border-border-base bg-bg-surface p-2.5">
                        <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">
                            Current
                        </p>
                        <h3 className="text-base font-bold mt-1 text-text-base">
                            {coupon.currentUsage}
                        </h3>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default CouponUsage;