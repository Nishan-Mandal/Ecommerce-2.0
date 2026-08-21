import { fireDB } from '../../firebase/FirebaseConfig.js';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query 
} from 'firebase/firestore';

// ─── In-memory cache ────────────────────────────────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let _cache = null;        // { data: [], timestamp: number } | null
// ─────────────────────────────────────────────────────────────────────────────

export const mediaService = {
  /** Clears the in-memory cache so the next call to getMediaLibrary() re-fetches. */
  invalidateCache() {
    _cache = null;
  },

  /**
   * Saves an uploaded image URL to the global media collection.
   * Also invalidates the cache so the library reflects the new image immediately.
   */
  async saveMedia(url, name = "Uploaded Image") {
    if (!url) return;
    try {
      // Create a deterministic doc ID from URL hash or timestamp
      const docId = btoa(url).replace(/=/g, '').substring(0, 32);
      const mediaRef = doc(fireDB, "media", docId);
      await setDoc(mediaRef, {
        url,
        name,
        createdAt: new Date().toISOString()
      }, { merge: true });
      this.invalidateCache(); // bust cache so new image shows up
    } catch (err) {
      console.error("Error saving media to library:", err);
    }
  },

  /**
   * Fetches all uploaded media from Firestore 'media' collection and existing products
   */
  /**
   * Fetches all media. Results are cached for CACHE_TTL_MS (5 min).
   * Pass force=true to skip cache and always hit Firestore.
   */
  async getMediaLibrary(force = false) {
    // Return cached data if still fresh
    if (!force && _cache && (Date.now() - _cache.timestamp < CACHE_TTL_MS)) {
      return _cache.data;
    }
    const mediaSet = new Set();
    const mediaList = [];

    // 1. Fetch from media collection
    try {
      const snap = await getDocs(query(collection(fireDB, "media")));
      snap.forEach(docSnap => {
        const data = docSnap.data();
        if (data.url && !mediaSet.has(data.url)) {
          mediaSet.add(data.url);
          mediaList.push({
            id: docSnap.id,
            url: data.url,
            name: data.name || "Product Media",
            source: "Media Library",
            createdAt: data.createdAt || null
          });
        }
      });
    } catch (err) {
      console.warn("Could not fetch media collection:", err);
    }

    // 2. Fetch from existing products catalog to ensure all product images are selectable
    try {
      const prodSnap = await getDocs(query(collection(fireDB, "products")));
      prodSnap.forEach(docSnap => {
        const p = docSnap.data();
        
        // Product primary image
        if (p.imageUrl && !mediaSet.has(p.imageUrl)) {
          mediaSet.add(p.imageUrl);
          mediaList.push({
            id: `prod_${docSnap.id}_main`,
            url: p.imageUrl,
            name: p.title ? `${p.title} (Main)` : "Product Image",
            source: p.title || "Product Catalog"
          });
        }

        // Product gallery images
        if (Array.isArray(p.images)) {
          p.images.forEach((imgUrl, idx) => {
            if (imgUrl && !mediaSet.has(imgUrl)) {
              mediaSet.add(imgUrl);
              mediaList.push({
                id: `prod_${docSnap.id}_img_${idx}`,
                url: imgUrl,
                name: p.title ? `${p.title} #${idx + 1}` : "Gallery Image",
                source: p.title || "Product Catalog"
              });
            }
          });
        }

        // Product variants images
        if (Array.isArray(p.variants)) {
          p.variants.forEach((v, vIdx) => {
            if (Array.isArray(v.images)) {
              v.images.forEach((vImgUrl, imgIdx) => {
                if (vImgUrl && !mediaSet.has(vImgUrl)) {
                  mediaSet.add(vImgUrl);
                  mediaList.push({
                    id: `prod_${docSnap.id}_v_${vIdx}_${imgIdx}`,
                    url: vImgUrl,
                    name: p.title ? `${p.title} Variant` : "Variant Image",
                    source: p.title || "Product Variant"
                  });
                }
              });
            }
          });
        }
      });
    } catch (err) {
      console.warn("Could not fetch product images for media library:", err);
    }

    // Store result in cache
    _cache = { data: mediaList, timestamp: Date.now() };
    return mediaList;
  }
};
