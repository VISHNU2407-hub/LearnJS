/* ==============================================
   APP.JS — Main Application Entry Point
   ==============================================
   Initializes all modules on DOM ready.
   ============================================== */

/* Single product detail page */
const ProductDetail = {
  async init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
      this.showError('No product ID provided.');
      return;
    }

    try {
      const product = await API.getProduct(id);
      product.discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
      this.render(product);
    } catch (err) {
      console.error('Failed to load product:', err);
      this.showError('Failed to load product details.');
    }
  },

  showError(message) {
    const container = document.querySelector('.product-detail');
    if (container) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state-icon">⚠</div>
          <h2 class="empty-state-title">${message}</h2>
          <a href="products.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
    }
  },

  render(product) {
    const container = document.querySelector('.product-detail');
    if (!container) return;

    const inWishlist = Wishlist.has(product.id);
    const stockStatus = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
    const stockText = product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock';

    container.innerHTML = `
      <div class="product-gallery">
        <div class="product-main-image">
          <img id="main-image" src="${product.thumbnail}" alt="${product.title}">
        </div>
        <div class="product-thumbnails" id="thumbnails">
          ${product.images.slice(0, 4).map((img, i) => `
            <button class="product-thumbnail ${i === 0 ? 'active' : ''}" data-img="${img}">
              <img src="${img}" alt="${product.title} thumbnail ${i + 1}" loading="lazy">
            </button>
          `).join('')}
        </div>
      </div>

      <div class="product-info animate-fade-up">
        <div class="product-breadcrumbs">
          <a href="index.html">Home</a>
          <span>›</span>
          <a href="products.html">Products</a>
          <span>›</span>
          <a href="products.html?category=${product.category}">${product.category}</a>
          <span>›</span>
          <span class="current">${product.title}</span>
        </div>

        <h1>${product.title}</h1>

        <div class="product-info-rating">
          <span class="rating-stars">${UI.renderStars(product.rating)}</span>
          <span class="rating-count">${product.rating.toFixed(1)} (${product.reviews?.length || 0} reviews)</span>
          <span class="stock-badge ${stockStatus}">${stockText}</span>
        </div>

        <div class="product-info-price">
          <div class="price price-lg">
            <span class="price-current">${UI.formatPrice(product.discountedPrice)}</span>
            ${product.discountPercentage > 0 ? `
              <span class="price-old">${UI.formatPrice(product.price)}</span>
              <span class="discount-badge-lg">Save ${Math.round(product.discountPercentage)}%</span>
            ` : ''}
          </div>
        </div>

        <p class="product-description">${product.description}</p>

        <hr class="product-divider">

        ${product.brand ? `
          <div class="product-variants">
            <span class="variant-label">Brand</span>
            <p style="font-size:0.9375rem;color:var(--text-primary);font-weight:500">${product.brand}</p>
          </div>
          <hr class="product-divider">
        ` : ''}

        ${product.tags && product.tags.length > 0 ? `
          <div class="product-variants">
            <span class="variant-label">Tags</span>
            <div class="variant-options">
              ${product.tags.map(tag => `<span class="badge badge-neutral">${tag}</span>`).join('')}
            </div>
          </div>
          <hr class="product-divider">
        ` : ''}

        <div class="product-variants">
          <span class="variant-label">Quantity</span>
          <div class="quantity-selector">
            <button id="qty-minus">−</button>
            <input type="number" id="qty-input" value="1" min="1" max="${product.stock || 99}">
            <button id="qty-plus">+</button>
          </div>
        </div>

        <div class="product-actions">
          <button class="btn btn-primary btn-lg" id="add-to-cart-btn">Add to Cart</button>
          <button class="btn-wishlist ${inWishlist ? 'active' : ''}" id="wishlist-btn" title="Add to wishlist">
            ${inWishlist ? '♥' : '♡'}
          </button>
          <button class="btn btn-secondary btn-lg" id="buy-now-btn">Buy Now</button>
        </div>

        <div class="delivery-info">
          <div class="delivery-item">
            <span class="icon">🚚</span>
            <span>Free shipping on orders over $50</span>
          </div>
          <div class="delivery-item">
            <span class="icon">↩</span>
            <span>30-day easy returns</span>
          </div>
          <div class="delivery-item">
            <span class="icon">🔒</span>
            <span>Secure checkout</span>
          </div>
        </div>
      </div>
    `;

    /* Product tabs */
    container.insertAdjacentHTML('afterend', `
      <div class="product-tabs page-transition">
        <div class="tab-nav">
          <button class="active" data-tab="description">Description</button>
          <button data-tab="specifications">Specifications</button>
          <button data-tab="reviews">Reviews (${product.reviews?.length || 0})</button>
        </div>
        <div class="tab-content active" id="tab-description">
          <p style="font-size:0.9375rem;color:var(--text-secondary);line-height:1.8">${product.description}</p>
          ${product.returnPolicy ? `<p style="font-size:0.9375rem;color:var(--text-secondary);margin-top:16px"><strong>Return Policy:</strong> ${product.returnPolicy}</p>` : ''}
          ${product.warrantyInformation ? `<p style="font-size:0.9375rem;color:var(--text-secondary);margin-top:8px"><strong>Warranty:</strong> ${product.warrantyInformation}</p>` : ''}
          ${product.shippingInformation ? `<p style="font-size:0.9375rem;color:var(--text-secondary);margin-top:8px"><strong>Shipping:</strong> ${product.shippingInformation}</p>` : ''}
        </div>
        <div class="tab-content" id="tab-specifications">
          <table class="specs-table">
            <tr><td>Brand</td><td>${product.brand || 'N/A'}</td></tr>
            <tr><td>Category</td><td>${product.category}</td></tr>
            <tr><td>SKU</td><td>${product.sku || 'N/A'}</td></tr>
            <tr><td>Weight</td><td>${product.weight ? product.weight + 'g' : 'N/A'}</td></tr>
            <tr><td>Dimensions</td><td>${product.dimensions ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm` : 'N/A'}</td></tr>
            <tr><td>Stock</td><td>${product.stock} units</td></tr>
            <tr><td>Minimum Order</td><td>${product.minimumOrderQuantity || 1}</td></tr>
          </table>
        </div>
        <div class="tab-content" id="tab-reviews">
          ${product.reviews && product.reviews.length > 0 ? `
            <div class="reviews-list">
              ${product.reviews.map(review => `
                <div class="review-item">
                  <div class="review-header">
                    <div class="review-avatar">${review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : '?'}</div>
                    <div>
                      <div class="review-name">${review.reviewerName || 'Anonymous'}</div>
                      <span class="rating-stars">${UI.renderStars(review.rating)}</span>
                    </div>
                    <div class="review-date">${review.date ? new Date(review.date).toLocaleDateString() : ''}</div>
                  </div>
                  <div class="review-body">${review.comment || 'No comment provided.'}</div>
                </div>
              `).join('')}
            </div>
          ` : '<p style="color:var(--text-secondary)">No reviews yet.</p>'}
        </div>
      </div>
    `);

    /* Related products */
    this.loadRelatedProducts(product.category, product.id);

    /* Attach events */
    this.attachEvents(product);
  },

  attachEvents(product) {
    /* Thumbnail gallery */
    document.querySelectorAll('.product-thumbnail').forEach(thumb => {
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        document.getElementById('main-image').src = thumb.dataset.img;
      });
    });

    /* Quantity selector */
    const qtyInput = document.getElementById('qty-input');
    document.getElementById('qty-minus').addEventListener('click', () => {
      const val = parseInt(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
    document.getElementById('qty-plus').addEventListener('click', () => {
      const val = parseInt(qtyInput.value) || 1;
      if (val < (product.stock || 99)) qtyInput.value = val + 1;
    });

    /* Add to cart */
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
      const qty = parseInt(qtyInput.value) || 1;
      Cart.addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice,
        thumbnail: product.thumbnail,
        category: product.category
      }, qty);
    });

    /* Buy now */
    document.getElementById('buy-now-btn').addEventListener('click', () => {
      const qty = parseInt(qtyInput.value) || 1;
      Cart.addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice,
        thumbnail: product.thumbnail,
        category: product.category
      }, qty);
      window.location.href = 'checkout.html';
    });

    /* Wishlist */
    document.getElementById('wishlist-btn').addEventListener('click', () => {
      const btn = document.getElementById('wishlist-btn');
      const isAdded = Wishlist.toggle(product);
      btn.classList.toggle('active', isAdded);
      btn.innerHTML = isAdded ? '♥' : '♡';
    });

    /* Tabs */
    document.querySelectorAll('.tab-nav button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-nav button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
      });
    });
  },

  async loadRelatedProducts(category, excludeId) {
    const container = document.getElementById('related-products');
    if (!container) return;

    try {
      const data = await API.getProductsByCategory(category, 8);
      const related = data.products
        .filter(p => p.id !== excludeId)
        .slice(0, 4)
        .map(p => ({
          ...p,
          discountedPrice: getDiscountedPrice(p.price, p.discountPercentage)
        }));

      if (related.length === 0) {
        container.innerHTML = '';
        return;
      }

      container.innerHTML = `
        <div class="section">
          <div class="section-header">
            <div class="section-header-content">
              <span class="section-subtitle">You Might Also Like</span>
              <h2 class="section-title">Related Products</h2>
            </div>
            <a href="products.html?category=${category}" class="section-link">
              View All <span class="arrow">→</span>
            </a>
          </div>
          <div class="related-grid stagger-children">
            ${related.map(p => `
              <div class="product-card">
                <div class="product-card-image img-zoom">
                  <a href="product.html?id=${p.id}">
                    <img src="${p.thumbnail}" alt="${p.title}" loading="lazy">
                  </a>
                  ${p.discountPercentage > 0 ? `<span class="discount-badge">-${Math.round(p.discountPercentage)}%</span>` : ''}
                </div>
                <div class="product-card-body">
                  <div class="product-card-category">${p.category}</div>
                  <a href="product.html?id=${p.id}"><h3 class="product-card-title">${p.title}</h3></a>
                  <div class="product-card-rating">
                    <span class="rating-stars">${UI.renderStars(p.rating)}</span>
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
            `).join('')}
          </div>
        </div>
      `;

      /* Attach add to cart events */
      container.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          try {
            Cart.addItem(JSON.parse(btn.dataset.id));
          } catch (err) {
            console.error('Add to cart error:', err);
          }
        });
      });
    } catch (err) {
      console.error('Failed to load related products:', err);
    }
  }
};

/* Home page */
const HomePage = {
  async init() {
    await this.loadFeaturedProducts();
    await this.loadBestSellers();
    await this.loadDeals();
    await this.loadNewArrivals();
  },

  async loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    UI.createSkeletonGridHtml(container, 4);

    try {
      const data = await API.getProducts(8, 0);
      const products = data.products.map(p => ({
        ...p,
        discountedPrice: getDiscountedPrice(p.price, p.discountPercentage)
      }));
      this.renderProducts(container, products);
    } catch (err) {
      console.error('Failed to load featured products:', err);
    }
  },

  async loadBestSellers() {
    const container = document.getElementById('best-sellers');
    if (!container) return;

    try {
      const data = await API.getProducts(4, 8);
      const products = data.products.map(p => ({
        ...p,
        discountedPrice: getDiscountedPrice(p.price, p.discountPercentage)
      }));
      this.renderProducts(container, products);
    } catch (err) {
      console.error('Failed to load best sellers:', err);
    }
  },

  async loadDeals() {
    const container = document.getElementById('deals-products');
    if (!container) return;

    try {
      const data = await API.getProducts(20, 0);
      const deals = data.products
        .filter(p => p.discountPercentage > 10)
        .slice(0, 2)
        .map(p => ({
          ...p,
          discountedPrice: getDiscountedPrice(p.price, p.discountPercentage)
        }));

      container.innerHTML = deals.map(deal => `
        <div class="deal-card">
          <div class="deal-image">
            <img src="${deal.thumbnail}" alt="${deal.title}" loading="lazy">
          </div>
          <div class="deal-body">
            <span class="badge badge-danger" style="margin-bottom:8px;align-self:flex-start">Limited Time Deal</span>
            <h3 style="font-size:1.125rem;font-weight:600;margin-bottom:4px">${deal.title}</h3>
            <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:12px">${UI.truncateText(deal.description, 80)}</p>
            <div class="price price-lg" style="margin-bottom:12px">
              <span class="price-current">${UI.formatPrice(deal.discountedPrice)}</span>
              <span class="price-old">${UI.formatPrice(deal.price)}</span>
              <span class="badge badge-danger">-${Math.round(deal.discountPercentage)}%</span>
            </div>
            <div class="deal-timer" data-end="${Date.now() + 86400000}">
              <div class="deal-timer-item"><span class="num" id="hours">24</span><span class="label">Hours</span></div>
              <div class="deal-timer-item"><span class="num" id="minutes">00</span><span class="label">Min</span></div>
              <div class="deal-timer-item"><span class="num" id="seconds">00</span><span class="label">Sec</span></div>
            </div>
            <a href="product.html?id=${deal.id}" class="btn btn-primary btn-sm" style="margin-top:16px;align-self:flex-start">Shop Now</a>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error('Failed to load deals:', err);
    }
  },

  async loadNewArrivals() {
    const container = document.getElementById('new-arrivals');
    if (!container) return;

    try {
      const data = await API.getProducts(4, 20);
      const products = data.products.map(p => ({
        ...p,
        discountedPrice: getDiscountedPrice(p.price, p.discountPercentage)
      }));
      this.renderProducts(container, products);
    } catch (err) {
      console.error('Failed to load new arrivals:', err);
    }
  },

  renderProducts(container, products) {
    container.innerHTML = products.map(p => `
      <div class="product-card stagger-item">
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

    /* Attach events */
    container.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const product = products.find(p => p.id === id);
        if (product) {
          const isAdded = Wishlist.toggle(product);
          btn.classList.toggle('active', isAdded);
          btn.innerHTML = isAdded ? '♥' : '♡';
        }
      });
    });

    container.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          Cart.addItem(JSON.parse(btn.dataset.id));
        } catch (err) {
          console.error('Add to cart error:', err);
        }
      });
    });
  }
};

/* Categories page */
const CategoriesPage = {
  async init() {
    const container = document.getElementById('categories-content');
    if (!container) return;

    try {
      const categories = await API.getCategories();

      container.innerHTML = `
        <div class="section">
          <div class="section-header">
            <div class="section-header-content">
              <span class="section-subtitle">Browse By</span>
              <h2 class="section-title">All Categories</h2>
            </div>
          </div>
          <div class="categories-grid stagger-children">
            ${categories.map((cat, i) => {
              const slug = typeof cat === 'string' ? cat : cat.slug;
              const name = typeof cat === 'string' ? cat.charAt(0).toUpperCase() + cat.slice(1) : cat.name;
              const colors = ['blue', 'green', 'orange', 'purple', 'blue', 'green'];
              const icons = ['🛍️', '📱', '💻', '👟', '👗', '⌚'];
              return `
                <a href="products.html?category=${slug}" class="category-card hover-lift">
                  <div class="category-icon ${colors[i % colors.length]}">${icons[i % icons.length]}</div>
                  <div class="category-name">${name}</div>
                  <div class="category-count">Browse Products</div>
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } catch (err) {
      console.error('Failed to load categories:', err);
      container.innerHTML = '<div class="empty-state"><p>Failed to load categories.</p></div>';
    }
  }
};

/* Initialize everything on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  /* Initialize UI */
  UI.init();

  /* Home page */
  if (document.getElementById('featured-products')) {
    HomePage.init();
  }

  /* Product detail page */
  if (document.querySelector('.product-detail')) {
    ProductDetail.init();
  }

  /* Cart page */
  if (document.getElementById('cart-content')) {
    Cart.renderCartPage();
  }

  /* Wishlist page */
  if (document.getElementById('wishlist-content')) {
    Wishlist.renderWishlistPage();
  }

  /* Categories page */
  if (document.getElementById('categories-content')) {
    CategoriesPage.init();
  }

  /* Checkout page */
  if (document.getElementById('checkout-content')) {
    CheckoutPage.init();
  }
});

/* Checkout page */
const CheckoutPage = {
  init() {
    const container = document.getElementById('checkout-content');
    if (!container) return;

    const items = Cart.getItems();
    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <h2 class="empty-state-title">Your cart is empty</h2>
          <p class="empty-state-description">Add some products before checking out.</p>
          <a href="products.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="page-header">
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>
      <div class="checkout-layout">
        <div>
          <div class="checkout-section">
            <h3><span class="step">1</span> Shipping Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label>First Name</label>
                <input type="text" placeholder="John" required>
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Doe" required>
              </div>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" placeholder="john@example.com" required>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="+1 (555) 000-0000" required>
            </div>
            <div class="form-group">
              <label>Address</label>
              <input type="text" placeholder="123 Main Street" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>City</label>
                <input type="text" placeholder="New York" required>
              </div>
              <div class="form-group">
                <label>ZIP Code</label>
                <input type="text" placeholder="10001" required>
              </div>
            </div>
            <div class="form-group">
              <label>Country</label>
              <select required>
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
          </div>

          <div class="checkout-section">
            <h3><span class="step">2</span> Payment Method</h3>
            <div class="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="4242 4242 4242 4242" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Expiry Date</label>
                <input type="text" placeholder="MM/YY" required>
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input type="text" placeholder="123" required>
              </div>
            </div>
            <div class="form-group">
              <label>Cardholder Name</label>
              <input type="text" placeholder="John Doe" required>
            </div>
          </div>

          <button class="btn btn-primary btn-lg" id="place-order-btn" style="width:100%">Place Order — ${UI.formatPrice(Cart.getTotal())}</button>
        </div>

        <div>
          <div class="checkout-summary">
            <h3>Order Summary</h3>
            ${items.map(item => `
              <div class="checkout-item">
                <div class="checkout-item-image">
                  <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="checkout-item-info">
                  <div class="checkout-item-title">${item.title}</div>
                  <div class="checkout-item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="checkout-item-price">${UI.formatPrice(item.discountedPrice * item.quantity)}</div>
              </div>
            `).join('')}
            <div class="summary-row"><span class="label">Subtotal</span><span class="value">${UI.formatPrice(Cart.getSubtotal())}</span></div>
            <div class="summary-row"><span class="label">Shipping</span><span class="value">${Cart.getShipping() === 0 ? 'FREE' : UI.formatPrice(Cart.getShipping())}</span></div>
            <div class="summary-row"><span class="label">Tax (8%)</span><span class="value">${UI.formatPrice(Cart.getTax())}</span></div>
            <div class="summary-row total"><span class="label">Total</span><span class="value">${UI.formatPrice(Cart.getTotal())}</span></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('place-order-btn').addEventListener('click', () => {
      const items = Cart.getItems();
      const subtotal = Cart.getSubtotal();
      const shipping = Cart.getShipping();
      const tax = Cart.getTax();
      const total = Cart.getTotal();

      /* Save order to history */
      Orders.addOrder(items, subtotal, shipping, tax, total);

      UI.showToast({
        title: 'Order placed!',
        message: 'Your order has been placed successfully.',
        type: 'success',
        duration: 5000
      });
      Cart.clear();
      setTimeout(() => window.location.href = 'profile.html', 2000);
    });
  }
};
