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