import React from "react";
import { FaHome, FaBriefcase, FaMapPin } from "react-icons/fa";

const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
            {label}
        </label>
        {children}
    </div>
);

const Input = ({ value, onChange, placeholder, type = "text" }) => (
    <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-border-base bg-bg-base
            text-xs text-text-base transition-all
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            hover:border-primary/40 placeholder:text-text-muted/50"
    />
);

const ADDRESS_TYPES = [
    { value: "HOME", label: "Home", sub: "All day delivery", icon: <FaHome size={11} /> },
    { value: "WORK", label: "Work", sub: "9 AM – 5 PM only", icon: <FaBriefcase size={11} /> },
    { value: "OTHER", label: "Other", sub: "Custom location", icon: <FaMapPin size={11} /> },
];

export default function AddressTab({ profile, handleAddressChange, handleSaveProfile, saving }) {
    const currentType = profile.address?.type || "HOME";

    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-sm font-bold text-text-base">Delivery Address</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Your default shipping address for orders</p>
            </div>

            <div className="h-px bg-border-base/60" />

            {/* Contact Info */}
            <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Contact</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Full Name">
                        <Input
                            value={profile.address?.fullName}
                            onChange={(e) => handleAddressChange("fullName", e.target.value)}
                            placeholder="Recipient name"
                        />
                    </Field>
                    <Field label="Phone">
                        <Input
                            value={profile.address?.phone}
                            onChange={(e) => handleAddressChange("phone", e.target.value)}
                            placeholder="Contact phone"
                        />
                    </Field>
                </div>
            </div>

            {/* Address Details */}
            <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Address Details</p>
                <div className="space-y-3">
                    <Field label="Flat / House No. / Office">
                        <Input
                            value={profile.address?.houseNo}
                            onChange={(e) => handleAddressChange("houseNo", e.target.value)}
                            placeholder="Flat/House/Apartment No."
                        />
                    </Field>
                    <Field label="Building Name">
                        <Input
                            value={profile.address?.buildingName}
                            onChange={(e) => handleAddressChange("buildingName", e.target.value)}
                            placeholder="Building or Society name"
                        />
                    </Field>
                    <Field label="Street / Locality">
                        <Input
                            value={profile.address?.street}
                            onChange={(e) => handleAddressChange("street", e.target.value)}
                            placeholder="Street, area or locality"
                        />
                    </Field>
                    <Field label="Landmark">
                        <Input
                            value={profile.address?.landmark}
                            onChange={(e) => handleAddressChange("landmark", e.target.value)}
                            placeholder="Nearby landmark"
                        />
                    </Field>
                </div>
            </div>

            {/* Location Grid */}
            <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Location</p>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="City">
                        <Input
                            value={profile.address?.city}
                            onChange={(e) => handleAddressChange("city", e.target.value)}
                            placeholder="City"
                        />
                    </Field>
                    <Field label="District">
                        <Input
                            value={profile.address?.district}
                            onChange={(e) => handleAddressChange("district", e.target.value)}
                            placeholder="District"
                        />
                    </Field>
                    <Field label="State">
                        <Input
                            value={profile.address?.state}
                            onChange={(e) => handleAddressChange("state", e.target.value)}
                            placeholder="State"
                        />
                    </Field>
                    <Field label="PIN Code">
                        <Input
                            value={profile.address?.pincode}
                            onChange={(e) => handleAddressChange("pincode", e.target.value)}
                            placeholder="PIN code"
                        />
                    </Field>
                </div>
            </div>

            {/* Address Type Selector */}
            <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Address Type</p>
                <div className="grid grid-cols-3 gap-2">
                    {ADDRESS_TYPES.map((t) => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => handleAddressChange("type", t.value)}
                            className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-xl border text-center transition-all active:scale-95 ${
                                currentType === t.value
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "border-border-base bg-bg-base text-text-muted hover:border-primary/40"
                            }`}
                        >
                            {t.icon}
                            <span className="text-[10px] font-bold leading-none">{t.label}</span>
                            <span className="text-[8.5px] leading-tight opacity-70 hidden sm:block">{t.sub}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-2">
                <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-compli text-xs font-bold shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? "Saving…" : "Save Address"}
                </button>
            </div>
        </div>
    );
}
