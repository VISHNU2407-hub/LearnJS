const textElement = document.getElementById("text-input");
const charElement = document.getElementById("char-count");
const remainingElement = document.getElementById("remaining-count");

const MAX_CHARS = 200;

textElement.addEventListener("input", () => {
    // Get the current length of the text in the input
    const currentLength = textElement.value.length;
    
    // Update the UI
    charElement.innerText = currentLength
    remainingElement.innerText = MAX_CHARS - currentLength

    // Optional: Add a visual warning if they exceed the limit
    if (currentLength === MAX_CHARS) {
    alert("Limit Reached");
    remainingElement.style.color = "red";
}
else if (currentLength > MAX_CHARS) {
    textElement.value = textElement.value.slice(0, MAX_CHARS);
}
else if (currentLength > MAX_CHARS - 20) {
    remainingElement.style.color = "red";
}
else {
    remainingElement.style.color = "green";
}
});