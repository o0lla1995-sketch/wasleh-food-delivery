import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export const AuthContextProvder = ({ children }) => {
  const [user, setUser] = useState({});
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        const uid = currentUser?.uid;
        if (uid) {
          const getUserData = async () => {
            try {
              const userRef = doc(db, "user", uid);
              const docSnap = await getDoc(userRef);
              if (docSnap.exists()) {
                setDbUser(docSnap.data());
              } else {
                setDbUser(null);
              }
            } catch (e) {
              console.log("Error fetching user data:", e);
              setDbUser(null);
            }
          };
          getUserData();
        }
      });
    } catch (e) {
      console.log("Auth state listener error:", e);
    }

    return () => {
      try {
        unsubscribe();
      } catch (e) {}
    };
  }, []);

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => {
    return signOut(auth);
  };

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Note: Google sign-in is not supported in this RN build because
  // signInWithPopup is a web-only API. Native Google sign-in requires
  // @react-native-google-signin/google-signin + native configuration.
  const signInWithGoogle = () => {
    console.log("Google sign-in is not configured for this build.");
    alert("Google sign-in is not available. Please use email/password.");
  };

  return (
    <UserContext.Provider
      value={{
        createUser,
        user,
        signOutUser,
        signInUser,
        dbUser,
        signInWithGoogle,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
