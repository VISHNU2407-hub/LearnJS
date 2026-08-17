/* ============================================================
   LearnJS — learn-data.js (pages/learn)
   Content for the Project Learning Page (guided build workshop).
   Structured per project so more guided builds can be added
   later by adding another key to window.LEARNJS_WORKSHOPS.
   Populated for all catalog projects: clock, counter, bmi-calculator,
   calculator, character-count, color-changer, die-roller,
   numberguessinggame, text-repeator, tipcalculator, blog-website,
   chat-app, ecommerce, expense-tracker, git-hub-profile-finder,
   image-slider, kanban-board, movie-search-app, notes-app,
   pokedex-app, quizapp, quotegenerator, weather-app,
   to-do-list and password-generator.
   ============================================================ */

window.LEARNJS_WORKSHOPS = {
  "clock": {
    slug: "clock",
    folder: "Digital-Clock",
    title: "Digital Clock",
    difficulty: "Beginner",
    time: "30 min",
    category: "Core JS",
    tags: ["DOM", "Timers"],
    intro: "Build a real-time digital clock using JavaScript that displays the current time and updates every second. You'll work with Date, setInterval(), and DOM manipulation to create a clean and functional clock.",
    previewNote: "You'll build a live digital clock that shows the current time and updates itself every second — with clean two-digit formatting and a date display. Start with the starter files, then wire up the JavaScript step by step.",
    cover: "../../assets/project-covers/clock.png",
    previewUrl: "../../../JS%20PROJECTS/clock/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Use console.log() to debug your values.",
      "The Date object is useful for working with time.",
      "setInterval() can repeatedly execute a function."
    ],
    concepts: [
      "Date object & time methods",
      "setInterval() & timers",
      "DOM manipulation (getElementById, textContent)",
      "String formatting (padStart, toString())"
    ],
    challenge: "Extra challenge: add an AM/PM label or a 12-hour toggle to your clock.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the clock elements (hours, minutes, seconds, date).",
          "Open style.css — the layout and colors are already styled for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see a static 00:00:00 clock."
        ],
        /* Code-form version of the flow above (learning aid, not a solution). */
        logicCode: [
          "// 1. index.html — find the clock elements: hours, minutes, seconds, date",
          "// 2. style.css — layout and colors are already styled for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see a static 00:00:00 clock"
        ],
        think: "Which element IDs in index.html will your JavaScript need to update?",
        hints: [
          "Each time block has a unique id — hours, minutes and seconds — plus a date box.",
          "You'll only write JavaScript in this project — the HTML and CSS are done.",
          "Look for id=\"hours\", id=\"minutes\", id=\"seconds\" and id=\"date\"."
        ],
        check: {
          requires: [
            { pattern: "getElementById", hint: "Use document.getElementById() to grab the display elements, e.g. const hoursEl = document.getElementById('hours')." }
          ]
        }
      },
      {
        title: "Get Current Time",
        tagline: "Get the current hours, minutes and seconds.",
        goal: "Create a Date object and pull the current hours, minutes and seconds from it.",
        logic: [
          "Create a Date object.",
          "Get the current hours.",
          "Get the current minutes.",
          "Get the current seconds."
        ],
        /* Code-form version of the flow above (learning aid, not a solution). */
        logicCode: [
          "// 1. Create a Date object",
          "const now = new Date();",
          "",
          "// 2. Get the current hours",
          "const hours = now.getHours();",
          "",
          "// 3. Get the current minutes",
          "const minutes = now.getMinutes();",
          "",
          "// 4. Get the current seconds",
          "const seconds = now.getSeconds();"
        ],
        think: "How can you get the current hour from a Date object?",
        hints: [
          "A Date object represents a single moment in time — new Date() captures 'now'.",
          "Date objects have methods that return parts of the time: getHours(), getMinutes(), getSeconds().",
          "Store each value in a variable, e.g. const hours = now.getHours();"
        ],
        check: {
          requires: [
            { pattern: "new\\s+Date", hint: "Create a Date object: const now = new Date();" },
            { pattern: "getHours", hint: "Read the hour with now.getHours()." },
            { pattern: "getMinutes", hint: "Read the minute with now.getMinutes()." },
            { pattern: "getSeconds", hint: "Read the second with now.getSeconds()." }
          ]
        }
      },
      {
        title: "Format Time",
        tagline: "Format the time properly.",
        goal: "Turn raw numbers into clean two-digit strings like 09 instead of 9.",
        logic: [
          "Convert a number to a string.",
          "Pad it to at least two characters.",
          "Apply the same to hours, minutes and seconds.",
          "Test with a single-digit value like 9."
        ],
        /* Code-form version of the flow above (learning aid, not a solution). */
        logicCode: [
          "// 1. Convert a number to a string",
          "now.getSeconds().toString()",
          "",
          "// 2. Pad it to at least two characters",
          "'9'.padStart(2, '0')   // '9' -> '09'",
          "",
          "// 3. Apply the same to hours, minutes and seconds",
          "const formattedHours   = hours.toString().padStart(2, '0');",
          "const formattedMinutes = minutes.toString().padStart(2, '0');",
          "const formattedSeconds = seconds.toString().padStart(2, '0');",
          "",
          "// 4. Test with a single-digit value like 9",
          "'9'.padStart(2, '0')   // -> '09'"
        ],
        think: "What does '9'.padStart(2, '0') return — and what about '12'.padStart(2, '0')?",
        hints: [
          "Numbers don't have a padStart method — convert with .toString() first.",
          "String.prototype.padStart(targetLength, padString) fills characters from the start.",
          "Chain it: now.getSeconds().toString().padStart(2, '0')"
        ],
        check: {
          requires: [
            { pattern: "padStart", hint: "Pad values with .padStart(2, '0') so 9 becomes '09'." },
            { pattern: "toString", hint: "Numbers need converting first: value.toString().padStart(2, '0')." }
          ]
        }
      },
      {
        title: "Update Display",
        tagline: "Show the time on the screen.",
        goal: "Write the formatted time into the page so the clock shows real values.",
        logic: [
          "Grab the display elements (hours, minutes, seconds, date).",
          "Set their text to the formatted values.",
          "Refresh the page and check the values appear."
        ],
        /* Code-form version of the flow above (learning aid, not a solution). */
        logicCode: [
          "// 1. Grab the display elements",
          "const hoursEl   = document.getElementById('hours');",
          "const minutesEl = document.getElementById('minutes');",
          "const secondsEl = document.getElementById('seconds');",
          "const dateEl    = document.getElementById('date');",
          "",
          "// 2. Set their text to the formatted values",
          "hoursEl.textContent   = formattedHours;",
          "minutesEl.textContent = formattedMinutes;",
          "secondsEl.textContent = formattedSeconds;",
          "",
          "// 3. Refresh the page and check the values appear"
        ],
        think: "How do you put text inside an element you grabbed with getElementById()?",
        hints: [
          "Grab elements once at the top of the file so you don't re-query them every second.",
          "Assign to element.textContent to replace its text.",
          "One line per element: hoursDisplay.textContent = hours;"
        ],
        check: {
          requires: [
            { pattern: "getElementById", hint: "Grab the elements: const hoursEl = document.getElementById('hours');" },
            { pattern: "textContent\\s*=", hint: "Write values into the elements, e.g. hoursEl.textContent = formattedHours;" }
          ]
        }
      },
      {
        title: "Make It Live",
        tagline: "Update the time every second.",
        goal: "Make the clock update itself every second.",
        logic: [
          "Wrap the time logic in a function called updateClock().",
          "Call setInterval(updateClock, 1000) so it runs every second.",
          "Call updateClock() once immediately so the time shows right away."
        ],
        /* Code-form version of the flow above (learning aid, not a solution). */
        logicCode: [
          "// 1. Wrap the time logic in a function",
          "function updateClock() {",
          "  // ... the time logic from the previous steps ...",
          "}",
          "",
          "// 2. Run it every second",
          "setInterval(updateClock, 1000);",
          "",
          "// 3. Call it once immediately so the time shows right away",
          "updateClock();"
        ],
        think: "What does the second argument of setInterval() mean — and what unit is it in?",
        hints: [
          "setInterval(fn, delay) runs fn repeatedly; delay is in milliseconds.",
          "1000 milliseconds = 1 second.",
          "Call updateClock() right after setInterval — otherwise the clock is blank for the first second."
        ],
        check: {
          requires: [
            { pattern: "function\\s+\\w+\\s*\(", hint: "Wrap your time logic in a function, e.g. function updateClock() { ... }" },
            { pattern: "setInterval", hint: "Run the clock every second with setInterval(updateClock, 1000)." },
            { pattern: "1000", hint: "Pass 1000 as the delay — 1000 milliseconds = 1 second." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test your project.",
        goal: "Check edge cases, polish the look and make sure the clock feels finished.",
        logic: [
          "Open the page and watch the seconds tick.",
          "Test single-digit times (09:05:07) — do leading zeros appear?",
          "Use console.log() to debug anything unexpected.",
          "Resize the window — the layout should stay centered and readable."
        ],
        /* Code-form version of the flow above (learning aid, not a solution). */
        logicCode: [
          "// 1. Open the page and watch the seconds tick",
          "// 2. Test single-digit times (09:05:07) — do leading zeros appear?",
          "// 3. Debug anything unexpected",
          "console.log(now.getHours(), now.getMinutes(), now.getSeconds());",
          "",
          "// 4. Resize the window — the layout should stay centered and readable"
        ],
        think: "What does your clock show at 09:05:07 — and what would break if padStart were missing?",
        hints: [
          "console.log() prints values to the browser console (F12) — perfect for debugging.",
          "If a value looks wrong, log the raw Date methods before the formatting step.",
          "A clock stuck at 00 means the display update never ran — check your setInterval and element IDs."
        ],
        check: {
          requires: [
            { pattern: "new\\s+Date", hint: "Create a Date object with new Date()." },
            { pattern: "getHours", hint: "Read the hour with now.getHours()." },
            { pattern: "padStart", hint: "Format two-digit values with .padStart(2, '0')." },
            { pattern: "textContent\\s*=", hint: "Write the formatted values into the elements with .textContent." },
            { pattern: "setInterval", hint: "Keep the clock live with setInterval(updateClock, 1000)." }
          ]
        }
      }
    ],
    /* Starter files shown in the VS Code window.
       index.html and style.css are complete; script.js only has
       guiding comments — the learner writes the solution. */
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Digital Clock</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <div class="icon">\uD83D\uDD52</div>',
        "        <h1>Digital Clock</h1>",
        '        <p class="subtitle">Your Time Use it Wise.</p>',
        '        <div class="line"></div>',
        '        <div class="clock-box">',
        '            <div class="time-block">',
        '                <h2 id="hours">00</h2>',
        "                <span>HOURS</span>",
        "            </div>",
        '            <div class="separator">:</div>',
        '            <div class="time-block">',
        '                <h2 id="minutes">00</h2>',
        "                <span>MINUTES</span>",
        "            </div>",
        '            <div class="separator">:</div>',
        '            <div class="time-block">',
        '                <h2 id="seconds">00</h2>',
        "                <span>SECONDS</span>",
        "            </div>",
        "        </div>",
        '        <div class="date-box">\uD83D\uDCC5 <span id="date">Loading...</span></div>',
        "    </div>",
        "  </main>",
        '  <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        ":root {",
        "  --bg-primary: #ffffff;",
        "  --bg-secondary: #f9fafb;",
        "  --text-primary: #111827;",
        "  --text-secondary: #6b7280;",
        "  --text-tertiary: #9ca3af;",
        "  --accent: #2563eb;",
        "  --border: #e5e7eb;",
        "  --radius-2xl: 24px;",
        "  --radius-full: 9999px;",
        "  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        "body {",
        "  min-height: 100vh;",
        "  display: flex;",
        "  flex-direction: column;",
        "  padding: 20px;",
        "  background: var(--bg-secondary);",
        "  color: var(--text-primary);",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  flex: 1;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  padding: 20px 0;",
        "}",
        "",
        ".container {",
        "  width: min(1200px, 90%);",
        "  padding: 35px 50px;",
        "  text-align: center;",
        "  background: var(--bg-primary);",
        "  border: 1px solid var(--border);",
        "  border-radius: var(--radius-2xl);",
        "  box-shadow: var(--shadow-xl);",
        "}",
        "",
        ".icon { font-size: 2.5rem; margin-bottom: 15px; }",
        "",
        "h1 { font-size: 4rem; color: var(--text-primary); }",
        "",
        ".subtitle {",
        "  color: var(--text-secondary);",
        "  margin-top: 10px;",
        "  font-size: 1.3rem;",
        "}",
        "",
        ".line {",
        "  width: 100px;",
        "  height: 4px;",
        "  margin: 20px auto 35px;",
        "  border-radius: 10px;",
        "  background: var(--accent);",
        "}",
        "",
        ".clock-box {",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  gap: 40px;",
        "  padding: 35px 50px;",
        "  background: var(--bg-secondary);",
        "  border-radius: var(--radius-2xl);",
        "  margin-bottom: 30px;",
        "  border: 1px solid var(--border);",
        "}",
        "",
        ".time-block { min-width: 180px; }",
        "",
        ".time-block h2 {",
        "  font-size: 6rem;",
        "  font-weight: 700;",
        "  color: var(--accent);",
        "  font-variant-numeric: tabular-nums;",
        "}",
        "",
        ".time-block span {",
        "  color: var(--text-secondary);",
        "  letter-spacing: 4px;",
        "  font-size: 0.95rem;",
        "}",
        "",
        ".separator {",
        "  font-size: 4rem;",
        "  font-weight: bold;",
        "  color: var(--text-tertiary);",
        "}",
        "",
        ".date-box {",
        "  display: inline-block;",
        "  padding: 16px 32px;",
        "  border-radius: var(--radius-full);",
        "  background: var(--bg-secondary);",
        "  border: 1px solid var(--border);",
        "  font-size: 1.15rem;",
        "  color: var(--text-secondary);",
        "}",
        "",
        "@media (max-width: 900px) {",
        "  h1 { font-size: 3rem; }",
        "  .clock-box { gap: 20px; padding: 25px; }",
        "  .time-block h2 { font-size: 4rem; }",
        "  .separator { font-size: 3rem; }",
        "}",
        "",
        "@media (max-width: 700px) {",
        "  .clock-box { flex-direction: column; gap: 10px; }",
        "  .separator { display: none; }",
        "  .time-block h2 { font-size: 4rem; }",
        "  h1 { font-size: 2.5rem; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Get the required elements",
        "//   Grab #hours, #minutes, #seconds and #date with document.getElementById()",
        "",
        "// Step 2: Get the current time",
        "//   Create a Date object and read hours, minutes and seconds from it",
        "",
        "// Step 3: Format the time",
        "//   Make single digits look like \"09\" instead of \"9\" (padStart is your friend)",
        "",
        "// Step 4: Update the display",
        "//   Write the formatted values into the elements you grabbed in Step 1",
        "",
        "// Step 5: Make the clock update every second",
        "//   setInterval(updateClock, 1000) — and call updateClock() once right away",
        "",
        "// Step 6: Final touch & test",
        "//   Open the page, check the time ticks, and polish anything that looks off"
      ].join("\n")
    }
  },

  "counter": {
    slug: "counter",
    folder: "Counter-App",
    title: "Counter App",
    difficulty: "Beginner",
    time: "25 min",
    category: "Core JS",
    tags: ["DOM", "Events", "Variables"],
    intro: "Build a simple counter application using JavaScript that lets users increase, decrease, and reset the count. You'll work with DOM manipulation, event handling, variables, and updating the UI dynamically.",
    previewNote: "You'll build a working counter app with Increase (+), Decrease (-) and Reset buttons. Start with the starter files, then wire up the JavaScript step by step — every button updates the big number on the screen.",
    cover: "../../assets/project-covers/counter.png",
    previewUrl: "../../../JS%20PROJECTS/counter/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Use textContent to update the count.",
      "Add event listeners for button clicks.",
      "Keep the count in a variable and update the UI every time it changes.",
      "Test all actions: increase, decrease, and reset."
    ],
    concepts: [
      "DOM selection and manipulation",
      "Event handling (addEventListener)",
      "Updating values dynamically",
      "Variables and state management",
      "Basic UI logic"
    ],
    challenge: "Extra challenge: stop the count from going below 0, or add a step-size control that changes how much + and - add or remove.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the count display (#count) and the three buttons (+, - and Reset).",
          "Open style.css — the layout and colors are already styled for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see a static 0."
        ],
        /* Code-form version of the flow above (learning aid, not a solution). */
        logicCode: [
          "// 1. index.html — find the count display (#count) and the three buttons (+, - and Reset)",
          "// 2. style.css — layout and colors are already styled for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see a static 0"
        ],
        think: "Which element IDs in index.html will your JavaScript need to select?",
        hints: [
          "The display has id=\"count\" — the buttons have the ids increment, decrement and reset.",
          "You'll only write JavaScript in this project — the HTML and CSS are done.",
          "Look for id=\"count\", id=\"increment\", id=\"decrement\" and id=\"reset\"."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const countDisplay = document.getElementById('count')." }
          ]
        }
      },
      {
        title: "Select Elements",
        tagline: "Select the count display and buttons.",
        goal: "Select the count display and the three buttons so your script can read and update them.",
        logic: [
          "Grab the count display (#count).",
          "Grab the + button (#increment).",
          "Grab the - button (#decrement).",
          "Grab the Reset button (#reset)."
        ],
        /* Code-form version of the flow above (learning aid, not a solution). */
        logicCode: [
          "// 1. Grab the count display",
          "const countDisplay = document.getElementById('count');",
          "",
          "// 2. Grab the + button",
          "const incrementBtn = document.getElementById('increment');",
          "",
          "// 3. Grab the - button",
          "const decrementBtn = document.getElementById('decrement');",
          "",
          "// 4. Grab the Reset button",
          "const resetBtn = document.getElementById('reset');"
        ],
        think: "Why store each element in a variable instead of re-querying the document every time?",
        hints: [
          "Grab elements once at the top of the file — document.getElementById('count') returns the element.",
          "Give each button its own variable, e.g. incrementBtn, decrementBtn, resetBtn.",
          "querySelector('#count') works too — use whichever you're comfortable with."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)\\s*\\([^)]*[\"']#?count[\"']", hint: "Select the display: const countDisplay = document.getElementById('count');" },
            { pattern: "(getElementById|querySelector(?:All)?)\\s*\\([^)]*[\"']#?increment[\"']", hint: "Select the + button: const incrementBtn = document.getElementById('increment');" },
            { pattern: "(getElementById|querySelector(?:All)?)\\s*\\([^)]*[\"']#?decrement[\"']", hint: "Select the - button: const decrementBtn = document.getElementById('decrement');" },
            { pattern: "(getElementById|querySelector(?:All)?)\\s*\\([^)]*[\"']#?reset[\"']", hint: "Select the Reset button: const resetBtn = document.getElementById('reset');" }
          ]
        }
      },
      {
        title: "Increase Count",
        tagline: "Increase the count when + is clicked.",
        goal: "Make the + button increase the count by 1 and show the new value.",
        logic: [
          "Create a variable to hold the count, starting at 0.",
          "Listen for clicks on the + button.",
          "Increase the count by 1.",
          "Write the new value into the display."
        ],
        /* Code-form version of the flow above (learning aid, not a solution). */
        logicCode: [
          "// 1. Create a variable to hold the count",
          "let count = 0;",
          "",
          "// 2. Listen for clicks on the + button",
          "incrementBtn.addEventListener('click', () => {",
          "  // 3. Increase the count by 1",
          "  count += 1;",
          "  // 4. Write the new value into the display",
          "  countDisplay.textContent = count;",
          "});"
        ],
        think: "After count += 1, why must you also update the display?",
        hints: [
          "Attach a click listener to the + button: incrementBtn.addEventListener('click', ...).",
          "Change the count variable with count += 1 (or count++).",
          "Push the new value onto the page: countDisplay.textContent = count;"
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks on the + button: incrementBtn.addEventListener('click', () => { ... })." },
            { pattern: "count\\s*\\+\\+|count\\s*\\+=|count\\s*=\\s*count\\s*\\+", hint: "Increase the count when + is clicked, e.g. count += 1." },
            { pattern: "textContent\\s*=|innerText\\s*=", hint: "Update the display after the count changes, e.g. countDisplay.textContent = count;" }
          ]
        }
      },
      {
        title: "Decrease Count",
        tagline: "Decrease the count when - is clicked.",
        goal: "Make the - button decrease the count by 1 and show the new value.",
        logic: [
          "Listen for clicks on the - button.",
          "Decrease the count by 1.",
          "Update the display with the new value."
        ],
        /* Code-form version of the flow above (learning aid, not a solution). */
        logicCode: [
          "// 1. Listen for clicks on the - button",
          "decrementBtn.addEventListener('click', () => {",
          "  // 2. Decrease the count by 1",
          "  count -= 1;",
          "  // 3. Update the display",
          "  countDisplay.textContent = count;",
          "});"
        ],
        think: "What should happen when the count is already 0 — should it go negative?",
        hints: [
          "Add a click listener to the - button, just like the + one.",
          "Decrease the variable with count -= 1 (or count--).",
          "Update the display so it always matches the count variable."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks on the - button: decrementBtn.addEventListener('click', () => { ... })." },
            { pattern: "count\\s*--|count\\s*-=\\s*1|count\\s*=\\s*count\\s*-", hint: "Decrease the count when - is clicked, e.g. count -= 1." },
            { pattern: "textContent\\s*=|innerText\\s*=", hint: "Update the display after the count changes, e.g. countDisplay.textContent = count;" }
          ]
        }
      },
      {
        title: "Reset Count",
        tagline: "Reset the count to 0.",
        goal: "Make the Reset button return the count to 0.",
        logic: [
          "Listen for clicks on the Reset button.",
          "Set the count variable back to 0.",
          "Update the display."
        ],
        /* Code-form version of the flow above (learning aid, not a solution). */
        logicCode: [
          "// 1. Listen for clicks on the Reset button",
          "resetBtn.addEventListener('click', () => {",
          "  // 2. Set the count back to 0",
          "  count = 0;",
          "  // 3. Update the display",
          "  countDisplay.textContent = count;",
          "});"
        ],
        think: "After reset, what value should the display show — and why?",
        hints: [
          "Attach a click listener to the Reset button.",
          "Set the variable back to zero: count = 0;",
          "Refresh the display so it shows 0 again."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks on the Reset button: resetBtn.addEventListener('click', () => { ... })." },
            { pattern: "(getElementById|querySelector(?:All)?)\\s*\\([^)]*[\"']#?reset[\"']", hint: "Select the Reset button first: const resetBtn = document.getElementById('reset');" },
            { pattern: "(?<!let )(?<!var )(?<!const )count\\s*=\\s*0", hint: "Set the count back to 0 when Reset is clicked: count = 0;" },
            { pattern: "textContent\\s*=|innerText\\s*=", hint: "Update the display so it shows 0 again, e.g. countDisplay.textContent = count;" }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Test all features and polish your project.",
        goal: "Test every action — increase, decrease, reset — and polish your project.",
        logic: [
          "Open the page and click + a few times — does the count go up?",
          "Click - and Reset — do they behave as expected?",
          "Use console.log() to debug anything unexpected.",
          "Resize the window — the card should stay centered and readable."
        ],
        /* Code-form version of the flow above (learning aid, not a solution). */
        logicCode: [
          "// 1. Open the page and click + a few times — does the count go up?",
          "// 2. Click - and Reset — do they behave as expected?",
          "// 3. Debug anything unexpected",
          "console.log(count);",
          "",
          "// 4. Resize the window — the card should stay centered and readable"
        ],
        think: "What would break if you changed the count variable but never updated the display?",
        hints: [
          "Click every button and confirm the display always matches the count.",
          "console.log(count) prints the current value to the browser console (F12) — perfect for debugging.",
          "If the display never changes, check the element ids and that every listener is attached."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Wire at least one button with addEventListener('click', ...)." },
            { pattern: "count\\s*(\\+\\+|--|\\+=|-=)|count\\s*=\\s*count\\s*[+-]", hint: "Increase or decrease the count variable when a button is clicked." },
            { pattern: "(?<!let )(?<!var )(?<!const )count\\s*=\\s*0", hint: "Reset the count to 0 with a real assignment, e.g. count = 0." },
            { pattern: "textContent\\s*=|innerText\\s*=", hint: "Update the display so the UI matches the count, e.g. countDisplay.textContent = count;" }
          ]
        }
      }
    ],
    /* Starter files shown in the VS Code window.
       index.html and style.css are complete; script.js only has
       guiding comments — the learner writes the solution. */
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Counter App</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <div class="card">',
        "            <h1>Counter App</h1>",
        '            <div id="count" class="count">0</div>',
        '            <div class="buttons">',
        '                <button id="decrement">-</button>',
        '                <button id="reset">Reset</button>',
        '                <button id="increment">+</button>',
        "            </div>",
        "        </div>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        ":root {",
        "  --bg-primary: #ffffff;",
        "  --bg-secondary: #f9fafb;",
        "  --text-primary: #111827;",
        "  --text-secondary: #6b7280;",
        "  --accent: #2563eb;",
        "  --success: #16a34a;",
        "  --danger: #dc2626;",
        "  --border: #e5e7eb;",
        "  --radius-md: 10px;",
        "  --radius-2xl: 24px;",
        "  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "  --font-heading: 'Inter', system-ui, sans-serif;",
        "  --font-body: 'Inter', system-ui, sans-serif;",
        "  --transition-fast: 0.15s ease;",
        "}",
        "",
        "body {",
        "  min-height: 100vh;",
        "  display: flex;",
        "  flex-direction: column;",
        "  background: var(--bg-secondary);",
        "  color: var(--text-primary);",
        "  font-family: var(--font-body);",
        "}",
        "",
        ".main-wrapper {",
        "  flex: 1;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".card {",
        "  width: 380px;",
        "  padding: 40px;",
        "  text-align: center;",
        "  background: var(--bg-primary);",
        "  border: 1px solid var(--border);",
        "  border-radius: var(--radius-2xl);",
        "  box-shadow: var(--shadow-xl);",
        "}",
        "",
        ".card h1 {",
        "  color: var(--text-primary);",
        "  margin-bottom: 30px;",
        "  font-size: 2rem;",
        "}",
        "",
        ".count {",
        "  font-size: 5rem;",
        "  font-weight: 700;",
        "  color: var(--accent);",
        "  margin-bottom: 30px;",
        "  font-family: var(--font-heading);",
        "  font-variant-numeric: tabular-nums;",
        "}",
        "",
        ".buttons {",
        "  display: flex;",
        "  gap: 12px;",
        "}",
        "",
        "button {",
        "  flex: 1;",
        "  border: none;",
        "  padding: 14px;",
        "  border-radius: var(--radius-md);",
        "  font-size: 1rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "  color: #fff;",
        "  transition: all var(--transition-fast);",
        "  font-family: var(--font-body);",
        "}",
        "",
        "button:hover { transform: translateY(-2px); filter: brightness(1.1); }",
        "button:active { transform: scale(0.97); }",
        "",
        "#increment { background: var(--success); }",
        "#decrement { background: var(--danger); }",
        "#reset { background: var(--accent); }",
        "",
        "@media (max-width: 480px) {",
        "  .card { width: 100%; padding: 30px 20px; }",
        "  .count { font-size: 4rem; }",
        "  .buttons { flex-wrap: wrap; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the UI — a count display (#count) and three buttons (+, -, Reset)",
        "//   style.css is complete — the layout and colors are done for you",
        "",
        "// Step 2: Select the elements",
        "//   Grab #count, #increment, #decrement and #reset with document.getElementById()",
        "",
        "// Step 3: Increase the count",
        "//   Listen for clicks on the + button, increase the count variable,",
        "//   then update the display with textContent",
        "",
        "// Step 4: Decrease the count",
        "//   Listen for clicks on the - button, decrease the count variable,",
        "//   then update the display",
        "",
        "// Step 5: Reset the count",
        "//   Listen for clicks on the Reset button, set the count back to 0,",
        "//   then update the display",
        "",
        "// Step 6: Final touch & test",
        "//   Open the page, click +, - and Reset, and confirm the display",
        "//   always matches the count"
      ].join("\n")
    }
  },

  "bmi-calculator": {
    slug: "bmi-calculator",
    folder: "bmi calculator",
    title: "BMI Calculator",
    difficulty: "Beginner",
    time: "30 min",
    category: "Core JS",
    tags: ["DOM", "Forms", "Events", "Calculations"],
    intro: "Build a BMI Calculator using JavaScript that takes a user's height and weight, calculates their Body Mass Index, and displays the result with an appropriate category. You'll work with form inputs, the .value property, and basic math.",
    previewNote: "You'll build a working BMI Calculator with Height and Weight inputs and a Calculate button. Start with the starter files, then wire up the JavaScript step by step — every click turns the two numbers into a BMI value and a category.",
    cover: "../../assets/project-covers/bmi-calculator.png",
    previewUrl: "../../../JS%20PROJECTS/bmi%20calculator/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Use .value to read input values.",
      "Convert input values from strings to numbers.",
      "Validate inputs before calculating.",
      "Keep calculation logic separate from UI updates.",
      "Test multiple height and weight combinations."
    ],
    concepts: [
      "Reading input values with .value",
      "Converting strings to numbers (Number / parseFloat)",
      "Math calculations (BMI = weight ÷ height²)",
      "Conditional logic for categories (if / else if)",
      "Updating the UI with textContent"
    ],
    challenge: "Extra challenge: add a height input in centimetres (convert to metres before calculating) or color-code the category result.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the weight (#weight) and height (#height) inputs, the Calculate button (#calculateBtn) and the result boxes (#bmiValue, #category).",
          "Open style.css — the layout and colors are already styled for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see a static BMI calculator."
        ],
        logicCode: [
          "// 1. index.html — find the weight (#weight) and height (#height) inputs, the Calculate button (#calculateBtn) and result boxes (#bmiValue, #category)",
          "// 2. style.css — layout and colors are already styled for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see a static BMI calculator"
        ],
        think: "Which element IDs in index.html will your JavaScript need to select?",
        hints: [
          "The weight input has id=\"weight\" and the height input has id=\"height\".",
          "The button has id=\"calculateBtn\" — the results use id=\"bmiValue\" and id=\"category\".",
          "You'll only write JavaScript in this project — the HTML and CSS are done."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const weightInput = document.getElementById('weight')." }
          ]
        }
      },
      {
        title: "Get User Inputs",
        tagline: "Read the height and weight values from the form.",
        goal: "Select the height and weight inputs and read the values the user typed.",
        logic: [
          "Grab the weight input (#weight).",
          "Grab the height input (#height).",
          "Read the typed value with .value.",
          "Store both values in variables."
        ],
        logicCode: [
          "// 1. Grab the weight input",
          "const weightInput = document.getElementById('weight');",
          "",
          "// 2. Grab the height input",
          "const heightInput = document.getElementById('height');",
          "",
          "// 3. Read the typed value with .value",
          "const weight = weightInput.value;",
          "const height = heightInput.value;"
        ],
        think: "What type of value does input.value return — and why does that matter for math?",
        hints: [
          "input.value always returns a string, even for type=\"number\" inputs.",
          "Select inputs once at the top of the file: document.getElementById('weight').",
          "Read the values with .value: const weight = weightInput.value;"
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)\\s*\\([^)]*weight", hint: "Select the weight input: const weightInput = document.getElementById('weight');" },
            { pattern: "(getElementById|querySelector(?:All)?)\\s*\\([^)]*height", hint: "Select the height input: const heightInput = document.getElementById('height');" },
            { pattern: "\\.value", hint: "Read the typed values with .value — e.g. const weight = weightInput.value;" }
          ]
        }
      },
      {
        title: "Calculate BMI",
        tagline: "Convert the inputs to numbers and calculate the BMI.",
        goal: "Convert the string values to numbers and compute BMI = weight / (height × height).",
        logic: [
          "Convert the weight string to a number.",
          "Convert the height string to a number.",
          "Square the height (height × height).",
          "Divide weight by the squared height."
        ],
        logicCode: [
          "// 1. Convert the weight string to a number",
          "const weight = Number(weightInput.value);",
          "",
          "// 2. Convert the height string to a number",
          "const height = Number(heightInput.value);",
          "",
          "// 3. Square the height (height × height)",
          "const heightSquared = height * height;",
          "",
          "// 4. Divide weight by the squared height",
          "const bmi = weight / heightSquared;"
        ],
        think: "What happens if you multiply two strings instead of two numbers — e.g. '1.75' * '1.75'?",
        hints: [
          "Number('70') returns 70 — parseFloat(value) works too.",
          "BMI = weight / (height * height) — height must be in metres.",
          "Square the height first: const heightSquared = height * height;"
        ],
        check: {
          requires: [
            { pattern: "(Number|parseFloat|parseInt)\\s*\\(", hint: "Convert the input strings to numbers — e.g. const weight = Number(weightInput.value);" },
            { pattern: "(\\w+\\s*\\*\\s*\\w+|Math\\.pow|\\*\\*)", hint: "Square the height — e.g. const heightSquared = height * height; (or height ** 2 / Math.pow)." },
            { pattern: "\\w+\\s*/\\s*\\(?\\s*\\w+", hint: "Divide weight by the squared height — e.g. const bmi = weight / heightSquared;" }
          ]
        }
      },
      {
        title: "Determine BMI Category",
        tagline: "Determine the appropriate category from the calculated BMI.",
        goal: "Compare the BMI against the standard ranges and pick the right category.",
        logic: [
          "If BMI < 18.5 → Underweight.",
          "Else if BMI < 24.9 → Normal.",
          "Else if BMI < 29.9 → Overweight.",
          "Else → Obese."
        ],
        logicCode: [
          "// 1. If BMI < 18.5 → Underweight",
          "if (bmi < 18.5) { category = 'Underweight'; }",
          "// 2. Else if BMI < 24.9 → Normal",
          "else if (bmi < 24.9) { category = 'Normal'; }",
          "// 3. Else if BMI < 29.9 → Overweight",
          "else if (bmi < 29.9) { category = 'Overweight'; }",
          "// 4. Else → Obese",
          "else { category = 'Obese'; }"
        ],
        think: "Why does checking bmi < 24.9 after bmi < 18.5 give the correct Normal range?",
        hints: [
          "Use an if / else if chain — the first matching condition wins.",
          "Order matters: check the smallest threshold first.",
          "Store the category in a variable so the next step can display it."
        ],
        check: {
          requires: [
            { pattern: "\\b(if|else|switch)\\b", hint: "Use if / else if (or switch) to pick the category from the BMI value." },
            { pattern: "(18\\.5|24\\.9|29\\.9|30)", hint: "Compare against the standard ranges — 18.5, 24.9, 29.9 and 30." }
          ]
        }
      },
      {
        title: "Display the Result",
        tagline: "Display the BMI value and category in the UI.",
        goal: "Write the calculated BMI and its category into the result boxes on the page.",
        logic: [
          "Grab the result elements (#bmiValue and #category).",
          "Round the BMI to two decimals with toFixed(2).",
          "Write the BMI value into #bmiValue.",
          "Write the category into #category."
        ],
        logicCode: [
          "// 1. Grab the result elements",
          "const bmiValueEl = document.getElementById('bmiValue');",
          "const categoryEl = document.getElementById('category');",
          "",
          "// 2. Round the BMI to two decimals",
          "const rounded = bmi.toFixed(2);",
          "",
          "// 3. Write the BMI value into #bmiValue",
          "bmiValueEl.textContent = rounded;",
          "",
          "// 4. Write the category into #category",
          "categoryEl.textContent = category;"
        ],
        think: "What does toFixed(2) return — a number or a string?",
        hints: [
          "element.textContent = value replaces the text inside an element.",
          "bmi.toFixed(2) rounds to two decimal places and returns a string.",
          "You'll need to select #bmiValue and #category — both already exist in index.html."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)\\s*\\([^)]*(bmiValue|category)", hint: "Select the result elements — e.g. const bmiValueEl = document.getElementById('bmiValue');" },
            { pattern: "(textContent|innerText)\\s*=", hint: "Write the values into the elements — e.g. bmiValueEl.textContent = rounded;" }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Validate inputs and test your project.",
        goal: "Guard against invalid input and test several height and weight combinations.",
        logic: [
          "Check the inputs are valid numbers greater than 0.",
          "Show a friendly message when the inputs are invalid.",
          "Test a few combinations — e.g. 70 kg at 1.75 m.",
          "Resize the window — the layout should stay centered and readable."
        ],
        logicCode: [
          "// 1. Validate the inputs before calculating",
          "if (weight <= 0 || height <= 0) {",
          "  // 2. Show a friendly message when invalid",
          "  bmiValueEl.textContent = '--';",
          "  categoryEl.textContent = 'Enter valid values';",
          "} else {",
          "  // ... calculate and display the BMI ...",
          "}",
          "",
          "// 3. Test a few combinations — e.g. 70 kg at 1.75 m → BMI ≈ 22.9 (Normal)",
          "// 4. Resize the window — the layout should stay centered and readable"
        ],
        think: "What happens if the user clicks Calculate with an empty input?",
        hints: [
          "Number('') is 0 and Number('abc') is NaN — both should be rejected.",
          "Only run the calculation when both values are greater than 0.",
          "Try 70 kg at 1.75 m (Normal) and 100 kg at 1.60 m (Obese) to confirm the categories."
        ],
        check: {
          requires: [
            { pattern: "(isNaN|<=|>=|===|!==|&&)", hint: "Validate the inputs before calculating — e.g. if (weight <= 0 || height <= 0) { ... } else { ... }." },
            { pattern: "(textContent|innerText)\\s*=", hint: "Display the result in the UI — e.g. bmiValueEl.textContent = bmi.toFixed(2);" }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>BMI Calculator</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <div class="header">',
        "            <h1>BMI <span>Calculator</span></h1>",
        "            <p>Know your Body Mass Index instantly.</p>",
        "        </div>",
        '        <div class="input-section">',
        '            <div class="input-card">',
        '                <label for="weight">Weight</label>',
        '                <div class="input-box">',
        '                    <input type="number" id="weight" placeholder="Enter weight">',
        "                    <span>kg</span>",
        "                </div>",
        "            </div>",
        '            <div class="input-card">',
        '                <label for="height">Height</label>',
        '                <div class="input-box">',
        '                    <input type="number" id="height" placeholder="Enter height">',
        "                    <span>m</span>",
        "                </div>",
        "            </div>",
        "        </div>",
        '        <button id="calculateBtn">Calculate BMI</button>',
        '        <div class="result-card">',
        '            <div class="result-box">',
        "                <h3>Your BMI</h3>",
        '                <h2 id="bmiValue">--</h2>',
        "            </div>",
        '            <div class="result-box">',
        "                <h3>Category</h3>",
        '                <h2 id="category">--</h2>',
        '                <p id="message">Enter your details</p>',
        "            </div>",
        "        </div>",
        '        <div class="bmi-guide">',
        '            <div class="guide"><h4>Underweight</h4><p>&lt; 18.5</p></div>',
        '            <div class="guide"><h4>Normal</h4><p>18.5 - 24.9</p></div>',
        '            <div class="guide"><h4>Overweight</h4><p>25 - 29.9</p></div>',
        '            <div class="guide"><h4>Obese</h4><p>&ge; 30</p></div>',
        "        </div>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        ":root {",
        "  --bg-primary: #ffffff;",
        "  --bg-secondary: #f9fafb;",
        "  --bg-tertiary: #f3f4f6;",
        "  --text-primary: #111827;",
        "  --text-secondary: #6b7280;",
        "  --text-tertiary: #9ca3af;",
        "  --accent: #2563eb;",
        "  --accent-hover: #1d4ed8;",
        "  --accent-light: rgba(37, 99, 235, 0.1);",
        "  --success: #10b981;",
        "  --border: #e5e7eb;",
        "  --radius-md: 12px;",
        "  --radius-lg: 16px;",
        "  --radius-xl: 20px;",
        "  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);",
        "  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);",
        "  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);",
        "}",
        "",
        "body {",
        "  min-height: 100vh;",
        "  display: flex;",
        "  flex-direction: column;",
        "  padding: 30px;",
        "  background: var(--bg-secondary);",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  flex: 1;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  padding: 20px 0;",
        "}",
        "",
        ".container {",
        "  width: 100%;",
        "  max-width: 900px;",
        "  background: var(--bg-primary);",
        "  border-radius: var(--radius-xl);",
        "  padding: 40px;",
        "  box-shadow: var(--shadow-xl);",
        "  border: 1px solid var(--border);",
        "}",
        "",
        ".header { text-align: center; margin-bottom: 35px; }",
        "",
        ".header h1 {",
        "  font-size: 3rem;",
        "  color: var(--text-primary);",
        "  text-transform: uppercase;",
        "  margin-bottom: 10px;",
        "}",
        "",
        ".header span { color: var(--accent); }",
        "",
        ".header p { color: var(--text-secondary); font-size: 1rem; }",
        "",
        ".input-section {",
        "  display: grid;",
        "  grid-template-columns: repeat(2, 1fr);",
        "  gap: 25px;",
        "  margin-bottom: 30px;",
        "}",
        "",
        ".input-card {",
        "  background: var(--bg-secondary);",
        "  padding: 30px;",
        "  border-radius: var(--radius-lg);",
        "  border: 1px solid var(--border);",
        "}",
        "",
        ".input-card label {",
        "  display: block;",
        "  text-align: center;",
        "  color: var(--text-primary);",
        "  font-size: 1.2rem;",
        "  font-weight: 600;",
        "  margin-bottom: 18px;",
        "  text-transform: uppercase;",
        "}",
        "",
        ".input-box {",
        "  display: flex;",
        "  align-items: center;",
        "  background: var(--bg-tertiary);",
        "  border-radius: var(--radius-md);",
        "  padding: 0 18px;",
        "  border: 1px solid var(--border);",
        "}",
        "",
        ".input-box input {",
        "  flex: 1;",
        "  height: 60px;",
        "  border: none;",
        "  outline: none;",
        "  background: transparent;",
        "  color: var(--text-primary);",
        "  font-size: 1.3rem;",
        "}",
        "",
        ".input-box input::placeholder { color: var(--text-tertiary); }",
        "",
        ".input-box span { color: var(--text-secondary); font-size: 1.1rem; }",
        "",
        "#calculateBtn {",
        "  width: 100%;",
        "  border: none;",
        "  outline: none;",
        "  cursor: pointer;",
        "  padding: 18px;",
        "  border-radius: var(--radius-md);",
        "  background: var(--accent);",
        "  color: white;",
        "  font-size: 1.25rem;",
        "  font-weight: 600;",
        "  margin-bottom: 30px;",
        "  transition: all var(--transition-base);",
        "}",
        "",
        "#calculateBtn:hover {",
        "  background: var(--accent-hover);",
        "  transform: translateY(-2px);",
        "  box-shadow: var(--shadow-md);",
        "}",
        "",
        ".result-card {",
        "  display: grid;",
        "  grid-template-columns: repeat(2, 1fr);",
        "  gap: 25px;",
        "  margin-bottom: 30px;",
        "}",
        "",
        ".result-box {",
        "  background: var(--bg-secondary);",
        "  border-radius: var(--radius-lg);",
        "  padding: 30px;",
        "  text-align: center;",
        "  border: 1px solid var(--border);",
        "}",
        "",
        ".result-box h3 {",
        "  color: var(--text-secondary);",
        "  margin-bottom: 15px;",
        "  text-transform: uppercase;",
        "  font-size: 0.9rem;",
        "}",
        "",
        ".result-box h2 { color: var(--accent); font-size: 3rem; margin-bottom: 10px; }",
        "",
        ".result-box p { color: var(--success); font-size: 1rem; }",
        "",
        ".bmi-guide {",
        "  display: grid;",
        "  grid-template-columns: repeat(4, 1fr);",
        "  gap: 15px;",
        "}",
        "",
        ".guide {",
        "  background: var(--bg-secondary);",
        "  border-radius: var(--radius-md);",
        "  padding: 20px;",
        "  text-align: center;",
        "  border: 1px solid var(--border);",
        "}",
        "",
        ".guide h4 { color: var(--text-primary); margin-bottom: 10px; }",
        "",
        ".guide p { color: var(--text-secondary); }",
        "",
        "@media (max-width: 768px) {",
        "  .container { padding: 25px; }",
        "  .header h1 { font-size: 2.2rem; }",
        "  .input-section { grid-template-columns: 1fr; }",
        "  .result-card { grid-template-columns: 1fr; }",
        "  .bmi-guide { grid-template-columns: repeat(2, 1fr); }",
        "}",
        "",
        "@media (max-width: 500px) {",
        "  body { padding: 15px; }",
        "  .container { padding: 20px; }",
        "  .header h1 { font-size: 1.8rem; }",
        "  .input-card { padding: 20px; }",
        "  .input-box input { font-size: 1.1rem; }",
        "  .result-box h2 { font-size: 2.3rem; }",
        "  .bmi-guide { grid-template-columns: 1fr; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the UI — weight (#weight) and height (#height) inputs,",
        "//   a Calculate button (#calculateBtn) and result boxes (#bmiValue, #category)",
        "//   style.css is complete — the layout and colors are done for you",
        "",
        "// Step 2: Get the user inputs",
        "//   Select the weight and height inputs, then read their values with .value",
        "",
        "// Step 3: Calculate BMI",
        "//   Convert the values to numbers, then compute BMI = weight / (height * height)",
        "",
        "// Step 4: Determine the BMI category",
        "//   Compare the BMI against the ranges (18.5, 24.9, 29.9) with if / else if",
        "",
        "// Step 5: Display the result",
        "//   Write the BMI value (toFixed(2)) and the category into #bmiValue and #category",
        "",
        "// Step 6: Final touch & test",
        "//   Validate the inputs (reject 0 or empty values), then test different",
        "//   height and weight combinations"
      ].join("\n")
    }
  },
  "calculator": {
    slug: "calculator",
    folder: "calculator",
    title: "Calculator",
    difficulty: "Beginner",
    time: "30 min",
    category: "Core JS",
    tags: ["DOM", "Events", "Calculations"],
    intro: "Build a functional calculator using JavaScript that performs basic arithmetic operations and dynamically displays the result. You'll work with DOM manipulation, event handling, expressions, operators, and input validation.",
    previewNote: "You'll build a working calculator with a live display and buttons for digits, operators and actions. Start with the starter files, then wire up the JavaScript step by step — every button updates the calculation on the screen.",
    cover: "../../assets/project-covers/calculator.png",
    previewUrl: "../../../JS%20PROJECTS/calculator/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Use textContent to update the calculator display.",
      "Handle number and operator buttons separately.",
      "Keep the current expression organized.",
      "Validate the expression before calculating.",
      "Handle invalid operations such as division by zero.",
      "Test decimals and different operator combinations."
    ],
    concepts: [
      "DOM selection and manipulation",
      "Event handling",
      "Working with expressions",
      "Operators and calculations",
      "String and number conversion",
      "Input validation"
    ],
    challenge: "Extra challenge: add keyboard support so you can type numbers and operators, or keep a history of your past calculations.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the calculator HTML structure and starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the display (#expression and #result) and the calculator buttons.",
          "Open style.css — the layout and colors are already styled for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see a static calculator showing 0."
        ],
        logicCode: [
          "// 1. index.html — find the display (#expression, #result) and the calculator buttons",
          "// 2. style.css — layout and colors are already styled for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see a static calculator showing 0"
        ],
        think: "Which element IDs and button classes in index.html will your JavaScript need to select?",
        hints: [
          "The display uses id=\"expression\" (the expression line) and id=\"result\" (the big number).",
          "Every key is a <button class=\"btn\"> — numbers, operators, AC, ±, . and = are all there.",
          "You'll only write JavaScript in this project — the HTML and CSS are done."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const resultEl = document.getElementById('result')." }
          ]
        }
      },
      {
        title: "Select Calculator Elements",
        tagline: "Select the display, number buttons, operators, and action buttons.",
        goal: "Select the display and the buttons so your script can read and update them.",
        logic: [
          "Grab the display elements (#expression and #result).",
          "Grab every button with querySelectorAll('.btn').",
          "Loop over the buttons and attach a click listener to each one."
        ],
        logicCode: [
          "// 1. Grab the display elements",
          "const expressionEl = document.getElementById('expression');",
          "const resultEl = document.getElementById('result');",
          "",
          "// 2. Grab every button",
          "const buttons = document.querySelectorAll('.btn');",
          "",
          "// 3. Attach a click listener to each one",
          "buttons.forEach((button) => {",
          "  button.addEventListener('click', () => {",
          "    // decide what to do based on the button",
          "  });",
          "});"
        ],
        think: "Why is it better to select elements once at the top of the file instead of re-querying them on every click?",
        hints: [
          "Use document.getElementById('result') for the display and document.querySelectorAll('.btn') for the keys.",
          "Give the display elements their own variables — e.g. expressionEl and resultEl.",
          "Inside the click handler, button.textContent tells you which key was pressed."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)\\s*\\([^)]*[\"'](result|expression)[\"']", hint: "Select the display — e.g. const resultEl = document.getElementById('result');" },
            { pattern: "querySelectorAll\\s*\\([^)]*[\"']\\.btn[\"']", hint: "Select every button: const buttons = document.querySelectorAll('.btn');" },
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Attach click listeners to the buttons — e.g. button.addEventListener('click', () => { ... })." }
          ]
        }
      },
      {
        title: "Handle Number & Decimal Input",
        tagline: "Display numbers and decimal values when the user interacts with the calculator.",
        goal: "Make number keys append their digit to the display, and the decimal key add a . only once per number.",
        logic: [
          "Read the pressed key with button.textContent.",
          "If the key is a number (0–9), append its digit to the current entry.",
          "If the key is '.', add a decimal point — but only when the current number doesn't already have one.",
          "Update the display with textContent."
        ],
        logicCode: [
          "// 1. Read the pressed key",
          "const value = button.textContent;",
          "",
          "// 2. Number keys — append the digit",
          "if (!isNaN(value) && value !== '.') {",
          "  current += value;",
          "  resultEl.textContent = current;",
          "}",
          "",
          "// 3. Decimal key — only one '.' per number",
          "if (value === '.' && !current.includes('.')) {",
          "  current += '.';",
          "  resultEl.textContent = current;",
          "}"
        ],
        think: "button.textContent is a string — how can you tell a digit like '7' from an operator like '+'?",
        hints: [
          "isNaN('7') is false and isNaN('+') is true — an easy way to tell numbers from operators.",
          "Check current.includes('.') before adding another decimal point.",
          "Keep a variable (like current) that holds the number being typed."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks on every button: button.addEventListener('click', () => { ... })." },
            { pattern: "(textContent|innerText)\\s*=", hint: "Update the display with the new value — e.g. resultEl.textContent = current;" },
            { pattern: "(isNaN|parseFloat|Number\\s*\\()", hint: "Detect number keys — e.g. if (!isNaN(button.textContent)) { ... }." },
            { pattern: "(includes\\s*\\(\\s*[\"']\\.|indexOf\\s*\\(\\s*[\"']\\.)", hint: "Prevent double decimals — e.g. if (!current.includes('.')) { current += '.'; }." }
          ]
        }
      },
      {
        title: "Handle Operators",
        tagline: "Implement +, −, ×, ÷ and % operations.",
        goal: "Make the operator keys (+ − × ÷ %) record which operation is pending and which number comes next.",
        logic: [
          "Keep the calculation parts in variables — a first number, an operator, and a second number.",
          "When an operator key is pressed, save the operator.",
          "When a number is pressed after an operator, it belongs to the second number.",
          "If an operator is pressed twice in a row, replace the pending operator."
        ],
        logicCode: [
          "// 1. Keep the parts of the calculation in variables",
          "let firstNumber = '';",
          "let operator = '';",
          "let secondNumber = '';",
          "",
          "// 2. Operator keys — record the pending operation",
          "if (value === '+' || value === '−' || value === '×' || value === '÷' || value === '%') {",
          "  operator = value;",
          "}",
          "",
          "// 3. Number keys — append to the right part",
          "if (!isNaN(value) && value !== '.') {",
          "  if (operator) secondNumber += value;",
          "  else firstNumber += value;",
          "}"
        ],
        think: "Why do you need three variables instead of one to handle an operation like 12 + 7?",
        hints: [
          "Keep three strings: firstNumber, operator and secondNumber.",
          "Append digits to secondNumber while an operator is pending, otherwise to firstNumber.",
          "The operator keys are +, −, ×, ÷ and % — compare button.textContent to find them."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks on every button." },
            { pattern: "textContent\\s*===?\\s*[\"']", hint: "Compare the pressed key to the operator symbols — e.g. if (button.textContent === '+') { operator = value; }." },
            { pattern: "[+−×÷%]", hint: "Handle all five operators — +, −, ×, ÷ and %." }
          ]
        }
      },
      {
        title: "Calculate & Display Result",
        tagline: "Process the expression and display the correct result.",
        goal: "Evaluate the two numbers with the chosen operator and write the answer to the display.",
        logic: [
          "Read the stored first number, operator and second number.",
          "Convert the strings to numbers with parseFloat().",
          "Apply the operation: + adds, − subtracts, × multiplies, ÷ divides and % takes a percentage.",
          "Write the result to the display with textContent."
        ],
        logicCode: [
          "// 1. Convert the stored strings to numbers",
          "const a = parseFloat(firstNumber);",
          "const b = parseFloat(secondNumber);",
          "",
          "// 2. Apply the operation",
          "let result;",
          "if (operator === '+') result = a + b;",
          "else if (operator === '−') result = a - b;",
          "else if (operator === '×') result = a * b;",
          "else if (operator === '÷') result = a / b;",
          "else if (operator === '%') result = (a / 100) * b;",
          "",
          "// 3. Display the result",
          "resultEl.textContent = result;"
        ],
        think: "What does parseFloat('12') return — and why is converting the strings important?",
        hints: [
          "parseFloat(firstNumber) and parseFloat(secondNumber) turn the stored strings into real numbers.",
          "Use if / else if (or a switch) to pick the operation from operator.",
          "Write the answer with resultEl.textContent = result;"
        ],
        check: {
          requires: [
            { pattern: "(parseFloat|Number\\s*\\()", hint: "Convert the stored strings to numbers — e.g. const a = parseFloat(firstNumber);" },
            { pattern: "\\b(if|else|switch)\\b", hint: "Use if / else if (or a switch) to apply the chosen operator." },
            { pattern: "=.*[+\\-*/%]|result\\s*=|answer\\s*=", hint: "Apply the operation and store the result — e.g. result = a + b; or result = a * b;" },
            { pattern: "(textContent|innerText)\\s*=", hint: "Write the result to the display — e.g. resultEl.textContent = result;" }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Validate inputs, handle edge cases and test your project.",
        goal: "Guard against invalid input and division by zero, then test the calculator thoroughly.",
        logic: [
          "Before calculating, make sure the expression is complete and the numbers are valid.",
          "If dividing by zero, show 'Error' instead of Infinity.",
          "Round the result so long decimals don't overflow the display.",
          "Test decimals, negatives (with ±) and different operator combinations."
        ],
        logicCode: [
          "// 1. Validate before calculating",
          "if (isNaN(a) || isNaN(b)) {",
          "  resultEl.textContent = 'Error';",
          "  return;",
          "}",
          "",
          "// 2. Division by zero → show Error",
          "if (operator === '÷' && b === 0) {",
          "  resultEl.textContent = 'Error';",
          "  return;",
          "}",
          "",
          "// 3. Round the result to avoid floating-point noise",
          "resultEl.textContent = Math.round(result * 1e10) / 1e10;",
          "",
          "// 4. Test different calculations and edge cases",
          "//    12 + 7 → 19      9 ÷ 0 → Error",
          "//    0.1 + 0.2 → 0.3  50 % 10 → 5"
        ],
        think: "What does 9 ÷ 0 give you in JavaScript — and how can you turn that into a friendly message?",
        hints: [
          "9 / 0 returns Infinity — check b === 0 (or isFinite(result)) and show 'Error' instead.",
          "Round the result so 0.1 + 0.2 doesn't display 0.30000000000000004.",
          "Test with ±: type 5, press ± to get -5, then add 3 → -2."
        ],
        check: {
          requires: [
            { pattern: "(isNaN|===|!==|isFinite|Infinity)", hint: "Validate the inputs before calculating — e.g. if (isNaN(a) || isNaN(b)) { resultEl.textContent = 'Error'; }." },
            { pattern: "[\"']Error[\"']|isFinite|Infinity", hint: "Handle division by zero — check b === 0 and show 'Error' instead of Infinity." },
            { pattern: "(Math\\.round|toFixed|toPrecision)", hint: "Round the result — e.g. Math.round(result * 1e10) / 1e10." },
            { pattern: "(textContent|innerText)\\s*=", hint: "Display the result — e.g. resultEl.textContent = result;" }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Calculator</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="calculator">',
        '        <div class="display">',
        '            <div id="expression" class="expression"></div>',
        '            <div id="result" class="result">0</div>',
        "        </div>",
        '        <div class="buttons">',
        '            <button class="btn clear">AC</button>',
        '            <button class="btn sign">±</button>',
        '            <button class="btn operator">%</button>',
        '            <button class="btn operator">÷</button>',
        '            <button class="btn number">7</button>',
        '            <button class="btn number">8</button>',
        '            <button class="btn number">9</button>',
        '            <button class="btn operator">×</button>',
        '            <button class="btn number">4</button>',
        '            <button class="btn number">5</button>',
        '            <button class="btn number">6</button>',
        '            <button class="btn operator">−</button>',
        '            <button class="btn number">1</button>',
        '            <button class="btn number">2</button>',
        '            <button class="btn number">3</button>',
        '            <button class="btn operator">+</button>',
        '            <button class="btn number zero">0</button>',
        '            <button class="btn decimal">.</button>',
        '            <button class="btn equal">=</button>',
        "        </div>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        ":root {",
        "  --bg-primary: #FFFFFF;",
        "  --bg-secondary: #F9FAFB;",
        "  --bg-tertiary: #F3F4F6;",
        "  --text-primary: #111827;",
        "  --text-secondary: #6B7280;",
        "  --text-tertiary: #9CA3AF;",
        "  --accent: #2563EB;",
        "  --accent-hover: #1D4ED8;",
        "  --danger: #EF4444;",
        "  --border: #E5E7EB;",
        "  --radius-md: 12px;",
        "  --radius-lg: 16px;",
        "  --radius-2xl: 24px;",
        "  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);",
        "  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);",
        "  --font-body: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  display: flex;",
        "  flex-direction: column;",
        "  background: var(--bg-secondary);",
        "  padding: 30px;",
        "  font-family: var(--font-body);",
        "  color: var(--text-primary);",
        "}",
        "",
        ".main-wrapper {",
        "  flex: 1;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  padding: 20px 0;",
        "}",
        "",
        ".calculator {",
        "  width: min(95vw, 400px);",
        "  background: var(--bg-primary);",
        "  border-radius: var(--radius-2xl);",
        "  padding: 24px;",
        "  border: 1px solid var(--border);",
        "  box-shadow: var(--shadow-xl);",
        "}",
        "",
        ".display {",
        "  background: var(--bg-secondary);",
        "  border-radius: var(--radius-lg);",
        "  height: 140px;",
        "  padding: 20px;",
        "  display: flex;",
        "  flex-direction: column;",
        "  justify-content: space-between;",
        "  margin-bottom: 20px;",
        "  border: 1px solid var(--border);",
        "}",
        "",
        ".expression {",
        "  text-align: right;",
        "  color: var(--text-secondary);",
        "  font-size: 1.15rem;",
        "  min-height: 24px;",
        "  word-break: break-all;",
        "}",
        "",
        ".result {",
        "  text-align: right;",
        "  color: var(--text-primary);",
        "  font-size: 3.2rem;",
        "  font-weight: 600;",
        "  white-space: nowrap;",
        "  overflow-x: auto;",
        "  overflow-y: hidden;",
        "  scrollbar-width: none;",
        "}",
        "",
        ".result::-webkit-scrollbar { display: none; }",
        "",
        ".buttons {",
        "  display: grid;",
        "  grid-template-columns: repeat(4, 1fr);",
        "  gap: 14px;",
        "}",
        "",
        ".btn {",
        "  height: 76px;",
        "  border: none;",
        "  border-radius: var(--radius-lg);",
        "  background: var(--bg-tertiary);",
        "  color: var(--text-primary);",
        "  font-size: 1.7rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "  transition: all var(--transition-fast);",
        "  font-family: var(--font-body);",
        "}",
        "",
        ".btn:hover {",
        "  background: var(--border);",
        "  transform: translateY(-2px);",
        "}",
        "",
        ".btn:active { transform: scale(0.96); }",
        "",
        ".operator, .equal {",
        "  background: var(--accent);",
        "  color: #fff;",
        "}",
        "",
        ".operator:hover, .equal:hover {",
        "  background: var(--accent-hover);",
        "}",
        "",
        ".clear {",
        "  background: var(--danger);",
        "  color: #fff;",
        "}",
        "",
        ".clear:hover { filter: brightness(1.05); }",
        "",
        ".zero { grid-column: span 2; }",
        "",
        "@media (max-width: 600px) {",
        "  .calculator { width: 100%; padding: 18px; }",
        "  .display { height: 120px; }",
        "  .result { font-size: 2.8rem; }",
        "  .btn { height: 66px; font-size: 1.5rem; }",
        "}",
        "",
        "@media (max-width: 420px) {",
        "  .buttons { gap: 10px; }",
        "  .btn { height: 58px; font-size: 1.3rem; }",
        "  .result { font-size: 2.4rem; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the calculator UI — a display (#expression, #result) and",
        "//   buttons for numbers, operators, AC, ±, . and =",
        "//   style.css is complete — the layout and colors are done for you",
        "",
        "// Step 2: Select the elements",
        "//   Grab #expression and #result with document.getElementById(),",
        "//   and every button with document.querySelectorAll('.btn')",
        "",
        "// Step 3: Handle number & decimal input",
        "//   Listen for clicks on every button, append digits to the current entry,",
        "//   and add '.' only once per number (check current.includes('.'))",
        "",
        "// Step 4: Handle operators",
        "//   Keep three variables — firstNumber, operator, secondNumber.",
        "//   Record the operator when +, −, ×, ÷ or % is pressed",
        "",
        "// Step 5: Calculate & display the result",
        "//   Convert the strings with parseFloat(), apply the operation, and write",
        "//   the answer to the display with textContent",
        "",
        "// Step 6: Final touch & test",
        "//   Handle division by zero (show 'Error'), round the result, and test",
        "//   decimals, negatives (with ±) and different operator combinations"
      ].join("\n")
    }
  },

  "character-count": {
    slug: "character-count",
    folder: "Character-Counter",
    title: "Character Counter",
    difficulty: "Beginner",
    time: "30 min",
    category: "Core JS",
    tags: ["DOM", "Text", "Events"],
    intro: "Build a live character counter that updates as you type. You'll read textarea input in real time, count characters, and show the user how many characters they have left.",
    previewNote: "You'll build a working character counter with a text area, a live character count and a remaining-count warning as you approach the 200-character limit. Start with the starter files, then wire up the JavaScript step by step.",
    cover: "../../assets/project-covers/character-count.png",
    previewUrl: "../../../JS%20PROJECTS/character%20count/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Listen to the input event to react as the user types.",
      "textarea.value gives you the text — .length counts its characters.",
      "Update the UI every time the text changes, not once.",
      "Subtract the current length from the max to show what's left."
    ],
    concepts: [
      "DOM selection (getElementById)",
      "The input event",
      "Reading textarea values with .value",
      "String length & basic math",
      "Updating the UI with textContent / innerText",
      "Conditional logic for warnings"
    ],
    challenge: "Extra challenge: count words too, or turn the whole counter box red when the limit is reached.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the textarea (#text-input) and the two counters (#char-count, #remaining-count).",
          "Open style.css — the layout and colors are already styled for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see a static counter."
        ],
        logicCode: [
          "// 1. index.html — find the textarea (#text-input) and the counters (#char-count, #remaining-count)",
          "// 2. style.css — layout and colors are already styled for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see a static counter"
        ],
        think: "Which element IDs will your JavaScript need to select?",
        hints: [
          "The textarea has id=\"text-input\" — the counters are id=\"char-count\" and id=\"remaining-count\".",
          "You'll only write JavaScript in this project — the HTML and CSS are done.",
          "The max limit is 200 characters."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)", hint: "Select elements with document.getElementById() — e.g. const textElement = document.getElementById('text-input')." }
          ]
        }
      },
      {
        title: "Select the Elements",
        tagline: "Grab the textarea and both counters.",
        goal: "Select the textarea and the two counter spans so your script can read and update them.",
        logic: [
          "Grab the textarea (#text-input).",
          "Grab the character count (#char-count).",
          "Grab the remaining count (#remaining-count).",
          "Store each element in a variable."
        ],
        logicCode: [
          "// 1. Grab the textarea",
          "const textElement = document.getElementById('text-input');",
          "",
          "// 2. Grab the character count",
          "const charElement = document.getElementById('char-count');",
          "",
          "// 3. Grab the remaining count",
          "const remainingElement = document.getElementById('remaining-count');"
        ],
        think: "Why is it better to store elements in variables instead of re-querying the document every time?",
        hints: [
          "Grab elements once at the top of the file.",
          "document.getElementById('char-count') returns the element with that id.",
          "Name your variables clearly, e.g. textElement, charElement, remainingElement."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*text-input", hint: "Select the textarea: const textElement = document.getElementById('text-input');" },
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*char-count", hint: "Select the character count: const charElement = document.getElementById('char-count');" },
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*remaining-count", hint: "Select the remaining count: const remainingElement = document.getElementById('remaining-count');" }
          ]
        }
      },
      {
        title: "Listen for Typing",
        tagline: "React to input in real time.",
        goal: "Attach an input event listener to the textarea so your code runs every time the user types.",
        logic: [
          "Listen for the input event on the textarea.",
          "Write a callback that runs on every keystroke.",
          "Inside the callback, read the current text."
        ],
        logicCode: [
          "// 1. Listen for the input event on the textarea",
          "textElement.addEventListener('input', () => {",
          "  // 2. Read the current text",
          "  const currentLength = textElement.value.length;",
          "});"
        ],
        think: "What's the difference between the input event and a click event?",
        hints: [
          "addEventListener('input', callback) fires whenever the value changes.",
          "Inside the callback you can read textElement.value.",
          "Put all your update logic inside this callback."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']input", hint: "Attach an input listener to the textarea: textElement.addEventListener('input', () => { ... })." },
            { pattern: "\\.value", hint: "Read the current text with .value — e.g. textElement.value.length." }
          ]
        }
      },
      {
        title: "Update the Counters",
        tagline: "Show characters typed and characters left.",
        goal: "Write the current length into the character counter and the remaining characters into the remaining counter.",
        logic: [
          "Read the current length with .value.length.",
          "Write it into #char-count.",
          "Subtract it from the max (200).",
          "Write the remainder into #remaining-count."
        ],
        logicCode: [
          "// 1. Read the current length",
          "const currentLength = textElement.value.length;",
          "",
          "// 2. Write it into #char-count",
          "charElement.innerText = currentLength;",
          "",
          "// 3. Subtract it from the max (200)",
          "const remaining = 200 - currentLength;",
          "",
          "// 4. Write the remainder into #remaining-count",
          "remainingElement.innerText = remaining;"
        ],
        think: "What should the remaining count show when the user has typed 25 characters?",
        hints: [
          "textElement.value.length counts every character typed.",
          "element.innerText = value replaces the element's text.",
          "200 - currentLength gives the characters left."
        ],
        check: {
          requires: [
            { pattern: "(innerText|textContent)\\s*=|\\.textContent\\s*=", hint: "Write values into the counters — e.g. charElement.innerText = currentLength;" },
            { pattern: "200\\s*-|\\bMAX|\\d+\\s*-\\s*currentLength|length\\s*[-+]\\s*\\d+", hint: "Compute the remaining characters, e.g. const remaining = 200 - currentLength;" },
            { pattern: "\\.value", hint: "Read the typed text with textElement.value.length." }
          ]
        }
      },
      {
        title: "Add a Limit Warning",
        tagline: "Warn when the user is close to the limit.",
        goal: "Turn the remaining count red as the user approaches the 200-character limit.",
        logic: [
          "Compare the current length against the max.",
          "Change the remaining counter's color when the limit is near.",
          "Optionally stop input at the limit."
        ],
        logicCode: [
          "// 1. Compare the current length against the max",
          "if (currentLength > 180) {",
          "  // 2. Turn the remaining counter red",
          "  remainingElement.style.color = 'red';",
          "} else {",
          "  remainingElement.style.color = 'green';",
          "}"
        ],
        think: "What happens if the user keeps typing past 200 characters?",
        hints: [
          "Use if / else with the current length.",
          "element.style.color changes an element's CSS color.",
          "To hard-stop, slice the value: textElement.value.slice(0, 200)."
        ],
        check: {
          requires: [
            { pattern: "\\b(if|else|>=|>|===|==)\\b", hint: "Compare the length against the limit with an if statement." },
            { pattern: "style\\.color", hint: "Change the warning color with element.style.color = 'red'." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Test and polish your project.",
        goal: "Test the counter, check edge cases and make sure everything updates smoothly.",
        logic: [
          "Open the page and type — does the count go up in real time?",
          "Type more than 200 characters — what happens?",
          "Use console.log() to debug anything unexpected.",
          "Resize the window — the card should stay centered and readable."
        ],
        logicCode: [
          "// 1. Open the page and type — does the count go up in real time?",
          "// 2. Type more than 200 characters — what happens?",
          "// 3. Debug anything unexpected",
          "console.log(textElement.value.length);",
          "",
          "// 4. Resize the window — the card should stay centered and readable"
        ],
        think: "What does the remaining count show when the text is exactly 200 characters?",
        hints: [
          "Type, delete, paste — the counters should always match the text.",
          "console.log() prints values to the browser console (F12).",
          "If nothing updates, check the element ids and that the listener is attached."
        ],
        check: {
          requires: [
            { pattern: "\\.value", hint: "Read the text with textElement.value.length." },
            { pattern: "addEventListener\\s*\\(\\s*[\"']input", hint: "Keep the counters live with an input listener." },
            { pattern: "(innerText|textContent)\\s*=", hint: "Write the numbers into the counters with innerText / textContent." },
            { pattern: "style\\.color|\\bif\\b", hint: "Warn when the limit is close by changing the color (or guarding with if)." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Character Counter</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        "      <h1>Character Counter</h1>",
        '      <textarea id="text-input" placeholder="Start typing here..."></textarea>',
        '      <div class="counter-box">',
        '        <div>Characters: <span id="char-count">0</span></div>',
        '        <div>Remaining: <span id="remaining-count">200</span></div>',
        "      </div>",
        "    </div>",
        "  </main>",
        '  <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  padding: 24px;",
        "  background: #f9fafb;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".container {",
        "  width: 100%;",
        "  max-width: 560px;",
        "  padding: 35px;",
        "  text-align: center;",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 20px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        "h1 { color: #111827; margin-bottom: 20px; }",
        "",
        "textarea {",
        "  width: 100%;",
        "  min-height: 160px;",
        "  padding: 16px;",
        "  font-size: 1rem;",
        "  font-family: inherit;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 12px;",
        "  outline: none;",
        "  resize: vertical;",
        "}",
        "",
        "textarea:focus { border-color: #2563eb; }",
        "",
        ".counter-box {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  gap: 12px;",
        "  margin-top: 16px;",
        "  padding: 14px 18px;",
        "  background: #f3f4f6;",
        "  border-radius: 12px;",
        "  color: #6b7280;",
        "  font-weight: 600;",
        "}",
        "",
        ".counter-box span { color: #2563eb; }",
        "",
        "@media (max-width: 480px) {",
        "  .container { padding: 22px; }",
        "  .counter-box { flex-direction: column; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   #text-input is the textarea; #char-count and #remaining-count show the live numbers",
        "//   style.css is complete — the layout and colors are done for you",
        "",
        "// Step 2: Select the elements",
        "//   Grab #text-input, #char-count and #remaining-count with document.getElementById()",
        "",
        "// Step 3: Listen for typing",
        "//   Attach an 'input' event listener to the textarea so it updates as the user types",
        "",
        "// Step 4: Update the counters",
        "//   Read textarea.value.length, write it into #char-count,",
        "//   and write 200 - length into #remaining-count",
        "",
        "// Step 5: Add a limit warning",
        "//   Turn the remaining count red as the user gets close to (or hits) the 200-char limit",
        "",
        "// Step 6: Final touch & test",
        "//   Open the page, type some text, and confirm both counters update in real time"
      ].join("\n")
    }
  },

  "color-changer": {
    slug: "color-changer",
    folder: "Color-Changer",
    title: "Color Changer",
    difficulty: "Beginner",
    time: "30 min",
    category: "Core JS",
    tags: ["DOM", "Events", "Arrays"],
    intro: "Build a color changer that swaps the page background and shows the current color name. You'll work with button clicks, arrays, the modulo operator and styling elements from JavaScript.",
    previewNote: "You'll build a working color changer with a button that cycles through a palette and a label that shows the current color. Start with the starter files, then wire up the JavaScript step by step.",
    cover: "../../assets/project-covers/color-changer.png",
    previewUrl: "../../../JS%20PROJECTS/color%20changer/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Keep your palette in an array so it's easy to extend.",
      "Use the modulo operator (%) to cycle back to the start.",
      "element.style.backgroundColor changes the background of any element.",
      "Update the label and the background in the same click."
    ],
    concepts: [
      "DOM selection (getElementById)",
      "Event handling (addEventListener)",
      "Arrays of colors",
      "The modulo operator for cycling",
      "Changing styles with element.style",
      "Updating text with innerText / textContent"
    ],
    challenge: "Extra challenge: generate a random hex color like #a1b2c3 on every click, or let the user pick from the palette.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the button (#change-color) and the color label (#color-name).",
          "Open style.css — the layout and colors are already styled for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see a static card."
        ],
        logicCode: [
          "// 1. index.html — find the button (#change-color) and the color label (#color-name)",
          "// 2. style.css — layout and colors are already styled for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see a static card"
        ],
        think: "Which two elements will your JavaScript need to update?",
        hints: [
          "The button has id=\"change-color\" — the label has id=\"color-name\".",
          "You'll only write JavaScript in this project — the HTML and CSS are done.",
          "The page background (document.body) is also updated from JS."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)", hint: "Select elements with document.getElementById() — e.g. const button = document.getElementById('change-color')." }
          ]
        }
      },
      {
        title: "Select Elements & Palette",
        tagline: "Grab the elements and define your colors.",
        goal: "Select the button and the label, then create an array of colors to cycle through.",
        logic: [
          "Grab the button (#change-color).",
          "Grab the label (#color-name).",
          "Create an array of colors.",
          "Create a counter variable to track the current index."
        ],
        logicCode: [
          "// 1. Grab the button",
          "const button = document.getElementById('change-color');",
          "",
          "// 2. Grab the label",
          "const label = document.getElementById('color-name');",
          "",
          "// 3. Create an array of colors",
          "const colors = ['red', 'blue', 'green', 'purple', 'orange'];",
          "",
          "// 4. Track the current index",
          "let index = 0;"
        ],
        think: "Why is an array a good fit for the palette?",
        hints: [
          "Grab elements once at the top of the file.",
          "colors[0] is the first color, colors[1] the second, and so on.",
          "A let variable lets you change which color is current."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*change-color", hint: "Select the button: const button = document.getElementById('change-color');" },
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*color-name", hint: "Select the label: const label = document.getElementById('color-name');" },
            { pattern: "\\[\"'[^\"']+\"'\"]|colors\\s*=\\s*\\[", hint: "Create an array of colors, e.g. const colors = ['red', 'blue', 'green'];" }
          ]
        }
      },
      {
        title: "Cycle Through Colors",
        tagline: "Move to the next color on every click.",
        goal: "Listen for clicks on the button and advance to the next color in the array.",
        logic: [
          "Listen for clicks on the button.",
          "Increase the index by 1.",
          "Wrap back to 0 when you pass the end of the array."
        ],
        logicCode: [
          "// 1. Listen for clicks on the button",
          "button.addEventListener('click', () => {",
          "  // 2. Increase the index by 1",
          "  index = (index + 1) % colors.length;",
          "});"
        ],
        think: "What does 5 % 3 equal — and how does that help you wrap around?",
        hints: [
          "addEventListener('click', ...) runs your code on every click.",
          "index + 1 moves to the next color.",
          "The modulo operator wraps the index: (index + 1) % colors.length."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks on the button: button.addEventListener('click', () => { ... })." },
            { pattern: "%\\s*colors\\.length|%\\s*\\d+|index\\s*=\\s*0", hint: "Wrap the index so it cycles, e.g. index = (index + 1) % colors.length;" }
          ]
        }
      },
      {
        title: "Update the Background",
        tagline: "Paint the page with the current color.",
        goal: "Apply the current color to the page background on every click.",
        logic: [
          "Read the current color from the array.",
          "Set the page background to that color.",
          "Update the label to show the color name."
        ],
        logicCode: [
          "// 1. Read the current color from the array",
          "const currentColor = colors[index];",
          "",
          "// 2. Set the page background",
          "document.body.style.backgroundColor = currentColor;",
          "",
          "// 3. Update the label",
          "label.innerText = currentColor.toUpperCase();"
        ],
        think: "Why do you need both the style change and the label update?",
        hints: [
          "document.body is the page itself.",
          "element.style.backgroundColor = 'red' paints that element.",
          "Show the name in the label so the user knows what color is on screen."
        ],
        check: {
          requires: [
            { pattern: "style\\.backgroundColor", hint: "Paint the page: document.body.style.backgroundColor = currentColor;" },
            { pattern: "(innerText|textContent)\\s*=", hint: "Show the color name: label.innerText = currentColor;" },
            { pattern: "colors\\s*\\[", hint: "Read the current color from the array, e.g. colors[index]." }
          ]
        }
      },
      {
        title: "Polish the Label",
        tagline: "Format the color name nicely.",
        goal: "Format the color name so it reads well on screen.",
        logic: [
          "Take the current color name.",
          "Convert it to uppercase.",
          "Write the formatted name into the label."
        ],
        logicCode: [
          "// 1. Take the current color name",
          "const currentColor = colors[index];",
          "",
          "// 2. Convert it to uppercase",
          "const name = currentColor.toUpperCase();",
          "",
          "// 3. Write the formatted name into the label",
          "label.innerText = name;"
        ],
        think: "What does 'blue'.toUpperCase() return?",
        hints: [
          "Strings have a .toUpperCase() method.",
          "Label text can be set with innerText or textContent.",
          "Do the formatting before writing into the label."
        ],
        check: {
          requires: [
            { pattern: "toUpperCase\\(\\)", hint: "Format the name: currentColor.toUpperCase()" },
            { pattern: "(innerText|textContent)\\s*=", hint: "Write the formatted name into the label." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Test and polish your project.",
        goal: "Test the cycling, check the label and make sure the app feels finished.",
        logic: [
          "Open the page and click the button several times.",
          "Confirm the color wraps back to the first one after the last.",
          "Use console.log() to debug anything unexpected.",
          "Resize the window — the card should stay centered and readable."
        ],
        logicCode: [
          "// 1. Open the page and click the button several times",
          "// 2. Confirm the color wraps back to the first one after the last",
          "// 3. Debug anything unexpected",
          "console.log(colors[index]);",
          "",
          "// 4. Resize the window — the card should stay centered and readable"
        ],
        think: "After the last color, what should the next click do — and why?",
        hints: [
          "Click through the whole palette and watch it loop.",
          "console.log(colors[index]) prints the current color (F12).",
          "If the background never changes, check the button id and the listener."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Keep the click listener wired to the button." },
            { pattern: "style\\.backgroundColor", hint: "Paint the background with document.body.style.backgroundColor." },
            { pattern: "%\\s*colors\\.length|%\\s*\\d+", hint: "Cycle through the palette with the modulo operator." },
            { pattern: "(innerText|textContent)\\s*=", hint: "Keep the label in sync with the current color." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Color Changer</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="card">',
        "        <h1>Color Changer</h1>",
        "        <p>Current Color</p>",
        '        <h2 id="color-name">#FFFFFF</h2>',
        '        <button id="change-color">Change Color</button>',
        "    </div>",
        "  </main>",
        '  <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  padding: 24px;",
        "  background: #ffffff;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "  transition: background 0.4s ease;",
        "}",
        "",
        ".card {",
        "  width: 100%;",
        "  max-width: 400px;",
        "  padding: 40px;",
        "  text-align: center;",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 20px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".card h1 { color: #111827; margin-bottom: 12px; }",
        ".card p { color: #6b7280; margin-bottom: 8px; }",
        "",
        "#color-name {",
        "  color: #2563eb;",
        "  font-size: 2.2rem;",
        "  margin-bottom: 24px;",
        "}",
        "",
        "#change-color {",
        "  border: none;",
        "  padding: 14px 28px;",
        "  border-radius: 10px;",
        "  background: #2563eb;",
        "  color: #fff;",
        "  font-size: 1rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        "#change-color:hover { background: #1d4ed8; }",
        "",
        "@media (max-width: 480px) {",
        "  .card { padding: 28px 20px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   The button (#change-color) and the color label (#color-name) are already in index.html",
        "//   style.css is complete — the layout and colors are done for you",
        "",
        "// Step 2: Select the elements & palette",
        "//   Grab #change-color and #color-name, then build an array of colors to cycle through",
        "",
        "// Step 3: Cycle through colors",
        "//   On every click, advance the index — use the modulo operator to wrap around",
        "",
        "// Step 4: Update the background",
        "//   Set document.body.style.backgroundColor to the current color",
        "",
        "// Step 5: Polish the label",
        "//   Write the color name (formatted with toUpperCase()) into #color-name",
        "",
        "// Step 6: Final touch & test",
        "//   Click through the palette and confirm the background and label stay in sync"
      ].join("\n")
    }
  },

  "die-roller": {
    slug: "die-roller",
    folder: "die Roller",
    title: "Die Roller",
    difficulty: "Beginner",
    time: "30 min",
    category: "Games",
    tags: ["DOM", "Random", "Animation"],
    intro: "Roll a virtual six-sided die with a single click. JavaScript picks a random number from 1 to 6, shows it on the die face, and keeps your last five rolls in a history list. You'll use Math.random(), event listeners, arrays and on-the-fly element creation to bring the die to life.",
    previewNote: "You'll build a working die roller: a big die face, a Roll button and a Last Rolls history. Start with the starter files, then wire up the JavaScript step by step — every click generates a fresh roll, updates the die face and repaints the history.",
    cover: "../../assets/project-covers/die-roller.png",
    previewUrl: "../../../JS%20PROJECTS/die%20Roller/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Math.random() returns a number from 0 up to (but not including) 1 — multiply and round down to get a whole number.",
      "Math.floor(Math.random() * 6) + 1 is the classic formula for a 1–6 die roll.",
      "unshift() adds to the front of an array; pop() removes the oldest entry — together they keep the history capped at five.",
      "The die face is updated with innerText, while the history chips are built with createElement() and appendChild()."
    ],
    concepts: [
      "DOM selection (getElementById)",
      "Event handling (addEventListener)",
      "Math.random() & Math.floor()",
      "Arrays (unshift, pop, forEach)",
      "innerText vs textContent",
      "Creating elements (createElement, appendChild)"
    ],
    challenge: "Extra challenge: hook up the rollDice animation already waiting in style.css — add the rolling class to the die (value.classList.add('rolling')) before the number updates, then remove it after ~300ms so every roll spins the die.",
    steps: [
      {
        title: "Meet the Dice Roller",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and see how the die face, the Roll button and the history list fit together.",
        logic: [
          "Look at index.html — find the die face (#dice, it starts showing 4), the Roll button (#rollBtn) and the Last Rolls list (#historyList, five 0s).",
          "Open style.css — the big rounded die, the button and the history chips are already styled for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see a static die that does nothing yet."
        ],
        logicCode: [
          "// 1. index.html — the die face (#dice, starts at 4), the button (#rollBtn), the history (#historyList with five 0s)",
          "// 2. style.css — the die, button and history chips are already styled",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — the die is static: clicking Roll Dice does nothing yet"
        ],
        think: "A dice roller needs three things on screen: a die face, a button to roll it, and a place to record past rolls. Where is each one in index.html?",
        hints: [
          "The die face has id=\"dice\" and shows the number 4 to start.",
          "The button has id=\"rollBtn\" and the history list has id=\"historyList\".",
          "The history already shows five 0s — your JavaScript will replace them with real rolls."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)", hint: "Select elements with document.getElementById() — e.g. const rollBtn = document.getElementById('rollBtn')." }
          ]
        }
      },
      {
        title: "Grab the Elements",
        tagline: "Connect script.js to the page.",
        goal: "Select the Roll button, the die face and the history list, and set up an array to remember rolls.",
        logic: [
          "Grab the Roll button (#rollBtn).",
          "Grab the die face (#dice) and store it in a variable — the project calls it value, because it holds the number shown on the die.",
          "Create an empty array called history to remember every roll.",
          "Grab the history list (#historyList) — the project calls it historyElement, because it's the element that displays the history."
        ],
        logicCode: [
          "// 1. Grab the Roll button",
          "const rollBtn = document.getElementById(\"rollBtn\")",
          "",
          "// 2. Grab the die face — the number shown on the die",
          "const value = document.getElementById(\"dice\")",
          "",
          "// 3. Create an array to remember every roll",
          "const history = [];",
          "",
          "// 4. Grab the history list — where past rolls are displayed",
          "const historyElement = document.getElementById(\"historyList\");"
        ],
        think: "Why do we grab elements once at the top of the file instead of searching for them again on every click?",
        hints: [
          "Each element is found once by its id — rollBtn, dice and historyList — then reused from then on.",
          "The project's variable names are rollBtn, value, history and historyElement — each points at the element with that id.",
          "The empty history array is where every roll will be remembered."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*rollBtn", hint: "Select the button: const rollBtn = document.getElementById('rollBtn');" },
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*dice", hint: "Select the die face: const value = document.getElementById('dice');" },
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*historyList", hint: "Select the history list: const historyElement = document.getElementById('historyList');" },
            { pattern: "history\\s*=\\s*\\[", hint: "Create the history array: const history = [];" }
          ]
        }
      },
      {
        title: "Roll a Random Number",
        tagline: "Turn a click into a number from 1 to 6.",
        goal: "Make the Roll button listen for clicks and generate a random whole number between 1 and 6.",
        logic: [
          "Listen for clicks on the Roll button.",
          "Math.random() gives a decimal between 0 and just under 1.",
          "Multiply by 6 to spread it across a die — 0 to just under 6.",
          "Round down with Math.floor(), then add 1 so the range becomes 1–6."
        ],
        logicCode: [
          "// 1. Listen for clicks on the Roll button",
          "rollBtn.addEventListener(\"click\", () => {",
          "",
          "    // 2. Math.random() × 6 gives 0–5.99…, Math.floor() rounds it down to 0–5, then + 1 makes it 1–6",
          "    const answer = Math.floor(Math.random() * 6) + 1;",
          "})",
          "",
          "// 3. Next steps will show the roll and save it — for now, clicking does nothing visible yet"
        ],
        think: "What would happen if we forgot the + 1? Which numbers could the die show then?",
        hints: [
          "Math.random() never returns exactly 1 — it tops out just below it.",
          "Math.floor() always rounds down: Math.floor(0.9) is 0.",
          "Math.floor(Math.random() * 6) gives 0–5, so + 1 shifts the whole range up to 1–6."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks: rollBtn.addEventListener('click', () => { ... })." },
            { pattern: "Math\\.random", hint: "Generate randomness with Math.random()." },
            { pattern: "Math\\.floor|Math\\.ceil|Math\\.round", hint: "Round the result to a whole number with Math.floor()." },
            { pattern: "\\*\\s*6", hint: "Scale to a six-sided die: Math.random() * 6." },
            { pattern: "\\+\\s*1", hint: "Shift the range up by one: Math.floor(Math.random() * 6) + 1." }
          ]
        }
      },
      {
        title: "Show the Roll on the Die",
        tagline: "Update the die face.",
        goal: "Write the random number into the die face so the user actually sees the result of the roll.",
        logic: [
          "Take the number we just rolled.",
          "Put it into the die face with innerText.",
          "Refresh the page and roll a few times — the big number changes."
        ],
        logicCode: [
          "// 1. The roll from the previous step",
          "const answer = Math.floor(Math.random() * 6) + 1;",
          "",
          "// 2. Put it on the die face — value is the #dice element",
          "value.innerText = answer"
        ],
        think: "The die uses innerText, but the history chips use textContent. Both write text into an element — what do you think the difference is?",
        hints: [
          "value points to the element with id=\"dice\" — writing to it updates the big number on screen.",
          "innerText and textContent both replace an element's text; the project uses innerText here.",
          "Keep the assignment inside the click handler, right after the number is generated."
        ],
        check: {
          requires: [
            { pattern: "(innerText|textContent)\\s*=", hint: "Write the result into the die: value.innerText = answer" }
          ]
        }
      },
      {
        title: "Remember Every Roll",
        tagline: "Track the history with an array.",
        goal: "Save every roll into the history array and keep only the latest five.",
        logic: [
          "Add the new roll to the front of the history array with unshift().",
          "If the array grows past five rolls, remove the oldest one with pop().",
          "The array now always holds the last five rolls, newest first."
        ],
        logicCode: [
          "// 1. Add the newest roll to the front of the history",
          "history.unshift(answer)",
          "",
          "// 2. Keep only the latest five rolls",
          "if (history.length > 5) {",
          "    history.pop()",
          "}"
        ],
        think: "unshift() adds the newest roll to the front — why does that match the Last Rolls list, where the newest roll appears first?",
        hints: [
          "unshift() puts a value at the start of an array; pop() removes the value at the end.",
          "After adding, check history.length — if it's more than 5, the oldest roll (the last item) is dropped.",
          "The same array is used everywhere, so the display can always be rebuilt from it."
        ],
        check: {
          requires: [
            { pattern: "\\.unshift", hint: "Add the roll to the front: history.unshift(answer)" },
            { pattern: "\\.pop", hint: "Drop the oldest roll: history.pop()" },
            { pattern: "\\bif\\b\\s*\\(\\s*history\\.length", hint: "Guard with a length check: if (history.length > 5) { history.pop() }" }
          ]
        }
      },
      {
        title: "Paint the History on Screen",
        tagline: "Turn the array into visible rolls.",
        goal: "Clear the old list and create one span per roll so the page shows the current history.",
        logic: [
          "Wipe the history list clean with innerHTML = \"\".",
          "Loop over the history array with forEach().",
          "Create a fresh span for each roll, put the number in it, and append it to the list."
        ],
        logicCode: [
          "// 1. Clear the old list — otherwise old rolls would stay and pile up",
          "historyElement.innerHTML = \"\";",
          "",
          "// 2. Loop through the history array",
          "history.forEach((roll) => {",
          "    // 3. Create a span for this roll",
          "    const span = document.createElement(\"span\");",
          "    span.textContent = roll;",
          "    // 4. Add it to the history list",
          "    historyElement.appendChild(span);",
          "});"
        ],
        think: "Why do we clear the list before rebuilding it? What would the page show if the innerHTML = \"\" line were missing?",
        hints: [
          "Setting innerHTML to \"\" removes every child element of the history list.",
          "document.createElement(\"span\") makes a brand-new element that isn't on the page yet.",
          "parent.appendChild(child) attaches that element to the list — one span per roll."
        ],
        check: {
          requires: [
            { pattern: "innerHTML\\s*=\\s*[\"']\\s*[\"']", hint: "Clear the list first: historyElement.innerHTML = \"\";" },
            { pattern: "createElement", hint: "Create a span with document.createElement('span')." },
            { pattern: "appendChild", hint: "Add each roll with historyElement.appendChild(span)." },
            { pattern: "forEach|for\\s*\\(|for\\s*of", hint: "Loop over the history array." }
          ]
        }
      },
      {
        title: "Test, Polish & the Rolling Animation",
        tagline: "Roll it, break it, fix it.",
        goal: "Roll several times, confirm the history keeps only five rolls, and try the rollDice animation that's already in style.css.",
        logic: [
          "Open the page and roll six or more times.",
          "Confirm the history never shows more than five rolls, newest first.",
          "Use console.log(history) to debug anything unexpected.",
          "Resize the window — the card should stay centered and readable."
        ],
        logicCode: [
          "// 1. Open the page and roll six or more times",
          "// 2. The history should never show more than five rolls — newest first",
          "// 3. Debug anything unexpected",
          "console.log(history);",
          "",
          "// 4. Resize the window — the card should stay centered and readable"
        ],
        think: "After six rolls, how many numbers should appear in the history — and which roll falls off first?",
        hints: [
          "Roll more than five times and watch the oldest roll fall off the end.",
          "console.log(history) prints the array to the console (F12) — perfect for debugging.",
          "If the die never changes, check the rollBtn id and the click listener."
        ],
        check: {
          requires: [
            { pattern: "Math\\.random", hint: "Keep generating rolls with Math.random()." },
            { pattern: "(innerText|textContent)\\s*=", hint: "Keep writing the result into the die with value.innerText = answer." },
            { pattern: "\\.unshift", hint: "Keep tracking the history with history.unshift(answer)." },
            { pattern: "createElement|appendChild", hint: "Keep rendering the history with createElement / appendChild." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Dice Roller</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '<main class="main-wrapper"><div class="container">',
        '    <div class="card">',
        "        <h1>🎲 Dice Roller</h1>",
        '        <p class="subtitle">Roll the dice and test your luck!</p>',
        '        <div class="dice-area">',
        '            <div id="dice" class="dice">4</div>',
        "        </div>",
        '        <button id="rollBtn">🎲 Roll Dice</button>',
        '        <div class="history">',
        "            <h3>Last Rolls</h3>",
        '            <div id="historyList" class="history-list">',
        "                <span>0</span>",
        "                <span>0</span>",
        "                <span>0</span>",
        "                <span>0</span>",
        "                <span>0</span>",
        "            </div>",
        "        </div>",
        "    </div>",
        "</div></main>",
        '        <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "/* Self-contained version of the real style.css — the project pulls",
        "   these tokens from ../design-system.css; they're inlined here so the",
        "   sandboxed Run Code preview works offline. */",
        ":root {",
        "  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;",
        "  --bg-primary: #FFFFFF;",
        "  --bg-secondary: #F9FAFB;",
        "  --text-primary: #111827;",
        "  --text-secondary: #6B7280;",
        "  --accent: #2563EB;",
        "  --accent-hover: #1D4ED8;",
        "  --border: #E5E7EB;",
        "  --radius-md: 12px;",
        "  --radius-lg: 16px;",
        "  --radius-2xl: 24px;",
        "  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);",
        "  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);",
        "  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);",
        "  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);",
        "}",
        "",
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  display: flex;",
        "  flex-direction: column;",
        "  background: var(--bg-secondary);",
        "  padding: 30px;",
        "}",
        "",
        ".main-wrapper {",
        "  flex: 1;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  padding: 20px 0;",
        "}",
        "",
        ".container {",
        "  width: 100%;",
        "  max-width: 550px;",
        "}",
        "",
        ".card {",
        "  background: var(--bg-primary);",
        "  border: 1px solid var(--border);",
        "  border-radius: var(--radius-2xl);",
        "  padding: 40px;",
        "  text-align: center;",
        "  box-shadow: var(--shadow-xl);",
        "}",
        "",
        "h1 {",
        "  color: var(--text-primary);",
        "  font-size: 2.3rem;",
        "  margin-bottom: 10px;",
        "}",
        "",
        ".subtitle {",
        "  color: var(--text-secondary);",
        "  margin-bottom: 35px;",
        "}",
        "",
        ".dice-area {",
        "  display: flex;",
        "  justify-content: center;",
        "  margin-bottom: 35px;",
        "}",
        "",
        ".dice {",
        "  width: 180px;",
        "  height: 180px;",
        "  background: var(--bg-secondary);",
        "  border-radius: var(--radius-2xl);",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  font-size: 5rem;",
        "  font-weight: bold;",
        "  color: var(--text-primary);",
        "  border: 1px solid var(--border);",
        "  box-shadow: var(--shadow-lg);",
        "  transition: all var(--transition-base);",
        "}",
        "",
        ".dice.rolling {",
        "  animation: rollDice 0.3s ease;",
        "}",
        "",
        "@keyframes rollDice {",
        "  0% { transform: rotate(0deg) scale(1); }",
        "  50% { transform: rotate(180deg) scale(1.1); }",
        "  100% { transform: rotate(360deg) scale(1); }",
        "}",
        "",
        "button {",
        "  border: none;",
        "  cursor: pointer;",
        "  padding: 18px 40px;",
        "  border-radius: var(--radius-md);",
        "  color: white;",
        "  font-size: 1.2rem;",
        "  font-weight: 600;",
        "  background: var(--accent);",
        "  transition: all var(--transition-base);",
        "  width: 100%;",
        "  font-family: var(--font-body);",
        "}",
        "",
        "button:hover {",
        "  background: var(--accent-hover);",
        "  transform: translateY(-2px);",
        "  box-shadow: var(--shadow-md);",
        "}",
        "",
        "button:active { transform: scale(0.97); }",
        "",
        ".history {",
        "  margin-top: 35px;",
        "}",
        "",
        ".history h3 {",
        "  color: var(--text-secondary);",
        "  margin-bottom: 20px;",
        "  font-weight: 500;",
        "}",
        "",
        ".history-list {",
        "  display: flex;",
        "  gap: 15px;",
        "  justify-content: center;",
        "  flex-wrap: wrap;",
        "}",
        "",
        ".history-list span {",
        "  width: 60px;",
        "  height: 60px;",
        "  border-radius: var(--radius-lg);",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  color: var(--text-primary);",
        "  font-size: 1.3rem;",
        "  background: var(--bg-secondary);",
        "  border: 1px solid var(--border);",
        "  font-weight: 600;",
        "}",
        "",
        "@media(max-width:600px) {",
        "  .card { padding: 25px; }",
        "  .dice { width: 140px; height: 140px; font-size: 4rem; }",
        "  button { font-size: 1rem; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Meet the Dice Roller",
        "//   index.html holds the die face (#dice, starts at 4), the Roll button (#rollBtn)",
        "//   and the Last Rolls history (#historyList with five 0s) — style.css styles it all",
        "",
        "// Step 2: Grab the elements",
        "//   const rollBtn = document.getElementById(\"rollBtn\")",
        "//   const value = document.getElementById(\"dice\")",
        "//   const history = [];",
        "//   const historyElement = document.getElementById(\"historyList\");",
        "",
        "// Step 3: Roll a random number",
        "//   Listen for clicks, then const answer = Math.floor(Math.random() * 6) + 1;",
        "",
        "// Step 4: Show the roll on the die",
        "//   value.innerText = answer",
        "",
        "// Step 5: Remember every roll",
        "//   history.unshift(answer), then pop() when history.length is more than 5",
        "",
        "// Step 6: Paint the history on screen",
        "//   Clear historyElement.innerHTML, then createElement(\"span\") per roll and",
        "//   historyElement.appendChild(span) — one chip per roll",
        "",
        "// Step 7: Test & polish",
        "//   Roll six times — the history stays at five, newest first"
      ].join("\n")
    }
  },

  "numberguessinggame": {
    slug: "numberguessinggame",
    folder: "Number-Guessing-Game",
    title: "Number Guessing Game",
    difficulty: "Beginner",
    time: "45 min",
    category: "Games",
    tags: ["Random", "Logic", "DOM"],
    intro: "Build a number guessing game where the computer picks a secret number between 1 and 100 and you get hints — higher or lower — until you find it. You'll work with Math.random(), comparisons and game state.",
    previewNote: "You'll build a working guessing game with a secret number, an input, higher/lower hints, an attempts counter and a restart button. Start with the starter files, then wire up the JavaScript step by step.",
    cover: "../../assets/project-covers/numberguessinggame.png",
    previewUrl: "../../../JS%20PROJECTS/numberGuessingGame/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Generate the secret number once with Math.random(), then keep it in a variable.",
      "parseInt() converts the input string into a whole number.",
      "Compare the guess against the secret with < and > to give hints.",
      "Track attempts in a variable and update the display after every guess."
    ],
    concepts: [
      "Math.random() & Math.floor()",
      "Reading inputs (value, parseInt)",
      "Comparisons (===, <, >)",
      "Conditional logic (if / else if / else)",
      "Game state (secret, attempts, best score)",
      "Updating the UI with innerText"
    ],
    challenge: "Extra challenge: store the best score in localStorage so it survives a page refresh.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the guess input (#guessInput), the Guess button (#guessBtn), the stats (#attempts, #bestScore, #hint), the message (#messageText) and the restart button (#restartBtn).",
          "Open style.css — the layout and colors are already styled for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see a static game."
        ],
        logicCode: [
          "// 1. index.html — find #guessInput, #guessBtn, #attempts, #bestScore, #hint, #messageText and #restartBtn",
          "// 2. style.css — layout and colors are already styled for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see a static game"
        ],
        think: "Which elements will your JavaScript need to read and update?",
        hints: [
          "The input is id=\"guessInput\" — the button is id=\"guessBtn\".",
          "Attempts, best score and hint use the ids attempts, bestScore and hint.",
          "The message area is id=\"messageText\" — restart uses id=\"restartBtn\"."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)", hint: "Select elements with document.getElementById() — e.g. const guessBtn = document.getElementById('guessBtn')." }
          ]
        }
      },
      {
        title: "Select Elements & Secret Number",
        tagline: "Set up the game state.",
        goal: "Select all the elements you need and generate the secret number.",
        logic: [
          "Grab the input, button, stats and message elements.",
          "Generate a random secret number between 1 and 100.",
          "Create an attempts counter starting at 0."
        ],
        logicCode: [
          "// 1. Grab the elements",
          "const guessInput = document.getElementById('guessInput');",
          "const guessBtn = document.getElementById('guessBtn');",
          "const attemptsEl = document.getElementById('attempts');",
          "const hintEl = document.getElementById('hint');",
          "const messageEl = document.getElementById('messageText');",
          "",
          "// 2. Generate the secret number between 1 and 100",
          "let secretNumber = Math.floor(Math.random() * 100) + 1;",
          "",
          "// 3. Track attempts",
          "let attempts = 0;"
        ],
        think: "Why is the secret number generated once at the top instead of inside the click handler?",
        hints: [
          "Math.floor(Math.random() * 100) + 1 gives a number from 1 to 100.",
          "Select the elements once at the top of the file.",
          "let lets you change attempts later — const would not."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*guessBtn", hint: "Select the button: const guessBtn = document.getElementById('guessBtn');" },
            { pattern: "Math\\.random", hint: "Generate the secret with Math.random(): Math.floor(Math.random() * 100) + 1." },
            { pattern: "Math\\.floor", hint: "Round down with Math.floor()." },
            { pattern: "let\\s+attempts", hint: "Track attempts with a let variable, e.g. let attempts = 0;" }
          ]
        }
      },
      {
        title: "Read the Guess",
        tagline: "Get the number the player entered.",
        goal: "Listen for clicks on the Guess button and read the input as a number.",
        logic: [
          "Listen for clicks on the Guess button.",
          "Read the input value.",
          "Convert it to a whole number with parseInt().",
          "Reject invalid input."
        ],
        logicCode: [
          "// 1. Listen for clicks on the Guess button",
          "guessBtn.addEventListener('click', () => {",
          "  // 2. Read the input and convert it",
          "  const guess = parseInt(guessInput.value);",
          "",
          "  // 3. Reject invalid input",
          "  if (isNaN(guess)) {",
          "    messageEl.innerText = 'Enter a valid number!';",
          "    return;",
          "  }",
          "});"
        ],
        think: "What does parseInt('42') return — a string or a number?",
        hints: [
          "input.value is always a string, even for number inputs.",
          "parseInt(value) turns it into a whole number.",
          "isNaN(guess) is true when the conversion failed."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks on the Guess button." },
            { pattern: "parseInt|Number", hint: "Convert the input to a number with parseInt(value)." },
            { pattern: "isNaN|\\bif\\b", hint: "Guard against invalid input with isNaN or an if check." }
          ]
        }
      },
      {
        title: "Count Attempts",
        tagline: "Track how many guesses the player makes.",
        goal: "Increase the attempts counter and show it on screen after every guess.",
        logic: [
          "Increase attempts by 1 on each guess.",
          "Write the new count into the attempts display."
        ],
        logicCode: [
          "// 1. Increase attempts by 1",
          "attempts += 1;",
          "",
          "// 2. Write the new count into the display",
          "attemptsEl.innerText = attempts;"
        ],
        think: "Why must the display update inside the click handler?",
        hints: [
          "attempts += 1 is the same as attempts++.",
          "The display element has id=\"attempts\".",
          "Update the UI every time the state changes."
        ],
        check: {
          requires: [
            { pattern: "attempts\\s*(\\+\\+|\\+=)", hint: "Increase attempts: attempts += 1;" },
            { pattern: "(innerText|textContent)\\s*=", hint: "Show the count: attemptsEl.innerText = attempts;" }
          ]
        }
      },
      {
        title: "Compare the Guess",
        tagline: "Give higher or lower hints.",
        goal: "Compare the guess against the secret number and give the right hint.",
        logic: [
          "If the guess equals the secret — the player wins.",
          "Else if the guess is lower — say 'Higher'.",
          "Else — say 'Lower'."
        ],
        logicCode: [
          "// 1. If the guess equals the secret — the player wins",
          "if (guess === secretNumber) {",
          "  hintEl.innerText = 'Correct';",
          "  messageEl.innerText = 'You guessed it!';",
          "} else if (guess < secretNumber) {",
          "  // 2. Guess too low — say 'Higher'",
          "  hintEl.innerText = 'Higher';",
          "  messageEl.innerText = 'Try a higher number.';",
          "} else {",
          "  // 3. Guess too high — say 'Lower'",
          "  hintEl.innerText = 'Lower';",
          "  messageEl.innerText = 'Try a lower number.';",
          "}"
        ],
        think: "Why does order matter in an if / else if chain?",
        hints: [
          "=== compares value and type.",
          "Use < and > for the range hints.",
          "Only the first matching branch runs."
        ],
        check: {
          requires: [
            { pattern: "===|==", hint: "Check for a win with guess === secretNumber." },
            { pattern: "<\\s*secretNumber|>\\s*secretNumber|guess\\s*<|guess\\s*>", hint: "Compare the guess against the secret with < and >." },
            { pattern: "else\\s+if|else", hint: "Use if / else if / else for the three outcomes." }
          ]
        }
      },
      {
        title: "Handle the Win",
        tagline: "End the game when the player wins.",
        goal: "Show a win message, stop further guesses and remember the best score.",
        logic: [
          "Disable the Guess button when the player wins.",
          "Show the win message.",
          "Update the best score if this attempt count is better."
        ],
        logicCode: [
          "// 1. Disable the Guess button when the player wins",
          "guessBtn.disabled = true;",
          "",
          "// 2. Update the best score",
          "if (bestScore === 0 || attempts < bestScore) {",
          "  bestScore = attempts;",
          "  bestScoreEl.innerText = bestScore;",
          "}"
        ],
        think: "What should happen if the player never wins?",
        hints: [
          "button.disabled = true stops further clicks.",
          "Track bestScore in a variable, starting at 0.",
          "Only replace the best score when attempts is smaller."
        ],
        check: {
          requires: [
            { pattern: "disabled\\s*=", hint: "Disable the button: guessBtn.disabled = true;" },
            { pattern: "bestScore", hint: "Track and update a bestScore variable." }
          ]
        }
      },
      {
        title: "Restart the Game",
        tagline: "Reset everything for a new round.",
        goal: "Make the restart button reset the secret number, attempts and all displays.",
        logic: [
          "Listen for clicks on the restart button.",
          "Generate a new secret number.",
          "Reset attempts to 0.",
          "Clear the input and re-enable the Guess button."
        ],
        logicCode: [
          "// 1. Listen for clicks on the restart button",
          "restartBtn.addEventListener('click', () => {",
          "  // 2. Generate a new secret number",
          "  secretNumber = Math.floor(Math.random() * 100) + 1;",
          "",
          "  // 3. Reset attempts and the display",
          "  attempts = 0;",
          "  attemptsEl.innerText = 0;",
          "  hintEl.innerText = '-';",
          "  messageEl.innerText = 'Start guessing!';",
          "  guessInput.value = '';",
          "",
          "  // 4. Re-enable the Guess button",
          "  guessBtn.disabled = false;",
          "});"
        ],
        think: "What state needs to reset for a fresh round?",
        hints: [
          "The secret number, attempts, and every displayed value.",
          "Clear the input so the player can type a new guess.",
          "Re-enable the button if it was disabled on the win."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*restartBtn", hint: "Select the restart button: const restartBtn = document.getElementById('restartBtn');" },
            { pattern: "Math\\.random", hint: "Generate a new secret number on restart." },
            { pattern: "attempts\\s*=\\s*0", hint: "Reset attempts to 0." },
            { pattern: "disabled\\s*=\\s*false", hint: "Re-enable the button: guessBtn.disabled = false;" }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Number Guessing Game</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        "        <h1>Guess the Number</h1>",
        '        <p class="subtitle">Can you guess the secret number?</p>',
        '        <div class="game-card">',
        '            <div class="question">?</div>',
        '            <div class="guess-box">',
        '                <input type="number" id="guessInput" placeholder="Enter your guess (1-100)" min="1" max="100">',
        '                <button id="guessBtn">Guess</button>',
        "            </div>",
        "        </div>",
        '        <div class="stats">',
        '            <div class="stat-card"><h3>Attempts</h3><h2 id="attempts">0</h2></div>',
        '            <div class="stat-card"><h3>Best Score</h3><h2 id="bestScore">--</h2></div>',
        '            <div class="stat-card"><h3>Hint</h3><h2 id="hint">--</h2></div>',
        "        </div>",
        '        <div class="message" id="messageText">Start guessing!</div>',
        '        <button id="restartBtn">Restart Game</button>',
        "    </div>",
        "  </main>",
        '  <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  padding: 24px;",
        "  background: #f9fafb;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".container {",
        "  width: 100%;",
        "  max-width: 480px;",
        "  padding: 36px;",
        "  text-align: center;",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 20px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".container h1 { color: #111827; margin-bottom: 6px; }",
        ".subtitle { color: #6b7280; margin-bottom: 22px; }",
        "",
        ".game-card {",
        "  padding: 24px;",
        "  background: #f3f4f6;",
        "  border-radius: 16px;",
        "  margin-bottom: 20px;",
        "}",
        "",
        ".question {",
        "  font-size: 3rem;",
        "  font-weight: 800;",
        "  color: #2563eb;",
        "  margin-bottom: 16px;",
        "}",
        "",
        ".guess-box { display: flex; gap: 10px; }",
        "",
        "#guessInput {",
        "  flex: 1;",
        "  padding: 12px;",
        "  font-size: 1rem;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 10px;",
        "  outline: none;",
        "}",
        "",
        "#guessBtn {",
        "  border: none;",
        "  padding: 12px 20px;",
        "  border-radius: 10px;",
        "  background: #2563eb;",
        "  color: #fff;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        ".stats {",
        "  display: grid;",
        "  grid-template-columns: repeat(3, 1fr);",
        "  gap: 12px;",
        "  margin-bottom: 20px;",
        "}",
        "",
        ".stat-card {",
        "  padding: 16px;",
        "  background: #f3f4f6;",
        "  border-radius: 12px;",
        "}",
        "",
        ".stat-card h3 { color: #6b7280; font-size: 0.8rem; margin-bottom: 6px; }",
        ".stat-card h2 { color: #111827; font-size: 1.5rem; }",
        "",
        ".message {",
        "  padding: 14px;",
        "  border-radius: 10px;",
        "  background: #eff6ff;",
        "  color: #1e40af;",
        "  font-weight: 600;",
        "  margin-bottom: 16px;",
        "}",
        "",
        "#restartBtn {",
        "  border: 1px solid #e5e7eb;",
        "  padding: 12px 24px;",
        "  border-radius: 10px;",
        "  background: #ffffff;",
        "  color: #111827;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        "@media (max-width: 480px) {",
        "  .container { padding: 24px 18px; }",
        "  .stats { grid-template-columns: 1fr; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   The input (#guessInput), Guess button (#guessBtn), stats (#attempts, #bestScore, #hint),",
        "//   message (#messageText) and restart button (#restartBtn) are all in index.html",
        "//   style.css is complete — the layout and colors are done for you",
        "",
        "// Step 2: Select elements & secret number",
        "//   Grab the elements and generate a secret number with Math.floor(Math.random() * 100) + 1",
        "",
        "// Step 3: Read the guess",
        "//   On click, read the input with parseInt() and reject invalid values with isNaN()",
        "",
        "// Step 4: Count attempts",
        "//   Increase attempts by 1 and write it into the attempts display",        "",
        "// Step 5: Compare the guess",
        "//   If it matches, the player wins; otherwise hint 'Higher' or 'Lower' with if / else if / else",        "",
        "// Step 6: Handle the win",
        "//   Disable the Guess button and update the best score when appropriate",        "",
        "// Step 7: Restart the game",
        "//   Generate a new secret, reset attempts and the displays, and re-enable the button"
      ].join("\n")
    }
  },

  "text-repeator": {
    slug: "text-repeator",
    folder: "text repeator",
    title: "Text Repeater",
    difficulty: "Beginner",
    time: "50 min",
    category: "Core JS",
    tags: ["DOM", "Text", "Loops"],
    intro: "Build a text toolkit that packs four tools into one page — a repeater, a reverser, a case converter and a word counter — all sharing the same input and output. You'll work with the input event, for loops, string methods, regular expressions, tab switching and the Clipboard API.",
    previewNote: "You'll build the real Text Tools app: a sidebar with four tools (Repeater, Reverser, Case Converter, Word Counter) that switch inside one shared workspace, with a 75-character limit, live stats and a copy button. Start with the starter files, then wire up the JavaScript step by step.",
    cover: "../../assets/project-covers/text-repeator.png",
    previewUrl: "../../../JS%20PROJECTS/text%20repeator/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "The input event fires on every keystroke — perfect for live counters.",
      "word is the shared variable every tool reads, so keep it updated.",
      "String methods chain: word.split(\"\").reverse().join(\"\") reverses text.",
      "The 75-character limit lives in a constant: const MAX_CHARS = 75;"
    ],
    concepts: [
      "DOM selection (getElementById)",
      "The input event + character limits",
      "For loops for repetition",
      "String methods (split, reverse, join, toUpperCase)",
      "Regular expressions (\b\w, \s+)",
      "Tab switching with classList and style.display",
      "The Clipboard API (navigator.clipboard)"
    ],
    challenge: "Extra challenge: add a fifth tool to the sidebar — try a Remove Extra Spaces tool that uses text.replace(/\s+/g, ' ') to collapse multiple spaces into one.",
    steps: [
      {
        title: "Meet the Text Toolkit",
        tagline: "One page, four text tools.",
        goal: "Open the starter files and see how one page hosts four tools — Repeater, Reverser, Case Converter and Word Counter — around a shared input/output workspace.",
        logic: [
          "Open index.html — find the sidebar with the four tabs: #repeater-tab, #reverser-tab, #case-tab and #word-tab.",
          "Find the shared workspace: the input card (#text-input) on the left and the output card (#output) on the right.",
          "Notice each tool has its own controls: #repeat-count and #repeat-btn (repeater), #reverse-btn (reverser), #case-buttons (case converter) and #stats-box (word counter).",
          "Open style.css — the layout and colors are already styled for you.",
          "Open index.html in the browser and click each sidebar tab — the titles and controls change without the page reloading."
        ],
        logicCode: [
          "// 1. index.html — the sidebar holds four tabs: #repeater-tab, #reverser-tab, #case-tab, #word-tab",
          "// 2. The shared workspace: #text-input (left) and #output (right)",
          "// 3. Per-tool controls: #repeat-count/#repeat-btn, #reverse-btn, #case-buttons, #stats-box",
          "// 4. style.css — layout and colors are already styled for you",
          "// 5. Open index.html — click each tab and watch the page switch tools"
        ],
        think: "What changes on the page when you click a tab — without a single page reload?",
        hints: [
          "The sidebar lists the four tools — the active one is highlighted with the active class.",
          "Every tool shares the same two cards: type on the left, result on the right.",
          "The hero title #tool-title, the descriptions and the tip box all change per tab."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)", hint: "Select elements with document.getElementById() — e.g. const inputElement = document.getElementById('text-input')." }
          ]
        }
      },
      {
        title: "Grab Every Element",
        tagline: "The control room of the app.",
        goal: "Select every element the app needs and set up the shared state: the MAX_CHARS limit and the word variable every tool reads.",
        logic: [
          "Grab the input and output elements (#text-input, #output, #char-count).",
          "Grab the buttons and controls (#clear-btn, #repeat-btn, #repeat-count, #reverse-btn, #case-buttons).",
          "Grab the sidebar tabs and the title elements (#tool-title, #tool-description, #input-title, #output-title, #tip-box).",
          "Define the character limit: const MAX_CHARS = 75;.",
          "Declare the shared text state: let word = \"\";."
        ],
        logicCode: [
          "// 1. Input and output elements",
          "const inputElement = document.getElementById('text-input');",
          "const outputElement = document.getElementById('output');",
          "const charCount = document.getElementById('char-count');",
          "",
          "// 2. Buttons and controls",
          "const clearElement = document.getElementById('clear-btn');",
          "const repeatBtn = document.getElementById('repeat-btn');",
          "const repeatCount = document.getElementById('repeat-count');",
          "const reverseBtn = document.getElementById('reverse-btn');",
          "",
          "// 3. Tabs and titles",
          "const repeaterTab = document.getElementById('repeater-tab');",
          "const wordTab = document.getElementById('word-tab');",
          "const toolTitle = document.getElementById('tool-title');",
          "const tipBox = document.getElementById('tip-box');",
          "",
          "// 4. Shared state",
          "const MAX_CHARS = 75;",
          "let word = \"\";"
        ],
        think: "Why is word declared with let, while the element variables use const?",
        hints: [
          "Each getElementById call returns one element — grab them all once at the top.",
          "const is for values that never change (element references, MAX_CHARS).",
          "word changes on every keystroke, so it needs let."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*text-input", hint: "Select the input: const inputElement = document.getElementById('text-input');" },
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*output", hint: "Select the output: const outputElement = document.getElementById('output');" },
            { pattern: "MAX_CHARS", hint: "Define the character limit: const MAX_CHARS = 75;" },
            { pattern: "let\\s+word\\s*=", hint: "Declare the shared text state: let word = \"\";" }
          ]
        }
      },
      {
        title: "Type & Watch — the Input Listener",
        tagline: "Every keystroke, three things happen.",
        goal: "Make the app listen to every keystroke: count characters, enforce the 75-character limit with slice(), color the counter, and save the text into word.",
        logic: [
          "Attach an input listener to #text-input.",
          "Count the characters with inputElement.value.length.",
          "If the count passes MAX_CHARS, cut the text with slice(0, MAX_CHARS).",
          "Update #char-count with the count and color it red, orange or black.",
          "Save the current text into the shared word variable."
        ],
        logicCode: [
          "inputElement.addEventListener('input', () => {",
          "    let count = inputElement.value.length;",
          "    if (count > MAX_CHARS) {",
          "        inputElement.value = inputElement.value.slice(0, MAX_CHARS);",
          "        count = MAX_CHARS;",
          "    }",
          "    charCount.innerText = `${count} / ${MAX_CHARS}`;",
          "    charCount.style.color = count >= MAX_CHARS ? 'red' : (count >= MAX_CHARS - 20 ? 'orange' : 'black');",
          "",
          "    word = inputElement.value;",
          "});"
        ],
        think: "Why does the counter turn orange before it turns red?",
        hints: [
          "The input event fires on every keystroke — no button needed.",
          "slice(0, MAX_CHARS) keeps only the first 75 characters, cutting the rest.",
          "The ternary chain checks two thresholds: near the limit (orange) and at it (red).",
          "word = inputElement.value is what lets every tool read the latest text."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']input", hint: "Attach an input listener: inputElement.addEventListener('input', () => { ... })." },
            { pattern: "value\\s*\\.\\s*length", hint: "Count the characters with inputElement.value.length." },
            { pattern: "\\.slice\\s*\\(", hint: "Cut the text at the limit with .slice(0, MAX_CHARS)." },
            { pattern: "style\\.color", hint: "Color the counter with charCount.style.color = ..." }
          ]
        }
      },
      {
        title: "Tool 1 — the Repeater",
        tagline: "A for loop that copies your text.",
        goal: "Make Repeat Text write the input N times into the output, one copy per line.",
        logic: [
          "Listen for clicks on #repeat-btn.",
          "Read the repeat amount and convert it to a number with Number().",
          "Start result as an empty string.",
          "Loop from 0 up to the repeat count, appending word + \"\\n\" every pass.",
          "Write the finished result into #output."
        ],
        logicCode: [
          "repeatBtn.addEventListener('click', () => {",
          "    let result = \"\";",
          "    for (let i = 0; i < Number(repeatCount.value); i++) {",
          "        result += word + \"\\n\";",
          "    }",
          "    outputElement.value = result;",
          "});"
        ],
        think: "Why wrap the repeat count in Number()?",
        hints: [
          "Input values are always strings — Number('10') turns it into 10.",
          "result += word + \"\\n\" appends one copy plus a newline each pass.",
          "i starts at 0, so the loop body runs exactly as many times as the repeat count."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks on the Repeat button." },
            { pattern: "\\bfor\\s*\\(", hint: "Use a for loop: for (let i = 0; i < Number(repeatCount.value); i++) { ... }" },
            { pattern: "\\+=", hint: "Append each copy with +=, e.g. result += word + \"\\n\";" },
            { pattern: "Number\\s*\\(", hint: "Convert the repeat count with Number(repeatCount.value)." }
          ]
        }
      },
      {
        title: "Tool 2 — the Reverser",
        tagline: "split, reverse, join — a one-line chain.",
        goal: "Make Reverse Text flip the order of every character using a chain of three array methods.",
        logic: [
          "Listen for clicks on #reverse-btn.",
          "split(\"\") breaks the string into an array of characters.",
          "reverse() flips the array order.",
          "join(\"\") puts the characters back into a single string.",
          "Write the result into #output."
        ],
        logicCode: [
          "reverseBtn.addEventListener('click', () => {",
          "    outputElement.value = word.split(\"\").reverse().join(\"\");",
          "});"
        ],
        think: "What does \"abc\" become after split(\"\").reverse().join(\"\") — step by step?",
        hints: [
          "split(\"\") turns \"abc\" into ['a', 'b', 'c'].",
          "reverse() flips it to ['c', 'b', 'a'].",
          "join(\"\") glues it back into \"cba\" — the reversed text."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks on the Reverse button." },
            { pattern: "split\\s*\\(\\s*[\"']{2}\\s*\\)\\s*\\.\\s*reverse", hint: "Break the string into characters: word.split(\"\").reverse()" },
            { pattern: "\\.reverse\\s*\\(\\s*\\)\\s*\\.\\s*join", hint: "Chain it together: word.split(\"\").reverse().join(\"\")" }
          ]
        }
      },
      {
        title: "Tool 3 — the Case Converter",
        tagline: "Three buttons, three case styles.",
        goal: "Make the three case buttons convert the input text: UPPERCASE, lowercase and Title Case.",
        logic: [
          "UPPERCASE: word.toUpperCase().",
          "lowercase: word.toLowerCase().",
          "Title Case: lowercase everything first, then capitalize the first letter of every word.",
          "The regex /\\b\\w/g matches the first letter of each word: \\b is a word boundary, \\w is a word character, g means global.",
          "The replacement function c => c.toUpperCase() capitalizes each matched letter."
        ],
        logicCode: [
          "uppercase.addEventListener('click', () => outputElement.value = word.toUpperCase());",
          "lowercase.addEventListener('click', () => outputElement.value = word.toLowerCase());",
          "titlecase.addEventListener('click', () => {",
          "    outputElement.value = word.toLowerCase().replace(/\\b\\w/g, c => c.toUpperCase());",
          "});"
        ],
        think: "Why does Title Case lowercase the whole text before replacing letters?",
        hints: [
          "toUpperCase() and toLowerCase() are built-in string methods.",
          "replace(regex, fn) runs the function for every match — c is the matched letter.",
          "Without the lowercasing first, a word like 'HELLO' would keep its capital letters."
        ],
        check: {
          requires: [
            { pattern: "toUpperCase", hint: "Convert to uppercase with word.toUpperCase()." },
            { pattern: "toLowerCase", hint: "Convert to lowercase with word.toLowerCase()." },
            { pattern: "replace\\s*\\(", hint: "Use .replace() with a regex for Title Case." },
            { pattern: "\\\\b\\\\w", hint: "Match word-start letters with the regex /\\b\\w/g." }
          ]
        }
      },
      {
        title: "Tool 4 — the Word Counter",
        tagline: "Count words, characters and lines as you type.",
        goal: "Show live stats — words, characters and lines — computed inside the same input listener as the character counter.",
        logic: [
          "Trim the text so surrounding spaces don't create a phantom word.",
          "Count words by splitting on whitespace with split(/\\s+/).",
          "Count characters with word.length.",
          "Count lines by splitting on \"\\n\".",
          "Use a ternary so empty text shows 0 instead of 1."
        ],
        logicCode: [
          "// Inside the input listener",
          "const text = word.trim();",
          "document.getElementById('word-count').innerText = text ? text.split(/\\s+/).length : 0;",
          "document.getElementById('character-count').innerText = word.length;",
          "document.getElementById('line-count').innerText = text ? word.split(\"\\n\").length : 0;"
        ],
        think: "Why does the word count need text ? ... : 0 instead of just text.split(/\\s+/).length?",
        hints: [
          "trim() removes spaces at the start and end of the text.",
          "/\\s+/ matches one or more whitespace characters — that's what separates words.",
          "\"\".split(/\\s+/) returns [''] — an array with length 1 — so the ternary swaps it for 0."
        ],
        check: {
          requires: [
            { pattern: "\\.trim\\s*\\(\\s*\\)", hint: "Trim the text first: const text = word.trim();" },
            { pattern: "split\\s*\\(\\s*/", hint: "Count words with text.split(/\\s+/).length." },
            { pattern: "\\\\n", hint: "Count lines with word.split(\"\\n\").length." }
          ]
        }
      },
      {
        title: "The Toolkit Shell — Tab Switching",
        tagline: "One page, four modes.",
        goal: "Make the four sidebar tabs switch tools: update the titles and tip, move the active highlight, and show only the controls each tool needs.",
        logic: [
          "Listen for clicks on each of the four tabs.",
          "Update #tool-title, #tool-description, #input-title, #output-title and #tip-box for the chosen tool.",
          "Move the active class between tabs with classList.add / classList.remove.",
          "Show only the controls that tool needs with style.display.",
          "The Reverser shows #reverse-btn, Case Converter shows #case-buttons, Word Counter shows #stats-box — everything else stays hidden."
        ],
        logicCode: [
          "reverserTab.addEventListener('click', () => {",
          "    toolTitle.innerText = 'Text Reverser';",
          "    toolDescription.innerText = 'Reverse any text instantly.';",
          "    inputTitle.innerText = 'Text to Reverse';",
          "    outputTitle.innerText = 'Reversed Text';",
          "    tipBox.innerText = '💡 Tip: Reverse words, sentences and emojis.';",
          "",
          "    repeaterTab.classList.remove('active');",
          "    reverserTab.classList.add('active');",
          "    caseTab.classList.remove('active');",
          "    wordTab.classList.remove('active');",
          "",
          "    repeatCount.style.display = 'none';",
          "    repeatBtn.style.display = 'none';",
          "    reverseBtn.style.display = 'block';",
          "    caseButtons.style.display = 'none';",
          "    statsBox.style.display = 'none';",
          "    outputElement.style.display = 'block';",
          "});"
        ],
        think: "Why does each tab handler repeat the same show/hide dance instead of hiding everything first?",
        hints: [
          "classList.add / classList.remove moves the active highlight in the sidebar.",
          "style.display = 'none' hides an element; style.display = 'block' shows it.",
          "Word Counter hides the output and shows #stats-box instead — check the wordTab handler in script.js."
        ],
        check: {
          requires: [
            { pattern: "classList\\.(add|remove)", hint: "Move the active highlight with classList.add / classList.remove." },
            { pattern: "style\\.display", hint: "Show or hide controls with style.display = 'none' / 'block'." },
            { pattern: "innerText\\s*=|textContent\\s*=", hint: "Update the titles and tip with innerText." }
          ]
        }
      },
      {
        title: "Clear & Copy",
        tagline: "Reset everything — and copy the result.",
        goal: "Make Clear wipe both textareas and every counter, and make Copy send the output to the clipboard with feedback.",
        logic: [
          "Clear: empty #text-input and #output.",
          "Clear: reset #char-count to \"0 / 75\", its color to black, and word back to \"\".",
          "Clear: reset the three Word Counter stats to 0.",
          "Copy: read the output and guard against an empty value with a message.",
          "Copy: write the text with navigator.clipboard.writeText(), flip the label to \"Copied!\", restore it after 2 seconds, and log any error."
        ],
        logicCode: [
          "clearElement.addEventListener('click', () => {",
          "    inputElement.value = \"\";",
          "    outputElement.value = \"\";",
          "    charCount.innerText = `0 / ${MAX_CHARS}`;",
          "    charCount.style.color = 'black';",
          "    word = \"\";",
          "    document.getElementById('word-count').innerText = '0';",
          "    document.getElementById('character-count').innerText = '0';",
          "    document.getElementById('line-count').innerText = '0';",
          "});",
          "",
          "copyBtn.addEventListener('click', () => {",
          "    const textToCopy = outputElement.value;",
          "    if (!textToCopy) {",
          "        alert('Nothing to copy!');",
          "        return;",
          "    }",
          "    navigator.clipboard.writeText(textToCopy).then(() => {",
          "        const originalText = copyBtn.innerText;",
          "        copyBtn.innerText = 'Copied!';",
          "        setTimeout(() => { copyBtn.innerText = originalText; }, 2000);",
          "    }).catch(err => {",
          "        console.error('Failed to copy text: ', err);",
          "    });",
          "});"
        ],
        think: "Why does Clear reset both the state variables and the on-screen counters?",
        hints: [
          "Clear touches every piece of state: the textareas, word, the counter and the stats.",
          "navigator.clipboard.writeText() returns a Promise — .then() runs when it succeeds.",
          "setTimeout(..., 2000) restores the button label two seconds later; .catch() handles failures."
        ],
        check: {
          requires: [
            { pattern: "clipboard\\.writeText|writeText", hint: "Copy with navigator.clipboard.writeText(textToCopy)." },
            { pattern: "setTimeout", hint: "Restore the label with setTimeout(..., 2000)." },
            { pattern: "\\bif\\s*\\(", hint: "Guard the empty output: if (!textToCopy) { alert('Nothing to copy!'); return; }" }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Test all four tools.",
        goal: "Test every tool, the character limit, Clear and Copy — then polish anything that looks off.",
        logic: [
          "Type a sentence and watch the counter, its color and the stats update as you go.",
          "Repeat it 5 times, reverse it, convert its case and count its words.",
          "Keep typing past 75 characters — extra letters should be cut off and the counter turns orange then red.",
          "Click Copy and paste elsewhere to confirm it worked.",
          "Click Clear — everything should reset."
        ],
        logicCode: [
          "// 1. Type a sentence — watch the counter, colors and stats update",
          "// 2. Repeat 5 times, reverse, convert case, count words",
          "// 3. Type past 75 characters — the extras get cut off",
          "// 4. Debug anything unexpected",
          "console.log(outputElement.value);",
          "// 5. Clear resets everything — Copy grabs the output"
        ],
        think: "What happens if you click Repeat Text with an empty repeat count?",
        hints: [
          "Number('') is 0 — the loop never runs and the output stays empty.",
          "console.log(outputElement.value) prints the output (F12) — great for debugging.",
          "If a tool does nothing, check its tab handler shows the right controls and its element ids match."
        ],
        check: {
          requires: [
            { pattern: "\\bfor\\s*\\(", hint: "Keep the repeat loop working." },
            { pattern: "split\\s*\\(\\s*[\"']{2}\\s*\\)\\s*\\.\\s*reverse", hint: "Keep the reverser chain working." },
            { pattern: "clipboard\\.writeText|writeText", hint: "Keep copy-to-clipboard working." },
            { pattern: "classList\\.(add|remove)", hint: "Keep the tab switching working." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <!-- Sandbox version of the project's index.html. The real page also loads",
        "         ../design-system.css, the lucide icon script, the logo image and ../footer.js;",
        "         they're removed here so the Run Code preview works offline. -->",
        '    <link rel="stylesheet" href="style.css">',
        "    <title>Text Tools</title>",
        "</head>",
        "<body>",
        '    <header class="navbar">',
        '        <div class="logo">TextRepeater</div>',
        "    </header>",
        '    <div class="app">',
        '        <aside class="sidebar">',
        "            <h3>TOOLS</h3>",
        "            <ul>",
        '                <li id="repeater-tab" class="active">Repeater</li>',
        '                <li id="reverser-tab">Reverser</li>',
        '                <li id="case-tab">Case Converter</li>',
        '                <li id="word-tab">Word Counter</li>',
        "            </ul>",
        "        </aside>",
        '        <main class="main-content">',
        "            <div class=\"hero\">",
        '                <h1 id="tool-title">Text Repeater</h1>',
        '                <p id="tool-description">Repeat text, emojis and punctuation in one step.</p>',
        "            </div>",
        '            <div class="workspace">',
        '                <section class="input-card">',
        '                    <div class="card-header">',
        '                        <h2 id="input-title">Text to Repeat</h2>',
        '                        <button id="clear-btn">Clear</button>',
        "                    </div>",
        '                    <textarea id="text-input" placeholder="Type or paste your text here..."></textarea>',
        '                    <span id="char-count">0 / 75</span>',
        '                    <div class="row">',
        '                        <input type="number" id="repeat-count" value="10" min="1">',
        "                    </div>",
        '                    <button id="repeat-btn">Repeat Text</button>',
        '                    <button id="reverse-btn" style="display:none;">Reverse Text</button>',
        '                    <div id="case-buttons">',
        "                        <h3>Choose Conversion Type</h3>",
        '                        <div class="case-btn-group">',
        '                            <button id="upper-btn">UPPERCASE</button>',
        '                            <button id="lower-btn">lowercase</button>',
        '                            <button id="title-btn">Title Case</button>',
        "                        </div>",
        "                    </div>",
        "                </section>",
        '                <section class="output-card">',
        '                    <div class="card-header">',
        '                        <h2 id="output-title">Repeated Text</h2>',
        '                        <button id="copy-btn">Copy</button>',
        "                    </div>",
        '                    <textarea id="output" readonly></textarea>',
        '                    <div id="stats-box" style="display:none;">',
        '                        <div class="stat-item">Words: <span id="word-count">0</span></div>',
        '                        <div class="stat-item">Characters: <span id="character-count">0</span></div>',
        '                        <div class="stat-item">Lines: <span id="line-count">0</span></div>',
        "                    </div>",
        "                </section>",
        "            </div>",
        '            <div class="tip-box" id="tip-box">💡 Tip: Repeat up to 100 times</div>',
        "        </main>",
        "    </div>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "/* Self-contained version of the real style.css — the project pulls",
        "   these tokens from ../design-system.css; they're inlined here so the",
        "   sandboxed Run Code preview works offline. */",
        ":root {",
        "  --font-heading: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;",
        "  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;",
        "  --bg-primary: #FFFFFF;",
        "  --bg-secondary: #F9FAFB;",
        "  --text-primary: #111827;",
        "  --text-secondary: #6B7280;",
        "  --text-tertiary: #9CA3AF;",
        "  --accent: #2563EB;",
        "  --accent-hover: #1D4ED8;",
        "  --accent-light: rgba(37, 99, 235, 0.1);",
        "  --border: #E5E7EB;",
        "  --radius-md: 12px;",
        "  --radius-lg: 16px;",
        "  --radius-xl: 20px;",
        "  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);",
        "}",
        "",
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  background: var(--bg-secondary);",
        "  color: var(--text-primary);",
        "  font-family: var(--font-body);",
        "}",
        "",
        ".navbar {",
        "  height: 75px;",
        "  display: flex;",
        "  justify-content: space-between;",
        "  align-items: center;",
        "  padding: 0 40px;",
        "  background: var(--bg-primary);",
        "  border-bottom: 1px solid var(--border);",
        "}",
        "",
        ".logo {",
        "  font-size: 2rem;",
        "  font-weight: 700;",
        "  color: var(--accent);",
        "  display: flex;",
        "  align-items: center;",
        "  gap: 10px;",
        "}",
        "",
        ".app {",
        "  display: flex;",
        "  min-height: calc(100vh - 75px);",
        "}",
        "",
        ".sidebar {",
        "  width: 240px;",
        "  background: var(--bg-primary);",
        "  border-right: 1px solid var(--border);",
        "  padding: 30px;",
        "}",
        "",
        ".sidebar h3 {",
        "  color: var(--text-secondary);",
        "  margin-bottom: 20px;",
        "  font-size: 0.8rem;",
        "  text-transform: uppercase;",
        "  letter-spacing: 1px;",
        "}",
        "",
        ".sidebar ul { list-style: none; }",
        "",
        ".sidebar li {",
        "  padding: 14px;",
        "  margin-bottom: 10px;",
        "  border-radius: var(--radius-md);",
        "  cursor: pointer;",
        "  color: var(--text-secondary);",
        "  transition: all var(--transition-fast);",
        "}",
        "",
        ".sidebar li:hover { background: var(--bg-secondary); color: var(--text-primary); }",
        ".sidebar .active { background: var(--accent-light); color: var(--accent); }",
        "",
        ".main-content { flex: 1; padding: 40px; }",
        "",
        ".hero h1 { font-size: 4rem; margin-bottom: 10px; }",
        ".hero p { color: var(--text-secondary); margin-bottom: 30px; }",
        "",
        ".workspace {",
        "  display: grid;",
        "  grid-template-columns: 1fr 1fr;",
        "  gap: 25px;",
        "}",
        "",
        ".input-card, .output-card {",
        "  background: var(--bg-primary);",
        "  border-radius: var(--radius-xl);",
        "  padding: 25px;",
        "  border: 1px solid var(--border);",
        "}",
        "",
        ".card-header {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  align-items: center;",
        "  margin-bottom: 20px;",
        "}",
        "",
        "textarea {",
        "  width: 100%;",
        "  height: 250px;",
        "  resize: none;",
        "  padding: 15px;",
        "  border: 1px solid var(--border);",
        "  border-radius: var(--radius-lg);",
        "  outline: none;",
        "  background: var(--bg-secondary);",
        "  color: var(--text-primary);",
        "  transition: all var(--transition-fast);",
        "}",
        "",
        "textarea:focus { border-color: var(--accent); }",
        "",
        ".row {",
        "  display: flex;",
        "  gap: 15px;",
        "  margin-top: 20px;",
        "}",
        "",
        ".row input {",
        "  flex: 1;",
        "  padding: 15px;",
        "  border: 1px solid var(--border);",
        "  border-radius: var(--radius-md);",
        "  background: var(--bg-secondary);",
        "  color: var(--text-primary);",
        "}",
        "",
        ".row input:focus { outline: none; border-color: var(--accent); }",
        "",
        "#repeat-btn, #reverse-btn {",
        "  width: 100%;",
        "  margin-top: 20px;",
        "  padding: 16px;",
        "  border: none;",
        "  color: white;",
        "  font-size: 1rem;",
        "  border-radius: var(--radius-md);",
        "  background: var(--accent);",
        "  cursor: pointer;",
        "  font-weight: 600;",
        "  transition: all var(--transition-fast);",
        "}",
        "",
        "#repeat-btn:hover, #reverse-btn:hover {",
        "  background: var(--accent-hover);",
        "  transform: translateY(-2px);",
        "}",
        "",
        "#reverse-btn { display: none; }",
        "",
        "#case-buttons {",
        "  display: none;",
        "  flex-direction: column;",
        "  gap: 10px;",
        "  margin-top: 15px;",
        "}",
        "",
        "#case-buttons button {",
        "  flex: 1;",
        "  padding: 14px;",
        "  border: none;",
        "  border-radius: var(--radius-md);",
        "  background: var(--bg-secondary);",
        "  color: var(--text-primary);",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "  transition: all var(--transition-fast);",
        "  border: 1px solid var(--border);",
        "}",
        "",
        "#case-buttons button:hover {",
        "  background: var(--accent);",
        "  color: white;",
        "  transform: translateY(-2px);",
        "}",
        "",
        "#stats-box {",
        "  display: none;",
        "  flex-direction: column;",
        "  gap: 16px;",
        "  margin-top: 20px;",
        "}",
        "",
        ".stat-item {",
        "  background: var(--bg-secondary);",
        "  border: 1px solid var(--border);",
        "  border-radius: var(--radius-md);",
        "  padding: 20px;",
        "  font-size: 1.1rem;",
        "  font-weight: 600;",
        "}",
        "",
        ".tip-box {",
        "  margin-top: 25px;",
        "  background: var(--accent-light);",
        "  padding: 18px;",
        "  border-radius: var(--radius-lg);",
        "  color: var(--accent);",
        "}",
        "",
        "#clear-btn, #copy-btn {",
        "  padding: 8px 16px;",
        "  border: 1px solid var(--border);",
        "  border-radius: var(--radius-md);",
        "  background: transparent;",
        "  color: var(--text-secondary);",
        "  cursor: pointer;",
        "  transition: all var(--transition-fast);",
        "}",
        "",
        "#clear-btn:hover, #copy-btn:hover {",
        "  background: var(--bg-secondary);",
        "  color: var(--text-primary);",
        "}",
        "",
        "#char-count { color: var(--text-tertiary); font-size: 0.9rem; display: block; margin-top: 10px; }"
      ].join("\n"),
      "script.js": [
        "// Step 1: Meet the Text Toolkit",
        "//   One page, four tools — Repeater, Reverser, Case Converter, Word Counter.",
        "//   style.css is complete — the layout and colors are done for you.",
        "",
        "// Step 2: Grab every element",
        "//   Select #text-input, #output, the buttons, the tabs and the title",
        "//   elements once at the top with document.getElementById().",
        "//   Set up the shared state: const MAX_CHARS = 75; and let word = \"\";",
        "",
        "// Step 3: Type & watch — the input listener",
        "//   On 'input': count characters, cap the text at MAX_CHARS with slice(),",
        "//   color #char-count, and save the text into word.",
        "",
        "// Step 4: Tool 1 — the Repeater",
        "//   On #repeat-btn click: loop from 0 to Number(repeatCount.value) and",
        "//   build the result with result += word + \"\\n\", then write it to #output.",
        "",
        "// Step 5: Tool 2 — the Reverser",
        "//   On #reverse-btn click: outputElement.value = word.split(\"\").reverse().join(\"\");",
        "",
        "// Step 6: Tool 3 — the Case Converter",
        "//   UPPERCASE -> word.toUpperCase(), lowercase -> word.toLowerCase(),",
        "//   Title Case -> word.toLowerCase().replace(/\\b\\w/g, c => c.toUpperCase())",
        "",
        "// Step 7: Tool 4 — the Word Counter",
        "//   Inside the input listener: words = text.split(/\\s+/).length,",
        "//   characters = word.length, lines = word.split(\"\\n\").length.",
        "",
        "// Step 8: The toolkit shell — tab switching",
        "//   On each tab click: update the titles + tip, move the active class,",
        "//   and show only the controls that tool needs with style.display.",
        "",
        "// Step 9: Clear & Copy",
        "//   Clear resets the textareas, the counter and the stats.",
        "//   Copy uses navigator.clipboard.writeText() with feedback.",
        "",
        "// Step 10: Final touch & test",
        "//   Test all four tools, the 75-character limit, Clear and Copy."
      ].join("\n")
    }
  },

  "tipcalculator": {
    slug: "tipcalculator",
    folder: "Tip-Calculator",
    title: "Tip Calculator",
    difficulty: "Beginner",
    time: "45 min",
    category: "Core JS",
    tags: ["Forms", "Math", "DOM"],
    intro: "Build a tip calculator that turns a bill amount, a tip percentage and a group size into the tip, the total and the amount per person. You'll read form values, do arithmetic and update the UI live.",
    previewNote: "You'll build a working tip calculator with a bill input, preset tip buttons, a people count and live results. Start with the starter files, then wire up the JavaScript step by step.",
    cover: "../../assets/project-covers/tipcalculator.png",
    previewUrl: "../../../JS%20PROJECTS/tipCalculator/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "parseFloat() converts input strings to decimal numbers.",
      "Tip = bill × percentage ÷ 100 — compute it before adding to the bill.",
      "Split the total by the number of people to get the per-person amount.",
      "Validate the inputs before calculating so empty fields don't break the math."
    ],
    concepts: [
      "Reading input values (.value)",
      "Converting strings to numbers (parseFloat / Number)",
      "Arithmetic (percentages, division)",
      "Event handling on buttons",
      "Conditional validation",
      "Updating the UI with textContent"
    ],
    challenge: "Extra challenge: show the results in your local currency symbol instead of a hardcoded $.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the bill input (#billInput), the tip buttons (.tip-btn), the custom tip (#customTip), the people input (#peopleInput) and the Calculate button (#calculateBtn).",
          "Find the result boxes (#tipAmount, #totalAmount, #perPerson) and the Reset button (#resetBtn).",
          "Open style.css — the layout and colors are already styled for you.",
          "Open index.html in the browser — you'll see a static calculator."
        ],
        logicCode: [
          "// 1. index.html — find #billInput, .tip-btn, #customTip, #peopleInput and #calculateBtn",
          "// 2. Find the results: #tipAmount, #totalAmount, #perPerson — and #resetBtn",
          "// 3. style.css — layout and colors are already styled for you",
          "// 4. Open index.html in the browser — you'll see a static calculator"
        ],
        think: "Which elements will your JavaScript need to read, and which will it update?",
        hints: [
          "Read: #billInput, #customTip, #peopleInput and the tip buttons.",
          "Update: #tipAmount, #totalAmount and #perPerson.",
          "You'll only write JavaScript — the HTML and CSS are done."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)", hint: "Select elements with document.getElementById() — e.g. const billInput = document.getElementById('billInput')." }
          ]
        }
      },
      {
        title: "Select the Elements",
        tagline: "Grab every element you need.",
        goal: "Select the inputs, the buttons and the result boxes so your script can use them.",
        logic: [
          "Grab the bill input.",
          "Grab the custom tip and people inputs.",
          "Grab the Calculate and Reset buttons.",
          "Grab the three result boxes.",
          "Grab all tip buttons with querySelectorAll()."
        ],
        logicCode: [
          "// 1. Grab the inputs",
          "const billInput = document.getElementById('billInput');",
          "const customTip = document.getElementById('customTip');",
          "const peopleInput = document.getElementById('peopleInput');",
          "",
          "// 2. Grab the buttons",
          "const calculateBtn = document.getElementById('calculateBtn');",
          "const resetBtn = document.getElementById('resetBtn');",
          "",
          "// 3. Grab the result boxes",
          "const tipAmountEl = document.getElementById('tipAmount');",
          "const totalAmountEl = document.getElementById('totalAmount');",
          "const perPersonEl = document.getElementById('perPerson');",
          "",
          "// 4. Grab all tip buttons",
          "const tipButtons = document.querySelectorAll('.tip-btn');"
        ],
        think: "Why use querySelectorAll('.tip-btn') instead of five separate getElementById calls?",
        hints: [
          "querySelectorAll returns a NodeList of every matching element.",
          "Element references never change, so const is right.",
          "Grab everything once at the top of the file."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*billInput", hint: "Select the bill input: const billInput = document.getElementById('billInput');" },
            { pattern: "querySelectorAll", hint: "Select all tip buttons: const tipButtons = document.querySelectorAll('.tip-btn');" },
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*calculateBtn", hint: "Select the Calculate button: const calculateBtn = document.getElementById('calculateBtn');" }
          ]
        }
      },
      {
        title: "Pick a Tip",
        tagline: "Highlight the selected tip percentage.",
        goal: "Make the tip buttons selectable so the chosen percentage is highlighted.",
        logic: [
          "Loop over every tip button.",
          "Listen for clicks on each one.",
          "Remove the active class from all buttons.",
          "Add the active class to the clicked button.",
          "Store the chosen percentage."
        ],
        logicCode: [
          "// 1. Loop over every tip button",
          "let tipPercentage = 0;",
          "tipButtons.forEach((button) => {",
          "  // 2. Listen for clicks on each one",
          "  button.addEventListener('click', () => {",
          "    // 3. Remove active from all, add to the clicked one",
          "    tipButtons.forEach((btn) => btn.classList.remove('active'));",
          "    button.classList.add('active');",
          "",
          "    // 4. Store the chosen percentage",
          "    tipPercentage = parseFloat(button.textContent);",
          "  });",
          "});"
        ],
        think: "Why remove the active class from every button before adding it to the clicked one?",
        hints: [
          "forEach runs a function for each element in the list.",
          "classList.add / classList.remove toggle CSS classes.",
          "parseFloat('15%') returns 15 — the % is ignored."
        ],
        check: {
          requires: [
            { pattern: "forEach", hint: "Loop over the tip buttons with forEach." },
            { pattern: "classList\\.(add|remove|toggle)", hint: "Toggle the active class with classList.add / remove." },
            { pattern: "parseFloat", hint: "Store the percentage: tipPercentage = parseFloat(button.textContent);" }
          ]
        }
      },
      {
        title: "Read & Validate Inputs",
        tagline: "Get the numbers and check they make sense.",
        goal: "Read the bill, the tip and the people count, convert them to numbers and reject invalid values.",
        logic: [
          "Read the bill amount.",
          "Read the tip — custom tip wins if filled.",
          "Read the number of people.",
          "Convert everything with parseFloat / parseInt.",
          "Guard against zero or missing values."
        ],
        logicCode: [
          "// 1. Read and convert the bill",
          "const bill = parseFloat(billInput.value) || 0;",
          "",
          "// 2. Custom tip wins if filled, else the selected preset",
          "const tip = customTip.value.trim() !== ''",
          "  ? parseFloat(customTip.value) || 0",
          "  : tipPercentage;",
          "",
          "// 3. Read the number of people",
          "const people = parseInt(peopleInput.value) || 0;",
          "",
          "// 4. Guard against invalid values",
          "if (bill <= 0 || people <= 0 || tip <= 0) {",
          "  alert('Enter valid values and pick a tip.');",
          "  return;",
          "}"
        ],
        think: "Why use || 0 when converting the bill?",
        hints: [
          "parseFloat('') is NaN — || 0 turns it into 0.",
          "Check bill, people and tip are all greater than 0.",
          "The ternary picks the custom tip only when it's filled."
        ],
        check: {
          requires: [
            { pattern: "parseFloat|Number", hint: "Convert the bill with parseFloat(value)." },
            { pattern: "parseInt|Number", hint: "Convert the people count with parseInt(value)." },
            { pattern: "<=|isNaN|\\bif\\b", hint: "Validate the inputs with a guard." },
            { pattern: "\\|\\|\\s*0|\\|\\|\\s*1", hint: "Fall back to a safe value with || 0." }
          ]
        }
      },
      {
        title: "Calculate the Results",
        tagline: "Compute tip, total and per person.",
        goal: "Turn the three numbers into the tip amount, the total bill and the amount per person.",
        logic: [
          "Tip amount = bill × tip percent ÷ 100.",
          "Total = bill + tip amount.",
          "Per person = total ÷ people.",
          "Round to two decimals with toFixed(2)."
        ],
        logicCode: [
          "// 1. Tip amount = bill × tip percent ÷ 100",
          "const tipAmount = (bill * tip) / 100;",
          "",
          "// 2. Total = bill + tip amount",
          "const totalAmount = bill + tipAmount;",
          "",
          "// 3. Per person = total ÷ people",
          "const perPerson = totalAmount / people;",
          "",
          "// 4. Round to two decimals",
          "const formattedTip = tipAmount.toFixed(2);"
        ],
        think: "For a $100 bill at 15%, what are the tip, total and per-person amounts (2 people)?",
        hints: [
          "Tip is bill * tip / 100.",
          "Add the tip to the bill for the total.",
          "Divide the total by the number of people."
        ],
        check: {
          requires: [
            { pattern: "\\*\\s*tip|/\\s*100|\\(bill\\s*\\*\\s*tip\\)", hint: "Compute the tip: const tipAmount = (bill * tip) / 100;" },
            { pattern: "\\+\\s*tipAmount|bill\\s*\\+\\s*tipAmount", hint: "Add the tip to the bill for the total." },
            { pattern: "/\\s*people", hint: "Divide by the people count for the per-person amount." },
            { pattern: "toFixed", hint: "Round with toFixed(2)." }
          ]
        }
      },
      {
        title: "Display the Results",
        tagline: "Write the numbers into the result boxes.",
        goal: "Show the tip, total and per-person amounts in the UI, formatted with the currency symbol.",
        logic: [
          "Format each number with toFixed(2).",
          "Prefix them with the currency symbol.",
          "Write each one into its result box."
        ],
        logicCode: [
          "// 1. Format and prefix each number",
          "tipAmountEl.textContent = '$' + tipAmount.toFixed(2);",
          "totalAmountEl.textContent = '$' + totalAmount.toFixed(2);",
          "perPersonEl.textContent = '$' + perPerson.toFixed(2);"
        ],
        think: "What does toFixed(2) return — a number or a string?",
        hints: [
          "element.textContent = value replaces the element's text.",
          "toFixed(2) returns a string rounded to two decimals.",
          "Concatenate the symbol: '$' + amount.toFixed(2)."
        ],
        check: {
          requires: [
            { pattern: "(textContent|innerText)\\s*=", hint: "Write the results with textContent." },
            { pattern: "toFixed", hint: "Format the amounts with toFixed(2)." },
            { pattern: "tipAmountEl|tipAmount|\\$|currency", hint: "Show the tip amount in its box." }
          ]
        }
      },
      {
        title: "Reset & Test",
        tagline: "Reset the form and test the whole flow.",
        goal: "Make the Reset button clear the form, then test several combinations.",
        logic: [
          "Clear the inputs on Reset.",
          "Reset the displayed amounts to 0.00.",
          "Remove the active class from all tip buttons.",
          "Test a few bill and tip combinations."
        ],
        logicCode: [
          "// 1. Clear the inputs",
          "billInput.value = '';",
          "customTip.value = '';",
          "peopleInput.value = '1';",
          "",
          "// 2. Reset the displayed amounts",
          "tipAmountEl.textContent = '$0.00';",
          "totalAmountEl.textContent = '$0.00';",
          "perPersonEl.textContent = '$0.00';",
          "",
          "// 3. Remove active from all tip buttons",
          "tipButtons.forEach((btn) => btn.classList.remove('active'));"
        ],
        think: "Why should Reset also clear the highlighted tip button?",
        hints: [
          "resetBtn.addEventListener('click', ...) wires the handler.",
          "Set every input back to its initial value.",
          "A $50 bill at 10% split two ways is a good test case."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*resetBtn", hint: "Select the Reset button: const resetBtn = document.getElementById('resetBtn');" },
            { pattern: "\\.value\\s*=\\s*['\"]?['\"]?|\\.value\\s*=\\s*''", hint: "Clear the inputs by setting .value = ''." },
            { pattern: "classList\\.remove", hint: "Clear the active class from the tip buttons." },
            { pattern: "textContent\\s*=", hint: "Reset the displayed amounts." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Tip Calculator</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <div class="header">',
        "            <h1>Tip <span>Calculator</span></h1>",
        "            <p>Calculate tip amount and total bill easily.</p>",
        "        </div>",
        '        <div class="main">',
        '            <div class="left">',
        "                <label>Bill Amount</label>",
        '                <input type="number" id="billInput" placeholder="Enter bill amount">',
        "                <label>Select Tip</label>",
        '                <div class="tip-buttons">',
        '                    <button class="tip-btn">5%</button>',
        '                    <button class="tip-btn">10%</button>',
        '                    <button class="tip-btn">15%</button>',
        '                    <button class="tip-btn">20%</button>',
        '                    <button class="tip-btn">25%</button>',
        "                </div>",
        "                <label>Custom Tip (%)</label>",
        '                <input type="number" id="customTip" placeholder="Custom percentage">',
        "                <label>Number of People</label>",
        '                <input type="number" id="peopleInput" value="1" min="1">',
        '                <button id="calculateBtn">Calculate</button>',
        "            </div>",
        '            <div class="right">',
        "                <h2>Your Results</h2>",
        '                <div class="result-card"><h3>Tip Amount</h3><h1 id="tipAmount">$0.00</h1></div>',
        '                <div class="result-card"><h3>Total Amount</h3><h1 id="totalAmount">$0.00</h1></div>',
        '                <div class="result-card"><h3>Per Person</h3><h1 id="perPerson">$0.00</h1></div>',
        '                <button id="resetBtn">Reset</button>',
        "            </div>",
        "        </div>",
        "    </div>",
        "  </main>",
        '  <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  padding: 24px;",
        "  background: #f9fafb;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".container {",
        "  width: 100%;",
        "  max-width: 760px;",
        "  padding: 32px;",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 20px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".header { text-align: center; margin-bottom: 24px; }",
        ".header h1 { color: #111827; }",
        ".header span { color: #2563eb; }",
        ".header p { color: #6b7280; }",
        "",
        ".main {",
        "  display: grid;",
        "  grid-template-columns: 1fr 1fr;",
        "  gap: 24px;",
        "}",
        "",
        ".left { display: flex; flex-direction: column; gap: 10px; }",
        "",
        "label { color: #374151; font-weight: 600; font-size: 0.9rem; }",
        "",
        "input[type='number'] {",
        "  width: 100%;",
        "  padding: 12px;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 10px;",
        "  font-size: 1rem;",
        "  outline: none;",
        "}",
        "",
        "input[type='number']:focus { border-color: #2563eb; }",
        "",
        ".tip-buttons {",
        "  display: flex;",
        "  gap: 8px;",
        "  flex-wrap: wrap;",
        "}",
        "",
        ".tip-btn {",
        "  flex: 1;",
        "  min-width: 60px;",
        "  padding: 10px;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 8px;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        ".tip-btn.active { background: #2563eb; color: #fff; border-color: #2563eb; }",
        "",
        "button {",
        "  border: none;",
        "  padding: 14px;",
        "  border-radius: 10px;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        "#calculateBtn { background: #2563eb; color: #fff; }",
        "#resetBtn { background: #f3f4f6; color: #111827; margin-top: 10px; }",
        "",
        ".right { display: flex; flex-direction: column; gap: 10px; }",
        ".right h2 { color: #111827; font-size: 1.1rem; }",
        "",
        ".result-card {",
        "  padding: 18px;",
        "  background: #f3f4f6;",
        "  border-radius: 12px;",
        "  text-align: center;",
        "}",
        "",
        ".result-card h3 { color: #6b7280; font-size: 0.85rem; }",
        ".result-card h1 { color: #2563eb; font-size: 1.8rem; }",
        "",
        "@media (max-width: 600px) {",
        "  .main { grid-template-columns: 1fr; }",
        "  .container { padding: 22px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   The bill (#billInput), tip buttons (.tip-btn), custom tip (#customTip), people (#peopleInput),",
        "//   Calculate (#calculateBtn), Reset (#resetBtn) and the results (#tipAmount, #totalAmount, #perPerson)",
        "//   style.css is complete — the layout and colors are done for you",
        "",
        "// Step 2: Select the elements",
        "//   Grab the inputs, buttons and result boxes once with getElementById / querySelectorAll",
        "",
        "// Step 3: Pick a tip",
        "//   Loop over the tip buttons, highlight the clicked one and store its percentage",
        "",
        "// Step 4: Read & validate inputs",
        "//   Convert the values with parseFloat / parseInt and guard against zero or missing inputs",
        "",
        "// Step 5: Calculate the results",
        "//   tip = bill * tip / 100, total = bill + tip, perPerson = total / people",
        "",
        "// Step 6: Display the results",
        "//   Write the formatted amounts into the three result boxes with textContent",
        "",
        "// Step 7: Reset & test",
        "//   Clear the inputs and amounts on Reset, then test a few combinations"
      ].join("\n")
    }
  },

  "blog-website": {
    slug: "blog-website",
    folder: "blog website",
    title: "Blog Website",
    difficulty: "Intermediate",
    time: "45 min",
    category: "Full-Stack",
    tags: ["HTML", "DOM", "Data"],
    intro: "Build a blog website that stores articles as data and renders them as cards with categories and a full-article detail view. You'll practice structuring HTML, rendering content from JavaScript data, filtering by category, and swapping views in the DOM.",
    previewNote: "You'll build a blog that keeps its articles in a JavaScript array, renders each one as a card, lets visitors filter by category, and opens any article in a detail view — all without a single page reload.",
    cover: "../../assets/project-covers/blog-website.png",
    previewUrl: "../../../JS%20PROJECTS/blog%20website/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Keep the article data in one array so rendering and filtering share the same source of truth.",
      "Render cards with a loop (forEach or map) so adding a new article automatically appears on the page.",
      "Give every article a category property — filtering is just a matter of comparing it.",
      "Hide and show the list and detail views instead of rebuilding the whole page.",
      "console.log() the array you're rendering when a card looks wrong — the data is usually the culprit."
    ],
    concepts: [
      "Structuring HTML with semantic sections",
      "Storing content as JavaScript data (arrays of objects)",
      "Rendering lists to the DOM with loops",
      "Filtering data by category",
      "Switching views dynamically with hidden state"
    ],
    challenge: "Extra challenge: add an article count per category on the filter buttons, or a 'Newest first' sort button.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the article list (#articleList), the category buttons (#categoryNav) and the detail view (#articleDetail).",
          "Open style.css — the layout and card styles are already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see an empty article list."
        ],
        logicCode: [
          "// 1. index.html — find #articleList, #categoryNav and #articleDetail",
          "// 2. style.css — layout and card styles are already done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — the article list is empty"
        ],
        think: "Which element IDs will your JavaScript need to select to render and filter articles?",
        hints: [
          "The article cards go inside #articleList.",
          "The category buttons live in #categoryNav.",
          "The detail view is #articleDetail — it starts hidden."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const articleList = document.getElementById('articleList')." }
          ]
        }
      },
      {
        title: "Define Article Data",
        tagline: "Store your articles as data.",
        goal: "Create an array of article objects — each with a title, category and content — so the page can be generated from data.",
        logic: [
          "Create an array named articles.",
          "Add 3-4 article objects inside it.",
          "Give each article a title property.",
          "Give each article a category and some content text."
        ],
        logicCode: [
          "// 1. Create an array of articles",
          "const articles = [",
          "  {",
          "    // 2. Add a title property",
          "    title: 'Getting Started with JavaScript',",
          "    // 3. Add a category property",
          "    category: 'JavaScript',",
          "    // 4. Add the article content",
          "    content: 'JavaScript brings your pages to life...'",
          "  },",
          "  // ... add a few more articles",
          "];"
        ],
        think: "Why is it better to store the blog's content as data instead of writing it directly in the HTML?",
        hints: [
          "Each article is an object with keys like title, category and content.",
          "Keep all of them inside one array named articles.",
          "Add at least 3 articles so filtering has something to show."
        ],
        check: {
          requires: [
            { pattern: "(const|let|var)\\s+articles", hint: "Create an array: const articles = [ ... ];" },
            { pattern: "title\\s*:", hint: "Each article needs a title property, e.g. title: 'My First Post'." },
            { pattern: "category\\s*:", hint: "Each article needs a category property, e.g. category: 'JavaScript'." }
          ]
        }
      },
      {
        title: "Render Article Cards",
        tagline: "Generate the article list from data.",
        goal: "Loop over the articles array and build a card for each one inside the article list.",
        logic: [
          "Write a function that renders the articles.",
          "Clear the list before rendering.",
          "Loop over the articles array.",
          "Create a card element for each article and append it."
        ],
        logicCode: [
          "// 1. Write a render function",
          "function renderArticles(list) {",
          "  // 2. Clear the container first",
          "  articleList.innerHTML = '';",
          "  // 3. Loop over the articles",
          "  list.forEach((article) => {",
          "    // 4. Build a card and add it to the page",
          "    const card = document.createElement('article');",
          "    card.innerHTML = article.title + ' <span>' + article.category + '</span>';",
          "    articleList.appendChild(card);",
          "  });",
          "}"
        ],
        think: "Why clear the list with innerHTML = '' before rendering again?",
        hints: [
          "createElement('article') makes a new card element.",
          "textContent (or innerHTML) sets the card's text.",
          "appendChild() adds the finished card to #articleList."
        ],
        check: {
          requires: [
            { pattern: "(forEach|map|\\.\\.\\.|for\\s*\\()", hint: "Loop over the articles — forEach is the cleanest way." },
            { pattern: "(createElement|innerHTML|insertAdjacentHTML)", hint: "Build each card with createElement or a template string assigned to innerHTML." },
            { pattern: "(appendChild|innerHTML\\s*\\+=)", hint: "Add each finished card to the article list with appendChild()." }
          ]
        }
      },
      {
        title: "Filter by Category",
        tagline: "Make the category buttons work.",
        goal: "When a category button is clicked, re-render the list with only the articles in that category.",
        logic: [
          "Listen for clicks on every category button.",
          "Read which category the clicked button represents.",
          "Filter the articles array by that category.",
          "Re-render the list with the filtered articles."
        ],
        logicCode: [
          "// 1. Listen for clicks on the category buttons",
          "categoryNav.addEventListener('click', (e) => {",
          "  // 2. Read the clicked button's category",
          "  const category = e.target.dataset.category;",
          "  // 3. Filter the articles",
          "  const filtered = category === 'All' ? articles : articles.filter(a => a.category === category);",
          "  // 4. Re-render with the filtered list",
          "  renderArticles(filtered);",
          "});"
        ],
        think: "How does the clicked button tell you which category it belongs to?",
        hints: [
          "data-category on each button stores its category name.",
          "e.target.dataset.category reads it on click.",
          "Array.filter() keeps only the articles that match."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "Attach a click listener to the category buttons." },
            { pattern: "(dataset|getAttribute\\([^)]*category)", hint: "Read the clicked category, e.g. e.target.dataset.category." },
            { pattern: "\\.filter\\s*\\(", hint: "Use array.filter() to keep only matching articles." }
          ]
        }
      },
      {
        title: "Article Detail View",
        tagline: "Open an article to read it fully.",
        goal: "Clicking a card should hide the list and show that article's full content in the detail view.",
        logic: [
          "Listen for clicks on article cards.",
          "Find the article that was clicked.",
          "Fill the detail view with its title and content.",
          "Hide the list and show the detail view."
        ],
        logicCode: [
          "// 1. Listen for clicks on the list",
          "articleList.addEventListener('click', (e) => {",
          "  // 2. Find which card was clicked",
          "  const card = e.target.closest('.card');",
          "  // 3. Look up the article by its data",
          "  const article = articles.find(a => a.title === card.dataset.title);",
          "  // 4. Fill the detail view and swap screens",
          "  detailTitle.textContent = article.title;",
          "  detailContent.textContent = article.content;",
          "  articleList.hidden = true;",
          "  articleDetail.hidden = false;",
          "});"
        ],
        think: "What should the Back button do when the detail view is open?",
        hints: [
          "Store a reference to the clicked article — a data attribute or the array index both work.",
          "Set detailTitle.textContent and detailContent.textContent.",
          "Toggle .hidden on the list and the detail view to switch screens."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "Attach a click listener so cards respond to clicks." },
            { pattern: "(hidden\\s*=\\s*(true|false)|classList)", hint: "Hide the list and show the detail view by toggling .hidden." },
            { pattern: "(textContent|innerHTML)\\s*=", hint: "Write the article's title and content into the detail view elements." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the whole flow.",
        goal: "Test every feature — rendering, filtering and the detail view — and polish anything that feels off.",
        logic: [
          "Open the page — do all article cards render?",
          "Click each category — does the list filter correctly?",
          "Open an article — does the detail view show the right content?",
          "Use the Back button — does it return to the filtered list?"
        ],
        logicCode: [
          "// 1. Open the page — do all article cards render?",
          "// 2. Click each category — does the list filter correctly?",
          "// 3. Open an article — does the detail view show the right content?",
          "// 4. Click Back — does it return to the list?"
        ],
        think: "What happens if two articles share the same title — how could you tell them apart?",
        hints: [
          "Test all three categories plus the 'All' filter.",
          "If cards don't appear, console.log() the array you're rendering.",
          "Make sure the Back button returns to the (still filtered) list."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one click listener should drive the UI (filter or detail view)." },
            { pattern: "(textContent|innerHTML)", hint: "Render article content into the page with textContent or innerHTML." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Blog Website</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <header class="blog-header">',
        "            <h1>My Dev Blog</h1>",
        '            <p class="subtitle">Stories from a developer\'s journey</p>',
        "        </header>",
        '        <nav class="category-nav" id="categoryNav">',
        '            <button class="cat-btn active" data-category="All">All</button>',
        '            <button class="cat-btn" data-category="JavaScript">JavaScript</button>',
        '            <button class="cat-btn" data-category="CSS">CSS</button>',
        '            <button class="cat-btn" data-category="Career">Career</button>',
        "        </nav>",
        '        <section class="articles" id="articleList">',
        "            <!-- Article cards go here (rendered by JavaScript) -->",
        "        </section>",
        '        <section class="article-detail" id="articleDetail" hidden>',
        '            <button class="btn" id="backBtn">← Back to articles</button>',
        '            <h2 id="detailTitle"></h2>',
        '            <p class="detail-meta" id="detailMeta"></p>',
        '            <p class="detail-content" id="detailContent"></p>',
        "        </section>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".container {",
        "  width: min(860px, 100%);",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  padding: 40px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".blog-header { margin-bottom: 24px; }",
        ".blog-header h1 { font-size: 2.2rem; }",
        ".subtitle { color: #6b7280; margin-top: 6px; }",
        "",
        ".category-nav { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; }",
        "",
        ".cat-btn {",
        "  border: 1px solid #e5e7eb;",
        "  background: #ffffff;",
        "  color: #374151;",
        "  padding: 8px 16px;",
        "  border-radius: 9999px;",
        "  font-size: 0.9rem;",
        "  cursor: pointer;",
        "  transition: all 0.15s ease;",
        "}",
        "",
        ".cat-btn:hover { border-color: #2563eb; color: #2563eb; }",
        ".cat-btn.active { background: #2563eb; border-color: #2563eb; color: #fff; }",
        "",
        ".articles { display: grid; gap: 16px; }",
        "",
        ".card {",
        "  padding: 20px;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 14px;",
        "  cursor: pointer;",
        "  transition: all 0.15s ease;",
        "}",
        "",
        ".card:hover {",
        "  border-color: #2563eb;",
        "  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.1);",
        "}",
        "",
        ".card h3 { margin-bottom: 6px; }",
        ".card .cat-chip {",
        "  display: inline-block;",
        "  font-size: 0.75rem;",
        "  color: #2563eb;",
        "  background: #eff6ff;",
        "  padding: 3px 10px;",
        "  border-radius: 9999px;",
        "}",
        ".card .excerpt { color: #6b7280; margin-top: 10px; font-size: 0.95rem; }",
        "",
        ".article-detail h2 { margin: 16px 0 8px; }",
        ".detail-meta { color: #2563eb; font-size: 0.85rem; }",
        ".detail-content { color: #374151; line-height: 1.7; margin-top: 12px; }",
        "",
        ".btn {",
        "  border: 1px solid #e5e7eb;",
        "  background: #ffffff;",
        "  color: #374151;",
        "  padding: 8px 16px;",
        "  border-radius: 10px;",
        "  cursor: pointer;",
        "  font-size: 0.9rem;",
        "}",
        ".btn:hover { border-color: #2563eb; color: #2563eb; }",
        "",
        "@media (max-width: 480px) {",
        "  .container { padding: 24px 18px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the article list (#articleList), category buttons (#categoryNav)",
        "//   and a hidden detail view (#articleDetail)",
        "//   style.css is complete — the layout and card styles are done for you",
        "",
        "// Step 2: Define article data",
        "//   Create an articles array — each article is an object with",
        "//   title, category and content properties",
        "",
        "// Step 3: Render article cards",
        "//   Write a render function that clears #articleList, loops over an array,",
        "//   builds a card per article, and appends it to the page",
        "",
        "// Step 4: Filter by category",
        "//   Listen for clicks on the category buttons, read the clicked category,",
        "//   filter the articles array, and re-render with the result",
        "",
        "// Step 5: Article detail view",
        "//   When a card is clicked, fill #articleDetail with the article's title",
        "//   and content, then hide the list and show the detail view",
        "",
        "// Step 6: Final touch & test",
        "//   Test rendering, filtering and the detail view — then polish the flow"
      ].join("\n")
    }
  },

  "chat-app": {
    slug: "chat-app",
    folder: "chat-app",
    title: "Chat App",
    difficulty: "Intermediate",
    time: "40 min",
    category: "Full-Stack",
    tags: ["DOM", "Events", "State"],
    intro: "Build a chat interface where messages render as conversation bubbles. You'll manage a messages array, handle form submits, render messages to the DOM, and update the UI dynamically as new messages arrive.",
    previewNote: "You'll build a working chat window: type a message, send it, and it appears as a bubble — followed by an automatic reply that keeps the conversation going.",
    cover: "../../assets/project-covers/chat-app.png",
    previewUrl: "../../../JS%20PROJECTS/chat-app/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Keep all messages in one array — rendering and state always stay in sync.",
      "Store each message as an object with text and who sent it, so your styles know which bubble to draw.",
      "Clear the input after sending, and keep focus in it for a smooth experience.",
      "Scroll the messages container to the bottom after rendering so new messages are always visible.",
      "Use a short setTimeout() to simulate a reply arriving — it makes the UI feel alive."
    ],
    concepts: [
      "DOM selection and manipulation",
      "Event handling (submit and click)",
      "Managing state with an array of message objects",
      "Rendering lists dynamically",
      "Simulating async behavior with setTimeout()"
    ],
    challenge: "Extra challenge: add a typing indicator that shows for a second before the reply appears.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the messages container (#messages), the form (#chatForm) and the input (#messageInput).",
          "Open style.css — the chat layout and bubble styles are already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see an empty chat window."
        ],
        logicCode: [
          "// 1. index.html — find #messages, #chatForm and #messageInput",
          "// 2. style.css — chat layout and bubble styles are done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — the chat window is empty"
        ],
        think: "Which element IDs will your JavaScript need to select to send and render messages?",
        hints: [
          "Messages render inside #messages.",
          "The form is #chatForm — its submit event sends a message.",
          "The input is #messageInput — read its value to get the message text."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const messagesEl = document.getElementById('messages')." }
          ]
        }
      },
      {
        title: "Message State",
        tagline: "Set up the messages array.",
        goal: "Create an array that will hold every message, each with its text and who sent it.",
        logic: [
          "Create an array named messages.",
          "Give each message a text property.",
          "Give each message a from property to say who sent it.",
          "Seed the array with one welcome message."
        ],
        logicCode: [
          "// 1. Create the messages array",
          "const messages = [",
          "  {",
          "    // 2. The message text",
          "    text: 'Welcome to the chat!',",
          "    // 3. Who sent it ('me' or 'them')",
          "    from: 'them'",
          "  }",
          "];"
        ],
        think: "Why store 'who sent it' on every message instead of styling every bubble the same?",
        hints: [
          "Each message is an object with text and from keys.",
          "Seed the array with at least one message so the chat isn't empty on load.",
          "The from value will decide which bubble style to use later."
        ],
        check: {
          requires: [
            { pattern: "(const|let|var)\\s+messages", hint: "Create an array: const messages = [ ... ];" },
            { pattern: "text\\s*:", hint: "Each message needs a text property, e.g. text: 'Hello!'." }
          ]
        }
      },
      {
        title: "Send a Message",
        tagline: "Handle the form submit.",
        goal: "When the form is submitted, read the input, add the message to the array, and clear the input.",
        logic: [
          "Listen for the submit event on the form.",
          "Prevent the page from reloading.",
          "Read the value of the input and trim it.",
          "Push a new message object and clear the input."
        ],
        logicCode: [
          "// 1. Listen for form submit",
          "chatForm.addEventListener('submit', (e) => {",
          "  // 2. Stop the page reload",
          "  e.preventDefault();",
          "  // 3. Read the input value",
          "  const text = messageInput.value.trim();",
          "  if (!text) return;",
          "  // 4. Add the message and clear the input",
          "  messages.push({ text, from: 'me' });",
          "  messageInput.value = '';",
          "});"
        ],
        think: "Why call e.preventDefault() on a form submit?",
        hints: [
          "Attach the listener to the form: chatForm.addEventListener('submit', ...).",
          "e.preventDefault() stops the page from reloading.",
          "messageInput.value gives the typed text; set it to '' after sending."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']submit", hint: "Listen for the submit event on the form." },
            { pattern: "preventDefault", hint: "Call e.preventDefault() so the page doesn't reload." },
            { pattern: "\\.push\\s*\\(", hint: "Add the new message to the array with messages.push({ ... })." }
          ]
        }
      },
      {
        title: "Render Messages",
        tagline: "Draw the conversation on screen.",
        goal: "Loop over the messages array and render each one as a bubble in the messages container.",
        logic: [
          "Write a render function.",
          "Clear the container before rendering.",
          "Loop over the messages array.",
          "Create a bubble element per message and append it."
        ],
        logicCode: [
          "// 1. Write a render function",
          "function renderMessages() {",
          "  // 2. Clear the container",
          "  messagesEl.innerHTML = '';",
          "  // 3. Loop over the messages",
          "  messages.forEach((msg) => {",
          "    // 4. Build a bubble and append it",
          "    const bubble = document.createElement('div');",
          "    bubble.className = 'bubble ' + msg.from;",
          "    bubble.textContent = msg.text;",
          "    messagesEl.appendChild(bubble);",
          "  });",
          "  // Keep the newest message in view",
          "  messagesEl.scrollTop = messagesEl.scrollHeight;",
          "}"
        ],
        think: "How does the from value change which bubble style gets applied?",
        hints: [
          "createElement('div') makes a new bubble.",
          "Set bubble.className based on msg.from — 'bubble me' or 'bubble them'.",
          "bubble.textContent = msg.text writes the message text."
        ],
        check: {
          requires: [
            { pattern: "(forEach|map|for\\s*\\()", hint: "Loop over the messages array — forEach is the cleanest way." },
            { pattern: "(createElement|innerHTML|insertAdjacentHTML)", hint: "Build each bubble with createElement or innerHTML." },
            { pattern: "(appendChild|innerHTML\\s*\\+=)", hint: "Add each bubble to the messages container." }
          ]
        }
      },
      {
        title: "Simulate a Reply",
        tagline: "Make the chat feel alive.",
        goal: "After the user sends a message, schedule a reply that appears after a short delay.",
        logic: [
          "Call the render function after sending a message.",
          "Use setTimeout() to delay the reply.",
          "Push a reply message from 'them'.",
          "Re-render when the reply arrives."
        ],
        logicCode: [
          "// 1. Render right after sending",
          "renderMessages();",
          "// 2. Delay the reply",
          "setTimeout(() => {",
          "  // 3. Push a reply from the other side",
          "  messages.push({ text: 'Thanks for your message!', from: 'them' });",
          "  // 4. Render the new message",
          "  renderMessages();",
          "}, 1500);"
        ],
        think: "Why does the reply need a separate render call after it's pushed?",
        hints: [
          "setTimeout(fn, 1500) runs the reply code after 1.5 seconds.",
          "Push the reply with from: 'them' so it styles as the other side.",
          "Call renderMessages() again inside the timeout so the bubble appears."
        ],
        check: {
          requires: [
            { pattern: "setTimeout", hint: "Schedule the reply with setTimeout(fn, delay)." },
            { pattern: "\\.push\\s*\\(", hint: "Add the reply to the messages array inside the timeout." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the chat flow.",
        goal: "Test sending messages, rendering, and the delayed reply — then polish the experience.",
        logic: [
          "Open the page — is the welcome message visible?",
          "Send a few messages — do they appear as 'me' bubbles?",
          "Wait for the reply — does it appear as a 'them' bubble?",
          "Try sending an empty message — nothing should happen."
        ],
        logicCode: [
          "// 1. Open the page — is the welcome message visible?",
          "// 2. Send a few messages — do they appear as 'me' bubbles?",
          "// 3. Wait — does the reply appear as a 'them' bubble?",
          "// 4. Send an empty message — nothing should happen"
        ],
        think: "What could go wrong if you render before pushing the new message to the array?",
        hints: [
          "The scroll-to-bottom behavior keeps the newest message visible.",
          "If bubbles look identical, check the from value on each message.",
          "console.log(messages) after sending is a quick way to inspect state."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one listener should drive the chat (submit or click)." },
            { pattern: "(textContent|innerHTML)", hint: "Render message text into the page with textContent or innerHTML." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Chat App</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="chat-card">',
        '        <header class="chat-header">',
        "            <h1>Chat</h1>",
        '            <span class="online-dot"></span><span class="online-text">Online</span>',
        "        </header>",
        '        <div class="messages" id="messages">',
        "            <!-- Message bubbles go here (rendered by JavaScript) -->",
        "        </div>",
        '        <form class="chat-form" id="chatForm">',
        '            <input type="text" id="messageInput" placeholder="Type a message..." autocomplete="off">',
        '            <button type="submit" id="sendBtn">Send</button>',
        "        </form>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".chat-card {",
        "  width: min(520px, 100%);",
        "  height: 560px;",
        "  display: flex;",
        "  flex-direction: column;",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "  overflow: hidden;",
        "}",
        "",
        ".chat-header {",
        "  display: flex;",
        "  align-items: center;",
        "  gap: 8px;",
        "  padding: 18px 24px;",
        "  border-bottom: 1px solid #e5e7eb;",
        "}",
        "",
        ".chat-header h1 { font-size: 1.2rem; }",
        ".online-dot {",
        "  width: 8px;",
        "  height: 8px;",
        "  border-radius: 50%;",
        "  background: #16a34a;",
        "  margin-left: auto;",
        "}",
        ".online-text { color: #16a34a; font-size: 0.8rem; }",
        "",
        ".messages {",
        "  flex: 1;",
        "  overflow-y: auto;",
        "  padding: 20px 24px;",
        "  display: flex;",
        "  flex-direction: column;",
        "  gap: 10px;",
        "  background: #f9fafb;",
        "}",
        "",
        ".bubble {",
        "  max-width: 75%;",
        "  padding: 10px 14px;",
        "  border-radius: 16px;",
        "  font-size: 0.95rem;",
        "  line-height: 1.4;",
        "}",
        "",
        ".bubble.me {",
        "  align-self: flex-end;",
        "  background: #2563eb;",
        "  color: #ffffff;",
        "  border-bottom-right-radius: 4px;",
        "}",
        "",
        ".bubble.them {",
        "  align-self: flex-start;",
        "  background: #e5e7eb;",
        "  color: #111827;",
        "  border-bottom-left-radius: 4px;",
        "}",
        "",
        ".chat-form {",
        "  display: flex;",
        "  gap: 10px;",
        "  padding: 16px 24px;",
        "  border-top: 1px solid #e5e7eb;",
        "}",
        "",
        ".chat-form input {",
        "  flex: 1;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 9999px;",
        "  padding: 10px 16px;",
        "  font-size: 0.95rem;",
        "  font-family: inherit;",
        "  outline: none;",
        "}",
        "",
        ".chat-form input:focus { border-color: #2563eb; }",
        "",
        ".chat-form button {",
        "  border: none;",
        "  background: #2563eb;",
        "  color: #ffffff;",
        "  padding: 10px 20px;",
        "  border-radius: 9999px;",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        ".chat-form button:hover { background: #1d4ed8; }",
        "",
        "@media (max-width: 480px) {",
        "  .chat-card { height: 90vh; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the messages container (#messages), the form (#chatForm)",
        "//   and the message input (#messageInput)",
        "//   style.css is complete — the chat layout and bubble styles are done for you",
        "",
        "// Step 2: Set up message state",
        "//   Create a messages array — each message is an object with",
        "//   text and from properties ('me' or 'them')",
        "",
        "// Step 3: Send a message",
        "//   Listen for submit on the form, preventDefault(), read the input,",
        "//   push a new message, and clear the input",
        "",
        "// Step 4: Render messages",
        "//   Write a render function that clears #messages, loops over the array,",
        "//   builds a bubble per message (class depends on from), and appends it",
        "",
        "// Step 5: Simulate a reply",
        "//   After sending, use setTimeout() to push a reply from 'them'",
        "//   and re-render so the bubble appears",
        "",
        "// Step 6: Final touch & test",
        "//   Send messages, wait for the reply, and confirm the bubbles look right"
      ].join("\n")
    }
  },

  "ecommerce": {
    slug: "ecommerce",
    folder: "ecommerce",
    title: "E-commerce Store",
    difficulty: "Intermediate",
    time: "50 min",
    category: "Full-Stack",
    tags: ["Data", "DOM", "State"],
    intro: "Build a storefront that renders products from data, lets shoppers filter and search, and keeps a live cart with a running total. You'll practice data-driven rendering, filtering, and keeping the cart state in sync with the DOM.",
    previewNote: "You'll build a working store: products render from an array, category buttons and a search box filter them, and every Add to Cart click updates the cart count and total instantly.",
    cover: "../../assets/project-covers/ecommerce.png",
    previewUrl: "../../../JS%20PROJECTS/ecommerce/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Keep products in one array — rendering, filtering and the cart all read from the same data.",
      "Give every product an id so the cart can track it reliably.",
      "Re-render the product grid whenever the filter or search changes.",
      "Keep the cart as an array of { product, quantity } and recompute the total from it.",
      "Format prices with toFixed(2) so totals always show two decimals."
    ],
    concepts: [
      "Storing product data as arrays of objects",
      "Rendering product cards dynamically",
      "Filtering and searching data",
      "Managing cart state",
      "Updating the DOM with computed totals"
    ],
    challenge: "Extra challenge: add a quantity stepper on cart items, or disable the Add button when a product is out of stock.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the product grid (#productGrid), the filter buttons (#filterNav), the search input (#searchInput) and the cart summary (#cartCount, #cartTotal).",
          "Open style.css — the store layout and product card styles are already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see an empty product grid."
        ],
        logicCode: [
          "// 1. index.html — find #productGrid, #filterNav, #searchInput, #cartCount, #cartTotal",
          "// 2. style.css — store layout and product cards are done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — the product grid is empty"
        ],
        think: "Which element IDs will your JavaScript need to select to render products and update the cart?",
        hints: [
          "Products render inside #productGrid.",
          "Filter buttons live in #filterNav — they carry a data-category.",
          "The cart summary uses #cartCount and #cartTotal."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const productGrid = document.getElementById('productGrid')." }
          ]
        }
      },
      {
        title: "Product Data",
        tagline: "Store your products as data.",
        goal: "Create an array of product objects — each with a name, price and category — so the storefront can be generated from data.",
        logic: [
          "Create an array named products.",
          "Add 4-6 product objects inside it.",
          "Give each product a name and a price.",
          "Give each product a category and a small image (emoji works)."
        ],
        logicCode: [
          "// 1. Create the products array",
          "const products = [",
          "  {",
          "    // 2. Product name and price",
          "    name: 'Wireless Headphones',",
          "    price: 59.99,",
          "    // 3. Product category",
          "    category: 'Electronics',",
          "    // 4. A simple visual (emoji keeps it dependency-free)",
          "    emoji: '🎧'",
          "  },",
          "  // ... add a few more products",
          "];"
        ],
        think: "Why is it better to keep products as data instead of hard-coding every card in HTML?",
        hints: [
          "Each product is an object with name, price, category and emoji keys.",
          "Keep them all inside one array named products.",
          "Add products from at least two categories so filtering has something to show."
        ],
        check: {
          requires: [
            { pattern: "(const|let|var)\\s+products", hint: "Create an array: const products = [ ... ];" },
            { pattern: "price\\s*:", hint: "Each product needs a price property, e.g. price: 19.99." },
            { pattern: "category\\s*:", hint: "Each product needs a category property, e.g. category: 'Electronics'." }
          ]
        }
      },
      {
        title: "Render Products",
        tagline: "Generate the product grid from data.",
        goal: "Loop over the products array and build a card for each one inside the product grid.",
        logic: [
          "Write a function that renders products.",
          "Clear the grid before rendering.",
          "Loop over the products array.",
          "Build a card with an Add to Cart button for each product."
        ],
        logicCode: [
          "// 1. Write a render function",
          "function renderProducts(list) {",
          "  // 2. Clear the grid",
          "  productGrid.innerHTML = '';",
          "  // 3. Loop over the products",
          "  list.forEach((product) => {",
          "    // 4. Build a card",
          "    const card = document.createElement('div');",
          "    card.className = 'product-card';",
          "    card.innerHTML = product.emoji + ' <h3>' + product.name + '</h3>' +",
          "      '<p>$' + product.price.toFixed(2) + '</p>' +",
          "      '<button data-id=\"' + product.id + '\">Add to Cart</button>';",
          "    productGrid.appendChild(card);",
          "  });",
          "}"
        ],
        think: "Why clear the grid before rendering again?",
        hints: [
          "createElement('div') makes a new card element.",
          "innerHTML (or a template literal) fills the card with product info.",
          "appendChild() adds the finished card to #productGrid."
        ],
        check: {
          requires: [
            { pattern: "(forEach|map|for\\s*\\()", hint: "Loop over the products — forEach is the cleanest way." },
            { pattern: "(createElement|innerHTML|insertAdjacentHTML)", hint: "Build each card with createElement or innerHTML." },
            { pattern: "(appendChild|innerHTML\\s*\\+=)", hint: "Add each card to the product grid with appendChild()." }
          ]
        }
      },
      {
        title: "Filter & Search",
        tagline: "Let shoppers find products.",
        goal: "Make the category buttons and the search box filter which products are shown.",
        logic: [
          "Listen for clicks on the filter buttons.",
          "Read the clicked category from the button.",
          "Filter the products by that category and re-render.",
          "Listen for input on the search box and filter by name."
        ],
        logicCode: [
          "// 1. Listen for clicks on the filter buttons",
          "filterNav.addEventListener('click', (e) => {",
          "  // 2. Read the clicked category",
          "  const category = e.target.dataset.category;",
          "  // 3. Filter and re-render",
          "  const filtered = category === 'All' ? products : products.filter(p => p.category === category);",
          "  renderProducts(filtered);",
          "});",
          "// 4. Search box — filter by name as the user types",
          "searchInput.addEventListener('input', () => {",
          "  const term = searchInput.value.toLowerCase();",
          "  const found = products.filter(p => p.name.toLowerCase().includes(term));",
          "  renderProducts(found);",
          "});"
        ],
        think: "What should happen when the search box is empty?",
        hints: [
          "e.target.dataset.category reads the clicked button's category.",
          "Array.filter() keeps only the matching products.",
          "For search, compare p.name.toLowerCase() against the typed term."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "Attach listeners to the filter buttons and/or the search input." },
            { pattern: "\\.filter\\s*\\(", hint: "Use array.filter() to narrow down the products." },
            { pattern: "(dataset|toLowerCase|includes)", hint: "Read the category from the button, or match the name with toLowerCase() and includes()." }
          ]
        }
      },
      {
        title: "Cart State",
        tagline: "Track what's in the cart.",
        goal: "When Add to Cart is clicked, add the product to a cart array and update the count and total.",
        logic: [
          "Create a cart array to hold the chosen products.",
          "Listen for clicks on the product grid.",
          "Find which product's Add button was clicked.",
          "Push it into the cart and update the count and total."
        ],
        logicCode: [
          "// 1. Create the cart",
          "const cart = [];",
          "// 2. Listen for clicks on the grid",
          "productGrid.addEventListener('click', (e) => {",
          "  if (!e.target.matches('button')) return;",
          "  // 3. Find the product by its data-id",
          "  const product = products.find(p => p.id == e.target.dataset.id);",
          "  // 4. Add to cart and update the summary",
          "  cart.push(product);",
          "  cartCount.textContent = cart.length;",
          "  cartTotal.textContent = '$' + cart.reduce((sum, p) => sum + p.price, 0).toFixed(2);",
          "});"
        ],
        think: "Why recompute the total from the cart array instead of keeping a running sum?",
        hints: [
          "Listen on the grid and use e.target to find the clicked button.",
          "Find the product with array.find() using a data-id attribute.",
          "cart.reduce((sum, p) => sum + p.price, 0) totals the prices in one pass."
        ],
        check: {
          requires: [
            { pattern: "(const|let|var)\\s+cart", hint: "Create a cart array: const cart = [];" },
            { pattern: "\\.push\\s*\\(", hint: "Add the chosen product to the cart with cart.push(...)." },
            { pattern: "(reduce|\\+=|cart\\.length)", hint: "Update the count and total — cart.length for the count, and sum the prices for the total." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the storeflow.",
        goal: "Test rendering, filtering, search and the cart — then polish anything that feels off.",
        logic: [
          "Open the page — do all product cards render?",
          "Click each category — does the grid update?",
          "Type in the search box — do matching products appear?",
          "Add items to the cart — does the count and total update?"
        ],
        logicCode: [
          "// 1. Open the page — do all product cards render?",
          "// 2. Click each category — does the grid update?",
          "// 3. Type in the search box — do matching products appear?",
          "// 4. Add to cart — does the count and total update?"
        ],
        think: "What should happen if a search has no matches — how would you tell the shopper?",
        hints: [
          "Test every filter category plus the search box.",
          "console.log(cart) after adding to verify the cart state.",
          "If the total looks wrong, check that prices are numbers, not strings."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one listener should drive the store (filter, search or cart)." },
            { pattern: "(textContent|innerHTML)", hint: "Render product or cart data into the page with textContent or innerHTML." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>E-commerce Store</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <header class="store-header">',
        "            <h1>ShopHub</h1>",
        '            <div class="cart-summary">🛒 <span id="cartCount">0</span> items · <span id="cartTotal">$0.00</span></div>',
        "        </header>",
        '        <nav class="filter-nav" id="filterNav">',
        '            <button class="filter-btn active" data-category="All">All</button>',
        '            <button class="filter-btn" data-category="Electronics">Electronics</button>',
        '            <button class="filter-btn" data-category="Clothing">Clothing</button>',
        '            <button class="filter-btn" data-category="Home">Home</button>',
        "        </nav>",
        '        <input type="text" id="searchInput" class="search-input" placeholder="Search products..." autocomplete="off">',
        '        <section class="product-grid" id="productGrid">',
        "            <!-- Product cards go here (rendered by JavaScript) -->",
        "        </section>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".container {",
        "  width: min(960px, 100%);",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  padding: 32px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".store-header {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  align-items: center;",
        "  margin-bottom: 20px;",
        "}",
        "",
        ".store-header h1 { font-size: 1.8rem; }",
        ".cart-summary {",
        "  background: #eff6ff;",
        "  color: #1d4ed8;",
        "  padding: 8px 16px;",
        "  border-radius: 9999px;",
        "  font-size: 0.9rem;",
        "  font-weight: 600;",
        "}",
        "",
        ".filter-nav { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }",
        "",
        ".filter-btn {",
        "  border: 1px solid #e5e7eb;",
        "  background: #ffffff;",
        "  color: #374151;",
        "  padding: 7px 14px;",
        "  border-radius: 9999px;",
        "  font-size: 0.85rem;",
        "  cursor: pointer;",
        "}",
        "",
        ".filter-btn:hover { border-color: #2563eb; color: #2563eb; }",
        ".filter-btn.active { background: #2563eb; border-color: #2563eb; color: #fff; }",
        "",
        ".search-input {",
        "  width: 100%;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 12px;",
        "  padding: 10px 14px;",
        "  font-size: 0.95rem;",
        "  margin-bottom: 24px;",
        "  font-family: inherit;",
        "  outline: none;",
        "}",
        "",
        ".search-input:focus { border-color: #2563eb; }",
        "",
        ".product-grid {",
        "  display: grid;",
        "  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));",
        "  gap: 16px;",
        "}",
        "",
        ".product-card {",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 16px;",
        "  padding: 20px;",
        "  text-align: center;",
        "  transition: all 0.15s ease;",
        "}",
        "",
        ".product-card:hover {",
        "  border-color: #2563eb;",
        "  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.1);",
        "}",
        "",
        ".product-card .emoji { font-size: 2.5rem; display: block; margin-bottom: 8px; }",
        ".product-card h3 { font-size: 1rem; margin-bottom: 4px; }",
        ".product-card .price { color: #2563eb; font-weight: 700; margin-bottom: 12px; }",
        "",
        ".product-card button {",
        "  border: none;",
        "  background: #2563eb;",
        "  color: #ffffff;",
        "  padding: 8px 14px;",
        "  border-radius: 10px;",
        "  font-size: 0.85rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "  width: 100%;",
        "}",
        "",
        ".product-card button:hover { background: #1d4ed8; }",
        "",
        "@media (max-width: 480px) {",
        "  .container { padding: 20px 16px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the product grid (#productGrid), filter buttons (#filterNav),",
        "//   a search box (#searchInput) and the cart summary (#cartCount, #cartTotal)",
        "//   style.css is complete — the store layout and product cards are done for you",
        "",
        "// Step 2: Define product data",
        "//   Create a products array — each product is an object with",
        "//   id, name, price, category and emoji properties",
        "",
        "// Step 3: Render products",
        "//   Write a render function that clears #productGrid, loops over an array,",
        "//   builds a card per product (with an Add to Cart button), and appends it",
        "",
        "// Step 4: Filter & search",
        "//   Category buttons filter by category; the search box filters by name —",
        "//   both re-render the grid with the matching products",
        "",
        "// Step 5: Cart state",
        "//   On Add to Cart, push the product into a cart array and update",
        "//   #cartCount and #cartTotal (sum the prices with reduce)",
        "",
        "// Step 6: Final touch & test",
        "//   Test rendering, filtering, search and the cart — then polish the flow"
      ].join("\n")
    }
  },

  "expense-tracker": {
    slug: "expense-tracker",
    folder: "Expense-Tracker",
    title: "Expense Tracker",
    difficulty: "Intermediate",
    time: "45 min",
    category: "Core JS",
    tags: ["Forms", "Math", "DOM"],
    intro: "Build an expense tracker that records transactions from a form, validates the input, and calculates running totals. You'll practice form handling, data validation, calculations and keeping the DOM in sync with your data.",
    previewNote: "You'll build a working expense tracker: add a description and amount, see it appear in the transaction list, and watch the income, expense and balance totals update automatically.",
    cover: "../../assets/project-covers/expense-tracker.png",
    previewUrl: "../../../JS%20PROJECTS/Expense-Tracker/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Store every transaction as an object with description, amount and type.",
      "Validate before you save — reject empty descriptions and amounts that aren't positive numbers.",
      "Recompute the totals from the transactions array so they can never drift out of sync.",
      "Convert input values with parseFloat() — form inputs always return strings.",
      "Use toFixed(2) when displaying money so totals look clean."
    ],
    concepts: [
      "Form handling and submit events",
      "Input validation",
      "Storing data as an array of objects",
      "Calculating totals with reduce()",
      "Rendering lists and updating the DOM"
    ],
    challenge: "Extra challenge: add a delete button on each transaction, or a category dropdown that groups expenses in the list.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the form (#expenseForm), its inputs (#descInput, #amountInput), the list (#transactionList) and the totals (#totalIncome, #totalExpense, #balance).",
          "Open style.css — the layout and card styles are already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see an empty tracker."
        ],
        logicCode: [
          "// 1. index.html — find #expenseForm, #descInput, #amountInput, #transactionList",
          "// 2. style.css — layout and card styles are done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — the tracker is empty"
        ],
        think: "Which element IDs will your JavaScript need to select to add and display transactions?",
        hints: [
          "The form is #expenseForm — its submit event adds a transaction.",
          "Amounts come from #amountInput and descriptions from #descInput.",
          "Transactions render inside #transactionList."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const form = document.getElementById('expenseForm')." }
          ]
        }
      },
      {
        title: "Transaction Data",
        tagline: "Set up the transactions array.",
        goal: "Create an array that will hold every transaction as an object with a description, amount and type.",
        logic: [
          "Create an array named transactions.",
          "Give each transaction a description property.",
          "Give each transaction an amount property.",
          "Give each transaction a type property ('income' or 'expense')."
        ],
        logicCode: [
          "// 1. Create the transactions array",
          "const transactions = [",
          "  {",
          "    // 2. What the transaction was",
          "    description: 'Freelance work',",
          "    // 3. How much money moved",
          "    amount: 150,",
          "    // 4. Income or expense",
          "    type: 'income'",
          "  }",
          "];"
        ],
        think: "Why track the type of each transaction instead of only storing amounts?",
        hints: [
          "Each transaction is an object with description, amount and type keys.",
          "The type decides whether money comes in (income) or goes out (expense).",
          "Keep them all inside one array named transactions."
        ],
        check: {
          requires: [
            { pattern: "(const|let|var)\\s+transactions", hint: "Create an array: const transactions = [ ... ];" },
            { pattern: "description\\s*:", hint: "Each transaction needs a description property." },
            { pattern: "type\\s*:", hint: "Each transaction needs a type — 'income' or 'expense'." }
          ]
        }
      },
      {
        title: "Handle the Form",
        tagline: "Read and validate the inputs.",
        goal: "On submit, read the description and amount, validate them, and only accept valid transactions.",
        logic: [
          "Listen for the submit event on the form.",
          "Prevent the page from reloading.",
          "Read and trim the description and amount values.",
          "Show an error if either field is missing or invalid."
        ],
        logicCode: [
          "// 1. Listen for form submit",
          "expenseForm.addEventListener('submit', (e) => {",
          "  // 2. Stop the page reload",
          "  e.preventDefault();",
          "  // 3. Read the inputs",
          "  const description = descInput.value.trim();",
          "  const amount = parseFloat(amountInput.value);",
          "  // 4. Validate before saving",
          "  if (!description || isNaN(amount) || amount <= 0) {",
          "    errorMsg.hidden = false;",
          "    return;",
          "  }",
          "  errorMsg.hidden = true;",
          "});"
        ],
        think: "Why do you need parseFloat() on the amount input?",
        hints: [
          "Attach the listener to the form and call e.preventDefault().",
          "descInput.value.trim() removes accidental spaces from the description.",
          "parseFloat(amountInput.value) converts the string input to a number for math."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']submit", hint: "Listen for the submit event on the form." },
            { pattern: "preventDefault", hint: "Call e.preventDefault() so the page doesn't reload." },
            { pattern: "(parseFloat|Number\\s*\\()", hint: "Convert the amount input to a number with parseFloat() or Number()." }
          ]
        }
      },
      {
        title: "Add a Transaction",
        tagline: "Save and render the transaction.",
        goal: "When the form is valid, add the transaction to the array, render it in the list, and reset the form.",
        logic: [
          "Push the new transaction into the array.",
          "Write a render function for the list.",
          "Clear the list and loop over the transactions.",
          "Clear the inputs after adding."
        ],
        logicCode: [
          "// 1. Add the transaction to the array",
          "transactions.push({ description, amount, type });",
          "// 2. Render the list",
          "function renderTransactions() {",
          "  // 3. Clear and loop over the transactions",
          "  transactionList.innerHTML = '';",
          "  transactions.forEach((t) => {",
          "    const li = document.createElement('li');",
          "    li.textContent = t.description + ' — $' + t.amount.toFixed(2) + ' (' + t.type + ')';",
          "    transactionList.appendChild(li);",
          "  });",
          "}",
          "// 4. Reset the form",
          "descInput.value = '';",
          "amountInput.value = '';"
        ],
        think: "Why clear the list before re-rendering instead of appending each time?",
        hints: [
          "transactions.push({ description, amount, type }) adds the new entry.",
          "Loop over the array with forEach and build an li for each one.",
          "Reset the inputs (set .value to '') so the form is ready for the next entry."
        ],
        check: {
          requires: [
            { pattern: "\\.push\\s*\\(", hint: "Add the new transaction to the array with transactions.push(...)." },
            { pattern: "(forEach|map|for\\s*\\()", hint: "Loop over the transactions to render each one." },
            { pattern: "(createElement|innerHTML|insertAdjacentHTML)", hint: "Build each list item with createElement or innerHTML." }
          ]
        }
      },
      {
        title: "Calculate Totals",
        tagline: "Add up income, expenses and balance.",
        goal: "Compute the total income, total expense and balance from the transactions array and display them.",
        logic: [
          "Sum the amounts of income transactions.",
          "Sum the amounts of expense transactions.",
          "Compute the balance as income minus expenses.",
          "Write the three totals into their elements."
        ],
        logicCode: [
          "// 1. Sum the income",
          "const income = transactions",
          "  .filter(t => t.type === 'income')",
          "  .reduce((sum, t) => sum + t.amount, 0);",
          "// 2. Sum the expenses",
          "const expense = transactions",
          "  .filter(t => t.type === 'expense')",
          "  .reduce((sum, t) => sum + t.amount, 0);",
          "// 3. Balance = income - expense",
          "const balance = income - expense;",
          "// 4. Display the totals",
          "totalIncome.textContent = '$' + income.toFixed(2);",
          "totalExpense.textContent = '$' + expense.toFixed(2);",
          "balanceEl.textContent = '$' + balance.toFixed(2);"
        ],
        think: "Why use reduce() instead of manually adding each transaction?",
        hints: [
          "filter() first keeps only income (or only expense) transactions.",
          "reduce((sum, t) => sum + t.amount, 0) adds them all up.",
          "balance = income - expense — call this update after every render."
        ],
        check: {
          requires: [
            { pattern: "\\.reduce\\s*\\(", hint: "Use reduce() to total the amounts." },
            { pattern: "(income|expense)", hint: "Separate income from expenses when summing." },
            { pattern: "toFixed\\s*\\(", hint: "Format the totals with toFixed(2) for clean money display." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the tracker.",
        goal: "Test adding transactions, validation and totals — then polish anything that feels off.",
        logic: [
          "Open the page — do the seeded totals show?",
          "Add an income — does the list and totals update?",
          "Add an expense — does the balance go down?",
          "Try an empty or invalid entry — does the error show?"
        ],
        logicCode: [
          "// 1. Open the page — do the seeded totals show?",
          "// 2. Add an income — does the list and totals update?",
          "// 3. Add an expense — does the balance go down?",
          "// 4. Try an invalid entry — does the error show?"
        ],
        think: "What should happen when you add an expense larger than your income?",
        hints: [
          "Make sure updateTotals() runs after every add.",
          "Test negative and zero amounts — validation should block them.",
          "console.log(transactions) is a quick way to verify the data."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one listener should drive the tracker (form submit)." },
            { pattern: "(textContent|innerHTML)", hint: "Render transactions or totals into the page with textContent or innerHTML." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Expense Tracker</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <header class="tracker-header">',
        "            <h1>Expense Tracker</h1>",
        '            <p class="subtitle">Know where your money goes</p>',
        "        </header>",
        '        <section class="totals">',
        '            <div class="total-card"><span>Income</span><b id="totalIncome">$0.00</b></div>',
        '            <div class="total-card"><span>Expenses</span><b id="totalExpense">$0.00</b></div>',
        '            <div class="total-card"><span>Balance</span><b id="balance">$0.00</b></div>',
        "        </section>",
        '        <form class="expense-form" id="expenseForm">',
        '            <input type="text" id="descInput" placeholder="Description (e.g. Groceries)" autocomplete="off">',
        '            <input type="number" id="amountInput" placeholder="Amount" min="0" step="0.01">',
        '            <select id="typeSelect">',
        '                <option value="expense">Expense</option>',
        '                <option value="income">Income</option>',
        "            </select>",
        '            <button type="submit">Add</button>',
        "        </form>",
        '        <p class="error-msg" id="errorMsg" hidden>Please enter a description and a valid positive amount.</p>',
        '        <ul class="transaction-list" id="transactionList">',
        "            <!-- Transactions go here (rendered by JavaScript) -->",
        "        </ul>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".container {",
        "  width: min(720px, 100%);",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  padding: 32px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".tracker-header { margin-bottom: 20px; }",
        ".tracker-header h1 { font-size: 1.8rem; }",
        ".subtitle { color: #6b7280; margin-top: 4px; }",
        "",
        ".totals {",
        "  display: grid;",
        "  grid-template-columns: repeat(3, 1fr);",
        "  gap: 12px;",
        "  margin-bottom: 20px;",
        "}",
        "",
        ".total-card {",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 14px;",
        "  padding: 14px;",
        "  text-align: center;",
        "}",
        "",
        ".total-card span { display: block; color: #6b7280; font-size: 0.8rem; margin-bottom: 4px; }",
        ".total-card b { font-size: 1.15rem; }",
        "#totalIncome b, #totalIncome { color: #16a34a; }",
        "#totalExpense { color: #dc2626; }",
        "",
        ".expense-form {",
        "  display: flex;",
        "  gap: 10px;",
        "  margin-bottom: 12px;",
        "}",
        "",
        ".expense-form input,",
        ".expense-form select {",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 10px;",
        "  padding: 10px 12px;",
        "  font-size: 0.95rem;",
        "  font-family: inherit;",
        "  outline: none;",
        "}",
        "",
        ".expense-form input:focus, .expense-form select:focus { border-color: #2563eb; }",
        ".expense-form input:first-child { flex: 1; }",
        "",
        ".expense-form button {",
        "  border: none;",
        "  background: #2563eb;",
        "  color: #ffffff;",
        "  padding: 10px 18px;",
        "  border-radius: 10px;",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        ".error-msg { color: #dc2626; font-size: 0.85rem; margin-bottom: 12px; }",
        "",
        ".transaction-list { list-style: none; }",
        "",
        ".transaction-list li {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  padding: 12px 0;",
        "  border-bottom: 1px solid #f3f4f6;",
        "  font-size: 0.95rem;",
        "}",
        "",
        ".transaction-list li .amount.income { color: #16a34a; font-weight: 600; }",
        ".transaction-list li .amount.expense { color: #dc2626; font-weight: 600; }",
        "",
        "@media (max-width: 480px) {",
        "  .expense-form { flex-direction: column; }",
        "  .totals { grid-template-columns: 1fr; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the form (#expenseForm), its inputs (#descInput, #amountInput,",
        "//   #typeSelect), the list (#transactionList) and the totals (#totalIncome,",
        "//   #totalExpense, #balance)",
        "//   style.css is complete — the layout and cards are done for you",
        "",
        "// Step 2: Set up transaction data",
        "//   Create a transactions array — each transaction is an object with",
        "//   description, amount and type ('income' or 'expense') properties",
        "",
        "// Step 3: Handle the form",
        "//   Listen for submit, preventDefault(), read and trim the description,",
        "//   parse the amount, and validate before accepting the entry",
        "",
        "// Step 4: Add a transaction",
        "//   Push the valid transaction into the array, render it in the list,",
        "//   and reset the inputs",
        "",
        "// Step 5: Calculate totals",
        "//   Sum income and expenses with filter() + reduce(), compute the balance,",
        "//   and write the three totals into their elements with toFixed(2)",
        "",
        "// Step 6: Final touch & test",
        "//   Test adding income and expenses, invalid entries, and the totals"
      ].join("\n")
    }
  },

  "git-hub-profile-finder": {
    slug: "git-hub-profile-finder",
    folder: "Git-Hub-Profile-Finder",
    title: "GitHub Profile Finder",
    difficulty: "Intermediate",
    time: "45 min",
    category: "APIs & Data",
    tags: ["API", "Fetch", "JSON"],
    intro: "Build a GitHub profile finder that fetches real user data from the GitHub API and renders a profile card with stats and recent repositories. You'll practice fetch(), async/await, JSON handling and error handling.",
    previewNote: "You'll build a working profile finder: type a GitHub username, hit search, and see their avatar, bio, stats and latest repositories pulled live from the GitHub API.",
    cover: "../../assets/project-covers/git-hub-profile-finder.png",
    previewUrl: "../../../JS%20PROJECTS/Git-Hub-Profile-Finder/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "The GitHub API is open — no key needed for public user data: https://api.github.com/users/{username}",
      "Use async/await with fetch() to keep the code readable.",
      "Check response.ok — GitHub returns 404 when a user doesn't exist.",
      "response.json() converts the JSON response into a JavaScript object.",
      "Wrap the request in try/catch so network errors don't break the page."
    ],
    concepts: [
      "Making API requests with fetch()",
      "Writing async functions with await",
      "Handling JSON responses",
      "Rendering API data into the DOM",
      "Error handling with try/catch and status checks"
    ],
    challenge: "Extra challenge: show a loading spinner while the request is in flight, or cache recent searches in localStorage.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the search form (#searchForm), the input (#searchInput), the profile card (#profileCard) and the repos container (#repoList).",
          "Open style.css — the layout and card styles are already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see the search form."
        ],
        logicCode: [
          "// 1. index.html — find #searchForm, #searchInput, #profileCard, #repoList",
          "// 2. style.css — layout and card styles are done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see the search form"
        ],
        think: "Which element IDs will your JavaScript need to select to render a user profile?",
        hints: [
          "The form is #searchForm — submitting it triggers the fetch.",
          "The username comes from #searchInput.",
          "Profile info renders inside #profileCard and repos inside #repoList."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const searchForm = document.getElementById('searchForm')." }
          ]
        }
      },
      {
        title: "Search Handler",
        tagline: "Trigger a search on submit.",
        goal: "When the form is submitted, read the username and kick off the fetch — without reloading the page.",
        logic: [
          "Listen for the submit event on the form.",
          "Prevent the page from reloading.",
          "Read and trim the username from the input.",
          "Call a search function with that username."
        ],
        logicCode: [
          "// 1. Listen for form submit",
          "searchForm.addEventListener('submit', (e) => {",
          "  // 2. Stop the page reload",
          "  e.preventDefault();",
          "  // 3. Read the username",
          "  const username = searchInput.value.trim();",
          "  if (!username) return;",
          "  // 4. Kick off the fetch",
          "  getUser(username);",
          "});"
        ],
        think: "Why guard against an empty username before fetching?",
        hints: [
          "Attach the listener to the form and call e.preventDefault().",
          "searchInput.value.trim() cleans up the typed username.",
          "Skip the request if the username is empty."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']submit", hint: "Listen for the submit event on the form." },
            { pattern: "preventDefault", hint: "Call e.preventDefault() so the page doesn't reload." },
            { pattern: "\\.value", hint: "Read the username from the input, e.g. searchInput.value.trim()." }
          ]
        }
      },
      {
        title: "Fetch the User",
        tagline: "Request data from the GitHub API.",
        goal: "Write an async function that fetches the user's profile and their latest repositories from the GitHub API.",
        logic: [
          "Write an async function named getUser.",
          "Build the API URL with the username.",
          "Await fetch() and check response.ok.",
          "Await response.json() to get the data."
        ],
        logicCode: [
          "// 1. Async function to fetch a user",
          "async function getUser(username) {",
          "  // 2. Build the API URL",
          "  const url = 'https://api.github.com/users/' + encodeURIComponent(username);",
          "  // 3. Fetch and check the response",
          "  const response = await fetch(url);",
          "  if (!response.ok) throw new Error('User not found');",
          "  // 4. Parse the JSON",
          "  const data = await response.json();",
          "  renderProfile(data);",
          "}"
        ],
        think: "What does response.ok tell you before you try to read the JSON?",
        hints: [
          "The URL is 'https://api.github.com/users/' + the username.",
          "await fetch(url) returns the response — check response.ok first.",
          "await response.json() turns the body into a JavaScript object."
        ],
        check: {
          requires: [
            { pattern: "async", hint: "Make the function async so you can use await." },
            { pattern: "fetch\\s*\\(", hint: "Call fetch() with the GitHub API URL." },
            { pattern: "\\.json\\s*\\(", hint: "Parse the response with response.json()." }
          ]
        }
      },
      {
        title: "Handle Errors",
        tagline: "Fail gracefully when things go wrong.",
        goal: "Wrap the fetch in try/catch and show a friendly message when the user isn't found or the network fails.",
        logic: [
          "Wrap the request in a try block.",
          "Check the status — a 404 means the user doesn't exist.",
          "Catch the error and show a message.",
          "Hide the profile card when an error occurs."
        ],
        logicCode: [
          "// 1. Try the request",
          "try {",
          "  const response = await fetch(url);",
          "  // 2. 404 means no such user",
          "  if (response.status === 404) {",
          "    throw new Error('No user found with that username');",
          "  }",
          "  const data = await response.json();",
          "  renderProfile(data);",
          "} catch (err) {",
          "  // 3. Show the error message",
          "  errorMsg.textContent = err.message;",
          "  errorMsg.hidden = false;",
          "  // 4. Hide the profile card",
          "  profileCard.hidden = true;",
          "}"
        ],
        think: "Why is it important to handle errors in API code?",
        hints: [
          "Use try { ... } catch (err) { ... } around the fetch.",
          "A 404 status (or !response.ok) means the user wasn't found.",
          "Show err.message in an error element instead of letting it crash."
        ],
        check: {
          requires: [
            { pattern: "(try\\s*\\{|catch)", hint: "Wrap the request in try/catch so errors are handled." },
            { pattern: "(response\\.ok|response\\.status|===?\\s*404)", hint: "Check the response status — 404 means the user doesn't exist." },
            { pattern: "(errorMsg|errorMessage)", hint: "Show the error in an error element, e.g. errorMsg.textContent = err.message." }
          ]
        }
      },
      {
        title: "Render the Profile",
        tagline: "Display the user's data.",
        goal: "Fill the profile card with the user's avatar, name, bio and stats, and render their repositories.",
        logic: [
          "Set the avatar image source.",
          "Write the name, login and bio into their elements.",
          "Fill the stats (repos, followers, following).",
          "Loop over the repositories and render them as list items."
        ],
        logicCode: [
          "// 1. Avatar and identity",
          "avatar.src = data.avatar_url;",
          "nameEl.textContent = data.name || data.login;",
          "bioEl.textContent = data.bio || 'No bio available.';",
          "// 2. Stats",
          "reposCount.textContent = data.public_repos;",
          "followersCount.textContent = data.followers;",
          "followingCount.textContent = data.following;",
          "// 3. Show the card",
          "profileCard.hidden = false;",
          "errorMsg.hidden = true;"
        ],
        think: "Why use data.name || data.login for the display name?",
        hints: [
          "The avatar URL comes from data.avatar_url.",
          "Set .textContent for names, bio and stats.",
          "data.name can be null — fall back to data.login."
        ],
        check: {
          requires: [
            { pattern: "\\.src\\s*=", hint: "Set the avatar image source, e.g. avatar.src = data.avatar_url." },
            { pattern: "textContent\\s*=", hint: "Write profile data into elements with textContent." },
            { pattern: "(forEach|map|for\\s*\\()", hint: "Loop over the repositories to render each one." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the finder.",
        goal: "Test the full flow — searching, rendering and errors — and polish anything that feels off.",
        logic: [
          "Search a real username like 'octocat' — does the profile render?",
          "Search a nonsense username — does the error message appear?",
          "Check that the repo list shows several repositories.",
          "Try an empty search — nothing should happen."
        ],
        logicCode: [
          "// 1. Search 'octocat' — does the profile render?",
          "// 2. Search a nonsense name — does the error appear?",
          "// 3. Does the repo list show several repositories?",
          "// 4. Try an empty search — nothing should happen"
        ],
        think: "What happens to old profile data when a new search fails?",
        hints: [
          "GitHub's API is rate-limited — a few searches per minute is fine.",
          "If data doesn't appear, console.log(data) after response.json().",
          "Hide the card on error so stale profiles don't linger."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one listener should drive the search (form submit)." },
            { pattern: "fetch\\s*\\(", hint: "The page should make an API request with fetch()." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>GitHub Profile Finder</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <header class="finder-header">',
        "            <h1>GitHub Profile Finder</h1>",
        '            <p class="subtitle">Search any GitHub username</p>',
        "        </header>",
        '        <form class="search-form" id="searchForm">',
        '            <input type="text" id="searchInput" placeholder="e.g. octocat" autocomplete="off">',
        '            <button type="submit" id="searchBtn">Search</button>',
        "        </form>",
        '        <p class="error-msg" id="errorMsg" hidden></p>',
        '        <section class="profile-card" id="profileCard" hidden>',
        '            <img id="avatar" alt="User avatar">',
        '            <div class="identity">',
        '                <h2 id="nameEl">—</h2>',
        '                <a id="loginEl" href="#" target="_blank" rel="noopener">@—</a>',
        "            </div>",
        '            <p class="bio" id="bioEl"></p>',
        '            <div class="stats">',
        '                <div class="stat"><b id="reposCount">0</b><span>Repos</span></div>',
        '                <div class="stat"><b id="followersCount">0</b><span>Followers</span></div>',
        '                <div class="stat"><b id="followingCount">0</b><span>Following</span></div>',
        "            </div>",
        '            <h3>Latest Repositories</h3>',
        '            <ul class="repo-list" id="repoList"></ul>',
        "        </section>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".container {",
        "  width: min(680px, 100%);",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  padding: 32px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".finder-header { margin-bottom: 20px; }",
        ".finder-header h1 { font-size: 1.8rem; }",
        ".subtitle { color: #6b7280; margin-top: 4px; }",
        "",
        ".search-form { display: flex; gap: 10px; margin-bottom: 16px; }",
        "",
        ".search-form input {",
        "  flex: 1;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 10px;",
        "  padding: 10px 14px;",
        "  font-size: 0.95rem;",
        "  font-family: inherit;",
        "  outline: none;",
        "}",
        "",
        ".search-form input:focus { border-color: #2563eb; }",
        "",
        ".search-form button {",
        "  border: none;",
        "  background: #2563eb;",
        "  color: #ffffff;",
        "  padding: 10px 20px;",
        "  border-radius: 10px;",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        ".error-msg { color: #dc2626; font-size: 0.9rem; margin-bottom: 12px; }",
        "",
        ".profile-card { text-align: center; }",
        "",
        ".profile-card img {",
        "  width: 110px;",
        "  height: 110px;",
        "  border-radius: 50%;",
        "  border: 3px solid #e5e7eb;",
        "  margin-bottom: 12px;",
        "}",
        "",
        ".identity h2 { font-size: 1.4rem; }",
        ".identity a { color: #2563eb; text-decoration: none; font-size: 0.95rem; }",
        ".bio { color: #6b7280; margin: 10px 0 18px; }",
        "",
        ".stats {",
        "  display: flex;",
        "  justify-content: center;",
        "  gap: 24px;",
        "  margin-bottom: 20px;",
        "}",
        "",
        ".stat { display: flex; flex-direction: column; }",
        ".stat b { font-size: 1.2rem; }",
        ".stat span { color: #6b7280; font-size: 0.8rem; }",
        "",
        ".profile-card h3 { text-align: left; margin-bottom: 10px; }",
        "",
        ".repo-list { list-style: none; text-align: left; }",
        "",
        ".repo-list li {",
        "  padding: 12px 14px;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 10px;",
        "  margin-bottom: 8px;",
        "  font-size: 0.9rem;",
        "}",
        "",
        ".repo-list li a { color: #2563eb; text-decoration: none; font-weight: 600; }",
        ".repo-list li p { color: #6b7280; font-size: 0.85rem; margin-top: 4px; }",
        "",
        "@media (max-width: 480px) {",
        "  .stats { gap: 14px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the search form (#searchForm), the input (#searchInput),",
        "//   an error element (#errorMsg), the profile card (#profileCard) with its",
        "//   avatar/stats elements, and the repo list (#repoList)",
        "//   style.css is complete — the layout and card styles are done for you",
        "",
        "// Step 2: Search handler",
        "//   Listen for submit on the form, preventDefault(), read and trim the",
        "//   username, and call a search function",
        "",
        "// Step 3: Fetch the user",
        "//   Write an async function that fetches",
        "//   https://api.github.com/users/{username}, checks response.ok,",
        "//   and parses the JSON with response.json()",
        "",
        "// Step 4: Handle errors",
        "//   Wrap the request in try/catch, check the status for 404,",
        "//   and show a friendly message in #errorMsg on failure",
        "",
        "// Step 5: Render the profile",
        "//   Fill the avatar, name, login, bio and stats from the data,",
        "//   then loop over the repositories and render them in #repoList",
        "",
        "// Step 6: Final touch & test",
        "//   Test with a real username, a nonsense username, and an empty search"
      ].join("\n")
    }
  },

  "image-slider": {
    slug: "image-slider",
    folder: "Image SLider",
    title: "Image Slider",
    difficulty: "Beginner",
    time: "35 min",
    category: "Core JS",
    tags: ["Arrays", "DOM", "Events"],
    intro: "Build an image slider that cycles through a set of images with next/previous controls and navigation dots. You'll practice arrays, index-based state, event handling and updating the DOM as the slide changes.",
    previewNote: "You'll build a working image slider: a picture with a caption, Next and Previous buttons, a slide counter, and clickable dots that jump straight to any slide.",
    cover: "../../assets/project-covers/image-slider.png",
    previewUrl: "../../../JS%20PROJECTS/Image%20SLider/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Store every slide as an object with src, title and description.",
      "Keep a single currentIndex variable — everything else derives from it.",
      "Wrap the index with the modulo operator (%) so Next after the last slide returns to the first.",
      "Write one update() function and call it from every control — never duplicate the render logic.",
      "Reuse the same images array when building the dots so dots and slides always match."
    ],
    concepts: [
      "Storing slide data in arrays",
      "Managing state with an index variable",
      "Event handling for buttons and dots",
      "Updating the DOM when state changes",
      "Wrapping around with the modulo operator"
    ],
    challenge: "Extra challenge: add autoplay with setInterval(), or fade the image in as it changes.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the image (#image), the counter (#counter), the caption (#title, #description), the buttons (#prevBtn, #nextBtn) and the dots container (#dots).",
          "Open style.css — the slider layout and button styles are already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see an empty slide area."
        ],
        logicCode: [
          "// 1. index.html — find #image, #counter, #title, #description, #prevBtn, #nextBtn, #dots",
          "// 2. style.css — slider layout and button styles are done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — the slide area is empty"
        ],
        think: "Which element IDs will your JavaScript need to select to show a slide and its caption?",
        hints: [
          "The picture is <img id=\"image\"> — its src changes per slide.",
          "The caption uses #title and #description.",
          "Navigation lives in #prevBtn, #nextBtn and #dots."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const image = document.getElementById('image')." }
          ]
        }
      },
      {
        title: "Slide Data & State",
        tagline: "Store the slides and the current index.",
        goal: "Create an array of slide objects and a variable that tracks which slide is showing.",
        logic: [
          "Create an array named slides.",
          "Add 3-5 slide objects with src, title and description.",
          "Create a variable named currentIndex starting at 0.",
          "Keep the index in a let variable so it can change."
        ],
        logicCode: [
          "// 1. Create the slides array",
          "const slides = [",
          "  {",
          "    // 2. Each slide needs an image, title and description",
          "    src: 'https://picsum.photos/seed/mountain/800/450',",
          "    title: 'Mountain Retreat',",
          "    description: 'A serene mountain landscape at golden hour.'",
          "  },",
          "  // ... add a few more slides",
          "];",
          "// 3. Track the current slide",
          "let currentIndex = 0;"
        ],
        think: "Why must currentIndex be declared with let instead of const?",
        hints: [
          "Each slide is an object with src, title and description keys.",
          "Use picsum.photos/seed/... URLs so the images load without extra files.",
          "let currentIndex = 0 tracks which slide is visible — it changes as you navigate."
        ],
        check: {
          requires: [
            { pattern: "(const|let|var)\\s+slides", hint: "Create an array: const slides = [ ... ];" },
            { pattern: "(currentIndex|index)\\s*=\\s*0", hint: "Track the current slide with an index variable starting at 0." },
            { pattern: "(src|title|description)\\s*:", hint: "Each slide needs a src (and ideally title/description) property." }
          ]
        }
      },
      {
        title: "Render the Slide",
        tagline: "Draw the current slide.",
        goal: "Write an update function that shows the slide at currentIndex — image, counter, caption and active dot.",
        logic: [
          "Write a function named updateSlide.",
          "Set the image src from the current slide.",
          "Update the counter and caption.",
          "Mark the matching dot as active."
        ],
        logicCode: [
          "// 1. Write an update function",
          "function updateSlide() {",
          "  const slide = slides[currentIndex];",
          "  // 2. Set the image",
          "  image.src = slide.src;",
          "  // 3. Update counter and caption",
          "  counter.textContent = (currentIndex + 1) + ' / ' + slides.length;",
          "  title.textContent = slide.title;",
          "  description.textContent = slide.description;",
          "  // 4. Mark the active dot",
          "  dotsEl.querySelectorAll('.dot').forEach((dot, i) => {",
          "    dot.classList.toggle('active', i === currentIndex);",
          "  });",
          "}"
        ],
        think: "Why show currentIndex + 1 in the counter instead of currentIndex?",
        hints: [
          "image.src = slide.src swaps the picture.",
          "The counter shows (currentIndex + 1) because indices start at 0.",
          "Toggle the .active class on dots to highlight the current one."
        ],
        check: {
          requires: [
            { pattern: "\\.src\\s*=", hint: "Set the image source, e.g. image.src = slide.src." },
            { pattern: "textContent\\s*=", hint: "Update the counter or caption with textContent." },
            { pattern: "(currentIndex|index)", hint: "Read from the current index variable to know which slide to show." }
          ]
        }
      },
      {
        title: "Next & Previous",
        tagline: "Navigate through the slides.",
        goal: "Make the Next and Previous buttons move the index — wrapping around at both ends.",
        logic: [
          "Listen for clicks on the Next button.",
          "Increase the index by 1.",
          "Wrap around with the modulo operator.",
          "Call updateSlide after changing the index."
        ],
        logicCode: [
          "// 1. Next button",
          "nextBtn.addEventListener('click', () => {",
          "  // 2. Move forward",
          "  currentIndex = (currentIndex + 1) % slides.length;",
          "  // 3. Show the new slide",
          "  updateSlide();",
          "});",
          "// 4. Previous button — wrap backwards too",
          "prevBtn.addEventListener('click', () => {",
          "  currentIndex = (currentIndex - 1 + slides.length) % slides.length;",
          "  updateSlide();",
          "});"
        ],
        think: "How does (currentIndex + 1) % slides.length handle the last slide?",
        hints: [
          "Attach click listeners to #prevBtn and #nextBtn.",
          "(index + 1) % slides.length wraps forward past the last slide.",
          "(index - 1 + slides.length) % slides.length wraps backward from the first."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "Attach click listeners to the Next and Previous buttons." },
            { pattern: "(currentIndex|index)\\s*(\\+\\+|\\+=|--|-=)", hint: "Change the index when a button is clicked." },
            { pattern: "slides\\.length", hint: "Use slides.length to wrap the index around (modulo is the clean way)." }
          ]
        }
      },
      {
        title: "Navigation Dots",
        tagline: "Jump to any slide with a dot.",
        goal: "Create one dot per slide and make clicking a dot jump straight to that slide.",
        logic: [
          "Loop over the slides to create a dot for each.",
          "Append the dots to the dots container.",
          "Listen for clicks on the dots.",
          "Set the index to the clicked dot's position and update."
        ],
        logicCode: [
          "// 1. Build one dot per slide",
          "slides.forEach((slide, i) => {",
          "  const dot = document.createElement('button');",
          "  dot.className = 'dot';",
          "  // 2. Remember which slide this dot belongs to",
          "  dot.dataset.index = i;",
          "  dotsEl.appendChild(dot);",
          "});",
          "// 3. Listen for dot clicks",
          "dotsEl.addEventListener('click', (e) => {",
          "  if (!e.target.classList.contains('dot')) return;",
          "  // 4. Jump to that slide",
          "  currentIndex = Number(e.target.dataset.index);",
          "  updateSlide();",
          "});"
        ],
        think: "How does dataset.index tell you which slide a dot belongs to?",
        hints: [
          "createElement('button') makes each dot.",
          "Store the slide index with dot.dataset.index = i.",
          "On click, read e.target.dataset.index and set currentIndex to it."
        ],
        check: {
          requires: [
            { pattern: "(forEach|map|for\\s*\\()", hint: "Loop over the slides to create one dot per slide." },
            { pattern: "(createElement|innerHTML|insertAdjacentHTML)", hint: "Build each dot with createElement or innerHTML." },
            { pattern: "(dataset|data-index)", hint: "Store the slide position on each dot, e.g. dot.dataset.index = i." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the slider.",
        goal: "Test all controls — next, previous, dots — and make sure the slider wraps correctly.",
        logic: [
          "Open the page — does the first slide show?",
          "Click Next past the last slide — does it wrap to the first?",
          "Click Previous on the first slide — does it wrap to the last?",
          "Click each dot — does it jump to the right slide?"
        ],
        logicCode: [
          "// 1. Open the page — does the first slide show?",
          "// 2. Click Next past the last slide — does it wrap?",
          "// 3. Click Previous on the first — does it wrap?",
          "// 4. Click each dot — does it jump to the right slide?"
        ],
        think: "Why should updateSlide() be the only place that touches the DOM?",
        hints: [
          "Test the wrap-around in both directions.",
          "If the image doesn't load, check the src URLs in the slides array.",
          "Make sure updateSlide() runs once on page load so the slider isn't empty."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one control (button or dot) should have a click listener." },
            { pattern: "(updateSlide|update\\s*\\()", hint: "Extract the render logic into a function you call after every change." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Image Slider</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="slider">',
        '        <span class="counter" id="counter">1 / 5</span>',
        '        <div class="viewport">',
        '            <img id="image" src="" alt="Slide image">',
        '            <button class="nav-btn prev" id="prevBtn" aria-label="Previous image">‹</button>',
        '            <button class="nav-btn next" id="nextBtn" aria-label="Next image">›</button>',
        "        </div>",
        '        <nav class="dots" id="dots">',
        "            <!-- Dots go here (rendered by JavaScript) -->",
        "        </nav>",
        '        <div class="caption">',
        '            <h2 id="title"></h2>',
        '            <p id="description"></p>',
        "        </div>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".slider {",
        "  width: min(760px, 100%);",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  padding: 24px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "  text-align: center;",
        "}",
        "",
        ".counter {",
        "  display: inline-block;",
        "  background: #eff6ff;",
        "  color: #1d4ed8;",
        "  padding: 4px 14px;",
        "  border-radius: 9999px;",
        "  font-size: 0.85rem;",
        "  font-weight: 600;",
        "  margin-bottom: 14px;",
        "}",
        "",
        ".viewport {",
        "  position: relative;",
        "  border-radius: 16px;",
        "  overflow: hidden;",
        "  margin-bottom: 16px;",
        "}",
        "",
        ".viewport img {",
        "  width: 100%;",
        "  height: 380px;",
        "  object-fit: cover;",
        "  display: block;",
        "}",
        "",
        ".nav-btn {",
        "  position: absolute;",
        "  top: 50%;",
        "  transform: translateY(-50%);",
        "  width: 44px;",
        "  height: 44px;",
        "  border: none;",
        "  border-radius: 50%;",
        "  background: rgba(255, 255, 255, 0.9);",
        "  color: #111827;",
        "  font-size: 1.6rem;",
        "  line-height: 1;",
        "  cursor: pointer;",
        "  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);",
        "}",
        "",
        ".nav-btn:hover { background: #ffffff; }",
        ".nav-btn.prev { left: 14px; }",
        ".nav-btn.next { right: 14px; }",
        "",
        ".dots {",
        "  display: flex;",
        "  justify-content: center;",
        "  gap: 8px;",
        "  margin-bottom: 16px;",
        "}",
        "",
        ".dot {",
        "  width: 10px;",
        "  height: 10px;",
        "  border: none;",
        "  border-radius: 50%;",
        "  background: #d1d5db;",
        "  cursor: pointer;",
        "  padding: 0;",
        "}",
        "",
        ".dot.active { background: #2563eb; }",
        "",
        ".caption h2 { font-size: 1.3rem; margin-bottom: 6px; }",
        ".caption p { color: #6b7280; font-size: 0.95rem; }",
        "",
        "@media (max-width: 480px) {",
        "  .viewport img { height: 240px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the image (#image), counter (#counter), caption (#title,",
        "//   #description), the buttons (#prevBtn, #nextBtn) and the dots (#dots)",
        "//   style.css is complete — the slider layout and controls are done for you",
        "",
        "// Step 2: Slide data & state",
        "//   Create a slides array — each slide is an object with src, title and",
        "//   description — and a let currentIndex = 0 to track the visible slide",
        "",
        "// Step 3: Render the slide",
        "//   Write an updateSlide() that sets the image src, counter, caption",
        "//   and highlights the active dot",
        "",
        "// Step 4: Next & previous",
        "//   Next moves the index forward, Previous moves it back — wrap around",
        "//   with the modulo operator and call updateSlide()",
        "",
        "// Step 5: Navigation dots",
        "//   Create one dot per slide (dot.dataset.index = i), and on click",
        "//   jump to that slide",
        "",
        "// Step 6: Final touch & test",
        "//   Test next, previous, dots and the wrap-around — then polish"
      ].join("\n")
    }
  },

  "kanban-board": {
    slug: "kanban-board",
    folder: "kanban-board",
    title: "Kanban Board",
    difficulty: "Intermediate",
    time: "45 min",
    category: "Advanced",
    tags: ["DOM", "Events", "State"],
    intro: "Build a kanban board with three columns — To Do, In Progress and Done — where tasks can be added and moved between columns. You'll practice DOM manipulation, task state, event handling and dynamic UI updates.",
    previewNote: "You'll build a working kanban board: add a task to any column, see it render as a card, and move it between To Do, In Progress and Done with the arrow buttons.",
    cover: "../../assets/project-covers/kanban-board.png",
    previewUrl: "../../../JS%20PROJECTS/kanban-board/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Store every task as an object with an id, text and status (todo, doing or done).",
      "Keep all tasks in one array — each column renders only the tasks whose status matches.",
      "Generate a unique id for each task (Date.now() is a simple approach).",
      "Write one render() function and call it after every change — add, move or delete.",
      "Use event delegation: listen once on the board and read data attributes from the clicked button."
    ],
    concepts: [
      "Managing state with a tasks array",
      "Rendering tasks into columns by status",
      "Creating elements dynamically with createElement",
      "Event handling with delegation",
      "Updating state and re-rendering the UI"
    ],
    challenge: "Extra challenge: add a delete button per task, or save the board to localStorage so tasks survive a refresh.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the form (#taskForm), the input (#taskInput), the column select (#taskColumn) and the three task lists (#colTodo, #colDoing, #colDone).",
          "Open style.css — the board layout and column styles are already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see three empty columns."
        ],
        logicCode: [
          "// 1. index.html — find #taskForm, #taskInput, #taskColumn, #colTodo, #colDoing, #colDone",
          "// 2. style.css — board layout and column styles are done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — three empty columns"
        ],
        think: "Which element IDs will your JavaScript need to select to add tasks and render columns?",
        hints: [
          "The form is #taskForm — submitting it adds a task.",
          "The task text comes from #taskInput and the starting column from #taskColumn.",
          "Tasks render inside #colTodo, #colDoing and #colDone."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const taskForm = document.getElementById('taskForm')." }
          ]
        }
      },
      {
        title: "Task State",
        tagline: "Set up the tasks array.",
        goal: "Create an array that will hold every task as an object with an id, text and status.",
        logic: [
          "Create an array named tasks.",
          "Seed it with one or two example tasks.",
          "Give each task an id property.",
          "Give each task text and status properties."
        ],
        logicCode: [
          "// 1. Create the tasks array",
          "const tasks = [",
          "  {",
          "    // 2. A unique id (Date.now() is a simple generator)",
          "    id: Date.now(),",
          "    // 3. The task text",
          "    text: 'Plan the launch',",
          "    // 4. Which column it lives in: 'todo', 'doing' or 'done'",
          "    status: 'todo'",
          "  },",
          "  // ... add a second example task",
          "];"
        ],
        think: "Why does every task need a unique id?",
        hints: [
          "Each task is an object with id, text and status keys.",
          "Seed the array with at least one task so columns aren't empty.",
          "The status decides which column the task renders in."
        ],
        check: {
          requires: [
            { pattern: "(const|let|var)\\s+tasks", hint: "Create an array: const tasks = [ ... ];" },
            { pattern: "text\\s*:", hint: "Each task needs a text property." },
            { pattern: "status\\s*:", hint: "Each task needs a status — 'todo', 'doing' or 'done'." }
          ]
        }
      },
      {
        title: "Add a Task",
        tagline: "Create tasks from the form.",
        goal: "When the form is submitted, create a task object and add it to the tasks array.",
        logic: [
          "Listen for the submit event on the form.",
          "Prevent the page from reloading.",
          "Read the task text and the chosen column.",
          "Push a new task object into the array."
        ],
        logicCode: [
          "// 1. Listen for form submit",
          "taskForm.addEventListener('submit', (e) => {",
          "  // 2. Stop the page reload",
          "  e.preventDefault();",
          "  const text = taskInput.value.trim();",
          "  if (!text) return;",
          "  // 3. Read the chosen column",
          "  const status = taskColumn.value;",
          "  // 4. Add the task",
          "  tasks.push({ id: Date.now(), text, status });",
          "  taskInput.value = '';",
          "  render();",
          "});"
        ],
        think: "Why generate the id with Date.now() instead of a counter?",
        hints: [
          "Attach the listener to the form and call e.preventDefault().",
          "taskColumn.value holds the selected column.",
          "tasks.push({ id: Date.now(), text, status }) adds the task."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']submit", hint: "Listen for the submit event on the form." },
            { pattern: "preventDefault", hint: "Call e.preventDefault() so the page doesn't reload." },
            { pattern: "\\.push\\s*\\(", hint: "Add the new task to the array with tasks.push({ ... })." }
          ]
        }
      },
      {
        title: "Render Tasks",
        tagline: "Draw the board from the data.",
        goal: "Write a render function that places every task as a card in the column matching its status.",
        logic: [
          "Write a function named render.",
          "Clear all three columns.",
          "Loop over the tasks array.",
          "Append each task to the column that matches its status."
        ],
        logicCode: [
          "// 1. Write the render function",
          "function render() {",
          "  // 2. Clear the columns",
          "  [colTodo, colDoing, colDone].forEach((col) => { col.innerHTML = ''; });",
          "  // 3. Loop over the tasks",
          "  tasks.forEach((task) => {",
          "    // 4. Create a card",
          "    const card = document.createElement('div');",
          "    card.className = 'task-card';",
          "    card.innerHTML = task.text;",
          "    if (task.status === 'todo') colTodo.appendChild(card);",
          "    else if (task.status === 'doing') colDoing.appendChild(card);",
          "    else colDone.appendChild(card);",
          "  });",
          "}"
        ],
        think: "Why clear all columns before rendering?",
        hints: [
          "Clear each column with innerHTML = '' first.",
          "Loop over tasks and pick the column from task.status.",
          "appendChild() adds each card to the right column."
        ],
        check: {
          requires: [
            { pattern: "(forEach|map|for\\s*\\()", hint: "Loop over the tasks array to render each one." },
            { pattern: "(createElement|innerHTML|insertAdjacentHTML)", hint: "Build each card with createElement or innerHTML." },
            { pattern: "(status|colTodo|colDoing|colDone)", hint: "Place each card in the column matching its status." }
          ]
        }
      },
      {
        title: "Move Tasks",
        tagline: "Move cards between columns.",
        goal: "Add move buttons to each card so a task can be pushed to the next (or previous) column.",
        logic: [
          "Add a move button to each card with a data attribute.",
          "Listen for clicks on the board (event delegation).",
          "Find the task by its id.",
          "Update the task's status and re-render."
        ],
        logicCode: [
          "// 1. Add a move button to each card",
          "const btn = document.createElement('button');",
          "btn.dataset.id = task.id;",
          "btn.textContent = '→';",
          "card.appendChild(btn);",
          "// 2. Listen once on the board",
          "boardEl.addEventListener('click', (e) => {",
          "  const btn = e.target.closest('button[data-id]');",
          "  if (!btn) return;",
          "  // 3. Find the task",
          "  const task = tasks.find(t => t.id == btn.dataset.id);",
          "  // 4. Move it to the next column and re-render",
          "  if (task.status === 'todo') task.status = 'doing';",
          "  else if (task.status === 'doing') task.status = 'done';",
          "  render();",
          "});"
        ],
        think: "Why listen on the board once instead of on every card?",
        hints: [
          "Give each button btn.dataset.id = task.id so you can find the task.",
          "e.target.closest('button') finds the clicked button even inside the card.",
          "Update task.status, then call render() to redraw the board."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "Attach a click listener to the board (delegation)." },
            { pattern: "(dataset|data-id)", hint: "Store the task id on the button, e.g. btn.dataset.id = task.id." },
            { pattern: "(status\\s*=|find\\s*\\()", hint: "Update the task's status, then re-render." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the board.",
        goal: "Test adding and moving tasks — and polish anything that feels off.",
        logic: [
          "Open the page — do the seeded tasks show in their columns?",
          "Add a task — does it appear in the chosen column?",
          "Move a task — does it advance to the next column?",
          "Move a Done task — does it stay (or wrap) sensibly?"
        ],
        logicCode: [
          "// 1. Open the page — do the seeded tasks show?",
          "// 2. Add a task — does it appear in the chosen column?",
          "// 3. Move a task — does it advance a column?",
          "// 4. Move a Done task — what should happen?"
        ],
        think: "What should happen when you try to move a task past the last column?",
        hints: [
          "Test all three columns and the move flow end to end.",
          "If tasks duplicate, check that render() clears before redrawing.",
          "console.log(tasks) after moving is a quick way to inspect state."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one listener should drive the board (submit or click)." },
            { pattern: "(textContent|innerHTML)", hint: "Render task text into the page with textContent or innerHTML." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Kanban Board</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <header class="board-header">',
        "            <h1>Kanban Board</h1>",
        '            <p class="subtitle">Plan · Do · Done</p>',
        "        </header>",
        '        <form class="task-form" id="taskForm">',
        '            <input type="text" id="taskInput" placeholder="Add a new task..." autocomplete="off">',
        '            <select id="taskColumn">',
        '                <option value="todo">To Do</option>',
        '                <option value="doing">In Progress</option>',
        '                <option value="done">Done</option>',
        "            </select>",
        '            <button type="submit">Add Task</button>',
        "        </form>",
        '        <section class="board" id="boardEl">',
        '            <div class="column"><h2>To Do</h2><div class="task-list" id="colTodo"></div></div>',
        '            <div class="column"><h2>In Progress</h2><div class="task-list" id="colDoing"></div></div>',
        '            <div class="column"><h2>Done</h2><div class="task-list" id="colDone"></div></div>',
        "        </section>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".container {",
        "  width: min(1000px, 100%);",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  padding: 32px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".board-header { margin-bottom: 18px; }",
        ".board-header h1 { font-size: 1.8rem; }",
        ".subtitle { color: #6b7280; margin-top: 4px; }",
        "",
        ".task-form { display: flex; gap: 10px; margin-bottom: 24px; }",
        "",
        ".task-form input,",
        ".task-form select {",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 10px;",
        "  padding: 10px 12px;",
        "  font-size: 0.95rem;",
        "  font-family: inherit;",
        "  outline: none;",
        "}",
        "",
        ".task-form input { flex: 1; }",
        ".task-form input:focus, .task-form select:focus { border-color: #2563eb; }",
        "",
        ".task-form button {",
        "  border: none;",
        "  background: #2563eb;",
        "  color: #ffffff;",
        "  padding: 10px 18px;",
        "  border-radius: 10px;",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        ".board {",
        "  display: grid;",
        "  grid-template-columns: repeat(3, 1fr);",
        "  gap: 16px;",
        "}",
        "",
        ".column {",
        "  background: #f3f4f6;",
        "  border-radius: 14px;",
        "  padding: 14px;",
        "  min-height: 220px;",
        "}",
        "",
        ".column h2 { font-size: 0.95rem; margin-bottom: 12px; color: #374151; }",
        "",
        ".task-list { display: flex; flex-direction: column; gap: 10px; }",
        "",
        ".task-card {",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 10px;",
        "  padding: 12px 14px;",
        "  display: flex;",
        "  justify-content: space-between;",
        "  align-items: center;",
        "  font-size: 0.9rem;",
        "  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);",
        "}",
        "",
        ".task-card button {",
        "  border: 1px solid #e5e7eb;",
        "  background: #ffffff;",
        "  border-radius: 8px;",
        "  padding: 4px 10px;",
        "  cursor: pointer;",
        "  font-size: 0.85rem;",
        "}",
        "",
        ".task-card button:hover { border-color: #2563eb; color: #2563eb; }",
        "",
        "@media (max-width: 640px) {",
        "  .board { grid-template-columns: 1fr; }",
        "  .task-form { flex-direction: column; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the form (#taskForm), the input (#taskInput), the column",
        "//   select (#taskColumn) and three task lists (#colTodo, #colDoing, #colDone)",
        "//   style.css is complete — the board layout and columns are done for you",
        "",
        "// Step 2: Set up task state",
        "//   Create a tasks array — each task is an object with id, text and",
        "//   status ('todo', 'doing' or 'done') properties",
        "",
        "// Step 3: Add a task",
        "//   Listen for submit on the form, preventDefault(), read the text and",
        "//   column, push a new task into the array, and clear the input",
        "",
        "// Step 4: Render tasks",
        "//   Write a render() that clears the three columns, loops over the tasks,",
        "//   and appends each card to the column matching its status",
        "",
        "// Step 5: Move tasks",
        "//   Add a move button with dataset.id to each card; on click, find the",
        "//   task, advance its status, and re-render",
        "",
        "// Step 6: Final touch & test",
        "//   Test adding and moving tasks in all three columns — then polish"
      ].join("\n")
    }
  },

  "movie-search-app": {
    slug: "movie-search-app",
    folder: "movie-search-app",
    title: "Movie Search App",
    difficulty: "Intermediate",
    time: "45 min",
    category: "APIs & Data",
    tags: ["API", "Fetch", "Search"],
    intro: "Build a movie search app that fetches results from the OMDb API and renders them as cards with posters and details. You'll practice async/await, handling JSON responses, and showing loading and error states.",
    previewNote: "You'll build a working movie search: type a title, press search, and see movie cards with posters, titles and years pulled live from the OMDb API — with loading and error states along the way.",
    cover: "../../assets/project-covers/movie-search-app.png",
    previewUrl: "../../../JS%20PROJECTS/movie-search-app/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "OMDb needs an API key — get a free one at omdbapi.com/apikey.aspx and store it in a constant.",
      "The search endpoint is https://www.omdbapi.com/?apikey=KEY&s=QUERY",
      "Use async/await with fetch() to keep the request code readable.",
      "OMDb returns { Response: 'False', Error: ... } for a failed search — check for it.",
      "Show a loading state while the request is in flight and an error state when it fails."
    ],
    concepts: [
      "Making API requests with fetch()",
      "Writing async functions with await",
      "Handling JSON responses",
      "Rendering search results into the DOM",
      "Managing loading and error states"
    ],
    challenge: "Extra challenge: click a movie to open a detail view with the full plot and ratings.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the search form (#searchForm), the input (#searchInput), the loading indicator (#loading), the error element (#errorMsg) and the results grid (#resultsGrid).",
          "Open style.css — the layout and movie card styles are already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see the search form."
        ],
        logicCode: [
          "// 1. index.html — find #searchForm, #searchInput, #loading, #errorMsg, #resultsGrid",
          "// 2. style.css — layout and movie card styles are done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see the search form"
        ],
        think: "Which element IDs will your JavaScript need to select to search and render movies?",
        hints: [
          "The form is #searchForm — submitting it triggers the search.",
          "The query comes from #searchInput.",
          "Results render inside #resultsGrid."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const searchForm = document.getElementById('searchForm')." }
          ]
        }
      },
      {
        title: "Search Handler",
        tagline: "Trigger a search on submit.",
        goal: "When the form is submitted, read the query and kick off the API request — without reloading the page.",
        logic: [
          "Listen for the submit event on the form.",
          "Prevent the page from reloading.",
          "Read and trim the query from the input.",
          "Call a search function with that query."
        ],
        logicCode: [
          "// 1. Listen for form submit",
          "searchForm.addEventListener('submit', (e) => {",
          "  // 2. Stop the page reload",
          "  e.preventDefault();",
          "  // 3. Read the query",
          "  const query = searchInput.value.trim();",
          "  if (!query) return;",
          "  // 4. Kick off the search",
          "  searchMovies(query);",
          "});"
        ],
        think: "Why guard against an empty query before fetching?",
        hints: [
          "Attach the listener to the form and call e.preventDefault().",
          "searchInput.value.trim() cleans up the typed query.",
          "Skip the request if the query is empty."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']submit", hint: "Listen for the submit event on the form." },
            { pattern: "preventDefault", hint: "Call e.preventDefault() so the page doesn't reload." },
            { pattern: "\\.value", hint: "Read the query from the input, e.g. searchInput.value.trim()." }
          ]
        }
      },
      {
        title: "Fetch Movies",
        tagline: "Request data from the OMDb API.",
        goal: "Write an async function that fetches movies from the OMDb API for the given query.",
        logic: [
          "Write an async function named searchMovies.",
          "Build the API URL with the query and your key.",
          "Await fetch() and parse the JSON.",
          "Handle the 'not found' response from the API."
        ],
        logicCode: [
          "// 1. Async function to search movies",
          "async function searchMovies(query) {",
          "  // 2. Build the OMDb URL",
          "  const url = 'https://www.omdbapi.com/?apikey=' + API_KEY + '&s=' + encodeURIComponent(query);",
          "  // 3. Fetch and parse",
          "  const response = await fetch(url);",
          "  const data = await response.json();",
          "  // 4. OMDb signals failures with Response: 'False'",
          "  if (data.Response === 'False') {",
          "    showError(data.Error || 'No movies found');",
          "    return;",
          "  }",
          "  renderResults(data.Search);",
          "}"
        ],
        think: "Why encode the query with encodeURIComponent()?",
        hints: [
          "The search endpoint is https://www.omdbapi.com/?apikey=KEY&s=QUERY.",
          "Store your key in a constant like const API_KEY = '...'.",
          "OMDb returns Response: 'False' with an Error message when nothing matches."
        ],
        check: {
          requires: [
            { pattern: "async", hint: "Make the function async so you can use await." },
            { pattern: "fetch\\s*\\(", hint: "Call fetch() with the OMDb search URL." },
            { pattern: "\\.json\\s*\\(", hint: "Parse the response with response.json()." }
          ]
        }
      },
      {
        title: "Render Results",
        tagline: "Display the movie cards.",
        goal: "Loop over the search results and render each movie as a card with poster, title and year.",
        logic: [
          "Write a function named renderResults.",
          "Clear the results grid before rendering.",
          "Loop over the movies array.",
          "Build a card for each movie and append it."
        ],
        logicCode: [
          "// 1. Write the render function",
          "function renderResults(movies) {",
          "  // 2. Clear the grid",
          "  resultsGrid.innerHTML = '';",
          "  // 3. Loop over the movies",
          "  movies.forEach((movie) => {",
          "    // 4. Build a card",
          "    const card = document.createElement('div');",
          "    card.className = 'movie-card';",
          "    const poster = movie.Poster === 'N/A' ? '' : movie.Poster;",
          "    card.innerHTML = '<img src=\"' + poster + '\" alt=\"\">' +",
          "      '<h3>' + movie.Title + '</h3><p>' + movie.Year + '</p>';",
          "    resultsGrid.appendChild(card);",
          "  });",
          "}"
        ],
        think: "Why handle Poster === 'N/A' specially?",
        hints: [
          "Clear the grid with innerHTML = '' before re-rendering.",
          "Each result has Title, Year and Poster properties.",
          "Some movies have Poster 'N/A' — skip the image in that case."
        ],
        check: {
          requires: [
            { pattern: "(forEach|map|for\\s*\\()", hint: "Loop over the results to render each movie." },
            { pattern: "(createElement|innerHTML|insertAdjacentHTML)", hint: "Build each card with createElement or innerHTML." },
            { pattern: "(appendChild|innerHTML\\s*\\+=)", hint: "Add each card to the results grid." }
          ]
        }
      },
      {
        title: "Loading & Error States",
        tagline: "Show feedback while fetching.",
        goal: "Show a loading indicator while the request runs and an error message when it fails.",
        logic: [
          "Show the loading indicator before fetching.",
          "Hide it once the request finishes.",
          "Write a showError function.",
          "Wrap the fetch in try/catch for network errors."
        ],
        logicCode: [
          "// 1. Show loading before the request",
          "loading.hidden = false;",
          "errorMsg.hidden = true;",
          "try {",
          "  const response = await fetch(url);",
          "  const data = await response.json();",
          "  // 2. Hide loading when done",
          "  loading.hidden = true;",
          "  if (data.Response === 'False') { showError(data.Error); return; }",
          "  renderResults(data.Search);",
          "} catch (err) {",
          "  // 3. Network errors land here",
          "  loading.hidden = true;",
          "  showError('Something went wrong. Try again.');",
          "}"
        ],
        think: "Why hide the loading indicator in both the success and error paths?",
        hints: [
          "Toggle the .hidden property on #loading before and after the request.",
          "A showError(message) function sets #errorMsg text and unhides it.",
          "try/catch catches network failures that aren't API errors."
        ],
        check: {
          requires: [
            { pattern: "(hidden|classList)", hint: "Toggle loading and error states with the hidden property or classList." },
            { pattern: "(try\\s*\\{|catch)", hint: "Wrap the request in try/catch to handle network errors." },
            { pattern: "(showError|errorMsg|errorMessage)", hint: "Display errors in an error element." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the search.",
        goal: "Test the full flow — searching, rendering, loading and errors — and polish anything that feels off.",
        logic: [
          "Search for a real movie like 'Inception' — do cards render?",
          "Search for nonsense — does the error message appear?",
          "Watch the loading indicator during a search.",
          "Clear the grid before a new search starts."
        ],
        logicCode: [
          "// 1. Search 'Inception' — do cards render?",
          "// 2. Search nonsense — does the error appear?",
          "// 3. Does the loading indicator show during the search?",
          "// 4. Does a new search replace the old results?"
        ],
        think: "What should happen to the previous results when a new search starts?",
        hints: [
          "OMDb rate-limits free keys — a search every few seconds is fine.",
          "If images don't load, it's usually a slow network, not a bug.",
          "console.log(data) after response.json() helps debug the API shape."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one listener should drive the search (form submit)." },
            { pattern: "fetch\\s*\\(", hint: "The page should make an API request with fetch()." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Movie Search App</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <header class="movie-header">',
        "            <h1>🎬 Movie Search</h1>",
        '            <p class="subtitle">Discover your next favorite film</p>',
        "        </header>",
        '        <form class="search-form" id="searchForm">',
        '            <input type="text" id="searchInput" placeholder="Search for a movie..." autocomplete="off">',
        '            <button type="submit" id="searchBtn">Search</button>',
        "        </form>",
        '        <p class="loading" id="loading" hidden>Searching movies...</p>',
        '        <p class="error-msg" id="errorMsg" hidden></p>',
        '        <section class="results-grid" id="resultsGrid">',
        "            <!-- Movie cards go here (rendered by JavaScript) -->",
        "        </section>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".container {",
        "  width: min(880px, 100%);",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  padding: 32px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".movie-header { margin-bottom: 20px; }",
        ".movie-header h1 { font-size: 1.8rem; }",
        ".subtitle { color: #6b7280; margin-top: 4px; }",
        "",
        ".search-form { display: flex; gap: 10px; margin-bottom: 16px; }",
        "",
        ".search-form input {",
        "  flex: 1;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 10px;",
        "  padding: 10px 14px;",
        "  font-size: 0.95rem;",
        "  font-family: inherit;",
        "  outline: none;",
        "}",
        "",
        ".search-form input:focus { border-color: #2563eb; }",
        "",
        ".search-form button {",
        "  border: none;",
        "  background: #2563eb;",
        "  color: #ffffff;",
        "  padding: 10px 20px;",
        "  border-radius: 10px;",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        ".loading { color: #6b7280; font-size: 0.9rem; margin-bottom: 12px; }",
        ".error-msg { color: #dc2626; font-size: 0.9rem; margin-bottom: 12px; }",
        "",
        ".results-grid {",
        "  display: grid;",
        "  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));",
        "  gap: 16px;",
        "}",
        "",
        ".movie-card {",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 14px;",
        "  overflow: hidden;",
        "  text-align: center;",
        "  transition: all 0.15s ease;",
        "}",
        "",
        ".movie-card:hover {",
        "  border-color: #2563eb;",
        "  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.1);",
        "}",
        "",
        ".movie-card img {",
        "  width: 100%;",
        "  height: 210px;",
        "  object-fit: cover;",
        "  display: block;",
        "  background: #e5e7eb;",
        "}",
        "",
        ".movie-card h3 { font-size: 0.9rem; padding: 10px 10px 2px; }",
        ".movie-card p { color: #6b7280; font-size: 0.8rem; padding: 0 10px 12px; }",
        "",
        "@media (max-width: 480px) {",
        "  .results-grid { grid-template-columns: repeat(2, 1fr); }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the search form (#searchForm), the input (#searchInput),",
        "//   the loading indicator (#loading), the error element (#errorMsg) and",
        "//   the results grid (#resultsGrid)",
        "//   style.css is complete — the layout and movie cards are done for you",
        "",
        "// Step 2: Search handler",
        "//   Listen for submit on the form, preventDefault(), read and trim the",
        "//   query, and call a search function",
        "",
        "// Step 3: Fetch movies",
        "//   Write an async function that fetches",
        "//   https://www.omdbapi.com/?apikey=KEY&s=QUERY (store your key in a",
        "//   const API_KEY), parses the JSON, and checks Response === 'False'",
        "",
        "// Step 4: Render results",
        "//   Clear #resultsGrid, loop over data.Search, and build a card with",
        "//   poster, title and year for each movie",
        "",
        "// Step 5: Loading & error states",
        "//   Show #loading while fetching, hide it when done, and show errors",
        "//   in #errorMsg (both API 'not found' and network failures)",
        "",
        "// Step 6: Final touch & test",
        "//   Test a real search, a nonsense search, and the loading state"
      ].join("\n")
    }
  },

  "notes-app": {
    slug: "notes-app",
    folder: "Notes App",
    title: "Notes App",
    difficulty: "Intermediate",
    time: "40 min",
    category: "Core JS",
    tags: ["CRUD", "DOM", "localStorage"],
    intro: "Build a notes app that creates, renders and deletes notes — and remembers them across refreshes with localStorage. You'll practice CRUD operations, form handling, DOM manipulation and persistence.",
    previewNote: "You'll build a working notes app: type a title and note text, click Add, and the note appears as a card — and it's still there after you refresh the page.",
    cover: "../../assets/project-covers/notes-app.png",
    previewUrl: "../../../JS%20PROJECTS/Notes%20App/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Store every note as an object with id, title and text.",
      "Keep the notes in one array — localStorage saves the whole array as JSON.",
      "localStorage.setItem(key, JSON.stringify(notes)) saves; JSON.parse() loads.",
      "Render from the array, not from the DOM — delete by filtering the array and re-rendering.",
      "Wrap localStorage calls in try/catch — storage can be unavailable in some browsers."
    ],
    concepts: [
      "CRUD operations (create, read, delete)",
      "Form handling and input events",
      "Rendering lists dynamically",
      "Persisting data with localStorage",
      "JSON serialization (stringify and parse)"
    ],
    challenge: "Extra challenge: add an edit mode, or a search box that filters notes as you type.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the form (#noteForm), its inputs (#noteTitle, #noteText) and the notes grid (#notesGrid).",
          "Open style.css — the layout and note card styles are already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see the form and an empty grid."
        ],
        logicCode: [
          "// 1. index.html — find #noteForm, #noteTitle, #noteText, #notesGrid",
          "// 2. style.css — layout and note card styles are done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — form and empty grid"
        ],
        think: "Which element IDs will your JavaScript need to select to add and render notes?",
        hints: [
          "The form is #noteForm — submitting it adds a note.",
          "The title comes from #noteTitle and the body from #noteText.",
          "Notes render inside #notesGrid."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const noteForm = document.getElementById('noteForm')." }
          ]
        }
      },
      {
        title: "Notes State",
        tagline: "Set up the notes array.",
        goal: "Create an array that will hold every note as an object with an id, title and text.",
        logic: [
          "Create an array named notes.",
          "Give each note an id property.",
          "Give each note title and text properties.",
          "Seed it with one welcome note."
        ],
        logicCode: [
          "// 1. Create the notes array",
          "const notes = [",
          "  {",
          "    // 2. A unique id",
          "    id: Date.now(),",
          "    // 3. Title and text",
          "    title: 'Welcome 👋',",
          "    text: 'This is your first note!'",
          "  }",
          "];"
        ],
        think: "Why give every note a unique id?",
        hints: [
          "Each note is an object with id, title and text keys.",
          "Date.now() is a simple way to generate unique ids.",
          "Seed the array with one note so the grid isn't empty on load."
        ],
        check: {
          requires: [
            { pattern: "(const|let|var)\\s+notes", hint: "Create an array: const notes = [ ... ];" },
            { pattern: "title\\s*:", hint: "Each note needs a title property." }
          ]
        }
      },
      {
        title: "Add a Note",
        tagline: "Create notes from the form.",
        goal: "When the form is submitted, read the inputs, create a note, and add it to the array.",
        logic: [
          "Listen for the submit event on the form.",
          "Prevent the page from reloading.",
          "Read the title and text from the inputs.",
          "Push a new note object into the array."
        ],
        logicCode: [
          "// 1. Listen for form submit",
          "noteForm.addEventListener('submit', (e) => {",
          "  // 2. Stop the page reload",
          "  e.preventDefault();",
          "  const title = noteTitle.value.trim();",
          "  const text = noteText.value.trim();",
          "  if (!title) return;",
          "  // 3. Add the note",
          "  notes.push({ id: Date.now(), title, text });",
          "  // 4. Reset the form",
          "  noteTitle.value = '';",
          "  noteText.value = '';",
          "  renderNotes();",
          "});"
        ],
        think: "Why reset the inputs after adding a note?",
        hints: [
          "Attach the listener to the form and call e.preventDefault().",
          "Read both inputs with .value.trim().",
          "notes.push({ id: Date.now(), title, text }) adds the note."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']submit", hint: "Listen for the submit event on the form." },
            { pattern: "preventDefault", hint: "Call e.preventDefault() so the page doesn't reload." },
            { pattern: "\\.push\\s*\\(", hint: "Add the new note to the array with notes.push({ ... })." }
          ]
        }
      },
      {
        title: "Render Notes",
        tagline: "Draw the notes grid.",
        goal: "Loop over the notes array and render each one as a card with a delete button.",
        logic: [
          "Write a function named renderNotes.",
          "Clear the grid before rendering.",
          "Loop over the notes array.",
          "Build a card with a delete button for each note."
        ],
        logicCode: [
          "// 1. Write the render function",
          "function renderNotes() {",
          "  // 2. Clear the grid",
          "  notesGrid.innerHTML = '';",
          "  // 3. Loop over the notes",
          "  notes.forEach((note) => {",
          "    // 4. Build a card",
          "    const card = document.createElement('div');",
          "    card.className = 'note-card';",
          "    card.innerHTML = '<h3>' + note.title + '</h3>' +",
          "      '<p>' + note.text + '</p>' +",
          "      '<button data-id=\"' + note.id + '\">Delete</button>';",
          "    notesGrid.appendChild(card);",
          "  });",
          "}"
        ],
        think: "Why build the delete button with a data-id instead of wiring it inline?",
        hints: [
          "Clear the grid with innerHTML = '' before re-rendering.",
          "Loop with forEach and build each card with createElement or innerHTML.",
          "Put note.id in a data-id attribute so clicks can find the note."
        ],
        check: {
          requires: [
            { pattern: "(forEach|map|for\\s*\\()", hint: "Loop over the notes array to render each one." },
            { pattern: "(createElement|innerHTML|insertAdjacentHTML)", hint: "Build each card with createElement or innerHTML." },
            { pattern: "(appendChild|innerHTML\\s*\\+=)", hint: "Add each card to the notes grid." }
          ]
        }
      },
      {
        title: "Delete a Note",
        tagline: "Remove notes with one click.",
        goal: "Clicking Delete should remove that note from the array and re-render the grid.",
        logic: [
          "Listen for clicks on the notes grid.",
          "Find the delete button that was clicked.",
          "Filter the note out of the array by its id.",
          "Re-render the grid."
        ],
        logicCode: [
          "// 1. Listen for clicks on the grid",
          "notesGrid.addEventListener('click', (e) => {",
          "  const btn = e.target.closest('button[data-id]');",
          "  if (!btn) return;",
          "  // 2. Filter out the clicked note",
          "  const filtered = notes.filter(note => note.id != btn.dataset.id);",
          "  // 3. Replace the array",
          "  notes.length = 0;",
          "  notes.push(...filtered);",
          "  // 4. Re-render",
          "  renderNotes();",
          "});"
        ],
        think: "Why filter the array instead of removing the DOM element directly?",
        hints: [
          "Listen on the grid and use e.target.closest('button[data-id]') to find the button.",
          "Array.filter() returns a new array without the deleted note.",
          "Then re-render so the DOM matches the data."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "Attach a click listener to the notes grid." },
            { pattern: "\\.filter\\s*\\(", hint: "Remove the note with array.filter(), keeping everything except the clicked id." },
            { pattern: "(dataset|data-id)", hint: "Identify the clicked note via a data attribute." }
          ]
        }
      },
      {
        title: "Save with localStorage",
        tagline: "Remember notes across refreshes.",
        goal: "Save the notes array to localStorage whenever it changes, and load it back when the page opens.",
        logic: [
          "Write a save function using JSON.stringify.",
          "Write a load function using JSON.parse.",
          "Call load when the page starts.",
          "Call save after every change."
        ],
        logicCode: [
          "// 1. Save the notes array",
          "function saveNotes() {",
          "  localStorage.setItem('notes', JSON.stringify(notes));",
          "}",
          "// 2. Load on startup",
          "function loadNotes() {",
          "  const saved = localStorage.getItem('notes');",
          "  if (saved) {",
          "    const parsed = JSON.parse(saved);",
          "    notes.length = 0;",
          "    notes.push(...parsed);",
          "  }",
          "}",
          "// 3. Call load when the page starts",
          "loadNotes();",
          "renderNotes();",
          "// 4. Call save after every change",
          "saveNotes();"
        ],
        think: "Why do you need JSON.stringify to save an array to localStorage?",
        hints: [
          "localStorage only stores strings — JSON.stringify(notes) encodes the array.",
          "JSON.parse(saved) turns the string back into an array.",
          "Call saveNotes() after adding and deleting; call loadNotes() on startup."
        ],
        check: {
          requires: [
            { pattern: "localStorage", hint: "Use localStorage to persist the notes." },
            { pattern: "JSON\\.stringify", hint: "Encode the array with JSON.stringify() before saving." },
            { pattern: "JSON\\.parse", hint: "Decode the saved string with JSON.parse() when loading." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Notes App</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <header class="notes-header">',
        "            <h1>📝 Notes App</h1>",
        '            <p class="subtitle">Write. Organize. Remember.</p>',
        "        </header>",
        '        <form class="note-form" id="noteForm">',
        '            <input type="text" id="noteTitle" placeholder="Note title" autocomplete="off">',
        '            <textarea id="noteText" placeholder="Write your note..." rows="3"></textarea>',
        '            <button type="submit">Add Note</button>',
        "        </form>",
        '        <section class="notes-grid" id="notesGrid">',
        "            <!-- Note cards go here (rendered by JavaScript) -->",
        "        </section>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".container {",
        "  width: min(760px, 100%);",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  padding: 32px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".notes-header { margin-bottom: 20px; }",
        ".notes-header h1 { font-size: 1.8rem; }",
        ".subtitle { color: #6b7280; margin-top: 4px; }",
        "",
        ".note-form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }",
        "",
        ".note-form input,",
        ".note-form textarea {",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 10px;",
        "  padding: 10px 14px;",
        "  font-size: 0.95rem;",
        "  font-family: inherit;",
        "  outline: none;",
        "  resize: vertical;",
        "}",
        "",
        ".note-form input:focus, .note-form textarea:focus { border-color: #2563eb; }",
        "",
        ".note-form button {",
        "  border: none;",
        "  background: #2563eb;",
        "  color: #ffffff;",
        "  padding: 10px 18px;",
        "  border-radius: 10px;",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "  align-self: flex-start;",
        "}",
        "",
        ".notes-grid {",
        "  display: grid;",
        "  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));",
        "  gap: 16px;",
        "}",
        "",
        ".note-card {",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 14px;",
        "  padding: 16px;",
        "  background: #fffbeb;",
        "  transition: all 0.15s ease;",
        "}",
        "",
        ".note-card:hover {",
        "  border-color: #d97706;",
        "  box-shadow: 0 8px 16px rgba(217, 119, 6, 0.12);",
        "}",
        "",
        ".note-card h3 { font-size: 1rem; margin-bottom: 6px; }",
        ".note-card p { color: #6b7280; font-size: 0.9rem; margin-bottom: 12px; }",
        "",
        ".note-card button {",
        "  border: 1px solid #fca5a5;",
        "  background: #fef2f2;",
        "  color: #dc2626;",
        "  padding: 5px 12px;",
        "  border-radius: 8px;",
        "  font-size: 0.8rem;",
        "  cursor: pointer;",
        "}",
        "",
        ".note-card button:hover { background: #fee2e2; }",
        "",
        "@media (max-width: 480px) {",
        "  .notes-grid { grid-template-columns: 1fr; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the form (#noteForm), its inputs (#noteTitle, #noteText)",
        "//   and the notes grid (#notesGrid)",
        "//   style.css is complete — the layout and note cards are done for you",
        "",
        "// Step 2: Set up notes state",
        "//   Create a notes array — each note is an object with id, title and text",
        "",
        "// Step 3: Add a note",
        "//   Listen for submit on the form, preventDefault(), read the inputs,",
        "//   push a new note into the array, reset the form, and re-render",
        "",
        "// Step 4: Render notes",
        "//   Write a renderNotes() that clears #notesGrid, loops over the notes,",
        "//   and builds a card (with a Delete button carrying data-id) for each",
        "",
        "// Step 5: Delete a note",
        "//   Listen for clicks on the grid, find the clicked id, filter it out",
        "//   of the array, and re-render",
        "",
        "// Step 6: Save with localStorage",
        "//   saveNotes() stores JSON.stringify(notes); loadNotes() reads it back;",
        "//   call load on startup and save after every change"
      ].join("\n")
    }
  },

  "pokedex-app": {
    slug: "pokedex-app",
    folder: "Pokedex-App",
    title: "Pokédex App",
    difficulty: "Intermediate",
    time: "45 min",
    category: "APIs & Data",
    tags: ["API", "Fetch", "DOM"],
    intro: "Build a Pokédex that fetches Pokémon from the PokéAPI and renders a card with the sprite, types and base stats. You'll practice API requests, async JavaScript, JSON handling and dynamic rendering.",
    previewNote: "You'll build a working Pokédex: search for a Pokémon by name or number, and see its sprite, types, height, weight and base stats pulled live from the PokéAPI.",
    cover: "../../assets/project-covers/pokedex-app.png",
    previewUrl: "../../../JS%20PROJECTS/Pokedex-App/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "The PokéAPI needs no key — fetch https://pokeapi.co/api/v2/pokemon/{name-or-id} directly.",
      "Use async/await with fetch() for readable request code.",
      "The sprite lives at data.sprites.front_default — some Pokémon have null sprites, so handle that.",
      "Types are nested in data.types — map over them to get type names.",
      "Check response.ok and wrap the request in try/catch for a clean error state."
    ],
    concepts: [
      "Making API requests with fetch()",
      "Writing async functions with await",
      "Handling nested JSON structures",
      "Rendering API data into the DOM",
      "Error handling with try/catch"
    ],
    challenge: "Extra challenge: add Previous/Next buttons that step through Pokémon by number.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the search form (#searchForm), the input (#searchInput), the error element (#errorMsg) and the Pokédex card (#pokedexCard) with its image, name, types and stats elements.",
          "Open style.css — the layout and card styles are already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see the search form."
        ],
        logicCode: [
          "// 1. index.html — find #searchForm, #searchInput, #errorMsg, #pokedexCard",
          "// 2. style.css — layout and card styles are done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see the search form"
        ],
        think: "Which element IDs will your JavaScript need to select to render a Pokémon?",
        hints: [
          "The form is #searchForm — submitting it triggers the fetch.",
          "The identifier comes from #searchInput.",
          "The card is #pokedexCard — it starts hidden until a Pokémon loads."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const searchForm = document.getElementById('searchForm')." }
          ]
        }
      },
      {
        title: "Search Handler",
        tagline: "Trigger a search on submit.",
        goal: "When the form is submitted, read the name or number and kick off the API request.",
        logic: [
          "Listen for the submit event on the form.",
          "Prevent the page from reloading.",
          "Read and trim the identifier from the input.",
          "Call a fetch function with that identifier."
        ],
        logicCode: [
          "// 1. Listen for form submit",
          "searchForm.addEventListener('submit', (e) => {",
          "  // 2. Stop the page reload",
          "  e.preventDefault();",
          "  // 3. Read the identifier (name or number)",
          "  const identifier = searchInput.value.trim().toLowerCase();",
          "  if (!identifier) return;",
          "  // 4. Kick off the fetch",
          "  fetchPokemon(identifier);",
          "});"
        ],
        think: "Why lowercase the input before fetching?",
        hints: [
          "Attach the listener to the form and call e.preventDefault().",
          "searchInput.value.trim().toLowerCase() normalizes the identifier.",
          "Skip the request if the identifier is empty."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']submit", hint: "Listen for the submit event on the form." },
            { pattern: "preventDefault", hint: "Call e.preventDefault() so the page doesn't reload." },
            { pattern: "\\.value", hint: "Read the identifier from the input, e.g. searchInput.value.trim()." }
          ]
        }
      },
      {
        title: "Fetch a Pokémon",
        tagline: "Request data from the PokéAPI.",
        goal: "Write an async function that fetches a Pokémon from the PokéAPI and parses the JSON.",
        logic: [
          "Write an async function named fetchPokemon.",
          "Build the API URL with the identifier.",
          "Await fetch() and check response.ok.",
          "Await response.json() to get the data."
        ],
        logicCode: [
          "// 1. Async function to fetch a Pokémon",
          "async function fetchPokemon(identifier) {",
          "  // 2. Build the PokéAPI URL",
          "  const url = 'https://pokeapi.co/api/v2/pokemon/' + identifier;",
          "  // 3. Fetch and check the response",
          "  const response = await fetch(url);",
          "  if (!response.ok) throw new Error('Pokémon not found');",
          "  // 4. Parse the JSON",
          "  const data = await response.json();",
          "  renderPokemon(data);",
          "}"
        ],
        think: "Why check response.ok before parsing the JSON?",
        hints: [
          "The URL is 'https://pokeapi.co/api/v2/pokemon/' + the identifier.",
          "await fetch(url) returns the response — check response.ok first.",
          "await response.json() turns the body into a JavaScript object."
        ],
        check: {
          requires: [
            { pattern: "async", hint: "Make the function async so you can use await." },
            { pattern: "fetch\\s*\\(", hint: "Call fetch() with the PokéAPI URL." },
            { pattern: "\\.json\\s*\\(", hint: "Parse the response with response.json()." }
          ]
        }
      },
      {
        title: "Render the Card",
        tagline: "Display the Pokémon's data.",
        goal: "Fill the card with the Pokémon's sprite, name, number, height and weight.",
        logic: [
          "Set the sprite image source.",
          "Write the name and number into their elements.",
          "Write the height and weight.",
          "Show the card and hide the error."
        ],
        logicCode: [
          "// 1. Sprite and identity",
          "pokemonImage.src = data.sprites.front_default || '';",
          "pokemonName.textContent = data.name;",
          "pokemonId.textContent = '#' + String(data.id).padStart(3, '0');",
          "// 2. Height and weight (decimeters / hectograms)",
          "pokemonHeight.textContent = data.height;",
          "pokemonWeight.textContent = data.weight;",
          "// 3. Show the card",
          "pokedexCard.hidden = false;",
          "errorMsg.hidden = true;"
        ],
        think: "Why pad the id number with leading zeros?",
        hints: [
          "data.sprites.front_default holds the sprite URL — it can be null.",
          "data.name is the Pokémon's name and data.id its number.",
          "String(data.id).padStart(3, '0') formats the number like #025."
        ],
        check: {
          requires: [
            { pattern: "\\.src\\s*=", hint: "Set the sprite image source, e.g. pokemonImage.src = data.sprites.front_default." },
            { pattern: "textContent\\s*=", hint: "Write the name, id or stats into elements with textContent." },
            { pattern: "(data\\.|sprites|name)", hint: "Read values from the parsed Pokémon data object." }
          ]
        }
      },
      {
        title: "Types & Stats",
        tagline: "Render the nested data.",
        goal: "Loop over the Pokémon's types and base stats and render them as chips and stat bars.",
        logic: [
          "Clear the types container.",
          "Loop over data.types to create type chips.",
          "Clear the stats container.",
          "Loop over data.stats to render each base stat."
        ],
        logicCode: [
          "// 1. Render the types",
          "typeBadges.innerHTML = '';",
          "data.types.forEach((t) => {",
          "  const chip = document.createElement('span');",
          "  chip.className = 'type-chip';",
          "  chip.textContent = t.type.name;",
          "  typeBadges.appendChild(chip);",
          "});",
          "// 2. Render the base stats",
          "statsContainer.innerHTML = '';",
          "data.stats.forEach((s) => {",
          "  const row = document.createElement('div');",
          "  row.className = 'stat-row';",
          "  row.innerHTML = s.stat.name + ' <b>' + s.base_stat + '</b>';",
          "  statsContainer.appendChild(row);",
          "});"
        ],
        think: "Why are types and stats nested arrays in the API response?",
        hints: [
          "data.types is an array of objects — each has .type.name.",
          "data.stats is an array — each has .stat.name and .base_stat.",
          "Clear each container before appending so re-renders don't duplicate."
        ],
        check: {
          requires: [
            { pattern: "(forEach|map|for\\s*\\()", hint: "Loop over the types and/or stats arrays." },
            { pattern: "(createElement|innerHTML|insertAdjacentHTML)", hint: "Build the chips or stat rows with createElement or innerHTML." },
            { pattern: "(types|stats)", hint: "Read the nested data from data.types and/or data.stats." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the Pokédex.",
        goal: "Test searching by name and number, and handling errors — then polish anything that feels off.",
        logic: [
          "Search 'pikachu' — does the card render with types and stats?",
          "Search '25' — does it show Pikachu?",
          "Search a nonsense name — does the error message appear?",
          "Search with mixed casing — does it still work?"
        ],
        logicCode: [
          "// 1. Search 'pikachu' — does the card render?",
          "// 2. Search '25' — does it show Pikachu?",
          "// 3. Search nonsense — does the error appear?",
          "// 4. Search 'Pikachu' — does casing still work?"
        ],
        think: "What should happen to the old card when a new search fails?",
        hints: [
          "Wrap the fetch in try/catch and show a message on failure.",
          "If the sprite is blank, check data.sprites.front_default is set.",
          "console.log(data) after response.json() helps explore the API shape."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one listener should drive the search (form submit)." },
            { pattern: "fetch\\s*\\(", hint: "The page should make an API request with fetch()." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Pokédex App</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <header class="pokedex-header">',
        "            <h1>⚡ Pokédex</h1>",
        '            <p class="subtitle">Gotta search \'em all!</p>',
        "        </header>",
        '        <form class="search-form" id="searchForm">',
        '            <input type="text" id="searchInput" placeholder="Pokémon name or number (e.g. pikachu or 25)" autocomplete="off">',
        '            <button type="submit" id="searchBtn">Search</button>',
        "        </form>",
        '        <p class="error-msg" id="errorMsg" hidden></p>',
        '        <section class="pokedex-card" id="pokedexCard" hidden>',
        '            <img id="pokemonImage" alt="Pokémon sprite">',
        '            <span class="pokemon-id" id="pokemonId">#000</span>',
        '            <h2 class="pokemon-name" id="pokemonName">—</h2>',
        '            <div class="type-badges" id="typeBadges"></div>',
        '            <div class="details">',
        '                <div><span>Height</span><b id="pokemonHeight">—</b></div>',
        '                <div><span>Weight</span><b id="pokemonWeight">—</b></div>',
        "            </div>",
        '            <h3>Base Stats</h3>',
        '            <div class="stats" id="statsContainer"></div>',
        "        </section>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".container {",
        "  width: min(560px, 100%);",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  padding: 32px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".pokedex-header { margin-bottom: 20px; text-align: center; }",
        ".pokedex-header h1 { font-size: 1.8rem; }",
        ".subtitle { color: #6b7280; margin-top: 4px; }",
        "",
        ".search-form { display: flex; gap: 10px; margin-bottom: 16px; }",
        "",
        ".search-form input {",
        "  flex: 1;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 10px;",
        "  padding: 10px 14px;",
        "  font-size: 0.95rem;",
        "  font-family: inherit;",
        "  outline: none;",
        "}",
        "",
        ".search-form input:focus { border-color: #2563eb; }",
        "",
        ".search-form button {",
        "  border: none;",
        "  background: #2563eb;",
        "  color: #ffffff;",
        "  padding: 10px 20px;",
        "  border-radius: 10px;",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        ".error-msg { color: #dc2626; font-size: 0.9rem; margin-bottom: 12px; text-align: center; }",
        "",
        ".pokedex-card { text-align: center; padding: 20px; border: 1px solid #e5e7eb; border-radius: 18px; }",
        "",
        ".pokedex-card img {",
        "  width: 140px;",
        "  height: 140px;",
        "  object-fit: contain;",
        "  margin-bottom: 6px;",
        "}",
        "",
        ".pokemon-id { color: #6b7280; font-size: 0.9rem; font-weight: 600; }",
        ".pokemon-name { text-transform: capitalize; margin: 4px 0 10px; font-size: 1.5rem; }",
        "",
        ".type-badges { display: flex; justify-content: center; gap: 8px; margin-bottom: 16px; }",
        "",
        ".type-chip {",
        "  background: #eff6ff;",
        "  color: #1d4ed8;",
        "  padding: 4px 14px;",
        "  border-radius: 9999px;",
        "  font-size: 0.8rem;",
        "  font-weight: 600;",
        "  text-transform: capitalize;",
        "}",
        "",
        ".details {",
        "  display: flex;",
        "  justify-content: center;",
        "  gap: 32px;",
        "  margin-bottom: 16px;",
        "}",
        "",
        ".details div { display: flex; flex-direction: column; }",
        ".details span { color: #6b7280; font-size: 0.8rem; }",
        "",
        ".pokedex-card h3 { margin-bottom: 10px; font-size: 1rem; }",
        "",
        ".stats { display: flex; flex-direction: column; gap: 6px; }",
        "",
        ".stat-row {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  padding: 8px 12px;",
        "  background: #f3f4f6;",
        "  border-radius: 8px;",
        "  font-size: 0.85rem;",
        "  text-transform: capitalize;",
        "}",
        "",
        "@media (max-width: 480px) {",
        "  .container { padding: 20px 16px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the search form (#searchForm), the input (#searchInput),",
        "//   the error element (#errorMsg) and the card (#pokedexCard) with image,",
        "//   id, name, types (#typeBadges), height/weight and stats (#statsContainer)",
        "//   style.css is complete — the layout and card styles are done for you",
        "",
        "// Step 2: Search handler",
        "//   Listen for submit on the form, preventDefault(), read and lowercase",
        "//   the identifier, and call a fetch function",
        "",
        "// Step 3: Fetch a Pokémon",
        "//   Write an async function that fetches",
        "//   https://pokeapi.co/api/v2/pokemon/{identifier}, checks response.ok,",
        "//   and parses the JSON with response.json()",
        "",
        "// Step 4: Render the card",
        "//   Set the sprite src, write the name and padded id, and show height/weight",
        "",
        "// Step 5: Types & stats",
        "//   Loop over data.types to build type chips, and data.stats to build",
        "//   the stat rows",
        "",
        "// Step 6: Final touch & test",
        "//   Test by name, by number, and a nonsense search — then polish"
      ].join("\n")
    }
  },

  "quizapp": {
    slug: "quizapp",
    folder: "QuizApp",
    title: "Quiz App",
    difficulty: "Beginner",
    time: "35 min",
    category: "Core JS",
    tags: ["State", "Events", "DOM"],
    intro: "Build a quiz app with a start screen, a series of questions, answer selection, and a results screen with your score. You'll practice question data, state management, score calculation and conditional logic.",
    previewNote: "You'll build a working quiz: hit Start, answer each question by clicking an option, see your score tick up, and get a results screen when you're done.",
    cover: "../../assets/project-covers/quizapp.png",
    previewUrl: "../../../JS%20PROJECTS/QuizApp/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Store questions as an array of objects with question, options and correctIndex.",
      "Track currentIndex and score as variables — the whole UI derives from them.",
      "Render one question at a time; the Next button advances currentIndex.",
      "Compare the clicked option to the question's correctIndex to score it.",
      "Swap screens with the hidden property — start, quiz and result screens."
    ],
    concepts: [
      "Storing questions as data",
      "Managing state with index and score variables",
      "Event handling for options and buttons",
      "Score calculation with conditional logic",
      "Switching screens dynamically"
    ],
    challenge: "Extra challenge: add a timer per question, or shuffle the questions each round.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the three screens: #startScreen, #quizScreen and #resultScreen, plus #questionText, #optionsContainer, #scoreValue and #nextBtn.",
          "Open style.css — the layout and screen styles are already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see the start screen."
        ],
        logicCode: [
          "// 1. index.html — find #startScreen, #quizScreen, #resultScreen, #questionText, #optionsContainer",
          "// 2. style.css — layout and screen styles are done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see the start screen"
        ],
        think: "Which element IDs will your JavaScript need to select to run the quiz?",
        hints: [
          "The question text goes into #questionText.",
          "Options render inside #optionsContainer.",
          "Screens swap via #startScreen, #quizScreen and #resultScreen."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const questionText = document.getElementById('questionText')." }
          ]
        }
      },
      {
        title: "Question Data & State",
        tagline: "Store the questions and game state.",
        goal: "Create a questions array and the state variables the quiz needs to run.",
        logic: [
          "Create an array named questions.",
          "Add 4-6 question objects with question, options and correctIndex.",
          "Create a variable named currentIndex starting at 0.",
          "Create a score variable starting at 0."
        ],
        logicCode: [
          "// 1. Create the questions array",
          "const questions = [",
          "  {",
          "    // 2. The question text",
          "    question: 'What does CSS stand for?',",
          "    // 3. The answer options",
          "    options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheets'],",
          "    // 4. The correct option's index",
          "    correctIndex: 0",
          "  },",
          "  // ... add a few more questions",
          "];",
          "// 5. Game state",
          "let currentIndex = 0;",
          "let score = 0;"
        ],
        think: "Why store the correct answer as an index instead of the text?",
        hints: [
          "Each question is an object with question, options and correctIndex keys.",
          "correctIndex is the position of the right option in the options array.",
          "let currentIndex and let score track the game's state."
        ],
        check: {
          requires: [
            { pattern: "(const|let|var)\\s+questions", hint: "Create an array: const questions = [ ... ];" },
            { pattern: "(currentIndex|score)\\s*=\\s*0", hint: "Track state with currentIndex and score, both starting at 0." },
            { pattern: "correctIndex\\s*:", hint: "Each question needs a correctIndex property." }
          ]
        }
      },
      {
        title: "Render a Question",
        tagline: "Show the current question.",
        goal: "Write a function that renders the question text and its options as buttons.",
        logic: [
          "Write a function named renderQuestion.",
          "Write the question text into its element.",
          "Clear the options container.",
          "Create a button for each option and append it."
        ],
        logicCode: [
          "// 1. Write the render function",
          "function renderQuestion() {",
          "  const q = questions[currentIndex];",
          "  // 2. Show the question text",
          "  questionText.textContent = q.question;",
          "  // 3. Clear the options",
          "  optionsContainer.innerHTML = '';",
          "  // 4. Create one button per option",
          "  q.options.forEach((option, i) => {",
          "    const btn = document.createElement('button');",
          "    btn.className = 'option-btn';",
          "    btn.dataset.index = i;",
          "    btn.textContent = option;",
          "    optionsContainer.appendChild(btn);",
          "  });",
          "}"
        ],
        think: "Why store the option index on each button?",
        hints: [
          "questions[currentIndex] is the current question.",
          "Loop over q.options to create one button per option.",
          "btn.dataset.index = i remembers which option the button represents."
        ],
        check: {
          requires: [
            { pattern: "(forEach|map|for\\s*\\()", hint: "Loop over the options to create one button each." },
            { pattern: "(createElement|innerHTML|insertAdjacentHTML)", hint: "Build option buttons with createElement or innerHTML." },
            { pattern: "textContent\\s*=", hint: "Write the question text into its element." }
          ]
        }
      },
      {
        title: "Answer Selection",
        tagline: "Score the chosen answer.",
        goal: "When an option is clicked, check whether it's correct and update the score.",
        logic: [
          "Listen for clicks on the options container.",
          "Read the clicked option's index.",
          "Compare it with the question's correctIndex.",
          "Increase the score if it matches."
        ],
        logicCode: [
          "// 1. Listen for clicks on the options",
          "optionsContainer.addEventListener('click', (e) => {",
          "  const btn = e.target.closest('.option-btn');",
          "  if (!btn) return;",
          "  // 2. Read the chosen index",
          "  const chosen = Number(btn.dataset.index);",
          "  const q = questions[currentIndex];",
          "  // 3. Compare with the correct answer",
          "  if (chosen === q.correctIndex) {",
          "    // 4. Increase the score",
          "    score += 1;",
          "    scoreValue.textContent = score;",
          "  }",
          "});"
        ],
        think: "What should happen after the player clicks an answer?",
        hints: [
          "Listen on the container and use e.target.closest('.option-btn').",
          "Number(btn.dataset.index) gives the chosen option's index.",
          "Compare it to q.correctIndex — if equal, score += 1."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "Attach a click listener to the options." },
            { pattern: "(correctIndex|correct)", hint: "Compare the choice against the question's correct answer." },
            { pattern: "score\\s*(\\+=|\\+\\+|=\\s*score\\s*\\+)", hint: "Increase the score when the answer is correct." }
          ]
        }
      },
      {
        title: "Next & Results",
        tagline: "Advance through the quiz.",
        goal: "The Next button moves to the next question — and shows the results screen after the last one.",
        logic: [
          "Listen for clicks on the Next button.",
          "Increase the current index.",
          "If questions remain, render the next one.",
          "Otherwise, show the results screen with the final score."
        ],
        logicCode: [
          "// 1. Listen for Next clicks",
          "nextBtn.addEventListener('click', () => {",
          "  // 2. Move to the next question",
          "  currentIndex += 1;",
          "  // 3. More questions? Render the next one",
          "  if (currentIndex < questions.length) {",
          "    renderQuestion();",
          "  } else {",
          "    // 4. Quiz over — show the results screen",
          "    finalScore.textContent = score;",
          "    quizScreen.hidden = true;",
          "    resultScreen.hidden = false;",
          "  }",
          "});"
        ],
        think: "Why check currentIndex against questions.length?",
        hints: [
          "currentIndex += 1 advances the quiz.",
          "If currentIndex < questions.length, keep going — otherwise the quiz is over.",
          "Write the score into the results screen and swap screens with .hidden."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "Attach a click listener to the Next button." },
            { pattern: "(currentIndex|index)\\s*(\\+=|\\+\\+)", hint: "Advance the current question index." },
            { pattern: "(hidden|classList)", hint: "Swap to the results screen by toggling .hidden." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the quiz.",
        goal: "Test the full flow — start, answer, next, results — and polish anything that feels off.",
        logic: [
          "Open the page — does the start screen show?",
          "Click Start — does the first question appear?",
          "Answer each question — does the score update?",
          "Finish the quiz — does the results screen show the right score?"
        ],
        logicCode: [
          "// 1. Open the page — does the start screen show?",
          "// 2. Click Start — does the first question appear?",
          "// 3. Answer each question — does the score update?",
          "// 4. Finish — does the results screen show the right score?"
        ],
        think: "What should happen if you click Start again after finishing?",
        hints: [
          "Wire the Start button to reset currentIndex and score, then show the quiz screen.",
          "If the score seems wrong, console.log(score) at each step.",
          "Make sure only one screen is visible at a time."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one listener should drive the quiz (start, options or next)." },
            { pattern: "(textContent|innerHTML)", hint: "Render question or score data into the page with textContent or innerHTML." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Quiz App</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        "        <!-- Start screen -->",
        '        <section class="screen" id="startScreen">',
        '            <div class="card">',
        "                <h1>Quiz App</h1>",
        "                <p>Test your knowledge with 5 questions.</p>",
        '                <button class="btn btn-primary" id="startBtn">Start Quiz</button>',
        "            </div>",
        "        </section>",
        "        <!-- Quiz screen -->",
        '        <section class="screen" id="quizScreen" hidden>',
        '            <div class="card">',
        '                <p class="progress" id="progressText">Question 1 of 5</p>',
        '                <h2 id="questionText"></h2>',
        '                <div class="options" id="optionsContainer"></div>',
        '                <div class="quiz-footer">',
        '                    <span>Score: <b id="scoreValue">0</b></span>',
        '                    <button class="btn btn-primary" id="nextBtn">Next</button>',
        "                </div>",
        "            </div>",
        "        </section>",
        "        <!-- Result screen -->",
        '        <section class="screen" id="resultScreen" hidden>',
        '            <div class="card">',
        "                <h1>Quiz Complete!</h1>",
        '                <p>Your score: <b id="finalScore">0</b> / 5</p>',
        '                <button class="btn btn-primary" id="restartBtn">Restart Quiz</button>',
        "            </div>",
        "        </section>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".container {",
        "  width: min(560px, 100%);",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  padding: 32px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".card { text-align: center; }",
        ".card h1 { font-size: 1.8rem; margin-bottom: 8px; }",
        ".card p { color: #6b7280; margin-bottom: 20px; }",
        "",
        ".progress { font-size: 0.85rem; color: #6b7280; margin-bottom: 8px; }",
        ".card h2 { font-size: 1.3rem; margin-bottom: 20px; }",
        "",
        ".options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }",
        "",
        ".option-btn {",
        "  border: 1px solid #e5e7eb;",
        "  background: #ffffff;",
        "  color: #111827;",
        "  padding: 12px 16px;",
        "  border-radius: 12px;",
        "  font-size: 0.95rem;",
        "  font-family: inherit;",
        "  cursor: pointer;",
        "  text-align: left;",
        "  transition: all 0.15s ease;",
        "}",
        "",
        ".option-btn:hover { border-color: #2563eb; color: #2563eb; }",
        "",
        ".quiz-footer {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  align-items: center;",
        "}",
        "",
        ".btn-primary {",
        "  border: none;",
        "  background: #2563eb;",
        "  color: #ffffff;",
        "  padding: 10px 22px;",
        "  border-radius: 10px;",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        ".btn-primary:hover { background: #1d4ed8; }",
        "",
        "@media (max-width: 480px) {",
        "  .container { padding: 20px 16px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has three screens (#startScreen, #quizScreen, #resultScreen)",
        "//   plus the question (#questionText), options (#optionsContainer),",
        "//   score (#scoreValue), Next button (#nextBtn) and final score (#finalScore)",
        "//   style.css is complete — the layout and screens are done for you",
        "",
        "// Step 2: Question data & state",
        "//   Create a questions array — each question has question, options and",
        "//   correctIndex — plus let currentIndex = 0 and let score = 0",
        "",
        "// Step 3: Render a question",
        "//   Write renderQuestion() that shows the question text and creates",
        "//   one button per option (with dataset.index)",
        "",
        "// Step 4: Answer selection",
        "//   On option click, compare the chosen index to correctIndex and",
        "//   increase the score when correct",
        "",
        "// Step 5: Next & results",
        "//   Next advances currentIndex — render the next question or show",
        "//   the results screen with the final score",
        "",
        "// Step 6: Final touch & test",
        "//   Wire Start (and Restart) to reset the state, then test the full flow"
      ].join("\n")
    }
  },

  "quotegenerator": {
    slug: "quotegenerator",
    folder: "QuoteGenerator",
    title: "Quote Generator",
    difficulty: "Beginner",
    time: "25 min",
    category: "Core JS",
    tags: ["Arrays", "Random", "DOM"],
    intro: "Build a quote generator that picks a random quote from an array and displays it with its author. You'll practice working with arrays, random selection, DOM updates and button events.",
    previewNote: "You'll build a working quote generator: click New Quote and a random quote appears — with a Copy button that puts it on your clipboard.",
    cover: "../../assets/project-covers/quotegenerator.jpeg",
    previewUrl: "../../../JS%20PROJECTS/QuoteGenerator/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Store quotes as an array of objects with text and author.",
      "Math.random() returns a value from 0 up to (but not including) 1 — multiply by the array length.",
      "Math.floor() rounds down so the random value becomes a valid array index.",
      "Avoid showing the same quote twice in a row by remembering the last index.",
      "navigator.clipboard.writeText() copies text with a clean one-liner."
    ],
    concepts: [
      "Storing data as arrays of objects",
      "Random selection with Math.random() and Math.floor()",
      "Updating the DOM with textContent",
      "Event handling for buttons",
      "Using the Clipboard API"
    ],
    challenge: "Extra challenge: show a toast when the quote is copied, or fade the quote in on each change.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the quote display (#quote), the author (#author), and the two buttons (#newQuoteBtn, #copyBtn).",
          "Open style.css — the card layout is already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see a static quote."
        ],
        logicCode: [
          "// 1. index.html — find #quote, #author, #newQuoteBtn, #copyBtn",
          "// 2. style.css — card layout is already done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see a static quote"
        ],
        think: "Which element IDs will your JavaScript need to select to show quotes?",
        hints: [
          "The quote text goes into #quote.",
          "The author goes into #author.",
          "The buttons are #newQuoteBtn and #copyBtn."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const quoteEl = document.getElementById('quote')." }
          ]
        }
      },
      {
        title: "Quote Data",
        tagline: "Store your quotes as data.",
        goal: "Create an array of quote objects — each with a text and an author — so the generator can pick from them.",
        logic: [
          "Create an array named quotes.",
          "Add 5-6 quote objects inside it.",
          "Give each quote a text property.",
          "Give each quote an author property."
        ],
        logicCode: [
          "// 1. Create the quotes array",
          "const quotes = [",
          "  {",
          "    // 2. The quote text",
          "    text: 'The only way to do great work is to love what you do.',",
          "    // 3. The author",
          "    author: 'Steve Jobs'",
          "  },",
          "  // ... add a few more quotes",
          "];"
        ],
        think: "Why store the author with the quote instead of hard-coding it in the HTML?",
        hints: [
          "Each quote is an object with text and author keys.",
          "Keep them all inside one array named quotes.",
          "Add at least 5 quotes so the generator feels random."
        ],
        check: {
          requires: [
            { pattern: "(const|let|var)\\s+quotes", hint: "Create an array: const quotes = [ ... ];" },
            { pattern: "author\\s*:", hint: "Each quote needs an author property." }
          ]
        }
      },
      {
        title: "Random Selection",
        tagline: "Pick a random quote.",
        goal: "Write a function that picks a random index from the quotes array.",
        logic: [
          "Write a function that returns a random quote.",
          "Generate a random number with Math.random().",
          "Scale it by the array length.",
          "Round it down with Math.floor() to get an index."
        ],
        logicCode: [
          "// 1. Pick a random quote",
          "function getRandomQuote() {",
          "  // 2. Random value scaled by the array length",
          "  const randomIndex = Math.floor(Math.random() * quotes.length);",
          "  // 3. Return the quote at that index",
          "  return quotes[randomIndex];",
          "}"
        ],
        think: "Why multiply Math.random() by quotes.length?",
        hints: [
          "Math.random() gives a value between 0 and 1.",
          "Multiplying by quotes.length scales it to the array's size.",
          "Math.floor() rounds down so the result is a valid index (0 to length - 1)."
        ],
        check: {
          requires: [
            { pattern: "Math\\.random\\s*\\(", hint: "Generate randomness with Math.random()." },
            { pattern: "Math\\.floor\\s*\\(", hint: "Round down with Math.floor() to get a valid array index." },
            { pattern: "quotes\\.length", hint: "Scale the random value by quotes.length." }
          ]
        }
      },
      {
        title: "Display a Quote",
        tagline: "Write the quote to the page.",
        goal: "Write a function that takes a quote and shows its text and author in the DOM.",
        logic: [
          "Write a function named displayQuote.",
          "Accept a quote object as a parameter.",
          "Write the quote text into #quote.",
          "Write the author into #author."
        ],
        logicCode: [
          "// 1. Write the display function",
          "function displayQuote(quote) {",
          "  // 2. Show the quote text",
          "  quoteEl.textContent = '\"' + quote.text + '\"';",
          "  // 3. Show the author",
          "  authorEl.textContent = '— ' + quote.author;",
          "}",
          "// 4. Show a quote right away",
          "displayQuote(getRandomQuote());"
        ],
        think: "Why call displayQuote once at the start?",
        hints: [
          "textContent replaces the element's text cleanly.",
          "Pass the quote object in as a parameter.",
          "Call displayQuote(getRandomQuote()) on load so the page isn't empty."
        ],
        check: {
          requires: [
            { pattern: "(textContent|innerText)\\s*=", hint: "Write the quote text with textContent." },
            { pattern: "(author|quote)", hint: "Update both the quote and the author elements." }
          ]
        }
      },
      {
        title: "Button Events",
        tagline: "Make the buttons work.",
        goal: "The New Quote button shows a new random quote — and the Copy button copies it to the clipboard.",
        logic: [
          "Listen for clicks on the New Quote button.",
          "Get a random quote and display it.",
          "Listen for clicks on the Copy button.",
          "Copy the current quote text to the clipboard."
        ],
        logicCode: [
          "// 1. New Quote button",
          "newQuoteBtn.addEventListener('click', () => {",
          "  // 2. Show a fresh random quote",
          "  displayQuote(getRandomQuote());",
          "});",
          "// 3. Copy button",
          "copyBtn.addEventListener('click', () => {",
          "  // 4. Copy the current quote",
          "  const text = quoteEl.textContent + ' — ' + authorEl.textContent;",
          "  navigator.clipboard.writeText(text);",
          "});"
        ],
        think: "What exactly should the Copy button copy to the clipboard?",
        hints: [
          "Attach click listeners to both buttons.",
          "New Quote just calls displayQuote(getRandomQuote()).",
          "navigator.clipboard.writeText(text) copies the quote — it returns a Promise."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "Attach click listeners to the buttons." },
            { pattern: "(clipboard|execCommand|select\\s*\\(\\s*\\))", hint: "Copy the text with navigator.clipboard.writeText() (or a select() fallback)." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the generator.",
        goal: "Test the New Quote and Copy buttons — and polish anything that feels off.",
        logic: [
          "Open the page — does a quote show immediately?",
          "Click New Quote — does it change?",
          "Click it several times — do quotes vary?",
          "Click Copy — does the quote land on your clipboard?"
        ],
        logicCode: [
          "// 1. Open the page — does a quote show immediately?",
          "// 2. Click New Quote — does it change?",
          "// 3. Click it several times — do quotes vary?",
          "// 4. Click Copy — does it land on your clipboard?"
        ],
        think: "How could you stop the same quote from appearing twice in a row?",
        hints: [
          "Check the quote changes on each click.",
          "If Copy fails, the Clipboard API needs a secure context (https or localhost).",
          "Remembering the last index and re-rolling is a fun improvement."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one button should have a click listener." },
            { pattern: "(textContent|innerText)", hint: "Render the quote into the page with textContent." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Quote Generator</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <div class="card">',
        '            <div class="header">',
        "                <h1>Quote Generator</h1>",
        "                <p>Get inspired with random quotes</p>",
        "            </div>",
        '            <div class="line"></div>',
        '            <div class="quote-box">',
        '                <p id="quote">\"Click New Quote to get inspired.\"</p>',
        '                <h3 id="author">— Unknown</h3>',
        "            </div>",
        '            <div class="buttons">',
        '                <button id="newQuoteBtn">New Quote</button>',
        '                <button id="copyBtn" class="secondary">Copy</button>',
        "            </div>",
        "        </div>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".container { width: min(520px, 100%); }",
        "",
        ".card {",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  padding: 36px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "  text-align: center;",
        "}",
        "",
        ".header h1 { font-size: 1.6rem; }",
        ".header p { color: #6b7280; margin-top: 6px; font-size: 0.95rem; }",
        "",
        ".line {",
        "  width: 70px;",
        "  height: 4px;",
        "  background: #2563eb;",
        "  border-radius: 10px;",
        "  margin: 20px auto 28px;",
        "}",
        "",
        ".quote-box { margin-bottom: 28px; }",
        "",
        ".quote-box p {",
        "  font-size: 1.25rem;",
        "  line-height: 1.6;",
        "  color: #1f2937;",
        "  font-style: italic;",
        "  min-height: 100px;",
        "}",
        "",
        ".quote-box h3 {",
        "  color: #2563eb;",
        "  margin-top: 12px;",
        "  font-size: 1rem;",
        "  font-weight: 600;",
        "}",
        "",
        ".buttons { display: flex; gap: 12px; justify-content: center; }",
        "",
        ".buttons button {",
        "  border: none;",
        "  background: #2563eb;",
        "  color: #ffffff;",
        "  padding: 10px 22px;",
        "  border-radius: 10px;",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "  font-family: inherit;",
        "}",
        "",
        ".buttons button:hover { background: #1d4ed8; }",
        ".buttons button.secondary { background: #e5e7eb; color: #374151; }",
        ".buttons button.secondary:hover { background: #d1d5db; }",
        "",
        "@media (max-width: 480px) {",
        "  .card { padding: 24px 18px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the quote (#quote), the author (#author) and the",
        "//   buttons (#newQuoteBtn, #copyBtn)",
        "//   style.css is complete — the card layout is done for you",
        "",
        "// Step 2: Quote data",
        "//   Create a quotes array — each quote is an object with text and author",
        "",
        "// Step 3: Random selection",
        "//   Write getRandomQuote() that returns a random quote using",
        "//   Math.floor(Math.random() * quotes.length)",
        "",
        "// Step 4: Display a quote",
        "//   Write displayQuote(quote) that writes the text into #quote and the",
        "//   author into #author — and call it once on load",
        "",
        "// Step 5: Button events",
        "//   New Quote shows a fresh random quote; Copy copies the current quote",
        "//   with navigator.clipboard.writeText()",
        "",
        "// Step 6: Final touch & test",
        "//   Test New Quote and Copy — then polish"
      ].join("\n")
    }
  },

  "weather-app": {
    slug: "weather-app",
    folder: "weather-app",
    title: "Weather App",
    difficulty: "Intermediate",
    time: "45 min",
    category: "APIs & Data",
    tags: ["API", "Fetch", "Async"],
    intro: "Build a weather app that fetches live conditions from the OpenWeatherMap API and renders temperature, description, humidity and wind for any city. You'll practice API requests, async/await, JSON handling and loading/error states.",
    previewNote: "You'll build a working weather app: type a city, hit search, and see the live temperature, conditions, humidity and wind pulled from the OpenWeatherMap API.",
    cover: "../../assets/project-covers/weather-app.png",
    previewUrl: "../../../JS%20PROJECTS/weather-app/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "OpenWeatherMap needs an API key — get a free one at openweathermap.org/api and store it in a constant.",
      "The endpoint is https://api.openweathermap.org/data/2.5/weather?q=CITY&appid=KEY&units=metric",
      "units=metric returns Celsius — much easier to read for this project.",
      "Use async/await with fetch() and check response.ok (a 404 means the city wasn't found).",
      "The icon URL is https://openweathermap.org/img/wn/{icon}@2x.png from data.weather[0].icon."
    ],
    concepts: [
      "Making API requests with fetch()",
      "Writing async functions with await",
      "Handling JSON responses",
      "Rendering weather data into the DOM",
      "Managing loading and error states"
    ],
    challenge: "Extra challenge: show a 5-day forecast, or add a 'Current location' button that uses the geolocation API.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the search form (#searchForm), the input (#searchInput), the loading indicator (#loading), the error element (#errorMsg) and the weather card (#weatherCard) with its temperature, description, humidity and wind elements.",
          "Open style.css — the layout and card styles are already done for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see the search form."
        ],
        logicCode: [
          "// 1. index.html — find #searchForm, #searchInput, #loading, #errorMsg, #weatherCard",
          "// 2. style.css — layout and card styles are done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see the search form"
        ],
        think: "Which element IDs will your JavaScript need to select to render weather data?",
        hints: [
          "The form is #searchForm — submitting it triggers the fetch.",
          "The city comes from #searchInput.",
          "Weather renders inside #weatherCard — it starts hidden."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const searchForm = document.getElementById('searchForm')." }
          ]
        }
      },
      {
        title: "Search Handler",
        tagline: "Trigger a search on submit.",
        goal: "When the form is submitted, read the city name and kick off the API request — without reloading the page.",
        logic: [
          "Listen for the submit event on the form.",
          "Prevent the page from reloading.",
          "Read and trim the city from the input.",
          "Call a fetch function with that city."
        ],
        logicCode: [
          "// 1. Listen for form submit",
          "searchForm.addEventListener('submit', (e) => {",
          "  // 2. Stop the page reload",
          "  e.preventDefault();",
          "  // 3. Read the city",
          "  const city = searchInput.value.trim();",
          "  if (!city) return;",
          "  // 4. Kick off the fetch",
          "  getWeather(city);",
          "});"
        ],
        think: "Why guard against an empty city name before fetching?",
        hints: [
          "Attach the listener to the form and call e.preventDefault().",
          "searchInput.value.trim() cleans up the typed city.",
          "Skip the request if the city is empty."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']submit", hint: "Listen for the submit event on the form." },
            { pattern: "preventDefault", hint: "Call e.preventDefault() so the page doesn't reload." },
            { pattern: "\\.value", hint: "Read the city from the input, e.g. searchInput.value.trim()." }
          ]
        }
      },
      {
        title: "Fetch the Weather",
        tagline: "Request data from OpenWeatherMap.",
        goal: "Write an async function that fetches the weather for the given city from the OpenWeatherMap API.",
        logic: [
          "Write an async function named getWeather.",
          "Build the API URL with the city, your key and units=metric.",
          "Await fetch() and check response.ok.",
          "Await response.json() to get the data."
        ],
        logicCode: [
          "// 1. Async function to fetch the weather",
          "async function getWeather(city) {",
          "  // 2. Build the OpenWeatherMap URL",
          "  const url = 'https://api.openweathermap.org/data/2.5/weather?q=' +",
          "    encodeURIComponent(city) + '&appid=' + API_KEY + '&units=metric';",
          "  // 3. Fetch and check the response",
          "  const response = await fetch(url);",
          "  if (!response.ok) throw new Error('City not found');",
          "  // 4. Parse the JSON",
          "  const data = await response.json();",
          "  renderWeather(data);",
          "}"
        ],
        think: "Why add units=metric to the request URL?",
        hints: [
          "The endpoint is https://api.openweathermap.org/data/2.5/weather.",
          "Add ?q=CITY&appid=KEY&units=metric to the URL.",
          "Store your key in a constant like const API_KEY = '...'."
        ],
        check: {
          requires: [
            { pattern: "async", hint: "Make the function async so you can use await." },
            { pattern: "fetch\\s*\\(", hint: "Call fetch() with the OpenWeatherMap URL." },
            { pattern: "\\.json\\s*\\(", hint: "Parse the response with response.json()." }
          ]
        }
      },
      {
        title: "Render the Weather",
        tagline: "Display the weather data.",
        goal: "Fill the card with the temperature, description, humidity, wind and icon from the API data.",
        logic: [
          "Set the temperature with the metric value.",
          "Write the city name and description.",
          "Write the humidity and wind values.",
          "Set the weather icon image and show the card."
        ],
        logicCode: [
          "// 1. Temperature and conditions",
          "temperature.textContent = Math.round(data.main.temp) + '°C';",
          "cityName.textContent = data.name;",
          "description.textContent = data.weather[0].description;",
          "// 2. Humidity and wind",
          "humidity.textContent = data.main.humidity + '%';",
          "windSpeed.textContent = data.wind.speed + ' km/h';",
          "// 3. Weather icon",
          "weatherIcon.src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';",
          "// 4. Show the card",
          "weatherCard.hidden = false;",
          "errorMsg.hidden = true;"
        ],
        think: "Why is data.weather an array?",
        hints: [
          "data.main.temp is the temperature and data.main.humidity the humidity.",
          "data.weather is an array — use data.weather[0] for the conditions.",
          "Math.round() keeps the temperature display clean."
        ],
        check: {
          requires: [
            { pattern: "textContent\\s*=", hint: "Write weather values into elements with textContent." },
            { pattern: "(main|weather)", hint: "Read from data.main (temp, humidity) and/or data.weather (description, icon)." },
            { pattern: "(hidden|classList)", hint: "Show the weather card once the data is rendered." }
          ]
        }
      },
      {
        title: "Loading & Error States",
        tagline: "Show feedback while fetching.",
        goal: "Show a loading indicator while the request runs and an error message when it fails.",
        logic: [
          "Show the loading indicator before fetching.",
          "Hide it once the request finishes.",
          "Show a friendly error for a missing city.",
          "Wrap the fetch in try/catch for network errors."
        ],
        logicCode: [
          "// 1. Show loading before the request",
          "loading.hidden = false;",
          "errorMsg.hidden = true;",
          "try {",
          "  const response = await fetch(url);",
          "  if (!response.ok) throw new Error('City not found — check the spelling');",
          "  const data = await response.json();",
          "  // 2. Hide loading when done",
          "  loading.hidden = true;",
          "  renderWeather(data);",
          "} catch (err) {",
          "  // 3. Show the error",
          "  loading.hidden = true;",
          "  errorMsg.textContent = err.message;",
          "  errorMsg.hidden = false;",
          "}"
        ],
        think: "Why hide the loading indicator in both the success and error paths?",
        hints: [
          "Toggle the .hidden property on #loading before and after the request.",
          "A 404 (or !response.ok) means the city wasn't found.",
          "try/catch catches network failures that aren't API errors."
        ],
        check: {
          requires: [
            { pattern: "(hidden|classList)", hint: "Toggle loading and error states with the hidden property or classList." },
            { pattern: "(try\\s*\\{|catch)", hint: "Wrap the request in try/catch to handle failures." },
            { pattern: "(errorMsg|errorMessage)", hint: "Display errors in an error element." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the app.",
        goal: "Test searching real cities and error handling — then polish anything that feels off.",
        logic: [
          "Search 'London' — does the weather card render?",
          "Search 'New York' — does it update?",
          "Search a nonsense city — does the error appear?",
          "Watch the loading indicator during a search."
        ],
        logicCode: [
          "// 1. Search 'London' — does the weather card render?",
          "// 2. Search 'New York' — does it update?",
          "// 3. Search nonsense — does the error appear?",
          "// 4. Does the loading indicator show during the search?"
        ],
        think: "What should happen to the old weather card when a new search fails?",
        hints: [
          "OpenWeatherMap rate-limits free keys — a search every few seconds is fine.",
          "If the icon is blank, check data.weather[0].icon is present.",
          "console.log(data) after response.json() helps debug the API shape."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one listener should drive the search (form submit)." },
            { pattern: "fetch\\s*\\(", hint: "The page should make an API request with fetch()." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>Weather App</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <header class="weather-header">',
        "            <h1>⛅ Weather App</h1>",
        '            <p class="subtitle">Real-time weather at your fingertips</p>',
        "        </header>",
        '        <form class="search-form" id="searchForm">',
        '            <input type="text" id="searchInput" placeholder="Search for a city..." autocomplete="off">',
        '            <button type="submit" id="searchBtn">Search</button>',
        "        </form>",
        '        <p class="loading" id="loading" hidden>Fetching weather...</p>',
        '        <p class="error-msg" id="errorMsg" hidden></p>',
        '        <section class="weather-card" id="weatherCard" hidden>',
        '            <img id="weatherIcon" alt="Weather icon">',
        '            <h2 id="cityName">—</h2>',
        '            <span class="temperature" id="temperature">—°C</span>',
        '            <p class="description" id="description">—</p>',
        '            <div class="details">',
        '                <div><span>Humidity</span><b id="humidity">—</b></div>',
        '                <div><span>Wind</span><b id="windSpeed">—</b></div>',
        "            </div>",
        "        </section>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  background: #f9fafb;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  padding: 40px 24px;",
        "}",
        "",
        ".container {",
        "  width: min(520px, 100%);",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 24px;",
        "  padding: 32px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".weather-header { margin-bottom: 20px; text-align: center; }",
        ".weather-header h1 { font-size: 1.8rem; }",
        ".subtitle { color: #6b7280; margin-top: 4px; }",
        "",
        ".search-form { display: flex; gap: 10px; margin-bottom: 16px; }",
        "",
        ".search-form input {",
        "  flex: 1;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 10px;",
        "  padding: 10px 14px;",
        "  font-size: 0.95rem;",
        "  font-family: inherit;",
        "  outline: none;",
        "}",
        "",
        ".search-form input:focus { border-color: #2563eb; }",
        "",
        ".search-form button {",
        "  border: none;",
        "  background: #2563eb;",
        "  color: #ffffff;",
        "  padding: 10px 20px;",
        "  border-radius: 10px;",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        ".loading { color: #6b7280; font-size: 0.9rem; margin-bottom: 12px; text-align: center; }",
        ".error-msg { color: #dc2626; font-size: 0.9rem; margin-bottom: 12px; text-align: center; }",
        "",
        ".weather-card { text-align: center; padding: 20px; border: 1px solid #e5e7eb; border-radius: 18px; }",
        "",
        ".weather-card img { width: 90px; height: 90px; margin-bottom: 6px; }",
        ".weather-card h2 { font-size: 1.4rem; }",
        "",
        ".temperature {",
        "  display: block;",
        "  font-size: 3rem;",
        "  font-weight: 700;",
        "  color: #2563eb;",
        "  margin: 4px 0;",
        "}",
        "",
        ".description { color: #6b7280; text-transform: capitalize; margin-bottom: 18px; }",
        "",
        ".details {",
        "  display: flex;",
        "  justify-content: center;",
        "  gap: 40px;",
        "}",
        "",
        ".details div { display: flex; flex-direction: column; }",
        ".details span { color: #6b7280; font-size: 0.8rem; }",
        "",
        "@media (max-width: 480px) {",
        "  .container { padding: 20px 16px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the search form (#searchForm), the input (#searchInput),",
        "//   the loading indicator (#loading), the error element (#errorMsg) and the",
        "//   weather card (#weatherCard) with its temperature, description, humidity",
        "//   and wind elements",
        "//   style.css is complete — the layout and card styles are done for you",
        "",
        "// Step 2: Search handler",
        "//   Listen for submit on the form, preventDefault(), read and trim the",
        "//   city, and call a fetch function",
        "",
        "// Step 3: Fetch the weather",
        "//   Write an async function that fetches",
        "//   https://api.openweathermap.org/data/2.5/weather?q=CITY&appid=KEY&units=metric",
        "//   (store your key in a const API_KEY), checks response.ok, and parses the JSON",
        "",
        "// Step 4: Render the weather",
        "//   Fill temperature, city name, description, humidity and wind from the",
        "//   data, set the icon from data.weather[0].icon, and show the card",
        "",
        "// Step 5: Loading & error states",
        "//   Show #loading while fetching, hide it when done, and show errors",
        "//   in #errorMsg (both unknown cities and network failures)",
        "",
        "// Step 6: Final touch & test",
        "//   Test a real city, a second city, and a nonsense city — then polish"
      ].join("\n")
    }
  },

  "password-generator": {
    slug: "password-generator",
    folder: "password Generator",
    title: "Password Generator",
    difficulty: "Beginner",
    time: "40 min",
    category: "Core JS",
    tags: ["DOM", "Strings", "Random"],
    intro: "Build a password generator with a length slider, character options and one-click copy. You'll practice DOM manipulation, strings and arrays, random selection with Math.random(), loops, and assembling a password from character sets.",
    previewNote: "You'll build a working password generator: drag the length slider, pick which character types to include, hit Generate — and get a random password you can copy with one click.",
    cover: "../../assets/project-covers/password-generator.png",
    previewUrl: "../../../JS%20PROJECTS/password%20Generator/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Store each character set as a string constant — uppercase, lowercase, numbers and symbols.",
      "Math.random() * set.length gives a random index — Math.floor() turns it into a valid position.",
      "Collect the checked sets into an array first, then join them into one pool of characters to pick from.",
      "Guarantee at least one character from every selected set before filling the rest randomly — it makes the password balanced.",
      "If every checkbox is unchecked, fall back to lowercase instead of generating an empty password.",
      "Strings index like arrays: 'abc'[1] is 'b' — so chars[Math.floor(Math.random() * chars.length)] picks a random character."
    ],
    concepts: [
      "DOM manipulation with element selection and events",
      "Working with strings and character sets",
      "Arrays and joining a character pool",
      "Random selection with Math.random() and Math.floor()",
      "Loops for building the password"
    ],
    challenge: "Extra challenge: add a strength meter that scores the password, or a shuffle pass so the generated password isn't predictable.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the generator UI.",
        goal: "Open the starter files and understand how the controls, the output panel and script.js fit together.",
        logic: [
          "Look at index.html — find the password display (#password), the copy button (#copyBtn), the length slider (#lengthSlider) with its badge (#lengthValue), the four option checkboxes (#upper, #lower, #number, #symbol) and the generate button (#generateBtn).",
          "Find the strength meter (#strengthLabel, #fill) and the 'Generate Another' button (#againBtn).",
          "Open style.css — the layout, slider, option cards and output panel are already styled for you.",
          "Open script.js — it only contains comments that mark the steps ahead."
        ],
        logicCode: [
          "// 1. index.html — find #password, #copyBtn, #lengthSlider, #lengthValue",
          "// 2. Checkboxes — #upper, #lower, #number, #symbol",
          "// 3. style.css — layout and controls are done for you",
          "// 4. script.js — comments mark the steps ahead"
        ],
        think: "Which element IDs will your JavaScript need to select to read options and show the password?",
        hints: [
          "The generated password shows in #password.",
          "The length comes from #lengthSlider and its value is shown in #lengthValue.",
          "The four checkboxes live at #upper, #lower, #number and #symbol."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const passwordEl = document.getElementById('password')." }
          ]
        }
      },
      {
        title: "Select Elements",
        tagline: "Connect the controls.",
        goal: "Select the password display, the length slider, the checkboxes, the generate button and the strength elements.",
        logic: [
          "Select the password display and the generate button.",
          "Select the length slider and its value badge.",
          "Select the four option checkboxes.",
          "Select the strength label and fill."
        ],
        logicCode: [
          "// 1. Display and generate button",
          "const passwordEl = document.getElementById('password');",
          "const generateBtn = document.getElementById('generateBtn');",
          "// 2. Length slider and badge",
          "const lengthSlider = document.getElementById('lengthSlider');",
          "const lengthValue = document.getElementById('lengthValue');",
          "// 3. Option checkboxes",
          "const upperCheck = document.getElementById('upper');",
          "const lowerCheck = document.getElementById('lower');",
          "const numberCheck = document.getElementById('number');",
          "const symbolCheck = document.getElementById('symbol');"
        ],
        think: "Why keep all the selected elements in constants at the top of the script?",
        hints: [
          "The password shows in #password and is generated by #generateBtn.",
          "The slider is #lengthSlider and its badge is #lengthValue.",
          "The options are #upper, #lower, #number and #symbol."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector)." },
            { pattern: "(lengthSlider|generateBtn|upper|lower|number|symbol)", hint: "Hook into the generator controls — the slider, the generate button and the option checkboxes." }
          ]
        }
      },
      {
        title: "Create Character Sets",
        tagline: "Prepare the character pools.",
        goal: "Define the uppercase, lowercase, number and symbol character sets, then build a pool from the checked options.",
        logic: [
          "Define a string constant for each character set.",
          "Collect the checked sets into an array.",
          "Join them into a single pool of characters.",
          "Fall back to lowercase if nothing is checked."
        ],
        logicCode: [
          "// 1. Character sets",
          "const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';",
          "const lower = 'abcdefghijklmnopqrstuvwxyz';",
          "const numbers = '0123456789';",
          "const symbols = '!@#$%^&*';",
          "// 2. Pool from checked options",
          "const sets = [];",
          "if (upperCheck.checked) sets.push(upper);",
          "if (lowerCheck.checked) sets.push(lower);",
          "if (numberCheck.checked) sets.push(numbers);",
          "if (symbolCheck.checked) sets.push(symbols);",
          "// 3. Fallback when nothing is checked",
          "if (sets.length === 0) sets.push(lower);"
        ],
        think: "Why fall back to lowercase when every checkbox is unchecked?",
        hints: [
          "Each set is just a string of characters.",
          "Array.push() adds the checked sets to a list.",
          "sets.join('') combines them into one pool of characters."
        ],
        check: {
          requires: [
            { pattern: "(ABCDEFGHIJKLMNOPQRSTUVWXYZ|abcdefghijklmnopqrstuvwxyz|0123456789)", hint: "Define the character sets as strings, e.g. 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'." },
            { pattern: "checked", hint: "Read the checkboxes — .checked tells you which sets are selected." }
          ]
        }
      },
      {
        title: "Generate the Password",
        tagline: "Pick random characters.",
        goal: "Build the password by picking random characters from the pool until it reaches the chosen length.",
        logic: [
          "Read the target length from the slider.",
          "Build the pool from the selected sets.",
          "Pick a random character with Math.random() and Math.floor().",
          "Loop until the password reaches the target length."
        ],
        logicCode: [
          "// 1. Target length from the slider",
          "const length = +lengthSlider.value;",
          "// 2. Pick a random character",
          "const pool = sets.join('');",
          "const randomChar = pool[Math.floor(Math.random() * pool.length)];",
          "// 3. Loop until the password is long enough",
          "let password = '';",
          "for (let i = 0; i < length; i++) {",
          "  password += pool[Math.floor(Math.random() * pool.length)];",
          "}"
        ],
        think: "Why do you need Math.floor() around Math.random() * pool.length?",
        hints: [
          "Math.random() returns a decimal between 0 and 1.",
          "Math.floor() rounds down so the index is always a valid position.",
          "A for loop that runs length times builds the full password."
        ],
        check: {
          requires: [
            { pattern: "Math\\.random", hint: "Use Math.random() to pick a random character." },
            { pattern: "Math\\.floor", hint: "Math.floor() turns the random value into a valid index." },
            { pattern: "(for\\s*\\(|while\\s*\\()", hint: "Loop until the password reaches the target length." }
          ]
        }
      },
      {
        title: "Display the Password",
        tagline: "Show the generated password.",
        goal: "Write the generated password into the display, and update the length badge as the slider moves.",
        logic: [
          "Write the password into the display element.",
          "Update the badge when the slider moves.",
          "Generate on the button click.",
          "Generate on the 'Generate Another' button too."
        ],
        logicCode: [
          "// 1. Show the password",
          "passwordEl.textContent = password;",
          "// 2. Badge follows the slider",
          "lengthSlider.addEventListener('input', () => {",
          "  lengthValue.textContent = lengthSlider.value;",
          "});",
          "// 3. Generate on click",
          "generateBtn.addEventListener('click', generatePassword);"
        ],
        think: "Why use textContent instead of innerHTML for the password?",
        hints: [
          "passwordEl.textContent = password shows the generated text.",
          "The badge #lengthValue updates on the slider's input event.",
          "Attach the same generate function to #generateBtn and #againBtn."
        ],
        check: {
          requires: [
            { pattern: "(textContent|innerText)\\s*=", hint: "Write the password into the display with textContent." },
            { pattern: "addEventListener", hint: "Attach a listener to the generate button (and the slider)." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Validate and test combos.",
        goal: "Test different lengths and option combinations, and make sure the generator never breaks.",
        logic: [
          "Generate with all four options — is it the right length?",
          "Uncheck everything except symbols — does it still generate?",
          "Uncheck all four — does it fall back instead of breaking?",
          "Drag the slider to 8 and to 32 — does the badge update?",
          "Click Generate repeatedly — is every password different?"
        ],
        logicCode: [
          "// 1. All four options — right length?",
          "// 2. Only symbols — still generates?",
          "// 3. Nothing checked — falls back to lowercase?",
          "// 4. Slider at 8 and 32 — does the badge update?",
          "// 5. Repeated clicks — different passwords?"
        ],
        think: "What should happen if the user tries to copy before generating anything?",
        hints: [
          "A fresh password should appear on every click — randomness gives you that for free.",
          "If a combo produces an empty password, check the fallback for an empty sets array.",
          "Bonus: wire up #copyBtn with navigator.clipboard.writeText(passwordEl.textContent)."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one listener should drive generation (the button)." },
            { pattern: "Math\\.random", hint: "The generator should use Math.random() to build the password." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '  <meta charset="UTF-8" />',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        "  <title>Password Generator</title>",
        '  <link rel="stylesheet" href="style.css" />',
        "</head>",
        "<body>",
        '  <main id="hero">',
        "",
        "    <!-- LEFT PANEL : Controls -->",
        '    <section id="controls">',
        '      <h1 class="heading">Strong Password<br /><span class="gradient-text">Generator</span></h1>',
        '      <p class="subtitle">Create secure, random passwords with custom options.</p>',
        "",
        '      <div class="control-group">',
        '        <div class="control-header">',
        "          <h3>Password Length</h3>",
        '          <span class="badge" id="lengthValue">16</span>',
        "        </div>",
        '        <div class="slider-wrapper">',
        '          <input type="range" id="lengthSlider" class="premium-slider" min="8" max="32" value="16" aria-label="Password length" />',
        '          <div class="slider-labels"><span>8</span><span>16</span><span>24</span><span>32</span></div>',
        "        </div>",
        "      </div>",
        "",
        '      <div class="control-group">',
        '        <h3 class="control-heading">Include Characters</h3>',
        '        <div class="option-grid">',
        '          <label class="option-card">',
        '            <input type="checkbox" id="upper" class="option-check" checked />',
        '            <span class="option-icon purple">Aa</span>',
        "            <span class=\"option-title\">Uppercase</span>",
        "            <span class=\"option-desc\">A &ndash; Z</span>",
        "          </label>",
        '          <label class="option-card">',
        '            <input type="checkbox" id="lower" class="option-check" checked />',
        '            <span class="option-icon blue">aa</span>',
        "            <span class=\"option-title\">Lowercase</span>",
        "            <span class=\"option-desc\">a &ndash; z</span>",
        "          </label>",
        '          <label class="option-card">',
        '            <input type="checkbox" id="number" class="option-check" checked />',
        '            <span class="option-icon cyan">09</span>',
        "            <span class=\"option-title\">Numbers</span>",
        "            <span class=\"option-desc\">0 &ndash; 9</span>",
        "          </label>",
        '          <label class="option-card">',
        '            <input type="checkbox" id="symbol" class="option-check" checked />',
        '            <span class="option-icon orange">!@#</span>',
        "            <span class=\"option-title\">Symbols</span>",
        "            <span class=\"option-desc\">! @ # $ &hellip;</span>",
        "          </label>",
        "        </div>",
        "      </div>",
        "",
        '      <button class="btn-primary" id="generateBtn">Generate Password</button>',
        "    </section>",
        "",
        "    <!-- RIGHT PANEL : Output -->",
        '    <section id="output">',
        "      <h2 class=\"section-label\">Your Password</h2>",
        '      <div class="password-display">',
        '        <p class="password-text" id="password">Click generate to start</p>',
        '        <button class="icon-btn" id="copyBtn" aria-label="Copy password">Copy</button>',
        "      </div>",
        '      <p id="copyMsg"></p>',
        "",
        '      <div class="strength-section">',
        '        <div class="strength-header">',
        "          <h3>Strength</h3>",
        '          <span class="strength-label strong" id="strengthLabel">Strong</span>',
        "        </div>",
        '        <div class="strength-meter"><div class="strength-fill strong" id="fill" style="width: 100%"></div></div>',
        '        <div class="meter-labels"><span>Weak</span><span>Medium</span><span>Strong</span></div>',
        "      </div>",
        "",
        '      <button class="btn-secondary" id="againBtn">Generate Another</button>',
        "    </section>",
        "  </main>",
        "",
        '  <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        ":root {",
        "  --bg-primary: #0B1020;",
        "  --bg-secondary: #131A2F;",
        "  --bg-tertiary: #0F1629;",
        "  --surface: rgba(19, 26, 47, 0.75);",
        "  --text-primary: #EEF2FF;",
        "  --text-secondary: #A7B0D0;",
        "  --text-muted: #6B7294;",
        "  --purple: #7C4DFF;",
        "  --blue: #3B82F6;",
        "  --cyan: #06B6D4;",
        "  --orange: #FB923C;",
        "  --green: #22C55E;",
        "  --red: #EF4444;",
        "  --yellow: #EAB308;",
        "  --gradient-accent: linear-gradient(135deg, #7C4DFF, #3B82F6);",
        "  --glass-border: rgba(38, 49, 79, 0.6);",
        "  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);",
        "  --radius-sm: 12px;",
        "  --radius-md: 16px;",
        "  --radius-lg: 20px;",
        "  --radius-xl: 24px;",
        "  --transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);",
        "}",
        "",
        "body {",
        "  font-family: 'Poppins', system-ui, sans-serif;",
        "  background: var(--bg-primary);",
        "  color: var(--text-primary);",
        "  min-height: 100vh;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  padding: 20px;",
        "}",
        "",
        "#hero {",
        "  width: 100%;",
        "  max-width: 1000px;",
        "  display: grid;",
        "  grid-template-columns: 1fr 1fr;",
        "  gap: 32px;",
        "}",
        "",
        "#controls, #output {",
        "  background: var(--surface);",
        "  border: 1px solid var(--glass-border);",
        "  border-radius: var(--radius-xl);",
        "  padding: 36px 32px;",
        "  box-shadow: var(--glass-shadow);",
        "}",
        "",
        ".heading {",
        "  font-size: 2.2rem;",
        "  font-weight: 800;",
        "  line-height: 1.2;",
        "  letter-spacing: -0.5px;",
        "}",
        "",
        ".gradient-text {",
        "  display: block;",
        "  background: linear-gradient(135deg, #7C4DFF, #06B6D4);",
        "  -webkit-background-clip: text;",
        "  background-clip: text;",
        "  -webkit-text-fill-color: transparent;",
        "}",
        "",
        ".subtitle { color: var(--text-secondary); font-size: 0.95rem; margin-top: 12px; line-height: 1.6; }",
        "",
        ".control-group { margin-top: 28px; }",
        "",
        ".control-header {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  align-items: center;",
        "  margin-bottom: 14px;",
        "}",
        "",
        ".control-header h3, .control-heading {",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  color: var(--text-primary);",
        "}",
        "",
        ".control-heading { margin-bottom: 14px; }",
        "",
        ".badge {",
        "  background: var(--bg-tertiary);",
        "  color: var(--purple);",
        "  font-size: 1rem;",
        "  font-weight: 700;",
        "  padding: 2px 14px;",
        "  border-radius: 8px;",
        "  border: 1px solid rgba(124, 77, 255, 0.2);",
        "  min-width: 36px;",
        "  text-align: center;",
        "}",
        "",
        ".premium-slider {",
        "  -webkit-appearance: none;",
        "  appearance: none;",
        "  width: 100%;",
        "  height: 6px;",
        "  border-radius: 6px;",
        "  background: var(--bg-tertiary);",
        "  outline: none;",
        "}",
        "",
        ".premium-slider::-webkit-slider-thumb {",
        "  -webkit-appearance: none;",
        "  appearance: none;",
        "  width: 22px;",
        "  height: 22px;",
        "  border-radius: 50%;",
        "  background: var(--gradient-accent);",
        "  cursor: pointer;",
        "  border: 3px solid var(--bg-primary);",
        "  box-shadow: 0 0 0 2px rgba(124, 77, 255, 0.3);",
        "}",
        "",
        ".slider-labels {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  margin-top: 8px;",
        "}",
        "",
        ".slider-labels span { font-size: 0.72rem; color: var(--text-muted); font-weight: 500; }",
        "",
        ".option-grid {",
        "  display: grid;",
        "  grid-template-columns: 1fr 1fr;",
        "  gap: 12px;",
        "}",
        "",
        ".option-card {",
        "  background: var(--bg-tertiary);",
        "  border: 1px solid var(--glass-border);",
        "  border-radius: var(--radius-md);",
        "  padding: 16px 14px;",
        "  cursor: pointer;",
        "  display: flex;",
        "  flex-direction: column;",
        "  gap: 4px;",
        "  transition: all var(--transition);",
        "}",
        "",
        ".option-card:hover { transform: translateY(-4px); border-color: var(--purple); }",
        "",
        ".option-check {",
        "  accent-color: var(--purple);",
        "  width: 18px;",
        "  height: 18px;",
        "  cursor: pointer;",
        "}",
        "",
        ".option-icon { font-size: 1.4rem; font-weight: 700; letter-spacing: 0.5px; }",
        ".option-title { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }",
        ".option-desc { font-size: 0.72rem; color: var(--text-muted); }",
        "",
        ".purple { color: #A855F7; }",
        ".blue { color: #60A5FA; }",
        ".cyan { color: #22D3EE; }",
        ".orange { color: #FB923C; }",
        "",
        ".btn-primary {",
        "  width: 100%;",
        "  padding: 16px 24px;",
        "  border: none;",
        "  border-radius: var(--radius-md);",
        "  background: var(--gradient-accent);",
        "  color: #fff;",
        "  font-size: 1.02rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "  margin-top: 28px;",
        "  transition: all var(--transition);",
        "  box-shadow: 0 4px 20px rgba(124, 77, 255, 0.25);",
        "}",
        "",
        ".btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 35px rgba(124, 77, 255, 0.4); }",
        "",
        ".section-label { font-size: 1.1rem; font-weight: 600; margin-bottom: 16px; }",
        "",
        ".password-display {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  align-items: center;",
        "  background: var(--bg-tertiary);",
        "  border: 1px solid var(--glass-border);",
        "  border-radius: var(--radius-md);",
        "  padding: 18px 20px;",
        "  margin-bottom: 20px;",
        "}",
        "",
        ".password-text {",
        "  font-size: 1.15rem;",
        "  font-weight: 500;",
        "  font-family: 'Courier New', monospace;",
        "  letter-spacing: 0.5px;",
        "  color: var(--text-primary);",
        "  word-break: break-all;",
        "  user-select: all;",
        "}",
        "",
        ".icon-btn {",
        "  background: var(--bg-secondary);",
        "  border: 1px solid var(--glass-border);",
        "  color: var(--text-secondary);",
        "  padding: 10px 16px;",
        "  border-radius: var(--radius-sm);",
        "  cursor: pointer;",
        "  font-size: 0.9rem;",
        "  font-weight: 600;",
        "  transition: all var(--transition);",
        "}",
        "",
        ".icon-btn:hover { background: var(--purple); color: #fff; border-color: var(--purple); }",
        "",
        "#copyMsg { font-size: 0.82rem; min-height: 1.4em; color: var(--green); font-weight: 600; margin-bottom: 16px; }",
        "",
        ".strength-section { margin-bottom: 20px; }",
        "",
        ".strength-header {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  align-items: center;",
        "  margin-bottom: 10px;",
        "}",
        "",
        ".strength-header h3 { font-size: 0.95rem; font-weight: 500; color: var(--text-secondary); }",
        "",
        ".strength-label { font-size: 0.88rem; font-weight: 700; padding: 2px 12px; border-radius: 6px; }",
        ".strength-label.weak { color: var(--red); background: rgba(239, 68, 68, 0.12); }",
        ".strength-label.medium { color: var(--yellow); background: rgba(234, 179, 8, 0.12); }",
        ".strength-label.strong { color: var(--green); background: rgba(34, 197, 94, 0.12); }",
        "",
        ".strength-meter { height: 8px; background: var(--bg-tertiary); border-radius: 10px; overflow: hidden; }",
        "",
        ".strength-fill { height: 100%; border-radius: 10px; transition: width 0.6s ease; }",
        ".strength-fill.weak { background: linear-gradient(90deg, var(--red), #F87171); }",
        ".strength-fill.medium { background: linear-gradient(90deg, var(--yellow), #FACC15); }",
        ".strength-fill.strong { background: linear-gradient(90deg, var(--green), #4ADE80); }",
        "",
        ".meter-labels { display: flex; justify-content: space-between; margin-top: 6px; }",
        ".meter-labels span { font-size: 0.68rem; color: var(--text-muted); }",
        "",
        ".btn-secondary {",
        "  width: 100%;",
        "  padding: 14px 24px;",
        "  border: 1px solid var(--glass-border);",
        "  border-radius: var(--radius-md);",
        "  background: transparent;",
        "  color: var(--text-primary);",
        "  font-size: 0.95rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "  transition: all var(--transition);",
        "}",
        "",
        ".btn-secondary:hover { background: var(--bg-secondary); border-color: var(--purple); transform: translateY(-2px); }",
        "",
        "@media (max-width: 800px) {",
        "  #hero { grid-template-columns: 1fr; max-width: 600px; }",
        "  .heading { font-size: 1.8rem; }",
        "  .option-grid { grid-template-columns: 1fr; }",
        "  #controls, #output { padding: 24px 20px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the password display (#password), the copy button (#copyBtn),",
        "//   the length slider (#lengthSlider) with its badge (#lengthValue), the four",
        "//   option checkboxes (#upper, #lower, #number, #symbol), the generate button",
        "//   (#generateBtn) and the strength meter (#strengthLabel, #fill)",
        "//   style.css is complete — the layout and controls are styled for you",
        "",
        "// Step 2: Select elements",
        "//   Grab the display, the slider and its badge, the four checkboxes and the",
        "//   generate button with document.getElementById()",
        "",
        "// Step 3: Create character sets",
        "//   Define string constants for uppercase, lowercase, numbers and symbols,",
        "//   then collect the checked ones into a pool to pick from",
        "",
        "// Step 4: Generate the password",
        "//   Read the length from the slider, pick a random character from the pool",
        "//   with Math.random() and Math.floor(), and loop until you reach the length",
        "",
        "// Step 5: Display the password",
        "//   Write the result into #password with textContent, update #lengthValue as",
        "//   the slider moves, and generate a fresh password on button clicks",
        "",
        "// Step 6: Final touch & test",
        "//   Test different lengths, single-option combos and the all-unchecked",
        "//   fallback — then polish (e.g. wire up the copy button)"
      ].join("\n")
    }
  },

  "to-do-list": {
    slug: "to-do-list",
    folder: "TO-DO list",
    title: "To-Do List",
    difficulty: "Beginner",
    time: "40 min",
    category: "Core JS",
    tags: ["CRUD", "DOM", "localStorage"],
    intro: "Build a to-do list that adds, completes, deletes and remembers your tasks. You'll practice DOM manipulation, form handling, dynamic rendering, state management and persisting tasks with localStorage.",
    previewNote: "You'll build a working to-do list: type a task, hit Add, tick it off when it's done, delete it when it's finished — and your tasks are still there after a page refresh.",
    cover: "../../assets/project-covers/to-do-list.png",
    previewUrl: "../../../JS%20PROJECTS/TO-DO%20list/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Keep every task as an object — { text, completed } — in one array, and render the list from that array instead of from the DOM.",
      "localStorage only stores strings: save with localStorage.setItem('tasks', JSON.stringify(tasks)) and load with JSON.parse().",
      "Call the save function after every change — add, complete and delete — then load once when the page opens.",
      "Toggle a .completed class on finished tasks and let CSS strike them through.",
      "Trim the input before checking it's empty — a string of spaces is not a real task.",
      "Compute total, completed and remaining from the array so the stats can never get out of sync."
    ],
    concepts: [
      "DOM manipulation with createElement and appendChild",
      "Form handling and input events",
      "Rendering task lists dynamically",
      "State management with a tasks array",
      "Persisting data with localStorage and JSON"
    ],
    challenge: "Extra challenge: add edit-in-place, or a filter bar that shows All / Active / Completed tasks.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the task input (#taskInput), the Add button (#addTaskBtn), the task list (#taskList), the progress section (#progressText, #progressFill) and the three stat cards (#totalTasks, #completedTasks, #remainingTasks).",
          "Open style.css — the layout, task rows, progress bar and stat cards are already styled for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see the task form."
        ],
        logicCode: [
          "// 1. index.html — find #taskInput, #addTaskBtn, #taskList, #progressText, #progressFill",
          "// 2. style.css — layout and task styles are done for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see the task form"
        ],
        think: "Which element IDs will your JavaScript need to select to add and track tasks?",
        hints: [
          "The task text comes from #taskInput.",
          "The Add button is #addTaskBtn — clicking it adds the task.",
          "Tasks render inside #taskList."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector) — e.g. const taskInput = document.getElementById('taskInput')." }
          ]
        }
      },
      {
        title: "Select Elements",
        tagline: "Connect the form and the list.",
        goal: "Select the input, the Add button, the task list and the stat and progress elements so your script can talk to the page.",
        logic: [
          "Select the task input and the Add button.",
          "Select the task list where tasks will render.",
          "Select the three stat elements and the progress elements.",
          "Select the progress text and progress fill."
        ],
        logicCode: [
          "// 1. Input and button",
          "const taskInput = document.getElementById('taskInput');",
          "const addTaskBtn = document.getElementById('addTaskBtn');",
          "// 2. Task list",
          "const taskList = document.getElementById('taskList');",
          "// 3. Stats and progress",
          "const totalEl = document.getElementById('totalTasks');",
          "const completedEl = document.getElementById('completedTasks');",
          "const remainingEl = document.getElementById('remainingTasks');",
          "const progressText = document.getElementById('progressText');",
          "const progressFill = document.getElementById('progressFill');"
        ],
        think: "Why store every selected element in a constant instead of calling getElementById everywhere?",
        hints: [
          "Use document.getElementById() for each element you need.",
          "The stats are #totalTasks, #completedTasks and #remainingTasks.",
          "The progress bar is made of #progressText and #progressFill."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector(?:All)?)", hint: "Select elements with document.getElementById() (or querySelector)." },
            { pattern: "(taskInput|addTaskBtn|taskList)", hint: "Hook into the form and list elements — #taskInput, #addTaskBtn, #taskList." }
          ]
        }
      },
      {
        title: "Add Tasks",
        tagline: "Create and render a new task.",
        goal: "Read the input, guard against empty text, build a task row and append it to the list.",
        logic: [
          "Read the input value and trim it.",
          "If it's empty, show a message and stop.",
          "Create the task elements with createElement.",
          "Append the task to the list and clear the input."
        ],
        logicCode: [
          "// 1. Read and trim the input",
          "const value = taskInput.value.trim();",
          "if (!value) { alert('Enter a task.'); return; }",
          "// 2. Build the task row",
          "const taskRow = document.createElement('div');",
          "taskRow.classList.add('task');",
          "const checkbox = document.createElement('input');",
          "checkbox.type = 'checkbox';",
          "const text = document.createElement('span');",
          "text.textContent = value;",
          "// 3. Append and clear",
          "taskRow.append(checkbox, text);",
          "taskList.appendChild(taskRow);",
          "taskInput.value = '';",
          "taskInput.focus();"
        ],
        think: "Why clear the input after adding, and what happens if the user clicks Add with nothing typed?",
        hints: [
          "taskInput.value.trim() removes whitespace around the text.",
          "Build each row with document.createElement and fill it with textContent.",
          "Append the finished row to #taskList and reset the input."
        ],
        check: {
          requires: [
            { pattern: "\\.value", hint: "Read the task from the input, e.g. taskInput.value.trim()." },
            { pattern: "createElement", hint: "Create the task row with document.createElement()." },
            { pattern: "(append|appendChild)", hint: "Add the new task to the list with append() or appendChild()." }
          ]
        }
      },
      {
        title: "Complete & Delete Tasks",
        tagline: "Handle task completion and deletion.",
        goal: "Let users tick tasks off and delete them — and keep the counters in sync.",
        logic: [
          "Listen for the checkbox change on each task.",
          "Toggle a completed class on the task text.",
          "Listen for clicks on the delete button.",
          "Remove the task and update the counters."
        ],
        logicCode: [
          "// 1. Checkbox toggles completion",
          "checkbox.addEventListener('change', () => {",
          "  text.classList.toggle('completed');",
          "  updateCounters();",
          "});",
          "// 2. Delete removes the row",
          "deleteBtn.addEventListener('click', () => {",
          "  taskRow.remove();",
          "  updateCounters();",
          "});"
        ],
        think: "Where should the counters and progress bar be updated after a change?",
        hints: [
          "Add an event listener to the checkbox and the delete button.",
          "classList.toggle('completed') adds or removes the line-through style.",
          "element.remove() takes the task row out of the DOM."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "Attach listeners to the checkbox and delete button." },
            { pattern: "(classList|checked)", hint: "Toggle completion with classList or the checkbox checked state." },
            { pattern: "(remove|removeChild)", hint: "Remove the task row when delete is clicked." }
          ]
        }
      },
      {
        title: "Save Tasks",
        tagline: "Persist tasks with localStorage.",
        goal: "Save the tasks to localStorage whenever they change, and load them back when the page opens.",
        logic: [
          "Keep the tasks in an array of objects.",
          "Write a save function using JSON.stringify.",
          "Write a load function using JSON.parse.",
          "Load on startup and save after every change."
        ],
        logicCode: [
          "// 1. Save the tasks array",
          "function saveTasks() {",
          "  localStorage.setItem('tasks', JSON.stringify(tasks));",
          "}",
          "// 2. Load on startup",
          "function loadTasks() {",
          "  const saved = localStorage.getItem('tasks');",
          "  return saved ? JSON.parse(saved) : [];",
          "}",
          "// 3. Call load when the page starts",
          "let tasks = loadTasks();",
          "renderTasks();",
          "// 4. Call save after every change",
          "saveTasks();"
        ],
        think: "Why do you need JSON.stringify to save an array to localStorage?",
        hints: [
          "localStorage only stores strings — JSON.stringify(tasks) encodes the array.",
          "JSON.parse(saved) turns the string back into an array of task objects.",
          "Render the list from the array on load, and save after every add, complete and delete."
        ],
        check: {
          requires: [
            { pattern: "localStorage", hint: "Use localStorage to persist the tasks." },
            { pattern: "JSON\\.stringify", hint: "Encode the array with JSON.stringify() before saving." },
            { pattern: "JSON\\.parse", hint: "Decode the saved string with JSON.parse() when loading." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Polish and test the app.",
        goal: "Test adding, completing, deleting, empty input and persistence — then polish anything that feels off.",
        logic: [
          "Add a few tasks — do they appear in the list?",
          "Tick one off — does it strike through and update the stats?",
          "Delete a task — does it disappear and update the counters?",
          "Type only spaces — does the app reject it?",
          "Refresh the page — are the tasks still there?"
        ],
        logicCode: [
          "// 1. Add a few tasks — do they appear in the list?",
          "// 2. Tick one off — does the stats bar update?",
          "// 3. Delete a task — do the counters update?",
          "// 4. Type only spaces — is it rejected?",
          "// 5. Refresh — are the tasks still there?"
        ],
        think: "What should the progress bar show when every task is completed?",
        hints: [
          "Pressing Enter should also add a task — listen for the keydown event on the input.",
          "If tasks vanish on refresh, check that saveTasks() runs after every change.",
          "If the stats look wrong, compute them from the tasks array, not from the DOM."
        ],
        check: {
          requires: [
            { pattern: "addEventListener", hint: "At least one listener should drive adding or completing tasks." },
            { pattern: "localStorage", hint: "The app should persist tasks with localStorage." }
          ]
        }
      }
    ],
    files: {
      "index.html": [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "    <title>To-Do List</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <div class="header">',
        '            <div class="logo">✓</div>',
        "            <div>",
        "                <h1>My <span>To-Do List</span></h1>",
        "                <p>Organize your tasks. Stay productive.</p>",
        "            </div>",
        "        </div>",
        '        <div class="input-section">',
        '            <input type="text" id="taskInput" placeholder="What do you need to do?">',
        '            <button id="addTaskBtn">Add Task</button>',
        "        </div>",
        '        <div class="progress-section">',
        '            <div class="progress-text"><span id="progressText">0 of 0 tasks completed</span></div>',
        '            <div class="progress-bar"><div id="progressFill"></div></div>',
        "        </div>",
        '        <div id="taskList"></div>',
        '        <div class="stats">',
        "            <div class=\"card\">",
        '                <h2 id="totalTasks">0</h2>',
        "                <p>Total Tasks</p>",
        "            </div>",
        "            <div class=\"card\">",
        '                <h2 id="completedTasks">0</h2>',
        "                <p>Completed</p>",
        "            </div>",
        "            <div class=\"card\">",
        '                <h2 id="remainingTasks">0</h2>',
        "                <p>Remaining</p>",
        "            </div>",
        "        </div>",
        "    </div>",
        "  </main>",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>"
      ].join("\n"),
      "style.css": [
        "* { margin: 0; padding: 0; box-sizing: border-box; }",
        "",
        "body {",
        "  min-height: 100vh;",
        "  display: flex;",
        "  flex-direction: column;",
        "  padding: 30px;",
        "  background: #f1f5f9;",
        "  color: #111827;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  flex: 1;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  padding: 20px 0;",
        "}",
        "",
        ".container {",
        "  width: 100%;",
        "  max-width: 720px;",
        "  background: #ffffff;",
        "  border-radius: 24px;",
        "  padding: 40px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "  border: 1px solid #e5e7eb;",
        "}",
        "",
        ".header {",
        "  display: flex;",
        "  align-items: center;",
        "  justify-content: center;",
        "  gap: 20px;",
        "  margin-bottom: 40px;",
        "  text-align: center;",
        "}",
        "",
        ".logo {",
        "  width: 80px;",
        "  height: 80px;",
        "  border-radius: 50%;",
        "  background: #eef2ff;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  font-size: 38px;",
        "  color: #4f46e5;",
        "}",
        "",
        ".header h1 { font-size: 2.4rem; color: #111827; }",
        ".header span { color: #4f46e5; }",
        ".header p { color: #6b7280; margin-top: 8px; }",
        "",
        ".input-section { display: flex; gap: 20px; margin-bottom: 30px; }",
        "",
        "#taskInput {",
        "  flex: 1;",
        "  height: 60px;",
        "  border: 2px solid #e5e7eb;",
        "  border-radius: 12px;",
        "  padding: 0 20px;",
        "  outline: none;",
        "  font-size: 1rem;",
        "  font-family: inherit;",
        "  color: #111827;",
        "  background: #ffffff;",
        "}",
        "",
        "#taskInput:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px #eef2ff; }",
        "",
        "#addTaskBtn {",
        "  width: 180px;",
        "  border: none;",
        "  border-radius: 12px;",
        "  cursor: pointer;",
        "  color: #ffffff;",
        "  font-size: 1rem;",
        "  font-weight: 600;",
        "  background: #4f46e5;",
        "  transition: all 0.2s ease;",
        "}",
        "",
        "#addTaskBtn:hover { background: #4338ca; transform: translateY(-2px); }",
        "",
        ".progress-section {",
        "  background: #f8fafc;",
        "  border-radius: 16px;",
        "  padding: 20px;",
        "  margin-bottom: 30px;",
        "  border: 1px solid #e5e7eb;",
        "}",
        "",
        ".progress-text {",
        "  display: flex;",
        "  justify-content: center;",
        "  margin-bottom: 15px;",
        "  font-weight: 600;",
        "  color: #6b7280;",
        "}",
        "",
        ".progress-bar {",
        "  width: 100%;",
        "  height: 12px;",
        "  border-radius: 20px;",
        "  background: #e5e7eb;",
        "  overflow: hidden;",
        "}",
        "",
        "#progressFill {",
        "  width: 0%;",
        "  height: 100%;",
        "  border-radius: 20px;",
        "  background: #4f46e5;",
        "  transition: width 0.3s ease;",
        "}",
        "",
        "#taskList { display: flex; flex-direction: column; gap: 18px; margin-bottom: 35px; }",
        "",
        ".task {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  align-items: center;",
        "  background: #ffffff;",
        "  border: 2px solid #e5e7eb;",
        "  border-radius: 16px;",
        "  padding: 18px 22px;",
        "  transition: all 0.2s ease;",
        "}",
        "",
        ".task:hover { border-color: #4f46e5; transform: translateY(-2px); }",
        "",
        ".task input { width: 20px; height: 20px; cursor: pointer; }",
        "",
        ".task span {",
        "  font-size: 1rem;",
        "  color: #111827;",
        "  word-break: break-word;",
        "}",
        "",
        ".completed { text-decoration: line-through; color: #9ca3af !important; }",
        "",
        ".edit-btn, .delete-btn {",
        "  border: none;",
        "  background: none;",
        "  cursor: pointer;",
        "  font-size: 1rem;",
        "  font-weight: 600;",
        "}",
        "",
        ".edit-btn { color: #4f46e5; }",
        ".delete-btn { color: #dc2626; }",
        "",
        ".stats {",
        "  display: grid;",
        "  grid-template-columns: repeat(3, 1fr);",
        "  gap: 20px;",
        "}",
        "",
        ".card {",
        "  background: #f8fafc;",
        "  border-radius: 20px;",
        "  padding: 25px;",
        "  text-align: center;",
        "  border: 1px solid #e5e7eb;",
        "}",
        "",
        ".card h2 { font-size: 2rem; margin-bottom: 8px; color: #111827; }",
        ".card p { color: #6b7280; }",
        "",
        "@media (max-width: 768px) {",
        "  .container { padding: 25px; }",
        "  .header { flex-direction: column; }",
        "  .header h1 { font-size: 2rem; }",
        "  .input-section { flex-direction: column; }",
        "  #addTaskBtn { width: 100%; height: 55px; }",
        "  .stats { grid-template-columns: 1fr; }",
        "  .task { flex-direction: column; align-items: flex-start; gap: 18px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   index.html has the task input (#taskInput), the Add button (#addTaskBtn),",
        "//   the task list (#taskList), the progress section (#progressText, #progressFill)",
        "//   and three stat cards (#totalTasks, #completedTasks, #remainingTasks)",
        "//   style.css is complete — the layout, task rows, progress bar and stats are styled for you",
        "",
        "// Step 2: Select elements",
        "//   Grab the input, the Add button, the task list, the stat elements and the",
        "//   progress elements with document.getElementById()",
        "",
        "// Step 3: Add tasks",
        "//   Read and trim the input, guard against empty text, build a task row with",
        "//   createElement (checkbox + text + edit + delete), append it to the list,",
        "//   then clear the input",
        "",
        "// Step 4: Complete & delete tasks",
        "//   Toggle a 'completed' class when the checkbox changes, remove the row when",
        "//   delete is clicked, and keep the stats and progress bar in sync",
        "",
        "// Step 5: Save tasks",
        "//   Keep tasks in an array of objects { text, completed }, save it with",
        "//   localStorage.setItem(key, JSON.stringify(tasks)) after every change, and",
        "//   load it back with JSON.parse() when the page opens",
        "",
        "// Step 6: Final touch & test",
        "//   Test adding, completing, deleting, empty input and a page refresh —",
        "//   then polish the details"
      ].join("\n")
    }
  }

};
// end of learn-data.js
