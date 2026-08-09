/* ============================================================
   LearnJS — interview.js (pages/interview)
   Interview Prep: gates the page behind the LearnJS auth system,
   then loads interview_questions.json (the single source of truth
   — questions are never hardcoded or duplicated) and renders a
   clean question bank: stats, search, difficulty + topic filters,
   a paginated list and toggleable model answers.

   Auth flow:
     - Signed out → inline Sign In / Sign Up gate. No questions
       are shown and the JSON is never fetched.
     - Signed in  → fetch the JSON and render the questions
       directly on this page — no intermediate screens, no
       redirects.
   Loaded as a module so it can import the Firebase modules.
   ============================================================ */

import { auth } from "../../js/firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/* ---------- constants ---------- */
const DATA_URL = "../../../interview_questions.json"; // repo-root JSON — from pages/interview/ that is three levels up
const PAGE_SIZE = 8;

/* ---------- state ---------- */
let allQuestions = [];   // full question list (loaded once, kept in memory)
let dataLoaded = false;  // JSON loaded successfully
let currentUser = null;
let state = { difficulty: "all", topic: "all", query: "", page: 1 };
let expanded = new Set(); // question ids with a visible answer

/* ---------- lucide-style icons (stroke-based, matches the site) ---------- */
const ICONS = {
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
};

/* ---------- tiny helpers ---------- */
function el(id) { return document.getElementById(id); }
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
  const list = el("iqList");
  if (list) list.innerHTML = "";
  const nav = el("iqPagination");
  if (nav) nav.innerHTML = "";
  const search = el("iqSearch");
  if (search) search.value = "";
  const topicSelect = el("iqTopic");
  if (topicSelect) {
    topicSelect.innerHTML = '<option value="all">All Topics</option>';
    topicSelect.value = "all";
  }
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
  expanded.clear();
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
    if (state.topic !== "all" && item.topic !== state.topic) return false;
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
  renderStats();
  renderTopicSelect();
  renderList();
  renderPagination();
}

function renderStats() {
  const counts = { easy: 0, medium: 0, hard: 0 };
  allQuestions.forEach((q) => {
    if (counts[q.difficulty] != null) counts[q.difficulty] += 1;
  });
  el("iqStatTotal").textContent = allQuestions.length;
  el("iqStatEasy").textContent = counts.easy;
  el("iqStatMedium").textContent = counts.medium;
  el("iqStatHard").textContent = counts.hard;
}

function renderTopicSelect() {
  const select = el("iqTopic");
  const map = {};
  allQuestions.forEach((q) => {
    if (q.topic) map[q.topic] = (map[q.topic] || 0) + 1;
  });
  const topics = Object.keys(map).sort((a, b) => a.localeCompare(b));
  const options =
    '<option value="all">All Topics (' + allQuestions.length + ")</option>" +
    topics
      .map((t) => '<option value="' + escapeAttr(t) + '">' + escapeHtml(t) + " (" + map[t] + ")</option>")
      .join("");
  select.innerHTML = options;
  select.value = state.topic;
}

function cardHtml(item, number) {
  const difficulty = ["easy", "medium", "hard"].indexOf(item.difficulty) !== -1 ? item.difficulty : "medium";
  const open = expanded.has(item.id);
  return (
    '<article class="iq-question">' +
      '<div class="iq-question-head">' +
        '<span class="iq-qnum">#' + number + "</span>" +
        '<span class="iq-diff ' + escapeAttr(difficulty) + '">' + escapeHtml(difficulty) + "</span>" +
        (item.topic ? '<span class="iq-topic">' + escapeHtml(item.topic) + "</span>" : "") +
      "</div>" +
      '<h3 class="iq-qtext">' + escapeHtml(item.question) + "</h3>" +
      '<div class="iq-actions">' +
        '<button class="btn btn-outline btn-sm iq-answer-toggle' + (open ? " open" : "") + '" ' +
          'data-answer-toggle="' + escapeAttr(item.id) + '" type="button" aria-expanded="' + (open ? "true" : "false") + '">' +
          ICONS.chevronDown +
          '<span class="iq-answer-btn-label">' + (open ? "Hide answer" : "Show answer") + "</span>" +
        "</button>" +
      "</div>" +
      '<div class="iq-answer" ' + (open ? "" : "hidden") + ">" +
        '<div class="iq-answer-label">' + ICONS.sparkles + "Model answer</div>" +
        "<p>" + escapeHtml(item.answer) + "</p>" +
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
   Event wiring (event delegation on the list + toolbar)
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

  const topic = el("iqTopic");
  if (topic) {
    topic.addEventListener("change", () => {
      state.topic = topic.value;
      state.page = 1;
      renderList();
      renderPagination();
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
      if (!dataLoaded) loadQuestions();
    } else {
      teardownSignedOut();
      showLoginRequired();
    }
  });
}

init();
// end of interview.js
