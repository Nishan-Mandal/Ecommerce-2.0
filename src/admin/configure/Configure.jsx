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
    const [draft, setDraft] = useState(config);
    const [saving, setSaving] = useState(false);
    const [seeding, setSeeding] = useState(false);

    // Sync draft when context config updates
    useEffect(() => {
        setDraft(config);
    }, [config]);

    const updateDraft = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

    const handleSave = async () => {
        setSaving(true);
        try {
            await configureService.saveSiteConfig(draft, user?.uid || "");
            setConfig(draft);
            toast.success("Configuration saved successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save configuration");
        } finally {
            setSaving(false);
        }
    };

    const handleSeed = async () => {
        setSeeding(true);
        try {
            const seedData = {
                companyName: "NeedMet Ecommerce",
                companyTagline: "Handcrafted Premium Art & Custom Gifts",
                companyLogo: "https://firebasestorage.googleapis.com/v0/b/needmate-ecommerce.appspot.com/o/demo%2Flogo.png?alt=media",
                faviconUrl: "https://firebasestorage.googleapis.com/v0/b/needmate-ecommerce.appspot.com/o/demo%2Ffavicon.png?alt=media",
                address: {
                    line1: "102, Craft Villa, Creative Lane",
                    line2: "Near Art Circle",
                    city: "Mumbai",
                    state: "Maharashtra",
                    pincode: "400001",
                    country: "India",
                    mapUrl: "https://maps.google.com"
                },
                phones: [
                    { label: "Sales & Support", number: "+91 98765 43210", isWhatsapp: true },
                    { label: "Corporate Office", number: "+91 22 2345 6789", isWhatsapp: false }
                ],
                emails: [
                    { label: "Customer Support", email: "support@needmet.com" },
                    { label: "Bulk Enquiries", email: "sales@needmet.com" }
                ],
                socialLinks: [
                    { platform: "facebook",  icon: "fa-facebook-f",  url: "https://facebook.com/needmet", isActive: true },
                    { platform: "instagram", icon: "fa-instagram",   url: "https://instagram.com/needmet", isActive: true },
                    { platform: "twitter",   icon: "fa-x-twitter",   url: "https://twitter.com/needmet", isActive: false },
                    { platform: "youtube",   icon: "fa-youtube",     url: "https://youtube.com/c/needmet", isActive: true },
                    { platform: "linkedin",  icon: "fa-linkedin-in", url: "https://linkedin.com/company/needmet", isActive: false },
                    { platform: "pinterest", icon: "fa-pinterest-p", url: "https://pinterest.com/needmet", isActive: true },
                    { platform: "whatsapp",  icon: "fa-whatsapp",    url: "https://wa.me/919876543210", isActive: true },
                ],
                legal: {
                    aboutUs: "# About NeedMet\n\nNeedMet is your ultimate destination for **exquisite, handcrafted artwork** and bespoke personalized gifts.\n\n### Our Mission\n\nTo bridge the gap between traditional craftsmanship and modern design, bringing art directly to your doorstep.",
                    privacyPolicy: "# Privacy Policy\n\nWe value your privacy. This policy describes how we collect, use, and share your personal data when you visit or make a purchase from NeedMet.\n\n### Data We Collect\n\n- Name and contact details\n- Delivery address\n- Payment information",
                    returnPolicy: "# Return & Refund Policy\n\nWe want you to be completely satisfied with your purchase. If you are not happy, you may return the item within 15 days of receipt.\n\n### Conditions\n\n- Items must be in original condition\n- Custom-made items are non-refundable",
                    termsAndConditions: "# Terms & Conditions\n\nWelcome to NeedMet. By browsing this website, you agree to comply with and be bound by the following terms of use.\n\n### Conditions of Sale\n\n- All prices are listed in Indian Rupees (INR)\n- Orders are processed within 2-3 business days"
                },
                seo: {
                    metaTitle: "NeedMet — Premium Handcrafted Artwork & Custom Gifts",
                    metaDescription: "Explore our collection of custom drawings, oil paintings, and handmade gifts. Crafted by master artists and shipped worldwide.",
                    ogImageUrl: "https://firebasestorage.googleapis.com/v0/b/needmate-ecommerce.appspot.com/o/demo%2Fbanner.jpg?alt=media",
                    keywords: ["handmade", "portrait", "custom gifts", "art", "paintings", "crafts"]
                }
            };

            await configureService.saveSiteConfig(seedData, user?.uid || "admin-seed");
            setConfig(seedData);
            setDraft(seedData);
            toast.success("Store configuration seeded successfully!");
        } catch (err) {
            console.error("Seeding failed:", err);
            toast.error("Failed to seed configuration");
        } finally {
            setSeeding(false);
        }
    };

    const tabProps = { draft, updateDraft };

    return (
        <div className="space-y-6 lg:space-y-8">
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
                                    className={`flex flex-col items-center py-2.5 px-1 rounded-xl justify-center gap-1.5 text-center transition-all cursor-pointer border ${
                                        isActive
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
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 -mb-px cursor-pointer ${
                                activeTab === tab.id
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