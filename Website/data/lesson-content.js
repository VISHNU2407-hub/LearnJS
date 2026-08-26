/* ============================================================
   LearnJS — lesson-content.js (data/ — AUTHORED LESSON CONTENT)

   Rich teaching content for individual roadmap lessons, kept
   completely separate from the UI (js/roadmap/learning.js renders
   whatever it finds here through a generic renderer).

   KEY: the lesson NUMBER that prefixes the subtopic title in
   roadmap.json ("1.1.1 What JavaScript Does on the Web" → "1.1.1").

   SCHEMA (one entry per authored lesson — future lessons just add
   another key, no UI changes needed):

   lesson = {
     id,            // stable slug
     number,        // "1.1.1"
     title,
     description,   // short lead shown under the lesson header
     sections: [    // prose blocks, rendered before the code examples
       { heading, paragraphs: [...], list?: [...] }
     ],
     codeExamples: [{
       heading?, file, language?, code, output?,
       explanation: [...]   // "how it works" bullets (rich text ok)
     }],
     sectionsAfterCode?: [ // optional prose blocks rendered AFTER the
       ...                 // code examples (same shape as sections)
     ],
     visualExplanation?: {   // optional layered diagram
       heading,
       items: [{ lang, result, note? }]   // stacked top→bottom
     },
     keyTakeaways: [...],     // 3–5 summary points
     practice: {
       task,                  // single-task form …
       hints?: [...], note?
       — or multi-task form —
       intro?, tasks: [{ text, expected? }], note?
     }
   }

   TRUSTED HTML: description/paragraphs/list/explanation/hints/task
   may contain inline markup (<b>, <code>, …) because they come from
   this first-party file — the renderer inserts them as HTML.
   Code samples and output strings are ALWAYS escaped by the renderer.
   ============================================================ */

export const LESSON_CONTENT = {
  "1.1.1": {
    id: "what-javascript-does-on-the-web",
    number: "1.1.1",
    title: "What JavaScript Does on the Web",
    description:
      "Meet the language that makes the web interactive: what JavaScript is, " +
      "how it teams up with HTML and CSS, and how a few lines of code can " +
      "respond to a click.",

    sections: [
      {
        heading: "What is JavaScript?",
        paragraphs: [
          "<b>JavaScript is a programming language that runs inside every web browser.</b> " +
            "If a web page were a person, HTML would be its skeleton, CSS its clothes — and JavaScript " +
            "its muscles and brain: the part that moves and reacts.",
          "It was created in 1995 to make web pages do <i>something</i> instead of just sitting there, " +
            "and it grew into one of the most popular programming languages in the world. It also runs " +
            "outside the browser (Node.js powers servers with it), but its home turf is the page you " +
            "are looking at right now."
        ]
      },
      {
        heading: "Why do websites use JavaScript?",
        list: [
          "<b>To react instantly</b> — respond to clicks, taps and typing without reloading the whole page",
          "<b>To update parts of a page</b> while the rest stays where it is (new chat messages, like counters, live scores)",
          "<b>To validate forms</b> before sending them — catching a missing \u201c@\u201d in an email before any request is made",
          "<b>To load fresh data quietly</b> in the background — news feeds, product prices, notifications",
          "<b>To remember things about you</b> — dark mode preference, items in a shopping cart",
          "<b>To run entire applications</b> in the browser — mail clients, editors and streaming sites are built with it"
        ]
      },
      {
        heading: "What JavaScript does inside your browser",
        paragraphs: [
          "When the browser loads a page, it turns your HTML into a live, tree-shaped map of the page " +
            "called the <b>DOM</b> (Document Object Model). Every tag becomes an object that JavaScript " +
            "can find, read and change — at any moment, while you watch."
        ],
        list: [
          "<b>Find</b> elements — \u201cget me the search box\u201d, \u201cget me the third card\u201d",
          "<b>Change</b> their text, attributes or CSS styles",
          "<b>Create or remove</b> elements on the fly",
          "<b>Listen for events</b> — clicks, key presses, form submissions — and run code in response",
          "<b>Store small amounts of data</b> locally on the device"
        ]
      },
      {
        heading: "How HTML, CSS and JavaScript work together",
        paragraphs: [
          "The three languages have separate jobs and usually live in separate files. The browser loads " +
            "them together and lets them talk: CSS styles what HTML describes, and JavaScript listens to " +
            "what the user does to that HTML — then reacts by changing content, or by toggling classes " +
            "that CSS responds to.",
          "They meet in two places: the <b>DOM</b> (JavaScript's view of the HTML) and <b>events</b> " +
            "(JavaScript's way of hearing what the user does). Master those two ideas and interactivity " +
            "starts feeling simple."
        ]
      },
      {
        heading: "A real-world example: the like button",
        paragraphs: [
          "Think about the heart under a video. <b>HTML</b> puts the button on the page with the count " +
            "\u201c1.2K\u201d next to it. <b>CSS</b> makes the heart red and gives it that satisfying pop " +
            "animation. <b>JavaScript</b> notices your click, bumps the number to 1.2K&nbsp;+&nbsp;1, plays " +
            "the animation by adding a class — and saves the fact that you liked it so it survives a refresh. " +
            "Three technologies, three jobs, one tiny interaction."
        ]
      }
    ],

    codeExamples: [
      {
        heading: "Your first interactive line of code",
        file: "app.js",
        language: "JavaScript",
        code: "const button = document.querySelector(\"button\");\n\nbutton.addEventListener(\"click\", () => {\n    alert(\"Hello JavaScript!\");\n});",
        output: "> click\n\u2192 alert dialog appears: \u201cHello JavaScript!\u201d",
        preview: {
          html: '<div class="lp-preview-center"><button class="lp-preview-btn">Click Me</button><p class="lp-preview-hint">Click the button to see JavaScript in action.</p></div>',
          script: "const button = document.querySelector('.lp-preview-btn');\nbutton.addEventListener('click', () => {\n    alert('Hello JavaScript!');\n});"
        },
        explanation: [
          "<code>document.querySelector(\"button\")</code> searches the page (the DOM) and returns the " +
            "<b>first</b> <code>&lt;button&gt;</code> element it finds. Think of it as asking the document: " +
            "\u201chand me the button\u201d. We save it in a <code>const</code> so we can keep using it.",
          "<code>button.addEventListener(...)</code> wires a function to the button so the browser knows " +
            "what to do when something happens. You choose the <i>type</i> of thing to listen for, and hand " +
            "over the code to run.",
          "<code>\"click\"</code> is the <b>event</b>: it fires whenever the user presses and releases the " +
            "mouse (or taps) on that exact button. Other common events: <code>keydown</code>, " +
            "<code>submit</code>, <code>input</code>.",
          "When the user clicks, the browser runs our arrow function — and <code>alert(...)</code> pops up " +
            "the little dialog saying <b>Hello JavaScript!</b>. That is the full loop: select \u2192 listen " +
            "\u2192 react."
        ]
      }
    ],

    visualExplanation: {
      heading: "HTML + CSS + JavaScript \u2014 who does what",
      items: [
        { lang: "HTML", result: "Structure", note: "The content and elements \u2014 headings, text, buttons, images" },
        { lang: "CSS", result: "Appearance", note: "Colors, spacing, layout, fonts, animations" },
        { lang: "JS", result: "Behavior / Interactivity", note: "The logic \u2014 what happens when things are clicked or typed" }
      ]
    },

    keyTakeaways: [
      "JavaScript is the programming language of the web — it runs in every browser and makes pages interactive.",
      "<b>HTML = structure</b>, <b>CSS = appearance</b>, <b>JavaScript = behavior</b>. Three languages, three jobs.",
      "The browser keeps a live map of your page (the DOM), and JavaScript can find and change anything in it.",
      "Events — like a click — let your code respond to the user instantly, without reloading the page.",
      "<code>querySelector</code> finds an element and <code>addEventListener</code> reacts to events — the two tools behind almost every interaction."
    ],

    practice: {
      compiler: true,
      task: "Create a button that displays an alert saying \u201cHello JavaScript!\u201d when clicked.",
      hints: [
        "Add a <code>&lt;button&gt;</code> element to your HTML file.",
        "Select it in JavaScript with <code>document.querySelector(\"button\")</code>.",
        "Attach <code>addEventListener(\"click\", ...)</code> and call <code>alert(\"Hello JavaScript!\")</code> inside the function."
      ],
      note: "No backend needed — everything happens right inside your browser."
    }
  },

  /* ------------------------------------------------------------------
     1.1.2 — Running Code in Browser Developer Console (console.log)
     ------------------------------------------------------------------ */
  "1.1.2": {
    id: "running-code-in-browser-developer-console",
    number: "1.1.2",
    title: "Running Code in Browser Developer Console",
    description:
      "Open the browser\u2019s built-in JavaScript scratchpad and run your first real " +
      "commands \u2014 no setup, no files, instant feedback.",

    sections: [
      {
        heading: "What is the Developer Console?",
        paragraphs: [
          "Every browser ships with a set of built-in developer tools \u2014 and the most " +
            "used panel among them is the <b>Console</b>. It is a live JavaScript scratchpad: " +
            "you type a line of code, press Enter, and the browser runs it immediately.",
          "JavaScript developers use it every day to <b>try ideas before writing files</b>, to " +
            "<b>peek at values</b> while a program runs, to <b>see error messages</b> a page produces, " +
            "and to answer quick questions (\u201cwhat does this expression return?\u201d). Learning to be " +
            "comfortable here is one of the fastest ways to learn the language."
        ]
      },
      {
        heading: "How to open the console",
        paragraphs: [
          "You open the console inside the browser\u2019s Developer Tools:"
        ],
        list: [
          "<b>Chrome / Edge:</b> press <code>F12</code> or <code>Ctrl + Shift + J</code>",
          "<b>On Mac (Chrome/Edge):</b> try <code>Cmd + Option + J</code>",
          "<b>In any browser:</b> right-click the page \u2192 choose \u201cInspect\u201d \u2192 click the <b>Console</b> tab",
          "<b>Heads-up:</b> shortcuts can vary between browsers, systems and keyboard layouts \u2014 but the Console tab always lives inside Developer Tools"
        ]
      },
      {
        heading: "Meet the prompt",
        paragraphs: [
          "When the console opens you will see a blinking cursor next to a <b>&gt;</b> prompt. That is " +
            "your input line: type JavaScript there and press <b>Enter</b> to run it. The examples below " +
            "are meant to be typed exactly there \u2014 go ahead and try each one as you read."
        ]
      }
    ],

    codeExamples: [
      {
        heading: "Your first command: printing text",
        file: "Developer Console",
        language: "JavaScript",
        code: "console.log(\"Hello, JavaScript!\");",
        output: "> console.log(\"Hello, JavaScript!\");\nHello, JavaScript!",
        explanation: [
          "<code>console.log(...)</code> is a built-in command that <b>prints whatever you give it</b> " +
            "into the console. It is the most used tool in this whole course for seeing what your code is doing.",
          "The quotes make <code>\"Hello, JavaScript!\"</code> a <b>string</b> \u2014 a piece of text. Text must " +
            "always be wrapped in quotes.",
          "Press Enter and the message appears instantly. Notice nothing changed on the web page itself \u2014 " +
            "<code>console.log</code> writes only to the console."
        ]
      },
      {
        heading: "Doing math: the console answers back",
        file: "Developer Console",
        language: "JavaScript",
        code: "2 + 3",
        output: "> 2 + 3\n5",
        explanation: [
          "Type the expression <code>2 + 3</code> and press Enter \u2014 the console evaluates it and shows the " +
            "resulting value, <b>5</b>, right below.",
          "Notice there was no <code>console.log</code> here: expressions typed directly into the console " +
            "<b>display their result automatically</b>.",
          "JavaScript is happy to do any math for you \u2014 later try <code>10 / 4</code> or <code>7 * 6</code> " +
            "and watch what comes back."
        ]
      },
      {
        heading: "Storing a value in a variable",
        file: "Developer Console",
        language: "JavaScript",
        code: "let name = \"Vishnu\";\n\nconsole.log(name);",
        output: "> let name = \"Vishnu\";\n> console.log(name);\nVishnu",
        explanation: [
          "<code>let name = \"Vishnu\";</code> creates a <b>variable</b> \u2014 a named box. The keyword " +
            "<code>let</code> announces it, <code>name</code> is its label, and <code>=</code> stores the string " +
            "<code>\"Vishnu\"</code> inside.",
          "<code>console.log(name);</code> then prints what the box contains: <b>Vishnu</b>. No quotes around " +
            "<code>name</code> this time \u2014 we want the stored value, not the word itself.",
          "If you run the lines one at a time, the <code>let</code> line may also print <code>undefined</code> " +
            "\u2014 that is normal. It just means a declaration produces no value of its own to show."
        ]
      }
    ],

    sectionsAfterCode: [
      {
        heading: "Experimenting in the console",
        paragraphs: [
          "The console is your playground \u2014 nothing you type there can break a website or your computer. Use it to:"
        ],
        list: [
          "<b>Test JavaScript quickly</b> \u2014 an idea takes seconds to check, no files or setup needed",
          "<b>Check values</b> \u2014 print a variable at any moment to see what your program really holds",
          "<b>Experiment with expressions</b> \u2014 play with math, comparisons and text operations freely",
          "<b>Debug simple problems</b> \u2014 reproduce an error in a tiny example before fixing the real code"
        ]
      },
      {
        heading: "Common beginner mistakes",
        list: [
          "<b>Forgetting quotes around strings.</b> Typing <code>console.log(hello)</code> fails unless a variable " +
            "called <code>hello</code> exists \u2014 text needs quotes: <code>console.log(\"hello\")</code>.",
          "<b>Misspelling variable names.</b> If you saved <code>name</code> but later type <code>nmae</code>, " +
            "JavaScript looks for a box that does not exist. An error like \u201c<i>nmae is not defined</i>\u201d almost " +
            "always means a typo.",
          "<b>Ignoring case sensitivity.</b> <code>console.log</code> works; <code>Console.log</code> or " +
            "<code>console.Log</code> will not. Uppercase and lowercase letters create completely different names.",
          "<b>Not reading error messages.</b> When something goes wrong the console prints red text saying exactly " +
            "what failed and where. Read it first \u2014 errors are hints, not punishments."
        ]
      }
    ],

    keyTakeaways: [
      "The Developer Console is a built-in JavaScript scratchpad in every browser \u2014 open it with F12 (or Ctrl + Shift + J) and run code instantly.",
      "<code>console.log(\"...\")</code> prints values to the console; plain expressions like <code>2 + 3</code> show their result automatically.",
      "<code>let</code> creates a variable \u2014 a named box storing a value you can reuse and print later.",
      "Use the console to test ideas, inspect values and debug \u2014 and when something fails, read the red error message before anything else.",
      "Shortcuts can vary between browsers and systems, but the Console tab always lives inside Developer Tools."
    ],

    practice: {
      compiler: true,
      intro: "Run these three mini-tasks in your browser console:",
      tasks: [
        { text: 'Print <code>"Hello JavaScript!"</code> in the console.', expected: "Hello JavaScript!" },
        { text: "Calculate <code>25 + 75</code>.", expected: "100" },
        { text: "Create a variable called <code>age</code> holding your age and print it.", expected: "your age, e.g. 25" }
      ],
      note: "No setup needed \u2014 everything happens inside the console you just learned to open."
    }
  },

  /* ------------------------------------------------------------------
     1.1.3 \u2014 Embedding Scripts in HTML (<script> Tags)
     ------------------------------------------------------------------ */
  "1.1.3": {
    id: "embedding-scripts-in-html",
    number: "1.1.3",
    title: "Embedding Scripts in HTML (<script> Tags)",
    description:
      "Learn how to connect JavaScript to your HTML pages using <script> tags " +
      "\u2014 inline, external, and where to place them for the best results.",

    sections: [
      {
        heading: "Why HTML needs a <script> tag for JavaScript",
        paragraphs: [
          "HTML describes the <i>structure</i> of a page \u2014 headings, paragraphs, buttons and " +
            "images. But HTML alone cannot react to a click, validate a form, or animate anything. " +
            "To bring those ideas to life, the browser needs to <b>load and run JavaScript</b> alongside " +
            "the HTML.",
          "The <code>&lt;script&gt;</code> tag is the bridge: it tells the browser, \u201chere comes some " +
            "JavaScript \u2014 read it and execute it.\u201d Without this tag sitting in your HTML, none of " +
            "your JS code will run on the page."
        ]
      },
      {
        heading: "Two ways to add JavaScript",
        list: [
          "<b>Inline scripts</b> \u2014 the JavaScript lives directly inside a <code>&lt;script&gt;</code> " +
            "tag in your HTML. Quick for tiny experiments, but messy for real projects.",
          "<b>External scripts</b> \u2014 the JavaScript lives in a separate <code>.js</code> file and is " +
            "loaded with <code>src</code>. This is the standard approach: it keeps HTML, CSS and JS " +
            "in their own files and lets the browser cache the script for faster loading."
        ]
      },
      {
        heading: "Where to place the <script> tag",
        paragraphs: [
          "There are two common positions, and they affect when your code runs:"
        ],
        list: [
          "<b>Before </b><code>&lt;/body&gt;</code><b> (recommended for beginners)</b> \u2014 the browser loads all " +
            "HTML first, then runs the script. The elements the script needs to find already exist on the page.",
          "<b>In the </b><code>&lt;head&gt;</code><b> with </b><code>defer</code> \u2014 the browser starts downloading the script " +
            "immediately but waits until the HTML is fully parsed before running it. Gives you the best of both " +
            "worlds: early download + late execution.",
          "<b>In the </b><code>&lt;head&gt;</code><b> without </b><code>defer</code><b> (avoid)</b> \u2014 the browser pauses loading " +
            "HTML to run the script right away. This can make the page feel slow."
        ]
      }
    ],

    codeExamples: [
      {
        heading: "Inline script \u2014 quick and direct",
        file: "index.html",
        language: "HTML",
        code: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Inline Script</title>\n</head>\n<body>\n  <h1>Hello</h1>\n\n  <script>\n    console.log(\"The page just loaded!\");\n    document.querySelector(\"h1\").style.color = \"blue\";\n  </script>\n</body>\n</html>",
        output: "> Console: \u201cThe page just loaded!\u201d\n> The <h1> on the page turns blue.",
        explanation: [
          "The <code>&lt;script&gt; ... &lt;/script&gt;</code> block sits right inside the HTML, " +
            "just before <code>&lt;/body&gt;</code>. When the browser reaches it, it runs the two lines " +
            "of JavaScript immediately.",
          "<code>document.querySelector(\"h1\")</code> grabs the heading element from the page, and " +
            "<code>.style.color = \"blue\"</code> changes its text colour. This works because the " +
            "<code>&lt;h1&gt;</code> already exists above the <code>&lt;script&gt;</code> tag.",
          "Inline scripts are great for quick experiments and tiny pages, but they mix HTML and " +
            "JavaScript in the same file \u2014 which gets hard to maintain as projects grow."
        ]
      },
      {
        heading: "External script \u2014 the professional approach",
        file: "index.html + app.js",
        language: "HTML / JavaScript",
        code: "<!-- index.html -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>External Script</title>\n</head>\n<body>\n  <h1>Hello</h1>\n  <button>Click me</button>\n\n  <script src=\"app.js\" defer></script>\n</body>\n</html>\n\n// app.js\nconst heading = document.querySelector(\"h1\");\nconst button = document.querySelector(\"button\");\n\nbutton.addEventListener(\"click\", () => {\n  heading.style.color = \"tomato\";\n  console.log(\"Colour changed!\");\n});",
        output: "> Click the button\n> The <h1> turns tomato\n> Console: \u201cColour changed!\u201d",
        explanation: [
          "The <code>src=\"app.js\"</code> attribute tells the browser to download and run the " +
            "external file <code>app.js</code>.",
          "<code>defer</code> is a small but important attribute: it tells the browser to download the " +
            "script <i>in parallel</i> with the HTML but <b>only execute it after the HTML is fully parsed</b>. " +
            "This means every element on the page is available when the script runs \u2014 no need to worry " +
            "about the script running before the button exists.",
          "Notice how clean the HTML stays: no JavaScript logic mixed in. That separation is exactly " +
            "why external scripts are the standard in professional projects."
        ]
      },
      {
        heading: "Multiple scripts and loading order",
        file: "index.html",
        language: "HTML",
        code: "<script src=\"utils.js\" defer></script>\n<script src=\"app.js\" defer></script>",
        explanation: [
          "When you have multiple <code>&lt;script&gt;</code> tags with <code>defer</code>, the browser " +
            "downloads them in parallel but <b>executes them in the order they appear in the HTML</b>.",
          "This matters when <code>app.js</code> depends on something defined in <code>utils.js</code>. " +
            "By listing <code>utils.js</code> first, you guarantee it has run before <code>app.js</code> tries " +
            "to use it.",
          "Without <code>defer</code>, scripts run immediately as they are encountered \u2014 so order still " +
            "matters, but you lose the benefit of parallel downloading."
        ]
      }
    ],

    sectionsAfterCode: [
      {
        heading: "The <code>defer</code> vs <code>async</code> cheat sheet",
        paragraphs: [
          "Both attributes are placed on <code>&lt;script&gt;</code> tags and affect when the script runs. " +
            "Here is the difference at a glance:"
        ],
        list: [
          "<code>defer</code> \u2014 downloads in parallel, runs after HTML is parsed, preserves script order. " +
            "<b>Use this for almost everything.</b>",
          "<code>async</code> \u2014 downloads in parallel, runs as soon as the download finishes (HTML parsing " +
            "may be paused). Script order is <b>not</b> guaranteed. Useful for independent third-party scripts " +
            "(analytics, ads) that do not depend on anything else on the page.",
          "<b>No attribute</b> \u2014 download blocks HTML parsing. Avoid this in modern code."
        ]
      },
      {
        heading: "Common beginner mistakes",
        list: [
          "<b>Mixing inline and external scripts carelessly.</b> If you write JavaScript both inline and " +
            "in an external file, they run at different moments and can conflict. Pick one approach per page.",
          "<b>Forgetting </b><code>src</code><b>.</b> Writing <code>&lt;script&gt;&lt;/script&gt;</code> with no " +
            "content and no <code>src</code> does nothing \u2014 it is an empty block that runs no code.",
          "<b>Placing scripts in </b><code>&lt;head&gt;</code><b> without </b><code>defer</code><b> or </b><code>async</code><b>.</b> " +
            "The page will freeze while the script downloads and runs. Always add <code>defer</code> if " +
            "you want scripts in the <code>&lt;head&gt;</code>.",
          "<b>Using <code>.js</code> extension but serving an HTML file.</b> If your script tag points to a " +
            "file that is actually HTML, the browser will not execute it as JavaScript. Make sure the file " +
            "extension and content match."
        ]
      }
    ],

    visualExplanation: {
      heading: "How the browser loads your page with defer",
      items: [
        { lang: "HTML", result: "Browser parses HTML top \u2192 bottom", note: "Builds the DOM tree as it reads each tag" },
        { lang: "JS", result: "<script defer> starts downloading", note: "Download happens in parallel, does not block HTML" },
        { lang: "HTML", result: "HTML parsing finishes", note: "All elements (buttons, divs) are now in the DOM" },
        { lang: "JS", result: "Deferred script runs", note: "Can safely find and manipulate any element on the page" }
      ]
    },

    keyTakeaways: [
      "The <code>&lt;script&gt;</code> tag is the bridge that tells the browser to load and run JavaScript on your page.",
      "<b>External scripts</b> (<code>src</code>) keep HTML and JS in separate files \u2014 this is the standard approach for real projects.",
      "Place scripts at the bottom of <code>&lt;body&gt;</code> or in <code>&lt;head&gt;</code> with <code>defer</code> so elements load before your code runs.",
      "<code>defer</code> downloads in parallel and runs after HTML is parsed; <code>async</code> runs as soon as the download finishes.",
      "Multiple deferred scripts execute in order \u2014 put dependencies first."
    ],

    practice: {
      compiler: true,
      task: "Create an HTML page with an <code>&lt;h1&gt;</code> and a <code>&lt;button&gt;</code>. Add an external <code>app.js</code> that uses <code>defer</code> and turns the heading green when the button is clicked.",
      hints: [
        "Create two files: <code>index.html</code> and <code>app.js</code> in the same folder.",
        "In the HTML, add <code>&lt;script src=\"app.js\" defer&gt;&lt;/script&gt;</code> before <code>&lt;/body&gt;</code>.",
        "In <code>app.js</code>, use <code>document.querySelector(\"h1\")</code> and an <code>addEventListener</code> for the <code>\"click\"</code> event.",
        "Inside the event handler, set <code>.style.color = \"green\"</code> on the heading."
      ],
      note: "Open the HTML file in your browser (double-click or drag into the browser) and test the button."
    }
  },

  /* ------------------------------------------------------------------
     1.1.4 \u2014 Sequential Code Execution Basics
     ------------------------------------------------------------------ */
  "1.1.4": {
    id: "sequential-code-execution-basics",
    number: "1.1.4",
    title: "Sequential Code Execution Basics",
    description:
      "Understand how JavaScript reads and runs your code line by line, top to bottom, " +
      "and why the order of instructions matters.",

    sections: [
      {
        heading: "JavaScript runs one line at a time",
        paragraphs: [
          "When JavaScript executes your code, it reads from the <b>first line to the last</b>, " +
            "one instruction after another. This is called <b>sequential execution</b> \u2014 and it is " +
            "the simplest and most important concept for understanding how programs work.",
          "Think of it like a recipe: the oven preheats <i>before</i> you put the cake in, " +
            "and you frost it <i>after</i> it has cooled. The same thing happens in code: the order " +
            "of instructions determines the result."
        ]
      },
      {
        heading: "Statements vs expressions",
        list: [
          "<b>Statement</b> \u2014 an instruction that <i>does</i> something. Example: <code>let x = 5;</code> " +
            "(creates a variable and stores a value). Statements end with a semicolon.",
          "<b>Expression</b> \u2014 a piece of code that <i>produces a value</i>. Example: <code>2 + 3</code> " +
            "(produces 5) or <code>\"Hello\".length</code> (produces 5).",
          "JavaScript evaluates expressions wherever it sees them and uses the result. " +
            "A variable declaration is a statement; the value you assign to it is an expression."
        ]
      },
      {
        heading: "What happens when you use a variable before it exists?",
        paragraphs: [
          "If you try to read a variable before the line that creates it, JavaScript throws an error " +
            "\u2014 because the variable does not exist yet. The browser will print a red error in the console " +
            "like <b>\u201cCannot access 'x' before initialization\u201d</b>. This is the language\u2019s way " +
            "of telling you that your code is out of order."
        ]
      }
    ],

    codeExamples: [
      {
        heading: "Simple sequential flow",
        file: "Developer Console",
        language: "JavaScript",
        code: "let greeting = \"Hello\";\n\nlet name = \"Vishnu\";\n\nlet message = greeting + \", \" + name + \"!\";\n\nconsole.log(message);",
        output: "Hello, Vishnu!",
        explanation: [
          "Line 1: <code>greeting</code> is created and stores the string <code>\"Hello\"</code>.",
          "Line 3: <code>name</code> is created and stores <code>\"Vishnu\"</code>.",
          "Line 5: JavaScript reads <code>greeting</code> (\u201cHello\u201d) + a comma-space + <code>name</code> " +
            "(\u201cVishnu\u201d) + \u201c!\u201d and joins them into <code>\"Hello, Vishnu!\"</code>.",
          "Line 7: <code>console.log(message)</code> prints the final string. Each line had to finish " +
            "before the next could start \u2014 that is sequential execution in action."
        ]
      },
      {
        heading: "Order matters: the wrong order breaks things",
        file: "Developer Console",
        language: "JavaScript",
        code: "console.log(message);\n\nlet message = \"Hello\";",
        output: "\u274c ReferenceError: Cannot access 'message' before initialization",
        explanation: [
          "Line 1 tries to print <code>message</code> \u2014 but the line that creates it (line 3) has not " +
            "run yet. The variable does not exist at this point.",
          "JavaScript follows the top-to-bottom rule strictly. If you need a value, you must create it " +
            "<i>first</i>.",
          "This is the single most common beginner mistake: using a variable before the line that " +
            "declares it. The fix is simply to move the declaration above the usage."
        ]
      },
      {
        heading: "Step-by-step transformation",
        file: "Developer Console",
        language: "JavaScript",
        code: "let score = 10;\n\nconsole.log(score);  // 10\n\nscore = score + 5;\n\nconsole.log(score);  // 15\n\nscore = score * 2;\n\nconsole.log(score);  // 30",
        output: "10\n15\n30",
        explanation: [
          "Each <code>console.log</code> shows the value of <code>score</code> at that exact moment.",
          "After <code>score = score + 5</code>, the old 10 is replaced with 15. The old value is gone \u2014 " +
            "variables hold <i>one value at a time</i>.",
          "After <code>score = score * 2</code>, 15 becomes 30. This is how programs transform data: " +
            "read the current value, compute something new, store it back."
        ]
      },
      {
        heading: "Expressions can be embedded inside other statements",
        file: "Developer Console",
        language: "JavaScript",
        code: "let a = 2 + 3;       // expression 2+3 produces 5, stored in a\nlet b = a * 10;       // expression a*10 produces 50, stored in b\n\nconsole.log(a + b);   // expression a+b produces 55, passed to console.log",
        output: "55",
        explanation: [
          "<code>2 + 3</code> is an expression that produces 5. The <code>=</code> operator stores that " +
            "result in <code>a</code>.",
          "On the next line, <code>a</code> already holds 5, so <code>a * 10</code> produces 50.",
          "When you write <code>console.log(a + b)</code>, JavaScript evaluates <code>a + b</code> " +
            "first (5 + 50 = 55) and then passes 55 into <code>console.log</code>. Expressions are evaluated " +
            "before they are used."
        ]
      }
    ],

    sectionsAfterCode: [
      {
        heading: "What happens between two lines?",
        paragraphs: [
          "While it looks like lines in your editor run at the same time, the browser is actually doing " +
            "this for each line:"
        ],
        list: [
          "<b>Read</b> the line from top to bottom",
          "<b>Evaluate</b> every expression it finds (math, function calls, variable lookups)",
          "<b>Execute</b> the resulting instruction (assign a value, print something, etc.)",
          "<b>Move on</b> to the next line"
        ]
      },
      {
        heading: "Common beginner mistakes",
        list: [
          "<b>Using a variable before it is declared.</b> Always declare with <code>let</code> or <code>const</code> " +
            "on a line above where you first read it.",
          "<b>Expecting changes to appear everywhere at once.</b> If you change a variable on line 10, " +
            "lines 11 and beyond see the new value \u2014 but lines 1\u20139 still saw the old one.",
          "<b>Confusing <code>=</code> with <code>==</code>.</b> A single <code>=</code> is assignment (stores a " +
            "value); <code>==</code> or <code>===</code> is comparison (checks whether two values are equal).",
          "<b>Forgetting that <code>console.log</code> pauses nothing.</b> The rest of the code keeps running " +
            "after the log. It is only a peek, not a stop button."
        ]
      }
    ],

    keyTakeaways: [
      "JavaScript executes your code <b>one line at a time, top to bottom</b> \u2014 this is sequential execution.",
      "A <b>statement</b> does something (assigns, declares, calls); an <b>expression</b> produces a value.",
      "Always declare a variable <i>before</i> you use it \u2014 reading it too early causes a ReferenceError.",
      "Variables hold one value at a time. When you update them, the old value is replaced.",
      "Expressions inside function calls are evaluated <b>before</b> the function runs."
    ],

    practice: {
      compiler: true,
      task: "Write code in the console that creates a variable <code>price</code> with the value <code>20</code>, then a variable <code>quantity</code> with the value <code>3</code>, then prints their product using <code>console.log(price * quantity)</code>.",
      hints: [
        "Start with <code>let price = 20;</code>.",
        "Then <code>let quantity = 3;</code>.",
        "Then <code>console.log(price * quantity);</code> and check the result."
      ],
      note: "Try swapping the order of the lines \u2014 what happens if console.log comes first?"
    }
  },

  /* ------------------------------------------------------------------
     1.2.1 \u2014 VS Code Installation & Workspace Setup
     ------------------------------------------------------------------ */
  "1.2.1": {
    id: "vs-code-installation-and-workspace-setup",
    number: "1.2.1",
    title: "VS Code Installation & Workspace Setup",
    description:
      "Install Visual Studio Code, set up a clean workspace with the right extensions, " +
      "and learn the layout that will become your daily development environment.",

    sections: [
      {
        heading: "Why Visual Studio Code?",
        paragraphs: [
          "Visual Studio Code (VS Code) is a <b>free code editor</b> made by Microsoft. It is the most " +
            "popular editor among web developers because it is fast, customisable and packed with built-in " +
            "tools that make writing JavaScript significantly easier.",
          "Other editors exist (Sublime Text, WebStorm, JetBrains), but VS Code is the best starting " +
            "point: it runs on Windows, Mac and Linux, supports every language you will learn here, and " +
            "has a massive library of free extensions."
        ]
      },
      {
        heading: "Installation steps",
        list: [
          "<b>Go to</b> <code>https://code.visualstudio.com</code> and click the download button for your " +
            "operating system.",
          "<b>Run the installer</b> and accept the defaults \u2014 they work perfectly for most setups.",
          "<b>Windows:</b> make sure <b>\u201cAdd to PATH\u201d</b> is checked during installation so you can " +
            "open VS Code from the terminal.",
          "<b>Mac:</b> drag the app into your Applications folder after download.",
          "<b>Linux:</b> extract the archive and run <code>./code</code> from the extracted folder, or install " +
            "via your package manager."
        ]
      },
      {
        heading: "Your first workspace",
        paragraphs: [
          "A <b>workspace</b> is a folder that VS Code opens as a project. Setting one up is simple:"
        ],
        list: [
          "<b>Create a folder</b> somewhere easy to find, like <code>Documents/learnjs</code>",
          "<b>Open VS Code</b> and go to <b>File \u2192 Open Folder</b> (or press <code>Ctrl/Cmd + K Ctrl/Cmd + O</code>)",
          "<b>Select your folder</b> \u2014 VS Code now shows it in the Explorer panel on the left",
          "Create a new file: right-click in the Explorer \u2192 <b>New File</b> \u2192 name it <code>index.html</code>",
          "You now have your first project. The sidebar, editor and terminal are all there."
        ]
      }
    ],

    codeExamples: [
      {
        heading: "Quick-launch from the terminal",
        file: "Terminal",
        language: "Shell",
        code: "cd Documents/learnjs\ncode .",
        output: "> VS Code opens with the learnjs folder loaded.",
        explanation: [
          "<code>cd Documents/learnjs</code> moves into your project folder.",
          "<code>code .</code> tells VS Code to open the current folder (<code>.</code> means \u201chere\u201d). " +
            "This only works if you checked \u201cAdd to PATH\u201d during installation.",
          "This shortcut becomes second nature \u2014 you will use it dozens of times a day."
        ]
      }
    ],

    sectionsAfterCode: [
      {
        heading: "Essential extensions to install",
        paragraphs: [
          "VS Code extensions add extra features. These are the ones every JavaScript beginner should install right away:"
        ],
        list: [
          "<b>Live Server</b> (by Ritwick Dey) \u2014 adds a \u201cGo Live\u201d button that opens your HTML file with a " +
            "local server. Changes refresh the page automatically.",
          "<b>ESLint</b> (by Microsoft) \u2014 underlines style and error issues in your code as you type, " +
            "helping you learn best practices.",
          "<b>Prettier</b> (by Prettier) \u2014 automatically formats your code when you save, so it always " +
            "looks clean.",
          "To install: click the <b>Extensions</b> icon (four squares) in the left sidebar, search the " +
            "name, and click <b>Install</b>."
        ]
      },
      {
        heading: "The VS Code layout you will use every day",
        list: [
          "<b>Explorer (left sidebar)</b> \u2014 shows your folder and files. Create, rename and delete files here.",
          "<b>Editor (centre)</b> \u2014 where you write code. You can have multiple tabs open.",
          "<b>Terminal (bottom)</b> \u2014 open it with <code>Ctrl + \`</code> (backtick). This is where you " +
            "run commands like <code>node</code> or <code>git</code>.",
          "<b>Activity Bar (far left)</b> \u2014 icons for Explorer, Search, Extensions, Source Control, etc.",
          "<b>Status Bar (bottom)</b> \u2014 shows the current language, line number, and Git branch."
        ]
      },
      {
        heading: "Useful shortcuts to learn early",
        list: [
          "<code>Ctrl/Cmd + P</code> \u2014 Quick Open: type a file name to jump to it instantly",
          "<code>Ctrl/Cmd + \`</code> \u2014 toggle the integrated terminal",
          "<code>Ctrl/Cmd + Shift + P</code> \u2014 Command Palette: search for any VS Code action",
          "<code>Ctrl/Cmd + S</code> \u2014 save the current file",
          "<code>Ctrl/Cmd + /</code> \u2014 toggle a comment on the selected line(s)",
          "<code>Alt + Up/Down</code> \u2014 move the current line up or down"
        ]
      },
      {
        heading: "Common beginner mistakes",
        list: [
          "<b>Editing the wrong folder.</b> Always open the project folder first, not a single file. " +
            "VS Code needs to see your project structure to find extensions and config files.",
          "<b>Not using the terminal.</b> Many beginners use the system terminal instead of VS Code's built-in " +
            "one. The built-in terminal keeps everything in one place and is already in your project folder.",
          "<b>Ignoring extensions.</b> Extensions like Live Server save you from manually refreshing the page. " +
            "Setting them up once saves hours over the course of learning."
        ]
      }
    ],

    keyTakeaways: [
      "VS Code is free, runs on every OS, and is the standard editor for web development.",
      "A workspace is just a folder you open in VS Code \u2014 create one, open it, start coding.",
      "Install <b>Live Server</b>, <b>ESLint</b> and <b>Prettier</b> immediately \u2014 they make your life much easier.",
      "Learn the key shortcuts: <code>Ctrl/Cmd + P</code> for files, <code>Ctrl/Cmd + \`</code> for the terminal, <code>Ctrl/Cmd + S</code> to save.",
      "Always use <b>File \u2192 Open Folder</b> rather than opening individual files \u2014 VS Code needs the context."
    ],

    practice: {
      task: "Install VS Code, create a <code>learnjs</code> folder, open it, create <code>index.html</code> with an <code>&lt;h1&gt;</code> inside, and install Live Server so you can right-click the HTML file and open it in the browser.",
      hints: [
        "After installing VS Code, open it and use <b>File \u2192 Open Folder</b>.",
        "Right-click in the Explorer sidebar \u2192 <b>New File</b> \u2192 name it <code>index.html</code>.",
        "Type <code>&lt;!DOCTYPE html&gt;</code> and a <code>&lt;h1&gt;Hello&lt;/h1&gt;</code> inside the body.",
        "Go to the Extensions icon (left sidebar), search \u201cLive Server\u201d and install it.",
        "Right-click <code>index.html</code> \u2192 <b>Open with Live Server</b>."
      ],
      note: "If Live Server does not appear after installing, try closing and reopening VS Code."
    }
  },

  /* ------------------------------------------------------------------
     1.2.2 \u2014 Using Integrated Terminals (Bash / Zsh / WSL)
     ------------------------------------------------------------------ */
  "1.2.2": {
    id: "using-integrated-terminals",
    number: "1.2.2",
    title: "Using Integrated Terminals (Bash / Zsh / WSL)",
    description:
      "Open and use the terminal right inside VS Code \u2014 run commands, navigate folders, " +
      "and understand the shell your system uses.",

    sections: [
      {
        heading: "What is a terminal?",
        paragraphs: [
          "A terminal (also called a <b>shell</b> or <b>command line</b>) is a text-only way to talk to your " +
            "computer. Instead of clicking icons, you type commands. It sounds old-fashioned, but most " +
            "professional development tools (package managers, compilers, version control) are designed " +
            "to be controlled from the command line \u2014 and it is much faster once you get comfortable.",
          "VS Code has a built-in terminal so you never have to leave the editor. It opens in your " +
            "current project folder, so any command you run starts in the right place."
        ]
      },
      {
        heading: "Opening the terminal in VS Code",
        list: [
          "<b>Shortcut:</b> press <code>Ctrl + \`</code> (the backtick key, next to 1 on most keyboards)",
          "<b>Menu:</b> go to <b>Terminal \u2192 New Terminal</b>",
          "<b>A new panel</b> appears at the bottom of VS Code with a prompt showing your folder name",
          "You can open <b>multiple terminals</b> by clicking the <b>+</b> icon in the terminal panel",
          "<b>Close</b> it with the trash-can icon or by pressing <code>Ctrl/Cmd + \`</code> again"
        ]
      },
      {
        heading: "Shells: Bash, Zsh and WSL",
        paragraphs: [
          "A <b>shell</b> is the program that runs inside the terminal and interprets your commands. " +
            "Different operating systems use different shells by default:"
        ],
        list: [
          "<b>Bash</b> (Bourne Again SHell) \u2014 the default on most Linux distributions and on Windows via Git Bash.",
          "<b>Zsh</b> (Z Shell) \u2014 the default on macOS since Catalina. Very similar to Bash for everyday use.",
          "<b>PowerShell</b> \u2014 the default Windows shell. Most modern JS tools work in PowerShell, " +
            "though a few use Bash syntax.",
          "<b>WSL</b> (Windows Subsystem for Linux) \u2014 runs a full Linux environment inside Windows. " +
            "Install it if you want your commands and tools to match Linux/macOS tutorials exactly.",
          "For this course, any shell will work. The commands shown here are POSIX-compatible (Bash, " +
            "Zsh, WSL) and work on all three."
        ]
      }
    ],

    codeExamples: [
      {
        heading: "Essential terminal commands",
        file: "Terminal",
        language: "Shell",
        code: "# See which folder you are in\npwd\n\n# List files and folders\nls\n\n# Move into a folder\ncd my-folder\n\n# Go back one level\ncd ..\n\n# Create a new folder\nmkdir projects\n\n# Create a new file\ntouch hello.txt\n\n# Remove a file\nrm hello.txt",
        output: "> pwd\n/home/you/Documents/learnjs\n> ls\nindex.html  app.js\n> mkdir projects\n> ls\nindex.html  app.js  projects",
        explanation: [
          "<code>pwd</code> prints the full path of your current folder \u2014 \u201cwhere am I?\u201d",
          "<code>ls</code> lists everything inside the current folder.",
          "<code>cd folder-name</code> moves into a subfolder. <code>cd ..</code> goes up one level.",
          "<code>mkdir name</code> creates a new folder. <code>touch name</code> creates an empty file.",
          "<code>rm name</code> deletes a file. Be careful \u2014 deleted files do not go to a recycle bin from the terminal."
        ]
      },
      {
        heading: "Clearing the terminal",
        file: "Terminal",
        language: "Shell",
        code: "# After a lot of output, clean the screen\nclear",
        output: "> (terminal is now empty with the cursor at the top)",
        explanation: [
          "<code>clear</code> wipes the terminal screen. It does not delete anything \u2014 it just moves " +
            "the prompt to the top so you have a clean view.",
          "Shortcut: <code>Ctrl + L</code> does the same thing in most shells."
        ]
      }
    ],

    sectionsAfterCode: [
      {
        heading: "Why the terminal matters for JavaScript",
        list: [
          "<b>Running scripts</b> \u2014 you will run <code>node script.js</code> to execute JavaScript outside the browser",
          "<b>Installing packages</b> \u2014 <code>npm install</code> downloads libraries your project needs",
          "<b>Version control</b> \u2014 <code>git</code> commands let you save and share your code",
          "<b>Build tools</b> \u2014 bundlers, linters and test runners all run from the command line",
          "Learning the terminal now makes every future tool much easier to pick up"
        ]
      },
      {
        heading: "Tips for getting comfortable",
        list: [
          "<b>Use Tab completion</b> \u2014 start typing a file or folder name and press <code>Tab</code> to autocomplete it",
          "<b>Use the up arrow</b> \u2014 press <code>\u2191</code> to cycle through your previous commands",
          "<b>Don't memorise everything</b> \u2014 keep a cheatsheet of the 5\u20136 commands you use most",
          "<b>Read the error</b> \u2014 if a command fails, the message usually tells you exactly what went wrong",
          "<b>Mix terminal and editor</b> \u2014 do not try to live entirely in the terminal. Use the editor for " +
            "code, the terminal for commands."
        ]
      },
      {
        heading: "Common beginner mistakes",
        list: [
          "<b>Being in the wrong folder.</b> Always run <code>pwd</code> to check your location before running " +
            "a command. The wrong folder is the most common cause of \u201cfile not found\u201d errors.",
          "<b>Panicking at error messages.</b> Errors in the terminal are normal \u2014 they tell you what went wrong. " +
            "Read them, do not close the window.",
          "<b>Running destructive commands without thinking.</b> <code>rm -rf</code> deletes a folder and everything " +
            "inside it permanently. Never run it without double-checking the path.",
          "<b>Using the system terminal instead of the VS Code terminal.</b> The system terminal starts in your home " +
            "directory, not your project folder. The VS Code terminal saves you from constantly navigating."
        ]
      }
    ],

    keyTakeaways: [
      "The terminal is a text-based way to interact with your computer \u2014 open it in VS Code with <code>Ctrl + \`</code>.",
      "<code>pwd</code> shows where you are, <code>ls</code> lists files, <code>cd</code> moves between folders, and <code>mkdir</code> creates folders.",
      "Different shells (Bash, Zsh, WSL) interpret the same basic commands \u2014 use whichever your system provides.",
      "Use <b>Tab</b> to autocomplete and the <b>up arrow</b> to recall previous commands \u2014 they save a lot of typing.",
      "You will use the terminal every day for running scripts, installing packages and using git."
    ],

    practice: {
      task: "Open the VS Code terminal and run these commands in order: (1) <code>pwd</code>, (2) <code>ls</code>, (3) <code>mkdir demo</code>, (4) <code>cd demo</code>, (5) <code>touch test.txt</code>, (6) <code>ls</code>, (7) <code>cd ..</code>, (8) <code>ls</code>.",
      hints: [
        "If you get an error saying the folder already exists, it just means you created it before \u2014 that is fine.",
        "After <code>cd demo</code>, your prompt should change to show <code>demo</code> as the current folder.",
        "The last <code>ls</code> should show the <code>demo</code> folder alongside your other files."
      ],
      note: "Try pressing the up arrow after running a command \u2014 it brings back the last one so you can re-run it quickly."
    }
  },

  /* ------------------------------------------------------------------
     1.2.3 \u2014 Running Scripts Locally via Node.js (node script.js)
     ------------------------------------------------------------------ */
  "1.2.3": {
    id: "running-scripts-locally-via-node",
    number: "1.2.3",
    title: "Running Scripts Locally via Node.js (node script.js)",
    description:
      "Install Node.js and run your first JavaScript file from the terminal \u2014 no browser needed, " +
      "instant feedback, the way real developers work.",

    sections: [
      {
        heading: "What is Node.js?",
        paragraphs: [
          "Node.js is a runtime that lets you run JavaScript <b>outside the browser</b>. It takes your " +
            "<code>.js</code> files and executes them directly on your computer, just like Python runs " +
            "<code>.py</code> files or Java runs <code>.class</code> files.",
          "This is important because it means you can use JavaScript to build servers, run scripts, " +
            "test code quickly, and work with files \u2014 not just web pages. For now, we will use it " +
            "to run simple scripts and get instant results."
        ]
      },
      {
        heading: "Installing Node.js",
        list: [
          "<b>Go to</b> <code>https://nodejs.org</code>",
          "<b>Download the LTS version</b> (Long-Term Support) \u2014 it is the stable, recommended release.",
          "<b>Run the installer</b> and accept all the defaults.",
          "<b>Verify it worked:</b> open a terminal and run <code>node --version</code>. You should see a " +
            "version number like <code>v20.11.0</code>.",
          "You will also get <code>npm</code> (Node Package Manager) automatically \u2014 you will use it later " +
            "to install libraries."
        ]
      },
      {
        heading: "Your first local script",
        paragraphs: [
          "A local JavaScript file is just a text file ending in <code>.js</code>. You create it, write code, " +
            "and run it from the terminal. Here is the full cycle:"
        ]
      }
    ],

    codeExamples: [
      {
        heading: "Create and run your first script",
        file: "app.js",
        language: "JavaScript",
        code: "// app.js\nconsole.log(\"Hello from Node.js!\");\n\nlet age = 25;\nconsole.log(\"In 10 years you will be\", age + 10);",
        output: "$ node app.js\nHello from Node.js!\nIn 10 years you will be 35",
        explanation: [
          "Open your project folder in VS Code and create a file called <code>app.js</code>.",
          "Type the two lines of code above and save the file (<code>Ctrl/Cmd + S</code>).",
          "Open the terminal (<code>Ctrl + \`</code>) and run <code>node app.js</code>.",
          "Node.js reads the file and executes it line by line \u2014 the same top-to-bottom " +
            "execution you learned in 1.1.4."
        ]
      },
      {
        heading: "Using built-in Node modules: the file system",
        file: "file-info.js",
        language: "JavaScript",
        code: "const fs = require(\"fs\");\n\n// Write a file\nfs.writeFileSync(\"hello.txt\", \"Hello from Node.js!\");\n\n// Read it back\nconst content = fs.readFileSync(\"hello.txt\", \"utf-8\");\nconsole.log(\"File says:\", content);",
        output: "$ node file-info.js\nFile says: Hello from Node.js!",
        explanation: [
          "<code>require(\"fs\")</code> loads the built-in <b>file system</b> module \u2014 a collection of " +
            "tools Node gives you for reading and writing files.",
          "<code>fs.writeFileSync(path, data)</code> creates a file called <code>hello.txt</code> and writes " +
            "text into it. It runs <b>synchronously</b> (waits until finished before moving on).",
          "<code>fs.readFileSync(path, encoding)</code> reads the file back and returns its contents as a string.",
          "This is something JavaScript in the browser <b>cannot do</b> \u2014 browsers block file access for security. " +
            "Node.js runs on your machine, so it has full access."
        ]
      },
      {
        heading: "Using the terminal to run scripts",
        file: "Terminal",
        language: "Shell",
        code: "$ node app.js\n$ node file-info.js\n\n# Run any JS file\n$ node path/to/any-file.js",
        output: "(output depends on what the script prints)",
        explanation: [
          "The command is always <code>node</code> followed by the file path.",
          "Node runs the entire file from start to finish, then exits. There is no server or " +
            "long-running process unless you explicitly create one.",
          "If the script has an error, Node prints a stack trace showing the file, line number and " +
            "exactly what went wrong."
        ]
      }
    ],

    sectionsAfterCode: [
      {
        heading: "Node.js vs browser JavaScript",
        list: [
          "<b>Browser:</b> runs in a sandbox \u2014 cannot access files, the network, or your operating system directly",
          "<b>Node.js:</b> runs on your machine \u2014 full access to files, the network, the terminal, and more",
          "<b>Browser:</b> needs HTML to run (a web page)",
          "<b>Node.js:</b> needs only a <code>.js</code> file and a terminal",
          "<b>Both</b> use the same core JavaScript language \u2014 <code>let</code>, <code>const</code>, functions, arrays and objects all work the same way"
        ]
      },
      {
        heading: "When to use Node.js vs the browser",
        list: [
          "<b>Use the browser</b> for anything visual: web pages, DOM manipulation, UI interactions",
          "<b>Use Node.js</b> for backend scripts, running tests, file processing, quick experiments, " +
            "and installing packages",
          "<b>Many projects use both:</b> Node.js runs the build/test tools while the browser runs the " +
            "actual application"
        ]
      },
      {
        heading: "Common beginner mistakes",
        list: [
          "<b>Running <code>node</code> without a file name.</b> If you type just <code>node</code> and press " +
            "Enter, you enter the interactive REPL (a live scratchpad). Press <code>Ctrl + C</code> twice to exit.",
          "<b>Forgetting the <code>.js</code> extension.</b> <code>node app</code> may not find the file; " +
            "write <code>node app.js</code>.",
          "<b>Trying <code>document.querySelector</code> in Node.</b> There is no DOM in Node.js \u2014 " +
            "browser-specific code does not work here.",
          "<b>Running the wrong file.</b> Always run <code>ls</code> first to confirm the file is in your " +
            "current folder, or use the full path."
        ]
      }
    ],

    keyTakeaways: [
      "Node.js lets you run JavaScript outside the browser \u2014 install it from <code>nodejs.org</code> and verify with <code>node --version</code>.",
      "Create a <code>.js</code> file, write code, and run it with <code>node filename.js</code> in the terminal.",
      "Node.js has built-in modules like <code>fs</code> for file access \u2014 something browsers cannot do for security reasons.",
      "Core JavaScript syntax (<code>let</code>, <code>const</code>, functions, loops) works exactly the same in Node and the browser.",
      "If you end up in the Node REPL accidentally, press <code>Ctrl + C</code> twice to exit."
    ],

    practice: {
      compiler: true,
      task: "(1) Install Node.js and verify with <code>node --version</code>. (2) Create <code>greet.js</code> that prints your name. (3) Create a second file <code>math.js</code> that calculates <code>(10 + 5) * 2</code> and prints the result. (4) Run both from the terminal.",
      hints: [
        "For <code>greet.js</code>: <code>console.log(\"Hello, my name is YourName!\")</code>",
        "For <code>math.js</code>: <code>console.log((10 + 5) * 2)</code>",
        "Run each with <code>node greet.js</code> and <code>node math.js</code> from the same folder."
      ],
      note: "If <code>node</code> is not recognised, restart your terminal or restart VS Code so the PATH updates."
    }
  },

  /* ------------------------------------------------------------------
     1.2.4 \u2014 Basic Git Version Control Initialization (git init, git commit)
     ------------------------------------------------------------------ */
  "1.2.4": {
    id: "basic-git-version-control",
    number: "1.2.4",
    title: "Basic Git Version Control Initialization (git init, git commit)",
    description:
      "Start tracking your code with Git: initialise a repository, stage changes, commit snapshots, " +
      "and understand why version control matters from day one.",

    sections: [
      {
        heading: "Why Git matters",
        paragraphs: [
          "Git is a tool that <b>tracks every change</b> you make to your code. It lets you look at " +
            "older versions, undo mistakes, experiment on new features without risk, and collaborate " +
            "with other developers.",
          "Think of it like \u201csave\u201d in a document editor \u2014 except it saves <i>every version ever</i>, " +
            "lets you label important ones, and supports branching (copying your code to try something new " +
            "without affecting the original)."
        ]
      },
      {
        heading: "Installing Git",
        list: [
          "<b>Windows:</b> download from <code>https://git-scm.com/download/win</code>. Accept defaults.",
          "<b>Mac:</b> download from <code>https://git-scm.com/download/mac</code>, or run " +
            "<code>xcode-select --install</code> in the terminal.",
          "<b>Linux:</b> use your package manager, e.g. <code>sudo apt install git</code> (Ubuntu/Debian) " +
            "or <code>sudo dnf install git</code> (Fedora).",
          "<b>Verify:</b> open a terminal and run <code>git --version</code>. You should see a version number.",
          "<b>First-time setup (once):</b> run <code>git config --global user.name \"Your Name\"</code> and " +
            "<code>git config --global user.email \"you@example.com\"</code> so your commits have a name attached."
        ]
      }
    ],

    codeExamples: [
      {
        heading: "Initialising a Git repository",
        file: "Terminal",
        language: "Shell",
        code: "# Navigate to your project folder\ncd Documents/learnjs\n\n# Start tracking it with Git\ngit init\n\n# Check the status\ngit status",
        output: "> git init\nInitialized empty Git repository in /home/you/Documents/learnjs/.git/\n\n> git status\nOn branch main\nNo commits yet\nUntracked files:\n  (use \"git add <file>...\" to include what will be committed)\n        index.html\n        app.js",
        explanation: [
          "<code>git init</code> creates a hidden <code>.git</code> folder in your project. This is " +
            "where Git stores all the version history. One command and your folder is now a Git repository.",
          "<code>git status</code> shows you what is happening: which files Git knows about, which " +
            "are new, and which have changed. Always run this when you are unsure.",
          "The output shows your new files as \u201cUntracked\u201d \u2014 Git sees them but is not yet saving them."
        ]
      },
      {
        heading: "Staging and committing",
        file: "Terminal",
        language: "Shell",
        code: "# Stage specific files\ngit add index.html app.js\n\n# Or stage everything\ngit add .\n\n# Commit with a message\ngit commit -m \"Initial commit: hello world page\"\n\n# Check history\ngit log --oneline",
        output: "> git commit -m \"Initial commit: hello world page\"\n[main (root-commit) a1b2c3d] Initial commit: hello world page\n 2 files changed, 15 insertions(+)\n\n> git log --oneline\na1b2c3d (HEAD -> main) Initial commit: hello world page",
        explanation: [
          "<code>git add .</code> stages all files in the current folder. Staging means \u201cI want to " +
            "include this in my next snapshot.\u201d",
          "<code>git commit -m \"message\"</code> takes the staged files and saves them as a permanent " +
            "snapshot called a <b>commit</b>. The message describes what you changed.",
          "<code>git log --oneline</code> shows every commit, with the most recent at the top. Each line " +
            "shows a shortened hash (a unique ID), the branch, and the message."
        ]
      },
      {
        heading: "Making and tracking changes",
        file: "Terminal",
        language: "Shell",
        code: "# After editing app.js, check what changed\ngit diff\n\n# Stage and commit the change\ngit add app.js\ngit commit -m \"Add console.log for debugging\"\n\n# See the full history\ngit log --oneline",
        output: "> git log --oneline\nb4e5f6g (HEAD -> main) Add console.log for debugging\na1b2c3d Initial commit: hello world page",
        explanation: [
          "<code>git diff</code> shows you exactly which lines changed since the last commit. Green " +
            "lines are additions, red lines are removals.",
          "Each commit gets a unique hash and is stored permanently. You can always go back to any " +
            "previous commit.",
          "Write clear commit messages that describe <i>what</i> you changed and <i>why</i>. Keep them short " +
            "but descriptive."
        ]
      },
      {
        heading: "Using Git inside VS Code",
        file: "VS Code",
        language: "Shell",
        code: "# The Source Control panel (branch icon in left sidebar)\n# shows all changes\n#\n# 1. Click a changed file to see a side-by-side diff\n# 2. Click the + icon to stage it\n# 3. Type a message and press Ctrl+Enter to commit\n#\n# The terminal still works too: same git commands, just faster",
        explanation: [
          "VS Code has a built-in <b>Source Control</b> panel (click the branch icon on the left). " +
            "It shows every changed file with a colour-coded status: green for new, blue for modified.",
          "You can stage files by clicking the <b>+</b> icon next to them, type your commit message " +
            "in the box at the top, and press <code>Ctrl + Enter</code> to commit.",
          "The GUI and the terminal do the exact same thing \u2014 use whichever you prefer."
        ]
      }
    ],

    sectionsAfterCode: [
      {
        heading: "The three areas of Git",
        paragraphs: [
          "When you use Git, your files live in one of three areas. Understanding these makes every " +
            "command make sense:"
        ],
        list: [
          "<b>Working Directory</b> \u2014 your actual files, the ones you see and edit in VS Code.",
          "<b>Staging Area (Index)</b> \u2014 a waiting room. You add files here when you are ready to commit " +
            "them. This lets you choose exactly what goes into a commit.",
          "<b>Repository (.git)</b> \u2014 the permanent record. Every commit lives here. Once committed, " +
            "nothing is truly lost."
        ]
      },
      {
        heading: "Common beginner mistakes",
        list: [
          "<b>Forgetting to run <code>git init</code>.</b> If Git says \u201cnot a git repository,\u201d you " +
            "are in a folder that has not been initialised yet. Run <code>git init</code> first.",
          "<b>Skipping the commit message.</b> <code>git commit</code> without <code>-m</code> opens a text " +
            "editor you may not know how to use. Always use <code>-m \"your message\"</code>.",
          "<b>Committing too much at once.</b> A commit should represent one logical change. If you " +
            "rewrote three files, commit them separately with three descriptive messages.",
          "<b>Not checking <code>git status</code> regularly.</b> Run it before and after every operation " +
            "to make sure you know what Git is tracking.",
          "<b>Panicking about mistakes.</b> Almost everything in Git is recoverable. If something goes " +
            "wrong, search for the specific undo command online \u2014 the community is enormous and helpful."
        ]
      }
    ],

    keyTakeaways: [
      "Git tracks every change to your code so you can undo mistakes, see history, and collaborate safely.",
      "<code>git init</code> turns any folder into a Git repository; <code>git add</code> stages files; <code>git commit</code> saves a snapshot.",
      "The three areas are: <b>Working Directory</b> \u2192 <b>Staging Area</b> \u2192 <b>Repository</b>.",
      "<code>git status</code> is your best friend \u2014 run it often to see what is staged, what has changed, and what is untracked.",
      "VS Code's Source Control panel does the same thing as the terminal commands \u2014 use whichever you prefer."
    ],

    practice: {
      task: "(1) Install Git and verify with <code>git --version</code>. (2) In your <code>learnjs</code> folder, run <code>git init</code>. (3) Create a file, stage it with <code>git add .</code>, and commit it with a message. (4) Check the log with <code>git log --oneline</code>.",
      hints: [
        "After installing, configure your name and email with <code>git config --global</code>.",
        "You should see <code>.git</code> (hidden) appear in your folder after <code>git init</code>.",
        "Use <code>git status</code> before committing to confirm the right files are staged.",
        "Your commit message should describe what you added, not just \u201cfirst commit\u201d."
      ],
      note: "GitHub.com is a website where you can push your repository online. You will learn that later \u2014 for now, local Git is enough."
    }
  }
,
  /* ------------------------------------------------------------------
     2.2.1 — Concise Arrow Function Syntax (() => {})
     ------------------------------------------------------------------ */
  "2.2.1": {
    id: "concise-arrow-function-syntax",
    number: "2.2.1",
    title: "Concise Arrow Function Syntax (() => {})",
    description:
      "Write shorter functions using the modern arrow syntax introduced in ES6.",
    sections: [
      {
        heading: "Arrow functions in one glance",
        paragraphs: [
          "Arrow functions are a shorter way to write functions. They were introduced in ES6 (2015) and are now the most common style in modern JavaScript."
        ],
        list: [
          "Regular: <code>function add(a, b) { return a + b; }</code>",
          "Arrow: <code>const add = (a, b) => a + b;</code>",
          "Both do the same thing — the arrow version is just shorter."
        ]
      }
    ],
    codeExamples: [
      {
        heading: "Arrow function syntax",
        file: "Developer Console",
        language: "JavaScript",
        code: "const sayHi = () => \"Hi!\";\nconsole.log(sayHi());  // Hi!\n\nconst double = x => x * 2;\nconsole.log(double(5));  // 10\n\nconst add = (a, b) => a + b;\nconsole.log(add(3, 7));  // 10",
        output: "Hi!\n10\n10",
        explanation: [
          "<code>() =></code> means no parameters. One parameter can skip parentheses: <code>x =></code>.",
          "If the body is a single expression, you can omit curly braces and <code>return</code> — the result is returned automatically."
        ]
      }
    ],
    sectionsAfterCode: [
      {
        heading: "When to use braces",
        paragraphs: [
          "Use curly braces when the function body has multiple statements:"
        ],
        list: [
          "<code>const greet = (name) => { console.log(\"Hi\"); return name; };</code>",
          "With braces you must write <code>return</code> explicitly"
        ]
      },
      {
        heading: "Common beginner mistakes",
        list: [
          "<b>Forgetting <code>return</code> with braces.</b> <code>() => { x + 1 }</code> returns <code>undefined</code> — you need <code>return x + 1</code>.",
          "<b>Returning an object literal.</b> <code>() => { name: \"hi\" }</code> is a syntax error. Wrap in parentheses: <code>() => ({ name: \"hi\" })</code>.",
          "<b>Using arrow functions as object methods.</b> Arrows don't have their own <code>this</code> — use regular functions or shorthand methods for objects."
        ]
      }
    ],
    keyTakeaways: [
      "Arrow functions are a shorter syntax: <code>const fn = (a, b) => a + b;</code>",
      "Single expressions return automatically — no <code>return</code> needed.",
      "Use parentheses for zero or multiple parameters; skip them for one parameter."
    ],
    practice: {
      compiler: true,
      task: "Convert these to arrow functions: (1) <code>function square(n) { return n * n; }</code>, (2) <code>function greet(name) { return \"Hello, \" + name; }</code>, (3) <code>function isValid(str) { return str.length > 0; }</code>.",
      hints: [
        "<code>const square = n => n * n;</code>",
        "<code>const greet = name => \"Hello, \" + name;</code>",
        "<code>const isValid = str => str.length > 0;</code>"
      ],
      note: "Verify each works by calling it in the console."
    }
  },

  /* ------------------------------------------------------------------
     2.2.2 — Implicit Returns for Single-Line Expressions
     ------------------------------------------------------------------ */
  "2.2.2": {
    id: "implicit-returns",
    number: "2.2.2",
    title: "Implicit Returns for Single-Line Expressions",
    description:
      "Understand when arrow functions automatically return a value and when you need return explicitly.",
    sections: [
      {
        heading: "Implicit vs explicit return",
        paragraphs: [
          "Arrow functions have two body styles. The choice determines whether <code>return</code> is needed."
        ],
        list: [
          "<b>Concise body</b> (no braces): the expression's value is returned automatically — this is <b>implicit return</b>.",
          "<b>Block body</b> (with braces): you must write <code>return</code> explicitly — without it, the function returns <code>undefined</code>."
        ]
      }
    ],
    codeExamples: [
      {
        heading: "Implicit vs explicit return",
        file: "Developer Console",
        language: "JavaScript",
        code: "const add = (a, b) => a + b;\nconst subtract = (a, b) => { return a - b; };\nconst doNothing = () => { let x = 1; };\n\nconsole.log(add(5, 3));       // 8\nconsole.log(subtract(5, 3));  // 2\nconsole.log(doNothing());     // undefined",
        output: "8\n2\nundefined",
        explanation: [
          "<code>add</code> uses implicit return — no braces, no <code>return</code>.",
          "<code>subtract</code> uses explicit return — braces mean you must write <code>return</code>.",
          "<code>doNothing</code> has braces but no return — it returns <code>undefined</code>."
        ]
      },
      {
        heading: "Returning objects implicitly",
        file: "Developer Console",
        language: "JavaScript",
        code: "const wrong = () => { name: \"Vishnu\" };\nconsole.log(wrong());  // undefined\n\nconst right = () => ({ name: \"Vishnu\" });\nconsole.log(right());  // { name: \"Vishnu\" }",
        output: "undefined\n{ name: \"Vishnu\" }",
        explanation: [
          "JavaScript sees <code>{ name: \"Vishnu\" }</code> as a block statement, not an object.",
          "Wrapping in parentheses <code>({})</code> tells JavaScript it's an expression — an object literal."
        ]
      }
    ],
    keyTakeaways: [
      "No braces = implicit return (the expression is returned automatically).",
      "Braces = you must write <code>return</code> explicitly.",
      "To return an object from an arrow function, wrap it in parentheses: <code>() => ({...})</code>."
    ],
    practice: {
      compiler: true,
      task: "Write an arrow function <code>createUser</code> that takes a name and returns an object <code>{ name, active: true }</code> using implicit return.",
      hints: [
        "Remember to wrap the object in parentheses: <code>() => ({...})</code>.",
        "<code>const createUser = name => ({ name, active: true });</code>"
      ],
      note: "This pattern is very common for creating data objects concisely."
    }
  },

  /* ------------------------------------------------------------------
     2.2.3 — Arrow Functions as Callbacks
     ------------------------------------------------------------------ */
  "2.2.3": {
    id: "arrow-functions-as-callbacks",
    number: "2.2.3",
    title: "Arrow Functions as Callbacks",
    description:
      "Use arrow functions where other functions expect a callback — event listeners, array methods, and timers become cleaner.",
    sections: [
      {
        heading: "What is a callback?",
        paragraphs: [
          "A callback is a function you pass to another function to be called later. Arrow functions make callbacks short and readable."
        ]
      }
    ],
    codeExamples: [
      {
        heading: "Arrow functions with array methods",
        file: "Developer Console",
        language: "JavaScript",
        code: "const nums = [1, 2, 3, 4, 5];\n\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled);  // [2, 4, 6, 8, 10]\n\nconst evens = nums.filter(n => n % 2 === 0);\nconsole.log(evens);    // [2, 4]\n\nconst total = nums.reduce((sum, n) => sum + n, 0);\nconsole.log(total);    // 15",
        output: "[2, 4, 6, 8, 10]\n[2, 4]\n15",
        explanation: [
          "<code>n => n * 2</code> is a callback passed to <code>.map()</code>. It runs once per element.",
          "Arrow callbacks are so common that most developers write them inline rather than naming them."
        ]
      },
      {
        heading: "Arrow functions with event listeners and timers",
        file: "app.js",
        language: "JavaScript",
        code: "document.querySelector(\"button\").addEventListener(\"click\", () => {\n  console.log(\"Clicked!\");\n});\n\nsetTimeout(() => {\n  console.log(\"3 seconds passed\");\n}, 3000);",
        explanation: [
          "The arrow function <code>() => { ... }</code> is the callback — it runs when the event fires.",
          "This is much shorter than writing a full <code>function</code> keyword for a one-off handler."
        ]
      }
    ],
    keyTakeaways: [
      "A callback is a function passed to another function to run later.",
      "Arrow functions make callbacks short: <code>.map(n => n * 2)</code>.",
      "They're commonly used with array methods, event listeners, and timers."
    ],
    practice: {
      compiler: true,
      task: "Given <code>const words = [\"hello\", \"world\", \"js\"]</code>, use <code>.map()</code> with an arrow function to create an array of uppercase strings.",
      hints: [
        "<code>.map(w => w.toUpperCase())</code>",
        "Result: <code>[\"HELLO\", \"WORLD\", \"JS\"]</code>"
      ],
      note: "Try the same with <code>.filter()</code> to keep only words longer than 3 characters."
    }
  }
,
  /* ------------------------------------------------------------------
     2.3.1 — Imperative Iteration with for Loops
     ------------------------------------------------------------------ */
  "2.3.1": {
    id: "imperative-for-loops",
    number: "2.3.1",
    title: "Imperative Iteration with for Loops",
    description:
      "Repeat code a specific number of times using the classic for loop.",
    sections: [
      {
        heading: "The for loop anatomy",
        paragraphs: [
          "A for loop runs a block of code repeatedly. It has three parts in the parentheses:"
        ],
        list: [
          "<b>Initialization:</b> <code>let i = 0</code> — runs once before the loop starts",
          "<b>Condition:</b> <code>i < 5</code> — checked before each iteration; loop stops when false",
          "<b>Update:</b> <code>i++</code> — runs after each iteration"
        ]
      }
    ],
    codeExamples: [
      {
        heading: "Basic for loop",
        file: "Developer Console",
        language: "JavaScript",
        code: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}",
        output: "0\n1\n2\n3\n4",
        explanation: [
          "Starts at 0, runs while <code>i < 5</code>, increments <code>i</code> after each iteration.",
          "The loop body runs 5 times with i = 0, 1, 2, 3, 4."
        ]
      },
      {
        heading: "Looping through an array",
        file: "Developer Console",
        language: "JavaScript",
        code: "const fruits = [\"apple\", \"banana\", \"cherry\"];\n\nfor (let i = 0; i < fruits.length; i++) {\n  console.log(fruits[i]);\n}",
        output: "apple\nbanana\ncherry",
        explanation: [
          "<code>fruits[i]</code> accesses each element by its index (0, 1, 2).",
          "<code>fruits.length</code> is 3, so the loop runs while <code>i < 3</code>."
        ]
      }
    ],
    keyTakeaways: [
      "A for loop has three parts: initialization, condition, and update.",
      "Use <code>let i = 0</code> for the counter — <code>let</code> scopes it to the loop.",
      "Access array elements with <code>array[i]</code> inside the loop."
    ],
    practice: {
      compiler: true,
      task: "Write a for loop that prints the numbers 1 through 10.",
      hints: [
        "Start at 1: <code>let i = 1</code>",
        "End at 10: <code>i <= 10</code>"
      ],
      note: "Try changing the start and end values to print even numbers only."
    }
  },

  /* ------------------------------------------------------------------
     2.3.2 — Condition-Based Iteration with while & do...while Loops
     ------------------------------------------------------------------ */
  "2.3.2": {
    id: "while-and-do-while-loops",
    number: "2.3.2",
    title: "Condition-Based Iteration with while & do...while Loops",
    description:
      "Repeat code while a condition is true — useful when you don't know the exact count.",
    sections: [
      {
        heading: "while vs do...while",
        list: [
          "<code>while</code> checks the condition <b>before</b> each iteration — may run zero times.",
          "<code>do...while</code> checks <b>after</b> each iteration — always runs at least once."
        ]
      }
    ],
    codeExamples: [
      {
        heading: "while loop",
        file: "Developer Console",
        language: "JavaScript",
        code: "let count = 0;\nwhile (count < 3) {\n  console.log(count);\n  count++;\n}",
        output: "0\n1\n2",
        explanation: [
          "The loop checks <code>count < 3</code> before each run.",
          "When count reaches 3, the condition is false and the loop stops."
        ]
      },
      {
        heading: "do...while loop",
        file: "Developer Console",
        language: "JavaScript",
        code: "let input;\ndo {\n  input = \"yes\";\n  console.log(\"Processing:\", input);\n} while (input !== \"no\");",
        output: "Processing: yes",
        explanation: [
          "The code inside <code>do</code> runs first, then the condition is checked.",
          "Useful when you need to run something at least once — like a menu or prompt."
        ]
      }
    ],
    keyTakeaways: [
      "<code>while</code> checks before running; <code>do...while</code> checks after — guaranteeing one run.",
      "Both loops run as long as the condition is <code>true</code>.",
      "Always update a variable inside the loop to avoid infinite loops."
    ],
    practice: {
      compiler: true,
      task: "Write a while loop that counts down from 5 to 1, then prints \"Go!\".",
      hints: [
        "Start: <code>let i = 5</code>",
        "Condition: <code>while (i > 0)</code>",
        "Decrement: <code>i--</code>"
      ],
      note: "What happens if you forget <code>i--</code>? The loop runs forever."
    }
  },

  /* ------------------------------------------------------------------
     2.3.3 — Controlling Loop Flow: break and continue
     ------------------------------------------------------------------ */
  "2.3.3": {
    id: "break-and-continue",
    number: "2.3.3",
    title: "Controlling Loop Flow: break and continue",
    description:
      "Exit a loop early with break, or skip an iteration with continue.",
    sections: [
      {
        heading: "break and continue",
        list: [
          "<code>break</code> — exits the loop entirely, jumping to the code after it.",
          "<code>continue</code> — skips the current iteration and jumps to the next one."
        ]
      }
    ],
    codeExamples: [
      {
        heading: "break — stop early",
        file: "Developer Console",
        language: "JavaScript",
        code: "for (let i = 0; i < 10; i++) {\n  if (i === 5) break;\n  console.log(i);\n}",
        output: "0\n1\n2\n3\n4",
        explanation: [
          "When <code>i === 5</code>, <code>break</code> exits the loop immediately.",
          "The loop would have run to 9, but break stops it at 5."
        ]
      },
      {
        heading: "continue — skip an iteration",
        file: "Developer Console",
        language: "JavaScript",
        code: "for (let i = 0; i < 6; i++) {\n  if (i === 3) continue;\n  console.log(i);\n}",
        output: "0\n1\n2\n4\n5",
        explanation: [
          "When <code>i === 3</code>, <code>continue</code> skips the <code>console.log</code> and moves to the next iteration.",
          "The loop still runs for all other values — only 3 is skipped."
        ]
      }
    ],
    keyTakeaways: [
      "<code>break</code> exits the loop completely.",
      "<code>continue</code> skips the current iteration and moves to the next.",
      "Both work in for, while, and do...while loops."
    ],
    practice: {
      compiler: true,
      task: "Write a for loop from 1 to 10 that skips multiples of 3 and stops when it reaches 8.",
      hints: [
        "Use <code>continue</code> when <code>i % 3 === 0</code>.",
        "Use <code>break</code> when <code>i === 8</code>."
      ],
      note: "Expected output: 1, 2, 4, 5, 7."
    }
  },

  /* ------------------------------------------------------------------
     2.3.4 — Iterating Array Values with for...of Loops
     ------------------------------------------------------------------ */
  "2.3.4": {
    id: "for-of-loops",
    number: "2.3.4",
    title: "Iterating Array Values with for...of Loops",
    description:
      "Loop through array values directly — cleaner than index-based for loops.",
    sections: [
      {
        heading: "for...of vs traditional for",
        paragraphs: [
          "<code>for...of</code> gives you each value directly — no index, no <code>array[i]</code>. It's cleaner and less error-prone for simply reading values."
        ]
      }
    ],
    codeExamples: [
      {
        heading: "for...of basics",
        file: "Developer Console",
        language: "JavaScript",
        code: "const colors = [\"red\", \"green\", \"blue\"];\n\nfor (const color of colors) {\n  console.log(color);\n}",
        output: "red\ngreen\nblue",
        explanation: [
          "<code>color</code> receives each value in the array, one at a time.",
          "No index needed — the loop handles the iteration internally."
        ]
      },
      {
        heading: "When you need the index",
        file: "Developer Console",
        language: "JavaScript",
        code: "const nums = [10, 20, 30];\n\nfor (const [i, val] of nums.entries()) {\n  console.log(i, val);\n}",
        output: "0 10\n1 20\n2 30",
        explanation: [
          "<code>.entries()</code> returns <code>[index, value]</code> pairs.",
          "Destructuring <code>[i, val]</code> unpacks each pair — gives you both index and value."
        ]
      }
    ],
    keyTakeaways: [
      "<code>for...of</code> loops through values directly: <code>for (const x of array)</code>.",
      "Use it when you only need the values, not the index.",
      "Use <code>.entries()</code> if you need both index and value."
    ],
    practice: {
      compiler: true,
      task: "Use <code>for...of</code> to loop through <code>[\"a\", \"b\", \"c\"]</code> and print each letter with its position (1, 2, 3).",
      hints: [
        "Use <code>.entries()</code> to get index-value pairs.",
        "Add 1 to the index since it starts at 0."
      ],
      note: "for...of also works on strings, Maps, and Sets — not just arrays."
    }
  },

  /* ------------------------------------------------------------------
     2.3.5 — Enumerating Object Keys with for...in Loops
     ------------------------------------------------------------------ */
  "2.3.5": {
    id: "for-in-loops",
    number: "2.3.5",
    title: "Enumerating Object Keys with for...in Loops",
    description:
      "Loop through the properties of an object using for...in.",
    sections: [
      {
        heading: "for...in iterates over keys",
        paragraphs: [
          "<code>for...in</code> loops through the <b>enumerable property names</b> (keys) of an object. Use it when you need to access both the key and the value."
        ]
      }
    ],
    codeExamples: [
      {
        heading: "Looping through object keys",
        file: "Developer Console",
        language: "JavaScript",
        code: "const user = { name: \"Vishnu\", age: 25, city: \"Hyderabad\" };\n\nfor (const key in user) {\n  console.log(key + \":\", user[key]);\n}",
        output: "name: Vishnu\nage: 25\ncity: Hyderabad",
        explanation: [
          "<code>key</code> receives each property name: <code>\"name\"</code>, <code>\"age\"</code>, <code>\"city\"</code>.",
          "<code>user[key]</code> accesses the value using bracket notation (since the key is a variable)."
        ]
      }
    ],
    keyTakeaways: [
      "<code>for...in</code> iterates over object keys (property names).",
      "Access values with <code>obj[key]</code> using bracket notation.",
      "Prefer <code>Object.entries()</code> for modern code — it gives you both key and value directly."
    ],
    practice: {
      compiler: true,
      task: "Given <code>const scores = { math: 95, science: 88, english: 92 }</code>, use <code>for...in</code> to print each subject and its score.",
      hints: [
        "<code>for (const subject in scores)</code>",
        "Print: <code>console.log(subject + \":\", scores[subject])</code>"
      ],
      note: "Try the same with <code>Object.entries(scores)</code> to compare the syntax."
    }
  }

};
