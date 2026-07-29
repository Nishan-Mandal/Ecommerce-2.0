import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../../firebase/FirebaseConfig";
import { couponService } from "../../../services/coupon/couponService";
import { toast } from "react-toastify";

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
 * Fetches product catalog and categories dynamically for CouponScope.
 */
function CouponFormPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const existingCoupon = location.state?.coupon ?? null;
    const isEditing = Boolean(existingCoupon?.couponId || existingCoupon?.id);

    const [coupon, setCoupon] = useState(existingCoupon ?? initBlankCoupon());
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getDocs(collection(fireDB, "products"))
            .then((snap) => {
                const fetchedProds = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setProducts(fetchedProds);

                const uniqueCats = Array.from(
                    new Set(fetchedProds.map((p) => p.category).filter(Boolean))
                );
                setCategories(uniqueCats);
            })
            .catch((err) => {
                console.error("Error loading products for scope:", err);
            });
    }, []);

    const handleSave = async () => {
        // Form Validation
        const code = (coupon.code || "").trim();
        if (!code) {
            toast.error("Please enter a valid coupon code");
            return;
        }

        const discVal = Number(coupon.discountValue);
        if (isNaN(discVal) || discVal <= 0) {
            toast.error("Discount value must be greater than 0");
            return;
        }

        if (coupon.type === "PERCENTAGE" && discVal > 100) {
            toast.error("Percentage discount cannot exceed 100%");
            return;
        }

        if (coupon.appliesTo === "PRODUCT" && (!coupon.applicableProducts || coupon.applicableProducts.length === 0)) {
            toast.error("Please select at least one applicable product");
            return;
        }

        if (coupon.appliesTo === "CATEGORY" && (!coupon.applicableCategories || coupon.applicableCategories.length === 0)) {
            toast.error("Please select at least one applicable category");
            return;
        }

        if (coupon.validFrom && coupon.validUntil && new Date(coupon.validUntil) < new Date(coupon.validFrom)) {
            toast.error("Valid Until date must be after Valid From date");
            return;
        }

        setSaving(true);
        try {
            if (isEditing) {
                const targetId = coupon.couponId || coupon.id;
                await couponService.updateCoupon(targetId, coupon);
                toast.success("Coupon updated successfully");
            } else {
                await couponService.addCoupon(coupon);
                toast.success("Coupon created successfully");
            }
            navigate("/coupons");
        } catch (err) {
            console.error("Error saving coupon:", err);
            toast.error(err.message || "Failed to save coupon");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-base text-xs py-4">
            <div className="max-w-7xl mx-auto px-4 space-y-4">

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
                    onSave={handleSave}
                />

            </div>
        </div>
    );
}

export default CouponFormPage;