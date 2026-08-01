// ============================================
// VKS Blog - Complete Application
// ============================================

// ===== DATA =====
var AUTHORS = [
  {name:"Sarah Chen",role:"Senior Frontend Engineer",avatar:"SC",color:"#2563EB"},
  {name:"Marcus Johnson",role:"Full-Stack Developer",avatar:"MJ",color:"#7C3AED"},
  {name:"Aiko Tanaka",role:"UX Engineer",avatar:"AT",color:"#06B6D4"},
  {name:"David Park",role:"Software Architect",avatar:"DP",color:"#059669"},
  {name:"Emma Wilson",role:"DevOps Engineer",avatar:"EW",color:"#DC2626"},
  {name:"Raj Patel",role:"AI/ML Engineer",avatar:"RP",color:"#D97706"},
  {name:"Lisa Zhang",role:"Frontend Designer",avatar:"LZ",color:"#0891B2"},
  {name:"James Mitchell",role:"Technical Writer",avatar:"JM",color:"#4F46E5"}
];

var CATEGORIES = [
  {id:"javascript",name:"JavaScript",icon:"\u26a1",color:"#F59E0B",bgColor:"#FEF3C7"},
  {id:"css",name:"CSS",icon:"\ud83c\udfa8",color:"#3B82F6",bgColor:"#DBEAFE"},
  {id:"html",name:"HTML",icon:"\ud83c\udf10",color:"#EF4444",bgColor:"#FEE2E2"},
  {id:"frontend",name:"Frontend",icon:"\ud83d\udda5\ufe0f",color:"#8B5CF6",bgColor:"#EDE9FE"},
  {id:"ui-design",name:"UI Design",icon:"\u2728",color:"#06B6D4",bgColor:"#CFFAFE"},
  {id:"ai",name:"AI",icon:"\ud83e\udd16",color:"#10B981",bgColor:"#D1FAE5"},
  {id:"productivity",name:"Productivity",icon:"\ud83d\ude80",color:"#F97316",bgColor:"#FED7AA"},
  {id:"web-dev",name:"Web Development",icon:"\u2699\ufe0f",color:"#6366F1",bgColor:"#E0E7FF"}
];


// ===== ARTICLES DATA =====
var ARTICLES = [
  {id:1,title:"The Future of CSS: Container Queries and Style Queries",slug:"future-of-css-container-queries",description:"Container queries are revolutionizing responsive design. Learn how to build truly component-driven layouts.",category:"css",tags:["CSS","Responsive Design","Container Queries"],author:AUTHORS[0],date:"2026-07-15",readTime:"8 min",featured:true,trending:1,editorPick:true},
  {id:2,title:"Building Accessible Web Applications: A Practical Guide",slug:"building-accessible-web-applications",description:"Accessibility is not optional. Discover the essential patterns for creating web applications that work for everyone.",category:"html",tags:["Accessibility","A11y","HTML"],author:AUTHORS[1],date:"2026-07-12",readTime:"10 min",featured:true,trending:2,editorPick:true},
  {id:3,title:"Mastering JavaScript Promises and Async/Await",slug:"mastering-javascript-promises-async-await",description:"Dive deep into asynchronous JavaScript. From callbacks to promises to async/await, learn the patterns every developer must know.",category:"javascript",tags:["JavaScript","Async","Promises"],author:AUTHORS[2],date:"2026-07-10",readTime:"12 min",featured:false,trending:3,editorPick:true},
  {id:4,title:"Designing with Design Tokens",slug:"designing-with-design-tokens",description:"Design tokens bridge the gap between design and development. Learn how to implement a scalable design token system.",category:"ui-design",tags:["Design Tokens","Design Systems","CSS Variables"],author:AUTHORS[3],date:"2026-07-08",readTime:"9 min",featured:false,trending:4,editorPick:false},
  {id:5,title:"Web Performance Optimization in 2026",slug:"web-performance-optimization-2026",description:"Speed matters more than ever. Explore the latest techniques for optimizing web performance.",category:"web-dev",tags:["Performance","Web Vitals","Optimization"],author:AUTHORS[4],date:"2026-07-05",readTime:"11 min",featured:false,trending:5,editorPick:true},
  {id:6,title:"Machine Learning in the Browser",slug:"machine-learning-in-the-browser",description:"TensorFlow.js brings ML to the browser. Build intelligent applications that run entirely client-side.",category:"ai",tags:["Machine Learning","TensorFlow.js","AI"],author:AUTHORS[5],date:"2026-07-03",readTime:"14 min",featured:true,trending:6,editorPick:false},
  {id:7,title:"The Art of Code Review",slug:"art-of-code-review",description:"Code review is a skill that transcends programming languages. Master the art of constructive feedback.",category:"productivity",tags:["Code Review","Teamwork","Best Practices"],author:AUTHORS[6],date:"2026-06-30",readTime:"7 min",featured:false,trending:7,editorPick:true},
  {id:8,title:"CSS Grid vs Flexbox: When to Use Which",slug:"css-grid-vs-flexbox",description:"Two powerful layout systems, each with its strengths. Master the decision framework for choosing between them.",category:"css",tags:["CSS","Grid","Flexbox"],author:AUTHORS[7],date:"2026-06-28",readTime:"6 min",featured:false,trending:8,editorPick:false},
  {id:9,title:"Understanding JavaScript Closures",slug:"understanding-javascript-closures",description:"Closures are one of JavaScript most powerful features. Unlock their potential with practical examples.",category:"javascript",tags:["JavaScript","Closures","Scope"],author:AUTHORS[0],date:"2026-06-25",readTime:"10 min",featured:false,trending:9,editorPick:false},
  {id:10,title:"Data Visualizations with D3.js",slug:"creating-data-visualizations-d3",description:"Transform data into stunning visual stories. Learn the fundamentals of D3.js for the web.",category:"frontend",tags:["D3.js","Data Visualization","SVG"],author:AUTHORS[2],date:"2026-06-22",readTime:"13 min",featured:false,trending:10,editorPick:false},
  {id:11,title:"HTML Semantics: Beyond the Basics",slug:"html-semantics-beyond-basics",description:"Modern HTML offers rich semantic elements that improve accessibility, SEO, and code maintainability.",category:"html",tags:["HTML","Semantics","SEO"],author:AUTHORS[3],date:"2026-06-19",readTime:"7 min",featured:false,trending:11,editorPick:false},
  {id:12,title:"Microservices vs Monoliths",slug:"microservices-vs-monoliths",description:"The architecture debate continues. Learn the trade-offs between microservices and monolithic architectures.",category:"web-dev",tags:["Architecture","Microservices","Monolith"],author:AUTHORS[1],date:"2026-06-16",readTime:"9 min",featured:false,trending:12,editorPick:false},
  {id:13,title:"The Psychology of Color in UI Design",slug:"psychology-of-color-ui-design",description:"Color influences emotion, behavior, and usability. Understand the psychology behind effective color choices.",category:"ui-design",tags:["Color Theory","UI Design","Psychology"],author:AUTHORS[6],date:"2026-06-13",readTime:"8 min",featured:false,trending:13,editorPick:false},
  {id:14,title:"Automating with GitHub Actions",slug:"automating-workflow-github-actions",description:"CI/CD pipelines streamline development. Learn to set up GitHub Actions for testing and deployment.",category:"productivity",tags:["GitHub Actions","CI/CD","DevOps"],author:AUTHORS[4],date:"2026-06-10",readTime:"10 min",featured:false,trending:14,editorPick:false},
  {id:15,title:"Real-Time Applications with WebSockets",slug:"building-realtime-applications-websockets",description:"Real-time features are expected in modern apps. Explore WebSockets and build live-updating experiences.",category:"frontend",tags:["WebSockets","Real-time","Web API"],author:AUTHORS[5],date:"2026-06-07",readTime:"11 min",featured:true,trending:15,editorPick:true}
];

// ===== NAVBAR RENDERING =====
var navbarHTML = 
  '<nav class="navbar" id="navbar"><div class="navbar-inner">' +
  '<div class="navbar-logo" onclick="navigate(\'home\')"><span class="logo-icon">V</span><span>VKS Blog</span></div>' +
  '<div class="navbar-links">' +
  '<a onclick="navigate(\'home\')" data-route="home">Home</a>' +
  '<a onclick="navigate(\'articles\')" data-route="articles">Articles</a>' +
  '<a onclick="navigate(\'categories\')" data-route="categories">Categories</a>' +
  '<a onclick="navigate(\'bookmarks\')" data-route="bookmarks">Bookmarks</a>' +
  '</div>' +
  '<div class="navbar-actions">' +
  '<button class="navbar-search-btn" onclick="toggleSearch()" title="Search">\ud83d\udd0d</button>' +
  '<button class="navbar-menu-btn" onclick="toggleMobileMenu()" title="Menu">\u2630</button>' +
  '</div></div></nav>' +
  '<div class="mobile-menu" id="mobileMenu">' +
  '<a onclick="navigate(\'home\');toggleMobileMenu()">Home</a>' +
  '<a onclick="navigate(\'articles\');toggleMobileMenu()">Articles</a>' +
  '<a onclick="navigate(\'categories\');toggleMobileMenu()">Categories</a>' +
  '<a onclick="navigate(\'bookmarks\');toggleMobileMenu()">Bookmarks</a>' +
  '</div>' +
  '<div class="reading-progress" id="readingProgress">' +
  '<div class="reading-progress-bar" id="readingProgressBar"></div></div>';


// ===== UTILITY FUNCTIONS =====
function formatDate(d) {
  var opts = { year:"numeric", month:"long", day:"numeric" };
  return new Date(d).toLocaleDateString("en-US", opts);
}

function getCategoryName(id) {
  for(var i=0;i<CATEGORIES.length;i++) {
    if(CATEGORIES[i].id===id) return CATEGORIES[i].name;
  }
  return id;
}

function getCategoryColor(id) {
  for(var i=0;i<CATEGORIES.length;i++) {
    if(CATEGORIES[i].id===id) return CATEGORIES[i].color;
  }
  return "#666";
}

function getCategoryBg(id) {
  for(var i=0;i<CATEGORIES.length;i++) {
    if(CATEGORIES[i].id===id) return CATEGORIES[i].bgColor;
  }
  return "#eee";
}

function truncate(s,l) {
  if(s.length<=l) return s;
  return s.slice(0,l)+"...";
}

// ===== LOCAL STORAGE HELPERS =====
function getBookmarks() {
  try { return JSON.parse(localStorage.getItem("vks_bm")||"[]"); }
  catch(e) { return []; }
}

function toggleBookmark(id) {
  var b=getBookmarks();
  var idx=b.indexOf(id);
  if(idx>-1) b.splice(idx,1); else b.push(id);
  localStorage.setItem("vks_bm",JSON.stringify(b));
  return b.indexOf(id)>-1;
}

function isBookmarked(id) {
  return getBookmarks().indexOf(id)>-1;
}

function getLikes() {
  try { return JSON.parse(localStorage.getItem("vks_lk")||"[]"); }
  catch(e) { return []; }
}

function toggleLike(id) {
  var l=getLikes();
  var idx=l.indexOf(id);
  if(idx>-1) l.splice(idx,1); else l.push(id);
  localStorage.setItem("vks_lk",JSON.stringify(l));
  return l.indexOf(id)>-1;
}

function isLiked(id) {
  return getLikes().indexOf(id)>-1;
}

function getComments(aid) {
  try { return JSON.parse(localStorage.getItem("vks_cm_"+aid)||"[]"); }
  catch(e) { return []; }
}

function addComment(aid,text) {
  var c=getComments(aid);
  c.unshift({id:Date.now(),text:text,author:"You",time:new Date().toISOString(),color:"#"+Math.floor(Math.random()*16777215).toString(16)});
  localStorage.setItem("vks_cm_"+aid,JSON.stringify(c));
  return c;
}

function deleteComment(aid,cid) {
  var c=getComments(aid);
  var filtered=[];
  for(var i=0;i<c.length;i++) {
    if(c[i].id!==cid) filtered.push(c[i]);
  }
  localStorage.setItem("vks_cm_"+aid,JSON.stringify(filtered));
  return filtered;
}

function getNewsletter() {
  try { return JSON.parse(localStorage.getItem("vks_nl")||"[]"); }
  catch(e) { return []; }
}

function subscribeNewsletter(email) {
  var e=getNewsletter();
  if(e.indexOf(email)<0) e.push(email);
  localStorage.setItem("vks_nl",JSON.stringify(e));
}


// ===== ARTICLE CARD RENDERER =====
function renderArticleCard(a) {
  var catName=getCategoryName(a.category);
  var liked=isLiked(a.id);
  var bkm=isBookmarked(a.id);
  return '<div class="article-card fade-in" onclick="navigateToArticle(\''+a.slug+'\')">' +
    '<div class="article-card-image">' +
      '<img src="https://picsum.photos/seed/'+a.slug+'/640/400" alt="" loading="lazy">' +
      '<span class="article-card-category">'+catName+'</span>' +
    '</div>' +
    '<div class="article-card-body">' +
      '<div class="article-card-meta"><span>'+formatDate(a.date)+'</span><span class="dot"></span><span>'+a.readTime+'</span></div>' +
      '<h3 class="article-card-title">'+a.title+'</h3>' +
      '<p class="article-card-desc">'+truncate(a.description,120)+'</p>' +
      '<div class="article-card-footer">' +
        '<div class="article-card-author">' +
          '<div class="article-card-avatar" style="background:'+a.author.color+'">'+a.author.avatar+'</div>' +
          '<span class="article-card-author-name">'+a.author.name+'</span>' +
        '</div>' +
        '<div class="article-card-actions">' +
          '<button class="article-card-action'+(liked?' liked':'')+'" onclick="event.stopPropagation();handleLikeBtn(this,'+a.id+')" title="Like">\u2665</button>' +
          '<button class="article-card-action'+(bkm?' bookmarked':'')+'" onclick="event.stopPropagation();handleBookmarkBtn(this,'+a.id+')" title="Bookmark">\u2605</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderTrendingItem(a,num) {
  var catName=getCategoryName(a.category);
  return '<div class="trending-item fade-in" onclick="navigateToArticle(\''+a.slug+'\')">' +
    '<span class="trending-number">'+num+'</span>' +
    '<div class="trending-content">' +
      '<div class="trending-category">'+catName+'</div>' +
      '<h4 class="trending-title">'+a.title+'</h4>' +
      '<div class="trending-meta">'+formatDate(a.date)+' \u00b7 '+a.readTime+'</div>' +
    '</div>' +
  '</div>';
}

function renderEditorPick(a) {
  return '<div class="editor-pick-card fade-in" onclick="navigateToArticle(\''+a.slug+'\')">' +
    '<img src="https://picsum.photos/seed/'+a.slug+'ep/200/200" alt="" class="editor-pick-image" loading="lazy">' +
    '<div class="editor-pick-content">' +
      '<div class="editor-pick-badge">\u2605 Editor Pick</div>' +
      '<h4 class="editor-pick-title">'+a.title+'</h4>' +
      '<div class="editor-pick-author">'+a.author.name+'</div>' +
    '</div>' +
  '</div>';
}

// ===== NAVIGATION =====
var currentRoute = "home";
var currentSlug = null;
var currentSearch = "";
var currentCategory = "all";

function navigate(route, data) {
  if(route==="article" && data) {
    currentRoute = "article";
    currentSlug = data;
  } else if(route==="articles" && data) {
    currentRoute = "articles";
    currentCategory = data;
    currentSearch = "";
  } else {
    currentRoute = route;
    if(route!=="articles") { currentCategory="all"; currentSearch=""; }
  }
  render();
  window.scrollTo({top:0,behavior:"smooth"});
  // Update active nav links
  var links=document.querySelectorAll(".navbar-links a, .mobile-menu a");
  for(var i=0;i<links.length;i++) {
    var r=links[i].getAttribute("data-route");
    links[i].classList.toggle("active",r===currentRoute);
  }
}

function navigateToArticle(slug) {
  navigate("article", slug);
}

// ===== RENDER ENGINE =====
function render() {
  var app=document.getElementById("app");
  var rp=document.getElementById("readingProgress");
  if(rp) rp.style.display="none";
  
  if(currentRoute==="home") renderHome(app);
  else if(currentRoute==="articles") renderArticles(app);
  else if(currentRoute==="article") renderSingleArticle(app);
  else if(currentRoute==="categories") renderCategoriesPage(app);
  else if(currentRoute==="bookmarks") renderBookmarksPage(app);
  else renderNotFound(app);
  
  setTimeout(initAnimations, 100);
}

// ===== HOME PAGE =====
function renderHome(app) {
  var trend=ARTICLES.slice().sort(function(a,b){return a.trending-b.trending;});
  var latest=ARTICLES.slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);});
  var picks=ARTICLES.filter(function(a){return a.editorPick;});
  var featured=ARTICLES.filter(function(a){return a.featured;});
  
  var html='';
  // Hero
  html+='<section class="hero"><div class="container"><div class="hero-content">';
  html+='<div class="hero-badge fade-in">\ud83d\udd25 Featured Story</div>';
  html+='<h1 class="hero-title fade-in">Where Ideas <br><span class="text-gradient">Meet Code</span></h1>';
  html+='<p class="hero-description fade-in">Exploring the frontiers of web development, design, and technology. Premium content crafted for developers who care about quality.</p>';
  html+='<div class="hero-actions fade-in"><button class="btn btn-primary btn-lg" onclick="navigate(\'articles\')">Explore Articles \u2192</button><button class="btn btn-secondary btn-lg" onclick="document.getElementById(\'newsletter\').scrollIntoView({behavior:\'smooth\'})">Subscribe</button></div>';
  html+='<div class="hero-stats fade-in"><div><div class="hero-stat-number">'+ARTICLES.length+'+</div><div class="hero-stat-label">Articles</div></div><div><div class="hero-stat-number">'+AUTHORS.length+'</div><div class="hero-stat-label">Authors</div></div><div><div class="hero-stat-number">'+CATEGORIES.length+'</div><div class="hero-stat-label">Categories</div></div></div>';
  html+='</div></div></section>';
  
  // Featured
  if(featured.length>0) {
    var fa=featured[0];
    html+='<section class="section"><div class="container">';
    html+='<div class="section-header fade-in"><div class="section-header-left"><div class="section-label">Featured</div><h2 class="section-title">Editor\'s Choice</h2><p class="section-subtitle">Handpicked articles that showcase exceptional insight.</p></div></div>';
    html+='<div class="featured-article fade-in" onclick="navigateToArticle(\''+fa.slug+'\')">';
    html+='<div class="featured-article-image"><img src="https://picsum.photos/seed/'+fa.slug+'feat/800/500" alt="" loading="lazy"><span class="featured-article-badge">'+getCategoryName(fa.category)+'</span></div>';
    html+='<div class="featured-article-content"><div class="featured-article-meta"><span>'+fa.author.name+'</span><span class="dot"></span><span>'+formatDate(fa.date)+'</span><span class="dot"></span><span>'+fa.readTime+'</span></div>';
    html+='<h3 class="featured-article-title">'+fa.title+'</h3><p class="featured-article-desc">'+truncate(fa.description,200)+'</p>';
    html+='<div class="featured-article-footer"><button class="btn btn-primary" onclick="event.stopPropagation();navigateToArticle(\''+fa.slug+'\')">Read Article \u2192</button></div></div></div></div></section>';
  }
  
  // Trending
  html+='<section class="section" style="background:var(--bg-section-alt)"><div class="container"><div class="section-header fade-in"><div class="section-header-left"><div class="section-label">Trending</div><h2 class="section-title">Most Popular</h2><p class="section-subtitle">What developers are reading right now.</p></div></div><div class="trending-list stagger-children">';
  for(var i=0;i<Math.min(6,trend.length);i++) html+=renderTrendingItem(trend[i],i+1);
  html+='</div></div></section>';
  
  // Latest
  html+='<section class="section"><div class="container"><div class="section-header fade-in"><div class="section-header-left"><div class="section-label">Latest</div><h2 class="section-title">Recent Articles</h2><p class="section-subtitle">Stay up to date with the latest in web development.</p></div><div class="section-header-right"><button class="btn btn-secondary" onclick="navigate(\'articles\')">View All \u2192</button></div></div><div class="articles-grid stagger-children">';
  for(var i=0;i<Math.min(6,latest.length);i++) html+=renderArticleCard(latest[i]);
  html+='</div></div></section>';
  
  // Categories
  html+='<section class="section" style="background:var(--bg-section-alt)"><div class="container"><div class="section-header fade-in"><div class="section-header-left"><div class="section-label">Categories</div><h2 class="section-title">Browse Topics</h2><p class="section-subtitle">Explore articles organized by topic.</p></div></div><div class="categories-grid stagger-children">';
  for(var i=0;i<CATEGORIES.length;i++) {
    var c=CATEGORIES[i];
    var count=0;
    for(var j=0;j<ARTICLES.length;j++) { if(ARTICLES[j].category===c.id) count++; }
    html+='<div class="category-card" onclick="navigate(\'articles\',\''+c.id+'\')"><div class="category-icon" style="background:'+c.bgColor+';color:'+c.color+'">'+c.icon+'</div><span class="category-name">'+c.name+'</span><span class="category-count">'+count+' articles</span></div>';
  }
  html+='</div></div></section>';
  
  // Newsletter
  html+='<section class="section newsletter-section" id="newsletter"><div class="container-narrow"><div class="newsletter-card fade-in">';
  html+='<div class="section-label" style="justify-content:center">Newsletter</div>';
  html+='<h2 class="section-title" style="text-align:center;font-size:clamp(1.5rem,3vw,2rem)">Stay Updated</h2>';
  html+='<p class="section-subtitle" style="text-align:center;margin:0 auto 32px">Get the latest articles delivered to your inbox.</p>';
  html+='<div class="newsletter-form"><input type="email" id="nlInput" placeholder="Enter your email" class="newsletter-input"><button class="btn btn-primary" onclick="handleNewsletter()">Subscribe</button></div>';
  html+='<div class="newsletter-success" id="nlSuccess">Thanks for subscribing!</div>';
  html+='</div></div></section>';
  
  app.innerHTML=navbarHTML+html+footerHTML;
}

// ===== ARTICLES LISTING PAGE =====
function renderArticles(app) {
  var filtered=[];
  for(var i=0;i<ARTICLES.length;i++) {
    var match=true;
    if(currentCategory!=="all" && ARTICLES[i].category!==currentCategory) match=false;
    if(currentSearch!=="") {
      var q=currentSearch.toLowerCase();
      var a=ARTICLES[i];
      if(a.title.toLowerCase().indexOf(q)<0 && a.description.toLowerCase().indexOf(q)<0 &&
         a.category.toLowerCase().indexOf(q)<0 && a.author.name.toLowerCase().indexOf(q)<0) {
        var tagMatch=false;
        for(var t=0;t<a.tags.length;t++) { if(a.tags[t].toLowerCase().indexOf(q)>=0) tagMatch=true; }
        if(!tagMatch) match=false;
      }
    }
    if(match) filtered.push(ARTICLES[i]);
  }
  
  var html='';
  html+='<section class="page-header"><div class="container"><div class="page-header-content fade-in">';
  html+='<h1 class="page-header-title">'+(currentSearch?"Search Results":"All Articles")+'</h1>';
  html+='<p class="page-header-desc">'+(currentSearch?'Showing results for "'+currentSearch+'"':'Browse our collection of premium developer content.')+'</p>';
  html+='</div></div></section>';
  
  html+='<section class="section"><div class="container">';
  html+='<div class="search-bar fade-in">';
  html+='<span class="search-bar-icon">\ud83d\udd0d</span>';
  html+='<input type="text" class="search-bar-input" id="searchInput" placeholder="Search articles by title, topic, author..." value="'+currentSearch+'" oninput="handleSearchInput(this.value)">';
  html+='</div>';
  
  html+='<div class="category-filters fade-in">';
  html+='<button class="category-filter'+(currentCategory==="all"?" active":"")+'" onclick="currentCategory=\'all\';render();window.scrollTo({top:0,behavior:\'smooth\'})">All</button>';
  for(var i=0;i<CATEGORIES.length;i++) {
    var c=CATEGORIES[i];
    html+='<button class="category-filter'+(currentCategory===c.id?" active":"")+'" onclick="currentCategory=\''+c.id+'\';currentSearch=\'\';render();window.scrollTo({top:0,behavior:\'smooth\'})">'+c.name+'</button>';
  }
  html+='</div>';
  
  if(filtered.length===0) {
    html+='<div class="empty-state fade-in"><div class="empty-state-icon">\ud83d\udd0d</div><h3 class="empty-state-title">No articles found</h3><p class="empty-state-desc">Try adjusting your search or filter.</p><button class="btn btn-primary" onclick="currentSearch=\'\';currentCategory=\'all\';render()">Clear Filters</button></div>';
  } else {
    filtered.sort(function(a,b){return new Date(b.date)-new Date(a.date);});
    html+='<div class="articles-grid stagger-children">';
    for(var i=0;i<filtered.length;i++) html+=renderArticleCard(filtered[i]);
    html+='</div>';
  }
  html+='</div></section>';
  
  app.innerHTML=navbarHTML+html+footerHTML;
}

// ===== SINGLE ARTICLE PAGE =====
function renderSingleArticle(app) {
  var article=null;
  for(var i=0;i<ARTICLES.length;i++) { if(ARTICLES[i].slug===currentSlug) { article=ARTICLES[i]; break; } }
  if(!article) { renderNotFound(app); return; }
  
  var comments=getComments(article.id);
  var related=[];
  for(var i=0;i<ARTICLES.length;i++) { if(ARTICLES[i].category===article.category && ARTICLES[i].id!==article.id && related.length<3) related.push(ARTICLES[i]); }
  
  var html='';
  html+='<section class="article-hero"><div class="container-narrow">';
  html+='<div class="article-hero-content fade-in">';
  html+='<div class="article-hero-category" style="background:'+getCategoryColor(article.category)+'15;color:'+getCategoryColor(article.category)+'">'+getCategoryName(article.category)+'</div>';
  html+='<h1 class="article-hero-title">'+article.title+'</h1>';
  html+='<div class="article-hero-meta"><span>'+article.author.name+'</span><span class="dot"></span><span>'+formatDate(article.date)+'</span><span class="dot"></span><span>'+article.readTime+'</span></div>';
  html+='</div>';
  html+='<img src="https://picsum.photos/seed/'+article.slug+'hero/1200/600" alt="" class="article-hero-image fade-in" loading="lazy">';
  html+='</div></section>';
  
  html+='<section class="section" style="padding-top:0"><div class="container-narrow">';
  html+='<div class="article-author-section fade-in"><div class="article-author-info"><div class="article-author-avatar" style="background:'+article.author.color+'">'+article.author.avatar+'</div><div><div class="article-author-name">'+article.author.name+'</div><div class="article-author-role">'+article.author.role+'</div></div></div>';
  html+='<div class="share-buttons"><button class="share-btn" onclick="navigator.clipboard.writeText(window.location.href);alert(\'Link copied!\')" title="Copy link">\ud83d\udd17</button><button class="share-btn" onclick="window.open(\'https://twitter.com/intent/tweet?text='+encodeURIComponent(article.title)+'\')" title="Share">\ud835\uddd7</button></div></div>';
  
  // Article body (simplified)
  html+='<div class="article-body fade-in">';
  html+='<p>'+article.description+'</p>';
  html+='<p>This is a premium article from VKS Blog. In the full version, you would find in-depth coverage of '+article.title.toLowerCase()+', including code examples, expert insights, and practical implementation strategies.</p>';
  html+='<h2>Key Takeaways</h2>';
  html+='<ul>';
  for(var t=0;t<article.tags.length;t++) { html+='<li><strong>'+article.tags[t]+'</strong> - Deep dive into this topic with practical examples and best practices.</li>'; }
  html+='</ul>';
  html+='<blockquote>Great content is about delivering real value to readers. Every article on VKS Blog is crafted with care and attention to detail.</blockquote>';
  html+='<p>Stay tuned for more articles on this topic. Subscribe to our newsletter to get notified when new content is published.</p>';
  html+='</div>';
  
  // Tags
  html+='<div class="article-tags fade-in">';
  for(var t=0;t<article.tags.length;t++) { html+='<span class="article-tag">#'+article.tags[t].replace(/\s/g,'')+'</span>'; }
  html+='</div>';
  
  // Comments
  html+='<div class="comments-section fade-in">';
  html+='<h3 class="comments-title">Comments ('+comments.length+')</h3>';
  html+='<div class="comment-form"><textarea id="cmtInput" placeholder="Share your thoughts..." rows="3"></textarea></div>';
  html+='<button class="btn btn-primary btn-sm" onclick="addArticleComment('+article.id+')">Post Comment</button>';
  html+='<div style="margin-top:32px">';
  for(var c=0;c<comments.length;c++) {
    var co=comments[c];
    html+='<div class="comment-item"><div class="comment-avatar" style="background:'+(co.color||"#666")+'">'+(co.author[0]||"?")+'</div><div class="comment-body"><div><span class="comment-author">'+co.author+'</span><span class="comment-time">'+formatDate(co.time.split("T")[0])+'</span></div><div class="comment-text">'+co.text+'</div><button class="comment-delete" onclick="deleteArticleComment('+article.id+','+co.id+')">Delete</button></div></div>';
  }
  html+='</div></div></div></section>';
  
  // Related
  if(related.length>0) {
    html+='<section class="section" style="background:var(--bg-section-alt);padding-top:60px;padding-bottom:60px"><div class="container"><div class="section-header fade-in"><div class="section-header-left"><div class="section-label">Related</div><h2 class="section-title">More in '+getCategoryName(article.category)+'</h2></div></div><div class="articles-grid">';
    for(var r=0;r<related.length;r++) html+=renderArticleCard(related[r]);
    html+='</div></div></section>';
  }
  
  app.innerHTML=navbarHTML+html+footerHTML;
  
  // Reading progress
  var rp=document.getElementById("readingProgress");
  if(rp) rp.style.display="block";
  window.addEventListener("scroll", function progHandler() {
    var scrollY=window.scrollY || window.pageYOffset;
    var docH=document.documentElement.scrollHeight-window.innerHeight;
    var pct=docH>0?(scrollY/docH)*100:0;
    var bar=document.getElementById("readingProgressBar");
    if(bar) bar.style.width=Math.min(pct,100)+"%";
  });
}


// ===== CATEGORIES PAGE =====
function renderCategoriesPage(app) {
  var html='';
  html+='<section class="page-header"><div class="container"><div class="page-header-content fade-in">';
  html+='<h1 class="page-header-title">Categories</h1>';
  html+='<p class="page-header-desc">Explore articles organized by topic. Find exactly what you are looking for.</p>';
  html+='</div></div></section>';
  html+='<section class="section"><div class="container"><div class="categories-grid stagger-children">';
  for(var i=0;i<CATEGORIES.length;i++) {
    var c=CATEGORIES[i];
    var count=0;
    for(var j=0;j<ARTICLES.length;j++) { if(ARTICLES[j].category===c.id) count++; }
    html+='<div class="category-card" onclick="navigate(\'articles\',\''+c.id+'\')"><div class="category-icon" style="background:'+c.bgColor+';color:'+c.color+'">'+c.icon+'</div><span class="category-name">'+c.name+'</span><span class="category-count">'+count+' articles</span></div>';
  }
  html+='</div></div></section>';
  app.innerHTML=navbarHTML+html+footerHTML;
}

// ===== BOOKMARKS PAGE =====
function renderBookmarksPage(app) {
  var ids=getBookmarks();
  var articles=[];
  for(var i=0;i<ARTICLES.length;i++) {
    for(var j=0;j<ids.length;j++) { if(ARTICLES[i].id===ids[j]) { articles.push(ARTICLES[i]); break; } }
  }
  var html='';
  html+='<section class="page-header"><div class="container"><div class="page-header-content fade-in">';
  html+='<h1 class="page-header-title">Bookmarks</h1>';
  html+='<p class="page-header-desc">Your saved articles for later reading.</p>';
  html+='</div></div></section>';
  html+='<section class="section"><div class="container">';
  if(articles.length===0) {
    html+='<div class="empty-state fade-in"><div class="empty-state-icon">\u2606</div><h3 class="empty-state-title">No bookmarks yet</h3><p class="empty-state-desc">Start saving articles by clicking the bookmark icon.</p><button class="btn btn-primary" onclick="navigate(\'articles\')">Browse Articles \u2192</button></div>';
  } else {
    html+='<p class="fade-in" style="margin-bottom:24px;color:var(--text-tertiary)">'+articles.length+' saved article'+(articles.length>1?'s':'')+'</p><div class="articles-grid stagger-children">';
    for(var i=0;i<articles.length;i++) html+=renderArticleCard(articles[i]);
    html+='</div>';
  }
  html+='</div></section>';
  app.innerHTML=navbarHTML+html+footerHTML;
}

// ===== 404 PAGE =====
function renderNotFound(app) {
  app.innerHTML=navbarHTML+'<div class="page-404"><div><div class="page-404-number fade-in">404</div><h2 class="page-404-title fade-in">Page Not Found</h2><p class="page-404-desc fade-in">The page you are looking for does not exist.</p><button class="btn btn-primary btn-lg fade-in" onclick="navigate(\'home\')">Go Home \u2192</button></div></div>'+footerHTML;
}


// ===== FOOTER HTML =====
var footerHTML = '<footer class="footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><div class="navbar-logo" style="cursor:default"><span class="logo-icon">V</span><span>VKS Blog</span></div><p>A premium developer blog exploring the latest in web development, design, and technology.</p><div class="footer-social"><a href="#" title="Twitter">\ud835\uddd7</a><a href="#" title="GitHub">\ud83d\udcbb</a><a href="#" title="LinkedIn">\ud83d\udc64</a></div></div><div><h4 class="footer-heading">Navigation</h4><ul class="footer-links"><li><a onclick="navigate(\'home\')">Home</a></li><li><a onclick="navigate(\'articles\')">Articles</a></li><li><a onclick="navigate(\'categories\')">Categories</a></li></ul></div><div><h4 class="footer-heading">Categories</h4><ul class="footer-links" id="footerCats"></ul></div><div><h4 class="footer-heading">Support</h4><ul class="footer-links"><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li><li><a href="#">Contact</a></li></ul></div></div><div class="footer-bottom"><p class="footer-copyright">\u00a9 2026 VKS Blog. All rights reserved.</p><div class="footer-bottom-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div></div></div></footer>';

// ===== EVENT HANDLERS =====
function handleSearchInput(value) {
  currentSearch = value;
  render();
}

function handleLikeBtn(btn, id) {
  var liked = toggleLike(id);
  if(liked) { btn.classList.add("liked"); btn.innerHTML="\u2665"; }
  else { btn.classList.remove("liked"); btn.innerHTML="\u2661"; }
}

function handleBookmarkBtn(btn, id) {
  var bkm = toggleBookmark(id);
  if(bkm) { btn.classList.add("bookmarked"); btn.innerHTML="\u2605"; }
  else { btn.classList.remove("bookmarked"); btn.innerHTML="\u2606"; }
}

function handleNewsletter() {
  var input = document.getElementById("nlInput");
  if(!input) return;
  var email = input.value.trim();
  var success = document.getElementById("nlSuccess");
  if(email && email.indexOf("@")>0) {
    subscribeNewsletter(email);
    input.value = "";
    if(success) {
      success.classList.add("show");
      setTimeout(function(){ success.classList.remove("show"); }, 4000);
    }
  } else {
    alert("Please enter a valid email address.");
  }
}

function addArticleComment(aid) {
  var input = document.getElementById("cmtInput");
  if(!input) return;
  var text = input.value.trim();
  if(text) {
    addComment(aid, text);
    input.value = "";
    render();
  }
}

function deleteArticleComment(aid, cid) {
  if(confirm("Delete this comment?")) {
    deleteComment(aid, cid);
    render();
  }
}

function toggleSearch() {
  if(currentRoute==="articles") {
    var inp = document.getElementById("searchInput");
    if(inp) { inp.focus(); inp.select(); }
  } else {
    navigate("articles");
  }
}

function toggleMobileMenu() {
  var menu = document.getElementById("mobileMenu");
  if(menu) menu.classList.toggle("open");
}

// ===== ANIMATIONS =====
function initAnimations() {
  var els = document.querySelectorAll(".fade-in");
  for(var i=0;i<els.length;i++) {
    (function(el) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if(e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(el);
    })(els[i]);
  }
  
  var stagers = document.querySelectorAll(".stagger-children");
  for(var i=0;i<stagers.length;i++) {
    (function(el) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if(e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(el);
    })(stagers[i]);
  }
}

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener("scroll", function() {
  var nav = document.getElementById("navbar");
  if(nav) {
    if(window.scrollY > 20) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
});

// ===== INIT =====
(function init() {
  // Populate footer categories
  var fc = document.getElementById("footerCats");
  if(fc) {
    for(var i=0;i<CATEGORIES.length;i++) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#";
      a.onclick = (function(cid) { return function() { navigate("articles", cid); return false; }; })(CATEGORIES[i].id);
      a.textContent = CATEGORIES[i].name;
      li.appendChild(a);
      fc.appendChild(li);
    }
  }
  
  // Initial render
  render();
  
  console.log("VKS Blog loaded successfully! Articles:", ARTICLES.length);
})();

