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
    title: "Digital Clock",
    difficulty: "Beginner",
    time: "~30 min",
    category: "Core JS",
    tags: ["DOM", "Timers"],
    intro: "Build a real-time digital clock using JavaScript that displays the current time and updates every second. You'll work with Date, setInterval(), and DOM manipulation to create a clean and functional clock.",
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
  }
};
// end of learn-data.js
