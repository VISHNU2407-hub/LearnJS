/* ============================================================
   LearnJS — lesson-renderer.js (js/roadmap)
   Universal, content-driven lesson renderer.

   Takes any lesson from data/lesson-content.js (or JSON lesson
   files) and renders it through reusable, dynamic components.
   The renderer ADAPTS to whatever content is present — it never
   forces every lesson into the same visual template.

   Supported content types:
     intro        — visually prominent lesson lead / hook
     concept      — short theory with headings, paragraphs, lists
     comparison   — compact concept cards comparing related items
     code         — code examples with syntax highlighting, output
     steps        — numbered sequential flow
     question     — think / predict with revealable answer
     realworld    — real-world connections
     takeaways    — compact checklist
     practice     — challenge with steps, hints, expected outcome

   The renderer handles two data shapes:
     A) New blocks[] format — renderer uses blocks directly
     B) Legacy flat format — renderer normalizes into blocks first

   This ensures backward compatibility with all existing lessons
   while enabling richer future content.
   ============================================================ */

/* ---------- Lucide-style stroke icons ---------- */
const ICON = {
  chevronRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  chevronDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  circle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>',
  clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  terminal: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 17 6-6-6-6"/><path d="M12 19h8"/></svg>',
  pencil: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>',
  brain: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>',
  globe: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',
  arrowRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  lightbulb: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>'
};

/* ---------- helpers ---------- */

/**
 * renderTerminalOutput — extracts ONLY the result from output text.
 * Lines starting with ">" are the input/command (already shown in CODE panel).
 * We strip those and return only the actual output lines.
 */
function renderTerminalOutput(output) {
  if (!output) return '';
  const lines = output.split('\n');
  // Filter out lines that start with "> " — those are input/command lines
  const resultLines = lines.filter((line) => !line.startsWith('> '));
  return resultLines.map((line) => escapeHtml(line)).join('\n');
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}

function escapeAttr(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ============================================================
   JS SYNTAX HIGHLIGHTER
   Tokenises JavaScript source into coloured <span> wrappers.
   Runs entirely in the browser — zero dependencies.
   ============================================================ */
const JS_KEYWORDS = new Set([
  "const","let","var","function","return","if","else","for","while",
  "do","switch","case","break","continue","new","this","class",
  "extends","super","import","export","from","default","async",
  "await","try","catch","finally","throw","typeof","instanceof",
  "in","of","delete","void","yield","static","get","set",
  "null","undefined","true","false"
]);
const JS_BUILTINS = new Set([
  "console","document","window","Math","JSON","Array","Object",
  "String","Number","Boolean","Promise","Map","Set","Date",
  "RegExp","Error","Symbol","parseInt","parseFloat","isNaN",
  "setTimeout","setInterval","clearTimeout","clearInterval",
  "fetch","alert","prompt","confirm","URL","URLSearchParams",
  "localStorage","sessionStorage","navigator","history",
  "requestAnimationFrame","cancelAnimationFrame","queueMicrotask",
  "WeakMap","WeakSet","Proxy","Reflect","Intl"
]);
const JS_OPERATORS = new Set([
  "+","-","*","/","%","=","==","===","!=",":=",
  ">","<",">=","<=","&&","||","!","&","|","^","~",
  "<<",">>",">>>","++","--","+=","-=","*=","/=","%=",
  "?.","??","..."
]);
const JS_PUNCT = new Set(["(",")","{","}","[","]",";",":",",","."]);

function highlightJS(code) {
  const tokens = [];
  let i = 0;
  const len = code.length;
  while (i < len) {
    if (code[i] === "/" && code[i + 1] === "/") {
      const end = code.indexOf("\n", i);
      const finish = end === -1 ? len : end;
      tokens.push({ text: code.slice(i, finish), type: "comment" });
      i = finish;
    } else if (code[i] === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      const finish = end === -1 ? len : end + 2;
      tokens.push({ text: code.slice(i, finish), type: "comment" });
      i = finish;
    } else if (code[i] === '"' || code[i] === "'" || code[i] === "`") {
      const q = code[i];
      let j = i + 1;
      while (j < len && code[j] !== q) {
        if (code[j] === "\\") j++;
        j++;
      }
      tokens.push({ text: code.slice(i, j + 1), type: "string" });
      i = j + 1;
    } else if (/\d/.test(code[i]) && (i === 0 || /[\s(,=:+\-*/<>!&|^~%\[{;?]/.test(code[i - 1]))) {
      let j = i;
      while (j < len && /[\d.xXa-fA-FeEn_]/.test(code[j])) j++;
      tokens.push({ text: code.slice(i, j), type: "number" });
      i = j;
    } else if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i;
      while (j < len && /[a-zA-Z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      let k = j;
      while (k < len && code[k] === " ") k++;
      const isCall = code[k] === "(";
      const prevChar = i > 0 ? code[i - 1] : "";
      const isAfterDot = prevChar === ".";
      if (JS_KEYWORDS.has(word)) {
        tokens.push({ text: word, type: "keyword" });
      } else if (JS_BUILTINS.has(word)) {
        tokens.push({ text: word, type: "builtin" });
      } else if (isAfterDot) {
        tokens.push({ text: word, type: isCall ? "fn" : "prop" });
      } else if (isCall) {
        tokens.push({ text: word, type: "fn" });
      } else {
        tokens.push({ text: word, type: "plain" });
      }
      i = j;
    } else if (/[+\-*/%=!<>&|^~?]/.test(code[i])) {
      const three = code.slice(i, i + 3);
      const two = code.slice(i, i + 2);
      if (JS_OPERATORS.has(three)) {
        tokens.push({ text: three, type: "op" });
        i += 3;
      } else if (JS_OPERATORS.has(two)) {
        tokens.push({ text: two, type: "op" });
        i += 2;
      } else if (JS_OPERATORS.has(code[i])) {
        tokens.push({ text: code[i], type: "op" });
        i++;
      } else {
        tokens.push({ text: code[i], type: "plain" });
        i++;
      }
    } else if (JS_PUNCT.has(code[i])) {
      tokens.push({ text: code[i], type: "punct" });
      i++;
    } else {
      tokens.push({ text: code[i], type: "plain" });
      i++;
    }
  }
  return tokens.map((t) => {
    const safe = escapeHtml(t.text);
    if (t.type === "plain") return safe;
    return '<span class="tk-' + t.type + '">' + safe + "</span>";
  }).join("");
}

/* ---------- Language-aware syntax highlighter ---------- */
function highlightCode(code, language) {
  const lang = (language || "").toLowerCase();
  if (lang === "javascript" || lang === "js" || lang === "json") {
    return highlightJS(code);
  }
  if (lang === "html" || lang === "xml") {
    return highlightHTML(code);
  }
  if (lang === "css") {
    return highlightCSS(code);
  }
  if (lang === "shell" || lang === "bash" || lang === "zsh" || lang === "terminal") {
    return highlightShell(code);
  }
  // Fallback: plain escaped HTML
  return escapeHtml(code);
}

/* Minimal HTML highlighter */
function highlightHTML(code) {
  let out = "";
  let i = 0;
  const len = code.length;
  while (i < len) {
    if (code[i] === "<" && (code.slice(i, i + 4) === "<!--" || /[a-zA-Z\/!]/.test(code[i + 1] || ""))) {
      // Tag or comment
      if (code.slice(i, i + 4) === "<!--") {
        const end = code.indexOf("-->", i + 4);
        const finish = end === -1 ? len : end + 3;
        out += '<span class="tk-comment">' + escapeHtml(code.slice(i, finish)) + "</span>";
        i = finish;
      } else {
        let j = i + 1;
        if (code[j] === "/") j++;
        while (j < len && /[a-zA-Z0-9\-]/.test(code[j])) j++;
        const tag = code.slice(i + 1, j).replace(/^\//, "");
        // Find end of tag
        let k = j;
        while (k < len && code[k] !== ">") k++;
        const finish = k < len ? k + 1 : len;
        out += '<span class="tk-punct">&lt;</span>';
        if (code[i + 1] === "/") out += '<span class="tk-punct">/</span>';
        out += '<span class="tk-keyword">' + escapeHtml(tag) + "</span>";
        // Attributes inside the tag
        const attrs = code.slice(code[i + 1] === "/" ? j : j, k);
        out += highlightHTMLAttrs(attrs);
        out += '<span class="tk-punct">&gt;</span>';
        i = finish;
      }
    } else {
      // Text content
      let j = i;
      while (j < len && code[j] !== "<") j++;
      out += escapeHtml(code.slice(i, j));
      i = j;
    }
  }
  return out;
}

function highlightHTMLAttrs(str) {
  return str.replace(/(\s)([a-zA-Z\-:]+)(=)("(?:[^"\\]|\\.)*")/g,
    function(_, ws, name, eq, val) {
      return ws + '<span class="tk-prop">' + escapeHtml(name) + "</span>" +
        '<span class="tk-op">=</span>' +
        '<span class="tk-string">' + escapeHtml(val) + "</span>";
    }
  );
}

/* Minimal CSS highlighter */
function highlightCSS(code) {
  return escapeHtml(code);
}

/* Shell / terminal highlighter */
function highlightShell(code) {
  return code.split("\n").map((line) => {
    let safe = escapeHtml(line);
    // Comments
    if (/^\s*#/.test(line)) {
      return '<span class="tk-comment">' + safe + "</span>";
    }
    // Prompt prefix
    safe = safe.replace(/^(&gt;\s)/, '<span class="tk-prompt">$1</span>');
    // Common commands
    safe = safe.replace(/\b(cd|ls|pwd|mkdir|touch|rm|clear|node|git|npm|code)\b/g,
      '<span class="tk-keyword">$1</span>');
    // Flags
    safe = safe.replace(/(\s)(--?\w[\w-]*)/g, '$1<span class="tk-number">$2</span>');
    return safe;
  }).join("\n");
}

/* ============================================================
   NORMALIZATION — convert legacy flat format to blocks[]
   ============================================================ */

const LEAD_NUM_RE = /^(\d+(?:\.\d+)*)\s+/;

/**
 * Detect technology relationship patterns in section headings.
 * Returns true if the heading describes how HTML/CSS/JS relate.
 */
function isTechRelationship(sec) {
  const h = (sec.heading || "").toLowerCase();
  // Must mention at least two of the three core web technologies
  const mentions = ["html", "css", "javascript", "js"].filter((t) => h.includes(t));
  if (mentions.length < 2) return false;
  // Must describe a relationship, not just list them
  const relationshipWords = ["work together", "work with", "and", "&", "+", "relationship", "interact", "team"];
  return relationshipWords.some((w) => h.includes(w));
}

/**
 * Check if a section has a meaningful list (3+ items).
 */
function hasListItems(sec) {
  return sec.list && sec.list.length >= 3;
}

/**
 * Detect "X vs Y" comparison sections that can be rendered as tables.
 * Returns parsed comparison data or null.
 */
function parseComparisonTable(sec) {
  const h = (sec.heading || "").toLowerCase();
  if (!h.includes(" vs ") && !h.includes("versus")) return null;
  if (!sec.list || sec.list.length < 2) return null;

  // Extract left/right labels from heading: "Statements vs expressions" → ["Statement", "Expression"]
  const parts = sec.heading.split(/\s+vs\.?\s+|\s+versus\s+/i);
  if (parts.length < 2) return null;
  const leftLabel = parts[0].trim().replace(/s$/, ''); // "Statements" → "Statement"
  const rightLabel = parts[1].trim().replace(/s$/, ''); // "expressions" → "Expression"

  // Parse list items to extract comparison rows
  // Pattern: "<b>Label</b> — description. Example: <code>...</code> (result)."
  const rows = [];
  const leftItem = sec.list[0] || '';
  const rightItem = sec.list[1] || '';

  // Extract description and example from each item
  function parseItem(html) {
    // Remove HTML tags for plain text extraction
    const plain = html.replace(/<[^>]+>/g, '').replace(/\u2014/g, '—').replace(/\u201c|\u201d/g, '"');
    // Split on "Example:" or "Example —"
    const exMatch = plain.match(/(?:Example[:\s—]+|e\.?g\.?[\s:]+)(.+)/i);
    const desc = exMatch ? plain.slice(0, plain.indexOf(exMatch[0])).trim() : plain.split('.')[0].trim();
    const example = exMatch ? exMatch[1].trim().split('.')[0].trim() : '';
    return { desc, example };
  }

  const left = parseItem(leftItem);
  const right = parseItem(rightItem);

  // Extract code examples from HTML
  function extractCode(html) {
    const m = html.match(/<code>([^<]+)<\/code>/);
    return m ? m[1] : '';
  }

  return {
    leftLabel,
    rightLabel,
    leftDesc: left.desc,
    rightDesc: right.desc,
    leftExample: extractCode(leftItem),
    rightExample: extractCode(rightItem),
    // Use the third item as a "Think of it as" row if available
    thinkOfIt: sec.list[2] ? sec.list[2].replace(/<[^>]+>/g, '').trim() : ''
  };
}

/**
 * Classify a single section into the best visual treatment.
 * Content-driven: the structure determines the presentation.
 */
function classifySection(sec) {
  const hasParagraphs = sec.paragraphs && sec.paragraphs.length;
  const hasList = sec.list && sec.list.length;

  // Pattern 1: "X vs Y" comparison → render as comparison table
  const comparisonTable = parseComparisonTable(sec);
  if (comparisonTable) {
    return {
      type: "comparison-table",
      title: sec.heading,
      table: comparisonTable
    };
  }

  // Pattern 2: Section describes how multiple technologies relate
  // → render as tech-relationship visual (e.g., HTML/CSS/JS comparison)
  if (isTechRelationship(sec)) {
    return {
      type: "tech-relationship",
      title: sec.heading,
      paragraphs: sec.paragraphs,
      list: sec.list
    };
  }

  // Default: normal concept section with paragraphs and/or list
  return {
    type: "concept",
    title: sec.heading,
    paragraphs: sec.paragraphs,
    list: sec.list
  };
}

/**
 * Normalize any lesson shape into a consistent blocks[] array.
 * If the lesson already has blocks[], return them directly.
 * Otherwise, derive blocks from the legacy flat fields.
 */
function normalizeBlocks(lesson) {
  if (lesson.blocks && lesson.blocks.length) return lesson.blocks;

  const blocks = [];

  // Concept sections (before code)
  if (lesson.sections && lesson.sections.length) {
    // Classify all sections
    const classified = lesson.sections.map((sec) => classifySection(sec));

    // Find sections with meaningful lists (3+ items) that are NOT tech-relationship
    // These are candidates for the concept-pair component
    const pairableIndices = [];
    classified.forEach((sec, idx) => {
      if (sec.type !== "tech-relationship" && hasListItems(sec)) {
        pairableIndices.push(idx);
      }
    });

    // If exactly 2 pairable sections exist, extract them and form a concept-pair
    if (pairableIndices.length === 2) {
      const [idxA, idxB] = pairableIndices;
      // Sort: section with paragraphs+list goes first (left card), list-only goes second (right)
      const secA = classified[idxA].paragraphs && classified[idxA].paragraphs.length ? classified[idxA] : classified[idxB];
      const secB = secA === classified[idxA] ? classified[idxB] : classified[idxA];

      // Track whether we've inserted the pair yet
      let pairInserted = false;

      // Iterate through sections in order, skipping the two paired sections
      // and inserting the concept-pair immediately after the first section
      classified.forEach((sec, idx) => {
        if (idx === idxA || idx === idxB) {
          // Skip — these will be rendered together as the concept-pair
          if (!pairInserted) {
            blocks.push({
              type: "concept-pair",
              sections: [
                { title: secA.title, list: secA.list },
                { title: secB.title, list: secB.list }
              ]
            });
            pairInserted = true;
          }
        } else if (idx < Math.min(idxA, idxB) || pairInserted) {
          // Before the pair position, or after pair already inserted → render normally
          blocks.push(sec);
        } else {
          // This is the section right before the first paired section
          // Insert the pair BEFORE this section so it appears right after the prior content
          if (!pairInserted) {
            blocks.push({
              type: "concept-pair",
              sections: [
                { title: secA.title, list: secA.list },
                { title: secB.title, list: secB.list }
              ]
            });
            pairInserted = true;
          }
          blocks.push(sec);
        }
      });

      // Edge case: pair not yet inserted (all sections were paired)
      if (!pairInserted) {
        blocks.push({
          type: "concept-pair",
          sections: [
            { title: secA.title, list: secA.list },
            { title: secB.title, list: secB.list }
          ]
        });
      }
    } else {
      // No pairable sections or wrong count — render all normally
      classified.forEach((sec) => blocks.push(sec));
    }

    // After building blocks, merge tech-relationship with the next concept
    // into a single tech-combined block (e.g., "How HTML/CSS/JS work together"
    // + "A real-world example: the like button" → one compact visual)
    let i = 0;
    while (i < blocks.length) {
      if (blocks[i].type === "tech-relationship" && i + 1 < blocks.length && blocks[i + 1].type === "concept") {
        blocks.splice(i, 2, {
          type: "tech-combined",
          tech: blocks[i],
          example: blocks[i + 1]
        });
      } else {
        i++;
      }
    }
  }

  // Code examples
  if (lesson.codeExamples && lesson.codeExamples.length) {
    lesson.codeExamples.forEach((ex) => {
      blocks.push({
        type: "code",
        title: ex.heading,
        filename: ex.file,
        language: ex.language,
        code: ex.code,
        output: ex.output,
        explanation: ex.explanation
      });
    });
  }

  // Sections after code — detect and pair list-heavy sections
  if (lesson.sectionsAfterCode && lesson.sectionsAfterCode.length) {
    // Classify sections
    const afterClassified = lesson.sectionsAfterCode.map((sec) => ({
      type: sec.list && sec.list.length >= 3 ? "list-section" : "concept",
      title: sec.heading,
      paragraphs: sec.paragraphs,
      list: sec.list
    }));

    // Find consecutive list-heavy sections to pair
    const listIndices = [];
    afterClassified.forEach((sec, idx) => {
      if (sec.type === "list-section") listIndices.push(idx);
    });

    if (listIndices.length >= 2) {
      // Pair the first two list-heavy sections
      const [idxA, idxB] = listIndices;
      const secA = afterClassified[idxA];
      const secB = afterClassified[idxB];
      let pairInserted = false;

      afterClassified.forEach((sec, idx) => {
        if (idx === idxA || idx === idxB) {
          if (!pairInserted) {
            // Render paragraphs from first paired section above the pair
            if (secA.paragraphs && secA.paragraphs.length) {
              blocks.push({ type: "concept", title: secA.title, paragraphs: secA.paragraphs, list: [] });
            }
            blocks.push({
              type: "concept-pair",
              variant: "blue-lavender",
              sections: [
                { title: secA.title, list: secA.list },
                { title: secB.title, list: secB.list }
              ]
            });
            pairInserted = true;
          }
        } else if (!pairInserted && idx < Math.min(idxA, idxB)) {
          blocks.push(sec);
        } else if (pairInserted) {
          blocks.push(sec);
        } else {
          blocks.push(sec);
        }
      });
    } else {
      // No pairable sections — render all normally
      afterClassified.forEach((sec) => blocks.push(sec));
    }
  }

  // Key takeaways
  if (lesson.keyTakeaways && lesson.keyTakeaways.length) {
    blocks.push({
      type: "takeaways",
      items: lesson.keyTakeaways
    });
  }

  // Practice
  if (lesson.practice) {
    blocks.push({
      type: "practice",
      ...lesson.practice
    });
  }

  return blocks;
}

/* ============================================================
   INDIVIDUAL RENDERERS
   Each returns an HTML string for its component type.
   ============================================================ */

/**
 * renderIntro — the lesson description / lead paragraph.
 * Rendered as a visually prominent introduction when present.
 */
function renderIntro(lesson) {
  if (!lesson.description) return "";
  return (
    '<div class="lr-intro">' +
      '<div class="lr-intro-label">' + ICON.lightbulb + '<span>In this lesson</span></div>' +
      '<p class="lr-intro-text">' + lesson.description + '</p>' +
    '</div>'
  );
}

/**
 * renderConcept — a theory section with heading, paragraphs, optional list.
 */
function renderConcept(block) {
  let body = "";
  (block.paragraphs || []).forEach((p) => { body += "<p>" + p + "</p>"; });
  if (block.list && block.list.length) {
    body +=
      '<ul class="lesson-list">' +
        block.list.map((li) => '<li><span>' + li + '</span></li>').join("") +
      "</ul>";
  }
  return (
    '<section class="lesson-section">' +
      '<h2>' + escapeHtml(block.title || "Concept") + '</h2>' +
      body +
    '</section>'
  );
}

/**
 * renderConceptVisual — a section with paragraphs + list rendered as a
 * premium green-outlined visual card. The paragraphs serve as an intro
 * explanation, and the list items become compact bullet points.
 */
function renderConceptVisual(block) {
  const title = block.title || "";
  const paragraphs = block.paragraphs || [];
  const list = block.list || [];

  // Intro paragraphs above the bullet list
  let introHtml = "";
  paragraphs.forEach((p) => { introHtml += '<p class="lr-cv-intro">' + p + '</p>'; });

  // Bullet points with green dots
  let listHtml = "";
  if (list.length) {
    listHtml = '<ul class="lr-cv-list">' +
      list.map((item) =>
        '<li class="lr-cv-item"><span class="lr-cv-dot"></span><span>' + item + '</span></li>'
      ).join("") +
    '</ul>';
  }

  return (
    '<section class="lesson-section">' +
      '<div class="lr-cv-card">' +
        '<div class="lr-cv-badge">JS</div>' +
        '<h3 class="lr-cv-title">' + escapeHtml(title) + '</h3>' +
        introHtml +
        listHtml +
      '</div>' +
    '</section>'
  );
}

/**
 * renderConceptPair — renders two sections as side-by-side concept cards.
 * Shows ONLY list items (not paragraphs) in compact numbered format.
 * Left card: green accent. Right card: lavender accent.
 */
function renderConceptPair(block) {
  if (!block.sections || block.sections.length < 2) return "";
  // Support different accent variants: "green-lavender" (default) or "blue-lavender"
  const variant = block.variant || "green-lavender";
  const accentClasses = variant === "blue-lavender"
    ? ["lr-concept-card--blue", "lr-concept-card--lavender"]
    : ["lr-concept-card--green", "lr-concept-card--lavender"];

  const cardsHtml = block.sections.slice(0, 2).map((sec, idx) => {
    const list = sec.list || [];

    // Render only list items with numbered circles
    const pointsHtml = list.map((item, i) => {
      const num = String(i + 1).padStart(2, "0");
      return '<div class="lr-concept-card-point">' +
        '<span class="lr-concept-card-num">' + num + '</span>' +
        '<span class="lr-concept-card-text">' + item + '</span>' +
      '</div>';
    }).join("");

    // Badge: JS for green variant, none for blue variant
    const badge = variant !== "blue-lavender" && idx === 0
      ? '<span class="lr-concept-card-badge">JS</span>'
      : '';

    return '<div class="lr-concept-card ' + accentClasses[idx] + '">' +
      badge +
      '<h3 class="lr-concept-card-title">' + escapeHtml(sec.title || "") + '</h3>' +
      '<div class="lr-concept-card-points">' + pointsHtml + '</div>' +
    '</div>';
  }).join("");

  return (
    '<section class="lesson-section">' +
      '<div class="lr-concept-pair">' + cardsHtml + '</div>' +
    '</section>'
  );
}

/**
 * renderTechCombined — one compact container with:
 * Compact 4-stage memory flow: HTML → CSS → JS → Interactive Website
 */
function renderTechCombined(block) {
  const tech = block.tech || {};
  const title = tech.title || "";
  const h = title.toLowerCase();

  // Build the 4-stage memory flow: HTML → CSS → JS → Interactive Website
  const stages = [];
  if (h.includes("html"))       stages.push({ name: "HTML", keyword: "Structure", accent: "lr-tech--blue" });
  if (h.includes("css"))        stages.push({ name: "CSS", keyword: "Appearance", accent: "lr-tech--purple" });
  if (h.includes("javascript") || h.includes("js")) stages.push({ name: "JavaScript", keyword: "Behavior", accent: "lr-tech--green" });
  stages.push({ name: "Interactive", keyword: "Website", accent: "lr-tech--result" });

  const flowHtml = stages.map((s, i) =>
    (i > 0 ? '<span class="lr-tech-arrow">' + ICON.arrowRight + '</span>' : '') +
    '<div class="lr-tech-cell ' + s.accent + '">' +
      '<div class="lr-tech-label">' + s.name + '</div>' +
      '<div class="lr-tech-role">' + s.keyword + '</div>' +
    '</div>'
  ).join("");

  return (
    '<section class="lesson-section">' +
      '<h2>' + escapeHtml(title) + '</h2>' +
      '<div class="lr-tech-combined">' +
        '<div class="lr-tech-strip">' + flowHtml + '</div>' +
      '</div>' +
    '</section>'
  );
}

/**
 * renderComparison — compact concept cards comparing related items.
 * Dynamically renders however many items are provided.
 */
function renderComparison(block) {
  if (!block.items || !block.items.length) return "";
  return (
    '<section class="lesson-section">' +
      '<h2>' + escapeHtml(block.title || "Comparison") + '</h2>' +
      '<div class="lr-comparison">' +
        block.items.map((item) =>
          '<div class="lr-comparison-card">' +
            '<div class="lr-comparison-label">' + escapeHtml(item.label || "") + '</div>' +
            '<div class="lr-comparison-title">' + escapeHtml(item.title || "") + '</div>' +
            (item.description ? '<div class="lr-comparison-desc">' + item.description + '</div>' : '') +
          '</div>'
        ).join("") +
      '</div>' +
    '</section>'
  );
}

/**
 * renderComparisonTable — renders "X vs Y" sections as a compact comparison table.
 */
function renderComparisonTable(block) {
  const t = block.table;
  if (!t) return '';
  return (
    '<section class="lesson-section">' +
      '<h2>' + escapeHtml(block.title) + '</h2>' +
      '<div class="lr-cmp-table-wrap">' +
        '<table class="lr-cmp-table">' +
          '<thead>' +
            '<tr>' +
              '<th></th>' +
              '<th class="lr-cmp-col-statement">' + escapeHtml(t.leftLabel) + '</th>' +
              '<th class="lr-cmp-col-expression">' + escapeHtml(t.rightLabel) + '</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            '<tr>' +
              '<td class="lr-cmp-row-label">What it does</td>' +
              '<td>' + escapeHtml(t.leftDesc) + '</td>' +
              '<td>' + escapeHtml(t.rightDesc) + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td class="lr-cmp-row-label">Example</td>' +
              '<td><code class="lr-cmp-code">' + escapeHtml(t.leftExample) + '</code></td>' +
              '<td><code class="lr-cmp-code">' + escapeHtml(t.rightExample) + '</code></td>' +
            '</tr>' +
            '<tr>' +
              '<td class="lr-cmp-row-label">Think of it as</td>' +
              '<td class="lr-cmp-think">"Do this"</td>' +
              '<td class="lr-cmp-think">"Give me a value"</td>' +
            '</tr>' +
          '</tbody>' +
        '</table>' +
      '</div>' +
    '</section>'
  );
}

/**
 * renderCodeBlock — renders just the code block + output + explanation
 * WITHOUT a section wrapper. Used internally and by question renderer.
 */
function renderCodeBlock(block) {
  const filename = escapeHtml(block.filename || "script.js");
  const lang = escapeHtml(block.language || "JavaScript");
  const rawCode = block.code || "";
  const highlighted = highlightCode(rawCode, block.language);
  const lines = rawCode.split("\n");
  const lineCount = lines.length;
  const lineNums = Array.from({ length: lineCount }, (_, i) =>
    '<span class="line-num">' + (i + 1) + "</span>"
  ).join("");

  // Code editor panel
  const codePanel =
    '<div class="code-block">' +
      '<div class="code-head">' +
        '<div class="code-head-left">' +
          '<span class="code-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
          '<span class="code-filename">' + filename + "</span>" +
        '</div>' +
        '<div class="code-head-right">' +
          '<span class="code-lang">' + lang + "</span>" +
          '<button class="code-copy-btn" type="button" data-code="' +
            escapeAttr(rawCode) +
          '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span></button>' +
        "</div>" +
      "</div>" +
      '<div class="code-body">' +
        '<div class="code-line-nums" aria-hidden="true">' + lineNums + "</div>" +
        '<pre class="code-pre"><code>' + highlighted + "</code></pre>" +
      "</div>" +
    "</div>";

  // Output panel — live preview or terminal
  let outputPanel = "";
  if (block.preview) {
    // Live preview mode
    outputPanel =
      '<div class="code-output-panel code-output-preview">' +
        '<div class="code-output-head">' +
          ICON.eye +
          '<span>Output</span>' +
        "</div>" +
        '<div class="code-output-body">' +
          (block.preview.html || '') +
        "</div>" +
        (block.preview.script ? '<script type="text/plain" class="lp-preview-script">' + block.preview.script + '</script>' : '') +
      "</div>";
  } else if (block.output) {
    // Terminal mode (fallback)
    outputPanel =
      '<div class="code-output-panel">' +
        '<div class="code-output-head">' +
          ICON.terminal +
          '<span>Output</span>' +
          '<button class="code-copy-btn code-copy-output" type="button" data-code="' +
            escapeAttr(block.output) +
          '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span></button>' +
        "</div>" +
        '<div class="code-output-body">' +
          "<pre>" + renderTerminalOutput(block.output) + "</pre>" +
        "</div>" +
      "</div>";
  }

  // Wrap code + output in a side-by-side container when output exists
  let body = outputPanel
    ? '<div class="code-side-by-side">' + codePanel + outputPanel + '</div>'
    : codePanel;

  // Explanation bullets ("How it works")
  if (block.explanation && block.explanation.length) {
    body +=
      '<p class="code-explain-label">How it works</p>' +
      '<ul class="lesson-list code-explain">' +
        block.explanation.map((x) => '<li><span>' + x + '</span></li>').join("") +
      "</ul>";
  }

  return body;
}

/**
 * renderCodeExample — universal code block renderer.
 * Wraps renderCodeBlock in a section with a heading.
 * Supports filename, language, syntax highlighting, line numbers,
 * copy button, output panel, and explanation bullets.
 */
function renderCodeExample(block) {
  return (
    '<section class="lesson-section">' +
      '<h2>' + escapeHtml(block.title || "Code example") + '</h2>' +
      renderCodeBlock(block) +
    '</section>'
  );
}

/**
 * renderSteps — numbered sequential flow ("How it works").
 * Dynamic: renders however many steps are provided.
 */
function renderSteps(block) {
  if (!block.items || !block.items.length) return "";
  return (
    '<section class="lesson-section">' +
      '<h2>' + escapeHtml(block.title || "How it works") + '</h2>' +
      '<div class="lr-steps">' +
        block.items.map((step, i) =>
          '<div class="lr-step">' +
            '<div class="lr-step-num">' + (i + 1) + '</div>' +
            '<div class="lr-step-content">' +
              '<div class="lr-step-title">' + escapeHtml(step.title || "") + '</div>' +
              (step.description ? '<div class="lr-step-desc">' + step.description + '</div>' : '') +
            '</div>' +
            (i < block.items.length - 1 ? '<div class="lr-step-arrow">' + ICON.arrowRight + '</div>' : '') +
          '</div>'
        ).join("") +
      '</div>' +
    '</section>'
  );
}

/**
 * renderQuestion — "Think for a moment" with a revealable answer.
 * Uses only answer content provided in the lesson data.
 */
function renderQuestion(block) {
  if (!block.question) return "";
  return (
    '<section class="lesson-section">' +
      '<div class="lr-question">' +
        '<div class="lr-question-head">' +
          '<span class="lr-question-ico">' + ICON.brain + '</span>' +
          '<span class="lr-question-label">Think for a moment</span>' +
        '</div>' +
        '<p class="lr-question-text">' + block.question + '</p>' +
        (block.code ? '<div class="lr-question-code">' + renderCodeBlock({ code: block.code, language: block.language || "JavaScript", filename: block.filename }) + '</div>' : '') +
        (block.answer ?
          '<details class="lr-question-details">' +
            '<summary class="lr-question-reveal">' + ICON.eye + '<span>Show Output</span></summary>' +
            '<div class="lr-question-answer">' + block.answer + '</div>' +
          '</details>'
        : '') +
      '</div>' +
    '</section>'
  );
}

/**
 * renderRealWorld — "Where do you see this?" real-world connections.
 * Dynamic: renders however many items are provided.
 */
function renderRealWorld(block) {
  if (!block.items || !block.items.length) return "";
  return (
    '<section class="lesson-section">' +
      '<h2>' + escapeHtml(block.title || "Where do you see this?") + '</h2>' +
      '<div class="lr-realworld">' +
        block.items.map((item) =>
          '<div class="lr-realworld-item">' +
            (item.icon ? '<span class="lr-realworld-ico">' + item.icon + '</span>' : '') +
            '<span>' + (item.text || item) + '</span>' +
          '</div>'
        ).join("") +
      '</div>' +
    '</section>'
  );
}

/**
 * renderTakeaways — compact checklist of key points.
 * Uses only the takeaway text provided in the lesson data.
 */
function renderTakeaways(items) {
  if (!items || !items.length) return "";
  const count = items.length;
  const accents = ["tk-num--blue", "tk-num--lavender", "tk-num--slate"];
  return (
    '<section class="lesson-section">' +
      '<div class="takeaways-box">' +
        '<div class="takeaways-head">' +
          '<span class="takeaways-head-ico">' + ICON.check + '</span>' +
          '<div class="takeaways-head-text">' +
            '<span class="takeaways-title">Key Takeaways</span>' +
            '<span class="takeaways-sub">' + count + ' things to remember</span>' +
          '</div>' +
        '</div>' +
        '<ul class="takeaways">' +
          items.map((t, i) => {
            const num = String(i + 1).padStart(2, "0");
            const accent = accents[i % accents.length];
            return '<li>' +
              '<span class="tk-num ' + accent + '">' + num + '</span>' +
              '<span class="tk-text">' + t + '</span>' +
            '</li>';
          }).join("") +
        '</ul>' +
      '</div>' +
    '</section>'
  );
}

/**
 * renderPractice — "Your turn" challenge section.
 * Supports both single-task and multi-task formats.
 */
function renderPractice(block) {
  if (!block) return "";
  let body = "";
  if (block.tasks && block.tasks.length) {
    if (block.intro) body += '<p class="lp-task">' + block.intro + '</p>';
    body +=
      '<div class="lp-hints">' +
        block.tasks.map((t, i) =>
          '<span><b>' + (i + 1) + '.</b> ' + t.text +
            (t.expected ? ' <i>Expected: ' + t.expected + '</i>' : '') +
          '</span>'
        ).join("") +
      '</div>';
  } else if (block.task) {
    body += '<p class="lp-task">' + block.task + '</p>';
    if (block.hints && block.hints.length) {
      body +=
        '<div class="lp-hints">' +
          block.hints.map((hint, i) =>
            '<span><b>' + (i + 1) + '.</b> ' + hint + '</span>'
          ).join("") +
        '</div>';
    }
  }
  if (block.note) body += '<p class="lp-note">' + block.note + '</p>';

  /* Try in Compiler button — only when block.compiler is true */
  let compilerBtn = "";
  if (block.compiler) {
    // Build a minimal starter comment from the task text (strip HTML tags)
    const rawTask = (block.task || (block.tasks && block.tasks.length && block.tasks[0].text) || "").replace(/<[^>]+>/g, "").trim();
    const starterComment = rawTask ? "// " + rawTask.substring(0, 120) + (rawTask.length > 120 ? "..." : "") + "\n// Your code here:\n" : "// Your code here:\n";
    const encoded = encodeURIComponent(starterComment);
    // Resolve playground URL relative to this module (same as playground-launcher.js)
    const href = "../../../Js-compiler/index.html?js=" + encoded;
    compilerBtn =
      '<a class="lp-compiler-btn" href="' + href + '" target="_blank" rel="noopener">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 6-6 6 6 6"/><path d="m16 6 6 6-6 6"/></svg>' +
        '<span>Try in Compiler</span>' +
      '</a>';
  }

  return (
    '<section class="lesson-section">' +
      '<h2>Practice</h2>' +
      '<div class="lesson-practice-card">' +
        '<div class="lp-head">' + ICON.pencil + 'Your turn</div>' +
        body +
        compilerBtn +
      '</div>' +
    '</section>'
  );
}

/* ============================================================
   BLOCK ROUTER — maps a block type to its renderer
   ============================================================ */
function renderBlock(block) {
  if (!block || !block.type) return "";
  switch (block.type) {
    case "concept":           return renderConcept(block);
    case "concept-visual":    return renderConceptVisual(block);
    case "concept-pair":      return renderConceptPair(block);
    case "tech-combined":    return renderTechCombined(block);
    case "comparison":        return renderComparison(block);
    case "comparison-table": return renderComparisonTable(block);
    case "code":              return renderCodeExample(block);
    case "steps":             return renderSteps(block);
    case "question":          return renderQuestion(block);
    case "realworld":         return renderRealWorld(block);
    case "takeaways":         return renderTakeaways(block.items || []);
    case "practice":          return renderPractice(block);
    default:                  return "";
  }
}

/* ============================================================
   MAIN ENTRY POINT
   ============================================================ */

/**
 * renderLessonContent — the universal lesson renderer.
 *
 * Takes a lesson object (from lesson-content.js or JSON files)
 * and returns the full HTML for the lesson body area.
 *
 * Content-driven: only renders components that have source data.
 * Never invents content to fill a template.
 */
export function renderLessonContent(lesson) {
  if (!lesson) return "";

  // 1. Get blocks (new format or normalized from legacy)
  const blocks = normalizeBlocks(lesson);

  // 2. Build the HTML
  let html = '<article class="lesson-content">';

  // Intro / lead
  html += renderIntro(lesson);

  // All content blocks
  blocks.forEach((block) => {
    html += renderBlock(block);
  });

  html += '</article>';
  return html;
}

/**
 * renderIntoElement — render lesson content into a DOM element.
 * Convenience wrapper for the common pattern of writing into
 * the learnPlaceholder div.
 */
export function renderIntoElement(lesson, elementId) {
  const wrap = document.getElementById(elementId);
  if (!wrap) return;
  wrap.innerHTML = renderLessonContent(lesson);

  // Execute live preview scripts
  wrap.querySelectorAll('.lp-preview-script').forEach((scriptEl) => {
    const code = scriptEl.textContent;
    if (code) {
      try { new Function(code)(); } catch (e) { console.warn('Preview script error:', e); }
    }
  });
}

/* Re-export the syntax highlighter for external use if needed. */
export { highlightCode };
