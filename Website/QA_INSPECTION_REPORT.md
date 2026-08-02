# LearnJS Functional Inspection Report

**Date:** August 2, 2026
**Scope:** Functionality, workflow, authentication, routing, application logic (no UI redesign)
**Method:** Live browser testing (Chrome) against a local server + full source code review

---

## Authentication Status

**PASS** (with security finding - see Bugs: Critical)

| Test | Result |
|------|--------|
| Sign Up (Email/Password) | PASS - account created, redirected to home, success toast, navbar avatar appears |
| Login (Email/Password) | PASS - redirected to home, avatar appears, welcome toast |
| Google Sign-In | Code review PASS - signInWithPopup + provider correctly wired on both pages. Full popup flow requires a real Google account |
| Logout | PASS - avatar menu -> Sign Out -> navbar returns to Sign In |
| Session Persistence | PASS - stays signed in after refresh and across pages |
| Auth State Listener | PASS - onAuthStateChanged correctly updates navbar everywhere |
| Invalid Credentials | PASS - Incorrect email or password (friendly message) |
| Duplicate Registration | PASS - An account with this email already exists (stays on page) |
| Weak Password | PASS - Password must be at least 6 characters + strength meter |
| Invalid Email | PASS - Enter a valid email address |
| Empty Fields | PASS - per-field errors shown, submission blocked |
| Password Visibility Toggle | PASS - eye toggle switches type + aria-label (code-reviewed) |
| Remember Me | PASS - setPersistence local vs session based on checkbox |
| Forgot Password | PASS - sendPasswordResetEmail with friendly toast (code-reviewed) |
| Terms required on signup | PASS - toast Please accept the Terms of Service |

---

## Navigation Status

**PASS**

- All 8 pages return HTTP 200: index, projects, roadmap, interview, resources, community, login, signup
- All referenced assets (CSS x4, JS x6, logo, grid pattern) return 200 - no 404s, no missing assets
- Active nav state correctly set on each page (nav-link active)
- No broken links - every internal href target exists
- No dead coming-soon pages - all pages fully rendered
- Global search dropdown + theme toggle verified; no errors

---

## Firebase Status

**PASS**

- Single initialization in js/firebase.js - no duplicate init
- Modular SDK v12 from gstatic CDN - correct imports, consistent version
- getAnalytics wrapped in try/catch - cannot block the app
- Real project config (learnjs-vks) - live signup/login/reset succeeded
- No missing imports, no config mistakes

---

## Session Management

**PASS**

- Local persistence (Remember me / after signup) -> survives refresh and cross-page navigation
- Session persistence (default login) -> tab-scoped, as designed
- Logout -> immediate navbar update via auth listener
- Guest state correctly restored after logout + refresh

---

## Console Errors

| Page | Errors |
|------|--------|
| Home | None (only standard Tailwind CDN warning) |
| Login | None (expected Firebase 400 for invalid credentials - handled) |
| Signup | None (expected 400 for duplicate account) |
| Projects/Roadmap/Interview/Resources/Community | None |

No unhandled promise rejections, no broken scripts, no 404s, no missing assets.

---

## Bugs Found

### Critical

1. **Open redirect / reflected-JS execution via ?next= parameter** (js/auth.js -> nextPath())
   - nextPath() returns the raw ?next= query value and window.location.href = nextPath() executes it on every successful login/signup/Google sign-in.
   - A crafted URL like login.html?next=https://evil.com redirects users off-site after sign-in (phishing vector).
   - Worse: signup.html?next=javascript:alert(1) executes arbitrary script in the page origin on account creation.
   - Fix: whitelist the next value to same-site relative paths only.

### High

- None found.

### Medium

2. setPersistence called on every login submit can throw auth/already-initialized for an already signed-in user revisiting the login page - raw error would surface. Edge case, low frequency.
3. No email verification step after signup (acceptable for demo, but a real auth gap).

### Low

4. Duplicate document-level listeners accumulate in renderAuthArea - a new outside-click handler registered on every auth-state change. Minor leak.
5. Unmapped Firebase error codes (auth/popup-blocked, auth/cancelled-popup-request, auth/unauthorized-domain) fall back to raw err.message.
6. Dead links - Terms of Service / Privacy Policy on signup page and footer are href="#".

---

## Missing Functionality

- Redirect-back after login: no in-app link currently passes ?next=, so return-to-where-you-were is dead code (safe after Critical fix).
- Email verification / resend - not implemented.
- Password confirmation field on signup - not implemented (nice-to-have).
- Route protection - not applicable: all pages public by design.

---

## Recommended Fixes (priority order)

1. **P0 - Fix nextPath() open redirect / JS execution** in js/auth.js (Critical, security).
2. **P1 - Guard setPersistence** so an already-initialized auth instance can't produce a raw error on login.
3. **P1 - Add friendly error mappings** for auth/popup-blocked, auth/cancelled-popup-request, auth/unauthorized-domain.
4. **P2 - De-duplicate outside-click listeners** in renderAuthArea.
5. **P2 - Replace dead href="#" links** (Terms/Privacy) with real pages or neutral markup.
6. **P3 - Optional:** email verification flow, password confirmation field.

---
