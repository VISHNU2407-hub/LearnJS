/* ============================================================
   LearnJS — seed.js
   25 sample JavaScript projects used to populate the Firestore
   `projects` collection on first dashboard load.

   The dashboard reads projects dynamically from Firestore, so
   any project added there later appears automatically without
   touching the code. This file is only the initial seed.
   ============================================================ */

import {
  collection,
  getDocs,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const DAY = 24 * 60 * 60 * 1000;

/** Cover images use picsum.photos seeded URLs — deterministic and reliable. */
const cover = (slug) => `https://picsum.photos/seed/learnjs-${slug}/800/450`;

const SEED_PROJECTS = [
  { slug: 'calculator', title: 'Calculator', description: 'A polished calculator with keyboard support, chained operations and a dark mode — the classic first build.', coverImage: cover('calculator'), difficulty: 'Beginner', estimatedTime: '2 hours', tags: ['DOM', 'Events', 'Math'], category: 'Core JS', order: 1, isPublished: true, createdAt: new Date(1783575597396) },
  { slug: 'weather-app', title: 'Weather App', description: 'Live weather with geolocation, a 5-day forecast and dynamic condition icons fetched from a public API.', coverImage: cover('weather-app'), difficulty: 'Intermediate', estimatedTime: '4 hours', tags: ['API', 'Fetch', 'Geolocation'], category: 'APIs & Data', order: 2, isPublished: true, createdAt: new Date(1783661997396) },
  { slug: 'todo-app', title: 'Todo App', description: 'A beautiful task manager with priorities, filters and localStorage persistence — the productivity staple.', coverImage: cover('todo-app'), difficulty: 'Beginner', estimatedTime: '2 hours', tags: ['CRUD', 'LocalStorage', 'DOM'], category: 'Core JS', order: 3, isPublished: true, createdAt: new Date(1783748397396) },
  { slug: 'expense-tracker', title: 'Expense Tracker', description: 'Track spending with monthly budgets, category breakdowns and chart visualisations that update live.', coverImage: cover('expense-tracker'), difficulty: 'Intermediate', estimatedTime: '5 hours', tags: ['Charts', 'LocalStorage', 'CRUD'], category: 'APIs & Data', order: 4, isPublished: true, createdAt: new Date(1783834797396) },
  { slug: 'quiz-app', title: 'Quiz App', description: 'Timed multiple-choice quizzes with scoring, progress feedback and a final results screen.', coverImage: cover('quiz-app'), difficulty: 'Beginner', estimatedTime: '3 hours', tags: ['State', 'Events', 'DOM'], category: 'Core JS', order: 5, isPublished: true, createdAt: new Date(1783921197396) },
  { slug: 'notes-app', title: 'Notes App', description: 'Markdown notes with live search, color-coded tags and a card layout — organised the way you think.', coverImage: cover('notes-app'), difficulty: 'Intermediate', estimatedTime: '4 hours', tags: ['CRUD', 'Search', 'LocalStorage'], category: 'Core JS', order: 6, isPublished: true, createdAt: new Date(1784007597396) },
  { slug: 'typing-speed-test', title: 'Typing Speed Test', description: 'Measure words-per-minute with live WPM tracking, accuracy stats and difficulty presets.', coverImage: cover('typing-speed-test'), difficulty: 'Intermediate', estimatedTime: '4 hours', tags: ['Timers', 'DOM', 'Stats'], category: 'Core JS', order: 7, isPublished: true, createdAt: new Date(1784093997396) },
  { slug: 'password-generator', title: 'Password Generator', description: 'Cryptographically secure passwords with a live strength meter and one-click copy.', coverImage: cover('password-generator'), difficulty: 'Beginner', estimatedTime: '2 hours', tags: ['Crypto', 'DOM', 'Clipboard'], category: 'Core JS', order: 8, isPublished: true, createdAt: new Date(1784180397396) },
  { slug: 'music-player', title: 'Music Player', description: 'A full-featured audio player with playlists, seek bar, shuffle and repeat controls.', coverImage: cover('music-player'), difficulty: 'Advanced', estimatedTime: '8 hours', tags: ['Audio', 'State', 'UI'], category: 'Advanced', order: 9, isPublished: true, createdAt: new Date(1784266797396) },
  { slug: 'qr-generator', title: 'QR Generator', description: 'Generate and download QR codes from any text or URL using a rendering library.', coverImage: cover('qr-generator'), difficulty: 'Intermediate', estimatedTime: '3 hours', tags: ['Library', 'Canvas', 'Download'], category: 'APIs & Data', order: 10, isPublished: true, createdAt: new Date(1784353197396) },
  { slug: 'kanban-board', title: 'Kanban Board', description: 'A drag-and-drop kanban board with columns, tags and persistence — Trello in vanilla JS.', coverImage: cover('kanban-board'), difficulty: 'Advanced', estimatedTime: '8 hours', tags: ['Drag & Drop', 'State', 'LocalStorage'], category: 'Advanced', order: 11, isPublished: true, createdAt: new Date(1784439597396) },
  { slug: 'recipe-finder', title: 'Recipe Finder', description: 'Search thousands of recipes by ingredient, save favourites and view step-by-step instructions.', coverImage: cover('recipe-finder'), difficulty: 'Intermediate', estimatedTime: '5 hours', tags: ['API', 'Search', 'Fetch'], category: 'APIs & Data', order: 12, isPublished: true, createdAt: new Date(1784525997396) },
  { slug: 'movie-search', title: 'Movie Search', description: 'Discover movies and shows with a live search UI, posters, ratings and detail modals.', coverImage: cover('movie-search'), difficulty: 'Intermediate', estimatedTime: '5 hours', tags: ['API', 'Fetch', 'Modals'], category: 'APIs & Data', order: 13, isPublished: true, createdAt: new Date(1784612397396) },
  { slug: 'ecommerce-cart', title: 'E-commerce Cart', description: 'A shopping cart with add/remove, quantity controls, promo codes and a checkout summary.', coverImage: cover('ecommerce-cart'), difficulty: 'Advanced', estimatedTime: '8 hours', tags: ['State', 'LocalStorage', 'Checkout'], category: 'Advanced', order: 14, isPublished: true, createdAt: new Date(1784698797396) },
  { slug: 'portfolio-website', title: 'Portfolio Website', description: 'A modern developer portfolio with smooth scroll, project showcase and a contact form.', coverImage: cover('portfolio-website'), difficulty: 'Beginner', estimatedTime: '6 hours', tags: ['HTML', 'CSS', 'Animations'], category: 'Full-Stack', order: 15, isPublished: true, createdAt: new Date(1784785197396) },
  { slug: 'chat-application', title: 'Chat Application', description: 'Real-time chat with rooms, usernames and message history — a full websocket experience.', coverImage: cover('chat-application'), difficulty: 'Advanced', estimatedTime: '10 hours', tags: ['WebSockets', 'Realtime', 'UI'], category: 'Full-Stack', order: 16, isPublished: true, createdAt: new Date(1784871597396) },
  { slug: 'blog-cms', title: 'Blog CMS', description: 'A content management system with post editor, categories, drafts and a public blog view.', coverImage: cover('blog-cms'), difficulty: 'Advanced', estimatedTime: '10 hours', tags: ['CRUD', 'State', 'Routing'], category: 'Full-Stack', order: 17, isPublished: true, createdAt: new Date(1784957997396) },
  { slug: 'markdown-editor', title: 'Markdown Editor', description: 'A split-pane markdown editor with live preview, syntax shortcuts and export to HTML.', coverImage: cover('markdown-editor'), difficulty: 'Advanced', estimatedTime: '6 hours', tags: ['Markdown', 'Editor', 'Export'], category: 'Advanced', order: 18, isPublished: true, createdAt: new Date(1785044397396) },
  { slug: 'file-explorer', title: 'File Explorer', description: 'A virtual file explorer with a folder tree, breadcrumbs, create/rename/delete and search.', coverImage: cover('file-explorer'), difficulty: 'Advanced', estimatedTime: '8 hours', tags: ['Trees', 'State', 'CRUD'], category: 'Advanced', order: 19, isPublished: true, createdAt: new Date(1785130797396) },
  { slug: 'memory-game', title: 'Memory Game', description: 'Match card pairs against the clock with moves tracking, levels and a victory animation.', coverImage: cover('memory-game'), difficulty: 'Beginner', estimatedTime: '2 hours', tags: ['State', 'Timers', 'DOM'], category: 'Games', order: 20, isPublished: true, createdAt: new Date(1785217197396) },
  { slug: 'tic-tac-toe', title: 'Tic Tac Toe', description: 'Play against a friend or an unbeatable AI with move history and win detection.', coverImage: cover('tic-tac-toe'), difficulty: 'Beginner', estimatedTime: '2 hours', tags: ['AI', 'Logic', 'DOM'], category: 'Games', order: 21, isPublished: true, createdAt: new Date(1785303597396) },
  { slug: 'snake-game', title: 'Snake Game', description: 'The classic snake on a canvas with increasing speed, high scores and keyboard controls.', coverImage: cover('snake-game'), difficulty: 'Intermediate', estimatedTime: '4 hours', tags: ['Canvas', 'Game Loop', 'Keyboard'], category: 'Games', order: 22, isPublished: true, createdAt: new Date(1785389997396) },
  { slug: 'library-management', title: 'Library Management', description: 'Track books, members and loans with search, filters and due-date reminders.', coverImage: cover('library-management'), difficulty: 'Intermediate', estimatedTime: '6 hours', tags: ['CRUD', 'Search', 'LocalStorage'], category: 'APIs & Data', order: 23, isPublished: true, createdAt: new Date(1785476397396) },
  { slug: 'authentication-system', title: 'Authentication System', description: 'A complete auth flow — signup, login, password reset and protected routes with validation.', coverImage: cover('authentication-system'), difficulty: 'Advanced', estimatedTime: '8 hours', tags: ['Auth', 'Validation', 'Routing'], category: 'Full-Stack', order: 24, isPublished: true, createdAt: new Date(1785562797396) },
  { slug: 'realtime-chat', title: 'Realtime Chat', description: 'Firebase-powered realtime chat with typing indicators, reactions and online presence.', coverImage: cover('realtime-chat'), difficulty: 'Advanced', estimatedTime: '10 hours', tags: ['Firebase', 'Realtime', 'UI'], category: 'Full-Stack', order: 25, isPublished: true, createdAt: new Date(1785649197396) }
];

/**
 * Seed the `projects` collection with the 25 sample projects,
 * but only when the collection is empty (no duplicates).
 * @returns {Promise<boolean>} true if the seed ran
 */
async function seedProjectsIfEmpty(db) {
  const col = collection(db, "projects");
  const snap = await getDocs(col);
  if (!snap.empty) return false;

  for (const project of SEED_PROJECTS) {
    const { slug, ...data } = project;
    await setDoc(doc(col, slug), { ...data, createdAt: new Date(data.createdAt) });
  }
  return true;
}

export { SEED_PROJECTS, seedProjectsIfEmpty };
// end of seed.js
