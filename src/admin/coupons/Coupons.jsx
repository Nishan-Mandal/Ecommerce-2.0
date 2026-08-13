import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import CouponStats from "./sections/CouponsStats";
import CouponTable from "./sections/CouponTable";
import DeleteCoupon from "./sections/DeleteCoupon";
import { toast } from "react-toastify";
import Header from "../Components/Header";
import FilterBar from "../Components/FilterBar";
import { couponService } from "../../services/coupon/couponService";
import useCouponsQuery from "../../hooks/coupon/useCouponsQuery";

function Coupons() {
    const navigate = useNavigate();

    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    // TanStack Query hook for coupons
    const { coupons, isLoading: loading, invalidate } = useCouponsQuery();

    const handleToggleStatus = async (couponToToggle) => {
        if (!couponToToggle) return;
        const targetId = couponToToggle.couponId || couponToToggle.id;
        if (!targetId) return;

        const newStatus = !(couponToToggle.isActive !== false);

        try {
            await couponService.toggleCouponStatus(targetId, newStatus);
            toast.success(`Coupon "${couponToToggle.code}" marked as ${newStatus ? 'Active' : 'Inactive'}!`);
            invalidate();
        } catch (err) {
            console.error("Failed to toggle coupon status:", err);
            toast.error("Failed to update status");
        }
    };

    const handleDeleteClick = (coupon) => {
        setSelectedCoupon(coupon);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedCoupon) return;
        setDeleting(true);

        const targetId = selectedCoupon.couponId || selectedCoupon.id;

        try {
            await couponService.deleteCoupon(targetId);
            toast.success("Coupon deleted successfully!");
            setIsDeleteModalOpen(false);
            setSelectedCoupon(null);
            invalidate();
        } catch (err) {
            console.error("Error deleting coupon:", err);
            toast.error("Failed to delete coupon");
        } finally {
            setDeleting(false);
        }
    };

    const filteredCoupons = coupons.filter((coupon) => {
        const searchLower = search.toLowerCase();
        const matchesSearch =
            !search ||
            coupon.code?.toLowerCase().includes(searchLower) ||
            coupon.appliesTo?.toLowerCase().includes(searchLower);

        const matchesStatus =
            statusFilter === "ALL" ||
            (statusFilter === "ACTIVE" && coupon.isActive !== false) ||
            (statusFilter === "INACTIVE" && coupon.isActive === false);

        const matchesType =
            typeFilter === "ALL" || coupon.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const filterConfig = [
        {
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { value: "ALL", label: "All Status" },
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
            ],
        },
        {
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
                { value: "ALL", label: "All Types" },
                { value: "PERCENTAGE", label: "Percentage" },
                { value: "FIXED", label: "Fixed Amount" },
            ],
        },
    ];

    return (
        <div className="space-y-6 lg:space-y-5 px-4 md:px-0">
            <Header
                title="Coupon & Discount Management"
                description="Create promo codes, manage usage caps, set discount values, and monitor active campaigns."
                icon={<FaPlus size={14} />}
                buttonText="Add Coupon"
                clickhandler={() => navigate("/coupons/add")}
            />

            <CouponStats coupons={coupons} />

            <FilterBar
                search={search}
                setSearch={setSearch}
                searchPlaceholder="Search coupons by promo code, target item..."
                filters={filterConfig}
            />

            <CouponTable
                coupons={filteredCoupons}
                loading={loading}
                onEdit={(coupon) =>
                    navigate(`/coupons/edit/${coupon.couponId || coupon.id}`, {
                        state: { coupon },
                    })
                }
                onDelete={handleDeleteClick}
                onToggleStatus={handleToggleStatus}
            />

            <DeleteCoupon
                open={isDeleteModalOpen}
                coupon={selectedCoupon}
                deleting={deleting}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedCoupon(null);
                }}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}

export default Coupons;