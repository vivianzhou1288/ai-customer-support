"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, firestore, googleAuthProvider } from "../../firebase.js";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      console.log("User signed in: ", user);
    } catch (error) {
      console.error("Error during sign in: ", error);
    }
  };

  const googleLogin = () => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        handleGoogleSignIn();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("User:", user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logOut = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        googleLogin,
        logOut,
        user,
        auth,
        firestore,
        googleAuthProvider,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => useContext(UserContext);
