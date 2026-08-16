/* ============================================================
   LearnJS — learn.js (pages/learn)
   Project Learning Page (guided build workshop).
   Auth-guarded like the dashboard. Reads ?slug= from the URL,
   loads the workshop content from learn-data.js (window.LEARNJS_WORKSHOPS),
   renders the header / steps / hints, persists step-level progress
   to the shared users/{uid}/progress/{slug} doc, and manages the
   floating VS Code + Live Preview windows.
   ============================================================ */

import { auth } from "../../js/firebase/firebase.js";
import { db } from "../../js/firebase/firestore.js";
import { requireAuth } from "../../js/common/require-auth.js";
import { loadProjects } from "../../js/projects/project-loader.js";
import { setProjectSteps } from "../../js/projects/progress.js";
import {
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/* ---------- Helpers ---------- */
function toast(message, type) {
  if (window.LearnJS && window.LearnJS.toast) window.LearnJS.toast(message, type);
}
function el(id) { return document.getElementById(id); }
function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}
function initials(name) {
  const clean = (name || "U").trim().split(/\s+/);
  const first = (clean[0] || "").charAt(0);
  const last = clean.length > 1 ? clean[clean.length - 1].charAt(0) : "";
  return (first + last).toUpperCase() || "U";
}

/* Lucide-style icons (stroke-based, matches the design system). */
const ICONS = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
  lightbulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 6-6 6 6 6"/><path d="m16 6 6 6-6 6"/><path d="m13.2 4.5-2.4 15"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/></svg>',
  fileHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><path d="M14 2v6h6"/><path d="m10 12-2 2 2 2"/><path d="m14 12 2 2-2 2"/></svg>',
  fileCss: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><path d="M14 2v6h6"/><path d="m9 12 2 2-2 2"/><path d="m13 12 2 2-2 2"/></svg>',
  fileJs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><path d="M14 2v6h6"/><path d="m9.5 12.5 1.5 1.5 2.5-2.5"/><path d="m9.5 17 1.5 1.5 2.5-2.5"/></svg>'
};

/* Per-project hero icons, keyed by workshop slug. Digital Clock keeps the
   default clock icon baked into the template and is intentionally absent.
   Counter uses a plus/minus glyph (plus above minus, built from the Lucide
   plus and minus geometry — unique to the counter); BMI uses the Lucide
   weighing-scale icon; Calculator uses the Lucide calculator icon — all in
   the same stroke style as the rest of the LearnJS icon library. Every other workshop has its own Lucide-style icon so the glyph
   always represents the project. */
const PROJECT_ICONS = {
  counter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v8"/><path d="M7 9h10"/><path d="M7 17h10"/></svg>',
  "bmi-calculator": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m19 8 3 8a5 5 0 0 1-6 0zV7"/><path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1"/><path d="m5 8 3 8a5 5 0 0 1-6 0zV7"/><path d="M7 21h10"/></svg>',
  calculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',
  "blog-website": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>',
  "character-count": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>',
  "chat-app": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
  "color-changer": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  "die-roller": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/></svg>',
  ecommerce: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
  "expense-tracker": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',
  "git-hub-profile-finder": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  "image-slider": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/></svg>',
  "kanban-board": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v9"/></svg>',
  "movie-search-app": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>',
  "notes-app": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
  numberguessinggame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  "password-generator": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
  "pokedex-app": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>',
  quizapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
  quotegenerator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/></svg>',
  "text-repeator": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
  tipcalculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>',
  "to-do-list": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>',
  "weather-app": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>'
};

/* ---------- State ---------- */
const SLUG = new URLSearchParams(window.location.search).get("slug") || "clock";
let currentUser = null;
let project = null;           // catalog entry (projects.json) for prev-project nav
let workshop = null;          // workshop content from learn-data.js
let stepsCompleted = new Set();
let openStep = null;          // expanded step index (null = list only)
let hintLevels = {};          // step index -> number of hints shown
let lastProgress = {};        // latest progress doc (to preserve startedAt)
let allProjects = [];

/* Draft code written in the VS Code editor (script.js).
   Kept in memory for the session and mirrored to localStorage
   so a refresh doesn't wipe the learner's work. */
const DRAFT_KEY = "learnjs-vscode-drafts";
let codeDrafts = {};          // file name -> current text in the editor
function loadDrafts() {
  try {
    codeDrafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}") || {};
  } catch (err) {
    codeDrafts = {};
  }
}
function saveDrafts() {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(codeDrafts)); } catch (err) {}
}

/* ---------- Boot ---------- */
async function init() {
  const user = await requireAuth("../learn/?slug=" + encodeURIComponent(SLUG));
  currentUser = user;
  loadDrafts();
  el("dashAvatarSpan").textContent = initials(user.displayName || user.email || "U");

  workshop = (window.LEARNJS_WORKSHOPS || {})[SLUG];
  if (!workshop) {
    showNotFound();
    return;
  }

  // Catalog lookup (for previous/next project nav).
  try {
    allProjects = await loadProjects();
    project = allProjects.find((p) => p.id === SLUG) || null;
  } catch (err) {
    allProjects = [];
  }

  document.title = workshop.title + " — LearnJS";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", "Guided project workshop: build the " + workshop.title + " step by step on LearnJS.");
  renderBreadcrumb();
  renderHero();
  renderConcepts();
  renderTips();
  renderSteps();
  renderNav();
  setupActions();
  setupShell();
  listenProgress();
}

init();

/* ---------- Rendering ---------- */
function showNotFound() {
  el("learnLoading").hidden = true;
  el("learnNotFound").hidden = false;
}

function renderBreadcrumb() {
  // Global breadcrumb component (css/components/components.css).
  const crumb = el("learnBreadcrumb");
  crumb.innerHTML =
    '<a class="breadcrumb-item" href="../dashboard/">Dashboard</a>' +
    '<span class="breadcrumb-sep">' + ICONS.chevron + "</span>" +
    '<a class="breadcrumb-item" href="../dashboard/#projects">Projects</a>' +
    '<span class="breadcrumb-sep">' + ICONS.chevron + "</span>" +
    '<span class="breadcrumb-current" aria-current="page">' + escapeHtml(workshop.title) + "</span>";
}

function renderHero() {
  el("learnLoading").hidden = true;
  el("learnWrap").hidden = false;

  const heroShot = el("learnHeroShot");
  if (heroShot) heroShot.setAttribute("aria-label", "Open live preview of " + workshop.title);

  const cover = el("learnCover");
  cover.src = workshop.cover || "";
  cover.alt = workshop.title;
  cover.setAttribute("data-fb-slug", SLUG);
  cover.setAttribute("data-fb-title", workshop.title);
  cover.onerror = () => {
    if (window.LearnJS && window.LearnJS.projectCoverFallback) window.LearnJS.projectCoverFallback(cover);
    else cover.hidden = true;
  };

  // Per-project hero icon — the rounded green title-icon container keeps its
  // existing styling; only the glyph swaps for projects with a custom icon.
  const titleIco = document.querySelector(".learn-hero-title-ico");
  if (titleIco && PROJECT_ICONS[SLUG]) {
    titleIco.innerHTML = PROJECT_ICONS[SLUG];
  }

  el("learnTitle").textContent = workshop.title;
  el("learnIntro").textContent = workshop.intro || "";
}

/* What You'll Learn — the JavaScript concepts practiced in this project. */
function renderConcepts() {
  const wrap = el("learnConcepts");
  if (!wrap) return;
  wrap.innerHTML = (workshop.concepts || []).map((c) =>
    '<div class="learn-concept">' +
      '<span class="learn-concept-ico">' + ICONS.target + "</span>" +
      "<span>" + escapeHtml(c) + "</span>" +
    "</div>"
  ).join("");
}

function renderTips() {
  const list = el("learnTips");
  list.innerHTML = (workshop.tips || []).map((t) =>
    '<li><span class="tip-ico">' + ICONS.bulb + "</span><span>" + escapeHtml(t) + "</span></li>"
  ).join("");
}

/* ---------- Steps ---------- */
function renderSteps() {
  const wrap = el("learnSteps");
  const total = workshop.steps.length;
  const doneCount = stepsCompleted.size;

  wrap.innerHTML = workshop.steps.map((step, i) => {
    const done = stepsCompleted.has(i);
    const open = openStep === i;
    return (
      '<article class="learn-step' + (done ? " done" : "") + (open ? " open" : "") + '" id="learnStep' + i + '">' +
        '<button class="learn-step-head" data-step-head="' + i + '" type="button" aria-expanded="' + open + '">' +
          '<span class="learn-step-num">' + (done ? ICONS.check : (i + 1)) + "</span>" +
          '<span class="learn-step-info">' +
            '<span class="learn-step-name">' + escapeHtml(step.title) + "</span>" +
            '<span class="learn-step-tag">' + escapeHtml(step.tagline) + "</span>" +
          "</span>" +
          '<span class="learn-step-state">' + (done ? ICONS.check : ICONS.chevron) + "</span>" +
        "</button>" +
        '<div class="learn-step-body"><div class="learn-step-inner">' +
          '<div class="learn-step-content">' +
            goalBlock(step) + logicBlock(i) + thinkBlock(step) + hintBoxHTML(i) +
            '<div class="learn-step-actions">' +
              '<button class="btn ' + (done ? "btn-outline" : "btn-primary") + ' btn-sm" data-complete="' + i + '" type="button">' +
                ICONS.check + (done ? "Mark Incomplete" : "Mark Step Complete") +
              "</button>" +
            "</div>" +
          "</div>" +
        "</div></div>" +
      "</article>"
    );
  }).join("");

  el("learnStepsNote").textContent =
    openStep === null
      ? "Click a step to open its guide."
      : "Step " + (openStep + 1) + " of " + total + (doneCount === total ? " — all done 🎉" : "");

  renderProgress();
}

function goalBlock(step) {
  return (
    '<div class="learn-block">' +
      "<h3>" + ICONS.target + " Goal</h3>" +
      "<p>" + escapeHtml(step.goal) + "</p>" +
    "</div>"
  );
}

function logicBlock(i) {
  const step = workshop.steps[i];
  // Present the step's flow as a code-style learning block. Steps that
  // define logicCode show real JS examples; anything else falls back to
  // the prose logic items rendered as numbered comments.
  const lines = step.logicCode
    ? step.logicCode.slice()
    : (step.logic || []).map((l, k) => "// " + (k + 1) + ". " + l);
  const rows = lines.map((ln, k) =>
    '<span class="learn-code-ln">' + (k + 1) + '</span><code class="learn-code-line">' + highlightCode(ln) + "</code>"
  ).join("");
  return (
    '<div class="learn-block">' +
      "<h3>" + ICONS.code + " Logic</h3>" +
      '<p class="learn-code-sub">Follow this exact flow:</p>' +
      '<div class="learn-code">' +
        '<button class="learn-code-copy" type="button" data-copy="' + i + '">' + ICONS.copy + "Copy</button>" +
        '<div class="learn-code-body">' + rows + "</div>" +
      "</div>" +
    "</div>"
  );
}

/* Tiny syntax highlighter for the logic code blocks. Comments and strings
   are masked to placeholders first so tokens inside them are never
   re-highlighted, then restored as colored spans. */
function highlightCode(src) {
  const esc = src.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const tokens = [];
  let t = 0;
  const mask = (m, type) => { tokens.push([type, m]); return "\u0000T" + t++ + "\u0000"; };
  let out = esc.replace(/\/\/.*$/gm, (m) => mask(m, "com"));
  out = out.replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, (m) => mask(m, "str"));
  out = out.replace(/\b(const|function|return|new|let|var|if|else|for|while)\b/g, (m) => mask(m, "kw"));
  out = out.replace(/\b(\d+)\b/g, (m) => mask(m, "num"));
  out = out.replace(/\b([A-Za-z_$][\w$]*)(?=\s*\()/g, (m) => mask(m, "fn"));
  return out.replace(/\u0000T(\d+)\u0000/g, (m, n) => {
    const tok = tokens[Number(n)];
    return '<span class="tok-' + tok[0] + '">' + tok[1] + "</span>";
  });
}

/* Copy the step's logic block (comments + code) to the clipboard. */
function copyCode(i, btn) {
  const step = workshop.steps[i];
  const text = (step.logicCode || step.logic || []).join("\n");
  // Success feedback: toast + a ~1.5s checkmark state on the copy button.
  const markCopied = () => {
    toast("Logic copied to clipboard ✓");
    if (!btn) return;
    if (!btn.dataset.orig) btn.dataset.orig = btn.innerHTML;
    btn.innerHTML = ICONS.check + "Copied";
    btn.classList.add("copied");
    window.setTimeout(() => {
      btn.innerHTML = btn.dataset.orig;
      btn.classList.remove("copied");
    }, 1500);
  };
  const fallback = () => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      markCopied();
    } catch (err) {
      toast("Could not copy — select the code manually.", "error");
    }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(markCopied, fallback);
  } else {
    fallback();
  }
}

function thinkBlock(step) {
  if (!step.think) return "";
  return (
    '<div class="learn-think">' +
      '<span class="think-ico">' + ICONS.bulb + "</span>" +
      "<p><b>Think about it:</b> " + escapeHtml(step.think) + "</p>" +
    "</div>"
  );
}

/* ---------- Hint system ---------- */
function hintBoxHTML(i) {
  const step = workshop.steps[i];
  const level = hintLevels[i] || 0;
  const total = (step.hints || []).length;
  if (!total) return ""; // No hints for this step — don't render hint controls.
  const done = level >= total;

  const shown = (step.hints || []).slice(0, level).map((h, k) =>
    '<p class="learn-hint-text"><b>Hint ' + (k + 1) + ":</b> " + escapeHtml(h) + "</p>"
  ).join("");

  // When every hint is revealed, the button becomes "Hide hints" so the
  // learner can collapse them all back to the starting state.
  const btnLabel = done ? "Hide hints" : level === 0 ? "Show Hint" : "Show next hint";

  return (
    '<div class="learn-hint" id="hintBox' + i + '">' +
      '<div class="learn-hint-head">' +
        "<div>" +
          "<b>" + ICONS.lightbulb + " Need a hint?</b>" +
          '<div class="learn-hint-sub">Stuck on a step? Get a small hint to move forward.</div>' +
        "</div>" +
        '<button class="learn-hint-btn" data-hint="' + i + '" type="button">' + btnLabel + "</button>" +
      "</div>" +
      (level > 0 ? '<div class="learn-hint-texts">' + shown + "</div>" : "") +
    "</div>"
  );
}

/* ---------- Progress ---------- */
function renderProgress() {
  const total = workshop.steps.length;
  const done = stepsCompleted.size;
  const pct = Math.round((done / total) * 100);
  el("learnProgressLabel").textContent = done + " / " + total + " Steps Completed";
  el("learnProgressPct").textContent = pct + "%";
  el("learnProgressBar").style.width = pct + "%";
  renderProgressState(done, total);
  renderStartButton(done, total);
}

/* One-line description of the learner's current state under the progress bar. */
function renderProgressState(done, total) {
  const state = el("learnProgressState");
  if (!state) return;
  if (done === 0) {
    state.textContent = "Not started yet — open the first step to begin building.";
  } else if (done < total) {
    state.textContent = "You're on step " + (done + 1) + " of " + total + " — keep going!";
  } else {
    state.textContent = "Workshop complete — you built " + workshop.title + "! \ud83c\udf89";
  }
}

/* Header primary button — label follows progress (Start Learning → Continue). */
function renderStartButton(done, total) {
  const btn = el("learnStartBtn");
  if (!btn) return;
  const label = el("learnStartLabel");
  const icon = el("learnStartIcon");
  if (done >= total) {
    label.textContent = "Completed";
    btn.disabled = true;
    icon.innerHTML = ICONS.check;
  } else {
    label.textContent = done > 0 ? "Continue" : "Start Learning";
    btn.disabled = false;
    icon.innerHTML = done > 0 ? ICONS.arrowRight : ICONS.play;
  }
}

/* Start/Continue: open the first incomplete step and scroll it into view. */
function startLearning() {
  const total = workshop.steps.length;
  let target = 0;
  for (let i = 0; i < total; i++) {
    if (!stepsCompleted.has(i)) { target = i; break; }
  }
  openStep = target;
  hintLevels[target] = hintLevels[target] || 0;
  renderSteps();
  renderNav();
  const card = el("learnStep" + target);
  if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Bottom navigation ---------- */
function renderNav() {
  const nav = el("learnNav");
  const total = workshop.steps.length;
  const doneCount = stepsCompleted.size;
  const allDone = doneCount === total;

  // Previous step — moves back through the implementation steps.
  const onFirstStep = openStep === null || openStep === 0;
  const prevStepHTML =
    '<button class="btn btn-outline learn-nav-btn" id="learnPrevBtn" type="button"' + (onFirstStep ? " disabled" : "") + ">" +
      '<span>' + ICONS.arrowLeft + "Previous Step</span>" +
    "</button>";

  // Previous project (by catalog order). Falls back to the Projects panel.
  const prev = prevProject();
  const prevProjectHTML = prev
    ? '<a class="btn btn-ghost learn-nav-btn learn-nav-ghost" href="../project-details/?slug=' + encodeURIComponent(prev.id) + '">' +
        '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>Previous Project</span>' +
      "</a>"
    : "";

  const leftHTML = prevStepHTML + prevProjectHTML;

  // Next step — on the last step it becomes "Complete Project".
  const nextLabel = allDone
    ? "Back to Dashboard"
    : openStep === null ? "Start Learning" : openStep === total - 1 ? "Complete Project" : "Next Step";

  const nextHTML = allDone
    ? '<a class="btn btn-primary learn-nav-btn" href="../dashboard/#projects">' +
        '<span>Back to Dashboard' + ICONS.arrowRight + "</span>" +
      "</a>"
    : '<button class="btn btn-primary learn-nav-btn" id="learnNextBtn" type="button">' +
        "<span>" + nextLabel + ICONS.arrowRight + "</span>" +
      "</button>";

  const hint = doneCount === 0
    ? '<span class="learn-nav-hint">' + ICONS.bulb + "<b>Tip:</b> open a step and mark it complete as you build.</span>"
    : doneCount === total
      ? '<span class="learn-nav-hint done">' + ICONS.check + "Workshop complete — great job!</span>"
      : '<span class="learn-nav-hint">' + ICONS.check + doneCount + " of " + total + " steps completed.</span>";

  nav.innerHTML =
    '<div class="learn-nav-group">' + leftHTML + "</div>" +
    hint +
    '<div class="learn-nav-group learn-nav-right">' + nextHTML + "</div>";

  const nextBtn = el("learnNextBtn");
  if (nextBtn) nextBtn.addEventListener("click", onNext);
  const prevBtn = el("learnPrevBtn");
  if (prevBtn) prevBtn.addEventListener("click", onPrev);

  renderDone();
}

function onPrev() {
  if (openStep === null || openStep === 0) return;
  openStep -= 1;
  hintLevels[openStep] = hintLevels[openStep] || 0;
  renderSteps();
  renderNav();
  const card = el("learnStep" + openStep);
  if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Completion state ---------- */
function renderDone() {
  const done = el("learnDone");
  const total = workshop.steps.length;
  const allDone = stepsCompleted.size === total;
  if (!allDone) {
    done.hidden = true;
    return;
  }
  done.hidden = false;
  const doneSub = el("learnDoneSub");
  if (doneSub) doneSub.textContent = "You built the " + workshop.title + ". Take a moment to admire your work — then keep going.";
  el("doneSteps").textContent = stepsCompleted.size + " / " + total;
  el("donePct").textContent = Math.round((stepsCompleted.size / total) * 100) + "%";
  el("doneDetailsLink").href = "../project-details/?slug=" + encodeURIComponent(SLUG);
  el("doneConcepts").innerHTML = (workshop.concepts || []).map((c) =>
    '<li><span class="done-chip-ico">' + ICONS.check + "</span><span>" + escapeHtml(c) + "</span></li>"
  ).join("");
  el("doneChallenge").textContent = workshop.challenge ? "💡 " + workshop.challenge : "";
}

function prevProject() {
  const sorted = allProjects.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  const idx = sorted.findIndex((p) => p.id === SLUG);
  if (idx > 0) return sorted[idx - 1];
  return null;
}

/* ---------- Step interactions (event delegation) ---------- */
el("learnSteps").addEventListener("click", (e) => {
  const head = e.target.closest("[data-step-head]");
  if (head) { toggleOpen(Number(head.getAttribute("data-step-head"))); return; }

  const doneBtn = e.target.closest("[data-complete]");
  if (doneBtn) { toggleStepComplete(Number(doneBtn.getAttribute("data-complete"))); return; }

  const hintBtn = e.target.closest("[data-hint]");
  if (hintBtn) { showHint(Number(hintBtn.getAttribute("data-hint"))); return; }

  const copyBtn = e.target.closest("[data-copy]");
  if (copyBtn) { copyCode(Number(copyBtn.getAttribute("data-copy")), copyBtn); return; }
});

function toggleOpen(i) {
  openStep = openStep === i ? null : i;
  if (openStep !== null) hintLevels[openStep] = hintLevels[openStep] || 0;
  renderSteps();
  renderNav();
  if (openStep !== null) {
    const card = el("learnStep" + openStep);
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function showHint(i) {
  const total = (workshop.steps[i].hints || []).length;
  if (!total) return; // No hints — no hint controls were rendered.
  // When every hint is already revealed, the button acts as "Hide hints":
  // collapse all revealed hints back to the starting state.
  if ((hintLevels[i] || 0) >= total) {
    hintLevels[i] = 0;
  } else {
    hintLevels[i] = (hintLevels[i] || 0) + 1;
  }
  const box = el("hintBox" + i);
  if (box) {
    box.outerHTML = hintBoxHTML(i);
    // Re-bind the new button via delegation — nothing else needed.
  }
}

function toggleStepComplete(i) {
  const nowDone = !stepsCompleted.has(i);
  if (nowDone) stepsCompleted.add(i);
  else stepsCompleted.delete(i);
  renderSteps();
  renderNav();
  toast(nowDone ? "Step marked complete — nice work! \u2713" : "Step reopened.");
  saveSteps();
}

async function saveSteps() {
  try {
    await setProjectSteps(currentUser.uid, SLUG, [...stepsCompleted], workshop.steps.length, lastProgress);
  } catch (err) {
    toast("Could not save progress: " + err.message, "error");
  }
}

/* ---------- Run Code + Check My Code (inside the VS Code panel) ---------- */
function stripJsComments(code) {
  return String(code)
    .replace(/\/\*[\s\S]*?\*\//g, " ")  // block comments
    .replace(/\/\/.*$/gm, " ");          // line comments
}

function vscodeConsole(win) {
  return win ? win.querySelector(".vscode-console") : null;
}

function vscodePrint(win, level, text) {
  const consoleEl = vscodeConsole(win);
  if (!consoleEl) return;
  consoleEl.hidden = false;
  const out = consoleEl.querySelector(".vscode-console-out");
  const line = document.createElement("div");
  line.className = "vscode-console-line " + level;
  line.textContent = text;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
}

function vscodeClear(win) {
  const consoleEl = vscodeConsole(win);
  if (!consoleEl) return;
  consoleEl.querySelector(".vscode-console-out").innerHTML = "";
  const frame = consoleEl.querySelector(".vscode-run-frame");
  if (frame) frame.remove();
}

/* Forward console output from the sandboxed run frame into the panel. */
window.addEventListener("message", (e) => {
  if (!e.data || e.data.ljs !== "console") return;
  const win = openWindows.vscode;
  if (!win) return;
  const text = String(e.data.text || "");
  let level = "info";
  if (/^error:/.test(text)) level = "error";
  else if (/^warn:/.test(text)) level = "warn";
  else if (/^log:/.test(text)) level = "info";
  vscodePrint(win, level, text.replace(/^(log|warn|error|info):/, ""));
});

/* Run the learner's current script.js against the project files in a
   sandboxed iframe. Console output is forwarded back into the panel. */
function runCode() {
  const win = openWindows.vscode;
  if (!win) return;

  const code = getScriptCode();
  vscodeClear(win);

  if (!code.trim()) {
    vscodePrint(win, "error", "Nothing to run — script.js is empty. Write some code first.");
    return;
  }

  const html = workshop.files["index.html"] || "";
  const css = workshop.files["style.css"] || "";

  // Replace the external style/script links with the inline versions so the
  // sandbox is self-contained (no network, no path resolution).
  const doc = String(html)
    .replace(/<link[^>]*href=["']style\.css["'][^>]*>/i, "<style>\n" + css + "\n</style>")
    .replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/i,
      "<script>\n" +
        "(function(){var send=function(t){try{parent.postMessage({ljs:'console',text:t},'*')}catch(e){}};" +
        "['log','warn','error','info'].forEach(function(k){var o=console[k];" +
        "console[k]=function(){send(k+': '+Array.prototype.slice.call(arguments).join(' '));" +
        "if(o)o.apply(console,arguments);};});" +
        "window.addEventListener('error',function(e){send('error: '+e.message)});" +
        "})();" +
      "</script>" +
      "<script>\n" + code.replace(/<\/script/gi, "<\\/script") + "\n</script>");

  const frame = document.createElement("iframe");
  frame.setAttribute("sandbox", "allow-scripts");
  frame.className = "vscode-run-frame";
  frame.title = "Sandboxed project run";
  frame.tabIndex = -1;
  frame.srcdoc = doc;
  const consoleEl = win.querySelector(".vscode-console");
  consoleEl.appendChild(frame);
  consoleEl.hidden = false;

  vscodePrint(win, "info", "▶ Running script.js …");
}

/* Check the exact editor content against the currently selected step. */
function checkMyCode() {
  const win = openWindows.vscode;
  if (!win) return;

  vscodeClear(win);

  // Only script.js is the learner's editable file — the check target.
  const code = getScriptCode();
  if (!code.trim()) {
    vscodePrint(win, "error", "✕ Check failed — review your code and try again.");
    vscodePrint(win, "warn", "script.js is empty. Open the editor and write some code first.");
    return;
  }

  if (openStep === null) {
    vscodePrint(win, "warn", "⚠ Open a step in the Steps by Step list first, then check your code.");
    return;
  }

  const i = openStep;
  const step = workshop.steps[i];
  const clean = stripJsComments(code);
  const requires = (step.check && step.check.requires) || [];

  if (!requires.length) {
    vscodePrint(win, "warn", "⚠ This step has no automatic check yet — use the hints and mark it complete manually.");
    return;
  }

  const missing = requires.filter((req) => {
    try { return !new RegExp(req.pattern, "i").test(clean); }
    catch (err) { return false; }
  });

  if (missing.length === 0) {
    vscodePrint(win, "ok", "✓ Check passed — Step completed!");
    if (!stepsCompleted.has(i)) {
      stepsCompleted.add(i);
      renderSteps();
      renderNav();
      toast("✓ Step Completed — nice work!");
      saveSteps();
    }
    return;
  }

  const isMostlyDone = missing.length < requires.length;
  vscodePrint(win, isMostlyDone ? "warn" : "error",
    isMostlyDone
      ? "⚠ Almost there — your implementation is missing something required for this step."
      : "✕ Check failed — review your code and try again.");
  vscodePrint(win, "hint", "Hint: " + (missing[0].hint || "Check the step goal and hints and try again."));
}

function onNext() {
  const total = workshop.steps.length;
  if (openStep === null) {
    toggleOpen(0);
    return;
  }
  // Navigation buttons never mark steps complete — only the explicit
  // "Mark Step Complete" button (or Check My Code) adds to progress, so
  // completion stays trustworthy across every step, including the last.
  if (openStep < total - 1) {
    openStep += 1;
    hintLevels[openStep] = 0;
    renderSteps();
    renderNav();
    const card = el("learnStep" + openStep);
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    // Last step ("Complete Project"): never completes the step itself.
    // The completion state appears on its own once every step has been
    // explicitly marked complete.
    if (!stepsCompleted.has(total - 1)) {
      toast("Mark the final step complete to finish the project.");
    }
    renderSteps();
    renderNav();
  }
}

/* ---------- Live progress ---------- */
function listenProgress() {
  let ref;
  try {
    ref = doc(db, "users", currentUser.uid, "progress", SLUG);
  } catch (err) {
    console.warn("[LearnJS] Progress listener unavailable:", err.message);
    return;
  }
  onSnapshot(ref, (snap) => {
    const d = snap.exists() ? snap.data() : {};
    lastProgress = d;
    const list = Array.isArray(d.stepsCompleted) ? d.stepsCompleted.map(Number) : [];
    stepsCompleted = new Set(list);
    // Completed via the details page ("Mark Complete") without step data → all done.
    if (d.status === "completed" && list.length === 0) {
      stepsCompleted = new Set(workshop.steps.map((_, i) => i));
    }
    renderSteps();
    renderNav();
  }, (err) => {
    console.warn("[LearnJS] Progress listener error:", err.message);
  });
}

/* ---------- Project actions (header primary + compact secondary) ---------- */
function setupActions() {
  const startBtn = el("learnStartBtn");
  if (startBtn) startBtn.addEventListener("click", startLearning);
  el("actPreview").addEventListener("click", (e) => openPreview(e.currentTarget));
  // The hero preview shot opens the same Live Demo window as the action
  // button above — including keyboard access (Enter / Space).
  const heroShot = el("learnHeroShot");
  if (heroShot) {
    heroShot.addEventListener("click", (e) => openPreview(e.currentTarget));
    heroShot.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPreview(e.currentTarget);
      }
    });
  }
  const ghBtn = el("actGithub");
  if (workshop.githubUrl) {
    ghBtn.addEventListener("click", () => window.open(workshop.githubUrl, "_blank", "noopener"));
  } else {
    // No configured repository for this project — keep the button safe and disabled.
    ghBtn.disabled = true;
    ghBtn.title = "No repository link for this project yet";
    ghBtn.setAttribute("aria-disabled", "true");
  }
  el("actVscode").addEventListener("click", (e) => openVscode(e.currentTarget));
}

/* ============================================================
   Floating windows (VS Code + Live Preview)
   ============================================================ */
let winZ = 400;
const openWindows = {}; // key -> element
const windowTriggers = {}; // key -> element that opened the window (for focus return)

function bringToFront(win) { win.style.zIndex = ++winZ; }

function closeWindow(key) {
  const win = openWindows[key];
  if (win) {
    if (key === "preview") {
      const frame = win.querySelector("iframe");
      if (frame) frame.src = "about:blank";
    }
    win.remove();
    delete openWindows[key];
  }
  const pill = el("learnWinPill" + key);
  if (pill) pill.remove();
  // Return focus to whatever opened the window (button / hero shot).
  const trigger = windowTriggers[key];
  delete windowTriggers[key];
  if (trigger && typeof trigger.focus === "function" && document.contains(trigger)) {
    trigger.focus();
  }
}

function restoreWindow(key) {
  const win = openWindows[key];
  if (!win) return;
  win.classList.remove("minimized");
  const pill = el("learnWinPill" + key);
  if (pill) pill.remove();
  bringToFront(win);
  // Move keyboard focus back into the restored window.
  win.focus();
}

function makeWindow(key, cfg, trigger) {
  windowTriggers[key] = trigger || document.activeElement;
  if (openWindows[key]) { restoreWindow(key); return; }

  const win = document.createElement("div");
  win.className = "learn-win " + (cfg.theme || "");
  win.id = "learnWin" + key;
  // Programmatic focus target — keyboard focus moves into the window on open.
  win.tabIndex = -1;

  // Small screens: open maximized so the editor / preview stays usable.
  // Desktop behavior is unchanged; the user can still minimize/restore.
  const smallScreen = window.matchMedia("(max-width: 768px)").matches;
  if (smallScreen) {
    win.classList.add("maximized");
  } else {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(cfg.width || 860, vw - 24);
    const h = Math.min(cfg.height || 560, vh - 90);
    win.style.width = w + "px";
    win.style.height = h + "px";
    win.style.left = Math.max(12, (vw - w) / 2) + "px";
    win.style.top = Math.max(56, (vh - h) / 2 - 20) + "px";
  }

  win.innerHTML =
    '<div class="learn-win-bar">' +
      '<span class="learn-win-title">' + (cfg.icon || "") + escapeHtml(cfg.title) + "</span>" +
      '<div class="learn-win-controls">' +
        '<button class="learn-win-ctrl" data-act="min" type="button" title="Minimize" aria-label="Minimize">&minus;</button>' +
        '<button class="learn-win-ctrl" data-act="max" type="button" title="Maximize" aria-label="Maximize">&#9633;</button>' +
        '<button class="learn-win-ctrl close" data-act="close" type="button" title="Close" aria-label="Close">&times;</button>' +
      "</div>" +
    "</div>" +
    '<div class="learn-win-body">' + cfg.body + "</div>" +
    '<div class="learn-win-resize" aria-hidden="true"></div>';

  win.dataset.title = cfg.title || "Window";
  document.body.appendChild(win);
  openWindows[key] = win;
  bringToFront(win);
  wireWindow(win, key, cfg);
  if (cfg.onOpen) cfg.onOpen(win);
  // Move keyboard focus into the window. VS Code focuses its editor in
  // onOpen; Live Preview focuses the container so Tab can enter the frame.
  if (key === "preview" || !win.contains(document.activeElement)) {
    win.focus();
  }
}

function wireWindow(win, key, cfg) {
  // Keep Tab / Shift+Tab inside the active window while it is open.
  win.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    // iframe is included so the Live Preview demo stays keyboard-reachable.
    const focusables = win.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    // Cover both boundaries — including when focus sits on the container
    // itself right after the window opens.
    if (e.shiftKey && (document.activeElement === first || document.activeElement === win)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || document.activeElement === win)) {
      e.preventDefault();
      first.focus();
    }
  });

  // Click anywhere brings the window forward.
  win.addEventListener("pointerdown", () => bringToFront(win));

  // Controls
  win.querySelectorAll(".learn-win-ctrl").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const act = btn.getAttribute("data-act");
      if (act === "close") closeWindow(key);
      else if (act === "max") toggleMaximize(win);
      else if (act === "min") minimizeWindow(key);
    });
  });

  // Drag via the title bar
  const bar = win.querySelector(".learn-win-bar");
  bar.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".learn-win-ctrl")) return;
    if (win.classList.contains("maximized")) return;
    e.preventDefault();
    startDrag(win, e);
  });

  // Resize via the bottom-right handle
  const rz = win.querySelector(".learn-win-resize");
  rz.addEventListener("pointerdown", (e) => {
    if (win.classList.contains("maximized")) return;
    e.preventDefault();
    e.stopPropagation();
    startResize(win, e);
  });
}

function startDrag(win, e) {
  const bar = win.querySelector(".learn-win-bar");
  const rect = win.getBoundingClientRect();
  const offX = e.clientX - rect.left;
  const offY = e.clientY - rect.top;

  // Own the pointer for the duration of the drag so the gesture can't be
  // hijacked by native drag/selection, lost on fast movement, or routed to
  // the sandboxed run-frame iframe while the pointer crosses it.
  try { bar.setPointerCapture(e.pointerId); } catch (err) {}

  const move = (ev) => {
    let x = ev.clientX - offX;
    let y = ev.clientY - offY;
    x = Math.max(4, Math.min(x, window.innerWidth - 60));
    y = Math.max(4, Math.min(y, window.innerHeight - 36));
    win.style.left = x + "px";
    win.style.top = y + "px";
  };
  const up = () => {
    try { bar.releasePointerCapture(e.pointerId); } catch (err) {}
    bar.removeEventListener("pointermove", move);
    bar.removeEventListener("pointerup", up);
    bar.removeEventListener("pointercancel", up);
  };
  bar.addEventListener("pointermove", move);
  bar.addEventListener("pointerup", up);
  bar.addEventListener("pointercancel", up);
}

function startResize(win, e) {
  const rect = win.getBoundingClientRect();
  const move = (ev) => {
    const w = Math.max(360, ev.clientX - rect.left);
    const h = Math.max(240, ev.clientY - rect.top);
    win.style.width = Math.min(w, window.innerWidth - 8) + "px";
    win.style.height = Math.min(h, window.innerHeight - 8) + "px";
  };
  const up = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", up);
  };
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", up);
}

function toggleMaximize(win) {
  win.classList.toggle("maximized");
}

function minimizeWindow(key) {
  const win = openWindows[key];
  if (!win) return;
  win.classList.add("minimized");

  // Taskbar-style restore pill.
  const pill = document.createElement("button");
  pill.id = "learnWinPill" + key;
  pill.className = "learn-win-pill";
  pill.type = "button";
  const icon = win.querySelector(".learn-win-title svg");
  pill.innerHTML = (icon ? icon.outerHTML : ICONS.code) + "<span>" + escapeHtml(win.dataset.title || "Window") + "</span>";
  pill.addEventListener("click", () => restoreWindow(key));
  document.body.appendChild(pill);
  // Keep keyboard users on the restore path (the window itself is hidden).
  pill.focus();
}

/* ---------- VS Code window ---------- */
function vscodeFileIcon(name) {
  if (name.endsWith(".html")) return ICONS.fileHtml;
  if (name.endsWith(".css")) return ICONS.fileCss;
  return ICONS.fileJs;
}

function vscodeLang(name) {
  if (name.endsWith(".html")) return "html";
  if (name.endsWith(".css")) return "css";
  return "js";
}

function openVscode(trigger) {
  const files = Object.keys(workshop.files || {});
  const explorer = files.map((f) =>
    '<button class="vscode-file" data-file="' + escapeHtml(f) + '" type="button">' +
      vscodeFileIcon(f) + escapeHtml(f) +
    "</button>"
  ).join("");

  makeWindow("vscode", {
    title: workshop.title,
    icon: ICONS.code,
    theme: "vscode",
    width: 920,
    height: 600,
    body:
      '<div class="vscode-body">' +
        '<div class="vscode-explorer">' +
          '<div class="vscode-exp-head">' + ICONS.folder + " " + escapeHtml(workshop.folder || workshop.title) + "</div>" +
          explorer +
        "</div>" +
        '<div class="vscode-main">' +
          '<div class="vscode-tabs"></div>' +
          '<div class="vscode-editor" id="vscodeEditor"></div>' +
          '<div class="vscode-actions">' +
            '<button class="vscode-act vscode-act-run" id="vscodeRunBtn" type="button">' +
              '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86Z"/></svg>Run Code' +
            "</button>" +
            '<button class="vscode-act vscode-act-check" id="vscodeCheckBtn" type="button">' +
              ICONS.check + "Check My Code" +
            "</button>" +
          "</div>" +
          '<div class="vscode-console" hidden>' +
            '<div class="vscode-console-head">' +
              '<span class="vscode-console-title">Terminal</span>' +
              '<button class="vscode-console-clear" id="vscodeConsoleClear" type="button" title="Clear output" aria-label="Clear output">&times;</button>' +
            "</div>" +
            '<div class="vscode-console-out" aria-live="polite"></div>' +
          "</div>" +
          '<div class="vscode-status"><span>Ln 1, Col 1</span><span class="spacer"></span><span>UTF-8</span><span>Spaces: 2</span></div>' +
        "</div>" +
      "</div>",
    onOpen: (win) => {
      win.querySelectorAll(".vscode-file").forEach((row) => {
        row.addEventListener("click", () => selectVscodeFile(win, row.getAttribute("data-file")));
      });
      // Open the learner's file by default (the one they must write).
      const first = files.includes("script.js") ? "script.js" : files[0];
      selectVscodeFile(win, first);

      // Bottom action bar: run + check the learner's exact editor content.
      const runBtn = win.querySelector("#vscodeRunBtn");
      if (runBtn) runBtn.addEventListener("click", runCode);
      const checkBtn = win.querySelector("#vscodeCheckBtn");
      if (checkBtn) checkBtn.addEventListener("click", checkMyCode);
      const clearBtn = win.querySelector("#vscodeConsoleClear");
      if (clearBtn) clearBtn.addEventListener("click", () => {
        vscodeClear(win);
        const c = vscodeConsole(win);
        if (c) c.hidden = true;
      });
    }
  }, trigger);
}

function selectVscodeFile(win, name) {
  const starter = workshop.files[name];
  if (starter == null) return;

  win.querySelectorAll(".vscode-file").forEach((r) => {
    r.classList.toggle("active", r.getAttribute("data-file") === name);
  });

  const tabs = win.querySelector(".vscode-tabs");
  tabs.innerHTML = '<span class="vscode-tab active">' + vscodeFileIcon(name) + escapeHtml(name) + "</span>";

  const editor = win.querySelector(".vscode-editor");
  const lang = vscodeLang(name);

  if (lang === "js") {
    // script.js is the learner's file: render an editable editor.
    // Draft takes priority over the starter once the learner has typed.
    const value = Object.prototype.hasOwnProperty.call(codeDrafts, name) ? codeDrafts[name] : String(starter);
    renderEditableEditor(win, editor, name, value);
    return;
  }

  // Read-only files (index.html, style.css) — keep the highlighted view.
  const lines = String(starter).split("\n");
  editor.innerHTML = lines.map((line, i) =>
    '<div class="vscode-line"><span class="vscode-ln">' + (i + 1) + '</span><span class="vscode-code">' + highlight(line, lang) + "</span></div>"
  ).join("");
  updateVscodeStatus(win, 1, 1, lang);
}

/* ---------- Editable editor (textarea over a highlighted ghost layer) ---------- */
function renderEditableEditor(win, editor, name, value) {
  editor.innerHTML =
    '<div class="vscode-edit" data-file="' + escapeHtml(name) + '">' +
      '<div class="vscode-edit-gutter" aria-hidden="true"></div>' +
      '<div class="vscode-edit-ghost" aria-hidden="true"></div>' +
      '<textarea class="vscode-edit-input" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="' + escapeHtml(name) + ' editor"></textarea>' +
    "</div>";

  const input = editor.querySelector(".vscode-edit-input");
  const ghost = editor.querySelector(".vscode-edit-ghost");
  const gutter = editor.querySelector(".vscode-edit-gutter");

  input.value = value;
  refreshEditable(editor, input, ghost, gutter);

  input.addEventListener("input", () => {
    codeDrafts[name] = input.value;
    saveDrafts();
    refreshEditable(editor, input, ghost, gutter);
  });
  input.addEventListener("scroll", () => {
    ghost.scrollTop = input.scrollTop;
    ghost.scrollLeft = input.scrollLeft;
    gutter.scrollTop = input.scrollTop;
  });
  input.addEventListener("keyup", () => {
    const pos = caretPosition(input);
    updateVscodeStatus(win, pos.line, pos.col, "js");
  });
  input.addEventListener("click", () => {
    const pos = caretPosition(input);
    updateVscodeStatus(win, pos.line, pos.col, "js");
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      // Insert spaces (matching the status-bar "Spaces: 2") instead of moving focus.
      e.preventDefault();
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.value = input.value.slice(0, start) + "  " + input.value.slice(end);
      input.selectionStart = input.selectionEnd = start + 2;
      codeDrafts[name] = input.value;
      saveDrafts();
      refreshEditable(editor, input, ghost, gutter);
    }
  });

  input.focus();
}

function refreshEditable(editor, input, ghost, gutter) {
  const value = input.value;
  const lineCount = value.split("\n").length;

  // Highlighted backdrop mirrors the textarea's text (trailing newline kept).
  const html = value.split("\n").map((line) =>
    highlight(line, "js")
  ).join("\n") + (value.endsWith("\n") ? "\n" : "");
  ghost.innerHTML = html;

  // Line numbers, synced with the textarea scroll.
  let nums = "";
  for (let i = 1; i <= lineCount; i++) nums += '<span class="vscode-edit-num">' + i + "</span>";
  gutter.innerHTML = nums;
  gutter.scrollTop = input.scrollTop;

  editor.dataset.lineCount = lineCount;
}

function caretPosition(input) {
  const upTo = input.value.slice(0, input.selectionStart);
  const line = upTo.split("\n").length;
  const col = upTo.length - upTo.lastIndexOf("\n");
  return { line, col };
}

function updateVscodeStatus(win, line, col, lang) {
  const status = win.querySelector(".vscode-status");
  if (!status) return;
  const langLabel = lang === "js" ? "JavaScript" : lang === "css" ? "CSS" : "HTML";
  status.innerHTML = '<span>Ln ' + line + ", Col " + col + '</span><span class="spacer"></span><span>' + langLabel + "</span><span>UTF-8</span><span>Spaces: 2</span>";
}

function getScriptCode() {
  // Single source of truth: the VS Code script.js editor.
  const win = openWindows.vscode;
  if (win) {
    const input = win.querySelector(".vscode-edit-input");
    if (input) return input.value;
  }
  return Object.prototype.hasOwnProperty.call(codeDrafts, "script.js") ? codeDrafts["script.js"] : "";
}

/* ---------- Tiny syntax highlighter (line-based, safe) ---------- */
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const TOKENIZERS = {
  js: {
    re: /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(const|let|var|function|return|if|else|for|while|new|class|import|export|from|typeof|document|window|Date|setInterval|getElementById|innerText|textContent|padStart|toString)\b|\b(\d+(?:\.\d+)?)\b/g,
    wrap: (m) => {
      if (m[1]) return '<span class="tk-cm">' + esc(m[1]) + "</span>";
      if (m[2]) return '<span class="tk-str">' + esc(m[2]) + "</span>";
      if (m[3]) return '<span class="tk-kw">' + esc(m[3]) + "</span>";
      if (m[4]) return '<span class="tk-num">' + esc(m[4]) + "</span>";
      return esc(m[0]);
    }
  },
  css: {
    re: /(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|([.#][\w-]+)|([a-zA-Z-]+)(?=\s*:)|(\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw)?\b)/g,
    wrap: (m) => {
      if (m[1]) return '<span class="tk-cm">' + esc(m[1]) + "</span>";
      if (m[2]) return '<span class="tk-str">' + esc(m[2]) + "</span>";
      if (m[3]) return '<span class="tk-tag">' + esc(m[3]) + "</span>";
      if (m[4]) return '<span class="tk-attr">' + esc(m[4]) + "</span>";
      if (m[5]) return '<span class="tk-num">' + esc(m[5]) + "</span>";
      return esc(m[0]);
    }
  },
  html: {
    re: /(<!--[\s\S]*?-->)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(<\/?)([a-zA-Z][\w-]*)|([a-zA-Z-]+)(?==)|(\/?>)/g,
    wrap: (m) => {
      if (m[1]) return '<span class="tk-cm">' + esc(m[1]) + "</span>";
      if (m[2]) return '<span class="tk-str">' + esc(m[2]) + "</span>";
      if (m[3]) return esc(m[3]);
      if (m[4]) return '<span class="tk-tag">' + esc(m[4]) + "</span>";
      if (m[5]) return '<span class="tk-attr">' + esc(m[5]) + "</span>";
      if (m[6]) return '<span class="tk-tag">' + esc(m[6]) + "</span>";
      return esc(m[0]);
    }
  }
};

function highlight(line, lang) {
  const tok = TOKENIZERS[lang];
  if (!tok) return esc(line);
  const re = new RegExp(tok.re.source, tok.re.flags);
  let out = "";
  let last = 0;
  let m;
  while ((m = re.exec(line)) !== null) {
    out += esc(line.slice(last, m.index));
    out += tok.wrap(m);
    last = re.lastIndex;
  }
  out += esc(line.slice(last));
  return out;
}

/* ---------- Live Preview window ---------- */
/* Scale the project page down to fit the preview frame, so the WHOLE app is
   visible without scrolling (scale-to-fit). Injects a small style block into
   the project's own document; every re-fit removes it first so we always
   measure the natural size before scaling again. */
function fitPreview(frame) {
  try {
    const doc = frame.contentDocument;
    if (!doc || !doc.documentElement) return;
    const html = doc.documentElement;
    const prev = doc.getElementById("learnjs-preview-fit");
    if (prev) prev.remove();

    const w = frame.clientWidth;
    const h = frame.clientHeight;
    if (!w || !h) return;

    const nw = html.scrollWidth;
    const nh = html.scrollHeight;
    if (!nw || !nh) return;

    const s = Math.min(w / nw, h / nh, 1);
    if (s >= 1) return; // already fits — no scaling needed

    const style = doc.createElement("style");
    style.id = "learnjs-preview-fit";
    style.textContent =
      "html{transform:scale(" + s.toFixed(4) + ");transform-origin:top left;" +
      "width:" + (100 / s).toFixed(4) + "%;overflow:hidden;}" +
      "body{overflow:hidden;}";
    (doc.head || html).appendChild(style);
  } catch (err) {
    /* Different origin or document not ready — leave the preview as-is. */
  }
}

function openPreview(trigger) {
  makeWindow("preview", {
    title: "Live Preview — " + workshop.title,
    icon: ICONS.eye,
    theme: "preview",
    width: 820,
    height: 640,
    body: '<div class="preview-body"><iframe class="preview-frame" src="' + escapeHtml(workshop.previewUrl) + '" title="Live Preview"></iframe></div>'
  }, trigger);

  const win = openWindows.preview;
  if (!win) return;
  const frame = win.querySelector(".preview-frame");
  // Only wire the fit logic once per window lifetime (reopening restores).
  if (!frame || frame.dataset.fit === "1") return;
  frame.dataset.fit = "1";

  const refit = () => fitPreview(frame);
  frame.addEventListener("load", () => {
    refit();
    // Retry a couple of times so late-loading fonts/images don't leave the
    // page overflowing after the first measurement.
    [300, 900].forEach((t) => window.setTimeout(refit, t));
  });
  // Covers the maximize button and the manual resize handle.
  if (typeof ResizeObserver === "function") new ResizeObserver(refit).observe(frame);
  refit();
}

/* ============================================================
   App shell (sidebar collapse, mobile drawer, account menu)
   Mirrors the dashboard shell behaviour so the page feels native.
   ============================================================ */
const SIDEBAR_STORAGE_KEY = "learnjs-dash-sidebar";
const dashShell = el("dashShell");
const dashSidebar = el("dashSidebar");

function applySidebarState(collapsed) {
  dashShell.classList.toggle("sidebar-collapsed", collapsed);
  dashSidebar.classList.toggle("collapsed", collapsed);
  const btn = el("dashCollapseToggle");
  if (btn) {
    btn.setAttribute("aria-pressed", String(collapsed));
    btn.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
  }
}

function setupShell() {
  // Learning pages are content-focused: always start with the sidebar
  // collapsed, regardless of the stored preference. The toggle stays
  // available so the user can re-open it manually. Only this page forces
  // the collapsed start — every other page keeps reading the stored state.
  let collapsed = true;
  applySidebarState(collapsed);

  el("dashCollapseToggle").addEventListener("click", () => {
    const next = !dashShell.classList.contains("sidebar-collapsed");
    applySidebarState(next);
    try { localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "collapsed" : "expanded"); } catch (err) {}
  });

  // Mobile drawer
  function closeSidebar() {
    document.body.classList.remove("dash-open");
    el("dashMenuToggle").setAttribute("aria-expanded", "false");
  }
  el("dashMenuToggle").addEventListener("click", () => {
    const open = document.body.classList.toggle("dash-open");
    el("dashMenuToggle").setAttribute("aria-expanded", String(open));
  });
  el("dashBackdrop").addEventListener("click", closeSidebar);
  document.querySelectorAll(".dash-nav a").forEach((a) => a.addEventListener("click", closeSidebar));

  // Floating tooltips when the sidebar is collapsed (desktop).
  const tip = document.createElement("div");
  tip.className = "dash-tooltip";
  tip.setAttribute("role", "tooltip");
  document.body.appendChild(tip);
  document.querySelectorAll(".dash-nav-item").forEach((item) => {
    const label = item.getAttribute("data-label") || item.textContent.trim();
    item.addEventListener("mouseenter", () => {
      if (!dashSidebar.classList.contains("collapsed") || window.innerWidth <= 1024) return;
      tip.textContent = label;
      const r = item.getBoundingClientRect();
      tip.style.top = r.top + r.height / 2 + "px";
      tip.style.left = r.right + 12 + "px";
      tip.classList.add("show");
    });
    item.addEventListener("mouseleave", () => tip.classList.remove("show"));
    item.addEventListener("click", () => tip.classList.remove("show"));
  });

  // Account menu (top-right avatar) — compact version of the dashboard menu.
  buildAccountMenu(currentUser);

  // Logout (sidebar foot)
  el("dashLogout").addEventListener("click", logout);
}

function buildAccountMenu(user) {
  const area = el("dashAccountArea");
  const btn = el("dashAvatarBtn");
  if (!area || !btn) return;

  const name = user.displayName || user.email || "Learner";
  const menu = document.createElement("div");
  menu.className = "avatar-menu dash-account-menu";
  menu.id = "dashAccountMenu";
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-label", "Account");
  menu.hidden = true;
  menu.innerHTML =
    '<div class="avatar-menu-head">' +
      '<span class="avatar avatar-sm av-green">' + initials(name) + "</span>" +
      '<div style="min-width:0">' +
        '<div class="avatar-menu-name">' + escapeHtml(name) + "</div>" +
        '<div class="avatar-menu-mail">' + escapeHtml(user.email || "") + "</div>" +
      "</div>" +
    "</div>" +
    '<a class="avatar-menu-item" href="../dashboard/#profile" role="menuitem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>View / Edit Profile</span></a>' +
    '<a class="avatar-menu-item" href="../dashboard/#settings" role="menuitem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg><span>Account Settings</span></a>' +
    '<button class="avatar-menu-item" type="button" role="menuitem" data-account-action="logout"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg><span>Logout</span></button>';
  area.appendChild(menu);

  btn.setAttribute("aria-controls", "dashAccountMenu");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (menu.hidden) { menu.hidden = false; btn.setAttribute("aria-expanded", "true"); }
    else closeAccountMenu();
  });
  menu.addEventListener("click", (e) => {
    const item = e.target.closest("[data-account-action]");
    if (!item) return;
    closeAccountMenu();
    if (item.getAttribute("data-account-action") === "logout") logout();
  });
  document.addEventListener("click", (e) => {
    if (menu.hidden) return;
    if (area.contains(e.target)) return;
    closeAccountMenu();
  });

  function closeAccountMenu() {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  }
}

async function logout() {
  const btn = el("dashLogout");
  btn.disabled = true;
  toast("Signing out…");
  try {
    await signOut(auth);
    window.location.href = "../home/";
  } catch (err) {
    toast(err.message, "error");
    btn.disabled = false;
  }
}

// Escape closes the account menu first, then any open floating window.
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const menu = el("dashAccountMenu");
  if (menu && !menu.hidden) {
    menu.hidden = true;
    el("dashAvatarBtn").setAttribute("aria-expanded", "false");
    return;
  }
  const keys = Object.keys(openWindows);
  if (keys.length) closeWindow(keys[keys.length - 1]);
});
// end of learn.js
