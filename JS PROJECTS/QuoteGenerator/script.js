const quote = document.getElementById("quote");
const author = document.getElementById("author");
const newBtn = document.getElementById("newQuote");
const copyBtn = document.getElementById("copyBtn");
const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
  {
    text: "Get busy living or get busy dying.",
    author: "Stephen King"
  },
  {
    text: "You have within you right now, everything you need to deal with whatever the world can throw at you.",
    author: "Brian Tracy"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  },
  {
    text: "Smile is the small Curve that straights every thing.",
    author: "Satwika Gondi"
  }
];

let previousIndex = -1;

newBtn.addEventListener("click", () => {

    let randomIndex = Math.floor(Math.random() * quotes.length);

    while (randomIndex === previousIndex) {
        randomIndex = Math.floor(Math.random() * quotes.length);
    }

    previousIndex = randomIndex;

    quote.innerText = quotes[randomIndex].text;
    author.innerText = quotes[randomIndex].author;

});
copyBtn.addEventListener("click", () => {

    const textToCopy = `${quote.innerText}\n- ${author.innerText}`;

    navigator.clipboard.writeText(textToCopy);

    copyBtn.innerText = "✅ Copied!";

    setTimeout(() => {
        copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy`;
    }, 2000);

});