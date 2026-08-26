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
     - recursive expand/collapse tree — levels, topics and subtopics
       each toggle independently (any depth)
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
let expandedNodes = new Set(); // ids of expanded nodes (levels, topics, ...) — each toggles independently


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

  const ring = document.getElementById("roadmapOverallRing");
  const pctEl = document.getElementById("roadmapOverallPct");
  const sub = document.getElementById("roadmapOverallSub");
  /* pathLength="100" on the SVG circle → dash units are percentages,
     so the offset is simply 100 − overall% (same pct as before). */
  if (ring) ring.style.strokeDashoffset = String(100 - pct);
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

/** Arrays that may hold child nodes at any depth of the curriculum
    (level → topic → subtopic → sub-subtopic → …). */
function childItems(item) {
  if (!item || typeof item !== "object") return [];
  if (Array.isArray(item.topics) && item.topics.length) return item.topics;
  if (Array.isArray(item.subtopics) && item.subtopics.length) return item.subtopics;
  if (Array.isArray(item.children) && item.children.length) return item.children;
  return [];
}

/** Display label for a node — plain strings render as-is; objects use their
    title/name so nested curriculum nodes display correctly. */
function nodeTitle(item) {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") return item.title || item.name || "";
  return item == null ? "" : String(item);
}

/** Recursive node builder. topicId/index are only meaningful for the lesson
    rows directly under a topic (they drive progress lookups); any deeper
    row carries index -1 and is display-only. */
function buildNode(item, id, topicId, index) {
  const children = childItems(item);
  return {
    type: "subtopic",
    id: id,
    raw: item,
    topicId: topicId || null,
    index: typeof index === "number" ? index : -1,
    hasChildren: children.length > 0,
    children: children.map((c, i) => buildNode(c, id + ":" + i, topicId, -1))
  };
}

/** Build a generic node tree from the roadmap data so EVERY level of the
    hierarchy (level → topic → subtopic → …) can expand/collapse
    independently — nothing here is hard-coded to a specific depth. */
function buildTree(levels) {
  return (levels || []).map((level) => {
    const topics = childItems(level);
    return {
      type: "level",
      id: level.id,
      raw: level,
      hasChildren: topics.length > 0,
      children: topics.map((topic) => {
        const subs = childItems(topic);
        return {
          type: "topic",
          id: topic.id,
          raw: topic,
          topicId: topic.id,
          index: -1,
          hasChildren: subs.length > 0,
          children: subs.map((s, i) => buildNode(s, topic.id + ":" + i, topic.id, i))
        };
      })
    };
  });
}

function collectNodeIds(nodes, out) {
  nodes.forEach((n) => {
    out.add(n.id);
    collectNodeIds(n.children, out);
  });
  return out;
}

function renderLevelHead(level, open, hasChildren) {
  const topicCount = (level.topics || []).length;
  const lessons = (level.topics || []).reduce((n, t) => n + (t.subtopics || []).length, 0);
  const done = (level.topics || []).reduce((n, t) => n + topicDoneCount(t.id), 0);
  const pct = lessons ? Math.round((done / lessons) * 100) : 0;

  return (
    '<button class="roadmap-level-head" type="button" aria-expanded="' + (open ? "true" : "false") + '">' +
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
      (hasChildren ? '<span class="roadmap-level-arrow">' + ICON.chevron + "</span>" : "") +
    "</button>"
  );
}

function renderLevelNode(node, open) {
  return (
    '<section class="roadmap-level' + (open ? " open" : "") + '" data-node="' + escapeHtml(node.id) +
      '" data-node-type="level" data-has-children="' + (node.hasChildren ? "1" : "0") + '">' +
      renderLevelHead(node.raw, open, node.hasChildren) +
      '<div class="roadmap-level-body"><div class="roadmap-level-inner">' +
        '<div class="roadmap-topics">' + node.children.map(renderNode).join("") + "</div>" +
      "</div></div>" +
    "</section>"
  );
}

function renderTopicNode(node, open) {
  const topic = node.raw;
  const pct = topicProgress(topic);
  const done = pct === 100;
  // Topics are navigation links, not expandable accordions.
  // Clicking a topic opens the learning page for that topic's first lesson.
  return (
    '<div class="roadmap-topic"' +
      ' data-node="' + escapeHtml(topic.id) + '" data-node-type="topic"' +
      ' data-topic="' + escapeHtml(topic.id) + '" data-index="0"' +
      ' data-has-children="0">' +
      '<button class="roadmap-topic-head" type="button"' +
        ' data-topic="' + escapeHtml(topic.id) + '" data-index="0">' +
        '<span class="roadmap-topic-num">' + escapeHtml(topic.id) + "</span>" +
        '<span class="roadmap-topic-name">' + escapeHtml(topic.title) + "</span>" +
        '<span class="roadmap-topic-progress' + (done ? " done" : "") + '">' +
          (done ? ICON.check : "") + pct + "%" +
        "</span>" +
      "</button>" +
    "</div>"
  );
}

function renderSubtopicNode(node, open) {
  const done = node.index >= 0 ? isLessonDone(node.topicId, node.index) : false;
  const head =
    '<span class="roadmap-subtopic-ico">' + (done ? ICON.check : ICON.circle) + "</span>" +
    "<span>" + escapeHtml(nodeTitle(node.raw)) + "</span>";
  // Leaf subtopic (no children) — plain row, exactly like before.
  if (!node.hasChildren) {
    // Real lessons (rows that map to topic.subtopics[i]) carry the owning
    // topic + lesson index so a click can open the exact same lesson page
    // as the topic preview's "Start Learning" button.
    const lessonAttrs =
      node.index >= 0 && node.topicId
        ? ' data-topic="' + escapeHtml(node.topicId) + '" data-index="' + node.index + '"'
        : "";
    return (
      '<li class="roadmap-subtopic"' + (done ? ' data-done="1"' : "") +
        ' data-node="' + escapeHtml(node.id) + '" data-node-type="subtopic" data-has-children="0"' +
        lessonAttrs + ">" +
        head +
      "</li>"
    );
  }
  // Deeper nesting — a subtopic with children gets its own toggle.
  return (
    '<li class="roadmap-subtopic' + (open ? " open" : "") +
      '" data-node="' + escapeHtml(node.id) + '" data-node-type="subtopic" data-has-children="1">' +
      '<button class="roadmap-subtopic-head" type="button" aria-expanded="' + (open ? "true" : "false") + '">' +
        head + '<span class="roadmap-subtopic-arrow">' + ICON.chevron + "</span>" +
      "</button>" +
      '<ul class="roadmap-subtopics">' + node.children.map(renderNode).join("") + "</ul>" +
    "</li>"
  );
}

/** Recursive node renderer — every level of the hierarchy shares the same
    expand/collapse toggle; only the row markup differs per node type. */
function renderNode(node) {
  const open = expandedNodes.has(node.id);
  if (node.type === "level") return renderLevelNode(node, open);
  if (node.type === "topic") return renderTopicNode(node, open);
  return renderSubtopicNode(node, open);
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

  const nodes = buildTree(levels);
  // Everything starts COLLAPSED — only the top-level (main topic) rows are
  // visible on first paint. No node is ever auto-expanded; each one opens
  // only when the user clicks it, and expandedNodes starts empty.
  // Expanded nodes hidden by the active filter collapse automatically.
  const visibleIds = collectNodeIds(nodes, new Set());
  expandedNodes.forEach((id) => {
    if (!visibleIds.has(id)) expandedNodes.delete(id);
  });

  tree.innerHTML = nodes.map(renderNode).join("");
}



export function renderRoadmap() {
  renderOverall();
  renderFilters();
  renderTree();
}

/* ---------- interactions ---------- */
function bindEvents() {
  const filters = document.getElementById("roadmapFilters");
  if (filters) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".roadmap-filter");
      if (!btn) return;
      activeTrack = btn.getAttribute("data-track");
      expandedNodes.clear();
      renderRoadmap();
    });
  }

  const tree = document.getElementById("roadmapTree");
  if (tree) {
    tree.addEventListener("click", (e) => {
      // The ENTIRE node row is the toggle target — the arrow, the label,
      // the progress, or any empty space inside the row all behave the same.
      const row = e.target.closest("[data-node]");
      if (!row) return;
      const id = row.getAttribute("data-node");
      const type = row.getAttribute("data-node-type");
      const hasChildren = row.getAttribute("data-has-children") === "1";

      // Topics are now navigation links — clicking a topic immediately
      // opens the learning page for that topic's first lesson.
      // Subtopics (leaf lessons) also navigate directly.
      if ((type === "topic" || type === "subtopic") && row.hasAttribute("data-topic")) {
        window.dispatchEvent(new CustomEvent("learnjs:open-topic", {
          detail: {
            topicId: row.getAttribute("data-topic"),
            lessonIndex: Number(row.getAttribute("data-index")) || 0
          }
        }));
        return;
      }

      // Level expand/collapse toggles happen IN PLACE (class flip only,
      // like the course sidebar). expandedNodes stays in sync so later
      // full renders (progress updates, filter changes) rebuild with
      // exactly the same open/closed state.
      // Levels use a single-open accordion: opening one level closes all others.
      let changed = false;
      if (hasChildren) {
        changed = true;
        const open = !expandedNodes.has(id);

        // Single-open accordion for levels: close all other levels when opening
        if (open && type === "level") {
          const toClose = [...expandedNodes].filter((nid) => nid !== id);
          toClose.forEach((nodeId) => {
            const otherRow = tree.querySelector(`[data-node="${nodeId}"][data-node-type="level"]`);
            if (otherRow) {
              otherRow.classList.remove("open");
              const otherHead = otherRow.querySelector("[aria-expanded]");
              if (otherHead) otherHead.setAttribute("aria-expanded", "false");
            }
            expandedNodes.delete(nodeId);
          });
        }

        if (open) expandedNodes.add(id);
        else expandedNodes.delete(id);
        row.classList.toggle("open", open);
        const head = row.querySelector("[aria-expanded]");
        if (head) head.setAttribute("aria-expanded", String(open));
      }

    });
  }
}

/* ---------- boot ---------- */
export async function initRoadmap() {
  data = await loadRoadmap();
  bindEvents();
  // Keep the roadmap in sync when lessons are completed on the Learning page.
  subscribe(renderRoadmap);
  renderRoadmap();
}
// end of roadmap.js
