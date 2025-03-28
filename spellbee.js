import { wordsSevenLetters as words, allwordsSevenLetters } from 'https://sercankulcu.github.io/game/words-seven-letters.js';
import { allwordsSixLetters } from 'https://sercankulcu.github.io/game/words-six-letters.js';
import { allwordsFiveLetters } from 'https://sercankulcu.github.io/game/words-five-letters.js';
import { allwordsFourLetters } from 'https://sercankulcu.github.io/game/words-four-letters.js';

const allwords = allwordsFourLetters.concat(allwordsFiveLetters, allwordsSixLetters, allwordsSevenLetters);
let selectedWord = '';
let letters = '';
let centerLetter = '';
let currentWord = '';
let score = 0;

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

const scoreElement = document.getElementById('score');

function initialize() {
  selectedWord = words[Math.floor(Math.random() * words.length)]; // Rastgele kelime seç
  letters = selectedWord.split(""); // Harfleri diziye çevir (tekrarları kaldırmadan)
  letters = shuffleArray(letters); // Harfleri rastgele sırala
  centerLetter = letters[Math.floor(Math.random() * letters.length)]; // Rastgele merkez harfi seç
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createHive() {

  const hive = document.querySelector('.hive');
  hive.innerHTML = '';

  const positions = ['pos1', 'pos2', 'pos3', 'pos4', 'pos5', 'pos6'];
  let posIndex = 0;

  let centerLetterAssigned = false;

  letters.forEach(letter => {
    const div = document.createElement('div');
    div.className = 'letter';
    if (letter === centerLetter && !centerLetterAssigned) {
      centerLetterAssigned = true;
      div.classList.add('center');
    } else {
      div.classList.add(positions[posIndex]);
      posIndex++;
    }
    div.textContent = letter;
    div.onclick = function () {
      addLetter(letter, div);
    };
    hive.appendChild(div);
  });
}

function addLetter(letter, element) {

  currentWord += letter;
  document.getElementById('word').textContent = currentWord;
  element.style.pointerEvents = "none";
  element.style.opacity = "0.5";
}

function submitWord() {
  const message = document.getElementById('word');
  if (currentWord.length < 4) {
    message.textContent = '🚫 Kelime en az 4 harfli olmalıdır.';
  } else if (!currentWord.includes(centerLetter)) {
    message.textContent = '⚠️ Kelime merkez harfi içermelidir.';
  } else if (currentWord === selectedWord) {
    message.textContent = `🎉 Kazandınız!\n "${currentWord}" doğru kelime!`;
    score += currentWord.length;
    updateScore();
    setTimeout(startNewGame, 2000);
  } else if (allwords.includes(currentWord)) {
    message.textContent = `👏 Tebrikler!\n "${currentWord}" geçerli bir kelime.`;
    score += currentWord.length;
    updateScore();
    setTimeout(startNewGame, 2000);
  } else {
    message.textContent = `😔 Üzgünüm!\n "${currentWord}" geçerli bir kelime değil!`;
  }
  currentWord = '';

  document.querySelectorAll('.letter').forEach(letter => {
    letter.style.pointerEvents = "auto";
    letter.style.opacity = "1";
  });
}

function updateScore() {
  scoreElement.textContent = `Skor: ${score}`;
  saveHighScore("Bal Peteği", score);
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

function shuffleLetters() {
  letters.sort(() => Math.random() - 0.5);
  createHive();

  currentWord = '';
  document.getElementById('word').textContent = '.';

  document.querySelectorAll('.letter').forEach(letter => {
    letter.style.pointerEvents = "auto";
    letter.style.opacity = "1";
  });
}

function startNewGame() {
  initialize(); // Reset game state
  createHive(); // Recreate the hive with new letters
  currentWord = ''; // Clear current word
  document.getElementById('word').textContent = '.'; // Reset display
  document.querySelectorAll('.letter').forEach(letter => {
    letter.style.pointerEvents = "auto";
    letter.style.opacity = "1";
  });
}

document.getElementById('newGameBtn').addEventListener('click', startNewGame);
document.getElementById('shuffleBtn').addEventListener('click', shuffleLetters);
document.getElementById('submitBtn').addEventListener('click', submitWord);

document.addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});

initialize();
createHive();
updateScore();