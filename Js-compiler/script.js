/* ==========================================================================
   JS Playground — multi-file frontend playground (v2)
   Supports: dynamic file explorer, folders, images, project mode, save/load.
   ========================================================================== */
(() => {
  'use strict';
  var MAX_ENTRIES = 5000, RUN_TIMEOUT_MS = 10000, TOAST_MS = 2200;
  var $ = function(id) { return document.getElementById(id); };
  var clamp = function(n, min, max) { return Math.min(max, Math.max(min, n)); };

  var ICONS = {
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-5M12 8h.01"/></svg>'
  };

  var ICONS_FILE = {
    html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 20"/><path d="m19 9-7 7-7-7"/></svg>',
    css: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7l3 1 2 12 4-16 3 12"/><circle cx="18" cy="8" r="3"/></svg>',
    js: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/></svg>',
    json: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7l3 1 2 12 4-16 3 12"/><circle cx="18" cy="8" r="3"/></svg>',
    md: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7l3 1 2 12 4-16 3 12"/><circle cx="18" cy="8" r="3"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
    folderOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/></svg>'
  };

  /* --- Virtual File System --- */
  var projectFiles = {};   // { "path/to/file": "content" }
  var imageFiles = {};     // { "path/to/image.png": { dataUrl: "data:...", blob: Blob } }
  var editableExtensions = /\.(html?|css|js|json|md|txt|svg|ts|jsx|tsx)$/i;
  var imageExtensions = /\.(png|jpe?g|webp|gif|ico|bmp)$/i;
  var activeFilePath = null;
  var isProjectMode = false;

  function getFileExtension(path) {
    var m = path.match(/\.([^./]+)$/);
    return m ? m[1].toLowerCase() : '';
  }

  function getFileType(path) {
    var ext = getFileExtension(path);
    if (['html', 'htm'].indexOf(ext) !== -1) return 'html';
    if (ext === 'css') return 'css';
    if (['js', 'jsx', 'ts', 'tsx'].indexOf(ext) !== -1) return 'js';
    if (ext === 'json') return 'json';
    if (ext === 'md') return 'md';
    if (ext === 'svg') return 'svg';
    if (imageExtensions.test('.' + ext)) return 'image';
    return 'text';
  }

  function isEditable(path) {
    return editableExtensions.test(path);
  }

  /* --- Build folder tree from flat file paths --- */
  function buildFileTree(paths) {
    var tree = {};
    paths.forEach(function(path) {
      var parts = path.split('/');
      var current = tree;
      for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (i === parts.length - 1) {
          current[part] = { _type: 'file', _path: path };
        } else {
          if (!current[part]) current[part] = { _type: 'folder' };
          current = current[part];
        }
      }
    });
    return tree;
  }

  /* --- Render file explorer from tree --- */
  var expandedFolders = {};
  function renderFileExplorer() {
    var nav = $('file-list');
    if (!nav) return;
    nav.innerHTML = '';
    var paths = Object.keys(projectFiles).concat(Object.keys(imageFiles)).sort();
    if (!paths.length) return;
    var tree = buildFileTree(paths);
    renderTreeLevel(nav, tree, '');
  }

  function renderTreeLevel(container, tree, prefix) {
    var keys = Object.keys(tree).sort(function(a, b) {
      var aFolder = tree[a]._type === 'folder';
      var bFolder = tree[b]._type === 'folder';
      if (aFolder && !bFolder) return -1;
      if (!aFolder && bFolder) return 1;
      return a.localeCompare(b);
    });

    keys.forEach(function(name) {
      var node = tree[name];
      var fullPath = prefix ? prefix + '/' + name : name;

      if (node._type === 'folder') {
        var isExpanded = !!expandedFolders[fullPath];
        var folderBtn = document.createElement('button');
        folderBtn.className = 'file-item folder-item' + (isExpanded ? ' expanded' : '');
        folderBtn.setAttribute('data-folder', fullPath);
        folderBtn.setAttribute('type', 'button');
        folderBtn.innerHTML =
          '<span class="folder-chevron">' + (isExpanded ? '▾' : '▸') + '</span>' +
          '<span class="file-icon">' + (isExpanded ? ICONS.folderOpen : ICONS.folder) + '</span>' +
          '<span class="file-name">' + escapeHtml(name) + '</span>';
        folderBtn.addEventListener('click', function() {
          expandedFolders[fullPath] = !expandedFolders[fullPath];
          renderFileExplorer();
        });
        container.appendChild(folderBtn);

        if (isExpanded) {
          var subContainer = document.createElement('div');
          subContainer.className = 'file-sublist';
          container.appendChild(subContainer);
          // Build subtree for this folder
          var subTree = {};
          Object.keys(node).forEach(function(k) {
            if (k.charAt(0) !== '_') subTree[k] = node[k];
          });
          renderTreeLevel(subContainer, subTree, fullPath);
        }
      } else {
        var type = getFileType(fullPath);
        var isImage = type === 'image';
        var fileBtn = document.createElement('button');
        fileBtn.className = 'file-item' + (activeFilePath === fullPath ? ' active' : '');
        fileBtn.setAttribute('role', 'tab');
        fileBtn.setAttribute('aria-selected', activeFilePath === fullPath);
        fileBtn.setAttribute('data-filepath', fullPath);
        fileBtn.setAttribute('tabindex', activeFilePath === fullPath ? '0' : '-1');
        fileBtn.innerHTML =
          '<span class="file-icon">' + (ICONS_FILE[type] || ICONS_FILE.js) + '</span>' +
          '<span class="file-name">' + escapeHtml(name) + '</span>' +
          (isImage ? '<span class="file-badge">IMG</span>' : '');
        fileBtn.addEventListener('click', function() { switchToFile(fullPath); });
        container.appendChild(fileBtn);
      }
    });
  }

  /* --- Editor state --- */
  var editors = {};   // { path: CodeMirror instance }
  var editorContainer = null;

  function getOrCreateEditor(path) {
    if (editors[path]) return editors[path];
    var wrap = document.createElement('div');
    wrap.className = 'editor-dynamic';
    wrap.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:none;';
    editorContainer.appendChild(wrap);

    var ta = document.createElement('textarea');
    ta.spellcheck = false;
    ta.autocomplete = 'off';
    ta.autocapitalize = 'off';
    wrap.appendChild(ta);

    var mode = 'text';
    var type = getFileType(path);
    if (type === 'html') mode = 'htmlmixed';
    else if (type === 'css') mode = 'css';
    else if (type === 'js') mode = 'javascript';
    else if (type === 'json') mode = { name: 'javascript', json: true };
    else if (type === 'md') mode = 'markdown';
    else if (type === 'svg') mode = 'xml';

    var cm = CodeMirror.fromTextArea(ta, {
      mode: mode, theme: 'jplayground', lineNumbers: true,
      matchBrackets: true, autoCloseBrackets: type !== 'html',
      indentUnit: 2, tabSize: 2, indentWithTabs: false,
      styleActiveLine: true, viewportMargin: Infinity,
      extraKeys: {
        'Ctrl-Enter': function() { runCode(); },
        'Cmd-Enter': function() { runCode(); },
        'Tab': function(cm) {
          if (cm.somethingSelected()) cm.indentSelection('add');
          else cm.replaceSelection('  ', 'end');
        }
      }
    });
    cm.setValue(projectFiles[path] || '');
    cm.on('change', function() {
      projectFiles[path] = cm.getValue();
    });
    editors[path] = cm;
    return cm;
  }

  function switchToFile(path) {
    if (activeFilePath && editors[activeFilePath]) {
      editors[activeFilePath].getWrapperElement().style.display = 'none';
    }
    activeFilePath = path;
    var type = getFileType(path);

    if (type === 'image') {
      // Show image preview instead of editor
      showImagePreview(path);
    } else {
      hideImagePreview();
      var cm = getOrCreateEditor(path);
      cm.getWrapperElement().style.display = '';
      cm.refresh();
      cm.focus();
    }

    // Update UI
    var name = path.split('/').pop();
    $('editor-file-name').textContent = name;
    var dotClass = 'dot-' + (type === 'html' ? 'html' : type === 'css' ? 'css' : 'js');
    $('editor-file-dot').className = 'file-dot ' + dotClass;
    renderFileExplorer();
  }

  function showImagePreview(path) {
    var editorWrap = $('editor-wrap');
    if (!editorWrap) return;
    // Hide all editors
    editorWrap.querySelectorAll('.editor-dynamic').forEach(function(el) { el.style.display = 'none'; });
    // Show image
    var imgDiv = document.getElementById('image-preview-container');
    if (!imgDiv) {
      imgDiv = document.createElement('div');
      imgDiv.id = 'image-preview-container';
      imgDiv.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#1e1e2e;overflow:auto;padding:20px;';
      editorWrap.appendChild(imgDiv);
    }
    var imgData = imageFiles[path];
    if (imgData && imgData.dataUrl) {
      imgDiv.innerHTML = '<img src="' + imgData.dataUrl + '" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.3);">';
    } else {
      imgDiv.innerHTML = '<div style="color:#888;text-align:center;">Image preview not available</div>';
    }
    imgDiv.style.display = 'flex';
  }

  function hideImagePreview() {
    var imgDiv = document.getElementById('image-preview-container');
    if (imgDiv) imgDiv.style.display = 'none';
  }

  function getCode(path) {
    if (editors[path]) return editors[path].getValue();
    return projectFiles[path] || '';
  }

  function setCode(path, value) {
    projectFiles[path] = value;
    if (editors[path]) editors[path].setValue(value || '');
  }

  /* --- Default files (standalone mode) --- */
  var DEFAULT_HTML = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello LearnJS</h1>\n  <p>This is a practice page. Edit the HTML, CSS, and JS files, then click <strong>Run</strong>.</p>\n  <button id="btn">Click Me</button>\n</body>\n</html>';
  var DEFAULT_CSS = '/* Style your page here */\nbody {\n  font-family: "Segoe UI", system-ui, sans-serif;\n  max-width: 600px;\n  margin: 40px auto;\n  padding: 0 20px;\n  color: #1f2937;\n  background: #f9fafb;\n}\n\nh1 {\n  color: #5b5ceb;\n}\n\np {\n  line-height: 1.6;\n  margin-bottom: 20px;\n}\n\nbutton {\n  padding: 10px 24px;\n  background: #5b5ceb;\n  color: #fff;\n  border: none;\n  border-radius: 8px;\n  font-size: 15px;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n\nbutton:hover {\n  background: #4a4ad4;\n}';
  var DEFAULT_JS = '// Your JavaScript goes here!\ndocument.getElementById("btn").addEventListener("click", () => {\n  alert("Hello from LearnJS!");\n});';

  /* --- Sandbox --- */
  var state = { frame: null, watchdog: null, errors: 0, runEntries: 0 };
  var previewFrame = $('preview-frame'), previewEmpty = $('preview-empty'), previewDot = $('preview-dot');
  function showPreviewEmpty() { if (previewEmpty) previewEmpty.style.display = ''; }
  function hidePreviewEmpty() { if (previewEmpty) previewEmpty.style.display = 'none'; }
  function pulsePreview() { if (!previewDot) return; previewDot.classList.remove('pulse'); void previewDot.offsetWidth; previewDot.classList.add('pulse'); }

  function sandboxShim() {
    var send = function(t, a) { parent.postMessage({ source: 'jspg', type: t, args: a || [] }, '*'); };
    var MAX_DEPTH = 3;
    function serialize(v, d, s) {
      d = d || 0; s = s || new Set();
      if (v === null) return { kind: 'null', text: 'null' };
      var t = typeof v;
      if (t === 'undefined') return { kind: 'undefined', text: 'undefined' };
      if (t === 'string') return { kind: 'string', text: v };
      if (t === 'number') return { kind: 'number', text: String(v) };
      if (t === 'boolean') return { kind: 'boolean', text: String(v) };
      if (t === 'bigint') return { kind: 'number', text: v + 'n' };
      if (t === 'symbol') return { kind: 'symbol', text: String(v) };
      if (t === 'function') return { kind: 'function', text: '\u0192 ' + (v.name || 'anonymous') + '()' };
      if (t !== 'object') return { kind: 'other', text: String(v) };
      if (s.has(v)) return { kind: 'other', text: '[Circular]' };
      if (v instanceof Error) return { kind: 'error', text: v.name + ': ' + v.message };
      if (v instanceof Date) return { kind: 'other', text: v.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '') };
      if (v instanceof RegExp) return { kind: 'other', text: String(v) };
      if (Array.isArray(v)) {
        if (d >= MAX_DEPTH) return { kind: 'array', text: '[' + v.length + ' \u2026]' };
        s.add(v); var a = v.map(function(x) { return w(serialize(x, d+1, s)); }); s.delete(v);
        return { kind: 'array', text: '[' + a.join(', ') + ']' };
      }
      var cn = v.constructor && v.constructor.name;
      if (d >= MAX_DEPTH) return { kind: 'object', text: (cn && cn !== 'Object' ? cn + ' ' : '') + '{\u2026}' };
      s.add(v); var p = [];
      Object.keys(v).forEach(function(k) { p.push((/^[A-Za-z_$][\w$]*$/.test(k) ? k : '"' + k + '": ') + w(serialize(v[k], d+1, s))); }); s.delete(v);
      return { kind: 'object', text: (cn && cn !== 'Object' ? cn + ' ' : '') + '{' + p.join(', ') + '}' };
    }
    function w(d) { return d.kind === 'string' ? JSON.stringify(d.text) : d.text; }
    var slice = Array.prototype.slice;
    function logger(type) {
      return function() {
        send(type, slice.call(arguments).map(function(a) {
          try { return serialize(a); } catch(_) { return { kind: 'other', text: '[Unserializable]' }; }
        }));
      };
    }
    var lastErr = { text: '', t: 0 };
    function reportError(text) {
      var now = performance.now();
      if (text === lastErr.text && now - lastErr.t < 150) return;
      lastErr = { text: text, t: now };
      send('error', [{ kind: 'error', text: text }]);
    }
    window.console = {
      log: logger('log'), info: logger('info'), debug: logger('debug'),
      warn: logger('warn'), error: logger('error'),
      assert: function(c) { if (c) return; var r = slice.call(arguments, 1).map(function(a) { return serialize(a); }); send('error', [{ kind: 'error', text: 'Assertion failed' + (r.length ? ': ' + r.map(w).join(' ') : '') }]); },
      clear: function() { send('clear', []); },
      table: function(data, cols) {
        if (!Array.isArray(data) || !data.length) { send('log', [serialize(data)]); return; }
        var rows = data.map(function(r) { return (r && typeof r === 'object' && !Array.isArray(r) ? r : null); });
        if (rows.every(function(r) { return r === null; })) { send('log', [serialize(data)]); return; }
        var c = []; if (Array.isArray(cols)) cols.forEach(function(x) { c.push(String(x)); });
        rows.forEach(function(r) { if (r) Object.keys(r).forEach(function(k) { if (c.indexOf(k) === -1) c.push(k); }); });
        var mx = 1000, trunc = rows.length > mx, shown = trunc ? rows.slice(0, mx) : rows;
        send('table', [{ kind: 'table', columns: c, rows: shown.map(function(r) { return c.map(function(k) { return serialize(r ? r[k] : undefined); }); }), truncated: trunc, total: rows.length }]);
      }
    };
    window.onerror = function(msg, src, line) {
      var text = String(msg).replace(/^Uncaught /, '').replace(/^(\w+Error): Failed to execute '[^']*' on '[^']*': /, '$1: ');
      text = 'Uncaught ' + text; if (line) text += ' (line ' + line + ')'; reportError(text); return false;
    };
    window.addEventListener('unhandledrejection', function(e) { reportError('Uncaught (in promise): ' + serialize(e && e.reason).text); });
    window.addEventListener('load', function() { send('done', [{ kind: 'number', text: '0' }]); });
  }

  var SANDBOX_SRC = '(' + sandboxShim + ')();';

  function teardownSandbox() {
    if (state.watchdog) { clearTimeout(state.watchdog); state.watchdog = null; }
    if (state.frame) { state.frame.remove(); state.frame = null; showPreviewEmpty(); }
  }

  function escScript(s) { return s.replace(/<script/gi, '<\\x73cript').replace(/<\/script/gi, '<\\/script'); }
  function escStyle(s) { return s.replace(/<\/style/gi, '<\\/style'); }

  /* --- Image path resolution for preview --- */
  function resolveImagePath(src, fromPath) {
    if (!src || src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http')) return src;
    // Resolve relative to the HTML file's directory
    var htmlDir = '';
    if (fromPath && fromPath.indexOf('/') !== -1) {
      htmlDir = fromPath.substring(0, fromPath.lastIndexOf('/'));
    }
    var resolved = htmlDir ? htmlDir + '/' + src : src;
    // Normalize ../ and ./
    var parts = resolved.split('/');
    var stack = [];
    parts.forEach(function(p) {
      if (p === '..') stack.pop();
      else if (p !== '.' && p !== '') stack.push(p);
    });
    var normalized = stack.join('/');
    // Find matching image
    if (imageFiles[normalized]) return imageFiles[normalized].dataUrl;
    // Try without leading ./
    if (imageFiles[src]) return imageFiles[src].dataUrl;
    return src;
  }

  function rewriteImagePaths(html, css, htmlPath) {
    // Rewrite <img src="..."> in HTML
    var htmlRewritten = html.replace(/(<img[^>]*\ssrc=["'])([^"']+)(["'])/gi, function(match, pre, src, post) {
      var resolved = resolveImagePath(src, htmlPath);
      return pre + resolved + post;
    });
    // Rewrite url(...) in CSS
    var cssRewritten = css.replace(/url\(["']?([^"')]+)["']?\)/gi, function(match, src) {
      if (src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http')) return match;
      var resolved = resolveImagePath(src, htmlPath);
      return 'url("' + resolved + '")';
    });
    return { html: htmlRewritten, css: cssRewritten };
  }

  function buildSrcdoc(htmlCode, cssCode, jsCode) {
    var htmlPath = activeFilePath || 'index.html';
    var resolved = rewriteImagePaths(htmlCode, cssCode, htmlPath);

    var body = resolved.html;
    var bodyMatch = resolved.html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      body = bodyMatch[1];
    } else if (resolved.html.match(/<!DOCTYPE|<html/i)) {
      var stripped = resolved.html
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/<\/?html[^>]*>/gi, '')
        .replace(/<head[\s\S]*?<\/head>/gi, '')
        .replace(/<\/?body[^>]*>/gi, '');
      body = stripped.trim();
    }
    var shimScript = escScript(SANDBOX_SRC);
    var userScript = escScript(jsCode);
    var userStyle = escStyle(resolved.css);
    var parts = [];
    parts.push('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n');
    parts.push('<script>' + shimScript + '<\/script>\n');
    parts.push('<style>\n' + userStyle + '\n</style>\n');
    parts.push('</head>\n<body>\n');
    parts.push(body + '\n');
    parts.push('<script>\n' + userScript + '\n<\/script>\n');
    parts.push('</body>\n</html>');
    return parts.join('');
  }

  function runCode() {
    // Collect all editable text files
    var htmlContent = '', cssContent = '', jsContent = '';
    Object.keys(projectFiles).forEach(function(path) {
      var lower = path.toLowerCase();
      if (lower.endsWith('.html') || lower.endsWith('.htm')) htmlContent = projectFiles[path];
      else if (lower.endsWith('.css')) cssContent += '\n' + projectFiles[path];
      else if (lower.endsWith('.js') || lower.endsWith('.jsx') || lower.endsWith('.ts') || lower.endsWith('.tsx')) jsContent += '\n' + projectFiles[path];
    });

    state.errors = 0;
    state.runEntries = 0;
    clearConsole(true);
    setStatus('Running\u2026', 'running');
    closePreviewOverlay();
    teardownSandbox();

    var srcdoc = buildSrcdoc(htmlContent, cssContent, jsContent);
    var frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.title = 'Live preview \u2014 sandboxed DOM output';
    frame.tabIndex = -1;
    frame.srcdoc = srcdoc;
    state.frame = frame;
    hidePreviewEmpty();
    previewFrame.appendChild(frame);
    armWatchdog(frame, true);
  }

  function armWatchdog(frame, started) {
    if (state.watchdog) clearTimeout(state.watchdog);
    state.watchdog = setTimeout(function() {
      if (state.frame !== frame) return;
      teardownSandbox();
      addEntry('error', [{ kind: 'error', text: started ? 'Execution timed out after ' + RUN_TIMEOUT_MS / 1000 + 's (possible infinite loop).' : 'The sandbox did not start in time.' }]);
      setStatus('Timed out', 'error');
    }, RUN_TIMEOUT_MS);
  }

  /* --- Console --- */
  var consoleOut = $('console-output'), consoleEmpty = $('console-empty'), consoleCount = $('console-count');
  function isNearBottom() { return consoleOut.scrollHeight - consoleOut.scrollTop - consoleOut.clientHeight < 48; }
  function scrollToBottom() { consoleOut.scrollTop = consoleOut.scrollHeight; }
  function updateCount() { consoleCount.textContent = String(Math.max(0, consoleOut.childElementCount - 1)); }
  function showEmptyState() { consoleEmpty.style.display = ''; }
  function hideEmptyState() { consoleEmpty.style.display = 'none'; }

  function clearConsole(silent) {
    while (consoleOut.children.length > 1) consoleOut.lastElementChild.remove();
    state.runEntries = 0; updateCount();
    if (silent) hideEmptyState(); else showEmptyState();
  }

  function pushEntry(node) {
    hideEmptyState(); var nearBottom = isNearBottom();
    consoleOut.appendChild(node); updateCount();
    while (consoleOut.children.length > MAX_ENTRIES + 1) { var o = consoleOut.children[1]; if (o) o.remove(); }
    if (state.runEntries <= 80) node.classList.add('anim-in');
    state.runEntries += 1;
    if (nearBottom) scrollToBottom();
  }

  function addEntry(type, args) {
    var row = document.createElement('div');
    row.className = 'console-entry entry-' + type;
    var icon = document.createElement('span');
    icon.className = 'entry-icon'; icon.setAttribute('aria-hidden', 'true');
    if (ICONS[type]) icon.innerHTML = ICONS[type];
    row.appendChild(icon);
    var argsEl = document.createElement('span');
    argsEl.className = 'entry-args';
    (args || []).forEach(function(arg, i) {
      if (i > 0) argsEl.appendChild(document.createTextNode(' '));
      argsEl.appendChild(renderToken(arg));
    });
    row.appendChild(argsEl);
    pushEntry(row);
  }

  function renderToken(arg) {
    if (!arg || typeof arg !== 'object') { var s = document.createElement('span'); s.className = 'tok'; s.textContent = String(arg); return s; }
    if (arg.kind === 'table') return buildTable(arg);
    var s2 = document.createElement('span'); s2.className = 'tok tok-' + arg.kind; s2.textContent = arg.text; return s2;
  }

  function buildTable(payload) {
    var table = document.createElement('table'); table.className = 'console-table';
    var thead = document.createElement('thead'); var hr = document.createElement('tr');
    payload.columns.forEach(function(c) { var th = document.createElement('th'); th.textContent = String(c); hr.appendChild(th); });
    thead.appendChild(hr); table.appendChild(thead);
    var tbody = document.createElement('tbody');
    payload.rows.forEach(function(cells) {
      var tr = document.createElement('tr'); cells.forEach(function(cell) { var td = document.createElement('td'); td.appendChild(renderToken(cell)); tr.appendChild(td); }); tbody.appendChild(tr);
    });
    if (payload.truncated) {
      var tr2 = document.createElement('tr'); tr2.className = 'table-note';
      var td2 = document.createElement('td'); td2.colSpan = Math.max(1, payload.columns.length);
      td2.textContent = '\u2026 ' + (payload.total - payload.rows.length) + ' more rows';
      tr2.appendChild(td2); tbody.appendChild(tr2);
    }
    table.appendChild(tbody); return table;
  }

  window.addEventListener('message', function(event) {
    var data = event.data;
    if (!data || data.source !== 'jspg') return;
    if (!state.frame || event.source !== state.frame.contentWindow) return;
    switch (data.type) {
      case 'log': case 'info': case 'debug': case 'warn': case 'error':
        addEntry(data.type, data.args); if (data.type === 'error') state.errors += 1; break;
      case 'table': addEntry('log', data.args); break;
      case 'clear': clearConsole(false); addEntry('log', [{ kind: 'other', text: 'Console was cleared' }]); break;
      case 'done':
        if (state.watchdog) { clearTimeout(state.watchdog); state.watchdog = null; }
        pulsePreview();
        var ms = data.args && data.args[0] ? data.args[0].text : '';
        if (state.errors > 0) setStatus('Finished with ' + state.errors + ' error' + (state.errors === 1 ? '' : 's') + ' in ' + ms + ' ms', 'warn');
        else setStatus('\u2713 Executed in ' + ms + ' ms', 'ok');
        break;
    }
  });

  /* --- Toolbar --- */
  function handleReset() {
    if (!confirm('Reset all files to default?')) return;
    teardownSandbox();
    if (isProjectMode) {
      // In project mode, reset is handled by project-workspace.js
      return;
    }
    projectFiles = { 'index.html': DEFAULT_HTML, 'style.css': DEFAULT_CSS, 'script.js': DEFAULT_JS };
    imageFiles = {};
    // Dispose old editors
    Object.keys(editors).forEach(function(k) { editors[k].toTextArea(); delete editors[k]; });
    editors = {};
    // Clear dynamic editors from DOM
    if (editorContainer) editorContainer.innerHTML = '';
    expandedFolders = {};
    renderFileExplorer();
    switchToFile('index.html');
    clearConsole(false); setStatus('Ready', 'idle');
    showPreviewEmpty();
  }

  /* --- Public API for project-workspace.js --- */
  window.__playground = {
    getCode: function(key) {
      // Legacy API: 'html', 'css', 'js' or a full path
      if (key === 'html') { var h = ''; Object.keys(projectFiles).forEach(function(p) { if (p.toLowerCase().endsWith('.html')) h = projectFiles[p]; }); return h; }
      if (key === 'css') { var c = ''; Object.keys(projectFiles).forEach(function(p) { if (p.toLowerCase().endsWith('.css')) c += '\n' + projectFiles[p]; }); return c; }
      if (key === 'js') { var j = ''; Object.keys(projectFiles).forEach(function(p) { if (p.toLowerCase().endsWith('.js') || p.toLowerCase().endsWith('.jsx')) j += '\n' + projectFiles[p]; }); return j; }
      return projectFiles[key] || '';
    },
    setCode: function(key, value) {
      if (key === 'html') { projectFiles['index.html'] = value; }
      else if (key === 'css') { projectFiles['style.css'] = value; }
      else if (key === 'js') { projectFiles['script.js'] = value; }
      else { projectFiles[key] = value; }
      if (editors[key]) editors[key].setValue(value || '');
    },
    setProjectFiles: function(files, images) {
      projectFiles = files || {};
      imageFiles = images || {};
      // Dispose old editors
      Object.keys(editors).forEach(function(k) { editors[k].toTextArea(); delete editors[k]; });
      editors = {};
      if (editorContainer) editorContainer.innerHTML = '';
      expandedFolders = {};
      // Auto-expand root folders
      Object.keys(projectFiles).forEach(function(path) {
        var parts = path.split('/');
        if (parts.length > 1) expandedFolders[parts[0]] = true;
      });
      renderFileExplorer();
      // Open the first HTML file
      var firstHtml = Object.keys(projectFiles).find(function(p) { return p.toLowerCase().endsWith('.html'); });
      if (firstHtml) switchToFile(firstHtml);
      else if (Object.keys(projectFiles).length) switchToFile(Object.keys(projectFiles)[0]);
    },
    getAllFiles: function() { return Object.assign({}, projectFiles); },
    getImageFiles: function() { return imageFiles; },
    runCode: runCode,
    switchToFile: switchToFile
  };

  /* --- UI --- */
  var toastTimer = null;
  function showToast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(function() { t.classList.remove('show'); }, TOAST_MS); }

  function escapeHtml(s) { var div = document.createElement('div'); div.textContent = s; return div.innerHTML; }

  function initVerticalSplitter() {
    var main = $('main'), editorPane = $('editor-pane'), splitter = $('splitter-v'), explorer = $('file-explorer'), dragging = false;
    function setW(px) { var total = main.clientWidth - splitter.offsetWidth - explorer.offsetWidth; var w = clamp(px, 200, total - 200); editorPane.style.flexBasis = w + 'px'; editorPane.style.flexGrow = '0'; editorPane.style.flexShrink = '0'; Object.values(editors).forEach(function(f) { if (f) f.refresh(); }); }
    splitter.addEventListener('pointerdown', function(e) { dragging = true; splitter.setPointerCapture(e.pointerId); splitter.classList.add('active'); e.preventDefault(); });
    splitter.addEventListener('pointermove', function(e) { if (!dragging) return; setW(e.clientX - main.getBoundingClientRect().left - explorer.getBoundingClientRect().width); });
    var stop = function() { if (!dragging) return; dragging = false; splitter.classList.remove('active'); };
    splitter.addEventListener('pointerup', stop); splitter.addEventListener('pointercancel', stop);
    splitter.addEventListener('keydown', function(e) { var s = e.shiftKey ? 60 : 20; if (e.key === 'ArrowLeft') { setW(editorPane.offsetWidth - s); e.preventDefault(); } else if (e.key === 'ArrowRight') { setW(editorPane.offsetWidth + s); e.preventDefault(); } });
  }

  function initHorizontalSplitter() {
    var rp = $('right-panel'), pp = $('preview-pane'), splitter = $('splitter-h'), dragging = false;
    function setH(px) { var total = rp.clientHeight - splitter.offsetHeight; var h = clamp(px, 80, total - 80); pp.style.flexBasis = h + 'px'; pp.style.flexGrow = '0'; pp.style.flexShrink = '0'; }
    splitter.addEventListener('pointerdown', function(e) { dragging = true; splitter.setPointerCapture(e.pointerId); splitter.classList.add('active'); e.preventDefault(); });
    splitter.addEventListener('pointermove', function(e) { if (!dragging) return; setH(e.clientY - rp.getBoundingClientRect().top); });
    var stop = function() { if (!dragging) return; dragging = false; splitter.classList.remove('active'); };
    splitter.addEventListener('pointerup', stop); splitter.addEventListener('pointercancel', stop);
    splitter.addEventListener('keydown', function(e) { var s = e.shiftKey ? 60 : 20; if (e.key === 'ArrowUp') { setH(pp.offsetHeight - s); e.preventDefault(); } else if (e.key === 'ArrowDown') { setH(pp.offsetHeight + s); e.preventDefault(); } });
  }

  function setStatus(text, mode) { var el = $('status-right'); el.textContent = text; el.className = 'status-' + (mode || 'idle'); }

  function initStatusBar() {
    var editorPos = $('editor-pos');
    function sync() {
      if (!activeFilePath || getFileType(activeFilePath) === 'image') return;
      var cm = editors[activeFilePath];
      var cur = cm ? cm.getCursor() : null;
      if (editorPos) editorPos.textContent = cur ? 'Ln ' + (cur.line + 1) + ', Col ' + (cur.ch + 1) : '';
    }
    // Will be called when editors are created
    Object.values(editors).forEach(function(f) { if (f) f.on('cursorActivity', sync); }); sync();
  }

  function initThemeToggle() {
    var btn = $('btn-theme'); if (!btn) return;
    btn.addEventListener('click', function() {
      var root = document.documentElement, next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next); try { localStorage.setItem('jspg:theme', next); } catch(_) {}
    });
  }

  function closePreviewOverlay() {
    var o = $('preview-overlay'); if (!o || !o.classList.contains('open')) return;
    o.classList.remove('open'); var fh = $('preview-overlay-frame'); var f = fh && fh.querySelector('iframe');
    if (f && previewFrame) previewFrame.appendChild(f);
  }

  function initPreviewHeader() {
    var refresh = $('btn-preview-refresh'), expand = $('btn-preview-expand'), overlay = $('preview-overlay'), closeBtn = $('btn-preview-close');
    if (refresh) refresh.addEventListener('click', function() { runCode(); });
    if (expand && overlay) expand.addEventListener('click', function() {
      var frame = previewFrame.querySelector('iframe');
      if (!frame) { showToast('Run your code to see a live preview.'); return; }
      var fh = $('preview-overlay-frame'); if (fh) fh.appendChild(frame);
      overlay.classList.add('open'); if (closeBtn) closeBtn.focus();
    });
    if (overlay) {
      if (closeBtn) closeBtn.addEventListener('click', closePreviewOverlay);
      overlay.addEventListener('pointerdown', function(e) { if (e.target === overlay) closePreviewOverlay(); });
      document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && overlay.classList.contains('open')) closePreviewOverlay(); });
    }
  }

  function initShortcuts() {
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runCode(); }
    });
  }

  function init() {
    editorContainer = $('editor-wrap');

    $('btn-run').addEventListener('click', runCode);
    $('btn-reset').addEventListener('click', handleReset);
    $('btn-console-clear').addEventListener('click', function() { clearConsole(false); });
    $('btn-console-clear-inline').addEventListener('click', function() { clearConsole(false); });

    /* --- URL parameter support --- */
    var params = new URLSearchParams(window.location.search);
    var jsParam = params.get('js');
    var titleParam = params.get('title');
    if (titleParam) document.title = decodeURIComponent(titleParam) + ' \u2014 JS Playground';

    // Check for project mode
    var projectParam = params.get('project');
    if (projectParam) {
      isProjectMode = true;
      // project-workspace.js will handle loading files
      // Set up empty state for now
      projectFiles = {};
      imageFiles = {};
      renderFileExplorer();
      setStatus('Loading project\u2026', 'running');
    } else if (jsParam) {
      setCode('script.js', decodeURIComponent(jsParam));
      projectFiles = { 'index.html': DEFAULT_HTML, 'style.css': DEFAULT_CSS, 'script.js': decodeURIComponent(jsParam) };
      renderFileExplorer();
      switchToFile('script.js');
    } else {
      projectFiles = { 'index.html': DEFAULT_HTML, 'style.css': DEFAULT_CSS, 'script.js': DEFAULT_JS };
      renderFileExplorer();
      switchToFile('index.html');
    }

    initVerticalSplitter(); initHorizontalSplitter(); initStatusBar(); initShortcuts(); initThemeToggle(); initPreviewHeader();
    if (activeFilePath && !editors[activeFilePath]) switchToFile(activeFilePath);
    showEmptyState(); setStatus('Ready', 'idle');
    var rt = null;
    window.addEventListener('resize', function() { clearTimeout(rt); rt = setTimeout(function() { Object.values(editors).forEach(function(f) { if (f) f.refresh(); }); }, 120); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
