/* ==============================================
   API.JS — DummyJSON API Integration
   ============================================== */

const API = {
  BASE_URL: 'https://dummyjson.com',

  async getProducts(limit = 20, skip = 0) {
    const res = await fetch(`${this.BASE_URL}/products?limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${this.BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  async searchProducts(query, limit = 20, skip = 0) {
    const res = await fetch(`${this.BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${this.BASE_URL}/products/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getProductsByCategory(category, limit = 20, skip = 0) {
    const res = await fetch(`${this.BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error('Failed to fetch category products');
    return res.json();
  },

  async getAllProducts() {
    const res = await fetch(`${this.BASE_URL}/products?limit=194`);
    if (!res.ok) throw new Error('Failed to fetch all products');
    return res.json();
  },

  async getProductWithReviews(id) {
    return this.getProduct(id);
  }
};

function getDiscountedPrice(price, discountPercentage) {
  return (price * (1 - discountPercentage / 100)).toFixed(2);
}

function getDiscountPercent(price, discountedPrice) {
  return Math.round((1 - discountedPrice / price) * 100);
}
