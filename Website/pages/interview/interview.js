/* ============================================================
   LearnJS — interview.js (pages/interview)
   Interview Prep: loads interview_questions.json once via fetch,
   renders stats, difficulty/topic/search/bookmark filters and a
   paginated question list with show/hide answers.

   Progress model (user → interview progress → completed ids):
     - Signed out : localStorage  "learnjs-interview-progress"
                    { completed: [ids], bookmarked: [ids] }
     - Signed in  : Firestore     users/{uid}/interview/prep
                    { completed: [ids], bookmarked: [ids] }
                    plus a per-uid localStorage cache for instant
                    first paint and offline resilience.
     - Anonymous progress is merged into the user's Firestore doc
       once on first sign-in (then the anonymous copy is cleared).
   Loaded as a module so it can import the Firebase modules.
   ============================================================ */

import { auth } from "../../js/firebase/firebase.js";
import { db } from "../../js/firebase/firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ---------- constants ---------- */
const DATA_URL = "../../../interview_questions.json"; // repo-root JSON — from pages/interview/ that is three levels up
const LS_KEY = "learnjs-interview-progress";       // anonymous progress
const LS_PREFIX = "learnjs-interview-progress-";   // per-uid cache (prefix + uid)
const PAGE_SIZE = 5;
const INTERVIEW_DOC_ID = "prep";                   // users/{uid}/interview/{docId} (even path segments)

/* ---------- state ---------- */
let allQuestions = [];      // full question list (loaded once, kept in memory)
let filtered = [];          // current filter result
let dataLoaded = false;     // JSON loaded successfully
let currentUser = null;
let completed = new Set();  // question ids
let bookmarked = new Set(); // question ids
let difficulty = "all";
let topic = "all";
let query = "";
let bookmarksOnly = false;
let page = 1;
let docRef = null;          // Firestore ref for the signed-in user
let unsub = null;           // snapshot listener teardown
let migrated = false;       // anonymous → Firestore migration ran once

/* ---------- lucide-style icons (stroke-based, matches the site) ---------- */
const ICONS = {
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevronUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  circleCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
};

/* ---------- tiny helpers ---------- */
function el(id) { return document.getElementById(id); }
function toast(message, type) {
  if (window.LearnJS && window.LearnJS.toast) window.LearnJS.toast(message, type);
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
function capitalize(value) {
  const s = String(value || "");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function debounce(fn, wait) {
  let timer = null;
  return function () {
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(null, args), wait);
  };
}

/* ---------- localStorage helpers (storage may be unavailable) ---------- */
function readLocal(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      completed: Array.isArray(data.completed) ? data.completed : [],
      bookmarked: Array.isArray(data.bookmarked) ? data.bookmarked : []
    };
  } catch (err) {
    return null;
  }
}
function writeLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ completed: data.completed || [], bookmarked: data.bookmarked || [] }));
  } catch (err) { /* storage unavailable — ignore */ }
}
function clearLocal(key) {
  try { localStorage.removeItem(key); } catch (err) { /* ignore */ }
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
    renderTopicSelect();
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
   Auth gate — question content must never appear, nor the JSON
   be fetched, until Firebase confirms a signed-in user.
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
  const bookmarksBtn = el("iqBookmarksOnly");
  if (bookmarksBtn) bookmarksBtn.setAttribute("aria-pressed", "false");

  // Drop the loaded questions so nothing leaks into a signed-out session.
  allQuestions = [];
  filtered = [];
  dataLoaded = false;
  completed = new Set();
  bookmarked = new Set();
  difficulty = "all";
  topic = "all";
  query = "";
  bookmarksOnly = false;
  page = 1;
}

/* ============================================================
   Progress persistence — localStorage + Firestore per user
   ============================================================ */
function writeFirestore(data) {
  if (!docRef) return Promise.resolve(false);
  return setDoc(docRef, {
    completed: data.completed || [],
    bookmarked: data.bookmarked || [],
    updatedAt: serverTimestamp()
  }, { merge: true }).then(() => true).catch((err) => {
    console.error("[LearnJS] Interview progress write failed:", err);
    toast("Could not save progress — " + (err.message || "unknown error"), "error");
    return false;
  });
}

function persist() {
  const data = { completed: [...completed], bookmarked: [...bookmarked] };
  if (currentUser) {
    writeFirestore(data);
    writeLocal(LS_PREFIX + currentUser.uid, data);
  } else {
    writeLocal(LS_KEY, data);
  }
}

function applyProgress(completedIds, bookmarkedIds) {
  completed = new Set(Array.isArray(completedIds) ? completedIds : []);
  bookmarked = new Set(Array.isArray(bookmarkedIds) ? bookmarkedIds : []);
  renderAll();
}

function connectFirestore(user) {
  docRef = doc(db, "users", user.uid, "interview", INTERVIEW_DOC_ID);
  if (unsub) unsub();

  // Instant paint from the per-uid cache while Firestore catches up.
  const cached = readLocal(LS_PREFIX + user.uid);
  if (cached) applyProgress(cached.completed, cached.bookmarked);

  unsub = onSnapshot(docRef, (snap) => {
    const raw = snap.exists() ? snap.data() : null;
    if (raw) {
      applyProgress(raw.completed, raw.bookmarked);
    } else {
      // No server doc yet: merge the anonymous localStorage progress into
      // this account once, otherwise fall back to the uid cache.
      const anon = readLocal(LS_KEY);
      const uidCache = readLocal(LS_PREFIX + user.uid);
      const hasAnon = anon && (anon.completed.length || anon.bookmarked.length);
      const hasCache = uidCache && (uidCache.completed.length || uidCache.bookmarked.length);
      const merged = {
        completed: [...new Set([...(hasAnon ? anon.completed : []), ...(hasCache ? uidCache.completed : [])])],
        bookmarked: [...new Set([...(hasAnon ? anon.bookmarked : []), ...(hasCache ? uidCache.bookmarked : [])])]
      };
      applyProgress(merged.completed, merged.bookmarked);
      if (!migrated && (merged.completed.length || merged.bookmarked.length)) {
        migrated = true;
        // Only drop the anonymous copy once the migration actually landed —
        // a failed write must never destroy the user's existing progress.
        writeFirestore(merged).then((ok) => {
          if (ok && hasAnon) clearLocal(LS_KEY);
        });
      } else if (hasAnon) {
        // Nothing to migrate — the anonymous copy is safe to remove.
        clearLocal(LS_KEY);
      }
    }
    writeLocal(LS_PREFIX + user.uid, { completed: [...completed], bookmarked: [...bookmarked] });
  }, (err) => {
    console.warn("[LearnJS] Interview progress listener error:", err.message);
    // Offline / blocked Firestore — keep working from the local cache.
    const cached = readLocal(LS_PREFIX + user.uid);
    if (cached) applyProgress(cached.completed, cached.bookmarked);
  });
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;

  if (user) {
    // Signed in — reveal the question UI, then (only now) fetch the JSON.
    showContent();
    connectFirestore(user);
    if (!dataLoaded) loadQuestions();
  } else {
    // Signed out — clear every trace of question content and NEVER fetch the
    // JSON. Also runs immediately when the user logs out while on this page.
    if (unsub) { unsub(); unsub = null; }
    docRef = null;
    migrated = false;
    teardownSignedOut();
    showLoginRequired();
  }
});

/* ============================================================
   Toggles
   ============================================================ */
function toggleCompleted(id) {
  if (completed.has(id)) {
    completed.delete(id);
  } else {
    completed.add(id);
    toast("Question marked complete — nice work! \uD83C\uDF89");
  }
  persist();
  renderAll();
}

function toggleBookmark(id) {
  if (bookmarked.has(id)) bookmarked.delete(id);
  else bookmarked.add(id);
  persist();
  renderAll();
}

/* ============================================================
   Filtering + rendering
   ============================================================ */
function applyFilters() {
  const q = (query || "").trim().toLowerCase();
  filtered = allQuestions.filter((qs) => {
    if (difficulty !== "all" && (qs.difficulty || "").toLowerCase() !== difficulty) return false;
    if (topic !== "all" && (qs.topic || "").toLowerCase() !== topic.toLowerCase()) return false;
    if (bookmarksOnly && !bookmarked.has(qs.id)) return false;
    if (q) {
      const hay = ((qs.question || "") + " " + (qs.topic || "")).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (page > totalPages) page = totalPages;
  if (page < 1) page = 1;
}

function renderAll() {
  if (!dataLoaded) return;
  applyFilters();
  renderStats();
  renderListHead();
  renderList();
  renderPagination();
}

function validCount(ids) {
  const valid = new Set(allQuestions.map((qs) => qs.id));
  return [...ids].filter((id) => valid.has(id)).length;
}

function renderStats() {
  const total = allQuestions.length;
  const doneCount = validCount(completed);
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  el("iqStatTotal").textContent = String(total);
  el("iqStatCompleted").textContent = String(doneCount);
  el("iqStatPct").textContent = pct + "%";

  // Difficulty distribution — computed from the data, never hardcoded.
  const diffCount = { easy: 0, medium: 0, hard: 0 };
  allQuestions.forEach((qs) => {
    const d = (qs.difficulty || "").toLowerCase();
    if (d in diffCount) diffCount[d] += 1;
  });
  el("iqDiffEasy").textContent = String(diffCount.easy);
  el("iqDiffMedium").textContent = String(diffCount.medium);
  el("iqDiffHard").textContent = String(diffCount.hard);

  // List progress bar.
  el("iqListPct").textContent = pct + "% Completed";
  el("iqListBar").style.width = pct + "%";
}

function renderTopicSelect() {
  const select = el("iqTopic");
  if (!select) return;
  const map = new Map(); // lowercased topic → { name, count }
  allQuestions.forEach((qs) => {
    const name = (qs.topic || "").trim();
    if (!name) return;
    const key = name.toLowerCase();
    if (map.has(key)) map.get(key).count += 1;
    else map.set(key, { name, count: 1 });
  });
  const options = [...map.values()].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  const current = select.value;
  select.innerHTML =
    '<option value="all">All Topics</option>' +
    options.map((o) => '<option value="' + escapeAttr(o.name) + '">' + escapeHtml(o.name) + " (" + o.count + ")</option>").join("");
  if (current && [...select.options].some((o) => o.value === current)) select.value = current;
}

function listTitle() {
  const parts = [];
  if (bookmarksOnly) parts.push("Bookmarked");
  if (difficulty !== "all") parts.push(capitalize(difficulty));
  if (topic !== "all") parts.push(topic);
  if ((query || "").trim()) parts.push("\u201C" + query.trim() + "\u201D");
  return parts.length ? parts.join(" \u00B7 ") + " Questions" : "All Questions";
}

function renderListHead() {
  const head = document.querySelector(".iq-list-head h2");
  if (head) head.textContent = listTitle();
  const range = el("iqListRange");
  const total = filtered.length;
  if (!total) {
    range.textContent = "No questions match your filters.";
    return;
  }
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
  range.textContent = "Question " + start + "\u2013" + end + " of " + total;
}

function questionCardHTML(qs) {
  const id = qs.id;
  const done = completed.has(id);
  const marked = bookmarked.has(id);
  const diffClass = (qs.difficulty || "").toLowerCase();
  const answerBtn =
    '<button class="btn btn-outline btn-sm" data-action="answer" data-id="' + id + '" type="button" aria-expanded="false">' +
      ICONS.chevronDown + "Show Answer" +
    "</button>";
  const bookmarkBtn =
    '<button class="iq-bookmark' + (marked ? " on" : "") + '" data-action="bookmark" data-id="' + id + '" type="button" aria-label="' + (marked ? "Remove bookmark" : "Bookmark question") + '" aria-pressed="' + (marked ? "true" : "false") + '">' + ICONS.bookmark + "</button>";
  const completeBtn =
    '<button class="btn btn-primary btn-sm iq-complete' + (done ? " done" : "") + '" data-action="complete" data-id="' + id + '" type="button" aria-pressed="' + (done ? "true" : "false") + '">' +
      (done ? ICONS.check + "Completed" : ICONS.circleCheck + "Mark Complete") +
    "</button>";
  return (
    '<article class="iq-question' + (done ? " done" : "") + '">' +
      '<div class="iq-question-head">' +
        '<span class="iq-qnum">Question ' + id + " of " + allQuestions.length + "</span>" +
        (diffClass ? '<span class="iq-diff ' + escapeAttr(diffClass) + '">' + escapeHtml(qs.difficulty) + "</span>" : "") +
        (qs.topic ? '<span class="iq-topic">' + escapeHtml(qs.topic) + "</span>" : "") +
      "</div>" +
      '<p class="iq-qtext">' + escapeHtml(qs.question) + "</p>" +
      '<div class="iq-actions">' + answerBtn + bookmarkBtn + completeBtn + "</div>" +
      '<div class="iq-answer" hidden>' +
        '<div class="iq-answer-label">' + ICONS.sparkles + "Answer</div>" +
        "<p>" + escapeHtml(qs.answer) + "</p>" +
      "</div>" +
    "</article>"
  );
}

function renderList() {
  const list = el("iqList");
  if (!filtered.length) {
    list.innerHTML =
      '<div class="iq-state">' +
        '<span class="iq-state-ico">' + ICONS.search + "</span>" +
        "<b>No interview questions found.</b>" +
        "<span>Try adjusting your search or filters.</span>" +
      "</div>";
    return;
  }
  const start = (page - 1) * PAGE_SIZE;
  const slice = filtered.slice(start, start + PAGE_SIZE);
  list.innerHTML = slice.map(questionCardHTML).join("");
}

/* Answer toggle — independent per question. */
function toggleAnswer(btn) {
  const card = btn.closest(".iq-question");
  const answer = card.querySelector(".iq-answer");
  const show = answer.hidden;
  answer.hidden = !show;
  btn.setAttribute("aria-expanded", String(show));
  btn.innerHTML = (show ? ICONS.chevronUp + "Hide Answer" : ICONS.chevronDown + "Show Answer");
}

/* ============================================================
   Pagination
   ============================================================ */
function pageList(current, total) {
  const set = new Set();
  set.add(1);
  for (let i = current - 1; i <= current + 1; i += 1) {
    if (i > 1 && i < total) set.add(i);
  }
  set.add(total);
  const sorted = [...set].sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  sorted.forEach((n) => {
    if (prev && n - prev > 1) out.push("gap");
    out.push(n);
    prev = n;
  });
  return out;
}

function renderPagination() {
  const nav = el("iqPagination");
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (totalPages <= 1) {
    nav.innerHTML = "";
    return;
  }
  const prevBtn =
    '<button class="iq-page" data-page="' + (page - 1) + '" type="button"' + (page <= 1 ? " disabled" : "") + ' aria-label="Previous page">' + ICONS.chevronLeft + "</button>";
  const nextBtn =
    '<button class="iq-page" data-page="' + (page + 1) + '" type="button"' + (page >= totalPages ? " disabled" : "") + ' aria-label="Next page">' + ICONS.chevronRight + "</button>";
  const pages = pageList(page, totalPages)
    .map((item) =>
      item === "gap"
        ? '<span class="iq-page gap" aria-hidden="true">\u2026</span>'
        : '<button class="iq-page' + (item === page ? " active" : "") + '" data-page="' + item + '" type="button"' + (item === page ? ' aria-current="page"' : "") + ">" + item + "</button>"
    )
    .join("");
  nav.innerHTML = prevBtn + pages + nextBtn;
}

function goToPage(next) {
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (next < 1 || next > totalPages) return;
  page = next;
  renderListHead();
  renderList();
  renderPagination();
  const list = el("iqList");
  if (list) list.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ============================================================
   Events
   ============================================================ */
function bindEvents() {
  // Difficulty pills.
  document.querySelectorAll("[data-difficulty]").forEach((btn) => {
    btn.addEventListener("click", () => {
      difficulty = btn.getAttribute("data-difficulty");
      document.querySelectorAll("[data-difficulty]").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      page = 1;
      renderAll();
    });
  });

  // Live search (debounced).
  const search = el("iqSearch");
  if (search) {
    search.addEventListener("input", debounce(() => {
      query = search.value;
      page = 1;
      renderAll();
    }, 150));
  }

  // Topic dropdown.
  const topicSelect = el("iqTopic");
  if (topicSelect) {
    topicSelect.addEventListener("change", () => {
      topic = topicSelect.value;
      page = 1;
      renderAll();
    });
  }

  // Bookmarked-only toggle.
  const bookmarksBtn = el("iqBookmarksOnly");
  if (bookmarksBtn) {
    bookmarksBtn.addEventListener("click", () => {
      bookmarksOnly = !bookmarksOnly;
      bookmarksBtn.setAttribute("aria-pressed", String(bookmarksOnly));
      page = 1;
      renderAll();
    });
  }

  // Pagination (delegated — the nav element persists between renders).
  const nav = el("iqPagination");
  if (nav) {
    nav.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-page]");
      if (!btn || btn.disabled) return;
      goToPage(Number(btn.getAttribute("data-page")));
    });
  }

  // Card actions (delegated — the list is re-rendered on every page change).
  const list = el("iqList");
  if (list) {
    list.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-action]");
      if (!btn) return;
      const id = Number(btn.getAttribute("data-id"));
      const action = btn.getAttribute("data-action");
      if (action === "answer") toggleAnswer(btn);
      else if (action === "complete") toggleCompleted(id);
      else if (action === "bookmark") toggleBookmark(id);
    });
  }
}

/* ============================================================
   Boot
   ============================================================ */
function boot() {
  bindEvents();
  // Never render questions before Firebase resolves the auth state: the
  // signed-in branch of onAuthStateChanged fetches the JSON and reveals the
  // content; the signed-out branch shows the login-required message instead.
  showChecking();
}
boot();
// end of interview.js
