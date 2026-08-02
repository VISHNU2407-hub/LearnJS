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

Firestore is used **only for per-user data** (profile document + per-project progress in `users/{uid}/progress`). The project catalog itself comes from the locally generated `data/projects.json` — no seeding or manual Firestore edits required.

## 🎨 Design

- **Colors** — primary green `#22C55E`, pure white backgrounds, soft shadows, gray text
- **Typography** — Inter (UI) + JetBrains Mono (code)
- **Style** — Apple / Vercel / Linear-inspired: generous white space, rounded corners, subtle glass navbar

## 🛠 Tech Stack

HTML5 · Plain CSS · Vanilla JavaScript · Firebase Auth + Firestore (ES modules via CDN)

## 📄 License

Free to use for learning and portfolio purposes.
