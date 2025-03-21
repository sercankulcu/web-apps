const grid = document.getElementById('sudoku-grid');
const numberPad = document.getElementById('number-pad');
const difficultySelectFirst = document.getElementById('difficultySelectFirst');
const difficultySelectLast = document.getElementById('difficultySelectLast');

let selectedCell = null;
let puzzle = [];
let emptyCellsCount = 30;

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

function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', selectCell);
      grid.appendChild(cell);
    }
  }
}

function selectCell(e) {
  if (selectedCell) {
    selectedCell.classList.remove('selected');
  }
  selectedCell = e.target;
  selectedCell.classList.add('selected');
}

function fillNumber(e) {
  if (selectedCell && !selectedCell.classList.contains('fixed')) {
    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);
    const number = parseInt(e.target.textContent);

    selectedCell.classList.remove('error');
    selectedCell.textContent = number;
    puzzle[row][col] = number;

    if (!isValid(puzzle, row, col, number)) {
      selectedCell.classList.add('error'); // Hata durumunda kırmızı yap
    }

    if (isGridFull()) {
      checkSolution();
    }
  }
}

function isGridFull() {
  const cells = document.querySelectorAll('.cell');
  return Array.from(cells).every(cell => cell.textContent !== '');
}

function generatePuzzle() {
  puzzle = Array(9).fill().map(() => Array(9).fill(0));

  for (let i = 0; i < 9; i += 3) {
    fillBox(i, i);
  }

  solveSudoku(puzzle);

  for (let i = 0; i < emptyCellsCount;) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] != 0) {
      puzzle[row][col] = 0;
      i++;
    }
  }
}

function fillBox(row, col) {
  let num;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9) + 1;
      } while (!isValid(puzzle, row + i, col + j, num));
      puzzle[row + i][col + j] = num;
    }
  }
}

function isValid(board, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (x != col && board[row][x] == num) {
      return false;
    }
    if (x != row && board[x][col] == num) {
      return false;
    }
  }

  let startRow = row - row % 3,
    startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if ((row != i + startRow) && (col != j + startCol) && board[i + startRow][j + startCol] == num) {
        return false;
      }
    }
  }

  return true;
}

function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            } else {
              board[row][col] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}

function displayPuzzle() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const value = puzzle[row][col];
    cell.textContent = value || '';
    cell.classList.toggle('fixed', value !== 0);
  });
}

function checkSolution() {
  const cells = document.querySelectorAll('.cell');
  let correct = true;
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const value = parseInt(cell.textContent) || 0;
    if (!isValid(puzzle, row, col, value)) {
      cell.classList.add('error');
      correct = false;
    } else {
      cell.classList.remove('error');
    }
  });
  if (correct) {
    document.getElementById("winMessage").innerText = `Tebrikler!\nKazandınız!\n`;
    document.getElementById("winModal").style.display = "block";
  }
}

function newGame() {
  createGrid();
  generatePuzzle();
  displayPuzzle();
}

numberPad.addEventListener('click', fillNumber);

document.getElementById("winModal").style.display = "none";

document.getElementById('initialMessage').addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
  newGame();
});

difficultySelectFirst.addEventListener('click', (e) => {
  e.stopPropagation();
  emptyCellsCount = parseInt(difficultySelectFirst.value);
});

difficultySelectLast.addEventListener('click', (e) => {
  e.stopPropagation();
  emptyCellsCount = parseInt(difficultySelectLast.value);
});

document.getElementById('winModal').addEventListener('click', () => {
  document.getElementById('winModal').style.display = "none";
  newGame();
});