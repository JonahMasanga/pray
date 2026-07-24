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
  limit,
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


 export async function addPrayerRequest(data) {
+  const now = Timestamp.now();
   const docRef = await addDoc(collection(db, PRAYER_REQUESTS), {
     ...data,
+    is_public: typeof data?.is_public === 'boolean' ? data.is_public : true,
     prayer_count: 0,
     is_answered: false,
+    // Client timestamp for immediate ordering visibility
+    created_date_client: now,
     created_date: serverTimestamp(),
   });
   return docRef.id;
 }
+
+const PRESET_PRAYER_REQUESTS = [
+  {
+    id: 'preset-1',
+    title: 'Peace in my family',
+    description: 'Please pray for unity, forgiveness, and peace in our home.',
+    category: 'family',
+    is_public: true,
+    is_answered: false,
+    requester_name: 'Community',
+    prayer_count: 12,
+    created_date: new Date('2026-01-10T09:00:00Z'),
+  },
+  {
+    id: 'preset-2',
+    title: 'Healing and strength',
+    description: 'Pray for complete healing and daily strength during recovery.',
+    category: 'health',
+    is_public: true,
+    is_answered: false,
+    requester_name: 'Community',
+    prayer_count: 18,
+    created_date: new Date('2026-02-02T12:00:00Z'),
+  },
+  {
+    id: 'preset-3',
+    title: 'Wisdom for work decisions',
+    description: 'Pray for discernment and favor in career direction.',
+    category: 'career',
+    is_public: true,
+    is_answered: false,
+    requester_name: 'Community',
+    prayer_count: 9,
+    created_date: new Date('2026-03-14T08:30:00Z'),
+  },
+];
@@
 export async function getPrayerRequests(max = 50) {
-  const q = query(
-    collection(db, PRAYER_REQUESTS),
-    orderBy('created_date', 'desc'),
-    limit(max)
-  );
-  const snapshot = await getDocs(q);
-  return snapshot.docs.map(docToObject);
+  try {
+    // Prefer server timestamp ordering
+    const q = query(
+      collection(db, PRAYER_REQUESTS),
+      orderBy('created_date', 'desc'),
+      limit(max)
+    );
+    const snapshot = await getDocs(q);
+    const docs = snapshot.docs.map(docToObject);
+    return docs.length ? docs : PRESET_PRAYER_REQUESTS.slice(0, max);
+  } catch {
+    // Fallback for environments where created_date ordering/index isn't ready
+    const q2 = query(
+      collection(db, PRAYER_REQUESTS),
+      orderBy('created_date_client', 'desc'),
+      limit(max)
+    );
+    const snapshot2 = await getDocs(q2);
+    const docs2 = snapshot2.docs.map(docToObject);
+    return docs2.length ? docs2 : PRESET_PRAYER_REQUESTS.slice(0, max);
+  }
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

// ─── Comments ────────────────────────────────────────────────────────────────

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
