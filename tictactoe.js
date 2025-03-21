const board = document.querySelector('.board');
const status = document.querySelector('.status');
const resetButton = document.querySelector('.reset');
const modeSelect = document.getElementById('mode');

let currentPlayer = 'X';
let gameBoard = Array(9).fill(null);

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

function checkWinner(isFinalCheck = true) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      if (isFinalCheck) {
        status.textContent = gameBoard[a] === 'X' ? getMessage('playerXWins') : getMessage('playerOWins');
        board.removeEventListener('click', handleClick);
      }
      return gameBoard[a];
    }
  }
  if (!gameBoard.includes(null)) {
    if (isFinalCheck) status.textContent = getMessage('draw');
    return "draw";
  }
  return null;
}

function minimaxCheckWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (!board.includes(null)) return "draw";
  return null;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameBoard[index] && currentPlayer === 'X') {
    gameBoard[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    if (!checkWinner()) {
      currentPlayer = 'O';
      status.textContent = getMessage('computersTurn');
      setTimeout(computerMove, 500);
    }
  }
}

function computerMove() {
  let mode = modeSelect.value;
  let bestMove;
  if (mode === 'easy') {
    let emptyCells = gameBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  } else {
    bestMove = minimax(gameBoard, 'O').index;
  }

  if (bestMove !== undefined) {
    gameBoard[bestMove] = 'O';
    document.querySelector(`[data-index='${bestMove}']`).textContent = 'O';
    if (!checkWinner()) {
      currentPlayer = 'X';
      status.textContent = getMessage('playerXTurn');
      board.addEventListener('click', handleClick);
    }
  }
}

function minimax(newBoard, player) {
  const availableSpots = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);

  let winner = minimaxCheckWinner(newBoard);
  if (winner === 'X') return { score: -10 };
  if (winner === 'O') return { score: 10 };
  if (winner === 'draw') return { score: 0 };

  let moves = [];
  for (let i of availableSpots) {
    let move = { index: i };
    newBoard[i] = player;

    let result = minimax(newBoard, player === 'O' ? 'X' : 'O');
    move.score = result.score;

    newBoard[i] = null;
    moves.push(move);
  }

  let bestMove = player === 'O'
    ? moves.reduce((best, m) => (m.score > best.score ? m : best), { score: -Infinity })
    : moves.reduce((best, m) => (m.score < best.score ? m : best), { score: Infinity });

  return bestMove;
}

function resetGame() {
  gameBoard.fill(null);
  currentPlayer = 'X';
  status.textContent = getMessage('playerXTurn');
  board.innerHTML = '';
  createBoard();
  board.addEventListener('click', handleClick);
}

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    board.appendChild(cell);
  }
}

document.getElementById('initialMessage').addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});

createBoard();
board.addEventListener('click', handleClick);
resetButton.addEventListener('click', resetGame);
modeSelect.addEventListener('change', resetGame);

function getMessage(key) {
  const lang = navigator.language.startsWith('tr') ? 'tr' : 'en';
  const messages = {
    en: {
      initialMessage1: "Click the title <strong>(Tik Tak Too)</strong> to return to the main page.",
      initialMessage2: "Click anywhere to start the game.",
      playerXTurn: "Player X's Turn",
      computersTurn: "Computer's Turn",
      playerXWins: "🎉 Player X Wins!",
      playerOWins: "🎉 Player O Wins!",
      draw: "🤝 It's a Draw!",
      resetGame: "Reset Game",
      selectMode: "Select Mode:",
      easyMode: "Easy",
      hardMode: "Hard"
    },
    tr: {
      initialMessage1: "Ana sayfaya dönmek için başlığa <strong>(Tik Tak Too)</strong> tıklayınız.",
      initialMessage2: "Oyuna başlamak için herhangi bir yere tıklayınız.",
      playerXTurn: "Oyuncu X'in Sırası",
      computersTurn: "Bilgisayarın Sırası",
      playerXWins: "🎉 Oyuncu X Kazandı!",
      playerOWins: "🎉 Oyuncu O Kazandı!",
      draw: "🤝 Berabere!",
      resetGame: "Oyunu Sıfırla",
      selectMode: "Mod Seç:",
      easyMode: "Kolay",
      hardMode: "Zor"
    }
  };
  return messages[lang][key];
}

document.getElementById('initialMessageText1').innerHTML = getMessage('initialMessage1');
document.getElementById('initialMessageText2').textContent = getMessage('initialMessage2');
document.getElementById('statusMessage').textContent = getMessage('playerXTurn');
document.getElementById('resetButton').textContent = getMessage('resetGame');
document.getElementById('selectModeText').textContent = getMessage('selectMode');
document.getElementById('easyModeText').textContent = getMessage('easyMode');
document.getElementById('hardModeText').textContent = getMessage('hardMode');