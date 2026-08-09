import { fireDB } from '../../firebase/FirebaseConfig.js';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  deleteDoc,
  arrayUnion,
  deleteField
} from 'firebase/firestore';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Helper to guarantee that exactly one address in the list has isDefault = true.
 * If multiple are marked as default, only the first remains default.
 * If none are marked as default, the first address (index 0) becomes default.
 */
export function ensureSingleDefaultAddress(addresses) {
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return [];
  }

  let defaultIndex = addresses.findIndex((a) => Boolean(a.isDefault));
  if (defaultIndex === -1) {
    defaultIndex = 0;
  }

  return addresses.map((addr, index) => ({
    ...addr,
    isDefault: index === defaultIndex,
  }));
}

const getUserDocRef = async (uid) => {
  if (!uid) return null;
  // 1. Try direct doc lookup by UID
  const directRef = doc(fireDB, "users", uid);
  const directSnap = await getDoc(directRef);
  if (directSnap.exists()) {
    return { docRef: directRef, data: directSnap.data(), docId: directSnap.id };
  }
  // 2. Query where uid == uid
  const q = query(collection(fireDB, "users"), where("uid", "==", uid));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return { docRef: snap.docs[0].ref, data: snap.docs[0].data(), docId: snap.docs[0].id };
  }
  return null;
};

export const userService = {
  /**
   * Fetches all registered users (Admin only)
   */
  async getUsers() {
    const result = await getDocs(collection(fireDB, "users"));
    const usersArray = [];
    result.forEach((docSnap) => {
      usersArray.push({ docId: docSnap.id, ...docSnap.data() });
    });
    return usersArray;
  },

  /**
   * Retrieves the name of a specific user by their UID
   */
  async getUserName(userId) {
    if (!userId) return '';
    const result = await getUserDocRef(userId);
    return result?.data?.name || '';
  },

  /**
   * Fetches the complete profile of a user by their UID
   */
  async getUserProfile(userId) {
    if (!userId) return null;
    const result = await getUserDocRef(userId);
    if (!result) return null;
    return { docId: result.docId, ...result.data };
  },

  /**
   * Updates an existing user profile document in Firestore
   */
  async updateUserProfile(docId, updatedData) {
    if (!docId) throw new Error("Document ID is required to update profile");
    const docRef = doc(fireDB, "users", docId);
    await setDoc(docRef, { ...updatedData, uid: docId }, { merge: true });
  },

  /**
   * Fetches saved addresses for a user with fallback to user profile address and past orders
   */
  async getAddresses(uid) {
    if (!uid) return [];
    try {
      const directRef = doc(fireDB, "users", uid);
      const directSnap = await getDoc(directRef);
      let userData = directSnap.exists() ? directSnap.data() : null;
      let targetRef = directSnap.exists() ? directRef : null;
      let targetDocId = uid;

      if (!userData) {
        const q = query(collection(fireDB, "users"), where("uid", "==", uid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          userData = snap.docs[0].data();
          targetRef = snap.docs[0].ref;
          targetDocId = snap.docs[0].id;
        }
      }

      let savedAddrs = Array.isArray(userData?.addresses) ? [...userData.addresses] : [];

      if (savedAddrs.length === 0 && userData?.address) {
        const pAddr = userData.address;
        if (pAddr.fullName || pAddr.street || pAddr.pincode || pAddr.houseNo || pAddr.phone) {
          const profileAddrObj = {
            addressId: `addr_profile_${targetDocId}`,
            fullName: pAddr.fullName || userData.name || "",
            phone: pAddr.phone || userData.phone || "",
            houseNo: pAddr.houseNo || "",
            street: [pAddr.buildingName, pAddr.street].filter(Boolean).join(", ") || pAddr.street || "",
            landmark: pAddr.landmark || "",
            city: pAddr.city || "",
            state: pAddr.state || "",
            pincode: pAddr.pincode || "",
            addressType: pAddr.type || "HOME",
            isDefault: true,
          };
          savedAddrs.push(profileAddrObj);
        }
      }

      if (savedAddrs.length > 0) {
        return ensureSingleDefaultAddress(savedAddrs);
      }

      const [ordersSnap, altSnap] = await Promise.all([
        getDocs(query(collection(fireDB, "orders"), where("userid", "==", uid))).catch(() => null),
        getDocs(query(collection(fireDB, "orders"), where("userId", "==", uid))).catch(() => null),
      ]);

      let orderAddrs = [];
      const processSnap = (snap) => {
        if (snap && !snap.empty) {
          snap.forEach((oDoc) => {
            const oData = oDoc.data();
            const info = oData.addressInfo || oData.shippingAddress;
            if (info) {
              const addrObj = {
                addressId: `addr_past_${oDoc.id}`,
                fullName: info.name || info.fullName || "",
                phone: info.phoneNumber || info.phone || "",
                houseNo: info.houseNo || "",
                street: info.address || info.street || "",
                landmark: info.landmark || "",
                city: info.city || "",
                state: info.state || "",
                pincode: info.pincode || "",
                addressType: info.addressType || "HOME",
                isDefault: orderAddrs.length === 0,
              };
              if (!orderAddrs.some((a) => a.phone === addrObj.phone && a.street === addrObj.street)) {
                orderAddrs.push(addrObj);
              }
            }
          });
        }
      };

      processSnap(ordersSnap);
      processSnap(altSnap);

      if (orderAddrs.length > 0 && targetRef) {
        const sanitized = ensureSingleDefaultAddress(orderAddrs);
        await setDoc(targetRef, { addresses: sanitized }, { merge: true }).catch(() => {});
        return sanitized;
      }
    } catch (err) {
      console.warn("Error fetching addresses:", err);
    }

    return [];
  },

  /**
   * Adds a new address to the user's addresses array
   */
  async addAddress(uid, address) {
    if (!uid) throw new Error("UID required");
    let result = await getUserDocRef(uid);
    
    let targetRef = result?.docRef;
    if (!targetRef) {
      targetRef = doc(fireDB, "users", uid);
      await updateDoc(targetRef, { uid, addresses: [] }).catch(async () => {
        const { setDoc } = await import("firebase/firestore");
        await setDoc(targetRef, { uid, addresses: [] });
      });
    }

    const existingAddrs = Array.isArray(result?.data?.addresses) ? [...result.data.addresses] : [];
    const newAddressId = `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const shouldBeDefault = Boolean(address.isDefault) || existingAddrs.length === 0;

    const newAddress = {
      ...address,
      addressId: newAddressId,
      isDefault: shouldBeDefault,
      createdAt: new Date().toISOString(),
    };

    let rawList = existingAddrs.map((a) => ({
      ...a,
      isDefault: shouldBeDefault ? false : Boolean(a.isDefault),
    }));
    rawList.push(newAddress);

    const updatedAddrs = ensureSingleDefaultAddress(
      shouldBeDefault
        ? rawList.map(a => ({ ...a, isDefault: a.addressId === newAddressId }))
        : rawList
    );

    await updateDoc(targetRef, { addresses: updatedAddrs });
    const finalNewAddr = updatedAddrs.find(a => a.addressId === newAddressId) || newAddress;
    return { newAddress: finalNewAddr, addresses: updatedAddrs };
  },

  /**
   * Updates an existing address in the user's addresses array
   */
  async updateAddress(uid, addressId, updatedFields) {
    if (!uid) throw new Error("UID required");
    const result = await getUserDocRef(uid);
    let targetRef = result?.docRef;
    if (!targetRef) {
      targetRef = doc(fireDB, "users", uid);
    }
    const rawAddrs = Array.isArray(result?.data?.addresses) ? [...result.data.addresses] : [];
    const existingIndex = rawAddrs.findIndex(
      (a) => a.addressId === addressId || a.id === addressId || `addr_profile_${result?.docId}` === addressId
    );

    const targetAddrId = addressId && !addressId.startsWith("addr_profile_") && !addressId.startsWith("addr_past_")
      ? addressId
      : `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const isExplicitlyDefault = Boolean(updatedFields.isDefault);

    const updatedObj = {
      ...(existingIndex >= 0 ? rawAddrs[existingIndex] : {}),
      ...updatedFields,
      addressId: targetAddrId,
      isDefault: isExplicitlyDefault,
      updatedAt: new Date().toISOString(),
    };

    let rawList = rawAddrs.map((a, i) => {
      if (i === existingIndex || a.addressId === addressId) {
        return updatedObj;
      }
      return isExplicitlyDefault ? { ...a, isDefault: false } : a;
    });

    if (existingIndex < 0) {
      rawList.push(updatedObj);
    }

    let addresses = ensureSingleDefaultAddress(
      isExplicitlyDefault
        ? rawList.map(a => ({ ...a, isDefault: a.addressId === targetAddrId }))
        : rawList
    );

    const updatePayload = { addresses };

    if (result?.data?.address || addressId?.startsWith("addr_profile_")) {
      updatePayload.address = {
        fullName: updatedFields.fullName || updatedFields.name || "",
        phone: updatedFields.phone || "",
        houseNo: updatedFields.houseNo || "",
        street: updatedFields.street || "",
        landmark: updatedFields.landmark || "",
        city: updatedFields.city || "",
        state: updatedFields.state || "",
        pincode: updatedFields.pincode || "",
        type: updatedFields.addressType || "HOME",
      };
    }

    await updateDoc(targetRef, updatePayload).catch(async () => {
      const { setDoc } = await import("firebase/firestore");
      await setDoc(targetRef, updatePayload, { merge: true });
    });

    const finalUpdatedObj = addresses.find(a => a.addressId === targetAddrId) || updatedObj;
    return { updatedAddress: finalUpdatedObj, addresses };
  },

  /**
   * Removes an address from the user's addresses array
   */
  async deleteAddress(uid, addressId) {
    if (!uid || !addressId) throw new Error("UID and addressId required");
    const result = await getUserDocRef(uid);
    if (!result) throw new Error("User profile not found");
    
    const existingAddrs = Array.isArray(result.data.addresses) ? result.data.addresses : [];
    const filteredAddrs = existingAddrs.filter(
      (a) => a.addressId !== addressId && a.id !== addressId && `addr_profile_${result.docId}` !== addressId
    );

    const updatedAddrs = ensureSingleDefaultAddress(filteredAddrs);

    const updatePayload = {
      addresses: updatedAddrs,
    };

    await updateDoc(result.docRef, updatePayload);
    return updatedAddrs;
  },

  /**
   * Sets a specific address as default, ensuring all other addresses have isDefault = false
   */
  async setDefaultAddress(uid, addressId) {
    if (!uid || !addressId) throw new Error("UID and addressId required");
    const result = await getUserDocRef(uid);
    if (!result) throw new Error("User profile not found");

    const existingAddrs = Array.isArray(result.data.addresses) ? result.data.addresses : [];
    const updatedAddrs = existingAddrs.map((a) => ({
      ...a,
      isDefault: a.addressId === addressId || a.id === addressId || `addr_profile_${result.docId}` === addressId,
    }));

    const finalAddrs = ensureSingleDefaultAddress(updatedAddrs);
    await updateDoc(result.docRef, { addresses: finalAddrs });
    return finalAddrs;
  },

  /**
   * Creates a user/admin document in Firebase Auth (via secondary app) and Firestore
   */
  async createUser(userData) {
    let authUid = null;

    // 1. If password is provided, create Firebase Auth user via secondary app instance so admin remains logged in
    if (userData.email && userData.password) {
      try {
        const secondaryAppName = "SecondaryAdminCreator";
        const existingApps = getApps();
        const found = existingApps.find((a) => a.name === secondaryAppName);
        const secondaryApp = found || initializeApp(firebaseConfig, secondaryAppName);
        const secondaryAuth = getAuth(secondaryApp);
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, userData.email, userData.password);
        authUid = userCredential.user.uid;
      } catch (authErr) {
        console.error("Error creating Firebase Auth user:", authErr);
        throw authErr;
      }
    }

    // 2. Save user profile in Firestore users collection
    const docId = authUid || userData.uid || userData.email || `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const docRef = doc(fireDB, "users", docId);
    const payload = {
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      role: userData.role || "ADMIN",
      uid: docId,
      time: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    return payload;
  },

  /**
   * Updates user role (ADMIN / USER)
   */
  async updateUserRole(userId, newRole) {
    if (!userId) throw new Error("User ID is required");
    const result = await getUserDocRef(userId);
    const targetRef = result?.docRef || doc(fireDB, "users", userId);
    await setDoc(targetRef, { role: newRole }, { merge: true });
  },

  /**
   * Deletes a user / admin profile from Firestore
   */
  async deleteUser(userId) {
    if (!userId) throw new Error("User ID required");
    const result = await getUserDocRef(userId);
    const targetRef = result?.docRef || doc(fireDB, "users", userId);
    await deleteDoc(targetRef);
  },
};
