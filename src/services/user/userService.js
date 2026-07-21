import { fireDB } from '../../firebase/FirebaseConfig.js';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  doc,
  updateDoc
} from 'firebase/firestore';

export const userService = {
  /**
   * Fetches all registered users (Admin only)
   */
  async getUsers() {
    const result = await getDocs(collection(fireDB, "users"));
    const usersArray = [];
    result.forEach((doc) => {
      usersArray.push(doc.data());
    });
    return usersArray;
  },

  /**
   * Retrieves the name of a specific user by their UID
   */
  async getUserName(userId) {
    if (!userId) return '';
    const q = query(collection(fireDB, "users"), where("uid", "==", userId));
    const result = await getDocs(q);
    let name = '';
    result.forEach((doc) => {
      name = doc.data().name;
    });
    return name;
  },

  /**
   * Fetches the complete profile of a user by their UID
   */
  async getUserProfile(userId) {
    if (!userId) return null;
    const q = query(collection(fireDB, "users"), where("uid", "==", userId));
    const result = await getDocs(q);
    let profile = null;
    result.forEach((doc) => {
      profile = { docId: doc.id, ...doc.data() };
    });
    return profile;
  },

  /**
   * Updates an existing user profile document in Firestore
   */
  async updateUserProfile(docId, updatedData) {
    if (!docId) throw new Error("Document ID is required to update profile");
    const docRef = doc(fireDB, "users", docId);
    await updateDoc(docRef, updatedData);
  }
};
