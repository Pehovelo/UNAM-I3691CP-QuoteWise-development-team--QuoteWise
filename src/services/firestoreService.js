import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ─── Quotations ───────────────────────────────────────────────────

// Get all quotations (real-time)
export function subscribeQuotations(callback) {
  const q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// Get quotations by status
export function subscribeQuotationsByStatus(status, callback) {
  const q = query(
    collection(db, 'quotations'),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// Add a new quotation
export async function addQuotation(data) {
  const docRef = await addDoc(collection(db, 'quotations'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update a quotation
export async function updateQuotation(id, data) {
  await updateDoc(doc(db, 'quotations', id), data);
}

// Delete a quotation
export async function deleteQuotation(id) {
  await deleteDoc(doc(db, 'quotations', id));
}

// ─── Saved Quotations ─────────────────────────────────────────────

// Get saved quotations for a user (real-time)
export function subscribeSavedQuotations(userId, callback) {
  const q = query(
    collection(db, 'saved_quotations'),
    where('userId', '==', userId),
    orderBy('savedAt', 'desc')
  );
  return onSnapshot(q, async (snapshot) => {
    const savedIds = snapshot.docs.map((d) => ({ id: d.id, quotationId: d.data().quotationId }));
    // Fetch the full quotation data for each saved item
    const quotations = [];
    for (const s of savedIds) {
      const qDoc = await getDoc(doc(db, 'quotations', s.quotationId));
      if (qDoc.exists()) {
        quotations.push({ saveId: s.id, id: qDoc.id, ...qDoc.data() });
      }
    }
    callback(quotations);
  });
}

// Save a quotation
export async function saveQuotation(userId, quotationId) {
  await addDoc(collection(db, 'saved_quotations'), {
    userId,
    quotationId,
    savedAt: serverTimestamp(),
  });
}

// Unsave a quotation
export async function unsaveQuotation(saveId) {
  await deleteDoc(doc(db, 'saved_quotations', saveId));
}

// ─── Drafts ───────────────────────────────────────────────────────

// Get drafts for a user (real-time)
export function subscribeDrafts(userId, callback) {
  const q = query(
    collection(db, 'drafts'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// Add a draft
export async function addDraft(userId, data) {
  const docRef = await addDoc(collection(db, 'drafts'), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update a draft
export async function updateDraft(id, data) {
  await updateDoc(doc(db, 'drafts', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete a draft
export async function deleteDraft(id) {
  await deleteDoc(doc(db, 'drafts', id));
}

// ─── User Profile ─────────────────────────────────────────────────

// Get user profile from Firestore
export async function getUserProfile(uid) {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (docSnap.exists()) {
    return { uid, ...docSnap.data() };
  }
  return null;
}

// Update user profile
export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), data);
}
