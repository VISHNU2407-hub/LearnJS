/* ============================================================
   FINWISE · EXPENSE TRACKER
   Vanilla JavaScript ES6+ — All Features
   ============================================================ */

/* ========== STATE ========== */
let state = {
  transactions: [],
  editingId: null,
  currency: '₹',
  darkMode: false,
  currentFilter: {
    search: '',
    type: 'all',
    category: 'all',
    sort: 'newest',
  },
};

/* ========== CATEGORIES ========== */
const CATEGORIES = {
  income: [
    { name: 'Salary', icon: '💼', color: '#E8F5E9' },
    { name: 'Freelance', icon: '💻', color: '#E0F2F1' },
    { name: 'Investments', icon: '📈', color: '#E8EAF6' },
    { name: 'Gifts', icon: '🎁', color: '#FFF3E0' },
    { name: 'Other Income', icon: '💰', color: '#F3E5F5' },
  ],
  expense: [
    { name: 'Food & Dining', icon: '🍽️', color: '#FBE9E7' },
    { name: 'Shopping', icon: '🛍️', color: '#FFF3E0' },
    { name: 'Travel', icon: '🚗', color: '#E3F2FD' },
    { name: 'Entertainment', icon: '🎬', color: '#F3E5F5' },
    { name: 'Bills & Utilities', icon: '📄', color: '#F5F5F5' },
    { name: 'Healthcare', icon: '🏥', color: '#E0F2F1' },
    { name: 'Education', icon: '📚', color: '#E8EAF6' },
    { name: 'Rent', icon: '🏠', color: '#FCE4EC' },
    { name: 'Groceries', icon: '🛒', color: '#E8F5E9' },
    { name: 'Others', icon: '📌', color: '#F5F5F5' },
  ],
};

const ALL_CATEGORIES = [...CATEGORIES.income, ...CATEGORIES.expense];

/* ========== DOM REFS ========== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const DOM = {
  // Sidebar
  sidebar: $('#sidebar'),
  sidebarToggle: $('#sidebarToggle'),
  sidebarOverlay: $('#sidebarOverlay'),
  navItems: $$('.nav-item'),

  // Header
  greeting: $('#greeting'),
  greetingSub: $('#greetingSub'),
  headerDate: $('#headerDate'),
  headerAddBtn: $('#headerAddBtn'),

  // Dashboard
  balanceValue: $('#balanceValue'),
  incomeValue: $('#incomeValue'),
  expenseValue: $('#expenseValue'),
  countValue: $('#countValue'),
  balanceTrend: $('#balanceTrend'),
  incomeTrend: $('#incomeTrend'),
  expenseTrend: $('#expenseTrend'),
  countTrend: $('#countTrend'),

  // Form
  form: $('#transactionForm'),
  formTitle: $('#formTitle'),
  submitBtn: $('#submitBtn'),
  submitBtnText: $('#submitBtnText'),
  amountInput: $('#amountInput'),
  amountPrefix: $('#amountPrefix'),
  categorySelect: $('#categorySelect'),
  descInput: $('#descInput'),
  dateInput: $('#dateInput'),
  amountError: $('#amountError'),
  descError: $('#descError'),
  typeIncome: $('#typeIncome'),
  typeExpense: $('#typeExpense'),

  // Transactions
  transactionList: $('#transactionList'),
  searchInput: $('#searchInput'),
  filterType: $('#filterType'),
  filterCategory: $('#filterCategory'),
  sortSelect: $('#sortSelect'),

  // Progress
  progressBars: $('#progressBars'),
  expenseSummarySection: $('#expenseSummarySection'),

  // Modals
  deleteModal: $('#deleteModal'),
  settingsModal: $('#settingsModal'),
  settingsClose: $('#settingsClose'),
  confirmDeleteBtn: $('#confirmDeleteBtn'),
  cancelDeleteBtn: $('#cancelDeleteBtn'),

  // Settings
  currencySelect: $('#currencySelect'),
  darkModeToggle: $('#darkModeToggle'),
  exportCsvBtn: $('#exportCsvBtn'),
  clearAllBtn: $('#clearAllBtn'),

  // Toast
  toastContainer: $('#toastContainer'),

  // Content areas
  formSection: $('#formSection'),
  contentGrid: $('#contentGrid'),
};

/* ========== UTILITY ========== */
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getTodayStr = () => {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
};

const getCategoryInfo = (catName) => {
  return ALL_CATEGORIES.find((c) => c.name === catName) || { name: catName, icon: '📌', color: '#F5F5F5' };
};

/* ========== NOTIFICATION SYSTEM ========== */
function showNotification(message, type = 'success') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ========== LOCAL STORAGE ========== */
function loadTransactions() {
  try {
    const data = localStorage.getItem('finwise_transactions');
    state.transactions = data ? JSON.parse(data) : [];
  } catch {
    state.transactions = [];
  }
}

function saveTransactions() {
  localStorage.setItem('finwise_transactions', JSON.stringify(state.transactions));
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('finwise_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      state.currency = settings.currency || '₹';
      state.darkMode = settings.darkMode || false;
    }
  } catch {
    // ignore
  }
}

function saveSettings() {
  localStorage.setItem('finwise_settings', JSON.stringify({
    currency: state.currency,
    darkMode: state.darkMode,
  }));
}

/* ========== DASHBOARD UPDATE ========== */
function updateDashboard() {
  const { transactions, currency } = state;
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const count = transactions.length;

  // Calculate trends (compare last 30 days vs previous 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const recentIncome = transactions
    .filter((t) => t.type === 'income' && new Date(t.date) >= thirtyDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0);
  const prevIncome = transactions
    .filter((t) => t.type === 'income' && new Date(t.date) >= sixtyDaysAgo && new Date(t.date) < thirtyDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0);

  const recentExpenses = transactions
    .filter((t) => t.type === 'expense' && new Date(t.date) >= thirtyDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0);
  const prevExpenses = transactions
    .filter((t) => t.type === 'expense' && new Date(t.date) >= sixtyDaysAgo && new Date(t.date) < thirtyDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0);

  const calcTrend = (curr, prev) => {
    if (prev === 0) return curr > 0 ? 'new' : null;
    const pct = ((curr - prev) / prev) * 100;
    return Math.round(pct);
  };

  const incomeTrend = calcTrend(recentIncome, prevIncome);
  const expenseTrend = calcTrend(recentExpenses, prevExpenses);

  // Animate counters
  animateCounter(DOM.balanceValue, balance, currency);
  animateCounter(DOM.incomeValue, totalIncome, currency);
  animateCounter(DOM.expenseValue, totalExpenses, currency);
  animateCount(DOM.countValue, count);

  // Trends
  DOM.balanceTrend.textContent = balance >= 0 ? '↗️ Healthy' : '↘️ Deficit';
  DOM.incomeTrend.textContent = incomeTrend !== null
    ? `↗️ ${incomeTrend}% vs last month`
    : '↗️ No prior data';
  DOM.expenseTrend.textContent = expenseTrend !== null
    ? `↘️ ${expenseTrend}% vs last month`
    : '↘️ No prior data';
  DOM.countTrend.textContent = `${count} ${count === 1 ? 'entry' : 'entries'}`;
}

function animateCounter(el, value, currency = '') {
  const current = parseFloat(el.dataset.target) || 0;
  const target = Math.round(value * 100) / 100;
  el.dataset.target = target;

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const duration = 500;
  const startTime = performance.now();
  const startValue = current;

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentVal = startValue + (target - startValue) * eased;
    el.textContent = `${currency}${formatter.format(currentVal)}`;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = `${currency}${formatter.format(target)}`;
    }
  }
  requestAnimationFrame(update);
}

function animateCount(el, target) {
  const current = parseInt(el.dataset.target) || 0;
  el.dataset.target = target;

  const duration = 400;
  const startTime = performance.now();
  const startValue = current;

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.round(startValue + (target - startValue) * eased);
    el.textContent = currentVal;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

/* ========== RENDER TRANSACTIONS ========== */
function renderTransactions() {
  const { transactions, currency, currentFilter } = state;
  const list = DOM.transactionList;

  // Apply filters & sort
  let filtered = filterAndSortTransactions(transactions, currentFilter);

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-title">No transactions yet</div>
        <div class="empty-state-desc">Add your first transaction to get started!</div>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered
    .map((t) => {
      const cat = getCategoryInfo(t.category);
      const amountCls = t.type === 'income' ? 'income' : 'expense';
      const sign = t.type === 'income' ? '+' : '-';
      return `
        <div class="transaction-item" data-id="${t.id}" role="listitem">
          <div class="transaction-icon" style="background:${cat.color}">${cat.icon}</div>
          <div class="transaction-info">
            <div class="transaction-category">${t.category}</div>
            <div class="transaction-desc">${escHtml(t.description)}</div>
            <div class="transaction-date">${formatDate(t.date)}</div>
          </div>
          <div class="transaction-amount ${amountCls}">${sign}${currency}${formatAmount(t.amount)}</div>
          <div class="transaction-actions">
            <button class="btn-icon btn-icon-edit" data-action="edit" data-id="${t.id}" aria-label="Edit transaction" title="Edit">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M10.5 1.5L13.5 4.5L5 13H2V10L10.5 1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            </button>
            <button class="btn-icon btn-icon-danger" data-action="delete" data-id="${t.id}" aria-label="Delete transaction" title="Delete">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M3 4H12M5.5 4V2.5C5.5 2.22 5.72 2 6 2H9C9.28 2 9.5 2.22 9.5 2.5V4M11.5 4V12.5C11.5 12.78 11.28 13 11 13H4C3.72 13 3.5 12.78 3.5 12.5V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

function formatAmount(val) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ========== FILTER & SORT ========== */
function filterAndSortTransactions(transactions, filter) {
  let result = [...transactions];

  // Search
  if (filter.search) {
    const q = filter.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  // Type filter
  if (filter.type !== 'all') {
    result = result.filter((t) => t.type === filter.type);
  }

  // Category filter
  if (filter.category !== 'all') {
    result = result.filter((t) => t.category === filter.category);
  }

  // Sort
  switch (filter.sort) {
    case 'newest':
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'highest':
      result.sort((a, b) => b.amount - a.amount);
      break;
    case 'lowest':
      result.sort((a, b) => a.amount - b.amount);
      break;
    default:
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return result;
}

/* ========== RENDER EXPENSE SUMMARY ========== */
function renderSummary() {
  const { transactions } = state;
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  if (expenses.length === 0 || totalExpenses === 0) {
    DOM.progressBars.innerHTML = `
      <div class="empty-state" style="padding: 20px">
        <div class="empty-state-icon">📊</div>
        <div class="empty-state-title">No expenses to show</div>
        <div class="empty-state-desc">Add some expenses to see your breakdown.</div>
      </div>
    `;
    return;
  }

  // Group by category
  const grouped = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  // Sort by amount descending
  const sorted = Object.entries(grouped)
    .sort(([, a], [, b]) => b - a);

  // Colors for progress bars
  const colors = ['#1E4D3A', '#8BA888', '#D4A373', '#6B8E7B', '#A8C4A5', '#C8B6A6', '#7D9B8A', '#B5C9B8'];

  DOM.progressBars.innerHTML = sorted
    .map(([cat, amount], idx) => {
      const pct = (amount / totalExpenses) * 100;
      const catInfo = getCategoryInfo(cat);
      const color = colors[idx % colors.length];
      return `
        <div class="progress-item">
          <div class="progress-header">
            <span class="progress-label">
              <span class="progress-label-icon">${catInfo.icon}</span>
              ${cat}
            </span>
            <span class="progress-percent">${state.currency}${formatAmount(amount)} · ${Math.round(pct)}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="background:${color}; width:${pct}%"></div>
          </div>
        </div>
      `;
    })
    .join('');
}

/* ========== SEARCH / FILTER / SORT ========== */
function searchTransactions() {
  state.currentFilter.search = DOM.searchInput.value.trim();
  renderTransactions();
}

function filterTransactions() {
  state.currentFilter.type = DOM.filterType.value;
  state.currentFilter.category = DOM.filterCategory.value;
  renderTransactions();
}

function sortTransactions() {
  state.currentFilter.sort = DOM.sortSelect.value;
  renderTransactions();
}

/* ========== ADD / EDIT / DELETE ========== */

function resetForm() {
  state.editingId = null;
  DOM.formTitle.textContent = 'Add Transaction';
  DOM.submitBtnText.textContent = 'Add Transaction';
  DOM.form.reset();
  DOM.amountError.classList.remove('visible');
  DOM.amountError.textContent = '';
  DOM.descError.classList.remove('visible');
  DOM.descError.textContent = '';
  DOM.dateInput.value = getTodayStr();
}

function addTransaction(e) {
  e.preventDefault();

  // Validate
  const type = DOM.typeIncome.checked ? 'income' : 'expense';
  const amount = parseFloat(DOM.amountInput.value);
  const category = DOM.categorySelect.value;
  const description = DOM.descInput.value.trim();
  const date = DOM.dateInput.value;

  let valid = true;

  if (!amount || amount <= 0) {
    DOM.amountError.textContent = 'Please enter a valid amount';
    DOM.amountError.classList.add('visible');
    valid = false;
  } else {
    DOM.amountError.classList.remove('visible');
  }

  if (!description) {
    DOM.descError.textContent = 'Please enter a description';
    DOM.descError.classList.add('visible');
    valid = false;
  } else {
    DOM.descError.classList.remove('visible');
  }

  if (!category) {
    showNotification('Please select a category', 'error');
    return;
  }

  if (!date) {
    showNotification('Please select a date', 'error');
    return;
  }

  if (!valid) return;

  if (state.editingId) {
    // Edit existing
    const idx = state.transactions.findIndex((t) => t.id === state.editingId);
    if (idx !== -1) {
      state.transactions[idx] = {
        ...state.transactions[idx],
        type,
        amount: Math.round(amount * 100) / 100,
        category,
        description,
        date,
      };
      showNotification('Transaction updated successfully', 'success');
    }
    state.editingId = null;
    DOM.formTitle.textContent = 'Add Transaction';
    DOM.submitBtnText.textContent = 'Add Transaction';
  } else {
    // Add new
    const transaction = {
      id: generateId(),
      type,
      amount: Math.round(amount * 100) / 100,
      category,
      description,
      date,
      createdAt: new Date().toISOString(),
    };
    state.transactions.push(transaction);
    showNotification('Transaction added successfully', 'success');
  }

  saveTransactions();
  resetForm();
  updateDashboard();
  renderTransactions();
  renderSummary();
}

function editTransaction(id) {
  const t = state.transactions.find((tx) => tx.id === id);
  if (!t) return;

  state.editingId = id;
  DOM.formTitle.textContent = 'Edit Transaction';
  DOM.submitBtnText.textContent = 'Update Transaction';

  // Scroll to form
  DOM.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Populate form
  if (t.type === 'income') {
    DOM.typeIncome.checked = true;
  } else {
    DOM.typeExpense.checked = true;
  }
  DOM.amountInput.value = t.amount;
  DOM.categorySelect.value = t.category;
  DOM.descInput.value = t.description;
  DOM.dateInput.value = t.date;

  // Update category options for the type
  updateCategoryOptions(t.type);
}

function deleteTransaction(id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveTransactions();
  updateDashboard();
  renderTransactions();
  renderSummary();
  showNotification('Transaction deleted', 'info');
}

/* ========== CATEGORY OPTIONS ========== */
function updateCategoryOptions(type) {
  const cats = type === 'income'
    ? CATEGORIES.income
    : CATEGORIES.expense;

  DOM.categorySelect.innerHTML = '<option value="">Select category</option>';
  cats.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = `${c.icon} ${c.name}`;
    DOM.categorySelect.appendChild(opt);
  });
}

function populateFilterCategories() {
  // Show ALL categories in the filter dropdown, regardless of form type
  DOM.filterCategory.innerHTML = '<option value="all">All Categories</option>';
  ALL_CATEGORIES.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = `${c.icon} ${c.name}`;
    DOM.filterCategory.appendChild(opt);
  });
}

/* ========== EXPORT CSV ========== */
function exportCSV() {
  const { transactions, currency } = state;
  if (transactions.length === 0) {
    showNotification('No transactions to export', 'error');
    return;
  }

  const headers = ['Type', 'Category', 'Description', 'Date', 'Amount'];
  const rows = transactions.map((t) => [
    t.type,
    t.category,
    `"${t.description.replace(/"/g, '""')}"`,
    t.date,
    `${currency}${t.amount.toFixed(2)}`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `finwise_export_${getTodayStr()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  showNotification('CSV exported successfully', 'success');
}

/* ========== DARK MODE ========== */
function toggleDarkMode(enabled) {
  state.darkMode = enabled;
  document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
  DOM.darkModeToggle.checked = enabled;
  saveSettings();
}

/* ========== CURRENCY ========== */
function updateCurrency(symbol) {
  state.currency = symbol;
  DOM.amountPrefix.textContent = symbol;
  saveSettings();
  updateDashboard();
  renderTransactions();
  renderSummary();
}

/* ========== HEADER ========== */
function updateHeader() {
  const now = new Date();
  const hour = now.getHours();
  let greeting = 'Hello';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  DOM.greeting.textContent = `${greeting}, Vishnu 👋`;

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  DOM.headerDate.textContent = dateStr;
}

/* ========== EVENT DELEGATION ========== */
function setupEventDelegation() {
  // Transaction list click (edit / delete)
  DOM.transactionList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'edit') {
      editTransaction(id);
    } else if (action === 'delete') {
      // Show confirmation modal
      DOM.deleteModal.classList.add('open');
      DOM.confirmDeleteBtn.dataset.id = id;
    }
  });

  // Delete modal
  DOM.confirmDeleteBtn.addEventListener('click', () => {
    const id = DOM.confirmDeleteBtn.dataset.id;
    if (id) deleteTransaction(id);
    DOM.deleteModal.classList.remove('open');
  });

  DOM.cancelDeleteBtn.addEventListener('click', () => {
    DOM.deleteModal.classList.remove('open');
  });

  DOM.deleteModal.addEventListener('click', (e) => {
    if (e.target === DOM.deleteModal) {
      DOM.deleteModal.classList.remove('open');
    }
  });

  // Settings modal
  document.querySelector('[data-section="settings"]').addEventListener('click', (e) => {
    e.preventDefault();
    DOM.settingsModal.classList.add('open');
  });

  DOM.settingsClose.addEventListener('click', () => {
    DOM.settingsModal.classList.remove('open');
  });

  DOM.settingsModal.addEventListener('click', (e) => {
    if (e.target === DOM.settingsModal) {
      DOM.settingsModal.classList.remove('open');
    }
  });

  // Sidebar navigation
  DOM.navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;

      DOM.navItems.forEach((n) => n.classList.remove('active'));
      item.classList.add('active');

      // Handle section visibility
      switch (section) {
        case 'add-transaction':
          DOM.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case 'transactions':
          DOM.transactionList.closest('.content-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
          DOM.searchInput.focus();
          break;
        case 'summary':
          DOM.expenseSummarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case 'settings':
          DOM.settingsModal.classList.add('open');
          break;
        case 'dashboard':
        default:
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
      }

      // Close sidebar on mobile
      if (window.innerWidth <= 768) {
        DOM.sidebar.classList.remove('open');
      }
    });
  });

  // Sidebar toggle
  DOM.sidebarToggle.addEventListener('click', () => {
    DOM.sidebar.classList.toggle('open');
  });

  DOM.sidebarOverlay.addEventListener('click', () => {
    DOM.sidebar.classList.remove('open');
  });

  // Header add button
  DOM.headerAddBtn.addEventListener('click', () => {
    resetForm();
    DOM.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Type toggle changes category options
  DOM.typeIncome.addEventListener('change', () => updateCategoryOptions('income'));
  DOM.typeExpense.addEventListener('change', () => updateCategoryOptions('expense'));

  // Search / Filter / Sort
  DOM.searchInput.addEventListener('input', searchTransactions);
  DOM.filterType.addEventListener('change', filterTransactions);
  DOM.filterCategory.addEventListener('change', filterTransactions);
  DOM.sortSelect.addEventListener('change', sortTransactions);

  // Settings
  DOM.darkModeToggle.addEventListener('change', (e) => {
    toggleDarkMode(e.target.checked);
  });

  DOM.currencySelect.addEventListener('change', (e) => {
    updateCurrency(e.target.value);
  });

  DOM.exportCsvBtn.addEventListener('click', exportCSV);

  DOM.clearAllBtn.addEventListener('click', () => {
    if (state.transactions.length === 0) {
      showNotification('No transactions to clear', 'info');
      return;
    }
    if (confirm('Are you sure you want to delete ALL transactions? This cannot be undone.')) {
      state.transactions = [];
      saveTransactions();
      updateDashboard();
      renderTransactions();
      renderSummary();
      showNotification('All transactions cleared', 'info');
    }
  });

  // Keyboard: Escape to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      DOM.deleteModal.classList.remove('open');
      DOM.settingsModal.classList.remove('open');
      DOM.sidebar.classList.remove('open');
    }
  });
}

/* ========== INITIALIZATION ========== */
function initializeApp() {
  // Load data
  loadSettings();
  loadTransactions();

  // Set initial currency
  DOM.amountPrefix.textContent = state.currency;
  DOM.currencySelect.value = state.currency;

  // Dark mode
  toggleDarkMode(state.darkMode);

  // Set default date
  DOM.dateInput.value = getTodayStr();

  // Default category options for the form
  updateCategoryOptions('income');
  // Populate filter dropdown with ALL categories
  populateFilterCategories();

  // Update header
  updateHeader();

  // Update dashboard
  updateDashboard();

  // Render transactions
  renderTransactions();

  // Render summary
  renderSummary();

  // Setup events
  setupEventDelegation();

  // Form submit
  DOM.form.addEventListener('submit', addTransaction);
}

/* ========== START ========== */
document.addEventListener('DOMContentLoaded', initializeApp);
