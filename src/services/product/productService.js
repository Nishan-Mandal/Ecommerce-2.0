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
   * Adds a new product to the collection
   */
  async createProduct(productData) {
    const productRef = doc(collection(fireDB, "products"));
    const updatedProduct = {
      ...productData,
      id: productRef.id
    };
    await setDoc(productRef, updatedProduct);
    return updatedProduct;
  },

  /**
   * Updates an existing product document
   */
  async updateProduct(id, productData) {
    const productRef = doc(fireDB, 'products', id);
    await setDoc(productRef, productData, { merge: true });
  },

  /**
   * Deletes a product document by ID
   */
  async deleteProduct(id) {
    const productRef = doc(fireDB, 'products', id);
    await deleteDoc(productRef);
  },

  /**
   * Fetches paginated products using Firestore cursor queries
   */
  async getPaginatedProducts({ pageSize = 10, lastDoc = null, category = null }) {
    const { limit, startAfter } = await import('firebase/firestore');
    const constraints = [];
    if (category && category !== 'ALL') {
      constraints.push(where("category", "==", category));
    }
    constraints.push(limit(pageSize));
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    const q = query(collection(fireDB, "products"), ...constraints);
    const snap = await getDocs(q);
    const products = [];
    snap.forEach((d) => {
      const data = d.data();
      const price = data.price || (data.variants && data.variants.length > 0 ? String(data.variants[0].price) : "");
      const imageUrl = data.imageUrl || (data.images && data.images.length > 0 ? data.images[0] : "");
      products.push({
        ...data,
        id: d.id,
        price,
        imageUrl,
        docSnap: d
      });
    });
    const lastVisible = snap.docs[snap.docs.length - 1] || null;
    return { products, lastDoc: lastVisible, hasMore: snap.docs.length === pageSize };
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
