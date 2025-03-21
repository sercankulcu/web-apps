import { questions, prizes } from 'https://sercankulcu.github.io/game/millionaire.js';

let currentQuestion = 0;
let usedLifelines = [];

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

const fiftyFifty = document.getElementById('fiftyFifty');
const phoneAFriend = document.getElementById('phoneAFriend');
const audiencePoll = document.getElementById('audiencePoll');

function initializeGame() {
  if (isSoundOn) {
    soundToggle.textContent = "🔇";
  } else {
    soundToggle.textContent = "🔊";
  }
  showQuestion();
  updatePrizeDisplay();
}

function getRandomQuestion(level) {
  const filteredQuestions = questions.filter(q => q.level === level);
  return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
}

let q;

function showQuestion() {
  q = getRandomQuestion(currentQuestion + 1); // Level 1'den başlıyor
  document.getElementById('question').textContent = q.question;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  q.options.forEach((option, index) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.textContent = `${['A', 'B', 'C', 'D'][index]}) ${option}`;
    div.onclick = () => checkAnswer(index, q.correct);
    optionsDiv.appendChild(div);
  });
}

function showMessage(message, type) {
  const messageBox = document.getElementById('messageBox');
  messageBox.textContent = message;
  messageBox.style.background = type === 'error' ? '#f44336' : '#4CAF50';
  messageBox.style.display = 'block';

  setTimeout(() => {
    messageBox.style.display = 'none';
  }, 5000); // Hide after 4 seconds
}

function checkAnswer(selected, correct) {
  const options = document.getElementsByClassName('option');

  if (selected === correct) {
    options[selected].style.background = '#4CAF50';
    if (isSoundOn) correctSound.play();

    setTimeout(() => {
      if (currentQuestion < prizes.length - 1) {
        currentQuestion++;
        showQuestion();
        updatePrizeDisplay();
      }
    }, 1000);

    if (currentQuestion == prizes.length - 1) {
      showMessage('Tebrikler! 1.000.000 TL Kazandınız!');
      setTimeout(() => {
        location.reload();
      }, 5000);
    }
  } else {
    options[selected].style.background = '#f44336';
    options[correct].style.background = '#4CAF50';
    showMessage(`Yanlış cevap! Kazandığınız tutar: ${prizes[Math.floor(currentQuestion / 3)]}`);
    if (isSoundOn) wrongSound.play();
    setTimeout(() => {
      location.reload();
    }, 5000);
  }
}

function useFiftyFifty(button) {
  if (usedLifelines.includes('fiftyFifty')) return;

  button.style.pointerEvents = "none";  // Tıklanamaz hale getir
  button.style.opacity = "0.5";  // Butonu soluklaştır

  const wrongOptions = q.options
    .map((_, i) => i)
    .filter(i => i !== q.correct)
    .slice(0, 2);

  document.querySelectorAll('.option').forEach((opt, index) => {
    if (wrongOptions.includes(index)) {
      opt.style.display = 'none';
    }
  });

  usedLifelines.push('fiftyFifty');
}

function usePhoneAFriend(button) {
  if (usedLifelines.includes('phoneAFriend')) return;

  button.style.pointerEvents = "none";  // Tıklanamaz hale getir
  button.style.opacity = "0.5";  // Butonu soluklaştır

  const friendAnswers = [
    "Bence doğru cevap %%% olmalı",
    "Emin değilim ama sanırım %%%",
    "Kesinlikle %%% diye düşünüyorum"
  ];

  const answer = friendAnswers[Math.floor(Math.random() * friendAnswers.length)]
    .replace('%%%', ['A', 'B', 'C', 'D'][q.correct]);

  showMessage(`Arkadaşınız: "${answer}"`);
  usedLifelines.push('phoneAFriend');
}

function useAudiencePoll(button) {
  if (usedLifelines.includes('audiencePoll')) return;

  button.style.pointerEvents = "none";  // Tıklanamaz hale getir
  button.style.opacity = "0.5";  // Butonu soluklaştır

  const percentages = Array(4).fill().map(() => Math.random() * 30);
  percentages[q.correct] += 40;

  const total = percentages.reduce((a, b) => a + b);
  const result = percentages.map(p => Math.round((p / total) * 100));

  showMessage(`Seyirci oyu:\nA) %${result[0]}\nB) %${result[1]}\nC) %${result[2]}\nD) %${result[3]}`);
  usedLifelines.push('audiencePoll');
}

function updatePrizeDisplay() {
  const prizeDisplay = document.getElementById('prizeDisplay');
  prizeDisplay.textContent = `Şu anki ödül: ${prizes[currentQuestion]}`;
}

let isSoundOn = localStorage.getItem("isSoundOnMilyoner") === "true";
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const soundToggle = document.getElementById("soundToggle");

soundToggle.addEventListener("click", () => {
  isSoundOn = !isSoundOn;
  if (isSoundOn) {
    soundToggle.textContent = "🔇";
  } else {
    soundToggle.textContent = "🔊";
  }
  localStorage.setItem("isSoundOnMilyoner", isSoundOn);
});

fiftyFifty.addEventListener('click', function () {
  useFiftyFifty(this);
});

phoneAFriend.addEventListener('click', function () {
  usePhoneAFriend(this);
});

audiencePoll.addEventListener('click', function () {
  useAudiencePoll(this);
});

document.addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});

initializeGame();