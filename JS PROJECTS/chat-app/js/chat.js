const Chat = {
  STORAGE_KEY: 'chat_messages',
  REACTIONS_KEY: 'chat_reactions',
  conversations: {},
  reactions: {},
  activeChat: null,

  /* Per-contact reply styles with unique personalities */
  replyStyles: {
    2: {
      name: 'Emma',
      style: 'Professional',
      replies: ["Sure, I'll check that out.", "Got it, thanks!", "I'll review and get back to you.", "Let me look into this.", "Thanks for the update!", "Noted. I'll add it to my list.", "Sounds good, let's proceed.", "I'll circle back on this EOD.", "Perfect, thanks for handling that.", "Agreed. Let's move forward with this plan."]
    },
    3: {
      name: 'David',
      style: 'Funny',
      replies: ["Haha, no way! 😂", "Bro, that's epic! 🔥", "LMAO you're kidding 😂", "I can't even right now 🤣", "Wait, what?! 😂", "That's the best thing I've heard all day 🙌", "Bruh moment for sure 😂", "I'm dead 💀", "Plot twist! Love it 😄", "You win the internet today 🏆"]
    },
    4: {
      name: 'Sophia',
      style: 'Thoughtful',
      replies: ["That's a really interesting perspective!", "I was thinking the same thing actually.", "Thanks for sharing that with me.", "That makes a lot of sense!", "I appreciate you explaining that.", "That's really thoughtful of you.", "I love how you think about these things.", "You always have the best ideas! 😊", "That's beautifully put.", "Let's definitely explore this further."]
    },
    5: {
      name: 'James',
      style: 'Enthusiastic',
      replies: ["That's awesome! 🚀", "Let's do this! So excited!", "Amazing work! Keep it up! 💪", "This is going to be huge!", "Love the energy! Let's go!", "Brilliant idea! I'm in!", "You're killing it! 🔥", "Best news I've heard all week!", "Yes! Absolutely yes! 🙌", "Let's make it happen! "]
    },
    6: {
      name: 'Olivia',
      style: 'Creative',
      replies: ["That's such a creative approach! ✨", "I love where this is going!", "The possibilities are endless!", "Let's brainstorm more on this.", "This has so much potential!", "I can totally see the vision!", "That's genius! How did you think of that?", "Let's color outside the box on this one! 🎨", "This is going to look beautiful.", "I'm getting such good vibes from this! 🌟"]
    },
    7: {
      name: 'Daniel',
      style: 'Analytical',
      replies: ["Interesting. Let me analyze the data.", "I'll run some numbers and get back to you.", "That aligns with what I've been seeing.", "The metrics support that conclusion.", "Let me verify that hypothesis.", "I've been tracking similar trends.", "The data suggests we should proceed.", "I'll need to factor that into the model.", "Good insight. I'll add it to the analysis.", "The correlation there is significant."]
    },
    8: {
      name: 'Emily',
      style: 'Friendly',
      replies: ["Hey! That's so great! 😊", "Love this! You're amazing!", "So happy to hear that! 🎉", "That made my day! 🌈", "You're the best! 🙌", "I was just thinking the same thing!", "Sending you good vibes! ✨", "This conversation is everything! 💕", "Can't stop smiling at this! 😄", "You always know how to brighten my day!"]
    }
  },

  init() {
    this.conversations = Storage.get(this.STORAGE_KEY, {});
    this.reactions = Storage.get(this.REACTIONS_KEY, {});
    
    // Only seed initial data on very first launch (no conversations exist)
    if (Object.keys(this.conversations).length === 0) {
      this.seedInitialData();
    }
  },

  seedInitialData() {
    const now = Date.now();
    const fiveMin = 300000;
    const hour = 3600000;

    const seedConversations = {
      2: [
        { id: 'seed_2_1', senderId: 2, text: 'Hey Alex! The design mockups are ready for review.', timestamp: now - 2 * hour, type: 'text', read: true },
        { id: 'seed_2_2', senderId: 1, text: "Great! I'll take a look right away.", timestamp: now - 2 * hour + fiveMin, type: 'text', read: true },
        { id: 'seed_2_3', senderId: 2, text: 'Awesome, let me know what you think about the color palette.', timestamp: now - 2 * hour + 2 * fiveMin, type: 'text', read: true },
        { id: 'seed_2_4', senderId: 2, text: 'Sure, I\'ll check that out.', timestamp: now - hour, type: 'text', read: false },
      ],
      3: [
        { id: 'seed_3_1', senderId: 3, text: 'Bro did you see the new framework drop? 🔥', timestamp: now - 3 * hour, type: 'text', read: true },
        { id: 'seed_3_2', senderId: 1, text: 'Not yet, worth checking out?', timestamp: now - 3 * hour + fiveMin, type: 'text', read: true },
        { id: 'seed_3_3', senderId: 3, text: 'Haha, no way! 😂 It\'s insane!', timestamp: now - 3 * hour + 2 * fiveMin, type: 'text', read: true },
        { id: 'seed_3_4', senderId: 3, text: 'You\'re gonna love it man 🚀', timestamp: now - 30 * fiveMin, type: 'text', read: false },
      ],
      4: [
        { id: 'seed_4_1', senderId: 4, text: 'That\'s a really interesting perspective!', timestamp: now - 4 * hour, type: 'text', read: true },
        { id: 'seed_4_2', senderId: 1, text: 'Thanks Sophia! Your UX insights helped a lot.', timestamp: now - 4 * hour + fiveMin, type: 'text', read: true },
        { id: 'seed_4_3', senderId: 4, text: 'I appreciate you explaining that.', timestamp: now - 2 * hour, type: 'text', read: true },
      ],
      5: [
        { id: 'seed_5_1', senderId: 5, text: 'That\'s awesome! 🚀 The PR is ready for review.', timestamp: now - hour, type: 'text', read: true },
        { id: 'seed_5_2', senderId: 1, text: "Let's do this! I'll review it tonight.", timestamp: now - hour + fiveMin, type: 'text', read: true },
        { id: 'seed_5_3', senderId: 5, text: 'Amazing work! Keep it up! 💪', timestamp: now - 30 * fiveMin, type: 'text', read: true },
        { id: 'seed_5_4', senderId: 5, text: 'This is going to be huge!', timestamp: now - 15 * fiveMin, type: 'text', read: false },
      ],
      6: [
        { id: 'seed_6_1', senderId: 6, text: "That's such a creative approach! ✨ Let's brainstorm more.", timestamp: now - 5 * hour, type: 'text', read: true },
        { id: 'seed_6_2', senderId: 1, text: 'I love where this is going!', timestamp: now - 5 * hour + fiveMin, type: 'text', read: true },
      ],
      7: [
        { id: 'seed_7_1', senderId: 7, text: 'Interesting. Let me analyze the data from the last sprint.', timestamp: now - 24 * hour, type: 'text', read: true },
        { id: 'seed_7_2', senderId: 7, text: 'The metrics support that conclusion.', timestamp: now - 24 * hour + fiveMin, type: 'text', read: true },
      ],
      8: [
        { id: 'seed_8_1', senderId: 8, text: 'Hey! That\'s so great! 😊 Love the new UI work!', timestamp: now - 6 * hour, type: 'text', read: true },
        { id: 'seed_8_2', senderId: 1, text: 'Thanks Emily! The pixel-perfect approach paid off.', timestamp: now - 6 * hour + fiveMin, type: 'text', read: true },
        { id: 'seed_8_3', senderId: 8, text: "You're the best! 🙌 Let's grab coffee and discuss the next sprint.", timestamp: now - 2 * hour, type: 'text', read: false },
      ]
    };

    this.conversations = seedConversations;
    this.save();
  },

  getConversations() { return this.conversations; },
  getActiveChat() { return this.activeChat; },

  setActiveChat(userId) {
    this.activeChat = userId;
    if (!this.conversations[userId]) this.conversations[userId] = [];
    this.markAsRead(userId);
  },

  save() { Storage.set(this.STORAGE_KEY, this.conversations); },
  saveReactions() { Storage.set(this.REACTIONS_KEY, this.reactions); },
  getMessages(userId) { return this.conversations[userId] || []; },

  addMessage(userId, message) {
    if (!this.conversations[userId]) this.conversations[userId] = [];
    this.conversations[userId].push(message);
    this.save();
  },

  sendMessage(text, type, extra) {
    if (!this.activeChat) return null;
    if (!type) type = 'text';
    if (!extra) extra = {};
    const msg = { id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2,6), senderId: (Users.currentUser || Users.sampleUsers[0]).id, text: text, timestamp: Date.now(), type: type, status: 'sent' };
    Object.assign(msg, extra);
    this.addMessage(this.activeChat, msg);
    return msg;
  },

  getReactions(messageId) { return this.reactions[messageId] || {}; },

  toggleReaction(messageId, emoji, userId) {
    if (!this.reactions[messageId]) this.reactions[messageId] = {};
    const emojiReact = this.reactions[messageId];
    if (!emojiReact[emoji]) emojiReact[emoji] = [];
    const idx = emojiReact[emoji].indexOf(userId);
    if (idx >= 0) {
      emojiReact[emoji].splice(idx, 1);
      if (emojiReact[emoji].length === 0) delete emojiReact[emoji];
      if (Object.keys(emojiReact).length === 0) delete this.reactions[messageId];
      this.saveReactions();
      return false; // removed
    } else {
      emojiReact[emoji].push(userId);
      this.saveReactions();
      return true; // added
    }
  },

  hasReacted(messageId, emoji, userId) {
    return this.reactions[messageId] && this.reactions[messageId][emoji] && this.reactions[messageId][emoji].includes(userId);
  },

  getUnreadCount(userId) { return (this.conversations[userId] || []).filter(m => m.senderId === parseInt(userId) && !m.read).length; },
  getTotalUnread() { return Object.keys(this.conversations).reduce((t, id) => t + this.getUnreadCount(id), 0); },

  markAsRead(userId) {
    const msgs = this.conversations[userId];
    if (msgs) { msgs.forEach(m => { if (m.senderId === parseInt(userId) && !m.read) m.read = true; }); this.save(); }
  },

  getLastMessage(userId) { const msgs = this.conversations[userId]; return msgs && msgs.length ? msgs[msgs.length - 1] : null; },

  startTyping(userId) { ChatEvents.emit('typingStart', userId); },
  stopTyping(userId) { ChatEvents.emit('typingStop', userId); },

  simulateReply(userId) {
    const user = Users.getById(parseInt(userId));
    if (!user) return;
    this.startTyping(userId);
    const typingDuration = 1500 + Math.random() * 1500;
    const replies = this.replyStyles[parseInt(userId)] || this.replyStyles[2];
    setTimeout(() => {
      this.stopTyping(userId);
      const text = replies.replies[Math.floor(Math.random() * replies.replies.length)];
      const replyMsg = { id: 'reply_' + Date.now(), senderId: parseInt(userId), text: text, timestamp: Date.now(), type: 'text', status: 'sent' };
      this.addMessage(userId, replyMsg);
      ChatEvents.onMessageReceived(userId);
    }, typingDuration);
  },

  formatTime(timestamp) {
    const d = new Date(timestamp); const n = new Date(); const diff = n - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (d.toDateString() === n.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 172800000) return 'Yesterday';
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  },

  formatDate(timestamp) {
    const d = new Date(timestamp); const n = new Date();
    if (d.toDateString() === n.toDateString()) return 'Today';
    const y = new Date(n); y.setDate(y.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  },

  deleteMessage(userId, messageId) {
    const msgs = this.conversations[userId];
    if (msgs) { const idx = msgs.findIndex(m => m.id === messageId); if (idx >= 0) { msgs[idx].deleted = true; this.save(); return true; } }
    return false;
  }
};

const ChatEvents = {
  listeners: {},
  on(event, cb) { if (!this.listeners[event]) this.listeners[event] = []; this.listeners[event].push(cb); },
  emit(event, data) { (this.listeners[event] || []).forEach(cb => cb(data)); },
  onMessageReceived(userId) { this.emit('messageReceived', userId); this.emit('conversationUpdated', userId); },
  onMessageSent(userId, msg) { this.emit('messageSent', { userId: userId, message: msg }); this.emit('conversationUpdated', userId); },
  onConversationChange(userId) { this.emit('conversationChange', userId); }
};
