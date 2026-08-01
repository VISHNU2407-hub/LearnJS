/* ==============================================
   STORAGE.JS — LocalStorage Management
   ============================================== */

const Storage = {
  /* Get item from localStorage */
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  /* Set item in localStorage */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Storage write failed:', e);
      return false;
    }
  },

  /* Remove item from localStorage */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  /* Clear all app data */
  clear() {
    try {
      localStorage.removeItem('chat_messages');
      localStorage.removeItem('chat_current_user');
      localStorage.removeItem('chat_conversations');
      return true;
    } catch {
      return false;
    }
  }
};
