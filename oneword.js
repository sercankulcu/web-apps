import { words } from 'https://sercankulcu.github.io/game/birkelimewords.js';

let score = 0;
let letters = [];
let timer;
let timeLeft = 30;
let isValidTDK = true;
let foundWords = [];

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

function generateLetters() {
  // Weighted pools of frequently used letters in Turkish
  const vowels = [
    'A', 'A', 'A', 'E', 'E', 'E', 'İ', 'İ', 'İ', // Very common
    'I', 'I', 'O', 'O', 'U', 'U',             // Moderately common
    'Ö', 'Ü'                                  // Less common
  ];
  const consonants = [
    'N', 'N', 'N', 'R', 'R', 'R', 'L', 'L', 'L', 'K', 'K', 'K', 'T', 'T', 'T', 'S', 'S', 'S', 'M', 'M', 'M', // Very common
    'B', 'B', 'D', 'D', 'Y', 'Y', 'P', 'P', 'C', 'C', 'Ç', 'Ç', 'Ş', 'Ş',           // Moderately common
    'F', 'G', 'H', 'V', 'Z', 'Ğ', 'J'                                       // Less common
  ];

  // 3 sesli + 4 sessiz harf
  let newLetters = [
    ...vowels.sort(() => 0.5 - Math.random()).slice(0, 3),
    ...consonants.sort(() => 0.5 - Math.random()).slice(0, 4)
  ].sort(() => 0.5 - Math.random());

  return newLetters;
}

function updateLetters() {
  const container = document.getElementById('letters');
  container.innerHTML = '';
  letters.forEach(letter => {
    const div = document.createElement('div');
    div.className = 'letter';
    div.textContent = letter;
    div.addEventListener('click', () => appendLetter(letter)); // Add click handler
    container.appendChild(div);
  });
  foundWords = [];
}

function appendLetter(letter) {
  const input = document.getElementById('wordInput');
  if (input.value.length < input.maxLength) { // Respect maxlength="6"
    input.value += letter;
  }
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 30;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `Süre: ${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      letters = generateLetters();
      updateLetters();
      startTimer();
    }
  }, 1000);
}

function checkDictionary(word) {

  isValidTDK = false;
  if (words.includes(word.turkishToLower()) && !foundWords.includes(word)) {
    isValidTDK = true;
    foundWords.push(word);
  }
}

function checkTDK(word) {

  isValidTDK = false;
  fetch("https://sozluk.gov.tr/gts?ara=" + word)
    .then((response) => response.json())
    .then((json) => {
      if (json.length != undefined) {
        isValidTDK = true;
      } else {
        isValidTDK = false;
      }
    })
    .catch(error => console.error(error.message));
}

String.prototype.turkishToUpper = function () {
  var string = this;
  var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
  string = string.replace(/(([iışğüçö]))/g, function (letter) { return letters[letter]; })
  return string.toUpperCase();
}

String.prototype.turkishToLower = function () {
  var string = this;
  var letters = { "İ": "i", "I": "ı", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç" };
  string = string.replace(/(([İIŞĞÜÇÖ]))+/g, function (letter) { return letters[letter]; })
  return string.toLowerCase();
}

async function checkWord() {

  let isValid = true;
  const input = document.getElementById('wordInput').value;
  const backupInput = input.turkishToUpper();
  const tempLetters = [...letters];

  for (let char of backupInput) {
    const index = tempLetters.indexOf(char);
    if (index === -1) {
      isValid = false;
      break;
    }
    tempLetters.splice(index, 1);
  }

  if (isValid) {
    try {
      isValidTDK = true;
      await checkDictionary(input);
      //await checkTDK(input); 
      //await new Promise(resolve => setTimeout(resolve, 1000)); 
    } catch (error) {
      isValidTDK = false;
    }
  }

  if (isValidTDK && input.length >= 2) {
    score += input.length * 10;
    document.getElementById('score').textContent = `Puan: ${score}`;
    showMessage(`+${input.length * 10} puan kazandınız!`, 'green');
  } else {
    showMessage('Geçersiz kelime!', 'red');
  }
  document.getElementById('wordInput').value = '';
}

function showMessage(text, color) {
  const messageDiv = document.getElementById('message');
  let emojiText = color === 'green' ? `🎉 ${text}` : `❌ ${text}`;
  messageDiv.textContent = emojiText;
  messageDiv.style.color = color;
  setTimeout(() => messageDiv.textContent = '', 2000);
}

function newGame() {
  score = 0;
  document.getElementById('score').textContent = `Puan: ${score}`;
  document.getElementById('wordInput').value = '';
  letters = generateLetters();
  updateLetters();
  startTimer();
}

document.addEventListener('keydown', (event) => {
  const key = event.key.turkishToUpper();
  const input = document.getElementById('wordInput');

  if (letters.includes(key) && input.value.length < input.maxLength) {
    input.value += key; 
    event.preventDefault(); 
  } else if (event.key === 'Enter') {
    event.preventDefault();
    checkWord();
  } else if (event.key === 'Backspace') {
    input.value = input.value.slice(0, -1); // Remove the last character
    event.preventDefault();
  }
});

document.getElementById('checkButton').addEventListener('click', checkWord);

document.addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});

newGame();