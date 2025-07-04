// Language toggle
let isBangla = false;

function toggleLanguage() {
  isBangla = !isBangla;
  document.getElementById("welcome-text").textContent = isBangla
    ? "এসএসএলআর গেমসে স্বাগতম"
    : "Welcome to SSLR Games";
  document.getElementById("location").textContent = isBangla
    ? "অবস্থান: দূরসোনা, রংপুর, বাংলাদেশ"
    : "Location: Durshona, Rangpur, Bangladesh";
}

// Dynamic background
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);
let particles = [];

for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 2 + 1,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5
  });
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "white";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > width) p.dx *= -1;
    if (p.y < 0 || p.y > height) p.dy *= -1;
  });
  requestAnimationFrame(draw);
}

draw();

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});
