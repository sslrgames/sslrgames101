// script.js - Full Working JavaScript for SSLR Games

// Wait for DOM content loaded
document.addEventListener('DOMContentLoaded', function () {
  // =========================
  // Navigation Toggle for Mobile
  // =========================
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      mainNav.classList.toggle('open');
    });
  }

  // =========================
  // Smooth Scroll and Active Nav Link
  // =========================
  const navLinks = document.querySelectorAll('.nav-item[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Update active classes
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        // Close nav on mobile if open
        if (mainNav && mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Optional: Update active nav link on scroll
  // You can implement IntersectionObserver on sections to update active nav-item
  const sections = document.querySelectorAll('main section[id]');
  const sectionObserverOptions = { root: null, rootMargin: '0px', threshold: 0.3 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.nav-item[href="#${id}"]`);
        if (activeLink) {
          navLinks.forEach(l => l.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  }, sectionObserverOptions);
  sections.forEach(sec => sectionObserver.observe(sec));

  // =========================
  // Reveal Email Addresses
  // =========================
  const emailEls = document.querySelectorAll('.email-obfuscated');
  emailEls.forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const part1 = this.dataset.emailPart1;
      const part2 = this.dataset.emailPart2;
      if (part1 && part2) {
        const email = `${part1}@${part2}`;
        this.textContent = email;
        this.href = 'mailto:' + email;
        this.classList.remove('email-obfuscated');
      }
    });
  });

  // =========================
  // Set Current Year in Footer
  // =========================
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // =========================
  // IntersectionObserver for Animate On Scroll
  // =========================
  const animateElems = document.querySelectorAll('.animate-on-scroll');
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
  const animateObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);
  animateElems.forEach(el => animateObserver.observe(el));

  // =========================
  // Game Filters Functionality
  // =========================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const gameCards = document.querySelectorAll('.game-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      gameCards.forEach(card => {
        const categories = card.dataset.categories ? card.dataset.categories.split(' ') : [];
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================
  // Newsletter Form Submission (Placeholder)
  // =========================
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
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
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const statusMsg = this.querySelector('.form-status-message');
      if (statusMsg) statusMsg.textContent = 'Thank you! Your message has been sent.';
      this.reset();
    });
  }

  // =========================
  // Modal Functionality
  // =========================
  function setupModal(modalId, triggerSelector, titleSelector, contentLoader) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const closeBtn = modal.querySelector('.close-button');
    // Open triggers
    document.querySelectorAll(triggerSelector).forEach(trigger => {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        // Set title if selector provided
        if (titleSelector) {
          const titleEl = modal.querySelector(titleSelector);
          if (titleEl) {
            let titleText = '';
            // For game details: data-game-id
            if (trigger.dataset.gameId) {
              // Optionally extract more info
              titleText = trigger.closest('.game-card')?.querySelector('.game-title')?.textContent || trigger.dataset.gameId;
            }
            // For job apply: job title element
            if (trigger.dataset.jobId) {
              titleText = trigger.closest('.job-card')?.querySelector('.job-title')?.textContent || titleText;
            }
            if (titleText) titleEl.textContent = titleText.startsWith('Apply for') ? titleText : titleText;
          }
        }
        if (typeof contentLoader === 'function') {
          contentLoader(modal, trigger);
        }
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';
        // Focus trap could be added here
      });
    });
    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
      });
    }
    // Close on outside click
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
      }
    });
    // Close on ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
      }
    });
  }

  // Game Details Modal
  setupModal('game-details-modal', '.btn-view-game-details', '#game-modal-title', (modal, trigger) => {
    const descEl = modal.querySelector('.modal-game-description');
    if (descEl) {
      const gameId = trigger.dataset.gameId;
      descEl.textContent = 'Loading details for ' + gameId + '...';
      // Simulate loading or fetch actual data
      setTimeout(() => {
        descEl.textContent = 'Detailed description for ' + gameId + '. (Replace with real data)';
      }, 500);
    }
  });

  // Job Apply Modal
  setupModal('job-apply-modal', '.btn-apply', '#job-modal-title', (modal, trigger) => {
    const titleEl = modal.querySelector('#job-modal-title');
    if (titleEl) {
      const jobTitle = trigger.closest('.job-card')?.querySelector('.job-title')?.textContent;
      if (jobTitle) titleEl.textContent = 'Apply for: ' + jobTitle;
    }
  });

  // Handle job application form submission
  const jobForm = document.querySelector('#job-apply-modal form.job-application-form');
  if (jobForm) {
    jobForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const statusMsg = this.querySelector('.form-status-message');
      if (statusMsg) statusMsg.textContent = 'Application submitted!';
      this.reset();
    });
  }

  // =========================
  // FAQ Toggle Functionality
  // =========================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');
    if (questionBtn && answerDiv) {
      questionBtn.addEventListener('click', function () {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (expanded) {
          answerDiv.classList.add('hidden');
        } else {
          answerDiv.classList.remove('hidden');
        }
      });
    }
  });

  // =========================
  // Additional Helpers if Needed
  // =========================
  // You can add more code here for sliders, carousels, 3D scenes, etc.
});
