/* -------------------------------------------------------
   SSLR Games — Cinematic Interactive Script
   ------------------------------------------------------- */

"use strict";

/* ---------- Fade & Reveal ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-inner");
  const logo = document.getElementById("logo");
  const tagline = document.querySelector(".tagline");
  const subline = document.querySelector(".subline");
  const meta = document.querySelector(".meta");
  const buttons = document.querySelectorAll(".actions a");

  // Fade sequence
  setTimeout(() => hero.style.opacity = "1", 300);
  setTimeout(() => logo.classList.add("visible"), 800);
  setTimeout(() => tagline.style.opacity = "1", 1200);
  setTimeout(() => subline.style.opacity = "1", 1500);
  setTimeout(() => meta.style.opacity = "1", 1700);
  setTimeout(() => buttons.forEach(b => b.style.opacity = "1"), 1900);
});

/* ---------- Parallax Background ---------- */
(() => {
  const bg = document.getElementById("bg-image");
  if (!bg) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  const smooth = 0.05; // damping
  const updateParallax = () => {
    const dx = mouseX - currentX;
    const dy = mouseY - currentY;
    currentX += dx * smooth;
    currentY += dy * smooth;
    bg.style.transform = `translate(${currentX * 0.05}px, ${currentY * 0.05}px) scale(1.1)`;
    requestAnimationFrame(updateParallax);
  };
  updateParallax();

  document.addEventListener("mousemove", (e) => {
    const { innerWidth, innerHeight } = window;
    mouseX = (e.clientX / innerWidth - 0.5) * 2;
    mouseY = (e.clientY / innerHeight - 0.5) * 2;
  });
})();

/* ---------- Particle System ---------- */
(() => {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const numParticles = 90;
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
      o: Math.random() * 0.5 + 0.3
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#00e5ff";
    for (let p of particles) {
      ctx.globalAlpha = p.o;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      // wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---------- Language Toggle ---------- */
(() => {
  const btn = document.getElementById("lang-toggle");
  const tagline = document.querySelector(".tagline");
  const subline = document.querySelector(".subline");
  if (!btn || !tagline) return;

  const text = {
    en: {
      tagline: "Simple Stories. Lasting Realities.",
      coming: "Coming",
      year: "2027",
    },
    bn: {
      tagline: "সরল গল্প। স্থায়ী বাস্তবতা।",
      coming: "আসছে",
      year: "২০২৭",
    }
  };

  let current = "en";

  btn.addEventListener("click", () => {
    current = current === "en" ? "bn" : "en";
    btn.textContent = current === "en" ? "EN / বাংলা" : "বাংলা / EN";

    tagline.textContent = text[current].tagline;
    subline.innerHTML = `<strong>${text[current].coming}</strong> <span class="year">${text[current].year}</span>`;
  });
})();

/* ---------- Smooth Hero Glow Pulse ---------- */
(() => {
  const hero = document.getElementById("hero");
  if (!hero) return;

  let glow = 0;
  function animateGlow() {
    glow += 0.02;
    const gradient =
      `radial-gradient(circle at 50% 50%, rgba(0,200,255,${0.1 + Math.sin(glow)*0.05}), transparent 80%)`;
    hero.style.backgroundImage = gradient;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
})();

/* ---------- Console Message ---------- */
console.log("%cSSLR Games", "color:#00e5ff;font-size:18px;font-weight:bold;");
console.log("Independent studio from Rangpur — Coming 2027");
