let inputElement = document.getElementById("guessInput");
let guessBtn = document.getElementById("guessBtn");
let attemptsElement = document.getElementById("attempts");
let bestScoreElement = document.getElementById("bestScore");
let hintElement = document.getElementById("hint");
let restartBtn = document.getElementById("restartBtn");
let messageElement = document.getElementById("messageText");

let secretNumber = Math.floor(Math.random() * 100) + 1;

let attempts = 0;
let bestScore = 0;

guessBtn.addEventListener("click", () => {

    let guessNumber = parseInt(inputElement.value);

    if (isNaN(guessNumber)) {
        messageElement.innerText = "Enter a valid number!";
        return;
    }

    attempts++;
    attemptsElement.innerText = attempts;

    if (guessNumber === secretNumber) {

        hintElement.innerText = "Correct";
        messageElement.innerText = "🎉 You guessed it!";

        if (bestScore === 0 || attempts < bestScore) {
            bestScore = attempts;
            bestScoreElement.innerText = bestScore;
        }

        guessBtn.disabled = true;

    } else if (guessNumber < secretNumber) {

        hintElement.innerText = "Higher";
        messageElement.innerText = "Try a higher number.";

    } else {

        hintElement.innerText = "Lower";
        messageElement.innerText = "Try a lower number.";

    }

});

restartBtn.addEventListener("click", () => {

    secretNumber = Math.floor(Math.random() * 100) + 1;

    attempts = 0;

    attemptsElement.innerText = 0;
    hintElement.innerText = "-";
    messageElement.innerText = "Start guessing! I'll tell you if your guess is too high or too low.";
    inputElement.value = "";

    guessBtn.disabled = false;

});