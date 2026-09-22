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

    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("restaurantId", "==", restaurant.id),
      where("status", "==", "PENDING"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
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
