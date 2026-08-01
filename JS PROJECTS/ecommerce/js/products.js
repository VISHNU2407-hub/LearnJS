/* ==============================================
   PRODUCTS.JS — Product Listing Page
   ==============================================
   Initializes the products listing page with
   categories, filters, and grid.
   ============================================== */

const ProductsPage = {
  /* Initialize the products page */
  async init() {
    await this.loadCategories();
    await Filters.init();

    /* Set search from URL if present */
    const searchQuery = Search.getQueryFromURL();
    if (searchQuery) {
      const searchInput = document.querySelector('.filter-search-input');
      if (searchInput) {
        searchInput.value = searchQuery;
        Filters.state.searchQuery = searchQuery;
        Filters.applyFilters();
      }
    }

    /* Auto-select category from URL param */
    const categoryFromUrl = this.getCategoryFromURL();
    if (categoryFromUrl) {
      const checkbox = document.querySelector(`.filter-checkbox input[value="${categoryFromUrl}"]`);
      if (checkbox) {
        checkbox.checked = true;
        Filters.applyFilters();
      }
    }

    /* View toggle */
    this.initViewToggle();
  },

  /* Get category from URL params */
  getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || '';
  },

  /* Load and populate categories */
  async loadCategories() {
    const container = document.getElementById('category-filters');
    if (!container) return;

    try {
      const categories = await API.getCategories();
      container.innerHTML = categories.map(cat => {
        const slug = typeof cat === 'string' ? cat : cat.slug;
        const name = typeof cat === 'string' ? cat.charAt(0).toUpperCase() + cat.slice(1) : cat.name;
        return `
          <label class="filter-checkbox">
            <input type="checkbox" value="${slug}" name="category">
            <span>${name}</span>
          </label>
        `;
      }).join('');
    } catch (err) {
      console.error('Failed to load categories:', err);
      container.innerHTML = '<p style="font-size:0.875rem;color:var(--text-tertiary)">Failed to load categories</p>';
    }
  },

  /* Init view toggle (grid/list) */
  initViewToggle() {
    const toggle = document.querySelector('.view-toggle');
    if (!toggle) return;

    toggle.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        toggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Filters.renderView();
      });
    });
  }
};

/* Initialize on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('products-grid')) {
    ProductsPage.init();
  }
});
