/* ============================================================
   LearnJS — learning.js (js/roadmap)
   Learning panel renderer — the dedicated page opened by
   "Start Learning" (never a popup):
     - breadcrumb navigation (Home / Roadmap / Level / Topic)
     - topic title + lesson progress
     - Previous / Next lesson navigation (flows across topics)
     - Mark Complete (persisted per lesson via roadmap-progress)
     - right-side "On this page" navigation
     - Personal Notes (persisted per topic)

   Authored lessons: when the current lesson number has an entry in
   data/lesson-content.js (LESSON_CONTENT), its rich teaching content
   is rendered here through a generic renderer. Lessons without an
   entry keep the professional placeholder until they are written —
   adding a new lesson never requires touching this file.
   ============================================================ */

import { loadRoadmap } from "./roadmap-loader.js";
import { LESSON_CONTENT } from "../../data/lesson-content.js";
import { prefetchTopic, getLessonByNumber, isJsonLesson } from "./lesson-file-loader.js";
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

/* ---------- professional JS syntax highlighter ----------
   Tokenises JavaScript source into coloured <span> wrappers.
   Runs entirely in the browser — zero dependencies.
   Token categories: comment, string, number, keyword, builtin,
   fn (function call / method), prop (property access),
   op (operator), punct (punctuation), plain.

   Context-aware: . after an identifier marks the NEXT identifier
   as a property access.  An identifier followed by ( is a call.
   Built-in objects keep their own colour even when called. */
const JS_KEYWORDS = new Set([
  "const","let","var","function","return","if","else","for","while",
  "do","switch","case","break","continue","new","this","class",
  "extends","super","import","export","from","default","async",
  "await","try","catch","finally","throw","typeof","instanceof",
  "in","of","delete","void","yield","static","get","set",
  "null","undefined","true","false"
]);
const JS_BUILTINS = new Set([
  "console","document","window","Math","JSON","Array","Object",
  "String","Number","Boolean","Promise","Map","Set","Date",
  "RegExp","Error","Symbol","parseInt","parseFloat","isNaN",
  "setTimeout","setInterval","clearTimeout","clearInterval",
  "fetch","alert","prompt","confirm","URL","URLSearchParams",
  "localStorage","sessionStorage","navigator","history",
  "requestAnimationFrame","cancelAnimationFrame","queueMicrotask",
  "WeakMap","WeakSet","Proxy","Reflect","Intl"
]);
const JS_OPERATORS = new Set([
  "+","-","*","/","%","=","==","===","!=","!==",
  ">","<",">=","<=","&&","||","!","&","|","^","~",
  "<<",">>",">>>","++","--","+=","-=","*=","/=","%=",
  "?.","??","..."
]);
const JS_PUNCT = new Set([
  "(",")","{","}","[","]",";",":",",","."
]);

function highlightJS(code) {
  const tokens = [];
  let i = 0;
  const len = code.length;
  while (i < len) {
    /* --- Single-line comment --- */
    if (code[i] === "/" && code[i + 1] === "/") {
      const end = code.indexOf("\n", i);
      const finish = end === -1 ? len : end;
      tokens.push({ text: code.slice(i, finish), type: "comment" });
      i = finish;
    /* --- Multi-line comment --- */
    } else if (code[i] === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      const finish = end === -1 ? len : end + 2;
      tokens.push({ text: code.slice(i, finish), type: "comment" });
      i = finish;
    /* --- Strings (double, single, template) --- */
    } else if (code[i] === '"' || code[i] === "'" || code[i] === "`") {
      const q = code[i];
      let j = i + 1;
      while (j < len && code[j] !== q) {
        if (code[j] === "\\") j++;
        j++;
      }
      tokens.push({ text: code.slice(i, j + 1), type: "string" });
      i = j + 1;
    /* --- Numbers --- */
    } else if (/\d/.test(code[i]) && (i === 0 || /[\s(,=:+\-*/<>!&|^~%\[{;?]/.test(code[i - 1]))) {
      let j = i;
      while (j < len && /[\d.xXa-fA-FeEn_]/.test(code[j])) j++;
      tokens.push({ text: code.slice(i, j), type: "number" });
      i = j;
    /* --- Identifiers / keywords / builtins --- */
    } else if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i;
      while (j < len && /[a-zA-Z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      // Look ahead: skip whitespace then check for (
      let k = j;
      while (k < len && code[k] === " ") k++;
      const isCall = code[k] === "(";
      // Look behind: is previous meaningful char a dot?
      const prevChar = i > 0 ? code[i - 1] : "";
      const isAfterDot = prevChar === ".";
      if (JS_KEYWORDS.has(word)) {
        tokens.push({ text: word, type: "keyword" });
      } else if (JS_BUILTINS.has(word)) {
        tokens.push({ text: word, type: "builtin" });
      } else if (isAfterDot) {
        tokens.push({ text: word, type: isCall ? "fn" : "prop" });
      } else if (isCall) {
        tokens.push({ text: word, type: "fn" });
      } else {
        tokens.push({ text: word, type: "plain" });
      }
      i = j;
    /* --- Multi-char operators (===, !==, =>, >=, <=, &&, ||, etc.) --- */
    } else if (/[+\-*/%=!<>&|^~?]/.test(code[i])) {
      // Try 3-char, then 2-char operators
      const three = code.slice(i, i + 3);
      const two = code.slice(i, i + 2);
      if (JS_OPERATORS.has(three)) {
        tokens.push({ text: three, type: "op" });
        i += 3;
      } else if (JS_OPERATORS.has(two)) {
        tokens.push({ text: two, type: "op" });
        i += 2;
      } else if (JS_OPERATORS.has(code[i])) {
        tokens.push({ text: code[i], type: "op" });
        i++;
      } else {
        tokens.push({ text: code[i], type: "plain" });
        i++;
      }
    /* --- Punctuation --- */
    } else if (JS_PUNCT.has(code[i])) {
      tokens.push({ text: code[i], type: "punct" });
      i++;
    /* --- Everything else --- */
    } else {
      tokens.push({ text: code[i], type: "plain" });
      i++;
    }
  }
  // Render tokens to HTML — only wrap non-plain tokens
  return tokens.map((t) => {
    const safe = escapeHtml(t.text);
    if (t.type === "plain") return safe;
    return '<span class="tk-' + t.type + '">' + safe + "</span>";
  }).join("");
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
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 17 6-6-6-6"/><path d="M12 19h8"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>'
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

/* ---------- authored lesson content (data/lesson-content.js) ---------- */
const LEAD_NUM_RE = /^(\d+(?:\.\d+)*)\s+/;

/** Strip the leading "1.1.1 " style number prefix from a curriculum title. */
function stripNumber(text) {
  return String(text || "").replace(LEAD_NUM_RE, "");
}

/**
 * Authored content for the current lesson, matched by the number that
 * prefixes its subtopic title ("1.1.1 What JavaScript…" → key "1.1.1").
 * Returns null for lessons without an entry (they keep the placeholder).
 *
 * For topics 1.3+, content is loaded from JSON files in
 * data/lessons/{topicId}.json. The JSON cache is checked first;
 * if not found there, falls back to the static LESSON_CONTENT map
 * (which holds 1.1 and 1.2 lessons).
 */
function authoredLessonFor(topic, lessonIndex) {
  const raw = (topic.subtopics || [])[lessonIndex] || "";
  const match = String(raw).match(LEAD_NUM_RE);
  if (!match) return null;
  const lessonNumber = match[1];

  // Check JSON file cache first (topics 1.3+)
  if (isJsonLesson(lessonNumber)) {
    const jsonLesson = getLessonByNumber(lessonNumber);
    if (jsonLesson) return jsonLesson;
  }

  // Fall back to static LESSON_CONTENT (topics 1.1, 1.2)
  return LESSON_CONTENT[lessonNumber] || null;
}

/* ---------- rendering ---------- */
function renderBreadcrumb(level, topic, authored) {
  const wrap = document.getElementById("learnBreadcrumb");
  if (!wrap) return;
  const sep = '<span class="learn-crumb-sep">' + ICON.chevronRight + "</span>";
  wrap.innerHTML =
    '<button class="learn-crumb" data-crumb="home" type="button">Home</button>' +
    sep +
    '<button class="learn-crumb" data-crumb="roadmap" type="button">Roadmap</button>' +
    sep +
    '<button class="learn-crumb" data-crumb="level" type="button">Level</button>';
}

function renderLessonHeader(topic, lessonIndex) {
  const done = isLessonDone(topic.id, lessonIndex);
  const btn = document.getElementById("learnCompleteBtn");
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

/* ---------- authored lesson renderer (generic — driven by LESSON_CONTENT) ---------- */
function renderSection(sec) {
  let body = "";
  (sec.paragraphs || []).forEach((p) => { body += "<p>" + p + "</p>"; });
  if (sec.list && sec.list.length) {
    body +=
      '<ul class="lesson-list">' +
        sec.list.map((li) => "<li><span>" + li + "</span></li>").join("") +
      "</ul>";
  }
  return '<section class="lesson-section"><h2>' + escapeHtml(sec.heading) + "</h2>" + body + "</section>";
}

function renderCodeExample(ex) {
  const filename = escapeHtml(ex.file || "script.js");
  const lang = escapeHtml(ex.language || "JavaScript");
  const rawCode = ex.code || "";
  const highlighted = highlightJS(rawCode);
  const lines = rawCode.split("\n");
  const lineCount = lines.length;
  const lineNums = Array.from({ length: lineCount }, (_, i) =>
    '<span class="line-num">' + (i + 1) + "</span>"
  ).join("");

  let body =
    '<div class="code-block">' +
      '<div class="code-head">' +
        '<div class="code-head-left">' +
          '<span class="code-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
          '<span class="code-filename">' + filename + "</span>" +
        "</div>" +
        '<div class="code-head-right">' +
          '<span class="code-lang">' + lang + "</span>" +
          '<button class="code-copy-btn" type="button" data-code="' +
            escapeHtml(rawCode).replace(/"/g, "&quot;") +
          '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span></button>' +
        "</div>" +
      "</div>" +
      '<div class="code-body">' +
        '<div class="code-line-nums" aria-hidden="true">' + lineNums + "</div>" +
        '<pre class="code-pre"><code>' + highlighted + "</code></pre>" +
      "</div>" +
    "</div>";

  if (ex.output) {
    body +=
      '<div class="code-output">' +
        '<div class="code-output-head">' +
          ICON.terminal +
          "<span>Output</span>" +
          '<button class="code-copy-btn code-copy-output" type="button" data-code="' +
            escapeHtml(ex.output).replace(/"/g, "&quot;") +
          '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span></button>' +
        "</div>" +
        "<pre>" + escapeHtml(ex.output) + "</pre>" +
      "</div>";
  }
  if (ex.explanation && ex.explanation.length) {
    body +=
      '<p class="code-explain-label">How it works</p>' +
      '<ul class="lesson-list code-explain">' +
        ex.explanation.map((x) => "<li><span>" + x + "</span></li>").join("") +
      "</ul>";
  }
  return '<section class="lesson-section"><h2>' + escapeHtml(ex.heading || "Code example") + "</h2>" + body + "</section>";
}

function renderVisualExplanation(visual) {
  if (!visual || !visual.items || !visual.items.length) return "";
  return (
    '<section class="lesson-section"><h2>' + escapeHtml(visual.heading) + "</h2>" +
      '<div class="lesson-visual">' +
        visual.items.map((item, i) =>
          '<div class="lv-row">' +
            '<span class="lv-lang">' + escapeHtml(item.lang) + "</span>" +
            '<div class="lv-body"><b>' + escapeHtml(item.result) + "</b>" +
              (item.note ? "<span>" + item.note + "</span>" : "") +
            "</div>" +
          "</div>" +
          (i < visual.items.length - 1 ? '<div class="lv-arrow">' + ICON.chevronDown + "</div>" : "")
        ).join("") +
      "</div>" +
    "</section>"
  );
}

function renderTakeaways(items) {
  return (
    '<section class="lesson-section"><h2>Key takeaways</h2>' +
      '<ul class="takeaways">' +
        items.map((t) =>
          '<li><span class="tk-ico">' + ICON.check + "</span><span>" + t + "</span></li>"
        ).join("") +
      "</ul>" +
    "</section>"
  );
}

function renderPractice(practice) {
  let body = "";
  if (practice.tasks && practice.tasks.length) {
    // Multi-task form: numbered tasks with optional expected output.
    if (practice.intro) body += '<p class="lp-task">' + practice.intro + "</p>";
    body +=
      '<div class="lp-hints">' +
        practice.tasks.map((t, i) =>
          "<span><b>" + (i + 1) + ".</b> " + t.text +
            (t.expected ? ' <i>Expected: ' + t.expected + "</i>" : "") +
          "</span>"
        ).join("") +
      "</div>";
  } else {
    body += '<p class="lp-task">' + practice.task + "</p>";
    if (practice.hints && practice.hints.length) {
      body +=
        '<div class="lp-hints">' +
          practice.hints.map((hint, i) =>
            "<span><b>" + (i + 1) + ".</b> " + hint + "</span>"
          ).join("") +
        "</div>";
    }
  }
  if (practice.note) body += '<p class="lp-note">' + practice.note + "</p>";
  return (
    '<section class="lesson-section"><h2>Practice</h2>' +
      '<div class="lesson-practice-card">' +
        '<div class="lp-head">' + ICON.pencil + "Your turn</div>" +
        body +
      "</div>" +
    "</section>"
  );
}

/** Render an authored lesson into the lesson body area. */
function renderLessonContent(content) {
  const wrap = document.getElementById("learnPlaceholder");
  if (!wrap) return;
  wrap.innerHTML =
    '<article class="lesson-content">' +
      '<p class="lesson-lead">' + content.description + "</p>" +
      (content.sections || []).map(renderSection).join("") +
      (content.codeExamples || []).map(renderCodeExample).join("") +
      (content.sectionsAfterCode || []).map(renderSection).join("") +
      renderVisualExplanation(content.visualExplanation) +
      (content.keyTakeaways && content.keyTakeaways.length
        ? renderTakeaways(content.keyTakeaways)
        : "") +
      (content.practice ? renderPractice(content.practice) : "") +
    "</article>";
}

function renderNav(flat, index) {
  const prevBtn = document.getElementById("learnPrevBtn");
  const nextBtn = document.getElementById("learnNextBtn");
  const completeBtn = document.getElementById("learnCompleteBtn");
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
  // Hide the complete button when there's no valid lesson context
  if (completeBtn) {
    const hasLesson = index !== -1 && index >= 0;
    completeBtn.style.display = hasLesson ? "" : "none";
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
  const authored = authoredLessonFor(topic, lessonIndex);

  const title = document.getElementById("learnTitle");
  if (title) title.textContent = topic.title;
  const eyebrow = document.getElementById("learnEyebrow");
  if (eyebrow) eyebrow.textContent = "Level " + level.level + " \u00b7 " + level.track;

  renderBreadcrumb(level, topic, authored);
  renderLessonHeader(topic, lessonIndex);
  renderLessonBody(topic, lessonIndex);
  if (authored) renderLessonContent(authored);
  else renderPlaceholder(topic);

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
  // Prefetch JSON lesson file if navigating to a new topic.
  if (next.topic.id !== resolved.topic.id) {
    prefetchTopic(next.topic.id).then(() => renderLearning());
  }
  renderLearning();
  // Always scroll to the top of the learning panel after navigation
  const panel = document.getElementById("panel-learning");
  if (panel) panel.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function openLesson(topicId, lessonIndex) {
  // Find the level that owns this topic.
  const level = (data.levels || []).find((l) => (l.topics || []).some((t) => t.id === topicId));
  if (!level) return;
  current = { levelId: level.id, topicId, lessonIndex: lessonIndex || 0 };
  // Prefetch JSON lesson file for this topic (non-blocking).
  prefetchTopic(topicId).then(() => renderLearning());
  renderLearning();
  // Scroll to top when opening a new lesson from the sidebar/TOC
  window.scrollTo({ top: 0, behavior: "instant" });
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
      else if (dest === "level") {
        const resolved = resolveCurrent();
        if (resolved.level) {
          window.dispatchEvent(new CustomEvent("learnjs:goto-level", {
            detail: { levelId: resolved.level.id }
          }));
        }
      }
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
    /* Copy button inside code blocks */
    const copyBtn = e.target.closest(".code-copy-btn");
    if (copyBtn) {
      const codeText = copyBtn.getAttribute("data-code") || "";
      const label = copyBtn.querySelector("span");
      const prevHTML = copyBtn.innerHTML;
      navigator.clipboard.writeText(codeText).then(() => {
        copyBtn.classList.add("copied");
        if (label) label.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          copyBtn.innerHTML = prevHTML;
        }, 2000);
      }).catch(() => {});
      return;
    }
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
  // Prefetch JSON lesson file for the current topic (non-blocking).
  if (current.topicId) {
    prefetchTopic(current.topicId).then(() => renderLearning());
  }
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
