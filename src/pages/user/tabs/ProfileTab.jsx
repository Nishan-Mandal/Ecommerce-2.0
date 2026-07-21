import React from "react";

const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
            {label}
        </label>
        {children}
    </div>
);

const Input = ({ value, onChange, placeholder, type = "text", disabled = false }) => (
    <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2.5 rounded-xl border text-xs transition-all
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            ${disabled
                ? "border-border-base/40 bg-bg-base/50 text-text-muted cursor-not-allowed opacity-60"
                : "border-border-base bg-bg-base hover:border-primary/40 text-text-base"
            }`}
    />
);

export default function ProfileTab({ profile, setProfile, handleSaveProfile, saving }) {
    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-sm font-bold text-text-base">Personal Information</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Update your basic profile details</p>
            </div>

            <div className="h-px bg-border-base/60" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name">
                    <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Your full name"
                    />
                </Field>

                <Field label="Email Address">
                    <div className="relative">
                        <Input
                            value={profile.email}
                            disabled
                            placeholder="yourname@example.com"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold bg-bg-base border border-border-base/50 text-text-muted px-1.5 py-0.5 rounded">
                            LOCKED
                        </span>
                    </div>
                </Field>

                <Field label="Phone Number">
                    <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                    />
                </Field>

                <Field label="Avatar Image URL">
                    <Input
                        value={profile.profileImage}
                        onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
                        placeholder="https://example.com/avatar.jpg"
                    />
                </Field>
            </div>

            <div className="pt-2">
                <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-compli text-xs font-bold shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? "Saving…" : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
