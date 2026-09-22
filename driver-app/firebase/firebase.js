import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for the Wasleh project (wasleh-9d729).
// These are CLIENT-SIDE keys, safe to ship in the APK. They are restricted
// to specific Android package names (com.wasleh.driver) in the Google
// Cloud Console, so abuse is limited.
const firebaseConfig = {
  apiKey: "AIzaSyAszFcOcztjOyj3IWhXMfxLKqwyTo0JJlw",
  authDomain: "wasleh-9d729.firebaseapp.com",
  projectId: "wasleh-9d729",
  storageBucket: "wasleh-9d729.firebasestorage.app",
  messagingSenderId: "380607552072",
  appId: "1:380607552072:android:c15fb13399194b914fd67d",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
