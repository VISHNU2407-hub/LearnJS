/* ============================================================
   LearnJS — learn-data.js (pages/learn)
   Content for the Project Learning Page (guided build workshop).
   Structured per project so more guided builds can be added
   later by adding another key to window.LEARNJS_WORKSHOPS.
   Only the Digital Clock ("clock") is populated for now.
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
    folder: "Die-Roller",
    title: "Die Roller",
    difficulty: "Beginner",
    time: "30 min",
    category: "Games",
    tags: ["DOM", "Random", "Arrays"],
    intro: "Roll a virtual six-sided die with one click and keep a history of your last five rolls. You'll use Math.random(), arrays, event listeners and DOM creation to bring the die to life.",
    previewNote: "You'll build a working die roller with a Roll button, a big die face and a rolling history. Start with the starter files, then wire up the JavaScript step by step.",
    cover: "../../assets/project-covers/die-roller.png",
    previewUrl: "../../../JS%20PROJECTS/die%20Roller/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "Math.random() returns a number between 0 and 1 — combine it with Math.floor() for whole numbers.",
      "Keep the roll history in an array so it's easy to manage.",
      "Use unshift() to add to the front and pop() to drop the oldest roll.",
      "Rebuild the history list with createElement() and appendChild()."
    ],
    concepts: [
      "DOM selection (getElementById)",
      "Event handling (addEventListener)",
      "Math.random() & Math.floor()",
      "Arrays (unshift, pop, forEach)",
      "Creating elements with createElement()",
      "Updating the UI with textContent"
    ],
    challenge: "Extra challenge: add a small shake animation to the die before the number appears.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the die face (#dice), the Roll button (#rollBtn) and the history list (#historyList).",
          "Open style.css — the layout and colors are already styled for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see a static die."
        ],
        logicCode: [
          "// 1. index.html — find the die face (#dice), the Roll button (#rollBtn) and the history (#historyList)",
          "// 2. style.css — layout and colors are already styled for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see a static die"
        ],
        think: "Which elements will your JavaScript need to select?",
        hints: [
          "The die face has id=\"dice\" — the button has id=\"rollBtn\".",
          "The history lives inside id=\"historyList\".",
          "You'll only write JavaScript in this project — the HTML and CSS are done."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)", hint: "Select elements with document.getElementById() — e.g. const rollBtn = document.getElementById('rollBtn')." }
          ]
        }
      },
      {
        title: "Select Elements",
        tagline: "Grab the die, button and history list.",
        goal: "Select the die face, the Roll button and the history container.",
        logic: [
          "Grab the Roll button (#rollBtn).",
          "Grab the die face (#dice).",
          "Grab the history list (#historyList).",
          "Create an array to hold the roll history."
        ],
        logicCode: [
          "// 1. Grab the Roll button",
          "const rollBtn = document.getElementById('rollBtn');",
          "",
          "// 2. Grab the die face",
          "const dice = document.getElementById('dice');",
          "",
          "// 3. Grab the history list",
          "const historyList = document.getElementById('historyList');",
          "",
          "// 4. Create an array to hold the history",
          "const history = [];"
        ],
        think: "Why store elements in variables at the top of the file?",
        hints: [
          "Grab elements once — don't re-query the document on every roll.",
          "The history array will hold the numbers you roll.",
          "Name variables clearly: rollBtn, dice, historyList."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*rollBtn", hint: "Select the button: const rollBtn = document.getElementById('rollBtn');" },
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*dice", hint: "Select the die face: const dice = document.getElementById('dice');" },
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*historyList", hint: "Select the history list: const historyList = document.getElementById('historyList');" }
          ]
        }
      },
      {
        title: "Generate a Random Roll",
        tagline: "Roll a number between 1 and 6.",
        goal: "Generate a random whole number between 1 and 6 when the button is clicked.",
        logic: [
          "Listen for clicks on the Roll button.",
          "Generate a random number between 0 and 1.",
          "Scale it to a six-sided die and round down.",
          "Add 1 so the range is 1–6."
        ],
        logicCode: [
          "// 1. Listen for clicks on the Roll button",
          "rollBtn.addEventListener('click', () => {",
          "  // 2. Random 0–1, scaled to a die and rounded down, then + 1",
          "  const result = Math.floor(Math.random() * 6) + 1;",
          "});"
        ],
        think: "Why do you multiply by 6 and add 1?",
        hints: [
          "Math.random() gives 0 to just under 1.",
          "Math.floor() rounds down to a whole number.",
          "Math.floor(Math.random() * 6) gives 0–5; adding 1 makes it 1–6."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks: rollBtn.addEventListener('click', () => { ... })." },
            { pattern: "Math\\.random", hint: "Generate randomness with Math.random()." },
            { pattern: "Math\\.floor|Math\\.ceil|Math\\.round", hint: "Round the result to a whole number with Math.floor()." },
            { pattern: "\\*\\s*6", hint: "Scale to a die: Math.floor(Math.random() * 6) + 1." }
          ]
        }
      },
      {
        title: "Show the Roll",
        tagline: "Display the rolled number on the die.",
        goal: "Write the rolled number into the die face so the user sees the result.",
        logic: [
          "Take the rolled number from the previous step.",
          "Write it into the die face with textContent.",
          "Refresh the page and roll a few times."
        ],
        logicCode: [
          "// 1. Take the rolled number",
          "const result = Math.floor(Math.random() * 6) + 1;",
          "",
          "// 2. Write it into the die face",
          "dice.textContent = result;"
        ],
        think: "What would happen if you used innerHTML instead of textContent?",
        hints: [
          "element.textContent = value replaces the element's text.",
          "Put the assignment inside the click handler.",
          "The die face is a div with id=\"dice\"."
        ],
        check: {
          requires: [
            { pattern: "(textContent|innerText)\\s*=", hint: "Write the result into the die: dice.textContent = result;" }
          ]
        }
      },
      {
        title: "Track the History",
        tagline: "Keep the last five rolls.",
        goal: "Add every roll to the history and keep only the latest five.",
        logic: [
          "Add the new roll to the front of the history array.",
          "Remove the oldest roll when there are more than five.",
          "Refresh the history display."
        ],
        logicCode: [
          "// 1. Add the new roll to the front",
          "history.unshift(result);",
          "",
          "// 2. Keep only the latest five",
          "if (history.length > 5) {",
          "  history.pop();",
          "}"
        ],
        think: "What's the difference between unshift() and push()?",
        hints: [
          "unshift() adds to the start of an array; pop() removes from the end.",
          "With more than five entries, drop the oldest (the last one).",
          "Check history.length after adding."
        ],
        check: {
          requires: [
            { pattern: "\\.unshift", hint: "Add the roll to the front: history.unshift(result);" },
            { pattern: "\\.pop", hint: "Drop the oldest roll: history.pop();" },
            { pattern: "\\bif\\b\\s*\\(\\s*history\\.length", hint: "Guard with a length check: if (history.length > 5) { history.pop(); }" }
          ]
        }
      },
      {
        title: "Render the History",
        tagline: "Paint the last rolls on screen.",
        goal: "Rebuild the history list so the user can see their last five rolls.",
        logic: [
          "Clear the history list.",
          "Loop over the history array.",
          "Create a span for each roll and append it."
        ],
        logicCode: [
          "// 1. Clear the history list",
          "historyList.innerHTML = '';",
          "",
          "// 2. Loop over the history array",
          "history.forEach((roll) => {",
          "  // 3. Create a span for each roll and append it",
          "  const span = document.createElement('span');",
          "  span.textContent = roll;",
          "  historyList.appendChild(span);",
          "});"
        ],
        think: "Why clear the list before rebuilding it?",
        hints: [
          "document.createElement('span') makes a fresh element.",
          "parent.appendChild(child) adds it to the page.",
          "Clearing first prevents old rolls from duplicating."
        ],
        check: {
          requires: [
            { pattern: "createElement", hint: "Create elements with document.createElement('span')." },
            { pattern: "appendChild", hint: "Add each roll to the list with historyList.appendChild(span)." },
            { pattern: "forEach|for\\s*\\(|for\\s*of", hint: "Loop over the history array." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Test and polish your project.",
        goal: "Test the rolls, check the history and make sure the app feels finished.",
        logic: [
          "Open the page and roll several times.",
          "Confirm the history shows the latest five rolls in order.",
          "Use console.log() to debug anything unexpected.",
          "Resize the window — the card should stay centered and readable."
        ],
        logicCode: [
          "// 1. Open the page and roll several times",
          "// 2. Confirm the history shows the latest five rolls in order",
          "// 3. Debug anything unexpected",
          "console.log(history);",
          "",
          "// 4. Resize the window — the card should stay centered and readable"
        ],
        think: "After six rolls, how many numbers should appear in the history?",
        hints: [
          "Roll more than five times and watch the oldest fall off.",
          "console.log(history) shows the array in the console (F12).",
          "If the die never changes, check the button id and listener."
        ],
        check: {
          requires: [
            { pattern: "Math\\.random", hint: "Keep generating rolls with Math.random()." },
            { pattern: "(textContent|innerText)\\s*=", hint: "Keep writing the result into the die." },
            { pattern: "\\.unshift", hint: "Keep tracking the history with unshift()." },
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
        "    <title>Die Roller</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="card">',
        "        <h1>Die Roller</h1>",
        '        <p class="subtitle">Roll the dice and test your luck!</p>',
        '        <div class="dice-area">',
        '            <div id="dice" class="dice">4</div>',
        "        </div>",
        '        <button id="rollBtn">Roll Dice</button>',
        '        <div class="history">',
        "            <h3>Last Rolls</h3>",
        '            <div id="historyList" class="history-list"></div>',
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
        ".card {",
        "  width: 100%;",
        "  max-width: 420px;",
        "  padding: 40px;",
        "  text-align: center;",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 20px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".card h1 { color: #111827; margin-bottom: 6px; }",
        ".subtitle { color: #6b7280; margin-bottom: 24px; }",
        "",
        ".dice {",
        "  width: 130px;",
        "  height: 130px;",
        "  margin: 0 auto 24px;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  font-size: 4rem;",
        "  font-weight: 700;",
        "  color: #ffffff;",
        "  background: #2563eb;",
        "  border-radius: 24px;",
        "  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);",
        "}",
        "",
        "#rollBtn {",
        "  border: none;",
        "  padding: 14px 32px;",
        "  border-radius: 10px;",
        "  background: #111827;",
        "  color: #fff;",
        "  font-size: 1rem;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        "#rollBtn:hover { background: #1f2937; }",
        "",
        ".history { margin-top: 28px; }",
        ".history h3 { color: #6b7280; margin-bottom: 12px; }",
        "",
        ".history-list {",
        "  display: flex;",
        "  justify-content: center;",
        "  gap: 10px;",
        "  flex-wrap: wrap;",
        "}",
        "",
        ".history-list span {",
        "  width: 40px;",
        "  height: 40px;",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  border-radius: 10px;",
        "  background: #f3f4f6;",
        "  color: #111827;",
        "  font-weight: 700;",
        "}",
        "",
        "@media (max-width: 480px) {",
        "  .card { padding: 28px 20px; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   The die face (#dice), the Roll button (#rollBtn) and the history (#historyList) are in index.html",
        "//   style.css is complete — the layout and colors are done for you",
        "",
        "// Step 2: Select the elements",
        "//   Grab #rollBtn, #dice and #historyList, and create a history array",
        "",
        "// Step 3: Generate a random roll",
        "//   On click, produce Math.floor(Math.random() * 6) + 1 for a number between 1 and 6",
        "",
        "// Step 4: Show the roll",
        "//   Write the result into the die face with textContent",
        "",
        "// Step 5: Track the history",
        "//   unshift() the roll and pop() when the history grows past five",
        "",
        "// Step 6: Render the history",
        "//   Clear the list, then create a span for each roll and append it",        "",
        "// Step 7: Final touch & test",
        "//   Roll several times and confirm the die and the history stay in sync"
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
    folder: "Text-Repeater",
    title: "Text Repeater",
    difficulty: "Beginner",
    time: "45 min",
    category: "Core JS",
    tags: ["DOM", "Text", "Loops"],
    intro: "Build a text repeater that takes any text and repeats it as many times as you want — with a one-click copy button. You'll work with loops, template strings, the Clipboard API and DOM manipulation.",
    previewNote: "You'll build a working text repeater with a text area, a repeat count, a Repeat button and a copy-to-clipboard button. Start with the starter files, then wire up the JavaScript step by step.",
    cover: "../../assets/project-covers/text-repeator.png",
    previewUrl: "../../../JS%20PROJECTS/text%20repeator/index.html",
    githubUrl: "https://github.com/VISHNU2407-hub/LearnJS",
    communityUrl: "../community/",
    tips: [
      "A for loop is perfect for repeating the text N times.",
      "Build the result with += so each repetition appends to the last.",
      "Number(repeatCount.value) turns the input string into a number.",
      "navigator.clipboard.writeText() copies a string to the clipboard."
    ],
    concepts: [
      "DOM selection (getElementById)",
      "The input event for live counters",
      "For loops for repetition",
      "String concatenation (+=)",
      "The Clipboard API (navigator.clipboard)",
      "Updating the UI dynamically"
    ],
    challenge: "Extra challenge: add a separator option (comma, newline, none) between repetitions.",
    steps: [
      {
        title: "Project Setup",
        tagline: "Understand the starter files.",
        goal: "Open the starter files and understand how index.html, style.css and script.js fit together.",
        logic: [
          "Look at index.html — find the text area (#text-input), the repeat count (#repeat-count), the Repeat button (#repeat-btn), the output (#output), the copy button (#copy-btn) and the character count (#char-count).",
          "Open style.css — the layout and colors are already styled for you.",
          "Open script.js — it only contains comments that mark the steps ahead.",
          "Open index.html in the browser — you'll see a static repeater."
        ],
        logicCode: [
          "// 1. index.html — find #text-input, #repeat-count, #repeat-btn, #output, #copy-btn and #char-count",
          "// 2. style.css — layout and colors are already styled for you",
          "// 3. script.js — comments mark the steps ahead",
          "// 4. Open index.html in the browser — you'll see a static repeater"
        ],
        think: "Which elements will your JavaScript need to read and update?",
        hints: [
          "Input is #text-input — the repeat amount is #repeat-count.",
          "The button is #repeat-btn — output lands in #output.",
          "Copy is #copy-btn — the live count is #char-count."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)", hint: "Select elements with document.getElementById() — e.g. const inputEl = document.getElementById('text-input')." }
          ]
        }
      },
      {
        title: "Select the Elements",
        tagline: "Grab every element you need.",
        goal: "Select the input, repeat count, buttons, output and counter so your script can use them.",
        logic: [
          "Grab the text input.",
          "Grab the repeat count input.",
          "Grab the Repeat and Copy buttons.",
          "Grab the output textarea and the character count."
        ],
        logicCode: [
          "// 1. Grab the text input",
          "const inputEl = document.getElementById('text-input');",
          "",
          "// 2. Grab the repeat count",
          "const repeatCount = document.getElementById('repeat-count');",
          "",
          "// 3. Grab the buttons",
          "const repeatBtn = document.getElementById('repeat-btn');",
          "const copyBtn = document.getElementById('copy-btn');",
          "",
          "// 4. Grab the output and the counter",
          "const outputEl = document.getElementById('output');",
          "const charCount = document.getElementById('char-count');"
        ],
        think: "Why grab all elements once at the top instead of inside handlers?",
        hints: [
          "Each getElementById call returns one element.",
          "Name variables clearly so handlers stay readable.",
          "const is fine here — the element references never change."
        ],
        check: {
          requires: [
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*text-input", hint: "Select the input: const inputEl = document.getElementById('text-input');" },
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*repeat-btn", hint: "Select the Repeat button: const repeatBtn = document.getElementById('repeat-btn');" },
            { pattern: "(getElementById|querySelector)\\s*\\([^)]*output", hint: "Select the output: const outputEl = document.getElementById('output');" }
          ]
        }
      },
      {
        title: "Repeat the Text",
        tagline: "Loop N times and join the copies.",
        goal: "On button click, repeat the input text the chosen number of times and write it into the output.",
        logic: [
          "Listen for clicks on the Repeat button.",
          "Read the input text.",
          "Read how many times to repeat.",
          "Build the repeated string with a loop.",
          "Write the result into the output."
        ],
        logicCode: [
          "// 1. Listen for clicks on the Repeat button",
          "repeatBtn.addEventListener('click', () => {",
          "  // 2. Read the input and the repeat amount",
          "  const text = inputEl.value;",
          "  const times = Number(repeatCount.value);",
          "",
          "  // 3. Build the repeated string with a loop",
          "  let result = '';",
          "  for (let i = 0; i < times; i++) {",
          "    result += text + '\\n';",
          "  }",
          "",
          "  // 4. Write the result into the output",
          "  outputEl.value = result;",
          "});"
        ],
        think: "Why start result as an empty string before the loop?",
        hints: [
          "Number('3') returns 3 — the input value is a string.",
          "result += text appends one copy each loop pass.",
          "for (let i = 0; i < times; i++) runs exactly times times."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks on the Repeat button." },
            { pattern: "\\bfor\\s*\\(", hint: "Use a for loop: for (let i = 0; i < times; i++) { ... }" },
            { pattern: "\\+=", hint: "Append each copy with +=, e.g. result += text;" },
            { pattern: "Number\\s*\\(|parseInt", hint: "Convert the repeat count to a number with Number(value)." }
          ]
        }
      },
      {
        title: "Live Character Count",
        tagline: "Show how many characters were typed.",
        goal: "Update the character counter as the user types in the input.",
        logic: [
          "Listen for the input event on the text area.",
          "Count the characters typed.",
          "Write the count into the counter element.",
          "Keep the count capped at the limit."
        ],
        logicCode: [
          "// 1. Listen for the input event",
          "inputEl.addEventListener('input', () => {",
          "  // 2. Count the characters typed",
          "  const count = inputEl.value.length;",
          "",
          "  // 3. Write the count into the counter",
          "  charCount.innerText = count + ' / 75';",
          "});"
        ],
        think: "What does .value.length return for an empty textarea?",
        hints: [
          "The input event fires on every keystroke.",
          "inputEl.value.length counts the characters.",
          "Template strings work too: `${count} / 75`."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']input", hint: "Attach an input listener to the text area." },
            { pattern: "\\.value", hint: "Read the typed text with inputEl.value." },
            { pattern: "(innerText|textContent)\\s*=", hint: "Write the count into the counter element." }
          ]
        }
      },
      {
        title: "Copy the Result",
        tagline: "Copy the output to the clipboard.",
        goal: "Make the Copy button put the repeated text on the clipboard and show feedback.",
        logic: [
          "Listen for clicks on the Copy button.",
          "Read the output text.",
          "Write it to the clipboard with the Clipboard API.",
          "Show a short confirmation."
        ],
        logicCode: [
          "// 1. Listen for clicks on the Copy button",
          "copyBtn.addEventListener('click', () => {",
          "  // 2. Read the output text",
          "  const textToCopy = outputEl.value;",
          "",
          "  // 3. Write it to the clipboard",
          "  navigator.clipboard.writeText(textToCopy);",
          "",
          "  // 4. Show feedback",
          "  copyBtn.innerText = 'Copied!';",
          "});"
        ],
        think: "Why check that the output isn't empty before copying?",
        hints: [
          "navigator.clipboard.writeText(text) is async but works without await for simple cases.",
          "Guard empty output: if (!textToCopy) { alert('Nothing to copy!'); return; }",
          "Reset the button label with setTimeout for feedback."
        ],
        check: {
          requires: [
            { pattern: "addEventListener\\s*\\(\\s*[\"']click", hint: "Listen for clicks on the Copy button." },
            { pattern: "clipboard\\.writeText|writeText", hint: "Copy with navigator.clipboard.writeText(text)." }
          ]
        }
      },
      {
        title: "Final Touch & Test",
        tagline: "Test and polish your project.",
        goal: "Test the repeater, the counter and the copy button, then polish.",
        logic: [
          "Open the page and repeat some text 3 times.",
          "Click Copy and paste elsewhere to confirm it worked.",
          "Use console.log() to debug anything unexpected.",
          "Resize the window — the layout should stay readable."
        ],
        logicCode: [
          "// 1. Open the page and repeat some text 3 times",
          "// 2. Click Copy and paste elsewhere to confirm it worked",
          "// 3. Debug anything unexpected",
          "console.log(outputEl.value);",
          "",
          "// 4. Resize the window — the layout should stay readable"
        ],
        think: "What happens if the repeat count is 0 — or empty?",
        hints: [
          "Number('') is 0 — the loop body never runs and output stays empty.",
          "console.log(outputEl.value) prints the output (F12).",
          "If the button does nothing, check the element ids and the listener."
        ],
        check: {
          requires: [
            { pattern: "\\bfor\\s*\\(", hint: "Keep the repeat loop working." },
            { pattern: "clipboard\\.writeText|writeText", hint: "Keep the copy-to-clipboard working." },
            { pattern: "(innerText|textContent)\\s*=", hint: "Keep updating the UI with innerText / textContent." }
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
        "    <title>Text Repeater</title>",
        '    <link rel="stylesheet" href="style.css">',
        "</head>",
        "<body>",
        '  <main class="main-wrapper">',
        '    <div class="container">',
        '        <h1>Text <span>Repeater</span></h1>',
        '        <p class="subtitle">Repeat text, emojis and punctuation in one step.</p>',
        '        <div class="workspace">',
        '            <section class="input-card">',
        '                <div class="card-header">',
        "                    <h2>Text to Repeat</h2>",
        '                    <button id="clear-btn">Clear</button>',
        "                </div>",
        '                <textarea id="text-input" placeholder="Type or paste your text here..."></textarea>',
        '                <span id="char-count">0 / 75</span>',
        '                <div class="row">',
        '                    <label for="repeat-count">Repeat</label>',
        '                    <input type="number" id="repeat-count" value="10" min="1">',
        "                </div>",
        '                <button id="repeat-btn">Repeat Text</button>',
        "            </section>",
        '            <section class="output-card">',
        '                <div class="card-header">',
        "                    <h2>Repeated Text</h2>",
        '                    <button id="copy-btn">Copy</button>',
        "                </div>",
        '                <textarea id="output" readonly></textarea>',
        "            </section>",
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
        "  padding: 30px;",
        "  background: #f9fafb;",
        "  font-family: 'Inter', system-ui, sans-serif;",
        "}",
        "",
        ".main-wrapper {",
        "  display: flex;",
        "  justify-content: center;",
        "  align-items: center;",
        "  min-height: calc(100vh - 60px);",
        "}",
        "",
        ".container {",
        "  width: 100%;",
        "  max-width: 860px;",
        "  padding: 36px;",
        "  text-align: center;",
        "  background: #ffffff;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 20px;",
        "  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);",
        "}",
        "",
        ".container h1 { color: #111827; margin-bottom: 6px; }",
        ".container h1 span { color: #2563eb; }",
        ".subtitle { color: #6b7280; margin-bottom: 24px; }",
        "",
        ".workspace {",
        "  display: grid;",
        "  grid-template-columns: 1fr 1fr;",
        "  gap: 20px;",
        "  text-align: left;",
        "}",
        "",
        ".input-card, .output-card {",
        "  padding: 20px;",
        "  background: #f3f4f6;",
        "  border-radius: 14px;",
        "}",
        "",
        ".card-header {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  align-items: center;",
        "  margin-bottom: 12px;",
        "}",
        "",
        ".card-header h2 { color: #111827; font-size: 1rem; }",
        "",
        "textarea {",
        "  width: 100%;",
        "  min-height: 140px;",
        "  padding: 12px;",
        "  font-family: inherit;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 10px;",
        "  outline: none;",
        "  resize: vertical;",
        "}",
        "",
        "#char-count { color: #6b7280; font-size: 0.85rem; }",
        "",
        ".row {",
        "  display: flex;",
        "  align-items: center;",
        "  gap: 10px;",
        "  margin: 12px 0;",
        "}",
        "",
        "#repeat-count {",
        "  width: 90px;",
        "  padding: 8px;",
        "  border: 1px solid #e5e7eb;",
        "  border-radius: 8px;",
        "}",
        "",
        "button {",
        "  border: none;",
        "  padding: 10px 18px;",
        "  border-radius: 8px;",
        "  background: #2563eb;",
        "  color: #fff;",
        "  font-weight: 600;",
        "  cursor: pointer;",
        "}",
        "",
        "button:hover { background: #1d4ed8; }",
        "#clear-btn, #copy-btn { background: #111827; }",
        "",
        "@media (max-width: 640px) {",
        "  body { padding: 16px; }",
        "  .container { padding: 22px; }",
        "  .workspace { grid-template-columns: 1fr; }",
        "}"
      ].join("\n"),
      "script.js": [
        "// Step 1: Understand the starter files",
        "//   #text-input holds the text, #repeat-count the number of copies, #repeat-btn triggers it,",
        "//   #output shows the result, #copy-btn copies it and #char-count shows the live length",
        "//   style.css is complete — the layout and colors are done for you",
        "",
        "// Step 2: Select the elements",
        "//   Grab every element once with document.getElementById()",
        "",
        "// Step 3: Repeat the text",
        "//   On click, loop from 0 to the repeat count and build the result with +=",
        "",
        "// Step 4: Live character count",
        "//   On input, write inputEl.value.length into #char-count",        "",
        "// Step 5: Copy the result",
        "//   On click, copy outputEl.value with navigator.clipboard.writeText() and show feedback",        "",
        "// Step 6: Final touch & test",
        "//   Repeat a few times, copy, and confirm everything stays in sync"
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
  }
};
// end of learn-data.js
