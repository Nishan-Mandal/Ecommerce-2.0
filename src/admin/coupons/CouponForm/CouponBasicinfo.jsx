import { FaRandom } from "react-icons/fa";

function CouponBasicInfo({
    coupon,
    setCoupon,
}) {
    const generateCouponCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(
                Math.floor(Math.random() * chars.length)
            );
        }
        setCoupon((prev) => ({
            ...prev,
            code,
        }));
    };

    return (
        <div className="bg-bg-base border border-border-base rounded-xl text-xs shadow-xs">

            {/* Header */}
            <div className="border-b border-border-base px-3 py-2">
                <h3 className="font-bold text-text-base">
                    Basic Information
                </h3>
                <p className="text-[10px] text-text-muted mt-0.5">
                    Configure the coupon code and discount type.
                </p>
            </div>

            {/* Body */}
            <div className="p-3 space-y-3">

                {/* Coupon Code */}
                <div>
                    <label className="block font-semibold mb-1">
                        Coupon Code
                    </label>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={coupon.code}
                            onChange={(e) =>
                                setCoupon((prev) => ({
                                    ...prev,
                                    code: e.target.value.toUpperCase(),
                                }))
                            }
                            placeholder="SAVE20"
                            className="flex-1 px-3 py-1.5 rounded-lg border border-border-base bg-bg-surface focus:outline-none focus:ring-1 focus:ring-primary uppercase text-xs"
                        />

                        <button
                            type="button"
                            onClick={generateCouponCode}
                            className="px-3 rounded-lg bg-primary text-compli hover:bg-primary-hover flex items-center gap-1.5 font-semibold text-xs transition shadow-sm"
                        >
                            <FaRandom className="text-[10px]" />
                            Generate
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {/* Discount Type */}
                    <div>
                        <label className="block font-semibold mb-1">
                            Discount Type
                        </label>
                        <select
                            value={coupon.type}
                            onChange={(e) =>
                                setCoupon((prev) => ({
                                    ...prev,
                                    type: e.target.value,
                                }))
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-border-base bg-bg-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs cursor-pointer"
                        >
                            <option value="PERCENTAGE">Percentage</option>
                            <option value="FIXED">Fixed Amount</option>
                        </select>
                    </div>

                    {/* Discount Value */}
                    <div>
                        <label className="block font-semibold mb-1">
                            Discount Value
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">
                                {coupon.type === "PERCENTAGE" ? "%" : "₹"}
                            </span>
                            <input
                                type="text"
                                value={coupon.discountValue}
                                onChange={(e) =>
                                    setCoupon((prev) => ({
                                        ...prev,
                                        discountValue: Number(e.target.value),
                                    }))
                                }
                                className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-border-base bg-bg-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                            />
                        </div>
                    </div>

                </div>

                {/* Active / Inactive Status Toggle */}
                <div className="pt-2.5 border-t border-border-base/70 flex items-center justify-between mt-2">
                    <div>
                        <label className="block font-bold text-text-base">
                            Coupon Status
                        </label>
                        <p className="text-[10px] text-text-muted mt-0.5">
                            Active coupons can be applied at checkout. Inactive coupons are disabled.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setCoupon((prev) => ({ ...prev, isActive: !(prev.isActive !== false) }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border inline-flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                            coupon.isActive !== false
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                        title={coupon.isActive !== false ? "Click to set Inactive" : "Click to set Active"}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${coupon.isActive !== false ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                        <span>{coupon.isActive !== false ? "Active" : "Inactive"}</span>
                    </button>
                </div>

            </div>

        </div>
    );
}

export default CouponBasicInfo;