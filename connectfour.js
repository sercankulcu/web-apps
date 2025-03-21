const ROWS = 6;
const COLS = 7;
const WIN_LENGTH = 4;

const board = document.getElementById('board');
const message = document.getElementById('message');
const difficultySelect = document.getElementById('difficultySelect');
let gameBoard = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let currentPlayer = 1;
let gameOver = false;

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

function createBoard() {
  gameBoard = Array(ROWS).fill().map(() => Array(COLS).fill(0));
  currentPlayer = 1;
  gameOver = false;
  board.innerHTML = '';
  for (let row = 5; row >= 0; row--) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.col = col;
      board.appendChild(cell);
    }
  }
}

function dropPiece(col) {
  if (gameOver) return;
  for (let row = 0; row < ROWS; row++) {
    if (gameBoard[row][col] === 0) {
      gameBoard[row][col] = currentPlayer;
      updateBoard();
      if (checkWin(row, col)) {
        gameOver = true;
        message.textContent = currentPlayer === 1 ? "Kazandın!" : "Bilgisayar kazandı!";
        setTimeout(() => {
          document.getElementById('initialMessage').style.display = 'block';
        }, 2000);
      } else if (checkDraw()) {
        gameOver = true;
        message.textContent = "Berabere!";
        setTimeout(() => {
          document.getElementById('initialMessage').style.display = 'block';
        }, 2000);
      } else {
        currentPlayer = 3 - currentPlayer;
        if (currentPlayer === 2) {
          setTimeout(computerMove, 500);
        } else {
          message.textContent = "Sıra sende!";
        }
      }
      return;
    }
  }
}

function updateBoard() {
  const cells = document.querySelectorAll('.cell');
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = (5 - row) * COLS + col;
      cells[index].className = 'cell' + (gameBoard[row][col] === 1 ? ' red' : gameBoard[row][col] === 2 ? ' yellow' : '');
    }
  }
}

function checkWin(row, col) {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let [dx, dy] of directions) {
    let count = 1;
    for (let i = 1; i <= 3; i++) {
      const newRow = row + i * dx;
      const newCol = col + i * dy;
      if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS || gameBoard[newRow][newCol] !== currentPlayer) break;
      count++;
    }
    for (let i = 1; i <= 3; i++) {
      const newRow = row - i * dx;
      const newCol = col - i * dy;
      if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS || gameBoard[newRow][newCol] !== currentPlayer) break;
      count++;
    }
    if (count >= WIN_LENGTH) return true;
  }
  return false;
}

function checkDraw() {
  return gameBoard.every(row => row.every(cell => cell !== 0));
}

function evaluateBoard(board) {
  let score = 0;
  // Horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < WIN_LENGTH; col++) {
      score += evaluateWindow(board[row].slice(col, col + WIN_LENGTH));
    }
  }
  // Vertical
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < 3; row++) {
      const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
      score += evaluateWindow(window);
    }
  }
  // Diagonal (positive slope)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < WIN_LENGTH; col++) {
      const window = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
      score += evaluateWindow(window);
    }
  }
  // Diagonal (negative slope)
  for (let row = 3; row < ROWS; row++) {
    for (let col = 0; col < WIN_LENGTH; col++) {
      const window = [board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3]];
      score += evaluateWindow(window);
    }
  }
  return score;
}

function evaluateWindow(window) {
  const computerCount = window.filter(cell => cell === 2).length;
  const playerCount = window.filter(cell => cell === 1).length;
  const emptyCount = window.filter(cell => cell === 0).length;

  if (computerCount === WIN_LENGTH) return 100;
  if (playerCount === WIN_LENGTH) return -100;
  if (computerCount === 3 && emptyCount === 1) return 5;
  if (playerCount === 3 && emptyCount === 1) return -5;
  if (computerCount === 2 && emptyCount === 2) return 2;
  if (playerCount === 2 && emptyCount === 2) return -2;
  return 0;
}

function minimax(board, depth, alpha, beta, isMaximizing) {
  if (depth === 0) return evaluateBoard(board);

  const validColumns = getValidColumns(board);
  if (validColumns.length === 0) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let col of validColumns) {
      const row = getNextOpenRow(board, col);
      board[row][col] = 2;
      const eval = minimax(board, depth - 1, alpha, beta, false);
      board[row][col] = 0;
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let col of validColumns) {
      const row = getNextOpenRow(board, col);
      board[row][col] = 1;
      const eval = minimax(board, depth - 1, alpha, beta, true);
      board[row][col] = 0;
      minEval = Math.min(minEval, eval);
      beta = Math.min(beta, eval);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getValidColumns(board) {
  return board[5].map((cell, index) => cell === 0 ? index : null).filter(col => col !== null);
}

function getNextOpenRow(board, col) {
  for (let row = 0; row < ROWS; row++) {
    if (board[row][col] === 0) return row;
  }
  return -1;
}

function computerMove() {
  if (gameOver) return;
  let bestScore = -Infinity;
  let bestCol = 0;
  const validColumns = getValidColumns(gameBoard);

  const difficulty = difficultySelect.value;
  const depth = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 5;

  for (let col of validColumns) {
    const row = getNextOpenRow(gameBoard, col);
    gameBoard[row][col] = 2;
    let score = minimax(gameBoard, depth, -Infinity, Infinity, false);
    gameBoard[row][col] = 0;
    if (score > bestScore) {
      bestScore = score;
      bestCol = col;
    }
  }
  dropPiece(bestCol);
}

board.addEventListener('click', (e) => {
  if (gameOver || currentPlayer !== 1) return;

  let rect = board.getBoundingClientRect();
  let clickX = e.clientX - rect.left;

  let colWidth = rect.width / COLS;
  let col = Math.floor(clickX / colWidth);

  dropPiece(col);
});

difficultySelect.addEventListener('click', (e) => {
  e.stopPropagation();
});

document.getElementById('initialMessage').addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
  createBoard();
});