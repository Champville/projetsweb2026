function corrigerQuiz(){

score = 0;

if(document.getElementById("q1r").checked){score++;}
if(document.getElementById("q2r").checked){score++;}
if(document.getElementById("q3r").checked){score++;}
if(document.getElementById("q4r").checked){score++;}
if(document.getElementById("q5r").checked){score++;}
if(document.getElementById("q6r").checked){score++;}
if(document.getElementById("q7r").checked){score++;}
if(document.getElementById("q8r").checked){score++;}
if(document.getElementById("q9r").checked){score++;}
if(document.getElementById("q10r").checked){score++;}

document.getElementById("resultat").innerHTML = "Votre score est : " + score + "/10";
}

var temps = 300;

function compteRebours(){
temps = temps - 1;
var minutes = Math.floor(temps/60);
var secondes = temps % 60;
document.getElementById("timer").innerHTML =
"Temps restant : " + minutes + " : " + secondes;
}
setInterval(compteRebours,1000);

function changerMode() {
  let lienCss = document.getElementById("theme-link");

  if (lienCss.getAttribute("href") === "style.css") {
    lienCss.setAttribute("href", "dark.css");
    localStorage.setItem("mode","dark");
  } else {
    lienCss.setAttribute("href", "style.css");
    localStorage.setItem("mode","light");
  }
}

window.onload = function(){
  let modeSauve = localStorage.getItem("mode");
  let lienCss = document.getElementById("theme-link");

  if(modeSauve === "dark"){
    lienCss.setAttribute("href","dark.css");
  }
  if(modeSauve === "light"){
    lienCss.setAttribute("href","style.css");
  }
}

function search() {
  var mot = document.getElementById("searchInput").value;

  if (document.body.innerHTML.indexOf(mot) > -1) {
    alert("Le mot recherché est bien dans notre site!");
  } else {
    alert("Pas trouvé ! Essayez un autre mot clé !");
  }
}