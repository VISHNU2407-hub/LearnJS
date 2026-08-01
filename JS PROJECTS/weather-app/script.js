/* ============================================================
   WEATHER APP — script.js
   Vanilla JavaScript (ES6+) — OpenWeatherMap API integration
   ============================================================ */

// ============================================================
// CONFIGURATION
// ============================================================

/** OpenWeatherMap API key — replace with your own */
const API_KEY = "e61641a9b73bcdc99c9863607c09e442";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ============================================================
// DOM REFERENCES
// ============================================================

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const weatherCard = document.getElementById("weatherCard");

const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const cityName = document.getElementById("cityName");
const country = document.getElementById("country");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

// ============================================================
// WEATHER ICON MAPPING
// ============================================================

/**
 * Maps OpenWeatherMap weather condition codes to local icon file paths.
 * Uses the main condition (e.g. "Clear", "Clouds") to pick the right icon.
 */
const iconMap = {
  Clear:        "images/clear.svg",
  Clouds:       "images/clouds.svg",
  Rain:         "images/rain.svg",
  Drizzle:      "images/drizzle.svg",
  Thunderstorm: "images/thunderstorm.svg",
  Snow:         "images/snow.svg",
  Mist:         "images/mist.svg",
  Smoke:        "images/mist.svg",
  Haze:         "images/mist.svg",
  Dust:         "images/mist.svg",
  Fog:          "images/mist.svg",
};

/**
 * Returns the icon file path for a given weather condition.
 * Falls back to clouds.svg if the condition isn't recognized.
 *
 * @param {string} condition — The main weather condition from the API
 * @returns {string} Path to the SVG icon
 */
function getWeatherIcon(condition) {
  return iconMap[condition] || "images/clouds.svg";
}

// ============================================================
// EVENT LISTENERS
// ============================================================

// Search button click
searchBtn.addEventListener("click", () => {
  searchWeather();
});

// Press Enter to search
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchWeather();
  }
});

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * Reads the search input and kicks off a weather lookup.
 * Validates that the input is not empty before making the API call.
 */
function searchWeather() {
  const city = searchInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  hideError();
  getWeather(city);
}

/**
 * Fetches weather data from the OpenWeatherMap API for the given city.
 *
 * @param {string} city — The city name to look up
 */
async function getWeather(city) {
  showLoading();

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);

    // Handle HTTP-level errors (e.g. city not found, bad request)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
      } else if (response.status === 401) {
        throw new Error("Invalid API key. Please check your API key and try again.");
      } else {
        throw new Error(`Something went wrong (Error ${response.status}). Please try again later.`);
      }
    }

    const data = await response.json();
    updateUI(data);
  } catch (error) {
    // Handle network errors (e.g. no internet connection)
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      showError("Network error. Please check your internet connection and try again.");
    } else {
      showError(error.message);
    }
  } finally {
    hideLoading();
  }
}

/**
 * Updates the UI with the weather data received from the API.
 *
 * @param {Object} data — The weather data object from OpenWeatherMap
 */
function updateUI(data) {
  // ---- Main weather ----
  const condition = data.weather[0].main;     // e.g. "Clear", "Rain"
  const desc = data.weather[0].description;   // e.g. "clear sky"
  const temp = Math.round(data.main.temp);    // Temperature in °C
  const feels = Math.round(data.main.feels_like);

  weatherIcon.src = getWeatherIcon(condition);
  weatherIcon.alt = `${desc} icon`;

  temperature.innerHTML = `${temp}<span class="card__temp-unit">°C</span>`;
  description.textContent = desc;
  cityName.textContent = `${data.name},`;
  country.textContent = data.sys.country;

  feelsLike.textContent = `Feels like ${feels}°C`;

  // ---- Details ----
  const windDeg = data.wind.deg
    ? ` ${getWindDirection(data.wind.deg)}`
    : "";

  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} m/s${windDeg}`;
  pressure.textContent = `${data.main.pressure} hPa`;
  visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  sunrise.textContent = formatTime(data.sys.sunrise);
  sunset.textContent = formatTime(data.sys.sunset);

  // Show the card with animation
  weatherCard.hidden = false;
  weatherCard.style.animation = "none";
  // Trigger reflow to restart the animation
  void weatherCard.offsetHeight;
  weatherCard.style.animation = "fadeInUp 0.6s ease";
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Converts a Unix timestamp (seconds) to a locale-friendly time string.
 *
 * @param {number} timestamp — Unix timestamp in seconds
 * @returns {string} Formatted time string (e.g. "6:45 AM")
 */
function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);  // Convert seconds → milliseconds
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Converts wind degrees to a cardinal direction abbreviation.
 *
 * @param {number} deg — Wind direction in degrees
 * @returns {string} Cardinal direction (e.g. "N", "SW")
 */
function getWindDirection(deg) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

// ============================================================
// UI STATE FUNCTIONS
// ============================================================

/**
 * Shows the loading spinner and disables the search button.
 */
function showLoading() {
  loadingSpinner.hidden = false;
  searchBtn.disabled = true;
}

/**
 * Hides the loading spinner and re-enables the search button.
 */
function hideLoading() {
  loadingSpinner.hidden = true;
  searchBtn.disabled = false;
}

/**
 * Displays an error message in the error banner.
 *
 * @param {string} message — The error message to display
 */
function showError(message) {
  errorText.textContent = message;
  errorMessage.hidden = false;
  weatherCard.hidden = true;
}

/**
 * Hides the error message banner.
 */
function hideError() {
  errorMessage.hidden = true;
}

// ============================================================
// AUTO-SEARCH ON PAGE LOAD (optional)
// ============================================================

// Uncomment the line below to show weather for a default city on load
// getWeather("London");
