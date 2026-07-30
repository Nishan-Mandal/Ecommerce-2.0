import React from "react";
import { useSiteConfig } from "../../context/SiteConfigContext";
import LegalPdfViewer from "./LegalPdfViewer";

/**
 * LegalPage — shared renderer for standard legal/policy pages.
 * Reads PDF URL from SiteConfigContext and renders via LegalPdfViewer.
 * @param {string} configKey - Key in config.legal.fixedPages (e.g. "aboutUs", "privacyPolicy")
 * @param {string} title - Fallback page heading
 */
function LegalPage({ configKey, title }) {
    const { config, loading } = useSiteConfig();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-text-muted text-sm">
                Loading policy document...
            </div>
        );
    }

    const legalData = config?.legal || {};
    const pageObj = legalData.fixedPages?.[configKey] || {};
    const pdfUrl = pageObj.pdfUrl || (typeof legalData[configKey] === "string" && legalData[configKey].startsWith("http") ? legalData[configKey] : "");

    if (pageObj.isActive === false) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-text-muted gap-2">
                <p className="text-xl font-bold">{title}</p>
                <p className="text-sm">This policy page is currently inactive.</p>
            </div>
        );
    }

    return <LegalPdfViewer pdfUrl={pdfUrl} title={title} />;
}

export default LegalPage;
