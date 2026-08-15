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
  }
};
// end of learn-data.js
