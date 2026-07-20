import { fireDB } from '../../firebase/FirebaseConfig.js';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const feedbackService = {
  /**
   * Submits user feedback to Firestore
   */
  async submitFeedback(feedbackData) {
    const docRef = await addDoc(collection(fireDB, "feedback"), {
      ...feedbackData,
      time: Timestamp.now()
    });
    return docRef;
  }
};
