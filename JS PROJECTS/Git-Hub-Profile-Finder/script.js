/* ============================================
   GITHUB PROFILE FINDER — JAVASCRIPT
   ============================================
   Table of Contents:
   1.  DOM References
   2.  Utility Functions
   3.  Recent Searches (Local Storage)
   4.  UI Helpers (Show / Hide / Loading)
   5.  Error Display
   6.  API — Get Profile
   7.  API — Get Repositories
   8.  UI — Update Profile
   9.  UI — Update Repositories
   10. UI — Formatting Helpers
   11. Search Handler
   12. Event Listeners
   13. Initialisation
   ============================================ */

/* =========================================
   1.  DOM REFERENCES
   ========================================= */

const dom = {
  // Search
  searchForm: document.getElementById('searchForm'),
  searchInput: document.getElementById('searchInput'),
  searchBtn: document.getElementById('searchBtn'),
  searchBtnText: document.querySelector('.search-form__btn-text'),
  searchSpinner: document.getElementById('searchSpinner'),
  clearBtn: document.getElementById('clearBtn'),

  // Recent searches
  recentSearches: document.getElementById('recentSearches'),
  recentSearchesList: document.getElementById('recentSearchesList'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),

  // Results section
  resultsSection: document.getElementById('resultsSection'),
  loadingIndicator: document.getElementById('loadingIndicator'),
  errorCard: document.getElementById('errorCard'),
  errorTitle: document.getElementById('errorTitle'),
  errorMessage: document.getElementById('errorMessage'),

  // Profile card
  profileCard: document.getElementById('profileCard'),
  profileAvatar: document.getElementById('profileAvatar'),
  profileName: document.getElementById('profileName'),
  profileUsername: document.getElementById('profileUsername'),
  profileBio: document.getElementById('profileBio'),
  profileRepos: document.getElementById('profileRepos'),
  profileFollowers: document.getElementById('profileFollowers'),
  profileFollowing: document.getElementById('profileFollowing'),
  profileDetails: document.getElementById('profileDetails'),
  profileJoined: document.getElementById('profileJoined'),
  viewProfileBtn: document.getElementById('viewProfileBtn'),
  copyUrlBtn: document.getElementById('copyUrlBtn'),

  // Repos
  reposSection: document.getElementById('reposSection'),
  reposGrid: document.getElementById('reposGrid'),
};

/* =========================================
   2.  UTILITY FUNCTIONS
   ========================================= */

/**
 * Formats a date string (ISO 8601) into a human-readable format.
 * Example: "2011-01-25T18:44:36Z" → "January 25, 2011"
 * @param {string} dateStr - ISO date string from GitHub API
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Safely gets a text value or returns a fallback string.
 * @param {string|null|undefined} value
 * @param {string} fallback
 * @returns {string}
 */
function safeText(value, fallback = 'Not specified') {
  return value && value.trim() ? value.trim() : fallback;
}

/**
 * Checks if a string is blank (empty or only whitespace).
 * @param {string} str
 * @returns {boolean}
 */
function isBlank(str) {
  return !str || str.trim().length === 0;
}

/* =========================================
   3.  RECENT SEARCHES (Local Storage)
   ========================================= */

const STORAGE_KEY = 'ghprofilefinder_recent';
const MAX_RECENT = 8;

/**
 * Retrieves the list of recent searches from localStorage.
 * @returns {string[]}
 */
function getRecentSearches() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    // localStorage might be blocked / corrupted — silently ignore
    return [];
  }
}

/**
 * Saves a username to the top of recent searches (no duplicates).
 * @param {string} username
 */
function saveRecentSearch(username) {
  let recent = getRecentSearches();

  // Remove if already present (so it moves to the top)
  recent = recent.filter((u) => u.toLowerCase() !== username.toLowerCase());

  // Add to the beginning
  recent.unshift(username);

  // Keep only the latest MAX_RECENT entries
  if (recent.length > MAX_RECENT) {
    recent = recent.slice(0, MAX_RECENT);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  } catch {
    // Storage full or blocked — fail silently
  }
}

/**
 * Removes a specific username from recent searches.
 * @param {string} username
 */
function removeRecentSearch(username) {
  let recent = getRecentSearches();
  recent = recent.filter((u) => u.toLowerCase() !== username.toLowerCase());

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  } catch {
    // fail silently
  }
}

/**
 * Clears all recent searches from localStorage.
 */
function clearRecentSearches() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // fail silently
  }
}

/**
 * Renders the recent search tags into the DOM.
 */
function renderRecentSearches() {
  const recent = getRecentSearches();

  if (recent.length === 0) {
    dom.recentSearches.hidden = true;
    return;
  }

  dom.recentSearches.hidden = false;
  dom.recentSearchesList.innerHTML = recent
    .map(
      (username) => `
        <button
          type="button"
          class="recent-search-tag"
          data-username="${username}"
          aria-label="Search for ${username}"
        >
          <svg class="recent-search-tag__icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          ${escapeHtml(username)}
        </button>
      `
    )
    .join('');
}

/**
 * Simple HTML escaping to prevent XSS via usernames.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* =========================================
   4.  UI HELPERS (Show / Hide / Loading)
   ========================================= */

/**
 * Shows the loading spinner and disables the search button.
 */
function showLoading() {
  dom.loadingIndicator.hidden = false;
  dom.profileCard.hidden = true;
  dom.reposSection.hidden = true;
  dom.errorCard.hidden = true;
  dom.searchBtn.disabled = true;
  dom.searchBtnText.textContent = 'Searching';
  dom.searchSpinner.hidden = false;
}

/**
 * Hides the loading spinner and re-enables the search button.
 */
function hideLoading() {
  dom.loadingIndicator.hidden = true;
  dom.searchBtn.disabled = false;
  dom.searchBtnText.textContent = 'Search';
  dom.searchSpinner.hidden = true;
}

/**
 * Shows the results section with a fade-in.
 */
function showResultsSection() {
  dom.resultsSection.hidden = false;
}

/**
 * Hides the results section entirely.
 */
function hideResultsSection() {
  dom.resultsSection.hidden = true;
  dom.profileCard.hidden = true;
  dom.reposSection.hidden = true;
  dom.errorCard.hidden = true;
}

/* =========================================
   5.  ERROR DISPLAY
   ========================================= */

/**
 * Shows a styled error card with the given title and message.
 * @param {string} title
 * @param {string} message
 */
function showError(title, message) {
  hideLoading();
  dom.errorCard.hidden = false;
  dom.profileCard.hidden = true;
  dom.reposSection.hidden = true;
  dom.errorTitle.textContent = title;
  dom.errorMessage.textContent = message;
}

/* =========================================
   6.  API — GET PROFILE
   ========================================= */

/**
 * Fetches a GitHub user's profile data.
 * @param {string} username - The GitHub username to look up
 * @returns {Promise<Object>} The user's profile data
 * @throws Will throw an error with a descriptive message on failure
 */
async function getProfile(username) {
  // Build the API URL dynamically
  const url = `https://api.github.com/users/${encodeURIComponent(username)}`;

  const response = await fetch(url);

  // Handle 404 — user not found
  if (response.status === 404) {
    throw new Error('not-found');
  }

  // Handle rate limiting (403 with a specific header)
  if (response.status === 403) {
    throw new Error('rate-limit');
  }

  // Handle other non-OK statuses
  if (!response.ok) {
    throw new Error('network');
  }

  return response.json();
}

/* =========================================
   7.  API — GET REPOSITORIES
   ========================================= */

/**
 * Fetches the latest 6 public repositories for a given user.
 * @param {string} username
 * @returns {Promise<Array>} Array of repository objects
 */
async function getRepositories(username) {
  const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6&type=public`;

  const response = await fetch(url);

  if (!response.ok) {
    // Repos are optional — if this fails, we simply don't show them
    return [];
  }

  return response.json();
}

/* =========================================
   8.  UI — UPDATE PROFILE
   ========================================= */

/**
 * Populates the profile card with data from the GitHub API.
 * @param {Object} user - The user object from the GitHub API
 */
function updateProfileUI(user) {
  // Avatar
  dom.profileAvatar.src = user.avatar_url || '';
  dom.profileAvatar.alt = `${user.login || 'User'}'s GitHub avatar`;

  // Name & Username
  dom.profileName.textContent = user.name || user.login;
  dom.profileUsername.textContent = `@${user.login}`;
  dom.profileUsername.href = user.html_url;

  // Bio
  dom.profileBio.textContent = user.bio || 'No bio available.';

  // Stats
  dom.profileRepos.textContent = user.public_repos ?? 0;
  dom.profileFollowers.textContent = user.followers ?? 0;
  dom.profileFollowing.textContent = user.following ?? 0;

  // View profile button + copy
  dom.viewProfileBtn.href = user.html_url;
  const profileUrl = user.html_url;
  dom.copyUrlBtn.dataset.url = profileUrl;

  // Details grid — build dynamically
  const details = [
    { icon: 'building', label: 'Company', value: safeText(user.company) },
    { icon: 'map-pin', label: 'Location', value: safeText(user.location) },
    { icon: 'link', label: 'Website', value: user.blog || null, isLink: true },
    { icon: 'twitter', label: 'Twitter', value: user.twitter_username || null, isTwitter: true },
    { icon: 'mail', label: 'Email', value: user.email || null, isMailto: true },
  ];

  dom.profileDetails.innerHTML = details
    .filter((d) => d.value !== null) // only show available info
    .map((d) => buildDetailItem(d))
    .join('');

  // Joined date
  dom.profileJoined.textContent = `Joined ${formatDate(user.created_at)}`;

  // Show the card
  dom.profileCard.hidden = false;
}

/**
 * Builds a single profile detail item's HTML.
 * @param {Object} detail
 * @returns {string} HTML string
 */
function buildDetailItem(detail) {
  const iconSvg = getDetailIcon(detail.icon);

  let content = '';
  if (detail.isLink) {
    content = `<a href="${detail.value}" target="_blank" rel="noopener noreferrer" class="profile-detail__link">${escapeHtml(detail.value)}</a>`;
  } else if (detail.isTwitter) {
    const twitterUrl = `https://twitter.com/${detail.value}`;
    content = `<a href="${twitterUrl}" target="_blank" rel="noopener noreferrer" class="profile-detail__link">@${escapeHtml(detail.value)}</a>`;
  } else if (detail.isMailto) {
    content = `<a href="mailto:${detail.value}" class="profile-detail__link">${escapeHtml(detail.value)}</a>`;
  } else {
    content = escapeHtml(detail.value);
  }

  return `
    <div class="profile-detail">
      ${iconSvg}
      <span>${content}</span>
    </div>
  `;
}

/**
 * Returns the appropriate SVG icon for a given detail type.
 * @param {string} type
 * @returns {string} SVG markup
 */
function getDetailIcon(type) {
  const icons = {
    building: `<svg class="profile-detail__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><line x1="8" y1="6" x2="10" y2="6"></line><line x1="14" y1="6" x2="16" y2="6"></line><line x1="8" y1="10" x2="10" y2="10"></line><line x1="14" y1="10" x2="16" y2="10"></line><line x1="8" y1="14" x2="10" y2="14"></line><line x1="14" y1="14" x2="16" y2="14"></line></svg>`,
    'map-pin': `<svg class="profile-detail__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    link: `<svg class="profile-detail__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    twitter: `<svg class="profile-detail__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>`,
    mail: `<svg class="profile-detail__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  };

  return icons[type] || icons['link'];
}

/* =========================================
   9.  UI — UPDATE REPOSITORIES
   ========================================= */

/**
 * Populates the repository cards grid.
 * @param {Array} repos - Array of repository objects from GitHub API
 */
function updateRepositoryUI(repos) {
  if (!repos || repos.length === 0) {
    dom.reposSection.hidden = true;
    return;
  }

  dom.reposGrid.innerHTML = repos.map((repo) => buildRepoCard(repo)).join('');
  dom.reposSection.hidden = false;
}

/**
 * Builds a single repository card's HTML.
 * @param {Object} repo - A repository object from the API
 * @returns {string} HTML string
 */
function buildRepoCard(repo) {
  const langColor = getLanguageColor(repo.language);

  return `
    <div class="repo-card" role="listitem">
      <div class="repo-card__name">
        <svg class="repo-card__name-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(repo.name)}
        </a>
      </div>
      <p class="repo-card__description">
        ${repo.description ? escapeHtml(repo.description) : 'No description provided.'}
      </p>
      <div class="repo-card__meta">
        ${repo.language ? `
          <span class="repo-card__language">
            <span class="repo-card__lang-dot" style="background: ${langColor};"></span>
            ${escapeHtml(repo.language)}
          </span>
        ` : ''}
        <span class="repo-card__stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          ${repo.stargazers_count ?? 0}
        </span>
        <span class="repo-card__stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          ${repo.forks_count ?? 0}
        </span>
      </div>
    </div>
  `;
}

/**
 * Returns a CSS-friendly hex color for a given programming language.
 * This is a curated subset of popular languages.
 * @param {string|null} language
 * @returns {string} Hex color
 */
function getLanguageColor(language) {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Ruby: '#701516',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    PHP: '#4F5D95',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Rust: '#dea584',
    Dart: '#00B4AB',
    Scala: '#c22d40',
    Shell: '#89e051',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Vue: '#41b883',
    Lua: '#000080',
    Haskell: '#5e5086',
    Elixir: '#6e4a7e',
    Clojure: '#db5855',
    Perl: '#0298c3',
    R: '#198ce7',
    ObjectiveC: '#438eff',
    Assembly: '#6E4C13',
    PowerShell: '#012456',
    Terraform: '#844fba',
    Dockerfile: '#384d54',
    Makefile: '#427819',
    Zig: '#ec915c',
    Nim: '#37775b',
    Crystal: '#000100',
    Solidity: '#AA6746',
  };

  return colors[language] || '#858585';
}

/* =========================================
   10.  SEARCH HANDLER
   ========================================= */

/**
 * Main search function: orchestrates fetching profile + repos
 * and updating the UI accordingly.
 */
async function searchProfile() {
  const username = dom.searchInput.value.trim();

  // --- Validation: prevent empty searches ---
  if (isBlank(username)) {
    // Must show the results section first so the error card is visible
    showResultsSection();
    showError('Empty Username', 'Please enter a GitHub username to search for.');
    dom.searchInput.focus();
    return;
  }

  // Show loading state
  showLoading();
  showResultsSection();

  try {
    // Fetch profile data
    const user = await getProfile(username);

    // --- Fetch repositories (in parallel with profile) ---
    // We use .catch() here so the repos request won't block the whole UI
    // if it fails — we'll gracefully show nothing if repos don't load.
    const reposPromise = getRepositories(username).catch(() => []);

    // Update profile UI
    updateProfileUI(user);

    // Wait for repos and update
    const repos = await reposPromise;
    updateRepositoryUI(repos);

    // Save to recent searches
    saveRecentSearch(username);
    renderRecentSearches();

    // Hide loading
    hideLoading();
  } catch (error) {
    // --- Error handling ---
    hideLoading();

    const message = error.message;

    if (message === 'not-found') {
      showError(
        'User Not Found',
        `We couldn't find a GitHub user named "${username}". Please check the spelling and try again.`
      );
    } else if (message === 'rate-limit') {
      showError(
        'API Rate Limit Exceeded',
        'GitHub API rate limit has been exceeded. Please wait a few minutes and try again.'
      );
    } else if (message === 'network') {
      showError(
        'Server Error',
        'GitHub API returned an unexpected error. Please try again later.'
      );
    } else {
      // Network error (no internet, DNS failure, etc.)
      showError(
        'Network Error',
        'Unable to connect to GitHub API. Please check your internet connection and try again.'
      );
    }
  }
}

/* =========================================
   11.  EVENT LISTENERS
   ========================================= */

/**
 * Sets up all event listeners for the application.
 */
function setupEventListeners() {
  // --- Search form submit ---
  dom.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchProfile();
  });

  // --- Show/hide clear button based on input ---
  dom.searchInput.addEventListener('input', () => {
    dom.clearBtn.hidden = dom.searchInput.value.length === 0;
  });

  // --- Clear input button ---
  dom.clearBtn.addEventListener('click', () => {
    dom.searchInput.value = '';
    dom.searchInput.focus();
    dom.clearBtn.hidden = true;
  });

  // --- Recent search tag clicks (event delegation) ---
  dom.recentSearchesList.addEventListener('click', (e) => {
    // Find the closest button tag
    const tag = e.target.closest('.recent-search-tag');
    if (tag) {
      const username = tag.dataset.username;
      dom.searchInput.value = username;
      dom.clearBtn.hidden = false;
      searchProfile();
    }
  });

  // --- Clear all history ---
  dom.clearHistoryBtn.addEventListener('click', () => {
    clearRecentSearches();
    renderRecentSearches();
  });

  // --- Copy profile URL to clipboard ---
  dom.copyUrlBtn.addEventListener('click', async () => {
    const url = dom.copyUrlBtn.dataset.url;
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      // Visual feedback
      dom.copyUrlBtn.classList.add('copied');
      dom.copyUrlBtn.title = 'Copied!';

      // Reset after 2 seconds
      setTimeout(() => {
        dom.copyUrlBtn.classList.remove('copied');
        dom.copyUrlBtn.title = 'Copy profile URL';
      }, 2000);
    } catch {
      // Clipboard API might not be available (e.g. HTTP context)
      // Fallback: select the URL from the username link
      const usernameLink = dom.profileUsername;
      const range = document.createRange();
      range.selectNodeContents(usernameLink);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });

  // --- Keyboard shortcut: Escape clears input ---
  dom.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dom.searchInput.value = '';
      dom.clearBtn.hidden = true;
      dom.searchInput.blur();
    }
  });
}

/* =========================================
   12.  INITIALISATION
   ========================================= */

/**
 * Bootstraps the application on page load.
 */
function init() {
  setupEventListeners();
  renderRecentSearches();

  // Auto-focus the search input
  dom.searchInput.focus();
}

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
