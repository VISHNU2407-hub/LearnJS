const color=document.getElementById("change-color")
const name=document.getElementById("color-name")
const body = document.body;
const colors=['red','blue','violet','green','purple']
let count=-1
color.addEventListener("click",()=>
{
    count = (count + 1) % colors.length;
    name.innerText = colors[count].toUpperCase();
    body.style.backgroundColor = colors[count];
}

)