const billInput = document.getElementById("billInput");
const customTipInput = document.getElementById("customTip");
const peopleInput = document.getElementById("peopleInput");

const tipButtons = document.querySelectorAll(".tip-btn");

const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

const tipAmountElement = document.getElementById("tipAmount");
const totalAmountElement = document.getElementById("totalAmount");
const perPersonElement = document.getElementById("perPerson");
let tipPercentage = 0;
tipButtons.forEach(button => {

    button.addEventListener("click", () => {

        tipButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        tipPercentage = parseFloat(button.textContent);

    });

});
calculateBtn.addEventListener("click", () => {
    const bill = parseFloat(billInput.value) || 0;
    
    let finalTip = 0;
    let hasTip = false;

    if (customTipInput.value.trim() !== "") {
        finalTip = parseFloat(customTipInput.value) || 0;
        hasTip = true;
    } else if (tipPercentage > 0) {
        finalTip = tipPercentage;
        hasTip = true;
    }

    const people = parseInt(peopleInput.value) || 0;

    if (bill <= 0 || people <= 0 || !hasTip) {
        alert("Please enter valid inputs. Bill and People must be greater than 0, and a tip must be selected.");
        return;
    }

    const tipAmount = bill * finalTip / 100;
    const totalAmount = bill + tipAmount;
    const perPerson = totalAmount / people;

    tipAmountElement.textContent = `$${tipAmount.toFixed(2)}`;
    totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
    perPersonElement.textContent = `$${perPerson.toFixed(2)}`;
});

resetBtn.addEventListener("click", () => {
    billInput.value = "";
    customTipInput.value = "";
    peopleInput.value = "1";
    
    tipAmountElement.textContent = "$0.00";
    totalAmountElement.textContent = "$0.00";
    perPersonElement.textContent = "$0.00";
    
    tipPercentage = 0;
    tipButtons.forEach(btn => {
    btn.classList.remove("active");
});
});