// Import necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native"; // Detect platform

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0I3T4SX8U3PEru2TctpESWadt_RmpTQE",
  authDomain: "laundrilite.firebaseapp.com",
  projectId: "laundrilite",
  storageBucket: "laundrilite.appspot.com",
  messagingSenderId: "795013113551",
  appId: "1:795013113551:web:2d5b489b6a4be628e639ba",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Prevent multiple Auth initializations
let auth;
if (Platform.OS === "web") {
  auth = getAuth(app); // Use default Auth for web
} else {
  // Use AsyncStorage for React Native
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

// Initialize Firestore
const db = getFirestore(app);

// Export necessary modules
export { auth, db, doc, setDoc, updateDoc };
