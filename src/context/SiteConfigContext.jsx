import { createContext, useContext, useEffect, useState } from "react";
import { configureService, DEFAULT_CONFIG } from "../services/configure/configureService";

const SiteConfigContext = createContext(DEFAULT_CONFIG);

/**
 * SiteConfigProvider
 * Fetches the Firestore configure/site document once on app boot and
 * makes it available to the entire component tree via context.
 * Also updates <title> and <link rel="icon"> whenever config loads or updates.
 */
export function SiteConfigProvider({ children }) {
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            configureService.getSiteConfig(),
            configureService.getBanners()
        ])
            .then(([data, bannerData]) => {
                setConfig(data);
                const activeBanners = bannerData.filter((b) => b.isActive !== false);
                setBanners(activeBanners);
            })
            .catch((err) => console.error("SiteConfig fetch error:", err))
            .finally(() => setLoading(false));
    }, []);

    // Dynamically update page title and favicon whenever site configuration changes
    useEffect(() => {
        if (config.companyName) {
            document.title = config.companyName;
        }

        if (config.faviconUrl) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                document.head.appendChild(link);
            }
            link.href = config.faviconUrl;
        }
    }, [config]);

    return (
        <SiteConfigContext.Provider value={{ config, setConfig, banners, setBanners, loading }}>
            {children}
        </SiteConfigContext.Provider>
    );
}

export function useSiteConfig() {
    return useContext(SiteConfigContext);
}
