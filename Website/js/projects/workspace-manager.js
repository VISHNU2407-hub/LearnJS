/* ============================================================
   LearnJS — workspace-manager.js (js/projects)
   Per-user project workspace persistence using Firestore.

   Stores each user's editable project files at:
     users/{uid}/projectWorkspaces/{projectId}

   Each document contains:
     { html, css, js, updatedAt, createdAt }

   The workspace is isolated per user — User A's saved code
   never appears for User B.
   ============================================================ */

import { db } from "../firebase/firestore.js";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/**
 * Firestore ref to users/{uid}/projectWorkspaces/{projectId}.
 */
function workspaceRef(uid, projectId) {
  return doc(db, "users", uid, "projectWorkspaces", projectId);
}

/**
 * Load a user's saved workspace for a project.
 * @param {string} uid       authenticated user id
 * @param {string} projectId project identifier (slug)
 * @returns {Promise<{html: string, css: string, js: string} | null>}
 *   Returns the saved workspace, or null if none exists.
 */
export async function loadWorkspace(uid, projectId) {
  try {
    const snap = await getDoc(workspaceRef(uid, projectId));
    if (snap.exists()) {
      const data = snap.data();
      return {
        html: data.html || "",
        css: data.css || "",
        js: data.js || ""
      };
    }
    return null;
  } catch (err) {
    console.warn("[LearnJS] Could not load workspace:", err.message);
    return null;
  }
}

/**
 * Save a user's workspace for a project.
 * @param {string} uid       authenticated user id
 * @param {string} projectId project identifier (slug)
 * @param {object} files     { html, css, js }
 */
export async function saveWorkspace(uid, projectId, files) {
  try {
    await setDoc(workspaceRef(uid, projectId), {
      html: files.html || "",
      css: files.css || "",
      js: files.js || "",
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn("[LearnJS] Could not save workspace:", err.message);
    throw err;
  }
}

/**
 * Delete a user's saved workspace (reset to starter).
 * @param {string} uid       authenticated user id
 * @param {string} projectId project identifier (slug)
 */
export async function resetWorkspace(uid, projectId) {
  try {
    await deleteDoc(workspaceRef(uid, projectId));
    return true;
  } catch (err) {
    // Document may not exist — that's fine
    console.warn("[LearnJS] Could not reset workspace:", err.message);
    return true;
  }
}

/**
 * Fetch a project's default starter files from the filesystem.
 * @param {string} projectFolder the folder name under "JS PROJECTS/"
 * @returns {Promise<{html: string, css: string, js: string}>}
 */
export async function fetchStarterFiles(projectFolder) {
  const basePath = "../../../JS%20PROJECTS/" + encodeURIComponent(projectFolder) + "/";
  const results = { html: "", css: "", js: "" };

  const fetchFile = async (filename, key) => {
    try {
      const res = await fetch(basePath + encodeURIComponent(filename));
      if (res.ok) {
        results[key] = await res.text();
      }
    } catch (e) {
      // File not found — leave empty
    }
  };

  await Promise.all([
    fetchFile("index.html", "html"),
    fetchFile("style.css", "css"),
    fetchFile("styles.css", "css"), // fallback name
    fetchFile("script.js", "js"),
    fetchFile("app.js", "js")      // fallback name
  ]);

  // If style.css was empty but styles.css exists, use styles.css
  if (!results.css) {
    try {
      const res = await fetch(basePath + encodeURIComponent("styles.css"));
      if (res.ok) results.css = await res.text();
    } catch (e) {}
  }

  return results;
}
