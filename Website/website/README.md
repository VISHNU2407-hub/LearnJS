# LearnJS

> Learn JavaScript by building real projects — guided roadmaps, 100+ hands-on projects, interview prep and a 24/7 AI mentor.

A premium, fully responsive JavaScript learning platform built with **HTML5, Tailwind CSS, vanilla JavaScript and Firebase Authentication**.

## ✨ Features

- **Landing page** — hero with live code editor mockup, animated stats, featured projects, roadmap, why-LearnJS cards, testimonial slider, newsletter and footer
- **Authentication** — email/password sign up & login, Google sign-in, show/hide password, remember me, forgot password, persistent sessions, avatar dropdown when signed in
- **Theme toggle** — light/dark mode with localStorage persistence
- **5 nav pages** — Projects, Roadmap, Interview, Resources and Community (polished coming-soon pages, no dead links)
- **Animations** — scroll reveals, animated counters, typewriter, testimonial slider, scroll progress, smooth scrolling, hover micro-interactions (no animation library)
- **Global search** — filters nav pages and section links as you type
- **Responsive** — desktop, tablet and mobile, mobile drawer menu

## 🚀 Getting Started

### Option 1 — Open directly

Open `index.html` in your browser. Everything works offline except Google Fonts, Tailwind CDN and Firebase auth.

### Option 2 — Live Server (recommended)

```bash
# VS Code: right-click index.html → "Open with Live Server"
# or any static server:
npx serve website
python -m http.server 8080 -d website   # optional
```

Firebase auth requires an `http(s)` origin — use a local server rather than `file://`.

## 🗂 Project Structure

```
website/
├── index.html          # Landing page
├── login.html          # Sign in (email/password + Google)
├── signup.html         # Create account
├── projects.html       # Coming-soon page
├── roadmap.html        # Coming-soon page
├── interview.html      # Coming-soon page
├── resources.html      # Coming-soon page
├── community.html      # Coming-soon page
├── css/
│   ├── style.css       # Design tokens, reset, layout
│   ├── components.css  # Buttons, hero, cards, footer…
│   ├── animations.css  # Keyframes + reveal system
│   └── responsive.css  # Tablet/mobile breakpoints
├── js/
│   ├── theme.js        # Dark mode
│   ├── navbar.js       # Sticky nav, drawer, search, smooth scroll
│   ├── animations.js   # Reveals, counters, slider, back-to-top
│   ├── app.js          # Toasts, newsletter, notify forms
│   ├── firebase.js     # Firebase init (app, auth, provider)
│   └── auth.js         # Auth flows + navbar auth UI (ES module)
├── assets/
│   ├── images/         # Decorative SVGs
│   ├── icons/          # Inline-style icon SVGs
│   └── logos/          # Logo mark
└── README.md
```

## 🔐 Firebase Setup

Authentication is pre-wired to a Firebase project in `js/firebase.js`. To use your own project:

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a project.
2. **Authentication → Sign-in method** → enable **Email/Password** and **Google**.
3. Add a web app, copy the config, and replace the `firebaseConfig` in `js/firebase.js`.
4. If you deploy, add your domain to **Authorized domains**.

## 🎨 Design

- **Colors** — primary green `#22C55E`, pure white backgrounds, soft shadows, gray text
- **Typography** — Inter (UI) + JetBrains Mono (code)
- **Style** — Apple / Vercel / Linear-inspired: generous white space, rounded corners, subtle glass navbar

## 🛠 Tech Stack

HTML5 · Tailwind CSS (CDN) · Plain CSS · Vanilla JavaScript · Firebase Auth (ES modules via CDN)

## 📄 License

Free to use for learning and portfolio purposes.
