import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import CouponStats from "./sections/CouponsStats";
import CouponTable from "./sections/CouponTable";
import DeleteCoupon from "./sections/DeleteCoupon";
import { toast } from "react-toastify";
import Header from "../Components/Header";
import FilterBar from "../Components/FilterBar";
import { couponService } from "../../services/coupon/couponService";

function Coupons() {
    const navigate = useNavigate();

    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    const [coupons, setCoupons] = useState([]);

    const loadCoupons = async () => {
        setLoading(true);
        try {
            const data = await couponService.getCoupons();
            setCoupons(data);
        } catch (err) {
            console.error("Error loading coupons:", err);
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCoupons();
    }, []);

    const handleDeleteConfirm = async () => {
        if (!selectedCoupon?.couponId) return;
        setDeleting(true);
        try {
            await couponService.deleteCoupon(selectedCoupon.couponId);
            setCoupons((prev) => prev.filter((c) => c.couponId !== selectedCoupon.couponId));
            toast.success("Coupon deleted successfully");
        } catch (err) {
            console.error("Error deleting coupon:", err);
            toast.error("Failed to delete coupon");
        } finally {
            setDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    // Filter coupons logic based on state
    const filteredCoupons = coupons.filter((coupon) => {
        const searchLower = search.toLowerCase();
        const matchSearch =
            !search ||
            coupon.code?.toLowerCase().includes(searchLower) ||
            coupon.appliesTo?.toLowerCase().includes(searchLower);

        // Calculate active status matching CouponTable.jsx
        let status = "ACTIVE";
        if (!coupon.isActive) {
            status = "INACTIVE";
        } else if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
            status = "EXPIRED";
        }

        const matchStatus = statusFilter === "ALL" || status === statusFilter;
        const matchType = typeFilter === "ALL" || coupon.type === typeFilter;

        return matchSearch && matchStatus && matchType;
    });

    const filtersConfig = [
        {
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { value: "ALL", label: "All Status" },
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
                { value: "EXPIRED", label: "Expired" }
            ]
        },
        {
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
                { value: "ALL", label: "All Types" },
                { value: "PERCENTAGE", label: "Percentage" },
                { value: "FIXED", label: "Fixed Amount" }
            ]
        }
    ];

    return (
        <div className="space-y-6 lg:space-y-4">
            {/* Header Action Row */}
            <Header
                title="Promotional Campaigns"
                description="Create, monitor, and configure promotional campaigns, discounts, and customer incentives."
                icon={<FaPlus size={20} />}
                buttonText="Create Coupon"
                clickhandler={() => navigate("/coupons/add")}
            />

            {/* Stats */}
            <CouponStats coupons={coupons} />

            {/* Filters */}
            <FilterBar
                search={search}
                setSearch={setSearch}
                searchPlaceholder="Search by coupon code..."
                filters={filtersConfig}
            />

            {/* Table */}
            <div className="w-full">
                {loading ? (
                    <div className="p-8 text-center text-text-muted text-xs font-bold">Loading promotional coupons...</div>
                ) : (
                    <CouponTable
                        coupons={filteredCoupons}
                        onEdit={(coupon) => navigate("/coupons/edit", { state: { coupon } })}
                        onDelete={(coupon) => {
                            setSelectedCoupon(coupon);
                            setIsDeleteModalOpen(true);
                        }}
                    />
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteCoupon
                open={isDeleteModalOpen}
                coupon={selectedCoupon}
                deleting={deleting}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleDeleteConfirm}
            />
        </div>
    );
}

export default Coupons;