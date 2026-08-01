// 1. Select your DOM elements once outside the loop for performance
const dateDisplay = document.getElementById("date");
const hourDisplay = document.getElementById("hours");
const minuteDisplay = document.getElementById("minutes");
const secondDisplay = document.getElementById("seconds");

function updateClock() {
    const now = new Date();
    
    // 2. Use padStart to handle the leading zero automatically
    // It turns '9' into '09', but leaves '10' as '10'
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const date = now.toLocaleDateString('en-GB');

    // 3. Update the UI
    dateDisplay.innerText = date;
    hourDisplay.innerText = hours;
    minuteDisplay.innerText = minutes;
    secondDisplay.innerText = seconds;
}

// 4. Set the interval to run the function every 1000ms (1 second)
setInterval(updateClock, 1000);

// 5. Initial call to display time immediately without waiting 1 second
updateClock();