/**
 * QuoteWise Firebase Configuration
 * Placeholder setup for Firebase integration.
 *
 * The actual Firebase SDK is NOT installed yet (planned for Phase 2).
 * This module exports null placeholders so the rest of the app can
 * reference firebase/auth/firestore/storage without crashing.
 *
 * When the team is ready to integrate Firebase:
 *   1. Run: npx expo install firebase
 *   2. Uncomment the import block below
 *   3. Add your credentials to .env (see ENVIRONMENT VARIABLES list)
 *   4. Replace the placeholder exports with real instances
 *
 * ENVIRONMENT VARIABLES (set in .env or app.config.js):
 * - EXPO_PUBLIC_FIREBASE_API_KEY
 * - EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
 * - EXPO_PUBLIC_FIREBASE_PROJECT_ID
 * - EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
 * - EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 * - EXPO_PUBLIC_FIREBASE_APP_ID
 */

// --- UNCOMMENT WHEN FIREBASE SDK IS INSTALLED ---
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
//
// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
// };
//
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

// Placeholder exports — safe to import from anywhere in the app
const app = null;
const auth = null;
const db = null;
const storage = null;

export { app, auth, db, storage };
export default app;
