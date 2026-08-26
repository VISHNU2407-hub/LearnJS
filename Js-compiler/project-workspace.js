/* ============================================================
   JS Playground — Project Workspace Mode (v3)
   
   CRITICAL: This module loads REAL project files from
   JS PROJECTS/<folder>/. It NEVER generates, invents, or
   creates placeholder code. If files cannot be found, it
   reports the error instead of silently providing fake content.
   
   When opened with ?project=<id>&uid=<uid>&name=<title>:
   - Loads the REAL project source files from disk
   - Loads saved workspace from Firestore (if exists)
   - Provides Save & Close and Reset to Starter buttons
   
   The single source of truth is the actual project directory.
   ============================================================ */

(function() {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var projectId = params.get('project');
  var userId = params.get('uid');
  var projectName = params.get('name') || '';
  var isProjectMode = !!(projectId && userId);

  if (!isProjectMode) return;

  /* ---------- Firebase ---------- */
  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyAP9MZOMKqS6OJLGil7E1huUfqSF3-D9pg",
    authDomain: "learnjs-vks.firebaseapp.com",
    projectId: "learnjs-vks",
    storageBucket: "learnjs-vks.firebasestorage.app",
    messagingSenderId: "1022743370130",
    appId: "1:1022743370130:web:5ec572be33fe66b66e094b"
  };

  var firestore = null;

  function initFirebase() {
    return new Promise(function(resolve) {
      if (window.firebase && window.firebase.apps && window.firebase.apps.length) {
        firestore = window.firebase.firestore();
        resolve();
        return;
      }
      loadScript('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js')
        .then(function() { return loadScript('https://www.gstatic.com/firebasejs/12.0.0/firebase-auth-compat.js'); })
        .then(function() { return loadScript('https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore-compat.js'); })
        .then(function() {
          if (!window.firebase.apps.length) window.firebase.initializeApp(FIREBASE_CONFIG);
          firestore = window.firebase.firestore();
          resolve();
        })
        .catch(function() { resolve(); });
    });
  }

  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  /* ---------- Project folder mapping from projects.json ---------- */
  var PROJECT_FOLDER_MAP = {};  // projectId -> actual folder name

  async function loadFolderMap() {
    try {
      var res = await fetch('../../../data/projects.json?t=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        var projects = await res.json();
        projects.forEach(function(p) {
          if (p.id && p.folder) PROJECT_FOLDER_MAP[p.id] = p.folder;
        });
      }
    } catch(e) {
      console.warn('[ProjectWorkspace] Could not load projects.json:', e.message);
    }
  }

  function getProjectFolder(pid) {
    return PROJECT_FOLDER_MAP[pid] || null;
  }

  /* ---------- Fetch REAL project files ---------- */
  var IMAGE_EXTS = /\.(png|jpe?g|webp|gif|ico|bmp|svg)$/i;
  var TEXT_EXTS = /\.(html?|css|js|jsx|ts|tsx|json|md|txt|xml|yaml|yml|svg)$/i;
  var SKIP = /^(README\.md|\.git|node_modules|package-lock\.json|\.DS_Store|\.gitignore)$/i;

  async function fetchRealProjectFiles(pid) {
    var folder = getProjectFolder(pid);
    if (!folder) {
      console.error('[ProjectWorkspace] No folder mapping found for project:', pid);
      return { textFiles: {}, imageFiles: {}, error: 'No folder mapping found for project: ' + pid };
    }

    var basePath = '../../../JS%20PROJECTS/' + encodeURIComponent(folder) + '/';
    var textFiles = {};
    var imageFiles = {};
    var errors = [];

    // Step 1: Fetch index.html (required entry point)
    var indexHtml = await fetchTextFile(basePath, 'index.html');
    if (!indexHtml) {
      return { textFiles: {}, imageFiles: {}, error: 'Could not load index.html from ' + folder };
    }
    textFiles['index.html'] = indexHtml;

    // Step 2: Parse HTML to discover ALL linked resources
    var discoveredPaths = discoverResourcesFromHtml(indexHtml);

    // Step 3: Fetch all discovered CSS files
    for (var i = 0; i < discoveredPaths.css.length; i++) {
      var cssPath = normalizePath(discoveredPaths.css[i]);
      if (!textFiles[cssPath]) {
        var cssContent = await fetchTextFile(basePath, cssPath);
        // If not found in project, try parent directory (for ../ references)
        if (cssContent === null && discoveredPaths.css[i].startsWith('..')) {
          var externalUrl = resolveExternalPath(basePath, discoveredPaths.css[i]);
          if (externalUrl) cssContent = await fetchFromUrl(externalUrl);
        }
        if (cssContent !== null) {
          textFiles[cssPath] = cssContent;
          // Also discover images referenced in this CSS
          var cssImages = discoverImagesFromCss(cssPath, cssContent);
          for (var ci = 0; ci < cssImages.length; ci++) {
            var imgPath = normalizePath(cssImages[ci]);
            if (!imageFiles[imgPath]) {
              var imgData = await fetchImageDataUrl(basePath, imgPath);
              if (imgData) imageFiles[imgPath] = imgData;
            }
          }
        }
      }
    }

    // Step 4: Fetch all discovered JS files
    for (var j = 0; j < discoveredPaths.js.length; j++) {
      var jsPath = normalizePath(discoveredPaths.js[j]);
      if (!textFiles[jsPath]) {
        var jsContent = await fetchTextFile(basePath, jsPath);
        // If not found in project, try parent directory (for ../ references)
        if (jsContent === null && discoveredPaths.js[j].startsWith('..')) {
          var externalUrl2 = resolveExternalPath(basePath, discoveredPaths.js[j]);
          if (externalUrl2) jsContent = await fetchFromUrl(externalUrl2);
        }
        if (jsContent !== null) textFiles[jsPath] = jsContent;
      }
    }

    // Step 5: Fetch all discovered images
    for (var k = 0; k < discoveredPaths.images.length; k++) {
      var imgPath2 = normalizePath(discoveredPaths.images[k]);
      if (!imageFiles[imgPath2]) {
        var imgData2 = await fetchImageDataUrl(basePath, imgPath2);
        if (imgData2) imageFiles[imgPath2] = imgData2;
      }
    }

    // Step 6: Scan common additional directories for extra files
    await scanAdditionalFiles(basePath, textFiles, imageFiles);

    return { textFiles: textFiles, imageFiles: imageFiles, error: null };
  }

  function discoverResourcesFromHtml(html) {
    var css = [];
    var js = [];
    var images = [];

    // <link rel="stylesheet" href="...">
    var linkRegex = /<link[^>]+href=["']([^"']+)["']/gi;
    var m;
    while ((m = linkRegex.exec(html)) !== null) {
      var href = m[1];
      if (href.startsWith('http') || href.startsWith('data:') || href.startsWith('#')) continue;
      if (/\.(css)$/i.test(href)) css.push(href);
    }

    // <script src="...">
    var scriptRegex = /<script[^>]+src=["']([^"']+)["']/gi;
    while ((m = scriptRegex.exec(html)) !== null) {
      var src = m[1];
      if (src.startsWith('http') || src.startsWith('data:')) continue;
      if (/\.(js|jsx|ts|tsx)$/i.test(src)) js.push(src);
    }

    // <img src="...">
    var imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    while ((m = imgRegex.exec(html)) !== null) {
      var imgSrc = m[1];
      if (imgSrc.startsWith('http') || imgSrc.startsWith('data:')) continue;
      images.push(imgSrc);
    }

    // <source srcset="..."> (for <picture> elements)
    var srcsetRegex = /<source[^>]+srcset=["']([^"']+)["']/gi;
    while ((m = srcsetRegex.exec(html)) !== null) {
      var srcset = m[1].split(',')[0].trim().split(' ')[0];
      if (!srcset.startsWith('http') && !srcset.startsWith('data:')) {
        images.push(srcset);
      }
    }

    // background-image in inline styles
    var bgRegex = /background-image:\s*url\(["']?([^"')]+)["']?\)/gi;
    while ((m = bgRegex.exec(html)) !== null) {
      if (!m[1].startsWith('http') && !m[1].startsWith('data:')) {
        images.push(m[1]);
      }
    }

    return { css: css, js: js, images: images };
  }

  function discoverImagesFromCss(cssPath, cssContent) {
    var images = [];
    var cssDir = cssPath.indexOf('/') !== -1 ? cssPath.substring(0, cssPath.lastIndexOf('/')) : '';
    var urlRegex = /url\(["']?([^"')]+)["']?\)/gi;
    var m;
    while ((m = urlRegex.exec(cssContent)) !== null) {
      var src = m[1];
      if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('#')) continue;
      if (IMAGE_EXTS.test(src)) {
        // Resolve relative to CSS file's directory
        var resolved = cssDir ? cssDir + '/' + src : src;
        images.push(normalizePath(resolved));
      }
    }
    return images;
  }

  async function scanAdditionalFiles(basePath, textFiles, imageFiles) {
    // Scan common extra directories that might not be linked from HTML
    var extraDirs = ['css', 'js', 'src', 'assets', 'lib', 'vendor', 'styles', 'scripts'];
    var extraExts = ['.css', '.js', '.json', '.html'];

    for (var d = 0; d < extraDirs.length; d++) {
      var dir = extraDirs[d];
      // Try common files in each directory
      for (var e = 0; e < extraExts.length; e++) {
        var ext = extraExts[e];
        var filename = dir + '/index' + ext;
        if (!textFiles[filename]) {
          var content = await fetchTextFile(basePath, filename);
          if (content !== null) textFiles[filename] = content;
        }
      }
    }

    // Scan common image directories
    var imageDirs = ['images', 'img', 'assets/images', 'assets/img', 'public/images', 'static/images'];
    var commonImages = [
      'logo.png', 'logo.svg', 'logo.jpg', 'logo.webp',
      'hero.png', 'hero.jpg', 'hero.svg',
      'bg.png', 'background.png', 'background.jpg',
      'banner.png', 'banner.jpg',
      'icon.png', 'icon.svg', 'favicon.png', 'favicon.ico',
      'avatar.png', 'profile.png',
      'cover.png', 'cover.jpg', 'cover image.png'
    ];

    for (var id = 0; id < imageDirs.length; id++) {
      for (var ig = 0; ig < commonImages.length; ig++) {
        var imgPath = imageDirs[id] + '/' + commonImages[ig];
        if (!imageFiles[normalizePath(imgPath)]) {
          var imgData = await fetchImageDataUrl(basePath, imgPath);
          if (imgData) imageFiles[normalizePath(imgPath)] = imgData;
        }
      }
    }
  }

  /* ---------- Low-level fetch helpers ---------- */
  async function fetchTextFile(basePath, relativePath) {
    try {
      var url = basePath + encodePathParts(relativePath);
      var res = await fetch(url);
      if (res.ok) {
        var text = await res.text();
        // Reject binary content
        if (text.indexOf('\0') !== -1) return null;
        return text;
      }
    } catch(e) {}
    return null;
  }

  async function fetchFromUrl(url) {
    try {
      var res = await fetch(url);
      if (res.ok) {
        var text = await res.text();
        if (text.indexOf('\0') !== -1) return null;
        return text;
      }
    } catch(e) {}
    return null;
  }

  async function fetchImageDataUrl(basePath, relativePath) {
    try {
      var url = basePath + encodePathParts(relativePath);
      var res = await fetch(url);
      if (res.ok) {
        var contentType = res.headers.get('content-type') || '';
        if (!contentType.startsWith('image/') && !IMAGE_EXTS.test(relativePath)) return null;
        var blob = await res.blob();
        return new Promise(function(resolve) {
          var reader = new FileReader();
          reader.onload = function() { resolve({ dataUrl: reader.result }); };
          reader.onerror = function() { resolve(null); };
          reader.readAsDataURL(blob);
        });
      }
    } catch(e) {}
    return null;
  }

  function encodePathParts(path) {
    return path.split('/').map(function(part) {
      // Don't double-encode
      if (/%[0-9A-Fa-f]{2}/.test(part)) return part;
      return encodeURIComponent(part);
    }).join('/');
  }

  function normalizePath(path) {
    var parts = path.replace(/^\.\//, '').split('/');
    var stack = [];
    parts.forEach(function(p) {
      if (p === '..') {
        if (stack.length > 0) stack.pop();
        else stack.push('..'); // preserve parent traversal for files outside project
      }
      else if (p !== '.' && p !== '') stack.push(p);
    });
    return stack.join('/');
  }

  // Resolve a path that may point outside the project directory (e.g. ../design-system.css)
  function resolveExternalPath(basePath, relativePath) {
    if (!relativePath.startsWith('..')) return null;
    // Strip leading ../ and try fetching from the parent directory
    var stripped = relativePath.replace(/^\.\.\//, '');
    var parentPath = '../../../JS%20PROJECTS/' + encodePathParts(stripped);
    return parentPath;
  }

  /* ---------- Firestore operations ---------- */
  async function loadSavedWorkspace() {
    if (!firestore) return null;
    try {
      var doc = await firestore.collection('users').doc(userId)
        .collection('projectWorkspaces').doc(projectId).get();
      if (doc.exists) return doc.data();
      return null;
    } catch(e) {
      console.warn('[ProjectWorkspace] Could not load workspace:', e.message);
      return null;
    }
  }

  async function saveWorkspaceToFirestore(textFiles, imageFiles) {
    if (!firestore) throw new Error('Firestore not available');
    var filesData = {};
    Object.keys(textFiles).forEach(function(path) {
      filesData[path] = textFiles[path];
    });
    var imagesData = {};
    Object.keys(imageFiles).forEach(function(path) {
      if (imageFiles[path] && imageFiles[path].dataUrl) {
        imagesData[path] = imageFiles[path].dataUrl;
      }
    });
    await firestore.collection('users').doc(userId)
      .collection('projectWorkspaces').doc(projectId).set({
        files: filesData,
        images: imagesData,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    return true;
  }

  async function deleteSavedWorkspace() {
    if (!firestore) return true;
    try {
      await firestore.collection('users').doc(userId)
        .collection('projectWorkspaces').doc(projectId).delete();
    } catch(e) {}
    return true;
  }

  /* ---------- UI: Add buttons ---------- */
  function addProjectButtons() {
    var toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;

    var saveBtn = document.createElement('button');
    saveBtn.id = 'btn-save-close';
    saveBtn.className = 'btn btn-primary';
    saveBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg><span class="btn-label">Save & Close</span>';

    var resetBtn = document.createElement('button');
    resetBtn.id = 'btn-reset-starter';
    resetBtn.className = 'btn';
    resetBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg><span class="btn-label">Reset to Starter</span>';

    var div1 = document.createElement('span');
    div1.className = 'toolbar-divider';
    var div2 = document.createElement('span');
    div2.className = 'toolbar-divider';
    var div3 = document.createElement('span');
    div3.className = 'toolbar-divider';

    toolbar.insertBefore(div3, toolbar.firstChild);
    toolbar.insertBefore(saveBtn, div3.nextSibling);
    toolbar.insertBefore(div1, saveBtn.nextSibling);
    toolbar.insertBefore(resetBtn, div1.nextSibling);
    toolbar.insertBefore(div2, resetBtn.nextSibling);

    saveBtn.addEventListener('click', handleSaveAndClose);
    resetBtn.addEventListener('click', handleResetToStarter);
  }

  async function handleSaveAndClose() {
    var btn = document.getElementById('btn-save-close');
    if (btn) { btn.disabled = true; btn.querySelector('.btn-label').textContent = 'Saving\u2026'; }
    try {
      var files = window.__playground.getAllFiles();
      var images = window.__playground.getImageFiles();
      await saveWorkspaceToFirestore(files, images);
      showToast('Workspace saved!');
      setTimeout(function() { window.close(); if (!window.closed) window.history.back(); }, 600);
    } catch(e) {
      showToast('Could not save: ' + e.message);
      if (btn) { btn.disabled = false; btn.querySelector('.btn-label').textContent = 'Save & Close'; }
    }
  }

  async function handleResetToStarter() {
    if (!confirm('Reset to the original project files? Your changes will be lost.')) return;
    try {
      await deleteSavedWorkspace();
      // Re-fetch REAL project files
      var result = await fetchRealProjectFiles(projectId);
      if (result.error) {
        showToast('Error: ' + result.error);
        return;
      }
      var imgMap = {};
      Object.keys(result.imageFiles).forEach(function(p) { imgMap[p] = result.imageFiles[p]; });
      window.__playground.setProjectFiles(result.textFiles, imgMap);
      showToast('Reset to original project files');
    } catch(e) {
      showToast('Could not reset: ' + e.message);
    }
  }

  function showToast(msg) {
    var toast = document.getElementById('toast');
    if (toast) { toast.textContent = msg; toast.classList.add('show'); setTimeout(function() { toast.classList.remove('show'); }, 2200); }
  }

  function updateTitle() {
    if (projectName) document.title = projectName + ' \u2014 JS Playground';
    var brandText = document.querySelector('.brand-text');
    if (brandText && projectName) {
      brandText.innerHTML = '<h1>' + escapeHtml(projectName) + '</h1><p>Project Workspace</p>';
    }
  }

  function escapeHtml(s) { var div = document.createElement('div'); div.textContent = s; return div.innerHTML; }

  /* ---------- Boot ---------- */
  async function init() {
    updateTitle();
    await initFirebase();
    addProjectButtons();
    await loadFolderMap();

    // Try saved workspace first
    var saved = await loadSavedWorkspace();

    if (saved && saved.files && Object.keys(saved.files).length > 0) {
      // Load user's saved workspace
      var images = {};
      if (saved.images) {
        Object.keys(saved.images).forEach(function(path) {
          images[path] = { dataUrl: saved.images[path] };
        });
      }
      window.__playground.setProjectFiles(saved.files, images);
      showToast('Loaded your saved workspace');
    } else {
      // Load REAL project files from disk
      var result = await fetchRealProjectFiles(projectId);

      if (result.error) {
        showToast('Error loading project: ' + result.error);
        setStatus('Error: ' + result.error, 'error');
        return;
      }

      if (Object.keys(result.textFiles).length === 0) {
        showToast('No files found in project directory');
        setStatus('No files found', 'error');
        return;
      }

      // Convert imageFiles to the format expected by playground
      var imgMap = {};
      Object.keys(result.imageFiles).forEach(function(p) { imgMap[p] = result.imageFiles[p]; });
      window.__playground.setProjectFiles(result.textFiles, imgMap);

      var fileCount = Object.keys(result.textFiles).length;
      var imgCount = Object.keys(result.imageFiles).length;
      showToast('Loaded ' + fileCount + ' file' + (fileCount !== 1 ? 's' : '') + (imgCount ? ' + ' + imgCount + ' image' + (imgCount !== 1 ? 's' : '') : ''));
    }

    // Auto-run
    setTimeout(function() { window.__playground.runCode(); }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 300); });
  } else {
    setTimeout(init, 300);
  }
})();
