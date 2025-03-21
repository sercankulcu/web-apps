let selectedSide = '';

const gameData = Object.assign({
    currentGold: 100,
    totalGames: 0,
    gamesWon: 0,
    gamesLost: 0
}, JSON.parse(localStorage.getItem('dorukdayimflipcoinData') || '{}'));

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

function updateDisplay() {
    document.getElementById('currentGold').textContent = gameData.currentGold;
    document.getElementById('totalGames').textContent = gameData.totalGames;
    document.getElementById('gamesWon').textContent = gameData.gamesWon;
    document.getElementById('gamesLost').textContent = gameData.gamesLost;
}

function selectSide(side) {
    selectedSide = side;

    document.getElementById('yaziButton').classList.remove('selected');
    document.getElementById('turaButton').classList.remove('selected');

    if (side === 'yazi') {
        document.getElementById('result').textContent = 'Yazı seçildi.';
        document.getElementById('yaziButton').classList.add('selected');
    } else if (side === 'tura') {
        document.getElementById('result').textContent = 'Tura seçildi.';
        document.getElementById('turaButton').classList.add('selected');
    }
}

function playGame() {
    const amount = parseInt(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0 || amount > gameData.currentGold) {
        document.getElementById('result').textContent = 'Geçersiz miktar!';
        document.getElementById('amount').value = 0;
        return;
    }

    const coin = document.getElementById('coin');
    coin.classList.add('flip');

    setTimeout(() => {
        const result = Math.random() < 0.5 ? 'yazi' : 'tura';
        coin.classList.remove('flip');
        coin.style.transform = `rotateY(${result === 'tura' ? 180 : 0}deg)`;

        gameData.totalGames++;
        if (result === selectedSide) {
            gameData.currentGold += amount;
            gameData.gamesWon++;
            saveHighScore("Yazı Tura", gameData.currentGold);
            document.getElementById('result').textContent = '🏆 ' + amount + ' altın kazandınız!';
        } else {
            gameData.currentGold -= amount;
            gameData.gamesLost++;
            document.getElementById('result').textContent = '💔 ' + amount + ' altın kaybettiniz!';
        }

        localStorage.setItem('dorukdayimflipcoinData', JSON.stringify(gameData));
        document.getElementById("playButton").disabled = false;
        updateDisplay();
    }, 1000);
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

function resetGame() {
    gameData.currentGold = 100;
    gameData.totalGames = 0;
    gameData.gamesWon = 0;
    gameData.gamesLost = 0;
    localStorage.setItem('dorukdayimflipcoinData', JSON.stringify(gameData));
    updateDisplay();
    document.getElementById('result').textContent = 'Oyun sıfırlandı.';
    document.getElementById('coin').style.transform = 'rotateY(0deg)';
}

document.addEventListener('click', () => {
    document.getElementById('initialMessage').style.display = 'none';
});

document.getElementById("yaziButton").addEventListener("click", function () {
    selectSide("yazi");
});

document.getElementById("turaButton").addEventListener("click", function () {
    selectSide("tura");
});

document.getElementById("playButton").addEventListener("click", function () {
    playGame();
});

document.getElementById("resetButton").addEventListener("click", function () {
    resetGame();
});

window.onload = () => {
    selectSide('yazi');
};

updateDisplay();