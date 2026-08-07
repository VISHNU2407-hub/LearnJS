/* ============================================================
   LearnJS — learning.js (js/roadmap)
   Learning panel renderer — the dedicated page opened by
   "Start Learning" (never a popup). Demonstrates the final lesson
   UI while lesson content is still being prepared:
     - breadcrumb navigation (Home / Roadmap / Level / Topic)
     - topic title + lesson progress
     - Previous / Next lesson navigation (flows across topics)
     - Mark Complete (persisted per lesson)
     - right-side "On this page" navigation
     - Personal Notes (persisted per topic)
   Lesson content itself is a professional placeholder — no
   theory, examples or code is generated here.
   ============================================================ */

import { loadRoadmap } from "./roadmap-loader.js";
import {
  toggleLesson,
  isLessonDone,
  topicProgress,
  getCurrent,
  setCurrent,
  getNotes,
  setNotes,
  subscribe
} from "./roadmap-progress.js";

/* ---------- helpers ---------- */
function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}

const ICON = {
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
  hourglass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/></svg>',
  circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>'
};

/* ---------- state ---------- */
let data = null;
let current = { levelId: null, topicId: null, lessonIndex: 0 };
let notesTimer = null;

/* ---------- data lookup ---------- */
function findLevel(levelId) {
  return (data.levels || []).find((l) => l.id === levelId) || null;
}
function findTopic(levelId, topicId) {
  const level = findLevel(levelId);
  return level ? (level.topics || []).find((t) => t.id === topicId) || null : null;
}

/** Flat, ordered list of every lesson across the whole roadmap. */
function flatLessons() {
  const flat = [];
  (data.levels || []).forEach((level) =>
    (level.topics || []).forEach((topic) =>
      (topic.subtopics || []).forEach((_, i) =>
        flat.push({ level, topic, lessonIndex: i })
      )
    )
  );
  return flat;
}

/** Resolve the current lesson to a concrete { level, topic, lessonIndex }. */
function resolveCurrent() {
  const topic = findTopic(current.levelId, current.topicId);
  if (topic) {
    const idx = Math.min(Math.max(current.lessonIndex || 0, 0), topic.subtopics.length - 1);
    return { level: findLevel(current.levelId), topic, lessonIndex: idx };
  }
  // Fallback: very first lesson of the roadmap.
  const first = flatLessons()[0];
  return first || { level: null, topic: null, lessonIndex: 0 };
}

/* ---------- rendering ---------- */
function renderBreadcrumb(level, topic) {
  const wrap = document.getElementById("learnBreadcrumb");
  if (!wrap) return;
  wrap.innerHTML =
    '<button class="learn-crumb" data-crumb="home" type="button">Home</button>' +
    '<span class="learn-crumb-sep">' + ICON.chevronRight + "</span>" +
    '<button class="learn-crumb" data-crumb="roadmap" type="button">Roadmap</button>' +
    '<span class="learn-crumb-sep">' + ICON.chevronRight + "</span>" +
    '<span class="learn-crumb learn-crumb-static">Level ' + level.level + "</span>" +
    '<span class="learn-crumb-sep">' + ICON.chevronRight + "</span>" +
    '<span class="learn-crumb learn-crumb-current">' + escapeHtml(topic.title) + "</span>";
}

function renderLessonHeader(topic, lessonIndex) {
  const total = topic.subtopics.length;
  const pct = topicProgress(topic);
  const done = isLessonDone(topic.id, lessonIndex);

  const label = document.getElementById("learnLessonLabel");
  const bar = document.getElementById("learnLessonBar");
  const btn = document.getElementById("learnCompleteBtn");
  const topicPct = document.getElementById("learnTopicPct");

  if (label) label.textContent = "Lesson " + (lessonIndex + 1) + " of " + total;
  if (bar) bar.style.width = Math.round(((lessonIndex + 1) / total) * 100) + "%";
  if (topicPct) topicPct.textContent = "Topic " + pct + "% complete";
  if (btn) {
    btn.classList.toggle("done", done);
    btn.setAttribute("aria-pressed", String(done));
    btn.innerHTML = done ? ICON.check + "Completed" : ICON.check + "Mark Complete";
  }
}

function renderLessonBody(topic, lessonIndex) {
  const name = document.getElementById("learnLessonName");
  if (name) name.textContent = topic.subtopics[lessonIndex];
}

function renderPlaceholder(topic) {
  const wrap = document.getElementById("learnPlaceholder");
  if (!wrap) return;
  wrap.innerHTML =
    '<div class="lesson-placeholder">' +
      '<div class="lesson-placeholder-ico">' + ICON.hourglass + "</div>" +
      "<h3>Learning content is currently being prepared</h3>" +
      "<p>This lesson content will be available soon. The full curriculum for <b>" +
        escapeHtml(topic.title) + "</b> is being written by the LearnJS team " +
        "&mdash; the layout is ready, the lessons are on the way.</p>" +
    "</div>";
}

function renderNav(flat, index) {
  const prevBtn = document.getElementById("learnPrevBtn");
  const nextBtn = document.getElementById("learnNextBtn");
  if (prevBtn) {
    const hasPrev = index > 0;
    prevBtn.disabled = !hasPrev;
    prevBtn.setAttribute("aria-disabled", String(!hasPrev));
  }
  if (nextBtn) {
    const hasNext = index !== -1 && index < flat.length - 1;
    nextBtn.disabled = !hasNext;
    nextBtn.setAttribute("aria-disabled", String(!hasNext));
  }
}

function renderOnThisPage(level, topic, lessonIndex) {
  const wrap = document.getElementById("learnOnThisPage");
  if (!wrap) return;
  wrap.innerHTML = (topic.subtopics || []).map((s, i) =>
    '<button class="learn-toc-item' + (i === lessonIndex ? " active" : "") +
      (isLessonDone(topic.id, i) ? " done" : "") + '" data-toc="' + i + '" type="button">' +
      '<span class="learn-toc-ico">' + (isLessonDone(topic.id, i) ? ICON.check : ICON.circle) + "</span>" +
      "<span>" + escapeHtml(s) + "</span>" +
    "</button>"
  ).join("");
}

function renderNotes(topicId) {
  const ta = document.getElementById("learnNotesInput");
  const meta = document.getElementById("learnNotesMeta");
  // Never clobber text the user is currently typing (progress re-renders).
  if (ta && document.activeElement !== ta) ta.value = getNotes(topicId);
  if (meta) meta.textContent = getNotes(topicId) ? "Saved locally on this device" : "Notes are saved automatically on this device";
}

export function renderLearning() {
  const resolved = resolveCurrent();
  if (!resolved.topic) {
    // Keep the layout intact — only the lesson area reflects the empty state.
    const ph = document.getElementById("learnPlaceholder");
    if (ph) ph.innerHTML = '<div class="dash-empty">' + ICON.book + "Roadmap data is unavailable right now.</div>";
    return;
  }
  const { level, topic, lessonIndex } = resolved;

  const title = document.getElementById("learnTitle");
  if (title) title.textContent = topic.title;
  const eyebrow = document.getElementById("learnEyebrow");
  if (eyebrow) eyebrow.textContent = "Level " + level.level + " \u00b7 " + level.track;

  renderBreadcrumb(level, topic);
  renderLessonHeader(topic, lessonIndex);
  renderLessonBody(topic, lessonIndex);
  renderPlaceholder(topic);

  const flat = flatLessons();
  const index = flat.findIndex((f) => f.topic.id === topic.id && f.lessonIndex === lessonIndex);
  renderNav(flat, index);

  renderOnThisPage(level, topic, lessonIndex);
  renderNotes(topic.id);

  // Resume state so a revisit lands on the same lesson.
  setCurrent({ levelId: level.id, topicId: topic.id, lessonIndex });
}

/* ---------- navigation ---------- */
function goToLesson(delta) {
  const resolved = resolveCurrent();
  if (!resolved.topic) return;
  const flat = flatLessons();
  let index = flat.findIndex((f) => f.topic.id === resolved.topic.id && f.lessonIndex === resolved.lessonIndex);
  if (index === -1) index = 0;
  const target = index + delta;
  if (target < 0 || target >= flat.length) return;
  const next = flat[target];
  current = { levelId: next.level.id, topicId: next.topic.id, lessonIndex: next.lessonIndex };
  renderLearning();
}

function openLesson(topicId, lessonIndex) {
  // Find the level that owns this topic.
  const level = (data.levels || []).find((l) => (l.topics || []).some((t) => t.id === topicId));
  if (!level) return;
  current = { levelId: level.id, topicId, lessonIndex: lessonIndex || 0 };
  renderLearning();
}

/* ---------- actions ---------- */
function toggleComplete() {
  const resolved = resolveCurrent();
  if (!resolved.topic) return;
  const done = toggleLesson(resolved.topic.id, resolved.lessonIndex);
  if (done && topicProgress(resolved.topic) === 100) {
    if (window.LearnJS && window.LearnJS.toast) {
      window.LearnJS.toast("Topic complete \u2014 nice work! \ud83c\udf89");
    }
  }
  // The roadmap store notifies roadmap.js; re-render local pieces too.
  renderLessonHeader(resolved.topic, resolved.lessonIndex);
  renderOnThisPage(resolved.level, resolved.topic, resolved.lessonIndex);
}

function bindEvents() {
  const panel = document.getElementById("panel-learning");
  if (!panel) return;

  panel.addEventListener("click", (e) => {
    const crumb = e.target.closest("[data-crumb]");
    if (crumb) {
      const dest = crumb.getAttribute("data-crumb");
      if (dest === "home") window.dispatchEvent(new CustomEvent("learnjs:goto-home"));
      else if (dest === "roadmap") window.dispatchEvent(new CustomEvent("learnjs:goto-roadmap"));
      return;
    }
    const toc = e.target.closest("[data-toc]");
    if (toc) {
      openLesson(current.topicId, Number(toc.getAttribute("data-toc")));
      return;
    }
    const prev = e.target.closest("#learnPrevBtn");
    if (prev && !prev.disabled) { goToLesson(-1); return; }
    const next = e.target.closest("#learnNextBtn");
    if (next && !next.disabled) { goToLesson(1); return; }
    const complete = e.target.closest("#learnCompleteBtn");
    if (complete) toggleComplete();
  });

  const ta = document.getElementById("learnNotesInput");
  if (ta) {
    ta.addEventListener("input", () => {
      clearTimeout(notesTimer);
      notesTimer = setTimeout(() => {
        setNotes(current.topicId, ta.value);
        const meta = document.getElementById("learnNotesMeta");
        if (meta) meta.textContent = "Saved \u2713";
      }, 400);
    });
  }
}

/* ---------- boot ---------- */
export async function initLearning() {
  data = await loadRoadmap();
  // Resume where the user left off; default to the very first lesson.
  const saved = getCurrent();
  if (saved && findTopic(saved.levelId, saved.topicId)) {
    current = { levelId: saved.levelId, topicId: saved.topicId, lessonIndex: saved.lessonIndex || 0 };
  } else {
    const first = flatLessons()[0];
    if (first) current = { levelId: first.level.id, topicId: first.topic.id, lessonIndex: 0 };
  }
  bindEvents();
  subscribe(renderLearning);
  renderLearning();
}

/** Public API used by the dashboard: open a topic's lessons. */
export function openTopic(topicId, lessonIndex) {
  openLesson(topicId, lessonIndex);
}

/**
 * Immediately persist any debounced notes so a logout that happens right
 * after typing doesn't lose them. Called by the dashboard before it waits
 * on flushWrites().
 */
export function flushPendingNotes() {
  if (!notesTimer) return;
  clearTimeout(notesTimer);
  notesTimer = null;
  const ta = document.getElementById("learnNotesInput");
  if (ta) setNotes(current.topicId, ta.value);
}
// end of learning.js
