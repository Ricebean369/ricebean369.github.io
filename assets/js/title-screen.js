const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');

const titleText = "ROOT REALITY'S COMPILER"; // No colon, blinking colon drawn separately
let currentIndex = 0;
let showCursor = true;

const letterRevealInterval = 150; // ms
let lastRevealTime = 0;

function drawTitle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = '48px monospace';
  ctx.fillStyle = '#00ffff';
  ctx.textBaseline = 'top';

  // Draw revealed letters
  const textToDraw = titleText.substring(0, currentIndex);
  ctx.fillText(textToDraw, 50, 100);

  // Draw blinking colon after "ROOT"
  if (currentIndex >= 4 && showCursor) {
    const rootWidth = ctx.measureText("ROOT").width;
    // Draw two small blue squares as colon pixels
    ctx.fillRect(50 + rootWidth + 5, 110, 10, 10);
    ctx.fillRect(50 + rootWidth + 5, 130, 10, 10);
  }

  // Draw blinking underscore cursor at end of revealed text
  if (currentIndex < titleText.length) {
    const partialWidth = ctx.measureText(textToDraw).width;
    ctx.fillRect(50 + partialWidth, 140, 20, 5);
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
  }

  // Toggle blinking colon cursor every 500ms
  if (Math.floor(timestamp / 500) % 2 === 0) {
    showCursor = true;
  } else {
    showCursor = false;
  }

  drawTitle();

  // Draw emblem below text after full title revealed
  if (currentIndex >= titleText.length) {
    drawEmblem(canvas.width / 2, 320);
  }

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
