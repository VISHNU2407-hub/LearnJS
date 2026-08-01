/* ==============================================
   UI.JS — UI Utilities & Helpers
   ============================================== */

const UI = {
  toastContainer: null,

  initToastContainer() {
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.className = 'toast-container';
      document.body.appendChild(this.toastContainer);
    }
  },

  showToast({ title, message, type = 'info', duration = 4000 }) {
    this.initToastContainer();
    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon ${type}">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Close">✕</button>`;
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.dismissToast(toast));
    this.toastContainer.appendChild(toast);
    if (duration > 0) setTimeout(() => this.dismissToast(toast), duration);
  },

  dismissToast(toast) {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 250);
  },

  createSkeletonGrid(count = 8) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<div class="skeleton-card"><div class="skeleton skeleton-image"></div><div class="skeleton-text"><div class="skeleton skeleton-line w-60"></div><div class="skeleton skeleton-line w-80"></div><div class="skeleton skeleton-line w-40"></div></div></div>`;
    }
    return html;
  },

  createSkeletonGridHtml(container, count = 8) {
    container.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px">${this.createSkeletonGrid(count)}</div>`;
  },

  initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const drawer = document.querySelector('.mobile-drawer');
    const navbar = document.querySelector('.navbar');

    if (hamburger && drawer) {
      const toggleMenu = (forceClose) => {
        if (forceClose) {
          hamburger.classList.remove('active');
          drawer.classList.remove('open');
        } else {
          hamburger.classList.toggle('active');
          drawer.classList.toggle('open');
        }
        document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
      };

      hamburger.addEventListener('click', () => toggleMenu());
      hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMenu();
        }
      });

      drawer.addEventListener('click', (e) => {
        if (e.target === drawer) toggleMenu(true);
      });
    }

    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    }
    this.updateNavCounts();
  },

  updateNavCounts() {
    const cartCount = document.querySelector('.cart-count');
    const wishlistCount = document.querySelector('.wishlist-count');
    if (cartCount) cartCount.textContent = Cart.getCount();
    if (wishlistCount) wishlistCount.textContent = Wishlist.getCount();
  },

  setActiveNav() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-links a, .mobile-drawer-links a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === page);
    });
  },

  initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  },

  initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.src = img.dataset.src || img.src;
      });
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });
      document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    }
  },

  initPageTransitions() { document.body.classList.add('page-transition'); },

  formatPrice(price) { return `$${parseFloat(price).toFixed(2)}`; },

  truncateText(text, maxLength = 60) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '<span class="star-empty">' + '★'.repeat(empty) + '</span>';
  },

  initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value.trim()) {
        this.showToast({ title: 'Subscribed!', message: 'Thank you for subscribing.', type: 'success' });
        input.value = '';
      }
    });
  },

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  },

  init() {
    this.initNavbar();
    this.setActiveNav();
    this.initBackToTop();
    this.initLazyImages();
    this.initPageTransitions();
    this.initNewsletter();
    this.initSmoothScroll();
  }
};
