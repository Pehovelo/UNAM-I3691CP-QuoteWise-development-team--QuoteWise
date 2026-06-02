import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_PERSIST_KEY = 'quotewise_auth_persist';

// Register a new user with email/password
export async function registerUser(email, password, displayName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  // Store user info in Firestore
  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    displayName,
    email,
    role: 'student',
    createdAt: serverTimestamp(),
  });

  await AsyncStorage.setItem(AUTH_PERSIST_KEY, 'true');
  return credential.user;
}

// Login with email/password
export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await AsyncStorage.setItem(AUTH_PERSIST_KEY, 'true');
  return credential.user;
}

// Logout
export async function logoutUser() {
  await signOut(auth);
  await AsyncStorage.removeItem(AUTH_PERSIST_KEY);
}

// Send password reset email
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
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
