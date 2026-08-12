/* ============================================================
   LearnJS — builder.js (Project-Builder)
   Project Builder — main controller.

   Wires the generic builder UI to a project definition
   (Project-Builder/projects.js), a virtual file system (vfs.js) and
   the sandboxed preview (preview.js). Contains no project-specific
   logic — Number Counter, or any future project, is just data.

   Responsibilities:
     - URL routing:  ?project=<builderId | library slug> → Project Mode
                     (no ?project= → Standalone Mode: a fresh blank
                     workspace, never an error state)
     - Open Folder:  import a local project folder into Standalone Mode
                     (File System Access API + <input webkitdirectory>
                     fallback, read-only copy, refresh persistence)
     - Download:     export the current workspace as a ZIP file (all
                     modes; dependency-free STORE-method writer, zip.js)
     - Project autosave:  learnjs_project_<id>  (project mode),
                     learnjs_builder_standalone  (standalone) or
                     learnjs_builder_imported_<id>  (imported)  (localStorage)
     - File explorer (tree), tabs, create/rename/delete files
     - CodeMirror editing with plain-textarea fallback
     - Run / refresh / fullscreen / responsive preview
     - Console panel (logs, errors, warnings, check results)
     - Guided-build steps + Check + Hint (generic, project-defined;
                     hidden/explained away in standalone mode)
     - Reset to starter files (with confirmation)
     - Mobile view switching (files / code / preview)
   ============================================================ */

import {
  getBuilderProject,
  getStandaloneProject
} from "./projects.js";
import {
  buildTree,
  dirname,
  basename,
  extension,
  fileList,
  hasFile,
  isFolder,
  isHtml,
  modeFor,
  modeLabel,
  templateFor,
  typeBadge,
  validateName
} from "./vfs.js";
import { mountPreview } from "./preview.js";
import { createZip } from "./zip.js";

/* ------------------------------------------------------------
   Small DOM + toast helpers
   ------------------------------------------------------------ */
const el = (id) => document.getElementById(id);
const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

function toast(message, type) {
  const region = el("toastRegion");
  const node = document.createElement("div");
  node.className = "pb-toast show" + (type ? " " + type : "");
  node.textContent = message;
  region.appendChild(node);
  setTimeout(() => {
    node.classList.remove("show");
    setTimeout(() => node.remove(), 250);
  }, 2600);
}

/* ------------------------------------------------------------
   Inline icons (used by the JS-rendered tree + tabs)
   ------------------------------------------------------------ */
const ICONS = {
  chevron:
    '<svg class="pb-tree-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  folder:
    '<svg class="pb-tree-ico dir" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
  file:
    '<svg class="pb-tree-ico %TYPE%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5L3.5 6.6a1.5 1.5 0 0 0-.4 1V21c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V5.5c0-.3-.1-.6-.3-.8L19.3 2.3a1.5 1.5 0 0 0-1-.3Z"/><path d="M15.5 2.5V6c0 .6.4 1 1 1h3.5"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
};

const CONSOLE_ICON = {
  info: '<svg class="pb-entry-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  warn: '<svg class="pb-entry-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  error: '<svg class="pb-entry-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
  log: '<svg class="pb-entry-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>'
};

/* ------------------------------------------------------------
   State
   ------------------------------------------------------------ */
const state = {
  project: null,          // builder project definition
  files: {},              // flat map path -> content (working copy)
  storageKey: "",
  openTabs: [],           // paths, order = display order
  activePath: "",         // path currently in the editor
  selectedPath: "",       // tree selection (rename/delete target)
  entry: "index.html",    // current preview page
  history: [],            // preview navigation history
  editor: null,           // CodeMirror instance or null (textarea fallback)
  preview: null,          // preview controller (mountPreview)
  saveTimer: null,
  activeStep: 0,          // index into project.steps
  consoleCount: 0,
  dirty: new Set(),       // paths with changes not yet persisted
  collapsedFolders: new Set(), // folder paths the learner collapsed in the tree
  suppressChange: false   // set while programmatically replacing editor content
};

const SAVE_DEBOUNCE_MS = 450;

/* ------------------------------------------------------------
   Persistence
   ------------------------------------------------------------ */
/** Storage key per mode: standalone work, imported workspaces and real
    LearnJS projects all live in separate namespaces so they can never
    overwrite each other. */
function storageKeyFor(project) {
  if (project.imported) return "learnjs_builder_" + project.id; // learnjs_builder_imported_<id>
  return project.standalone
    ? "learnjs_builder_standalone"
    : "learnjs_project_" + project.id;
}

/** Load saved files, falling back to the project starter files. */
function loadSavedFiles() {
  const defaults = state.project.files || {};
  try {
    const raw = localStorage.getItem(state.storageKey);
    if (!raw) return { files: cloneFiles(defaults), entry: state.project.entryFile || "index.html" };
    const parsed = JSON.parse(raw);
    if (parsed.files && typeof parsed.files === "object") {
      // The saved map is the authoritative working set. Merge back in any
      // starter files added in a newer project version — unless the learner
      // intentionally deleted that file (tracked in parsed.deleted).
      const files = {};
      const deleted = Array.isArray(parsed.deleted) ? parsed.deleted : [];
      for (const key of Object.keys(parsed.files)) files[key] = String(parsed.files[key]);
      for (const key of Object.keys(defaults)) {
        if (files[key] === undefined && deleted.indexOf(key) === -1) {
          files[key] = defaults[key];
        }
      }
      const entry =
        typeof parsed.entry === "string" && hasFile(files, parsed.entry)
          ? parsed.entry
          : state.project.entryFile || "index.html";
      return { files, entry, deleted };
    }
    return { files: cloneFiles(defaults), entry: state.project.entryFile || "index.html", deleted: [] };
  } catch (err) {
    console.warn("[LearnJS] Could not read saved project:", err);
    return { files: cloneFiles(defaults), entry: state.project.entryFile || "index.html", deleted: [] };
  }
}

function cloneFiles(source) {
  const out = {};
  for (const key of Object.keys(source || {})) out[key] = source[key];
  return out;
}

function persistNow() {
  if (!state.storageKey) return;
  try {
    localStorage.setItem(
      state.storageKey,
      JSON.stringify({
        files: state.files,
        entry: state.entry,
        deleted: Array.from(state.deleted || []),
        name: state.project ? state.project.title : "",
        entryFile: state.project ? state.project.entryFile || "" : "",
        updatedAt: Date.now()
      })
    );
    state.dirty.clear();
    markSavedUi();
    renderTabs();
    renderTree();
  } catch (err) {
    console.warn("[LearnJS] Autosave failed (storage full?):", err);
    toast("Could not save — browser storage is full.", "error");
  }
}

function scheduleSave() {
  const path = state.activePath;
  const wasDirty = state.dirty.has(path);
  state.dirty.add(path);
  markUnsavedUi();
  // Only touch the DOM when the dirty state actually changed (keeps typing cheap).
  if (!wasDirty) {
    renderTabs();
    renderTree();
  }
  if (state.saveTimer) clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(persistNow, SAVE_DEBOUNCE_MS);
}

/* ------------------------------------------------------------
   Save-status UI
   ------------------------------------------------------------ */
function markUnsavedUi() {
  const save = el("saveStatus");
  save.classList.add("unsaved");
  el("saveLabel").textContent = "Saving…";
}

function markSavedUi() {
  const save = el("saveStatus");
  save.classList.remove("unsaved");
  el("saveLabel").textContent = "Saved";
}

/* ------------------------------------------------------------
   Editor
   ------------------------------------------------------------ */
function initEditor() {
  const host = el("editorHost");
  const textarea = el("codeInput");

  if (window.CodeMirror) {
    state.editor = window.CodeMirror.fromTextArea(textarea, {
      mode: "htmlmixed",
      lineNumbers: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      styleActiveLine: true,
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false,
      extraKeys: {
        "Ctrl-S": saveNow,
        "Cmd-S": saveNow,
        "Ctrl-Enter": runProject,
        "Cmd-Enter": runProject,
        "Ctrl-/": "toggleComment",
        "Cmd-/": "toggleComment"
      }
    });
    state.editor.on("change", () => {
      if (state.suppressChange) return;
      if (!state.activePath) return;
      state.files[state.activePath] = state.editor.getValue();
      scheduleSave();
    });
    state.editor.on("cursorActivity", updateCursorPos);
  } else {
    // Offline fallback — plain textarea.
    textarea.addEventListener("input", () => {
      if (!state.activePath) return;
      state.files[state.activePath] = textarea.value;
      scheduleSave();
    });
  }
}

function updateCursorPos(cm) {
  const pos = cm.getCursor();
  el("editorPos").textContent = "Ln " + (pos.line + 1) + ", Col " + (pos.ch + 1);
}

function saveNow() {
  if (state.saveTimer) {
    clearTimeout(state.saveTimer);
    state.saveTimer = null;
  }
  if (state.activePath && state.editor) {
    state.files[state.activePath] = state.editor.getValue();
  }
  persistNow();
  toast("Project saved", "ok");
}

function loadFileIntoEditor(path) {
  state.activePath = path;
  const content = typeof state.files[path] === "string" ? state.files[path] : "";
  el("editorFilename").textContent = path;
  el("editorMode").textContent = modeLabel(path);
  el("editorPos").textContent = "Ln 1, Col 1";
  el("codeInput").placeholder = "";

  if (state.editor) {
    const mode = modeFor(path);
    if (state.editor.getOption("mode") !== mode) state.editor.setOption("mode", mode);
    state.suppressChange = true;
    state.editor.setValue(content);
    state.suppressChange = false;
    state.editor.refresh();
    state.editor.focus();
  } else {
    el("codeInput").value = content;
    el("codeInput").focus();
  }
  renderTabs();
  renderTree();
}

/* ------------------------------------------------------------
   Tabs
   ------------------------------------------------------------ */
function openFile(path) {
  if (!hasFile(state.files, path)) return;
  // Binary assets (data URIs) are preview-only — don't dump base64 into the
  // editor. They stay selectable in the tree so they can be renamed/deleted.
  if (isDataUriValue(state.files[path])) {
    state.selectedPath = path;
    renderTree();
    toast("Binary asset — shown in the preview, not editable here.", "info");
    return;
  }
  if (state.openTabs.indexOf(path) === -1) state.openTabs.push(path);
  state.selectedPath = path;
  loadFileIntoEditor(path);
}

function closeTab(path) {
  const idx = state.openTabs.indexOf(path);
  if (idx === -1) return;
  state.openTabs.splice(idx, 1);
  if (state.activePath === path) {
    const next = state.openTabs.length
      ? state.openTabs[Math.max(0, idx - 1)]
      : "";
    if (next) loadFileIntoEditor(next);
    else {
      state.activePath = "";
      el("editorFilename").textContent = "—";
      el("editorMode").textContent = "";
      el("editorPos").textContent = "";
      el("codeInput").value = "";
      el("codeInput").placeholder = "// Select a file to edit";
      if (state.editor) {
        state.editor.setValue("");
        state.editor.setOption("mode", "htmlmixed");
      }
      renderTree();
    }
  }
  renderTabs();
}

function renderTabs() {
  const bar = el("editorTabs");
  bar.textContent = "";
  if (!state.openTabs.length) {
    bar.innerHTML = '<span class="pb-editor-tab" style="cursor:default;opacity:.55">No file open</span>';
    return;
  }
  for (const path of state.openTabs) {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "pb-editor-tab" + (path === state.activePath ? " active" : "");
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", path === state.activePath ? "true" : "false");
    tab.title = path;

    if (state.dirty.has(path)) {
      const dot = document.createElement("span");
      dot.className = "pb-tab-dot";
      dot.setAttribute("aria-label", "Unsaved changes");
      tab.appendChild(dot);
    }

    const name = document.createElement("span");
    name.textContent = basename(path);
    tab.appendChild(name);

    const close = document.createElement("span");
    close.className = "pb-tab-close";
    close.innerHTML = ICONS.close;
    close.title = "Close tab";
    close.setAttribute("role", "button");
    close.setAttribute("aria-label", "Close " + path);
    close.addEventListener("click", (e) => {
      e.stopPropagation();
      closeTab(path);
    });
    tab.appendChild(close);

    tab.addEventListener("click", () => openFile(path));
    bar.appendChild(tab);
  }
}

/* ------------------------------------------------------------
   File tree
   ------------------------------------------------------------ */
function renderTree() {
  const root = el("fileTree");
  root.textContent = "";
  const tree = buildTree(state.files);
  if (!tree.length) {
    root.innerHTML = '<div class="pb-tree-row" style="cursor:default;color:var(--pb-faint)">No files yet</div>';
    return;
  }
  for (const node of tree) root.appendChild(renderNode(node, 0));
}

function renderNode(node, depth) {
  const wrapper = document.createElement("div");
  const isFolderNode = node.type === "folder";
  const open = isFolderNode && !state.collapsedFolders.has(node.path);
  wrapper.className = "pb-tree-node" + (open ? " open" : "");
  wrapper.setAttribute("role", "treeitem");
  if (isFolderNode) {
    wrapper.setAttribute("aria-expanded", open ? "true" : "false");
  }

  const row = document.createElement("div");
  row.className =
    "pb-tree-row" +
    (node.path === state.activePath ? " active" : "") +
    (node.path === state.selectedPath && node.path !== state.activePath ? " selected" : "");
  row.style.paddingLeft = 0.5 + depth * 0.85 + "rem";

  if (isFolderNode) {
    row.innerHTML = ICONS.chevron + ICONS.folder;
    const name = document.createElement("span");
    name.className = "pb-tree-name";
    name.textContent = node.name;
    row.appendChild(name);
    row.addEventListener("click", () => {
      // Toggle collapse in state (survives tree re-renders), then repaint.
      if (state.collapsedFolders.has(node.path)) state.collapsedFolders.delete(node.path);
      else state.collapsedFolders.add(node.path);
      state.selectedPath = node.path;
      renderTree();
    });
    wrapper.appendChild(row);

    const children = document.createElement("div");
    children.className = "pb-tree-children";
    if (open) {
      for (const child of node.children) children.appendChild(renderNode(child, depth + 1));
    }
    wrapper.appendChild(children);
  } else {
    row.innerHTML = ICONS.file.replace("%TYPE%", typeBadge(node.path) || "txt");
    const name = document.createElement("span");
    name.className = "pb-tree-name";
    name.textContent = node.name;
    row.appendChild(name);
    if (state.dirty.has(node.path)) {
      const dot = document.createElement("span");
      dot.className = "pb-tree-dirty";
      dot.title = "Unsaved changes";
      row.appendChild(dot);
    }
    row.addEventListener("click", () => {
      state.selectedPath = node.path;
      openFile(node.path);
    });
    wrapper.appendChild(row);
  }
  return wrapper;
}

function syncTreeSelection() {
  // Re-render cheaply: just re-render the tree (keeps active + selected states in sync).
  renderTree();
}

/* ------------------------------------------------------------
   File operations (new / rename / delete)
   ------------------------------------------------------------ */
function parentDirForCreation() {
  const sel = state.selectedPath;
  if (!sel) return "";
  return isFolder(sel) ? sel.replace(/\/+$/, "") : dirname(sel);
}

/**
 * Validate a raw name for a new/renamed entry.
 * Returns the (possibly normalized) name, or null after toasting the error.
 * validateName() returns "" for valid file names, "name/" for valid folder
 * names (normalized), and an error message otherwise.
 */
function resolveNewName(raw, isDir) {
  const result = validateName(raw, isDir);
  if (result === "") return isDir ? raw.replace(/\/+$/, "") + "/" : raw;
  const normalized = isDir ? raw.replace(/\/+$/, "") + "/" : "";
  if (result === normalized) return result;
  toast(result, "error");
  return null;
}

function openModal({ title, text, input, confirmLabel, onConfirm }) {
  el("modalTitle").textContent = title;
  el("modalText").innerHTML = text || "";
  el("modalFieldWrap").hidden = !input;
  const inputEl = el("modalInput");
  if (input) {
    inputEl.value = input.value || "";
    inputEl.placeholder = input.placeholder || "";
  } else {
    inputEl.value = "";
  }
  el("modalCancel").textContent = "Cancel";
  el("modalConfirm").textContent = confirmLabel || "Confirm";
  el("modalBackdrop").hidden = false;
  el("modal").hidden = false;

  let settled = false;
  const finish = (result) => {
    if (settled) return;
    settled = true;
    el("modalBackdrop").hidden = true;
    el("modal").hidden = true;
    document.removeEventListener("keydown", onKey);
    onConfirm(result);
  };

  const onKey = (e) => {
    if (e.key === "Escape") finish(null);
    if (e.key === "Enter" && inputEl === document.activeElement) finish(inputEl.value.trim());
  };
  document.addEventListener("keydown", onKey);

  el("modalConfirm").onclick = () => finish(input ? inputEl.value.trim() : true);
  el("modalCancel").onclick = () => finish(null);
  el("modalBackdrop").onclick = () => finish(null);
  if (input) setTimeout(() => inputEl.focus(), 30);
}

function createFile(isDir) {
  const parent = parentDirForCreation();
  openModal({
    title: isDir ? "New folder" : "New file",
    text:
      parent
        ? 'Inside <code>' + parent + '/</code>'
        : 'At the project root',
    input: { value: "", placeholder: isDir ? "e.g. css" : "e.g. about.html" },
    confirmLabel: "Create",
    onConfirm: (raw) => {
      if (raw == null) return;
      const name = resolveNewName(raw, isDir);
      if (name === null) return; // error already toasted
      const path = parent ? parent + "/" + name : name;
      const full = isDir ? path.replace(/\/+$/, "") + "/" : path;
      if (isFolder(full) ? state.files[full] !== undefined : hasFile(state.files, full)) {
        toast("A file or folder with that name already exists.", "error");
        return;
      }
      state.files[full] = isDir ? "" : templateFor(full);
      state.selectedPath = full;
      state.dirty.add(full);
      scheduleSave();
      renderTree();
      if (!isDir) openFile(full);
      else syncTreeSelection();
      toast(isDir ? "Folder created" : "File created", "ok");
    }
  });
}

function renameSelected() {
  const target = state.selectedPath || state.activePath;
  if (!target) {
    toast("Select a file or folder to rename first.", "info");
    return;
  }
  const isDir = isFolder(target);
  openModal({
    title: "Rename " + (isDir ? "folder" : "file"),
    text: "Current name: <code>" + basename(target) + "</code>",
    input: { value: basename(target).replace(/\/+$/, ""), placeholder: "New name" },
    confirmLabel: "Rename",
    onConfirm: (raw) => {
      if (raw == null || !raw.trim()) return;
      const name = resolveNewName(raw.trim(), isDir);
      if (name === null) return; // error already toasted
      const parent = dirname(target);
      const newPath = (parent ? parent + "/" : "") + name;
      const full = isDir ? newPath.replace(/\/+$/, "") + "/" : newPath;
      if (full === target) return;
      if (isFolder(full) ? state.files[full] !== undefined : hasFile(state.files, full)) {
        toast("A file or folder with that name already exists.", "error");
        return;
      }
      movePath(target, full);
      state.dirty.add(full);
      scheduleSave();
      renderTree();
      renderTabs();
      toast("Renamed", "ok");
    }
  });
}

/** Move a file or folder (recursively) from -> to, keeping all references. */
function movePath(from, to) {
  const files = state.files;
  const moved = {};
  for (const key of Object.keys(files)) {
    if (key === from || key.startsWith(from)) {
      moved[key] = true;
      files[to + key.slice(from.length)] = files[key];
    }
  }
  for (const key of Object.keys(moved)) delete files[key];

  // Re-point tab/selection/active references.
  state.openTabs = state.openTabs.map((t) =>
    t === from || t.startsWith(from) ? to + t.slice(from.length) : t
  );
  if (state.selectedPath === from || state.selectedPath.startsWith(from)) {
    state.selectedPath = to + state.selectedPath.slice(from.length);
  }
  if (state.activePath === from || state.activePath.startsWith(from)) {
    state.activePath = to + state.activePath.slice(from.length);
  }
  if (state.entry === from || state.entry.startsWith(from)) {
    state.entry = to + state.entry.slice(from.length);
  }
}

function deleteSelected() {
  const target = state.selectedPath || state.activePath;
  if (!target) {
    toast("Select a file or folder to delete first.", "info");
    return;
  }
  const isDir = isFolder(target);
  openModal({
    title: "Delete " + (isDir ? "folder" : "file"),
    text:
      "This will permanently remove <code>" + target + "</code>" +
      (isDir ? " and everything inside it" : "") + ". You can Reset to restore the starter files.",
    confirmLabel: "Delete",
    onConfirm: (ok) => {
      if (!ok) return;
      const keys = Object.keys(state.files).filter(
        (k) => k === target || k.startsWith(target)
      );
      for (const k of keys) delete state.files[k];
      state.deleted = state.deleted || new Set();
      state.deleted.add(target); // keep it deleted across reloads
      state.openTabs = state.openTabs.filter((t) => !(t === target || t.startsWith(target)));
      state.dirty.delete(target);
      const activeGone = state.activePath === target || state.activePath.startsWith(target);
      if (activeGone) {
        // Close the deleted file's tab and fall back to another open file.
        const fallback = state.openTabs.length ? state.openTabs[state.openTabs.length - 1] : "";
        if (fallback) {
          loadFileIntoEditor(fallback);
        } else {
          state.activePath = "";
          el("editorFilename").textContent = "—";
          el("editorMode").textContent = "";
          el("editorPos").textContent = "";
          el("codeInput").value = "";
          el("codeInput").placeholder = "// Select a file to edit";
          if (state.editor) {
            state.suppressChange = true;
            state.editor.setValue("");
            state.suppressChange = false;
            state.editor.setOption("mode", "htmlmixed");
          }
        }
      }
      if (state.entry === target || state.entry.startsWith(target)) {
        // Fall back to another HTML page if the entry file was deleted.
        const remaining = fileList(state.files).filter(isHtml);
        state.entry = remaining[0] || state.project.entryFile || "index.html";
        if (state.preview) state.preview.reload(state.entry);
        updatePreviewPath();
      }
      scheduleSave();
      renderTree();
      renderTabs();
      toast("Deleted", "ok");
    }
  });
}

/* ------------------------------------------------------------
   Import / Open Folder — load a local project folder into the
   builder as a standalone workspace (read/copy only; the files on
   disk are never modified). Imports survive refresh via the
   standalone workspace pointer + their own storage namespace
   (learnjs_builder_imported_<id>), so they can never overwrite a
   registered LearnJS project's saved work.
   ------------------------------------------------------------ */
const WORKSPACE_KEY = "learnjs_builder_workspace";
const MAX_IMPORT_FILES = 500;
const MAX_IMPORT_BYTES = 1.5 * 1024 * 1024; // ~1.5 MB per text file
const IMPORT_EXT_RE = /\.(html?|css|js|mjs|json|svg|txt)$/i;
// Binary assets (images / fonts) are imported as base64 data URIs so the
// sandboxed preview can display them without a server.
const ASSET_EXT_RE = /\.(png|jpe?g|gif|webp|avif|bmp|ico|woff2?|ttf|otf|eot)$/i;
const MAX_ASSET_BYTES = 400 * 1024; // per image/font file (~533 KB base64)
// Budget on the RAW bytes: base64 is ~1.33x larger in storage, so 2.5 MB raw
// (~3.3 MB encoded) keeps autosave comfortably inside the localStorage quota.
const MAX_ASSET_TOTAL_BYTES = 2.5 * 1024 * 1024;
// Strict data-URI shape (matches exactly what the importer generates) so
// user-authored text that merely starts with "data:" is never mistaken for
// a binary asset.
const DATA_URI_RE = /^data:[a-z0-9.+-]+\/[a-z0-9.+-]+(;charset=[^;,]*)?;base64,/i;

const ASSET_MIME = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
  webp: "image/webp", avif: "image/avif", bmp: "image/bmp", ico: "image/x-icon",
  woff2: "font/woff2", woff: "font/woff", ttf: "font/ttf", otf: "font/otf",
  eot: "application/vnd.ms-fontobject"
};

function assetMimeFor(name) {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  return (m && ASSET_MIME[m[1].toLowerCase()]) || "application/octet-stream";
}

function arrayBufferToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Read a binary File into a data URI (used for images / fonts). */
async function fileToDataUri(file, mime) {
  const buf = await file.arrayBuffer();
  return "data:" + mime + ";base64," + arrayBufferToBase64(buf);
}

/** True when a VFS value is an inlined binary asset (data URI). */
function isDataUriValue(value) {
  return typeof value === "string" && DATA_URI_RE.test(value);
}

/** Decode a base64 data URI back to raw bytes (for ZIP export). */
function decodeDataUriToBytes(dataUri) {
  const comma = dataUri.indexOf(",");
  const b64 = comma === -1 ? "" : dataUri.slice(comma + 1);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

let importing = false; // guard against double-open of the picker

function generateImportId() {
  const rand =
    window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID().replace(/-/g, "").slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return "imported_" + rand;
}

function getLastWorkspaceId() {
  try {
    return localStorage.getItem(WORKSPACE_KEY) || "";
  } catch (err) {
    return "";
  }
}

function setLastWorkspaceId(id) {
  try {
    localStorage.setItem(WORKSPACE_KEY, id || "standalone");
  } catch (err) {}
}

/** Skip junk directories: hidden folders and dependency folders. */
function isImportableDir(name) {
  return !!(name && name.charAt(0) !== "." && name !== "node_modules");
}

/** Entry page: an index.html if present, otherwise the first HTML file. */
function pickEntryFile(files) {
  const htmls = fileList(files).filter(isHtml);
  const index = htmls.find((p) => basename(p) === "index.html");
  return index || htmls[0] || "";
}

/** Recursively copy a FileSystemDirectoryHandle tree into the VFS map. */
async function readDirectoryHandle(handle, prefix, files, counts) {
  for await (const entry of handle.values()) {
    const path = prefix ? prefix + "/" + entry.name : entry.name;
    if (entry.kind === "directory") {
      // Directories don't have file extensions — only skip junk folders.
      if (!isImportableDir(entry.name)) continue;
      if (counts.files >= MAX_IMPORT_FILES) break;
      files[path + "/"] = "";
      await readDirectoryHandle(entry, path, files, counts);
    } else if (entry.kind === "file") {
      if (!IMPORT_EXT_RE.test(entry.name) && !ASSET_EXT_RE.test(entry.name)) {
        counts.skipped++;
        continue;
      }
      if (counts.files >= MAX_IMPORT_FILES) break;
      let file;
      try {
        file = await entry.getFile();
      } catch (err) {
        counts.skipped++;
        continue;
      }
      if (ASSET_EXT_RE.test(entry.name)) {
        // Binary asset — inline as a data URI so the preview can use it.
        if (file.size === 0 || file.size > MAX_ASSET_BYTES || counts.assetBytes >= MAX_ASSET_TOTAL_BYTES) {
          counts.skipped++;
          continue;
        }
        try {
          files[path] = await fileToDataUri(file, assetMimeFor(entry.name));
          counts.files++;
          counts.assetBytes += file.size;
        } catch (err) {
          counts.skipped++;
        }
      } else {
        if (file.size > MAX_IMPORT_BYTES) {
          counts.skipped++;
          continue;
        }
        try {
          files[path] = await file.text();
          counts.files++;
        } catch (err) {
          counts.skipped++;
        }
      }
    }
  }
}

/** Fallback picker (browsers without the File System Access API). */
function pickViaFileInput() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.setAttribute("webkitdirectory", "");
    input.setAttribute("directory", "");
    input.multiple = true;
    input.style.display = "none";
    document.body.appendChild(input);

    let hasFiles = false;
    let settled = false;
    let safetyTimer = null;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      if (safetyTimer) clearTimeout(safetyTimer);
      window.removeEventListener("focus", onFocus);
      input.remove();
      resolve(value);
    };
    // The native dialog blurs the window; when focus returns without a
    // selection the user cancelled — do nothing (no error). The timer is a
    // safety net so the import guard can never get stuck open.
    const onFocus = () => {
      if (!hasFiles) finish(null);
    };
    safetyTimer = setTimeout(() => finish(null), 120000);

    input.addEventListener("change", async () => {
      if (!input.files || !input.files.length) return;
      hasFiles = true; // focus may fire after selection — don't cancel
      const list = Array.prototype.slice.call(input.files);
      const first = list[0];
      const rel = (first && first.webkitRelativePath) || "";
      const folderName = rel.split("/")[0] || "Imported Project";
      const files = {};
      const counts = { files: 0, skipped: 0 };
      files[folderName + "/"] = "";
      for (const file of list) {
        const parts = (file.webkitRelativePath || file.name).split("/");
        const relPath = parts.slice(1).join("/");
        const insideJunk = parts.some((p) => p.charAt(0) === "." || p === "node_modules");
        if (!relPath || insideJunk) {
          counts.skipped++;
          continue;
        }
        if (counts.files >= MAX_IMPORT_FILES) break;
        if (ASSET_EXT_RE.test(file.name)) {
          // Binary asset — inline as a data URI so the preview can use it.
          if (file.size === 0 || file.size > MAX_ASSET_BYTES || counts.assetBytes >= MAX_ASSET_TOTAL_BYTES) {
            counts.skipped++;
            continue;
          }
          try {
            files[folderName + "/" + relPath] = await fileToDataUri(file, assetMimeFor(file.name));
            counts.files++;
            counts.assetBytes += file.size;
          } catch (err) {
            counts.skipped++;
          }
        } else if (IMPORT_EXT_RE.test(file.name)) {
          if (file.size > MAX_IMPORT_BYTES) {
            counts.skipped++;
            continue;
          }
          try {
            files[folderName + "/" + relPath] = await file.text();
            counts.files++;
          } catch (err) {
            counts.skipped++;
          }
        } else {
          counts.skipped++;
        }
      }
      finish({ name: folderName, files: files, counts: counts });
    });

    window.addEventListener("focus", onFocus);
    input.click();
  });
}

/** Open the native folder picker and read the project into a VFS map.
    Returns null when the user cancels or an error was already toasted. */
async function pickProjectFolder() {
  if (window.showDirectoryPicker) {
    try {
      const handle = await window.showDirectoryPicker({ mode: "read" });
      const files = {};
      const counts = { files: 0, skipped: 0 };
      files[handle.name + "/"] = ""; // root folder marker keeps the structure
      await readDirectoryHandle(handle, handle.name, files, counts);
      return { name: handle.name, files: files, counts: counts };
    } catch (err) {
      if (err && err.name === "AbortError") return null; // cancelled — do nothing
      toast(
        err && err.name === "NotAllowedError"
          ? "Permission denied — could not read that folder."
          : "Could not open that folder: " + (err && err.message ? err.message : "unknown error"),
        "error"
      );
      return null;
    }
  }
  // Fallback for browsers without the File System Access API.
  const probe = document.createElement("input");
  if ("webkitdirectory" in probe) return pickViaFileInput();
  toast(
    "Folder selection isn't supported in this browser. Use a browser with File System Access support, or choose the folder using the fallback file picker.",
    "error"
  );
  return null;
}

/** Import a local folder as a standalone workspace (read-only copy). */
async function importProject() {
  if (importing) return;
  importing = true;
  try {
    toast("Choose a project folder to import…", "info");
    const picked = await pickProjectFolder();
    if (!picked) return; // cancelled or failed — message already shown
    if (!picked.files || !Object.keys(picked.files).length) {
      toast("That folder doesn't contain any supported files.", "error");
      return;
    }

    const id = generateImportId();
    const entry = pickEntryFile(picked.files);
    const title = picked.name || "Imported Project";
    const project = {
      id: id,
      imported: true,
      standalone: true,
      title: title,
      headerTitle: title,
      headerSub: "Imported Project",
      explorerTitle: title,
      entryFile: entry,
      description:
        "An imported local project — edits stay in this browser and never modify the files on your computer.",
      files: picked.files
    };

    // Switching workspaces: drop a previous IMPORTED workspace's saved copy
    // so old data can't pile up. A blank standalone workspace's work is left
    // in place — the standalone pointer still restores it after New Project.
    if (state.project && state.project.imported) {
      try {
        localStorage.removeItem(state.storageKey);
      } catch (err) {}
    }
    bootWorkspace(project);
    setLastWorkspaceId(id);

    if (entry) {
      const extra =
        picked.counts && picked.counts.skipped
          ? " (" + picked.counts.skipped + " unsupported/binary files skipped)"
          : "";
      toast(
        "Imported \u201C" + title + "\u201D \u2014 " + fileList(picked.files).length + " files." + extra,
        "ok"
      );
    } else {
      toast("No HTML entry file found. Add an HTML file to run this project.", "info");
    }
  } finally {
    importing = false;
  }
}

/** Leave an imported workspace and start a fresh blank standalone project. */
function newBlankProject() {
  openModal({
    title: "Start a new project?",
    text:
      "The imported workspace <code>" + (state.project.title || "") +
      "</code> will be closed, its saved copy discarded, and a blank <b>New Project</b> started.",
    confirmLabel: "New Project",
    onConfirm: (ok) => {
      if (!ok) return;
      if (state.saveTimer) {
        clearTimeout(state.saveTimer);
        state.saveTimer = null;
      }
      if (state.preview) {
        state.preview.destroy();
        state.preview = null;
      }
      el("previewEmpty").style.display = "";
      try {
        localStorage.removeItem(state.storageKey);
      } catch (err) {}
      setLastWorkspaceId("standalone");
      bootWorkspace(getStandaloneProject());
    }
  });
}

/* ------------------------------------------------------------
   Export / Download ZIP — save the current workspace to disk.
   Works in every mode: the whole virtual file system (folders
   included) is written by zip.js and offered as a download.
   ------------------------------------------------------------ */
function exportProject() {
  if (!state.project) return;
  // Flush any unsaved typing in the active editor into the working copy.
  if (state.activePath && state.editor) {
    state.files[state.activePath] = state.editor.getValue();
  }
  scheduleSave();

  if (!fileList(state.files).length) {
    toast("Nothing to export yet — add a file first.", "info");
    return;
  }

  let bytes;
  try {
    // Data-URI assets are decoded back to their raw bytes so the exported
    // ZIP contains the real binary files, not base64 text.
    const exportFiles = {};
    for (const path of Object.keys(state.files)) {
      const content = state.files[path];
      if (isDataUriValue(content)) {
        try {
          exportFiles[path] = decodeDataUriToBytes(content);
        } catch (err) {
          exportFiles[path] = content; // malformed — export as text rather than abort
        }
      } else {
        exportFiles[path] = content;
      }
    }
    bytes = createZip(exportFiles);
  } catch (err) {
    console.warn("[LearnJS] ZIP creation failed:", err);
    toast("Could not create the ZIP file.", "error");
    return;
  }

  const baseName =
    (state.project.title || "project")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project";

  const blob = new Blob([bytes], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = baseName + ".zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  toast("Downloading " + baseName + ".zip", "ok");
}

/* ------------------------------------------------------------
   Console
   ------------------------------------------------------------ */
function consoleAppend(entry) {
  const out = el("consoleOut");
  const empty = out.querySelector(".pb-console-empty");
  if (empty) empty.remove();
  out.classList.remove("collapsed");
  el("consoleToggle").setAttribute("aria-expanded", "true");

  const level = entry.level || "log";
  const row = document.createElement("div");
  row.className = "pb-console-entry " + (level === "error" ? "error" : level);

  row.innerHTML = CONSOLE_ICON[level] || CONSOLE_ICON.log;

  const body = document.createElement("div");
  body.className = "pb-entry-args";

  if (level === "clear") {
    out.textContent = "";
    state.consoleCount = 0;
    updateConsoleCount();
    return;
  }

  if (Array.isArray(entry.args)) {
    body.textContent = entry.args.join(" ");
  } else if (typeof entry.message === "string") {
    const loc = (entry.file || "") + (entry.line ? ":" + entry.line : "");
    if (loc) {
      const locSpan = document.createElement("span");
      locSpan.className = "pb-entry-file";
      locSpan.textContent = loc + " ";
      body.appendChild(locSpan);
    }
    body.appendChild(document.createTextNode(entry.name && entry.name !== "Error" ? entry.name + ": " : ""));
    body.appendChild(document.createTextNode(entry.message));
  } else if (typeof entry.text === "string") {
    body.textContent = entry.text;
  } else {
    body.textContent = "";
  }

  row.appendChild(body);
  out.appendChild(row);
  out.scrollTop = out.scrollHeight;

  if (level === "error" || level === "warn") {
    state.consoleCount++;
    updateConsoleCount();
  }
}

function updateConsoleCount() {
  const badge = el("consoleCount");
  if (state.consoleCount > 0) {
    badge.hidden = false;
    badge.textContent = String(state.consoleCount);
  } else {
    badge.hidden = true;
  }
}

function consoleClear() {
  const out = el("consoleOut");
  out.textContent = "";
  state.consoleCount = 0;
  updateConsoleCount();
  const empty = document.createElement("div");
  empty.className = "pb-console-empty";
  empty.innerHTML = "Console output appears here — try pressing <b>Run</b>.";
  out.appendChild(empty);
}

/* ------------------------------------------------------------
   Run / preview
   ------------------------------------------------------------ */
function runProject() {
  if (!state.project) return;
  // Flush the editor into the working copy before rendering.
  if (state.activePath && state.editor) {
    state.files[state.activePath] = state.editor.getValue();
  }
  scheduleSave();
  consoleClear();
  el("previewEmpty").style.display = "none";

  if (state.preview) state.preview.destroy();
  state.preview = mountPreview({
    container: el("previewStage"),
    files: state.files,
    entry: state.entry,
    onConsole: consoleAppend,
    onNavigate: (path) => navigatePreviewTo(path),
    onState: () => {}
  });
  updatePreviewPath();
}

function refreshPreview() {
  if (state.preview) {
    state.preview.reload();
    toast("Preview refreshed", "info");
  } else {
    runProject();
  }
}

function navigatePreviewTo(path) {
  if (!hasFile(state.files, path)) return;
  if (state.entry !== path) {
    state.history.push(state.entry);
    state.entry = path;
    if (state.preview) state.preview.reload(path);
    updatePreviewPath();
  }
}

function previewBack() {
  if (!state.history.length) return;
  const prev = state.history.pop();
  state.entry = prev;
  if (state.preview) state.preview.reload(prev);
  updatePreviewPath();
}

function updatePreviewPath() {
  el("previewPath").textContent = state.entry || "—";
  el("previewPath").title = state.entry ? "Current page: " + state.entry : "No entry page";
  renderEntrySelect();
}

/** Populate the Entry selector with every HTML page (shown when 2+ pages). */
function renderEntrySelect() {
  const wrap = el("entrySelectWrap");
  const sel = el("entrySelect");
  const pages = fileList(state.files).filter(isHtml);
  sel.textContent = "";
  for (const p of pages) {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    sel.appendChild(opt);
  }
  if (state.entry && pages.indexOf(state.entry) !== -1) sel.value = state.entry;
  wrap.hidden = pages.length < 2;
}

function setDeviceWidth(width) {
  const stage = el("previewStage");
  stage.classList.toggle("device-tablet", width === "tablet");
  stage.classList.toggle("device-mobile", width === "mobile");
  $$(".pb-device-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.width === width)
  );
}

function toggleFullscreen() {
  const stage = el("previewStage");
  if (!document.fullscreenElement) {
    if (stage.requestFullscreen) stage.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

/* ------------------------------------------------------------
   Guided build steps + Check + Hint
   ------------------------------------------------------------ */
function renderSteps() {
  const list = el("stepsList");
  list.textContent = "";
  const steps = state.project.steps || [];
  if (!steps.length) {
    list.innerHTML = state.project.standalone
      ? '<li class="pb-step" style="cursor:default;color:var(--pb-faint)">Blank workspace — guided steps are only available in LearnJS projects.</li>'
      : '<li class="pb-step" style="cursor:default;color:var(--pb-faint)">No steps defined for this project.</li>';
    return;
  }
  steps.forEach((step, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pb-step" + (i === state.activeStep ? " active" : "");
    btn.innerHTML =
      '<span class="pb-step-num">' + (i + 1) + "</span>" +
      '<span class="pb-step-text"><span class="pb-step-title"></span>' +
      (step.targetFile ? '<span class="pb-step-target">' + step.targetFile + "</span>" : "") +
      "</span>";
    btn.querySelector(".pb-step-title").textContent = step.title;
    btn.addEventListener("click", () => {
      state.activeStep = i;
      renderSteps();
      showStepInfo(i);
    });
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function showStepInfo(index) {
  const step = (state.project.steps || [])[index];
  if (!step) return;
  el("stepDesc").innerHTML =
    "<b>Step " + (index + 1) + "</b><br>" + (step.description || "") +
    (step.hint ? "<br><br>💡 <i>Hint:</i> " + step.hint : "");
}

function showHint() {
  const steps = state.project.steps || [];
  if (!steps.length) {
    // Standalone workspaces have no guided steps — explain instead of
    // pretending to validate an arbitrary project.
    toast(
      state.project.standalone
        ? "Blank workspace — no guided steps here. Open a LearnJS project (e.g. ?project=counter) for step-by-step building."
        : "This project has no hints yet.",
      "info"
    );
    return;
  }
  if (state.activeStep >= steps.length) state.activeStep = 0;
  const step = steps[state.activeStep];
  renderSteps();
  el("stepDesc").innerHTML =
    "<b>Hint — Step " + (state.activeStep + 1) + "</b><br>💡 " + (step.hint || "No hint available for this step.");
  // Open the Steps panel (side tab) so the hint is visible.
  switchSideTab("steps");
  toast("Hint shown in the Steps panel", "info");
}

function runChecks() {
  const checks = state.project.checks || [];
  if (!checks.length) {
    // Standalone workspaces are arbitrary user code — no predefined checks.
    toast(
      state.project.standalone
        ? "Blank workspace — nothing to check. Open a LearnJS project (e.g. ?project=counter) to run guided checks."
        : "This project has no automated checks yet.",
      "info"
    );
    return;
  }
  consoleClear();
  let passed = 0;
  checks.forEach((check) => {
    let ok = false;
    try {
      ok = !!check.test(state.files);
    } catch (err) {
      ok = false;
    }
    if (ok) passed++;
    consoleAppend({
      level: ok ? "log" : "warn",
      text: (ok ? "✓ " : "✕ ") + check.label
    });
  });
  const done = passed === checks.length;
  toast(passed + " of " + checks.length + " checks passed" + (done ? " — great job! 🎉" : ""), done ? "ok" : "info");
}

/* ------------------------------------------------------------
   Side tabs (Files / Steps)
   ------------------------------------------------------------ */
function switchSideTab(which) {
  $$(".pb-side-tab").forEach((t) => {
    const active = t.dataset.side === which;
    t.classList.toggle("active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
  el("panelFiles").hidden = which !== "files";
  el("panelSteps").hidden = which !== "steps";
}

/* ------------------------------------------------------------
   Mobile view switching
   ------------------------------------------------------------ */
function switchMobileView(view) {
  document.body.classList.remove("pb-view-files", "pb-view-code", "pb-view-preview");
  document.body.classList.add("pb-view-" + view);
  $$(".pb-mobile-tab").forEach((t) => {
    const active = t.dataset.view === view;
    t.classList.toggle("active", active);
    t.setAttribute("aria-pressed", active ? "true" : "false");
  });
  if (view === "code" && state.editor) setTimeout(() => state.editor.refresh(), 50);
}

/* ------------------------------------------------------------
   Reset
   ------------------------------------------------------------ */
function resetProject() {
  openModal({
    title: "Reset project?",
    text:
      "All your changes to <code>" + state.project.title +
      "</code> will be lost and the starter files restored. This cannot be undone.",
    confirmLabel: "Reset",
    onConfirm: (ok) => {
      if (!ok) return;
      try {
        localStorage.removeItem(state.storageKey);
      } catch (err) {}
      state.files = cloneFiles(state.project.files || {});
      state.openTabs = [];
      state.selectedPath = "";
      state.history = [];
      state.entry = state.project.entryFile || "index.html";
      state.dirty.clear();
      state.deleted = new Set();
      state.collapsedFolders.clear();
      state.activeStep = 0;
      state.consoleCount = 0;
      updateConsoleCount();
      if (state.preview) {
        state.preview.destroy();
        state.preview = null;
      }
      el("previewEmpty").style.display = "";
      loadFileIntoEditor(state.entry);
      openFile(state.entry);
      renderSteps();
      renderTree();
      renderTabs();
      markSavedUi();
      toast("Project reset to starter files", "ok");
      runProject();
    }
  });
}

/* ------------------------------------------------------------
   Error state: only an UNKNOWN ?project= id reaches this. A missing
   ?project= is not an error — it boots Standalone Mode (a fresh
   blank workspace) instead.
   ------------------------------------------------------------ */
function showNotFound() {
  el("projectTitle").textContent = "Project not found";
  el("projectSub").textContent = "LearnJS";
  el("backLink").setAttribute("href", "../Website/pages/dashboard/");
  el("pbSide").hidden = true;
  el("editorHost").innerHTML =
    '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:.75rem;color:var(--pb-muted);text-align:center;padding:2rem">' +
    "<p style='font-size:1.1rem;font-weight:700;color:var(--pb-ink)'>No such builder project</p>" +
    "<p><code>?project=&lt;id&gt;</code> must match a registered builder project. Open a project from your dashboard and choose <b>Start Building</b>.</p>" +
    '<a href="../Website/pages/dashboard/" class="pb-btn pb-btn-primary" style="text-decoration:none">Back to Dashboard</a></div>';
  $$(".pb-preview, .pb-console, .pb-mobile-tabs, #runBtn, #resetBtn, #checkBtn, #hintBtn, #downloadBtn, #downloadIconBtn").forEach((n) => {
    if (n) n.style.display = "none";
  });
}

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */
function init() {
  const param = (new URLSearchParams(window.location.search).get("project") || "").trim();

  // Mode detection — the URL query parameter decides the initial mode:
  //   ?project=<id>            → Project Mode (registered builder project)
  //   no ?project= parameter   → Standalone Mode: the last standalone
  //                              workspace (blank or imported) is restored
  //   ?project=<unknown id>    → genuine error: Project not found
  let project = null;
  if (param) {
    // getBuilderProject() resolves both builder ids and matched library slugs.
    project = getBuilderProject(param);
    if (!project) {
      showNotFound();
      return;
    }
  } else {
    project = restoreLastWorkspace();
  }

  initEditor();
  bindEvents();
  bootWorkspace(project);
}

/** Wire up all UI events once (shared by every workspace). */
function bindEvents() {
  el("runBtn").addEventListener("click", runProject);
  el("refreshBtn").addEventListener("click", refreshPreview);
  el("fullscreenBtn").addEventListener("click", toggleFullscreen);
  el("previewBackBtn").addEventListener("click", previewBack);
  el("resetBtn").addEventListener("click", resetProject);
  el("checkBtn").addEventListener("click", runChecks);
  el("hintBtn").addEventListener("click", showHint);
  el("newFileBtn").addEventListener("click", () => createFile(false));
  el("newFolderBtn").addEventListener("click", () => createFile(true));
  el("renameBtn").addEventListener("click", renameSelected);
  el("deleteBtn").addEventListener("click", deleteSelected);
  el("consoleClearBtn").addEventListener("click", consoleClear);
  el("consoleToggle").addEventListener("click", () => {
    const out = el("consoleOut");
    const collapsed = out.classList.toggle("collapsed");
    el("consoleToggle").setAttribute("aria-expanded", String(!collapsed));
  });
  el("tabFiles").addEventListener("click", () => switchSideTab("files"));
  el("tabSteps").addEventListener("click", () => switchSideTab("steps"));
  el("entrySelect").addEventListener("change", () => {
    const p = el("entrySelect").value;
    if (p && hasFile(state.files, p) && p !== state.entry) navigatePreviewTo(p);
  });
  el("openFolderBtn").addEventListener("click", importProject);
  el("openFolderIconBtn").addEventListener("click", importProject);
  el("newProjectBtn").addEventListener("click", newBlankProject);
  el("downloadBtn").addEventListener("click", exportProject);
  el("downloadIconBtn").addEventListener("click", exportProject);

  // Device widths.
  $$(".pb-device-btn").forEach((b) =>
    b.addEventListener("click", () => setDeviceWidth(b.dataset.width))
  );

  // Mobile view tabs.
  $$(".pb-mobile-tab").forEach((t) =>
    t.addEventListener("click", () => switchMobileView(t.dataset.view))
  );

  // Global keyboard: save / run / open folder. CodeMirror handles Ctrl-S /
  // Ctrl-Enter itself via extraKeys and preventDefaults the event — skip if
  // that already happened so shortcuts don't double-fire when focused.
  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) return;
    const mod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
    if (mod && e.shiftKey && key === "s") {
      e.preventDefault();
      exportProject(); // Ctrl/Cmd+Shift+S — download ZIP
    } else if (mod && key === "s") {
      e.preventDefault();
      saveNow();
    } else if (mod && e.key === "Enter") {
      e.preventDefault();
      runProject();
    } else if (mod && key === "o" && state.project && state.project.standalone) {
      e.preventDefault();
      importProject();
    }
  });

  // Flush any pending autosave when the tab is hidden.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.saveTimer) {
      clearTimeout(state.saveTimer);
      state.saveTimer = null;
      persistNow();
    }
  });
}

/** Apply a project definition to the whole UI. Used at boot and whenever the
    user switches workspaces (e.g. after importing a folder). */
function bootWorkspace(project, opts) {
  opts = opts || {};
  if (state.saveTimer) {
    clearTimeout(state.saveTimer);
    state.saveTimer = null;
  }
  if (state.preview) {
    state.preview.destroy();
    state.preview = null;
  }

  state.project = project;
  state.storageKey = storageKeyFor(project);
  const saved = loadSavedFiles();
  state.files = saved.files;
  state.deleted = new Set(saved.deleted || []);
  state.history = [];
  state.openTabs = [];
  state.selectedPath = "";
  state.activeStep = 0;
  state.consoleCount = 0;
  state.dirty.clear();
  state.collapsedFolders.clear();
  updateConsoleCount();

  // Resolve the preview entry: the saved page if it still exists, else the
  // project entry file, else the first HTML page, else none.
  const candidates = [saved.entry, project.entryFile || "", pickEntryFile(state.files)];
  state.entry = "";
  for (const c of candidates) {
    if (c && hasFile(state.files, c)) {
      state.entry = c;
      break;
    }
  }

  // Header + title (standalone shows the product name; projects and imports
  // show their own name — the sub-label carries the other half).
  el("projectTitle").textContent = project.headerTitle || project.title || "Project Builder";
  el("projectSub").textContent = project.headerSub || "Project Builder";
  document.title =
    project.standalone && !project.imported
      ? "Project Builder — LearnJS"
      : (project.title || "Project") + " — Project Builder — LearnJS";
  el("explorerTitle").textContent = project.explorerTitle || project.id;
  updateModeChrome();

  // Optional metadata.
  if (project.description) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", project.description);
  }

  // Guided steps exist only for registered learning projects.
  if (!project.standalone) {
    renderSteps();
    showStepInfo(0);
  }

  renderTree();
  if (state.entry) openFile(state.entry);
  else clearEditor();
  updatePreviewPath();

  // Auto-run once so the user immediately sees the workspace.
  if (state.entry && opts.runPreview !== false) runProject();
}

/** Show/hide the mode-dependent chrome (import buttons, Steps tab, back link). */
function updateModeChrome() {
  const project = state.project || {};
  const standalone = !!project.standalone;

  el("openFolderBtn").hidden = !standalone;
  el("openFolderIconBtn").hidden = !standalone;
  el("newProjectBtn").hidden = !project.imported;
  el("tabSteps").hidden = standalone; // no guided steps in blank/imported workspaces

  if (standalone) {
    el("backLink").setAttribute("href", "../Website/pages/dashboard/");
    el("backLink").setAttribute("aria-label", "Back to dashboard");
    el("backLink").querySelector("span").textContent = "Back to Dashboard";
  } else {
    el("backLink").setAttribute(
      "href",
      "../Website/pages/project-details/?slug=" + encodeURIComponent((project.matches && project.matches[0]) || project.id)
    );
  }
}

/** Restore the last standalone-mode workspace (blank or imported) so a
    refresh drops the user back where they were. */
function restoreLastWorkspace() {
  const lastId = getLastWorkspaceId();
  if (lastId && lastId.indexOf("imported_") === 0) {
    try {
      const raw = localStorage.getItem("learnjs_builder_" + lastId);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.files && typeof saved.files === "object") {
          return rebuildImportedProject(lastId, saved);
        }
      }
    } catch (err) {
      console.warn("[LearnJS] Could not restore imported workspace:", err);
    }
  }
  setLastWorkspaceId("standalone");
  return getStandaloneProject();
}

/** Rebuild an imported-project definition from its saved payload. */
function rebuildImportedProject(id, saved) {
  const title =
    typeof saved.name === "string" && saved.name ? saved.name : "Imported Project";
  return {
    id: id,
    imported: true,
    standalone: true,
    title: title,
    headerTitle: title,
    headerSub: "Imported Project",
    explorerTitle: title,
    entryFile: typeof saved.entryFile === "string" ? saved.entryFile : "",
    description:
      "An imported local project — edits stay in this browser and never modify the files on your computer.",
    files: saved.files || {}
  };
}

/** Clear the editor when there is nothing to open. */
function clearEditor() {
  state.activePath = "";
  el("editorFilename").textContent = "—";
  el("editorMode").textContent = "";
  el("editorPos").textContent = "";
  el("codeInput").value = "";
  el("codeInput").placeholder = "// Select a file to edit";
  if (state.editor) {
    state.suppressChange = true;
    state.editor.setValue("");
    state.suppressChange = false;
    state.editor.setOption("mode", "htmlmixed");
  }
}

init();
// end of builder.js
