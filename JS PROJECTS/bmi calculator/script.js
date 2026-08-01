let weightElement = document.getElementById("weight");
let heightElement = document.getElementById("height");
let calculateBtn=document.getElementById("calculateBtn");
let resultValue=document.getElementById("bmiValue")
let categoryTab=document.getElementById("category")
let weight = 0;
let height = 0;
let result=0;
weightElement.addEventListener("input", () => {
    weight = weightElement.value;
    console.log(weight);
});

heightElement.addEventListener("input", () => {
    height = heightElement.value;
    console.log(height);
});

calculateBtn.addEventListener("click",()=>{
    if(weight<=0|| height<=0){
        resultValue.innerText="Invalid Input"
        categoryTab.innerText="--"
        categoryTab.style.color='white'
    }
    else{
    result=weight/(height*height)
    resultValue.innerText=result.toFixed(2)
    if(result<18.5){
        categoryTab.innerText="UnderWeight"
        categoryTab.style.color="red"
    }else if(result<24.9){
        categoryTab.innerText="Normal"
         categoryTab.style.color="green"
    }else if(result<29.9){
        categoryTab.innerText="OverWeight"
         categoryTab.style.color="orange"
    }else{
        categoryTab.innerText="Obese"
         categoryTab.style.color="red"
    }}
})