/**
 * Firestore data-layer module.
 * All CRUD operations for the app's collections are centralised here so that
 * calling code never imports Firestore APIs directly.
 */
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert a Firestore document snapshot to a plain JS object.
 * Firestore Timestamps are converted to JS Date objects.
 */
function docToObject(snapshot) {
  const data = snapshot.data();
  if (!data) return null;
  const result = { ...data, id: snapshot.id };
  // Convert Firestore Timestamp fields to Date
  for (const key of Object.keys(result)) {
    if (result[key] && typeof result[key].toDate === 'function') {
      result[key] = result[key].toDate();
    }
  }
  return result;
}

// ─── Prayer Requests ─────────────────────────────────────────────────────────

const PRAYER_REQUESTS = 'prayerRequests';

/**
 * Fetch all prayer requests ordered by creation date (newest first).
 * @returns {Promise<Array>}
 */
export async function getPrayerRequests() {
  const q = query(
    collection(db, PRAYER_REQUESTS),
    orderBy('created_date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToObject);
}

/**
 * Fetch a single prayer request by its Firestore document ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getPrayerRequestById(id) {
  const ref = doc(db, PRAYER_REQUESTS, id);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? docToObject(snapshot) : null;
}

/**
 * Create a new prayer request document.
 * @param {Object} data  Fields: title, description, category, is_public, requester_name
 * @returns {Promise<string>} The new document ID
 */
export async function addPrayerRequest(data) {
  const docRef = await addDoc(collection(db, PRAYER_REQUESTS), {
    ...data,
    prayer_count: 0,
    is_answered: false,
    created_date: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Increment the prayer_count of a prayer request by 1.
 * @param {string} id  Firestore document ID
 */
export async function incrementPrayerCount(id) {
  const ref = doc(db, PRAYER_REQUESTS, id);
  await updateDoc(ref, { prayer_count: increment(1) });
}

// ─── Testimonies ─────────────────────────────────────────────────────────────

const TESTIMONIES = 'testimonies';

/**
 * Fetch all testimonies ordered by creation date (newest first).
 * @returns {Promise<Array>}
 */
export async function getTestimonies() {
  const q = query(
    collection(db, TESTIMONIES),
    orderBy('created_date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToObject);
}

/**
 * Create a new testimony document.
 * @param {Object} data  Fields: title, description, verse_reference (optional)
 * @returns {Promise<string>} The new document ID
 */
export async function addTestimony(data) {
  const docRef = await addDoc(collection(db, TESTIMONIES), {
    ...data,
    created_date: serverTimestamp(),
  });
  return docRef.id;
}

// ─── Community Posts ──────────────────────────────────────────────────────────

const COMMUNITY_POSTS = 'communityPosts';

/**
 * Fetch all community posts ordered by creation date (newest first).
 * @returns {Promise<Array>}
 */
export async function getCommunityPosts() {
  const q = query(
    collection(db, COMMUNITY_POSTS),
    orderBy('created_date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToObject);
}

/**
 * Create a new community post document.
 * @param {Object} data  Fields: author_name, content, post_type
 * @returns {Promise<string>} The new document ID
 */
export async function addCommunityPost(data) {
  const docRef = await addDoc(collection(db, COMMUNITY_POSTS), {
    ...data,
    likes: 0,
    replies: 0,
    created_date: serverTimestamp(),
  });
  return docRef.id;
}

// ─── Comments ─────────────────────────────────────────────────────────────────

const COMMENTS = 'comments';

/**
 * Fetch comments for a specific prayer request, ordered newest first.
 * @param {string} prayerRequestId
 * @returns {Promise<Array>}
 */
export async function getComments(prayerRequestId) {
  const q = query(
    collection(db, COMMENTS),
    where('prayer_request_id', '==', prayerRequestId),
    orderBy('created_date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToObject);
}

/**
 * Create a new comment document.
 * @param {Object} data  Fields: prayer_request_id, content, type
 * @returns {Promise<string>} The new document ID
 */
export async function addComment(data) {
  const docRef = await addDoc(collection(db, COMMENTS), {
    ...data,
    created_date: serverTimestamp(),
  });
  return docRef.id;
}
