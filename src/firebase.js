// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
  apiKey: "AIzaSyC-rgFDH7Ha1GvD2g1homHCfGheJWXjC4g",
  authDomain: "alert-buddy-tracker.firebaseapp.com",
  databaseURL: "https://alert-buddy-tracker-default-rtdb.firebaseio.com",
  projectId: "alert-buddy-tracker",
  storageBucket: "alert-buddy-tracker.appspot.com",
  messagingSenderId: "434737886307",
  appId: "1:434737886307:web:9ac13d184be5b46b9df456",
  measurementId: "G-LRG1L8PZ7E"
};

// ✅ Initialize the Firebase app just once
const app = initializeApp(firebaseConfig);

// ✅ Export the database instance
const db = getDatabase(app);

export { db };
