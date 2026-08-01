/* ============================================
   STORAGE MODULE - localStorage CRUD
   ============================================ */

const Storage = {
  KEY: 'kanban-board',

  load() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
      return null;
    }
  },

  save(state) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      return false;
    }
  },

  getDefaults() {
    return {
      boardTitle: 'Product Launch',
      columns: [
        { id: 'todo', title: 'To Do' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'review', title: 'Review' },
        { id: 'done', title: 'Done' }
      ],
      tasks: {},
      taskOrder: {
        'todo': [],
        'in-progress': [],
        'review': [],
        'done': []
      },
      filters: { priority: 'all', category: 'all' },
      sort: { by: 'created', order: 'desc' },
      search: ''
    };
  },

  generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  createSampleData() {
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const task1 = {
      id: 'task_sample_1',
      columnId: 'todo',
      title: 'Design new landing page',
      description: 'Create wireframes and high-fidelity mockups for the new product landing page.',
      priority: 'high',
      category: 'Design',
      dueDate: nextWeek,
      assignedTo: 'JD',
      checklist: [
        { text: 'Research competitors', completed: true },
        { text: 'Create wireframes', completed: true },
        { text: 'Design high-fidelity mockups', completed: false },
        { text: 'Get stakeholder approval', completed: false }
      ],
      notes: 'Use the new color palette from the brand guide.',
      attachments: 3,
      comments: 5,
      createdAt: now - 86400000 * 2,
      activityLog: [
        { action: 'Task created', time: now - 86400000 * 2 },
        { action: 'Priority set to High', time: now - 86400000 * 2 },
        { action: 'Checklist item completed: Research competitors', time: now - 86400000 },
        { action: 'Due date updated', time: now - 43200000 }
      ]
    };

    const task2 = {
      id: 'task_sample_2',
      columnId: 'todo',
      title: 'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment to staging.',
      priority: 'urgent',
      category: 'Development',
      dueDate: tomorrow,
      assignedTo: 'AK',
      checklist: [
        { text: 'Choose CI provider', completed: true },
        { text: 'Write workflow config', completed: false },
        { text: 'Test deployment', completed: false }
      ],
      notes: 'Use the team existing GitHub Actions templates.',
      attachments: 1,
      comments: 3,
      createdAt: now - 86400000 * 3,
      activityLog: [
        { action: 'Task created', time: now - 86400000 * 3 },
        { action: 'Priority set to Urgent', time: now - 86400000 * 3 }
      ]
    };

    const task3 = {
      id: 'task_sample_3',
      columnId: 'in-progress',
      title: 'Implement user authentication',
      description: 'Add JWT-based authentication with login, register, and password reset flows.',
      priority: 'high',
      category: 'Development',
      dueDate: tomorrow,
      assignedTo: 'SM',
      checklist: [
        { text: 'Set up JWT utility functions', completed: true },
        { text: 'Create login API endpoint', completed: true },
        { text: 'Create register API endpoint', completed: true },
        { text: 'Add password reset flow', completed: false },
        { text: 'Write integration tests', completed: false }
      ],
      notes: 'Use access + refresh token pattern.',
      attachments: 0,
      comments: 8,
      createdAt: now - 86400000 * 5,
      activityLog: [
        { action: 'Task created', time: now - 86400000 * 5 },
        { action: 'Moved from To Do to In Progress', time: now - 86400000 * 3 },
        { action: 'Checklist item completed: Set up JWT', time: now - 86400000 * 2 },
        { action: 'Checklist item completed: Create login API', time: now - 86400000 },
        { action: 'Checklist item completed: Create register API', time: now - 43200000 }
      ]
    };

    const task4 = {
      id: 'task_sample_4',
      columnId: 'in-progress',
      title: 'Write API documentation',
      description: 'Document all REST API endpoints using OpenAPI/Swagger specification.',
      priority: 'medium',
      category: 'Research',
      dueDate: nextWeek,
      assignedTo: 'EC',
      checklist: [
        { text: 'Set up Swagger', completed: true },
        { text: 'Document auth endpoints', completed: true },
        { text: 'Document user endpoints', completed: true },
        { text: 'Document product endpoints', completed: false },
        { text: 'Review with team', completed: false }
      ],
      notes: 'Include code examples in multiple languages.',
      attachments: 0,
      comments: 2,
      createdAt: now - 86400000 * 4,
      activityLog: [
        { action: 'Task created', time: now - 86400000 * 4 },
        { action: 'Checklist item completed: Set up Swagger', time: now - 86400000 * 3 },
        { action: 'Checklist item completed: Document auth', time: now - 86400000 * 2 },
        { action: 'Checklist item completed: Document user', time: now - 86400000 }
      ]
    };

    const task5 = {
      id: 'task_sample_5',
      columnId: 'review',
      title: 'UI component library audit',
      description: 'Review all components in the design system for consistency and accessibility.',
      priority: 'medium',
      category: 'Design',
      dueDate: tomorrow,
      assignedTo: 'JD',
      checklist: [
        { text: 'Check color contrast ratios', completed: true },
        { text: 'Verify keyboard navigation', completed: true },
        { text: 'Test screen reader support', completed: true },
        { text: 'Document findings', completed: false }
      ],
      notes: 'Use the WCAG 2.1 AA standard as the baseline.',
      attachments: 5,
      comments: 1,
      createdAt: now - 86400000 * 6,
      activityLog: [
        { action: 'Task created', time: now - 86400000 * 6 },
        { action: 'Moved from In Progress to Review', time: now - 86400000 },
        { action: 'Checklist: Color contrast ratios', time: now - 43200000 },
        { action: 'Checklist: Verify keyboard navigation', time: now - 21600000 },
        { action: 'Checklist: Test screen reader support', time: now - 7200000 }
      ]
    };

    const task6 = {
      id: 'task_sample_6',
      columnId: 'review',
      title: 'Performance optimization report',
      description: 'Run Lighthouse audits and create a report with Core Web Vitals recommendations.',
      priority: 'low',
      category: 'Research',
      dueDate: nextWeek,
      assignedTo: 'AK',
      checklist: [
        { text: 'Run Lighthouse audit', completed: true },
        { text: 'Analyze bundle size', completed: true },
        { text: 'Create optimization plan', completed: false }
      ],
      notes: 'Focus on LCP and CLS improvements.',
      attachments: 2,
      comments: 0,
      createdAt: now - 86400000 * 7,
      activityLog: [
        { action: 'Task created', time: now - 86400000 * 7 },
        { action: 'Checklist: Run Lighthouse audit', time: now - 86400000 * 5 },
        { action: 'Checklist: Analyze bundle size', time: now - 86400000 * 2 },
        { action: 'Moved from In Progress to Review', time: now - 86400000 }
      ]
    };

    const task7 = {
      id: 'task_sample_7',
      columnId: 'done',
      title: 'Database schema design',
      description: 'Design the PostgreSQL database schema for the core product entities.',
      priority: 'high',
      category: 'Development',
      dueDate: yesterday,
      assignedTo: 'SM',
      checklist: [
        { text: 'Identify core entities', completed: true },
        { text: 'Design relationships', completed: true },
        { text: 'Create migration scripts', completed: true },
        { text: 'Review with team lead', completed: true }
      ],
      notes: 'All finalized and approved.',
      attachments: 1,
      comments: 4,
      createdAt: now - 86400000 * 10,
      activityLog: [
        { action: 'Task created', time: now - 86400000 * 10 },
        { action: 'All checklist items completed', time: now - 86400000 * 3 },
        { action: 'Moved to Done', time: now - 86400000 * 2 }
      ]
    };

    const task8 = {
      id: 'task_sample_8',
      columnId: 'todo',
      title: 'Fix navigation bug on mobile',
      description: 'The hamburger menu does not close when clicking outside on iOS Safari.',
      priority: 'urgent',
      category: 'Bug',
      dueDate: today,
      assignedTo: 'EC',
      checklist: [
        { text: 'Reproduce the bug', completed: true },
        { text: 'Fix click-outside handler', completed: false },
        { text: 'Test on iOS Safari', completed: false }
      ],
      notes: 'Reported by QA. Critical for mobile users.',
      attachments: 2,
      comments: 6,
      createdAt: now - 86400000,
      activityLog: [
        { action: 'Task created', time: now - 86400000 },
        { action: 'Priority set to Urgent', time: now - 86400000 },
        { action: 'Checklist: Reproduce the bug', time: now - 43200000 }
      ]
    };

    const data = this.getDefaults();
    data.tasks = {
      'task_sample_1': task1,
      'task_sample_2': task2,
      'task_sample_3': task3,
      'task_sample_4': task4,
      'task_sample_5': task5,
      'task_sample_6': task6,
      'task_sample_7': task7,
      'task_sample_8': task8
    };
    data.taskOrder = {
      'todo': ['task_sample_1', 'task_sample_2', 'task_sample_8'],
      'in-progress': ['task_sample_3', 'task_sample_4'],
      'review': ['task_sample_5', 'task_sample_6'],
      'done': ['task_sample_7']
    };

    return data;
  }
};
