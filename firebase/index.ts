import { getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, Auth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

export function getFirebaseApp() {
  const apps = getApps();
  return apps.length > 0 ? apps[0] : initializeApp(FIREBASE_CONFIG);
}

// AUTH
const AUTH = initializeAuth(getFirebaseApp(), {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const getFirebaseAuth = (): Auth => AUTH;

export const getFirebaseDb = () => getFirestore(getFirebaseApp());
