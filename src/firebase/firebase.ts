import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  getDocs,
  serverTimestamp,
  getDoc,
  updateDoc,
  onSnapshot,
  orderBy,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { getMessaging, getToken, isSupported, Messaging } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD8us3uTEnm7u43cqJHTVRCzaSHC2PzKNA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "markettoll-12722.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://markettoll-12722-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "markettoll-12722",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "markettoll-12722.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "415697624629",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:415697624629:web:bdb82c4ee69379c463db7c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-9BPJW8MKXF",
};

// Initialize Firebase (safely for Next.js HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");

let messagingInstancePromise: Promise<Messaging | null> | null = null;

export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") return null;
  if (messagingInstancePromise) return messagingInstancePromise;

  messagingInstancePromise = (async () => {
    try {
      const supported = await isSupported();
      if (supported) {
        return getMessaging(app);
      }
      return null;
    } catch (err) {
      console.warn("Firebase Messaging is not supported in this environment:", err);
      return null;
    }
  })();

  return messagingInstancePromise;
};

let messaging: Messaging | null = null;

export {
  app,
  db,
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  getDocs,
  serverTimestamp,
  getDoc,
  updateDoc,
  onSnapshot,
  orderBy,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  getToken,
  messaging,
  writeBatch,
};
