import { wordsSixLetters as words, allwordsSixLetters as allwords } from 'https://sercankulcu.github.io/game/words-six-letters.js';

const WORD_LENGTH = 6;
const MAX_GUESSES = 6;

let startTime;
let endTime;
let score = 0;

let targetWord = words[Math.floor(Math.random() * words.length)];
let currentGuess = [];
let currentRow = 0;

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

const keyboardLetters = [
  ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', 'Ş', 'İ'],
  ['?', 'SİL', 'GÖNDER']
];

function initGame() {
  startTime = new Date();
  const grid = document.getElementById('grid');
  const keyboard = document.getElementById('keyboard');

  for (let i = 0; i < MAX_GUESSES; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < WORD_LENGTH; j++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      row.appendChild(tile);
    }
    grid.appendChild(row);
  }

  keyboardLetters.forEach(rowLetters => {
    const row = document.createElement('div');
    row.className = 'keyboard-row';
    rowLetters.forEach(letter => {
      const key = document.createElement('button');
      key.className = 'key';
      if (letter === "SİL") {
        key.classList.add("deleteButton");
      } else if (letter === "GÖNDER") {
        key.classList.add("submitButton");
      } else if (letter === "?") {
        key.classList.add("questionButton");
      }
      key.textContent = letter;
      key.addEventListener('click', () => handleInput(letter));
      row.appendChild(key);
    });
    keyboard.appendChild(row);
  });
}

let hintCount = 0;

function handleInput(letter) {
  if (letter === '?') {
    if (hintCount < 2) {
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (!currentGuess[i] || currentGuess[i] != targetWord[i]) { // Boş olan ilk kutuyu bul
          currentGuess[i] = targetWord[i]; // Hedef kelimenin harfini ekle
          const row = document.getElementsByClassName('row')[currentRow];
          const tile = row.children[i];
          tile.classList.add('correct');
          updateGrid();
          hintCount++; // İpucu sayısını artır
          break;
        }
      }
    }

    if (hintCount >= 2) { // 2. ipucudan sonra butonu devre dışı bırak
      document.querySelector('.questionButton').disabled = true;
    }
  } else if (letter === 'SİL') {
    if (currentGuess.length > 0) {
      currentGuess.pop();
      updateGrid();
    }
  } else if (letter === 'GÖNDER') {
    if (currentGuess.length === WORD_LENGTH) {
      if (!allwords.includes(currentGuess.join(''))) {
        const row = document.getElementsByClassName('row')[currentRow];
        row.classList.add('shake');
        setTimeout(() => row.classList.remove('shake'), 500);
        currentGuess = [];
        updateGrid();
      } else {
        checkGuess();
      }
    }
  } else {
    if (currentGuess.length < WORD_LENGTH) {
      currentGuess.push(letter);
      updateGrid();
    }
  }
}

function updateButtonColor(letter) {
  const buttons = document.querySelectorAll('.key');
  buttons.forEach(button => {
    if (button.textContent === letter) {
      if (targetWord.includes(letter)) {
        button.classList.add('correct');
      } else {
        button.classList.add('absent');
      }
    }
  });
}

function updateGrid() {
  const row = document.getElementsByClassName('row')[currentRow];
  Array.from(row.children).forEach((tile, index) => {
    tile.textContent = currentGuess[index] || '';
  });
}

function checkGuess() {
  const guess = currentGuess.join('');
  const row = document.getElementsByClassName('row')[currentRow];

  if (guess.length !== WORD_LENGTH) return;

  const targetLetters = targetWord.split('');
  const guessLetters = currentGuess;

  guessLetters.forEach((letter, index) => {
    updateButtonColor(letter);
    const tile = row.children[index];
    if (letter === targetLetters[index]) {
      tile.classList.add('correct');
    } else if (targetLetters.includes(letter)) {
      tile.classList.add('present');
    } else {
      tile.classList.add('absent');
    }
  });

  currentGuess = [];
  currentRow++;

  if (guess === targetWord) {
    endTime = new Date();
    const timeDiff = (endTime - startTime) / 1000;
    let timeScore = Math.max(0, 60 - timeDiff);
    let rowScore = 35 - currentRow * 5;
    score = Math.round(timeScore) + rowScore;
    showResult(`Tebrikler! Kazandınız! Skorunuz: ${score}`);
    saveHighScore("Altı Harf", score);
  } else if (currentRow === MAX_GUESSES) {
    showResult(`Oyun Bitti! Doğru Kelime: ${targetWord}`);
  }
}

function showResult(message) {
  document.getElementById('resultMessage').textContent = message;
  document.getElementById('gameResult').style.display = 'block';
}

function restartGame() {

  targetWord = words[Math.floor(Math.random() * words.length)];
  currentGuess = [];
  currentRow = 0;
  hintCount = 0;

  document.getElementById('gameResult').style.display = 'none';
  document.getElementById('grid').innerHTML = '';
  document.getElementById('keyboard').innerHTML = '';
  initGame();
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

document.getElementById('restartButton').addEventListener('click', restartGame);

document.addEventListener('keydown', (e) => {
  if (e.key === '?') handleInput('?');
  if (e.key === 'Enter') handleInput('GÖNDER');
  if (e.key === 'Backspace') handleInput('SİL');
  if (/^[A-Za-zÇĞİÖŞÜçğıöşü]$/.test(e.key)) {
    let upperKey = e.key === "i" ? "İ" : e.key === "ı" ? "I" : e.key.toUpperCase();
    handleInput(upperKey);
  }
});

document.addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});

initGame();