import { useState } from "react";
import { useRouter } from "next/router";
import { navigation } from "../data/navigation";
import { navsFooter } from "../data/navsFooter";
import Orders from "./Orders/Orders";
import OrderHistory from "./OrderHistory/OrderHistory";
import Menu from "./Menu/Menu";
import Settings from "./Settings/Settings";
import { useRestaurantAuth } from "../contexts/RestaurantAuthContext";

const Sidebar = () => {
  const [active, setActive] = useState(0);
  const { restaurant, user, signOutUser } = useRestaurantAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const displayName = restaurant?.name || (user?.email ? user.email.split("@")[0] : "Owner");
  const displayImage = restaurant?.image || "";

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-none w-72 border-r border-gray-200 bg-white">
        <nav className="fixed top-0 left-0 w-72 h-full border-r border-gray-200 bg-white flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-gray-100">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 text-white text-xl font-bold mr-3">
              W
            </div>
            <div>
              <p className="font-bold text-lg text-gray-800 leading-tight">Wasleh</p>
              <p className="text-xs text-gray-400">Restaurant Dashboard</p>
            </div>
          </div>

          <div className="flex-1 overflow-auto py-4">
            <ul className="px-3 space-y-1">
              {navigation.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => setActive(index)}
                    className={`w-full flex items-center gap-x-3 text-gray-700 text-sm font-medium p-3 rounded-xl transition-colors ${
                      active === index
                        ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={active === index ? "text-orange-500" : "text-gray-400"}>
                      {item.icon}
                    </span>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 px-3">
              <ul className="space-y-1">
                {navsFooter.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-x-3 text-gray-700 text-sm font-medium p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-400">{item.icon}</span>
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-bold text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="block text-gray-800 text-sm font-bold truncate">
                  {displayName}
                </p>
                {user?.email && (
                  <p className="block text-gray-400 text-xs truncate">{user.email}</p>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        {active === 0 && <Orders />}
        {active === 1 && <Menu />}
        {active === 2 && <OrderHistory />}
        {active === 3 && <Settings />}
      </div>
    </div>
  );
};

export default Sidebar;
