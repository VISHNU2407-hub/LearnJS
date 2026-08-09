/* ============================================================
   LearnJS — lesson-content.js (js/roadmap)
   Generates rich teaching content for any lesson in the roadmap.
   The curriculum data (roadmap.json) currently carries only
   lesson TITLES, so this module builds professional lesson pages
   from the title + its context: an illustration, an overview,
   key concepts, runnable-style code examples with console output,
   a tip callout and practice questions.

   Content is keyword-matched to concept profiles (arrays, DOM,
   async, functions, ...) with a smart general fallback, so every
   one of the ~300 lessons gets meaningful material today — and
   when real authored content lands in roadmap.json later, this
   generator can simply be replaced by reading those fields.
   ============================================================ */

/* ---------- helpers ---------- */
function esc(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}

const ICON = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5A5 5 0 0 0 9.153 6.118A4.98 4.98 0 0 0 7.5 11.5c.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 17 6-6-6-6"/><path d="M12 19h8"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>'
};

/* ---------- blocks ---------- */
function codeBlock(file, code) {
  return (
    '<div class="code-block">' +
      '<div class="code-block-head"><span>' + esc(file) + '</span><span class="lang">JavaScript</span></div>' +
      "<pre><code>" + esc(code) + "</code></pre>" +
    "</div>"
  );
}
function outputBlock(output) {
  return (
    '<div class="code-output">' +
      '<div class="code-output-head">' + ICON.terminal + "Console output</div>" +
      "<pre>" + esc(output) + "</pre>" +
    "</div>"
  );
}
function section(title, inner) {
  return '<section class="lesson-section"><h2>' + esc(title) + "</h2>" + inner + "</section>";
}
function points(list) {
  return (
    "<ul class=\"lesson-points\">" +
      list.map((p) => '<li><span class="point-ico">' + ICON.check + "</span><span>" + p + "</span></li>").join("") +
    "</ul>"
  );
}
function callout(text) {
  return '<div class="lesson-callout"><span class="callout-ico">' + ICON.bulb + "</span><div>" + text + "</div></div>";
}
function practice(questions) {
  return (
    '<div class="lesson-practice">' +
      questions.map((q, i) =>
        '<details class="practice-item"><summary>' +
          '<span class="p-num">' + (i + 1) + "</span>" +
          "<span>" + q.q + "</span>" +
          '<span class="p-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></span>' +
        "</summary>" +
        '<div class="practice-answer">' + q.a + "</div>" +
        "</details>"
      ).join("") +
    "</div>"
  );
}

/* ---------- illustration ---------- */
const TRACK_ACCENT = {
  Beginner: "#22c55e",
  Intermediate: "#f59e0b",
  Advanced: "#ef4444",
  Expert: "#8b5cf6"
};

function illustration(lessonNum, track) {
  const accent = TRACK_ACCENT[track] || "#22c55e";
  const lines = [150, 230, 190, 250, 120, 200]; // widths of the fake code lines
  const rows = lines
    .map((w, i) =>
      '<rect x="' + (70 + (i % 2 === 0 ? 0 : 26)) + '" y="' + (96 + i * 22) +
      '" width="' + w + '" height="9" rx="4.5" fill="' +
      (i === 3 ? "var(--brand-soft)" : i === 4 ? "var(--surface-2)" : "var(--line-soft)") + '"/>'
    )
    .join("");
  return (
    '<div class="lesson-illustration">' +
      '<svg viewBox="0 0 640 250" role="img" aria-label="Lesson illustration — a code window">' +
        '<rect width="640" height="250" fill="var(--surface)"/>' +
        '<rect x="40" y="26" width="560" height="200" rx="16" fill="var(--card)" stroke="var(--line-soft)"/>' +
        '<circle cx="72" cy="54" r="6" fill="#ef4444"/><circle cx="94" cy="54" r="6" fill="#f59e0b"/><circle cx="116" cy="54" r="6" fill="#22c55e"/>' +
        '<rect x="140" y="47" width="120" height="14" rx="7" fill="var(--surface-2)"/>' +
        rows +
        '<circle cx="540" cy="184" r="30" fill="' + accent + '" opacity="0.16"/>' +
        '<path d="M530 173v22l17-11z" fill="' + accent + '"/>' +
        '<text x="520" y="86" font-family="var(--font-mono)" font-size="15" font-weight="700" fill="var(--faint)" text-anchor="end">' +
          esc(lessonNum) +
        "</text>" +
      "</svg>" +
      '<span class="lesson-illustration-cap">' + ICON.code + esc(lessonNum) + " &middot; LearnJS Lesson</span>" +
    "</div>"
  );
}

/* ---------- concept profiles ---------- */
/* Each profile is matched against the lesson title. Fields:
   intro(p)   → paragraphs builder (receives context object)
   points(p)  → key concepts list
   code       → [ { file, code, output }, ... ]
   callout(p) → optional tip
   questions  → [ { q, a } ]   */
const PROFILES = [
  {
    id: "console",
    test: /console|dev.?tools|developer console|browser console/i,
    intro: (p) =>
      "<p>The browser developer console is your first JavaScript playground. You can open it on any web page, type a JavaScript expression, and see the result immediately — no files, no server, no setup. It is the fastest way to experiment with the language and to <b>debug</b> code that is not behaving as expected.</p>" +
      "<p>In this lesson — <b>" + esc(p.title) + "</b> — you will use <code>console.log()</code> to print values to the console. Everything you log appears in the <b>Console</b> panel, where you can inspect primitive values, objects, arrays and even errors.</p>",
    points: [
      "Open DevTools with <b>F12</b> (or right-click → Inspect) and switch to the <b>Console</b> tab",
      "<b>console.log()</b> prints a value to the console and is the most-used debugging tool in JavaScript",
      "The console evaluates expressions instantly — try typing <code>1 + 2</code> and press Enter",
      "You can log multiple values in one call: <code>console.log(a, b, c)</code>"
    ],
    code: [{
      file: "console.js",
      code: "// Open DevTools → Console and run this\nconsole.log(\"Hello, JavaScript!\");\n\nconst answer = 42;\nconsole.log(\"The answer is\", answer);\n\n// Inspect an object without JSON gymnastics\nconsole.log({ name: \"LearnJS\", lesson: \"console\" });",
      output: "Hello, JavaScript!\nThe answer is 42\n{ name: 'LearnJS', lesson: 'console' }"
    }],
    callout: (p) => "<b>Pro tip:</b> use <code>console.table()</code> for arrays of objects and <code>console.time()</code>/<code>console.timeEnd()</code> to measure how long code takes.",
    questions: [
      { q: "Which keyboard shortcut opens the browser developer tools?", a: "Press <b>F12</b> (or <b>Ctrl/Cmd + Shift + I</b>), then click the <b>Console</b> tab." },
      { q: "What does console.log(1, 2, 3) print?", a: "It prints <code>1 2 3</code> — <code>console.log</code> accepts any number of arguments and separates them with a space." },
      { q: "Why is the console a great place to practice JavaScript?", a: "Because it runs your code instantly with zero setup, making it perfect for testing small snippets and debugging." }
    ]
  },
  {
    id: "variables",
    test: /variable|let\b|const\b|declare|mutab|naming|identifier/i,
    intro: (p) =>
      "<p>Variables are labeled boxes that hold values. In JavaScript, <code>let</code> and <code>const</code> are the modern ways to declare them — <code>let</code> for values that will be reassigned, and <code>const</code> for values that stay fixed. This lesson — <b>" + esc(p.title) + "</b> — is the foundation for everything else in the language.</p>" +
      "<p>Good variable names make code self-documenting. JavaScript developers use <b>camelCase</b> — first word lowercase, subsequent words capitalized, like <code>userName</code> or <code>totalPrice</code> — and give names that describe what the value <i>means</i>, not what it holds.</p>",
    points: [
      "<code>let</code> declares a value you can <b>reassign</b> later; <code>const</code> declares one that cannot be reassigned",
      "Names should be descriptive and written in <b>camelCase</b> — e.g. <code>myFavoriteColor</code>",
      "Declare a variable <b>before</b> using it to avoid confusing errors",
      "Prefer <code>const</code> by default; switch to <code>let</code> only when you must reassign"
    ],
    code: [{
      file: "variables.js",
      code: "const course = \"LearnJS\";\nlet lessons = 1;\n\nconsole.log(course);   // LearnJS\nlessons = lessons + 1; // allowed with let\n\n// course = \"Other\"; // ❌ TypeError — const cannot be reassigned\nconsole.log(lessons);  // 2",
      output: "LearnJS\n2"
    }],
    callout: (p) => "<b>Good practice:</b> a name like <code>userName</code> tells you the meaning; a name like <code>x</code> tells you nothing. Future-you will thank present-you.",
    questions: [
      { q: "What is the difference between let and const?", a: "<code>const</code> cannot be reassigned after declaration, while <code>let</code> can. Prefer <code>const</code> unless you know the value will change." },
      { q: "Which of these is valid camelCase: userName, UserName, user_name?", a: "<b>userName</b> — camelCase starts lowercase and capitalizes each following word." },
      { q: "What happens if you try to reassign a const variable?", a: "The engine throws a <b>TypeError</b> (e.g. <i>Assignment to constant variable</i>)." }
    ]
  },
  {
    id: "functions",
    test: /function|arrow|callback|param|argument|rest par|return|closure/i,
    intro: (p) =>
      "<p>Functions are reusable blocks of code — the building blocks of every JavaScript program. You define them once with <code>function</code> declarations or the concise <b>arrow</b> syntax, then <i>call</i> them as many times as you like, passing different <b>arguments</b> each time. In <b>" + esc(p.title) + "</b> you will master both syntaxes.</p>" +
      "<p>Arrow functions, added in ES6, are shorter and — crucially — do not create their own <code>this</code>, which makes them ideal as <b>callbacks</b> passed to other functions like <code>array.map()</code> or event listeners.</p>",
    points: [
      "A <b>function declaration</b> is hoisted: <code>function greet(name) { return \"Hi \" + name; }</code>",
      "A <b>function expression</b> stores a function in a variable: <code>const greet = function (name) { ... }</code>",
      "An <b>arrow function</b> drops the keyword and returns implicitly for single expressions",
      "<b>Default parameters</b> fill in missing arguments: <code>function f(a = 1)</code>"
    ],
    code: [{
      file: "functions.js",
      code: "// Declaration\nfunction greet(name = \"friend\") {\n  return \"Hi, \" + name + \"!\";\n}\n\n// Arrow function — implicit return\nconst double = (n) => n * 2;\n\nconsole.log(greet(\"Ada\")); // Hi, Ada!\nconsole.log(greet());       // Hi, friend!\nconsole.log(double(21));    // 42",
      output: "Hi, Ada!\nHi, friend!\n42"
    }],
    callout: (p) => "<b>Memory aid:</b> arrow functions are great for short, single-purpose logic; declarations read better for named, reusable helpers.",
    questions: [
      { q: "What will double(4) return given const double = (n) => n * 2?", a: "<b>8</b> — the arrow function implicitly returns the expression <code>n * 2</code>." },
      { q: "What is a default parameter?", a: "A fallback value used when the caller omits that argument — e.g. <code>function greet(name = \"friend\")</code>." },
      { q: "Can arrow functions be stored in variables?", a: "Yes — <code>const f = (x) => x + 1</code> is a common pattern." }
    ]
  },
  {
    id: "arrays",
    test: /array|map\(|filter\(|reduce|foreach|push|pop|shift|unshift|splice|slice|destructur|spread|sort\(|find\(|includes|indexof|some\(|every\(|lists of data/i,
    intro: (p) =>
      "<p>Arrays are ordered lists of values — the workhorse data structure of JavaScript. You will create them, read items by their zero-based <b>index</b>, add and remove elements, and — most importantly — transform them with elegant <b>higher-order methods</b> like <code>map</code>, <code>filter</code> and <code>reduce</code>. This lesson, <b>" + esc(p.title) + "</b>, turns loops into one-liners.</p>" +
      "<p>The higher-order methods describe <i>what</i> you want (\"double every price\", \"keep the adults\") instead of <i>how</i> to walk the list — less code, fewer bugs, and code that reads like English.</p>",
    points: [
      "Indexes start at <b>0</b>: <code>arr[0]</code> is the first element",
      "<code>push</code>/<code>pop</code> add/remove at the end; <code>unshift</code>/<code>shift</code> at the front",
      "<code>map</code> transforms every element; <code>filter</code> keeps matching elements; <code>reduce</code> folds the list into one value",
      "<b>Destructuring</b> unpacks values: <code>const [first, second] = arr</code>",
      "<code>slice</code> copies a portion; <code>splice</code> mutates by removing/replacing"
    ],
    code: [{
      file: "arrays.js",
      code: "const prices = [10, 25, 8, 40];\n\nconst doubled = prices.map((p) => p * 2);\nconst affordable = prices.filter((p) => p <= 25);\nconst total = prices.reduce((sum, p) => sum + p, 0);\n\nconsole.log(doubled);    // [20, 50, 16, 80]\nconsole.log(affordable); // [10, 25, 8]\nconsole.log(total);      // 83",
      output: "[ 20, 50, 16, 80 ]\n[ 10, 25, 8 ]\n83"
    }],
    callout: (p) => "<b>Why it matters:</b> teams read <code>prices.filter(p =&gt; p &lt;= 25)</code> as \"prices under 25\" — the intent is visible in one line.",
    questions: [
      { q: "What is the index of the last element in a 4-item array?", a: "<b>3</b> — indexes are zero-based, so a length-4 array runs from 0 to 3 (<code>arr.length - 1</code>)." },
      { q: "What does [1, 2, 3].map((n) => n * 2) return?", a: "<code>[2, 4, 6]</code> — <code>map</code> applies the function to every element and returns a new array." },
      { q: "What is the difference between slice and splice?", a: "<code>slice</code> <b>returns a copy</b> of a portion without changing the original; <code>splice</code> <b>mutates</b> the array by removing or replacing elements." }
    ]
  },
  {
    id: "objects",
    test: /object|json|key.?value|property|entries|destructur|bracket|dot notation|url\b|urlsearchparams|structured data/i,
    intro: (p) =>
      "<p>Objects store related data as <b>key-value pairs</b> — the way JavaScript models real things: a user has a name, an email, an age. You read values with <b>dot notation</b> (<code>user.name</code>) or dynamic <b>bracket notation</b> (<code>user[\"name\"]</code>), and you can reshape whole objects with destructuring. In <b>" + esc(p.title) + "</b> you will become fluent with them.</p>" +
      "<p>Objects are also the format behind <b>JSON</b> — the text format every API speaks. Learning to convert between objects and JSON (<code>JSON.stringify</code> / <code>JSON.parse</code>) is the key to talking to web servers.</p>",
    points: [
      "Create objects with braces: <code>const user = { name: \"Ada\", age: 36 }</code>",
      "Read with dot notation; use brackets for dynamic keys: <code>user[key]</code>",
      "<b>Destructuring</b> pulls fields into variables: <code>const { name } = user</code>",
      "<code>Object.keys()</code>, <code>Object.values()</code> and <code>Object.entries()</code> inspect objects",
      "<code>JSON.stringify</code> → text; <code>JSON.parse</code> → object"
    ],
    code: [{
      file: "objects.js",
      code: "const user = { name: \"Ada\", role: \"engineer\" };\n\nconst { name, role } = user;\nconsole.log(name, role);\n\nconst json = JSON.stringify(user);\nconsole.log(json);\n\nconst back = JSON.parse(json);\nconsole.log(back.name);",
      output: "Ada engineer\n{\"name\":\"Ada\",\"role\":\"engineer\"}\nAda"
    }],
    callout: (p) => "<b>Gotcha:</b> bracket notation accepts a <i>variable</i> holding the key name — that is how you access properties dynamically.",
    questions: [
      { q: "How do you access user.age using bracket notation?", a: "<code>user[\"age\"]</code> or, with a variable, <code>const key = \"age\"; user[key]</code>." },
      { q: "What does JSON.stringify({ a: 1 }) produce?", a: "The JSON text <code>{\"a\":1}</code> — quotes around keys, no trailing commas." },
      { q: "What does const { name } = user do?", a: "It <b>destructures</b> the <code>name</code> property into a local variable called <code>name</code>." }
    ]
  },
  {
    id: "dom",
    test: /dom|document|element|queryselector|getelement|createelement|classlist|attribute|node|innerhtml|textcontent|append|selecting/i,
    intro: (p) =>
      "<p>The <b>Document Object Model (DOM)</b> is the browser's live, structured tree of your HTML page. JavaScript uses it to <i>find</i> elements, <i>read</i> their content and <i>change</i> them — which is how web pages become interactive. In <b>" + esc(p.title) + "</b> you will learn the core selectors and manipulation APIs used in every real project.</p>" +
      "<p>The golden rule of DOM updates: use <code>textContent</code> for text (it is safe and fast) and treat <code>innerHTML</code> with care, since it parses markup and can introduce security problems with untrusted data.</p>",
    points: [
      "<code>document.querySelector(\".btn\")</code> returns the first matching element; <code>querySelectorAll</code> returns all",
      "<code>createElement</code> + <code>append</code> build new nodes dynamically",
      "<code>classList.add/remove/toggle</code> is the clean way to style things on demand",
      "Use <code>textContent</code> for text updates — never trust raw user input with <code>innerHTML</code>"
    ],
    code: [{
      file: "dom.js",
      code: "// Find the button and the heading\nconst btn = document.querySelector(\"#saveBtn\");\nconst title = document.querySelector(\"h1\");\n\n// React to a click\nbtn.addEventListener(\"click\", () => {\n  title.textContent = \"Saved! \";\n  title.classList.add(\"saved\");\n});",
      output: "> click #saveBtn\nh1.textContent → \"Saved!\"\nh1.classList → [\"saved\"]"
    }],
    callout: (p) => "<b>Safety first:</b> if you ever need <code>innerHTML</code> with user content, escape or sanitize it — see the security lessons later in this roadmap.",
    questions: [
      { q: "Which method returns ALL elements matching a CSS selector?", a: "<code>document.querySelectorAll(selector)</code> returns a static NodeList of every match." },
      { q: "What is the difference between textContent and innerHTML?", a: "<code>textContent</code> sets plain text safely; <code>innerHTML</code> parses HTML markup, which is powerful but risky with untrusted input." },
      { q: "How do you add a CSS class to an element?", a: "<code>element.classList.add(\"active\")</code> — and <code>toggle</code>/<code>remove</code> for the other cases." }
    ]
  },
  {
    id: "events",
    test: /event|addEventlistener|listener|click|keyboard|mouse|propagation|bubbling|capture|delegation|preventdefault|stoppropagation|input events/i,
    intro: (p) =>
      "<p>Events are how JavaScript reacts to the user: clicks, key presses, form submissions, scrolls. You attach a <b>listener</b> with <code>addEventListener</code>, and the browser calls your function whenever the event fires. In <b>" + esc(p.title) + "</b> you will also learn how events <b>propagate</b> through the DOM — and how to control it.</p>" +
      "<p>Two ideas unlock the whole system: <b>event bubbling</b> (an event travels from the target up to the document) and <b>event delegation</b> (listen once on a parent to handle many children — perfect for dynamic lists).</p>",
    points: [
      "<code>addEventListener(\"click\", handler)</code> wires a function to an event",
      "The event object carries details: <code>event.target</code>, <code>event.key</code>, <code>event.clientX</code>…",
      "<b>Bubbling</b> lets a parent catch events from its children; <code>stopPropagation</code> halts the journey",
      "<b>Delegation</b> = one listener on a container handles all current + future children"
    ],
    code: [{
      file: "events.js",
      code: "const list = document.querySelector(\"ul\");\n\n// One listener for EVERY <li>, now and later (delegation)\nlist.addEventListener(\"click\", (event) => {\n  const item = event.target.closest(\"li\");\n  if (item) console.log(\"Clicked:\", item.textContent);\n});",
      output: "> click first <li>\nClicked: First item"
    }],
    callout: (p) => "<b>Why delegation:</b> if you add listeners to each <code>&lt;li&gt;</code> and later add more items, the new ones need wiring again — delegation avoids that entirely.",
    questions: [
      { q: "What is event bubbling?", a: "The event fires on the target, then bubbles up through each ancestor — so a container's listener can catch events from any child." },
      { q: "What does event.preventDefault() do?", a: "It stops the browser's default action — e.g. keeping a form from reloading the page on submit." },
      { q: "How does event delegation work?", a: "Attach one listener to a parent element and use <code>event.target.closest()</code> to detect which child was clicked — new children work automatically." }
    ]
  },
  {
    id: "async",
    test: /async|await|promise|fetch|callback|settimeout|setinterval|timer|microtask|event loop|concurren|race|allsettled|network|i\/o/i,
    intro: (p) =>
      "<p>JavaScript runs on a <b>single thread</b>, so long operations (network requests, timers, file reads) must not freeze the page. Instead, they run asynchronously: the engine starts them, moves on, and <i>comes back</i> when they finish. <b>Promises</b> model that \"later\" result, and <code>async/await</code> makes the code read like plain, synchronous logic. This lesson — <b>" + esc(p.title) + "</b> — is the heart of modern JavaScript.</p>" +
      "<p>An <code>async</code> function always returns a Promise. Inside it, <code>await</code> pauses the function until a promise settles — no callback pyramids, just clear, sequential code with <code>try/catch</code> for errors.</p>",
    points: [
      "A <b>Promise</b> has three states: pending, fulfilled, rejected",
      "<code>await</code> pauses an async function until a promise settles",
      "<code>try / catch</code> around <code>await</code> handles failures elegantly",
      "<code>Promise.all</code> runs requests in parallel; <code>Promise.allSettled</code> waits for all even when some fail"
    ],
    code: [{
      file: "async.js",
      code: "async function loadUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    const user = await res.json();\n    console.log(user.name);\n  } catch (err) {\n    console.error(\"Failed:\", err.message);\n  }\n}\n\nloadUser(1);",
      output: "Ada Lovelace"
    }],
    callout: (p) => "<b>Mental model:</b> <code>await</code> lets async code read top-to-bottom, while the engine keeps the page responsive in the background.",
    questions: [
      { q: "What are the three states of a Promise?", a: "<b>Pending</b> (working), <b>fulfilled</b> (resolved with a value) and <b>rejected</b> (failed with a reason)." },
      { q: "What does await do?", a: "It pauses execution of the enclosing async function until the promise settles, then resumes with its value (or throws on rejection)." },
      { q: "Why use Promise.all over sequential awaits?", a: "Because the requests run <b>in parallel</b>, finishing in roughly the time of the slowest one instead of the sum of all." }
    ]
  },
  {
    id: "classes",
    test: /class\b|constructor|prototype|inheritance|extends|super\b|oop|private field|static method|getter|setter|instantiation/i,
    intro: (p) =>
      "<p>Classes are templates for creating objects that share behavior. JavaScript classes — introduced in ES6 — sit on top of the language's <b>prototype-based</b> inheritance, giving you familiar OOP structure: constructors, methods, getters/setters, static helpers and <code>extends</code> for inheritance. In <b>" + esc(p.title) + "</b> you will design your own.</p>" +
      "<p>Every instance created with <code>new</code> runs the <b>constructor</b> to set up its own state, while methods live once on the prototype — shared by all instances.</p>",
    points: [
      "<code>class</code> + <code>constructor</code> define the shape of instances",
      "<b>Getters/setters</b> control access to properties; <b>static</b> methods live on the class itself",
      "<code>#private</code> fields keep state truly internal",
      "<code>extends</code> + <code>super()</code> build class hierarchies with method overriding"
    ],
    code: [{
      file: "class.js",
      code: "class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return this.name + \" makes a sound\"; }\n}\n\nclass Dog extends Animal {\n  speak() { return this.name + \" barks\"; } // override\n}\n\nconst rex = new Dog(\"Rex\");\nconsole.log(rex.speak()); // Rex barks",
      output: "Rex barks"
    }],
    callout: (p) => "<b>Note:</b> <code>super()</code> must be called before using <code>this</code> inside a subclass constructor.",
    questions: [
      { q: "What runs when you write new Dog(\"Rex\")?", a: "The <b>constructor</b> — here it sets <code>this.name = \"Rex\"</code> — and the instance inherits the class methods via the prototype." },
      { q: "How does a subclass reuse the parent's logic?", a: "It calls <code>super()</code> in its constructor and can call <code>super.method()</code> to reuse parent behavior before overriding." },
      { q: "What is a static method?", a: "A method called on the <b>class itself</b> (e.g. <code>Math.round</code>) rather than on an instance." }
    ]
  },
  {
    id: "scope",
    test: /scope|hoist|closure|lexical|temporal dead|tdz|encapsul|this keyword|binding|call\(|apply\(|bind\(/i,
    intro: (p) =>
      "<p>Scope defines <i>where</i> a variable is visible, and closures are the superpower it unlocks. Every function remembers the scope where it was created — so a function can keep reading variables long after the outer function returned. In <b>" + esc(p.title) + "</b> you will build private state, factories and memoized helpers from this one idea.</p>" +
      "<p>Modern <code>let</code>/<code>const</code> are block-scoped, and accessing them before their declaration hits the <b>Temporal Dead Zone</b> — a deliberate error that catches ordering bugs early.</p>",
    points: [
      "<b>Block scope</b> ({ }) constrains <code>let</code>/<code>const</code>; <code>var</code> is function-scoped",
      "A <b>closure</b> captures its surrounding scope even after the outer function finishes",
      "Closures power <b>encapsulation</b> — data reachable only through the functions you return",
      "Hoisting moves declarations to the top; <code>let</code>/<code>const</code> stay uninitialized until their line (TDZ)"
    ],
    code: [{
      file: "closure.js",
      code: "function counter() {\n  let count = 0;          // private state\n  return () => ++count;   // closure keeps it alive\n}\n\nconst next = counter();\nconsole.log(next()); // 1\nconsole.log(next()); // 2\nconsole.log(next()); // 3",
      output: "1\n2\n3"
    }],
    callout: (p) => "<b>Why closures matter:</b> every module system, store pattern and React hook relies on capturing scope — master this and a whole class of \"magic\" becomes obvious.",
    questions: [
      { q: "What is a closure?", a: "A function that keeps access to its <b>lexical scope</b> — the variables in scope where it was defined — even after that scope has exited." },
      { q: "In the counter example, where does count live?", a: "Inside the closure's captured scope — no other code can touch it, which is exactly the point (encapsulation)." },
      { q: "What is the Temporal Dead Zone?", a: "The period before a <code>let</code>/<code>const</code> declaration executes where accessing it throws a <b>ReferenceError</b>." }
    ]
  },
  {
    id: "errors",
    test: /error|try|catch|throw|exception|finally/i,
    intro: (p) =>
      "<p>Errors are facts of programming life — professional code plans for them. JavaScript gives you <code>try / catch / finally</code> to <i>handle</i> failures gracefully and <code>throw</code> to <i>signal</i> them. In <b>" + esc(p.title) + "</b> you will learn to fail loudly, recover cleanly, and keep the rest of your program running.</p>" +
      "<p>Distinguish the three blocks: <code>try</code> runs the risky code, <code>catch</code> runs when it throws (receiving the error), and <code>finally</code> always runs — perfect for cleanup like closing connections.</p>",
    points: [
      "<code>try { risky() } catch (err) { recover() }</code> — catch receives the error object",
      "<code>throw new Error(\"message\")</code> creates and raises your own errors",
      "<code>finally</code> executes whether or not an error occurred",
      "Custom error classes carry domain meaning (e.g. <code>ValidationError</code>)"
    ],
    code: [{
      file: "errors.js",
      code: "function divide(a, b) {\n  if (b === 0) throw new Error(\"Cannot divide by zero\");\n  return a / b;\n}\n\ntry {\n  console.log(divide(10, 2)); // 5\n  console.log(divide(10, 0)); // throws\n} catch (err) {\n  console.error(\"Caught:\", err.message);\n} finally {\n  console.log(\"Done.\");\n}",
      output: "5\nCaught: Cannot divide by zero\nDone."
    }],
    callout: (p) => "<b>Mindset:</b> a thrown error is a clear, debuggable message; a silent failure is a mystery. Prefer throwing over returning <code>undefined</code> for exceptional cases.",
    questions: [
      { q: "Which block always runs, error or not?", a: "<code>finally</code> — ideal for cleanup such as closing files or clearing timers." },
      { q: "How do you create your own error?", a: "<code>throw new Error(\"Something went wrong\")</code> — the message lands in <code>err.message</code>." },
      { q: "What is the point of custom error classes?", a: "They make failures <b>identifiable</b> — you can catch a <code>ValidationError</code> specifically and react differently than to a <code>NetworkError</code>." }
    ]
  },
  {
    id: "storage",
    test: /localstorage|sessionstorage|storage|clipboard|notification|geolocation/i,
    intro: (p) =>
      "<p>Browsers can remember things for you. <code>localStorage</code> and <code>sessionStorage</code> store small key-value pairs on the user's device — the first persists across visits and restarts, the second only for the current tab session. In <b>" + esc(p.title) + "</b> you will persist preferences, drafts and even game high-scores.</p>" +
      "<p>Both storages only accept strings, so real data goes through <code>JSON.stringify</code> on the way in and <code>JSON.parse</code> on the way out — a pattern you will use constantly.</p>",
    points: [
      "<code>localStorage.setItem(key, value)</code> and <code>getItem(key)</code> — both always strings",
      "<code>localStorage</code> survives browser restarts; <code>sessionStorage</code> dies with the tab",
      "Wrap objects with <code>JSON.stringify</code>/<code>JSON.parse</code>",
      "Guard reads with try/catch — storage can throw (private mode, quota)"
    ],
    code: [{
      file: "storage.js",
      code: "const prefs = { theme: \"dark\", fontSize: 16 };\n\n// Save\nlocalStorage.setItem(\"prefs\", JSON.stringify(prefs));\n\n// Load\nconst saved = JSON.parse(localStorage.getItem(\"prefs\") || \"{}\");\nconsole.log(saved.theme); // dark",
      output: "dark"
    }],
    callout: (p) => "<b>Privacy note:</b> stored data stays on the user's device — never store passwords or tokens in localStorage.",
    questions: [
      { q: "What is the key difference between localStorage and sessionStorage?", a: "<code>localStorage</code> persists until explicitly removed, even across browser restarts; <code>sessionStorage</code> is cleared when the tab closes." },
      { q: "Why do we JSON.stringify objects before storing them?", a: "Because storage only accepts <b>strings</b> — serializing the object preserves its structure for <code>JSON.parse</code> later." },
      { q: "How do you remove one stored key?", a: "<code>localStorage.removeItem(\"prefs\")</code>." }
    ]
  },
  {
    id: "modules",
    test: /module|import|export|npm|package|bundler|esbuild|vite|babel|commonjs|ecmascript module|monorepo/i,
    intro: (p) =>
      "<p>Modules let you split code into focused files that import what they need — no more giant scripts, no more accidental global variables. Native <b>ES modules</b> (<code>import</code>/<code>export</code>) are the modern standard, and this very dashboard is built with them. In <b>" + esc(p.title) + "</b> you will structure code the way professional projects do.</p>" +
      "<p>Combine modules with a package manager (<code>npm</code>) and a bundler (<code>Vite</code>, <code>esbuild</code>) and you have the full modern toolchain: dependencies, dev servers, tree-shaking and production builds.</p>",
    points: [
      "<code>export</code> exposes values; <code>import</code> consumes them (named or default)",
      "ES modules are <b>statically analyzable</b> — the bundler knows your graph at build time",
      "<code>package.json</code> tracks dependencies with <b>SemVer</b> versions",
      "Dynamic <code>import()</code> loads code on demand — great for big chunks and lazy routes"
    ],
    code: [{
      file: "math.js",
      code: "export const double = (n) => n * 2;\nexport default function greet(name) {\n  return \"Hello, \" + name;\n}",
      output: ""
    }, {
      file: "app.js",
      code: "import greet, { double } from \"./math.js\";\n\nconsole.log(greet(\"Ada\")); // Hello, Ada\nconsole.log(double(21));    // 42",
      output: "Hello, Ada\n42"
    }],
    callout: (p) => "<b>Why modules:</b> explicit imports make dependencies visible, avoid naming collisions, and let tools tree-shake unused code from your final bundle.",
    questions: [
      { q: "What is the difference between a named and a default export?", a: "A module has <b>one</b> default export imported without braces (<code>import x from</code>) and any number of named exports imported with braces (<code>import { y } from</code>)." },
      { q: "What problem do modules solve?", a: "They remove global scope pollution and make <b>dependencies explicit</b>, so files can be reasoned about — and bundled — independently." },
      { q: "When would you use dynamic import()?", a: "To load a module <b>on demand</b> — for example a heavy chart library only when the chart is actually shown." }
    ]
  },
  {
    id: "testing",
    test: /test|vitest|jest|assert|tdd|mock|spy|playwright|e2e|describe|expect|coverage/i,
    intro: (p) =>
      "<p>Tests are executable documentation: they pin down what your code should do and catch regressions the moment they appear. Modern tooling — <b>Vitest</b> or <b>Jest</b> — makes writing tests as fast as writing the code itself. In <b>" + esc(p.title) + "</b> you will adopt the test-driven mindset used across the industry.</p>" +
      "<p>The core rhythm is simple: <code>describe</code> groups related tests, <code>it</code> declares one behavior, and <code>expect(...).toBe(...)</code> asserts it. Run the suite, watch it fail, make it pass, refactor — the TDD loop.</p>",
    points: [
      "<code>describe</code> / <code>it</code> / <code>expect</code> are the vocabulary of a test suite",
      "Test <b>behavior</b>, not implementation — assert what the function returns, not how it works",
      "<b>Mocks and spies</b> isolate the code under test from its dependencies",
      "E2E tools like Playwright drive a real browser through the whole app"
    ],
    code: [{
      file: "double.test.js",
      code: "import { describe, it, expect } from \"vitest\";\nimport { double } from \"./math.js\";\n\ndescribe(\"double\", () => {\n  it(\"doubles positive numbers\", () => {\n    expect(double(2)).toBe(4);\n  });\n  it(\"doubles zero\", () => {\n    expect(double(0)).toBe(0);\n  });\n});",
      output: "✓ double > doubles positive numbers\n✓ double > doubles zero\n\nTest Files  1 passed (1)\nTests       2 passed (2)"
    }],
    callout: (p) => "<b>Mindset:</b> a failing test that precisely describes the bug is worth more than a working fix you cannot explain.",
    questions: [
      { q: "What are describe, it and expect used for?", a: "<code>describe</code> groups related tests, <code>it</code> defines a single behavior, and <code>expect</code> makes assertions about the result." },
      { q: "What is a mock?", a: "A stand-in for a real dependency that lets you control its behavior and record how it was called — isolating the code you are testing." },
      { q: "What does E2E testing mean?", a: "End-to-end: a tool like <b>Playwright</b> drives a real browser through the full application flow, verifying the whole stack works together." }
    ]
  },
  {
    id: "performance",
    test: /performance|render|reflow|repaint|observer|garbage|memory|v8|engine|call stack|microtask|scheduling|frame|raf|vitals|leak|jank/i,
    intro: (p) =>
      "<p>Performance is a feature: fast pages feel better, rank higher and convert better. In <b>" + esc(p.title) + "</b> you will look under the hood — how the engine compiles your code (AST → bytecode → optimized machine code), how the browser turns HTML into pixels, and where your app spends its time.</p>" +
      "<p>Two numbers dominate: <b>Layout</b> (computing positions) and <b>Paint</b> (drawing pixels). Read/write batching, <code>requestAnimationFrame</code> and avoiding layout thrashing keep interactions at a silky 60&nbsp;fps.</p>",
    points: [
      "The rendering pipeline: DOM → CSSOM → Render Tree → Layout → Paint → Composite",
      "<b>Reflow</b> recomputes geometry; <b>repaint</b> redraws pixels — reflows are the expensive ones",
      "Batch reads and writes to avoid <b>layout thrashing</b>",
      "Observers (<code>IntersectionObserver</code>, <code>ResizeObserver</code>) defer work until it is actually needed"
    ],
    code: [{
      file: "perf.js",
      code: "// Bad: read/write interleaved → forces reflow every iteration\nitems.forEach((item) => {\n  const w = item.offsetWidth; // read\n  item.style.width = w + \"px\"; // write → reflow\n});\n\n// Good: batch the reads, then batch the writes\nconst widths = items.map((item) => item.offsetWidth);\nwidths.forEach((w, i) => (items[i].style.width = w + \"px\"));",
      output: "→ 2 reflows total (vs 1000+)"
    }],
    callout: (p) => "<b>Rule of thumb:</b> keep the critical path lean, measure with the Performance panel, and let observers — not timers — drive off-screen work.",
    questions: [
      { q: "What is the difference between reflow and repaint?", a: "<b>Reflow</b> recalculates element geometry and is expensive; <b>repaint</b> redraws pixels when only visuals change (e.g. color)." },
      { q: "What is layout thrashing?", a: "Forcing the browser to reflow repeatedly by interleaving DOM reads with DOM writes — batching reads and writes avoids it." },
      { q: "What is requestAnimationFrame for?", a: "Scheduling work before the next paint — the right tool for animations and scroll-driven updates." }
    ]
  },
  {
    id: "network",
    test: /http|fetch|request|response|rest|api|network|server|node\.js|express|websocket|client.?server/i,
    intro: (p) =>
      "<p>Modern apps are conversations between a client (your browser) and a server over HTTP. <b>REST</b> organizes that conversation around resources — GET to read, POST to create, PUT to update, DELETE to remove. In <b>" + esc(p.title) + "</b> you will master the <code>fetch</code> API and the request/response model behind every web API.</p>" +
      "<p>A request is more than a URL: it carries a <b>method</b>, optional <b>headers</b> and a <b>body</b>; the response comes back with a status code (200 OK, 404 Not Found…) and a payload, usually JSON.</p>",
    points: [
      "<code>fetch(url)</code> returns a promise of a <b>Response</b>; <code>res.json()</code> parses the body",
      "HTTP verbs map to actions: GET / POST / PUT / DELETE",
      "Headers carry metadata — content type, auth tokens, caching hints",
      "<code>AbortController</code> cancels in-flight requests cleanly"
    ],
    code: [{
      file: "api.js",
      code: "async function saveUser(user) {\n  const res = await fetch(\"/api/users\", {\n    method: \"POST\",\n    headers: { \"Content-Type\": \"application/json\" },\n    body: JSON.stringify(user),\n  });\n  if (!res.ok) throw new Error(\"Request failed: \" + res.status);\n  return res.json();\n}",
      output: "POST /api/users → 201 Created\n{ id: 1, name: \"Ada\" }"
    }],
    callout: (p) => "<b>Always check res.ok:</b> a 404 or 500 still resolves the promise — only the <code>ok</code> flag and status code tell you the truth.",
    questions: [
      { q: "Which HTTP method creates a new resource?", a: "<b>POST</b> — with GET for reading, PUT for full updates and DELETE for removal." },
      { q: "What does res.json() do?", a: "It reads the response body and parses it as JSON, returning a promise of the resulting object." },
      { q: "How do you cancel a fetch?", a: "Pass an <code>AbortController</code>'s signal to <code>fetch</code> and call <code>abort()</code> — the request is cancelled and the promise rejects." }
    ]
  },
  {
    id: "security",
    test: /security|xss|csrf|cors|csp|sanitiz|attack|injection/i,
    intro: (p) =>
      "<p>Security is a system property, not a feature — and most web vulnerabilities are caused by trusting input. In <b>" + esc(p.title) + "</b> you will learn the three attacks every developer must know — <b>XSS</b>, <b>CSRF</b> and data injection — and the layered defenses that stop them.</p>" +
      "<p>XSS happens when attacker-controlled text is rendered as HTML; CSRF happens when a logged-in user is tricked into sending a state-changing request. Both are preventable with the right habits.</p>",
    points: [
      "Never inject user input into <code>innerHTML</code> — escape or sanitize it (DOMPurify)",
      "<b>Content Security Policy</b> blocks unexpected scripts even if a payload slips through",
      "CSRF tokens verify that a request was intentional, not forged by another site",
      "<b>CORS</b> lets servers decide which origins may read their responses"
    ],
    code: [{
      file: "safe.js",
      code: "// ❌ Dangerous: render() treats username as HTML\n// el.innerHTML = \"<p>Welcome \" + username + \"</p>\";\n\n// ✅ Safe: textContent is inert — always plain text\nel.textContent = \"Welcome \" + username;\n\n// Or sanitize before inserting:\n// el.innerHTML = DOMPurify.sanitize(userHtml);",
      output: "username = <img src=x onerror=alert(1)>\n→ rendered as plain text — no script runs"
    }],
    callout: (p) => "<b>Default to textContent:</b> it is impossible to inject markup through it, which eliminates the most common XSS vector at the source.",
    questions: [
      { q: "What is XSS?", a: "Cross-Site Scripting — injecting executable script through user-supplied content that is rendered as HTML. Prevent with escaping, sanitization and CSP." },
      { q: "Why is textContent safer than innerHTML?", a: "Because it inserts <b>plain text</b> — any <code>&lt;script&gt;</code> in the input stays inert text instead of executing." },
      { q: "What does a CSP do?", a: "It tells the browser which sources of scripts/styles are allowed, so an injected payload is blocked before it can run." }
    ]
  }
];

/* ---------- fallback profile ---------- */
function fallbackProfile(p) {
  return {
    intro:
      "<p>Every concept in JavaScript builds on a small set of core ideas — and <b>" + esc(p.title) + "</b> is one of the building blocks you will reach for again and again. This lesson gives you the mental model, a concrete example, and practice to lock it in.</p>" +
      "<p>As you work through the module <b>" + esc(p.topic) + "</b>, remember the LearnJS approach: read the idea, run the example, break the example, and only then move on. Experimenting is how understanding sticks.</p>",
    points: [
      "Focus on the <b>why</b> behind the syntax — the mental model matters more than memorizing APIs",
      "Run each example and change one thing at a time to see what breaks",
      "Relate this lesson to the ones around it in the roadmap — everything connects",
      "Write the example from memory after reading it — retrieval beats re-reading"
    ],
    code: [{
      file: "lesson.js",
      code: "// " + p.num + " — " + p.title + "\n// The fastest way to learn: type it, run it, tweak it.\n\nconst lesson = {\n  topic: \"" + p.topicTitle + "\",\n  level: " + p.level + ",\n  status: \"in progress\"\n};\n\nconsole.log(\"Learning:\", lesson.topic);\nconsole.log(\"Status:\", lesson.status);",
      output: "Learning: " + p.topicTitle + "\nStatus: in progress"
    }],
    callout:
      "<b>Study tip:</b> open your DevTools console right now and rewrite the example in your own words — that single habit compounds across every lesson.",
    questions: [
      { q: "Why is it better to type an example than to copy-paste it?", a: "Typing forces your brain to process each token — it turns passive reading into active practice, which dramatically improves retention." },
      { q: "What should you do when an example does not behave as expected?", a: "Read the error message first (they are precise), then <code>console.log</code> intermediate values to see where reality diverges from the model." },
      { q: "How does this lesson connect to the module \"" + p.topicTitle + "\"?", a: "It is one concrete case of the module's core idea — mastering it strengthens the whole topic." }
    ]
  };
}

/* ---------- public API ---------- */
/**
 * Build the full lesson body HTML for a given lesson.
 * @param {Object} ctx { level, topic, lessonIndex, num, title, topicTitle, track, levelNo }
 */
export function buildLessonContent(ctx) {
  const hay = ctx.title + " " + ctx.topicTitle;
  const profile = PROFILES.find((pr) => pr.test.test(hay)) || null;
  const p = profile || fallbackProfile(ctx);

  const intro = typeof p.intro === "function" ? p.intro(ctx) : p.intro;
  const pointList = typeof p.points === "function" ? p.points(ctx) : p.points;
  const calloutText = p.callout ? (typeof p.callout === "function" ? p.callout(ctx) : p.callout) : null;
  const questions = typeof p.questions === "function" ? p.questions(ctx) : p.questions;

  const examples = (p.code || []).map((ex) =>
    codeBlock(ex.file, ex.code) + (ex.output ? outputBlock(ex.output) : "")
  ).join("");

  return (
    illustration(ctx.num, ctx.track) +
    section("Overview", "<p>" + intro + "</p>") +
    section("Key concepts", points(pointList)) +
    (calloutText ? callout(calloutText) : "") +
    section("Code example", examples) +
    section("Practice questions", practice(questions || []))
  );
}
// end of lesson-content.js
