/* ============================================================
   LearnJS — project-loader.js (js/projects)
   Shared client-side loader for the generated project index.
   Reads Website/data/projects.json (produced by scan-projects.js)
   and falls back to the embedded window.LEARNJS_PROJECTS copy
   (data/projects-data.js) when fetch is blocked (file:// pages).
   ============================================================ */

const PROJECTS_URL = "../../data/projects.json";

/**
 * Load the full project list.
 * Always returns an array; never throws.
 * @returns {Promise<Array>}
 */
export async function loadProjects() {
  // Prefer a fresh fetch over http(s) so the watcher's regenerated
  // projects.json is picked up without clearing the cache.
  try {
    const res = await fetch(PROJECTS_URL + "?t=" + Date.now(), { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    // fetch fails on file:// — fall back to the embedded snapshot below.
  }

  const embedded = window.LEARNJS_PROJECTS;
  if (Array.isArray(embedded)) return embedded;
  return [];
}

/** Find one project by its slug/id. */
export function getProjectById(list, id) {
  return list.find((p) => p.id === id);
}

/** Relative URL to the placeholder details page for a project. */
export function detailsUrl(slug) {
  return "../project-details/?slug=" + encodeURIComponent(slug);
}
// end of project-loader.js
