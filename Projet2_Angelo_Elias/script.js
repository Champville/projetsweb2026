function toggleMode() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
}

function Calcul() {
  entier = Number(document.getElementById("entier").value);

  if (document.getElementById("binaire").checked) {
    let nbBinaire = entier.toString(2);
    document.getElementById("resultat").value = nbBinaire;
  }
  if (document.getElementById("hexa").checked) {
    let nbHexa = entier.toString(16);
    document.getElementById("resultat").value = nbHexa;
  }
}

function valider() {
  var score = 0;

  if (document.getElementById("q1b").checked) {
    score++;
  }
  if (document.getElementById("q2c").checked) {
    score++;
  }
  if (document.getElementById("q3c").checked) {
    score++;
  }
  if (document.getElementById("q4c").checked) {
    score++;
  }
  if (document.getElementById("q5c").checked) {
    score++;
  }
  if (document.getElementById("q6b").checked) {
    score++;
  }
  if (document.getElementById("q7b").checked) {
    score++;
  }
  if (document.getElementById("q8b").checked) {
    score++;
  }
  if (document.getElementById("q9b").checked) {
    score++;
  }
  if (document.getElementById("q10b").checked) {
    score++;
  }

  document.getElementById("score").innerHTML =
    "Votre note : " + score + " / 10";
}
/*timer*/
var secondes = 240;

function timer() {
  secondes--;

  var minutes = Math.floor(secondes / 60);
  var sec = secondes % 60;

  if (sec < 10) {
    sec = "0" + sec;
  }

  document.getElementById("timer").innerHTML =
    "⏱ Temps restant : " + minutes + ":" + sec;

  if (secondes <= 0) {
    document.getElementById("timer").innerHTML = "⏱ Temps écoulé !";
    valider();
    document.getElementById("submit-btn").disabled = true;
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
  }
}

setInterval(timer, 1000);
