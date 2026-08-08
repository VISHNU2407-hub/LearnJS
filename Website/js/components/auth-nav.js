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

const profileIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
const settingsIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>';
const logoutIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>';
const moonIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>';
const sunIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';

/* ---------- Account menu helpers ---------- */
let openAccountRef = null; // { btn, menu } of the currently open menu

function isDarkTheme() {
  return !!(window.LearnJS && window.LearnJS.theme && window.LearnJS.theme.isDark());
}
function themeItemHTML() {
  const dark = isDarkTheme();
  return (dark ? sunIcon : moonIcon) + "<span>" + (dark ? "Switch to light theme" : "Switch to dark theme") + "</span>";
}
function refreshThemeItem(menu) {
  const item = menu && menu.querySelector('[data-account-action="theme"]');
  if (item) item.innerHTML = themeItemHTML();
}
function getMenuItems(menu) {
  return menu ? Array.from(menu.querySelectorAll(".avatar-menu-item")) : [];
}
function openAccountMenu(btn, menu) {
  refreshThemeItem(menu);
  menu.hidden = false;
  btn.setAttribute("aria-expanded", "true");
  openAccountRef = { btn, menu };
  const items = getMenuItems(menu);
  if (items.length) items[0].focus();
}
function closeAccountMenu(btn, menu) {
  if (!menu || menu.hidden) return;
  menu.hidden = true;
  btn.setAttribute("aria-expanded", "false");
  if (openAccountRef && openAccountRef.menu === menu) {
    // Return focus to the trigger whenever it was inside the menu.
    if (menu.contains(document.activeElement)) btn.focus();
    openAccountRef = null;
  }
}
function onMenuKeydown(event, btn, menu) {
  if (menu.hidden) return;
  const items = getMenuItems(menu);
  if (!items.length) return;
  const current = items.indexOf(document.activeElement);
  let next = -1;
  switch (event.key) {
    case "ArrowDown": next = current + 1 >= items.length ? 0 : current + 1; break;
    case "ArrowUp": next = current - 1 < 0 ? items.length - 1 : current - 1; break;
    case "Home": next = 0; break;
    case "End": next = items.length - 1; break;
    case "Tab":
      if (event.shiftKey && current <= 0) next = items.length - 1;
      else if (!event.shiftKey && current === items.length - 1) next = 0;
      else return; // normal tab movement within the menu
      break;
    default: return;
  }
  event.preventDefault();
  items[next].focus();
}

/* ---------- Render the navbar auth area ---------- */
function renderAuthArea(user) {
  const area = document.getElementById("authArea");
  if (!area) return;

  if (user) {
    const name = user.displayName || user.email || "Learner";
    area.innerHTML =
      '<div class="auth-area">' +
        '<button class="avatar-btn" id="userMenuBtn" aria-label="Account menu" aria-expanded="false" aria-haspopup="menu" aria-controls="userMenu">' +
          '<span class="avatar avatar-sm av-green">' + initials(name) + "</span>" +
        "</button>" +
        '<div class="avatar-menu" id="userMenu" role="menu" aria-label="Account" hidden>' +
          '<div class="avatar-menu-head">' +
            '<span class="avatar avatar-sm av-green">' + initials(name) + "</span>" +
            '<div style="min-width:0">' +
              '<div class="avatar-menu-name">' + escapeHtml(name) + "</div>" +
              '<div class="avatar-menu-mail">' + escapeHtml(user.email || "") + "</div>" +
            "</div>" +
          "</div>" +
          '<a class="avatar-menu-item" role="menuitem" href="../dashboard/#profile">' + profileIcon + "<span>View / Edit Profile</span></a>" +
          '<a class="avatar-menu-item" role="menuitem" href="../dashboard/#settings">' + settingsIcon + "<span>Account Settings</span></a>" +
          '<button class="avatar-menu-item" type="button" role="menuitem" data-account-action="theme">' + themeItemHTML() + "</button>" +
          '<button class="avatar-menu-item danger" id="logoutBtn" type="button" role="menuitem">' + logoutIcon + "<span>Logout</span></button>" +
        "</div>" +
      "</div>";

    const btn = document.getElementById("userMenuBtn");
    const menu = document.getElementById("userMenu");
    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      if (menu.hidden) openAccountMenu(btn, menu);
      else closeAccountMenu(btn, menu);
    });
    menu.addEventListener("keydown", function (event) {
      onMenuKeydown(event, btn, menu);
    });
    // Theme row reuses the shared LearnJS light/dark toggle.
    menu.addEventListener("click", function (event) {
      const item = event.target.closest('[data-account-action="theme"]');
      if (!item) return;
      closeAccountMenu(btn, menu);
      if (window.LearnJS && window.LearnJS.theme) window.LearnJS.theme.toggle();
    });
    document.getElementById("logoutBtn").addEventListener("click", function () {
      closeAccountMenu(btn, menu);
      handleLogout();
    });
  } else {
    area.innerHTML =
      '<a href="../authentication/login.html" class="btn btn-primary btn-sm">Sign In</a>';
  }
}

// Close the account menu when clicking anywhere outside it (registered once).
document.addEventListener("click", function (event) {
  if (!openAccountRef) return;
  const { btn, menu } = openAccountRef;
  if (menu.contains(event.target) || event.target === btn) return;
  closeAccountMenu(btn, menu);
});
// Close the account menu on Escape.
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && openAccountRef) {
    closeAccountMenu(openAccountRef.btn, openAccountRef.menu);
  }
});

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
