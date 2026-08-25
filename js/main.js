// Highlights the current section's nav link as the visitor scrolls.
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    let currentId = '';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.style.color = link.getAttribute('href') === `#${currentId}`
        ? 'var(--color-gold-dark)'
        : '';
    });
  };

  document.addEventListener('scroll', highlightNav);
  highlightNav();
});

// Geography guessing game.
document.addEventListener('DOMContentLoaded', () => {
  const flagEl = document.getElementById('game-flag');
  if (!flagEl) return;

  const COUNTRIES = [
    { name: 'Japan', flag: '\u{1F1EF}\u{1F1F5}' },
    { name: 'France', flag: '\u{1F1EB}\u{1F1F7}' },
    { name: 'Brazil', flag: '\u{1F1E7}\u{1F1F7}' },
    { name: 'Australia', flag: '\u{1F1E6}\u{1F1FA}' },
    { name: 'Egypt', flag: '\u{1F1EA}\u{1F1EC}' },
    { name: 'Canada', flag: '\u{1F1E8}\u{1F1E6}' },
    { name: 'India', flag: '\u{1F1EE}\u{1F1F3}' },
    { name: 'Kenya', flag: '\u{1F1F0}\u{1F1EA}' },
    { name: 'Mexico', flag: '\u{1F1F2}\u{1F1FD}' },
    { name: 'South Korea', flag: '\u{1F1F0}\u{1F1F7}' },
    { name: 'Germany', flag: '\u{1F1E9}\u{1F1EA}' },
    { name: 'Argentina', flag: '\u{1F1E6}\u{1F1F7}' },
    { name: 'Myanmar', flag: '\u{1F1F2}\u{1F1F2}' },
    { name: 'China', flag: '\u{1F1E8}\u{1F1F3}' },
    { name: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}' },
    { name: 'South Africa', flag: '\u{1F1FF}\u{1F1E6}' },
    { name: 'Italy', flag: '\u{1F1EE}\u{1F1F9}' },
    { name: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}' },
    { name: 'Peru', flag: '\u{1F1F5}\u{1F1EA}' },
    { name: 'Nigeria', flag: '\u{1F1F3}\u{1F1EC}' },
    { name: 'Sweden', flag: '\u{1F1F8}\u{1F1EA}' },
    { name: 'New Zealand', flag: '\u{1F1F3}\u{1F1FF}' },
    { name: 'Vietnam', flag: '\u{1F1FB}\u{1F1F3}' },
    { name: 'Morocco', flag: '\u{1F1F2}\u{1F1E6}' },
  ];

  const ROUNDS = 8;
  const roundEl = document.getElementById('game-round');
  const scoreEl = document.getElementById('game-score');
  const questionEl = document.querySelector('.game-question');
  const optionsEl = document.getElementById('game-options');
  const resultEl = document.getElementById('game-result');
  const resultTextEl = document.getElementById('game-result-text');
  const replayBtn = document.getElementById('game-replay');
  const statusEl = document.querySelector('.game-status');

  let quiz = [];
  let round = 0;
  let score = 0;

  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const resultMessage = (finalScore) => {
    if (finalScore === ROUNDS) return `Perfect score, ${finalScore}/${ROUNDS}! You'd fit right in on an international program team.`;
    if (finalScore >= ROUNDS - 2) return `Great job, ${finalScore}/${ROUNDS}! You clearly know your way around the map.`;
    if (finalScore >= ROUNDS / 2) return `Nice work, ${finalScore}/${ROUNDS}. A solid sense of the world.`;
    return `You got ${finalScore}/${ROUNDS}. No worries, world geography is trickier than it looks.`;
  };

  const startGame = () => {
    quiz = shuffle(COUNTRIES).slice(0, ROUNDS);
    round = 0;
    score = 0;
    resultEl.hidden = true;
    statusEl.hidden = false;
    flagEl.hidden = false;
    questionEl.hidden = false;
    renderRound();
  };

  const renderRound = () => {
    const current = quiz[round];
    roundEl.textContent = `Round ${round + 1} of ${ROUNDS}`;
    scoreEl.textContent = `Score: ${score}`;
    flagEl.textContent = current.flag;

    const wrongOptions = shuffle(
      COUNTRIES.filter((c) => c.name !== current.name)
    ).slice(0, 3);
    const options = shuffle([current, ...wrongOptions]);

    optionsEl.innerHTML = '';
    options.forEach((option) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'game-option';
      btn.textContent = option.name;
      btn.addEventListener('click', () => handleAnswer(btn, option.name, current.name));
      optionsEl.appendChild(btn);
    });
  };

  const handleAnswer = (btn, chosenName, correctName) => {
    const buttons = optionsEl.querySelectorAll('.game-option');
    buttons.forEach((b) => { b.disabled = true; });

    if (chosenName === correctName) {
      btn.classList.add('is-correct');
      score += 1;
    } else {
      btn.classList.add('is-incorrect');
      buttons.forEach((b) => {
        if (b.textContent === correctName) b.classList.add('is-correct');
      });
    }

    scoreEl.textContent = `Score: ${score}`;

    setTimeout(() => {
      round += 1;
      if (round < ROUNDS) {
        renderRound();
      } else {
        showResults();
      }
    }, 1000);
  };

  const showResults = () => {
    statusEl.hidden = true;
    flagEl.hidden = true;
    questionEl.hidden = true;
    optionsEl.innerHTML = '';
    resultTextEl.textContent = resultMessage(score);
    resultEl.hidden = false;
  };

  replayBtn.addEventListener('click', startGame);

  startGame();
});
