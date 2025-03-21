import { countries } from 'https://sercankulcu.github.io/game/flagquiz.js';

let score = 0;
let scoreDisplay = document.getElementById("score");
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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const browserLang = navigator.language || navigator.userLanguage;
if (browserLang.startsWith("tr")) {
  titleElement.textContent = "Ülkeyi Tahmin Et";
  scoreDisplay.textContent = "Skor: 0";
}

function loadFlagQuiz() {

  let correctCountry = countries[Math.floor(Math.random() * countries.length)];
  let flagContainer = document.getElementById("flag");

  const img = new Image();
  img.src = correctCountry.flag;
  img.onload = function () {
    const aspectRatio = img.width / img.height;
    flagContainer.style.aspectRatio = aspectRatio;
    flagContainer.style.backgroundImage = `url(${correctCountry.flag})`;
  };

  let incorrectCountries = shuffle(countries.filter(c => c.name !== correctCountry.name)).slice(0, 3);
  let options = shuffle([correctCountry, ...incorrectCountries]);

  let optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  options.forEach(country => {
    let button = document.createElement("button");
    button.textContent = browserLang.startsWith("tr") ? country.name : country.enName;

    button.onclick = () => {

      if (country.name === correctCountry.name) {
        score++;
        saveHighScore("Bayrak Testi", score);
        setTimeout(() => {
          loadFlagQuiz();
        }, 200);
      } else {
        score--;
        button.disabled = true;
      }
      scoreDisplay.textContent = browserLang.startsWith("tr") ? "Skor: " + score : "Score: " + score;
    };

    optionsContainer.appendChild(button);
  });
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

document.addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});

loadFlagQuiz();