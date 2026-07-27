/**
 * Firestore data-layer module.
 * All CRUD operations for the app's collections are centralised here so that
 * calling code never imports Firestore APIs directly.
 */
import { db } from '@/lib/firebase';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where, // <-- add this
} from 'firebase/firestore';
// Example shape — adapt to your existing DB client (supabase/sqlite/fetch/etc.)
export async function getCommunityReplies(postId) {
  // return array of replies for this post, newest/oldest as you prefer
}

export async function addCommunityReply({ post_id, author_name, content }) {
  // insert reply row
}

const PRAYER_REQUESTS = 'prayer_requests';

function docToObject(docSnap) {
  const data = docSnap.data() || {};
  return {
    id: docSnap.id,
    ...data,
    created_date:
      data.created_date?.toDate?.() ||
      data.created_date_client?.toDate?.() ||
      data.created_date ||
      null,
  };
}

const PRESET_PRAYER_REQUESTS = [
  {
    id: 'preset-1',
    title: 'Peace in my family',
    description: 'Please pray for unity, forgiveness, and peace in our home.',
    category: 'family',
    is_public: true,
    is_answered: false,
    requester_name: 'Community',
    prayer_count: 12,
    created_date: new Date('2026-01-10T09:00:00Z'),
  },
  {
    id: 'preset-2',
    title: 'Healing and strength',
    description: 'Pray for complete healing and daily strength during recovery.',
    category: 'health',
    is_public: true,
    is_answered: false,
    requester_name: 'Community',
    prayer_count: 18,
    created_date: new Date('2026-02-02T12:00:00Z'),
  },
  {
    id: 'preset-3',
    title: 'Wisdom for work decisions',
    description: 'Pray for discernment and favor in career direction.',
    category: 'career',
    is_public: true,
    is_answered: false,
    requester_name: 'Community',
    prayer_count: 9,
    created_date: new Date('2026-03-14T08:30:00Z'),
  },
];

export async function addPrayerRequest(data) {
  const now = Timestamp.now();

  // Firestore rejects undefined values
  const cleaned = Object.fromEntries(
    Object.entries(data || {}).filter(([, v]) => v !== undefined)
  );

  const payload = {
    ...cleaned,
    title: cleaned.title ?? '',
    description: cleaned.description ?? '',
    category: cleaned.category ?? 'general',
    requester_name: cleaned.requester_name ?? 'Anonymous',
    is_public: typeof cleaned.is_public === 'boolean' ? cleaned.is_public : true,
    prayer_count: 0,
    is_answered: false,
    created_date_client: now,
    created_date: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, PRAYER_REQUESTS), payload);
  return docRef.id;
}

export async function getPrayerRequests(max = 50) {
  try {
    const q = query(collection(db, PRAYER_REQUESTS), orderBy('created_date', 'desc'), limit(max));
    const snapshot = await getDocs(q);
    // If we get here and snapshot is empty, do NOT return mock data automatically.
    return snapshot.docs.map(docToObject);
  } catch (err) {
    console.error('Firebase Query Error:', err);
    throw err; // Let the UI handle the error rather than returning mock data
  }
}

export async function getPrayerRequestById(id) {
  if (!id) return null;

  // Return preset immediately for preset IDs
  if (id.startsWith('preset-')) {
    return PRESET_PRAYER_REQUESTS.find((p) => p.id === id) || null;
  }

  try {
    const ref = doc(db, PRAYER_REQUESTS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return docToObject(snap);
  } catch (err) {
    console.warn('getPrayerRequestById failed:', err);
    return null;
  }
}

export async function incrementPrayerCount(id) {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid prayer request id');
  }

  // Preset items are fallback-only, not stored in Firestore
  if (id.startsWith('preset-')) {
    throw new Error('Cannot persist prayer_count for preset request');
  }

  const ref = doc(db, PRAYER_REQUESTS, id);
  await updateDoc(ref, { prayer_count: increment(1) });
  return true;
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
const REPLIES = 'community_replies'; // Use a constant for consistency

/**
 * Fetch all community posts ordered by creation date (newest first).
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

/**
 * Add a reply to a specific community post.
 */
export async function addCommunityReply({ post_id, author_name, content }) {
  if (!post_id || !author_name || !content) {
    throw new Error("Missing required fields for reply");
  }

  try {
    const repliesRef = collection(db, REPLIES);
    const docRef = await addDoc(repliesRef, {
      post_id: post_id,
      author_name: author_name,
      content: content,
      created_date: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.error("Error adding reply to Firestore:", err);
    throw err;
  }
}

export async function getCommunityReplies(postId) {
  const q = query(
    collection(db, 'community_replies'), // MUST match the name in addCommunityReply
    where('post_id', '==', postId),
    orderBy('created_date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToObject);
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
