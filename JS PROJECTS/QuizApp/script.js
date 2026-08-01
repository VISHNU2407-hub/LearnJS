// ============================================
// Quiz App - Full JavaScript Logic
// ============================================
// Built with beginners in mind — each function
// does one thing and uses clear variable names.
// ============================================

// ==================== QUESTIONS ====================

const questions = [
  {
    question: "What does \"CSS\" stand for?",
    options: [
      "Cascading Style Sheets",
      "Creative Style System",
      "Computer Style Sheets",
      "Colorful Style Sheets"
    ],
    correct: 0
  },
  {
    question: "Which HTML tag is used to link a JavaScript file?",
    options: ["<js>", "<script>", "<link>", "<javascript>"],
    correct: 1
  },
  {
    question: "What is the correct way to declare a variable in JavaScript?",
    options: ["v carName;", "variable carName;", "let carName;", "varName carName;"],
    correct: 2
  },
  {
    question: "Which symbol is used for single-line comments in JavaScript?",
    options: ["/*", "//", "#", "<!--"],
    correct: 1
  },
  {
    question: "What does DOM stand for?",
    options: [
      "Document Object Model",
      "Data Object Management",
      "Document Order Mode",
      "Display Object Manipulation"
    ],
    correct: 0
  },
  {
    question: "How do you call a function named 'myFunction'?",
    options: [
      "call myFunction()",
      "myFunction()",
      "call function myFunction()",
      "execute myFunction()"
    ],
    correct: 1
  },
  {
    question: "Which method adds an element to the end of an array?",
    options: ["pop()", "shift()", "unshift()", "push()"],
    correct: 3
  },
  {
    question: "What does === compare in JavaScript?",
    options: [
      "Value only",
      "Type only",
      "Value and type",
      "Memory address"
    ],
    correct: 2
  },
  {
    question: "Which keyword is used to create a constant in JavaScript?",
    options: ["var", "let", "const", "static"],
    correct: 2
  },
  {
    question: "What is the output of typeof 'Hello'?",
    options: ["'string'", "'text'", "'word'", "'char'"],
    correct: 0
  }
];

// ==================== DOM REFERENCES ====================

// Screens
const startScreen  = document.querySelector("#startScreen");
const quizScreen   = document.querySelector("#quizScreen");
const resultScreen = document.querySelector("#resultScreen");

// Start screen
const startBtn     = document.querySelector("#startBtn");

// Quiz screen — progress
const progressText    = document.querySelector("#progressText");
const progressPercent = document.querySelector("#progressPercent");
const progressFill    = document.querySelector("#progressFill");
const progressBar     = document.querySelector(".progress-bar");
const timerDisplay    = document.querySelector("#timerDisplay");

// Quiz screen — question
const questionText    = document.querySelector("#questionText");
const optionsContainer = document.querySelector("#optionsContainer");
const optionBtns      = document.querySelectorAll(".option-btn");

// Quiz screen — footer
const scoreDisplay = document.querySelector("#scoreDisplay");
const scoreValue   = document.querySelector("#scoreValue");
const nextBtn      = document.querySelector("#nextBtn");

// Result screen
const scoreNumber    = document.querySelector("#scoreNumber");
const scoreTotal     = document.querySelector("#scoreTotal");
const correctCount   = document.querySelector("#correctCount");
const incorrectCount = document.querySelector("#incorrectCount");
const restartBtn     = document.querySelector("#restartBtn");

// ==================== STATE ====================

const TIMER_SECONDS = 15;       // Seconds per question

let currentIndex  = 0;          // Which question the user is on (0-based)
let score         = 0;          // Total correct answers
let correct       = 0;          // Running correct count (same as score)
let incorrect     = 0;          // Running incorrect count
let answered      = false;      // Has the user answered the current question?
let timeLeft      = TIMER_SECONDS;  // Seconds remaining
let timerInterval = null;       // Reference to the setInterval

const totalQuestions = questions.length;

// ==================== SCREEN HELPERS ====================

function showScreen(screen) {
  // Hide all screens, then show the one we want.
  startScreen.classList.remove("active");
  quizScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  screen.classList.add("active");
}

// ==================== QUIZ FLOW ====================

function startQuiz() {
  // Reset everything to a fresh state.
  currentIndex = 0;
  score   = 0;
  correct = 0;
  incorrect = 0;
  answered = false;

  clearTimer();
  showScreen(quizScreen);
  loadQuestion();
}

function loadQuestion() {
  // Grab the current question object.
  const q = questions[currentIndex];
  const questionNumber = currentIndex + 1; // 1-based for display

  // --- Update progress ---
  const percent = Math.round((questionNumber / totalQuestions) * 100);
  progressText.textContent    = `Question ${questionNumber} of ${totalQuestions}`;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width    = `${percent}%`;

  // Update ARIA on the progress bar.
  progressBar.setAttribute("aria-valuenow", questionNumber);

  // --- Update question text ---
  questionText.textContent = q.question;

  // --- Update option buttons ---
  optionBtns.forEach((btn, i) => {
    btn.textContent = q.options[i];

    // Remove any leftover state classes.
    btn.classList.remove("selected", "correct", "incorrect");
    btn.disabled = false;
  });

  // --- Reset footer ---
  scoreValue.textContent = score;
  answered = false;
  nextBtn.disabled = true;
  nextBtn.textContent = currentIndex === totalQuestions - 1 ? "Finish" : "Next";

  // --- Start the countdown timer ---
  resetTimer();
  startTimer();
}

function selectOption(index) {
  // Prevent selecting again once answered.
  if (answered) return;

  const q = questions[currentIndex];
  const btns = optionBtns;

  // Mark as answered.
  answered = true;

  // Highlight the selected option.
  btns[index].classList.add("selected");

  // Check if the answer is correct.
  const isCorrect = index === q.correct;

  if (isCorrect) {
    btns[index].classList.add("correct");
    score++;
    correct++;
  } else {
    btns[index].classList.add("incorrect");

    // Also highlight the correct answer so the user can learn.
    btns[q.correct].classList.add("correct");

    incorrect++;
  }

  // Update score display.
  scoreValue.textContent = score;

  // Disable all options so the user can't change their mind.
  btns.forEach(btn => { btn.disabled = true; });

  // Stop the timer since the question is answered.
  clearTimer();

  // Enable the Next / Finish button.
  nextBtn.disabled = false;
}

function nextQuestion() {
  currentIndex++;

  // Make sure no timer is running when we switch questions.
  clearTimer();

  if (currentIndex < totalQuestions) {
    // More questions left — load the next one.
    loadQuestion();
  } else {
    // No more questions — show results.
    showResults();
  }
}

function showResults() {
  clearTimer();
  showScreen(resultScreen);

  scoreNumber.textContent    = score;
  scoreTotal.textContent     = totalQuestions;
  correctCount.textContent   = correct;
  incorrectCount.textContent = incorrect;
}

function restartQuiz() {
  clearTimer();
  showScreen(startScreen);
}

// ==================== TIMER FUNCTIONS ====================

function startTimer() {
  // Don't start a new timer if one is already running.
  if (timerInterval) return;

  timerInterval = setInterval(function () {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearTimer();
      handleTimeout();
    }
  }, 1000);
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  clearTimer();
  timeLeft = TIMER_SECONDS;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  timerDisplay.textContent = `\u23F1 ${timeLeft}s`;

  // Add a warning style when time is running low.
  if (timeLeft <= 5) {
    timerDisplay.classList.add("timer-warning");
  } else {
    timerDisplay.classList.remove("timer-warning");
  }
}

function handleTimeout() {
  // The user ran out of time — treat as an incorrect answer.
  if (answered) return;  // Already answered (shouldn't happen, but guard).

  const q = questions[currentIndex];
  const btns = optionBtns;

  // Mark as answered.
  answered = true;

  // Update the timer display to show time's up.
  timerDisplay.textContent = "\u23F1 Time's up!";

  // Highlight the correct answer so the user can learn.
  btns[q.correct].classList.add("correct");

  // Count as incorrect.
  incorrect++;

  // Disable all options.
  btns.forEach(btn => { btn.disabled = true; });

  // Enable the Next / Finish button.
  nextBtn.disabled = false;
}

// ==================== EVENT LISTENERS ====================

startBtn.addEventListener("click", startQuiz);

// Each option button gets a click handler.
optionBtns.forEach((btn, index) => {
  btn.addEventListener("click", function () {
    selectOption(index);
  });
});

nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);
