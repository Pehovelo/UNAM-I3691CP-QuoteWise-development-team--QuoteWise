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
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Cache Keys ────────────────────────────────────────────────────────────
const CACHE_PREFIX = 'qw_cache_';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

// Simple cache helper: get cached data if fresh, else null
async function getCached(key) {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

// Save data to cache with timestamp
async function setCache(key, data) {
  try {
    await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // Ignore cache write errors
  }
}

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
  try {
    const docRef = await addDoc(quotesRef(), {
      ...data,
      status: 'open',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    // Invalidate relevant caches
    await AsyncStorage.removeItem(CACHE_PREFIX + 'myQuotes_' + data.clientId);
    await AsyncStorage.removeItem(CACHE_PREFIX + 'openQuotes');
    return docRef.id;
  } catch (err) {
    console.error('[firestoreService] addQuote FAILED:', err.code, err.message);
    throw err; // Re-throw so the UI can show the real error
  }
}

// Update a quote request
export async function updateQuote(quoteId, data) {
  try {
    await updateDoc(quoteDoc(quoteId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('[firestoreService] updateQuote FAILED:', err.code, err.message);
    throw err;
  }
}

// Delete a quote request and its responses
export async function deleteQuote(quoteId) {
  try {
    // Delete all responses first
    const responsesSnap = await getDocs(quoteResponsesRef(quoteId));
    const batch = writeBatch(db);
    responsesSnap.forEach((d) => batch.delete(d.ref));
    batch.delete(quoteDoc(quoteId));
    await batch.commit();
  } catch (err) {
    console.error('[firestoreService] deleteQuote FAILED:', err.code, err.message);
    throw err;
  }
}

// Get a single quote (with cache)
export async function getQuote(quoteId) {
  // Try cache first
  const cached = await getCached('quote_' + quoteId);
  if (cached) return cached;

  try {
    const docSnap = await getDoc(quoteDoc(quoteId));
    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() };
      await setCache('quote_' + quoteId, data);
      return data;
    }
    return null;
  } catch (err) {
    console.error('[firestoreService] getQuote FAILED:', err.code, err.message);
    // Try cache on error
    const fallback = await getCached('quote_' + quoteId);
    if (fallback) return fallback;
    throw err;
  }
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
    // Cache the results
    setCache('myQuotes_' + userId, items);
    callback(items);
  }, (error) => {
    console.error('[firestoreService] subscribeMyQuotes ERROR:', error.code, error.message);
    // On error, try to serve cached data
    getCached('myQuotes_' + userId).then((cached) => {
      if (cached) callback(cached);
    });
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
  }, (error) => {
    console.error('[firestoreService] subscribeMyQuotesByStatus ERROR:', error.code, error.message);
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
    setCache('openQuotes', items);
    callback(items);
  }, (error) => {
    console.error('[firestoreService] subscribeOpenQuotes ERROR:', error.code, error.message);
    // On error, try to serve cached data
    getCached('openQuotes').then((cached) => {
      if (cached) callback(cached);
    });
  });
}

// Subscribe to quotes a provider has responded to
export function subscribeProviderQuotes(providerId, callback) {
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
    setCache('providerQuotes_' + providerId, items);
    callback(items);
  }, (error) => {
    console.error('[firestoreService] subscribeProviderQuotes ERROR:', error.code, error.message);
    getCached('providerQuotes_' + providerId).then((cached) => {
      if (cached) callback(cached);
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSES (Provider quotations on client requests)
// ═══════════════════════════════════════════════════════════════════════════

// Add a response (Provider submits a quotation)
export async function addResponse(quoteId, data) {
  try {
    const docRef = await addDoc(quoteResponsesRef(quoteId), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    // Invalidate quote cache since it may change status
    await AsyncStorage.removeItem(CACHE_PREFIX + 'quote_' + quoteId);
    return docRef.id;
  } catch (err) {
    console.error('[firestoreService] addResponse FAILED:', err.code, err.message);
    throw err;
  }
}

// Update a response (Accept / Reject / Save)
export async function updateResponse(quoteId, responseId, data) {
  try {
    await updateDoc(quoteResponseDoc(quoteId, responseId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('[firestoreService] updateResponse FAILED:', err.code, err.message);
    throw err;
  }
}

// Get all responses for a quote (Client sees provider quotations)
export function subscribeQuoteResponses(quoteId, callback) {
  const q = query(quoteResponsesRef(quoteId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setCache('responses_' + quoteId, items);
    callback(items);
  }, (error) => {
    console.error('[firestoreService] subscribeQuoteResponses ERROR:', error.code, error.message);
    getCached('responses_' + quoteId).then((cached) => {
      if (cached) callback(cached);
    });
  });
}

// Get responses count for a quote
export async function getResponseCount(quoteId) {
  try {
    const snapshot = await getDocs(quoteResponsesRef(quoteId));
    return snapshot.size;
  } catch (err) {
    console.error('[firestoreService] getResponseCount FAILED:', err.code, err.message);
    return 0;
  }
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
  }, (error) => {
    console.error('[firestoreService] subscribeUserQuotations ERROR:', error.code, error.message);
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
  }, (error) => {
    console.error('[firestoreService] subscribeUserQuotationsByStatus ERROR:', error.code, error.message);
    // Serve cached data on error
    getCached('userQuotes_' + userId + '_' + status).then((cached) => {
      if (cached) callback(cached);
    });
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
  }, (error) => {
    console.error('[firestoreService] subscribeActiveQuotations ERROR:', error.code, error.message);
  });
}

// Add a new quotation (legacy user-scoped)
export async function addQuotation(userId, data) {
  try {
    const docRef = await addDoc(userQuotationsRef(userId), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.error('[firestoreService] addQuotation FAILED:', err.code, err.message);
    throw err;
  }
}

// Update a quotation (legacy user-scoped)
export async function updateQuotation(userId, quoteId, data) {
  try {
    await updateDoc(userQuotationDoc(userId, quoteId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('[firestoreService] updateQuotation FAILED:', err.code, err.message);
    throw err;
  }
}

// Delete a quotation (legacy user-scoped)
export async function deleteQuotation(userId, quoteId) {
  try {
    await deleteDoc(userQuotationDoc(userId, quoteId));
  } catch (err) {
    console.error('[firestoreService] deleteQuotation FAILED:', err.code, err.message);
    throw err;
  }
}

// Get a single quotation (legacy user-scoped)
export async function getQuotation(userId, quoteId) {
  try {
    const docSnap = await getDoc(userQuotationDoc(userId, quoteId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (err) {
    console.error('[firestoreService] getQuotation FAILED:', err.code, err.message);
    throw err;
  }
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
  }, (error) => {
    console.error('[firestoreService] subscribeQuotationCounts ERROR:', error.code, error.message);
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
  }, (error) => {
    console.error('[firestoreService] subscribeQuoteCounts ERROR:', error.code, error.message);
  });
}

// ─── Delete All User Data ────────────────────────────────────────────────

export async function deleteAllUserData(userId) {
  try {
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

    // Clear all caches for this user
    const keys = await AsyncStorage.getAllKeys();
    const userKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    if (userKeys.length > 0) {
      await AsyncStorage.multiRemove(userKeys);
    }
  } catch (err) {
    console.error('[firestoreService] deleteAllUserData FAILED:', err.code, err.message);
    throw err;
  }
}

// ─── User Profile (with cache) ────────────────────────────────────────────

export async function getUserProfile(uid) {
  // Try cache first
  const cached = await getCached('profile_' + uid);
  if (cached) return cached;

  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      const data = { uid, ...docSnap.data() };
      await setCache('profile_' + uid, data);
      return data;
    }
    return null;
  } catch (err) {
    console.error('[firestoreService] getUserProfile FAILED:', err.code, err.message);
    // Try cache on error
    const fallback = await getCached('profile_' + uid);
    if (fallback) return fallback;
    throw err;
  }
}

export async function updateUserProfile(uid, data) {
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
    // Update cache
    await setCache('profile_' + uid, { uid, ...data });
  } catch (err) {
    console.error('[firestoreService] updateUserProfile FAILED:', err.code, err.message);
    throw err;
  }
}

// ─── Legacy compatibility (global quotations collection) ─────────────────

export function subscribeQuotations(callback) {
  const q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  }, (error) => {
    console.error('[firestoreService] subscribeQuotations ERROR:', error.code, error.message);
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
  }, (error) => {
    console.error('[firestoreService] subscribeQuotationsByStatus ERROR:', error.code, error.message);
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
  }, (error) => {
    console.error('[firestoreService] subscribeSavedQuotations ERROR:', error.code, error.message);
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
  }, (error) => {
    console.error('[firestoreService] subscribeDrafts ERROR:', error.code, error.message);
  });
}

export async function addDraft(userId, data) {
  try {
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
  } catch (err) {
    console.error('[firestoreService] addDraft FAILED:', err.code, err.message);
    throw err;
  }
}

export async function deleteDraft(userId, id) {
  try {
    await deleteDoc(userQuotationDoc(userId, id));
  } catch (err) {
    console.error('[firestoreService] deleteDraft FAILED:', err.code, err.message);
    throw err;
  }
}

// ─── Firestore Connectivity Test ─────────────────────────────────────────
// Call this to check if Firestore is reachable and rules are configured.
export async function testFirestoreConnection() {
  try {
    // Attempt a simple read from the quotes collection
    const snapshot = await getDocs(query(quotesRef(), orderBy('createdAt', 'desc')));
    return { ok: true, message: 'Firestore is reachable', docCount: snapshot.size };
  } catch (err) {
    const code = err.code || 'unknown';
    let message = err.message || 'Unknown error';
    if (code === 'permission-denied') {
      message = 'Firestore security rules are blocking access. Deploy firestore.rules to your Firebase project.';
    }
    return { ok: false, code, message };
  }
}
