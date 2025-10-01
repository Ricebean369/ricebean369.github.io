const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');

const title = "ROOT: REALITY'S COMPILER";
const slogan = "Where your dreams become code";
const letterInterval = 500; // ms per letter reveal

let displayedTitle = "";
let currentIndex = 0;
let lastTime = 0;
let emblemAlpha = 0;
let sloganAlpha = 0;
let pressStartVisible = false;

const pressStartDiv = document.getElementById('pressStart');
pressStartDiv.style.opacity = 0;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

function drawText(text, x, y, glow = false, fontSize = 48) {
  ctx.font = `${fontSize}px 'Press Start 2P', monospace`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#00ffff';
  if (glow) {
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 12;
  } else {
    ctx.shadowBlur = 0;
  }
  ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}

function drawEmblem(alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 20;

  const size = 80;
  const top = {x: centerX, y: centerY + 60 - size};
  const left = {x: centerX - size, y: centerY + 60 + size};
  const right = {x: centerX + size, y: centerY + 60 + size};

  ctx.beginPath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(left.x, left.y);
  ctx.lineTo(right.x, right.y);
  ctx.closePath();
  ctx.stroke();

  function drawCodeDots(p1, p2, count) {
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const x = p1.x + (p2.x - p1.x) * t + (Math.sin(Date.now() / 200 + i) * 3);
      const y = p1.y + (p2.y - p1.y) * t + (Math.cos(Date.now() / 200 + i) * 3);
      ctx.beginPath();
      ctx.fillStyle = '#00ffff';
      ctx.shadowBlur = 10;
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawCodeDots(top, left, 10);
  drawCodeDots(left, right, 10);
  drawCodeDots(right, top, 10);

  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawText(displayedTitle, centerX, centerY - 40, true, 48);

  if (displayedTitle.length >= 4) {
    const colonX = centerX - ctx.measureText(title).width / 2 + ctx.measureText("ROOT").width + 10;
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      drawText(":", colonX, centerY - 40, true, 48);
    }
  }

  if (sloganAlpha > 0) {
    ctx.globalAlpha = sloganAlpha;
    drawText(slogan, centerX, centerY + 40, false, 20);
    ctx.globalAlpha = 1;
  }

  if (emblemAlpha > 0) {
    drawEmblem(emblemAlpha);
  }
}

function update(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;

  if (currentIndex < title.length && delta > letterInterval) {
    displayedTitle += title[currentIndex];
    currentIndex++;
    lastTime = timestamp;
  } else if (currentIndex >= title.length) {
    if (emblemAlpha < 1) emblemAlpha += 0.01;
    if (emblemAlpha >= 1 && sloganAlpha < 1) sloganAlpha += 0.01;
    if (sloganAlpha >= 1 && !pressStartVisible) {
      pressStartDiv.style.opacity = 1;
      pressStartVisible = true;
    }
  }

  draw();
  requestAnimationFrame(update);
}

function startAnimation() {
  document.removeEventListener('keydown', startAnimation);
  document.removeEventListener('click', startAnimation);
  playMusic();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', startAnimation);
document.addEventListener('click', startAnimation);

pressStartDiv.addEventListener('click', () => {
  alert("Start Game! Transition to main menu here.");
  // TODO: Replace alert with actual game start logic
});

// --- Music ---

let audioCtx;
let oscillator;
let gainNode;
let isPlaying = false;

function playMusic() {
  if (isPlaying) return;
  isPlaying = true;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.connect(audioCtx.destination);

  oscillator = audioCtx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(110, audioCtx.currentTime);
  oscillator.connect(gainNode);
  oscillator.start();

  const melody = [
    {freq: 110, duration: 500},
    {freq: 146.83, duration: 500},
    {freq: 164.81, duration: 500},
    {freq: 196.00, duration: 500},
    {freq: 220.00, duration: 1000},
  ];

  let noteIndex = 0;
  function playNextNote() {
    if (noteIndex >= melody.length) noteIndex = 0;
    const note = melody[noteIndex];
    oscillator.frequency.setValueAtTime(note.freq, audioCtx.currentTime);
    noteIndex++;
    setTimeout(playNextNote, note.duration);
  }
  playNextNote();
}
