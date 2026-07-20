import { fireDB } from '../../firebase/FirebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';

export const blogService = {
  /**
   * Fetches all blog entries from Firestore
   */
  async getBlogs() {
    const blogData = await getDocs(collection(fireDB, "blog"));
    const blogArray = [];
    blogData.forEach((doc) => {
      blogArray.push(doc.data());
    });
    return blogArray;
  }
};
