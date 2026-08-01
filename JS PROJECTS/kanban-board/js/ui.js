/* ============================================
   UI MODULE - Helpers, Toast, Confirm
   ============================================ */

const UI = {
  /**
   * Show a toast notification
   */
  showToast(message, type = 'success', duration = 3000) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add('toast--visible', `toast--${type}`);

    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => {
      toast.classList.remove('toast--visible');
    }, duration);
  },

  /**
   * Show a confirmation dialog (returns Promise)
   */
  confirm(title, text) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay';
      overlay.innerHTML = `
        <div class="confirm-dialog">
          <h3 class="confirm-dialog__title">${title}</h3>
          <p class="confirm-dialog__text">${text}</p>
          <div class="confirm-dialog__actions">
            <button class="btn btn--secondary btn--sm" data-action="confirm-cancel">Cancel</button>
            <button class="btn btn--danger btn--sm" data-action="confirm-ok">Delete</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Animate in
      requestAnimationFrame(() => {
        overlay.classList.add('confirm-overlay--open');
      });

      // Handle cancel
      const cancel = () => {
        overlay.classList.remove('confirm-overlay--open');
        setTimeout(() => overlay.remove(), 300);
        resolve(false);
      };

      overlay.querySelector('[data-action="confirm-cancel"]').addEventListener('click', cancel);
      overlay.querySelector('[data-action="confirm-ok"]').addEventListener('click', () => {
        overlay.classList.remove('confirm-overlay--open');
        setTimeout(() => overlay.remove(), 300);
        resolve(true);
      });

      // Click outside to cancel
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cancel();
      });

      // Escape key
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          cancel();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    });
  },

  /**
   * Initialize global UI elements
   */
  init() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown--active').forEach(d => {
        d.classList.remove('dropdown--active');
      });
    });

    // Stop propagation on dropdown clicks
    document.querySelectorAll('.dropdown').forEach(d => {
      d.addEventListener('click', (e) => e.stopPropagation());
    });

    // Column add task buttons (delegated)
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-action="add-task"]');
      if (addBtn) {
        const columnId = addBtn.dataset.column;
        const taskId = 'new_' + Date.now();
        Modal.open(taskId, true, columnId);
      }
    });
  }
};

// Constants used across modules
const PRIORITY_LABELS = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low'
};

const CATEGORIES = [
  'Design',
  'Development',
  'Testing',
  'Research',
  'Meeting',
  'Bug',
  'Personal'
];
