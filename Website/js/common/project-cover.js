/* ============================================================
   LearnJS — project-cover.js (js/common)
   Shared cover-image fallback for project cards + details pages.
   If a thumbnail fails to load (renamed/missing file, deployment
   mismatch, network hiccup), the broken <img> is swapped on error
   for a clean gradient tile derived from the project slug — so the
   browser's broken-image icon and visible alt text never appear.
   Alt text stays on the <img> for screen readers while it loads.
   ============================================================ */
(function () {
  "use strict";

  var LearnJS = (window.LearnJS = window.LearnJS || {});

  /* Same deterministic palettes as scan-projects.js placeholders. */
  var PALETTES = [
    ["#22c55e", "#0f766e"],
    ["#0ea5e9", "#3730a3"],
    ["#f59e0b", "#dc2626"],
    ["#ec4899", "#7c3aed"],
    ["#14b8a6", "#0369a1"],
    ["#a855f7", "#4c1d95"],
    ["#f97316", "#b91c1c"],
    ["#84cc16", "#166534"]
  ];

  function hashString(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  /**
   * Swap a failed project-cover <img> for an on-brand gradient tile.
   * Reads the slug + title from data-fb-slug / data-fb-title attributes
   * (set next to `src` on every project <img>).
   * @param {HTMLImageElement} img the <img> that failed to load.
   */
  LearnJS.projectCoverFallback = function (img) {
    if (!img || !img.parentNode) return;
    img.onerror = null; // never loop if the browser retries

    var slug = img.getAttribute("data-fb-slug") || "";
    var title = img.getAttribute("data-fb-title") || "";
    var palette = PALETTES[hashString(slug) % PALETTES.length];
    var initial = (title.trim().charAt(0) || "?").toUpperCase();

    var fallback = document.createElement("div");
    fallback.className = "project-cover-fallback";
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", title || "Project cover");
    fallback.style.background =
      "linear-gradient(135deg, " + palette[0] + " 0%, " + palette[1] + " 100%)";

    var initialEl = document.createElement("span");
    initialEl.className = "pcf-initial";
    initialEl.textContent = initial;

    var titleEl = document.createElement("span");
    titleEl.className = "pcf-title";
    titleEl.textContent = title;

    fallback.appendChild(initialEl);
    fallback.appendChild(titleEl);
    img.replaceWith(fallback);
  };
})();
// end of project-cover.js
