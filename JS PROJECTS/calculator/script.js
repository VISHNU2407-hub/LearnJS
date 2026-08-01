const buttons = document.querySelectorAll(".btn");
const outputElement = document.getElementById("result");
let output = "";

buttons.forEach((button) => {

    button.addEventListener("click", () => {

        // Numbers
        if (!isNaN(button.innerText)) {
            output += button.innerText;
            outputElement.innerText = output;
        }

        // Operators
        if (
            button.innerText == "+" ||
            button.innerText == "-" ||
            button.innerText == "×" ||
            button.innerText == "÷" ||
            button.innerText == "%"
        ) {

           let lastChar = output[output.length - 1];

if (
    lastChar == "+" ||
    lastChar == "-" ||
    lastChar == "×" ||
    lastChar == "÷" ||
    lastChar == "%"
) {
    return;
}

            output += button.innerText;
            outputElement.innerText = output;
        }

        // Decimal
        if (button.innerText == ".") {

            let expression = output
                .replaceAll("×", "*")
                .replaceAll("÷", "/");

            let operator = "";

            for (let char of expression) {
                if (isNaN(char) && char != ".") {
                    operator = char;
                    break;
                }
            }

            let currentNumber;

            if (operator == "") {
                currentNumber = expression;
            } else {
                let parts = expression.split(operator);
                currentNumber = parts[parts.length - 1];
            }

            if (!currentNumber.includes(".")) {
                output += ".";
                outputElement.innerText = output;
            }
        }

        // Clear
        if (button.innerText == "C") {
            output = "";
            outputElement.innerText = 0;
        }

        // Delete
        if (button.classList.contains("delete")) {
            if (output.length > 1) {
                output = output.slice(0, -1);
                outputElement.innerText = output;
            } else {
                output = "";
                outputElement.innerText = 0;
            }
        }

        // Equal
        if (button.classList.contains("equal")) {

            let expression = output;

            expression = expression
                .replaceAll("×", "*")
                .replaceAll("÷", "/");

            let operator = "";

            for (let char of expression) {
                if (isNaN(char) && char != ".") {
                    operator = char;
                    break;
                }
            }

            if (expression.includes(operator)) {

                let numbers = expression.split(operator);

                let firstNumber = parseFloat(numbers[0]);
                let secondNumber = parseFloat(numbers[1]);

                if (isNaN(firstNumber) || isNaN(secondNumber)) {
                    output = "Error";
                    outputElement.innerText = output;
                } else {

                    let result;

                    if (operator == "+") {
                        result = firstNumber + secondNumber;
                    } else if (operator == "-") {
                        result = firstNumber - secondNumber;
                    } else if (operator == "*") {
                        result = firstNumber * secondNumber;
                    } else if (operator == "/") {
                        result = firstNumber / secondNumber;
                    } else if (operator == "%") {
                        result = firstNumber % secondNumber;
                    }

                    output = result.toString();
                    outputElement.innerText = output;
                }
            }
        }

    });

});