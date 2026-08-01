/* ============================================
   SORT MODULE - Task Sorting Options
   ============================================ */

const Sort = {
  /**
   * Initialize sort dropdown
   */
  init() {
    const trigger = document.getElementById('sort-trigger');
    if (!trigger) return;

    const dropdown = trigger.closest('.dropdown');
    const menu = dropdown ? dropdown.querySelector('.dropdown__menu') : null;
    if (!menu) return;

    const sortOptions = [
      { value: 'created', label: 'Created Date' },
      { value: 'dueDate', label: 'Due Date' },
      { value: 'priority', label: 'Priority' },
      { value: 'title', label: 'Alphabetical' }
    ];

    // Update trigger label to match current sort config
    const currentSort = App.state.sort || { by: 'created', order: 'desc' };
    const currentOption = sortOptions.find(o => o.value === currentSort.by) || sortOptions[0];
    const textSpan = trigger.querySelector('span');
    if (textSpan) textSpan.textContent = currentOption.label;

    // Build menu items
    menu.innerHTML = sortOptions.map(opt => {
      const isActive = currentSort.by === opt.value;
      return `<button class="dropdown__item ${isActive ? 'dropdown__item--active' : ''}" data-value="${opt.value}">${opt.label}</button>`;
    }).join('') + `
      <div class="dropdown__divider"></div>
      <button class="dropdown__item" data-action="toggle-order">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
        Toggle Order
      </button>
    `;

    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('dropdown--active');

      if (dropdown.classList.contains('dropdown--active')) {
        setTimeout(() => {
          const closeHandler = (e2) => {
            if (!dropdown.contains(e2.target)) {
              dropdown.classList.remove('dropdown--active');
              document.removeEventListener('click', closeHandler);
            }
          };
          document.addEventListener('click', closeHandler);
        }, 10);
      }
    });

    // Handle sort option selection
    menu.querySelectorAll('.dropdown__item[data-value]').forEach(item => {
      item.addEventListener('click', () => {
        const value = item.dataset.value;

        menu.querySelectorAll('.dropdown__item[data-value]').forEach(i => i.classList.remove('dropdown__item--active'));
        item.classList.add('dropdown__item--active');

        // Update trigger text
        const label = item.textContent.trim();
        if (textSpan) textSpan.textContent = label;

        App.setState({
          sort: { by: value, order: App.state.sort.order }
        });

        dropdown.classList.remove('dropdown--active');
      });
    });

    // Handle order toggle
    const orderBtn = menu.querySelector('[data-action="toggle-order"]');
    if (orderBtn) {
      orderBtn.addEventListener('click', () => {
        const newOrder = App.state.sort.order === 'desc' ? 'asc' : 'desc';
        App.setState({
          sort: { by: App.state.sort.by, order: newOrder }
        });
        dropdown.classList.remove('dropdown--active');
        UI.showToast(`Sorted ${newOrder === 'asc' ? 'ascending' : 'descending'}`, 'success');
      });
    }
  }
};
