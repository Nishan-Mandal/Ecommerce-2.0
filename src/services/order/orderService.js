import { fireDB } from '../../firebase/FirebaseConfig.js';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc 
} from 'firebase/firestore';

export const orderService = {
  /**
   * Fetches orders from Firestore.
   * If the user is an admin, fetches all orders.
   * Otherwise, fetches orders matching the user's uid.
   */
  /**
   * Fetches orders from Firestore.
   * If the user is an admin, fetches all orders.
   * Otherwise, fetches orders matching the user's uid (checking both userId and userid fields).
   */
  async getOrders(userId, email) {
    if (!userId) return [];
    
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'kingshukdash123@gmail.com';
    const ordersMap = new Map();

    if (email && email.toLowerCase() === adminEmail.toLowerCase()) {
      const snap = await getDocs(collection(fireDB, "orders"));
      snap.forEach((doc) => ordersMap.set(doc.id, { docId: doc.id, ...doc.data() }));
    } else {
      // Query both userId and userid to handle legacy and Cloud Function order structures
      const q1 = query(collection(fireDB, "orders"), where("userId", "==", userId));
      const q2 = query(collection(fireDB, "orders"), where("userid", "==", userId));
      
      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      
      snap1.forEach((doc) => ordersMap.set(doc.id, { docId: doc.id, ...doc.data() }));
      snap2.forEach((doc) => ordersMap.set(doc.id, { docId: doc.id, ...doc.data() }));
    }
    
    const ordersArray = Array.from(ordersMap.values());
    
    // Sort descending by date / createdAt (newest orders first)
    ordersArray.sort((a, b) => {
      const timeA = a.createdAt?.seconds || (a.date?.seconds ? a.date.seconds : 0) || (typeof a.date === 'string' ? new Date(a.date).getTime() : 0);
      const timeB = b.createdAt?.seconds || (b.date?.seconds ? b.date.seconds : 0) || (typeof b.date === 'string' ? new Date(b.date).getTime() : 0);
      return timeB - timeA;
    });
    
    return ordersArray;
  },

  /**
   * Creates a new order in Firestore
   */
  async createOrder(orderInfo) {
    const docRef = await addDoc(collection(fireDB, "orders"), orderInfo);
    return docRef;
  }
};
