import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useSiteConfig } from '../../context/SiteConfigContext';

const FOOT_LINKS = [
    { title: "Terms & Conditions", path: "/termsconditions" },
    { title: "Privacy Policy",     path: "/privacypolicy" },
    { title: "Return Policy",      path: "/returnpolicy" },
    { title: "About Us",           path: "/aboutus" },
];

/**
 * Footer Component
 * Renders company name, address, contacts, social links, and legal navigation.
 * All data sourced from Firestore via SiteConfigContext.
 * Falls back to placeholder text if config is empty.
 */
function Footer() {
    const { mode } = useTheme();
    const { config } = useSiteConfig();

    const { companyName, address, phones, emails, socialLinks, legal } = config;

    const activeSocials = (socialLinks || []).filter((s) => s.isActive && s.url);

    const fullAddress = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.pincode,
    ].filter(Boolean).join(", ");

    // Build dynamic legal links
    const fixedMap = [
        { key: "termsAndConditions", title: "Terms & Conditions", path: "/termsconditions" },
        { key: "privacyPolicy",     title: "Privacy Policy",     path: "/privacypolicy" },
        { key: "returnPolicy",       title: "Return Policy",      path: "/returnpolicy" },
        { key: "shippingPolicy",     title: "Shipping Policy",    path: "/shippingpolicy" },
        { key: "refundPolicy",       title: "Refund Policy",      path: "/refundpolicy" },
        { key: "aboutUs",           title: "About Us",           path: "/aboutus" },
    ];

    const fixedPages = legal?.fixedPages || {};
    const activeFixedLinks = fixedMap.filter(item => fixedPages[item.key]?.isActive !== false);

    const customPages = Array.isArray(legal?.customPages) ? legal.customPages : [];
    const activeCustomLinks = customPages
        .filter(p => p.isActive !== false)
        .map(p => ({ title: p.name, path: `/legal/${p.slug}` }));

    const legalLinks = [...activeFixedLinks, ...activeCustomLinks];

    return (
        <footer className="bg-bg-surface border-t border-border-base transition-colors duration-300">
            <div className="px-10 py-6">
                <div className="mt-4 flex flex-col lg:flex-row items-center justify-between gap-6 text-[13px] text-text-muted">

                    {/* Brand and Address */}
                    <div className="space-y-1 text-center lg:text-left">
                        <Link to="/" className="inline-block">
                            <h2 className="text-2xl font-black tracking-tight text-primary">
                                {companyName || "HN Enterprise"}
                            </h2>
                        </Link>
                        <p className="font-semibold text-xs text-text-muted">
                            © {new Date().getFullYear()} {companyName || "HN Enterprise"}. All rights reserved.
                        </p>

                        {fullAddress && (
                            <div className="flex gap-1.5 items-start justify-center lg:justify-start">
                                <span className="material-symbols-outlined text-sm text-primary mt-0.5">location_on</span>
                                <p className="font-medium text-xs text-text-muted max-w-xs leading-relaxed">{fullAddress}</p>
                            </div>
                        )}
                    </div>

                    {/* Social Links and Contacts */}
                    <div className="flex flex-col items-center gap-3">
                        {activeSocials.length > 0 && (
                            <div className="flex gap-3">
                                {activeSocials.map((social) => (
                                    <a
                                        key={social.platform}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-full border border-border-base flex items-center justify-center text-text-muted hover:text-white hover:bg-primary hover:border-primary transition-all duration-300"
                                    >
                                        <i className={`fa-brands ${social.icon} text-xs`} />
                                    </a>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-text-muted">
                            {(phones || []).map((p, i) => (
                                <div key={i} className="flex gap-1.5 items-center">
                                    <span className="material-symbols-outlined text-sm text-primary">{p.isWhatsapp ? "chat" : "call"}</span>
                                    <p className="font-medium text-xs text-text-muted">{p.number}</p>
                                </div>
                            ))}
                            {(emails || []).map((e, i) => (
                                <div key={i} className="flex gap-1.5 items-center">
                                    <span className="material-symbols-outlined text-sm text-primary">mail</span>
                                    <p className="font-medium text-xs text-text-muted">{e.email}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex flex-wrap justify-center gap-4 max-w-md">
                            {legalLinks.map((link, i) => (
                                <Link
                                    key={i}
                                    className="underline hover:text-primary transition-colors text-xs font-bold whitespace-nowrap"
                                    to={link.path}
                                >
                                    {link.title}
                                </Link>
                            ))}
                        </div>
                        <p className="text-center text-sm text-text-muted">
                            Design & Develop By{" "}
                            <a href="https://needmet.in" target="_blank" rel="noopener noreferrer" className="font-bold underline text-green-600">
                                NeedMet
                            </a>
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;