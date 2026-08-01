/* ==============================================
   WISHLIST.JS — Wishlist Module
   ==============================================
   Manages wishlist state with localStorage.
   ============================================== */

const Wishlist = {
  STORAGE_KEY: 'ecommerce_wishlist',

  /* Get wishlist items */
  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /* Save wishlist */
  saveItems(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.updateUI();
  },

  /* Add item to wishlist */
  addItem(product) {
    const items = this.getItems();
    if (!items.some(item => item.id === product.id)) {
      items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice || product.price,
        image: product.thumbnail || product.images?.[0] || '',
        category: product.category || '',
        rating: product.rating || 0
      });
      this.saveItems(items);
      UI.showToast({
        title: 'Added to wishlist',
        message: `${product.title} has been added to your wishlist.`,
        type: 'success'
      });
    } else {
      UI.showToast({
        title: 'Already in wishlist',
        message: `${product.title} is already in your wishlist.`,
        type: 'info'
      });
    }
  },

  /* Remove item from wishlist */
  removeItem(productId) {
    const items = this.getItems().filter(item => item.id !== productId);
    this.saveItems(items);
    UI.showToast({
      title: 'Removed from wishlist',
      message: 'Item has been removed from your wishlist.',
      type: 'info'
    });
  },

  /* Toggle item */
  toggle(product) {
    if (this.has(product.id)) {
      this.removeItem(product.id);
      return false;
    } else {
      this.addItem(product);
      return true;
    }
  },

  /* Check if product is in wishlist */
  has(productId) {
    return this.getItems().some(item => item.id === productId);
  },

  /* Get count */
  getCount() {
    return this.getItems().length;
  },

  /* Move item to cart */
  moveToCart(productId) {
    const items = this.getItems();
    const item = items.find(i => i.id === productId);
    if (item) {
      Cart.addItem({
        id: item.id,
        title: item.title,
        price: item.price,
        discountedPrice: item.discountedPrice,
        thumbnail: item.image,
        category: item.category
      });
      this.removeItem(productId);
    }
  },

  /* Update UI */
  updateUI() {
    const count = this.getCount();
    document.querySelectorAll('.wishlist-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  /* Render wishlist page */
  renderWishlistPage() {
    const container = document.getElementById('wishlist-content');
    if (!container) return;

    const items = this.getItems();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">♡</div>
          <h2 class="empty-state-title">Your wishlist is empty</h2>
          <p class="empty-state-description">Save your favorite items and come back to them later.</p>
          <a href="products.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="wishlist-grid">
        ${items.map(item => `
          <div class="product-card" data-id="${item.id}">
            <div class="product-card-image">
              <img src="${item.image}" alt="${item.title}" loading="lazy">
              <a href="product.html?id=${item.id}" class="product-card-link" style="position:absolute;inset:0;z-index:1"></a>
              <div class="product-card-actions" style="opacity:1;transform:none">
                <button class="product-card-action active" data-wishlist-remove="${item.id}" title="Remove from wishlist">♡</button>
              </div>
            </div>
            <div class="product-card-body">
              <div class="product-card-category">${item.category}</div>
              <a href="product.html?id=${item.id}"><h3 class="product-card-title">${item.title}</h3></a>
              <div class="product-card-rating">
                <span class="rating-stars">${UI.renderStars(item.rating || 4)}</span>
              </div>
              <div class="product-card-price">
                <div class="price">
                  <span class="price-current">${UI.formatPrice(item.discountedPrice)}</span>
                  ${item.price !== item.discountedPrice ? `<span class="price-old">${UI.formatPrice(item.price)}</span>` : ''}
                </div>
              </div>
              <button class="btn btn-primary btn-sm move-to-cart" data-id="${item.id}" style="position:relative;z-index:2">Add to Cart</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    /* Attach events */
    container.querySelectorAll('[data-wishlist-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.removeItem(parseInt(btn.dataset.wishlistRemove));
        this.renderWishlistPage();
      });
    });

    container.querySelectorAll('.move-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.moveToCart(parseInt(btn.dataset.id));
        this.renderWishlistPage();
      });
    });
  }
};
