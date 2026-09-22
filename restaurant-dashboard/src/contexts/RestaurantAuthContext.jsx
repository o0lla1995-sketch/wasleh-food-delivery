import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const RestaurantAuthContext = createContext();

export const RestaurantAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.uid) {
        try {
          const restaurantsRef = collection(db, "restaurants");
          const q = query(restaurantsRef, where("ownerId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            setRestaurant({ ...docSnap.data(), id: docSnap.id });
          } else {
            setRestaurant(null);
          }
        } catch (err) {
          console.error("Error fetching restaurant:", err);
          setRestaurant(null);
        }
      } else {
        setRestaurant(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => {
    return signOut(auth);
  };

  return (
    <RestaurantAuthContext.Provider
      value={{ user, restaurant, loading, signUp, signIn, signOutUser }}
    >
      {children}
    </RestaurantAuthContext.Provider>
  );
};

export const useRestaurantAuth = () => {
  return useContext(RestaurantAuthContext);
};
