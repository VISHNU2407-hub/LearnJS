const UI = {
  toastContainer: null,

  init() {
    this.initToastContainer();
  },

  initToastContainer() {
    if (!this.toastContainer) {
      this.toastContainer = document.getElementById('toast-container');
      if (!this.toastContainer) {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        this.toastContainer.className = 'toast-container';
        document.body.appendChild(this.toastContainer);
      }
    }
  },

  showToast({ title, message, type = 'info', duration = 4000 }) {
    this.initToastContainer();
    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon ${type}">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Close">✕</button>`;
    toast.querySelector('.toast-close').addEventListener('click', () => this.dismissToast(toast));
    this.toastContainer.appendChild(toast);
    if (duration > 0) setTimeout(() => this.dismissToast(toast), duration);
    return toast;
  },

  dismissToast(toast) {
    if (toast.classList.contains('toast-exit')) return;
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 250);
  },

  renderAvatar(user, size = '') {
    const avatarSrc = user.avatar || Users.getAvatar(user.name, user.color || '#2563EB');
    const initials = Users.getInitials(user.name);
    const sizeClass = size ? `avatar-${size}` : '';
    return `<div class="avatar ${sizeClass}"><img src="${avatarSrc}" alt="${user.name}" loading="lazy"></div>`;
  },

  renderStatusDot(status) {
    if (status === 'offline') return '';
    return `<span class="status-dot ${status || 'offline'}"></span>`;
  },

  getStatusText(status) {
    const statusMap = { online: 'Online', away: 'Away', offline: 'Offline' };
    return statusMap[status] || 'Offline';
  },

  getStatusClass(status) {
    return status || 'offline';
  },

  truncate(text, max = 40) {
    if (!text || text.length <= max) return text || '';
    return text.slice(0, max) + '...';
  }
};
