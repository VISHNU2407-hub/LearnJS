/* ==============================================
   FILTERS.JS — Filtering, Sorting & Pagination
   ============================================== */

const Filters = {
  state: {
    products: [],
    filteredProducts: [],
    currentPage: 1,
    perPage: 12,
    sortBy: 'default',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    inStock: false,
    searchQuery: ''
  },

  /* Initialize filters on products page */
  async init() {
    this.state.searchQuery = Search.getQueryFromURL();

    /* Load all products */
    try {
      const data = await API.getAllProducts();
      this.state.products = data.products.map(p => ({
        ...p,
        discountedPrice: getDiscountedPrice(p.price, p.discountPercentage)
      }));
      this.state.filteredProducts = [...this.state.products];
      this.applyFilters();
    } catch (err) {
      console.error('Failed to load products:', err);
      const grid = document.getElementById('products-grid');
      if (grid) {
        grid.innerHTML = `
          <div class="no-results" style="grid-column:1/-1">
            <div class="empty-icon">⚠</div>
            <h3>Failed to load products</h3>
            <p>Please check your connection and try again.</p>
            <button class="btn btn-primary" onclick="location.reload()">Retry</button>
          </div>
        `;
      }
    }

    this.bindEvents();
  },

  /* Bind filter events */
  bindEvents() {
    /* Search input */
    const searchInput = document.querySelector('.filter-search-input');
    if (searchInput) {
      searchInput.value = this.state.searchQuery;
    }

    /* Category checkboxes */
    document.querySelectorAll('.filter-checkbox input').forEach(cb => {
      cb.addEventListener('change', () => this.applyFilters());
    });

    /* Rating radio buttons */
    document.querySelectorAll('.rating-option input').forEach(rb => {
      rb.addEventListener('change', () => this.applyFilters());
    });

    /* Price inputs */
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    if (minPrice) minPrice.addEventListener('input', () => this.applyFilters());
    if (maxPrice) maxPrice.addEventListener('input', () => this.applyFilters());

    /* In stock checkbox */
    const inStock = document.getElementById('filter-instock');
    if (inStock) inStock.addEventListener('change', () => this.applyFilters());

    /* Sort select */
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.addEventListener('change', () => {
      this.state.sortBy = sortSelect.value;
      this.applyFilters();
    });

    /* Clear filters */
    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearFilters());
    }

    /* Mobile filter toggle */
    const toggle = document.querySelector('.mobile-filter-toggle');
    const sidebar = document.querySelector('.products-sidebar');
    const closeBtn = document.querySelector('.filter-close');
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => sidebar.classList.add('open'));
      if (closeBtn) closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
      sidebar.addEventListener('click', (e) => {
        if (e.target === sidebar) sidebar.classList.remove('open');
      });
    }

    /* Initialize search */
    Search.init();
  },

  /* Apply all filters */
  applyFilters() {
    let products = [...this.state.products];
    const state = this.state;

    /* Search filter */
    if (state.searchQuery) {
      products = Search.filterProducts(products, state.searchQuery);
    }

    /* Search input */
    const searchInput = document.querySelector('.filter-search-input');
    if (searchInput && searchInput.value.trim()) {
      products = Search.filterProducts(products, searchInput.value.trim());
    }

    /* Category filter */
    const selectedCategories = [];
    document.querySelectorAll('.filter-checkbox input:checked').forEach(cb => {
      selectedCategories.push(cb.value);
    });
    if (selectedCategories.length > 0) {
      products = products.filter(p => selectedCategories.includes(p.category));
    }

    /* Rating filter */
    const selectedRating = document.querySelector('.rating-option input:checked');
    if (selectedRating) {
      const minRating = parseFloat(selectedRating.value);
      products = products.filter(p => p.rating >= minRating);
    }

    /* Price filter */
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    const minP = minPrice ? parseFloat(minPrice.value) || 0 : 0;
    const maxP = maxPrice ? parseFloat(maxPrice.value) || 10000 : 10000;
    products = products.filter(p => p.discountedPrice >= minP && p.discountedPrice <= maxP);

    /* In stock filter */
    const inStock = document.getElementById('filter-instock');
    if (inStock && inStock.checked) {
      products = products.filter(p => p.stock > 0);
    }

    /* Sort */
    const sortSelect = document.getElementById('sort-select');
    const sortBy = sortSelect ? sortSelect.value : 'default';
    switch (sortBy) {
      case 'price-asc': products.sort((a, b) => a.discountedPrice - b.discountedPrice); break;
      case 'price-desc': products.sort((a, b) => b.discountedPrice - a.discountedPrice); break;
      case 'rating': products.sort((a, b) => b.rating - a.rating); break;
      case 'name': products.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'newest': products.sort((a, b) => b.id - a.id); break;
      default: break;
    }

    state.filteredProducts = products;
    state.currentPage = 1;

    this.renderView();
  },

  /* Render products grid/list */
  renderView() {
    const grid = document.getElementById('products-grid');
    const countEl = document.getElementById('products-count');
    const viewToggle = document.querySelector('.view-toggle');

    if (!grid) return;

    const products = this.state.filteredProducts;
    const isListView = viewToggle?.querySelector('.active')?.dataset.view === 'list';

    /* Update count */
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${products.length}</strong> ${products.length === 1 ? 'product' : 'products'}`;
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search terms.</p>
          <button class="btn btn-secondary" onclick="Filters.clearFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    /* Pagination */
    const totalPages = Math.ceil(products.length / this.state.perPage);
    const start = (this.state.currentPage - 1) * this.state.perPage;
    const end = start + this.state.perPage;
    const pageProducts = products.slice(start, end);

    if (isListView) {
      grid.className = 'products-list';
    } else {
      grid.className = 'products-grid';
    }

    grid.innerHTML = pageProducts.map(p => `
      <div class="product-card stagger-item" data-id="${p.id}">
        <div class="product-card-image img-zoom">
          <a href="product.html?id=${p.id}">
            <img src="${p.thumbnail}" alt="${p.title}" loading="lazy">
          </a>
          ${p.discountPercentage > 0 ? `<span class="discount-badge">-${Math.round(p.discountPercentage)}%</span>` : ''}
          <div class="product-card-actions">
            <button class="product-card-action wishlist-btn ${Wishlist.has(p.id) ? 'active' : ''}" data-id="${p.id}" title="Add to wishlist">
              ${Wishlist.has(p.id) ? '♥' : '♡'}
            </button>
          </div>
        </div>
        <div class="product-card-body">
          <div class="product-card-category">${p.category}</div>
          <a href="product.html?id=${p.id}"><h3 class="product-card-title">${p.title}</h3></a>
          <div class="product-card-rating">
            <span class="rating-stars">${UI.renderStars(p.rating)}</span>
            <span class="rating-count">(${p.reviews?.length || 0})</span>
          </div>
          <div class="product-card-price">
            <div class="price">
              <span class="price-current">${UI.formatPrice(p.discountedPrice)}</span>
              ${p.discountPercentage > 0 ? `<span class="price-old">${UI.formatPrice(p.price)}</span>` : ''}
            </div>
          </div>
          <button class="btn btn-primary btn-sm add-to-cart" data-id='${JSON.stringify({id:p.id,title:p.title,price:p.price,discountedPrice:p.discountedPrice,thumbnail:p.thumbnail,category:p.category})}'>Add to Cart</button>
        </div>
      </div>
    `).join('');

    /* Render pagination */
    this.renderPagination(totalPages);

    /* Attach events */
    this.attachProductEvents();
  },

  /* Render pagination */
  renderPagination(totalPages) {
    const container = document.getElementById('pagination');
    if (!container) return;

    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = `
      <button class="page-btn" data-page="${this.state.currentPage - 1}" ${this.state.currentPage <= 1 ? 'disabled' : ''}>
        ← Prev
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.state.currentPage - 1 && i <= this.state.currentPage + 1)) {
        html += `<button class="page-btn ${i === this.state.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      } else if (i === this.state.currentPage - 2 || i === this.state.currentPage + 2) {
        html += `<span>…</span>`;
      }
    }

    html += `
      <button class="page-btn" data-page="${this.state.currentPage + 1}" ${this.state.currentPage >= totalPages ? 'disabled' : ''}>
        Next →
      </button>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        this.state.currentPage = parseInt(btn.dataset.page);
        this.renderView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  },

  /* Attach product card events */
  attachProductEvents() {
    /* Wishlist buttons */
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const product = this.state.products.find(p => p.id === id);
        if (product) {
          const isAdded = Wishlist.toggle(product);
          btn.classList.toggle('active', isAdded);
          btn.innerHTML = isAdded ? '♥' : '♡';
        }
      });
    });

    /* Add to cart buttons */
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          const product = JSON.parse(btn.dataset.id);
          Cart.addItem(product);
        } catch (err) {
          console.error('Add to cart error:', err);
        }
      });
    });
  },

  /* Clear all filters */
  clearFilters() {
    document.querySelectorAll('.filter-checkbox input').forEach(cb => cb.checked = false);
    document.querySelectorAll('.rating-option input').forEach(rb => rb.checked = false);
    const searchInput = document.querySelector('.filter-search-input');
    if (searchInput) searchInput.value = '';
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'default';
    const inStock = document.getElementById('filter-instock');
    if (inStock) inStock.checked = false;

    this.state.searchQuery = '';
    this.state.currentPage = 1;
    this.applyFilters();
  }
};
