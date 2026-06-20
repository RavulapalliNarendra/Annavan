import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.warn(`[Mock Mode] Missing Firebase Keys: ${missingKeys.join(", ")}. Using dummy config.`);
  // Overwrite with dummy valid-looking keys to prevent SDK crash
  Object.assign(firebaseConfig, {
    apiKey: "AIzaSyDummyKeyForMockModeOnly123456",
    authDomain: "annavan-mock.firebaseapp.com",
    projectId: "annavan-mock",
    storageBucket: "annavan-mock.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456",
  });
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
