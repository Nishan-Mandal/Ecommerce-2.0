import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/auth/useAuth";
import { userService } from "../../services/user/userService";
import { orderService } from "../../services/order/orderService";
import { storage } from "../../firebase/FirebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaCamera, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import ProfileTab from "./tabs/ProfileTab";
import AddressTab from "./tabs/AddressTab";
import OrdersTab from "./tabs/OrdersTab";

const TABS = [
    { id: "profile", label: "Profile", icon: <FaUser size={11} /> },
    { id: "address", label: "Address", icon: <FaMapMarkerAlt size={11} /> },
    { id: "orders", label: "Orders", icon: <FaShoppingBag size={11} /> },
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

    const totalSpent = orders.reduce((acc, o) => {
        const amt = Number(o.totalAmount || o.pricing?.grandTotal || 0);
        return acc + amt;
    }, 0);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-base text-text-muted text-xs">
                <div className="flex flex-col items-center gap-2">
                    <FaSpinner className="animate-spin text-xl text-primary" />
                    <span>Loading your profile...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-base text-xs">

            {/* ── Mobile Profile Header Strip ── */}
            <div className="lg:hidden bg-bg-surface border-b border-border-base px-4 py-4">
                <div className="flex items-center gap-3">
                    {/* Avatar Initials Badge */}
                    <div className="w-14 h-14 rounded-full border-2 border-primary/30 bg-primary/10 text-primary font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
                        {getInitials(profile.name, profile.email)}
                    </div>

                    {/* Name / Email / Role */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-extrabold text-text-base truncate">{profile.name || "User Profile"}</h2>
                        <p className="text-text-muted truncate mt-0.5">{profile.email}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[9px] uppercase">
                                {profile.role == "ADMIN" ? "Admin" : "Customer"}
                            </span>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <div className="text-right">
                            <p className="text-[9px] text-text-muted uppercase font-semibold tracking-wide">Orders</p>
                            <p className="text-sm font-bold text-text-base">{orders.length}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-text-muted uppercase font-semibold tracking-wide">Spent</p>
                            <p className="text-[11px] font-bold text-text-base">₹{totalSpent.toLocaleString("en-IN")}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Desktop & Mobile Main Layout ── */}
            <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">

                {/* ── Left Sidebar: Desktop only ── */}
                <div className="hidden lg:block lg:col-span-1 space-y-4">
                    <div className="bg-bg-surface border border-border-base rounded-2xl p-5 shadow-xs flex flex-col items-center text-center space-y-4">
                        {/* Avatar Initials Badge */}
                        <div className="w-24 h-24 rounded-full border-2 border-primary/30 bg-primary/10 text-primary font-black text-3xl flex items-center justify-center shrink-0 shadow-sm">
                            {getInitials(profile.name, profile.email)}
                        </div>

                        <div>
                            <h2 className="text-base font-extrabold text-text-base">{profile.name || "User Profile"}</h2>
                            <p className="text-text-muted mt-0.5">{profile.email}</p>
                            <span className="inline-block mt-2 px-2.5 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px] uppercase">
                                {profile.role == "ADMIN" ? "ADMIN" : "USER"}
                            </span>
                        </div>
                        <div className="flex gap-2 w-full justify-center pt-2 border-t border-border-base/50">
                            <div className={`flex items-center gap-1 text-[10px] font-semibold ${profile.phoneVerified ? "text-green-600" : "text-text-muted/60"}`}>
                                {profile.phoneVerified ? <FaCheckCircle /> : <FaExclamationCircle />}
                                <span>Phone</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-bg-surface border border-border-base rounded-2xl p-4 shadow-xs grid grid-cols-2 gap-3">
                        <div className="text-center p-2.5 rounded-xl bg-bg-base border border-border-base/50">
                            <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Orders</p>
                            <h3 className="text-lg font-bold text-text-base mt-0.5">{orders.length}</h3>
                        </div>
                        <div className="text-center p-2.5 rounded-xl bg-bg-base border border-border-base/50">
                            <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Spent</p>
                            <h3 className="text-lg font-bold text-text-base mt-0.5">₹{totalSpent.toLocaleString("en-IN")}</h3>
                        </div>
                    </div>
                </div>

                {/* ── Right Detailed Panel ── */}
                <div className="lg:col-span-3 space-y-3">
                    {/* Tabs Row */}
                    <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all active:scale-95 ${activeTab === tab.id
                                        ? "bg-primary text-compli shadow-sm"
                                        : "text-text-muted border border-border-base bg-bg-surface hover:text-text-base"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Panel */}
                    <div className="bg-bg-surface border border-border-base rounded-2xl shadow-xs p-4 sm:p-6">
                        {activeTab === "profile" && (
                            <ProfileTab
                                profile={profile}
                                setProfile={setProfile}
                                handleSaveProfile={handleSaveProfile}
                                saving={saving}
                            />
                        )}
                        {activeTab === "address" && (
                            <AddressTab
                                profile={profile}
                                handleAddressChange={handleAddressChange}
                                handleSaveProfile={handleSaveProfile}
                                saving={saving}
                            />
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