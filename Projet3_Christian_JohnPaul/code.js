function changerTheme() {
document.body.classList.toggle("dark");
}

function corriger() {
let score = 0;

let q1 = document.querySelector('input[name="q1"]:checked');
let q2 = document.querySelector('input[name="q2"]:checked');
let q3 = document.querySelector('input[name="q3"]:checked');
let q4 = document.querySelector('input[name="q4"]:checked');
let q5 = document.querySelector('input[name="q5"]:checked');

if(q1 && q1.value === "b") score++;
if(q2 && q2.value === "a") score++;
if(q3 && q3.value === "a") score++;
if(q4 && q4.value === "b") score++;
if(q5 && q5.value === "a") score++;

document.getElementById("resultat").innerText = "Score : " + score + "/5";
}

let temps = 60;

setInterval(function() {
temps--;
let t = document.getElementById("timer");

if(t){
t.innerText = "Temps : " + temps;
}

if(temps === 0){
corriger();
}
},1000);