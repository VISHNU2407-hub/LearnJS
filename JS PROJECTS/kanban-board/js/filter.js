/* ============================================
   FILTER MODULE - Priority & Category Filters
   ============================================ */

const Filter = {
  /**
   * Initialize filter dropdowns and pills
   */
  init() {
    this._initCategoryDropdown();
    this._initPriorityPills();
  },

  /**
   * Initialize the category filter dropdown
   */
  _initCategoryDropdown() {
    var trigger = document.getElementById('filter-category');
    if (!trigger) return;

    var dropdown = trigger.closest('.dropdown');
    var menu = dropdown ? dropdown.querySelector('.dropdown__menu') : null;
    if (!menu) return;

    // Build menu items
    var options = ['all'].concat(CATEGORIES);
    var currentSavedCategory = App.state.filters && App.state.filters.category ? App.state.filters.category : 'all';

    var menuHtml = '';
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      var label = option === 'all' ? 'All Categories' : option;
      var isActive = (option === 'all' && currentSavedCategory === 'all') || (option !== 'all' && currentSavedCategory === option);
      var activeClass = isActive ? ' dropdown__item--active' : '';

      menuHtml += '<button class="dropdown__item' + activeClass + '" data-value="' + option + '">' +
        '<span class="dropdown__item__check">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="20 6 9 17 4 12"></polyline>' +
          '</svg>' +
        '</span>' +
        label +
      '</button>';
    }
    menu.innerHTML = menuHtml;

    // Update trigger text to reflect current selection
    var currentLabel = currentSavedCategory === 'all' ? 'All Categories' : currentSavedCategory;
    var triggerSpan = trigger.querySelector('span');
    if (triggerSpan) triggerSpan.textContent = currentLabel;

    // Toggle dropdown
    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('dropdown--active');

      if (dropdown.classList.contains('dropdown--active')) {
        setTimeout(function() {
          var closeHandler = function(e2) {
            if (!dropdown.contains(e2.target)) {
              dropdown.classList.remove('dropdown--active');
              document.removeEventListener('click', closeHandler);
            }
          };
          document.addEventListener('click', closeHandler);
        }, 10);
      }
    });

    // Handle item selection
    var items = menu.querySelectorAll('.dropdown__item');
    for (var j = 0; j < items.length; j++) {
      (function(item) {
        item.addEventListener('click', function() {
          var value = item.dataset.value;

          // Update active state
          var allItems = menu.querySelectorAll('.dropdown__item');
          for (var k = 0; k < allItems.length; k++) {
            allItems[k].classList.remove('dropdown__item--active');
          }
          item.classList.add('dropdown__item--active');

          // Update trigger text
          var label = value === 'all' ? 'All Categories' : value;
          if (triggerSpan) triggerSpan.textContent = label;

          // Apply filter
          App.setState({
            filters: { priority: App.state.filters.priority, category: value }
          });

          dropdown.classList.remove('dropdown--active');
        });
      })(items[j]);
    }
  },

  /**
   * Initialize priority filter pills
   */
  _initPriorityPills() {
    var pillsContainer = document.getElementById('filter-priority-pills');
    if (!pillsContainer) return;

    var pills = pillsContainer.querySelectorAll('.filter-pill');

    pills.forEach(function(pill) {
      pill.addEventListener('click', function() {
        var priority = pill.dataset.priority;

        // Update active state
        pills.forEach(function(p) { p.classList.remove('filter-pill--active'); });
        pill.classList.add('filter-pill--active');

        // Apply filter
        App.setState({
          filters: { priority: priority, category: App.state.filters.category }
        });
      });
    });

    // Set initial active state from saved state
    var savedPriority = App.state.filters && App.state.filters.priority ? App.state.filters.priority : 'all';
    pills.forEach(function(pill) {
      if (pill.dataset.priority === savedPriority) {
        pill.classList.add('filter-pill--active');
      } else {
        pill.classList.remove('filter-pill--active');
      }
    });
  }
};
