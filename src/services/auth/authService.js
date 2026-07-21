import { auth, fireDB } from '../../firebase/FirebaseConfig.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const authService = {
  /**
   * Logs in a user with email and password
   */
  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  },

  /**
   * Signs up a new user, saves details to Firestore, and logs them in
   */
  async signup(name, email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    const userProfile = {
      name: name,
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role: "USER",
      time: Timestamp.now()
    };
    
    await addDoc(collection(fireDB, "users"), userProfile);
    
    // Auto login
    const loginCredential = await signInWithEmailAndPassword(auth, email, password);
    return loginCredential;
  },

  /**
   * Logs out the current user
   */
  async logout() {
    await signOut(auth);
  },

  /**
   * Listens to auth state changes
   */
  onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
  }
};
