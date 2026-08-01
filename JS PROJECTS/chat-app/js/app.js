const App = {
  currentPage: 'dashboard',
  activeFilter: 'all',
  replyTo: null,
  _searchQuery: '',

  init() {
    UI.init();
    Chat.init();
    this.restoreDarkMode();
    this.showLogin();
    this.bindGlobalEvents();
  },

  showLogin() {
    this.currentPage = 'login';
    ['page-login','page-dashboard','page-settings','page-404'].forEach(id => {
      document.getElementById(id).classList.toggle('active', id === 'page-login');
    });
    this.renderLoginGrid();
  },

  renderLoginGrid() {
    const grid = document.getElementById('login-users-grid');
    if (!grid) return;
    const users = Users.sampleUsers;
    grid.innerHTML = users.map(user => {
      return '<div class="login-user-card" data-id="' + user.id + '">'
        + '<div class="login-user-avatar">' + UI.renderAvatar(user, 'lg') + UI.renderStatusDot(user.status) + '</div>'
        + '<div class="login-user-name">' + user.name + '</div>'
        + '<div class="login-user-role">' + user.bio.split('.')[0] + '</div>'
        + '<div class="login-user-status" data-status="' + user.status + '">' + UI.getStatusText(user.status) + '</div>'
        + '</div>';
    }).join('');
    grid.querySelectorAll('.login-user-card').forEach(card => {
      card.addEventListener('click', () => {
        const userId = parseInt(card.dataset.id);
        this.loginAsUser(userId);
      });
    });
  },

  loginAsUser(userId) {
    Users.login(userId);
    UI.showToast({ title: 'Welcome, ' + Users.currentUser.name + '!', message: 'You are now signed in.', type: 'success', duration: 3000 });
    this.showDashboard();
  },

  showDashboard() {
    this.currentPage = 'dashboard';
    ['page-login','page-dashboard','page-settings','page-404'].forEach(id => {
      document.getElementById(id).classList.toggle('active', id === 'page-dashboard');
    });
    this.initDashboard();
  },

  showSettings() {
    this.currentPage = 'settings';
    ['page-login','page-dashboard','page-settings','page-404'].forEach(id => {
      document.getElementById(id).classList.toggle('active', id === 'page-settings');
    });
    this.renderSettings();
  },

  show404() {
    this.currentPage = '404';
    ['page-login','page-dashboard','page-settings','page-404'].forEach(id => {
      document.getElementById(id).classList.toggle('active', id === 'page-404');
    });
  },

  initDashboard() {
    const user = Users.currentUser;
    if (!user) return;
    document.getElementById('sidebar-user-name').textContent = user.name;
    document.getElementById('sidebar-user-status').textContent = UI.getStatusText(user.status);
    document.getElementById('sidebar-user-avatar').innerHTML = UI.renderAvatar(user, 'sm');
    // Add logout button if it doesn't exist
    let logoutBtn = document.querySelector('.sidebar-logout-btn');
    if (!logoutBtn) {
      const sidebarFooter = document.querySelector('.app-sidebar > div:last-child');
      if (sidebarFooter) {
        logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn-icon sidebar-logout-btn';
        logoutBtn.title = 'Switch User';
        logoutBtn.textContent = '🚪';
        logoutBtn.addEventListener('click', () => {
          Users.currentUser = null;
          Chat.activeChat = null;
          this.replyTo = null;
          this.showLogin();
        });
        sidebarFooter.appendChild(logoutBtn);
      }
    }
    this.renderConversations();
    // Auto-select the first contact so the chat input bar appears immediately
    const contacts = Users.getContacts();
    if (contacts.length > 0 && !Chat.activeChat) {
      Chat.setActiveChat(contacts[0].id);
      this.renderChatWindow(contacts[0].id);
    } else if (Chat.activeChat) {
      this.renderChatWindow(Chat.activeChat);
    } else {
      this.showEmptyChat();
    }
    ChatEvents.on('conversationUpdated', () => { this.renderConversations(); this.updateUnreadBadge(); });
    ChatEvents.on('messageReceived', (userId) => { this.renderChatWindow(userId); this.renderConversations(); });
    ChatEvents.on('typingStart', (userId) => { this.showTypingIndicator(userId); });
    ChatEvents.on('typingStop', (userId) => { this.hideTypingIndicator(userId); });
    document.addEventListener('click', (e) => { if (!e.target.closest('.context-menu') && !e.target.closest('.context-menu-backdrop')) this.closeContextMenu(); });
  },

  renderConversations() {
    const container = document.getElementById('conversations-list');
    if (!container) return;
    // Show all contacts even with no messages
    let userIds = Users.getContacts().map(u => u.id.toString());
    // Sort: conversations with messages first (by latest message), then by name
    userIds.sort((a, b) => {
      const lastA = Chat.getLastMessage(parseInt(a));
      const lastB = Chat.getLastMessage(parseInt(b));
      if (lastA && lastB) return lastB.timestamp - lastA.timestamp;
      if (lastA) return -1;
      if (lastB) return 1;
      const userA = Users.getById(parseInt(a));
      const userB = Users.getById(parseInt(b));
      return (userA?.name || '').localeCompare(userB?.name || '');
    });
    if (this.activeFilter === 'pinned') {
      userIds = userIds.filter(id => [2, 5].includes(parseInt(id)));
    } else if (this.activeFilter === 'unread') {
      userIds = userIds.filter(id => Chat.getUnreadCount(id) > 0);
    }
    // Apply search filter
    userIds = this.searchConversations(userIds);
    if (userIds.length === 0) {
      container.innerHTML = '<div class="empty-conversations">No conversations found</div>';
      return;
    }
    container.innerHTML = userIds.map(userId => {
      const user = Users.getById(parseInt(userId));
      if (!user) return '';
      const lastMsg = Chat.getLastMessage(parseInt(userId));
      const unread = Chat.getUnreadCount(userId);
      const isActive = Chat.activeChat === parseInt(userId);
      const isPinned = [2, 5].includes(parseInt(userId));
      let preview = '';
      if (lastMsg) {
        if (lastMsg.deleted) preview = 'This message was deleted';
        else if (lastMsg.type === 'image') preview = 'Photo';
        else if (lastMsg.type === 'file') preview = lastMsg.fileName || 'File';
        else if (lastMsg.isForwarded) preview = lastMsg.text;
        else preview = lastMsg.text || '';
        if (preview.length > 50) preview = preview.substring(0, 50) + '...';
      } else {
        preview = 'Start chatting with ' + user.name.split(' ')[0];
      }
      let statusIcons = '';
      if (lastMsg && lastMsg.senderId === Users.currentUser?.id) {
        if (lastMsg.read) statusIcons = '<span class="status-icons"><span class="read">vv</span></span> ';
        else statusIcons = '<span class="status-icons"><span class="delivered">v</span></span> ';
      }
      return '<div class="conversation-item' + (isActive ? ' active' : '') + '" data-id="' + userId + '">'
        + '<div style="position:relative">' + UI.renderAvatar(user) + UI.renderStatusDot(user.status) + '</div>'
        + '<div class="conversation-info">'
        + '<div class="conversation-name">' + user.name + (isPinned ? '<span class="pinned-icon">P</span>' : '') + '</div>'
        + '<div class="conversation-preview">' + statusIcons + preview + '</div>'
        + '</div>'
        + '<div class="conversation-meta">'
        + (lastMsg ? '<span class="conversation-time">' + Chat.formatTime(lastMsg.timestamp) + '</span>' : '<span class="conversation-time" style="opacity:0.4">New</span>')
        + (unread > 0 ? '<span class="conversation-unread"><span class="badge badge-accent">' + unread + '</span></span>' : '')
        + '</div></div>';
    }).join('');
    container.querySelectorAll('.conversation-item').forEach(el => {
      el.addEventListener('click', () => {
        const userId = parseInt(el.dataset.id);
        Chat.setActiveChat(userId);
        this.renderConversations();
        this.renderChatWindow(userId);
        this.closeMobileSidebar();
      });
    });
    this.updateUnreadBadge();
  },
  showEmptyChat() {
    const container = document.getElementById('chat-area');
    if (!container) return;
    container.innerHTML = '<div class="empty-chat"><div class="empty-chat-icon">💬</div><div class="empty-chat-title">Welcome to Convo</div><div class="empty-chat-text">Select a conversation from the sidebar to start chatting.</div></div>';
    document.getElementById('profile-panel').classList.remove('open');
  },

  renderChatWindow(userId) {
    const container = document.getElementById('chat-area');
    if (!container) return;
    const user = Users.getById(userId);
    if (!user) return;
    const messages = Chat.getMessages(userId);
    const headerHtml = '<div class="chat-header"><div class="chat-header-left" id="open-profile-btn">'
      + '<button class="btn-icon mobile-menu-btn" id="sidebar-toggle-btn">☰</button>'
      + '<div style="position:relative">' + UI.renderAvatar(user, 'sm') + UI.renderStatusDot(user.status) + '</div>'
      + '<div class="chat-user-info"><div class="chat-user-name">' + user.name + '</div>'
      + '<div class="chat-user-status">' + UI.getStatusText(user.status) + '</div></div></div>'
      + '<div class="chat-header-actions"></div></div>';
    const messagesHtml = this.renderMessages(messages, userId);
    const inputHtml = '<div class="message-input-area"><div class="message-input-wrapper">'
      + '<div class="message-input-actions"><button class="btn-icon" id="emoji-btn">😊</button><button class="btn-icon" id="attach-btn">📎</button></div>'
      + '<textarea id="message-input" rows="1" placeholder="Type a message..."></textarea>'
      + '<button class="btn-icon" id="send-btn">📤</button></div></div>';
    container.innerHTML = headerHtml + '<div class="message-area" id="message-area">' + messagesHtml + '</div>' + inputHtml;
    this.bindChatEvents(userId);
    this.bindMessageEvents(userId);
    this.closeProfilePanel();
    setTimeout(() => {
      const msgArea = document.getElementById('message-area');
      if (msgArea) msgArea.scrollTop = msgArea.scrollHeight;
    }, 50);
  },

  renderMessages(messages, userId) {
    if (!messages || messages.length === 0) {
      return '<div style="text-align:center;padding:40px;color:var(--text-tertiary);font-size:0.875rem">No messages yet. Say hello! 👋</div>';
    }
    const currentUserId = Users.currentUser ? Users.currentUser.id : 1;
    let lastDate = '';
    return messages.map((msg, idx) => {
      const msgDate = Chat.formatDate(msg.timestamp);
      const showDate = msgDate !== lastDate;
      lastDate = msgDate;
      const isOutgoing = msg.senderId === currentUserId;
      const prevMsg = idx > 0 ? messages[idx - 1] : null;
      const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;
      const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId || Chat.formatDate(prevMsg.timestamp) !== Chat.formatDate(msg.timestamp);
      const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId || Chat.formatDate(nextMsg.timestamp) !== Chat.formatDate(msg.timestamp);
      const isOnlyInGroup = isFirstInGroup && isLastInGroup;
      let bubbleClass = 'message-bubble';
      if (isFirstInGroup && !isOnlyInGroup) bubbleClass += ' first-in-group';
      if (isLastInGroup && !isOnlyInGroup) bubbleClass += ' last-in-group';
      if (isOnlyInGroup) bubbleClass += ' only-in-group';
      let content = '';
      if (msg.deleted) {
        content = '<div class="message-deleted">This message was deleted</div>';
      } else {
        if (msg.isForwarded) content += '<div class="message-forwarded">↪ Forwarded</div>';
        if (msg.replyTo) content += '<div class="message-reply"><div class="reply-name">' + msg.replyTo.name + '</div><div class="reply-text">' + (msg.replyTo.text || '') + '</div></div>';
        if (msg.type === 'image') content += '<div class="message-image"><img src="' + msg.imageUrl + '" alt="Shared image" loading="lazy"></div>';
        else if (msg.type === 'file') content += '<div class="message-file"><span class="message-file-icon">📎</span><div class="message-file-info"><div class="message-file-name">' + (msg.fileName || 'File') + '</div><div class="message-file-size">' + (msg.fileSize || '') + '</div></div></div>';
        content += '<div class="message-text">' + msg.text + '</div>';
        const reactions = Chat.getReactions(msg.id);
        if (Object.keys(reactions).length > 0) {
          content += '<div class="message-reactions">';
          for (const [emoji, users] of Object.entries(reactions)) {
            const active = users.includes(currentUserId);
            content += '<span class="reaction-chip' + (active ? ' active' : '') + '" data-msg-id="' + msg.id + '" data-emoji="' + emoji + '">'
              + '<span class="reaction-emoji">' + emoji + '</span>'
              + '<span class="reaction-count">' + users.length + '</span></span>';
          }
          content += '</div>';
        }
      }
      const sender = Users.getById(msg.senderId);
      const timeStr = Chat.formatTime(msg.timestamp);
      let statusHtml = '';
      if (isOutgoing && !msg.deleted) {
        if (msg.read) statusHtml = '<span class="message-status seen">✓✓</span>';
        else statusHtml = '<span class="message-status delivered">✓</span>';
      }
      let dateHtml = '';
      if (showDate) {
        dateHtml = '<div class="date-separator"><span>' + msgDate + '</span></div>';
      }
      const avatarHtml = isFirstInGroup && !isOutgoing
        ? '<div class="message-avatar"><img src="' + Users.getAvatar(sender.name, sender.color) + '" alt="' + sender.name + '"></div>'
        : '';
      let actionsHtml = '';
      if (!msg.deleted) {
        actionsHtml = '<div class="message-actions">'
          + '<button class="action-btn" data-action="reply" data-msg-id="' + msg.id + '" title="Reply">↩</button>'
          + '<button class="action-btn" data-action="react" data-msg-id="' + msg.id + '" title="React">😊</button>'
          + '<button class="action-btn" data-action="more" data-msg-id="' + msg.id + '" title="More">⋯</button></div>';
      }
      return dateHtml + '<div class="message-wrapper ' + (isOutgoing ? 'outgoing' : 'incoming') + ' ' + (isFirstInGroup ? 'first-in-group' : '') + ' ' + (isLastInGroup ? 'last-in-group' : '') + ' ' + (isOnlyInGroup ? 'only-in-group' : '') + '" data-msg-id="' + msg.id + '">'
        + (!isOutgoing ? avatarHtml : '') + '<div class="' + bubbleClass + '">' + content + actionsHtml
        + '<div class="message-footer"><span class="message-time">' + timeStr + '</span>' + statusHtml + '</div></div></div>';
    }).join('');
  },

  bindMessageEvents(userId) {
    const area = document.getElementById('message-area');
    if (!area) return;
    const currentUserId = Users.currentUser ? Users.currentUser.id : 1;
    // Action buttons (hover actions)
    area.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const msgId = btn.dataset.msgId;
        const action = btn.dataset.action;
        const messages = Chat.getMessages(userId);
        const msg = messages.find(m => m.id === msgId);
        if (!msg) return;
        if (action === 'reply') this.startReply(msg, userId);
        else if (action === 'react') this.toggleReactionPicker(msg, userId, btn);
        else if (action === 'more') this.openContextMenu(e, msg, userId);
      });
    });
    // Reaction chip clicks
    area.querySelectorAll('.reaction-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const msgId = chip.dataset.msgId;
        const emoji = chip.dataset.emoji;
        Chat.toggleReaction(msgId, emoji, currentUserId);
        this.renderChatWindow(userId);
      });
    });
    // Right-click context menu
    area.querySelectorAll('.message-bubble').forEach(el => {
      el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const wrapper = el.closest('.message-wrapper');
        const msgId = wrapper ? wrapper.dataset.msgId : null;
        if (!msgId) return;
        const messages = Chat.getMessages(userId);
        const msg = messages.find(m => m.id === msgId);
        if (!msg) return;
        this.openContextMenu(e, msg, userId);
      });
    });
  },

  startReply(msg, userId) {
    const sender = Users.getById(msg.senderId);
    this.replyTo = {
      messageId: msg.id,
      text: msg.type === 'text' ? msg.text : (msg.type === 'image' ? 'Photo' : msg.fileName || 'File'),
      name: sender ? sender.name : 'Unknown',
      senderId: msg.senderId
    };
    this.showReplyPreview();
    document.getElementById('message-input')?.focus();
  },

  cancelReply() {
    this.replyTo = null;
    const preview = document.getElementById('reply-preview');
    if (preview) preview.remove();
  },

  showReplyPreview() {
    const existing = document.getElementById('reply-preview');
    if (existing) existing.remove();
    if (!this.replyTo) return;
    const inputArea = document.querySelector('.message-input-area');
    if (!inputArea) return;
    const div = document.createElement('div');
    div.id = 'reply-preview';
    div.className = 'reply-preview';
    div.innerHTML = '<div class="rp-info"><div class="rp-name">Replying to ' + this.replyTo.name + '</div><div class="rp-text">' + this.replyTo.text + '</div></div>'
      + '<button class="rp-close" id="cancel-reply-btn">✕</button>';
    inputArea.parentNode.insertBefore(div, inputArea);
    document.getElementById('cancel-reply-btn')?.addEventListener('click', () => this.cancelReply());
  },

  toggleReactionPicker(msg, userId, btn) {
    const existing = document.getElementById('reaction-picker-' + msg.id);
    if (existing) { existing.remove(); return; }
    // Close any other open pickers and remove their listeners
    this.closeAllReactionPickers();
    const picker = document.createElement('div');
    picker.id = 'reaction-picker-' + msg.id;
    picker.className = 'reaction-picker';
    const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
    picker.innerHTML = emojis.map(e => '<button class="rp-emoji" data-emoji="' + e + '">' + e + '</button>').join('');
    const rect = btn.getBoundingClientRect();
    picker.style.position = 'fixed';
    picker.style.left = Math.max(8, rect.left) + 'px';
    picker.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
    picker.style.zIndex = '100';
    document.body.appendChild(picker);
    const currentUserId = Users.currentUser ? Users.currentUser.id : 1;
    const self = this;
    picker.querySelectorAll('.rp-emoji').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        Chat.toggleReaction(msg.id, el.dataset.emoji, currentUserId);
        self.closeAllReactionPickers();
        self.renderChatWindow(userId);
      });
    });
    // Use a single document-level listener that checks for open pickers
    if (!this._pickerListener) {
      this._pickerListener = (e) => {
        const openPicker = document.querySelector('.reaction-picker');
        if (openPicker && !openPicker.contains(e.target) && !e.target.closest('.action-btn[data-action="react"]')) {
          openPicker.remove();
        }
      };
      document.addEventListener('click', this._pickerListener);
    }
  },

  closeAllReactionPickers() {
    document.querySelectorAll('.reaction-picker').forEach(p => p.remove());
  },

  openContextMenu(e, msg, userId) {
    this.closeContextMenu();
    const backdrop = document.createElement('div');
    backdrop.className = 'context-menu-backdrop';
    backdrop.id = 'context-backdrop';
    document.body.appendChild(backdrop);
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.id = 'context-menu';
    const currentUserId = Users.currentUser ? Users.currentUser.id : 1;
    const isOwn = msg.senderId === currentUserId;
    const textPreview = msg.type === 'text' ? msg.text : (msg.type === 'image' ? 'Photo' : msg.fileName || 'File');
    let items = '';
    items += '<button class="context-menu-item" data-action="reply"><span class="cm-icon">↩</span> Reply</button>';
    items += '<div class="context-menu-divider"></div>';
    items += '<button class="context-menu-item" data-action="copy"><span class="cm-icon">📋</span> Copy</button>';
    items += '<button class="context-menu-item" data-action="forward"><span class="cm-icon">↪</span> Forward</button>';
    items += '<div class="context-menu-divider"></div>';
    if (isOwn && !msg.deleted) {
      items += '<button class="context-menu-item danger" data-action="delete"><span class="cm-icon">🗑</span> Delete</button>';
    }
    menu.innerHTML = items;
    let x = Math.min(e.clientX, window.innerWidth - 200);
    let y = Math.min(e.clientY, window.innerHeight - 40);
    menu.style.left = Math.max(4, x) + 'px';
    menu.style.top = Math.max(4, y) + 'px';
    document.body.appendChild(menu);
    menu.querySelectorAll('.context-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        if (action === 'reply') { this.startReply(msg, userId); }
        else if (action === 'copy') { this.copyMessage(msg); }
        else if (action === 'forward') { this.forwardMessage(msg, userId); }
        else if (action === 'delete') { this.deleteMessage(msg, userId); }
        this.closeContextMenu();
      });
    });
    backdrop.addEventListener('click', () => this.closeContextMenu());
  },

  closeContextMenu() {
    const menu = document.getElementById('context-menu');
    const backdrop = document.getElementById('context-backdrop');
    if (menu) menu.remove();
    if (backdrop) backdrop.remove();
  },

  copyMessage(msg) {
    const text = msg.type === 'text' ? msg.text : (msg.type === 'image' ? 'Photo' : msg.fileName || 'File');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        UI.showToast({ title: 'Copied to clipboard', type: 'success', duration: 2000 });
      }).catch(() => {
        this.fallbackCopy(text);
      });
    } else {
      this.fallbackCopy(text);
    }
  },

  fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    UI.showToast({ title: 'Copied to clipboard', type: 'success', duration: 2000 });
  },

  deleteMessage(msg, userId) {
    Chat.deleteMessage(userId, msg.id);
    UI.showToast({ title: 'Message deleted', type: 'info', duration: 2000 });
    this.renderChatWindow(userId);
  },

  forwardMessage(msg, userId) {
    const text = msg.type === 'text' ? msg.text : (msg.type === 'image' ? 'Photo' : msg.fileName || 'File');
    const input = document.getElementById('message-input');
    if (input) {
      const forwardPrefix = '↪ Forwarded from ' + (Users.getById(msg.senderId)?.name || 'Unknown') + ': ';
      const existing = input.value;
      if (existing && !existing.startsWith(forwardPrefix)) {
        input.value = existing + '\n' + forwardPrefix + text;
      } else {
        input.value = forwardPrefix + text;
      }
      input.focus();
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    }
  },
  bindChatEvents(userId) {
    const input = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const profileBtn = document.getElementById('open-profile-btn');
    const sendMessage = () => {
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;
      const extra = {};
      if (this.replyTo) {
        extra.replyTo = {
          name: this.replyTo.name,
          text: this.replyTo.text,
          messageId: this.replyTo.messageId
        };
      }
      const msg = Chat.sendMessage(text, 'text', extra);
      if (msg) {
        input.value = '';
        input.style.height = 'auto';
        this.cancelReply();
        this.renderChatWindow(userId);
        ChatEvents.onMessageSent(userId, msg);
        Chat.simulateReply(userId);
      }
    };
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
      });
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
      });
    }
    if (profileBtn) {
      profileBtn.addEventListener('click', () => { this.renderProfilePanel(userId); });
    }
    const sidebarToggle = document.getElementById('sidebar-toggle-btn');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMobileSidebar(); });
    }
    // Wire up emoji button
    const emojiBtn = document.getElementById('emoji-btn');
    if (emojiBtn) {
      emojiBtn.addEventListener('click', () => {
        UI.showToast({ title: 'Emoji picker coming soon!', message: 'Use your keyboard emojis for now 😊', type: 'info', duration: 2000 });
      });
    }
    // Wire up attach button
    const attachBtn = document.getElementById('attach-btn');
    if (attachBtn) {
      attachBtn.addEventListener('click', () => {
        UI.showToast({ title: 'File upload coming soon!', message: 'This feature will be available in a future update.', type: 'info', duration: 2000 });
      });
    }
  },

  renderProfilePanel(userId) {
    const panel = document.getElementById('profile-panel');
    if (!panel) return;
    const user = Users.getById(userId);
    if (!user) return;
    panel.classList.toggle('open');
    panel.innerHTML = '<div class="profile-header"><button class="btn-icon" id="close-profile-btn">✕</button><h3>Profile</h3></div>'
      + '<div class="profile-body">' + UI.renderAvatar(user, 'xl') + '<div class="profile-display-name">' + user.name + '</div>'
      + '<div class="profile-status">' + UI.getStatusText(user.status) + '</div><div class="profile-bio">' + user.bio + '</div></div>'
      + '<div class="divider"></div>'
      + '<div class="profile-details">'
      + '<div class="detail-item"><div class="detail-icon">📞</div><div class="detail-info"><div class="detail-label">Phone</div><div class="detail-value">' + user.phone + '</div></div></div>'
      + '<div class="detail-item"><div class="detail-icon">✉</div><div class="detail-info"><div class="detail-label">Email</div><div class="detail-value">' + user.email + '</div></div></div></div>'
      + '<div class="divider"></div>'
      + '<div class="media-section"><div class="media-section-title">Shared Media</div><div class="media-grid">';
    for (let i = 1; i <= 6; i++) {
      panel.innerHTML += '<div class="media-item"><img src="https://picsum.photos/seed/media' + i + '_' + userId + '/200/200" alt="Media" loading="lazy"></div>';
    }
    panel.innerHTML += '</div></div>';
    document.getElementById('close-profile-btn')?.addEventListener('click', () => { panel.classList.remove('open'); });
  },

  closeProfilePanel() {
    const panel = document.getElementById('profile-panel');
    if (panel) panel.classList.remove('open');
  },

  updateUnreadBadge() {
    const total = Chat.getTotalUnread();
    document.querySelectorAll('.unread-badge').forEach(el => {
      el.textContent = total;
      el.style.display = total > 0 ? 'flex' : 'none';
    });
  },

  toggleMobileSidebar() {
    const sidebar = document.querySelector('.app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) { sidebar.classList.toggle('open'); if (backdrop) backdrop.classList.toggle('open'); }
  },

  closeMobileSidebar() {
    if (window.innerWidth <= 768) {
      const sidebar = document.querySelector('.app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (sidebar) sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
    }
  },

  renderSettings() {
    const user = Users.currentUser;
    if (!user) return;
    document.getElementById('settings-user-name').textContent = user.name;
    document.getElementById('settings-avatar').innerHTML = UI.renderAvatar(user, 'lg');
    this.applyDarkModeToggle();
  },

  restoreDarkMode() {
    if (Storage.get('dark_mode', false)) {
      document.body.classList.add('dark-theme');
    }
  },

  bindGlobalEvents() {

    document.getElementById('nav-settings')?.addEventListener('click', () => { this.showSettings(); });
    document.getElementById('back-to-dashboard')?.addEventListener('click', () => { this.showDashboard(); });
    document.getElementById('sidebar-backdrop')?.addEventListener('click', () => { this.closeMobileSidebar(); });
    document.getElementById('profile-backdrop')?.addEventListener('click', () => { this.closeProfilePanel(); });
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeFilter = tab.dataset.filter || 'all';
        this.renderConversations();
      });
    });
    // Search input handler
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.searchQuery = searchInput.value.trim().toLowerCase();
        this.renderConversations();
      });
    }
  },

  get searchQuery() {
    return this._searchQuery || '';
  },

  set searchQuery(val) {
    this._searchQuery = val;
  },

  searchConversations(userIds) {
    if (!this.searchQuery) return userIds;
    return userIds.filter(id => {
      const user = Users.getById(parseInt(id));
      if (!user) return false;
      // Search by name
      if (user.name.toLowerCase().includes(this.searchQuery)) return true;
      // Search by message content
      const msgs = Chat.getMessages(parseInt(id));
      return msgs.some(m => m.text && m.text.toLowerCase().includes(this.searchQuery));
    });
  },

  showTypingIndicator(userId) {
    const user = Users.getById(parseInt(userId));
    if (!user) return;
    const area = document.getElementById("message-area");
    if (!area) return;
    if (area.querySelector(".typing-indicator")) return;
    const div = document.createElement("div");
    div.className = "typing-indicator";
    div.id = "typing-indicator-" + userId;
    div.innerHTML = "<div class=\"typing-avatar\"><img src=\"" + Users.getAvatar(user.name, user.color) + "\"></div><div class=\"typing-dots\"><span></span><span></span><span></span></div>";
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
  },

  hideTypingIndicator(userId) {
    const el = document.getElementById("typing-indicator-" + userId);
    if (el) el.remove();
  },
  darkModeToggle(el) {
    const isDark = document.body.classList.toggle('dark-theme');
    if (el) el.classList.toggle('active', isDark);
    Storage.set('dark_mode', isDark);
    UI.showToast({
      title: isDark ? 'Dark Mode Enabled' : 'Light Mode Enabled',
      message: isDark ? 'Switched to dark theme' : 'Switched to light theme',
      type: 'success'
    });
  },

  applyDarkModeToggle() {
    // Select the last toggle in settings (Dark Mode toggle)
    const toggles = document.querySelectorAll('.settings-item .toggle');
    const toggle = toggles[toggles.length - 1];
    if (!toggle) return;
    const saved = Storage.get('dark_mode', false);
    if (saved) {
      document.body.classList.add('dark-theme');
      toggle.classList.add('active');
    }
    toggle.onclick = () => { this.darkModeToggle(toggle); };
  },
};

document.addEventListener('DOMContentLoaded', () => { App.init(); });
