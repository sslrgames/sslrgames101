// script.js

// Language toggle setup
const toggleBtn = document.getElementById("toggle-lang");
const welcomeMsg = document.getElementById("welcome-msg");
const locationText = document.getElementById("location-text");
let lang = 'en';
toggleBtn.addEventListener('click', () => {
  if (lang === 'en') {
    welcomeMsg.textContent = "SSLR Games-এ আপনাকে স্বাগতম";
    locationText.textContent = "অবস্থান: দর্শনা, রংপুর, বাংলাদেশ";
    toggleBtn.textContent = "EN";
    lang = 'bn';
  } else {
    welcomeMsg.textContent = "Welcome to SSLR Games!";
    locationText.textContent = "Location: Darshana, Rangpur, Bangladesh";
    toggleBtn.textContent = "বাংলা";
    lang = 'en';
  }
});

// Canvas and starfield setup
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let cw = canvas.width = window.innerWidth;
let ch = canvas.height = window.innerHeight;

// Resize canvas on window resize
window.addEventListener('resize', () => {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
});

// Generate stars with random positions and velocities
let stars = [];
function initStars() {
  stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * cw,
      y: Math.random() * ch,
      vy: 1 + Math.random() * 1.5  // speed between 1 and 2.5
    });
  }
}
initStars();

// Track pointer and scroll for interaction
let pointerX = cw / 2, pointerY = ch / 2;
let scrollSpeed = 0;
window.addEventListener('pointermove', e => {
  pointerX = e.clientX;
  pointerY = e.clientY;
});
window.addEventListener('scroll', () => {
  // Adjust star speed based on scroll distance
  scrollSpeed = window.scrollY * 0.001;
});

// Flash effect on clicks (except on the language button)
function flash() {
  const f = document.createElement("div");
  f.className = "flash";
  document.body.appendChild(f);
  f.addEventListener("animationend", () => f.remove());
}
document.addEventListener('click', e => {
  if (e.target.id !== 'toggle-lang') {
    flash();
  }
});

// Animation loop: update star positions and draw them
function animate() {
  // Calculate cursor offset for parallax effect
  const offsetX = (pointerX - cw/2) * 0.02;
  const offsetY = (pointerY - ch/2) * 0.02;

  ctx.clearRect(0, 0, cw, ch);
  ctx.save();
  // Shift canvas to create subtle parallax
  ctx.translate(-offsetX, -offsetY);

  // Draw each star and update its position
  ctx.fillStyle = "white";
  for (let star of stars) {
    star.y += star.vy + scrollSpeed;
    if (star.y > ch) {
      star.y = 0;
      star.x = Math.random() * cw;
    }
    ctx.fillRect(star.x, star.y, 2, 2);
  }

  ctx.restore();
  window.requestAnimationFrame(animate);  // next frame
}
animate();  // start animation
