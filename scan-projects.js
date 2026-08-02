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

   Usage:
     node scan-projects.js            one-time scan
     node scan-projects.js --watch    watch for changes & auto-regenerate

   Project folders that are missing project.json are skipped with a
   warning. Missing cover files are auto-generated as a placeholder
   cover.png. NEVER edit the generated files by hand.
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

/** Read + validate one project folder. Returns null when skipped. */
function readProject(folderPath, folderName) {
  const jsonPath = path.join(folderPath, "project.json");
  if (!fs.existsSync(jsonPath)) {
    console.warn(`  [warn] ${folderName}: missing project.json — skipped.`);
    return null;
  }

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch (err) {
    console.warn(`  [warn] ${folderName}: project.json is not valid JSON — skipped. (${err.message})`);
    return null;
  }

  const meta = {
    title: raw.title || folderName,
    description: raw.description || "",
    difficulty: raw.difficulty || DEFAULTS.difficulty,
    estimatedTime: raw.estimatedTime || DEFAULTS.estimatedTime,
    category: raw.category || DEFAULTS.category,
    tags: Array.isArray(raw.tags) ? raw.tags : DEFAULTS.tags,
    cover: raw.cover || DEFAULTS.cover,
    entry: raw.entry || DEFAULTS.entry
  };

  // Auto-generate a placeholder cover.png when the png cover is missing
  // (before the existence check below, so we don't warn about a file we then create).
  if (meta.cover === "cover.png" && !fs.existsSync(path.join(folderPath, "cover.png"))) {
    ensureCover(folderPath, folderName);
  }

  // Warn when referenced files do not exist.
  for (const file of [meta.cover, meta.entry]) {
    if (!fs.existsSync(path.join(folderPath, file))) {
      console.warn(`  [warn] ${folderName}: "${file}" not found inside the folder.`);
    }
  }

  // createdAt: allow project.json to pin it, otherwise use file mtime.
  let createdAt = null;
  if (raw.createdAt) {
    const d = new Date(raw.createdAt);
    createdAt = isNaN(d.getTime()) ? null : d;
  }
  if (!createdAt) {
    createdAt = fs.statSync(jsonPath).mtime;
  }

  return { slug: slugify(folderName), folder: folderName, meta, createdAt, rawOrder: raw.order };
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

  const projects = [];
  for (const entry of entries) {
    const read = readProject(path.join(PROJECTS_DIR, entry.name), entry.name);
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
      coverImage: encodePath(`${PAGE_REL}/${p.folder}/${p.meta.cover}`),
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
