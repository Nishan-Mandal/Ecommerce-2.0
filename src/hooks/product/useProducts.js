import { useState, useEffect } from 'react';
import { productService } from '../../services/product/productService.js';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = productService.getProducts((data) => {
      setProducts(data);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return { products, loading, error };
}
