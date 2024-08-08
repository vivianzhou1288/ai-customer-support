// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDvU9sltu1MA8F75f7n4M-wtPeEqt_t4U",
  authDomain: "travel-bot-fb7e3.firebaseapp.com",
  projectId: "travel-bot-fb7e3",
  storageBucket: "travel-bot-fb7e3.appspot.com",
  messagingSenderId: "707070416589",
  appId: "1:707070416589:web:8392e3baa64496f9d23b84",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
export { app, firestore, auth, googleAuthProvider };
