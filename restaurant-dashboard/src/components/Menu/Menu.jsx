import { db } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddDishModal from "./AddDishModal";
import MenuItem from "./MenuItem";
import { useRestaurantAuth } from "../../contexts/RestaurantAuthContext";

const Menu = () => {
  const [isActive, setIsActive] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [dishes, setDishes] = useState([]);
  const { restaurant } = useRestaurantAuth();
  const restaurantId = restaurant?.id;

  useEffect(() => {
    if (!restaurantId) return;
    const getDishes = async () => {
      const dishesRef = collection(db, "dishes");
      const q = query(dishesRef, where("restaurantId", "==", restaurantId));

      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setDishes(items);
    };

    getDishes();
    setIsRemoved(false);
  }, [isActive, isRemoved, restaurantId]);

  if (!restaurantId) {
    return (
      <div className="text-center py-20 px-4">
        <div className="inline-block w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading restaurant data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl pt-8 px-4 md:px-8">
      {isActive && (
        <AddDishModal setIsActive={setIsActive} restaurantId={restaurantId} />
      )}
      <MenuItem
        setIsActive={setIsActive}
        dishes={dishes}
        setIsRemoved={setIsRemoved}
      />
    </div>
  );
};

export default Menu;
