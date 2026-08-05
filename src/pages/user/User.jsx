import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/auth/useAuth";
import { userService } from "../../services/user/userService";
import { orderService } from "../../services/order/orderService";
import {
    FaUser, FaMapMarkerAlt, FaShoppingBag, FaWallet,
    FaSpinner, FaShieldAlt, FaChevronRight
} from "react-icons/fa";
import ProfileTab from "./tabs/ProfileTab";
import AddressTab from "./tabs/AddressTab";
import OrdersTab from "./tabs/OrdersTab";

const MENU_ITEMS = [
    { id: "profile", label: "Profile Information", shortLabel: "Profile", icon: <FaUser size={14} /> },
    { id: "address", label: "Manage Addresses", shortLabel: "Addresses", icon: <FaMapMarkerAlt size={14} /> },
    { id: "orders", label: "My Orders", shortLabel: "Orders", icon: <FaShoppingBag size={14} /> },
];

function getInitials(name, email) {
    const target = (name && name.trim()) || email || "";
    if (!target) return "U";
    const parts = target.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return target.slice(0, 2).toUpperCase();
}

function User() {
    const { user } = useAuth();
    const location = useLocation();
    const queryTab = new URLSearchParams(location.search).get("tab");
    const initialTab = location.state?.tab || queryTab || "profile";
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const tab = location.state?.tab || new URLSearchParams(location.search).get("tab");
        if (tab && (tab === "profile" || tab === "address" || tab === "orders")) {
            setActiveTab(tab);
        }
    }, [location]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [orders, setOrders] = useState([]);

    // Profile State
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        role: "USER",
        emailVerified: false,
        phoneVerified: false,
        address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
        },
    });

    const uid = user?.user?.uid;

    useEffect(() => {
        if (!uid) {
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const userData = await userService.getUserProfile(uid);
                if (userData) {
                    setProfile({
                        name: userData.name || user?.user?.displayName || "",
                        email: userData.email || user?.user?.email || "",
                        phone: userData.phone || user?.user?.phoneNumber || "",
                        role: userData.role || "USER",
                        emailVerified: user?.user?.emailVerified || false,
                        phoneVerified: userData.phoneVerified || false,
                        address: {
                            street: userData.address?.street || "",
                            city: userData.address?.city || "",
                            state: userData.address?.state || "",
                            pincode: userData.address?.pincode || "",
                            country: userData.address?.country || "India",
                        },
                    });
                } else {
                    setProfile((prev) => ({
                        ...prev,
                        name: user?.user?.displayName || "",
                        email: user?.user?.email || "",
                        phone: user?.user?.phoneNumber || "",
                        emailVerified: user?.user?.emailVerified || false,
                    }));
                }
                const userOrders = await orderService.getOrdersByUser(uid, user?.user?.email);
                setOrders(userOrders || []);
            } catch (err) {
                console.error("Failed to load user profile/orders", err);
                toast.error("Failed to load profile details");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [uid, user]);

    const handleSaveProfile = async () => {
        if (!uid) return;
        setSaving(true);
        try {
            await userService.updateUserProfile(uid, profile);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile", err);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleAddressChange = (field, value) => {
        setProfile((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: value,
            },
        }));
    };

    const validOrders = orders.filter((o) => {
        const status = (o.orderStatus || o.status || '').toUpperCase();
        const paymentStat = (o.paymentStatus || o.payment?.status || '').toUpperCase();
        return status !== 'CANCELLED' && status !== 'REFUNDED' && status !== 'PAYMENT_FAILED' && paymentStat !== 'FAILED';
    });

    const totalSpent = validOrders.reduce((acc, o) => {
        const raw = o.totalAmount ?? o.pricing?.grandTotal ?? o.amount ?? o.total ?? 0;
        const amt = typeof raw === 'number' ? (isNaN(raw) ? 0 : raw) : (parseFloat(String(raw).replace(/[^0-9.]/g, '')) || 0);
        return acc + amt;
    }, 0);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-base text-text-muted text-xs">
                <div className="flex flex-col items-center gap-3">
                    <FaSpinner className="animate-spin text-2xl text-primary" />
                    <span className="font-semibold tracking-wide">Loading your profile...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-base py-4 sm:py-6 px-3 sm:px-5 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* ─── DESKTOP LAYOUT ─────────────────────────────────────────── */}
                <div className="hidden lg:grid grid-cols-12 gap-5 items-start relative">

                    {/* ── Left Sidebar (Sticky/Fixed on Scroll) ── */}
                    <div className="col-span-3 space-y-4 sticky top-20 self-start">

                        {/* Profile Card */}
                        <div className="bg-bg-surface rounded-2xl overflow-hidden shadow-sm border border-border-base/60">
                            <div className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-base text-primary shrink-0">
                                        {getInitials(profile.name, profile.email)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-sm text-text-base truncate">{profile.name || "Customer"}</h3>
                                        <p className="text-[11px] text-text-muted truncate mt-0.5">{profile.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mini Metric Row */}
                            <div className="grid grid-cols-2 border-t border-border-base/50 divide-x divide-border-base/50">
                                <div className="flex flex-col items-center py-3 gap-0.5">
                                    <p className="text-base font-black text-text-base">{validOrders.length}</p>
                                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Orders</p>
                                </div>
                                <div className="flex flex-col items-center py-3 gap-0.5 px-1">
                                    <p className="text-base font-black text-text-base truncate w-full text-center"
                                       title={`₹${Math.round(totalSpent).toLocaleString("en-IN")}`}>
                                        ₹{Math.round(totalSpent).toLocaleString("en-IN")}
                                    </p>
                                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Spent</p>
                                </div>
                            </div>
                        </div>

                        {/* Nav Menu Card */}
                        <div className="bg-bg-surface rounded-2xl border border-border-base/60 shadow-sm overflow-hidden">
                            {MENU_ITEMS.map((item, idx) => {
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs transition-all duration-150 group ${
                                            isActive
                                                ? "bg-primary/10 text-primary font-bold border-l-4 border-primary"
                                                : "text-text-base hover:bg-bg-base font-semibold"
                                        } ${idx !== MENU_ITEMS.length - 1 ? "border-b border-border-base/40" : ""}`}
                                    >
                                        <span className={`shrink-0 transition-colors ${isActive ? "text-primary" : "text-text-muted group-hover:text-primary"}`}>
                                            {item.icon}
                                        </span>
                                        <span className="flex-1 text-left">{item.label}</span>
                                        <FaChevronRight size={10} className={`shrink-0 transition-colors ${isActive ? "text-primary" : "text-border-base group-hover:text-primary"}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Right Content Area ── */}
                    <div className="col-span-9 space-y-4">
                        {/* Active Tab Content Card */}
                        <div className="bg-bg-surface rounded-2xl border border-border-base/60 shadow-sm p-5 sm:p-6">
                            {activeTab === "profile" && (
                                <ProfileTab profile={profile} setProfile={setProfile} handleSaveProfile={handleSaveProfile} saving={saving} />
                            )}
                            {activeTab === "address" && (
                                <AddressTab uid={uid} profile={profile} handleAddressChange={handleAddressChange} handleSaveProfile={handleSaveProfile} saving={saving} />
                            )}
                            {activeTab === "orders" && (
                                <OrdersTab orders={orders} />
                            )}
                        </div>
                    </div>
                </div>

                {/* ─── MOBILE / TABLET LAYOUT ─────────────────────────────────── */}
                <div className="lg:hidden space-y-3">

                    {/* Mobile Profile Hero Card */}
                    <div className="bg-bg-surface rounded-2xl p-4 shadow-sm border border-border-base/60">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-base text-primary shrink-0">
                                {getInitials(profile.name, profile.email)}
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-black text-sm text-text-base truncate">{profile.name || "Customer"}</h2>
                                <p className="text-[10px] text-text-muted truncate">{profile.email}</p>
                            </div>
                        </div>

                        {/* Mobile Metric Row */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                                <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
                                    <FaShoppingBag size={12} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[9px] font-semibold text-text-muted uppercase tracking-wide">Orders</p>
                                    <p className="text-sm font-black text-text-base">{validOrders.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                                    <FaWallet size={12} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[9px] font-semibold text-text-muted uppercase tracking-wide">Spent</p>
                                    <p className="text-sm font-black text-text-base truncate" title={`₹${Math.round(totalSpent).toLocaleString("en-IN")}`}>
                                        ₹{Math.round(totalSpent).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Tab Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                        {MENU_ITEMS.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                                        isActive
                                            ? "bg-primary text-white shadow-sm"
                                            : "bg-bg-surface text-text-muted border border-border-base/70 hover:text-text-base"
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.shortLabel}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile Tab Content */}
                    <div className="bg-bg-surface rounded-2xl border border-border-base/60 shadow-sm p-4">
                        {activeTab === "profile" && (
                            <ProfileTab profile={profile} setProfile={setProfile} handleSaveProfile={handleSaveProfile} saving={saving} />
                        )}
                        {activeTab === "address" && (
                            <AddressTab uid={uid} profile={profile} handleAddressChange={handleAddressChange} handleSaveProfile={handleSaveProfile} saving={saving} />
                        )}
                        {activeTab === "orders" && (
                            <OrdersTab orders={orders} />
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default User;