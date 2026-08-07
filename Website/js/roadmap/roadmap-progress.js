/* ============================================================
   LearnJS — roadmap-progress.js (js/roadmap)
   Shared progress store for the roadmap module, backed by
   Firestore at users/{uid}/roadmap.

   The roadmap curriculum lives in the shared Firestore document
   roadmaps/javascript (loaded via roadmap-loader.js); only
   user-specific progress lives here in users/{uid}/roadmap:
     - completedSubtopics  { topicId: [lessonIndexes] }  (source of truth)
     - completedTopics     [topicIds]  (derived: all lessons done)
     - overallPercent      0–100      (derived from the curriculum)
     - currentTopic / currentLesson   (where the user left off)
     - lastVisitedTopic / lastLearningTimestamp
     - notes               { topicId: text }

   Design notes:
     - The public API is synchronous (topicDoneCount, isLessonDone,
       getCurrent, getNotes, …) backed by an in-memory cache that is
       hydrated from Firestore and kept live via onSnapshot — so the
       Roadmap and Learning panels auto-refresh when progress changes
       (including from other tabs/devices).
     - Writes are optimistic: the cache + UI update immediately, then
       the change is pushed to Firestore.
     - A document signature guards against emit loops caused by our
       own writes echoing back through the snapshot listener.
     - Old localStorage progress (learnjs-roadmap-*) is migrated into
       Firestore once on first load, then cleared.
   ============================================================ */

import { db } from "../../js/firebase/firestore.js";
import {
  doc,
  onSnapshot,
  runTransaction,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { loadRoadmap } from "./roadmap-loader.js";

/* ---------- state ---------- */
let uid = null;          // current Firebase user id
let docRef = null;       // users/{uid}/roadmap
let data = null;         // normalized in-memory copy of the Firestore doc
let curriculum = null;   // topicId -> { levelId, total } (built from local JSON)
let unsub = null;        // snapshot listener teardown
let listeners = [];      // pub/sub subscribers (roadmap.js + learning.js)
let lastSig = null;      // signature of the last handled snapshot

/* Old localStorage keys (migrated once into Firestore). */
const OLD_PROGRESS_KEY = "learnjs-roadmap-progress";
const OLD_NOTES_KEY = "learnjs-roadmap-notes";
const OLD_CURRENT_KEY = "learnjs-roadmap-current";

/* ---------- doc normalization ---------- */
function normalize(raw) {
  if (!raw) return null;
  return {
    completedSubtopics: raw.completedSubtopics && typeof raw.completedSubtopics === "object" ? raw.completedSubtopics : {},
    completedTopics: Array.isArray(raw.completedTopics) ? raw.completedTopics : [],
    currentTopic: raw.currentTopic || "",
    currentLesson: typeof raw.currentLesson === "number" ? raw.currentLesson : 0,
    lastVisitedTopic: raw.lastVisitedTopic || "",
    lastLearningTimestamp: typeof raw.lastLearningTimestamp === "number" ? raw.lastLearningTimestamp : 0,
    overallPercent: typeof raw.overallPercent === "number" ? raw.overallPercent : 0,
    notes: raw.notes && typeof raw.notes === "object" ? raw.notes : {},
    updatedAt: raw.updatedAt || null
  };
}

/** Stable signature of the doc — skips echo snapshots from our own writes. */
function signature(next) {
  if (!next) return "null";
  return JSON.stringify([
    next.completedSubtopics,
    next.completedTopics,
    next.overallPercent,
    next.currentTopic,
    next.currentLesson,
    next.notes
  ]);
}

function handleSnapshot(snap) {
  const next = normalize(snap.exists() ? snap.data() : null);
  const sig = signature(next);
  if (sig === lastSig) return; // our own write echoed back — nothing new
  lastSig = sig;
  data = next;
  // One-time import of legacy localStorage progress (kept for existing users).
  if (!next) migrateFromLocalStorage();
  emit();
}

function buildCurriculum(roadmap) {
  const map = {};
  (roadmap.levels || []).forEach((level) =>
    (level.topics || []).forEach((t) => {
      map[t.id] = { levelId: level.id, total: (t.subtopics || []).length };
    })
  );
  return map;
}

/* ---------- derived helpers (curriculum-aware) ---------- */
function deriveCompletedTopics(sub) {
  const out = [];
  Object.keys(curriculum || {}).forEach((topicId) => {
    const total = curriculum[topicId].total;
    if (total > 0 && (sub[topicId] || []).length >= total) out.push(topicId);
  });
  return out;
}

function deriveOverallPercent(sub) {
  let done = 0;
  let total = 0;
  Object.keys(curriculum || {}).forEach((topicId) => {
    total += curriculum[topicId].total;
    done += Math.min((sub[topicId] || []).length, curriculum[topicId].total);
  });
  return total ? Math.round((done / total) * 100) : 0;
}

/* ---------- Firestore writes (optimistic, fire-and-forget) ---------- */
function writeDoc(patch) {
  if (!uid || !docRef) return;
  setDoc(docRef, patch, { merge: true }).catch((err) => {
    console.warn("[LearnJS] Roadmap progress save failed:", err.message);
  });
}

/* ---------- lesson completion ---------- */
export function getProgress() {
  return data ? data.completedSubtopics : {};
}

/** Toggle a lesson (subtopic index within a topic). Returns the new done state. */
export function toggleLesson(topicId, lessonIndex) {
  const base = data || {};
  const sub = { ...(base.completedSubtopics || {}) };
  const set = new Set(sub[topicId] || []);
  const had = set.has(lessonIndex);
  if (had) set.delete(lessonIndex);
  else set.add(lessonIndex);
  if (set.size) sub[topicId] = [...set].sort((a, b) => a - b);
  else delete sub[topicId];

  data = { ...base, completedSubtopics: sub };

  // Update the UI immediately — Firestore catches up right behind it.
  emit();
  transactToggle(topicId, lessonIndex);
  return !had;
}

/**
 * Race-safe Firestore write for lesson completion: read the freshest doc
 * inside a transaction, apply the toggle, then write — so concurrent tabs
 * or delayed writes never clobber each other's completedSubtopics.
 */
async function transactToggle(topicId, lessonIndex) {
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(docRef);
      const freshest = normalize(snap.exists() ? snap.data() : null);
      const sub = { ...(freshest ? freshest.completedSubtopics : {}) };
      const set = new Set(sub[topicId] || []);
      if (set.has(lessonIndex)) set.delete(lessonIndex);
      else set.add(lessonIndex);
      if (set.size) sub[topicId] = [...set].sort((a, b) => a - b);
      else delete sub[topicId];
      tx.set(docRef, {
        completedSubtopics: sub,
        completedTopics: deriveCompletedTopics(sub),
        overallPercent: deriveOverallPercent(sub),
        lastVisitedTopic: topicId,
        lastLearningTimestamp: Date.now(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
  } catch (err) {
    console.warn("[LearnJS] Roadmap progress save failed:", err.message);
    // Mirror the projects flow — surface persistence failures to the user.
    if (window.LearnJS && window.LearnJS.toast) {
      window.LearnJS.toast("Could not save progress — check your connection.", "error");
    }
  }
}

export function isLessonDone(topicId, lessonIndex) {
  const arr = data && data.completedSubtopics ? data.completedSubtopics[topicId] : null;
  return !!(arr && arr.indexOf(lessonIndex) !== -1);
}

/** Number of completed lessons in a topic. */
export function topicDoneCount(topicId) {
  const arr = data && data.completedSubtopics ? data.completedSubtopics[topicId] : null;
  return arr ? arr.length : 0;
}

/** Completed / total for a topic object (progress is computed from data). */
export function topicProgress(topic) {
  const total = topic && topic.subtopics ? topic.subtopics.length : 0;
  if (!total) return 0;
  return Math.round((topicDoneCount(topic.id) / total) * 100);
}

/** Overall completion percentage across every topic of the roadmap. */
export function overallProgress(levels) {
  let done = 0;
  let total = 0;
  (levels || []).forEach((level) =>
    (level.topics || []).forEach((topic) => {
      total += topic.subtopics ? topic.subtopics.length : 0;
      done += topicDoneCount(topic.id);
    })
  );
  return total ? Math.round((done / total) * 100) : 0;
}

/** Total completed lessons across the whole roadmap (for stat copy). */
export function overallDone(levels) {
  let done = 0;
  (levels || []).forEach((level) =>
    (level.topics || []).forEach((topic) => {
      done += topicDoneCount(topic.id);
    })
  );
  return done;
}

/* ---------- last visited lesson ---------- */
export function getCurrent() {
  if (!data || !data.currentTopic) return null;
  const meta = curriculum ? curriculum[data.currentTopic] : null;
  return {
    levelId: meta ? meta.levelId : null,
    topicId: data.currentTopic,
    lessonIndex: data.currentLesson || 0
  };
}

export function setCurrent(state) {
  if (!state || !state.topicId) return;
  const topicId = state.topicId;
  const lessonIndex = state.lessonIndex || 0;
  const base = data || {};
  // Skip redundant writes (renderLearning re-enters this on every render).
  if (base.currentTopic === topicId && (base.currentLesson || 0) === lessonIndex) return;

  data = {
    ...base,
    currentTopic: topicId,
    currentLesson: lessonIndex,
    lastVisitedTopic: topicId,
    lastLearningTimestamp: Date.now()
  };
  writeDoc({
    currentTopic: topicId,
    currentLesson: lessonIndex,
    lastVisitedTopic: topicId,
    lastLearningTimestamp: Date.now(),
    updatedAt: serverTimestamp()
  });
}

/* ---------- personal notes ---------- */
export function getNotes(topicId) {
  return (data && data.notes && data.notes[topicId]) || "";
}

export function setNotes(topicId, text) {
  const base = data || {};
  const notes = { ...(base.notes || {}) };
  if (text) notes[topicId] = text;
  else delete notes[topicId];
  data = { ...base, notes };
  writeDoc({ notes, updatedAt: serverTimestamp() });
}

/* ---------- pub/sub ---------- */
export function subscribe(fn) {
  listeners.push(fn);
}
function emit() {
  listeners.forEach((fn) => {
    try { fn(); } catch (err) { console.warn("[LearnJS] roadmap progress listener error:", err.message); }
  });
}

/* ---------- legacy localStorage migration ---------- */
function migrateFromLocalStorage() {
  try {
    const oldProgress = JSON.parse(localStorage.getItem(OLD_PROGRESS_KEY) || "null");
    const oldNotes = JSON.parse(localStorage.getItem(OLD_NOTES_KEY) || "null");
    const oldCurrent = JSON.parse(localStorage.getItem(OLD_CURRENT_KEY) || "null");
    if (!oldProgress && !oldNotes && !oldCurrent) return;

    const sub = {};
    Object.keys(oldProgress || {}).forEach((topicId) => {
      const done = oldProgress[topicId] && oldProgress[topicId].done;
      if (Array.isArray(done)) sub[topicId] = done;
    });

    const patch = {
      completedSubtopics: sub,
      completedTopics: deriveCompletedTopics(sub),
      overallPercent: deriveOverallPercent(sub),
      notes: oldNotes && typeof oldNotes === "object" ? oldNotes : {},
      lastLearningTimestamp: Date.now(),
      updatedAt: serverTimestamp()
    };
    if (oldCurrent && oldCurrent.topicId) {
      patch.currentTopic = oldCurrent.topicId;
      patch.currentLesson = oldCurrent.lessonIndex || 0;
      patch.lastVisitedTopic = oldCurrent.topicId;
    }

    // Apply the migrated values to the in-memory cache immediately so readers
    // (e.g. learning.js getCurrent()) see them before the write echoes back —
    // otherwise the first-lesson fallback could overwrite the migrated spot.
    data = normalize(patch);

    // Clear the legacy keys ONLY once the migration write actually landed,
    // so a failed write never destroys the user's existing progress.
    setDoc(docRef, patch)
      .then(() => {
        localStorage.removeItem(OLD_PROGRESS_KEY);
        localStorage.removeItem(OLD_NOTES_KEY);
        localStorage.removeItem(OLD_CURRENT_KEY);
      })
      .catch(() => { /* keep the legacy keys — a later visit can retry */ });
  } catch (err) {
    /* migration is best-effort — never block the app */
  }
}

/* ---------- boot ---------- */
/**
 * Start the Firestore-backed progress store for the signed-in user.
 * Resolves once the first snapshot has been handled (or failed), so the
 * dashboard can render with progress already available.
 */
export async function initProgress(user) {
  if (!user) return;
  uid = user.uid;
  docRef = doc(db, "users", uid, "roadmap");
  // The curriculum map drives the derived completedTopics/overallPercent.
  curriculum = buildCurriculum(await loadRoadmap());

  if (unsub) unsub();

  let resolveFirst = null;
  const first = new Promise((resolve) => { resolveFirst = resolve; });
  // Safety valve: never block the caller indefinitely if Firestore is slow,
  // offline or unreachable. The snapshot listener still syncs progress the
  // moment a connection is available — this only bounds the initial await.
  const guard = setTimeout(() => {
    if (resolveFirst) { resolveFirst(); resolveFirst = null; }
  }, 4000);
  unsub = onSnapshot(
    docRef,
    (snap) => {
      clearTimeout(guard);
      handleSnapshot(snap);
      if (resolveFirst) { resolveFirst(); resolveFirst = null; }
    },
    (err) => {
      // Firestore unavailable (offline, rules, etc.) — degrade gracefully.
      console.warn("[LearnJS] Roadmap progress listener error:", err.message);
      clearTimeout(guard);
      if (resolveFirst) { resolveFirst(); resolveFirst = null; }
    }
  );
  await first;
}
// end of roadmap-progress.js
