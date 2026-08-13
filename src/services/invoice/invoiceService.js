import { fireDB, storage } from '../../firebase/FirebaseConfig.js';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { normalizeInvoiceData, invoiceRenderUtils } from '../../invoice/index.js';

export const invoiceService = {
  /**
   * Upload an admin custom PDF invoice for an order.
   * Uploads file to Storage first, updates Firestore metadata, and then cleans up oldStoragePath.
   */
  async uploadAdminInvoice(orderId, file, oldStoragePath = null) {
    if (!orderId) throw new Error("Order ID is required.");
    if (!file) throw new Error("Please select a file to upload.");

    // Validate file type
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      throw new Error("Invalid file type. Only PDF documents (.pdf) are allowed.");
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error("File size exceeds maximum limit of 5MB.");
    }

    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `invoices/${orderId}/${timestamp}_${sanitizedFileName}`;
    const storageRef = ref(storage, storagePath);

    // 1. Upload NEW file to Storage
    await uploadBytes(storageRef, file);

    // 2. Update Firestore Order document
    const orderRef = doc(fireDB, "orders", orderId);
    const invoiceMetadata = {
      uploaded: true,
      storagePath,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "ADMIN"
    };

    await updateDoc(orderRef, {
      invoice: invoiceMetadata
    });

    // 3. Delete OLD storage file after new upload + Firestore update succeeds
    if (oldStoragePath && oldStoragePath !== storagePath) {
      try {
        const oldRef = ref(storage, oldStoragePath);
        await deleteObject(oldRef);
      } catch (delErr) {
        console.warn("Could not remove old invoice file from storage:", delErr);
      }
    }

    return invoiceMetadata;
  },

  /**
   * Removes an admin-uploaded invoice, setting uploaded = false.
   */
  async removeAdminInvoice(orderId, currentStoragePath = null) {
    if (!orderId) throw new Error("Order ID is required.");

    if (currentStoragePath) {
      try {
        const oldRef = ref(storage, currentStoragePath);
        await deleteObject(oldRef);
      } catch (delErr) {
        console.warn("Could not delete invoice file from storage during removal:", delErr);
      }
    }

    const orderRef = doc(fireDB, "orders", orderId);
    await updateDoc(orderRef, {
      "invoice.uploaded": false,
      "invoice.storagePath": null,
      "invoice.fileName": null
    });
  },

  /**
   * Client-side download of an uploaded invoice file from Firebase Storage.
   */
  async downloadUploadedInvoice(storagePath, downloadFileName = "Invoice.pdf") {
    if (!storagePath) throw new Error("Storage path is missing.");

    try {
      const storageRef = ref(storage, storagePath);
      const url = await getDownloadURL(storageRef);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch file.");
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = downloadFileName.endsWith(".pdf") ? downloadFileName : `${downloadFileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Error downloading uploaded invoice:", err);
      throw new Error("The uploaded invoice file is currently unavailable. Please contact customer support.");
    }
  },

  /**
   * Client-side Tax Invoice PDF generation and download via global invoiceRenderUtils.
   */
  async generateClientInvoicePdf(orderData, siteConfig = {}) {
    return invoiceRenderUtils.generateClientInvoicePdf(orderData, siteConfig);
  }
};

export default invoiceService;
