function saveTimerState(startTime, duration) {
  localStorage.setItem('quizStartTime', startTime);
  localStorage.setItem('quizDuration', duration);
}

function loadTimerState() {
  const startTime = localStorage.getItem('quizStartTime');
  const duration = parseInt(localStorage.getItem('quizDuration')) || 120000;
  return { startTime, duration };
}

function clearTimerState() {
  localStorage.removeItem('quizStartTime');
  localStorage.removeItem('quizDuration');
}

(function () {
  const saved = localStorage.getItem('nsi-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', function () {
	syncThemeBtn();

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', function () {
      const cur  = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('nsi-theme', next);
      syncThemeBtn();
    });
  }
  initBinaryRain();
  initConverter();
  initQuiz();
});

function syncThemeBtn () {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const theme = document.documentElement.getAttribute('data-theme');
  btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}
function initBinaryRain () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, cols, drops;

  function resize () {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cols  = Math.floor(W / 18);
    drops = Array.from({ length: cols }, () => Math.random() * -50);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw () {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = dark ? 'rgba(6,13,31,0.06)' : 'rgba(5,14,36,0.05)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = '14px Space Mono, monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = Math.random() > 0.5 ? '1' : '0';
      const alpha = 0.15 + Math.random() * 0.35;
      ctx.fillStyle = dark
        ? `rgba(0,212,255,${alpha})`
        : `rgba(0,212,255,${alpha * 0.7})`;
      ctx.fillText(char, i * 18, drops[i] * 18);
      if (drops[i] * 18 > H && Math.random() > 0.97) drops[i] = 0;
      drops[i] += 0.6;
    }
  }

  setInterval(draw, 55);
}
function initConverter () {
  const decInput = document.getElementById('decInput');
  const binInput = document.getElementById('binInput');
  const d2bBtn   = document.getElementById('d2bBtn');
  const b2dBtn   = document.getElementById('b2dBtn');
  const result   = document.getElementById('convResult');

  if (!d2bBtn) return;

  d2bBtn.addEventListener('click', function () {
    const n = parseInt(decInput.value, 10);
    if (isNaN(n) || n < 0 || n > 65535) {
      result.textContent = '⚠ Entier entre 0 et 65535';
      return;
    }
    result.textContent = n.toString(2);
  });

  b2dBtn.addEventListener('click', function () {
    const v = binInput.value.trim();
    if (!/^[01]+$/.test(v)) {
      result.textContent = '⚠ Utilise uniquement 0 et 1';
      return;
    }
    result.textContent = parseInt(v, 2);
  });
  decInput && decInput.addEventListener('input', function () {
    const n = parseInt(decInput.value, 10);
    if (!isNaN(n) && n >= 0) result.textContent = n.toString(2);
  });
}
const QUESTIONS = [
  {
    q : 'Quelle est la valeur décimale du nombre binaire <code>1010</code> ?',
    opts: ['10', '8', '12', '2'],
    ans : 0
  },
  {
    q : 'Combien de bits composent un <strong>octet</strong> ?',
    opts: ['4', '8', '16', '32'],
    ans : 1
  },
  {
    q : 'Quel est le nombre décimal <strong>5</strong> en binaire ?',
    opts: ['110', '100', '101', '111'],
    ans : 2
  },
  {
    q : 'Quelle est la valeur décimale de <code>11111111</code> en binaire ?',
    opts: ['128', '127', '256', '255'],
    ans : 3
  },
  {
    q : 'Lequel de ces nombres n\'est <em>pas</em> une puissance de 2 ?',
    opts: ['32', '64', '48', '128'],
    ans : 2
  },
  {
    q : 'Le code ASCII de la lettre <code>\'A\'</code> majuscule est :',
    opts: ['97', '65', '64', '66'],
    ans : 1
  },
  {
    q : 'L\'opération binaire <strong>ET (AND)</strong> entre 1 et 0 donne :',
    opts: ['1', '0', '2', 'Indéfini'],
    ans : 1
  },
  {
    q : 'Quelle est la valeur décimale de <code>1100</code> en binaire ?',
    opts: ['10', '14', '8', '12'],
    ans : 3
  }
];

function initQuiz () {
  const quizSection  = document.getElementById('quizSection');
  const scoreSection = document.getElementById('scoreSection');
  if (!quizSection) return;

  let curr      = 0;
  let answers   = Array(QUESTIONS.length).fill(null);
  let timerStartTime;
  let timerDuration = 120000; 
  let timerInterval;
  let finished  = false;

  const cntEl    = document.getElementById('countdown');
  const progFill = document.getElementById('progressFill');
  const qNum     = document.getElementById('qNum');
  const qText    = document.getElementById('qText');
  const optsEl   = document.getElementById('options');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const subBtn   = document.getElementById('submitBtn');

  function initPersistentTimer() {
    const savedState = loadTimerState();
    
    if (savedState.startTime) {
      timerStartTime = parseInt(savedState.startTime);
      timerDuration = savedState.duration;
      
      const elapsed = Date.now() - timerStartTime;
      const remaining = timerDuration - elapsed;
      
      if (remaining <= 0) {
        endQuizDueToTime();
        return;
      }
    } else {
      timerStartTime = Date.now();
      saveTimerState(timerStartTime, timerDuration);
    }
    
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
  }

  function updateTimerDisplay() {
    const elapsed = Date.now() - timerStartTime;
    const remainingMs = Math.max(0, timerDuration - elapsed);
    const timeLeftSeconds = Math.floor(remainingMs / 1000);
    
    const m = Math.floor(timeLeftSeconds / 60);
    const s = timeLeftSeconds % 60;
    
    cntEl.textContent = `⏱ ${m}:${String(s).padStart(2,'0')}`;
    cntEl.className = 'countdown-box';
    
    if (timeLeftSeconds <= 30) cntEl.classList.add('warn');
    if (timeLeftSeconds <= 10) cntEl.classList.add('danger');
    
    saveTimerState(timerStartTime, timerDuration);
    
    if (remainingMs <= 0) {
      endQuizDueToTime();
    }
  }

  function endQuizDueToTime() {
    clearInterval(timerInterval);
    cntEl.textContent = '⏱ 0:00';
    cntEl.className = 'countdown-box danger';
    finishQuiz();
  }

  function renderQ () {
    const q = QUESTIONS[curr];

    qNum.textContent  = `Question ${curr + 1} / ${QUESTIONS.length}`;
    qText.innerHTML   = q.q;
    progFill.style.width = ((curr + 1) / QUESTIONS.length * 100) + '%';

    optsEl.innerHTML = '';
    q.opts.forEach(function (opt, i) {
      const label = document.createElement('label');
      let cls = 'opt';
      if (answers[curr] === i) cls += ' selected';
      if (finished) {
        cls += ' disabled';
        if (i === q.ans) cls += ' correct';
        else if (answers[curr] === i) cls += ' wrong';
      }
      label.className = cls;

      const radio = document.createElement('input');
      radio.type    = 'radio';
      radio.name    = 'q';
      radio.value   = i;
      radio.checked = answers[curr] === i;
      if (finished) radio.disabled = true;

      radio.addEventListener('change', function () {
        if (finished) return;
        answers[curr] = i;
        document.querySelectorAll('.opt').forEach(function (el) { el.classList.remove('selected'); });
        label.classList.add('selected');
      });

      label.appendChild(radio);
      const span = document.createElement('span');
      span.innerHTML = opt;
      label.appendChild(span);
      optsEl.appendChild(label);
    });

    prevBtn.disabled = curr === 0;
    nextBtn.style.display = curr < QUESTIONS.length - 1 ? '' : 'none';
    subBtn.style.display  = (curr === QUESTIONS.length - 1 && !finished) ? '' : 'none';
  }

  function finishQuiz () {
    finished = true;
    clearInterval(timerInterval);
    clearTimerState(); 

    const score = answers.reduce(function (acc, a, i) {
      return acc + (a === QUESTIONS[i].ans ? 1 : 0);
    }, 0);

    quizSection.style.display  = 'none';
    scoreSection.style.display = 'block';

    document.getElementById('scoreNum').textContent  = score;
    document.getElementById('scoreDenom').textContent = '/ ' + QUESTIONS.length;

    const pct = score / QUESTIONS.length;
    let emoji = '💪', msg = 'Continue à t\'entraîner, le binaire ça s\'apprend !';
    if (pct === 1)      { emoji = '🏆'; msg = 'Score parfait ! Tu maîtrises totalement le binaire !'; }
    else if (pct >= .75){ emoji = '🎉'; msg = 'Très bien ! Encore quelques révisions et c\'est parfait.'; }
    else if (pct >= .5) { emoji = '📚'; msg = 'Pas mal ! Relis le cours pour consolider tes bases.'; }

    document.getElementById('scoreEmoji').textContent   = emoji;
    document.getElementById('scoreFeedback').textContent = msg;

    document.getElementById('reviewBtn').addEventListener('click', function () {
      scoreSection.style.display = 'none';
      quizSection.style.display  = '';
      curr = 0;
      renderQ();
    });
    document.getElementById('restartBtn').addEventListener('click', function () {
      finished  = false;
      curr      = 0;
      answers   = Array(QUESTIONS.length).fill(null);
      clearTimerState();
      scoreSection.style.display = 'none';
      quizSection.style.display  = '';
      clearInterval(timerInterval);
      
      renderQ();
      initPersistentTimer(); 
    });
  }

  prevBtn.addEventListener('click', function () {
    if (curr > 0) { curr--; renderQ(); }
  });
  nextBtn.addEventListener('click', function () {
    if (curr < QUESTIONS.length - 1) { curr++; renderQ(); }
  });
  subBtn.addEventListener('click', function () {
    if (confirm('Soumettre le quiz maintenant ?')) finishQuiz();
  });

  renderQ();
  initPersistentTimer();
}