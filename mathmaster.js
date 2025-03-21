let currentQuestion, correctAnswer, score = 0, timer = 300, firstAppend = 1;
let timerInterval;
const operations = ['+', '-', '*', '/'];

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

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, question, answer;

    switch (operation) {
        case '+':
            num1 = getRandomNumber(1, 100);
            num2 = getRandomNumber(1, 100);
            question = `${num1}<br>+<br>${num2}<br>=<br>`;
            answer = num1 + num2;
            break;
        case '-':
            num1 = getRandomNumber(1, 100);
            num2 = getRandomNumber(1, num1);
            question = `${num1}<br>-<br>${num2}<br>=<br>`;
            answer = num1 - num2;
            break;
        case '*':
            num1 = getRandomNumber(1, 9);
            num2 = getRandomNumber(1, 100);
            question = `${num1}<br>×<br>${num2}<br>=<br>`;
            answer = num1 * num2;
            break;
        case '/':
            answer = getRandomNumber(1, 10);
            num1 = getRandomNumber(1, 10);
            num2 = num1 * answer;
            question = `${num2}<br>÷<br>${num1}<br>=<br>`;
            break;
    }

    currentQuestion = question;
    correctAnswer = Math.floor(answer);
    document.getElementById('question').innerHTML = question;
}

function startGame() {
    score = 0;
    timer = 300;
    firstAppend = 1;
    updateDigitalDisplay('score-display', score);
    updateTimer();
    timerInterval = setInterval(() => {
        timer--;
        if (timer == 0) endGame();
        updateTimer();
    }, 1000);
    generateQuestion();
    document.getElementById('answer').innerText = '?';
    document.getElementById('modal').style.display = 'none';
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('answer').innerText);
    if (userAnswer === correctAnswer) {
        score++;
        updateDigitalDisplay('score-display', score);
        document.getElementById('answer').innerText = '?';
        firstAppend = 1;
        generateQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(timerInterval);
    updateHighScores(score);
    saveHighScore("Matemat Usta", score);
    document.getElementById('modal').style.display = 'block';
    document.getElementById('finalScore').textContent = `Skorunuz: ${score}`;
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

function updateHighScores(newScore) {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString()
        .padStart(2, '0')}-${now.getDate().toString()
            .padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString()
                .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    let highScores = JSON.parse(localStorage.getItem('matematustahighScores')) || [];
    highScores.push({ score: newScore, date: formattedDate });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5); // İlk 5 skoru tutar
    localStorage.setItem('matematustahighScores', JSON.stringify(highScores));
    displayHighScores();
}

function displayHighScores() {
    const highScores = JSON.parse(localStorage.getItem('matematustahighScores')) || [];
    const tableBody = document.getElementById('scoreTable');
    tableBody.innerHTML = '<tr><th>Sıra</th><th>Skor</th><th>Tarih ve Saat</th></tr>';
    for (let i = 0; i < highScores.length; i++) {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = i + 1;
        row.insertCell(1).textContent = highScores[i].score;
        row.insertCell(2).textContent = highScores[i].date; // Tarih ve saat bilgisi eklenir
    }
}

function updateDigitalDisplay(elementId, value) {
    document.getElementById(elementId).textContent = value.toString().padStart(4, '0');
}

function updateTimer() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    document.getElementById('timer-display').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function appendNumber(number) {
    let currentAnswer = document.getElementById('answer').innerText;

    if (firstAppend === 1) {
        currentAnswer = '';
        firstAppend = 0;
    }

    let newAnswer = currentAnswer + number;

    if (parseInt(newAnswer) <= 10000) {
        document.getElementById('answer').innerText = newAnswer;
    }
}

function backspaceAnswer() {
    let answer = document.getElementById('answer').innerText;
    answer = answer.slice(0, -1);
    if (answer === '') {
        document.getElementById('answer').innerText = '?';
        firstAppend = 1;
    } else {
        document.getElementById('answer').innerText = answer;
    }
}

document.querySelectorAll("button[data-number]").forEach(button => {
    button.addEventListener("click", () => appendNumber(button.dataset.number));
});

document.getElementById("backspace-button").addEventListener("click", backspaceAnswer);
document.getElementById("submit-button").addEventListener("click", checkAnswer);

document.getElementById('initialMessage').addEventListener('click', () => {
    document.getElementById('initialMessage').style.display = 'none';
});

startGame();