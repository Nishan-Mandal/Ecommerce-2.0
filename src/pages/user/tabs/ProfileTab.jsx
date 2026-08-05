import React from "react";
import { FaUser, FaEnvelope, FaPhone, FaCheckCircle } from "react-icons/fa";

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black text-text-muted uppercase tracking-wider">
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, type = "text", disabled = false, icon: Icon }) => (
  <div className="relative flex items-center">
    {Icon && <Icon className="absolute left-3 text-text-muted text-xs pointer-events-none" />}
    <input
      type={type}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full ${Icon ? "pl-8.5" : "px-3"} pr-3 py-2 rounded-xl border text-xs font-semibold transition-all
        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
        ${disabled
          ? "border-border-base/50 bg-bg-base/60 text-text-muted cursor-not-allowed opacity-75"
          : "border-border-base/70 bg-bg-surface hover:border-primary/40 text-text-base"
        }`}
    />
  </div>
);

export default function ProfileTab({ profile, setProfile, handleSaveProfile, saving }) {
  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="pb-1.5 border-b border-border-base/50">
        <h3 className="text-sm font-extrabold text-text-base">Profile Information</h3>
        <p className="text-[10px] text-text-muted mt-0.5">Manage your personal account details and credentials</p>
      </div>

      {/* Account Verification & Status Pills */}
      <div className="flex flex-wrap items-center gap-2.5 p-2.5 px-3 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-primary">
          <FaCheckCircle size={12} />
          <span>Email Verified</span>
        </div>
        <span className="text-text-muted/40">•</span>
        <div className="flex items-center gap-1.5 text-xs font-extrabold">
          <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase text-[9px] font-black tracking-wider">
            ROLE: {profile.role || "CUSTOMER"}
          </span>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Full Name">
          <Input
            icon={FaUser}
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Your full name"
          />
        </Field>

        <Field label="Email Address">
          <div className="relative">
            <Input
              icon={FaEnvelope}
              value={profile.email}
              disabled
              placeholder="yourname@example.com"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-wider bg-bg-base border border-border-base text-text-muted px-1.5 py-0.5 rounded">
              PRIMARY
            </span>
          </div>
        </Field>

        <Field label="Phone Number">
          <Input
            icon={FaPhone}
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
        </Field>
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-border-base/50 flex justify-end">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full sm:w-auto px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-compli text-xs font-extrabold shadow-2xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? "Saving Changes…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
