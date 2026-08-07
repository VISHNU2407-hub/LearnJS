/* ============================================================
   LearnJS — roadmap-loader.js (js/roadmap)
   Shared client-side loader for the LearnJS roadmap curriculum.

   PRIMARY SOURCE: the shared Firestore document `roadmaps/javascript`
   (read-only from the app — updated only through code and deployments,
   managed out-of-band via the Firebase console or an admin SDK). Every
   signed-in user reads the same curriculum document.

   Per-user state (progress, completed lessons, notes) is NEVER stored
   in this document — it lives under users/{uid}/roadmap (see
   roadmap-progress.js). Curriculum and user progress stay separate.

   Loading strategy (cache-first, Firestore as source of truth):
     1. in-memory cache (per page session, shared by all consumers)
     2. localStorage snapshot of the last successful Firestore fetch
     3. embedded window.LEARNJS_ROADMAP copy (data/roadmap-data.js)
     → Any of these renders the roadmap INSTANTLY, then Firestore is
       refreshed in the background so the next session sees fresh data.
     4. First visit with no cache at all: await Firestore (bounded by a
        timeout so a stalled connection can't block the UI), else the
        static Website/data/roadmap.json fetch as the last resort.

   The curriculum doc is static per deployment, so serving the cached
   copy first is safe: it loads fast, works fully offline, and is
   reconciled with Firestore on every visit.
   ============================================================ */

import { db } from "../firebase/firestore.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const ROADMAP_DOC_ID = "javascript";            // Firestore: roadmaps/javascript
const ROADMAP_URL = "../../data/roadmap.json";  // last-resort static copy
const CACHE_KEY = "learnjs-roadmap-curriculum"; // localStorage cache key
const FIRESTORE_TIMEOUT_MS = 3000;              // bound the Firestore read

/* The curriculum is static per deployment, so the first successful load is
   cached and shared by every consumer (roadmap.js + learning.js +
   roadmap-progress.js) on the same page. */
let cached = null;

function isValid(data) {
  return !!(data && Array.isArray(data.levels) && data.levels.length);
}

function readLocalCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return isValid(data) ? data : null;
  } catch (err) {
    return null;
  }
}

function writeLocalCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    // localStorage unavailable (private mode / quota) — cache is best-effort.
  }
}

/** Race a promise against a timeout so a stalled connection can't hang. */
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

/** Read the shared curriculum document from Firestore. */
async function fetchFromFirestore() {
  const snap = await withTimeout(getDoc(doc(db, "roadmaps", ROADMAP_DOC_ID)), FIRESTORE_TIMEOUT_MS);
  if (snap.exists()) {
    const data = snap.data();
    return isValid(data) ? data : null;
  }
  return null; // not seeded yet
}

/** Background refresh: Firestore is the source of truth; update caches. */
async function refreshFromFirestore() {
  try {
    const data = await fetchFromFirestore();
    if (data) {
      cached = data;
      writeLocalCache(data);
    }
  } catch (err) {
    // Firestore unreachable (offline, rules, not seeded) — keep the cache.
    console.warn("[LearnJS] Roadmap Firestore refresh unavailable:", err.message);
  }
}

/**
 * Load the full roadmap structure.
 * Always returns an object ({ levels, tracks, ... }); never throws.
 * @returns {Promise<Object>}
 */
export async function loadRoadmap() {
  if (cached) return cached;

  // Cache-first: serve an existing snapshot instantly so the roadmap never
  // stalls on a slow connection, then refresh Firestore in the background.
  const local = readLocalCache();
  const embedded = isValid(window.LEARNJS_ROADMAP) ? window.LEARNJS_ROADMAP : null;
  if (local || embedded) {
    cached = local || embedded;
    refreshFromFirestore(); // fire-and-forget — never blocks the UI
    return cached;
  }

  // First visit (no cache anywhere): await Firestore, bounded by a timeout.
  try {
    const data = await fetchFromFirestore();
    if (data) {
      cached = data;
      writeLocalCache(data);
      return cached;
    }
  } catch (err) {
    console.warn("[LearnJS] Roadmap Firestore fetch unavailable:", err.message);
  }

  // Last resort: the static JSON file (file:// friendly is the embedded copy,
  // which is already covered above — this covers a missing embed).
  try {
    const res = await fetch(ROADMAP_URL + "?t=" + Date.now(), { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (isValid(data)) {
        cached = data;
        return cached;
      }
    }
  } catch (err) {
    // fetch fails on file:// — nothing else to try.
  }

  return { levels: [], tracks: {} };
}
// end of roadmap-loader.js
