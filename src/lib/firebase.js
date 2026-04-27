import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDataConnect } from "firebase/data-connect";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBml9K74iLN7NRy3qXN9SQcK1GIJTPmYuk",
  authDomain: "tokkyfy.firebaseapp.com",
  projectId: "tokkyfy",
  storageBucket: "tokkyfy.firebasestorage.app",
  messagingSenderId: "141015580384",
  appId: "1:141015580384:web:2109af0674dc05245c5a85",
  measurementId: "G-KZDF1M1GR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const dataconnect = getDataConnect(app);

export { app, db, auth, storage, analytics, dataconnect };
