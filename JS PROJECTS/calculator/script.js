/* Calculator — the working solution (used by the live preview). */

const buttons = document.querySelectorAll(".btn");
const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

let firstNumber = "";    // the number on the left (or the running result)
let operator = "";       // the pending operation: +  −  ×  ÷  %
let secondNumber = "";   // the number being typed on the right
let justEvaluated = false; // true right after pressing =

function render() {
  expressionEl.textContent = (firstNumber + " " + operator + " " + secondNumber).trim();
  resultEl.textContent = secondNumber !== "" ? secondNumber : firstNumber !== "" ? firstNumber : "0";
}

function reset() {
  firstNumber = "";
  operator = "";
  secondNumber = "";
  justEvaluated = false;
}

function toggleSign(num) {
  return num.startsWith("-") ? num.slice(1) : "-" + num;
}

/* Apply one operation. Returns the result, or "Error" for invalid input
   (including division by zero). % means "percent of": a % b → (a / 100) * b. */
function calculate(a, op, b) {
  const x = parseFloat(a);
  const y = parseFloat(b);
  if (isNaN(x) || isNaN(y)) return "Error";
  let result;
  if (op === "+") result = x + y;
  else if (op === "−") result = x - y;
  else if (op === "×") result = x * y;
  else if (op === "÷") {
    if (y === 0) return "Error";
    result = x / y;
  } else if (op === "%") result = (x / 100) * y;
  // Round away floating-point noise (0.1 + 0.2 → 0.3, not 0.30000000000000004).
  return Math.round(result * 1e10) / 1e10;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    // AC — clear everything
    if (button.classList.contains("clear")) {
      reset();
      render();
      return;
    }

    // ± — flip the sign of the number being typed
    if (button.classList.contains("sign")) {
      if (secondNumber !== "") secondNumber = toggleSign(secondNumber);
      else if (firstNumber !== "") firstNumber = toggleSign(firstNumber);
      render();
      return;
    }

    // Digits — append to the current number
    if (button.classList.contains("number")) {
      if (justEvaluated) reset();
      if (operator) secondNumber += value;
      else firstNumber += value;
      render();
      return;
    }

    // Decimal point — only one "." per number
    if (button.classList.contains("decimal")) {
      if (justEvaluated) reset();
      if (operator) {
        if (!secondNumber.includes(".")) secondNumber += ".";
      } else {
        if (!firstNumber.includes(".")) firstNumber += ".";
      }
      render();
      return;
    }

    // Operators — record the pending operation
    if (button.classList.contains("operator")) {
      if (justEvaluated) {
        // keep the result as the first number and continue
        operator = value;
        justEvaluated = false;
        render();
        return;
      }
      if (secondNumber !== "") {
        // chain: finish the pending operation first, then keep going
        const result = calculate(firstNumber, operator, secondNumber);
        if (result === "Error") {
          reset();
          render();
          return;
        }
        firstNumber = String(result);
        secondNumber = "";
      }
      operator = value;
      render();
      return;
    }

    // Equals — evaluate and display the result
    if (button.classList.contains("equal")) {
      if (!operator || secondNumber === "") return; // nothing to calculate yet
      const result = calculate(firstNumber, operator, secondNumber);
      expressionEl.textContent = (firstNumber + " " + operator + " " + secondNumber).trim();
      if (result === "Error") {
        resultEl.textContent = "Error";
        reset();
        return;
      }
      firstNumber = String(result);
      operator = "";
      secondNumber = "";
      justEvaluated = true;
      resultEl.textContent = firstNumber;
    }
  });
});
