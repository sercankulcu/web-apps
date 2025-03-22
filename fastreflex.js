let score = 0;
let gameActive = false;
let gameDuration = 30000; // 30 saniye
let fastestReactionTime = 2000;
let gameMode = "easy"; // Kolay mod (başlangıçta)

const titleElement = document.getElementById('title');
titleElement.addEventListener('click', function () {
  if (window.parent !== window) {
    window.parent.showMainContent();
  } else {
    window.location.href = 'index.html';
  }
});

const infoButton = document.getElementById('infoButton');
const overlay = document.getElementById('overlay');
const closeButton = document.getElementById('closeButton');

infoButton.addEventListener('click', () => {
  overlay.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  overlay.style.display = 'none';
});

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";

  score = 0;
  fastestReactionTime = 1000;
  document.getElementById("score").innerText = "⭐: 0 ⚡: -- ms";
  gameActive = true;
  spawnTarget();
  setTimeout(() => {
    gameActive = false;
    document.getElementById("gameOverScreen").style.display = "block";
    saveHighScore("Hızlı Refleks", score);
  }, gameDuration);
}

function saveHighScore(gameName, score) {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  let highScores = JSON.parse(localStorage.getItem('dorukdayimhighScores')) || {};

  if (!highScores[gameName] || score > highScores[gameName].score) {
    highScores[gameName] = {
      score: score,
      date: formattedDate,
    };

    localStorage.setItem('dorukdayimhighScores', JSON.stringify(highScores));
  }
}

function toggleMode() {

  event.stopPropagation();
  gameMode = gameMode === "easy" ? "hard" : "easy"; // Modu değiştir

  let modeButtonStart = document.getElementById("modeToggleStart");
  let modeButtonEnd = document.getElementById("modeToggleEnd");

  if (gameMode === "easy") {
    modeButtonStart.textContent = "🌕 Mod: (Kolay)";
    modeButtonEnd.textContent = "🌕 Mod: (Kolay)";
  } else {
    modeButtonStart.textContent = "🔥 Mod: (Zor)";
    modeButtonEnd.textContent = "🔥 Mod: (Zor)";
  }
}

function spawnTarget() {
  if (!gameActive) return;

  let gameContainer = document.getElementById("gameContainer");
  let target = document.createElement("div");
  target.classList.add("target");

  let x = Math.random() * (gameContainer.clientWidth - 50);
  let y = Math.random() * (gameContainer.clientHeight - 150) + 100;

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  let animal;
  if (gameMode === "easy") {
    animal = Math.random() > 0.33 ? 'rabbit' : 'crow'; // Kolay mod: tavşan ve karga
  } else {
    let rand = Math.random();
    if (rand < 0.33) animal = 'rabbit'; // Tavşan
    else if (rand < 0.5) animal = 'crow'; // Karga
    else if (rand < 0.83) animal = 'turtle'; // Kaplumbağa
    else animal = 'hedgehog'; // Kirpi
  }

  target.style.backgroundImage = `url(https://sercankulcu.github.io/game/${animal}.webp)`; // Hayvan resmini belirle

  let targetCreationTime = Date.now();

  target.onclick = function () {
    let reactionTime = Date.now() - targetCreationTime; // Tıklanma süresi

    if (reactionTime < fastestReactionTime) {
      fastestReactionTime = reactionTime;
    }

    if (animal === 'rabbit' || animal === 'turtle') {
      score += Math.max(10 - Math.floor(reactionTime / 100), 1); // Kazandıran hayvanlar
    } else {
      score -= Math.max(5 - Math.floor(reactionTime / 200), 1); // Kaybettiren hayvanlar
    }

    document.getElementById("score").innerText = "⭐: " + score + " ⚡: " + fastestReactionTime + " ms";
    document.getElementById("finalscore").innerText = "⭐: " + score + " ⚡: " + fastestReactionTime + " ms";
    gameContainer.removeChild(target);
    spawnTarget(); // Yeni hedef oluştur
  };

  gameContainer.appendChild(target);

  setTimeout(() => {
    if (gameContainer.contains(target)) {
      gameContainer.removeChild(target);
      spawnTarget();
    }
  }, 1000 + Math.random() * 1000);
}

document.getElementById("startScreen").addEventListener('click', startGame);

document.getElementById("gameOverScreen").addEventListener('click', startGame);

document.getElementById('modeToggleStart').addEventListener('click', toggleMode);

document.getElementById('modeToggleEnd').addEventListener('click', toggleMode);
