let number=document.getElementById("count");
const plus=document.getElementById("increment");
const minus=document.getElementById("decrement")
const reset=document.getElementById("reset");
let count=0
reset.addEventListener("click", ()=>{
    count=0;
    number.innerText=count;
})

plus.addEventListener("click",()=>{
    count+=1;
    number.innerText=count;
})
minus.addEventListener("click",()=>{
if (count===0){
    alert("Can't reduced any more");
    }
else{
count-=1
number.innerText=count;
}
}
)
