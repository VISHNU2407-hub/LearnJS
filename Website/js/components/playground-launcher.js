/* ============================================================
   LearnJS — playground-launcher.js (components)
   Global floating Playground launcher.

   Shows a small circular `</>` button in the bottom-right corner
   ONLY while a user is signed in. Clicking it opens the existing
   JS Playground (Js-compiler/) in a new tab — the compiler itself
   is NOT rebuilt or embedded here, it is reused as-is.

   Visibility is driven by the existing Firebase auth session
   (onAuthStateChanged), so this single module works on every page
   that includes it:
     - Protected pages (dashboard, project-details): always visible
       once the user is signed in (those pages require it).
     - Public pages (home, projects, roadmap, resources, community,
       interview): visible only while signed in, hidden otherwise.
     - Login / Signup: this module is intentionally NOT included
       there, so the button never appears.

   Loaded as a module so it can import firebase.js — add one
   <script type="module"> tag per page, no per-page HTML needed.
   ============================================================ */

import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/* ---------- Config ---------- */
const TOOLTIP_TEXT = "Open Playground";
const FAB_ID = "learnjs-playground-fab";
const CSS_ID = "learnjs-playground-fab-style";

// `</>` code icon — chevrons plus a slash (lucide-style).
const CODE_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="m8 6-6 6 6 6"/><path d="m16 6 6 6-6 6"/><path d="m13.2 4.5-2.4 15"/></svg>';

/* ---------- Styles (scoped, injected once) ----------
   Uses the existing LearnJS design tokens (--brand etc. from
   css/global/style.css) so the button matches the app in both
   light and dark themes. */
const FAB_CSS = `
#${FAB_ID} {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 999;
  width: 50px;
  height: 50px;
  padding: 0;
  border: none;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--brand, #22c55e), var(--brand-strong, #16a34a));
  color: #fff;
  cursor: pointer;
  box-shadow:
    0 6px 18px rgba(34, 197, 94, 0.35),
    0 2px 6px rgba(15, 23, 42, 0.14);
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s ease;
}
#${FAB_ID} svg { width: 22px; height: 22px; }
/* The hidden attribute must win over the display rule above (same
   specificity, later in the cascade) so the button stays hidden until
   the auth state confirms a signed-in user. */
#${FAB_ID}[hidden] { display: none; }
#${FAB_ID}:hover {
  transform: scale(1.08);
  box-shadow:
    0 10px 26px rgba(34, 197, 94, 0.45),
    0 3px 8px rgba(15, 23, 42, 0.18);
}
#${FAB_ID}:active { transform: scale(0.95); }
#${FAB_ID}:focus-visible {
  outline: 3px solid var(--brand, #22c55e);
  outline-offset: 3px;
}

/* Tooltip — appears above the button on hover / keyboard focus. */
#${FAB_ID}::before,
#${FAB_ID}::after {
  position: absolute;
  bottom: calc(100% + 9px);
  right: 0;
  opacity: 0;
  transform: translateY(4px);
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s ease;
}
#${FAB_ID}::after {
  content: attr(data-tooltip);
  padding: 7px 11px;
  border-radius: 8px;
  background: var(--ink, #0f172a);
  color: var(--bg, #ffffff);
  font: 600 12px/1.2 "Inter", system-ui, sans-serif;
  white-space: nowrap;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.22);
}
#${FAB_ID}::before {
  content: "";
  right: 19px;
  border: 5px solid transparent;
  border-top-color: var(--ink, #0f172a);
}
#${FAB_ID}:hover::before,
#${FAB_ID}:hover::after,
#${FAB_ID}:focus-visible::before,
#${FAB_ID}:focus-visible::after {
  opacity: 1;
  transform: translateY(0);
}

/* Slightly smaller + safe-area aware on small screens. */
@media (max-width: 640px) {
  #${FAB_ID} {
    right: 16px;
    bottom: calc(16px + env(safe-area-inset-bottom));
    width: 48px;
    height: 48px;
  }
  #${FAB_ID} svg { width: 20px; height: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  #${FAB_ID} { transition: none; }
  #${FAB_ID}::before,
  #${FAB_ID}::after { transition: none; }
}
`;

/* ---------- Helpers ---------- */

/** Resolve the existing playground URL.
    The module always lives at Website/js/components/, i.e. exactly
    three levels below the project root where Js-compiler/ sits. Deriving
    the URL from import.meta.url makes this independent of how the page
    itself was reached (file vs directory form, query strings, depth), so
    the button always opens the real compiler. */
function resolvePlaygroundUrl() {
  return new URL("../../../Js-compiler/index.html", import.meta.url).href;
}

function openPlayground() {
  window.open(resolvePlaygroundUrl(), "_blank", "noopener");
}

function injectStyles() {
  if (document.getElementById(CSS_ID)) return;
  const style = document.createElement("style");
  style.id = CSS_ID;
  style.textContent = FAB_CSS;
  document.head.appendChild(style);
}

function buildButton() {
  injectStyles();

  const btn = document.createElement("button");
  btn.id = FAB_ID;
  btn.type = "button";
  btn.className = "learnjs-playground-fab";
  btn.setAttribute("data-tooltip", TOOLTIP_TEXT);
  btn.setAttribute("aria-label", TOOLTIP_TEXT);
  btn.innerHTML = CODE_ICON;
  btn.hidden = true; // hidden until the auth state confirms a signed-in user

  btn.addEventListener("click", openPlayground);

  document.body.appendChild(btn);
  return btn;
}

/* ---------- Boot ---------- */

(function init() {
  if (document.getElementById(FAB_ID)) return; // never run twice on a page

  const fab = buildButton();

  // Show the button only while a user is signed in. This is the single
  // source of truth for visibility — no per-page flags required.
  onAuthStateChanged(auth, (user) => {
    fab.hidden = !user;
  });

  // Expose a tiny programmatic hook (future use: lesson starter code).
  window.LearnJS = window.LearnJS || {};
  window.LearnJS.playground = { open: openPlayground };
})();
// end of playground-launcher.js
