import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import OrdersList from "./OrdersList";
import { useRestaurantAuth } from "../../contexts/RestaurantAuthContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { restaurant } = useRestaurantAuth();

  useEffect(() => {
    if (!restaurant?.id) return;

    // Note: We fetch all orders for this restaurant (single equality filter + orderBy).
    // Composite indexes (restaurantId + status + createdAt) would let us filter
    // server-side, but Firestore Admin SDK can't create indexes here.
    // Client-side filtering by status avoids the index requirement.
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("restaurantId", "==", restaurant.id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filter client-side to only PENDING orders
        if (data.status === "PENDING") {
          items.push({ ...data, id: doc.id });
        }
      });
      setOrders(items);
    });

    return unsubscribe;
  }, [restaurant?.id]);

  if (!restaurant?.id) {
    return (
      <div className="text-center py-20 px-4">
        <div className="inline-block w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading restaurant data...</p>
      </div>
    );
  }

  return <OrdersList orders={orders} />;
};

export default Orders;
