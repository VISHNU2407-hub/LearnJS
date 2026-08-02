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

const CATEGORY_EMOJI = {
  "Core JS": "\u26a1", "APIs & Data": "\ud83c\udf10", "Advanced": "\ud83d\ude80",
  "Full-Stack": "\ud83e\udde9", "Games": "\ud83c\udfae"
};

/* ---------- State ---------- */
let currentUser = null;
let project = null;
let progress = { status: "none", percent: 0 };
let startState = "none"; // "none" | "started" | "completed"

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
  el("dDifficulty").textContent = project.difficulty || "—";
  el("dTime").textContent = project.estimatedTime || "—";
  el("dCategory").textContent = (CATEGORY_EMOJI[project.category] || "") + " " + (project.category || "—");
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
    label.textContent = "Completed \u2713";
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
