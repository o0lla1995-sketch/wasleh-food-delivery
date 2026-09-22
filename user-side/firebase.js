import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  setPersistence,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration for the Wasleh project (wasleh-9d729).
// These are CLIENT-SIDE keys, safe to ship in the APK. They are restricted
// to specific Android package names (com.wasleh.customer) in the Google
// Cloud Console, so abuse is limited.
const firebaseConfig = {
  apiKey: "AIzaSyAszFcOcztjOyj3IWhXMfxLKqwyTo0JJlw",
  authDomain: "wasleh-9d729.firebaseapp.com",
  projectId: "wasleh-9d729",
  storageBucket: "wasleh-9d729.firebasestorage.app",
  messagingSenderId: "380607552072",
  appId: "1:380607552072:android:5306a44a3a2567354fd67d",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
