import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: "freezeland-60fd9",
  storageBucket: "freezeland-60fd9.appspot.com",
  messagingSenderId: "147358994049",
  appId: "1:147358994049:web:9cc13de759c91f3c484780",
  measurementId: "G-HTP75B246E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
export default app;
