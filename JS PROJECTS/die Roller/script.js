const rollBtn = document.getElementById("rollBtn")
const value = document.getElementById("dice")
const history = [];
const historyElement = document.getElementById("historyList");
rollBtn.addEventListener("click", () => {

    const answer = Math.floor(Math.random() * 6) + 1;
    value.innerText = answer
    history.unshift(answer)
    if (history.length > 5) {
        history.pop()
    }
    historyElement.innerHTML = "";

    history.forEach((roll) => {
        const span = document.createElement("span");
        span.textContent = roll;
        historyElement.appendChild(span);
    });
})
