/* ============================================================
   LearnJS — interview.js (pages/interview)
   Interview Prep: Topic → Difficulty learning flow.

   Main page shows ONLY topic cards (no duplicate sections).
   Clicking a topic opens a practice view with Easy → Medium → Hard tabs.
   Each tab shows questions in a 2-column grid with navigation at the bottom.

   Auth flow:
     - Signed out → inline Sign In / Sign Up gate.
     - Signed in  → fetch the JSON, subscribe to practice progress,
                    and render the topic selection UI.
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
const DATA_URL = "../../../interview_questions.json";

/* ---------- state ---------- */
let allQuestions = [];
let dataLoaded = false;
let currentUser = null;
let activeTopicId = null;
let activeDifficulty = "easy";
let expanded = new Set();
let practicedMap = {};
let unsubPractice = null;
let lastPracticeSignature = "";

/* Topic groups */
const TOPIC_GROUPS = [
  {
    id: "fundamentals",
    label: "Fundamentals",
    desc: "Variables, data types, operators, and core JS concepts.",
    topics: ["variables", "data types", "operators", "type conversion", "conditions", "loops", "strings", "symbols", "basic es6", "nullish coalescing", "optional chaining", "error handling"]
  },
  {
    id: "functions",
    label: "Functions",
    desc: "Declarations, scope, closures, and higher-order patterns.",
    topics: ["functions", "arrow functions", "scope", "closures", "call/apply/bind", "higher-order functions", "currying", "composition"]
  },
  {
    id: "arrays-objects",
    label: "Arrays & Objects",
    desc: "Array methods, object manipulation, and destructuring.",
    topics: ["array methods", "arrays", "objects", "destructuring", "spread/rest"]
  },
  {
    id: "dom",
    label: "DOM",
    desc: "DOM traversal, events, and manipulation.",
    topics: ["dom", "events", "advanced dom/event behavior"]
  },
  {
    id: "advanced",
    label: "Advanced JavaScript",
    desc: "Hoisting, prototypes, async patterns, and the event loop.",
    topics: ["hoisting", "this", "prototypes", "prototype chain", "classes", "promises", "promise internals", "async/await", "async behavior", "event loop", "call stack", "execution context", "modules", "generators", "iterators", "weakmap", "weakset", "memory management", "garbage collection", "polyfills"]
  },
  {
    id: "browser-web",
    label: "Browser & Web",
    desc: "Fetch API, browser internals, and performance.",
    topics: ["fetch", "browser internals", "performance", "debouncing", "throttling"]
  }
];

function topicGroupId(topic) {
  if (!topic) return "";
  const t = String(topic).toLowerCase();
  for (const group of TOPIC_GROUPS) {
    if (group.topics.indexOf(t) !== -1) return group.id;
  }
  return "";
}

/* ---------- icons ---------- */
const ICONS = {
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  bookOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>',
  braces: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
  cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>'
};

const TOPIC_ICONS = {
  fundamentals: ICONS.bookOpen,
  functions: ICONS.code,
  "arrays-objects": ICONS.braces,
  dom: ICONS.monitor,
  advanced: ICONS.cpu,
  "browser-web": ICONS.globe
};

/* ---------- helpers ---------- */
function el(id) { return document.getElementById(id); }
function toast(message, type) {
  if (window.LearnJS && window.LearnJS.toast) window.LearnJS.toast(message, type);
}
function isPracticed(questionId) { return !!practicedMap[String(questionId)]; }
function practiceSignature() { return Object.keys(practicedMap).sort().join(","); }
function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}
function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* ============================================================
   Auth gate
   ============================================================ */
function showChecking() {
  const gate = el("iqAuthGate"), content = el("iqContent");
  if (gate) gate.hidden = false;
  if (content) content.hidden = true;
  const checking = el("iqChecking"), login = el("iqLoginRequired");
  if (checking) checking.hidden = false;
  if (login) login.hidden = true;
}

function showLoginRequired() {
  const gate = el("iqAuthGate"), content = el("iqContent");
  if (gate) gate.hidden = false;
  if (content) content.hidden = true;
  const checking = el("iqChecking"), login = el("iqLoginRequired");
  if (checking) checking.hidden = true;
  if (login) login.hidden = false;
}

function showContent() {
  const gate = el("iqAuthGate"), content = el("iqContent");
  if (gate) gate.hidden = true;
  if (content) content.hidden = false;
}

function teardownSignedOut() {
  if (unsubPractice) { unsubPractice(); unsubPractice = null; }
  practicedMap = {};
  lastPracticeSignature = "";
  expanded.clear();
  allQuestions = [];
  dataLoaded = false;
  activeTopicId = null;
  activeDifficulty = "easy";
  showTopicSelector();
}

/* ============================================================
   Practice progress (Firestore)
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
        Object.keys(practicedMap).forEach((id) => {
          if (next[id] == null) next[id] = practicedMap[id];
        });
        const signature = Object.keys(next).sort().join(",");
        const changed = signature !== lastPracticeSignature;
        lastPracticeSignature = signature;
        practicedMap = next;
        if (dataLoaded && changed) {
          if (activeTopicId) renderQuestionGrid();
          renderTopicCards();
        }
      },
      (err) => console.warn("[LearnJS] Interview progress listener error:", err.message)
    );
  } catch (err) {
    console.warn("[LearnJS] Could not subscribe to interview progress:", err.message);
  }
}

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
    if (!currentUser) return;
    delete practicedMap[qid];
    lastPracticeSignature = practiceSignature();
    renderQuestionGrid();
    renderTopicCards();
    toast("Could not save practice progress: " + err.message, "error");
  }
}

/* ============================================================
   Data loading
   ============================================================ */
async function loadQuestions() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!currentUser) return;
    allQuestions = Array.isArray(data) ? data : (data && data.questions) || [];
    if (!allQuestions.length) throw new Error("Question list is empty");
    dataLoaded = true;
    renderTopicCards();
    if (activeTopicId) renderQuestionGrid();
  } catch (err) {
    if (!currentUser) return;
    console.error("[LearnJS] Could not load interview questions:", err);
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
}

/* ============================================================
   Topic view management
   ============================================================ */
function showTopicSelector() {
  const selector = el("iqTopicSelector");
  const panel = el("iqTopicPanel");
  const grid = el("iqList");
  const nav = el("iqNavActions");
  if (selector) selector.hidden = false;
  if (panel) panel.hidden = true;
  if (grid) { grid.innerHTML = ""; grid.className = "iq-question-grid"; }
  if (nav) nav.hidden = true;
  activeTopicId = null;
  activeDifficulty = "easy";
}

function showTopicPanel(topicId) {
  const selector = el("iqTopicSelector");
  const panel = el("iqTopicPanel");
  const nav = el("iqNavActions");
  if (selector) selector.hidden = true;
  if (panel) panel.hidden = false;
  if (nav) nav.hidden = false;
  activeTopicId = topicId;
  activeDifficulty = "easy";

  const group = TOPIC_GROUPS.find((g) => g.id === topicId);
  const title = el("iqPanelTitle");
  if (title && group) title.textContent = group.label;

  // Reset difficulty tabs
  document.querySelectorAll("[data-difficulty]").forEach((tab) => {
    const isActive = tab.getAttribute("data-difficulty") === "easy";
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  renderQuestionGrid();
}

/* ============================================================
   Rendering — Topic Cards (main page)
   ============================================================ */
function renderTopicCards() {
  const wrap = el("iqTopicProgress");
  if (!wrap) return;

  wrap.innerHTML = TOPIC_GROUPS
    .map((group) => {
      const pool = allQuestions.filter((q) => topicGroupId(q.topic) === group.id);
      const total = pool.length;
      const done = pool.filter((q) => isPracticed(q.id)).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      return (
        '<button class="iq-topic-card" data-topic="' + group.id + '" type="button">' +
          '<span class="iq-topic-card-head">' +
            '<span class="iq-topic-card-ico">' + (TOPIC_ICONS[group.id] || "") + "</span>" +
            '<span class="iq-topic-card-name">' + escapeHtml(group.label) + "</span>" +
          "</span>" +
          '<span class="iq-topic-card-desc">' + escapeHtml(group.desc) + "</span>" +
          '<span class="iq-topic-card-meta">' + done + " / " + total + " practiced</span>" +
          '<span class="iq-topic-card-bar-row">' +
            '<span class="iq-topic-bar"><span class="iq-topic-bar-fill" style="width:' + pct + '%"></span></span>' +
            '<span class="iq-topic-card-pct">' + pct + "%</span>" +
          "</span>" +
          '<span class="iq-topic-card-arrow">' + ICONS.chevronRight + "</span>" +
        "</button>"
      );
    })
    .join("");
}

/* ============================================================
   Rendering — Question Grid (topic practice view)
   ============================================================ */
function getFilteredByDifficulty() {
  if (!activeTopicId) return [];
  return allQuestions.filter((q) => {
    if (topicGroupId(q.topic) !== activeTopicId) return false;
    if (q.difficulty !== activeDifficulty) return false;
    return true;
  });
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

function renderQuestionGrid() {
  const grid = el("iqList");
  const nav = el("iqNavActions");
  const range = el("iqListRange");
  if (!grid) return;

  const filtered = getFilteredByDifficulty();
  const group = TOPIC_GROUPS.find((g) => g.id === activeTopicId);

  if (range) {
    range.textContent = filtered.length
      ? filtered.length + " " + activeDifficulty + " question" + (filtered.length !== 1 ? "s" : "")
      : "No " + activeDifficulty + " questions";
  }

  if (!filtered.length) {
    grid.innerHTML =
      '<div class="iq-state">' +
        '<span class="iq-state-ico">' + ICONS.alert + "</span>" +
        "<b>No " + activeDifficulty + " questions</b>" +
        "<span>Try another difficulty level.</span>" +
      "</div>";
    if (nav) nav.hidden = true;
    return;
  }

  grid.className = "iq-question-grid";
  grid.innerHTML = filtered.map((item, i) => cardHtml(item, i + 1)).join("");

  // Update navigation button
  updateNavButton();
}

function updateNavButton() {
  const nav = el("iqNavActions");
  const label = el("iqNextLabel");
  if (!nav || !label) return;

  const difficulties = ["easy", "medium", "hard"];
  const currentIdx = difficulties.indexOf(activeDifficulty);
  const nextDifficulty = difficulties[currentIdx + 1];
  const hasNext = !!nextDifficulty;
  const isLast = currentIdx === difficulties.length - 1;

  // Check if there are questions in the next difficulty
  if (hasNext && activeTopicId) {
    const nextPool = allQuestions.filter((q) =>
      topicGroupId(q.topic) === activeTopicId && q.difficulty === nextDifficulty
    );
    if (nextPool.length === 0) {
      // Skip to the one after, or show complete
      const afterNext = difficulties[currentIdx + 2];
      if (afterNext) {
        label.textContent = "Move to " + afterNext.charAt(0).toUpperCase() + afterNext.slice(1) + " \u2192";
        nav.hidden = false;
        return;
      }
    }
  }

  if (isLast || !hasNext) {
    label.textContent = "Complete Topic \u2192";
  } else {
    label.textContent = "Move to " + nextDifficulty.charAt(0).toUpperCase() + nextDifficulty.slice(1) + " \u2192";
  }
  nav.hidden = false;
}

/* ============================================================
   Event wiring
   ============================================================ */
function initEvents() {
  // Topic card clicks
  const progressWrap = el("iqTopicProgress");
  if (progressWrap) {
    progressWrap.addEventListener("click", (event) => {
      const card = event.target.closest("[data-topic]");
      if (!card) return;
      const topicId = card.getAttribute("data-topic");
      showTopicPanel(topicId);
    });
  }

  // Back button
  const backBtn = el("iqBackBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      showTopicSelector();
    });
  }

  // Difficulty tabs
  document.querySelectorAll("[data-difficulty]").forEach((tab) => {
    tab.addEventListener("click", () => {
      activeDifficulty = tab.getAttribute("data-difficulty");
      document.querySelectorAll("[data-difficulty]").forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-selected", String(isActive));
      });
      renderQuestionGrid();
    });
  });

  // Next difficulty / Complete topic button
  const nextBtn = el("iqNextBtn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const difficulties = ["easy", "medium", "hard"];
      const currentIdx = difficulties.indexOf(activeDifficulty);

      if (currentIdx >= difficulties.length - 1) {
        // Complete topic — find next topic
        const topicIdx = TOPIC_GROUPS.findIndex((g) => g.id === activeTopicId);
        const nextTopic = TOPIC_GROUPS[topicIdx + 1];
        if (nextTopic) {
          showTopicPanel(nextTopic.id);
        } else {
          // Last topic — go back to topic list
          showTopicSelector();
          toast("All topics complete!");
        }
        return;
      }

      // Move to next difficulty
      const nextDiff = difficulties[currentIdx + 1];
      activeDifficulty = nextDiff;
      document.querySelectorAll("[data-difficulty]").forEach((t) => {
        const isActive = t.getAttribute("data-difficulty") === nextDiff;
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-selected", String(isActive));
      });
      renderQuestionGrid();
      // Scroll to top of grid
      const grid = el("iqList");
      if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Question list event delegation (answer toggle + mark practiced)
  const list = el("iqList");
  if (list) {
    list.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-answer-toggle]");
      if (toggle) {
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
        renderTopicCards();
        markPracticed(question);
        return;
      }
    });
  }
}

/* ============================================================
   Boot
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
