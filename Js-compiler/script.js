/* ==========================================================================
   JS Playground — application logic
   --------------------------------------------------------------------------
   Structure
     1.  Constants & helpers
     2.  CodeMirror editor setup
     3.  Sandboxed execution (sandboxed <iframe>, code via postMessage — no eval)
     4.  Console rendering (DevTools-like output)
     5.  Toolbar actions (Run / Clear / Reset / Copy / Download)
     6.  Toast, splitter, status bar, keyboard shortcuts
     7.  Init
   ========================================================================== */

(() => {
  'use strict';

  /* =======================================================================
   * 1. Constants & helpers
   * ==================================================================== */

  const DEFAULT_CODE = 'console.log("Hello, World!");';
  const MAX_ENTRIES = 5000;        // hard cap on DOM console entries (memory safety)
  const RUN_TIMEOUT_MS = 10000;    // watchdog for infinite synchronous loops
  const TOAST_MS = 2200;
  const SANDBOX_SRC = '(' + sandboxShim + ')();';

  const $ = (id) => document.getElementById(id);
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const ICONS = {
    warn:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    error:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
    info:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-5M12 8h.01"/></svg>',
  };

  /* =======================================================================
   * 2. CodeMirror editor setup
   * ==================================================================== */

  const codeInput = $('code-input');
  const editor = typeof CodeMirror !== 'undefined'
    ? CodeMirror.fromTextArea(codeInput, {
        mode: 'javascript',
        theme: 'jplayground',
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        indentWithTabs: false,
        styleActiveLine: true,
        viewportMargin: Infinity,
        extraKeys: { 'Ctrl-Enter': runCode, 'Cmd-Enter': runCode },
      })
    : null;

  // Editor accessors — fall back to the plain <textarea> if CodeMirror is missing.
  const getCode = () => (editor ? editor.getValue() : codeInput.value);
  const setCode = (value) => (editor ? editor.setValue(value) : (codeInput.value = value));

  /* =======================================================================
   * 3. Sandboxed execution
   * ----------------------------------------------------------------------
   * User code runs inside a fresh <iframe sandbox="allow-scripts">.
   *   - The iframe has an opaque origin, so it cannot reach our page,
   *     localStorage, cookies or the network in any meaningful way.
   *   - A shim replaces `console` inside the sandbox and forwards every
   *     call (plus uncaught errors) to us via postMessage.
   *   - The user's code is delivered to the sandbox via postMessage and
   *     executed there — never through eval() or new Function() here.
   *   - A fresh iframe is created per run and destroyed afterwards, so no
   *     state or event listeners leak between runs.
   * ==================================================================== */

  const state = {
    frame: null,      // the active sandboxed iframe
    pendingCode: '',  // the code waiting to be sent to the sandbox
    watchdog: null,   // timeout id for the infinite-loop guard
    errors: 0,        // error entries produced by the current run
    runEntries: 0,    // entries appended during the current run (for animation)
  };

  // Live Preview panel — the sandboxed iframe is shown here (it was previously
  // kept hidden in <body>), plus an empty-state hint and a "live" indicator.
  const previewFrame = $('preview-frame');
  const previewEmpty = $('preview-empty');
  const previewDot = $('preview-dot');

  function showPreviewEmpty() {
    if (previewEmpty) previewEmpty.style.display = '';
  }
  function hidePreviewEmpty() {
    if (previewEmpty) previewEmpty.style.display = 'none';
  }
  function pulsePreview() {
    if (!previewDot) return;
    previewDot.classList.remove('pulse');
    void previewDot.offsetWidth; // restart the CSS animation
    previewDot.classList.add('pulse');
  }

  /**
   * Injected into the sandbox. Must be fully self-contained (no closures over
   * our scope) — it is serialized with toString() and evaluated in the iframe.
   */
  function sandboxShim() {
    const send = (type, args) => {
      parent.postMessage({ source: 'jspg', type: type, args: args || [] }, '*');
    };

    const MAX_DEPTH = 3;

    // Serialize a value into a small { kind, text } descriptor the parent
    // renders with DevTools-like colours. Handles cycles, depth limits, and
    // common built-ins (Date, RegExp, Map, Set, typed arrays, DOM nodes).
    function serialize(value, depth, seen) {
      depth = depth || 0;
      seen = seen || new Set();

      if (value === null) return { kind: 'null', text: 'null' };

      const t = typeof value;
      switch (t) {
        case 'undefined': return { kind: 'undefined', text: 'undefined' };
        case 'string':    return { kind: 'string', text: value };
        case 'number':    return { kind: 'number', text: String(value) };
        case 'boolean':   return { kind: 'boolean', text: String(value) };
        case 'bigint':    return { kind: 'number', text: value + 'n' };
        case 'symbol':    return { kind: 'symbol', text: String(value) };
        case 'function':  return { kind: 'function', text: '\u0192 ' + (value.name || 'anonymous') + '()' };
      }
      if (t !== 'object') return { kind: 'other', text: String(value) };

      if (seen.has(value)) return { kind: 'other', text: '[Circular]' };

      if (value instanceof Error) return { kind: 'error', text: value.name + ': ' + value.message };
      if (value instanceof Date) {
        return { kind: 'other', text: value.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '') };
      }
      if (value instanceof RegExp) return { kind: 'other', text: String(value) };

      if (typeof Map !== 'undefined' && value instanceof Map) {
        if (depth >= MAX_DEPTH) return { kind: 'other', text: 'Map(' + value.size + ') {\u2026}' };
        seen.add(value);
        const items = [];
        value.forEach((v, k) => {
          items.push(serialize(k, depth + 1, seen).text + ' => ' + serialize(v, depth + 1, seen).text);
        });
        seen.delete(value);
        return { kind: 'other', text: 'Map(' + value.size + ') {' + items.join(', ') + '}' };
      }
      if (typeof Set !== 'undefined' && value instanceof Set) {
        if (depth >= MAX_DEPTH) return { kind: 'other', text: 'Set(' + value.size + ') {\u2026}' };
        seen.add(value);
        const items = [];
        value.forEach((v) => items.push(serialize(v, depth + 1, seen).text));
        seen.delete(value);
        return { kind: 'other', text: 'Set(' + value.size + ') {' + items.join(', ') + '}' };
      }
      if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(value)) {
        const ctor = value.constructor.name;
        if (depth >= MAX_DEPTH) return { kind: 'array', text: ctor + '(' + value.length + ') [\u2026]' };
        seen.add(value);
        const items = Array.from(value).map((v) => serialize(v, depth + 1, seen).text);
        seen.delete(value);
        return { kind: 'array', text: ctor + '(' + value.length + ') [' + items.join(', ') + ']' };
      }
      if (typeof Element !== 'undefined' && value instanceof Element) {
        const id = value.id ? '#' + value.id : '';
        const cls = typeof value.className === 'string' && value.className
          ? '.' + value.className.split(/\s+/)[0]
          : '';
        return { kind: 'other', text: '<' + value.tagName.toLowerCase() + id + cls + '>' };
      }

      if (Array.isArray(value)) {
        if (depth >= MAX_DEPTH) return { kind: 'array', text: '[' + value.length + ' \u2026]' };
        seen.add(value);
        const items = value.map((v) => wrap(serialize(v, depth + 1, seen)));
        seen.delete(value);
        return { kind: 'array', text: '[' + items.join(', ') + ']' };
      }

      // Plain objects (and class instances)
      const ctorName = value.constructor && value.constructor.name;
      if (depth >= MAX_DEPTH) {
        return { kind: 'object', text: (ctorName && ctorName !== 'Object' ? ctorName + ' ' : '') + '{\u2026}' };
      }
      seen.add(value);
      const parts = [];
      for (const key of Object.keys(value)) {
        const prettyKey = /^[A-Za-z_$][\w$]*$/.test(key) ? key : '"' + key + '"';
        parts.push(prettyKey + ': ' + wrap(serialize(value[key], depth + 1, seen)));
      }
      seen.delete(value);
      const head = ctorName && ctorName !== 'Object' ? ctorName + ' ' : '';
      return { kind: 'object', text: head + '{' + parts.join(', ') + '}' };
    }

    // Strings get quoted when nested inside arrays/objects (like DevTools).
    function wrap(descriptor) {
      return descriptor.kind === 'string' ? JSON.stringify(descriptor.text) : descriptor.text;
    }

    const slice = Array.prototype.slice;

    function logger(type) {
      return function () {
        send(type, slice.call(arguments).map((a) => {
          try {
            return serialize(a);
          } catch (_) {
            // e.g. hostile Proxy objects that throw on access
            return { kind: 'other', text: '[Unserializable value]' };
          }
        }));
      };
    }

    // Deduplicate identical errors posted within a short window. Without this,
    // a syntax error could be reported twice (Chrome reports parse errors via
    // window.onerror, Firefox throws from appendChild — some engines do both).
    let lastError = { text: '', t: 0 };
    function reportError(text) {
      const now = performance.now();
      if (text === lastError.text && now - lastError.t < 150) return;
      lastError = { text: text, t: now };
      send('error', [{ kind: 'error', text: text }]);
    }

    // Replace console inside the sandbox. The real console is left untouched
    // (the iframe has no visible DevTools anyway) — everything is forwarded.
    window.console = {
      log: logger('log'),
      info: logger('info'),
      debug: logger('debug'),
      warn: logger('warn'),
      error: logger('error'),
      assert: function (condition) {
        if (condition) return;
        const rest = slice.call(arguments, 1).map((a) => serialize(a));
        const tail = rest.length ? ': ' + rest.map(wrap).join(' ') : '';
        send('error', [{ kind: 'error', text: 'Assertion failed' + tail }]);
      },
      clear: function () {
        send('clear', []);
      },
      table: function (data, columns) {
        if (!Array.isArray(data) || !data.length) {
          send('log', [serialize(data)]);
          return;
        }
        const rows = data.map((r) => (r && typeof r === 'object' && !Array.isArray(r) ? r : null));
        if (rows.every((r) => r === null)) {
          send('log', [serialize(data)]);
          return;
        }
        const cols = [];
        if (Array.isArray(columns)) {
          columns.forEach((c) => cols.push(String(c)));
        }
        rows.forEach((r) => {
          if (!r) return;
          Object.keys(r).forEach((k) => {
            if (cols.indexOf(k) === -1) cols.push(k);
          });
        });
        // Cap the rows that reach the DOM so a giant table can't freeze the page.
        const MAX_TABLE_ROWS = 1000;
        const truncated = rows.length > MAX_TABLE_ROWS;
        const shown = truncated ? rows.slice(0, MAX_TABLE_ROWS) : rows;
        send('table', [{
          kind: 'table',
          columns: cols,
          rows: shown.map((r) => cols.map((c) => serialize(r ? r[c] : undefined))),
          truncated: truncated,
          total: rows.length,
        }]);
      },
    };

    // Report uncaught runtime + syntax errors from the user code.
    window.onerror = function (msg, src, line, col) {
      // Chrome wraps parse errors in an appendChild DOMException — unwrap it
      // for a cleaner DevTools-style message, e.g.
      // "Uncaught SyntaxError: missing ) after argument list".
      let text = String(msg)
        .replace(/^Uncaught /, '')
        .replace(/^(\w+Error): Failed to execute '[^']*' on '[^']*': /, '$1: ');
      text = 'Uncaught ' + text;
      if (line) text += ' (line ' + line + ')';
      reportError(text);
      return false;
    };
    window.addEventListener('unhandledrejection', function (e) {
      const reason = e && e.reason;
      reportError('Uncaught (in promise): ' + serialize(reason).text);
    });

    // Receives the user's code from the parent and executes it in this
    // sandbox. Posting the code avoids both blob-URL origin restrictions
    // (blobs are origin-bound; the sandbox has an opaque origin) and
    // inline-script escaping problems entirely.
    window.addEventListener('message', function (e) {
      const data = e.data;
      if (!data || data.source !== 'jspg' || data.type !== 'run') return;
      if (e.source !== window.parent) return;

      const execStart = performance.now();
      try {
        const script = document.createElement('script');
        script.textContent = data.code;
        document.body.appendChild(script);
      } catch (err) {
        // A parse error may surface as a synchronous throw from appendChild
        // (Chrome/Firefox); window.onerror reports it too in some browsers.
        const clean = String(err.message).replace(/^Failed to execute '[^']*' on '[^']*': /, '');
        reportError('Uncaught ' + err.name + ': ' + clean);
      }
      send('done', [{ kind: 'number', text: String(Math.round(performance.now() - execStart)) }]);
    });

    // Tell the parent we are listening and ready to receive code.
    send('ready', []);
  }

  function teardownSandbox() {
    if (state.watchdog) {
      clearTimeout(state.watchdog);
      state.watchdog = null;
    }
    if (state.frame) {
      state.frame.remove();
      state.frame = null;
      showPreviewEmpty();
    }
  }

  /** Execute the current editor contents inside a fresh sandbox. */
  function runCode() {
    const code = getCode();
    state.errors = 0;
    state.runEntries = 0;
    clearConsole(true);
    setStatus('Running\u2026', 'running');
    closePreviewOverlay(); // a fresh run starts with a fresh sandbox frame

    teardownSandbox();

    // The sandbox runs only the shim. The user's code is delivered afterwards
    // via postMessage (once the shim signals 'ready') and executed there —
    // never through eval() / new Function() in our page. The iframe lives in
    // the Live Preview panel, so DOM changes made by the code are visible.
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.title = 'Live preview — sandboxed DOM output';
    frame.tabIndex = -1;
    frame.srcdoc =
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
      // Escape any "</script" inside the shim source so the HTML parser
      // can never terminate the script element early.
      '<script>' + SANDBOX_SRC.replace(/<\/script/gi, '<\\/script') + '</script>' +
      '</body></html>';

    state.frame = frame;
    state.pendingCode = code;
    hidePreviewEmpty();
    previewFrame.appendChild(frame);

    // First watchdog phase: the sandbox must signal 'ready'. Re-armed with
    // `started: true` once the code is actually handed over, so a slow
    // iframe spawn never kills legitimate code.
    armWatchdog(frame, false);
  }

  /**
   * Infinite-loop guard. A synchronous loop blocks the sandboxed iframe but
   * never us — under site isolation, cross-origin (opaque-origin) iframes run
   * in a separate renderer process, so the parent stays responsive and can
   * simply tear the iframe down. (Without process isolation, a `while(true)`
   * would freeze the whole tab — that trade-off is inherent to the iframe
   * approach the spec permits; a Web Worker would be the stricter alternative.)
   */
  function armWatchdog(frame, started) {
    if (state.watchdog) clearTimeout(state.watchdog);
    state.watchdog = setTimeout(() => {
      if (state.frame !== frame) return;
      teardownSandbox();
      addEntry('error', [{
        kind: 'error',
        text: started
          ? 'Execution timed out after ' + RUN_TIMEOUT_MS / 1000 + 's (possible infinite loop).'
          : 'The sandbox did not start in time. Please try again.',
      }]);
      setStatus('Timed out', 'error');
    }, RUN_TIMEOUT_MS);
  }

  /* =======================================================================
   * 4. Console rendering
   * ==================================================================== */

  const consoleOut = $('console-output');
  const consoleEmpty = $('console-empty');
  const consoleCount = $('console-count');

  function isNearBottom() {
    return consoleOut.scrollHeight - consoleOut.scrollTop - consoleOut.clientHeight < 48;
  }

  function scrollToBottom() {
    consoleOut.scrollTop = consoleOut.scrollHeight;
  }

  function updateCount() {
    const n = consoleOut.childElementCount - 1; // minus the empty-state node
    consoleCount.textContent = String(Math.max(0, n));
  }

  function showEmptyState() {
    consoleEmpty.style.display = '';
  }

  function hideEmptyState() {
    consoleEmpty.style.display = 'none';
  }

  /**
   * Clear the console panel.
   * The empty-state hint node is kept (it is always child #0) — only actual
   * entries are removed. silent = don't re-show the hint.
   */
  function clearConsole(silent) {
    while (consoleOut.children.length > 1) {
      consoleOut.lastElementChild.remove();
    }
    state.runEntries = 0;
    updateCount();
    if (silent) hideEmptyState();
    else showEmptyState();
  }

  function pushEntry(node) {
    hideEmptyState();
    const nearBottom = isNearBottom();
    consoleOut.appendChild(node);
    updateCount();

    // Keep the DOM bounded (memory safety on massive outputs). Child #0 is
    // the hidden empty-state hint, so we evict the oldest *entry* from #1.
    while (consoleOut.children.length > MAX_ENTRIES + 1) {
      const oldest = consoleOut.children[1];
      if (oldest) oldest.remove();
    }

    // Animate only small batches so heavy output stays smooth.
    if (state.runEntries <= 80) node.classList.add('anim-in');
    state.runEntries += 1;

    if (nearBottom) scrollToBottom();
  }

  /** Append one console entry of a given type with serialized args. */
  function addEntry(type, args) {
    const row = document.createElement('div');
    row.className = 'console-entry entry-' + type;

    const icon = document.createElement('span');
    icon.className = 'entry-icon';
    icon.setAttribute('aria-hidden', 'true');
    if (ICONS[type]) icon.innerHTML = ICONS[type];
    row.appendChild(icon);

    const argsEl = document.createElement('span');
    argsEl.className = 'entry-args';
    (args || []).forEach((arg, i) => {
      if (i > 0) argsEl.appendChild(document.createTextNode(' '));
      argsEl.appendChild(renderToken(arg));
    });
    row.appendChild(argsEl);

    pushEntry(row);
  }

  /** Render one serialized value into a coloured token span. */
  function renderToken(arg) {
    if (!arg || typeof arg !== 'object') {
      const span = document.createElement('span');
      span.className = 'tok';
      span.textContent = String(arg);
      return span;
    }
    if (arg.kind === 'table') return buildTable(arg);

    const span = document.createElement('span');
    span.className = 'tok tok-' + arg.kind;
    span.textContent = arg.text;
    return span;
  }

  /** Build a <table> for console.table() output. */
  function buildTable(payload) {
    const table = document.createElement('table');
    table.className = 'console-table';

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    payload.columns.forEach((col) => {
      const th = document.createElement('th');
      th.textContent = String(col);
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    payload.rows.forEach((cells) => {
      const tr = document.createElement('tr');
      cells.forEach((cell) => {
        const td = document.createElement('td');
        td.appendChild(renderToken(cell));
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    if (payload.truncated) {
      const tr = document.createElement('tr');
      tr.className = 'table-note';
      const td = document.createElement('td');
      td.colSpan = Math.max(1, payload.columns.length);
      td.textContent = '\u2026 ' + (payload.total - payload.rows.length) + ' more rows not shown';
      tr.appendChild(td);
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    return table;
  }

  // Messages from the sandbox. Ignore anything that isn't ours or comes from
  // a stale (already torn-down) frame.
  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || data.source !== 'jspg') return;
    if (!state.frame || event.source !== state.frame.contentWindow) return;

    switch (data.type) {
      case 'log':
      case 'info':
      case 'debug':
      case 'warn':
      case 'error':
        addEntry(data.type, data.args);
        if (data.type === 'error') state.errors += 1;
        break;
      case 'table':
        addEntry('log', data.args);
        break;
      case 'clear':
        clearConsole(false);
        addEntry('log', [{ kind: 'other', text: 'Console was cleared' }]);
        break;
      case 'ready': {
        // Sandbox is listening — hand it the code and arm the execution
        // watchdog (time starts when user code actually runs).
        if (state.frame && event.source === state.frame.contentWindow) {
          armWatchdog(state.frame, true);
          event.source.postMessage({ source: 'jspg', type: 'run', code: state.pendingCode }, '*');
        }
        break;
      }
      case 'done': {
        if (state.watchdog) {
          clearTimeout(state.watchdog);
          state.watchdog = null;
        }
        pulsePreview(); // the sandbox has finished — flash the live indicator
        const ms = data.args && data.args[0] ? data.args[0].text : '';
        if (state.errors > 0) {
          setStatus('Finished with ' + state.errors + ' error' + (state.errors === 1 ? '' : 's') + ' in ' + ms + ' ms', 'warn');
        } else {
          setStatus('\u2713 Executed in ' + ms + ' ms', 'ok');
        }
        break;
      }
    }
  });

  /* =======================================================================
   * 5. Toolbar actions
   * ==================================================================== */

  function handleClear() {
    teardownSandbox(); // stop any still-running user code (e.g. setInterval)
    setCode('');
    clearConsole(false);
    setStatus('Ready', 'idle');
    if (editor) editor.focus();
  }

  function handleReset() {
    teardownSandbox(); // stop any still-running user code
    setCode(DEFAULT_CODE);
    clearConsole(false);
    setStatus('Ready', 'idle');
    if (editor) {
      editor.focus();
      editor.setCursor({ line: 0, ch: DEFAULT_CODE.length });
    }
  }

  async function handleCopy() {
    const code = getCode();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        fallbackCopy(code);
      }
    } catch (_) {
      fallbackCopy(code);
    }
    showToast('Code copied successfully!');
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (_) {
      /* ignore */
    }
    ta.remove();
  }

  function handleDownload() {
    const code = getCode();
    const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Downloading script.js\u2026');
  }

  /* =======================================================================
   * 6. Toast, splitter, status bar, keyboard
   * ==================================================================== */

  let toastTimer = null;
  function showToast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), TOAST_MS);
  }

  // Draggable splitter between editor and console (persists the preference).
  function initSplitter() {
    const main = $('main');
    const editorPane = $('editor-pane');
    const splitter = $('splitter');

    let dragging = false;

    const setEditorHeight = (px) => {
      const max = main.clientHeight - 140;
      const h = clamp(px, 120, max);
      editorPane.style.height = h + 'px';
      if (editor) editor.refresh();
    };

    splitter.addEventListener('pointerdown', (e) => {
      dragging = true;
      splitter.setPointerCapture(e.pointerId);
      splitter.classList.add('active');
      e.preventDefault();
    });
    splitter.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const rect = main.getBoundingClientRect();
      setEditorHeight(e.clientY - rect.top - splitter.offsetHeight / 2);
    });
    const stopDrag = () => {
      if (!dragging) return;
      dragging = false;
      splitter.classList.remove('active');
      try {
        localStorage.setItem('jspg:split', String(editorPane.offsetHeight));
      } catch (_) {
        /* ignore */
      }
    };
    splitter.addEventListener('pointerup', stopDrag);
    splitter.addEventListener('pointercancel', stopDrag);

    // Keyboard resizing for accessibility.
    splitter.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 60 : 20;
      if (e.key === 'ArrowUp') {
        setEditorHeight(editorPane.offsetHeight - step);
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        setEditorHeight(editorPane.offsetHeight + step);
        e.preventDefault();
      }
    });

    try {
      const saved = localStorage.getItem('jspg:split');
      if (saved) setEditorHeight(parseInt(saved, 10));
    } catch (_) {
      /* ignore */
    }
  }

  function setStatus(text, mode) {
    const el = $('status-right');
    el.textContent = text;
    el.className = 'status-' + (mode || 'idle');

    // Mirror the status line into the console footer (e.g. "\u2713 Executed in 3 ms").
    const footer = $('exec-footer');
    if (!footer) return;
    footer.hidden = !mode || mode === 'idle';
    if (!footer.hidden) {
      footer.textContent = text;
      footer.className = 'exec-footer status-' + mode;
    }
  }

  function initStatusBar() {
    const pos = $('status-pos');
    const editorPos = $('editor-pos');
    const sync = () => {
      const cur = editor ? editor.getCursor() : null;
      const text = cur ? 'Ln ' + (cur.line + 1) + ', Col ' + (cur.ch + 1) : '';
      if (pos) pos.textContent = text;
      if (editorPos) editorPos.textContent = text;
    };
    if (editor) editor.on('cursorActivity', sync);
    sync();
  }

  /* =======================================================================
   * 6b. UI polish: theme toggle + preview header (refresh / expand)
   * ==================================================================== */

  function initThemeToggle() {
    const btn = $('btn-theme');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('jspg:theme', next);
      } catch (_) {
        /* ignore */
      }
    });
  }

  /** Close the expanded-preview overlay and move the live iframe back. */
  function closePreviewOverlay() {
    const overlay = $('preview-overlay');
    if (!overlay || !overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    const frameHost = $('preview-overlay-frame');
    const frame = frameHost && frameHost.querySelector('iframe');
    if (frame && previewFrame) previewFrame.appendChild(frame);
  }

  function initPreviewHeader() {
    const refresh = $('btn-preview-refresh');
    const expand = $('btn-preview-expand');
    const overlay = $('preview-overlay');
    const closeBtn = $('btn-preview-close');

    if (refresh) refresh.addEventListener('click', () => runCode());

    if (expand && overlay) {
      expand.addEventListener('click', () => {
        const frame = previewFrame.querySelector('iframe');
        if (!frame) {
          showToast('Run your code to see a live preview.');
          return;
        }
        const frameHost = $('preview-overlay-frame');
        if (frameHost) frameHost.appendChild(frame);
        overlay.classList.add('open');
        if (closeBtn) closeBtn.focus();
      });
    }

    if (overlay) {
      if (closeBtn) closeBtn.addEventListener('click', closePreviewOverlay);
      // Click on the backdrop (outside the card) closes the overlay.
      overlay.addEventListener('pointerdown', (e) => {
        if (e.target === overlay) closePreviewOverlay();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) closePreviewOverlay();
      });
    }
  }

  function initShortcuts() {
    // Ctrl/Cmd + Enter to run. When the editor is focused CodeMirror handles
    // it via extraKeys; this listener covers every other focus target, and
    // the guard prevents a double-trigger.
    const editorEl = editor ? editor.getWrapperElement() : null;
    document.addEventListener('keydown', (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.key !== 'Enter') return;
      if (editorEl && editorEl.contains(e.target)) return;
      e.preventDefault();
      runCode();
    });
  }

  /* =======================================================================
   * 7. Init
   * ==================================================================== */

  function init() {
    $('btn-run').addEventListener('click', runCode);
    $('btn-clear').addEventListener('click', handleClear);
    $('btn-reset').addEventListener('click', handleReset);
    $('btn-copy').addEventListener('click', handleCopy);
    $('btn-download').addEventListener('click', handleDownload);
    $('btn-console-clear').addEventListener('click', () => clearConsole(false));

    initSplitter();
    initStatusBar();
    initShortcuts();
    initThemeToggle();
    initPreviewHeader();

    // Load the default example, place the caret at the end and focus the
    // editor so the user can type immediately.
    setCode(DEFAULT_CODE);
    if (editor) {
      editor.setCursor({ line: 0, ch: DEFAULT_CODE.length });
      editor.focus();
    } else {
      // Graceful fallback if CodeMirror failed to load.
      codeInput.style.display = 'block';
      codeInput.focus();
    }

    // Keep the editor sized correctly on window resizes.
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (editor) editor.refresh();
      }, 120);
    });

    showEmptyState();
    setStatus('Ready', 'idle');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
