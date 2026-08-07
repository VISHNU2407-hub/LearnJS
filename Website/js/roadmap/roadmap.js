/* ============================================================
   LearnJS — roadmap.js (js/roadmap)
   Roadmap panel renderer.
   Builds the Level → Main Topic → Sub Topic structure entirely
   from Website/data/roadmap.json (transcribed from the official
   "learn js roadmap.pdf" curriculum) and renders it as a clean
   accordion that matches the LearnJS dashboard design system.
   Responsibilities:
     - page title + overall progress indicator
     - track filters (All / Beginner / Intermediate / Advanced / Expert)
     - accordion — only ONE main topic expanded at a time
     - compact right-side Topic Preview (name, estimated time,
       difficulty, subtopic count, Start Learning)
   UI only — no Firebase, routing or persistence changes. All
   progress data comes from the existing roadmap-progress store.
   Interacts with the dashboard via events (no imports of the
   dashboard module — keeps the module reusable).
   ============================================================ */

import { loadRoadmap } from "./roadmap-loader.js";
import {
  topicProgress,
  topicDoneCount,
  isLessonDone,
  overallProgress,
  overallDone,
  subscribe
} from "./roadmap-progress.js";

/* ---------- helpers ---------- */
function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}

/* Lucide-style stroke icons, matching the dashboard design system. */
const ICON = {
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 7-7.5a19.5 19.5 0 0 1 7 15.5 1 1 0 0 1-1 1H5a1 1 0 0 1-1-1 19.5 19.5 0 0 1 7-7.5z"/><path d="M9.26 17.68 5.4 20.98"/><path d="M9.26 17.68 12 14.75"/><path d="M14.74 17.68 18.6 20.98"/><path d="M14.74 17.68 12 14.75"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>'
};

/* ---------- state ---------- */
let data = { levels: [], tracks: {} };
let activeTrack = "all";
let expandedTopicId = null;   // only ONE topic expanded at a time
let previewTopicId = null;    // topic shown in the right-side preview

const TRACKS = ["Beginner", "Intermediate", "Advanced", "Expert"];

/* ---------- derived helpers ---------- */
function visibleLevels() {
  if (activeTrack === "all") return data.levels;
  return data.levels.filter((l) => l.track === activeTrack);
}

function findTopic(topicId) {
  for (const level of data.levels) {
    for (const topic of level.topics || []) {
      if (topic.id === topicId) return { level, topic };
    }
  }
  return null;
}

/** Estimated time is derived from the curriculum: ~20 min per subtopic. */
function formatEstimate(topic) {
  const mins = (topic.subtopics ? topic.subtopics.length : 0) * 20;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return m + " min";
  if (m === 0) return h + (h === 1 ? " hr" : " hrs");
  return h + (h === 1 ? " hr" : " hrs") + " " + m + " min";
}

/* ---------- rendering ---------- */
function renderOverall() {
  const pct = overallProgress(data.levels);
  const total = data.levels.reduce((n, l) => n + (l.topics || []).length, 0);
  const lessons = data.levels.reduce(
    (n, l) => n + (l.topics || []).reduce((m, t) => m + (t.subtopics || []).length, 0),
    0
  );

  const bar = document.getElementById("roadmapOverallBar");
  const pctEl = document.getElementById("roadmapOverallPct");
  const sub = document.getElementById("roadmapOverallSub");
  if (bar) bar.style.width = pct + "%";
  if (pctEl) pctEl.textContent = pct + "%";
  if (sub) {
    sub.innerHTML =
      "<b>" + overallDone(data.levels) + "</b> / <b>" + lessons + "</b> lessons completed &bull; " +
      "<b>" + total + "</b> topics";
  }
}

function renderFilters() {
  const wrap = document.getElementById("roadmapFilters");
  if (!wrap) return;
  const all = [{ id: "all", label: "All" }].concat(
    TRACKS.map((t) => ({ id: t, label: t }))
  );
  wrap.innerHTML = all
    .map((f) =>
      '<button class="roadmap-filter' + (activeTrack === f.id ? " active" : "") +
      '" data-track="' + f.id + '" type="button">' + escapeHtml(f.label) + "</button>"
    )
    .join("");
}

function renderLevelHead(level) {
  const topicCount = (level.topics || []).length;
  const lessons = (level.topics || []).reduce((n, t) => n + (t.subtopics || []).length, 0);
  const done = (level.topics || []).reduce((n, t) => n + topicDoneCount(t.id), 0);
  const pct = lessons ? Math.round((done / lessons) * 100) : 0;

  return (
    '<div class="roadmap-level-head">' +
      '<div class="roadmap-level-idx">' + level.level + "</div>" +
      '<div class="roadmap-level-info">' +
        '<div class="roadmap-level-title-row">' +
          "<h3>" + escapeHtml(level.title) + "</h3>" +
          '<span class="roadmap-track-pill ' + (level.track || "").toLowerCase() + '">' + escapeHtml(level.track) + "</span>" +
        "</div>" +
        '<p class="roadmap-level-meta">' +
          "<span>" + topicCount + (topicCount === 1 ? " topic" : " topics") + "</span>" +
          "<span>&middot;</span>" +
          "<span>" + lessons + (lessons === 1 ? " lesson" : " lessons") + "</span>" +
        "</p>" +
      "</div>" +
      '<div class="roadmap-level-progress">' +
        '<div class="bar"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
        "<span>" + pct + "%</span>" +
      "</div>" +
    "</div>"
  );
}

function renderTopicRow(level, topic, expanded) {
  const pct = topicProgress(topic);
  const done = pct === 100;
  const selected = previewTopicId === topic.id;
  return (
    '<div class="roadmap-topic' + (expanded ? " open" : "") + (selected ? " selected" : "") +
      '" data-topic="' + escapeHtml(topic.id) + '">' +
      '<button class="roadmap-topic-head" type="button" aria-expanded="' + (expanded ? "true" : "false") + '">' +
        '<span class="roadmap-topic-num">' + escapeHtml(topic.id) + "</span>" +
        '<span class="roadmap-topic-name">' + escapeHtml(topic.title) + "</span>" +
        '<span class="roadmap-topic-progress' + (done ? " done" : "") + '">' +
          (done ? ICON.check : "") + pct + "%" +
        "</span>" +
        '<span class="roadmap-topic-arrow">' + ICON.chevron + "</span>" +
      "</button>" +
      '<div class="roadmap-topic-body"><div class="roadmap-topic-inner">' +
        '<ul class="roadmap-subtopics">' +
          (topic.subtopics || []).map((s, i) =>
            '<li class="roadmap-subtopic"' + (isLessonDone(topic.id, i) ? ' data-done="1"' : "") + ' data-index="' + i + '">' +
              '<span class="roadmap-subtopic-ico">' + (isLessonDone(topic.id, i) ? ICON.check : ICON.circle) + "</span>" +
              "<span>" + escapeHtml(s) + "</span>" +
            "</li>"
          ).join("") +
        "</ul>" +
      "</div></div>" +
    "</div>"
  );
}

function renderTree() {
  const tree = document.getElementById("roadmapTree");
  if (!tree) return;
  const levels = visibleLevels();
  if (!data.levels.length) {
    tree.innerHTML = '<div class="dash-empty"><span class="empty-ico">' + ICON.book + "</span>Roadmap data is unavailable right now.</div>";
    return;
  }
  if (!levels.length) {
    tree.innerHTML = '<div class="dash-empty"><span class="empty-ico">' + ICON.book + "</span>No levels match this filter.</div>";
    return;
  }

  // If the preview topic is hidden by the active filter, fall back to the
  // first visible topic so the preview never goes stale.
  if (previewTopicId && !findVisibleTopic(previewTopicId)) {
    previewTopicId = levels[0].topics[0] ? levels[0].topics[0].id : null;
  }
  if (!previewTopicId && levels[0] && levels[0].topics[0]) {
    previewTopicId = levels[0].topics[0].id;
  }
  // An expanded topic hidden by the filter collapses automatically.
  if (expandedTopicId && !findVisibleTopic(expandedTopicId)) expandedTopicId = null;

  tree.innerHTML = levels
    .map((level) =>
      '<section class="roadmap-level">' +
        renderLevelHead(level) +
        '<div class="roadmap-topics">' +
          (level.topics || []).map((t) => renderTopicRow(level, t, t.id === expandedTopicId)).join("") +
        "</div>" +
      "</section>"
    )
    .join("");
}

function findVisibleTopic(topicId) {
  return visibleLevels().some((l) => (l.topics || []).some((t) => t.id === topicId));
}

function renderPreview() {
  const wrap = document.getElementById("topicPreview");
  if (!wrap) return;
  const found = previewTopicId ? findTopic(previewTopicId) : null;
  if (!found) {
    wrap.innerHTML =
      '<div class="topic-preview-card">' +
        '<p class="topic-preview-empty">Select a topic to preview it.</p>' +
      "</div>";
    return;
  }
  const { level, topic } = found;
  wrap.innerHTML =
    '<div class="topic-preview-card">' +
      '<p class="topic-preview-eyebrow">Topic Preview</p>' +
      '<h3 class="topic-preview-name">' + escapeHtml(topic.title) + "</h3>" +
      '<ul class="topic-preview-meta">' +
        '<li><span class="topic-preview-ico">' + ICON.clock + "</span><div><b>Estimated Time</b><span>" + formatEstimate(topic) + "</span></div></li>" +
        '<li><span class="topic-preview-ico">' + ICON.gauge + "</span><div><b>Difficulty</b><span>" + escapeHtml(level.track) + "</span></div></li>" +
        '<li><span class="topic-preview-ico">' + ICON.layers + "</span><div><b>Subtopics</b><span>" + (topic.subtopics || []).length + ((topic.subtopics || []).length === 1 ? " lesson" : " lessons") + "</span></div></li>" +
      "</ul>" +
      '<button class="btn btn-primary btn-block topic-preview-start" data-start-topic="' + escapeHtml(topic.id) + '" type="button">' +
        ICON.play + "Start Learning" +
      "</button>" +
    "</div>";
}

export function renderRoadmap() {
  renderOverall();
  renderFilters();
  renderTree();
  renderPreview();
}

/* ---------- interactions ---------- */
function bindEvents() {
  const filters = document.getElementById("roadmapFilters");
  if (filters) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".roadmap-filter");
      if (!btn) return;
      activeTrack = btn.getAttribute("data-track");
      expandedTopicId = null;
      renderRoadmap();
    });
  }

  const tree = document.getElementById("roadmapTree");
  if (tree) {
    tree.addEventListener("click", (e) => {
      const head = e.target.closest(".roadmap-topic-head");
      if (!head) return;
      const id = head.closest(".roadmap-topic").getAttribute("data-topic");
      // Only ONE main topic expanded at a time.
      expandedTopicId = expandedTopicId === id ? null : id;
      previewTopicId = id;
      renderTree();
      renderPreview();
    });
  }

  const preview = document.getElementById("topicPreview");
  if (preview) {
    preview.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-start-topic]");
      if (!btn) return;
      window.dispatchEvent(new CustomEvent("learnjs:open-topic", {
        detail: { topicId: btn.getAttribute("data-start-topic") }
      }));
    });
  }
}

/* ---------- boot ---------- */
export async function initRoadmap() {
  data = await loadRoadmap();
  // Restore the previously previewed topic, if any.
  if (data.levels.length && !previewTopicId) {
    previewTopicId = data.levels[0].topics[0] ? data.levels[0].topics[0].id : null;
  }
  bindEvents();
  // Keep the roadmap in sync when lessons are completed on the Learning page.
  subscribe(renderRoadmap);
  renderRoadmap();
}
// end of roadmap.js
