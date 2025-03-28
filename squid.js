const gameArea = document.getElementById('gameArea');
const doll = document.getElementById('doll');
const finishLine = document.getElementById('finishLine');
const redLightSound = document.getElementById('redLightSound');

let isGreen = false;
let gameRunning = false;
let intervalId;
let animationId;
let gameSpeed = 4500;
let playerSpeed = 1;
let numberOfPlayers = 5;

const controllablePlayerIndex = 0;

let players = [];

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

function toggleLight() {
    isGreen = !isGreen;
    doll.classList.toggle('red', !isGreen);
    doll.classList.toggle('green', isGreen);

    redLightSound.currentTime = 0;

    if (isGreen) {
        redLightSound.play();
        moveAutomaticPlayers();
    } else {
        redLightSound.pause();
    }
}

function createPlayers() {
    players.forEach(player => {
        const playerElement = document.getElementById(`player-${player.number}`);
        if (playerElement) {
            playerElement.remove();
        }
    });
    players = [];

    const playerImages = ['https://sercankulcu.github.io/game/squid/001.png',
        'https://sercankulcu.github.io/game/squid/067.png',
        'https://sercankulcu.github.io/game/squid/120.png',
        'https://sercankulcu.github.io/game/squid/230.png',
        'https://sercankulcu.github.io/game/squid/456.png'];
    let randomLeft = 30 - Math.random() * 60;
    for (let i = 0; i < numberOfPlayers; i++) {
        const player = document.createElement('div');
        player.classList.add('player');
        player.id = `player-${i + 1}`;
        player.style.backgroundImage = `url('${playerImages[i]}')`; // Oyuncu resmini ayarla
        const playerNumberDiv = document.createElement('div');
        playerNumberDiv.classList.add('player-number');
        playerNumberDiv.textContent = i + 1;
        player.appendChild(playerNumberDiv);
        gameArea.appendChild(player);
        randomLeft = i * ((gameArea.offsetWidth - 30) / numberOfPlayers);
        const randomBottom = Math.random() * 30;
        players.push({
            element: player,
            number: i + 1,
            left: randomLeft,
            bottom: randomBottom,
            winner: false,
            isControllable: i === controllablePlayerIndex,
            autoMoveTimeoutId: null,
            touchMoveIntervalId: null, // Yeni: Dokunmatik hareket aralığı ID'si
        });
        player.style.left = randomLeft + 'px';
        player.style.bottom = randomBottom + 'px';
    }
    let finishLineHeight = 5;
    finishLine.style.bottom = finishLineHeight + 'px';
}


function movePlayers(event) {
    if (isGreen && gameRunning) {
        const player = players[controllablePlayerIndex];
        if (!player.winner) {
            let currentLeft = parseInt(getComputedStyle(player.element).left);
            let currentBottom = parseInt(getComputedStyle(player.element).bottom);

            if (event.key === 'ArrowRight') {
                currentLeft += playerSpeed;
                if (currentLeft >= gameArea.offsetWidth - player.element.offsetWidth) {
                    currentLeft = gameArea.offsetWidth - player.element.offsetWidth
                }
            } else if (event.key === 'ArrowLeft') {
                currentLeft -= playerSpeed;
                if (currentLeft <= 0) {
                    currentLeft = 0;
                }
            } else if (event.key === 'ArrowUp') {
                currentBottom += playerSpeed;
                if (currentBottom >= gameArea.offsetHeight - player.element.offsetHeight) {
                    currentBottom = gameArea.offsetHeight - player.element.offsetHeight;
                    gameOver(true);
                    player.winner = true;
                    return;
                }
            }

            player.element.style.left = currentLeft + 'px';
            player.element.style.bottom = currentBottom + 'px';
        }
    } else if (gameRunning) {
        gameOver(false);
    }
}

function moveControllablePlayerUp() {
    if (isGreen && gameRunning) {
        const player = players[controllablePlayerIndex];
        if (!player.winner) {
            let currentBottom = parseInt(getComputedStyle(player.element).bottom);
            currentBottom += playerSpeed;
            if (currentBottom >= gameArea.offsetHeight - player.element.offsetHeight) {
                currentBottom = gameArea.offsetHeight - player.element.offsetHeight;
                gameOver(true);
                player.winner = true;
                return;
            }
            player.element.style.bottom = currentBottom + 'px';
        }
    } else if (gameRunning) {
        gameOver(false);
    }
}

gameArea.addEventListener('touchstart', (event) => {
    event.preventDefault();
    if (gameRunning && isGreen) {
        const player = players[controllablePlayerIndex];
        if (!player.winner && !player.touchMoveIntervalId) {
            player.touchMoveIntervalId = setInterval(moveControllablePlayerUp, 50); // Her 50ms'de hareket et
        }
    }
});

gameArea.addEventListener('mousedown', (event) => {
    event.preventDefault();
    if (gameRunning && isGreen) {
        const player = players[controllablePlayerIndex];
        if (!player.winner && !player.touchMoveIntervalId) {
            player.touchMoveIntervalId = setInterval(moveControllablePlayerUp, 50); // Her 50ms'de hareket et
        }
    }
});

gameArea.addEventListener('touchend', (event) => {
    event.preventDefault();
    const player = players[controllablePlayerIndex];
    if (player.touchMoveIntervalId) {
        clearInterval(player.touchMoveIntervalId);
        player.touchMoveIntervalId = null;
    }
});

gameArea.addEventListener('mouseup', (event) => {
    event.preventDefault();
    const player = players[controllablePlayerIndex];
    if (player.touchMoveIntervalId) {
        clearInterval(player.touchMoveIntervalId);
        player.touchMoveIntervalId = null;
    }
});

gameArea.addEventListener('click', (event) => {
    event.preventDefault();
    if (gameRunning && isGreen) {
        moveControllablePlayerUp();
    }
});

function moveAutomaticPlayers() {
    players.forEach(player => {
        if (!player.isControllable && !player.winner) {
            // Önceki aralığı temizle
            if (player.autoMoveIntervalId) {
                clearInterval(player.autoMoveIntervalId);
                player.autoMoveIntervalId = null;
            }

            if (isGreen && gameRunning && !player.winner) {
                const randomInterval = Math.random() * 2000 + 3000;
                const stepSize = 2 + Math.random() * 4;

                player.autoMoveIntervalId = setInterval(() => {
                    if (isGreen && gameRunning && !player.winner) {
                        let currentBottom = parseInt(getComputedStyle(player.element).bottom);

                        currentBottom += stepSize;

                        if (currentBottom >= gameArea.offsetHeight - player.element.offsetHeight) {
                            player.winner = true;
                            clearInterval(player.autoMoveIntervalId);
                            return;
                        }
                        player.element.style.bottom = currentBottom + 'px';
                    } else {
                        clearInterval(player.autoMoveIntervalId);
                        player.autoMoveIntervalId = null;
                    }
                }, randomInterval / 15); // Hareket aralığını bölerek daha sık adım atmasını sağla
            }
        } else if (player.isControllable && player.autoMoveIntervalId) {
            clearInterval(player.autoMoveIntervalId);
            player.autoMoveIntervalId = null;
        }
    });
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        document.body.classList.remove('game-over');
        isGreen = false;
        doll.classList.remove('red');
        doll.classList.add('green');
        createPlayers();
        intervalId = setInterval(toggleLight, gameSpeed);
        animationId = requestAnimationFrame(() => { });
    }
}

function gameOver(isWinner) {
    gameRunning = false;
    redLightSound.pause();
    clearInterval(intervalId);
    cancelAnimationFrame(animationId);
    document.body.classList.add('game-over');
    if (isWinner) {
        document.getElementById("winMessage").innerText = `Tebrikler!\nKazandınız!\n`;
        document.getElementById("winModal").style.display = "block";
    } else {
        document.getElementById("winMessage").innerText = `Kaybettiniz!\n`;
        document.getElementById("winModal").style.display = "block";
    }
    players.forEach(player => {
        if (player.autoMoveTimeoutId) {
            clearTimeout(player.autoMoveTimeoutId);
        }
        if (player.touchMoveIntervalId) {
            clearInterval(player.touchMoveIntervalId);
            player.touchMoveIntervalId = null;
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (gameRunning && (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'ArrowUp')) {
        movePlayers(event);
    }
});

document.getElementById('initialMessage').addEventListener('click', () => {
    document.getElementById('initialMessage').style.display = 'none';
    startGame();
});

document.getElementById("winModal").style.display = "none";

document.getElementById('winModal').addEventListener('click', () => {
    document.getElementById('winModal').style.display = "none";
    startGame();
});
