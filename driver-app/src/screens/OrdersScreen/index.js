import { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, FlatList, useWindowDimensions } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import OrderItem from "../../components/OrderItem";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import { db } from "../../../firebase/firebase.js";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    // Single filter (no composite index needed)
    const q = query(ordersRef, where("status", "==", "READY"));

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
      console.log('Firestore onSnapshot error:', error);
    });

    return () => {
      try {
        unsubscribe();
      } catch (e) {
        console.log('unsubscribe error:', e);
      }
    };
  }, []);


  const bottomSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();

  const snapPoints = useMemo(() => ["12%", "90%"], []);

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <MapView
        style={{
          height,
          width,
        }}
        showsUserLocation
        followsUserLocation
      >
        {orders.map((order, index) => (
          <Marker
            key={index + 1}
            id={order.id}
            title={order.restaurantName}
            description={order.restaurantAddress}
            coordinate={{
              latitude: order.restaurantLatitude,
              longitude: order.restaurantLongitude,
            }}
          >
            <View
              style={{ backgroundColor: "green", padding: 5, borderRadius: 20 }}
            >
              <Entypo name="shop" size={24} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              letterSpacing: 0.5,
              paddingBottom: 5,
            }}
          >
            You're Online
          </Text>
          <Text style={{ letterSpacing: 0.5, color: "grey" }}>
            Available Orders: {orders.length}
          </Text>
        </View>
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderItem order={item} />}
        />
      </BottomSheet>
    </View>
  );
};

export default OrdersScreen;
