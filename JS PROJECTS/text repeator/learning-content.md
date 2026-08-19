# Text Repeater - Learning Content

> **Project:** Text Repeater (Multi-Tool Text Utility)
> **Technologies:** HTML5, CSS3, JavaScript ES6
> **Difficulty:** Beginner-Intermediate

---

## Overview

The Text Repeater is a multi-tool text utility application that provides four text tools in a single interface:
1. **Text Repeater** - Repeats text multiple times
2. **Text Reverser** - Reverses any text
3. **Case Converter** - Converts text between UPPERCASE, lowercase, and Title Case
4. **Word Counter** - Counts words, characters, and lines

---

## Module 1: DOM Element Selection

### What are we learning?

Before any JavaScript can interact with the HTML page, it must first **select** the HTML elements it needs to work with. This project uses `document.getElementById()` to grab elements by their unique `id` attributes.

### What code are we using?

```javascript
// --- 1. DOM Elements ---
const clearElement = document.getElementById("clear-btn");
const inputElement = document.getElementById("text-input");
const outputElement = document.getElementById("output");
const charCount = document.getElementById("char-count");
const repeatBtn = document.getElementById("repeat-btn");
const repeatCount = document.getElementById("repeat-count");
const reverseBtn = document.getElementById("reverse-btn");
const caseButtons = document.getElementById("case-buttons");
const statsBox = document.getElementById("stats-box");

const repeaterTab = document.getElementById("repeater-tab");
const reverserTab = document.getElementById("reverser-tab");
const caseTab = document.getElementById("case-tab");
const wordTab = document.getElementById("word-tab");

const toolTitle = document.getElementById("tool-title");
const toolDescription = document.getElementById("tool-description");
const inputTitle = document.getElementById("input-title");
const outputTitle = document.getElementById("output-title");
const tipBox = document.getElementById("tip-box");

const uppercase = document.getElementById("upper-btn");
const lowercase = document.getElementById("lower-btn");
const titlecase = document.getElementById("title-btn");

const MAX_CHARS = 75;
let word = "";
```

### How does it work?

- `document.getElementById("id-name")` searches the HTML for an element with that specific `id`
- Each selected element is stored in a `const` variable for easy reuse throughout the script
- `const` is used because the variable bindings won't change (the elements themselves might change properties, but the variable always points to the same element)

### Why is it needed?

Without selecting these elements, JavaScript cannot:
- Read user input from the textarea
- Update the output textarea
- Respond to button clicks
- Change visible/hidden states of elements

### What happens?

When `script.js` loads at the bottom of `index.html`, all these selections happen instantly. The variables are then available for the rest of the script.

### How does it connect?

These DOM selections are the foundation - every subsequent module (input monitoring, tools logic, tab switching) depends on these variables being defined.

### Key Concepts

| Concept | Description |
|---------|-------------|
| `document.getElementById()` | Returns the first element with the specified id |
| `const` vs `let` | `const` for fixed references, `let` for values that change |
| `MAX_CHARS = 75` | Constant controlling the maximum character limit |
| `let word = ""` | Mutable variable storing the current input text |

---

## Module 2: Input Monitoring & Character Limiting

### What are we learning?

This module handles real-time monitoring of user input. It enforces a character limit, updates a character counter, and calculates word/character/line statistics as the user types.

### What code are we using?

```javascript
// --- 2. Input Monitoring & Real-time Stats ---
inputElement.addEventListener("input", () => {
    let count = inputElement.value.length;
    if (count > MAX_CHARS) {
        inputElement.value = inputElement.value.slice(0, MAX_CHARS);
        count = MAX_CHARS;
    }
    charCount.innerText = `${count} / ${MAX_CHARS}`;
    charCount.style.color = count >= MAX_CHARS ? "red" : (count >= MAX_CHARS - 20 ? "orange" : "black");
    
    word = inputElement.value;

    // Word counter stats
    const text = word.trim();
    document.getElementById("word-count").innerText = text ? text.split(/\s+/).length : 0;
    document.getElementById("character-count").innerText = word.length;
    document.getElementById("line-count").innerText = text ? word.split("\n").length : 0;
});
```

### How does it work?

1. **Event Listener**: `addEventListener("input", ...)` fires every time the textarea content changes (typing, pasting, deleting)

2. **Character Limit Enforcement**:
   - `inputElement.value.length` gets current character count
   - If count exceeds `MAX_CHARS` (75), `.slice(0, MAX_CHARS)` cuts the text to 75 characters
   - The textarea value is updated to the truncated text

3. **Counter Display**:
   - Template literal `` `${count} / ${MAX_CHARS}` `` creates "45 / 75" style text
   - Color changes based on proximity to limit:
     - **Red** when at or over limit
     - **Orange** when within 20 characters of limit
     - **Black** otherwise

4. **State Update**: `word = inputElement.value` stores current text in the global variable

5. **Statistics Calculation**:
   - `.trim()` removes leading/trailing whitespace
   - `text.split(/\s+/).length` counts words (splits by any whitespace)
   - `word.length` counts characters
   - `word.split("\n").length` counts lines (splits by newline)

### Why is it needed?

- Prevents users from entering more than 75 characters
- Provides immediate visual feedback about input length
- Calculates statistics needed for the Word Counter tool

### What happens?

When a user types "Hello World" in the textarea:
1. The `input` event fires
2. Count becomes 11
3. Counter displays "11 / 75" in black
4. The global `word` variable becomes "Hello World"
5. Statistics update: Words: 2, Characters: 11, Lines: 1

### How does it connect?

This module feeds the `word` variable that all tool functions (repeater, reverser, case converter) use as their input source.

---

## Module 3: Text Processing Tools

### What are we learning?

This module contains the core functionality for each text tool: repeating, reversing, and case conversion. Each tool is triggered by a button click and writes its result to the output textarea.

### What code are we using?

```javascript
// --- 3. Tools Logic ---
// Clear button
clearElement.addEventListener("click", () => {
    inputElement.value = "";
    outputElement.value = "";
    
    // Reset character counter
    charCount.innerText = `0 / ${MAX_CHARS}`;
    charCount.style.color = "black";
    word = "";

    // Add these lines to reset the Word Counter stats:
    document.getElementById("word-count").innerText = "0";
    document.getElementById("character-count").innerText = "0";
    document.getElementById("line-count").innerText = "0";
});

repeatBtn.addEventListener("click", () => {
    let result = "";
    for (let i = 0; i < Number(repeatCount.value); i++) {
        result += word + "\n";
    }
    outputElement.value = result;
});

reverseBtn.addEventListener("click", () => {
    outputElement.value = word.split("").reverse().join("");
});

uppercase.addEventListener("click", () => outputElement.value = word.toUpperCase());
lowercase.addEventListener("click", () => outputElement.value = word.toLowerCase());
titlecase.addEventListener("click", () => {
    outputElement.value = word.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
});
```

### How does it work?

#### Clear Button
- Sets both input and output textareas to empty strings
- Resets the character counter to "0 / 75"
- Resets the `word` variable
- Resets all statistics (words, characters, lines) to 0

#### Text Repeater
- Creates an empty `result` string
- Uses a `for` loop that runs `repeatCount.value` times
- Each iteration appends `word + "\n"` (text plus newline)
- The loop uses `Number()` to convert the input value from string to number
- Final result is set as the output textarea's value

#### Text Reverser
- `word.split("")` converts string to array of individual characters
- `.reverse()` reverses the array order
- `.join("")` joins the array back into a string
- This is a classic JavaScript pattern for reversing strings

#### Case Converter (3 buttons)
- **UPPERCASE**: `.toUpperCase()` converts all characters to uppercase
- **lowercase**: `.toLowerCase()` converts all characters to lowercase
- **Title Case**: Two-step process:
  1. `.toLowerCase()` first converts everything to lowercase
  2. `.replace(/\b\w/g, c => c.toUpperCase())` uses regex to capitalize first letter of each word
     - `\b` matches word boundary
     - `\w` matches any word character
     - The callback function `c => c.toUpperCase()` capitalizes each matched character

### Why is it needed?

These are the core features that make the application useful. Each tool performs a specific text transformation.

### What happens?

Example flow for Text Repeater:
1. User types "Hello" in input
2. User enters "3" in repeat count
3. User clicks "Repeat Text"
4. Loop runs 3 times, building "Hello\nHello\nHello\n"
5. Output textarea displays the repeated text

### How does it connect?

All tools read from the global `word` variable (set by Module 2) and write to `outputElement` (selected in Module 1).

---

## Module 4: Tab Switching System

### What are we learning?

This module manages switching between the four different tools by updating the UI - changing titles, descriptions, showing/hiding relevant buttons, and managing the active tab state.

### What code are we using?

```javascript
// --- 4. Tab Switching Logic ---
reverserTab.addEventListener("click", () => {
    toolTitle.innerText = "Text Reverser";
    toolDescription.innerText = "Reverse any text instantly.";
    inputTitle.innerText = "Text to Reverse";
    outputTitle.innerText = "Reversed Text";
    tipBox.innerText = "💡 Tip: Reverse words, sentences and emojis.";

    repeaterTab.classList.remove("active");
    reverserTab.classList.add("active");
    caseTab.classList.remove("active");
    wordTab.classList.remove("active");

    repeatCount.style.display = "none";
    repeatBtn.style.display = "none";
    reverseBtn.style.display = "block";
    caseButtons.style.display = "none";
    statsBox.style.display = "none";
    outputElement.style.display = "block";
});

repeaterTab.addEventListener("click", () => {
    toolTitle.innerText = "Text Repeater";
    toolDescription.innerText = "Repeat text, emojis and punctuation in one step.";
    inputTitle.innerText = "Text to Repeat";
    outputTitle.innerText = "Repeated Text";
    tipBox.innerText = "💡 Tip: Repeat up to 100 times";

    reverserTab.classList.remove("active");
    repeaterTab.classList.add("active");
    caseTab.classList.remove("active");
    wordTab.classList.remove("active");

    repeatCount.style.display = "block";
    repeatBtn.style.display = "block";
    reverseBtn.style.display = "none";
    caseButtons.style.display = "none";
    statsBox.style.display = "none";
    outputElement.style.display = "block";
});

caseTab.addEventListener("click", () => {
    toolTitle.innerText = "Case Converter";
    toolDescription.innerText = "Convert text between different letter cases.";
    inputTitle.innerText = "Text to Convert";
    outputTitle.innerText = "Converted Text";
    tipBox.innerText = "💡 Tip: Convert text to UPPERCASE, lowercase and Title Case.";

    repeaterTab.classList.remove("active");
    reverserTab.classList.remove("active");
    caseTab.classList.add("active");
    wordTab.classList.remove("active");

    repeatCount.style.display = "none";
    repeatBtn.style.display = "none";
    reverseBtn.style.display = "none";
    caseButtons.style.display = "flex";
    statsBox.style.display = "none";
    outputElement.style.display = "block";
});

wordTab.addEventListener("click", () => {
    toolTitle.innerText = "Word Counter";
    toolDescription.innerText = "Count words, characters and lines instantly.";
    inputTitle.innerText = "Text to Analyze";
    outputTitle.innerText = "Statistics";
    tipBox.innerText = "💡 Tip: Count words, characters and lines in real time.";

    repeaterTab.classList.remove("active");
    reverserTab.classList.remove("active");
    caseTab.classList.remove("active");
    wordTab.classList.add("active");

    repeatCount.style.display = "none";
    repeatBtn.style.display = "none";
    reverseBtn.style.display = "none";
    caseButtons.style.display = "none";
    statsBox.style.display = "block";
    outputElement.style.display = "none";
});
```

### How does it work?

Each tab click handler performs three actions:

#### 1. Update Text Content
```javascript
toolTitle.innerText = "Text Reverser";
toolDescription.innerText = "Reverse any text instantly.";
inputTitle.innerText = "Text to Reverse";
outputTitle.innerText = "Reversed Text";
tipBox.innerText = "💡 Tip: Reverse words, sentences and emojis.";
```
Changes the visible text to match the selected tool.

#### 2. Toggle Active Tab Styling
```javascript
repeaterTab.classList.remove("active");
reverserTab.classList.add("active");
caseTab.classList.remove("active");
wordTab.classList.remove("active");
```
- `classList.add("active")` adds the `active` CSS class to highlight the current tab
- `classList.remove("active")` removes highlighting from other tabs
- CSS handles the visual styling: `.sidebar .active { background: var(--accent-light); color: var(--accent); }`

#### 3. Show/Hide Relevant Elements
```javascript
repeatCount.style.display = "none";    // Hide repeat count input
repeatBtn.style.display = "none";       // Hide repeat button
reverseBtn.style.display = "block";     // Show reverse button
caseButtons.style.display = "none";     // Hide case buttons
statsBox.style.display = "none";        // Hide statistics box
outputElement.style.display = "block";  // Show output textarea
```
- `style.display = "none"` completely hides an element
- `style.display = "block"` makes an element visible
- Each tab shows only the controls relevant to that tool

### Why is it needed?

Without tab switching, all four tools' buttons would be visible at once, creating a confusing interface. This system shows only what's needed for the current tool.

### What happens?

When user clicks "Reverser" tab:
1. Header changes to "Text Reverser"
2. Description changes to "Reverse any text instantly."
3. Repeater-specific controls (repeat count, repeat button) are hidden
4. Reverse button appears
5. Case buttons remain hidden
6. The "Reverser" tab gets the active styling

### How does it connect?

- Tab switching depends on DOM selections from Module 1
- It controls visibility of elements used in Module 3's tools
- The `word` variable from Module 2 is still used by all tools regardless of active tab

---

## Module 5: Clipboard Copy with Feedback

### What are we learning?

This module handles copying the output text to the clipboard using the modern Clipboard API, with visual feedback to confirm the copy was successful.

### What code are we using?

```javascript
const copyBtn = document.getElementById("copy-btn");

copyBtn.addEventListener("click", () => {
    // 1. Select the output textarea
    const textToCopy = outputElement.value;

    // 2. Check if there is text to copy
    if (!textToCopy) {
        alert("Nothing to copy!");
        return;
    }

    // 3. Use the Clipboard API to copy the text
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Optional: Change button text temporarily to show success
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "Copied!";
        
        setTimeout(() => {
            copyBtn.innerText = originalText;
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
});
```

### How does it work?

1. **Get Text**: `outputElement.value` retrieves the current output text

2. **Empty Check**: `if (!textToCopy)` checks if the string is empty/falsy
   - If empty, shows an `alert()` and `return` exits the function early

3. **Clipboard API**:
   - `navigator.clipboard.writeText(textToCopy)` is an async operation
   - Returns a Promise (`.then()` for success, `.catch()` for failure)

4. **Visual Feedback**:
   - Saves original button text: `const originalText = copyBtn.innerText`
   - Changes button to "Copied!"
   - `setTimeout()` waits 2000 milliseconds (2 seconds)
   - Then restores original button text

### Why is it needed?

Copying to clipboard is a common UX pattern. The feedback ("Copied!") lets users know the action succeeded without leaving the page.

### What happens?

1. User generates some text output
2. User clicks "Copy" button
3. Text is copied to system clipboard
4. Button text changes from "Copy" to "Copied!"
5. After 2 seconds, button returns to "Copy"

### How does it connect?

- Uses `outputElement` from Module 1
- Works with text generated by any tool in Module 3
- This is a standalone utility feature

---

## Module 6: Regex for Word Counting

### What are we learning?

The Word Counter uses regular expressions (regex) to accurately count words. Understanding this regex pattern is important for text processing.

### What code are we using?

```javascript
// Inside the input event listener:
const text = word.trim();
document.getElementById("word-count").innerText = text ? text.split(/\s+/).length : 0;
```

### How does it work?

1. **`.trim()`**: Removes whitespace from both ends of the string
   - `"  Hello World  "` becomes `"Hello World"`

2. **`/\s+/`** - The regex pattern:
   - `\s` matches any whitespace character (space, tab, newline)
   - `+` means "one or more" of the preceding character
   - So `/\s+/` matches one or more consecutive whitespace characters

3. **`.split(/\s+/)`**: Splits the string wherever one or more whitespace characters occur
   - `"Hello World"` → `["Hello", "World"]` (2 words)
   - `"Hello   World"` → `["Hello", "World"]` (2 words - multiple spaces handled)
   - `"Hello\tWorld"` → `["Hello", "World"]` (tabs handled)

4. **Ternary Operator**: `text ? ... : 0`
   - If `text` is truthy (not empty after trim), calculate word count
   - If `text` is falsy (empty string), return 0

### Why is it needed?

Simple `.split(" ")` would fail with multiple spaces or tabs. The regex `/\s+/` handles all whitespace variations correctly.

### What happens?

When user types "Hello   World" (with 3 spaces):
1. `trim()` doesn't change it (no leading/trailing spaces)
2. `split(/\s+/)` splits on the 3 spaces as one unit
3. Result: `["Hello", "World"]`
4. `.length` is 2 (correct word count)

### How does it connect?

This regex technique is part of the real-time statistics in Module 2, which updates as the user types.

---

## Module 7: Ternary Operators for Conditional Styling

### What are we learning?

The project uses ternary operators (shorthand if-else) to dynamically change the character counter color based on input length.

### What code are we using?

```javascript
charCount.style.color = count >= MAX_CHARS ? "red" : (count >= MAX_CHARS - 20 ? "orange" : "black");
```

### How does it work?

This is a **nested ternary operator**:

```
condition ? valueIfTrue : (condition2 ? valueIfTrue2 : valueIfFalse2)
```

**Evaluation flow:**
1. First checks: `count >= MAX_CHARS` (is count 75 or more?)
   - If yes → color = "red"
   - If no → proceeds to second condition

2. Second checks: `count >= MAX_CHARS - 20` (is count 55 or more?)
   - If yes → color = "orange"
   - If no → color = "black"

**Visual result:**
| Character Count | Color | Meaning |
|----------------|-------|---------|
| 0-54 | Black | Safe range |
| 55-74 | Orange | Warning - approaching limit |
| 75+ | Red | At or over limit |

### Why is it needed?

Provides visual feedback to users about how close they are to the character limit, improving UX.

### What happens?

When user types 60 characters:
1. `count` is 60
2. `60 >= 75` is false → check second condition
3. `60 >= 55` is true → color becomes "orange"
4. Counter text appears in orange

### How does it connect?

This styling is part of the input monitoring in Module 2, updating in real-time as the user types.

---

## Summary: How All Modules Work Together

```
┌─────────────────────────────────────────────────────────────┐
│                      USER OPENS PAGE                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  MODULE 1: DOM Elements selected (clearElement, inputElement, etc.) │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  MODULE 2: Input Monitoring active (input event listener)   │
│  - Character limit enforced (MAX_CHARS = 75)                │
│  - Statistics calculated in real-time                       │
│  - Global `word` variable updated                           │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Click Tab      │ │  Click Tool     │ │  Click Copy     │
│  (Module 4)     │ │  Button (Mod 3) │ │  (Module 5)     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Show/hide UI   │ │  Process text   │ │  Copy output    │
│  Update labels  │ │  Write to output│ │  Show feedback  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## Key JavaScript Concepts Used

| Concept | Where Used | Example |
|---------|-----------|---------|
| `document.getElementById()` | Module 1 | Selecting all DOM elements |
| `addEventListener()` | Modules 2-5 | Handling input, click events |
| Template Literals | Modules 2, 3 | `` `${count} / ${MAX_CHARS}` `` |
| `for` Loop | Module 3 | Repeating text N times |
| String Methods | Module 3 | `.split()`, `.reverse()`, `.join()` |
| Regex | Module 2, 6 | `/\s+/` for word splitting |
| Ternary Operator | Module 2, 7 | Conditional color assignment |
| Clipboard API | Module 5 | `navigator.clipboard.writeText()` |
| `setTimeout()` | Module 5 | Delayed button text reset |
| `.classList` | Module 4 | Adding/removing active class |
| `.style.display` | Module 4 | Showing/hiding elements |
| `.innerText` | Modules 2-4 | Updating text content |
| Promises (`.then()`, `.catch()`) | Module 5 | Handling async clipboard operation |

---

## Practice Exercises

### Exercise 1: Add a Character Counter Color
Add code to change the character counter color when it reaches 50 characters (yellow warning).

### Exercise 2: Add a "Clear Output" Button
Add a button that only clears the output textarea, leaving the input intact.

### Exercise 3: Add a "Shuffle" Tool
Create a new tool that randomly shuffles the characters in the input text.

### Exercise 4: Limit Repeat Count
Add validation to ensure the repeat count doesn't exceed 100.

### Exercise 5: Add Line Numbers
Modify the output to show line numbers before each repeated line.

---

## Troubleshooting Common Issues

| Issue | Likely Cause | Solution |
|-------|--------------|----------|
| Buttons don't work | `id` mismatch between HTML and JS | Check that `getElementById()` matches the HTML `id` exactly |
| Stats don't update | Event listener not firing | Ensure `script.js` loads after HTML elements |
| Copy fails | Clipboard API requires HTTPS | Test on a local server or HTTPS site |
| Title case not working | Regex issue | Check `/\b\w/g` pattern is correct |
