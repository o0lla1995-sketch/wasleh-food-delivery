import { db } from "../../firebase/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRestaurantAuth } from "../../contexts/RestaurantAuthContext";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { restaurant } = useRestaurantAuth();
  const restaurantId = restaurant?.id;

  useEffect(() => {
    if (!restaurantId) return;

    const getOrders = async () => {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("restaurantId", "==", restaurantId),
        where("status", "in", ["COMPLETE", "DECLINED"]),
        orderBy("createdAt", "desc")
      );

      try {
        const querySnapshot = await getDocs(q);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ ...doc.data(), id: doc.id });
        });
        setOrders(items);
      } catch (err) {
        console.error("Error fetching order history:", err);
      }
    };

    getOrders();
  }, [restaurantId]);

  if (!restaurantId) {
    return (
      <div className="text-center py-20 px-4">
        <div className="inline-block w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading restaurant data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl pt-8 px-4 md:px-8">
      <div className="mb-6">
        <h3 className="text-gray-800 text-2xl font-bold">Order History</h3>
        <p className="text-gray-500 text-sm mt-1">
          Completed and declined orders
        </p>
      </div>
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <p className="text-gray-500">No completed orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.map((order) => {
                let formattedDate = "N/A";
                try {
                  if (order.createdAt?.toDate) {
                    const d = order.createdAt.toDate();
                    formattedDate = d.toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }
                } catch (e) {}
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">{formattedDate}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700 font-mono">{order.id.substring(0, 8)}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                      {order.userFirstName || ""} {order.userLastName || ""}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">${(order.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        order.status === "COMPLETE"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
