/**
 * Hansi Udapola Portfolio — Main JavaScript Core
 * Rebuilt with interactive canvas particle trails and scroll-driven background switching.
 */

class Portfolio {
  constructor() {
    this.navElement = document.querySelector('.nav');
    this.hamburger = document.querySelector('.nav__hamburger');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.sparkleCanvas = document.getElementById('sparkle-canvas');

    this.init();
  }

  init() {
    this.initNavbarScroll();
    this.initActiveNavigationLink();
    this.initMobileMenuToggle();
    this.initScrollReveal();
    this.initProgressBar();
    this.initHeroParallax();
    this.initContactForm();
    this.initSmoothAnchors();

    // Modern Overhaul Additions
    this.initSparkleCanvas();
    this.initScrollBackgroundSwitcher();
    this.initTypewriter();
    this.initThemeToggle();
    this.initExperienceToggles();
  }

  /**
   * Animates a typewriter effect for the hero name
   */
  initTypewriter() {
    const target = document.getElementById('hero-name');
    if (!target) return;

    const nameText = 'Hansi Udapola';
    let index = 0;
    const speed = 90; // Time per character in ms

    const type = () => {
      if (index < nameText.length) {
        target.textContent += nameText.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        // Remove flashing cursor line after typing completes
        setTimeout(() => {
          target.classList.remove('border-r-2', 'animate-pulse');
          target.style.borderRight = 'none';
        }, 1200);
      }
    };

    setTimeout(type, 700);
  }

  /**
   * Adjusts navbar styles based on scroll position
   */
  initNavbarScroll() {
    if (!this.navElement) return;

    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      this.navElement.classList.toggle('scrolled', isScrolled);

      if (isScrolled) {
        this.navElement.classList.add('bg-shadow-950/92', 'backdrop-blur-md', 'shadow-[0_4px_30px_rgba(0,0,0,0.15)]');
      } else {
        this.navElement.classList.remove('bg-shadow-950/92', 'backdrop-blur-md', 'shadow-[0_4px_30px_rgba(0,0,0,0.15)]');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /**
   * Highlights the active link in the navigation
   */
  initActiveNavigationLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').split('/').pop();
      const isActive = href === currentPath || (currentPath === '' && href === 'index.html');

      link.classList.toggle('nav-link-active', isActive);
      link.classList.toggle('nav-link-inactive', !isActive);

      if (isActive) {
        link.classList.add('text-slate-100');
        link.classList.remove('text-grey-400');
      } else {
        link.classList.remove('text-slate-100');
        link.classList.add('text-grey-400');
      }
    });
  }

  /**
   * Controls mobile menu overlay interactions
   */
  initMobileMenuToggle() {
    if (!this.hamburger || !this.mobileMenu) return;

    let isOpen = false;

    const toggleMenu = () => {
      isOpen = !isOpen;

      this.hamburger.classList.toggle('is-open', isOpen);
      this.mobileMenu.classList.toggle('is-open', isOpen);
      this.hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';

      const lines = this.hamburger.querySelectorAll('.hamburger-line');
      if (lines.length === 3) {
        if (isOpen) {
          lines[0].style.transform = 'translateY(6px) rotate(45deg)';
          lines[1].style.opacity = '0';
          lines[1].style.transform = 'scaleX(0)';
          lines[2].style.transform = 'translateY(-6px) rotate(-45deg)';
        } else {
          lines[0].style.transform = '';
          lines[1].style.opacity = '';
          lines[1].style.transform = '';
          lines[2].style.transform = '';
        }
      }
    };

    const closeMenu = () => {
      if (!isOpen) return;
      isOpen = false;

      this.hamburger.classList.remove('is-open');
      this.mobileMenu.classList.remove('is-open');
      this.hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';

      const lines = this.hamburger.querySelectorAll('.hamburger-line');
      lines.forEach(line => {
        line.style.transform = '';
        line.style.opacity = '';
      });
    };

    this.hamburger.addEventListener('click', toggleMenu);

    const mobileLinks = this.mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /**
   * Setup scroll reveal animation nodes using IntersectionObserver
   */
  initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observerOptions = {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px',
    };

    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);
    revealElements.forEach(el => observer.observe(el));
  }

  /**
   * Dynamic progress bar at the top of case study pages
   */
  initProgressBar() {
    const progressFill = document.querySelector('.progress-bar__fill');
    if (!progressFill) return;

    const updateProgressBar = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progressPercentage = scrollableHeight > 0 ? (currentScroll / scrollableHeight) * 100 : 0;

      progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;
    };

    window.addEventListener('scroll', updateProgressBar, { passive: true });
    updateProgressBar();
  }

  /**
   * Subtle parallax offset effect on the hero profile picture / visuals
   */
  initHeroParallax() {
    const heroImageWrap = document.querySelector('.hero__img-wrap');
    if (!heroImageWrap) return;

    let isTicking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      const maxTranslation = 120;
      const translationOffset = Math.min(scrollY * 0.12, maxTranslation);

      heroImageWrap.style.transform = `translateY(${translationOffset}px)`;
      isTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        requestAnimationFrame(updateParallax);
        isTicking = true;
      }
    }, { passive: true });
  }

  /**
   * Action handler for submitting contact form via default Mailto protocol
   */
  initContactForm() {
    const contactForm = document.querySelector('.contact__form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', event => {
      event.preventDefault();

      const name = contactForm.querySelector('[name="name"]')?.value || '';
      const email = contactForm.querySelector('[name="email"]')?.value || '';
      const message = contactForm.querySelector('[name="message"]')?.value || '';

      const emailSubject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

      window.location.href = `mailto:hansiudapola2@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    });
  }

  /**
   * Custom smooth anchor transitions to avoid layout jumps
   */
  initSmoothAnchors() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
      link.addEventListener('click', event => {
        const targetId = link.getAttribute('href').slice(1);
        if (targetId === '') return;

        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        event.preventDefault();

        const navbarHeight = 64;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  /**
   * ── MODERN OVERHAUL: Sparkle Canvas Particle Emitter ──────────────────────
   */
  initSparkleCanvas() {
    if (!this.sparkleCanvas) return;

    // Disable sparkles on touch-only mobile devices to save battery/cycles
    if (!window.matchMedia('(hover: hover)').matches) {
      this.sparkleCanvas.style.display = 'none';
      return;
    }

    const ctx = this.sparkleCanvas.getContext('2d');
    let particles = [];
    const colors = [
      'rgba(217, 172, 38, ',  // metallic-gold-500
      'rgba(240, 222, 168, ', // metallic-gold-200
      'rgba(219, 149, 36, ',  // honey-bronze-500
      'rgba(226, 170, 80, ',  // honey-bronze-400
    ];

    const resizeCanvas = () => {
      this.sparkleCanvas.width = window.innerWidth;
      this.sparkleCanvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1.2;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.015;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
      }

      draw() {
        ctx.fillStyle = this.color + this.life + ')';
        ctx.beginPath();
        // Render diamond/star sparkle shape
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x + this.size / 2, this.y);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.lineTo(this.x - this.size / 2, this.y);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Capture mouse moves to spawn particles
    window.addEventListener('mousemove', e => {
      // Spawn 1 to 2 particles per move to keep it elegant and performant
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    }, { passive: true });

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, this.sparkleCanvas.width, this.sparkleCanvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        } else {
          particles[i].draw();
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * ── MODERN OVERHAUL: Scroll-Driven Background Switcher ────────────────────
   */
  initScrollBackgroundSwitcher() {
    const sections = document.querySelectorAll('[data-bg-section]');
    const bgSheets = document.querySelectorAll('.portfolio-bg-sheet');

    if (!sections.length || !bgSheets.length) return;

    const observerOptions = {
      root: null,
      threshold: 0.25, // Activate when 25% of the section is visible
      rootMargin: '-10% 0px -10% 0px'
    };

    const sectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetBg = entry.target.getAttribute('data-bg-section');

          bgSheets.forEach(sheet => {
            if (sheet.getAttribute('data-bg') === targetBg) {
              sheet.classList.add('active');
            } else {
              sheet.classList.remove('active');
            }
          });
        }
      });
    };

    const observer = new IntersectionObserver(sectionObserverCallback, observerOptions);
    sections.forEach(sec => observer.observe(sec));
  }

  /**
   * ── LIGHT/DARK MODE INTERCHANGE SYSTEM ─────────────────────────────────────
   */
  initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');

    const applyTheme = (theme) => {
      const isLight = theme === 'light';
      document.documentElement.classList.toggle('light-theme', isLight);

      const updateIcon = (btn) => {
        if (!btn) return;
        if (isLight) {
          // Show Moon icon (click to switch to dark mode)
          btn.innerHTML = `<svg class="w-4.5 h-4.5 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
        } else {
          // Show Sun icon (click to switch to light mode)
          btn.innerHTML = `<svg class="w-4.5 h-4.5 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
        }
      };

      updateIcon(themeToggleBtn);
      updateIcon(themeToggleMobileBtn);
    };

    // Load initial theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    const toggleTheme = () => {
      const isCurrentlyLight = document.documentElement.classList.contains('light-theme');
      const newTheme = isCurrentlyLight ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    };

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (themeToggleMobileBtn) {
      themeToggleMobileBtn.addEventListener('click', toggleTheme);
    }
  }

  /**
   * Toggles visibility of collapsed details in the professional experience section
   */
  initExperienceToggles() {
    const toggleBtns = document.querySelectorAll('.experience-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.experience-item');
        if (!parent) return;
        const details = parent.querySelector('.experience-details-collapsed');
        if (!details) return;
        const isHidden = details.classList.contains('hidden');
        if (isHidden) {
          details.classList.remove('hidden');
          btn.textContent = 'Hide details';
        } else {
          details.classList.add('hidden');
          btn.textContent = 'See all details';
        }
      });
    });
  }
}

// Initialise Application on load
document.addEventListener('DOMContentLoaded', () => {
  new Portfolio();
});
