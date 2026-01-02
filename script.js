// ---------------- VARIABLES ----------------
let score = 0;
let health = 3;
let hookPos = 50;
let gameLoop, fishLoop;

// ---------------- DOM ----------------
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const gameArea = document.getElementById("gameArea");
const hook = document.getElementById("hook");

const scoreTxt = document.getElementById("score");
const healthTxt = document.getElementById("health");
const finalScoreTxt = document.getElementById("finalScore");

// ---------------- SCREEN CONTROL ----------------
function showScreen(screen) {
  document.querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

// ---------------- START GAME ----------------
function startGame() {
  showScreen(gameScreen);

  score = 0;
  health = 3;
  hookPos = 50;

  updateHUD();
  hook.style.left = hookPos + "%";

  gameLoop = setInterval(updateGame, 20);
  fishLoop = setInterval(createFish, 1000);
}

// ---------------- RESTART GAME ----------------
function restartGame() {
  showScreen(startScreen);
}

// ---------------- HUD ----------------
function updateHUD() {
  scoreTxt.innerText = score;
  healthTxt.innerText = health;
}

// ---------------- KEYBOARD CONTROL ----------------
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft" && hookPos > 0) hookPos -= 5;
  if (e.key === "ArrowRight" && hookPos < 95) hookPos += 5;
  hook.style.left = hookPos + "%";
});

// ---------------- MOUSE CONTROL ----------------
gameArea.addEventListener("mousemove", function (e) {
  let rect = gameArea.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  hookPos = (mouseX / rect.width) * 100;

  if (hookPos < 0) hookPos = 0;
  if (hookPos > 95) hookPos = 95;

  hook.style.left = hookPos + "%";
});

// ---------------- CREATE FISH ----------------
function createFish() {
  let fish = document.createElement("div");
  fish.classList.add("fish");

  let good = Math.random() > 0.3;
  fish.classList.add(good ? "good" : "bad");

  fish.style.left = Math.random() * 90 + "%";
  fish.style.top = "0px";
  fish.dataset.type = good ? "good" : "bad";

  gameArea.appendChild(fish);
}

// ---------------- GAME LOOP ----------------
function updateGame() {
  let fishes = document.querySelectorAll(".fish");

  fishes.forEach(fish => {
    fish.style.top = (parseFloat(fish.style.top) || 0) + 2.5 + "px";

    // Collision near hook
    if (parseInt(fish.style.top) > gameArea.offsetHeight - 80) {
      if (Math.abs(fish.offsetLeft - hook.offsetLeft) < 30) {
        if (fish.dataset.type === "good") score += 10;
        else health--;

        updateHUD();
        fish.remove();
      }
    }

    // Remove fish at bottom
    if (parseInt(fish.style.top) > gameArea.offsetHeight) {
      fish.remove();
    }
  });

  if (health <= 0) endGame();
}

// ---------------- END GAME ----------------
function endGame() {
  clearInterval(gameLoop);
  clearInterval(fishLoop);

  finalScoreTxt.innerText = score;
  showScreen(gameOverScreen);
}
