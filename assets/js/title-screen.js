const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');
const bgMusic = document.getElementById('bgMusic');

const titleText = "ROOT REALITY'S COMPILER";
let currentIndex = 0;
let showCursor = true;

const letterRevealInterval = 150; // ms
let lastRevealTime = 0;

let musicStarted = false;

function drawTitle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = '48px monospace';
  ctx.textBaseline = 'top';

  // Draw each letter with flicker and glow effect
  let x = 50;
  const y = 100;

  for (let i = 0; i < currentIndex; i++) {
    const letter = titleText[i];

    // Flicker glow effect: random alpha and shadow blur
    const flickerAlpha = 0.7 + 0.3 * Math.random();
    ctx.fillStyle = `rgba(0, 255, 255, ${flickerAlpha.toFixed(2)})`;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10 * flickerAlpha;

    // Draw letter
    ctx.fillText(letter, x, y);

    // Advance x by letter width
    x += ctx.measureText(letter).width;
  }

  // Draw blinking colon after "ROOT"
  if (currentIndex >= 4 && showCursor) {
    const rootWidth = ctx.measureText("ROOT").width;
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    // Draw colon as two small squares
    ctx.fillRect(50 + rootWidth + 5, y + 10, 10, 10);
    ctx.fillRect(50 + rootWidth + 5, y + 40, 10, 10);
  }

  // Draw blinking underscore cursor at end of revealed text
  if (currentIndex < titleText.length) {
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fillRect(x, y + 60, 20, 5);
  }
}

function drawEmblem(x, y) {
  const time = Date.now() / 1000;
  const glow = 15 + 5 * Math.sin(time * 3);

  // Outer glow circle
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = glow;
  ctx.fillStyle = '#00ffff';
  ctx.beginPath();
  ctx.arc(x, y, 50, 0, Math.PI * 2);
  ctx.fill();

  // Inner circle
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#005555';
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, Math.PI * 2);
  ctx.fill();

  // Inner glowing lines (like circuit traces)
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 2;
  ctx.shadowBlur = glow / 2;
  ctx.shadowColor = '#00ffff';

  ctx.beginPath();
  ctx.moveTo(x - 20, y);
  ctx.lineTo(x + 20, y);
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x, y + 20);
  ctx.moveTo(x - 15, y - 15);
  ctx.lineTo(x + 15, y + 15);
  ctx.moveTo(x - 15, y + 15);
  ctx.lineTo(x + 15, y - 15);
  ctx.stroke();
}

function update(timestamp) {
  if (!lastRevealTime) lastRevealTime = timestamp;

  if (timestamp - lastRevealTime > letterRevealInterval && currentIndex < titleText.length) {
    currentIndex++;
    lastRevealTime = timestamp;

    // Start music on first letter reveal
    if (!musicStarted) {
      bgMusic.play().catch(e => {
        // Autoplay might be blocked, user interaction needed
        console.log('Music play prevented:', e);
      });
      musicStarted = true;
    }
  }

  // Toggle blinking colon cursor every 500ms
  showCursor = Math.floor(timestamp / 500) % 2 === 0;

  drawTitle();

  // Draw emblem below text after full title revealed
  if (currentIndex >= titleText.length) {
    drawEmblem(canvas.width / 2, 320);
  }

  requestAnimationFrame(update);
}

// Optional: resume audio on user interaction if autoplay blocked
document.body.addEventListener('click', () => {
  if (bgMusic.paused && musicStarted) {
    bgMusic.play();
  }
});

requestAnimationFrame(update);
