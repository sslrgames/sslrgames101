document.addEventListener('DOMContentLoaded', function () {
  // Navigation toggle for mobile
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  navToggle.addEventListener('click', function () {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
    navToggle.setAttribute('aria-expanded', !expanded);
    mainNav.classList.toggle('open');
  });

  // Smooth scroll and active nav link
  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Reveal email addresses
  const emailEls = document.querySelectorAll('.email-obfuscated');
  emailEls.forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const part1 = this.dataset.emailPart1;
      const part2 = this.dataset.emailPart2;
      const email = part1 + '@' + part2;
      this.textContent = email;
      this.href = 'mailto:' + email;
      this.classList.remove('email-obfuscated');
    });
  });

  // Set current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // IntersectionObserver for animate-on-scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  const animateElems = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);
  animateElems.forEach(el => observer.observe(el));

  // Game filters functionality
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

  // Newsletter form submission (example handler)
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        // Placeholder: integrate with actual subscription API
        alert('Thank you for subscribing with ' + emailInput.value + '!');
        emailInput.value = '';
      }
    });
  }

  // Contact form submission (example handler)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Placeholder: integrate with actual backend
      const statusMsg = this.querySelector('.form-status-message');
      statusMsg.textContent = 'Thank you! Your message has been sent.';
      this.reset();
    });
  }

  // Modal functionality
  function setupModal(modalId, triggerSelector, titleSelector, contentLoader) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const closeBtn = modal.querySelector('.close-button');
    // Open triggers
    document.querySelectorAll(triggerSelector).forEach(trigger => {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        // Set title/content if loader provided
        if (titleSelector) {
          const titleText = this.closest(triggerSelector.includes('data-game-id') ? '.game-card' : '')
            ? this.closest('.game-card')?.querySelector(titleSelector)?.textContent
            : null;
          if (titleText) {
            modal.querySelector(titleSelector)?.textContent && (modal.querySelector(titleSelector).textContent = titleText);
          }
        }
        if (contentLoader) {
          contentLoader(modal, this);
        }
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'block';
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
  }
  // Game Details Modal
  setupModal('game-details-modal', '.btn-view-game-details', '#game-modal-title', (modal, trigger) => {
    const gameId = trigger.dataset.gameId;
    // Placeholder: Load real data via fetch if API available
    modal.querySelector('.modal-game-description').textContent = 'Loading details for ' + gameId + '...';
    // Example: after loading
    setTimeout(() => {
      modal.querySelector('.modal-game-description').textContent = 'Detailed description for ' + gameId + '. (Replace with real data)';
      // Platforms and features could be populated here
    }, 500);
  });
  // Job Apply Modal
  setupModal('job-apply-modal', '.btn-apply', '#job-modal-title', (modal, trigger) => {
    const jobTitle = trigger.closest('.job-card')?.querySelector('.job-title')?.textContent;
    if (jobTitle) {
      modal.querySelector('#job-modal-title').textContent = 'Apply for: ' + jobTitle;
    }
  });

  // Handle modal form submissions
  const jobForm = document.querySelector('#job-apply-modal form.job-application-form');
  if (jobForm) {
    jobForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const statusMsg = this.querySelector('.form-status-message');
      // Placeholder: integrate with backend
      statusMsg.textContent = 'Application submitted!';
      this.reset();
    });
  }

});
