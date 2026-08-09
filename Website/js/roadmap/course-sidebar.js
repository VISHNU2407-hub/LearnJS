/* ============================================================
   LearnJS — course-sidebar.js (js/roadmap)
   The persistent "Course Contents" sidebar of the split-screen
   learning layout (left side, like Udemy / Coursera):
     - overall course progress overview (ring + bar)
     - levels → modules (topics) → lessons, independently scrollable
     - per-lesson completion state (check + 100%), lock icons for
       locked lessons, highlight for the current lesson
     - sequential unlocking: a lesson is available when every lesson
       before it (in course order) is complete — the current lesson
       and any completed lesson are always reachable
     - collapse/expand (desktop & tablet) remembered in localStorage;
       a slide-out drawer with backdrop on mobile
   Renders via DOM re-builds that PRESERVE the sidebar scroll
   position, and exposes a targeted updateActiveLesson() so switching
   lessons never rebuilds (and never flickers) the list.
   ============================================================ */

import { loadRoadmap } from "./roadmap-loader.js";
import {
  isLessonDone,
  topicDoneCount,
  topicProgress,
  overallProgress,
  overallDone
} from "./roadmap-progress.js";

/* ---------- icons ---------- */
const ICON = {
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>'
};

/* ---------- state ---------- */
const STORAGE_KEY = "learnjs-course-sidebar";
let levels = [];                 // roadmap levels
let current = { levelId: null, topicId: null, lessonIndex: 0 };
let onSelect = null;             // (levelId, topicId, lessonIndex) callback
let collapsed = false;           // desktop / tablet collapse state
let drawerOpen = false;          // mobile drawer state
let flat = [];                   // flattened lesson list { level, topic, lessonIndex }
let expandedTopics = new Set();  // topic ids with open lesson lists
let expandedLevels = new Set();  // level ids with open topic lists

const mobileMQ = window.matchMedia("(max-width: 768px)");
function isMobile() { return mobileMQ.matches; }

/* ---------- tiny helpers ---------- */
function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}
function el(id) { return document.getElementById(id); }
function toast(message, type) {
  if (window.LearnJS && window.LearnJS.toast) window.LearnJS.toast(message, type);
}

/** "1.1.3 Embedding Scripts…" → { num: "1.1.3", name: "Embedding Scripts…" } */
function splitLessonTitle(title) {
  const m = /^([\d.]+)\s*(.*)$/.exec(title || "");
  return { num: m ? m[1] : "", name: m ? m[2] : title };
}

/* ---------- lock logic ----------
   Done state is read LIVE from roadmap-progress.js (isLessonDone) rather
   than cached in `flat`, so a rebuild after any progress change — including
   the synchronous emit from toggleLesson — always renders fresh data. */
function buildFlat() {
  const out = [];
  (levels || []).forEach((level) =>
    (level.topics || []).forEach((topic) =>
      (topic.subtopics || []).forEach((_, i) =>
        out.push({ level, topic, lessonIndex: i })
      )
    )
  );
  return out;
}

function currentFlatIndex() {
  return flat.findIndex((f) =>
    f.topic.id === current.topicId && f.lessonIndex === current.lessonIndex
  );
}

function isDoneAt(lesson) {
  return isLessonDone(lesson.topic.id, lesson.lessonIndex);
}

/** A lesson is unlocked if it is the current one, already done, or every
    lesson before it in course order is completed (sequential unlock). */
function isUnlocked(flatIndex) {
  if (flatIndex === currentFlatIndex()) return true;
  if (flat[flatIndex] && isDoneAt(flat[flatIndex])) return true;
  for (let i = 0; i < flatIndex; i++) {
    if (!isDoneAt(flat[i])) return false;
  }
  return true;
}

/* ---------- collapse / drawer state ---------- */
function applyCollapsed() {
  const layout = el("courseLayout");
  if (!layout) return;
  const show = !(collapsed && !isMobile());
  layout.classList.toggle("course-collapsed", !show);
  const btn = el("courseCollapseBtn");
  if (btn) {
    btn.setAttribute("aria-pressed", String(!show));
    btn.setAttribute("aria-label", show ? "Hide contents" : "Show contents");
    btn.title = show ? "Hide contents" : "Show contents";
  }
}

function setCollapsed(value) {
  collapsed = !!value;
  try { localStorage.setItem(STORAGE_KEY, collapsed ? "collapsed" : "expanded"); } catch (err) {}
  applyCollapsed();
}

function setDrawer(open) {
  drawerOpen = !!open;
  const layout = el("courseLayout");
  if (layout) layout.classList.toggle("course-drawer-open", drawerOpen);
  document.body.style.overflow = drawerOpen ? "hidden" : "";
}

/* ---------- rendering ---------- */
function lessonStateMark(topic, lessonIndex, flatIndex) {
  const isCurrent = flatIndex === currentFlatIndex();
  const done = isLessonDone(topic.id, lessonIndex);
  if (isCurrent) return '<span class="course-lesson-state">' + ICON.play + "</span>";
  if (done) return '<span class="course-lesson-state"><span class="course-lesson-pct">100%</span>' + ICON.check + "</span>";
  if (!isUnlocked(flatIndex)) return '<span class="course-lesson-state">' + ICON.lock + "</span>";
  return '<span class="course-lesson-state"><span class="course-lesson-pct">0%</span></span>';
}

function renderModule(level, topic) {
  const subtopics = topic.subtopics || [];
  const total = subtopics.length;
  const done = topicDoneCount(topic.id);
  const pct = topicProgress(topic);
  const isOpen = expandedTopics.has(topic.id);
  const topicStartIdx = flat.findIndex((f) => f.topic.id === topic.id);

  const lessons = subtopics.map((title, i) => {
    const fi = topicStartIdx + i;
    const parts = splitLessonTitle(title);
    const done = isLessonDone(topic.id, i);
    const cls = [];
    if (fi === currentFlatIndex()) cls.push("current");
    if (done) cls.push("done");
    if (!isUnlocked(fi)) cls.push("locked");
    return (
      '<button class="course-lesson ' + cls.join(" ") + '" data-lesson="' + escapeHtml(topic.id) + ":" + i +
        '" type="button"' + (!isUnlocked(fi) ? ' aria-disabled="true"' : "") + ">" +
        '<span class="course-lesson-num">' + escapeHtml(parts.num) + "</span>" +
        '<span class="course-lesson-name">' + escapeHtml(parts.name) + "</span>" +
        lessonStateMark(topic, i, fi) +
      "</button>"
    );
  }).join("");

  return (
    '<div class="course-module' + (isOpen ? " open" : "") + '" data-module="' + escapeHtml(topic.id) + '">' +
      '<button class="course-module-head" type="button" aria-expanded="' + (isOpen ? "true" : "false") + '">' +
        '<span class="course-module-num">' + escapeHtml(topic.id) + "</span>" +
        '<span class="course-module-info">' +
          '<span class="course-module-name">' + escapeHtml(topic.title) + "</span>" +
          '<span class="course-module-meta">' +
            '<span class="course-module-pct' + (pct === 100 ? " done" : "") + '">' + pct + "%</span>" +
            '<span class="bar course-module-bar"><span class="bar-fill" style="width:' + pct + '%"></span></span>' +
            "<span>" + done + "/" + total + "</span>" +
          "</span>" +
        "</span>" +
        '<span class="course-module-arrow">' + ICON.chevron + "</span>" +
      "</button>" +
      '<div class="course-module-lessons"><div class="course-module-lessons-inner">' +
        '<div class="course-lesson-list">' + lessons + "</div>" +
      "</div></div>" +
    "</div>"
  );
}

function renderLevel(level) {
  const isOpen = expandedLevels.has(level.id);
  const topics = (level.topics || []).map((t) => renderModule(level, t)).join("");
  const track = escapeHtml(level.track);
  return (
    '<div class="course-level' + (isOpen ? " open" : "") + '" data-level="' + escapeHtml(level.id) + '">' +
      '<button class="course-level-label" type="button" aria-expanded="' + (isOpen ? "true" : "false") + '">' +
        "<span>Level " + level.level + "</span>" +
        '<span class="roadmap-track-pill ' + track.toLowerCase() + ' course-level-track">' + track + "</span>" +
        '<span class="course-level-arrow">' + ICON.chevron + "</span>" +
      "</button>" +
      '<div class="course-level-body"><div class="course-level-inner">' +
        (topics || '<div class="dash-empty">No topics yet.</div>') +
      "</div></div>" +
    "</div>"
  );
}

function renderOverview() {
  const wrap = el("courseOverview");
  if (!wrap) return;
  const total = flat.length;
  const done = overallDone(levels);
  const pct = overallProgress(levels);
  wrap.innerHTML =
    '<div class="course-overview-ring" style="--pct:' + pct + '"><span>' + pct + "%</span></div>" +
    '<div class="course-overview-info">' +
      "<b>Overall Progress</b>" +
      "<span>" + done + " of " + total + " lessons complete</span>" +
      '<div class="bar"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
    "</div>";
}

/**
 * Rebuild the whole sidebar (overview + levels). Preserves scroll position
 * so progress re-renders never make the list jump.
 */
export function renderCourseSidebar() {
  const modules = el("courseModules");
  if (!modules) return;
  const scrollTop = modules.scrollTop;
  renderOverview();
  modules.innerHTML = (levels || []).map(renderLevel).join("");
  modules.scrollTop = scrollTop;
}

/**
 * Targeted update when the lesson changes: expands the owning level +
 * module, moves the highlight, and gently keeps the active row visible —
 * without rebuilding the list, so the sidebar never flickers and its
 * scroll position is untouched.
 */
export function updateActiveLesson(next) {
  current = next || current;
  const modules = el("courseModules");
  if (!modules) return;

  // Collapse any other module; expand the current one.
  const topicId = current.topicId;
  if (!expandedTopics.has(topicId)) {
    expandedTopics.clear();
    expandedTopics.add(topicId);
  }
  const levelOf = (levels || []).find((l) =>
    (l.topics || []).some((t) => t.id === topicId)
  );
  if (levelOf) expandedLevels.add(levelOf.id);

  modules.querySelectorAll(".course-module.open").forEach((m) => {
    if (m.getAttribute("data-module") !== topicId) m.classList.remove("open");
  });
  const moduleEl = modules.querySelector('[data-module="' + CSS.escape(topicId) + '"]');
  if (moduleEl) moduleEl.classList.add("open");

  // Move the highlight.
  modules.querySelectorAll(".course-lesson.current").forEach((r) => r.classList.remove("current"));
  const target = modules.querySelector('[data-lesson="' + CSS.escape(topicId) + ":" + current.lessonIndex + '"]');
  if (target) {
    target.classList.add("current");
    target.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

/* ---------- events ---------- */
function bindEvents() {
  const modules = el("courseModules");
  if (modules) {
    modules.addEventListener("click", (e) => {
      const lessonBtn = e.target.closest("[data-lesson]");
      if (lessonBtn) {
        if (lessonBtn.getAttribute("aria-disabled") === "true") {
          toast("Complete the previous lessons to unlock this one 🔒");
          return;
        }
        const [topicId, idx] = lessonBtn.getAttribute("data-lesson").split(":");
        if (onSelect) onSelect(topicId, Number(idx));
        if (isMobile()) setDrawer(false);
        return;
      }
      const moduleHead = e.target.closest(".course-module-head");
      if (moduleHead) {
        const id = moduleHead.closest(".course-module").getAttribute("data-module");
        const isOpen = expandedTopics.has(id);
        if (isOpen) expandedTopics.delete(id);
        else { expandedTopics.clear(); expandedTopics.add(id); }
        moduleHead.closest(".course-module").classList.toggle("open", !isOpen);
        moduleHead.setAttribute("aria-expanded", String(!isOpen));
        return;
      }
      const levelHead = e.target.closest(".course-level-label");
      if (levelHead) {
        const id = levelHead.closest(".course-level").getAttribute("data-level");
        const isOpen = expandedLevels.has(id);
        if (isOpen) expandedLevels.delete(id);
        else expandedLevels.add(id);
        levelHead.closest(".course-level").classList.toggle("open", !isOpen);
        levelHead.setAttribute("aria-expanded", String(!isOpen));
      }
    });
  }

  const collapseBtn = el("courseCollapseBtn");
  if (collapseBtn) {
    collapseBtn.addEventListener("click", () => {
      if (isMobile()) setDrawer(false);
      else setCollapsed(!collapsed);
    });
  }

  const showBtn = el("courseShowBtn");
  if (showBtn) {
    showBtn.addEventListener("click", () => {
      if (isMobile()) setDrawer(true);
      else setCollapsed(false);
    });
  }

  const backdrop = el("courseBackdrop");
  if (backdrop) backdrop.addEventListener("click", () => setDrawer(false));

  // Re-apply on resize (desktop ↔ mobile transitions).
  mobileMQ.addEventListener("change", () => {
    applyCollapsed();
    if (!isMobile()) setDrawer(false);
  });

  // Escape closes the mobile drawer.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawerOpen) setDrawer(false);
  });
}

/* ---------- boot ---------- */
export async function initCourseSidebar(options) {
  if (options && options.onSelect) onSelect = options.onSelect;

  const data = await loadRoadmap();
  levels = data.levels || [];
  flat = buildFlat();

  // Restore collapse preference (expanded by default).
  let stored = "expanded";
  try { stored = localStorage.getItem(STORAGE_KEY) || "expanded"; } catch (err) {}
  collapsed = stored === "collapsed";

  // Expand the level + module containing the current lesson.
  expandedLevels.clear();
  expandedTopics.clear();
  const cur = current;
  const levelOf = levels.find((l) => (l.topics || []).some((t) => t.id === cur.topicId));
  if (levelOf) expandedLevels.add(levelOf.id);
  if (cur.topicId) expandedTopics.add(cur.topicId);

  bindEvents();
  applyCollapsed();
  renderCourseSidebar();
}

/** Let learning.js push the current lesson into the sidebar before render. */
export function setCurrentLesson(state) {
  current = state || current;
}

// end of course-sidebar.js
