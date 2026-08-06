/* ============================================================
   LearnJS — project-details.js (pages/project-details)
   Placeholder details page. Auth-guarded like the dashboard.
   Reads ?slug= from the URL, looks the project up in the
   generated index (Website/data/projects.json), shows its info
   and progress, and lets the user launch / complete it.
   ============================================================ */

import { db } from "../../js/firebase/firestore.js";
import { requireAuth } from "../../js/common/require-auth.js";
import { loadProjects, getProjectById } from "../../js/projects/project-loader.js";
import { setProjectProgress } from "../../js/projects/progress.js";
import {
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

/* Lucide category icons (stroke-based, matches the dashboard). */
const CATEGORY_ICON = {
  "Core JS": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.914 4a1.5 1.5 0 0 0-2.474-1.561l-9 9A1.5 1.5 0 0 0 5.5 14h4.002a.5.5 0 0 1 .471.666L8.086 20a1.5 1.5 0 0 0 2.475 1.56l9-9A1.5 1.5 0 0 0 18.5 10h-3.997a.5.5 0 0 1-.472-.667z"/></svg>',
  "APIs & Data": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  "Advanced": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/></svg>',
  "Full-Stack": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/></svg>',
  "Games": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>'
};
/* Start-button icons (swapped when the project is completed). */
const START_ICONS = {
  go: '<svg id="dStartIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  done: '<svg id="dStartIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
};

/* ---------- State ---------- */
let currentUser = null;
let project = null;
let progress = { status: "none", percent: 0 };
let startState = "none"; // "none" | "started" | "completed"
let lastIconState = null; // guards the start-button icon swap against re-renders

/* ---------- Boot ---------- */
async function init() {
  // Capture the slug BEFORE the auth guard so the login return URL keeps it
  // (otherwise after sign-in we would land here without ?slug= → not found).
  const slug = new URLSearchParams(window.location.search).get("slug");
  const user = await requireAuth("../project-details/?slug=" + encodeURIComponent(slug || ""));
  currentUser = user;

  if (!slug) {
    showNotFound();
    return;
  }

  const projects = await loadProjects();
  project = getProjectById(projects, slug);
  if (!project) {
    showNotFound();
    return;
  }

  renderProject();
  listenToProgress();
}
init();

/* ---------- Rendering ---------- */
function showNotFound() {
  el("detailsLoading").hidden = true;
  el("detailsContent").hidden = true;
  el("detailsNotFound").hidden = false;
}

function renderProject() {
  el("detailsLoading").hidden = true;
  el("detailsContent").hidden = false;

  document.title = project.title + " — LearnJS";
  el("dCover").src = project.coverImage || "";
  el("dCover").alt = project.title;
  el("dTitle").textContent = project.title;
  el("dDesc").textContent = project.description || "";
  // Solid difficulty badge — same component as the dashboard cards
  // (css/components/components.css). Level class drives the fill colour.
  const diff = project.difficulty || "";
  el("dDifficulty").className = "difficulty-badge" + (diff ? " " + diff.toLowerCase() : "");
  el("dDifficulty").textContent = diff || "—";
  el("dTime").textContent = project.estimatedTime || "—";
  el("dCategory").innerHTML = (CATEGORY_ICON[project.category] || "") + " " + escapeHtml(project.category || "—");
  el("dTags").innerHTML = (project.tags || []).map((t) => '<span class="tag">' + escapeHtml(t) + "</span>").join("");

  el("dStartBtn").addEventListener("click", onStart);
  el("dCompleteBtn").addEventListener("click", onComplete);
}

function renderProgress() {
  const percent = progress.percent || 0;
  el("dPct").textContent = percent + "%";
  el("dBar").style.width = percent + "%";

  startState = progress.status || "none";
  const startBtn = el("dStartBtn");
  const label = el("dStartLabel");
  const hint = el("dProgressHint");

  if (startState === "completed") {
    label.textContent = "Completed";
    startBtn.disabled = true;
    el("dCompleteBtn").disabled = true;
    hint.textContent = "You finished this project. Great job!";
  } else {
    label.textContent = startState === "started" ? "Continue Learning" : "Start Learning";
    startBtn.disabled = false;
    el("dCompleteBtn").disabled = false;
    hint.textContent = percent > 0
      ? "You're " + percent + "% through this project. Keep going!"
      : "Not started yet — open the project and start building.";
  }
  // Swap the button icon only when the state actually changed (avoid DOM churn).
  if (startState !== lastIconState) {
    el("dStartIcon").outerHTML = startState === "completed" ? START_ICONS.done : START_ICONS.go;
    lastIconState = startState;
  }
}

/* ---------- Actions ---------- */
async function onStart() {
  if (startState === "completed") return;
  if (!project) return;

  // Persist progress (shared write in progress.js), then open in a new tab.
  try {
    await setProjectProgress(currentUser.uid, project.id, "started", Math.max(progress.percent || 0, 10), progress);
    if (project.entryUrl) {
      window.open(project.entryUrl, "_blank", "noopener");
    } else {
      toast("This project has no entry file yet.", "error");
    }
  } catch (err) {
    toast("Could not save progress: " + err.message, "error");
  }
}

async function onComplete() {
  if (startState === "completed") return;
  if (!project) return;
  try {
    await setProjectProgress(currentUser.uid, project.id, "completed", 100, progress);
    toast("Project completed \u2014 nice work! \ud83c\udf89");
  } catch (err) {
    toast("Could not save progress: " + err.message, "error");
  }
}

/* ---------- Live progress ---------- */
function listenToProgress() {
  const ref = doc(db, "users", currentUser.uid, "progress", project.id);
  // onSnapshot delivers the current value immediately, then live updates.
  onSnapshot(ref, (snap) => {
    progress = snap.exists() ? { id: project.id, ...snap.data() } : { status: "none", percent: 0 };
    renderProgress();
  }, (err) => {
    console.warn("[LearnJS] Progress listener error:", err.message);
  });
}
// end of project-details.js
