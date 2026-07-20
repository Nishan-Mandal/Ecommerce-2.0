import { storage } from '../../firebase/FirebaseConfig.js';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';

export const uploadService = {
  /**
   * Helper to fetch authentication parameters for ImageKit
   */
  async getImageKitAuthParams() {
    const authEndpoint = import.meta.env.VITE_IMAGEKIT_AUTHENTICATION_ENDPOINT;
    const localPrivateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY_LOCAL;

    if (authEndpoint) {
      const res = await fetch(authEndpoint);
      if (!res.ok) throw new Error("Failed to fetch ImageKit auth params from endpoint");
      return await res.json(); // returns { signature, token, expire }
    } else if (localPrivateKey) {
      // Direct local testing fallback: use basic authorization header
      return { useBasicAuth: true, token: btoa(localPrivateKey + ":") };
    }
    throw new Error("ImageKit requires either VITE_IMAGEKIT_AUTHENTICATION_ENDPOINT or VITE_IMAGEKIT_PRIVATE_KEY_LOCAL configuration");
  },

  /**
   * Upload to Cloudinary using XMLHttpRequest to support progress tracking
   */
  uploadToCloudinary(file, onProgress) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return Promise.reject(new Error("Cloudinary environment variables (VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET) are missing."));
    }

    return new Promise((resolve, reject) => {
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const xhr = new XMLHttpRequest();
      const fd = new FormData();

      xhr.open("POST", url, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data.secure_url);
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error(`Cloudinary upload failed: ${xhr.responseText}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during Cloudinary upload"));

      fd.append("upload_preset", uploadPreset);
      fd.append("file", file);
      xhr.send(fd);
    });
  },

  /**
   * Upload to ImageKit using XMLHttpRequest to support progress tracking
   */
  uploadToImageKit(file, onProgress) {
    const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

    if (!publicKey) {
      return Promise.reject(new Error("ImageKit public key (VITE_IMAGEKIT_PUBLIC_KEY) is missing."));
    }

    return new Promise(async (resolve, reject) => {
      try {
        const authData = await this.getImageKitAuthParams();
        const url = "https://upload.imagekit.io/api/v1/files/upload";
        const xhr = new XMLHttpRequest();
        const fd = new FormData();

        xhr.open("POST", url, true);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data.url);
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`ImageKit upload failed: ${xhr.responseText}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during ImageKit upload"));

        fd.append("file", file);
        fd.append("fileName", `${Date.now()}_${file.name}`);
        fd.append("publicKey", publicKey);

        if (authData.useBasicAuth) {
          xhr.setRequestHeader("Authorization", `Basic ${authData.token}`);
        } else {
          fd.append("signature", authData.signature);
          fd.append("token", authData.token);
          fd.append("expire", authData.expire);
        }

        xhr.send(fd);
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   * Original Firebase Upload function
   */
  uploadFirebaseImage(file, onProgress) {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  },

  /**
   * Uploads a file to Firebase Storage and returns its download URL (fallback / generic helper)
   */
  async uploadFile(file, path = 'uploads') {
    const provider = (import.meta.env.VITE_IMAGE_UPLOAD_PROVIDER || "firebase").toLowerCase();
    if (provider === "firebase") {
      const storageRef = ref(storage, `${path}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } else {
      return this.uploadProductImage(file);
    }
  },

  /**
   * Main entrypoint for product image uploads. Dispatches to the active provider.
   */
  uploadProductImage(file, onProgress) {
    const provider = (import.meta.env.VITE_IMAGE_UPLOAD_PROVIDER || "firebase").toLowerCase();
    switch (provider) {
      case "cloudinary":
        return this.uploadToCloudinary(file, onProgress);
      case "imagekit":
        return this.uploadToImageKit(file, onProgress);
      case "firebase":
      default:
        return this.uploadFirebaseImage(file, onProgress);
    }
  },

  /**
   * Deletes a product image from storage by its URL
   */
  async deleteProductImage(imageUrl) {
    if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
      const fileRef = ref(storage, imageUrl);
      await deleteObject(fileRef);
    }
  }
};
