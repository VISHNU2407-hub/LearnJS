/**
 * VKS Premium Footer
 * Vanilla JavaScript · Loads once on page load
 */
(function () {
  'use strict';

  function initFooter() {
    const typingEl = document.querySelector('.vks-typing');
    const cursor = document.querySelector('.vks-cursor');
    const byLine = document.querySelector('.vks-footer-by');

    if (typingEl) {
      typingEl.textContent = 'VKS';
    }

    if (cursor) {
      cursor.style.display = 'none';
    }

    if (byLine) {
      byLine.classList.add('visible');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }
})();
