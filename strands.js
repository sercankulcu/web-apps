const gameSets = [
    {
      words: ['ELMA', 'ARMUT', 'MUZ', 'KİRAZ', 'ÜZÜM', 'İNCİR'],
      spangram: 'MEYVELER',
      gridLetters: [
        'E', 'L', 'M', 'A', 'X', 'X', 'X', 'X',
        'X', 'X', 'X', 'A', 'R', 'M', 'U', 'T',
        'Ü', 'X', 'X', 'X', 'X', 'X', 'M', 'X',
        'Z', 'X', 'X', 'X', 'X', 'X', 'U', 'X',
        'Ü', 'K', 'İ', 'R', 'A', 'Z', 'Z', 'X',
        'M', 'X', 'X', 'İ', 'N', 'C', 'İ', 'R'
      ]
    },
    {
      words: ['ARABA', 'TREN', 'GEMİ', 'UÇAK', 'OTOBÜS', 'BİSİKLET'],
      spangram: 'ARAÇLAR',
      gridLetters: [
        'A', 'R', 'A', 'B', 'A', 'X', 'X', 'X',
        'X', 'X', 'X', 'T', 'R', 'E', 'N', 'X',
        'G', 'E', 'M', 'İ', 'X', 'X', 'X', 'X',
        'X', 'X', 'X', 'U', 'Ç', 'A', 'K', 'X',
        'X', 'X', 'O', 'T', 'O', 'B', 'Ü', 'S',
        'B', 'İ', 'S', 'İ', 'K', 'L', 'E', 'T'
      ]
    },
    {
      words: ['ASLAN', 'KAPLAN', 'TİMSAH', 'FİL', 'ZÜRAFA', 'KURT'],
      spangram: 'HAYVANLAR',
      gridLetters: [
        'A', 'S', 'L', 'A', 'N', 'X', 'X', 'X',
        'K', 'A', 'P', 'L', 'A', 'N', 'X', 'X',
        'X', 'X', 'T', 'İ', 'M', 'S', 'A', 'H',
        'X', 'X', 'X', 'F', 'İ', 'L', 'X', 'X',
        'X', 'Z', 'Ü', 'R', 'A', 'F', 'A', 'X',
        'X', 'K', 'U', 'R', 'T', 'X', 'X', 'X'
      ]
    },
    {
      words: ['KIRMIZI', 'MAVİ', 'YEŞİL', 'SARI', 'TURUNCU', 'MOR'],
      spangram: 'RENKLER',
      gridLetters: [
        'K', 'I', 'R', 'M', 'I', 'Z', 'I', 'X',
        'X', 'M', 'A', 'V', 'İ', 'X', 'X', 'X',
        'X', 'Y', 'E', 'Ş', 'İ', 'L', 'X', 'X',
        'X', 'X', 'S', 'A', 'R', 'I', 'X', 'X',
        'X', 'T', 'U', 'R', 'U', 'N', 'C', 'U',
        'M', 'O', 'R', 'X', 'X', 'X', 'X', 'X'
      ]
    },
    {
      words: ['KALEM', 'DEFTER', 'SİLGİ', 'KİTAP', 'BOYAMA', 'ÇANTA'],
      spangram: 'OKUL MALZEMELERİ',
      gridLetters: [
        'K', 'A', 'L', 'E', 'M', 'X', 'X', 'X',
        'X', 'X', 'D', 'E', 'F', 'T', 'E', 'R',
        'X', 'X', 'X', 'S', 'İ', 'L', 'G', 'İ',
        'X', 'X', 'X', 'K', 'İ', 'T', 'A', 'P',
        'Ç', 'A', 'N', 'T', 'A', 'B', 'O', 'Y',
        'A', 'M', 'A', 'X', 'X', 'A', 'M', 'A'
      ]
    },
    {
      words: ['KAPI', 'PENCERE', 'MASA', 'SANDALYE', 'KOLTUK', 'HALI'],
      spangram: 'EV EŞYALARI',
      gridLetters: [
        'K', 'A', 'P', 'I', 'X', 'X', 'X', 'X',
        'X', 'P', 'E', 'N', 'C', 'E', 'R', 'E',
        'S', 'H', 'A', 'L', 'I', 'M', 'A', 'S',
        'A', 'X', 'X', 'X', 'X', 'X', 'A', 'A',
        'N', 'D', 'A', 'L', 'Y', 'E', 'X', 'X',
        'K', 'O', 'L', 'T', 'U', 'K', 'X', 'X'
      ]
    },
    {
      words: ['KUŞ', 'KÖPEK', 'KEDİ', 'BALIK', 'TAVŞAN', 'AYI'],
      spangram: 'HAYVANLAR',
      gridLetters: [
        'K', 'U', 'Ş', 'X', 'X', 'X', 'X', 'X',
        'X', 'X', 'K', 'Ö', 'P', 'E', 'K', 'X',
        'X', 'X', 'X', 'K', 'E', 'D', 'İ', 'X',
        'X', 'X', 'X', 'B', 'A', 'L', 'I', 'K',
        'X', 'X', 'T', 'A', 'V', 'Ş', 'A', 'N',
        'X', 'X', 'A', 'Y', 'I', 'X', 'X', 'X'
      ]
    },
    {
      words: ['KAR', 'YAĞMUR', 'GÜNEŞ', 'RÜZGAR', 'BULUT', 'DOLU'],
      spangram: 'HAVALAR',
      gridLetters: [
        'K', 'A', 'R', 'X', 'X', 'X', 'X', 'X',
        'B', 'X', 'Y', 'A', 'Ğ', 'M', 'U', 'R',
        'U', 'X', 'D', 'X', 'G', 'Ü', 'N', 'E',
        'L', 'X', 'O', 'R', 'Ü', 'Z', 'G', 'Ş',
        'U', 'X', 'L', 'X', 'B', 'U', 'A', 'U',
        'T', 'X', 'U', 'X', 'D', 'O', 'R', 'U'
      ]
    }
  ];

  let selectedCells = [];
  let foundWords = [];

  let currentGameSet;
  let words;
  let spangram;
  let gridLetters;
  let maxWordLength;

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

  function selectRandomGameSet() {
    currentGameSet = gameSets[Math.floor(Math.random() * gameSets.length)];
    words = currentGameSet.words;
    spangram = currentGameSet.spangram;
    gridLetters = currentGameSet.gridLetters;
    maxWordLength = Math.max(...words.map(word => word.length));
  }

  function createGrid() {
    closeModal();
    selectRandomGameSet();
    const grid = document.getElementById('grid');
    gridLetters.forEach((letter, index) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = letter;
      cell.dataset.index = index;
      cell.addEventListener('click', () => selectCell(cell));
      grid.appendChild(cell);
    });
  }

  function restartGame() {
    document.getElementById('grid').innerHTML = '';
    selectedCells = [];
    foundWords = [];
    createGrid();
  }

  function selectCell(cell) {
    if (cell.classList.contains('found')) return;

    if (selectedCells.includes(cell)) {
      cell.classList.remove('selected');
      selectedCells = selectedCells.filter(selectedCell => selectedCell !== cell);
      return;
    }

    cell.classList.add('selected');
    selectedCells.push(cell);

    if (selectedCells.length > 1) {
      const lastIndex = parseInt(selectedCells[selectedCells.length - 2].dataset.index);
      const currentIndex = parseInt(cell.dataset.index);

      if (!isAdjacent(lastIndex, currentIndex)) {
        clearSelection();
        return;
      }
    }

    if (selectedCells.length >= 3) {
      checkSelection();
    }

    if (selectedCells.length >= maxWordLength) {
      clearSelection();
      return;
    }
  }


  function isAdjacent(index1, index2) {
    const x1 = index1 % 8;
    const y1 = Math.floor(index1 / 8);
    const x2 = index2 % 8;
    const y2 = Math.floor(index2 / 8);
    return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
  }

  function checkSelection() {
    const selectedWord = selectedCells.map(cell => cell.textContent).join('');
    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      foundWords.push(selectedWord);
      selectedCells.forEach(cell => {
        cell.classList.remove('selected');
        cell.classList.add('found');
      });
      selectedCells = [];
      if (foundWords.length === words.length) {
        showWinModal();
      }
    }
  }

  function clearSelection() {
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
  }

  function showWinModal() {
    document.getElementById("winMessage").textContent = 'Tebrikler! Tüm kelimeleri buldunuz.';
    document.getElementById("winModal").style.display = "flex";
  }

  function closeModal() {
    document.getElementById("winModal").style.display = "none";
  }

  document.addEventListener('click', () => {
    document.getElementById('initialMessage').style.display = 'none';
  });

  createGrid();