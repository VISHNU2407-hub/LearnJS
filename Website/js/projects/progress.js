/* ============================================================
   LearnJS — progress.js (js/projects)
   Shared per-user project progress persistence (Firestore).
   Used by the dashboard and the project details page so the
   same progress logic is never duplicated.
   ============================================================ */

import { db } from "../firebase/firestore.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/** Firestore ref to users/{uid}/progress/{slug}. */
export function progressRef(uid, slug) {
  return doc(db, "users", uid, "progress", slug);
}

/**
 * Persist progress for a project.
 * @param {string} uid     current user id
 * @param {string} slug    project id
 * @param {string} status  "started" | "completed"
 * @param {number} percent 0-100
 * @param {Object} [existing] current progress doc (to preserve startedAt)
 */
export async function setProjectProgress(uid, slug, status, percent, existing) {
  const prev = existing || {};
  await setDoc(progressRef(uid, slug), {
    status,
    percent,
    updatedAt: serverTimestamp(),
    startedAt: prev.startedAt || serverTimestamp()
  }, { merge: true });
}
// end of progress.js
