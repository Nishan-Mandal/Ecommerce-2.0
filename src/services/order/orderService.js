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
  async getOrders(userId, email) {
    if (!userId) return [];
    
    let result;
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'kingshukdash123@gmail.com';
    
    if (email === adminEmail) {
      result = await getDocs(collection(fireDB, "orders"));
    } else {
      result = await getDocs(query(collection(fireDB, "orders"), where("userid", "==", userId)));
    }
    
    const ordersArray = [];
    result.forEach((doc) => {
      ordersArray.push(doc.data());
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
