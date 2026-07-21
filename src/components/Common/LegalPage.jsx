import ReactMarkdown from "react-markdown";
import { useSiteConfig } from "../../context/SiteConfigContext";

/**
 * LegalPage — shared renderer for all legal/policy pages.
 * Reads Markdown content from the SiteConfigContext and renders it.
 * @param {string} configKey - Key in config.legal (e.g. "aboutUs", "privacyPolicy")
 * @param {string} title - Page heading to display if no Markdown content
 */
function LegalPage({ configKey, title }) {
    const { config, loading } = useSiteConfig();
    const content = config?.legal?.[configKey] || "";

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-text-muted text-sm">
                Loading...
            </div>
        );
    }

    if (!content) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-text-muted gap-2">
                <p className="text-xl font-bold">{title}</p>
                <p className="text-sm">Content not configured yet. Visit the admin Configure page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <article className="prose prose-neutral dark:prose-invert max-w-none text-text-base text-sm leading-relaxed">
                <ReactMarkdown>{content}</ReactMarkdown>
            </article>
        </div>
    );
}

export default LegalPage;
