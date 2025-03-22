
const animalIcons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
const foodIcons = ['🍎', '🍌', '🍇', '🍉', '🍓', '🥕', '🍕', '🍔'];
const travelIcons = ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑'];
const weatherIcons = ['☀️', '🌤', '⛅', '🌧', '⛈', '❄️', '🌪', '🌈'];
const sportIcons = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🥊'];
const musicIcons = ['🎵', '🎶', '🎸', '🎻', '🥁', '🎺', '🎷', '🎤'];
const natureIcons = ['🌳', '🌵', '🌻', '🍁', '🍀', '🌴', '🌾', '🌺'];
const spaceIcons = ['🚀', '🛸', '🌍', '🌕', '🌟', '🌌', '🪐', '☄️'];
const emojiIcons = ['😀', '😂', '😍', '😎', '😜', '😇', '😡', '🤢'];
const gameIcons = ['🎮', '🕹', '🎲', '🃏', '🀄', '🎯', '🎳', '🎰'];
const letterIcons = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const treeIcons = ['🌲', '🌳', '🌴', '🌵', '🌿', '🍀', '🍁', '🍂'];
const flowerIcons = ['🌺', '🌻', '🌼', '🌷', '🌹', '🥀', '🌸', '💐'];
const fruitIcons = ['🍎', '🍏', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇'];
const vegetableIcons = ['🍆', '🥒', '🥦', '🌶', '🌽', '🥕', '🥔', '🍠'];
const numberIcons = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
const shapeIcons = ['🔵', '🔴', '🟡', '🟢', '🟣', '🟠', '🟤', '⚫'];
const symbolIcons = ['❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '🧡'];
const handIcons = ['👍', '👎', '👌', '👊', '✊', '🤞', '🤟', '🤘'];
const arrowIcons = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];

const iconSets = [animalIcons, foodIcons, travelIcons, weatherIcons, sportIcons, musicIcons,
  natureIcons, spaceIcons, emojiIcons, gameIcons, letterIcons, treeIcons, flowerIcons, fruitIcons,
  vegetableIcons, numberIcons, shapeIcons, symbolIcons, handIcons, arrowIcons];
let flippedCards = [];
let moves = 0;
let time = 0;
let timer;

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

function getRandomIconSet() {
  return iconSets[Math.floor(Math.random() * iconSets.length)];
}

function createGame() {
  const gameContainer = document.getElementById('game');
  const selectedIcons = getRandomIconSet(); // Rastgele ikon seti seç
  const allIcons = [...selectedIcons, ...selectedIcons].sort(() => Math.random() - 0.5);

  gameContainer.innerHTML = '';

  allIcons.forEach((icon) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = icon;
    card.innerHTML = `
        <div class="card-front">${icon}</div>
        <div class="card-back"></div>
    `;
    card.addEventListener('click', () => flipCard(card));
    gameContainer.appendChild(card);
  });
}

function flipCard(card) {
  if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      moves++;
      document.getElementById('moves').textContent = moves;
      checkMatch();
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.value === card2.dataset.value) {
    flippedCards = [];
    checkWin();
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

function checkWin() {
  const allCards = document.querySelectorAll('.card');
  if ([...allCards].every(card => card.classList.contains('flipped'))) {
    clearInterval(timer);
    setTimeout(() => showWinModal(), 500);
  }
}

function startGame() {
  clearInterval(timer);
  moves = 0;
  time = 0;
  flippedCards = [];
  document.getElementById('moves').textContent = '0';
  document.getElementById('time').textContent = '0';
  createGame();
  closeModal();
  timer = setInterval(() => {
    time++;
    document.getElementById('time').textContent = time;
  }, 1000);
}

function showWinModal() {
  document.getElementById("winMessage").innerText = `Tebrikler!\nKazandınız!\n\nHamle: ${moves} Süre: ${time}s`;
  document.getElementById("winModal").style.display = "block";
  saveHighScore("Hafıza Oyunu", 200 - moves * 2 - time);
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

function closeModal() {
  document.getElementById("winModal").style.display = "none";
}

document.getElementById('winModal').addEventListener('click', startGame);

document.addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});

startGame();