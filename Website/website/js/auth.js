/* ============================================================
   LearnJS — auth.js
   Firebase authentication: email/password, Google sign-in,
   session persistence, and the navbar auth UI (avatar menu).
   Loaded as a module so it can import firebase.js.
   ============================================================ */

import { auth, googleProvider } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/* ---------- Friendly error messages ---------- */
const FIREBASE_ERRORS = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/popup-closed-by-user": "Sign-in popup was closed before completing.",
  "auth/operation-not-allowed": "This sign-in method is not enabled.",
  "auth/account-exists-with-different-credential":
    "An account already exists with the same email using another sign-in method."
};

function friendlyError(err) {
  const code = err && err.code;
  return FIREBASE_ERRORS[code] || (err && err.message) || "Something went wrong. Please try again.";
}

/* ---------- Shared helpers ---------- */
function toast(message, type) {
  if (window.LearnJS && window.LearnJS.toast) {
    window.LearnJS.toast(message, type);
  }
}

function nextPath() {
  try {
    return new URLSearchParams(window.location.search).get("next") || "index.html";
  } catch (err) {
    return "index.html";
  }
}

function showAlert(message) {
  const alert = document.querySelector(".auth-alert");
  if (!alert) return;
  alert.querySelector(".auth-alert-text").textContent = message;
  alert.classList.add("show");
  alert.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearAlert() {
  const alert = document.querySelector(".auth-alert");
  if (alert) alert.classList.remove("show");
}

function setFieldError(input, message) {
  const field = input.closest(".field");
  const error = field && field.querySelector(".field-error");
  if (message) {
    input.classList.add("is-error");
    if (error) {
      error.textContent = message;
      error.classList.add("show");
    }
  } else if (error) {
    input.classList.remove("is-error");
    error.classList.remove("show");
  }
}

function setLoading(btn, loading) {
  if (!btn) return;
  btn.classList.toggle("loading", loading);
  btn.disabled = loading;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function isValidEmail(value) {
  return EMAIL_RE.test((value || "").trim());
}

/* ---------- Navbar auth area ---------- */
function initials(name) {
  const clean = (name || "U").trim().split(/\s+/);
  const first = (clean[0] || "").charAt(0);
  const last = clean.length > 1 ? clean[clean.length - 1].charAt(0) : "";
  return (first + last).toUpperCase() || "U";
}

function renderAuthArea(user) {
  const area = document.getElementById("authArea");
  if (!area) return;

  if (user) {
    const name = user.displayName || user.email || "Learner";
    area.innerHTML =
      '<div class="auth-area">' +
        '<button class="avatar-btn" id="userMenuBtn" aria-label="Account menu" aria-expanded="false">' +
          '<span class="avatar avatar-sm av-green">' + initials(name) + "</span>" +
        "</button>" +
        '<div class="avatar-menu" id="userMenu" hidden>' +
          '<div class="avatar-menu-head">' +
            '<span class="avatar avatar-sm av-green">' + initials(name) + "</span>" +
            '<div style="min-width:0">' +
              '<div class="avatar-menu-name">' + escapeHtml(name) + "</div>" +
              '<div class="avatar-menu-mail">' + escapeHtml(user.email || "") + "</div>" +
            "</div>" +
          "</div>" +
          '<a class="avatar-menu-item" href="roadmap.html">' + progressIcon + "My Progress</a>" +
          '<a class="avatar-menu-item" href="projects.html">' + projectsIcon + "My Projects</a>" +
          '<button class="avatar-menu-item danger" id="logoutBtn">' + logoutIcon + "Sign Out</button>" +
        "</div>" +
      "</div>";

    const btn = document.getElementById("userMenuBtn");
    const menu = document.getElementById("userMenu");
    if (btn && menu) {
      btn.addEventListener("click", function (event) {
        event.stopPropagation();
        const open = menu.hidden;
        menu.hidden = !open;
        btn.setAttribute("aria-expanded", String(open));
      });
      document.addEventListener("click", function (event) {
        if (!menu.hidden && !menu.contains(event.target) && event.target !== btn) {
          menu.hidden = true;
          btn.setAttribute("aria-expanded", "false");
        }
      });
    }
    document.getElementById("logoutBtn").addEventListener("click", handleLogout);
  } else {
    area.innerHTML =
      '<a href="login.html" class="btn btn-primary btn-sm">Sign In</a>';
  }
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

const progressIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/></svg>';
const projectsIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>';
const logoutIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>';
// end of auth.js part 1

/* ---------- Logout ---------- */
async function handleLogout() {
  try {
    await signOut(auth);
    toast("You've been signed out.");
  } catch (err) {
    toast(friendlyError(err), "error");
  }
}

/* ---------- Google sign-in (used on login & signup) ---------- */
async function handleGoogleSignIn(btn) {
  clearAlert();
  btn.classList.add("loading");
  try {
    await signInWithPopup(auth, googleProvider);
    const name = auth.currentUser && auth.currentUser.displayName;
    toast("Welcome" + (name ? ", " + name : "") + "! \ud83c\udf89");
    window.location.href = nextPath();
  } catch (err) {
    btn.classList.remove("loading");
    if (err.code === "auth/popup-closed-by-user") return;
    showAlert(friendlyError(err));
  }
}

/* ---------- Email/password login ---------- */
function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const emailInput = document.getElementById("loginEmail");
  const passInput = document.getElementById("loginPassword");
  const remember = document.getElementById("rememberMe");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearAlert();

    let valid = true;
    if (!isValidEmail(emailInput.value)) {
      setFieldError(emailInput, "Enter a valid email address.");
      valid = false;
    } else {
      setFieldError(emailInput, "");
    }
    if (!passInput.value) {
      setFieldError(passInput, "Enter your password.");
      valid = false;
    } else {
      setFieldError(passInput, "");
    }
    if (!valid) return;

    setLoading(submitBtn, true);
    try {
      // "Remember me" controls the session persistence.
      await setPersistence(
        auth,
        remember && remember.checked ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, emailInput.value.trim(), passInput.value);
      toast("Welcome back! \ud83d\ude80");
      window.location.href = nextPath();
    } catch (err) {
      setLoading(submitBtn, false);
      if (err.code === "auth/invalid-credential") {
        setFieldError(emailInput, "");
        setFieldError(passInput, "Incorrect email or password.");
      } else {
        showAlert(friendlyError(err));
      }
    }
  });
}

/* ---------- Email/password signup ---------- */
function initSignupPage() {
  const form = document.getElementById("signupForm");
  if (!form) return;

  const nameInput = document.getElementById("signupName");
  const emailInput = document.getElementById("signupEmail");
  const passInput = document.getElementById("signupPassword");
  const termsInput = document.getElementById("terms");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearAlert();

    let valid = true;
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setFieldError(nameInput, "Please enter your full name.");
      valid = false;
    } else {
      setFieldError(nameInput, "");
    }
    if (!isValidEmail(emailInput.value)) {
      setFieldError(emailInput, "Enter a valid email address.");
      valid = false;
    } else {
      setFieldError(emailInput, "");
    }
    if (passInput.value.length < 6) {
      setFieldError(passInput, "Password must be at least 6 characters.");
      valid = false;
    } else {
      setFieldError(passInput, "");
    }
    if (!termsInput.checked) {
      toast("Please accept the Terms of Service.", "error");
      valid = false;
    }
    if (!valid) return;

    setLoading(submitBtn, true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await createUserWithEmailAndPassword(
        auth,
        emailInput.value.trim(),
        passInput.value
      );
      await updateProfile(cred.user, { displayName: nameInput.value.trim() });
      toast("Account created! Welcome to LearnJS \ud83c\udf89");
      window.location.href = nextPath();
    } catch (err) {
      setLoading(submitBtn, false);
      showAlert(friendlyError(err));
    }
  });
}

/* ---------- Forgot password ---------- */
function initForgotPassword() {
  const link = document.getElementById("forgotPassword");
  const emailInput = document.getElementById("loginEmail");
  if (!link) return;

  link.addEventListener("click", async function (event) {
    event.preventDefault();
    const email = emailInput ? emailInput.value.trim() : "";

    if (!isValidEmail(email)) {
      if (emailInput) setFieldError(emailInput, "Enter your email first to reset your password.");
      else toast("Enter your email first.", "error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast("Password reset link sent! Check your inbox.");
    } catch (err) {
      showAlert(friendlyError(err));
    }
  });
}

/* ---------- Show/hide password toggles ---------- */
function initPasswordToggles() {
  document.querySelectorAll(".toggle-password").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const input = document.getElementById(btn.getAttribute("data-target"));
      if (!input) return;
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      btn.classList.toggle("is-visible", !visible);
      btn.setAttribute("aria-label", visible ? "Show password" : "Hide password");
    });
  });
}

/* ---------- Password strength meter (signup) ---------- */
function scorePassword(value) {
  let score = 0;
  if (!value) return 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

const STRENGTH_LABELS = ["Password strength", "Weak", "Fair", "Good", "Strong"];

function initStrengthMeter() {
  const input = document.getElementById("signupPassword");
  if (!input) return;

  const meter = document.querySelector(".strength-meter");
  const bars = meter ? meter.querySelectorAll(".strength-bars i") : [];
  const label = meter ? meter.querySelector(".strength-label") : null;

  input.addEventListener("input", function () {
    const score = scorePassword(input.value);
    bars.forEach(function (bar, i) {
      bar.classList.toggle("on", i < score);
    });
    if (label) {
      label.textContent = STRENGTH_LABELS[score];
      label.setAttribute("data-level", String(score));
    }
  });
}

/* ---------- Boot ---------- */
function init() {
  const page = document.body.getAttribute("data-page");

  // Listen for auth state and render the navbar area.
  onAuthStateChanged(auth, renderAuthArea);

  initPasswordToggles();

  if (page === "login") {
    initLoginPage();
    initForgotPassword();
    const googleBtn = document.getElementById("googleLoginBtn");
    if (googleBtn) googleBtn.addEventListener("click", function () { handleGoogleSignIn(googleBtn); });
  }
  if (page === "signup") {
    initSignupPage();
    initStrengthMeter();
    const googleBtn = document.getElementById("googleSignupBtn");
    if (googleBtn) googleBtn.addEventListener("click", function () { handleGoogleSignIn(googleBtn); });
  }
}

init();
// end of auth.js
