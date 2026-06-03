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

// ─── User-scoped Quotation Paths (legacy - kept for QuotationFormScreen) ───
const userQuotationsRef = (userId) => collection(db, 'users', userId, 'quotations');
const userQuotationDoc = (userId, quoteId) => doc(db, 'users', userId, 'quotations', quoteId);

// ─── Global Quotes Collection (marketplace) ──────────────────────────────
const quotesRef = () => collection(db, 'quotes');
const quoteDoc = (quoteId) => doc(db, 'quotes', quoteId);
const quoteResponsesRef = (quoteId) => collection(db, 'quotes', quoteId, 'responses');
const quoteResponseDoc = (quoteId, responseId) => doc(db, 'quotes', quoteId, 'responses', responseId);

// ═══════════════════════════════════════════════════════════════════════════
// QUOTES (Marketplace - global collection)
// ═══════════════════════════════════════════════════════════════════════════

// Add a new quote request (Client posts a project)
export async function addQuote(data) {
  const docRef = await addDoc(quotesRef(), {
    ...data,
    status: 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update a quote request
export async function updateQuote(quoteId, data) {
  await updateDoc(quoteDoc(quoteId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete a quote request and its responses
export async function deleteQuote(quoteId) {
  // Delete all responses first
  const responsesSnap = await getDocs(quoteResponsesRef(quoteId));
  const batch = writeBatch(db);
  responsesSnap.forEach((d) => batch.delete(d.ref));
  batch.delete(quoteDoc(quoteId));
  await batch.commit();
}

// Get a single quote
export async function getQuote(quoteId) {
  const docSnap = await getDoc(quoteDoc(quoteId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

// Subscribe to MY quotes (Client view - own requests)
export function subscribeMyQuotes(userId, callback) {
  const q = query(
    quotesRef(),
    where('clientId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// Subscribe to MY quotes by status
export function subscribeMyQuotesByStatus(userId, status, callback) {
  const q = query(
    quotesRef(),
    where('clientId', '==', userId),
    where('status', '==', status),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// Subscribe to OPEN quotes (Provider view - available requests)
export function subscribeOpenQuotes(callback) {
  const q = query(
    quotesRef(),
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// Subscribe to quotes a provider has responded to
export function subscribeProviderQuotes(providerId, callback) {
  // We need to find quotes where this provider has submitted a response
  // Since Firestore doesn't support queries across subcollections easily,
  // we store providerId in the response and query from there
  const q = query(
    quotesRef(),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, async (snapshot) => {
    const items = [];
    for (const d of snapshot.docs) {
      const quoteData = { id: d.id, ...d.data() };
      // Check if this provider has responded
      const resQ = query(
        quoteResponsesRef(d.id),
        where('providerId', '==', providerId)
      );
      const resSnap = await getDocs(resQ);
      if (!resSnap.empty) {
        items.push(quoteData);
      }
    }
    callback(items);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSES (Provider quotations on client requests)
// ═══════════════════════════════════════════════════════════════════════════

// Add a response (Provider submits a quotation)
export async function addResponse(quoteId, data) {
  const docRef = await addDoc(quoteResponsesRef(quoteId), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update a response (Accept / Reject / Save)
export async function updateResponse(quoteId, responseId, data) {
  await updateDoc(quoteResponseDoc(quoteId, responseId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Get all responses for a quote (Client sees provider quotations)
export function subscribeQuoteResponses(quoteId, callback) {
  const q = query(quoteResponsesRef(quoteId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// Get responses count for a quote
export async function getResponseCount(quoteId) {
  const snapshot = await getDocs(quoteResponsesRef(quoteId));
  return snapshot.size;
}

// ═══════════════════════════════════════════════════════════════════════════
// LEGACY: User-scoped Quotations (kept for QuotationFormScreen compatibility)
// ═══════════════════════════════════════════════════════════════════════════

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

// Add a new quotation (legacy user-scoped)
export async function addQuotation(userId, data) {
  const docRef = await addDoc(userQuotationsRef(userId), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update a quotation (legacy user-scoped)
export async function updateQuotation(userId, quoteId, data) {
  await updateDoc(userQuotationDoc(userId, quoteId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete a quotation (legacy user-scoped)
export async function deleteQuotation(userId, quoteId) {
  await deleteDoc(userQuotationDoc(userId, quoteId));
}

// Get a single quotation (legacy user-scoped)
export async function getQuotation(userId, quoteId) {
  const docSnap = await getDoc(userQuotationDoc(userId, quoteId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

// ─── Dashboard Counts ─────────────────────────────────────────────────────

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

// ─── Quote Counts (marketplace) ──────────────────────────────────────────

export function subscribeQuoteCounts(userId, callback) {
  const q = query(quotesRef(), where('clientId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    let open = 0, responded = 0, closed = 0;
    snapshot.forEach(docSnap => {
      const status = docSnap.data().status;
      if (status === 'open') open++;
      else if (status === 'responded') responded++;
      else if (status === 'closed') closed++;
    });
    callback({ open, responded, closed, total: open + responded + closed });
  });
}

// ─── Delete All User Data ────────────────────────────────────────────────

export async function deleteAllUserData(userId) {
  // Delete user-scoped quotations
  const snapshot = await getDocs(userQuotationsRef(userId));
  const batch = writeBatch(db);
  snapshot.forEach((d) => batch.delete(d.ref));

  // Delete user's global quotes and their responses
  const quotesSnap = await getDocs(query(quotesRef(), where('clientId', '==', userId)));
  for (const qDoc of quotesSnap.docs) {
    const resSnap = await getDocs(quoteResponsesRef(qDoc.id));
    resSnap.forEach((r) => batch.delete(r.ref));
    batch.delete(qDoc.ref);
  }

  batch.delete(doc(db, 'users', userId));
  await batch.commit();
}

// ─── User Profile ────────────────────────────────────────────────────────

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

// ─── Legacy compatibility (global quotations collection) ─────────────────

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
  await deleteDoc(doc(db, 'drafts', id));
}
