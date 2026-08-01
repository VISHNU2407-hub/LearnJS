/* ============================================
   SEARCH MODULE - Instant Task Search
   ============================================ */

const Search = {
  /**
   * Initialize search functionality
   */
  init() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear');

    if (!searchInput) return;

    // Debounced search
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        App.setState({ search: e.target.value });
      }, 200);
    });

    // Clear search
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        App.setState({ search: '' });
        searchInput.focus();
      });
    }

    // Keyboard shortcut: Ctrl+K or Cmd+K to focus search
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });

    // Escape to clear and blur
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        App.setState({ search: '' });
        searchInput.blur();
      }
    });
  },

  /**
   * Check if a task matches the search query (used for highlighting)
   */
  matchesQuery(task, query) {
    if (!query) return true;
    const lower = query.toLowerCase();
    return (
      task.title.toLowerCase().includes(lower) ||
      task.description.toLowerCase().includes(lower) ||
      task.category.toLowerCase().includes(lower)
    );
  }
};
