const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const highScoresList = document.getElementById('highScoresList');
const needleElement = document.getElementById('needle');
const speedTextElement = document.getElementById('speedText');

const infoButton = document.getElementById('infoButton');
const overlay = document.getElementById('overlay');
const closeButton = document.getElementById('closeButton');

infoButton.addEventListener('click', () => {
  overlay.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  overlay.style.display = 'none';
});

function updateSpeed() {

  gameSpeed = Math.min(gameSpeed + SPEED_INCREASE, MAX_SPEED);
  const minSpeed = 0;
  const maxSpeed = 390;
  const minAngle = -135;
  const maxAngle = 135;
  const angle = ((gameSpeed - minSpeed) / (maxSpeed - minSpeed)) * (maxAngle - minAngle) + minAngle;
  needleElement.style.transform = `translateX(-50%) rotate(${angle}deg)`;
  speedTextElement.textContent = `${Math.round(gameSpeed)}`;
}

function setCanvasDimensions() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerHeight / 2;
}

setCanvasDimensions();
window.addEventListener('resize', setCanvasDimensions);

let ROAD_WIDTH, ROAD_HEIGHT, LANE_WIDTH, CAR_WIDTH, CAR_HEIGHT;
const LANE_COUNT = 3;
const INITIAL_SPEED = 90;
const SPEED_INCREASE = 0.03;
const MAX_SPEED = 390;

function updateDimensions() {
  ROAD_WIDTH = canvas.width;
  ROAD_HEIGHT = canvas.height;
  LANE_WIDTH = ROAD_WIDTH / LANE_COUNT;
  CAR_WIDTH = ROAD_WIDTH * 0.14;
  CAR_HEIGHT = ROAD_HEIGHT * 0.12;
}

updateDimensions();

let car = {
  x: 0,
  y: 0,
  lane: 1
};

let obstacles = [];
let score = 0;
let gameSpeed = INITIAL_SPEED;
let isGameOver = false;

function resetCarPosition() {
  car.lane = 1;
  car.x = car.lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
  car.y = ROAD_HEIGHT - CAR_HEIGHT - 20;
}

function drawRoad() {
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, ROAD_WIDTH, ROAD_HEIGHT);

  ctx.strokeStyle = '#fff';
  ctx.setLineDash([ROAD_HEIGHT * 0.1, ROAD_HEIGHT * 0.1]);
  for (let i = 1; i < LANE_COUNT; i++) {
    ctx.beginPath();
    ctx.moveTo(i * LANE_WIDTH, 0);
    ctx.lineTo(i * LANE_WIDTH, ROAD_HEIGHT);
    ctx.stroke();
  }
}

const carImage = new Image();
carImage.src = 'https://sercankulcu.github.io/game/corolla.webp'; // Resmin yolunu buraya yazın

function drawCar() {
  ctx.drawImage(carImage, car.x, car.y, CAR_WIDTH, CAR_HEIGHT);
}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, CAR_WIDTH, CAR_HEIGHT);
  });
}

const obstacleData = [
  { src: 'https://sercankulcu.github.io/game/kadjar.webp', speed: 0.90 },
  { src: 'https://sercankulcu.github.io/game/porsche-911.webp', speed: 0.85 },
  { src: 'https://sercankulcu.github.io/game/bugatti.webp', speed: 0.80 },
  { src: 'https://sercankulcu.github.io/game/lamborghini.webp', speed: 0.75 },
  { src: 'https://sercankulcu.github.io/game/lotus.webp', speed: 0.70 },
  { src: 'https://sercankulcu.github.io/game/barrier.webp', speed: 0.95 },
  { src: 'https://sercankulcu.github.io/game/duba.webp', speed: 0.95 },
  { src: 'https://sercankulcu.github.io/game/firewood.webp', speed: 0.95 },
  { src: 'https://sercankulcu.github.io/game/rock.webp', speed: 0.95 }
];

const obstacleImages = obstacleData.map(data => {
  const img = new Image();
  img.src = data.src;
  return { image: img, speed: data.speed };
});

const MIN_OBSTACLE_INTERVAL = 1000;  // En az 500ms arayla engel oluştur
const MAX_OBSTACLE_INTERVAL = 3000; // En fazla 1500ms arayla engel oluştur

function spawnObstacle() {
  if (isGameOver) return;

  const lane = Math.floor(Math.random() * LANE_COUNT);
  const randomIndex = Math.floor(Math.random() * obstacleImages.length);
  const selectedObstacle = obstacleImages[randomIndex];

  obstacles.push({
    x: lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2,
    y: -CAR_HEIGHT,
    speed: selectedObstacle.speed,
    image: selectedObstacle.image
  });

  let nextSpawnTime = (Math.random() * (MAX_OBSTACLE_INTERVAL - MIN_OBSTACLE_INTERVAL) * Math.max(0, (10000 - score) / 10000)) + MIN_OBSTACLE_INTERVAL;
  setTimeout(spawnObstacle, nextSpawnTime);
}

function updateObstacles() {
  obstacles.forEach(obstacle => {
    obstacle.y += gameSpeed * obstacle.speed * (canvas.height / 30000);

    if (obstacle.speed < 0.95 && score % 10 == 0) {
      let potentialCollisions = obstacles.filter(other =>
        other !== obstacle &&
        (obstacle.y - other.y) < CAR_HEIGHT * 1.1 &&
        other.x === obstacle.x && obstacle.y > 0 && other.y > 0
      );

      if (potentialCollisions.length > 0) {
        if (obstacle.x >= (LANE_COUNT - 1) * LANE_WIDTH) {
          obstacle.x -= LANE_WIDTH;
        } else {
          obstacle.x += LANE_WIDTH;
        }
      }
    }
  });

  obstacles = obstacles.filter(obstacle => obstacle.y < ROAD_HEIGHT);
}

function checkCollision() {
  return obstacles.some(obstacle => {
    return (
      car.x < obstacle.x + CAR_WIDTH &&
      car.x + CAR_WIDTH > obstacle.x &&
      car.y < obstacle.y + CAR_HEIGHT / 2 &&
      car.y + CAR_HEIGHT / 2 > obstacle.y
    );
  });
}

let gameLoopInterval;

function gameLoop() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, ROAD_WIDTH, ROAD_HEIGHT);

  drawRoad();
  drawCar();
  drawObstacles();

  updateObstacles();
  scoreElement.textContent = String(score++).padStart(5, '0');
  updateSpeed();

  if (checkCollision()) {
    gameOver();
  }
}

function startGameLoop() {
  gameLoopInterval = setInterval(gameLoop, 1000 / 60); // 16.67 ms for 60 FPS
}

function stopGameLoop() {
  clearInterval(gameLoopInterval);
}

function gameOver() {
  isGameOver = true;
  stopGameLoop();  // Stop the game loop when the game is over
  saveScore();
  displayHighScores();
  finalScoreElement.textContent = `Final Score: ${score}`;
  gameOverElement.style.display = 'block';
}

function saveScore() {
  let highScores = JSON.parse(localStorage.getItem('car-race-highScores')) || [];
  highScores.push({ score, date: new Date().toLocaleString() });
  highScores.sort((a, b) => b.score - a.score);
  highScores = highScores.slice(0, 5);
  localStorage.setItem('car-race-highScores', JSON.stringify(highScores));

  saveHighScore("Araba Yarışı", score);
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

function displayHighScores() {
  const highScores = JSON.parse(localStorage.getItem('car-race-highScores')) || [];
  highScoresList.innerHTML = '';
  highScores.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.score} - ${entry.date}`;
    highScoresList.appendChild(li);
  });
}

function resetGame() {
  updateDimensions();
  resetCarPosition();
  obstacles = [];
  score = 0;
  gameSpeed = INITIAL_SPEED;
  isGameOver = false;
  gameOverElement.style.display = 'none';
  startGameLoop();
  spawnObstacle();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && car.lane > 0) car.lane--;
  if (e.key === 'ArrowRight' && car.lane < LANE_COUNT - 1) car.lane++;
  car.x = car.lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
});

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickedLane = Math.floor(clickX / LANE_WIDTH);
  if (clickedLane >= 0 && clickedLane < LANE_COUNT) {
    car.lane = clickedLane;
    car.x = car.lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
  }
});

restartButton.addEventListener('click', resetGame);

document.addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});

scoreElement.addEventListener('click', function () {
  if (window.parent !== window) {
    window.parent.showMainContent();
  } else {
    window.location.href = 'index.html';
  }
});

resetCarPosition();
startGameLoop();
spawnObstacle();