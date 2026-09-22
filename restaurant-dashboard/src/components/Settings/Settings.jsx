import { useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRestaurantAuth } from "../../contexts/RestaurantAuthContext";

const Settings = () => {
  const { restaurant, user } = useRestaurantAuth();
  const [restaurantData, setRestaurantData] = useState({
    name: restaurant?.name || "",
    image: restaurant?.image || "",
    address: restaurant?.address || "",
    genre: restaurant?.genre || "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const restaurantId = restaurant?.id;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRestaurantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurantId) {
      setError("Restaurant data not loaded yet. Please refresh the page.");
      return;
    }
    setError("");
    setSuccess(false);

    const dataToUpdate = {};
    for (const [key, value] of Object.entries(restaurantData)) {
      if (value.trim() !== "") {
        dataToUpdate[key] = value;
      }
    }

    try {
      const resRef = doc(db, "restaurants", restaurantId);
      await updateDoc(resRef, dataToUpdate);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating restaurant details:", error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl pt-8 px-4 md:px-8">
      <div className="mb-6">
        <h3 className="text-gray-800 text-2xl font-bold">Edit Restaurant Details</h3>
        <p className="text-gray-500 text-sm mt-1">
          Update your restaurant information
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3">
          ✓ Restaurant details updated successfully!
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
          <input
            type="text"
            name="name"
            value={restaurantData.name}
            onChange={handleInputChange}
            placeholder={restaurant?.name || "Enter restaurant name"}
            className="w-full border border-gray-300 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            value={restaurantData.image}
            onChange={handleInputChange}
            placeholder={restaurant?.image || "https://example.com/image.jpg"}
            className="w-full border border-gray-300 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
          />
          {restaurantData.image && (
            <img
              src={restaurantData.image}
              alt="Preview"
              className="mt-3 w-20 h-20 rounded-xl object-cover border border-gray-200"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={restaurantData.address}
            onChange={handleInputChange}
            placeholder={restaurant?.address || "Street address"}
            className="w-full border border-gray-300 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine / Genre</label>
          <input
            type="text"
            name="genre"
            value={restaurantData.genre}
            onChange={handleInputChange}
            placeholder={restaurant?.genre || "Italian, Pizza, Pasta"}
            className="w-full border border-gray-300 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
          />
        </div>

        <button
          type="submit"
          disabled={!restaurantId}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          Save Changes
        </button>
      </div>

      {user?.email && (
        <div className="mt-6 bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
          <p><span className="font-medium">Account email:</span> {user.email}</p>
          <p><span className="font-medium">Restaurant ID:</span> <code className="bg-white px-1 rounded">{restaurantId || "—"}</code></p>
        </div>
      )}
    </form>
  );
};

export default Settings;
