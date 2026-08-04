import { useState } from 'react';
import { productService } from '../../services/product/productService.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { uploadService } from '../../services/upload/uploadService.js';
import { mediaService } from '../../services/media/mediaService.js';
import { generateVariantCombinations } from '../../utils/variantUtils.js';

/**
 * Helper to flatten and sanitize arrays before sending to Firestore
 * Prevents "FirebaseError: Nested arrays are not supported"
 */
const sanitizeProductForFirestore = (data) => {
  if (!data || typeof data !== 'object') return data;
  const clean = { ...data };

  // Flatten images array and filter out non-strings
  if (Array.isArray(clean.images)) {
    clean.images = clean.images.flat(Infinity).filter(img => typeof img === 'string' && img.trim() !== '');
  } else {
    clean.images = typeof clean.imageUrl === 'string' && clean.imageUrl ? [clean.imageUrl] : [];
  }

  // Ensure imageUrl is a string
  if (typeof clean.imageUrl !== 'string') {
    clean.imageUrl = clean.images[0] || '';
  }

  // Flatten tags array
  if (Array.isArray(clean.tags)) {
    clean.tags = clean.tags.flat(Infinity).filter(t => typeof t === 'string' && t.trim() !== '');
  } else {
    clean.tags = [];
  }

  // Flatten variants and variant images
  if (Array.isArray(clean.variants)) {
    clean.variants = clean.variants.map(v => {
      if (!v || typeof v !== 'object') return v;
      const vClean = { ...v };
      if (Array.isArray(vClean.images)) {
        vClean.images = vClean.images.flat(Infinity).filter(img => typeof img === 'string' && img.trim() !== '');
      } else {
        vClean.images = [];
      }
      return vClean;
    });
  } else {
    clean.variants = [];
  }

  // Flatten variantTypes values
  if (Array.isArray(clean.variantTypes)) {
    clean.variantTypes = clean.variantTypes.map(vt => {
      if (!vt || typeof vt !== 'object') return vt;
      const vtClean = { ...vt };
      if (Array.isArray(vtClean.values)) {
        vtClean.values = vtClean.values.flat(Infinity).filter(val => typeof val === 'string' && val.trim() !== '');
      } else {
        vtClean.values = [];
      }
      return vtClean;
    });
  } else {
    clean.variantTypes = [];
  }

  return clean;
};

/**
 * useAdmin Hook
 * Manages admin catalog forms, product creation, updates, and deletes.
 * Supports the updated product schema with brand, tags, and images arrays.
 */
export default function useAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [variantUploadingIndex, setVariantUploadingIndex] = useState(null);

  const [productForm, setProductForm] = useState({
    id: '',
    brand: '',
    title: '',
    isActive: true,
    hasVariants: false,
    price: '',
    originalPrice: '',
    inStock: '',
    imageUrl: '',
    category: '',
    description: '',
    tags: [],
    images: [],
    variants: [],
    variantTypes: [],
  });

  const edithandle = (item) => {
    setProductForm({
      id: item.id || '',
      brand: item.brand || '',
      title: item.title || '',
      isActive: item.isActive !== false,
      hasVariants: item.hasVariants ?? (Array.isArray(item.variants) && item.variants.length > 0),
      price: item.price ?? '',
      originalPrice: item.originalPrice ?? '',
      inStock: item.inStock ?? '',
      imageUrl: item.imageUrl || '',
      category: item.category || '',
      description: item.description || '',
      tags: Array.isArray(item.tags) ? item.tags : [],
      images: Array.isArray(item.images) ? item.images : (item.imageUrl ? [item.imageUrl] : []),
      variants: Array.isArray(item.variants) ? item.variants : [],
      variantTypes: Array.isArray(item.variantTypes) ? item.variantTypes : [],
    });
  };

  const isDescriptionValid = (desc) => {
    if (!desc) return false;
    if (typeof desc === 'string') return desc.trim() !== '';
    if (typeof desc === 'object') {
      return Boolean(desc.short || (desc.sections && desc.sections.length > 0));
    }
    return false;
  };

  const addProduct = async () => {
    if (
      !productForm.title ||
      !productForm.brand ||
      !productForm.category ||
      !isDescriptionValid(productForm.description)
    ) {
      return toast.error('Please fill all required basic fields (Title, Brand, Category, Description)');
    }

    if (!productForm.hasVariants) {
      if (!productForm.price || Number(productForm.price) <= 0) {
        return toast.error('Please enter a valid base price for products without variants');
      }
      if (productForm.inStock === '' || productForm.inStock === undefined || Number(productForm.inStock) < 0) {
        return toast.error('Please enter in-stock quantity');
      }
    } else {
      if (!productForm.variants || productForm.variants.length === 0) {
        return toast.error('Please generate or add at least one product variant');
      }
    }

    if (!productForm.imageUrl && (!productForm.images || productForm.images.length === 0)) {
      return toast.error('Please upload at least one image');
    }

    setLoading(true);
    try {
      const rawData = {
        ...productForm,
        isActive: productForm.isActive !== false,
        hasVariants: Boolean(productForm.hasVariants),
        price: productForm.hasVariants ? null : Number(productForm.price) || 0,
        originalPrice: productForm.hasVariants ? null : (productForm.originalPrice ? Number(productForm.originalPrice) : null),
        inStock: productForm.hasVariants ? null : Number(productForm.inStock) || 0,
        variantTypes: productForm.hasVariants ? (productForm.variantTypes || []) : [],
        variants: productForm.hasVariants ? (productForm.variants || []) : [],
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      };

      const docData = sanitizeProductForFirestore(rawData);
      await productService.createProduct(docData);
      toast.success("Product Added successfully");
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error("Error adding product: ", error);
      toast.error("Failed to add product: " + (error.message || "Invalid data structure"));
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const updateProduct = async () => {
    if (
      !productForm.title ||
      !productForm.brand ||
      !productForm.category ||
      !isDescriptionValid(productForm.description)
    ) {
      return toast.error('Please fill all required basic fields (Title, Brand, Category, Description)');
    }

    if (!productForm.hasVariants) {
      if (!productForm.price || Number(productForm.price) <= 0) {
        return toast.error('Please enter a valid base price for products without variants');
      }
      if (productForm.inStock === '' || productForm.inStock === undefined || Number(productForm.inStock) < 0) {
        return toast.error('Please enter in-stock quantity');
      }
    } else {
      if (!productForm.variants || productForm.variants.length === 0) {
        return toast.error('Please generate or add at least one product variant');
      }
    }

    if (!productForm.imageUrl && (!productForm.images || productForm.images.length === 0)) {
      return toast.error('Please upload at least one image');
    }

    setLoading(true);
    try {
      const rawData = {
        ...productForm,
        isActive: productForm.isActive !== false,
        hasVariants: Boolean(productForm.hasVariants),
        price: productForm.hasVariants ? null : Number(productForm.price) || 0,
        originalPrice: productForm.hasVariants ? null : (productForm.originalPrice ? Number(productForm.originalPrice) : null),
        inStock: productForm.hasVariants ? null : Number(productForm.inStock) || 0,
        variantTypes: productForm.hasVariants ? (productForm.variantTypes || []) : [],
        variants: productForm.hasVariants ? (productForm.variants || []) : [],
      };

      const updateData = sanitizeProductForFirestore(rawData);
      await productService.updateProduct(productForm.id, updateData);
      toast.success("Product Updated successfully");
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      console.error("Error updating product: ", error);
      toast.error("Failed to update product: " + (error.message || "Invalid data structure"));
    } finally {
      setLoading(false);
    }
  };

  const toggleProductActiveStatus = async (item) => {
    if (!item || !item.id) return;
    const newStatus = !(item.isActive !== false);
    setLoading(true);
    try {
      await productService.updateProduct(item.id, { isActive: newStatus });
      toast.success(`Product "${item.title || 'Item'}" marked as ${newStatus ? 'Live' : 'Draft'}!`);
    } catch (error) {
      console.error("Error toggling active status: ", error);
      toast.error("Failed to update product status");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (item) => {
    setLoading(true);
    try {
      await productService.deleteProduct(item.id);
      toast.success('Product Deleted successfully');
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductForm({
      id: '',
      brand: '',
      title: '',
      isActive: true,
      hasVariants: false,
      price: '',
      originalPrice: '',
      inStock: '',
      imageUrl: '',
      category: '',
      description: '',
      tags: [],
      images: [],
      variants: [],
      variantTypes: [],
    });
  };

  // Event handlers for state mutations
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const downloadURL = await uploadService.uploadProductImage(file, setUploadProgress);
        await mediaService.saveMedia(downloadURL, file.name);
        setProductForm((prev) => {
          const newImages = [...(prev.images || []), downloadURL];
          return {
            ...prev,
            images: newImages,
            imageUrl: prev.imageUrl || downloadURL
          };
        });
      }
      toast.success("Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Some uploads failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImageDelete = async (indexToDelete) => {
    const imageUrlToDelete = productForm.images[indexToDelete];
    
    setProductForm((prev) => {
      const newImages = (prev.images || []).filter((_, idx) => idx !== indexToDelete);
      let newPrimaryUrl = prev.imageUrl;
      if (prev.imageUrl === imageUrlToDelete) {
        newPrimaryUrl = newImages.length > 0 ? newImages[0] : '';
      }
      return {
        ...prev,
        images: newImages,
        imageUrl: newPrimaryUrl
      };
    });

    try {
      await uploadService.deleteProductImage(imageUrlToDelete);
      toast.success("Image deleted");
    } catch (err) {
      console.warn("Storage deletion warning:", err);
    }
  };

  const handleVariantImageUpload = async (variantIndex, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setVariantUploadingIndex(variantIndex);
    setUploadProgress(0);

    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const downloadURL = await uploadService.uploadProductImage(file, setUploadProgress);
        await mediaService.saveMedia(downloadURL, file.name);
        uploadedUrls.push(downloadURL);
      }

      setProductForm((prev) => {
        const newVariants = [...(prev.variants || [])];
        const existingImages = newVariants[variantIndex].images || [];
        newVariants[variantIndex] = {
          ...newVariants[variantIndex],
          images: [...existingImages, ...uploadedUrls]
        };
        return {
          ...prev,
          variants: newVariants
        };
      });
      toast.success("Variant images uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Variant image upload failed");
    } finally {
      setVariantUploadingIndex(null);
      setUploadProgress(0);
    }
  };

  const handleVariantImageDelete = async (variantIndex, imageIndexToDelete) => {
    let imageUrlToDelete = '';
    
    setProductForm((prev) => {
      const newVariants = [...(prev.variants || [])];
      const existingImages = newVariants[variantIndex].images || [];
      imageUrlToDelete = existingImages[imageIndexToDelete];
      const newImages = existingImages.filter((_, idx) => idx !== imageIndexToDelete);
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        images: newImages
      };
      return {
        ...prev,
        variants: newVariants
      };
    });

    if (imageUrlToDelete) {
      try {
        await uploadService.deleteProductImage(imageUrlToDelete);
        toast.success("Variant image deleted");
      } catch (err) {
        console.warn("Storage deletion warning:", err);
      }
    }
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const parsedTags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setProductForm(prev => ({
      ...prev,
      tags: parsedTags
    }));
  };

  const generateCombinations = () => {
    const generated = generateVariantCombinations(productForm);
    if (generated.length === 0) return;
    setProductForm(prev => ({
      ...prev,
      variants: generated
    }));
    toast.info(`Generated ${generated.length} variant combinations`);
  };

  const addManualVariant = () => {
    const attributes = {};
    if (productForm.variantTypes && productForm.variantTypes.length > 0) {
      productForm.variantTypes.forEach(vt => {
        attributes[vt.name] = vt.values?.[0] || '';
      });
    }
    setProductForm(prev => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        {
          attributes,
          price: Number(productForm.price) || 0,
          originalPrice: Number(productForm.price) || 0,
          inStock: 10,
          isActive: true,
          images: []
        }
      ]
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setProductForm(prev => {
      const newVariants = [...(prev.variants || [])];
      newVariants[index] = {
        ...newVariants[index],
        [field]: value
      };
      return {
        ...prev,
        variants: newVariants
      };
    });
  };

  const deleteVariant = (index) => {
    setProductForm(prev => ({
      ...prev,
      variants: (prev.variants || []).filter((_, idx) => idx !== index)
    }));
  };

  const addVariantType = () => {
    setProductForm(prev => ({
      ...prev,
      variantTypes: [...(prev.variantTypes || []), { name: '', values: [] }]
    }));
  };

  const deleteVariantType = (typeIndex) => {
    setProductForm(prev => {
      const newTypes = (prev.variantTypes || []).filter((_, idx) => idx !== typeIndex);
      return {
        ...prev,
        variantTypes: newTypes
      };
    });
  };

  const handleVariantTypeNameChange = (typeIndex, name) => {
    setProductForm(prev => {
      const newTypes = [...(prev.variantTypes || [])];
      newTypes[typeIndex] = { ...newTypes[typeIndex], name };
      return {
        ...prev,
        variantTypes: newTypes
      };
    });
  };

  const handleVariantTypeValuesChange = (typeIndex, values) => {
    const valuesArray = Array.isArray(values)
      ? values
      : typeof values === 'string'
        ? values.split(',').map(v => v.trim()).filter(v => v !== '')
        : [];
    setProductForm(prev => {
      const newTypes = [...(prev.variantTypes || [])];
      newTypes[typeIndex] = { ...newTypes[typeIndex], values: valuesArray };
      return {
        ...prev,
        variantTypes: newTypes
      };
    });
  };

  const handleCancel = (isModal, onClose) => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate('/dashboard', { state: { activeView: 'products' } });
    }
  };

  return {
    loading,
    uploading,
    uploadProgress,
    productForm,
    setProductForm,
    edithandle,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActiveStatus,
    resetForm,
    handleImageUpload,
    handleImageDelete,
    handleTagsChange,
    generateCombinations,
    addManualVariant,
    handleVariantChange,
    deleteVariant,
    addVariantType,
    deleteVariantType,
    handleVariantTypeNameChange,
    handleVariantTypeValuesChange,
    handleVariantImageUpload,
    handleVariantImageDelete,
    variantUploadingIndex,
    handleCancel
  };
}
