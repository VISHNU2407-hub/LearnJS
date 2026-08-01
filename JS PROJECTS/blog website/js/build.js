const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/vr604/OneDrive/Desktop/JS PROJECTS/blog website';

const authors = [
  { name: 'Sarah Chen', role: 'Senior Frontend Engineer', avatar: 'SC', color: '#2563EB' },
  { name: 'Marcus Johnson', role: 'Full-Stack Developer', avatar: 'MJ', color: '#7C3AED' },
  { name: 'Aiko Tanaka', role: 'UX Engineer', avatar: 'AT', color: '#06B6D4' },
  { name: 'David Park', role: 'Software Architect', avatar: 'DP', color: '#059669' },
  { name: 'Emma Wilson', role: 'DevOps Engineer', avatar: 'EW', color: '#DC2626' },
  { name: 'Raj Patel', role: 'AI/ML Engineer', avatar: 'RP', color: '#D97706' },
  { name: 'Lisa Zhang', role: 'Frontend Designer', avatar: 'LZ', color: '#0891B2' },
  { name: 'James Mitchell', role: 'Technical Writer', avatar: 'JM', color: '#4F46E5' }
];

const categories = [
  { id: 'javascript', name: 'JavaScript', icon: '\u26A1', color: '#F59E0B', bgColor: '#FEF3C7' },
  { id: 'css', name: 'CSS', icon: '\uD83C\uDFA8', color: '#3B82F6', bgColor: '#DBEAFE' },
  { id: 'html', name: 'HTML', icon: '\uD83C\uDF10', color: '#EF4444', bgColor: '#FEE2E2' },
  { id: 'frontend', name: 'Frontend', icon: '\uD83D\uDDA5\uFE0F', color: '#8B5CF6', bgColor: '#EDE9FE' },
  { id: 'ui-design', name: 'UI Design', icon: '\u2728', color: '#06B6D4', bgColor: '#CFFAFE' },
  { id: 'ai', name: 'AI', icon: '\uD83E\uDD16', color: '#10B981', bgColor: '#D1FAE5' },
  { id: 'productivity', name: 'Productivity', icon: '\uD83D\uDE80', color: '#F97316', bgColor: '#FED7AA' },
  { id: 'web-dev', name: 'Web Development', icon: '\u2699\uFE0F', color: '#6366F1', bgColor: '#E0E7FF' }
];

const articles = [];

// Article 1
articles.push({
  id: 1,
  title: 'The Future of CSS: Container Queries and Style Queries',
  slug: 'future-of-css-container-queries',
  description: 'Container queries are revolutionizing responsive design. Learn how to build truly component-driven layouts that respond to their container rather than the viewport.',
  category: 'css',
  tags: ['CSS', 'Responsive Design', 'Container Queries', 'Modern CSS'],
  author: authors[0],
  date: '2026-07-15',
  readTime: '8 min read',
  featured: true,
  trending: 1,
  editorPick: true
});

// Article 2
articles.push({
  id: 2,
  title: 'Building Accessible Web Applications: A Practical Guide',
  slug: 'building-accessible-web-applications',
  description: 'Accessibility is not optional. Discover the essential patterns and techniques for creating web applications that work for everyone.',
  category: 'html',
  tags: ['Accessibility', 'A11y', 'HTML', 'Inclusive Design'],
  author: authors[1],
  date: '2026-07-12',
  readTime: '10 min read',
  featured: true,
  trending: 2,
  editorPick: true
});

// Article 3
articles.push({
  id: 3,
  title: 'Mastering JavaScript Promises and Async/Await',
  slug: 'mastering-javascript-promises-async-await',
  description: 'Dive deep into asynchronous JavaScript. From callbacks to promises to async/await, learn the patterns every modern JavaScript developer must know.',
  category: 'javascript',
  tags: ['JavaScript', 'Async', 'Promises', 'ES6+'],
  author: authors[2],
  date: '2026-07-10',
  readTime: '12 min read',
  featured: false,
  trending: 3,
  editorPick: true
});

// Article 4
articles.push({
  id: 4,
  title: 'Designing with Design Tokens: A Complete Guide',
  slug: 'designing-with-design-tokens',
  description: 'Design tokens bridge the gap between design and development. Learn how to implement a scalable design token system that your entire team will love.',
  category: 'ui-design',
  tags: ['Design Tokens', 'Design Systems', 'UI Design', 'CSS Variables'],
  author: authors[3],
  date: '2026-07-08',
  readTime: '9 min read',
  featured: false,
  trending: 4,
  editorPick: false
});

// Article 5
articles.push({
  id: 5,
  title: 'Web Performance Optimization in 2026',
  slug: 'web-performance-optimization-2026',
  description: 'Speed matters more than ever. Explore the latest techniques for optimizing web performance, from Core Web Vitals to advanced caching strategies.',
  category: 'web-dev',
  tags: ['Performance', 'Web Vitals', 'Optimization', 'Lighthouse'],
  author: authors[4],
  date: '2026-07-05',
  readTime: '11 min read',
  featured: false,
  trending: 5,
  editorPick: true
});

// Article 6
articles.push({
  id: 6,
  title: 'Getting Started with Machine Learning in the Browser',
  slug: 'machine-learning-in-the-browser',
  description: 'TensorFlow.js brings ML to the browser. Build intelligent applications that run entirely client-side with privacy-preserving AI features.',
  category: 'ai',
  tags: ['Machine Learning', 'TensorFlow.js', 'AI', 'JavaScript'],
  author: authors[5],
  date: '2026-07-03',
  readTime: '14 min read',
  featured: true,
  trending: 6,
  editorPick: false
});

// Article 7
articles.push({
  id: 7,
  title: 'The Art of Code Review: Giving and Receiving Feedback',
  slug: 'art-of-code-review',
  description: 'Code review is a skill that transcends programming languages. Master the art of constructive feedback that makes your team better.',
  category: 'productivity',
  tags: ['Code Review', 'Teamwork', 'Best Practices', 'Collaboration'],
  author: authors[6],
  date: '2026-06-30',
  readTime: '7 min read',
  featured: false,
  trending: 7,
  editorPick: true
});

// Article 8
articles.push({
  id: 8,
  title: 'CSS Grid vs Flexbox: When to Use Which',
  slug: 'css-grid-vs-flexbox',
  description: 'Two powerful layout systems, each with its strengths. Master the decision framework for choosing between Grid and Flexbox in your projects.',
  category: 'css',
  tags: ['CSS', 'Grid', 'Flexbox', 'Layout'],
  author: authors[7],
  date: '2026-06-28',
  readTime: '6 min read',
  featured: false,
  trending: 8,
  editorPick: false
});

// Article 9
articles.push({
  id: 9,
  title: 'Understanding JavaScript Closures in Depth',
  slug: 'understanding-javascript-closures',
  description: 'Closures are one of JavaScript\'s most powerful and misunderstood features. Unlock their potential with practical examples and real-world use cases.',
  category: 'javascript',
  tags: ['JavaScript', 'Closures', 'Scope', 'Functions'],
  author: authors[0],
  date: '2026-06-25',
  readTime: '10 min read',
  featured: false,
  trending: 9,
  editorPick: false
});

// Article 10
articles.push({
  id: 10,
  title: 'Creating Engaging Data Visualizations with D3.js',
  slug: 'creating-data-visualizations-d3',
  description: 'Transform data into stunning visual stories. Learn the fundamentals of D3.js and create interactive, beautiful data visualizations for the web.',
  category: 'frontend',
  tags: ['D3.js', 'Data Visualization', 'JavaScript', 'SVG'],
  author: authors[2],
  date: '2026-06-22',
  readTime: '13 min read',
  featured: false,
  trending: 10,
  editorPick: false
});

// Article 11
articles.push({
  id: 11,
  title: 'HTML Semantics: Beyond the Basics',
  slug: 'html-semantics-beyond-basics',
  description: 'Modern HTML offers rich semantic elements that improve accessibility, SEO, and code maintainability. Go beyond divs and spans.',
  category: 'html',
  tags: ['HTML', 'Semantics', 'SEO', 'Accessibility'],
  author: authors[3],
  date: '2026-06-19',
  readTime: '7 min read',
  featured: false,
  trending: 11,
  editorPick: false
});

// Article 12
articles.push({
  id: 12,
  title: 'Microservices vs Monoliths: Making the Right Choice',
  slug: 'microservices-vs-monoliths',
  description: 'The architecture debate continues. Learn the trade-offs between microservices and monolithic architectures and how to choose wisely.',
  category: 'web-dev',
  tags: ['Architecture', 'Microservices', 'Monolith', 'System Design'],
  author: authors[1],
  date: '2026-06-16',
  readTime: '9 min read',
  featured: false,
  trending: 12,
  editorPick: false
});

// Article 13
articles.push({
  id: 13,
  title: 'The Psychology of Color in UI Design',
  slug: 'psychology-of-color-ui-design',
  description: 'Color influences emotion, behavior, and usability. Understand the psychology behind color choices and create 
