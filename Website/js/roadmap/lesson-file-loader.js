/* ============================================================
   LearnJS — lesson-file-loader.js (js/roadmap)
   Loads per-topic lesson content from JSON files in
   Website/data/lessons/{topicId}.json.

   Topics 1.1 and 1.2 remain in data/lesson-content.js.
   From 1.3 onward, lessons are stored in separate JSON files.

   The loader fetches JSON files on demand, caches them in memory,
   and returns individual lesson objects keyed by lesson number
   (e.g. "1.3.1"). The returned shape matches LESSON_CONTENT entries
   so the existing renderer works without changes.

   Future topics (1.4, 2.1, 2.2, …) just need a JSON file placed
   in Website/data/lessons/{topicId}.json — no code changes needed.

   TOPICS USING JSON FILES:
   - 1.3 and above (topics where JSON files exist in lessons/)

   TOPICS STILL IN lesson-content.js (DO NOT REMOVE):
   - 1.1.x and 1.2.x
   ============================================================ */

/* ---------- cache ---------- */
const cache = new Map(); // topicId -> { lessons: [...] } | null

/* ---------- helpers ---------- */
/**
 * Extract the topic ID from a lesson number.
 * "1.3.1" → "1.3", "2.1.4" → "2.1", "10.3.2" → "10.3"
 */
function topicIdFromLessonNumber(number) {
  const parts = String(number).split(".");
  if (parts.length >= 2) return parts[0] + "." + parts[1];
  return null;
}

/**
 * Determine whether a topic should load from a JSON file.
 * Topics 1.1 and 1.2 stay in lesson-content.js.
 * Everything from 1.3 onward uses JSON files.
 */
function shouldUseJsonFile(topicId) {
  if (!topicId) return false;
  const parts = topicId.split(".");
  if (parts.length < 2) return false;
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  if (isNaN(major) || isNaN(minor)) return false;
  // 1.1 and 1.2 stay in lesson-content.js
  if (major === 1 && (minor === 1 || minor === 2)) return false;
  // Everything else (1.3+, 2.x, 3.x, …) uses JSON files
  return true;
}

/* ---------- public API ---------- */

/**
 * Pre-fetch and cache JSON for a topic.
 * Call this once per topic when the learning panel opens.
 * Returns the cached topic data or null on failure.
 */
export async function prefetchTopic(topicId) {
  if (!topicId) return null;
  if (cache.has(topicId)) return cache.get(topicId);

  if (!shouldUseJsonFile(topicId)) {
    cache.set(topicId, null);
    return null;
  }

  try {
    const resp = await fetch("../../data/lessons/" + topicId + ".json");
    if (!resp.ok) {
      console.warn("[LessonLoader] No JSON for topic " + topicId + " (HTTP " + resp.status + ")");
      cache.set(topicId, null);
      return null;
    }
    const data = await resp.json();
    cache.set(topicId, data);
    return data;
  } catch (err) {
    console.warn("[LessonLoader] Failed to load topic " + topicId + ":", err.message);
    cache.set(topicId, null);
    return null;
  }
}

/**
 * Look up a single lesson by its number (e.g. "1.3.1").
 * Returns the lesson object (matching LESSON_CONTENT shape) or null.
 */
export function getLessonByNumber(number) {
  const topicId = topicIdFromLessonNumber(number);
  if (!topicId || !cache.has(topicId)) return null;

  const topicData = cache.get(topicId);
  if (!topicData || !topicData.lessons) return null;

  return topicData.lessons.find((l) => l.id === number) || null;
}

/**
 * Check whether a lesson number is served from a JSON file
 * (i.e. whether it should bypass LESSON_CONTENT).
 */
export function isJsonLesson(number) {
  const topicId = topicIdFromLessonNumber(number);
  return shouldUseJsonFile(topicId);
}
