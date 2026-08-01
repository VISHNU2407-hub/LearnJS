/* ==============================================
   CART.JS — Shopping Cart Module
   ==============================================
   Manages cart state with localStorage persistence.
   ============================================== */

const Cart = {
  STORAGE_KEY: 'ecommerce_cart',

  /* Get cart items from localStorage */
  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /* Save cart items to localStorage */
  saveItems(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.updateUI();
  },

  /* Add item to cart */
  addItem(product, quantity = 1, variant = '') {
    const items = this.getItems();
    const existingIndex = items.findIndex(item => item.id === product.id && item.variant === variant);

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice || product.price,
        image: product.thumbnail || product.images?.[0] || '',
        category: product.category || '',
        variant: variant,
        quantity: quantity
      });
    }

    this.saveItems(items);
    UI.showToast({
      title: 'Added to cart',
      message: `${product.title} has been added to your cart.`,
      type: 'success'
    });
  },

  /* Remove item from cart */
  removeItem(productId, variant = '') {
    const items = this.getItems().filter(item => !(item.id === productId && item.variant === variant));
    this.saveItems(items);
    UI.showToast({
      title: 'Removed from cart',
      message: 'Item has been removed from your cart.',
      type: 'info'
    });
  },

  /* Update item quantity */
  updateQuantity(productId, variant, quantity) {
    const items = this.getItems();
    const item = items.find(item => item.id === productId && item.variant === variant);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId, variant);
        return;
      }
      item.quantity = quantity;
      this.saveItems(items);
    }
  },

  /* Clear cart */
  clear() {
    this.saveItems([]);
  },

  /* Get total items count */
  getCount() {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  },

  /* Calculate subtotal */
  getSubtotal() {
    return this.getItems().reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
  },

  /* Calculate shipping (free over $50) */
  getShipping() {
    const subtotal = this.getSubtotal();
    return subtotal >= 50 ? 0 : 5.99;
  },

  /* Calculate tax (8%) */
  getTax() {
    return this.getSubtotal() * 0.08;
  },

  /* Calculate total */
  getTotal() {
    return this.getSubtotal() + this.getShipping() + this.getTax();
  },

  /* Apply coupon discount */
  applyCoupon(code) {
    const coupons = { 'SAVE10': 10, 'SAVE20': 20, 'WELCOME5': 5 };
    const discount = coupons[code.toUpperCase()];
    if (discount) {
      return { valid: true, discount, message: `${discount}% off applied!` };
    }
    return { valid: false, discount: 0, message: 'Invalid coupon code.' };
  },

  /* Update UI (cart count badge) */
  updateUI() {
    const count = this.getCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  /* Render cart page */
  renderCartPage() {
    const container = document.getElementById('cart-content');
    if (!container) return;

    const items = this.getItems();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <a href="products.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="cart-layout">
        <div>
          <div class="cart-items">
            <div class="cart-header">
              <span>Product</span>
              <span></span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>
            <div id="cart-items-list">
              ${items.map((item, index) => `
                <div class="cart-item" data-index="${index}">
                  <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                  </div>
                  <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    ${item.variant ? `<div class="cart-item-variant">${item.variant}</div>` : ''}
                    <div class="cart-item-price">${UI.formatPrice(item.discountedPrice)}</div>
                  </div>
                  <div class="quantity-selector">
                    <button class="qty-minus" data-id="${item.id}" data-variant="${item.variant}">−</button>
                    <input type="number" value="${item.quantity}" min="1" max="99" readonly>
                    <button class="qty-plus" data-id="${item.id}" data-variant="${item.variant}">+</button>
                  </div>
                  <div class="cart-item-total">${UI.formatPrice(item.discountedPrice * item.quantity)}</div>
                  <button class="cart-item-remove" data-id="${item.id}" data-variant="${item.variant}" aria-label="Remove item">✕</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div>
          <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="coupon-section">
              <input type="text" id="coupon-input" placeholder="Coupon code" aria-label="Coupon code">
              <button class="btn btn-sm btn-secondary" id="apply-coupon">Apply</button>
            </div>
            <div class="summary-row">
              <span class="label">Subtotal</span>
              <span class="value" id="cart-subtotal">${UI.formatPrice(this.getSubtotal())}</span>
            </div>
            <div class="summary-row">
              <span class="label">Shipping</span>
              <span class="value" id="cart-shipping">${this.getShipping() === 0 ? 'FREE' : UI.formatPrice(this.getShipping())}</span>
            </div>
            <div class="summary-row">
              <span class="label">Tax (8%)</span>
              <span class="value" id="cart-tax">${UI.formatPrice(this.getTax())}</span>
            </div>
            <div class="summary-row total">
              <span class="label">Total</span>
              <span class="value" id="cart-total">${UI.formatPrice(this.getTotal())}</span>
            </div>
            ${this.getShipping() > 0 ? '<div class="shipping-note">Free shipping on orders over $50</div>' : ''}
            <a href="checkout.html" class="btn btn-primary btn-lg">Proceed to Checkout</a>
            <button class="btn btn-ghost" id="clear-cart" style="width:100%;margin-top:8px">Clear Cart</button>
          </div>
        </div>
      </div>
    `;

    this.attachCartEvents();
  },

  /* Attach cart event listeners */
  attachCartEvents() {
    /* Quantity minus */
    document.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const variant = btn.dataset.variant;
        const item = this.getItems().find(i => i.id === id && i.variant === variant);
        if (item) this.updateQuantity(id, variant, item.quantity - 1);
        this.renderCartPage();
      });
    });

    /* Quantity plus */
    document.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const variant = btn.dataset.variant;
        const item = this.getItems().find(i => i.id === id && i.variant === variant);
        if (item) this.updateQuantity(id, variant, item.quantity + 1);
        this.renderCartPage();
      });
    });

    /* Remove items */
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const variant = btn.dataset.variant;
        this.removeItem(id, variant);
        this.renderCartPage();
      });
    });

    /* Clear cart */
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clear();
        this.renderCartPage();
      });
    }

    /* Apply coupon */
    const applyBtn = document.getElementById('apply-coupon');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const input = document.getElementById('coupon-input');
        if (input) {
          const result = this.applyCoupon(input.value);
          UI.showToast({
            title: result.valid ? 'Coupon applied!' : 'Invalid coupon',
            message: result.message,
            type: result.valid ? 'success' : 'error'
          });
        }
      });
    }
  }
};
