const fs = require('fs');
const p = require('path');
const dir = 'C:/Users/vr604/OneDrive/Desktop/JS PROJECTS/blog website';

// Read CSS file
let css = fs.readFileSync(p.join(dir, 'css', 'style.css'), 'utf8');
// Minify CSS for embedding
css = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();

// Build HTML
let html = '<!DOCTYPE html><html lang="en"><head>';
html += '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">';
html += '<title>VKS Blog - Premium Developer Blog</title>';
html += '<meta name="description" content="A premium blog about web development, design, and technology.">';
html += '<link rel="preconnect" href="https://fonts.googleapis.com">';
html += '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
html += '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">';
html += '<style>' + css + '</style></head><body>';

// Navbar
html += '<nav class="navbar" id="navbar"><div class="navbar-inner">';
html += '<div class="navbar-logo" onclick="navigate(\'home\')"><span class="logo-icon">V</span><span>VKS Blog</span></div>';
html += '<div class="navbar-links"><a onclick="navigate(\'home\')" data-route="home">Home</a><a onclick="navigate(\'articles\')" data-route="articles">Articles</a><a onclick="navigate(\'categories\')" data-route="categories">Categories</a><a onclick="navigate(\'bookmarks\')" data-route="bookmarks">Bookmarks</a></div>';
html += '<div class="navbar-actions"><button class="navbar-search-btn" onclick="toggleSearch()" title="Search">\uD83D\uDD0D</button><button class="navbar-menu-btn" onclick="toggleMobileMenu()" title="Menu">\u2630</button></div>';
html += '</div></nav>';

// Mobile menu
html += '<div class="mobile-menu" id="mobileMenu"><a onclick="navigate(\'home\');toggleMobileMenu()">Home</a><a onclick="navigate(\'articles\');toggleMobileMenu()">Articles</a><a onclick="navigate(\'categories\');toggleMobileMenu()">Categories</a><a onclick="navigate(\'bookmarks\');toggleMobileMenu()">Bookmarks</a></div>';

// Reading progress
html += '<div class="reading-progress" id="readingProgress"><div class="reading-progress-bar" id="readingProgressBar"></div></div>';

// Main content
html += '<main id="app"></main>';

html += '</body></html>';

fs.writeFileSync(p.join(dir, 'index.html'), html);
console.log('Written successfully: ' + (fs.existsSync(p.join(dir, 'index.html')) ? html.length + ' bytes' : 'FAILED'));
