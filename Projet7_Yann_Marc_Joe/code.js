let isDark = false; // thème initialement clair
let questions = [], currentQuestion = 0, quizDone = false, quizScore = 0;
// toutes les questions, l'index de la 1e question, le quiz n'est pas terminé, le score est init. 0

const scoreValue = 1; // score pour chaque réponse correcte
const quizTime = 90; // temps total pour tout le quiz en s

function setupQuiz() {
    const quizButton = document.querySelector(".quizButton");

    if (quizButton) { // si le bouton existe,
        const timer = document.getElementById("quizTimer"); 
        timer.seconds = quizTime;
        timer.innerHTML = "ALLEZ !"; // on crée une petite bulle 'timer'

        quizButton.onclick = _ => {
            timer.interval = setInterval(_ => {
                if (quizDone) {
                    resetTimer(); // remettre le timer quand le quiz est terminé
                    return
                }
                timer.seconds--; // on enlève 1s du timer chaque seconde
                // m:ss
                const minutes = Math.floor(timer.seconds / 60); // on arrondit les secondes
                const seconds = timer.seconds % 60;
                timer.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`; // on affiche le timer au format m:ss

                if (timer.seconds <= 0) { // le temps termine
                    clearInterval(timer.interval);
                    timer.innerHTML = "TEMPS ÉCOULÉ !";

                    // ajouter la classe quizLost à tous les quiz containers (pour leur donner l'animation de perte)
                    document.querySelectorAll("#quizContainer").forEach(container => container.classList.add("quizLost"));
                    
                    setTimeout(() => {
                        alert(`Quiz terminé ! Votre score : ${quizScore}/${questions.length * scoreValue}`); // montrer le score qd même pour les questions répondues
                        declare("Temps Écoulé !"); // fallait faire plus vite
                        resetQuiz();
                    }, 3000); // attendre 3s avant de réinitialiser le quiz
                }
            }, 1000); // mettre à jour le timer chaque 1s

            timer.classList.remove("timerRecede");
            quizButton.style.display = "none";
            doQuiz();
        };
    }
}

function resetQuiz() {
    currentQuestion = 0;
    quizDone = false;
    quizScore = 0;
    // remettre les variables à 0

    // effacer tous les containers quiz
    document.querySelectorAll(".activeQuiz").forEach(container => container.remove());

    // enlever la class quizLost de tous les containers quiz
    document.querySelectorAll("#quizContainer").forEach(container => container.classList.remove("quizLost"));

    // reset le quiz timer
    resetTimer();

    const quizButton = document.querySelector(".quizButton");
    if (quizButton) {
        // enlever les styles custom
        quizButton.style.display = "inline-block";
        quizButton.innerHTML = "<h1>Recommencer le Quiz</h1>";

        setupQuiz();
    }
}

function addQuestion(question, options, answer) {
    questions.push({ question, options, answer, myAnswer: -1 }); // ma réponse par défaut est -1 sinon on peut avoir des réponses justes sans rien faire (3eb heke)
} // ajouter une question au quiz avec l'indexe comme option correcte

const declare = text => { // fonction qui permet d'afficher quelque chose sur l'écran en grand pendant 2s
    const declarer = document.createElement("div");
    declarer.classList.add("declarer");
    declarer.textContent = text;
    document.body.appendChild(declarer);

    setTimeout(_ => declarer.remove(), 2000);
}

addQuestion("Python est un :", ["Langage de Programmation", "Langage Interprété", "Langage Compilé", "Langage Humain"], 0);
addQuestion("Python te permet de :", ["Créer des sites web", "Communiquer avec l'ordinateur", "Cuisiner", "Faire du café"], 1);
addQuestion("Comment peut-on déclarer une variable en Python ?", ["var x = 5", "x := 5", "x = 5", "let x = 5"], 2);
addQuestion("Pour déclarer une fonction en Python, on utilise :", ["func", "function", "def", "declare"], 2);
addQuestion("Comment comparer deux valeures en Python ?", ["=", "==", "!=", ">="], 1);
addQuestion("Quel opérateur nous permet d'élever à une puissance ?", ["^", "**", "x", "*2"], 1);
addQuestion("Comment peut-on afficher du texte en Python ?", ["print()", "display()", "prin(t)", "log()"], 0);
addQuestion("Que fait le caractère # en Python ?", ["Il indique un commentaire", "Il indique une erreur", "Il indique un retour à la ligne", "Il arrête le code"], 0);
addQuestion("Quand on donne des paramètres à une fonction, on doit les séparer par :", ["Des virgules", "Des points-virgules", "Des espaces", "Des tirets"], 0);
addQuestion("Quel est le résultat de True and False or (False and True) ?", ["True", "False", "None", "Error"], 1);

// ^^^ toute la liste des questions


const resetTimer = _ => { // remettre le timer
    const timer = document.getElementById("quizTimer");

    timer.seconds = quizTime;
    clearInterval(timer.interval);
    timer.classList.add("timerRecede"); // ajoute une classe pour faire diminuer le timer
}

const doQuiz = _ => {
    if (currentQuestion >= questions.length) { // qd la cur question dépasse le nb de questions, càd quand c'est terminé
        if (quizScore === questions.length * scoreValue) {
            alert(`Félicitations ! Votre score : ${quizScore}/${questions.length * scoreValue}`); // message spécial pour un score parfait
        } else if (quizScore === 0) {
            alert(`Il faut mieux étudier... c'est quoi ça???? Votre score : ${quizScore}/${questions.length * scoreValue}`); // message spécial pour un score de 0
        } else {
            alert(`Quiz terminé ! Votre score : ${quizScore}/${questions.length * scoreValue}`); // affiche le score
        }
        quizDone = true; // quiz considéré terminé
        return;
    }

    const quizContainerBase = document.querySelector("#quizContainer");
    const quizContainer = quizContainerBase.cloneNode(true); // permet de recommencer le quiz sans recréer un nouveau container à chaque fois, on clone juste le container de base
    quizContainer.classList.add("activeQuiz");

    document.body.appendChild(quizContainer);
    // dupliquer le container quiz

    quizContainer.style.display = "block";

    const title = quizContainer.querySelector("h3");
    const question = quizContainer.querySelector("p");
    const options = quizContainer.querySelector("#options");

    // code quizTimer
    const quizTimer = quizContainer.querySelector("#quizTimer");

    options.innerHTML = ""; // enlever toutes les options précédentes

    title.textContent = `Question ${currentQuestion + 1}`; // num de la question

    const current = questions[currentQuestion]; // utiliser l'indexe pour récup la question courante
    question.textContent = current.question;
    
    // mettre les options avec radio buttons
    let i = 0;
    for (const option of current.options) { // pour chaque option,
        const label = document.createElement("label"); // on crée le label
        const input = document.createElement("input"); // puis le input
        input.type = "radio";
        input.name = "option" + currentQuestion;
        let currentId = i++;
        // donner une id à chaque input (un num) pour vérifier la réponse plus tard
        input.id = currentId; // pour le input
        // qd on click
        input.onclick = _ => current.myAnswer = currentId; // on attribue l'id de l'option à ma réponse
        label.appendChild(input); // on ajoute le label au input
        label.appendChild(document.createTextNode(option)); // on crée l'option
        options.appendChild(label); // on ajoute le label finalement
    }

    // prochain button
    const nextButton = quizContainer.querySelector("#nextButton");
    nextButton.textContent = "Vérifier"; // permet de vérifier les réponses

    nextButton.onclick = _ => {
        const isCorrect = current.myAnswer === current.answer; // si ma réponse === la bonne réponse
        declare(isCorrect ? "✅ Correcte !" : "❌ Incorrecte !"); // si oui, correcte, sinon incorrecte
        quizScore += scoreValue * isCorrect; // on multiplie le score par 1 si c'est correcte, sinon par 0 pour l'annuler
        currentQuestion++; // next questionnn
        nextButton.onclick = _ => {
            // enlever ce bouton après l'avoir cliqué
            nextButton.remove();
            doQuiz();
        };
        nextButton.textContent = "Suivant"; // après le "vérifier"

        // enlever toutes les options sauf la bonne réponse, faut bien leur apprendre
        for (const option of options.querySelectorAll("label")) {
            const input = option.querySelector("input");
            input.disabled = true;
            if (input.id != current.answer) { // toutes les options sauf la bonne réponse,
                option.style.textDecoration = "line-through"; // vont être barrés
                option.style.color = "red"; // et en rouge
                // input.disabled = true; // et aussi disabled pour ne plus changer la réponse
            } else { // la bonne réponse,
                option.style.fontWeight = "bold"; // sera en bold
                option.style.color = "green"; // et en vert
                // input.disabled = true;
            }
        }
    };
};

const updateThemeButton = _ => { // la fonction qui gère le thème dark / light
    const theme = document.getElementById("theme"); // on récupère le bouton

    if (!theme) // s'il n'existe pas, on quitte la fonction pour éviter les erreurs
        return;

    theme.textContent = `${isDark ? "Dark" : "Light"} Mode`; // le texte dans le bouton soit dark soit light
}

const setTheme = isDark => {
    document.body.classList[isDark ? "add" : "remove"]("dark-mode"); // on ajoute la classe dark-mode au body si isDark est true
    // sinon on l'enlève comme ça on peut faire mal au yeux
    updateThemeButton(); // on met à jour le texte du bouton
}

const switchTheme = _ => {
    setTheme(isDark = !isDark); // on fait le contraire de isDark, zakiyye heyde
    localStorage.setItem("theme", isDark ? "dark" : "light"); // on utilise localStorage pour se souvenir du thème,
    // même après avoir quitté la page à travers le nav

    document.body.classList.add("body-transition");
    setTimeout(_ => document.body.classList.remove("body-transition"), 400); // créer une transition quand le thème est changé pendant 400ms
}

const syntaxHighlight = _ => { // la meilleur partie de tout ce code qui fait le syntax highlighting des code blocks Python, COMPLÈTEMENT MANUELLEMENT
    const codeBlocks = document.querySelectorAll(".langage-python");
    codeBlocks.forEach(block => { // regex pour remplacer les caractères spéciaux de python par leurs équivalents colorés
        const code = block.innerHTML.replace(/<br>/g, "\n").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"); 
        // ^^^^ on fait attention de ne pas remplacer les \n, <, > et & qui sont des caractères dans le code.
        // pour les opérateurs comme +, -, *, /, =, +=, %, &, >, <, dans .python-operator,
        let highlightedCode = code.replace(/(\>|\&(?!nbsp;)|\<|\%|[+\-*/=]+|\,|\(|\)|==|!=|<=|>=|&&|\|\|)/g, '<span class="python-operator">$1</span>');
        // les keywords/builtins comme def, return, etc
        highlightedCode = highlightedCode.replace(/\b(def|return|print|and|or|not|True|False)\b/g, '<span class="python-keyword">$1</span>');
        // les nb dans .python-number
        highlightedCode = highlightedCode.replace(/(\b\d+\b)/g, '<span class="python-number">$1</span>');
        // ajouter les commentaires #, super cool
        highlightedCode = highlightedCode.replace(/(#.*($|\n))/g, '<span class="python-number">$1</span>');
        block.innerHTML = highlightedCode.replace(/\n/g, "<br>"); // préserver les nouvelles lignes et les espaces
    });
}

// en bas, on met le thème quand la page load puisque le browser ne charge pas tout avant que les scripts ont finis d'être éxécutés
// le tag <script> doit être mis en haut du body pour marcher avant que tous les éléments soient "rendered"
// cela fait qu'il n'y a pas de flashing quand on change de page avec le thème dark non par défaut

setTheme(isDark = localStorage.getItem("theme") === "dark"); // on récupère le thème du localStorage pour le charger en premier

window.onload = _ => { // qd la fenêtre load
    updateThemeButton(); // on met à jour le texte du btn
    syntaxHighlight(); // on charge le syntaxhighlighting
    
    // on sépare toutes les lettres pour leur donner un <span> pour l'animation
    const boldElements = document.querySelectorAll("h1"); // spécifiquement les h1
    // sinon max lag
    boldElements.delay = 0; // on peut modifier le délai
    boldElements.forEach(el => { // pour chaque,
        const text = el.textContent; // on garde le même contenu biensûr
        el.innerHTML = text.split("").map(letter => {
            if (letter === " ") // on s'assure que les espaces vides sont conservés
                letter = "&nbsp;"; // et aussi les "enter" (retour à la ligne)

            // on fait reset après 500ms pour que ça ne prenne pas trop de temps
            const delay = (boldElements.delay += 100) % 1000;
            const animOffset = `animation-delay: ${delay}ms;`; // on fait passer le délai au css
            return `<b><div class="letter" style="${animOffset}">${letter}</div></b>`; // on retourne la lettre avec le style animé et la classe letter
            // la classe letter permet de définir le mvmt de translation des lettres individuelles.
        }).join(""); // on regroupe les elems (lettres)
    });

    // le quiz et appelé
    setupQuiz();
};
