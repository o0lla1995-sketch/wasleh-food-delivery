import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import Order from "../components/Order";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { UserAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import OptionsScreen from "./OptionsScreen";

const OrderDetailsScreen = () => {
  const { user } = UserAuth();
  const navigation = useNavigation();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    const ordersRef = collection(db, "orders");
    // Single filter (no composite index needed)
    const q = query(ordersRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      // Sort client-side by createdAt desc
      items.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
      setOrders(items);
    }, (error) => {
      console.log('Firestore error:', error);
    });

    return () => {
      try { unsubscribe(); } catch (e) {}
    };
  }, []);

  return (
    <>
      <StatusBar style="dark" />

      <SafeAreaView className="flex-1 bg-white">
        <View className=" bg-white">
          <View className="p-5 bg-white shadow-xs">
            <TouchableOpacity
              onPress={navigation.goBack}
              className="absolute top-4 left-4 bg-white p-2 rounded-full"
            >
              <ArrowLeftIcon size={30} color="#FF6B35" />
            </TouchableOpacity>

            <View>
              <Text className="text-xl font-bold text-center">My Orders</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="mb-20">
              {orders.length === 0 && (
                <View className="flex-1 bg-white justify-center items-center">
                  <Text className="text-xl font-bold">
                    You have no orders 🚫
                  </Text>
                </View>
              )}

              {orders.map((order, index) => {
                return (
                  <Order
                    key={index}
                    orderId={order.id}
                    status={order.status}
                    restaurantId={order.restaurantId}
                    restaurantName={order.restaurantName}
                    total={order.total}
                    timestamp={order.createdAt}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default OrderDetailsScreen;
