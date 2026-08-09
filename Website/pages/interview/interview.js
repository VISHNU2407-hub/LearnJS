/* ============================================================
   LearnJS — interview.js (pages/interview)
   Interview Prep: gates the page behind the LearnJS auth system,
   then loads interview_questions.json (the single source of truth
   — questions are never hardcoded or duplicated) and renders a
   focused practice flow:

     Hero → Topic Progress → Difficulty + search filters →
     Question list → Pagination.

   Topic Progress is per-user practice state persisted to Firestore
   at users/{uid}/interviewProgress/{questionId} ({practiced, topic,
   practicedAt}) — it is never hardcoded, restores on every sign-in,
   and the cards double as the topic selector. Marking a question as
   practiced only happens on an explicit action — showing an answer
   never auto-completes a question.

   Auth flow:
     - Signed out → inline Sign In / Sign Up gate. No questions
       are shown and the JSON is never fetched.
     - Signed in  → fetch the JSON, subscribe to the user's
       practice progress, and render the question bank.
   Loaded as a module so it can import the Firebase modules.
   ============================================================ */

import { auth } from "../../js/firebase/firebase.js";
import { db } from "../../js/firebase/firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ---------- constants ---------- */
const DATA_URL = "../../../interview_questions.json"; // repo-root JSON — from pages/interview/ that is three levels up
const PAGE_SIZE = 8;

/* ---------- state ---------- */
let allQuestions = [];   // full question list (loaded once, kept in memory)
let dataLoaded = false;  // JSON loaded successfully
let currentUser = null;
let state = { difficulty: "all", topic: "all", query: "", page: 1 };
let expanded = new Set();          // question ids with a visible answer
let practicedMap = {};             // questionId -> { practiced, topic, practicedAt }
let unsubPractice = null;          // Firestore practice-progress listener
let lastPracticeSignature = "";   // snapshot change-detection (avoid needless re-renders)

/* Topic groups — the question bank is organised into logical JavaScript
   learning areas in a sensible study order. Each group maps the existing
   `topic` field values from interview_questions.json (matched
   case-insensitively), so no question data is duplicated or invented. */
const TOPIC_GROUPS = [
  {
    id: "fundamentals",
    label: "Fundamentals",
    topics: ["variables", "data types", "operators", "type conversion", "conditions", "loops", "strings", "symbols", "basic es6", "nullish coalescing", "optional chaining", "error handling"]
  },
  {
    id: "functions",
    label: "Functions",
    topics: ["functions", "arrow functions", "scope", "closures", "call/apply/bind", "higher-order functions", "currying", "composition"]
  },
  {
    id: "arrays-objects",
    label: "Arrays & Objects",
    topics: ["array methods", "arrays", "objects", "destructuring", "spread/rest"]
  },
  {
    id: "dom",
    label: "DOM",
    topics: ["dom", "events", "advanced dom/event behavior"]
  },
  {
    id: "advanced",
    label: "Advanced JavaScript",
    topics: ["hoisting", "this", "prototypes", "prototype chain", "classes", "promises", "promise internals", "async/await", "async behavior", "event loop", "call stack", "execution context", "modules", "generators", "iterators", "weakmap", "weakset", "memory management", "garbage collection", "polyfills"]
  },
  {
    id: "browser-web",
    label: "Browser & Web",
    topics: ["fetch", "browser internals", "performance", "debouncing", "throttling"]
  }
];

/** Which topic group a question belongs to ("" when unmapped). */
function topicGroupId(topic) {
  if (!topic) return "";
  const t = String(topic).toLowerCase();
  for (const group of TOPIC_GROUPS) {
    if (group.topics.indexOf(t) !== -1) return group.id;
  }
  return "";
}

/* ---------- lucide-style icons (stroke-based, matches the site) ---------- */
const ICONS = {
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
  bookOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>',
  braces: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
  cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>'
};

/* Icon per topic group (and the overall "All Topics" card). */
const TOPIC_ICONS = {
  all: ICONS.layers,
  fundamentals: ICONS.bookOpen,
  functions: ICONS.code,
  "arrays-objects": ICONS.braces,
  dom: ICONS.monitor,
  advanced: ICONS.cpu,
  "browser-web": ICONS.globe
};

/* ---------- tiny helpers ---------- */
function el(id) { return document.getElementById(id); }
function toast(message, type) {
  if (window.LearnJS && window.LearnJS.toast) window.LearnJS.toast(message, type);
}
function isPracticed(questionId) { return !!practicedMap[String(questionId)]; }
/** Compact signature of the practiced set — used to skip redundant re-renders. */
function practiceSignature() {
  return Object.keys(practicedMap).sort().join(",");
}
function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}
/* Attribute-safe variant — escapeHtml leaves double quotes intact. */
function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function debounce(fn, wait) {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(null, arguments), wait);
  };
}

/* ============================================================
   Auth gate — question content must never appear, nor the JSON be
   fetched, until Firebase confirms a signed-in user.
   ============================================================ */
function showChecking() {
  const gate = el("iqAuthGate");
  const content = el("iqContent");
  if (gate) gate.hidden = false;
  if (content) content.hidden = true;
  const checking = el("iqChecking");
  const login = el("iqLoginRequired");
  if (checking) checking.hidden = false;
  if (login) login.hidden = true;
}

function showLoginRequired() {
  const gate = el("iqAuthGate");
  const content = el("iqContent");
  if (gate) gate.hidden = false;
  if (content) content.hidden = true;
  const checking = el("iqChecking");
  const login = el("iqLoginRequired");
  if (checking) checking.hidden = true;
  if (login) login.hidden = false;
}

function showContent() {
  const gate = el("iqAuthGate");
  const content = el("iqContent");
  if (gate) gate.hidden = true;
  if (content) content.hidden = false;
}

/* Hard-clear every question from the DOM and memory on sign-out. */
function teardownSignedOut() {
  if (unsubPractice) { unsubPractice(); unsubPractice = null; }
  practicedMap = {};
  lastPracticeSignature = "";
  expanded.clear();
  const list = el("iqList");
  if (list) list.innerHTML = "";
  const pagination = el("iqPagination");
  if (pagination) pagination.innerHTML = "";
  const search = el("iqSearch");
  if (search) search.value = "";
  const progress = el("iqTopicProgress");
  if (progress) progress.innerHTML = "";
  const label = el("iqSelectionLabel");
  if (label) label.textContent = "All Questions";
  document.querySelectorAll("[data-difficulty]").forEach((btn, index) => {
    const active = index === 0;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  const range = el("iqListRange");
  if (range) range.textContent = "Loading…";
  allQuestions = [];
  dataLoaded = false;
  state = { difficulty: "all", topic: "all", query: "", page: 1 };
}

/* ============================================================
   Practice progress (Firestore) — users/{uid}/interviewProgress/{questionId}
   Each doc: { practiced: true, topic: <raw question topic>, practicedAt }.
   Realtime via onSnapshot; per-user because it lives under their uid.
   ============================================================ */
function subscribePracticeProgress() {
  if (!currentUser) return;
  if (unsubPractice) { unsubPractice(); unsubPractice = null; }
  practicedMap = {};
  try {
    unsubPractice = onSnapshot(
      collection(db, "users", currentUser.uid, "interviewProgress"),
      (snap) => {
        const next = {};
        snap.docs.forEach((d) => { next[d.id] = d.data(); });
        // Keep optimistic entries whose Firestore write is still in flight so
        // a partially-synced snapshot never makes a just-practiced question
        // flash back to unpracticed (practice records are never deleted).
        Object.keys(practicedMap).forEach((id) => {
          if (next[id] == null) next[id] = practicedMap[id];
        });
        const signature = Object.keys(next).sort().join(",");
        const changed = signature !== lastPracticeSignature;
        lastPracticeSignature = signature;
        practicedMap = next;
        // Skip re-rendering when the practiced set did not actually change
        // (e.g. the snapshot that confirms our own optimistic write) — this
        // keeps scroll position and focus and avoids replaying card animations.
        if (dataLoaded && changed) {
          renderTopicProgress();
          renderList();
          renderPagination();
        }
      },
      (err) => console.warn("[LearnJS] Interview progress listener error:", err.message)
    );
  } catch (err) {
    console.warn("[LearnJS] Could not subscribe to interview progress:", err.message);
  }
}

/** Persist a practice record. The caller updates the UI optimistically. */
async function markPracticed(question) {
  if (!currentUser) return;
  const qid = String(question.id);
  try {
    await setDoc(doc(db, "users", currentUser.uid, "interviewProgress", qid), {
      practiced: true,
      topic: question.topic || "",
      practicedAt: serverTimestamp()
    });
    toast("Marked as practiced \u2713");
  } catch (err) {
    if (!currentUser) return; // signed out mid-write — nothing to restore visibly
    // Write failed — roll the optimistic state back.
    delete practicedMap[qid];
    lastPracticeSignature = practiceSignature();
    renderList();
    renderTopicProgress();
    toast("Could not save practice progress: " + err.message, "error");
  }
}

/* ============================================================
   Data loading (fetch once, keep in memory)
   ============================================================ */
async function loadQuestions() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    // The user signed out while this request was in flight — discard the
    // payload so nothing is stored or rendered outside an authenticated session.
    if (!currentUser) return;
    // The file is { questions: [...] } — accept a bare array too.
    allQuestions = Array.isArray(data) ? data : (data && data.questions) || [];
    if (!allQuestions.length) throw new Error("Question list is empty");
    dataLoaded = true;
    renderAll();
  } catch (err) {
    if (!currentUser) return; // signed out mid-flight — never touch the hidden list
    console.error("[LearnJS] Could not load interview questions:", err);
    showListError();
  }
}

function showListError() {
  el("iqList").innerHTML =
    '<div class="iq-state">' +
      '<span class="iq-state-ico">' + ICONS.alert + "</span>" +
      "<b>Unable to load interview questions.</b>" +
      "<span>Please try again.</span>" +
      '<button class="btn btn-primary btn-sm" id="iqRetry" type="button">Try Again</button>' +
    "</div>";
  const retry = el("iqRetry");
  if (retry) retry.addEventListener("click", loadQuestions);
}

/* ============================================================
   Filtering — difficulty, topic and search (question + answer +
   topic + type). Combined with AND semantics.
   ============================================================ */
function getFiltered() {
  const q = state.query.trim().toLowerCase();
  return allQuestions.filter((item) => {
    if (state.difficulty !== "all" && item.difficulty !== state.difficulty) return false;
    if (state.topic !== "all" && topicGroupId(item.topic) !== state.topic) return false;
    if (q) {
      const haystack = [item.question, item.answer, item.topic, item.type, item.difficulty]
        .join(" ")
        .toLowerCase();
      if (haystack.indexOf(q) === -1) return false;
    }
    return true;
  });
}

/* ============================================================
   Rendering
   ============================================================ */
function renderAll() {
  if (!dataLoaded) return;
  renderTopicProgress();
  renderSelectionLabel();
  renderList();
  renderPagination();
}

/* Topic progress cards — practiced/total + bar + % for every group (and the
   overall "All Topics" card). All numbers come from the real question data
   and the user's Firestore practice records — never hardcoded. The cards
   also act as the topic selector. */
function renderTopicProgress() {
  const wrap = el("iqTopicProgress");
  if (!wrap) return;
  const items = [{ id: "all", label: "All Topics" }, ...TOPIC_GROUPS.map((g) => ({ id: g.id, label: g.label }))];
  wrap.innerHTML = items
    .map((item) => {
      const pool = item.id === "all"
        ? allQuestions
        : allQuestions.filter((q) => topicGroupId(q.topic) === item.id);
      const total = pool.length;
      const done = pool.filter((q) => isPracticed(q.id)).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      const active = state.topic === item.id;
      return (
        '<button class="iq-topic-card' + (active ? " active" : "") + '" data-topic="' + item.id + '" type="button" aria-pressed="' + active + '">' +
          '<span class="iq-topic-card-head">' +
            '<span class="iq-topic-card-ico">' + (TOPIC_ICONS[item.id] || ICONS.layers) + "</span>" +
            '<span class="iq-topic-card-name">' + escapeHtml(item.label) + "</span>" +
          "</span>" +
          '<span class="iq-topic-card-meta">' + done + " / " + total + " practiced</span>" +
          '<span class="iq-topic-card-bar-row">' +
            '<span class="iq-topic-bar"><span class="iq-topic-bar-fill" style="width:' + pct + '%"></span></span>' +
            '<span class="iq-topic-card-pct">' + pct + "%</span>" +
          "</span>" +
        "</button>"
      );
    })
    .join("");
}

/* Compact selection label above the list ("All Questions" / topic name). */
function renderSelectionLabel() {
  const label = el("iqSelectionLabel");
  if (!label) return;
  const group = state.topic === "all" ? null : TOPIC_GROUPS.find((g) => g.id === state.topic);
  label.textContent = group ? group.label : "All Questions";
}

function cardHtml(item, number) {
  const difficulty = ["easy", "medium", "hard"].indexOf(item.difficulty) !== -1 ? item.difficulty : "medium";
  const open = expanded.has(item.id);
  const practiced = isPracticed(item.id);
  return (
    '<article class="iq-question' + (practiced ? " practiced" : "") + '">' +
      '<div class="iq-question-head">' +
        '<span class="iq-qnum">#' + number + "</span>" +
        '<span class="iq-diff ' + escapeAttr(difficulty) + '">' + escapeHtml(difficulty) + "</span>" +
        (item.topic ? '<span class="iq-topic">' + escapeHtml(item.topic) + "</span>" : "") +
      "</div>" +
      '<h3 class="iq-qtext">' + escapeHtml(item.question) + "</h3>" +
      '<div class="iq-actions">' +
        '<button class="iq-answer-toggle' + (open ? " open" : "") + '" ' +
          'data-answer-toggle="' + escapeAttr(item.id) + '" type="button" aria-expanded="' + (open ? "true" : "false") + '">' +
          ICONS.chevronDown +
          '<span class="iq-answer-btn-label">' + (open ? "Hide answer" : "Show answer") + "</span>" +
        "</button>" +
        (practiced ? '<span class="iq-practiced-badge">' + ICONS.check + "Practiced</span>" : "") +
      "</div>" +
      '<div class="iq-answer" ' + (open ? "" : "hidden") + ">" +
        '<div class="iq-answer-label">' + ICONS.sparkles + "Model answer</div>" +
        "<p>" + escapeHtml(item.answer) + "</p>" +
        '<div class="iq-answer-foot">' +
          (practiced
            ? '<span class="iq-practice-btn done"><span class="iq-practice-check">' + ICONS.check + "</span>Practiced</span>"
            : '<button class="iq-practice-btn" data-practice="' + escapeAttr(item.id) + '" type="button">Mark as practiced</button>') +
        "</div>" +
      "</div>" +
    "</article>"
  );
}

function renderList() {
  const list = el("iqList");
  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (state.page > totalPages) state.page = totalPages;

  const range = el("iqListRange");
  if (!filtered.length) {
    list.innerHTML =
      '<div class="iq-state">' +
        '<span class="iq-state-ico">' + ICONS.search + "</span>" +
        "<b>No questions found</b>" +
        "<span>Try a different search term or filter.</span>" +
        '<button class="btn btn-outline btn-sm" id="iqClearFilters" type="button">Clear filters</button>' +
      "</div>";
    if (range) range.textContent = "No questions match your filters";
    return;
  }

  const start = (state.page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  list.innerHTML = pageItems.map((item, i) => cardHtml(item, start + i + 1)).join("");

  if (range) {
    const filteredSuffix = filtered.length < allQuestions.length ? " (filtered from " + allQuestions.length + ")" : "";
    range.textContent =
      "Question " + (start + 1) + "–" + (start + pageItems.length) + " of " + filtered.length + filteredSuffix;
  }
}

/* Numbered pages with an ellipsis window around the current page. */
function pageWindow(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = Array.from(pages).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  sorted.forEach((p) => {
    if (p - prev > 1) out.push("gap");
    out.push(p);
    prev = p;
  });
  return out;
}

function renderPagination() {
  const nav = el("iqPagination");
  const totalPages = Math.max(1, Math.ceil(getFiltered().length / PAGE_SIZE));
  nav.innerHTML = "";

  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "iq-page";
  prev.innerHTML = ICONS.chevronLeft;
  prev.setAttribute("aria-label", "Previous page");
  if (state.page <= 1) prev.disabled = true;
  prev.addEventListener("click", () => goToPage(state.page - 1));
  nav.appendChild(prev);

  pageWindow(state.page, totalPages).forEach((p) => {
    if (p === "gap") {
      const gap = document.createElement("span");
      gap.className = "iq-page gap";
      gap.textContent = "…";
      nav.appendChild(gap);
      return;
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "iq-page" + (p === state.page ? " active" : "");
    btn.textContent = p;
    if (p === state.page) {
      btn.setAttribute("aria-current", "page");
    } else {
      btn.setAttribute("aria-label", "Go to page " + p);
      btn.addEventListener("click", () => goToPage(p));
    }
    nav.appendChild(btn);
  });

  const next = document.createElement("button");
  next.type = "button";
  next.className = "iq-page";
  next.innerHTML = ICONS.chevronRight;
  next.setAttribute("aria-label", "Next page");
  if (state.page >= totalPages) next.disabled = true;
  next.addEventListener("click", () => goToPage(state.page + 1));
  nav.appendChild(next);
}

function goToPage(page) {
  const totalPages = Math.max(1, Math.ceil(getFiltered().length / PAGE_SIZE));
  state.page = Math.min(Math.max(1, page), totalPages);
  renderList();
  renderPagination();
  const list = el("iqList");
  if (list) list.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ============================================================
   Event wiring (event delegation on the list + toolbar + progress)
   ============================================================ */
function initEvents() {
  const list = el("iqList");
  if (list) {
    list.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-answer-toggle]");
      if (toggle) {
        // Toggle the answer in place — the button keeps focus and the card
        // list is not rebuilt (no re-triggered stagger animations).
        const id = Number(toggle.getAttribute("data-answer-toggle"));
        const open = expanded.has(id);
        if (open) expanded.delete(id);
        else expanded.add(id);
        const card = toggle.closest(".iq-question");
        const answer = card && card.querySelector(".iq-answer");
        const label = toggle.querySelector(".iq-answer-btn-label");
        if (answer) answer.hidden = !expanded.has(id);
        toggle.classList.toggle("open", expanded.has(id));
        toggle.setAttribute("aria-expanded", String(expanded.has(id)));
        if (label) label.textContent = expanded.has(id) ? "Hide answer" : "Show answer";
        return;
      }
      const practice = event.target.closest("[data-practice]");
      if (practice) {
        const id = Number(practice.getAttribute("data-practice"));
        const question = allQuestions.find((q) => q.id === id);
        if (!question || isPracticed(question.id)) return;
        // Optimistic in-place update — the Firestore snapshot confirms it.
        practicedMap[String(id)] = { practiced: true, topic: question.topic || "", practicedAt: new Date() };
        lastPracticeSignature = practiceSignature();
        const card = practice.closest(".iq-question");
        if (card) {
          card.classList.add("practiced");
          const actions = card.querySelector(".iq-actions");
          if (actions) {
            const badge = document.createElement("span");
            badge.className = "iq-practiced-badge";
            badge.innerHTML = ICONS.check + "Practiced";
            actions.appendChild(badge);
          }
          const foot = card.querySelector(".iq-answer-foot");
          if (foot) {
            foot.innerHTML = '<span class="iq-practice-btn done"><span class="iq-practice-check">' + ICONS.check + "</span>Practiced</span>";
          }
        }
        renderTopicProgress();
        markPracticed(question);
        return;
      }
      const clear = event.target.closest("#iqClearFilters");
      if (clear) {
        state = { difficulty: "all", topic: "all", query: "", page: 1 };
        const search = el("iqSearch");
        if (search) search.value = "";
        document.querySelectorAll("[data-difficulty]").forEach((btn, index) => {
          btn.classList.toggle("active", index === 0);
          btn.setAttribute("aria-pressed", String(index === 0));
        });
        renderAll();
      }
    });
  }

  const search = el("iqSearch");
  if (search) {
    search.addEventListener(
      "input",
      debounce(() => {
        state.query = search.value;
        state.page = 1;
        renderList();
        renderPagination();
      }, 200)
    );
  }

  /* Topic progress cards double as the topic selector. Clicking the active
     topic again returns to "All". */
  const progressWrap = el("iqTopicProgress");
  if (progressWrap) {
    progressWrap.addEventListener("click", (event) => {
      const card = event.target.closest("[data-topic]");
      if (!card) return;
      const topic = card.getAttribute("data-topic");
      state.topic = state.topic === topic ? "all" : topic;
      state.page = 1;
      renderTopicProgress();
      renderSelectionLabel();
      renderList();
      renderPagination();
      const activeCard = progressWrap.querySelector(".iq-topic-card.active");
      if (activeCard) activeCard.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  }

  document.querySelectorAll("[data-difficulty]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.difficulty = btn.getAttribute("data-difficulty");
      state.page = 1;
      document.querySelectorAll("[data-difficulty]").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      renderList();
      renderPagination();
    });
  });
}

/* ============================================================
   Boot — wait for the auth state, then show gate or content.
   ============================================================ */
function init() {
  showChecking();
  initEvents();

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
      showContent();
      subscribePracticeProgress();
      if (!dataLoaded) loadQuestions();
    } else {
      teardownSignedOut();
      showLoginRequired();
    }
  });
}

init();
// end of interview.js
