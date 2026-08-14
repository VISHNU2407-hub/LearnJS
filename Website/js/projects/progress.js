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

/**
 * Persist step-level progress for a guided build (project learning page).
 * Writes the same users/{uid}/progress/{slug} doc the dashboard reads, so
 * step completion shows up as normal project progress everywhere.
 * @param {string} uid             current user id
 * @param {string} slug            project id
 * @param {number[]} stepsCompleted 1-based indexes of completed steps
 * @param {number} total           total number of steps in the workshop
 * @param {Object} [existing]      current progress doc (to preserve startedAt)
 */
export async function setProjectSteps(uid, slug, stepsCompleted, total, existing) {
  const prev = existing || {};
  const percent = total ? Math.round((stepsCompleted.length / total) * 100) : 0;
  await setDoc(progressRef(uid, slug), {
    status: percent >= 100 ? "completed" : "started",
    percent,
    stepsCompleted,
    updatedAt: serverTimestamp(),
    startedAt: prev.startedAt || serverTimestamp()
  }, { merge: true });
}
// end of progress.js
