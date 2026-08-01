/* =============================================
   MOVIE SEARCH APP - JAVASCRIPT
   =============================================
   Sections:
   1.  API Configuration
   2.  DOM References
   3.  State
   4.  Utility Functions
   5.  Search Functions
   6.  Results Grid Functions
   7.  Movie Detail Functions
   8.  UI Update Functions
   9.  Loading & Error Functions
   10. Event Listeners
   11. Initialization
   ============================================= */

// =============================================
// 1. API CONFIGURATION
// =============================================

/**
 * OMDb API key.
 * Replace "YOUR_API_KEY_HERE" with your actual OMDb API key.
 * Get a free key at: https://www.omdbapi.com/apikey.aspx
 */
const API_KEY = "YOUR_API_KEY_HERE";

/** Base URL for the OMDb API */
const API_BASE_URL = "https://www.omdbapi.com/";

// =============================================
// 2. DOM REFERENCES
// =============================================

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
const searchResultsSection = document.getElementById("searchResultsSection");
const searchResultsHeader = document.getElementById("searchResultsHeader");
const searchResultsGrid = document.getElementById("searchResultsGrid");
const movieDetailSection = document.getElementById("movieDetailSection");
const backToResultsBtn = document.getElementById("backToResultsBtn");
const movieContainer = document.getElementById("movieContainer");
const errorSection = document.getElementById("errorSection");
const errorCard = document.getElementById("errorCard");
const emptyState = document.getElementById("emptyState");
const currentYearSpan = document.getElementById("currentYear");

// =============================================
// 3. STATE
// =============================================

/** Current search query string */
let lastSearchQuery = "";

/** Array of search result objects from the last search */
let lastSearchResults = [];

/** Whether the user is currently viewing a movie detail */
let isViewingDetail = false;

// =============================================
// 4. UTILITY FUNCTIONS
// =============================================

/**
 * Get the trimmed search query from the input field.
 * @returns {string} Trimmed search query
 */
function getSearchQuery() {
  return searchInput.value.trim();
}

/**
 * Build the OMDb API URL for a search query (?s=).
 * @param {string} query - The search query
 * @returns {string} The complete API URL
 */
function buildSearchUrl(query) {
  return `${API_BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
}

/**
 * Build the OMDb API URL for a single movie by IMDb ID (?i=).
 * @param {string} imdbID - The IMDb ID
 * @returns {string} The complete API URL
 */
function buildDetailUrl(imdbID) {
  return `${API_BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;
}

/**
 * Format a number with commas for readability.
 * @param {string|number} num - The number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
  if (!num || num === "N/A") return "N/A";
  const parsed = Number(String(num).replace(/,/g, ""));
  if (isNaN(parsed)) return num;
  return parsed.toLocaleString("en-US");
}

/**
 * Hide all dynamic content sections.
 */
function hideAllSections() {
  searchResultsSection.classList.add("hidden");
  movieDetailSection.classList.add("hidden");
  errorSection.classList.add("hidden");
  emptyState.classList.add("hidden");
  loadingSpinner.classList.add("hidden");
}

// =============================================
// 5. SEARCH FUNCTIONS
// =============================================

/**
 * Main search handler — validates input and triggers the API call.
 * Called on button click or Enter key press.
 */
async function searchMovie() {
  const query = getSearchQuery();

  // Prevent empty searches
  if (!query) {
    showError("Oops!", "Please enter a movie title to search.", "fa-film");
    return;
  }

  // Hide all sections, show loading
  hideAllSections();
  showLoading();

  try {
    await searchMoviesByQuery(query);
  } catch (error) {
    hideLoading();
    showError(
      "Something Went Wrong",
      error.message || "An unexpected error occurred. Please try again.",
      "fa-exclamation-triangle"
    );
  }
}

/**
 * Fetch search results from the OMDb API using the ?s= endpoint.
 * @param {string} query - The movie title to search for
 */
async function searchMoviesByQuery(query) {
  const url = buildSearchUrl(query);

  const response = await fetch(url);

  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`Network error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Handle API-level errors
  if (data.Response === "False") {
    hideLoading();

    if (data.Error === "Movie not found!" || data.Error === "Too many results.") {
      showError(
        "No Results Found",
        `We couldn't find any movies matching "<strong>${query}</strong>". Please try a different title.`,
        "fa-search-minus"
      );
      return;
    }

    if (data.Error && data.Error.toLowerCase().includes("key")) {
      showError(
        "Invalid API Key",
        "The OMDb API key is invalid or missing. Please check your API key in <code>script.js</code>.",
        "fa-key"
      );
      return;
    }

    showError("Error", data.Error || "Something went wrong. Please try again.", "fa-exclamation-circle");
    return;
  }

  // Store state
  lastSearchQuery = query;
  lastSearchResults = data.Search || [];
  isViewingDetail = false;

  // Hide loading and display results
  hideLoading();
  displaySearchResults(lastSearchResults, query);
}

// =============================================
// 6. RESULTS GRID FUNCTIONS
// =============================================

/**
 * Display a grid of search result cards.
 * @param {Array} results - Array of movie result objects
 * @param {string} query - The search query
 */
function displaySearchResults(results, query) {
  hideAllSections();

  // Update header with result count
  searchResultsHeader.innerHTML = `
    <h2 class="results-heading">
      Results for "<span>${query}</span>"
    </h2>
    <span class="results-count">${results.length} ${results.length === 1 ? "movie" : "movies"} found</span>
  `;

  // Build the grid of result cards
  const gridHtml = results
    .map((movie) => {
      const poster = movie.Poster && movie.Poster !== "N/A"
        ? `<img class="result-card-poster" src="${movie.Poster}" alt="${movie.Title} poster" loading="lazy" />`
        : `<div class="result-card-placeholder" aria-label="No poster available">
             <i class="fas fa-film"></i>
             <span>No Poster</span>
           </div>`;

      const type = movie.Type && movie.Type !== "N/A"
        ? `<span class="result-card-type"><i class="fas fa-${movie.Type === "series" ? "tv" : "film"}"></i>${movie.Type}</span>`
        : "";

      return `
        <div class="result-card" data-imdbid="${movie.imdbID}" role="button" tabindex="0" aria-label="View details for ${movie.Title}">
          ${poster}
          <div class="result-card-body">
            <h3 class="result-card-title">${movie.Title}</h3>
            <span class="result-card-year">${movie.Year || ""}</span>
            ${type}
          </div>
        </div>
      `;
    })
    .join("");

  searchResultsGrid.innerHTML = gridHtml;
  searchResultsSection.classList.remove("hidden");

  // Scroll to results
  searchResultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Show the previously fetched search results grid (when coming back from detail view).
 */
function showSearchResultsGrid() {
  isViewingDetail = false;
  hideAllSections();
  searchResultsSection.classList.remove("hidden");
  searchResultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// =============================================
// 7. MOVIE DETAIL FUNCTIONS
// =============================================

/**
 * Fetch full movie details by IMDb ID using the ?i= endpoint.
 * @param {string} imdbID - The IMDb ID of the movie
 */
async function getMovieById(imdbID) {
  try {
    const url = buildDetailUrl(imdbID);
    const response = await fetch(url);

    // Handle HTTP errors
    if (!response.ok) {
      hideLoading();
      showError(
        "Network Error",
        `Failed to load movie details (${response.status}). Please try again.`,
        "fa-wifi-slash"
      );
      return;
    }

    const data = await response.json();

    // Handle API-level errors
    if (data.Response === "False") {
      hideLoading();

      if (data.Error && data.Error.toLowerCase().includes("key")) {
        showError(
          "Invalid API Key",
          "The OMDb API key is invalid or missing. Please check your API key in <code>script.js</code>.",
          "fa-key"
        );
        return;
      }

      showError("Error", data.Error || "Could not load movie details.", "fa-exclamation-circle");
      return;
    }

    hideLoading();
    showMovieDetail(data);
  } catch (error) {
    hideLoading();
    showError(
      "Something Went Wrong",
      error.message || "An unexpected error occurred loading the movie details.",
      "fa-exclamation-triangle"
    );
  }
}

/**
 * Display the full movie detail card.
 * @param {Object} movie - The movie data object from OMDb API
 */
function showMovieDetail(movie) {
  isViewingDetail = true;
  hideAllSections();
  movieDetailSection.classList.remove("hidden");

  // Use the existing updateUI to populate the detail card
  populateMovieDetail(movie);

  // Scroll to detail
  movieDetailSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Handle clicking or pressing Enter on a result card.
 * @param {string} imdbID - The IMDb ID to fetch details for
 */
function openMovieDetail(imdbID) {
  if (!imdbID) return;
  // Hide the results grid for a clean transition to detail view
  hideAllSections();
  showLoading();
  getMovieById(imdbID);
}

// =============================================
// 8. UI UPDATE FUNCTIONS
// =============================================

/**
 * Populate the movie detail container with full movie information.
 * @param {Object} movie - The movie data object from OMDb API
 */
function populateMovieDetail(movie) {
  // -- Poster --
  const posterHtml = movie.Poster && movie.Poster !== "N/A"
    ? `<img class="movie-poster" src="${movie.Poster}" alt="${movie.Title} movie poster" loading="lazy" />`
    : `
      <div class="poster-placeholder" aria-label="No movie poster available">
        <i class="fas fa-film"></i>
        <span>No Poster Available</span>
      </div>`;

  // -- Rating --
  const rating = movie.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : null;
  const votes = movie.imdbVotes && movie.imdbVotes !== "N/A" ? movie.imdbVotes : null;

  const ratingHtml = rating
    ? `<div class="movie-rating">
        <i class="fas fa-star"></i>
        <span>${rating}</span>
        ${votes ? `<span class="rating-votes">(${formatNumber(votes)} votes)</span>` : ""}
       </div>`
    : "";

  // -- Year --
  const year = movie.Year && movie.Year !== "N/A" ? movie.Year : "";

  // -- Runtime --
  const runtime = movie.Runtime && movie.Runtime !== "N/A"
    ? `<span class="badge"><i class="far fa-clock"></i>${movie.Runtime}</span>`
    : "";

  // -- Genre --
  const genre = movie.Genre && movie.Genre !== "N/A"
    ? `<span class="badge"><i class="fas fa-tag"></i>${movie.Genre}</span>`
    : "";

  // -- Language --
  const language = movie.Language && movie.Language !== "N/A"
    ? `<span class="badge"><i class="fas fa-globe"></i>${movie.Language}</span>`
    : "";

  // -- Country --
  const country = movie.Country && movie.Country !== "N/A"
    ? `<span class="badge"><i class="fas fa-map-pin"></i>${movie.Country}</span>`
    : "";

  // -- Rated --
  const rated = movie.Rated && movie.Rated !== "N/A"
    ? `<span class="badge rated">${movie.Rated}</span>`
    : "";

  // -- Director --
  const director = movie.Director && movie.Director !== "N/A"
    ? `<div class="movie-detail">
        <span class="detail-label">Director</span>
        <span class="detail-value">${movie.Director}</span>
       </div>`
    : "";

  // -- Writer --
  const writer = movie.Writer && movie.Writer !== "N/A"
    ? `<div class="movie-detail">
        <span class="detail-label">Writer</span>
        <span class="detail-value">${movie.Writer}</span>
       </div>`
    : "";

  // -- Actors --
  const actors = movie.Actors && movie.Actors !== "N/A"
    ? `<div class="movie-detail">
        <span class="detail-label">Actors</span>
        <span class="detail-value">${movie.Actors}</span>
       </div>`
    : "";

  // -- Production --
  const production = movie.Production && movie.Production !== "N/A"
    ? `<div class="movie-detail">
        <span class="detail-label">Production</span>
        <span class="detail-value">${movie.Production}</span>
       </div>`
    : "";

  // -- Plot --
  const plot = movie.Plot && movie.Plot !== "N/A"
    ? `<div class="movie-plot">
        <p class="plot-text">"${movie.Plot}"</p>
       </div>`
    : "";

  // -- Awards --
  const awards = movie.Awards && movie.Awards !== "N/A"
    ? `<div class="movie-awards">
        <span class="awards-text">
          <i class="fas fa-trophy"></i>
          ${movie.Awards}
        </span>
       </div>`
    : "";

  // -- Box Office --
  const boxOffice = movie.BoxOffice && movie.BoxOffice !== "N/A"
    ? `<div class="movie-boxoffice">
        <span class="boxoffice-value">
          <i class="fas fa-sack-dollar"></i>
          Box Office: ${movie.BoxOffice}
        </span>
       </div>`
    : "";

  // Assemble the full movie card HTML
  const movieHtml = `
    <div class="movie-card">
      <div class="movie-poster-wrapper">
        ${posterHtml}
      </div>
      <div class="movie-info">
        <h2 class="movie-title">
          ${movie.Title}
          ${year ? `<span class="movie-title-year">(${year})</span>` : ""}
        </h2>

        <div class="movie-meta-row">
          ${ratingHtml}
          ${rated}
        </div>

        <div class="movie-badges">
          ${runtime}
          ${genre}
          ${language}
          ${country}
        </div>

        ${director}
        ${writer}
        ${actors}
        ${production}

        ${plot}

        ${awards}
        ${boxOffice}
      </div>
    </div>
  `;

  movieContainer.innerHTML = movieHtml;
}

// =============================================
// 9. LOADING & ERROR FUNCTIONS
// =============================================

/**
 * Show the loading spinner and disable the search button.
 */
function showLoading() {
  loadingSpinner.classList.remove("hidden");
  searchBtn.disabled = true;
  searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Searching...</span>';
}

/**
 * Hide the loading spinner and re-enable the search button.
 */
function hideLoading() {
  loadingSpinner.classList.add("hidden");
  searchBtn.disabled = false;
  searchBtn.innerHTML = '<i class="fas fa-search"></i><span>Search</span>';
}

/**
 * Display a beautiful error card.
 * @param {string} title - The error title
 * @param {string} message - The error description (can include HTML)
 * @param {string} icon - Font Awesome icon class (without "fa-" prefix)
 */
function showError(title, message, icon = "exclamation-circle") {
  hideAllSections();

  // Build the error card
  errorCard.innerHTML = `
    <div class="error-icon">
      <i class="fas fa-${icon}"></i>
    </div>
    <h3 class="error-title">${title}</h3>
    <p class="error-message">${message}</p>
    <button class="error-btn" id="tryAgainBtn">
      <i class="fas fa-redo"></i>
      Try Again
    </button>
  `;

  errorSection.classList.remove("hidden");

  // Add event listener to the "Try Again" button
  const tryAgainBtn = document.getElementById("tryAgainBtn");
  if (tryAgainBtn) {
    tryAgainBtn.addEventListener("click", () => {
      errorSection.classList.add("hidden");
      searchInput.focus();
    });
  }
}

// =============================================
// 10. EVENT LISTENERS
// =============================================

/**
 * Search button click listener.
 */
searchBtn.addEventListener("click", searchMovie);

/**
 * Enter key listener on the search input.
 */
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchMovie();
  }
});

/**
 * Back to results button listener — returns to the search results grid.
 */
backToResultsBtn.addEventListener("click", () => {
  if (lastSearchResults.length > 0) {
    showSearchResultsGrid();
  } else {
    // If no results stored, go back to empty state
    hideAllSections();
    emptyState.classList.remove("hidden");
  }
});

/**
 * Global click delegation for:
 * - Result card clicks (open movie detail)
 * - Suggestion button clicks (search popular movies)
 */
document.addEventListener("click", (event) => {
  // Result card click — open movie detail
  const resultCard = event.target.closest(".result-card");
  if (resultCard) {
    const imdbID = resultCard.getAttribute("data-imdbid");
    openMovieDetail(imdbID);
    return;
  }

  // Suggestion button click — fill input and search
  const suggestionBtn = event.target.closest(".suggestion-btn");
  if (suggestionBtn) {
    const movieTitle = suggestionBtn.getAttribute("data-movie");
    if (movieTitle) {
      searchInput.value = movieTitle;
      searchMovie();
    }
  }
});

/**
 * Global keyboard delegation for result cards (Enter/Space to open detail).
 */
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    const resultCard = event.target.closest(".result-card");
    if (resultCard) {
      event.preventDefault();
      const imdbID = resultCard.getAttribute("data-imdbid");
      openMovieDetail(imdbID);
    }
  }
});

// =============================================
// 11. INITIALIZATION
// =============================================

/**
 * Set the current year in the footer copyright.
 */
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

/**
 * Focus the search input on page load.
 */
window.addEventListener("load", () => {
  searchInput.focus();
});
