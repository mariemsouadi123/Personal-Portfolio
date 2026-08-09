/* =========================================================
   Mariem Souadi — portfolio interactions
   (page loader, nav toggle, scroll shadow, typed rotator,
    counters, reveals)
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  /* ---- page loader ---- */
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('is-done'), 350);
  });
  // fallback in case 'load' already fired
  setTimeout(() => loader?.classList.add('is-done'), 2500);

  /* ---- footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- nav: scroll shadow + mobile toggle ---- */
  const nav = document.getElementById('siteNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav?.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- typed rotator line ---- */
  const typedEl = document.getElementById('typedText');
  const phrases = [
    'secure delivery platforms.',
    'GitOps pipelines.',
    'zero-trust CI/CD.',
    'applied AI tools.'
  ];
  if (typedEl) {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const tick = () => {
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 65);
    };
    tick();
  }

  /* ---- stat cards: tap-to-reveal detail on touch devices ---- */
  const statCards = document.querySelectorAll('.workflow-node');
  statCards.forEach(card => {
    card.addEventListener('click', () => {
      const wasOpen = card.classList.contains('is-open');
      statCards.forEach(c => c.classList.remove('is-open'));
      if (!wasOpen) card.classList.add('is-open');
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.workflow-node')) {
      statCards.forEach(c => c.classList.remove('is-open'));
    }
  });

  /* ---- animated stat counters (hero) ---- */
  const counters = document.querySelectorAll('.wf-value[data-count], .wf-value[data-text]');
  const animateCounter = (el) => {
    // text-based stat (e.g. "Multiple") — just reveal, no counting
    if (el.dataset.text) {
      el.textContent = el.dataset.text;
      return;
    }
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ---- scroll reveal for skill cloud + generic .reveal elements ---- */
  document.querySelectorAll('.skillset-cloud .cw').forEach(el => el.classList.add('reveal'));
  const revealTargets = document.querySelectorAll('.reveal');
  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => revealObserver.observe(el));
  }
});