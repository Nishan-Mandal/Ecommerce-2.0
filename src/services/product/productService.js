import { fireDB } from '../../firebase/FirebaseConfig.js';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  getDocs,
  where
} from 'firebase/firestore';

import { computeMinPrice, computeTotalStock } from '../../utils/productUtils.js';

export const productService = {
  /**
   * Fetches ratings for a specific product
   */
  async getProductRatings(productId) {
    const q = query(collection(fireDB, "ratings"), where("productId", "==", productId));
    const snap = await getDocs(q);
    const ratingsArray = [];
    snap.forEach((doc) => {
      ratingsArray.push(doc.data());
    });
    return ratingsArray;
  },
  /**
   * Subscribes to live updates of all products
   */
  getProducts(callback) {
    const q = query(collection(fireDB, "products"));
    return onSnapshot(q, (snapshot) => {
      const productsArray = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const price = data.price || (data.variants && data.variants.length > 0 ? String(data.variants[0].price) : "");
        const imageUrl = data.imageUrl || (data.images && data.images.length > 0 ? data.images[0] : "");
        
        productsArray.push({ 
          ...data, 
          id: doc.id,
          price,
          imageUrl,
          time: data.time || data.createdAt || null
        });
      });

      // Sort in-memory by timestamp descending (newest first)
      productsArray.sort((a, b) => {
        const timeA = a.time?.seconds || (a.time instanceof Date ? a.time.getTime() : 0);
        const timeB = b.time?.seconds || (b.time instanceof Date ? b.time.getTime() : 0);
        return timeB - timeA;
      });

      callback(productsArray);
    }, (error) => {
      console.error("Error listening to products: ", error);
    });
  },

  /**
   * Fetches a single product by its document ID
   */
  async getProductById(id) {
    const snap = await getDoc(doc(fireDB, 'products', id));
    if (!snap.exists()) {
      throw new Error("Product not found");
    }
    const data = snap.data();
    const price = data.price || (data.variants && data.variants.length > 0 ? String(data.variants[0].price) : "");
    const imageUrl = data.imageUrl || (data.images && data.images.length > 0 ? data.images[0] : "");
    
    return { 
      ...data, 
      id: snap.id,
      price,
      imageUrl
    };
  },

  /**
   * Adds a new product to the collection, computing minPrice and totalStock
   */
  async createProduct(productData) {
    const productRef = doc(collection(fireDB, "products"));
    const minPrice = computeMinPrice(productData);
    const totalStock = computeTotalStock(productData);
    
    const updatedProduct = {
      ...productData,
      id: productRef.id,
      minPrice,
      totalStock,
      time: productData.time || new Date()
    };
    await setDoc(productRef, updatedProduct);
    return updatedProduct;
  },

  /**
   * Updates an existing product document, conditionally recomputing minPrice and totalStock
   */
  async updateProduct(id, productData) {
    const productRef = doc(fireDB, 'products', id);
    const updatePayload = { ...productData };

    if (productData.price !== undefined || productData.variants !== undefined) {
      updatePayload.minPrice = computeMinPrice(productData);
    }
    if (productData.inStock !== undefined || productData.stock !== undefined || productData.variants !== undefined) {
      updatePayload.totalStock = computeTotalStock(productData);
    }
    
    await setDoc(productRef, updatePayload, { merge: true });
  },

  /**
   * Deletes a product document by ID
   */
  async deleteProduct(id) {
    const productRef = doc(fireDB, 'products', id);
    await deleteDoc(productRef);
  },

  /**
   * Auto-normalizes legacy Firestore products by backfilling missing scalar fields:
   *  - time:Timestamp/Date
   *  - isActive:boolean
   *  - minPrice:number
   *  - totalStock:number
   * Ensures Firestore orderBy/where constraints don't silently drop legacy docs.
   */
  async ensureProductsNormalized() {
    try {
      const snap = await getDocs(collection(fireDB, "products"));
      const { writeBatch, doc: fireDoc, Timestamp } = await import('firebase/firestore');
      let batch = writeBatch(fireDB);
      let count = 0;

      for (const d of snap.docs) {
        const data = d.data();
        const minPrice = computeMinPrice(data);
        const totalStock = computeTotalStock(data);
        const isActive = data.isActive !== false;
        const time = data.time || data.createdAt || data.date || Timestamp.now();

        if (
          data.minPrice === undefined ||
          data.totalStock === undefined ||
          data.isActive === undefined ||
          !data.time
        ) {
          const docRef = fireDoc(fireDB, "products", d.id);
          batch.update(docRef, { minPrice, totalStock, isActive, time });
          count++;

          if (count % 400 === 0) {
            await batch.commit();
            batch = writeBatch(fireDB);
          }
        }
      }

      if (count % 400 !== 0) {
        await batch.commit();
      }
      if (count > 0) {
        console.log(`Auto-normalized ${count} legacy products in Firestore.`);
      }
    } catch (err) {
      console.warn("Product auto-normalization notice:", err);
    }
  },

  /**
   * Dynamically retrieves all distinct categories currently existing in the product catalog.
   */
  async getCategories() {
    const snap = await getDocs(collection(fireDB, "products"));
    const categoriesSet = new Set();
    snap.forEach((d) => {
      const cat = d.data()?.category;
      if (cat && typeof cat === 'string' && cat.trim()) {
        categoriesSet.add(cat.trim());
      }
    });
    return Array.from(categoriesSet).sort();
  },

  /**
   * Fetches paginated products for Admin using Firestore cursor queries and server-side filters.
   * Uses server-side orderBy and cursor pagination with resilient filter-preserving fallback.
   */
  async getPaginatedProducts({ pageSize = 10, lastDoc = null, category = 'ALL', statusFilter = 'ALL', stockFilter = 'ALL', sortBy = 'Featured' }) {
    const { limit, startAfter, orderBy: fireOrderBy } = await import('firebase/firestore');
    
    // Build equality and range filters
    const whereConstraints = [];

    if (category && category !== 'ALL') {
      whereConstraints.push(where("category", "==", category));
    }

    if (statusFilter && statusFilter !== 'ALL') {
      const isLive = statusFilter === 'LIVE';
      whereConstraints.push(where("isActive", "==", isLive));
    }

    if (stockFilter && stockFilter !== 'ALL') {
      if (stockFilter === 'OUT_OF_STOCK') {
        whereConstraints.push(where("totalStock", "<=", 0));
      } else if (stockFilter === 'LOW_STOCK') {
        whereConstraints.push(where("totalStock", ">", 0));
        whereConstraints.push(where("totalStock", "<=", 5));
      } else if (stockFilter === 'IN_STOCK') {
        whereConstraints.push(where("totalStock", ">", 5));
      }
    }

    // Determine correct ordering
    const orderConstraints = [];
    if (stockFilter && stockFilter !== 'ALL') {
      // Firestore inequality rule: first orderBy must match inequality field
      orderConstraints.push(fireOrderBy("totalStock", "asc"));
    } else if (sortBy === 'Price: Low to High') {
      orderConstraints.push(fireOrderBy("minPrice", "asc"));
    } else if (sortBy === 'Price: High to Low') {
      orderConstraints.push(fireOrderBy("minPrice", "desc"));
    } else {
      orderConstraints.push(fireOrderBy("time", "desc"));
    }

    const fullConstraints = [
      ...whereConstraints,
      ...orderConstraints,
      limit(pageSize + 1)
    ];

    if (lastDoc) {
      fullConstraints.push(startAfter(lastDoc));
    }

    let snap;
    try {
      // 1. Try full composite server query
      const q = query(collection(fireDB, "products"), ...fullConstraints);
      snap = await getDocs(q);
    } catch (err) {
      console.warn("Composite query index notice. Falling back to filter-preserving query:", err);
      try {
        // 2. Fallback to where-only query with startAfter pagination (preserves filters & pagination on server!)
        const simpleConstraints = [...whereConstraints, limit(pageSize + 1)];
        if (lastDoc) simpleConstraints.push(startAfter(lastDoc));
        const simpleQ = query(collection(fireDB, "products"), ...simpleConstraints);
        snap = await getDocs(simpleQ);
      } catch (err2) {
        console.warn("Unconstrained fallback with in-memory filter:", err2);
        // 3. Fallback to paginated collection read
        const fallbackConstraints = [limit(pageSize + 1)];
        if (lastDoc) fallbackConstraints.push(startAfter(lastDoc));
        snap = await getDocs(query(collection(fireDB, "products"), ...fallbackConstraints));
      }
    }

    const docs = snap.docs;
    
    // Process and normalize product objects
    let products = docs.map((d) => {
      const data = d.data();
      const price = data.price || (data.variants && data.variants.length > 0 ? String(data.variants[0].price) : "");
      const imageUrl = data.imageUrl || (data.images && data.images.length > 0 ? data.images[0] : "");
      return {
        ...data,
        id: d.id,
        price,
        imageUrl,
        isActive: data.isActive !== false,
        minPrice: data.minPrice ?? computeMinPrice(data),
        totalStock: data.totalStock ?? computeTotalStock(data),
        docSnap: d
      };
    });

    // Enforce in-memory filtering guarantee if fallback query was used
    if (category && category !== 'ALL') {
      products = products.filter(p => p.category === category);
    }
    if (statusFilter && statusFilter !== 'ALL') {
      const isLive = statusFilter === 'LIVE';
      products = products.filter(p => p.isActive === isLive);
    }
    if (stockFilter && stockFilter !== 'ALL') {
      if (stockFilter === 'OUT_OF_STOCK') products = products.filter(p => (p.totalStock || 0) <= 0);
      if (stockFilter === 'LOW_STOCK') products = products.filter(p => (p.totalStock || 0) > 0 && (p.totalStock || 0) <= 5);
      if (stockFilter === 'IN_STOCK') products = products.filter(p => (p.totalStock || 0) > 5);
    }

    // In-memory sorting for consistency
    if (sortBy === 'Price: Low to High') {
      products.sort((a, b) => Number(a.minPrice || a.price || 0) - Number(b.minPrice || b.price || 0));
    } else if (sortBy === 'Price: High to Low') {
      products.sort((a, b) => Number(b.minPrice || b.price || 0) - Number(a.minPrice || a.price || 0));
    }

    const hasMore = products.length > pageSize;
    const pageProducts = hasMore ? products.slice(0, pageSize) : products;
    const lastVisible = pageProducts.length > 0 ? pageProducts[pageProducts.length - 1].docSnap : null;
    const cleanProducts = pageProducts.map(({ docSnap, ...rest }) => rest);

    return { products: cleanProducts, lastDoc: lastVisible, hasMore };
  },

  /**
   * Fetches paginated products for Client-Facing AllProducts (always isActive == true).
   * Supports category, price range, and server-side sorting with cursor pagination.
   */
  async getProductsPage({ pageSize = 12, lastDoc = null, category = '', maxPrice = '', sortBy = 'Featured' }) {
    const { limit, startAfter, orderBy: fireOrderBy } = await import('firebase/firestore');
    
    const whereConstraints = [where("isActive", "==", true)];

    if (category && category.trim() !== '') {
      whereConstraints.push(where("category", "==", category));
    }

    const numMaxPrice = Number(maxPrice);
    const isPriceFilterActive = !isNaN(numMaxPrice) && numMaxPrice > 0;

    if (isPriceFilterActive) {
      whereConstraints.push(where("minPrice", "<=", numMaxPrice));
    }

    const orderConstraints = [];
    if (isPriceFilterActive) {
      // Inequality rule: first orderBy must be minPrice
      orderConstraints.push(fireOrderBy("minPrice", sortBy === 'Price: High to Low' ? "desc" : "asc"));
    } else if (sortBy === 'Price: Low to High') {
      orderConstraints.push(fireOrderBy("minPrice", "asc"));
    } else if (sortBy === 'Price: High to Low') {
      orderConstraints.push(fireOrderBy("minPrice", "desc"));
    } else {
      orderConstraints.push(fireOrderBy("time", "desc"));
    }

    const fullConstraints = [
      ...whereConstraints,
      ...orderConstraints,
      limit(pageSize + 1)
    ];

    if (lastDoc) {
      fullConstraints.push(startAfter(lastDoc));
    }

    let snap;
    try {
      const q = query(collection(fireDB, "products"), ...fullConstraints);
      snap = await getDocs(q);
    } catch (err) {
      console.warn("Client query index notice. Falling back to filter-preserving query:", err);
      try {
        const simpleConstraints = [...whereConstraints, limit(pageSize + 1)];
        if (lastDoc) simpleConstraints.push(startAfter(lastDoc));
        const simpleQ = query(collection(fireDB, "products"), ...simpleConstraints);
        snap = await getDocs(simpleQ);
      } catch (err2) {
        const fallbackConstraints = [limit(pageSize + 1)];
        if (lastDoc) fallbackConstraints.push(startAfter(lastDoc));
        snap = await getDocs(query(collection(fireDB, "products"), ...fallbackConstraints));
      }
    }

    const docs = snap.docs;

    let products = docs.map((d) => {
      const data = d.data();
      const price = data.price || (data.variants && data.variants.length > 0 ? String(data.variants[0].price) : "");
      const imageUrl = data.imageUrl || (data.images && data.images.length > 0 ? data.images[0] : "");
      return {
        ...data,
        id: d.id,
        price,
        imageUrl,
        isActive: data.isActive !== false,
        minPrice: data.minPrice ?? computeMinPrice(data),
        totalStock: data.totalStock ?? computeTotalStock(data),
        docSnap: d
      };
    }).filter(p => p.isActive);

    // Enforce in-memory filtering guarantee if fallback query was used
    if (category && category.trim() !== '') {
      products = products.filter(p => p.category === category);
    }
    if (isPriceFilterActive) {
      products = products.filter(p => (p.minPrice || Number(p.price) || 0) <= numMaxPrice);
    }

    if (sortBy === 'Price: Low to High') {
      products.sort((a, b) => Number(a.minPrice || a.price || 0) - Number(b.minPrice || b.price || 0));
    } else if (sortBy === 'Price: High to Low') {
      products.sort((a, b) => Number(b.minPrice || b.price || 0) - Number(a.minPrice || a.price || 0));
    }

    const hasMore = products.length > pageSize;
    const pageProducts = hasMore ? products.slice(0, pageSize) : products;
    const lastVisible = pageProducts.length > 0 ? pageProducts[pageProducts.length - 1].docSnap : null;
    const cleanProducts = pageProducts.map(({ docSnap, ...rest }) => rest);

    return { products: cleanProducts, lastDoc: lastVisible, hasMore };
  },

  /**
   * Submits a user review for a product.
   * Schema matches ratings.model.js:
   *   { productId, userId, userName, rating, review, createdAt, updatedAt }
   */
  async submitRating({ productId, userId, userName, rating, review }) {
    const { addDoc, serverTimestamp } = await import('firebase/firestore');
    const ratingRef = collection(fireDB, 'ratings');
    const now = serverTimestamp();
    const docRef = await addDoc(ratingRef, {
      productId,
      userId,
      userName,
      rating: Number(rating),
      review: review.trim(),
      createdAt: now,
      updatedAt: now,
    });
    return {
      id: docRef.id,
      productId,
      userId,
      userName,
      rating: Number(rating),
      review: review.trim(),
      createdAt: { seconds: Date.now() / 1000 },
      updatedAt: { seconds: Date.now() / 1000 },
    };
  },
};
