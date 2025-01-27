// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Modular import for auth
import { getFirestore } from "firebase/firestore"; // Modular import for Firestore

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMf5XMCIm75DbQzKCVBcTYTS5ekTB6HNk",
  authDomain: "daynt-assignment.firebaseapp.com",
  projectId: "daynt-assignment",
  storageBucket: "daynt-assignment.firebasestorage.app",
  messagingSenderId: "22430243575",
  appId: "1:22430243575:web:7690aa078d0e7af5ce11f2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

console.log(getAuth);
console.log(getFirestore);
