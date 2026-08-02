/* ============================================================
   LearnJS — theme.js
   Light / dark theme toggle with localStorage persistence.
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "learnjs-theme";
  var root = document.documentElement;

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      /* storage unavailable (private mode) — ignore */
    }
  }

  function isDark() {
    return root.classList.contains("dark");
  }

  /** Apply a theme and sync the toggle button state. */
  function apply(theme, persist) {
    var dark = theme === "dark";
    root.classList.toggle("dark", dark);
    if (persist !== false) setStoredTheme(theme);

    var btn = document.getElementById("themeToggle");
    if (btn) {
      btn.setAttribute("aria-pressed", String(dark));
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  function toggle() {
    apply(isDark() ? "light" : "dark");
  }

  function init() {
    var stored = getStoredTheme();
    var prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    // Honor a stored choice; otherwise respect OS preference.
    var theme = stored || (prefersDark ? "dark" : "light");
    apply(theme, false);

    var btn = document.getElementById("themeToggle");
    if (btn) btn.addEventListener("click", toggle);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.LearnJS = window.LearnJS || {};
  window.LearnJS.theme = { apply: apply, toggle: toggle, isDark: isDark };
})();
// end of theme.js
