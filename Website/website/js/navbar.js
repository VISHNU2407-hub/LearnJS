/* ============================================================
   LearnJS — navbar.js
   Sticky navbar, mobile drawer, global search, smooth scroll.
   ============================================================ */

(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var menuBtn = document.getElementById("menuToggle");
  var navMenu = document.getElementById("navMenu");
  var searchInput = document.getElementById("searchInput");
  var searchDropdown = document.getElementById("searchDropdown");

  /* ---------- Sticky / scrolled state ---------- */
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  function openMenu() {
    document.body.classList.add("nav-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    document.body.classList.remove("nav-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  }
  function toggleMenu() {
    if (document.body.classList.contains("nav-open")) closeMenu();
    else openMenu();
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", toggleMenu);
  }
  if (navMenu) {
    // Close the drawer when a link is tapped.
    navMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
  }
  document.addEventListener("click", function (event) {
    if (
      document.body.classList.contains("nav-open") &&
      header &&
      !header.contains(event.target)
    ) {
      closeMenu();
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
      hideSearch();
    }
  });

  /* ---------- Global search ---------- */
  var SEARCH_INDEX = [
    { title: "Home", href: "index.html", keywords: "home learn start" },
    { title: "Projects", href: "projects.html", keywords: "projects build hands-on" },
    { title: "Weather App", href: "projects.html", keywords: "api fetch geolocation" },
    { title: "Password Generator", href: "projects.html", keywords: "crypto dom clipboard" },
    { title: "Expense Tracker", href: "projects.html", keywords: "charts localstorage crud" },
    { title: "Notes App", href: "projects.html", keywords: "crud search localstorage" },
    { title: "Roadmap", href: "roadmap.html", keywords: "roadmap path beginner expert" },
    { title: "Beginner Roadmap", href: "roadmap.html", keywords: "beginner basics syntax" },
    { title: "Interview Prep", href: "interview.html", keywords: "interview questions job" },
    { title: "500+ Interview Questions", href: "interview.html", keywords: "questions coding round" },
    { title: "Resources", href: "resources.html", keywords: "resources cheatsheets books" },
    { title: "Community", href: "community.html", keywords: "community discord learners" },
    { title: "Sign In", href: "login.html", keywords: "login signin account" },
    { title: "Create Account", href: "signup.html", keywords: "signup register join" }
  ];

  var searchIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>';

  function hideSearch() {
    if (searchDropdown) {
      searchDropdown.classList.remove("open");
      searchDropdown.innerHTML = "";
    }
  }

  function runSearch(query) {
    if (!searchDropdown) return;
    query = (query || "").trim().toLowerCase();
    if (!query) {
      hideSearch();
      return;
    }
    var matches = SEARCH_INDEX.filter(function (item) {
      return (
        item.title.toLowerCase().indexOf(query) !== -1 ||
        item.keywords.indexOf(query) !== -1
      );
    }).slice(0, 6);

    if (!matches.length) {
      searchDropdown.innerHTML =
        '<div class="search-empty">No results for "' + query + '"</div>';
    } else {
      searchDropdown.innerHTML = matches
        .map(function (item) {
          return (
            '<a class="search-item" href="' + item.href + '">' +
            searchIcon +
            '<span>' + item.title + "</span></a>"
          );
        })
        .join("");
    }
    searchDropdown.classList.add("open");
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      runSearch(searchInput.value);
    });
    searchInput.addEventListener("focus", function () {
      runSearch(searchInput.value);
    });
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        var first = searchDropdown && searchDropdown.querySelector(".search-item");
        if (first) window.location.href = first.getAttribute("href");
      }
      if (event.key === "Escape") hideSearch();
    });
  }

  document.addEventListener("click", function (event) {
    var searchBox = document.querySelector(".search");
    if (searchBox && !searchBox.contains(event.target)) hideSearch();
  });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  var HEADER_OFFSET = 90;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      var top =
        target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: top, behavior: "smooth" });
      history.replaceState(null, "", id);
    });
  });
})();
// end of navbar.js
