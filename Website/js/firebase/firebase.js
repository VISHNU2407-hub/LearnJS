/* ============================================================
   LearnJS — firebase.js
   Firebase initialization. Imports the official Firebase v12
   modular SDK directly from the gstatic CDN and exports the
   app, auth and the Google provider for the rest of the app.
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAP9MZOMKqS6OJLGil7E1huUfqSF3-D9pg",
  authDomain: "learnjs-vks.firebaseapp.com",
  projectId: "learnjs-vks",
  storageBucket: "learnjs-vks.firebasestorage.app",
  messagingSenderId: "1022743370130",
  appId: "1:1022743370130:web:5ec572be33fe66b66e094b",
  measurementId: "G-SLBT8T2LMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and the Google provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Analytics can fail in some environments (e.g. file://) — never block the app.
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (err) {
  console.warn("[LearnJS] Analytics unavailable:", err.message);
}

export { app, auth, googleProvider, analytics };
// end of firebase.js
