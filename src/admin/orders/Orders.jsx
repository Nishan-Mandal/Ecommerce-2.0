import React, { useEffect, useState } from "react";
import OrderDetailTable from "./OrderDetailTable";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";

/**
 * Orders Component (Admin Orders Page)
 * Container component for admin orders management, fetching real-time order streams from Firestore.
 */
function Orders({ mode, order: propOrders = [], formatDate }) {
  const [orders, setOrders] = useState(propOrders);
  const [loading, setLoading] = useState(propOrders.length === 0);

  useEffect(() => {
    // If orders are provided as props, sync them
    if (propOrders && propOrders.length > 0) {
      setOrders(propOrders);
      setLoading(false);
      return;
    }

    // Real-time Firestore subscriber for orders collection
    const q = query(collection(fireDB, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orderList = snapshot.docs.map((docSnap) => ({
          docId: docSnap.id,
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setOrders(orderList);
        setLoading(false);
      },
      (error) => {
        console.error("Error subscribing to orders stream:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [propOrders]);

  return (
    <div className="space-y-4 px-4 md:px-0">
      <OrderDetailTable
        mode={mode}
        order={orders}
        loading={loading}
        formatDate={formatDate}
      />
    </div>
  );
}

export default Orders;
