const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/vr604/OneDrive/Desktop/JS PROJECTS/blog website';

// ===== READ CSS =====
let css = fs.readFileSync(path.join(dir, 'css', 'style.css'), 'utf8');
css = css.replace(/@import[^;]+;/g, '').trim();

// ===== BUILD HTML =====
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>VKS Blog - Premium Developer Blog</title>
<meta name="description" content="A premium blog about web development, design, and technology.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>

<!-- NAVBAR -->
<nav class="navbar" id="navbar">
<div class="navbar-inner">
<div class="navbar-logo" onclick="navigate('home')"><span class="logo-icon">V</span><span>VKS Blog</span></div>
<div class="navbar-links">
<a onclick="navigate('home')" data-route="home">Home</a>
<a onclick="navigate('articles')" data-route="articles">Articles</a>
<a onclick="navigate('categories')" data-route="categories">Categories</a>
<a onclick="navigate('bookmarks')" data-route="bookmarks">Bookmarks</a>
</div>
<div class="navbar-actions">
<button class="navbar-search-btn" onclick="toggleSearch()" title="Search">\ud83d\udd0d</button>
<button class="navbar-menu-btn" onclick="toggleMobileMenu()" title="Menu">\u2630</button>
</div>
</div>
</nav>

<!-- MOBILE MENU -->
<div class="mobile-menu" id="mobileMenu">
<a onclick="navigate('home');toggleMobileMenu()">Home</a>
<a onclick="navigate('articles');toggleMobileMenu()">Articles</a>
<a onclick="navigate('categories');toggleMobileMenu()">Categories</a>
<a onclick="navigate('bookmarks');toggleMobileMenu()">Bookmarks</a>

</div>

<!-- READING PROGRESS -->
<div class="reading-progress" id="readingProgress">
<div class="reading-progress-bar" id="readingProgressBar"></div>
</div>

<!-- MAIN CONTENT -->
<main id="app"></main>

<!-- FOOTER -->
<footer class="footer" id="footer">
<div class="container">
<div class="footer-grid">
<div class="footer-brand">
<div class="navbar-logo" style="cursor:default"><span class="logo-icon">V</span><span>VKS Blog</span></div>
<p>A premium developer blog exploring the latest in web development, design, and technology.</p>
<div class="footer-social">
<a href="#" title="Twitter">\ud835\uddd7</a>
<a href="#" title="GitHub">\ud83d\udcbb</a>
<a href="#" title="LinkedIn">\ud83d\udc64</a>
</div>
</div>
<div><h4 class="footer-heading">Navigation</h4><ul class="footer-links"><li><a onclick="navigate('home')">Home</a></li><li><a onclick="navigate('articles')">Articles</a></li><li><a onclick="navigate('categories')">Categories</a></li></ul></div>
<div><h4 class="footer-heading">Categories</h4><ul class="footer-links" id="footerCategories"></ul></div>
<div><h4 class="footer-heading">Support</h4><ul class="footer-links"><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li><li><a href="#">Contact</a></li></ul></div>
</div>
<div class="footer-bottom">
<p class="footer-copyright">&copy; 2026 VKS Blog. All rights reserved.</p>
<div class="footer-bottom-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
</div>
</div>
</footer>

<script>
`;

// ===== JAVASCRIPT DATA =====
fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log('Part 1 written. Building JS data...');

// Write the JavaScript part separately
const jsStart = `
// ===== DATA =====
const AUTHORS = [
{name:'Sarah Chen',role:'Senior Frontend Engineer',avatar:'SC',color:'#2563EB'},
{name:'Marcus Johnson',role:'Full-Stack Developer',avatar:'MJ',color:'#7C3AED'},
{name:'Aiko Tanaka',role:'UX Engineer',avatar:'AT',color:'#06B6D4'},
{name:'David Park',role:'Software Architect',avatar:'DP',color:'#059669'},
{name:'Emma Wilson',role:'DevOps Engineer',avatar:'EW',color:'#DC2626'},
{name:'Raj Patel',role:'AI/ML Engineer',avatar:'RP',color:'#D97706'},
{name:'Lisa Zhang',role:'Frontend Designer',avatar:'LZ',color:'#0891B2'},
{name:'James Mitchell',role:'Technical Writer',avatar:'JM',color:'#4F46E5'}
];
const CATEGORIES = [
{id:'javascript',name:'JavaScript',icon:'⚡',color:'#F59E0B',bgColor:'#FEF3C7'},
{id:'css',name:'CSS',icon:'🎨',color:'#3B82F6',bgColor:'#DBEAFE'},
{id:'html',name:'HTML',icon:'🌐',color:'#EF4444',bgColor:'#FEE2E2'},
{id:'frontend',name:'Frontend',icon:'🖥️',color:'#8B5CF6',bgColor:'#EDE9FE'},
{id:'ui-design',name:'UI Design',icon:'✨',color:'#06B6D4',bgColor:'#CFFAFE'},
{id:'ai',name:'AI',icon:'🤖',color:'#10B981',bgColor:'#D1FAE5'},
{id:'productivity',name:'Productivity',icon:'🚀',color:'#F97316',bgColor:'#FED7AA'},
{id:'web-dev',name:'Web Development',icon:'⚙️',color:'#6366F1',bgColor:'#E0E7FF'}
];
`;

// Articles data
let articleData = 'const ARTICLES = [\n';
const articles = [
  {id:1,title:'The Future of CSS: Container Queries and Style Queries',slug:'future-of-css-container-queries',desc:'Container queries are revolutionizing responsive design. Learn how to build truly component-driven layouts that respond to their container rather than the viewport.',cat:'css',tags:'CSS,Responsive Design,Container Queries,Modern CSS',author:0,date:'2026-07-15',readTime:'8 min read',feat:true,trend:1,pick:true},
  {id:2,title:'Building Accessible Web Applications: A Practical Guide',slug:'building-accessible-web-applications',desc:'Accessibility is not optional. Discover the essential patterns and techniques for creating web applications that work for everyone, including users with disabilities.',cat:'html',tags:'Accessibility,A11y,HTML,Inclusive Design',author:1,date:'2026-07-12',readTime:'10 min read',feat:true,trend:2,pick:true},
  {id:3,title:'Mastering JavaScript Promises and Async/Await',slug:'mastering-javascript-promises-async-await',desc:'Dive deep into asynchronous JavaScript. From callbacks to promises to async/await, learn the patterns that every modern JavaScript developer must know.',cat:'javascript',tags:'JavaScript,Async,Promises,ES6+',author:2,date:'2026-07-10',readTime:'12 min read',feat:false,trend:3,pick:true},
  {id:4,title:'Designing with Design Tokens: A Complete Guide',slug:'designing-with-design-tokens',desc:'Design tokens bridge the gap between design and development. Learn how to implement a scalable design token system that your entire team will love.',cat:'ui-design',tags:'Design Tokens,Design Systems,UI Design,CSS Variables',author:3,date:'2026-07-08',readTime:'9 min read',feat:false,trend:4,pick:false},
  {id:5,title:'Web Performance Optimization in 2026',slug:'web-performance-optimization-2026',desc:'Speed matters more than ever. Explore the latest techniques for optimizing web performance, from Core Web Vitals to advanced caching strategies.',cat:'web-dev',tags:'Performance,Web Vitals,Optimization,Lighthouse',author:4,date:'2026-07-05',readTime:'11 min read',feat:false,trend:5,pick:true},
  {id:6,title:'Getting Started with Machine Learning in the Browser',slug:'machine-learning-in-the-browser',desc:'TensorFlow.js brings ML to the browser. Build intelligent applications that run entirely client-side with privacy-preserving AI features.',cat:'ai',tags:'Machine Learning,TensorFlow.js,AI,JavaScript',author:5,date:'2026-07-03',readTime:'14 min read',feat:true,trend:6,pick:false},
  {id:7,title:'The Art of Code Review: Giving and Receiving Feedback',slug:'art-of-code-review',desc:'Code review is a skill that transcends programming languages. Master the art of constructive feedback that makes your team better.',cat:'productivity',tags:'
