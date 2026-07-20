import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { fireDB } from '../../../firebase/FirebaseConfig';
import CommonProductCard from '../../../components/Common/ProductCard';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/cartSlice';
import { toast } from 'react-toastify';

/**
 * RelatedProducts Component
 * Displays matching catalog recommendations in a scrollable horizontal carousel.
 * Leverages CommonProductCard for consistent style patterns.
 */
export default function RelatedProducts({ category, currentProductId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addCart = (product) => {
    const { time, ...serializableProduct } = product;
    dispatch(addToCart(serializableProduct));
    toast.success('Added to cart!');
  };

  useEffect(() => {
    if (!category) return;

    const fetchRelated = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(fireDB, 'products'),
          where('category', '==', category),
          limit(8)
        );
        const snap = await getDocs(q);
        const results = [];
        snap.forEach((doc) => {
          const data = doc.data();
          const price = data.price || (data.variants && data.variants.length > 0 ? String(data.variants[0].price) : "");
          const imageUrl = data.imageUrl || (data.images && data.images.length > 0 ? data.images[0] : "");
          const mappedProduct = {
            ...data,
            id: doc.id,
            price,
            imageUrl
          };
          // Exclude current product
          if (mappedProduct.id !== currentProductId) results.push(mappedProduct);
        });
        setRelated(results);
      } catch (err) {
        console.error('RelatedProducts fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [category, currentProductId]);

  // Don't render if nothing to show
  if (!loading && related.length === 0) return null;

  return (
    <section className="sm:mt-20">
      <div className="flex justify-between items-center sm:mb-8">
        <h2 className="md:text-3xl text-xl font-semibold">You May Also Like</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const el = document.getElementById('related-scroll');
              if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
            }}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Scroll left"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('related-scroll');
              if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
            }}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Scroll right"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[280px] flex-shrink-0 animate-pulse">
              <div className="bg-gray-200 rounded-2xl aspect-[4/3] mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div
          id="related-scroll"
          className="flex gap-6 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {related.map((prod, index) => (
            <div key={prod.id} className="w-[280px] flex-shrink-0">
              <CommonProductCard item={prod} index={index} addCart={addCart} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
