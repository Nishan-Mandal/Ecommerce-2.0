import { auth, fireDB } from '../../firebase/FirebaseConfig.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore';

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
   * Initializes Firebase reCAPTCHA verifier for Phone Auth
   */
  setupRecaptcha(containerId = "recaptcha-container", size = "invisible") {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (err) {
        console.warn("Clearing previous recaptcha verifier:", err);
      }
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: size,
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        console.warn("reCAPTCHA expired. Please retry.");
      }
    });

    return window.recaptchaVerifier;
  },

  /**
   * Sends OTP to phone number using Firebase Auth
   */
  async sendOtp(phoneNumber, recaptchaVerifier) {
    if (!phoneNumber) throw new Error("Phone number is required");
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${digitsOnly}`;
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    return confirmationResult;
  },

  /**
   * Verifies OTP code and signs in user
   */
  async verifyOtp(confirmationResult, otpCode) {
    if (!confirmationResult) throw new Error("No active OTP request found");
    if (!otpCode) throw new Error("OTP code is required");
    
    const userCredential = await confirmationResult.confirm(otpCode);
    const user = userCredential.user;

    // Check if user profile already exists in Firestore users collection
    const q = query(collection(fireDB, "users"), where("uid", "==", user.uid));
    const snap = await getDocs(q);

    if (snap.empty) {
      const userRef = doc(fireDB, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || `User_${user.phoneNumber?.slice(-4)}` || "User",
        phone: user.phoneNumber || "",
        phoneVerified: true,
        role: "USER",
        time: Timestamp.now()
      }, { merge: true });
    }

    return userCredential;
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
