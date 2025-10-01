const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');

const titleText = "ROOT: REALITY'S COMPILER";
const sloganText = "Where your dreams become code";
const promptText = "> PRESS START";

const adminBlue = '#00FFFF';

let currentIndex = 0;
let lastTime = 0;
const letterInterval = 500; // ms

let showCursor = true;
setInterval(() => {
  showCursor = !showCursor;
}, 500);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = adminBlue;
  ctx.font = '48px monospace';
  ctx.textBaseline = 'top';

  const visibleText = titleText.substring(0, currentIndex);
  ctx.fillText(visibleText, 50, 100);

  if (currentIndex >= 4 && showCursor) {
    const rootWidth = ctx.measureText("ROOT").width;
    ctx.fillRect(50 + rootWidth + 5, 110, 10, 10);
    ctx.fillRect(50 + rootWidth + 5, 130, 10, 10);
  }

  if (currentIndex >= titleText.length) {
    ctx.font = '24px monospace';
    ctx.fillStyle = adminBlue;
    ctx.fillText(sloganText, 50, 180);

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
    console.log("Current Index:", currentIndex);
  }

  draw();
  requestAnimationFrame(update);
}

requestAnimationFrame(update);

function startGame() {
  alert("Game Starting!");
  window.removeEventListener('keydown', startGame);
  window.removeEventListener('click', startGame);
}

window.addEventListener('keydown', startGame);
window.addEventListener('click', startGame);
