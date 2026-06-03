import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase Configuration — QuoteWise Project
// These values are safe to include in the client bundle (Firebase security is enforced via Firestore rules, not API key secrecy)
const firebaseConfig = {
  apiKey: "AIzaSyB22yeIEm_c-qTDogIIJzRS9gDjT8CTnp8",
  authDomain: "gen-lang-client-0586186311.firebaseapp.com",
  projectId: "gen-lang-client-0586186311",
  storageBucket: "gen-lang-client-0586186311.firebasestorage.app",
  messagingSenderId: "513688695839",
  appId: "1:513688695839:web:de4eff61f3b94decccd12a",
};

const app = initializeApp(firebaseConfig);

// Use React Native AsyncStorage for auth persistence so users stay logged in
// across app restarts. This is the critical fix for persistent login.
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // If already initialized (hot reload), fall back to getAuth
  auth = getAuth(app);
}

export const db = getFirestore(app);
export default app;
export { auth };
