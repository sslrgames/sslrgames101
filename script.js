/* -------------------------------------------------------
   SSLR Games — Cinematic Landing Page Script
   ------------------------------------------------------- */
"use strict";

/* ---------- Fade-in & Intro Animation ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-inner");
  const logo = document.getElementById("logo");
  const tagline = document.querySelector(".tagline");
  const subline = document.querySelector(".subline");
  const meta = document.querySelector(".meta");
  const buttons = document.querySelectorAll(".btn");

  hero.style.opacity = "1";
  logo.classList.add("visible");

  // Sequential fade
  setTimeout(() => tagline.style.opacity = "1", 800);
  setTimeout(() => subline.style.opacity = "1", 1000);
  setTimeout(() => meta.style.opacity = "1", 1300);
  setTimeout(() => buttons.forEach(b => b.style.opacity = "1"), 1500);

  // Logo pulse intro
  setTimeout(() => {
    logo.animate([
      { transform: "scale(1)", filter: "drop-shadow(0 0 0 rgba(0,230,255,1))" },
      { transform: "scale(1.2)", filter: "drop-shadow(0 0 60px rgba(0,230,255,1))" },
      { transform: "scale(1.05)", filter: "drop-shadow(0 0 25px rgba(0,230,255,0.8))" }
    ], {
      duration: 1600,
      easing: "ease-out"
    });
  }, 500);
});

/* ---------- Parallax Background ---------- */
(() => {
  const bg = document.getElementById("bg-image");
  if (!bg) return;
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  const smooth = 0.05;

  function updateParallax() {
    currentX += (mouseX - currentX) * smooth;
    currentY += (mouseY - currentY) * smooth;
    bg.style.transform = `translate(${currentX * 15}px, ${currentY * 15}px) scale(1.1)`;
    requestAnimationFrame(updateParallax);
  }
  updateParallax();

  document.addEventListener("mousemove", (e) => {
    const { innerWidth, innerHeight } = window;
    mouseX = (e.clientX / innerWidth - 0.5);
    mouseY = (e.clientY / innerHeight - 0.5);
  });
})();

/* ---------- Particle System ---------- */
(() => {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const numParticles = 120;
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.5,
      d: Math.random() * 1.5 + 0.5, // depth
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      o: Math.random() * 0.4 + 0.3
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let glow = 0;

      if (dist < 120 && mouse.x && mouse.y) {
        glow = (120 - dist) / 120;
      }

      ctx.beginPath();
      ctx.globalAlpha = p.o + glow * 0.8;
      ctx.fillStyle = `rgba(0,229,255,${0.8})`;
      ctx.arc(p.x, p.y, p.r * (1 + glow), 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx * p.d;
      p.y += p.vy * p.d;

      // wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();

  document.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
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
      year: "2027"
    },
    bn: {
      tagline: "সরল গল্প। স্থায়ী বাস্তবতা।",
      coming: "আসছে",
      year: "২০২৭"
    }
  };

  let current = "en";
  btn.addEventListener("click", () => {
    current = current === "en" ? "bn" : "en";
    tagline.textContent = text[current].tagline;
    subline.innerHTML = `<strong>${text[current].coming}</strong> <span class="year">${text[current].year}</span>`;
    btn.textContent = current === "en" ? "EN / বাংলা" : "বাংলা / EN";
  });
})();

/* ---------- Hero Glow Pulse ---------- */
(() => {
  const hero = document.getElementById("hero");
  if (!hero) return;
  let t = 0;
  function animate() {
    t += 0.02;
    const intensity = 0.1 + Math.sin(t) * 0.05;
    hero.style.background = `radial-gradient(circle at 50% 50%, rgba(0,230,255,${intensity}), transparent 80%)`;
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ---------- Console Signature ---------- */
console.log("%cSSLR Games", "color:#00e5ff;font-size:18px;font-weight:bold;");
console.log("Independent Studio from Rangpur — Coming 2027");
