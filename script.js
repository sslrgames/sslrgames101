// script.js - Full Working JavaScript for the provided HTML & CSS

// Wait for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
  // =========================
  // Header Scroll Effect
  // =========================
  const header = document.querySelector('header');
  function onScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll(); // initialize on load

  // =========================
  // Smooth Scroll for nav links with data-scroll-to
  // =========================
  const navLinks = document.querySelectorAll('a[data-scroll-to]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-scroll-to');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    });
  });

  // =========================
  // Mobile Menu Toggle
  // =========================
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('nav.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function() {
      // Toggle a class to show/hide
      mainNav.classList.toggle('open');
      // For CSS #mobile-menu logic, if using, toggle hidden
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
      }
    });
  }

  // =========================
  // Fade-in Sections on Scroll
  // =========================
  const fadeSections = document.querySelectorAll('.fade-in-section');
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeSections.forEach(sec => fadeObserver.observe(sec));
  } else {
    // Fallback: reveal all
    fadeSections.forEach(sec => sec.classList.add('visible'));
  }

  // =========================
  // Email Reveal Handler
  // =========================
  // For elements with class email-obfuscated and data-email-part1/part2
  document.querySelectorAll('.email-obfuscated').forEach(el => {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      const part1 = this.dataset.emailPart1;
      const part2 = this.dataset.emailPart2;
      if (part1 && part2) {
        const email = part1 + '@' + part2;
        this.textContent = email;
        this.href = 'mailto:' + email;
        this.classList.remove('email-obfuscated');
      }
    });
  });
  // Also support #reveal-email id
  const revealEmailBtn = document.getElementById('reveal-email');
  if (revealEmailBtn) {
    revealEmailBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // assume data-email-part1/2
      const part1 = this.dataset.emailPart1;
      const part2 = this.dataset.emailPart2;
      if (part1 && part2) {
        const email = part1 + '@' + part2;
        this.textContent = email;
        this.href = 'mailto:' + email;
      }
    });
  }

  // =========================
  // Newsletter Form Submission (Placeholder)
  // =========================
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        alert('Thank you for subscribing with ' + emailInput.value + '!');
        emailInput.value = '';
      }
    });
  }

  // =========================
  // Contact Form Submission (Placeholder)
  // =========================
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const statusMsg = this.querySelector('.form-status-message');
      if (statusMsg) statusMsg.textContent = 'Thank you! Your message has been sent.';
      this.reset();
    });
  }

  // =========================
  // Custom Cursor Dot
  // =========================
  // Create a cursor dot element
  const cursorDot = document.createElement('div');
  cursorDot.style.width = '12px';
  cursorDot.style.height = '12px';
  cursorDot.style.borderRadius = '50%';
  cursorDot.style.position = 'fixed';
  cursorDot.style.pointerEvents = 'none';
  cursorDot.style.backgroundColor = 'var(--cyan, #22d3ee)';
  cursorDot.style.transform = 'translate(-50%, -50%)';
  cursorDot.style.zIndex = '9999';
  document.body.appendChild(cursorDot);
  document.addEventListener('mousemove', function(e) {
    cursorDot.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
  });

  // =========================
  // Modal Functionality (for provided modals)
  // =========================
  function setupModal(modalId, triggerSelector, titleSelector, contentLoader) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const closeBtn = modal.querySelector('.close-button');
    document.querySelectorAll(triggerSelector).forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        if (titleSelector) {
          const titleEl = modal.querySelector(titleSelector);
          if (titleEl) {
            let text = '';
            if (trigger.dataset.gameId) {
              text = trigger.closest('.game-card')?.querySelector('.game-title')?.textContent || trigger.dataset.gameId;
            }
            if (trigger.dataset.jobId) {
              text = trigger.closest('.job-card')?.querySelector('.job-title')?.textContent || text;
            }
            if (text) titleEl.textContent = text;
          }
        }
        if (typeof contentLoader === 'function') {
          contentLoader(modal, trigger);
        }
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';
      });
    });
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
      });
    }
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
      }
    });
  }
  // Initialize modals if present
  setupModal('game-details-modal', '.btn-view-game-details', '#game-modal-title', (modal, trigger) => {
    const descEl = modal.querySelector('.modal-game-description');
    if (descEl) {
      const gameId = trigger.dataset.gameId;
      descEl.textContent = 'Loading details for ' + gameId + '...';
      setTimeout(() => {
        descEl.textContent = 'Detailed description for ' + gameId + '. (Replace with real data)';
      }, 500);
    }
  });
  setupModal('job-apply-modal', '.btn-apply', '#job-modal-title', (modal, trigger) => {
    const titleEl = modal.querySelector('#job-modal-title');
    if (titleEl) {
      const jobTitle = trigger.closest('.job-card')?.querySelector('.job-title')?.textContent;
      if (jobTitle) titleEl.textContent = 'Apply for: ' + jobTitle;
    }
  });

  // =========================
  // FAQ Toggle
  // =========================
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    const ans = item.querySelector('.faq-answer');
    if (btn && ans) {
      btn.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        ans.classList.toggle('hidden');
      });
    }
  });
});
