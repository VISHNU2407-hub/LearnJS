#!/usr/bin/env node
/* ============================================================
   LearnJS — scan-projects.js
   -----------------------------------------------------------------
   Scans the "JS PROJECTS" folder, reads every project's
   project.json and regenerates:

     Website/data/projects.json       (array of project objects)
     Website/data/projects-data.js    (embedded window.LEARNJS_PROJECTS
                                       fallback so the dashboard works
                                       over file:// where fetch is blocked)
     Website/assets/project-covers/   (one cover per project, copied
                                       from the folder so image paths work
                                       locally AND on Firebase Hosting)

   Usage:
     node scan-projects.js            one-time scan
     node scan-projects.js --watch    watch for changes & auto-regenerate

   Project folders that are missing project.json keep their previously
   generated metadata when available (falling back to folder-name
   defaults), so re-scanning never wipes the index. The cover image is
   resolved from whatever image file exists in the folder (project.json's
   `cover` first, then any file starting with "cover" such as
   "cover image.png"); missing covers get a generated placeholder.
   NEVER edit the generated files by hand.
   ============================================================ */

"use strict";

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

/* ------------------------------------------------------------
   Config
   ------------------------------------------------------------ */
const ROOT = __dirname;
const PROJECTS_DIR = path.join(ROOT, "JS PROJECTS");
const DATA_DIR = path.join(ROOT, "Website", "data");
const OUT_JSON = path.join(DATA_DIR, "projects.json");
const OUT_JS = path.join(DATA_DIR, "projects-data.js");

// Relative prefix every page under Website/pages/* uses to reach a project file.
const PAGE_REL = "../../../JS PROJECTS";

// Covers are copied into the deployable site (Website/assets/project-covers)
// so every page under Website/pages/* can reference them with a short,
// deployment-safe relative path.
const COVER_REL = "../../assets/project-covers";
const ASSETS_COVERS_DIR = path.join(ROOT, "Website", "assets", "project-covers");

// Any image file whose name starts with "cover" counts as the project cover
// (the folders currently ship "cover image.png" / "cover image.jpeg").
const COVER_IMAGE_RE = /\.(png|jpe?g|webp|gif|svg)$/i;

const DEFAULTS = {
  difficulty: "Beginner",
  estimatedTime: "1 hour",
  category: "Core JS",
  tags: [],
  cover: "cover.png",
  entry: "index.html"
};

/* ------------------------------------------------------------
   Minimal PNG encoder (placeholder covers, no dependencies)
   ------------------------------------------------------------ */
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Build an 800x450 vertical-gradient PNG. */
function makeCoverPng(width, height, topHex, bottomHex) {
  const [r1, g1, b1] = hexToRgb(topHex);
  const [r2, g2, b2] = hexToRgb(bottomHex);
  const stride = 1 + width * 3;
  const raw = Buffer.alloc(stride * height);

  for (let y = 0; y < height; y++) {
    const t = height > 1 ? y / (height - 1) : 0;
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    raw[y * stride] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const o = y * stride + 1 + x * 3;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor RGB
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

/** Deterministic gradient palette from a slug. */
function paletteFor(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const palettes = [
    ["#22c55e", "#0f766e"],
    ["#0ea5e9", "#3730a3"],
    ["#f59e0b", "#dc2626"],
    ["#ec4899", "#7c3aed"],
    ["#14b8a6", "#0369a1"],
    ["#a855f7", "#4c1d95"],
    ["#f97316", "#b91c1c"],
    ["#84cc16", "#166534"]
  ];
  return palettes[h % palettes.length];
}

/* ------------------------------------------------------------
   Helpers
   ------------------------------------------------------------ */
function slugify(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** URL-encode every path segment (folder names may contain spaces). */
function encodePath(relPath) {
  return relPath.split("/").map((s) => encodeURIComponent(s)).join("/");
}

/** Find any image file in a folder whose name starts with "cover". */
function resolveCoverFile(folderPath) {
  let names = [];
  try { names = fs.readdirSync(folderPath); } catch (err) { return null; }
  const found = names
    .filter((n) => /^cover/i.test(n) && COVER_IMAGE_RE.test(n))
    .sort((a, b) => a.localeCompare(b));
  return found.length ? found[0] : null;
}

/**
 * Resolve the actual cover file on disk for a project folder.
 * Priority: project.json's declared cover → any "cover*" image in the
 * folder → a generated placeholder.
 */
function resolveCover(folderPath, folderName, declaredCover) {
  if (declaredCover && fs.existsSync(path.join(folderPath, declaredCover))) {
    return declaredCover;
  }
  const found = resolveCoverFile(folderPath);
  if (found) return found;
  // No real cover — generate a placeholder cover.png (as before).
  ensureCover(folderPath, folderName);
  return "cover.png";
}

/** Read + validate one project folder. Returns null when skipped. */
function readProject(folderPath, folderName, prev) {
  const jsonPath = path.join(folderPath, "project.json");
  let raw = null;

  if (fs.existsSync(jsonPath)) {
    try {
      raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    } catch (err) {
      console.warn(`  [warn] ${folderName}: project.json is not valid JSON — skipped. (${err.message})`);
      return null;
    }
  } else if (prev) {
    // project.json was removed/renamed — keep the previously generated
    // metadata so a re-scan never wipes the index.
    console.log(`  [info] ${folderName}: project.json missing — reusing generated metadata.`);
  } else {
    console.warn(`  [warn] ${folderName}: missing project.json — skipped.`);
    return null;
  }

  const src = raw || prev || {};
  const meta = {
    title: src.title || folderName,
    description: src.description || "",
    difficulty: src.difficulty || DEFAULTS.difficulty,
    estimatedTime: src.estimatedTime || DEFAULTS.estimatedTime,
    category: src.category || DEFAULTS.category,
    tags: Array.isArray(src.tags) ? src.tags : DEFAULTS.tags,
    cover: src.cover || DEFAULTS.cover,
    entry: src.entry || DEFAULTS.entry
  };

  // Resolve the cover file that actually exists in the folder.
  meta.cover = resolveCover(folderPath, folderName, meta.cover);

  // Warn when the referenced entry file does not exist.
  if (!fs.existsSync(path.join(folderPath, meta.entry))) {
    console.warn(`  [warn] ${folderName}: "${meta.entry}" not found inside the folder.`);
  }

  // createdAt: allow project.json to pin it, otherwise use file mtime
  // (or the previously generated value when project.json is missing).
  let createdAt = null;
  if (raw && raw.createdAt) {
    const d = new Date(raw.createdAt);
    createdAt = isNaN(d.getTime()) ? null : d;
  }
  if (!createdAt && fs.existsSync(jsonPath)) {
    createdAt = fs.statSync(jsonPath).mtime;
  }
  if (!createdAt) {
    createdAt = new Date(src.createdAt || Date.now());
  }

  return { slug: slugify(folderName), folder: folderName, meta, createdAt, rawOrder: src.order };
}

/** Write a placeholder cover.png when the folder has none. */
function ensureCover(folderPath, folderName) {
  try {
    const [top, bottom] = paletteFor(slugify(folderName));
    const png = makeCoverPng(800, 450, top, bottom);
    fs.writeFileSync(path.join(folderPath, "cover.png"), png);
    console.log(`  [gen] ${folderName}: generated placeholder cover.png`);
  } catch (err) {
    console.warn(`  [warn] ${folderName}: could not generate cover.png (${err.message})`);
  }
}

/** Copy a project cover into Website/assets/project-covers/<slug>.<ext>. */
function copyCoverToAssets(srcPath, destName, slug, folderName) {
  try {
    fs.mkdirSync(ASSETS_COVERS_DIR, { recursive: true });
    const destPath = path.join(ASSETS_COVERS_DIR, destName);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    } else {
      // No source file — generate the placeholder straight into the assets.
      const [top, bottom] = paletteFor(slug);
      fs.writeFileSync(destPath, makeCoverPng(800, 450, top, bottom));
      console.log(`  [gen] ${folderName}: generated placeholder ${destName}`);
    }
  } catch (err) {
    console.warn(`  [warn] ${folderName}: could not write cover ${destName} (${err.message})`);
  }
}

/* ------------------------------------------------------------
   Scan + write
   ------------------------------------------------------------ */
function scan() {
  if (!fs.existsSync(PROJECTS_DIR)) {
    console.error(`[scan] Folder not found: ${PROJECTS_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Keep previously generated metadata for folders that lost their
  // project.json (so re-scans never wipe the index).
  const prevByFolder = {};
  try {
    const prev = JSON.parse(fs.readFileSync(OUT_JSON, "utf8"));
    if (Array.isArray(prev)) prev.forEach((p) => { if (p.folder) prevByFolder[p.folder] = p; });
  } catch (err) { /* no previous output — fresh scan */ }

  const projects = [];
  for (const entry of entries) {
    const read = readProject(path.join(PROJECTS_DIR, entry.name), entry.name, prevByFolder[entry.name]);
    if (read) projects.push(read);
  }

  // Stable order: explicit `order` wins, otherwise alphabetical by title.
  const withOrder = projects
    .filter((p) => Number.isFinite(p.rawOrder))
    .sort((a, b) => a.rawOrder - b.rawOrder);
  const withoutOrder = projects
    .filter((p) => !Number.isFinite(p.rawOrder))
    .sort((a, b) => a.meta.title.localeCompare(b.meta.title));

  let order = 0;
  const output = [...withOrder, ...withoutOrder].map((p) => {
    order += 1;
    // Copy (or generate) the cover into the deployable site so image paths
    // work locally and on Firebase Hosting, whatever the page depth.
    const ext = (path.extname(p.meta.cover) || ".png").toLowerCase();
    const coverName = p.slug + ext;
    copyCoverToAssets(path.join(PROJECTS_DIR, p.folder, p.meta.cover), coverName, p.slug, p.folder);
    return {
      id: p.slug,
      folder: p.folder,
      title: p.meta.title,
      description: p.meta.description,
      difficulty: p.meta.difficulty,
      estimatedTime: p.meta.estimatedTime,
      category: p.meta.category,
      tags: p.meta.tags,
      cover: p.meta.cover,
      entry: p.meta.entry,
      coverImage: encodePath(`${COVER_REL}/${coverName}`),
      entryUrl: encodePath(`${PAGE_REL}/${p.folder}/${p.meta.entry}`),
      order,
      createdAt: p.createdAt.toISOString()
    };
  });

  writeOutputs(output);
  return output.length;
}

function writeOutputs(projects) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const json = JSON.stringify(projects, null, 2) + "\n";

  fs.writeFileSync(OUT_JSON, json, "utf8");
  fs.writeFileSync(
    OUT_JS,
    "/* Auto-generated by scan-projects.js — do not edit manually. */\n" +
    "window.LEARNJS_PROJECTS = " + JSON.stringify(projects, null, 2) + ";\n",
    "utf8"
  );
}

/* ------------------------------------------------------------
   Watch mode
   ------------------------------------------------------------ */
function watch() {
  console.log("[scan] watching " + PROJECTS_DIR + " (Ctrl+C to stop)");
  let timer = null;
  let scanning = false;

  const rescan = () => {
    if (scanning) return;
    scanning = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const count = scan();
      console.log(`[scan] ${new Date().toLocaleTimeString()} — regenerated ${count} projects`);
      scanning = false;
    }, 400);
  };

  try {
    fs.watch(PROJECTS_DIR, { recursive: true }, rescan);
  } catch (err) {
    console.warn("[scan] recursive watch unavailable, falling back to polling:", err.message);
    setInterval(rescan, 3000);
  }

  process.on("SIGINT", () => {
    console.log("\n[scan] stopped.");
    process.exit(0);
  });
}

/* ------------------------------------------------------------
   CLI
   ------------------------------------------------------------ */
const flag = process.argv[2] || "";
if (flag === "--watch") {
  const initial = scan();
  console.log(`[scan] initial scan: ${initial} projects`);
  watch();
} else if (flag === "--help" || flag === "-h") {
  console.log("Usage: node scan-projects.js [--watch]");
  console.log("  (no flag)   one-time scan");
  console.log("  --watch     watch JS PROJECTS and regenerate automatically");
} else {
  const count = scan();
  console.log(`[scan] done — ${count} projects written to ${path.relative(ROOT, OUT_JSON)}`);
}
