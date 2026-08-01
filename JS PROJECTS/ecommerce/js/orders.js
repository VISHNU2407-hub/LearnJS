/* ==============================================
   ORDERS.JS — Order History Module
   ==============================================
   Saves completed orders to localStorage for
   real order history display on profile page.
   ============================================== */

const Orders = {
  STORAGE_KEY: 'ecommerce_orders',

  /* Get all saved orders */
  getOrders() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /* Save a completed order */
  addOrder(items, subtotal, shipping, tax, total) {
    const orders = this.getOrders();
    const order = {
      id: this.generateOrderId(),
      date: new Date().toISOString(),
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        discountedPrice: item.discountedPrice,
        image: item.image,
        category: item.category,
        quantity: item.quantity,
        variant: item.variant || ''
      })),
      subtotal,
      shipping,
      tax,
      total,
      status: 'Processing',
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    };
    orders.unshift(order);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    return order;
  },

  /* Get count of orders */
  getCount() {
    return this.getOrders().length;
  },

  /* Generate a unique order ID */
  generateOrderId() {
    const year = new Date().getFullYear();
    const num = this.getOrders().length + 1;
    return `#ORD-${year}-${String(num).padStart(3, '0')}`;
  },

  /* Format a date string */
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /* Update order status */
  updateStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    }
  }
};
