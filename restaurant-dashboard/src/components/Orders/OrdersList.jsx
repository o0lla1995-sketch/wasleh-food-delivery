import { useState } from "react";
import OrderItem from "./OrderItem";
import OrderModal from "./OrderModal";

const OrdersList = ({ orders }) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");

  return (
    <>
      {isActive && (
        <OrderModal setIsActive={setIsActive} selectedOrder={selectedOrder} />
      )}
      <div className="max-w-screen-xl mx-auto pt-8 px-4 md:px-8 pb-8">
        <div className="mb-6">
          <h3 className="text-gray-800 text-2xl font-bold">Orders</h3>
          <p className="text-gray-500 text-sm mt-1">
            Pending orders waiting for your action
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-orange-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <h1 className="font-bold text-gray-700 text-xl mb-2">No Pending Orders</h1>
            <p className="text-gray-500 text-sm">
              New orders from customers will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-base">Created At</th>
                    <th className="px-6 py-4 text-base">Order ID</th>
                    <th className="px-6 py-4 text-base">Customer Name</th>
                    <th className="px-6 py-4 text-base">Total</th>
                    <th className="px-6 py-4 text-base">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-100">
                  {orders.map((item, index) => (
                    <tr
                      onClick={() => {
                        setIsActive(true);
                        setSelectedOrder({
                          id: item.id,
                          total: item.total,
                          status: item.status,
                        });
                      }}
                      className="cursor-pointer hover:bg-orange-50 transition-colors"
                      key={index}
                    >
                      <OrderItem
                        setIsActive={setIsActive}
                        date={item.createdAt}
                        id={item.id}
                        firstName={item.userFirstName}
                        lastName={item.userLastName}
                        total={item.total}
                        status={item.status}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersList;
