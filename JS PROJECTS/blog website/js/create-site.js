const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/vr604/OneDrive/Desktop/JS PROJECTS/blog website';

// Read CSS
let css = fs.readFileSync(path.join(dir, 'css', 'style.css'), 'utf8');

// ===== BUILD FUNCTIONS =====

// Article card HTML
function articleCardHTML(a) {
  const cat = CATEGORIES.find(function(c) { return c.id === a.category; });
  const catName = cat ? cat.name : a.category;
  return '<div class="article-card fade-in" onclick="navigate(\'article\',\'' + a.slug + '\')">' +
    '<div class="article-card-image">' +
      '<img src="https://picsum.photos/seed/' + a.slug + '/640/400" alt="" loading="lazy">' +
      '<span class="article-card-category">' + catName + '</span>' +
    '</div>' +
    '<div class="article-card-body">' +
      '<div class="article-card-meta">' +
        '<span>' + formatDate(a.date) + '</span>' +
        '<span class="dot"></span>' +
        '<span>' + a.readTime + '</span>' +
      '</div>' +
      '<h3 class="article-card-title">' + a.title + '</h3>' +
      '<p class="article-card-desc">' + truncate(a.description, 120) + '</p>' +
      '<div class="article-card-footer">' +
        '<div class="article-card-author">' +
          '<div class="article-card-avatar" style="background:' + a.author.color + '">' + a.author.avatar + '</div>' +
          '<span class="article-card-author-name">' + a.author.name + '</span>' +
        '</div>' +
        '<div class="article-card-actions">' +
          '<button class="article-card-action" onclick="event.stopPropagation();handleLikeBtn(this,' + a.id + ')" title="Like">\u2661</button>' +
          '<button class="article-card-action" onclick="event.stopPropagation();handleBookmarkBtn(this,' + a.id + ')" title="Bookmark">\u2606</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// Trending item HTML
function trendingHTML(a, num) {
  const catName = getCategoryName(a.category);
  return '<div class="trending-item fade-in" onclick="navigate(\'article\',\'' + a.slug + '\')">' +
    '<span class="trending-number">' + num + '</span>' +
    '<div class="trending-content">' +
      '<div class="trending-category">' + catName + '</div>' +
      '<h4 class="trending-title">' + a.title + '</h4>' +
      '<div class="trending-meta">' + formatDate(a.date) + ' \u00b7 ' + a.readTime + '</div>' +
    '</div>' +
  '</div>';
}

// Editor pick HTML
function editorHTML(a) {
  return '<div class="editor-pick-card fade-in" onclick="navigate(\'article\',\'' + a.slug + '\')">' +
    '<img src="https://picsum.photos/seed/' + a.slug + 'ep/200/200" alt="" class="editor-pick-image" loading="lazy">' +
    '<div class="editor-pick-content">' +
      '<div class="editor-pick-badge">\u2605 Editor Pick</div>' +
      '<h4 class="editor-pick-title">' + a.title + '</h4>' +
      '<div class="editor-pick-author">' + a.author.name + '</div>' +
    '</div>' +
  '</div>';
}

// We need to generate the JS as a string, not execute functions
// So let's build the complete JS as a text string

let jsContent = '';

// ===== DATA =====
jsContent += 'var AUTHORS = [';
jsContent += '{name:"Sarah Chen",role:"Senior Frontend Engineer",avatar:"SC",color:"#2563EB"},';
jsContent += '{name:"Marcus Johnson",role:"Full-Stack Developer",avatar:"MJ",color:"#7C3AED"},';
jsContent += '{name:"Aiko Tanaka",role:"UX Engineer",avatar:"AT",color:"#06B6D4"},';
jsContent += '{name:"David Park",role:"Software Architect",avatar:"DP",color:"#059669"},';
jsContent += '{name:"Emma Wilson",role:"DevOps Engineer",avatar:"EW",color:"#DC2626"},';
jsContent += '{name:"Raj Patel",role:"AI/ML Engineer",avatar:"RP",color:"#D97706"},';
jsContent += '{name:"Lisa Zhang",role:"Frontend Designer",avatar:"LZ",color:"#0891B2"},';
jsContent += '{name:"James Mitchell",role:"Technical Writer",avatar:"JM",color:"#4F46E5"}';
jsContent += '];\n';

jsContent += 'var CATEGORIES = [';
jsContent += '{id:"javascript",name:"JavaScript",icon:"\u26a1",color:"#F59E0B",bgColor:"#FEF3C7"},';
jsContent += '{id:"css",name:"CSS",icon:"\ud83c\udfa8",color:"#3B82F6",bgColor:"#DBEAFE"},';
jsContent += '{id:"html",name:"HTML",icon:"\ud83c\udf10",color:"#EF4444",bgColor:"#FEE2E2"},';
jsContent += '{id:"frontend",name:"Frontend",icon:"\ud83d\udda5",color:"#8B5CF6",bgColor:"#EDE9FE"},';
jsContent += '{id:"ui-design",name:"UI Design",icon:"\u2728",color:"#06B6D4",bgColor:"#CFFAFE"},';
jsContent += '{id:"ai",name:"AI",icon:"\ud83e\udd16",color:"#10B981",bgColor:"#D1FAE5"},';
jsContent += '{id:"productivity",name:"Productivity",icon:"\ud83d\ude80",color:"#F97316",bgColor:"#FED7AA"},';
jsContent += '{id:"web-dev",name:"Web Development",icon:"\u2699",color:"#6366F1",bgColor:"#E0E7FF"}';
jsContent += '];\n';

// Articles
var articles = JSON.parse(fs.readFileSync(path.join(dir, 'js', 'articles.json'), 'utf8'));

jsContent += 'var ARTICLES = ' + JSON.stringify(articles) + ';\n';

// We need to write articles.json separately first
fs.writeFileSync(path.join(dir, 'js', 'articles.json'), JSON.stringify(articles));

// ===== UTILITY FUNCTIONS =====
jsContent += `
function formatDate(d) {
  var opts = { year:"numeric", month:"long", day:"numeric" };
  return new Date(d).toLocaleDateString("en-US", opts);
}
function getCategoryName(id) {
  for(var i=0;i<CATEGORIES.length;i++) if(CATEGORIES[i].id===id) return CATEGORIES[i].name;
  return id;
}
function getCategoryColor(id) {
  for(var i=0;i<CATEGORIES.length;i++) if(CATEGORIES[i].id===id) return CATEGORIES[i].color;
  return "#666";
}
function truncate(s,l) {
  return s.length<=l?s:s.slice(0,l)+"...";
}
`;

// ===== LOCAL STORAGE =====
jsContent += `
function getBkm() { try { return JSON.parse(localStorage.getItem("vkb")||"[]"); } catch(e) { return []; } }
function saveBkm(b) { localStorage.setItem("vkb",JSON.stringify(b)); }
function toggleBkm(id) {
  var b=getBkm();
  if(b.indexOf(id)>-1) b=b.filter(function(i){return i!==id;}); else b.push(id);
  saveBkm(b);
  return b.indexOf(id)>-1;
}
function isBkm(id) { return getBkm().indexOf(id)>-1; }

function getLikes() { try { return JSON.parse(localStorage.getItem("vkl")||"[]"); } catch(e) { return []; } }
function saveLikes(l) { localStorage.setItem("vkl",JSON.stringify(l)); }
function toggleLike(id) {
  var l=getLikes();
  if(l.indexOf(id)>-1) l=l.filter(function(i){return i!==id;}); else l.push(id);
  saveLikes(l);
  return l.indexOf(id)>-1;
}
function isLiked(id) { return getLikes().indexOf(id)>-1; }

function getComments(aid) {
  try { return JSON.parse(localStorage.getItem("vkc_"+aid)||"[]"); } catch(e) { return []; }
}
function addComment(aid,text) {
  var c=getComments(aid);
  c.unshift({id:Date.now(),text:text,author:"You",time:new Date().toISOString(),color:"#"+Math.floor(Math.random()*16777215).toString(16)});
  localStorage.setItem("vkc_"+aid,JSON.stringify(c));
  return c;
}
function delComment(aid,cid) {
  var c=getComments(aid).filter(function(com){return com.id!==cid;});
  localStorage.setItem("vkc_"+aid,JSON.stringify(c));
  return c;
}

`;

// ===== ROUTER & RENDER =====
jsContent += `
var cr="home";
var cs=null;
var cq="";
var cf="all";

function navigate(r,d) {
  cr=r;
  if(d) { cf=d; cr="articles"; }
  render();
  window.scrollTo({top:0,behavior:"smooth"});
  document.querySelectorAll(".navbar-links a,.mobile-menu a").forEach(function(a){
    a.classList.toggle("active",a.getAttribute("data-route")===cr);
  });
}
`;

// ===== RENDER FUNCTIONS (stringified) =====
jsContent += `
function render() {
  var app=document.getElementById("app");
  document.getElementById("readingProgress").style.display="none";
  var html="";
`;

// Home render
jsContent += `
if(cr==="home") {
  var feat=ARTICLES.filter(function(a){return a.featured;});
  var trend=ARTICLES.filter(function(a){return a.trending;}).sort(function(a,b){return a.trending-b.trending;});
  var latest
