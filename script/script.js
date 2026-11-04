(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
      nav.classList.toggle('is-open', !open);
    });

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
    }));
  }

  const updateHeader = () => document.body.classList.toggle('has-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const cards = [...document.querySelectorAll('.person-card')];
  const dots = [...document.querySelectorAll('.carousel-dots button')];
  let activePerson = 0;
  const showPerson = index => {
    if (!cards.length) return;
    activePerson = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      const active = i === activePerson;
      card.classList.toggle('is-active', active);
      card.classList.remove('is-entering');
      if (active) {
        void card.offsetWidth;
        card.classList.add('is-entering');
      }
      card.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === activePerson);
    if (i === activePerson) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };
  document.querySelectorAll('.carousel-arrow').forEach(button => button.addEventListener('click', () => showPerson(activePerson + (button.dataset.direction === 'next' ? 1 : -1))));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showPerson(i)));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && window.Lenis) {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if (document.querySelector('.detail-hero')) {
    const detailEnter = gsap.timeline({ defaults: { ease: 'power3.out' } });
    detailEnter.from('.detail-hero .eyebrow', { opacity: 0, y: reducedMotion ? 0 : 10, duration: reducedMotion ? 0.18 : 0.45 })
      .from('.detail-hero h1', { opacity: 0, y: reducedMotion ? 0 : 18, duration: reducedMotion ? 0.18 : 0.6 }, '-=.2')
      .from('.detail-hero .detail-lede', { opacity: 0, y: reducedMotion ? 0 : 10, duration: reducedMotion ? 0.18 : 0.45 }, '-=.3');
  } else {
    const enter = gsap.timeline({ defaults: { ease: 'power3.out' } });
    enter.from('.hero-copy .eyebrow', { opacity: 0, y: reducedMotion ? 0 : 12, duration: reducedMotion ? 0.18 : 0.55 })
      .from('h1', { opacity: 0, y: reducedMotion ? 0 : 24, duration: reducedMotion ? 0.18 : 0.7 }, '-=.25')
      .from('.hero-lede, .hero-actions', { opacity: 0, y: reducedMotion ? 0 : 12, duration: reducedMotion ? 0.18 : 0.5, stagger: 0.08 }, '-=.3')
      .from('.hero-visual', { opacity: 0, scale: reducedMotion ? 1 : 0.97, duration: reducedMotion ? 0.18 : 0.8 }, '-=.5');
  }
  const revealTargets = document.querySelector('.detail-hero')
    ? '.detail-values > .kicker'
    : '.kicker, .section-heading, .intro-body, .people-heading, .people-carousel, .content-card, .services-grid, .faq-grid, .contact-head, .locations';
  gsap.utils.toArray(revealTargets).forEach(el => {
    gsap.from(el, { opacity: 0, y: reducedMotion ? 0 : 20, duration: reducedMotion ? 0.18 : 0.65, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
  });
  gsap.utils.toArray('.practice-list article').forEach((el, index) => gsap.from(el, {
    opacity: 0, x: reducedMotion ? 0 : -12, duration: reducedMotion ? 0.18 : 0.5, delay: reducedMotion ? 0 : index * 0.05,
    scrollTrigger: { trigger: el, start: 'top 92%', once: true }
  }));
  gsap.utils.toArray('.detail-feature-copy, .detail-image, .detail-note, .detail-next').forEach(el => gsap.from(el, {
    opacity: 0, y: reducedMotion ? 0 : 16, duration: reducedMotion ? 0.18 : 0.55, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%', once: true }
  }));
  gsap.utils.toArray('.detail-value-grid, .detail-team, .detail-news').forEach(group => gsap.from(group.children, {
    opacity: 0, y: reducedMotion ? 0 : 14, duration: reducedMotion ? 0.18 : 0.5, stagger: reducedMotion ? 0 : 0.06, ease: 'power3.out',
    scrollTrigger: { trigger: group, start: 'top 88%', once: true }
  }));
})();
