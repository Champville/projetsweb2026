function valider_reponses() {
  let score = 0;

  if (document.getElementById("HTML").checked) {
    score += 1;
  }

  if (
    document.getElementById("1989").checked &&
    !document.getElementById("Amazon").checked &&
    document.getElementById("Pages").checked &&
    !document.getElementById("Internet").checked
  ) {
    score += 1.5;
  }

  if (document.getElementById("Lee").value.toLowerCase() == "tim berners-lee") {
    score += 1.5;
  }

  if (document.getElementById("Client").checked) {
    score += 1;
  }

  if (document.getElementById("EBI").checked) {
    score += 1;
  }

  if (
    document.getElementById("CER").checked &&
    document.getElementById("SER").checked &&
    !document.getElementById("SDSC").checked &&
    document.getElementById("CPN").checked
  ) {
    score += 2;
  }

  if (document.getElementById("AT").value.toLowerCase() == "arpanet") {
    score += 2;
  }

  document.getElementById("resultat").innerHTML = score + " / 10";
}
 
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 
