// assets/js/title-screen.js

const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');

const titleText = "ROOT: REALITY'S COMPILER";
const sloganText = "Where your dreams become code";
const promptText = "> PRESS START";

const adminBlue = '#00FFFF';
const black = '#000010';

let currentIndex = 0;
let lastTime = 0;
const letterInterval = 500; // ms between letters

// For blinking colon cursor
let showCursor = true;
setInterval(() => {
  showCursor = !showCursor;
}, 500);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = adminBlue;
  ctx.font = '48px monospace';
  ctx.textBaseline = 'top';

  // Draw title letters up to currentIndex
  const visibleText = titleText.substring(0, currentIndex);
  ctx.fillText(visibleText, 50, 100);

  // Draw blinking colon cursor after "ROOT"
  if (currentIndex >= 4) {
    if (showCursor) {
      // Colon position after "ROOT"
      ctx.fillRect(50 + ctx.measureText("ROOT").width + 5, 110, 10, 10);
      ctx.fillRect(50 + ctx.measureText("ROOT").width + 5, 130, 10, 10);
    }
  }

  // When full title is shown, show slogan and prompt
  if (currentIndex >= titleText.length) {
    ctx.font = '24px monospace';
    ctx.fillText(sloganText, 50, 180);

    // Pulsing prompt
    const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 500);
    ctx.fillStyle = `rgba(0, 255, 255, ${alpha.toFixed(2)})`;
    ctx.fillText(promptText, 50, 220);
  }
}

function update(time) {
  if (!lastTime) lastTime = time;
  const delta = time - lastTime;

  if (delta > letterInterval && currentIndex < titleText.length) {
    currentIndex++;
    lastTime = time;
  }

  draw();
  requestAnimationFrame(update);
}

// Start animation
requestAnimationFrame(update);

// Start game on any key or click
function startGame() {
  alert("Game Starting! (Replace this with actual game start code)");
  // TODO: Replace alert with game start logic
  window.removeEventListener('keydown', startGame);
  window.removeEventListener('click', startGame);
}

window.addEventListener('keydown', startGame);
window.addEventListener('click', startGame);
