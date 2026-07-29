import { fireDB } from '../../firebase/FirebaseConfig.js';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  deleteField
} from 'firebase/firestore';

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
    await updateDoc(docRef, updatedData);
  },

  /**
   * Fetches saved addresses for a user with fallback to user profile address and past orders
   */
  async getAddresses(uid) {
    if (!uid) return [];
    let result = await getUserDocRef(uid);
    let savedAddrs = Array.isArray(result?.data?.addresses) ? [...result.data.addresses] : [];

    // Check single address object in user profile (profile.address)
    if (savedAddrs.length === 0 && result?.data?.address) {
      const pAddr = result.data.address;
      if (pAddr.fullName || pAddr.street || pAddr.pincode || pAddr.houseNo || pAddr.phone) {
        const profileAddrObj = {
          addressId: `addr_profile_${result.docId}`,
          fullName: pAddr.fullName || result.data.name || "",
          phone: pAddr.phone || result.data.phone || "",
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
      return savedAddrs;
    }

    // Fallback: Check past orders if no saved addresses exist yet
    try {
      const ordersQ = query(collection(fireDB, "orders"), where("userid", "==", uid));
      const ordersSnap = await getDocs(ordersQ);
      let orderAddrs = [];

      ordersSnap.forEach((oDoc) => {
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
            isDefault: true,
          };
          if (!orderAddrs.some((a) => a.phone === addrObj.phone && a.street === addrObj.street)) {
            orderAddrs.push(addrObj);
          }
        }
      });

      // Try alternate field query (userId)
      if (orderAddrs.length === 0) {
        const altOrdersQ = query(collection(fireDB, "orders"), where("userId", "==", uid));
        const altSnap = await getDocs(altOrdersQ);
        altSnap.forEach((oDoc) => {
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
              isDefault: true,
            };
            if (!orderAddrs.some((a) => a.phone === addrObj.phone && a.street === addrObj.street)) {
              orderAddrs.push(addrObj);
            }
          }
        });
      }

      if (orderAddrs.length > 0) {
        // Save back to user profile for future checkouts
        if (result?.docRef) {
          await updateDoc(result.docRef, { addresses: orderAddrs });
        }
        return orderAddrs;
      }
    } catch (err) {
      console.warn("Error fetching fallback addresses from past orders:", err);
    }

    return [];
  },

  /**
   * Adds a new address to the user's addresses array
   */
  async addAddress(uid, address) {
    if (!uid) throw new Error("UID required");
    let result = await getUserDocRef(uid);
    
    // If user profile doc doesn't exist yet, create doc using uid
    let targetRef = result?.docRef;
    if (!targetRef) {
      targetRef = doc(fireDB, "users", uid);
      await updateDoc(targetRef, { uid, addresses: [] }).catch(async () => {
        const { setDoc } = await import("firebase/firestore");
        await setDoc(targetRef, { uid, addresses: [] });
      });
    }

    const newAddress = {
      ...address,
      addressId: `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    await updateDoc(targetRef, {
      addresses: arrayUnion(newAddress),
    });
    return newAddress;
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
    const addresses = Array.isArray(result?.data?.addresses) ? [...result.data.addresses] : [];
    const existingIndex = addresses.findIndex(
      (a) => a.addressId === addressId || a.id === addressId || `addr_profile_${result?.docId}` === addressId
    );

    const updatedObj = {
      ...(existingIndex >= 0 ? addresses[existingIndex] : {}),
      ...updatedFields,
      addressId: addressId && !addressId.startsWith("addr_profile_") && !addressId.startsWith("addr_past_")
        ? addressId
        : `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      addresses[existingIndex] = updatedObj;
    } else {
      addresses.push(updatedObj);
    }

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

    return updatedObj;
  },

  /**
   * Removes an address from the user's addresses array
   */
  async deleteAddress(uid, addressId) {
    if (!uid || !addressId) throw new Error("UID and addressId required");
    const result = await getUserDocRef(uid);
    if (!result) throw new Error("User profile not found");
    
    const existingAddrs = Array.isArray(result.data.addresses) ? result.data.addresses : [];
    const updatedAddrs = existingAddrs.filter(
      (a) => a.addressId !== addressId && a.id !== addressId && `addr_profile_${result.docId}` !== addressId
    );

    const updatePayload = {
      addresses: updatedAddrs,
    };

    if (addressId.startsWith("addr_profile_") || (result.data.address && result.data.address.pincode)) {
      updatePayload.address = deleteField();
    }

    await updateDoc(result.docRef, updatePayload);
  },
};

