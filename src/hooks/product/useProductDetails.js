import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { productService } from '../../services/product/productService.js';
import { addToCart } from '../../redux/cartSlice';

/**
 * Fetches a single product from Firestore by route param :id.
 * Also exposes cart helpers and a selected image state for the gallery.
 */
export default function useProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(4.8);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  // ── Fetch product from Firestore ──────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        
        // Fetch and calculate ratings resiliently
        let ratingsData = [];
        try {
          ratingsData = await productService.getProductRatings(id);
        } catch (ratingErr) {
          console.warn("Failed to load ratings (check Firestore security rules):", ratingErr);
        }

        setRatings(ratingsData);
        if (ratingsData.length > 0) {
          const total = ratingsData.reduce((acc, curr) => acc + curr.rating, 0);
          setAverageRating(Number((total / ratingsData.length).toFixed(1)));
        } else {
          setAverageRating(4.8); // fallback
        }

        // Prefer the first extra image, fall back to the primary imageUrl
        setSelectedImage(
          data.images && data.images.length > 0 ? data.images[0] : data.imageUrl
        );
      } catch (err) {
        console.error(err);
        if (err.message === 'Product not found') {
          setError('Product not found. The database may have been re-seeded. Please return to the Home page and select a product again.');
        } else {
          setError('Failed to load product. Please try again.');
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ── Sync cart to localStorage ─────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ── Cart actions ──────────────────────────────────────────────────
  const addProductToCart = (prod, selectedVariant = null, quantity = 1) => {
    // Override price and attach variant attributes if selected
    const cartItem = {
      ...prod,
      price: selectedVariant ? selectedVariant.price : prod.price,
      originalPrice: selectedVariant ? (selectedVariant.originalPrice || selectedVariant.price) : prod.originalPrice,
      selectedVariant: selectedVariant ? selectedVariant.attributes : null,
      quantity: quantity
    };
    // Strip non-serialisable Firestore Timestamp before dispatch
    const { time, ...serializable } = cartItem;
    dispatch(addToCart(serializable));
    toast.success('Added to cart!');
  };

  const refetchRatings = async () => {
    if (!id) return;
    try {
      const ratingsData = await productService.getProductRatings(id);
      setRatings(ratingsData);
      if (ratingsData.length > 0) {
        const total = ratingsData.reduce((acc, curr) => acc + curr.rating, 0);
        setAverageRating(Number((total / ratingsData.length).toFixed(1)));
      }
    } catch (err) {
      console.warn("Failed to refetch ratings:", err);
    }
  };

  return {
    product,
    selectedImage,
    setSelectedImage,
    ratings,
    averageRating,
    reviewCount: ratings.length,
    refetchRatings,
    isFetching,
    error,
    cartItems,
    addProductToCart,
  };
}
