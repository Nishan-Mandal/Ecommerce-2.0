import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import Breadcrumb from "../../../components/Common/BreadCumMenu";
import CouponBasicInfo from "./CouponBasicinfo";
import CouponConditions from "./CouponsCondition";
import CouponUsage from "./CouponUsage";
import CouponValidity from "./CouponValidity";
import CouponScope from "./CouponScope";
import CouponActions from "./CouponAction";

const initBlankCoupon = () => ({
    code: "",
    type: "PERCENTAGE",
    discountValue: 0,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    usageLimit: 100,
    usagePerUser: 1,
    currentUsage: 0,
    validFrom: "",
    validUntil: "",
    isActive: true,
    appliesTo: "ALL",
    applicableProducts: [],
    applicableCategories: [],
});

/**
 * CouponFormPage
 * Dedicated full-page form for creating or editing a coupon.
 * Receives existing coupon data via route state (navigate('/coupons/edit', { state: { coupon } })).
 * For new coupons, navigate('/coupons/add') — no state needed.
 */
function CouponFormPage({
    products = [],
    categories = [],
    onSave,
    saving = false,
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const existingCoupon = location.state?.coupon ?? null;
    const isEditing = Boolean(existingCoupon?.couponId);

    const [coupon, setCoupon] = useState(existingCoupon ?? initBlankCoupon());

    return (
        <div className="min-h-screen bg-bg-base text-xs">
            <div className="max-w-7xl mx-auto px- py-3  space-y-4">

                {/* Page Header */}
                <div className="space-y-1.5">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-text-base">
                                {isEditing ? `Edit: ${coupon.code}` : "Create Coupon"}
                            </h2>
                            <p className="text-xs text-text-muted mt-0.5">
                                {isEditing
                                    ? "Update the coupon configuration and conditions."
                                    : "Configure a new promotional discount coupon."}
                            </p>
                        </div>

                        {/* Status Badge */}
                        <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${coupon.isActive
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-gray-100 text-gray-600 border border-gray-200"
                                }`}
                        >
                            {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <CouponBasicInfo coupon={coupon} setCoupon={setCoupon} />
                    <CouponConditions coupon={coupon} setCoupon={setCoupon} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <CouponUsage coupon={coupon} setCoupon={setCoupon} />
                    <CouponValidity coupon={coupon} setCoupon={setCoupon} />
                </div>
                <CouponScope
                    coupon={coupon}
                    setCoupon={setCoupon}
                    products={products}
                    categories={categories}
                />

                {/* Actions */}
                <CouponActions
                    saving={saving}
                    onCancel={() => navigate("/coupons")}
                    onSave={() => onSave?.(coupon)}
                />

            </div>
        </div>
    );
}

export default CouponFormPage;