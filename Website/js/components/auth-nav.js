/* ============================================================
   LearnJS — auth-nav.js (components)
   Shared navbar authentication UI: renders the avatar / sign-in
   area on every page with a navbar and handles sign-out.
   Loaded as a module so it can import firebase.js.
   ============================================================ */

import { auth } from "../firebase/firebase.js";
import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/* ---------- Toast helper (delegates to the shared app.js) ---------- */
function toast(message, type) {
  if (window.LearnJS && window.LearnJS.toast) {
    window.LearnJS.toast(message, type);
  }
}

/* ---------- Avatar initials ---------- */
function initials(name) {
  const clean = (name || "U").trim().split(/\s+/);
  const first = (clean[0] || "").charAt(0);
  const last = clean.length > 1 ? clean[clean.length - 1].charAt(0) : "";
  return (first + last).toUpperCase() || "U";
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

const dashboardIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>';
const progressIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/></svg>';
const projectsIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>';
const logoutIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>';

/* ---------- Render the navbar auth area ---------- */
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
          '<a class="avatar-menu-item" href="../dashboard/">' + dashboardIcon + "Dashboard</a>" +
          '<a class="avatar-menu-item" href="../roadmap/">' + progressIcon + "My Progress</a>" +
          '<a class="avatar-menu-item" href="../projects/">' + projectsIcon + "My Projects</a>" +
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
      '<a href="../authentication/login.html" class="btn btn-primary btn-sm">Sign In</a>';
  }
}

/* ---------- Logout ---------- */
async function handleLogout() {
  try {
    await signOut(auth);
    toast("You've been signed out.");
    // Signed-in users land back on the home page after signing out.
    window.location.href = "../home/";
  } catch (err) {
    toast(err && err.message ? err.message : "Could not sign out.", "error");
  }
}

/* ---------- Boot ---------- */
onAuthStateChanged(auth, renderAuthArea);
// end of auth-nav.js
