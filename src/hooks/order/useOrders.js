import { useState, useEffect } from 'react';
import { orderService } from '../../services/order/orderService.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await orderService.getOrders(user.user.uid, user.user.email);
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders: ", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return { orders, loading, error, refetch: fetchOrders };
}
