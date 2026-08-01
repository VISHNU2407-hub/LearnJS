/* ============================================
   BOARD MODULE - Column & Card Rendering
   ============================================ */

const Board = {
  el: null,

  init() {
    this.el = document.getElementById('board');
  },

  render() {
    if (!this.el) return;

    const { columns, taskOrder, tasks, filters, sort: sortConfig, search } = App.state;
    this.el.innerHTML = '';

    const processedTasks = this._getProcessedTaskIds(tasks, taskOrder, filters, sortConfig, search);

    columns.forEach(column => {
      const columnEl = this._createColumn(column, processedTasks[column.id] || [], tasks);
      this.el.appendChild(columnEl);
    });
  },

  _getProcessedTaskIds(tasks, taskOrder, filters, sortConfig, search) {
    const result = {};

    Object.keys(taskOrder).forEach(colId => {
      let taskIds = [...taskOrder[colId]];

      if (search) {
        const lowerSearch = search.toLowerCase();
        taskIds = taskIds.filter(id => {
          const task = tasks[id];
          if (!task) return false;
          return (
            task.title.toLowerCase().includes(lowerSearch) ||
            task.description.toLowerCase().includes(lowerSearch) ||
            task.category.toLowerCase().includes(lowerSearch)
          );
        });
      }

      if (filters.priority !== 'all') {
        taskIds = taskIds.filter(id => {
          const task = tasks[id];
          return task && task.priority === filters.priority;
        });
      }

      if (filters.category !== 'all') {
        taskIds = taskIds.filter(id => {
          const task = tasks[id];
          return task && task.category === filters.category;
        });
      }

      taskIds = this._sortTaskIds(taskIds, tasks, sortConfig);
      result[colId] = taskIds;
    });

    return result;
  },

  _sortTaskIds(taskIds, tasks, sortConfig) {
    return [...taskIds].sort((a, b) => {
      const taskA = tasks[a];
      const taskB = tasks[b];
      if (!taskA || !taskB) return 0;

      let comparison = 0;

      switch (sortConfig.by) {
        case 'dueDate':
          comparison = (taskA.dueDate || '').localeCompare(taskB.dueDate || '');
          break;
        case 'priority': {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          comparison = (priorityOrder[taskA.priority] || 99) - (priorityOrder[taskB.priority] || 99);
          break;
        }
        case 'title':
          comparison = taskA.title.localeCompare(taskB.title);
          break;
        case 'created':
        default:
          comparison = taskA.createdAt - taskB.createdAt;
          break;
      }

      return sortConfig.order === 'desc' ? -comparison : comparison;
    });
  },

  _createColumn(column, taskIds, tasks) {
    const colEl = document.createElement('div');
    colEl.className = 'column';
    colEl.dataset.columnId = column.id;
    colEl.setAttribute('role', 'region');
    colEl.setAttribute('aria-label', column.title + ' column');

    colEl.addEventListener('dragover', Drag.onDragOver);
    colEl.addEventListener('dragleave', Drag.onDragLeave);
    colEl.addEventListener('drop', Drag.onDrop);

    const count = taskIds.length;
    const headerEl = document.createElement('div');
    headerEl.className = 'column__header';
    headerEl.innerHTML = '<div class="column__header-left">' +
      '<div class="column__indicator column__indicator--' + column.id + '"></div>' +
      '<h2 class="column__title">' + this._escapeHtml(column.title) + '</h2>' +
      '<span class="column__count ' + (count > 0 ? 'column__count--highlight' : '') + '" aria-label="' + count + ' task' + (count !== 1 ? 's' : '') + '">' + count + '</span>' +
      '</div>' +
      '<button class="column__add-btn" data-action="add-task" data-column="' + column.id + '" aria-label="Add task to ' + column.title + '" title="Add Task">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>' +
      '</svg></button>';
    colEl.appendChild(headerEl);

    const bodyEl = document.createElement('div');
    bodyEl.className = 'column__body';

    const cardsEl = document.createElement('div');
    cardsEl.className = 'column__cards' + (count === 0 ? ' column__cards--empty' : '');
    cardsEl.dataset.column = column.id;

    if (count === 0) {
      cardsEl.appendChild(this._createEmptyState());
    } else {
      taskIds.forEach(id => {
        const task = tasks[id];
        if (task) {
          cardsEl.appendChild(this._createCard(task));
        }
      });
    }

    bodyEl.appendChild(cardsEl);
    colEl.appendChild(bodyEl);

    return colEl;
  },

  _createCard(task) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.taskId = task.id;
    cardEl.draggable = true;
    cardEl.setAttribute('role', 'article');
    cardEl.setAttribute('aria-label', 'Task: ' + task.title);
    cardEl.setAttribute('tabindex', '0');

    cardEl.addEventListener('dragstart', Drag.onDragStart);
    cardEl.addEventListener('dragend', Drag.onDragEnd);

    cardEl.addEventListener('click', (e) => {
      if (!e.target.closest('.card__drag-handle')) {
        Modal.open(task.id);
      }
    });

    cardEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        Modal.open(task.id);
      }
    });

    const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    let dueDateHtml = '';
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate + 'T23:59:59');
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const diffDays = Math.ceil((dueDate - today) / 86400000);

      let dueClass = '';
      let dueLabel = this._formatDate(task.dueDate);

      if (diffDays < 0) {
        dueClass = 'card__due-date--overdue';
        dueLabel = Math.abs(diffDays) + 'd overdue';
      } else if (diffDays === 0) {
        dueClass = 'card__due-date--today';
        dueLabel = 'Today';
      } else if (diffDays === 1) {
        dueLabel = 'Tomorrow';
      }

      dueDateHtml = '<span class="card__due-date ' + dueClass + '">' +
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>' +
        '<line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line>' +
        '<line x1="3" y1="10" x2="21" y2="10"></line></svg> ' + dueLabel + '</span>';
    }

    let progressHtml = '';
    if (task.checklist && task.checklist.length > 0) {
      const completed = task.checklist.filter(item => item.completed).length;
      const total = task.checklist.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      const fillClass = percentage === 100 ? 'card__progress-fill--complete' : '';

      progressHtml = '<div class="card__progress">' +
        '<div class="card__progress-bar"><div class="card__progress-fill ' + fillClass + '" style="width:' + percentage + '%"></div></div>' +
        '<div class="card__progress-text">' + completed + '/' + total + ' done</div></div>';
    }

    // Build footer stats
    let footerLeftHtml = '';
    if (task.assignedTo) {
      footerLeftHtml += '<div class="card__assignee" title="Assigned to ' + task.assignedTo + '">' + task.assignedTo + '</div>';
    }
    if (task.attachments > 0) {
      footerLeftHtml += '<span class="card__stat">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg> ' + task.attachments + '</span>';
    }
    if (task.comments > 0) {
      footerLeftHtml += '<span class="card__stat">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> ' + task.comments + '</span>';
    }

    cardEl.innerHTML =
      '<div class="card__header">' +
        '<span class="card__priority card__priority--' + task.priority + '">' + priorityLabel + '</span>' +
        '<div class="card__drag-handle" aria-label="Drag to reorder" draggable="false">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="12" x2="16" y2="12"></line><line x1="8" y1="18" x2="16" y2="18"></line>' +
          '</svg>' +
        '</div>' +
      '</div>' +
      '<h3 class="card__title">' + this._escapeHtml(task.title) + '</h3>' +
      (task.description ? '<p class="card__description">' + this._escapeHtml(task.description) + '</p>' : '') +
      '<div class="card__meta">' +
        '<span class="card__category">' + this._escapeHtml(task.category) + '</span>' +
        dueDateHtml +
      '</div>' +
      progressHtml +
      '<div class="card__footer">' +
        '<div class="card__footer-left">' + footerLeftHtml + '</div>' +
        '<div class="card__footer-right">' +
          '<span class="card__date">' + this._formatDateFromTimestamp(task.createdAt) + '</span>' +
        '</div>' +
      '</div>';

    return cardEl;
  },

  _createEmptyState() {
    const el = document.createElement('div');
    el.className = 'empty-state';
    el.innerHTML =
      '<div class="empty-state__icon">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>' +
          '<rect x="9" y="3" width="6" height="4" rx="1"></rect>' +
          '<line x1="12" y1="12" x2="12" y2="18"></line><line x1="9" y1="15" x2="15" y2="15"></line>' +
        '</svg>' +
      '</div>' +
      '<p class="empty-state__text">No tasks yet</p>' +
      '<p class="empty-state__sub">Click + to add one</p>';
    return el;
  },

  _formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  },

  _formatDateFromTimestamp(ts) {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return diffDays + 'd ago';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  },

  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
