/* ==============================================
   SEARCH.JS — Search Module
   ==============================================
   Handles product search with suggestions.
   ============================================== */

const Search = {
  currentQuery: '',
  debounceTimer: null,

  /* Initialize search on a page */
  init() {
    const searchInput = document.querySelector('.filter-search-input');
    const searchForm = document.getElementById('search-form');

    /* Product page search input */
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.currentQuery = e.target.value.trim();
          if (Filters) Filters.applyFilters();
        }, 400);
      });
    }

    /* Global search form (if exists) */
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = searchForm.querySelector('input');
        if (input && input.value.trim()) {
          window.location.href = `products.html?search=${encodeURIComponent(input.value.trim())}`;
        }
      });
    }
  },

  /* Get search query from URL params */
  getQueryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  },

  /* Filter products by search query */
  filterProducts(products, query) {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q)
    );
  }
};
