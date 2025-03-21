const GRID_SIZE = 9;
const MINE_COUNT = 10;

let grid = [];
let mineLocations = [];
let gameOver = false;
let timerInterval;
let timeElapsed = 0;
let flagCount = 0;
let flagMode = false;

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

function initializeGrid() {
  grid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      };
    }
  }
}

function placeMines() {
  mineLocations = [];
  let minesPlaced = 0;
  while (minesPlaced < MINE_COUNT) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    if (!grid[row][col].isMine) {
      grid[row][col].isMine = true;
      mineLocations.push([row, col]);
      minesPlaced++;
    }
  }
}

function calculateNeighborMines() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col].isMine) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (row + i >= 0 && row + i < GRID_SIZE && col + j >= 0 && col + j < GRID_SIZE) {
              if (grid[row + i][col + j].isMine) count++;
            }
          }
        }
        grid[row][col].neighborMines = count;
      }
    }
  }
}

function renderGrid() {
  const gridElement = document.getElementById('grid');
  gridElement.innerHTML = '';
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleCellClick);
      cell.addEventListener('contextmenu', handleRightClick);
      gridElement.appendChild(cell);
    }
  }
}

function handleCellClick(event) {
  if (gameOver) return;
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  if (flagMode) {
    toggleFlag(row, col);
  } else {
    revealCell(row, col);
  }
}

function handleRightClick(event) {
  event.preventDefault();
  if (gameOver) return;
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  toggleFlag(row, col);
}

function revealCell(row, col) {

  if (!timerInterval && !gameOver) { // Start timer on first click
    timerInterval = setInterval(() => {
      timeElapsed++;
      updateTimer();
    }, 1000);
  }

  if (grid[row][col].isRevealed || grid[row][col].isFlagged) return;

  grid[row][col].isRevealed = true;
  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  cell.classList.add('revealed');

  if (grid[row][col].isMine) {
    gameOver = true;
    cell.classList.add('mine');
    cell.textContent = '💣';
    revealAllMines();
    document.getElementById('reset').textContent = '😵';
    document.getElementById("winMessage").innerText = `Maalesef!\nKaybettiniz!\n`;
    document.getElementById("winModal").style.display = "block";
    clearInterval(timerInterval);
  } else {
    if (grid[row][col].neighborMines > 0) {
      cell.textContent = grid[row][col].neighborMines;
    } else {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (row + i >= 0 && row + i < GRID_SIZE && col + j >= 0 && col + j < GRID_SIZE) {
            revealCell(row + i, col + j);
          }
        }
      }
    }
    checkWinCondition();
  }
}

function toggleFlag(row, col) {
  if (grid[row][col].isRevealed) return;

  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  if (grid[row][col].isFlagged) {
    grid[row][col].isFlagged = false;
    cell.classList.remove('flagged');
    flagCount--;
  } else {
    grid[row][col].isFlagged = true;
    cell.classList.add('flagged');
    flagCount++;
  }
  updateMineCount();
}

function revealAllMines() {
  for (const [row, col] of mineLocations) {
    if (!grid[row][col].isFlagged) {
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
      cell.classList.add('revealed', 'mine');
      cell.textContent = '💣';
    }
  }
}

function checkWinCondition() {
  let revealedCount = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col].isRevealed) revealedCount++;
    }
  }
  if (revealedCount === GRID_SIZE * GRID_SIZE - MINE_COUNT) {
    saveHighScore("Mayın Tarlası", Math.max(0, 100 - timeElapsed));
    gameOver = true;
    document.getElementById('reset').textContent = '😎';
    document.getElementById("winMessage").innerText = `Tebrikler!\nKazandınız!\n`;
    document.getElementById("winModal").style.display = "block";
    clearInterval(timerInterval);
  }
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

function updateMineCount() {
  const mineCountDisplay = document.getElementById('mine-count');
  mineCountDisplay.textContent = String(MINE_COUNT - flagCount).padStart(3, '0');
}

function updateTimer() {
  const timerDisplay = document.getElementById('timer');
  timerDisplay.textContent = String(timeElapsed).padStart(3, '0');
}

function resetGame() {
  gameOver = false;
  flagCount = 0;
  updateMineCount();
  document.getElementById('reset').textContent = '😊';
  initializeGrid();
  placeMines();
  calculateNeighborMines();
  renderGrid();
  clearInterval(timerInterval);
  timerInterval = null;
  timeElapsed = 0;
  updateTimer();
}

function toggleFlagMode() {
  if (gameOver) return;
  flagMode = !flagMode;
  const flagToggle = document.getElementById('flag-toggle');
  flagToggle.textContent = flagMode ? '🚩' : '🚩';
  flagToggle.style.backgroundColor = flagMode ? '#4CAF50' : '#c0c0c0';
}

document.getElementById('reset').addEventListener('click', resetGame);
document.getElementById('flag-toggle').addEventListener('click', toggleFlagMode);
document.getElementById("winModal").style.display = "none";

document.getElementById('initialMessage').addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});

document.getElementById('winModal').addEventListener('click', () => {
  document.getElementById('winModal').style.display = "none";
  resetGame();
});

resetGame();