/* ============================================================
   LearnJS — vfs.js (Project-Builder)
   Virtual file system for the Project Builder.

   A project is a flat map of "path/to/file.ext" -> content string
   plus optional folder markers ("css/" -> ""). This module provides
   all path math, file-type detection, the tree used by the file
   explorer, and starter templates for new files. It is deliberately
   UI-free so the builder stays generic and reusable.
   ============================================================ */

/* ---------- path helpers ---------- */

/** Normalise a path: collapse ".", "..", repeated slashes. Never escapes root. */
export function normalizePath(p) {
  if (typeof p !== "string") return "";
  const leadingSlash = p.charAt(0) === "/";
  const parts = String(p).split("/");
  const out = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") {
      if (out.length) out.pop();
      continue;
    }
    out.push(part);
  }
  let result = out.join("/");
  if (leadingSlash) result = "/" + result;
  return result;
}

/** Directory part of a path: "css/style.css" -> "css". "" for root-level. */
export function dirname(p) {
  const idx = String(p).lastIndexOf("/");
  return idx === -1 ? "" : p.slice(0, idx);
}

/** File name part: "css/style.css" -> "style.css". */
export function basename(p) {
  const clean = String(p).replace(/\/+$/, "");
  const idx = clean.lastIndexOf("/");
  return idx === -1 ? clean : clean.slice(idx + 1);
}

/** Extension in lower case with the dot: "style.css" -> ".css". */
export function extension(p) {
  const m = /\.([a-z0-9]+)$/i.exec(basename(p));
  return m ? "." + m[1].toLowerCase() : "";
}

/** Resolve `ref` (which may be relative) against the dir of `fromPath`. */
export function resolvePath(fromPath, ref) {
  if (typeof ref !== "string" || !ref) return "";
  // Absolute URL / protocol — not a project file.
  if (/^[a-z][a-z0-9+.-]*:/i.test(ref) || ref.charAt(0) === "#") return "";
  const clean = ref.split(/[?#]/)[0]; // drop query + hash
  const base = dirname(fromPath);
  const combined = base ? base + "/" + clean : clean;
  return normalizePath(combined);
}

/** True when a path refers to a directory (ends with "/"). */
export function isFolder(p) {
  return typeof p === "string" && p.charAt(p.length - 1) === "/";
}

/* ---------- file-type helpers ---------- */

export function isHtml(p) {
  return /\.html?$/i.test(p);
}
export function isCss(p) {
  return /\.css$/i.test(p);
}
export function isJs(p) {
  return /\.js$/i.test(p);
}

/** CodeMirror mode name for a file path ("" = plain text). */
export function modeFor(p) {
  if (isHtml(p)) return "htmlmixed";
  if (isCss(p)) return "css";
  if (isJs(p)) return "javascript";
  return "text/plain";
}

/** Human label of the editor mode, for the status bar. */
export function modeLabel(p) {
  const ext = extension(p);
  return { ".html": "HTML", ".htm": "HTML", ".css": "CSS", ".js": "JavaScript" }[ext] || "Plain Text";
}

/** Short file-type badge text for the explorer. */
export function typeBadge(p) {
  if (isFolder(p)) return "dir";
  const ext = extension(p);
  if (ext === ".html" || ext === ".htm") return "html";
  if (ext === ".css") return "css";
  if (ext === ".js") return "js";
  if (/\.(png|jpe?g|gif|webp|avif|bmp|ico|svg)$/i.test(p)) return "img";
  if (/\.(woff2?|ttf|otf|eot)$/i.test(p)) return "font";
  return "txt";
}

/* ---------- tree building (file explorer) ---------- */

/**
 * Build a nested tree from a flat file map.
 * Returns an array of nodes: { name, path, type: "folder"|"file", children }
 * Folders sort first, then files, both alphabetically.
 */
export function buildTree(files) {
  const root = [];
  const folders = new Set();

  for (const key of Object.keys(files || {})) {
    if (isFolder(key)) {
      folders.add(normalizePath(key));
    } else {
      // Every ancestor directory of the file also exists.
      let d = dirname(key);
      while (d) {
        folders.add(d);
        d = dirname(d);
      }
    }
  }

  const nodeByPath = new Map();
  const getDir = (path) => {
    let node = nodeByPath.get(path);
    if (!node) {
      node = { name: basename(path), path, type: "folder", children: [] };
      nodeByPath.set(path, node);
    }
    return node;
  };
  // Each child belongs to exactly one parent; track by path to avoid
  // duplicates when several nested folder paths share intermediate dirs.
  const attach = (parentNode, childNode) => {
    if (childNode && parentNode && parentNode.children.indexOf(childNode) === -1) {
      parentNode.children.push(childNode);
    }
  };

  for (const folderPath of folders) {
    const parts = folderPath.split("/").filter(Boolean);
    let current = "";
    for (let i = 0; i < parts.length; i++) {
      const parent = current;
      current = current ? current + "/" + parts[i] : parts[i];
      getDir(current);
      if (parent) attach(getDir(parent), getDir(current));
      else if (!root.includes(getDir(current))) root.push(getDir(current));
    }
  }

  const filesList = Object.keys(files || {})
    .filter((k) => !isFolder(k))
    .map((k) => ({ name: basename(k), path: k, type: "file" }));

  for (const f of filesList) {
    const parent = dirname(f.path);
    if (parent) getDir(parent).children.push(f);
    else root.push(f);
  }

  const sortChildren = (node) => {
    if (!node.children) return; // file node
    node.children.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    node.children.forEach(sortChildren);
  };
  root.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  root.forEach(sortChildren);
  return root;
}

/** All file paths (non-folder) sorted, folder markers excluded. */
export function fileList(files) {
  return Object.keys(files || {})
    .filter((k) => !isFolder(k))
    .sort();
}

/** True when `path` exists as a file in the map (folder markers excluded). */
export function hasFile(files, path) {
  return typeof (files || {})[path] === "string";
}

/* ---------- starter templates for new files ---------- */

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <script src="script.js"></script>
</body>
</html>
`;

/** Default content for a newly created file, by extension. */
export function templateFor(path) {
  const ext = extension(path);
  if (ext === ".html") return HTML_TEMPLATE;
  if (ext === ".css") return "/* " + basename(path) + " */\n\n";
  if (ext === ".js") return "// " + basename(path) + "\n\n";
  return "";
}

/** Validate a new file/folder name. Returns an error string or "". */
export function validateName(name, isDir) {
  if (!name || !String(name).trim()) return "Please enter a name.";
  if (name === "." || name === "..") return "That name is not allowed.";
  if (/[\\/:*?"<>|]/.test(name)) return "Name contains invalid characters.";
  if (isDir && !name.endsWith("/")) return name + "/";
  return "";
}

/** Safe display name (strip a trailing slash from folders). */
export function displayName(path) {
  return isFolder(path) ? path.replace(/\/+$/, "") : basename(path);
}
// end of vfs.js
