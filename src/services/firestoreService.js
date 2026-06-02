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
  writeBatch,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ─── User-scoped Quotation Paths ──────────────────────────────────
const userQuotationsRef = (userId) => collection(db, 'users', userId, 'quotations');
const userQuotationDoc = (userId, quoteId) => doc(db, 'users', userId, 'quotations', quoteId);

// ─── Quotations ───────────────────────────────────────────────────

// Subscribe to ALL quotations for a user (real-time)
export function subscribeUserQuotations(userId, callback) {
  const q = query(userQuotationsRef(userId), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// Subscribe to quotations by status (real-time)
export function subscribeUserQuotationsByStatus(userId, status, callback) {
  const q = query(
    userQuotationsRef(userId),
    where('status', '==', status),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// Subscribe to active quotations (draft + active)
export function subscribeActiveQuotations(userId, callback) {
  const q = query(
    userQuotationsRef(userId),
    where('status', 'in', ['draft', 'active']),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// Add a new quotation
export async function addQuotation(userId, data) {
  const docRef = await addDoc(userQuotationsRef(userId), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update a quotation
export async function updateQuotation(userId, quoteId, data) {
  await updateDoc(userQuotationDoc(userId, quoteId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete a quotation
export async function deleteQuotation(userId, quoteId) {
  await deleteDoc(userQuotationDoc(userId, quoteId));
}

// Get a single quotation
export async function getQuotation(userId, quoteId) {
  const docSnap = await getDoc(userQuotationDoc(userId, quoteId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

// ─── Dashboard Counts ─────────────────────────────────────────────

export function subscribeQuotationCounts(userId, callback) {
  const q = query(userQuotationsRef(userId), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    let active = 0, draft = 0, saved = 0;
    snapshot.forEach(docSnap => {
      const status = docSnap.data().status;
      if (status === 'active') active++;
      else if (status === 'draft') draft++;
      else if (status === 'saved') saved++;
    });
    callback({ active, draft, saved, total: active + draft + saved });
  });
}

// ─── Delete All User Data ─────────────────────────────────────────

export async function deleteAllUserData(userId) {
  const snapshot = await getDocs(userQuotationsRef(userId));
  const batch = writeBatch(db);
  snapshot.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, 'users', userId));
  await batch.commit();
}

// ─── User Profile ─────────────────────────────────────────────────

export async function getUserProfile(uid) {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (docSnap.exists()) {
    return { uid, ...docSnap.data() };
  }
  return null;
}

export async function updateUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
}

// ─── Legacy compatibility (global quotations collection) ──────────
// These are kept for the seed data and initial demo content

export function subscribeQuotations(callback) {
  const q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

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

export function subscribeSavedQuotations(userId, callback) {
  const q = query(
    collection(db, 'users', userId, 'quotations'),
    where('status', '==', 'saved'),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

export function subscribeDrafts(userId, callback) {
  const q = query(
    collection(db, 'users', userId, 'quotations'),
    where('status', '==', 'draft'),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

export async function addDraft(userId, data) {
  const docRef = await addDoc(userQuotationsRef(userId), {
    ...data,
    userId,
    status: 'draft',
    currency: 'NAD',
    items: [],
    subtotal: 0,
    taxPercent: 0,
    taxAmount: 0,
    total: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteDraft(id) {
  // Legacy - not user-scoped, kept for compatibility
  await deleteDoc(doc(db, 'drafts', id));
}
