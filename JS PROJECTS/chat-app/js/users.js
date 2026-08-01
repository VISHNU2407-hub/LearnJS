/* ==============================================
   USERS.JS — Sample Users & Data
   ============================================== */

const Users = {
  currentUser: null,

  /* 8 sample users matching the spec */
  sampleUsers: [
    {
      id: 1,
      name: 'Alex Morgan',
      email: 'alex@example.com',
      status: 'online',
      bio: 'Creative designer & coffee enthusiast. Love building beautiful things.',
      phone: '+1 (555) 123-4567',
      color: '#2563EB',
      lastSeen: 'Online'
    },
    {
      id: 2,
      name: 'Emma Wilson',
      email: 'emma@example.com',
      status: 'online',
      bio: 'Product manager at a fast-growing startup. Always planning the next big thing.',
      phone: '+1 (555) 234-5678',
      color: '#10B981',
      lastSeen: 'Online'
    },
    {
      id: 3,
      name: 'David Kim',
      email: 'david@example.com',
      status: 'away',
      bio: 'Software engineer who loves memes, code, and coffee. Not necessarily in that order.',
      phone: '+1 (555) 345-6789',
      color: '#F59E0B',
      lastSeen: 'Last seen 2 hours ago'
    },
    {
      id: 4,
      name: 'Sophia Chen',
      email: 'sophia@example.com',
      status: 'offline',
      bio: 'UX researcher & travel lover. Currently exploring Southeast Asia.',
      phone: '+1 (555) 456-7890',
      color: '#EF4444',
      lastSeen: 'Last seen yesterday'
    },
    {
      id: 5,
      name: 'James Rodriguez',
      email: 'james@example.com',
      status: 'online',
      bio: 'Full-stack developer & open source contributor. Building the web, one PR at a time.',
      phone: '+1 (555) 567-8901',
      color: '#8B5CF6',
      lastSeen: 'Online'
    },
    {
      id: 6,
      name: 'Olivia Thompson',
      email: 'olivia@example.com',
      status: 'away',
      bio: 'Marketing director & creative strategist. Words, design, data - I do it all.',
      phone: '+1 (555) 678-9012',
      color: '#EC4899',
      lastSeen: 'Last seen 30 minutes ago'
    },
    {
      id: 7,
      name: 'Daniel Patel',
      email: 'daniel@example.com',
      status: 'offline',
      bio: 'Data scientist & ML engineer. Turning data into decisions.',
      phone: '+1 (555) 789-0123',
      color: '#14B8A6',
      lastSeen: 'Last seen 3 days ago'
    },
    {
      id: 8,
      name: 'Emily Brooks',
      email: 'emily@example.com',
      status: 'online',
      bio: 'Frontend developer & UI designer. Pixel-perfect is the only way.',
      phone: '+1 (555) 890-1234',
      color: '#F97316',
      lastSeen: 'Online'
    }
  ],

  getAvatar(name, color) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color.replace('#', '')}&color=fff&size=200&bold=true`;
  },

  getById(id) { return this.sampleUsers.find(u => u.id === id) || null; },

  getContacts() {
    if (!this.currentUser) return this.sampleUsers;
    return this.sampleUsers.filter(u => u.id !== this.currentUser.id);
  },

  login(userId) {
    this.currentUser = this.getById(userId);
    if (this.currentUser) Storage.set('chat_current_user', this.currentUser);
    return this.currentUser;
  },

  getInitials(name) { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
};
