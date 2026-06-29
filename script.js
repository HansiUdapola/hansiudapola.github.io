/* ============================================
   UTILITIES
   ============================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================
   NAVBAR — SCROLL STATE
   ============================================ */
function initNavScroll() {
  const nav = $('.nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================
   ACTIVE NAV LINK
   ============================================ */
function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav__link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    const match = href === current || (current === '' && href === 'index.html');
    link.classList.toggle('is-active', match);
  });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const hamburger = $('.nav__hamburger');
  const menu      = $('.mobile-menu');
  if (!hamburger || !menu) return;

  let open = false;

  const toggle = () => {
    open = !open;
    hamburger.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', String(open));
  };

  const close = () => {
    if (!open) return;
    open = false;
    hamburger.classList.remove('is-open');
    menu.classList.remove('is-open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', toggle);

  $$('.mobile-menu__link', menu).forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

/* ============================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================ */
function initScrollReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ============================================
   SCROLL PROGRESS BAR (case study pages)
   ============================================ */
function initProgressBar() {
  const bar = $('.progress-bar__fill');
  if (!bar) return;

  const update = () => {
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled     = window.scrollY;
    const progress     = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
    bar.style.width    = `${Math.min(progress, 100)}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ============================================
   HERO PARALLAX (subtle, index only)
   ============================================ */
function initHeroParallax() {
  const imgWrap = $('.hero__img-wrap');
  if (!imgWrap) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    const limit   = 120;
    const y       = Math.min(scrollY * 0.12, limit);
    imgWrap.style.transform = `translateY(${y}px)`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================
   CONTACT FORM — MAILTO HANDLER
   ============================================ */
function initContactForm() {
  const form = $('.contact__form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.querySelector('[name="name"]')?.value || '';
    const email   = form.querySelector('[name="email"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:hansiudapola2@gmail.com?subject=${subject}&body=${body}`;
  });
}

/* ============================================
   SMOOTH ANCHOR SCROLLING
   ============================================ */
function initSmoothAnchors() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
      const y = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initActiveNav();
  initMobileMenu();
  initScrollReveal();
  initProgressBar();
  initHeroParallax();
  initContactForm();
  initSmoothAnchors();
});
