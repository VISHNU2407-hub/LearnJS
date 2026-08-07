/* ============================================================
   LearnJS — roadmap-progress.js (js/roadmap)
   Shared progress store for the roadmap module, backed by
   Firestore at users/{uid}/roadmap/roadmap.

   The roadmap curriculum lives in the shared Firestore document
   roadmaps/javascript (loaded via roadmap-loader.js); only
   user-specific progress lives here in users/{uid}/roadmap/roadmap:
     - completedSubtopics  { topicId: [lessonIndexes] }  (source of truth)
     - completedTopics     [topicIds]  (derived: all lessons done)
     - overallPercent      0–100      (derived from the curriculum)
     - currentTopic / currentLesson   (where the user left off)
     - lastVisitedTopic / lastLearningTimestamp
     - notes               { topicId: text }

   Reliability & debugging:
     - No silent failures: every Firestore write logs its result and
       shows an error toast when it fails.
     - Every lesson toggle is verified against the server (one retry)
       before the UI keeps the optimistic state.
     - If Firestore rejects the transaction, the optimistic update is
       rolled back.
     - A sync-health state drives a visible "Progress cannot be synced."
       banner when Firestore is unreachable.
     - flushWrites() lets the dashboard wait for in-flight writes before
       navigating away on logout.
     - A dev-only debug panel (dashboard) reads getDebugInfo().
     - Old localStorage progress (learnjs-roadmap-*) is migrated into
       Firestore once on first load, then cleared.

   NOTE on the document path: Firestore document references require an
   EVEN number of path segments (collection/document pairs). The previous
   code used doc(db, "users", uid, "roadmap") — a 3-segment (odd) path —
   which the SDK rejects with INVALID_ARGUMENT, so every read/write failed
   silently. The valid path under users/{uid}/roadmap needs a document id,
   here "roadmap": users/{uid}/roadmap/roadmap.
   ============================================================ */

import { db } from "../../js/firebase/firestore.js";
import {
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { loadRoadmap } from "./roadmap-loader.js";

/* ---------- state ---------- */
let uid = null;            // current Firebase user id
let docRef = null;         // users/{uid}/roadmap/{ROADMAP_DOC_ID}
let data = null;           // normalized in-memory copy of the Firestore doc
let curriculum = null;     // topicId -> { levelId, total } (built from local JSON)
let unsub = null;          // snapshot listener teardown
let listeners = [];        // pub/sub subscribers (roadmap.js + learning.js)
let lastSig = null;        // signature of the last handled snapshot
let docExists = false;     // whether the Firestore doc exists (set on snapshot)

/* Sync-health + debugging state. */
const ROADMAP_DOC_ID = "roadmap";     // doc id under users/{uid}/roadmap
const pendingWrites = new Set();      // in-flight Firestore write promises
let syncListeners = [];               // offline banner + debug panel subscribers
let syncHealthy = null;               // null = unknown, true = ok, false = failed
let snapshotStatus = "idle";          // idle | listening | live | error
let lastSyncTime = 0;                 // ms epoch of the last successful sync

/* Old localStorage keys (migrated once into Firestore). */
const OLD_PROGRESS_KEY = "learnjs-roadmap-progress";
const OLD_NOTES_KEY = "learnjs-roadmap-notes";
const OLD_CURRENT_KEY = "learnjs-roadmap-current";

/* ---------- helpers ---------- */
function logInfo(...args) {
  // Diagnostics are debug-only — printed solely when the dev flag is on.
  if (isDev()) console.log("[LearnJS][Roadmap]", ...args);
}

/**
 * Development mode is driven by an explicit flag — it is NEVER inferred from
 * hostname or protocol. Internal state (UID, Firestore paths, pending writes,
 * sync health) must not surface in production, so it is only shown when
 * window.LEARNJS_DEV === true.
 */
export function isDev() {
  try {
    return window.LEARNJS_DEV === true;
  } catch (err) {
    return false;
  }
}

function docPath() {
  return uid ? "users/" + uid + "/roadmap/" + ROADMAP_DOC_ID : null;
}

function notifySync() {
  syncListeners.forEach((fn) => {
    try { fn(); } catch (err) { console.warn("[LearnJS][Roadmap] sync listener error:", err.message); }
  });
}

/** Update sync health and ping subscribers (offline banner / debug panel). */
function markSync(success, status) {
  syncHealthy = success;
  if (status) snapshotStatus = status;
  if (success) lastSyncTime = Date.now();
  notifySync();
}

/** Unified failure handling: log the Firestore error + surface a toast. */
function reportError(context, err, toastMsg) {
  const detail = err && err.message ? err.message : String(err);
  console.error("[LearnJS][Roadmap] " + context + " —", detail, err || "");
  if (toastMsg && window.LearnJS && window.LearnJS.toast) {
    window.LearnJS.toast(toastMsg, "error");
  }
  markSync(false, "error");
}

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

/** Returns true when the snapshot actually changed the in-memory state. */
function handleSnapshot(snap) {
  const next = normalize(snap.exists() ? snap.data() : null);
  docExists = snap.exists();
  const sig = signature(next);
  if (sig === lastSig) {
    logInfo("Snapshot update (no change)", { path: docPath(), exists: docExists });
    return false;
  }
  lastSig = sig;
  data = next;
  // One-time import of legacy localStorage progress (kept for existing users).
  if (!next) migrateFromLocalStorage();
  emit();
  return true;
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

/** Number of topics whose lessons are all completed (from current data). */
function countCompletedTopics() {
  const sub = data && data.completedSubtopics ? data.completedSubtopics : {};
  return deriveCompletedTopics(sub).length;
}

/* ---------- Firestore writes (optimistic, tracked, never silent) ---------- */
function trackWrite(promise) {
  pendingWrites.add(promise);
  notifySync();
  promise.then(
    () => pendingWrites.delete(promise),
    () => pendingWrites.delete(promise)
  );
  return promise;
}

/** Fire-and-forget merge write; always logs + reports success/failure. */
function writeDoc(patch) {
  if (!uid || !docRef) {
    logInfo("Write skipped (no user/doc)", patch && Object.keys(patch));
    return Promise.resolve(false);
  }
  const p = setDoc(docRef, patch, { merge: true })
    .then(() => {
      logInfo("Firestore write OK", { path: docPath(), fields: Object.keys(patch) });
      markSync(true, "live");
      return true;
    })
    .catch((err) => {
      reportError(
        "Firestore write",
        err,
        "Could not save progress — " + (err.code || err.message || "unknown error")
      );
      return false;
    });
  return trackWrite(p);
}

/* ---------- lesson completion ---------- */
export function getProgress() {
  return data ? data.completedSubtopics : {};
}

/**
 * Toggle a lesson (subtopic index within a topic). Returns the new done state.
 * The optimistic UI updates immediately; if Firestore rejects the transaction
 * the optimistic update is rolled back and an error is shown.
 */
export function toggleLesson(topicId, lessonIndex) {
  const base = data || {};
  const prevSub = base.completedSubtopics || {};   // pre-toggle map (for rollback)
  const sub = { ...(base.completedSubtopics || {}) };
  const set = new Set(sub[topicId] || []);
  const had = set.has(lessonIndex);
  if (had) set.delete(lessonIndex);
  else set.add(lessonIndex);
  if (set.size) sub[topicId] = [...set].sort((a, b) => a - b);
  else delete sub[topicId];

  data = { ...base, completedSubtopics: sub };
  const newDone = !had;

  // Update the UI immediately — Firestore catches up right behind it.
  emit();

  transactToggle(topicId, lessonIndex).then((result) => {
    if (result === "rejected") {
      // Firestore rejected the transaction — undo ONLY the optimistic lesson
      // toggle, preserving any other fields (notes, current lesson, or a
      // concurrent tab's change) that a snapshot may have refreshed since.
      data = { ...(data || {}), completedSubtopics: prevSub };
      emit();
      logInfo("Rolled back optimistic update", { topicId, lessonIndex });
    }
    // "verify_failed" keeps the UI (we cannot be sure either way) but the
    // error was already reported by transactToggle.
  });

  return newDone;
}

/** Builds a new completedSubtopics map with lessonIndex toggled in source. */
function applyToggleToMap(source, topicId, lessonIndex) {
  const sub = { ...(source || {}) };
  const set = new Set(sub[topicId] || []);
  if (set.has(lessonIndex)) set.delete(lessonIndex);
  else set.add(lessonIndex);
  if (set.size) sub[topicId] = [...set].sort((a, b) => a - b);
  else delete sub[topicId];
  return sub;
}

function txPayload(tx, sub, topicId) {
  tx.set(docRef, {
    completedSubtopics: sub,
    completedTopics: deriveCompletedTopics(sub),
    overallPercent: deriveOverallPercent(sub),
    lastVisitedTopic: topicId,
    lastLearningTimestamp: Date.now(),
    updatedAt: serverTimestamp()
  }, { merge: true });
}

/**
 * True when the server doc reflects the local (optimistic) lesson state.
 * Deliberately checks the specific lesson's presence rather than full array
 * equality: the whole-topic array can legitimately differ when another tab
 * toggles the same topic concurrently, and a presence check still converges
 * to the user's intent without false failures.
 */
async function verifyLessonSynced(topicId, lessonIndex) {
  const localArr = data && data.completedSubtopics ? data.completedSubtopics[topicId] : null;
  const localDone = !!(localArr && localArr.indexOf(lessonIndex) !== -1);
  try {
    const snap = await getDoc(docRef, { source: "server" });
    const raw = snap.exists() ? snap.data() : null;
    const serverArr = raw && raw.completedSubtopics ? raw.completedSubtopics[topicId] : null;
    const serverDone = !!(serverArr && serverArr.indexOf(lessonIndex) !== -1);
    logInfo("Verify lesson sync", {
      topicId, lessonIndex, localDone, serverDone,
      localSub: localArr || [],
      serverSub: serverArr || []
    });
    return localDone === serverDone;
  } catch (err) {
    logInfo("Verify read failed", err && err.message);
    return false;
  }
}

/**
 * Race-safe Firestore write for lesson completion: read the freshest doc
 * inside a transaction, apply the toggle, then write — so concurrent tabs
 * or delayed writes never clobber each other's completedSubtopics.
 *
 * After the write the server document is re-read and verified against the
 * local state. On a mismatch the write is retried once (idempotently — the
 * retry SETS the intended topic state instead of toggling, so it can never
 * flip the change back). If verification still fails an error is shown.
 *
 * @returns {Promise<"ok"|"verify_failed"|"rejected">}
 */
async function transactToggle(topicId, lessonIndex) {
  if (!uid || !docRef) {
    reportError("Lesson toggle skipped (not initialized)", new Error("no user or document reference"), "Could not save progress — not signed in.");
    return "rejected";
  }

  const runToggle = async () => {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(docRef);
      const freshest = normalize(snap.exists() ? snap.data() : null);
      const sub = applyToggleToMap(freshest ? freshest.completedSubtopics : {}, topicId, lessonIndex);
      txPayload(tx, sub, topicId);
    });
  };

  // Retry: SET the intended topic state (idempotent) rather than toggle.
  const runSet = async () => {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(docRef);
      const freshest = normalize(snap.exists() ? snap.data() : null);
      const intended = data && data.completedSubtopics ? data.completedSubtopics[topicId] : null;
      const sub = { ...(freshest ? freshest.completedSubtopics : {}) };
      if (intended && intended.length) sub[topicId] = [...intended].sort((a, b) => a - b);
      else delete sub[topicId];
      txPayload(tx, sub, topicId);
    });
  };

  try {
    await runToggle();
    logInfo("Transaction OK", { topicId, lessonIndex, path: docPath() });
    markSync(true, "live");

    let verified = await verifyLessonSynced(topicId, lessonIndex);
    if (!verified) {
      logInfo("Verification mismatch — retrying once", { topicId, lessonIndex });
      await runSet();
      markSync(true, "live");
      verified = await verifyLessonSynced(topicId, lessonIndex);
    }

    if (!verified) {
      reportError(
        "Transaction verification",
        new Error("server state does not match local state after retry"),
        "Progress could not be verified on the server — check your connection."
      );
      return "verify_failed";
    }
    return "ok";
  } catch (err) {
    reportError(
      "Lesson transaction",
      err,
      "Could not save progress — " + (err.code || err.message || "unknown error")
    );
    return "rejected";
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

/** Subscribe to sync-health changes (offline banner, debug panel). */
export function subscribeSync(fn) {
  syncListeners.push(fn);
  return () => {
    syncListeners = syncListeners.filter((f) => f !== fn);
  };
}

/* ---------- debugging / diagnostics ---------- */
/**
 * Snapshot of store state for the dev debug panel and diagnostics.
 * @returns {Object} uid, path, snapshotStatus, lastSyncTime, pendingWrites,
 *                   completedTopics, currentLevel, currentLesson, syncHealthy
 */
export function getDebugInfo() {
  const cur = getCurrent();
  return {
    uid: uid || null,
    path: docPath(),
    snapshotStatus,
    lastSyncTime,
    pendingWrites: pendingWrites.size,
    completedTopics: countCompletedTopics(),
    currentLevel: cur ? cur.levelId : null,
    currentLesson: cur ? cur.lessonIndex : 0,
    syncHealthy
  };
}

/** Wait until every in-flight Firestore write has settled. */
export function flushWrites() {
  return Promise.allSettled([...pendingWrites]).then(() => {
    logInfo("Flush complete — " + pendingWrites.size + " pending writes left");
    return pendingWrites.size === 0;
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
    const p = setDoc(docRef, patch)
      .then(() => {
        logInfo("Legacy migration write OK", docPath());
        markSync(true, "live");
        localStorage.removeItem(OLD_PROGRESS_KEY);
        localStorage.removeItem(OLD_NOTES_KEY);
        localStorage.removeItem(OLD_CURRENT_KEY);
      })
      .catch((err) => {
        reportError("Legacy migration write", err, "Could not migrate your saved progress — old data is kept.");
      });
    trackWrite(p);
  } catch (err) {
    /* migration is best-effort — never block the app */
    console.error("[LearnJS][Roadmap] Legacy migration failed —", err);
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
  // Document references need an EVEN number of path segments — the valid
  // path for the roadmap subcollection is users/{uid}/roadmap/{docId}.
  docRef = doc(db, "users", uid, "roadmap", ROADMAP_DOC_ID);
  // The curriculum map drives the derived completedTopics/overallPercent.
  curriculum = buildCurriculum(await loadRoadmap());

  logInfo("initProgress", { uid, path: docPath() });

  if (unsub) unsub();

  let resolveFirst = null;
  const first = new Promise((resolve) => { resolveFirst = resolve; });
  // Safety valve: never block the caller indefinitely if Firestore is slow,
  // offline or unreachable. The snapshot listener still syncs progress the
  // moment a connection is available — this only bounds the initial await.
  const guard = setTimeout(() => {
    snapshotStatus = "error";
    notifySync();
    if (resolveFirst) { resolveFirst(); resolveFirst = null; }
  }, 4000);

  snapshotStatus = "listening";
  notifySync();

  unsub = onSnapshot(
    docRef,
    (snap) => {
      clearTimeout(guard);
      const changed = handleSnapshot(snap);
      const completedTopics = countCompletedTopics();
      logInfo("Snapshot update", {
        path: docPath(),
        exists: snap.exists(),
        changed,
        completedTopics
      });
      markSync(true, "live");
      if (resolveFirst) { resolveFirst(); resolveFirst = null; }
    },
    (err) => {
      clearTimeout(guard);
      snapshotStatus = "error";
      reportError("Snapshot listener", err, "Progress cannot be synced.");
      if (resolveFirst) { resolveFirst(); resolveFirst = null; }
    }
  );
  await first;

  // Login diagnostics — authenticated UID, doc path, existence, topics loaded.
  logInfo("Roadmap progress ready", {
    authenticatedUid: uid,
    documentPath: docPath(),
    documentExists: docExists,
    completedTopicsLoaded: countCompletedTopics()
  });
}
// end of roadmap-progress.js
