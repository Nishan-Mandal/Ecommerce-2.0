import { useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../services/order/orderService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { queryKeys } from '../../utils/queryKeys.js';

/**
 * useOrders Custom Hook powered by TanStack Query
 * Provides instant cache hits, zero flickering, and automatic stale time management.
 */
export default function useOrders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const uid = user?.user?.uid || user?.uid || null;
  const email = user?.user?.email || user?.email || null;

  const {
    data: orders = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['orders', 'user', uid, email],
    queryFn: () => orderService.getOrders(uid, email),
    enabled: Boolean(uid),
    staleTime: 2 * 60 * 1000, // 2 minutes stale time — instant response from cache!
    gcTime: 10 * 60 * 1000, // 10 minutes cache retention
    refetchOnWindowFocus: false, // Prevents unwanted re-fetches when switching browser tabs
    refetchOnReconnect: false,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['orders', 'user', uid] });
  };

  return {
    orders: orders || [],
    loading: isLoading,
    isFetching,
    isError,
    error,
    refetch,
    invalidate
  };
}
