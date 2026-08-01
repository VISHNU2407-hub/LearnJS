/* ============================================
   APP MODULE - Main Entry & State Management
   ============================================ */

const App = {
  /** @type {Object} */
  state: {},

  /**
   * Initialize the application
   */
  init() {
    // Load state from localStorage or get defaults
    const savedState = Storage.load();
    if (savedState) {
      this.state = savedState;
    } else {
      this.state = Storage.createSampleData();
      Storage.save(this.state);
    }

    // Initialize modules
    Board.init();
    UI.init();
    Search.init();
    Filter.init();
    Sort.init();

    // Render board
    Board.render();

    // Set board title
    this._initBoardTitle();

    // Update task count display
    this._updateTaskCounts();
  },

  /**
   * Update a portion of the state and re-render
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    Storage.save(this.state);
    Board.render();
  },

  /**
   * Create a new task
   */
  createTask(data) {
    const taskId = Storage.generateId();
    const now = Date.now();

    const task = {
      id: taskId,
      columnId: data.columnId,
      title: data.title,
      description: data.description || '',
      priority: data.priority || 'medium',
      category: data.category || 'Development',
      dueDate: data.dueDate || '',
      assignedTo: data.assignedTo || '',
      checklist: [],
      notes: data.notes || '',
      attachments: 0,
      comments: 0,
      createdAt: now,
      activityLog: [
        { action: 'Task created', time: now }
      ]
    };

    // Add to state
    this.state.tasks[taskId] = task;
    this.state.taskOrder[data.columnId] = [
      ...this.state.taskOrder[data.columnId],
      taskId
    ];

    Storage.save(this.state);
    Board.render();
  },

  /**
   * Update an existing task
   */
  updateTask(taskId, updatedTask) {
    this.state.tasks[taskId] = updatedTask;
    Storage.save(this.state);
    Board.render();
  },

  /**
   * Delete a task
   */
  deleteTask(taskId) {
    const task = this.state.tasks[taskId];
    if (!task) return;

    // Remove from task order
    const columnId = task.columnId;
    this.state.taskOrder[columnId] = this.state.taskOrder[columnId].filter(id => id !== taskId);

    // Remove from tasks
    delete this.state.tasks[taskId];

    Storage.save(this.state);
    Board.render();
  },

  /**
   * Duplicate a task
   */
  duplicateTask(taskId) {
    const original = this.state.tasks[taskId];
    if (!original) return;

    const newId = Storage.generateId();
    const now = Date.now();

    const duplicate = {
      ...original,
      id: newId,
      title: original.title + ' (Copy)',
      createdAt: now,
      checklist: original.checklist.map(item => ({ ...item })),
      activityLog: [
        { action: 'Duplicated from: ' + original.title, time: now },
        { action: 'Task created', time: now }
      ],
      attachments: 0,
      comments: 0
    };

    this.state.tasks[newId] = duplicate;
    this.state.taskOrder[original.columnId] = [
      ...this.state.taskOrder[original.columnId],
      newId
    ];

    Storage.save(this.state);
    Board.render();
    UI.showToast('Task duplicated', 'success');
  },

  /**
   * Move a task to a different column
   */
  moveTask(taskId, targetColumnId, silent = false) {
    const task = this.state.tasks[taskId];
    if (!task) return;

    const sourceColumnId = task.columnId;
    if (sourceColumnId === targetColumnId) return;

    // Remove from source column
    this.state.taskOrder[sourceColumnId] = this.state.taskOrder[sourceColumnId].filter(id => id !== taskId);

    // Add to target column
    this.state.taskOrder[targetColumnId] = [
      ...this.state.taskOrder[targetColumnId],
      taskId
    ];

    // Update task's columnId
    task.columnId = targetColumnId;

    // Add activity log entry
    if (!silent) {
      const sourceCol = this.state.columns.find(c => c.id === sourceColumnId);
      const targetCol = this.state.columns.find(c => c.id === targetColumnId);
      if (sourceCol && targetCol) {
        if (!task.activityLog) task.activityLog = [];
        task.activityLog.push({
          action: `Moved from "${sourceCol.title}" to "${targetCol.title}"`,
          time: Date.now()
        });
      }
    }

    Storage.save(this.state);
    Board.render();

    if (!silent) {
      UI.showToast('Task moved', 'success');
    }
  },

  /**
   * Initialize board title editing
   */
  _initBoardTitle() {
    const titleEl = document.getElementById('board-title-input');
    if (!titleEl) return;

    titleEl.value = this.state.boardTitle;

    titleEl.addEventListener('blur', () => {
      const newTitle = titleEl.value.trim() || 'Board';
      titleEl.value = newTitle;
      this.state.boardTitle = newTitle;
      Storage.save(this.state);
    });

    titleEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        titleEl.blur();
      }
    });
  },

  /**
   * Update task count displays
   */
  _updateTaskCounts() {
    // This is handled in Board render now
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
