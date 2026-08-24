/* ============================================================
   LearnJS — require-auth.js (js/common)
   Shared authentication guard for protected pages.
   Resolves with the signed-in user, or redirects to the login
   page (preserving a return URL via the `next` query param).
   ============================================================ */

import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/**
 * Resolve when the current user is authenticated.
 * @param {string} [next] relative URL to return to after login.
 * @returns {Promise<Object>} the Firebase user object.
 */
export function requireAuth(next) {
  return new Promise((resolve) => {
    let resolved = false;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (resolved) return;
      if (!user) {
        resolved = true;
        unsub();
        const target = next || "../dashboard/";
        window.location.href = "../authentication/login.html?next=" + encodeURIComponent(target);
        return;
      }
      resolved = true;
      unsub();
      resolve(user);
    });
  });
}
// end of require-auth.js
