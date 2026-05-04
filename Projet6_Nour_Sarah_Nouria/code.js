const themeToggle = document.getElementById('theme-toggle');
const rootElement = document.documentElement; 

if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        rootElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = "Mode Clair";
    } 
	else {
        themeToggle.textContent = "Mode Sombre";
    }
    
    themeToggle.addEventListener('click', () => {
        if (rootElement.hasAttribute('data-theme')) {
            rootElement.removeAttribute('data-theme');
            themeToggle.textContent = "Mode Sombre";
            localStorage.setItem('theme', 'light');
        } 
		else {
            rootElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = "Mode Clair";
            localStorage.setItem('theme', 'dark');
        }
    });
}

let timeLeft = 60;
const timerDisplay = document.getElementById('timer');
let timerInterval;

if (window.location.pathname.includes('quiz.html') && timerDisplay) {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Temps restant : ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            validateQuiz(); 
        }
    }, 1000);
} 

function validateQuiz() { 
    if (timerInterval) clearInterval(timerInterval);

    const answers = { q1: 1, q2: 1, q3: 1, q4: 1, q5: 1 };
    let score = 0;

    for (let q in answers) {
        const selected = document.querySelector(`input[name="${q}"]:checked`);
        if (selected && parseInt(selected.value) === answers[q]) {
            score++;
        }
    }

    const resultatDisplay = document.getElementById('resultat');
    if (resultatDisplay) {
        resultatDisplay.textContent = `Votre score final est : ${score} / 5`;
        resultatDisplay.style.color = score >= 3 ? "#016B61" : "#e74c3c";
    }
    
    document.querySelectorAll('input[type="radio"]').forEach(i => i.disabled = true);
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        submitBtn.style.cursor = "not-allowed";
    }
}
