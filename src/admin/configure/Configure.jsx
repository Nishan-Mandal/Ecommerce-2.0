import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { configureService } from "../../services/configure/configureService";
import { useSiteConfig } from "../../context/SiteConfigContext";
import useAuth from "../../hooks/auth/useAuth";

import CompanyTab from "./tabs/CompanyTab";
import ContactTab from "./tabs/ContactTab";
import SocialTab from "./tabs/SocialTab";
import BannersTab from "./tabs/BannersTab";
import CollectionsTab from "./tabs/CollectionsTab";
import LegalTab from "./tabs/LegalTab";
import SeoTab from "./tabs/SeoTab";
import Header from "../Components/Header";

import { useFormAutoSave } from "../../hooks/common/useFormAutoSave";

const TABS = [
    { id: "company", icon: "apartment", label: "Company" },
    { id: "contact", icon: "phone", label: "Contact" },
    { id: "social", icon: "share", label: "Social Links" },
    { id: "banners", icon: "image", label: "Banners" },
    { id: "collections", icon: "grid_view", label: "Collections" },
    { id: "legal", icon: "description", label: "Legal" },
];

function Configure() {
    const { config, setConfig } = useSiteConfig();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("company");
    const [draft, setDraft, clearConfigureDraft] = useFormAutoSave("draft_store_settings", config, { debounceMs: 400 });
    const [saving, setSaving] = useState(false);
    const [seeding, setSeeding] = useState(false);

    // Sync draft when context config updates
    useEffect(() => {
        if (config && Object.keys(config).length > 0) {
            setDraft((prev) => ({ ...config, ...prev }));
        }
    }, [config]);

    const updateDraft = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

    const handleSave = async () => {
        setSaving(true);
        try {
            await configureService.saveSiteConfig(draft, user?.uid || "");
            setConfig(draft);
            clearConfigureDraft();
            toast.success("Configuration saved successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save configuration");
        } finally {
            setSaving(false);
        }
    };


    const tabProps = { draft, updateDraft };

    return (
        <div className="space-y-6 lg:space-y-8 px-4 md:px-0">
            {/* Header Action Row */}
            <Header
                title="Site Configuration"
                description="Manage company info, banners, collections, social links, legal pages, and SEO."
                buttonText={
                    activeTab !== "banners" && activeTab !== "collections"
                        ? (saving ? "Saving..." : "Save Changes")
                        : undefined
                }
                clickhandler={handleSave}
                disabled={saving}
            />

            {/* Tab Navigation Wrapper */}
            <div className="bg-white md:border border-border-base rounded-2xl overflow-hidden shadow-xs">

                {/* Mobile Viewport Grid Selector (Visible on Mobile) */}
                <div className="block md:hidden p-3 bg-bg-surface/50 border-b border-border-base/60">
                    <div className="grid grid-cols-3 gap-2">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col items-center py-2.5 px-1 rounded-xl justify-center gap-1.5 text-center transition-all cursor-pointer border ${isActive
                                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                                        : "border-border-base/60 bg-white text-text-muted hover:text-text-base hover:bg-gray-50/50"
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-primary" : "text-text-muted"}`}>
                                        {tab.icon}
                                    </span>
                                    <span className="text-[9px] leading-tight font-extrabold truncate w-full px-0.5">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tablet / Desktop Viewport Tab Row (Hidden on Mobile) */}
                <div className="hidden md:flex gap-1 overflow-x-auto border-b border-border-base/60 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-1 bg-bg-surface">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 -mb-px cursor-pointer ${activeTab === tab.id
                                ? "border-primary text-primary bg-white rounded-t-xl"
                                : "border-transparent text-text-muted hover:text-text-base hover:bg-white/50"
                                }`}
                        >
                            <span className={`material-symbols-outlined text-lg ${activeTab === tab.id ? "text-primary" : "text-text-muted"}`}>
                                {tab.icon}
                            </span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-4 sm:p-6 bg-white">
                    {activeTab === "company" && <CompanyTab     {...tabProps} />}
                    {activeTab === "contact" && <ContactTab     {...tabProps} />}
                    {activeTab === "social" && <SocialTab      {...tabProps} />}
                    {activeTab === "banners" && <BannersTab />}
                    {activeTab === "collections" && <CollectionsTab />}
                    {activeTab === "legal" && <LegalTab       {...tabProps} />}
                    {activeTab === "seo" && <SeoTab         {...tabProps} />}
                </div>
            </div>
        </div>
    );
}

export default Configure;