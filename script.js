const gameArea = document.getElementById("gameArea");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const targetBox = document.getElementById("targetColor");
const exitBtn = document.getElementById("exitBtn");

let score = 0;
let timeLeft = 30;
let timer;
let targetColor = "";

const COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "cyan",
  "brown",
];

function getRandomUniqueColors(count) {
  const shuffled = [...COLORS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomPosition() {
  const maxX = gameArea.clientWidth - 60;
  const maxY = gameArea.clientHeight - 60;
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  return { x, y };
}

function createCircles(colors) {
  gameArea.innerHTML = "";
  colors.forEach((color) => {
    const circle = document.createElement("div");
    circle.classList.add("circle");
    circle.style.backgroundColor = color;
    const { x, y } = getRandomPosition();
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    circle.addEventListener("click", () => {
      if (color === targetColor) {
        score++;
        scoreElement.textContent = score;
        setupNewRound();
      }
    });
    gameArea.appendChild(circle);
  });
}

function setupNewRound() {
  const colors = getRandomUniqueColors(9);
  targetColor = colors[Math.floor(Math.random() * colors.length)];
  targetBox.style.backgroundColor = targetColor;
  createCircles(colors);
}

function startGame() {
  setupNewRound();
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      gameOver();
    }
  }, 1000);
}

function gameOver() {
  localStorage.setItem("latestScore", score);

  const name = localStorage.getItem("playerName") || "Player";
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  leaderboard.push({ name, score });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  let message = "Good try!";
  if (score >= 24) message = "Lightning Reflexes!";
  else if (score >= 15) message = "Color Ninja!";
  else if (score >= 0) message = "Good try!";

  const summary = document.getElementById("gameOverSummary");
  if (summary) {
    summary.innerHTML = `<h2>Game Over</h2><p>${name}, you caught ${score} colors!</p><p>${message}</p><button onclick=\"window.location.href='score.html'\">See Scoreboard</button>`;
    summary.classList.add("visible");
  } else {
    window.location.href = "score.html";
  }
}

if (gameArea && targetBox && scoreElement) {
  window.onload = startGame;
}

if (exitBtn) {
  exitBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to end the game?")) {
      window.location.href = "index.html";
    }
  });
}
