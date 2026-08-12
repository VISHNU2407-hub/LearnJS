/* ============================================================
   LearnJS — preview.js (Project-Builder)
   Sandboxed live preview for the Project Builder.

   Responsibilities:
     - Build a single HTML document from the project's virtual file
       system: the current HTML page is used as-is, linked CSS is
       inlined into <style>, linked JS is inlined into <script>
       (with //# sourceURL so errors report the right file).
     - Execute it inside a sandboxed <iframe> (allow-scripts only
       security surface — never allow-same-origin). Learner code
       never runs on the parent page.
     - Capture console.log/error/warn + runtime errors via an
       injected shim that talks to the parent with postMessage.
     - Support multi-page projects: clicking an internal link
       resolves against the virtual FS and asks the parent to
       re-render with that page as the entry (each HTML file stays
       an independent page — nothing is concatenated).
     - Infinite-loop watchdog: if the page doesn't finish loading
       in time, the frame is torn down and an error is reported.

   This module is UI-free and reuses vfs.js for path math.
   ============================================================ */

import { resolvePath, dirname, isHtml } from "./vfs.js";

const MSG_SOURCE = "learnjs-preview";
const WATCHDOG_MS = 10000;

/** True for references the browser should load itself (not project files). */
function isExternalRef(ref) {
  return (
    typeof ref !== "string" ||
    !ref ||
    /^[a-z][a-z0-9+.-]*:/i.test(ref) ||
    ref.indexOf("//") === 0 ||
    ref.charAt(0) === "#"
  );
}

/* ------------------------------------------------------------
   srcdoc builder
   ------------------------------------------------------------ */

/** Escape a string that will be embedded inside an inline <style>. */
function escStyle(text) {
  return String(text).replace(/<\/style/gi, "<\\/style");
}

/** Escape a string that will be embedded inside an inline <script>. */
function escScript(text) {
  return String(text).replace(/<\/script/gi, "<\\/script");
}

/**
 * Resolve a relative reference (href/src) from the current page.
 * Returns a project path or "" when the reference is external.
 */
function resolveRef(currentPath, ref) {
  if (isExternalRef(ref)) return "";
  const clean = ref.split(/[?#]/)[0];
  return resolvePath(currentPath, clean);
}

/* ------------------------------------------------------------
   Binary asset inlining (images / fonts).

   Imported binary files live in the virtual FS as data URIs. When
   the preview renders, any reference that resolves to such a value
   is rewritten to the data URI itself, so the sandboxed iframe can
   display images and use fonts without a server. References that
   resolve to HTML pages (multi-page navigation), external URLs and
   missing files are left untouched.
   ------------------------------------------------------------ */

/** True when a VFS value is an inlined binary asset (data URI). */
function isDataUriValue(value) {
  return typeof value === "string" && value.indexOf("data:") === 0;
}

/**
 * Resolve `ref` from `fromPath` to an inlinable asset value.
 * Returns a data URI (or a UTF-8 svg encoded as one), or "" when the
 * target is missing or is not an asset.
 */
const MAX_INLINE_SVG_CHARS = 200 * 1024; // avoid bloating the srcdoc

function resolveAssetValue(files, fromPath, ref) {
  if (isExternalRef(ref)) return "";
  const target = resolvePath(fromPath, ref);
  const value = files[target];
  if (isDataUriValue(value)) return value;
  // Text-imported svg files can be inlined as data URIs too.
  if (typeof value === "string" && /\.svg$/i.test(target) && value.length <= MAX_INLINE_SVG_CHARS) {
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(value);
  }
  return "";
}

/** Rewrite url(...) references in CSS text, resolved from `fromPath`. */
function rewriteCssUrls(css, fromPath, files) {
  return String(css).replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (m, quote, ref) => {
    ref = ref.trim();
    if (!ref) return m;
    const value = resolveAssetValue(files, fromPath, ref);
    return value ? "url(" + value + ")" : m;
  });
}

/** Rewrite one HTML attribute whose value is a single reference. */
function rewriteAttr(attrs, name, resolve) {
  const re = new RegExp(
    "\\b" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))",
    "gi"
  );
  return attrs.replace(re, (m, dq, sq, bare) => {
    const value = dq != null ? dq : sq != null ? sq : bare;
    if (!value || value.charAt(0) === "#" || isExternalRef(value)) return m;
    const replacement = resolve(value);
    if (!replacement) return m;
    // Preserve the original quoting; wrap bare values in double quotes.
    const quote = dq != null ? '"' : sq != null ? "'" : '"';
    return name + "=" + quote + replacement + quote;
  });
}

/** Rewrite a srcset attribute (multiple space-separated candidates). */
function rewriteSrcset(srcset, entry, files) {
  return srcset
    .split(",")
    .map((part) => {
      part = part.trim();
      if (!part) return part;
      const tokens = part.split(/\s+/);
      const value = resolveAssetValue(files, entry, tokens[0]);
      if (!value) return part;
      return value + (tokens[1] ? " " + tokens.slice(1).join(" ") : "");
    })
    .join(", ");
}

/**
 * Rewrite every binary-asset reference in the built document: CSS
 * url() inside <style> blocks (resolved against the style's own
 * directory, tracked via data-file for inlined stylesheets) and
 * inline style attributes, plus src / srcset / poster / href
 * attributes. <a href> links are never rewritten, so multi-page
 * navigation keeps working.
 */
function inlineAssetRefs(html, entry, files) {
  let doc = html;

  // CSS inside <style> blocks. Blocks injected from linked stylesheets
  // carry data-file="<path>" so their url() refs resolve relative to the
  // stylesheet; original inline <style> blocks resolve against the page.
  doc = doc.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (m, attrs, css) => {
    const df = /\bdata-file\s*=\s*"([^"]+)"/i.exec(attrs);
    return "<style" + attrs + ">" + rewriteCssUrls(css, df ? df[1] : entry, files) + "</style>";
  });

  // Inline style="..." attributes resolve against the page.
  doc = doc.replace(/\sstyle=("([^"]*)"|'([^']*)')/gi, (m, all, dq, sq) => {
    const style = dq != null ? dq : sq;
    return " style=\"" + rewriteCssUrls(style, entry, files) + "\"";
  });

  // src / srcset / poster on any element; href only on elements where it
  // is not navigation (link, svg use/image). script/style/textarea bodies
  // are skipped wholesale so user JS, CSS and text are never touched.
  doc = doc.replace(
    /<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<textarea\b[^>]*>[\s\S]*?<\/textarea>|(<[a-zA-Z][a-zA-Z0-9:.-]*[^>]*>)/gi,
    (m, tag) => {
      if (!tag) return m; // element body — leave untouched
      const nameMatch = /^<([a-zA-Z][a-zA-Z0-9:.-]*)/.exec(tag);
      const tagName = nameMatch ? nameMatch[1] : "";
      const attrs = tag.slice(tagName.length + 1, tag.length - 1);
      if (attrs.indexOf("=") === -1) return tag; // no attributes — fast path
      let out = attrs;
      out = rewriteAttr(out, "src", (ref) => resolveAssetValue(files, entry, ref));
      out = rewriteAttr(out, "poster", (ref) => resolveAssetValue(files, entry, ref));
      out = rewriteAttr(out, "srcset", (ref) => rewriteSrcset(ref, entry, files));
      const lower = tagName.toLowerCase();
      if (lower === "link" || lower === "use" || lower === "image") {
        out = rewriteAttr(out, "href", (ref) => resolveAssetValue(files, entry, ref));
      }
      return "<" + tagName + out + ">";
    }
  );

  return doc;
}

/**
 * Turn the current HTML page + the whole virtual FS into one
 * self-contained document. Inlines <link rel=stylesheet> and
 * <script src> that point at project files; injects the console
 * shim and the navigation shim.
 *
 * @param {Object}   files  flat virtual FS map
 * @param {string}   entry  current page path (e.g. "index.html")
 * @returns {{html: string, warnings: string[]}}
 */
export function buildPreviewHtml({ files, entry }) {
  const warnings = [];
  const source = typeof files[entry] === "string" ? files[entry] : null;

  if (source == null) {
    warnings.push("Entry file not found: " + entry);
    return { html: "<!DOCTYPE html><html><body><p>Entry file missing.</p></body></html>", warnings };
  }

  const pageDir = dirname(entry);
  const pages = Object.keys(files).filter((p) => isHtml(p));
  const htmlPages = pages.map((p) => p).sort();

  /* ---- inline linked stylesheets ---- */
  let doc = source.replace(/<link\b[^>]*>/gi, (tag) => {
    const href = /\bhref\s*=\s*["']([^"']+)["']/i.exec(tag);
    const rel = /\brel\s*=\s*["']([^"']*)["']/i.exec(tag);
    if (!href || !rel || rel[1].toLowerCase().indexOf("stylesheet") === -1) return tag;
    // External URLs (CDN, fonts) are left for the browser to load — not
    // project files, so never warn about them.
    if (isExternalRef(href[1])) return tag;
    const target = resolveRef(entry, href[1]);
    const css = typeof files[target] === "string" ? files[target] : null;
    if (css == null) {
      warnings.push("Missing stylesheet: " + href[1]);
      return tag;
    }
    return '<style data-file="' + target + '">\n' + escStyle(css) + "\n</style>";
  });

  /* ---- inline linked scripts ---- */
  // Only the opening tag is scanned for src= so JavaScript string literals
  // like "src='x'" inside an inline <script> body are never misread.
  doc = doc.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (m, openAttrs, body) => {
    const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(openAttrs);
    if (!src) return m; // inline script — leave untouched
    // External URLs (CDN libraries) are left for the browser to load — not
    // project files, so never warn about them.
    if (isExternalRef(src[1])) return m;
    const target = resolveRef(entry, src[1]);
    const js = typeof files[target] === "string" ? files[target] : null;
    if (js == null) {
      warnings.push("Missing script: " + src[1]);
      return m;
    }
    return (
      "<script data-file=\"" + target + "\">\n" +
      "//# sourceURL=" + target + "\n" +
      escScript(js) +
      "\n</script>"
    );
  });

  /* ---- inline binary assets (images / fonts) as data URIs ---- */
  doc = inlineAssetRefs(doc, entry, files);

  /* ---- inject shims before </head> (or prepend if no head) ---- */
  const shims =
    "<script>\n" + consoleShimSource() + "\n</script>\n" +
    "<script>\n" + navigationShimSource({ baseDir: pageDir, pages: htmlPages }) + "\n</script>\n";

  if (/<\/head>/i.test(doc)) {
    doc = doc.replace(/<\/head>/i, shims + "</head>");
  } else {
    doc = shims + doc;
  }

  return { html: doc, warnings };
}

/* ------------------------------------------------------------
   Injected shims (strings — executed only inside the sandbox)
   ------------------------------------------------------------ */

/** Self-contained console + error shim. */
function consoleShimSource() {
  return `(function () {
  var SRC = ${JSON.stringify(MSG_SOURCE)};

  function send(type, data) {
    try { parent.postMessage({ source: SRC, type: type, data: data }, "*"); }
    catch (e) { /* parent gone — ignore */ }
  }

  function serialize(value, depth, seen) {
    depth = depth || 0;
    seen = seen || new Set();
    if (value === null) return "null";
    var t = typeof value;
    if (t === "undefined") return "undefined";
    if (t === "string") return value;
    if (t === "number" || t === "boolean" || t === "bigint") return String(value);
    if (t === "function") return "ƒ " + (value.name || "anonymous") + "()";
    if (t === "symbol") return value.toString();
    if (t === "object") {
      if (seen.has(value)) return "[Circular]";
      if (value instanceof Error) return value.name + ": " + value.message;
      if (value instanceof Date) return value.toISOString().replace("T", " ").replace(/\\.\\d{3}Z$/, "");
      if (depth >= 3) return "…";
      seen.add(value);
      var out;
      if (Array.isArray(value)) {
        out = "[" + value.map(function (v) { return JSON.stringify(serialize(v, depth + 1, seen)); }).join(", ") + "]";
      } else {
        out = "{ " + Object.keys(value).map(function (k) {
          return k + ": " + JSON.stringify(serialize(value[k], depth + 1, seen));
        }).join(", ") + " }";
      }
      seen["delete"](value);
      return out;
    }
    return String(value);
  }

  function wrap(method) {
    var orig = console[method] && console[method].bind(console);
    return function () {
      var args = Array.prototype.slice.call(arguments).map(function (a) { return serialize(a); });
      send("console", { level: method === "debug" ? "log" : method, args: args });
      if (orig) { try { orig.apply(console, arguments); } catch (e) {} }
    };
  }

  ["log", "info", "warn", "error", "debug"].forEach(function (m) { console[m] = wrap(m); });
  var origClear = console.clear && console.clear.bind(console);
  console.clear = function () {
    send("clear", {});
    if (origClear) { try { origClear(); } catch (e) {} }
  };

  window.onerror = function (message, source, line, col, error) {
    var file = String(source || "").replace(/^about:srcdoc/, "");
    send("error", {
      message: String(message),
      file: file,
      line: line || 0,
      column: col || 0,
      name: (error && error.name) || "Error"
    });
    return false; // let the console still show it
  };

  window.addEventListener("unhandledrejection", function (e) {
    var r = e && e.reason;
    send("error", {
      message: "Uncaught (in promise): " + serialize(r),
      file: "",
      line: 0,
      column: 0,
      name: "UnhandledRejection"
    });
  });

  send("ready", {});
})();
`;
}

/** Self-contained internal-navigation shim. */
function navigationShimSource({ baseDir, pages }) {
  const config = {
    baseDir: baseDir || "",
    pages: pages
  };
  return `(function () {
  var SRC = ${JSON.stringify(MSG_SOURCE)};
  var CFG = ${JSON.stringify(config)};

  function norm(p) {
    var out = [];
    String(p).split("/").forEach(function (part) {
      if (!part || part === ".") return;
      if (part === "..") { out.pop(); return; }
      out.push(part);
    });
    return out.join("/");
  }

  function resolve(ref) {
    if (!ref) return "";
    if (/^[a-z][a-z0-9+.-]*:/i.test(ref) || ref.charAt(0) === "#") return "";
    var clean = ref.split(/[?#]/)[0];
    var combined = CFG.baseDir ? CFG.baseDir + "/" + clean : clean;
    return norm(combined);
  }

  function go(p) {
    if (!p || CFG.pages.indexOf(p) === -1) return false;
    try { parent.postMessage({ source: SRC, type: "navigate", data: { path: p } }, "*"); } catch (e) {}
    return true;
  }

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) return;
    if (href.charAt(0) === "#") return;
    var target = a.getAttribute("target") || "";
    if (target === "_blank") return;
    var p = resolve(href);
    if (go(p)) e.preventDefault();
  }, true);

  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (!f || !f.tagName || f.tagName.toLowerCase() !== "form") return;
    var action = f.getAttribute("action") || "";
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(action)) return;
    var p = resolve(action);
    if (go(p)) e.preventDefault();
  }, true);
})();
`;
}

/* ------------------------------------------------------------
   Sandboxed frame lifecycle
   ------------------------------------------------------------ */

/**
 * Mount a sandboxed preview iframe for the given entry page.
 * Returns { reload, destroy }.
 *
 * @param {Object}   opts
 * @param {Element}  opts.container   parent element for the iframe
 * @param {Object}   opts.files       virtual FS (read at render time)
 * @param {string}   opts.entry       current page path
 * @param {Function} opts.onConsole   (entry {level, args|message, ...})
 * @param {Function} opts.onNavigate  (path) — internal page change request
 * @param {Function} opts.onState     (state "loading" | "ready" | "timeout")
 */
export function mountPreview({ container, files, entry, onConsole, onNavigate, onState }) {
  let frame = null;
  let watchdog = null;
  let loaded = false;
  let destroyed = false;

  function clearWatchdog() {
    if (watchdog) {
      clearTimeout(watchdog);
      watchdog = null;
    }
  }

  function handleMessage(event) {
    if (destroyed || !frame || event.source !== frame.contentWindow) return;
    const data = event.data;
    if (!data || data.source !== MSG_SOURCE) return;
    switch (data.type) {
      case "console":
        onConsole && onConsole(data.data);
        break;
      case "error":
        onConsole && onConsole(data.data);
        break;
      case "clear":
        onConsole && onConsole({ level: "clear" });
        break;
      case "navigate":
        if (data.data && data.data.path && onNavigate) onNavigate(data.data.path);
        break;
      case "ready":
        break; // informational — "running" is announced on load
    }
  }

  function onFrameLoad() {
    clearWatchdog();
    if (destroyed) return;
    loaded = true;
    onConsole && onConsole({ level: "info", text: "Project running — " + entry });
    onState && onState("ready");
  }

  function build() {
    const { html, warnings } = buildPreviewHtml({ files, entry });
    warnings.forEach((w) => onConsole && onConsole({ level: "warn", text: w }));

    if (frame) frame.remove();
    frame = document.createElement("iframe");
    frame.className = "bld-preview-frame";
    // allow-scripts ONLY isolates learner code from the parent page.
    // allow-same-origin is deliberately absent (opaque origin).
    frame.setAttribute("sandbox", "allow-scripts allow-modals allow-popups allow-forms");
    frame.setAttribute("title", "Live preview");
    frame.setAttribute("aria-label", "Live project preview");
    container.appendChild(frame);

    loaded = false;
    frame.addEventListener("load", onFrameLoad);
    frame.srcdoc = html;

    clearWatchdog();
    watchdog = setTimeout(() => {
      if (loaded || destroyed) return;
      destroyFrame(true);
      onConsole && onConsole({
        level: "error",
        message: "Execution timed out after " + Math.round(WATCHDOG_MS / 1000) + "s — possible infinite loop.",
        file: "",
        line: 0,
        column: 0,
        name: "Timeout"
      });
      onState && onState("timeout");
    }, WATCHDOG_MS);
  }

  function destroyFrame(silent) {
    clearWatchdog();
    if (frame) {
      frame.remove();
      frame = null;
    }
    if (!silent) onState && onState("destroyed");
  }

  build();
  window.addEventListener("message", handleMessage);

  return {
    /** Rebuild the frame (new entry or refreshed files). */
    reload(nextEntry) {
      if (nextEntry) entry = nextEntry;
      build();
    },
    /** Tear down the preview entirely. */
    destroy() {
      destroyed = true;
      window.removeEventListener("message", handleMessage);
      destroyFrame(true);
    }
  };
}
// end of preview.js
