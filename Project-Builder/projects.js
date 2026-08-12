/* ============================================================
   LearnJS — projects.js (Project-Builder)
   Project Builder project registry.

   Every project the Project Builder powers is defined here as a
   plain data object. The builder itself is 100% generic — it never
   knows anything about counters, weather apps, etc. It just renders
   whatever a project definition provides:

     id          unique builder id (used in the URL: ?project=id)
     matches     library slugs (project.json ids) that map to this
                 builder project — lets the Project Details page
                 show a "Start Building" button for them
     title       shown in the builder header
     entryFile   the HTML page loaded in the preview by default
     files       flat virtual file system: "path/name" -> content
     steps       guided-build steps (title, description, targetFile, hint)
     checks      per-project validation hooks run by the Check button
                 (each: { label, test(files) -> boolean })

   Optional fields (all fall back to a sensible default):
     standalone     true → this is the built-in blank workspace
                    (standalone mode): own storage key, no guided steps
     headerTitle    overrides the header title (defaults to `title`)
     headerSub      sub-label under the header title (defaults to
                    "Project Builder")
     explorerTitle  label above the file tree (defaults to the id)

   The starter files below are the REAL existing project files from
   the repository (JS PROJECTS/<folder>/), copied verbatim so the
   builder shows and runs the exact code a learner opens on disk.
   The source of truth stays the files in JS PROJECTS/.
   ============================================================ */

const COUNTER = {
  id: "counter",
  matches: ["counter"],
  title: "Counter App",
  entryFile: "index.html",
  description:
    "An interactive counter with increment, decrement and reset.",
  steps: [
    {
      id: "step-1",
      title: "Create the counter display",
      description:
        "index.html has a <code>&lt;div id=\"count\"&gt;</code> that shows the current number. This is the element your JavaScript will update.",
      targetFile: "index.html",
      hint: "Look for <code>id=\"count\"</code> in the markup — it starts at <code>0</code>."
    },
    {
      id: "step-2",
      title: "Add the three buttons",
      description:
        "There are three buttons inside <code>.buttons</code>: <code>id=\"decrement\"</code> (−), <code>id=\"reset\"</code> (Reset) and <code>id=\"increment\"</code> (+). Each gets a click listener in script.js.",
      targetFile: "index.html",
      hint: "The minus button is <code>&lt;button id=\"decrement\"&gt;-&lt;/button&gt;</code>."
    },
    {
      id: "step-3",
      title: "Select the elements in JavaScript",
      description:
        "In script.js, <code>document.getElementById()</code> grabs the counter display and each button and stores them in variables.",
      targetFile: "script.js",
      hint: "<code>const plus = document.getElementById(\"increment\");</code> — one line per element."
    },
    {
      id: "step-4",
      title: "Wire up the buttons",
      description:
        "Click listeners on the buttons update the count: + adds 1, − subtracts 1 (guarding against going below 0), and Reset sets it back to 0. Then the display is updated with <code>innerText</code>.",
      targetFile: "script.js",
      hint: "Use <code>addEventListener(\"click\", ...)</code> on each button and <code>number.innerText = count</code> to refresh the display."
    },
    {
      id: "step-5",
      title: "Complete the project",
      description:
        "Press Run and check the preview: + should go up, − should go down (never below 0), and Reset should return to 0. When it works — congratulations, you've built your first interactive app!",
      targetFile: "index.html",
      hint: "If a button does nothing, open the Console panel below — any JavaScript errors will appear there."
    }
  ],
  checks: [
    {
      label: "index.html exists",
      test: (files) => typeof files["index.html"] === "string"
    },
    {
      label: "styles.css exists",
      test: (files) => typeof files["styles.css"] === "string"
    },
    {
      label: "script.js exists",
      test: (files) => typeof files["script.js"] === "string"
    },
    {
      label: "The counter has an element with id=\"count\"",
      test: (files) => (files["index.html"] || "").indexOf('id="count"') !== -1
    },
    {
      label: "The plus button has id=\"increment\"",
      test: (files) => (files["index.html"] || "").indexOf('id="increment"') !== -1
    },
    {
      label: "The minus button has id=\"decrement\"",
      test: (files) => (files["index.html"] || "").indexOf('id="decrement"') !== -1
    },
    {
      label: "script.js uses addEventListener on the buttons",
      test: (files) => {
        const js = files["script.js"] || "";
        return js.indexOf("addEventListener") !== -1 &&
          (js.indexOf("increment") !== -1 || js.indexOf("count") !== -1);
      }
    }
  ],
  files: {
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Counter App</title>
    <link rel="stylesheet" href="../design-system.css">
    <link rel="stylesheet" href="styles.css">
    <script src="https://unpkg.com/lucide@latest" defer></script>
</head>
<body>
  <main class="main-wrapper">
    <div class="container">
        <div class="card">
            <h1>Counter App</h1>
            <div id="count" class="count">0</div>
            <div class="buttons">
                <button id="decrement">-</button>
                <button id="reset">Reset</button>
                <button id="increment">+</button>
            </div>
        </div>
    </div>
  </main>
    <script src="script.js"></script>
  <footer class="vks-footer">
    <div class="vks-footer-inner">
      <p class="vks-footer-heart">Made with <span class="vks-heart">💜</span></p>
      <p class="vks-footer-brand" aria-label="VKS"><span class="vks-typing"></span><span class="vks-cursor">|</span></p>
      <p class="vks-footer-by">Visionary Kraft Studio</p>
      <div class="vks-footer-divider"></div>
      <p class="vks-footer-copy">&copy; 2026 Visionary Kraft Studio. All Rights Reserved.</p>
    </div>
  </footer>
<script src="../footer.js"></script>
</body>
</html>
`,
    "styles.css": `@import url('../design-system.css');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

.main-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 24px;
}

.card {
  width: 380px;
  padding: 40px;
  text-align: center;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
}

.card h1 {
  color: var(--text-primary);
  margin-bottom: 30px;
  font-size: 2rem;
}

.count {
  font-size: 5rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 30px;
  font-family: var(--font-heading);
  font-variant-numeric: tabular-nums;
}

.buttons {
  display: flex;
  gap: 12px;
}

button {
  flex: 1;
  border: none;
  padding: 14px;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-body);
}

button:hover { transform: translateY(-2px); }
button:active { transform: scale(0.97); }

#increment { background: var(--success); color: white; }
#increment:hover { filter: brightness(1.1); }
#decrement { background: var(--danger); color: white; }
#decrement:hover { filter: brightness(1.1); }
#reset { background: var(--accent); color: white; }
#reset:hover { filter: brightness(1.1); }
`,
    "script.js": `let number=document.getElementById("count");
const plus=document.getElementById("increment");
const minus=document.getElementById("decrement")
const reset=document.getElementById("reset");
let count=0
reset.addEventListener("click", ()=>{
    count=0;
    number.innerText=count;
})

plus.addEventListener("click",()=>{
    count+=1;
    number.innerText=count;
})
minus.addEventListener("click",()=>{
if (count===0){
    alert("Can't reduced any more");
    }
else{
count-=1
number.innerText=count;
}
}
)
`,
    // Shared design system the Counter App links as ../design-system.css
    // (resolves to this project-root file inside the builder VFS).
    "design-system.css": `/* ============================================
   DESIGN SYSTEM — Shared Design Tokens
   Modern SaaS · Minimal · Premium · Professional
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-heading: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-tertiary: #F3F4F6;
  --bg-hover: #F9FAFB;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-tertiary: #9CA3AF;
  --text-inverse: #FFFFFF;
  --accent: #2563EB;
  --accent-hover: #1D4ED8;
  --accent-light: rgba(37, 99, 235, 0.1);
  --accent-glow: rgba(37, 99, 235, 0.2);
  --accent-purple: #7C3AED;
  --accent-purple-hover: #6D28D9;
  --accent-purple-light: rgba(124, 58, 237, 0.1);
  --success: #10B981;
  --success-light: #D1FAE5;
  --warning: #F59E0B;
  --warning-light: #FEF3C7;
  --danger: #EF4444;
  --danger-light: #FEE2E2;
  --border: #E5E7EB;
  --border-light: #F3F4F6;
  --border-hover: #D1D5DB;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-card-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
  --container-max: 1200px;
  --container-narrow: 768px;
  --z-dropdown: 100;
  --z-navbar: 200;
  --z-modal: 300;
  --z-toast: 400;
}

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-primary);
}

img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
button { border: none; background: none; cursor: pointer; font-family: inherit; font-size: inherit; color: inherit; }
input, textarea, select { font-family: inherit; font-size: inherit; color: inherit; }
ul, ol { list-style: none; }

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--text-primary);
  line-height: 1.2;
  font-weight: 700;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--text-tertiary); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }

.container { max-width: var(--container-max); margin: 0 auto; padding: 0 24px; }
.container-narrow { max-width: var(--container-narrow); margin: 0 auto; padding: 0 24px; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* ============================================
   VKS FOOTER — Premium Site-wide Footer
   Sleek · Compact · Elegant
   ============================================ */
.vks-footer {
  position: relative;
  width: 100%;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 50%, #EEF6FF 100%);
  padding: 18px 24px 14px;
  text-align: center;
  margin-top: 60px;
  overflow: hidden;
}

/* Glowing gradient divider at the top */
.vks-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  max-width: 280px;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, #38BDF8, #8B5CF6, #38BDF8, transparent);
  background-size: 200% 100%;
  animation: vksDividerGlow 4s ease-in-out infinite;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.2), 0 0 16px rgba(139, 92, 246, 0.15);
}

@keyframes vksDividerGlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.vks-footer-inner {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.vks-footer-heart {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 0;
}

.vks-heart {
  display: inline-block;
  animation: vksHeartPulse 3s ease-in-out infinite;
  font-size: 15px;
  line-height: 1;
}

@keyframes vksHeartPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.vks-footer-brand {
  font-family: 'Space Grotesk', var(--font-heading);
  font-size: 2.75rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
  cursor: default;
}

.vks-footer-brand:hover {
  transform: scale(1.02);
  filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.25)) drop-shadow(0 0 32px rgba(139, 92, 246, 0.15));
}

.vks-footer-brand .vks-typing {
  display: inline-block;
  background: linear-gradient(135deg, #38BDF8, #8B5CF6, #38BDF8);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: vksGradientMove 5s ease-in-out infinite;
}

.vks-footer-by {
  font-family: var(--font-body);
  font-size: 1rem;
  margin-bottom: 0;
  font-weight: 400;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #93C5FD, #C4B5FD, #93C5FD);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: vksGradientMove 6s ease-in-out infinite;
  display: inline-block;
}

.vks-footer-divider {
  width: 32px;
  height: 1px;
  background: var(--border);
  margin: 0;
  opacity: 0.5;
}

.vks-footer-copy {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-tertiary);
  line-height: 1.4;
  letter-spacing: 0.2px;
}

@media (max-width: 768px) {
  .vks-footer { padding: 16px 20px 12px; margin-top: 48px; }
  .vks-footer-brand { font-size: 2.25rem; }
  .vks-footer-by { font-size: 0.9rem; }
  .vks-footer-inner { gap: 3px; }
}

@media (max-width: 480px) {
  .vks-footer { padding: 14px 16px 10px; margin-top: 36px; }
  .vks-footer::before { width: 50%; }
  .vks-footer-brand { font-size: 1.75rem; }
  .vks-footer-heart { font-size: 0.8125rem; }
  .vks-footer-by { font-size: 0.8125rem; }
  .vks-footer-copy { font-size: 0.6875rem; }
  .vks-footer-inner { gap: 2px; }
}
`,
    // Shared VKS footer script — the app loads it as ../footer.js.
    "footer.js": `/**
 * VKS Premium Footer
 * Vanilla JavaScript · Loads once on page load
 */
(function () {
  'use strict';

  function initFooter() {
    const typingEl = document.querySelector('.vks-typing');
    const cursor = document.querySelector('.vks-cursor');
    const byLine = document.querySelector('.vks-footer-by');

    if (typingEl) {
      typingEl.textContent = 'VKS';
    }

    if (cursor) {
      cursor.style.display = 'none';
    }

    if (byLine) {
      byLine.classList.add('visible');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }
})();
`
  }
};

/* ------------------------------------------------------------
   Registry + lookup helpers
   ------------------------------------------------------------ */
const BUILDER_PROJECTS = {
  [COUNTER.id]: COUNTER
};

/** Get a builder project by its builder id (or any matched library slug). */
export function getBuilderProject(id) {
  if (!id) return null;
  return (
    BUILDER_PROJECTS[id] ||
    Object.values(BUILDER_PROJECTS).find((p) => (p.matches || []).indexOf(id) !== -1) ||
    null
  );
}

/** Get the builder project that should power a library project slug. */
export function getBuilderProjectForSlug(slug) {
  if (!slug) return null;
  return (
    Object.values(BUILDER_PROJECTS).find((p) => (p.matches || []).indexOf(slug) !== -1) ||
    null
  );
}

/* ------------------------------------------------------------
   Standalone workspace — used when the builder is opened with NO
   ?project= parameter (/Project-Builder/index.html).

   No ?project= is not an error: the user deliberately wants a fresh
   blank workspace. The exact same builder engine runs — only the
   initial file set differs. This definition is the "starter files"
   that Reset restores in Standalone Mode, and it is saved under
   its own storage key (learnjs_builder_standalone) so it never
   touches a real project's saved work.

   There are deliberately NO guided steps / checks here: validating
   arbitrary user projects would be pretending. The Check and Hint
   buttons stay available but explain that guided building exists
   only for registered LearnJS projects.
   ------------------------------------------------------------ */
export function getStandaloneProject() {
  return {
    id: "standalone",
    standalone: true,
    title: "New Project",
    headerTitle: "LearnJS Project Builder",
    headerSub: "New Project",
    explorerTitle: "project",
    entryFile: "project/index.html",
    description:
      "A blank frontend workspace — write HTML, CSS and JavaScript and run it instantly.",
    files: {
      "project/": "",
      "project/index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="card">
    <h1>Hello, world! 👋</h1>
    <p>This is your new project. Edit the files, then press <b>Run</b> to see your changes.</p>
    <button id="clickBtn">Click me</button>
    <p id="message"></p>
  </main>

  <script src="script.js"></script>
</body>
</html>
`,
      "project/style.css": `/* style.css — your project's styles */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  display: grid;
  place-items: center;
  min-height: 100vh;
  background: #f3f4f6;
}

.card {
  max-width: 420px;
  text-align: center;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

h1 { margin-bottom: 0.75rem; color: #111827; }
p { color: #6b7280; margin-bottom: 1rem; }

button {
  font-size: 1rem;
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 8px;
  background: #7c3aed;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

button:hover { background: #6d28d9; }

#message { margin-top: 1rem; font-weight: 600; color: #7c3aed; }
`,
      "project/script.js": `// script.js — your project's JavaScript
console.log("Hello from your new project! 👋");

const button = document.getElementById("clickBtn");
const message = document.getElementById("message");

button.addEventListener("click", () => {
  message.textContent = "You clicked the button! 🎉";
});
`
    }
  };
}

export { BUILDER_PROJECTS };
// end of projects.js
