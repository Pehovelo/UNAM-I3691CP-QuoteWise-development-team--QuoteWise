import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  deleteUser,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_PERSIST_KEY = 'quotewise_auth_persist';
const USER_CACHE_KEY = 'quotewise_user_cache';

// Register a new user with email/password, role, and company name
export async function registerUser(email, password, displayName, role = 'client', companyName = '') {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  // Store user info in Firestore with role and company
  const userData = {
    uid: credential.user.uid,
    displayName,
    email,
    role: role || 'client',
    companyName: companyName || '',
    phone: '',
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', credential.user.uid), userData);

  // Cache user data locally for faster loads
  await AsyncStorage.setItem(AUTH_PERSIST_KEY, 'true');
  await AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify({ ...userData, createdAt: new Date().toISOString() }));

  return credential.user;
}

// Login with email/password
export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await AsyncStorage.setItem(AUTH_PERSIST_KEY, 'true');

  // Cache user profile after login for faster subsequent loads
  try {
    const { getUserProfile } = require('./firestoreService');
    const profile = await getUserProfile(credential.user.uid);
    if (profile) {
      await AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(profile));
    }
  } catch (e) {
    // Silently fail - profile will be fetched normally
  }

  return credential.user;
}

// Logout
export async function logoutUser() {
  await signOut(auth);
  await AsyncStorage.removeItem(AUTH_PERSIST_KEY);
  await AsyncStorage.removeItem(USER_CACHE_KEY);
}

// Send password reset email
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// Update display name in Firebase Auth
export async function updateUserDisplayName(displayName) {
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName });
  }
}

// Delete user account
export async function deleteUserAccount() {
  if (auth.currentUser) {
    await deleteUser(auth.currentUser);
    await AsyncStorage.removeItem(AUTH_PERSIST_KEY);
    await AsyncStorage.removeItem(USER_CACHE_KEY);
  }
}

// Listen for auth state changes
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Check if user was previously logged in
export async function wasUserLoggedIn() {
  const val = await AsyncStorage.getItem(AUTH_PERSIST_KEY);
  return val === 'true';
}

// Get cached user data (for faster cold starts)
export async function getCachedUser() {
  try {
    const cached = await AsyncStorage.getItem(USER_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    // Ignore cache errors
  }
  return null;
}

// Update cached user data
export async function updateCachedUser(data) {
  try {
    const cached = await getCachedUser();
    if (cached) {
      const updated = { ...cached, ...data };
      await AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    // Ignore cache errors
  }
}
