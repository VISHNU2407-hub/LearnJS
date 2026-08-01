/* ============================================
   DRAG MODULE - Native HTML5 Drag & Drop
   ============================================ */

const Drag = {
  /** @type {string|null} */
  draggedTaskId: null,

  /** @type {HTMLElement|null} */
  draggedElement: null,

  /** @type {string|null} */
  sourceColumnId: null,

  /** @type {HTMLElement|null} */
  dragPreview: null,

  /**
   * Handle drag start
   */
  onDragStart(e) {
    const card = e.target.closest('.card');
    if (!card) return;

    this.draggedTaskId = card.dataset.taskId;
    this.draggedElement = card;
    this.sourceColumnId = card.closest('.column').dataset.columnId;

    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.draggedTaskId);

    // Add dragging class after a frame for the drag image
    requestAnimationFrame(() => {
      card.classList.add('card--dragging');
    });

    // Store the source column for visual feedback
    document.querySelectorAll('.column').forEach(col => {
      col.dataset.dragFrom = col.dataset.columnId === this.sourceColumnId ? 'true' : 'false';
    });
  },

  /**
   * Handle drag over a column
   */
  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const column = e.target.closest('.column');
    if (!column) return;

    column.classList.add('column--drag-over');
  },

  /**
   * Handle drag leave from a column
   */
  onDragLeave(e) {
    const column = e.target.closest('.column');
    if (!column) return;

    // Only remove if we're actually leaving the column, not entering a child
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && column.contains(relatedTarget)) return;

    column.classList.remove('column--drag-over');
  },

  /**
   * Handle drop on a column
   */
  onDrop(e) {
    e.preventDefault();

    const column = e.target.closest('.column');
    if (!column) return;

    column.classList.remove('column--drag-over');

    const targetColumnId = column.dataset.columnId;
    const taskId = e.dataTransfer.getData('text/plain');

    if (!taskId || !this.draggedTaskId || taskId !== this.draggedTaskId) return;
    if (this.sourceColumnId === targetColumnId) return;

    // Move the task
    App.moveTask(this.draggedTaskId, targetColumnId);
  },

  /**
   * Handle drag end
   */
  onDragEnd(e) {
    const card = e.target.closest('.card');
    if (card) {
      card.classList.remove('card--dragging');
    }

    // Remove visual feedback from all columns
    document.querySelectorAll('.column').forEach(col => {
      col.classList.remove('column--drag-over');
      delete col.dataset.dragFrom;
    });

    this.draggedTaskId = null;
    this.draggedElement = null;
    this.sourceColumnId = null;
  }
};
