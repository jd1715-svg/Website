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
    { name: 'Japan', code: 'JP' },
    { name: 'France', code: 'FR' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Australia', code: 'AU' },
    { name: 'Egypt', code: 'EG' },
    { name: 'Canada', code: 'CA' },
    { name: 'India', code: 'IN' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Mexico', code: 'MX' },
    { name: 'South Korea', code: 'KR' },
    { name: 'Germany', code: 'DE' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Myanmar', code: 'MM' },
    { name: 'China', code: 'CN' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'Italy', code: 'IT' },
    { name: 'Thailand', code: 'TH' },
    { name: 'Peru', code: 'PE' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Sweden', code: 'SE' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Vietnam', code: 'VN' },
    { name: 'Morocco', code: 'MA' },
  ];

  // Flag image files come from Twemoji's open-source flag set, addressed by
  // the flag emoji's Unicode code points (e.g. JP -> 1f1ef-1f1f5.svg).
  const flagImageUrl = (isoCode) => {
    const points = [...isoCode.toUpperCase()]
      .map((letter) => (0x1f1e6 + letter.charCodeAt(0) - 65).toString(16))
      .join('-');
    return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${points}.svg`;
  };

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
    flagEl.src = flagImageUrl(current.code);

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
