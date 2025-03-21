import { questions } from 'https://sercankulcu.github.io/game/iqtest.js';

let currentQuestion = 0;
let score = 0;
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const resultDiv = document.getElementById('result');
const progressBar = document.getElementById('progress');

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

function loadQuestion() {
  const question = questions[currentQuestion];
  questionText.textContent = `${question.question}`;

  optionsContainer.innerHTML = '';
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option');
    button.addEventListener('click', () => selectOption(index));
    optionsContainer.appendChild(button);
  });

  updateProgressBar();
}

function selectOption(index) {
  const options = optionsContainer.children;
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove('selected');
  }
  const answerIndex = Array.from(optionsContainer.children).indexOf(options[index]);
  if (answerIndex === questions[currentQuestion].correctAnswer) {
    options[index].classList.add('selected');
    score++;
  } else {
    options[index].classList.add('wrong');
  }
  currentQuestion++;
  if (currentQuestion < questions.length) {
    setTimeout(loadQuestion, 500); // Wait 500ms before loading next question
  } else {
    showResult();
  }
}

function updateProgressBar() {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function showResult() {
  const iqScore = Math.round((score / questions.length) * 100) + 50;
  questionText.textContent = 'Test Tamamlandı!';
  optionsContainer.innerHTML = '';
  resultDiv.textContent = `IQ Skorunuz: ${iqScore}`;

  saveHighScore("Zeka Testi", iqScore);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'nameInput';
  nameInput.placeholder = 'Ad Soyad';
  nameInput.maxLength = 20; // Maksimum 20 karakter sınırı
  nameInput.style = 'display: block; margin: 10px auto; padding: 10px; width: 80%; border-radius: 5px; border: 1px solid #ccc; text-align: center;';

  const warningText = document.createElement('p');
  warningText.textContent = '';
  warningText.style = 'color: red; font-size: 12px; text-align: center; display: none;';

  const pdfButton = document.createElement('button');
  pdfButton.textContent = 'Raporunuzu İndirmek için Tıklayın';
  pdfButton.disabled = true;
  pdfButton.style = 'display: block; margin: 10px auto; padding: 10px; background-color: #d3d3d3; border: none; border-radius: 5px; cursor: not-allowed;';

  nameInput.addEventListener('input', () => {
    if (nameInput.value.length > 20) {
      warningText.textContent = 'Maximum 20 characters allowed!';
      warningText.style.display = 'block';
      nameInput.value = nameInput.value.substring(0, 20); // Fazla karakterleri kes
    } else {
      warningText.style.display = 'none';
    }

    if (nameInput.value.trim().length > 0) {
      pdfButton.disabled = false;
      pdfButton.style.backgroundColor = '#4CAF50';
      pdfButton.style.cursor = 'pointer';
    } else {
      pdfButton.disabled = true;
      pdfButton.style.backgroundColor = '#d3d3d3';
      pdfButton.style.cursor = 'not-allowed';
    }
  });

  pdfButton.addEventListener('click', () => generatePDF(iqScore, nameInput.value.trim() || "Anonymous"));

  resultDiv.appendChild(nameInput);
  resultDiv.appendChild(warningText);
  resultDiv.appendChild(pdfButton);
}

String.prototype.convertToEnglishUppercase = function () {
  const turkishChars = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  return this
    .split('')
    .map(char => turkishChars[char] || char)
    .join('')
    .toUpperCase();
}

function generatePDF(iqScore, name) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape'); // Set the document to landscape

  const img = new Image();
  img.src = 'https://sercankulcu.github.io/game/IQ_Certificate.png';

  img.onload = function () {
    const imgWidth = img.width;
    const imgHeight = img.height;

    const maxWidth = 297; // Landscape width
    const maxHeight = 210; // Landscape height

    const scaleFactor = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;

    doc.addImage(img, 'PNG', 0, 0, scaledWidth, scaledHeight);

    doc.setFontSize(32);
    doc.text(name.convertToEnglishUppercase(), 110, 100, null, null, 'center');
    doc.setFontSize(20);
    doc.text(`${iqScore}`, 140, 122, null, null, 'center');

    const formattedDate = new Date().toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' });

    doc.text(formattedDate, 140, 148, null, null, 'center');

    doc.text(new Date().toLocaleDateString('en-EN', { weekday: 'long' }), 135, 158, null, null, 'center');

    doc.save("iq_test_results.pdf");
  };
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

loadQuestion();