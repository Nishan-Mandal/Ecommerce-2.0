/**
 * Configure Model
 *
 * Firestore Path: configure/site
 *   → A single document (singleton) for all site-wide settings.
 *
 * Sub-collections:
 *   configure/site/banners/{bannerId}      → hero banner slides
 *   configure/site/collections/{id}        → home-page product collection sections
 */

const configure = {

  // ─── Company Identity ──────────────────────────────────────────────────────
  companyName: "HN Enterprise",
  companyTagline: "Quality you can trust.",
  companyLogo: "",   // Firebase Storage URL
  faviconUrl: "",    // Firebase Storage URL

  // ─── Contact Information ───────────────────────────────────────────────────
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    mapUrl: "",
  },

  phones: [
    // { label: "Support", number: "+91 98765 43210", isWhatsapp: true }
  ],

  emails: [
    // { label: "Support", email: "support@example.com" }
  ],

  // ─── Social Links ──────────────────────────────────────────────────────────
  socialLinks: [
    { platform: "facebook",  icon: "fa-facebook-f",  url: "", isActive: false },
    { platform: "instagram", icon: "fa-instagram",   url: "", isActive: false },
    { platform: "twitter",   icon: "fa-x-twitter",   url: "", isActive: false },
    { platform: "youtube",   icon: "fa-youtube",     url: "", isActive: false },
    { platform: "linkedin",  icon: "fa-linkedin-in", url: "", isActive: false },
    { platform: "pinterest", icon: "fa-pinterest-p", url: "", isActive: false },
    { platform: "whatsapp",  icon: "fa-whatsapp",    url: "", isActive: false },
  ],

  // ─── Banners (Sub-collection: configure/site/banners/{bannerId}) ───────────
  // {
  //   bannerId: "",
  //   imageUrl: "",      // Firebase Storage URL
  //   title: "",
  //   subtitle: "",
  //   ctaLabel: "Shop Now",
  //   ctaUrl: "/allproducts",
  //   order: 0,
  //   isActive: true,
  // }
  bannersCount: 0,

  // ─── Home Collections (Sub-collection: configure/site/collections/{id}) ────
  // {
  //   collectionId: "",
  //   title: "Featured Products",
  //   subtitle: "",
  //   productIds: [],    // ordered list of product doc IDs
  //   layout: "grid",   // "grid" | "horizontal-scroll"
  //   order: 0,
  //   isActive: true,
  // }
  collectionsCount: 0,

  // ─── Legal Content (Markdown Strings) ─────────────────────────────────────
  legal: {
    termsAndConditions: "",
    privacyPolicy: "",
    returnPolicy: "",
    aboutUs: "",
  },

  // ─── SEO Defaults ──────────────────────────────────────────────────────────
  seo: {
    metaTitle: "",
    metaDescription: "",
    ogImageUrl: "",
    keywords: [],
  },

  // ─── Metadata ──────────────────────────────────────────────────────────────
  updatedAt: null,
  updatedBy: "",
};
