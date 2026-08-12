# LearnJS

> Learn JavaScript by building real projects — guided roadmaps, 100+ hands-on projects, interview prep and a 24/7 AI mentor.

A premium, fully responsive JavaScript learning platform built with **HTML5, Tailwind CSS, vanilla JavaScript, Firebase Authentication and an auto-generated project index**.

## ✨ Features

- **Landing page** — hero with live code editor mockup, animated stats, featured projects, roadmap, why-LearnJS cards, testimonial slider, newsletter and footer
- **Authentication** — email/password sign up & login, Google sign-in, show/hide password, remember me, forgot password, persistent sessions, avatar dropdown when signed in
- **Dashboard** — authenticated dashboard with auth guard, dynamically loaded project cards (from `data/projects.json`), filters (search / category / difficulty / sort), per-user progress tracking, stats, achievements, profile and settings
- **Auto project index** — `scan-projects.js` scans the `JS PROJECTS` folder and regenerates `data/projects.json`; watch mode updates it automatically when you add or remove a project folder
- **Project details** — auth-guarded placeholder page (`pages/project-details/`) with progress + launch actions
- **Theme toggle** — light/dark mode with localStorage persistence
- **5 nav pages** — Projects, Roadmap, Interview, Resources and Community (polished coming-soon pages, no dead links)
- **Animations** — scroll reveals, animated counters, typewriter, testimonial slider, scroll progress, smooth scrolling, hover micro-interactions (no animation library)
- **Global search** — filters nav pages and section links as you type
- **Responsive** — desktop, tablet and mobile, mobile drawer menu + collapsible dashboard sidebar

## 🚀 Getting Started

### Option 1 — Open directly

Open `index.html` in your browser. Everything works offline except Google Fonts, Tailwind CDN and Firebase.

### Option 2 — Live Server (recommended)

```bash
# VS Code: right-click index.html → "Open with Live Server"
# or any static server:
npx serve .
python -m http.server 8080   # optional (run from this folder)
```

Firebase auth requires an `http(s)` origin — use a local server rather than `file://`.

> **Playground:** The JS Playground (the global `</>` button) lives in the sibling `Js-compiler/` folder at the **project root**, next to `Website/`. Serve the site from the project root (open the root folder in VS Code, or run `npx serve .` there) so `/Js-compiler/index.html` is reachable.

> **Project Builder:** The Project Builder IDE (guided HTML/CSS/JS building) lives in its own top-level `Project-Builder/` folder, next to `Js-compiler/` and `Website/`. It loads the real project files from `JS PROJECTS/` (e.g. the Counter App at `JS PROJECTS/counter/`). Open `Project-Builder/index.html?project=counter` directly, or reach it via **Start Building** on the Project Details page.
>
> **Two modes, one builder:** opening `Project-Builder/index.html` **without** `?project=` boots **Standalone Mode** — a blank `New Project` workspace (starter `project/index.html`, `style.css`, `script.js`) with no error state, saved separately under `learnjs_builder_standalone`. An unknown id (`?project=does-not-exist`) still shows **Project not found**. Guided Steps are hidden in standalone mode; Check/Hint explain that guided building exists only for registered projects. Standalone work is fully independent from every project's saved work.
>
> **Import from your computer:** Standalone Mode includes an **Open Folder** button (header + file-explorer icon, or `Ctrl/Cmd+O`). It reads a local folder with the browser's File System Access API (`window.showDirectoryPicker`, `mode: "read"`) and falls back to an `<input webkitdirectory>` picker where that API is unavailable — no server involved. The folder structure and relative paths are preserved, HTML/CSS/JS/JSON/SVG/TXT are imported as text and **images/fonts (png, jpg, gif, webp, avif, ico, woff/woff2, ttf, otf, …) as inlined data URIs**, so the sandboxed preview renders them without a server (hidden dirs, `node_modules`, and oversized files are skipped). Every HTML page appears in the preview **Entry** selector for multi-page navigation, and the same sandboxed preview engine runs the imported project. Imports are read-only copies stored under `learnjs_builder_imported_<id>` (never under a LearnJS project key), survive refresh via a workspace pointer, are never uploaded anywhere, and **never modify your files on disk**. **New Project** returns to the blank workspace.
>
> **Download ZIP:** the **Download** button (header or file-explorer icon, or `Ctrl/Cmd+Shift+S`) exports the current workspace — in any mode — as a `.zip` of the whole virtual file system, folders and all. It uses a small dependency-free ZIP writer (`Project-Builder/zip.js`, STORE method with UTF-8 names) so exporting works fully offline; the archive opens in any unzip tool.
>
> **Serve from the repository ROOT** (e.g. `npx serve .`) so `/Project-Builder/`, `/Js-compiler/` and the relative links back into `Website/` all work. If you run VS Code **Live Server on the `Website/` folder**, the top-level `Project-Builder/` (and `Js-compiler/`) folders are NOT served — do not duplicate them inside `Website/`; just serve the repository root instead.
>
> The **Start Building** button resolves the root-level `Project-Builder/` from the page script's own URL, so it works even when the browser URL carries a `/Website/` prefix (e.g. `http://host/Website/pages/project-details/`). If the builder is genuinely unreachable, the button hides with a hint instead of opening a dead link.

## 📁 Adding a New Project (no code changes)

Every project lives in its own folder inside `JS PROJECTS/` with at least:

```
JS PROJECTS/My New Project/
├── project.json   # title, description, difficulty, category, tags, cover, entry
├── cover.png      # auto-generated if missing (placeholder gradient)
└── index.html     # the entry file (default) — or point `entry` at any other file
```

`project.json` example:

```json
{
  "title": "Calculator",
  "description": "Scientific calculator using JavaScript.",
  "difficulty": "Beginner",
  "estimatedTime": "2 Hours",
  "category": "Core JS",
  "tags": ["DOM", "Math"],
  "cover": "cover.png",
  "entry": "index.html"
}
```

Then regenerate the index (or keep the watcher running):

```bash
node scan-projects.js --watch   # watch mode — regenerates on every change
# or
node scan-projects.js           # one-time scan
```

The dashboard picks up new projects automatically (it polls `data/projects.json`), so **adding a folder is all you need** — never edit `data/projects.json` by hand.

## 🗂 Project Structure

```
VKS JS/
├── scan-projects.js            # Scans JS PROJECTS → Website/data/projects.json
├── JS PROJECTS/                # One folder per project (project.json + cover + entry)
└── Website/
    ├── index.html              # Redirects to pages/home/
    ├── assets/                 # images, icons, logos
    ├── css/
    │   ├── global/             # style.css (tokens/reset) + animations.css
    │   ├── components/         # components.css (buttons, navbar, footer…)
    │   ├── pages/              # coming-soon.css (page-hero, soon-card…)
    │   └── responsive/         # responsive.css (tablet/mobile breakpoints)
    ├── data/                   # projects.json + projects-data.js (auto-generated)
    ├── js/
    │   ├── firebase/           # firebase.js, firestore.js
    │   ├── utils/              # theme.js
    │   ├── components/         # navbar.js, auth-nav.js (navbar auth UI)
    │   ├── projects/           # project-loader.js, progress.js
    │   └── common/             # app.js, animations.js, require-auth.js
    ├── pages/
    │   ├── home/               # index.html + home.css
    │   ├── authentication/     # login.html, signup.html, auth.css, auth.js
    │   ├── dashboard/          # index.html, dashboard.css, dashboard.js
    │   ├── project-details/    # placeholder details page (auth-guarded)
    │   ├── projects/           # coming-soon page (index.html)
    │   ├── roadmap/            # coming-soon page (index.html)
    │   ├── interview/          # coming-soon page (index.html)
    │   ├── resources/          # coming-soon page (index.html)
    │   └── community/          # coming-soon page (index.html)
    └── README.md
```

## 🔐 Firebase Setup

Authentication and Firestore are pre-wired to a Firebase project in `js/firebase/firebase.js`. To use your own project:

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a project.
2. **Authentication → Sign-in method** → enable **Email/Password** and **Google**.
3. **Firestore Database → Create database** (production or test mode) and deploy the included `firestore.rules`.
4. Add a web app, copy the config, and replace the `firebaseConfig` in `js/firebase/firebase.js`.
5. If you deploy, add your domain to **Authorized domains**.

### What uses Firestore

- **Per-user data** — profile document + per-project progress in `users/{uid}/progress`, and roadmap progress/notes in `users/{uid}/roadmap` (owner-only).
- **Shared curriculum** — the JavaScript roadmap curriculum lives in the shared, app-read-only document `roadmaps/javascript`. It is updated only through code and deployments (Firebase console / admin SDK); the app never writes to it. The roadmap loader fetches it from Firestore, caches it locally, and falls back to the cached / embedded copy when the network is unavailable.

The project catalog itself comes from the locally generated `data/projects.json` — no seeding or manual Firestore edits required.

## 🎨 Design

- **Colors** — primary green `#22C55E`, pure white backgrounds, soft shadows, gray text
- **Typography** — Inter (UI) + JetBrains Mono (code)
- **Style** — Apple / Vercel / Linear-inspired: generous white space, rounded corners, subtle glass navbar

## 🛠 Tech Stack

HTML5 · Plain CSS · Vanilla JavaScript · Firebase Auth + Firestore (ES modules via CDN)

## 📄 License

Free to use for learning and portfolio purposes.
