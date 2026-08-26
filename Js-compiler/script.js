/* ==========================================================================
   JS Playground — multi-file frontend playground
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

  var DEFAULT_HTML = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello LearnJS</h1>\n  <p>This is a practice page. Edit the HTML, CSS, and JS files, then click <strong>Run</strong>.</p>\n  <button id="btn">Click Me</button>\n</body>\n</html>';
  var DEFAULT_CSS = '/* Style your page here */\nbody {\n  font-family: "Segoe UI", system-ui, sans-serif;\n  max-width: 600px;\n  margin: 40px auto;\n  padding: 0 20px;\n  color: #1f2937;\n  background: #f9fafb;\n}\n\nh1 {\n  color: #5b5ceb;\n}\n\np {\n  line-height: 1.6;\n  margin-bottom: 20px;\n}\n\nbutton {\n  padding: 10px 24px;\n  background: #5b5ceb;\n  color: #fff;\n  border: none;\n  border-radius: 8px;\n  font-size: 15px;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n\nbutton:hover {\n  background: #4a4ad4;\n}';
  var DEFAULT_JS = '// Your JavaScript goes here!\ndocument.getElementById("btn").addEventListener("click", () => {\n  alert("Hello from LearnJS!");\n});';

  /* --- Multi-file state --- */
  var files = {
    html: { textarea: $('code-html'), editor: null, mode: 'htmlmixed', dot: 'dot-html' },
    css:  { textarea: $('code-css'),  editor: null, mode: 'css',       dot: 'dot-css' },
    js:   { textarea: $('code-js'),   editor: null, mode: 'javascript', dot: 'dot-js' }
  };
  var activeFile = 'html';

  Object.keys(files).forEach(function(key) {
    var f = files[key];
    if (typeof CodeMirror !== 'undefined') {
      f.editor = CodeMirror.fromTextArea(f.textarea, {
        mode: f.mode, theme: 'jplayground', lineNumbers: true,
        matchBrackets: true, autoCloseBrackets: key !== 'html',
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
      f.textarea.style.display = 'none';
    }
  });

  function getCode(key) { key = key || activeFile; var f = files[key]; return f.editor ? f.editor.getValue() : f.textarea.value; }
  function setCode(key, value) { var f = files[key]; if (f.editor) f.editor.setValue(value); else f.textarea.value = value; }
  function getAllCode() { return { html: getCode('html'), css: getCode('css'), js: getCode('js') }; }

  function switchToFile(key) {
    if (key === activeFile) return;
    files[activeFile].editor.getWrapperElement().style.display = 'none';
    activeFile = key;
    files[key].editor.getWrapperElement().style.display = '';
    files[key].editor.refresh();
    files[key].editor.focus();
    document.querySelectorAll('.file-item').forEach(function(btn) {
      var isActive = btn.dataset.file === key;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive);
      btn.tabIndex = isActive ? 0 : -1;
    });
    var names = { html: 'index.html', css: 'style.css', js: 'script.js' };
    $('editor-file-name').textContent = names[key];
    $('editor-file-dot').className = 'file-dot ' + files[key].dot;
  }

  document.querySelectorAll('.file-item').forEach(function(btn) {
    btn.addEventListener('click', function() { switchToFile(btn.dataset.file); });
    btn.addEventListener('keydown', function(e) {
      var items = Array.from(document.querySelectorAll('.file-item'));
      var idx = items.indexOf(btn);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault(); var next = items[(idx + 1) % items.length]; next.focus(); switchToFile(next.dataset.file);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault(); var prev = items[(idx - 1 + items.length) % items.length]; prev.focus(); switchToFile(prev.dataset.file);
      }
    });
  });

  /* --- Sandbox --- */
  var state = { frame: null, watchdog: null, errors: 0, runEntries: 0 };
  var previewFrame = $('preview-frame'), previewEmpty = $('preview-empty'), previewDot = $('preview-dot');
  function showPreviewEmpty() { if (previewEmpty) previewEmpty.style.display = ''; }
  function hidePreviewEmpty() { if (previewEmpty) previewEmpty.style.display = 'none'; }
  function pulsePreview() { if (!previewDot) return; previewDot.classList.remove('pulse'); void previewDot.offsetWidth; previewDot.classList.add('pulse'); }

  /* Console shim - self-contained function. Sets up error/console interception. */
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
      Object.keys(v).forEach(function(k) { p.push((/^[A-Za-z_$][\w$]*$/.test(k) ? k : '"' + k + '": ') + w(serialize(v[k], d+1, s))); });
      s.delete(v);
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
      text = 'Uncaught ' + text; if (line) text += ' (line ' + line + ')';
      reportError(text); return false;
    };
    window.addEventListener('unhandledrejection', function(e) { reportError('Uncaught (in promise): ' + serialize(e && e.reason).text); });
    window.addEventListener('load', function() { send('done', [{ kind: 'number', text: '0' }]); });
  }

  var SANDBOX_SRC = '(' + sandboxShim + ')();';

  function teardownSandbox() {
    if (state.watchdog) { clearTimeout(state.watchdog); state.watchdog = null; }
    if (state.frame) { state.frame.remove(); state.frame = null; showPreviewEmpty(); }
  }

  function escScript(s) { return s.replace(/<script/gi, '<\x73cript').replace(/<\/script/gi, '<\\/script'); }
  function escStyle(s) { return s.replace(/<\/style/gi, '<\\/style'); }

  function buildSrcdoc(htmlCode, cssCode, jsCode) {
    var body = htmlCode;
    var bodyMatch = htmlCode.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      body = bodyMatch[1];
    } else if (htmlCode.match(/<!DOCTYPE|<html/i)) {
      var stripped = htmlCode
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/<\/?html[^>]*>/gi, '')
        .replace(/<head[\s\S]*?<\/head>/gi, '')
        .replace(/<\/?body[^>]*>/gi, '');
      body = stripped.trim();
    }
    var shimScript = escScript(SANDBOX_SRC);
    var userScript = escScript(jsCode);
    var userStyle = escStyle(cssCode);
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
    var code = getAllCode();
    state.errors = 0;
    state.runEntries = 0;
    clearConsole(true);
    setStatus('Running\u2026', 'running');
    closePreviewOverlay();
    teardownSandbox();

    var srcdoc = buildSrcdoc(code.html, code.css, code.js);
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

  /* --- Console rendering --- */
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
    hideEmptyState();
    var nearBottom = isNearBottom();
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
      var tr = document.createElement('tr');
      cells.forEach(function(cell) { var td = document.createElement('td'); td.appendChild(renderToken(cell)); tr.appendChild(td); });
      tbody.appendChild(tr);
    });
    if (payload.truncated) {
      var tr2 = document.createElement('tr'); tr2.className = 'table-note';
      var td2 = document.createElement('td'); td2.colSpan = Math.max(1, payload.columns.length);
      td2.textContent = '\u2026 ' + (payload.total - payload.rows.length) + ' more rows';
      tr2.appendChild(td2); tbody.appendChild(tr2);
    }
    table.appendChild(tbody);
    return table;
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
    if (getCode('html') !== DEFAULT_HTML || getCode('css') !== DEFAULT_CSS || getCode('js') !== DEFAULT_JS) {
      if (!confirm('Reset all files to default starter code?')) return;
    }
    teardownSandbox(); setCode('html', DEFAULT_HTML); setCode('css', DEFAULT_CSS); setCode('js', DEFAULT_JS);
    clearConsole(false); setStatus('Ready', 'idle');
    if (files[activeFile].editor) files[activeFile].editor.focus();
    showPreviewEmpty();
  }

  /* --- UI --- */
  var toastTimer = null;
  function showToast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(function() { t.classList.remove('show'); }, TOAST_MS); }

  function initVerticalSplitter() {
    var main = $('main'), editorPane = $('editor-pane'), splitter = $('splitter-v'), explorer = $('file-explorer'), dragging = false;
    function setW(px) { var total = main.clientWidth - splitter.offsetWidth - explorer.offsetWidth; var w = clamp(px, 200, total - 200); editorPane.style.flexBasis = w + 'px'; editorPane.style.flexGrow = '0'; editorPane.style.flexShrink = '0'; Object.values(files).forEach(function(f) { if (f.editor) f.editor.refresh(); }); }
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
    function sync() { var cur = files[activeFile].editor ? files[activeFile].editor.getCursor() : null; if (editorPos) editorPos.textContent = cur ? 'Ln ' + (cur.line + 1) + ', Col ' + (cur.ch + 1) : ''; }
    Object.values(files).forEach(function(f) { if (f.editor) f.editor.on('cursorActivity', sync); }); sync();
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
    document.addEventListener('keydown', function(e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === '1') { e.preventDefault(); switchToFile('html'); }
      if (e.key === '2') { e.preventDefault(); switchToFile('css'); }
      if (e.key === '3') { e.preventDefault(); switchToFile('js'); }
    });
  }

  function init() {
    $('btn-run').addEventListener('click', runCode);
    $('btn-reset').addEventListener('click', handleReset);
    $('btn-console-clear').addEventListener('click', function() { clearConsole(false); });
    $('btn-console-clear-inline').addEventListener('click', function() { clearConsole(false); });

    /* --- URL parameter support ---
       ?js=...   pre-fills the JS editor (URL-encoded)
       ?title=... sets the page title
       Example: index.html?js=console.log(%22hello%22);
    */
    var params = new URLSearchParams(window.location.search);
    var jsParam = params.get('js');
    var titleParam = params.get('title');
    if (titleParam) document.title = decodeURIComponent(titleParam) + ' — JS Playground';
    if (jsParam) {
      setCode('js', decodeURIComponent(jsParam));
      switchToFile('js');
    } else {
      setCode('html', DEFAULT_HTML); setCode('css', DEFAULT_CSS); setCode('js', DEFAULT_JS);
      switchToFile('html');
    }
    Object.keys(files).forEach(function(key) { if (files[key].editor) files[key].editor.getWrapperElement().style.display = key === activeFile ? '' : 'none'; });
    initVerticalSplitter(); initHorizontalSplitter(); initStatusBar(); initShortcuts(); initThemeToggle(); initPreviewHeader();
    if (files[activeFile].editor) files[activeFile].editor.focus();
    showEmptyState(); setStatus('Ready', 'idle');
    var rt = null;
    window.addEventListener('resize', function() { clearTimeout(rt); rt = setTimeout(function() { Object.values(files).forEach(function(f) { if (f.editor) f.editor.refresh(); }); }, 120); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
