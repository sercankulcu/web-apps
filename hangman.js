import { words } from 'https://sercankulcu.github.io/game/hangman/hangmanwords.js';

const messages = {
  tr: { win: 'Tebrikler!\nKazandınız!', lose: 'Kaybettiniz!\nDoğru kelime:', title: 'Adam Asmaca', score: 'Skor' },
  en: { win: 'Congratulations! You won!', lose: 'You lost! The correct word was:', title: 'Hangman', score: 'Score' },
  de: { win: 'Herzlichen Glückwunsch! Sie haben gewonnen!', lose: 'Sie haben verloren! Das richtige Wort war:', title: 'Galgenmännchen', score: 'Punktestand' },
  fr: { win: 'Félicitations ! Vous avez gagné!', lose: 'Vous avez perdu ! Le mot correct était:', title: 'Le jeu du pendu', score: 'Score' },
  es: { win: '¡Felicidades! ¡Has ganado!', lose: '¡Has perdido! La palabra correcta era:', title: 'Ahorcado', score: 'Puntuación' },
  ru: { win: 'Поздравляем! Вы выиграли!', lose: 'Вы проиграли! Правильное слово:', title: 'Виселица', score: 'Счёт' }
};

const keyboards = {
  tr: ['ABCÇDEFGĞ', 'HIİJKLMNOÖ', 'PRSŞTUÜVYZ'],
  en: ['ABCDEFGHI', 'JKLMNOPQR', 'STUVWXYZ'],
  de: ['ABCDEFGHIJ', 'KLMNOPQRST', 'UVWXYZÄÖÜß'],
  fr: ['ABCDEFGHI', 'JKLMNOPQR', 'STUVWXYZ'],
  es: ['ABCDEFGHI', 'JKLMNÑOPQ', 'RSTUVWXYZ'],
  ru: ['АБВГДЕЁЖЗ', 'ИЙКЛМНОПР', 'СТУФХЦЧШЩ', 'ЪЫЬЭЮЯ']
};

let currentLang = 'tr';
let word = '';
let guessedLetters = [];
let remainingGuesses = 6;
let score = 0;

const wordElement = document.getElementById('word');
const messageElement = document.getElementById('message');
const hangmanImage = document.getElementById('hangman-image');
const flags = document.querySelectorAll('.flag');
const keyboardElement = document.getElementById('keyboard');
const scoreElement = document.getElementById('score');

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

function chooseWord() {
  return words[currentLang][Math.floor(Math.random() * words[currentLang].length)];
}

function updateWordDisplay() {
  wordElement.textContent = word.split('').map(letter =>
    guessedLetters.includes(letter) ? letter : '_'
  ).join(' ');
}

function updateHangmanImage() {
  if (remainingGuesses < 0) {
    remainingGuesses = 0;
  }
  hangmanImage.src = `https://sercankulcu.github.io/game/hangman/hangman-${6 - remainingGuesses}.png`;
}

function checkWin() {
  if (word.split('').every(letter => guessedLetters.includes(letter))) {
    messageElement.textContent = messages[currentLang].win;
    score += word.length;
    updateScore();
    disableKeyboard();
  }
}

function checkLoss() {
  if (remainingGuesses === 0) {
    messageElement.textContent = `${messages[currentLang].lose} ${word}`;
    disableKeyboard();
  }
}

function initGame() {
  word = chooseWord();
  guessedLetters = [];
  remainingGuesses = 6;
  updateWordDisplay();
  updateHangmanImage();
  messageElement.textContent = '';
  enableKeyboard();
}

function makeGuess(letter) {
  if (!guessedLetters.includes(letter)) {
    guessedLetters.push(letter);
    if (!word.includes(letter)) {
      remainingGuesses--;
      updateHangmanImage();
    }
    const keys = keyboardElement.querySelectorAll('.key');
    keys.forEach(key => {
      if (key.textContent == letter) {
        key.disabled = true;
      }
    });
    updateWordDisplay();
    checkWin();
    checkLoss();
  }
}

function createKeyboard() {
  keyboardElement.innerHTML = '';
  keyboards[currentLang].forEach((row, index) => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('keyboard-row');
    row.split('').forEach(letter => {
      const key = document.createElement('button');
      key.textContent = letter;
      key.classList.add('key');
      key.addEventListener('click', () => makeGuess(letter));
      rowElement.appendChild(key);
    });
    keyboardElement.appendChild(rowElement);
  });
}

function enableKeyboard() {
  const keys = keyboardElement.querySelectorAll('.key');
  keys.forEach(key => key.disabled = false);
}

function disableKeyboard() {
  const keys = keyboardElement.querySelectorAll('.key');
  keys.forEach(key => key.disabled = true);
  setTimeout(initGame, 3000);
}

function updateScore() {
  scoreElement.textContent = messages[currentLang].score + `: ${score}`;
  saveHighScore("Adam Asmaca", score);
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

flags.forEach(flag => {
  flag.addEventListener('click', () => {
    currentLang = flag.dataset.lang;
    flags.forEach(f => f.classList.remove('selected'));
    flag.classList.add('selected');
    titleElement.textContent = messages[currentLang].title;
    scoreElement.textContent = messages[currentLang].score + `: ${score}`;;
    createKeyboard();
    initGame();
  });
});

String.prototype.turkishToUpper = function () {
  var string = this;
  var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
  string = string.replace(/(([iışğüçö]))/g, function (letter) { return letters[letter]; })
  return string.toUpperCase();
}

document.addEventListener('keydown', (event) => {
  const letter = event.key.turkishToUpper();
  if (keyboards[currentLang].join('').includes(letter)) {
    makeGuess(letter);
  }
});

document.addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});

createKeyboard();
initGame();
updateScore();