/* ============================================
   MODAL MODULE - Task Details, Create, Edit
   ============================================ */

const Modal = {
  currentTaskId: null,
  _escHandler: null,

  open(taskId, isNew, columnId) {
    this.currentTaskId = taskId;
    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal');

    if (isNew) {
      this._renderNewTaskForm(columnId);
    } else {
      this._renderTaskDetails(taskId);
    }

    overlay.classList.add('modal-overlay--open');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(function() {
      var firstInput = container.querySelector('input, textarea, select, button');
      if (firstInput) firstInput.focus();
    });
  },

  close() {
    var overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('modal-overlay--open');
    document.body.style.overflow = '';
    this.currentTaskId = null;

    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
    }
  },

  _registerEscHandler(handler) {
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
    }
    this._escHandler = handler;
    document.addEventListener('keydown', handler);
  },

  _renderTaskDetails(taskId) {
    var container = document.getElementById('modal');
    var task = App.state.tasks[taskId];
    if (!task) return;

    var column = App.state.columns.find(function(c) { return c.id === task.columnId; });
    var completedChecklist = task.checklist ? task.checklist.filter(function(i) { return i.completed; }).length : 0;
    var totalChecklist = task.checklist ? task.checklist.length : 0;

    var priorityUpper = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    // Priority selector html
    var priorityOptions = ['urgent', 'high', 'medium', 'low'].map(function(p) {
      var selected = task.priority === p ? ' priority-selector__option--selected' : '';
      return '<button class="priority-selector__option priority-selector__option--' + p + selected + '" data-priority="' + p + '">' + p + '</button>';
    }).join('');

    // Category options
    var categoryOptions = CATEGORIES.map(function(cat) {
      var sel = task.category === cat ? ' selected' : '';
      return '<option value="' + cat + '"' + sel + '>' + cat + '</option>';
    }).join('');

    // Status options
    var statusOptions = App.state.columns.map(function(col) {
      var sel = task.columnId === col.id ? ' selected' : '';
      return '<option value="' + col.id + '"' + sel + '>' + col.title + '</option>';
    }).join('');

    // Checklist html
    var checklistHtml = (task.checklist || []).map(function(item, index) {
      var completedClass = item.completed ? ' checklist__item--completed' : '';
      var checkedClass = item.completed ? ' checklist__checkbox--checked' : '';
      var checkMark = item.completed ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '';
      return '<div class="checklist__item' + completedClass + '" data-index="' + index + '">' +
        '<div class="checklist__checkbox' + checkedClass + '" data-action="toggle-checklist" role="checkbox" aria-checked="' + item.completed + '" tabindex="0">' + checkMark + '</div>' +
        '<input class="checklist__text" type="text" value="' + Board._escapeHtml(item.text) + '" placeholder="Add item..." />' +
        '<button class="checklist__remove" data-action="remove-checklist" aria-label="Remove item">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div>';
    }).join('');

    // Activity log html
    var activityHtml = '';
    var logEntries = (task.activityLog || []).slice();
    logEntries.reverse();
    logEntries.slice(0, 10).forEach(function(entry) {
      activityHtml += '<div class="activity-log__item">' +
        '<div class="activity-log__dot"></div>' +
        '<div>' +
        '<div class="activity-log__text">' + Board._escapeHtml(entry.action) + '</div>' +
        '<div class="activity-log__time">' + Board._formatDateFromTimestamp(entry.time) + '</div>' +
        '</div></div>';
    });

    container.innerHTML =
      '<div class="modal__header">' +
        '<div class="modal__header-left">' +
          '<span class="card__priority card__priority--' + task.priority + '">' + priorityUpper + '</span>' +
          '<span style="font-size:13px;color:var(--text-secondary);">in ' + (column ? column.title : 'Unknown') + '</span>' +
        '</div>' +
        '<div class="modal__header-actions">' +
          '<button class="btn btn--ghost btn--sm" data-action="duplicate-task" data-task="' + task.id + '" title="Duplicate task">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>' +
              '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>' +
            '</svg>' +
          '</button>' +
          '<button class="modal__close-btn" data-action="close-modal" aria-label="Close">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>' +
            '</svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="modal__body">' +

        '<div class="modal__section">' +
          '<input class="modal__title" id="modal-title" value="' + Board._escapeHtml(task.title) + '" placeholder="Task title" />' +
        '</div>' +

        '<div class="modal__section">' +
          '<div class="form-group">' +
            '<label class="form-group__label" for="modal-description">Description</label>' +
            '<textarea class="form-group__textarea" id="modal-description" placeholder="Add a description...">' + Board._escapeHtml(task.description || '') + '</textarea>' +
          '</div>' +
        '</div>' +

        '<div class="modal__section">' +
          '<div class="form-row">' +
            '<div class="form-group">' +
              '<label class="form-group__label">Priority</label>' +
              '<div class="priority-selector">' + priorityOptions + '</div>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-group__label" for="modal-category">Category</label>' +
              '<select class="form-group__select" id="modal-category">' + categoryOptions + '</select>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="modal__section">' +
          '<div class="form-row">' +
            '<div class="form-group">' +
              '<label class="form-group__label" for="modal-due-date">Due Date</label>' +
              '<input class="form-group__input" type="date" id="modal-due-date" value="' + (task.dueDate || '') + '" />' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-group__label" for="modal-status">Status</label>' +
              '<select class="form-group__select" id="modal-status">' + statusOptions + '</select>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="modal__section">' +
          '<div class="form-group">' +
            '<label class="form-group__label" for="modal-assignee">Assigned To</label>' +
            '<input class="form-group__input" type="text" id="modal-assignee" placeholder="e.g. JD" value="' + Board._escapeHtml(task.assignedTo || '') + '" maxlength="3" />' +
          '</div>' +
        '</div>' +

        '<div class="modal__section">' +
          '<h4 class="modal__section-title">Checklist (' + completedChecklist + '/' + totalChecklist + ')</h4>' +
          '<div class="checklist" id="modal-checklist">' + checklistHtml +
            '<button class="checklist__add" data-action="add-checklist-item">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>' +
              '</svg> Add item' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<div class="modal__section">' +
          '<h4 class="modal__section-title">Notes</h4>' +
          '<textarea class="form-group__textarea" id="modal-notes" placeholder="Add notes..." style="min-height:60px;">' + Board._escapeHtml(task.notes || '') + '</textarea>' +
        '</div>' +

        '<div class="modal__section">' +
          '<h4 class="modal__section-title">Activity</h4>' +
          '<div class="activity-log">' + activityHtml + '</div>' +
        '</div>' +

      '</div>' +
      '<div class="modal__footer">' +
        '<div class="modal__footer-left">' +
          '<button class="btn btn--danger btn--sm" data-action="delete-task" data-task="' + task.id + '">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<polyline points="3 6 5 6 21 6"></polyline>' +
              '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>' +
            '</svg> Delete' +
          '</button>' +
        '</div>' +
        '<div class="modal__footer-right">' +
          '<button class="btn btn--secondary btn--sm" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn--primary btn--sm" data-action="save-task" data-task="' + task.id + '">Save Changes</button>' +
        '</div>' +
      '</div>';

    this._bindEvents(taskId);
  },

  _renderNewTaskForm(columnId) {
    var container = document.getElementById('modal');
    var today = new Date().toISOString().split('T')[0];

    var categoryOptions = CATEGORIES.map(function(cat) {
      return '<option value="' + cat + '">' + cat + '</option>';
    }).join('');

    container.innerHTML =
      '<div class="modal__header">' +
        '<div class="modal__header-left">' +
          '<h2 style="font-family:var(--font-heading);font-size:18px;font-weight:600;">Create Task</h2>' +
        '</div>' +
        '<div class="modal__header-actions">' +
          '<button class="modal__close-btn" data-action="close-modal" aria-label="Close">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>' +
            '</svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="modal__body">' +

        '<div class="modal__section">' +
          '<div class="form-group">' +
            '<label class="form-group__label" for="new-task-title">Title *</label>' +
            '<input class="form-group__input" id="new-task-title" placeholder="Enter task title" autofocus />' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-group__label" for="new-task-description">Description</label>' +
            '<textarea class="form-group__textarea" id="new-task-description" placeholder="Add a description..." style="min-height:60px;"></textarea>' +
          '</div>' +
        '</div>' +

        '<div class="modal__section">' +
          '<div class="form-row">' +
            '<div class="form-group">' +
              '<label class="form-group__label">Priority</label>' +
              '<div class="priority-selector">' +
                '<button class="priority-selector__option priority-selector__option--urgent" data-priority="urgent">Urgent</button>' +
                '<button class="priority-selector__option priority-selector__option--high" data-priority="high">High</button>' +
                '<button class="priority-selector__option priority-selector__option--medium priority-selector__option--selected" data-priority="medium">Medium</button>' +
                '<button class="priority-selector__option priority-selector__option--low" data-priority="low">Low</button>' +
              '</div>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-group__label" for="new-task-category">Category</label>' +
              '<select class="form-group__select" id="new-task-category">' + categoryOptions + '</select>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="modal__section">' +
          '<div class="form-row">' +
            '<div class="form-group">' +
              '<label class="form-group__label" for="new-task-due-date">Due Date</label>' +
              '<input class="form-group__input" type="date" id="new-task-due-date" value="' + today + '" />' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-group__label" for="new-task-assignee">Assigned To</label>' +
              '<input class="form-group__input" type="text" id="new-task-assignee" placeholder="e.g. JD" maxlength="3" />' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="modal__section">' +
          '<div class="form-group">' +
            '<label class="form-group__label" for="new-task-notes">Notes</label>' +
            '<textarea class="form-group__textarea" id="new-task-notes" placeholder="Add notes..." style="min-height:60px;"></textarea>' +
          '</div>' +
        '</div>' +

      '</div>' +
      '<div class="modal__footer">' +
        '<div class="modal__footer-left">' +
          '<button class="btn btn--secondary btn--sm" data-action="close-modal">Cancel</button>' +
        '</div>' +
        '<div class="modal__footer-right">' +
          '<button class="btn btn--primary btn--sm" data-action="create-task" data-column="' + columnId + '">Create Task</button>' +
        '</div>' +
      '</div>';

    this._bindNewTaskEvents(columnId);
  },

  _bindEvents(taskId) {
    var container = document.getElementById('modal');
    var self = this;

    container.querySelectorAll('[data-action="close-modal"]').forEach(function(el) {
      el.addEventListener('click', function() { self.close(); });
    });

    var overlay = document.getElementById('modal-overlay');
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) self.close();
    });

    self._registerEscHandler(function() { self.close(); });

    var saveBtn = container.querySelector('[data-action="save-task"]');
    if (saveBtn) {
      saveBtn.addEventListener('click', function() { self._saveTask(taskId); });
    }

    var deleteBtn = container.querySelector('[data-action="delete-task"]');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function() {
        UI.confirm('Delete Task', 'Are you sure you want to delete this task? This action cannot be undone.').then(function(confirmed) {
          if (confirmed) {
            App.deleteTask(taskId);
            self.close();
          }
        });
      });
    }

    var dupBtn = container.querySelector('[data-action="duplicate-task"]');
    if (dupBtn) {
      dupBtn.addEventListener('click', function() {
        App.duplicateTask(taskId);
        self.close();
      });
    }

    container.querySelectorAll('.priority-selector__option').forEach(function(el) {
      el.addEventListener('click', function() {
        container.querySelectorAll('.priority-selector__option').forEach(function(opt) {
          opt.classList.remove('priority-selector__option--selected');
        });
        el.classList.add('priority-selector__option--selected');
      });
    });

    container.querySelectorAll('[data-action="toggle-checklist"]').forEach(function(el) {
      el.addEventListener('click', function() {
        var item = el.closest('.checklist__item');
        var isChecked = item.classList.toggle('checklist__item--completed');
        el.classList.toggle('checklist__checkbox--checked');
        el.setAttribute('aria-checked', isChecked);
        el.innerHTML = isChecked
          ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
          : '';
      });
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });

    container.querySelectorAll('[data-action="remove-checklist"]').forEach(function(el) {
      el.addEventListener('click', function() {
        el.closest('.checklist__item').remove();
      });
    });

    var addChecklistBtn = container.querySelector('[data-action="add-checklist-item"]');
    if (addChecklistBtn) {
      addChecklistBtn.addEventListener('click', function() { self._addChecklistItem(); });
    }
  },

  _addChecklistItem() {
    var checklist = document.getElementById('modal-checklist');
    if (!checklist) return;

    var newItem = document.createElement('div');
    newItem.className = 'checklist__item';
    newItem.innerHTML =
      '<div class="checklist__checkbox" data-action="toggle-checklist" role="checkbox" aria-checked="false" tabindex="0"></div>' +
      '<input class="checklist__text" type="text" value="" placeholder="New item..." />' +
      '<button class="checklist__remove" data-action="remove-checklist" aria-label="Remove item">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>' +
        '</svg>' +
      '</button>';

    var checkbox = newItem.querySelector('[data-action="toggle-checklist"]');
    checkbox.addEventListener('click', function() {
      var item = checkbox.closest('.checklist__item');
      var isChecked = item.classList.toggle('checklist__item--completed');
      checkbox.classList.toggle('checklist__checkbox--checked');
      checkbox.setAttribute('aria-checked', isChecked);
      checkbox.innerHTML = isChecked
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : '';
    });

    var removeBtn = newItem.querySelector('[data-action="remove-checklist"]');
    removeBtn.addEventListener('click', function() { newItem.remove(); });

    var addBtn = checklist.querySelector('[data-action="add-checklist-item"]');
    if (addBtn) {
      checklist.insertBefore(newItem, addBtn);
    } else {
      checklist.appendChild(newItem);
    }

    newItem.querySelector('.checklist__text').focus();
  },

  _bindNewTaskEvents(columnId) {
    var container = document.getElementById('modal');
    var self = this;

    container.querySelectorAll('[data-action="close-modal"]').forEach(function(el) {
      el.addEventListener('click', function() { self.close(); });
    });

    var overlay = document.getElementById('modal-overlay');
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) self.close();
    });

    self._registerEscHandler(function() { self.close(); });

    container.querySelectorAll('.priority-selector__option').forEach(function(el) {
      el.addEventListener('click', function() {
        container.querySelectorAll('.priority-selector__option').forEach(function(opt) {
          opt.classList.remove('priority-selector__option--selected');
        });
        el.classList.add('priority-selector__option--selected');
      });
    });

    var createBtn = container.querySelector('[data-action="create-task"]');
    if (createBtn) {
      createBtn.addEventListener('click', function() { self._createTask(columnId); });
    }

    var titleInput = container.querySelector('#new-task-title');
    if (titleInput) {
      titleInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          self._createTask(columnId);
        }
      });
    }
  },

  _saveTask(taskId) {
    var container = document.getElementById('modal');
    var task = App.state.tasks[taskId];
    if (!task) return;

    var titleEl = container.querySelector('#modal-title');
    if (!titleEl) return;
    var title = titleEl.value.trim();
    if (!title) {
      UI.showToast('Task title is required', 'error');
      return;
    }

    var selectedPriority = container.querySelector('.priority-selector__option--selected');
    var priority = selectedPriority ? selectedPriority.dataset.priority : task.priority;

    var checklistItems = [];
    container.querySelectorAll('.checklist__item').forEach(function(item) {
      var textInput = item.querySelector('.checklist__text');
      var checkbox = item.querySelector('.checklist__checkbox');
      if (textInput && textInput.value.trim()) {
        checklistItems.push({
          text: textInput.value.trim(),
          completed: checkbox.classList.contains('checklist__checkbox--checked')
        });
      }
    });

    var descEl = container.querySelector('#modal-description');
    var catEl = container.querySelector('#modal-category');
    var dateEl = container.querySelector('#modal-due-date');
    var statusEl = container.querySelector('#modal-status');
    var assigneeEl = container.querySelector('#modal-assignee');
    var notesEl = container.querySelector('#modal-notes');

    var updatedTask = Object.assign({}, task);
    updatedTask.title = title;
    updatedTask.description = descEl ? descEl.value.trim() : task.description;
    updatedTask.priority = priority;
    updatedTask.category = catEl ? catEl.value : task.category;
    updatedTask.dueDate = dateEl ? dateEl.value : task.dueDate;
    updatedTask.columnId = statusEl ? statusEl.value : task.columnId;
    updatedTask.assignedTo = assigneeEl ? assigneeEl.value.trim().toUpperCase() : task.assignedTo;
    updatedTask.checklist = checklistItems;
    updatedTask.notes = notesEl ? notesEl.value.trim() : task.notes;

    if (!updatedTask.activityLog) updatedTask.activityLog = [];
    updatedTask.activityLog.push({ action: 'Task updated', time: Date.now() });

    App.updateTask(taskId, updatedTask);

    if (updatedTask.columnId !== task.columnId) {
      App.moveTask(taskId, updatedTask.columnId, true);
    }

    this.close();
    UI.showToast('Task saved successfully', 'success');
  },

  _createTask(columnId) {
    var container = document.getElementById('modal');

    var titleEl = container.querySelector('#new-task-title');
    if (!titleEl) return;
    var title = titleEl.value.trim();
    if (!title) {
      UI.showToast('Please enter a task title', 'error');
      return;
    }

    var selectedPriority = container.querySelector('.priority-selector__option--selected');
    var priority = selectedPriority ? selectedPriority.dataset.priority : 'medium';

    var descEl = container.querySelector('#new-task-description');
    var catEl = container.querySelector('#new-task-category');
    var dateEl = container.querySelector('#new-task-due-date');
    var assigneeEl = container.querySelector('#new-task-assignee');
    var notesEl = container.querySelector('#new-task-notes');

    App.createTask({
      title: title,
      description: descEl ? descEl.value.trim() : '',
      priority: priority,
      category: catEl ? catEl.value : 'Development',
      dueDate: dateEl ? dateEl.value : '',
      assignedTo: assigneeEl ? assigneeEl.value.trim().toUpperCase() : '',
      notes: notesEl ? notesEl.value.trim() : '',
      columnId: columnId
    });

    this.close();
    UI.showToast('Task created successfully', 'success');
  }
};
