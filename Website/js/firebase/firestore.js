/* ============================================================
   LearnJS — firestore.js
   Firestore initialization. Uses the shared Firebase app from
   firebase.js and exposes the Firestore database instance.
   ============================================================ */

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { app } from "./firebase.js";

// Initialize Firestore using the existing Firebase app.
const db = getFirestore(app);

export { db };
// end of firestore.js
