/* Systems Field Manual — static navigation behavior and desktop-only hero light interaction. */
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('motion-ready');
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.navlinks');
  const links = navLinks ? navLinks.querySelectorAll('a') : [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile wordmark — a direct, keyboard-accessible route back to the static Home page. */
  const primaryNav = document.querySelector('header nav');
  if (primaryNav && !primaryNav.querySelector('.mobile-wordmark')) {
    const wordmark = document.createElement('a');
    wordmark.className = 'mobile-wordmark';
    wordmark.href = 'index.html';
    wordmark.setAttribute('aria-label', 'Go to Amarthya home page');
    wordmark.textContent = 'Amarthya';
    primaryNav.prepend(wordmark);
  }

  /* Shared navigation order: Home, About, Work, Experience, Contact across all standalone pages. */
  if (navLinks) {
    const navFooter = navLinks.querySelector('.nav-footer');
    ['index.html', 'about.html', 'work.html', 'experience.html', 'contact.html'].forEach((href) => {
      const link = navLinks.querySelector(`a[href="${href}"]`);
      if (link) navLinks.insertBefore(link, navFooter);
    });
  }

  /* Systems Field Manual — unobtrusive synthesized interface sounds; no audio assets are loaded. */
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  let audioContext = null;
  let audioUnlock = null;
  let lastLetterTick = 0;
  let lastProjectTick = 0;

  const primeAudio = () => {
    if (!AudioEngine) return false;

    if (!audioContext || audioContext.state === 'closed') {
      try {
        audioContext = new AudioEngine();
      } catch {
        return false;
      }
    }

    if (audioContext.state !== 'running' && !audioUnlock) {
      audioUnlock = audioContext.resume().catch(() => {
        audioUnlock = null;
      });
    }

    return true;
  };

  const playTone = (frequency, duration, volume, type = 'sine') => {
    if (!audioContext || audioContext.state === 'closed') return;

    const start = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);

    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + duration);
  };

  const playClick = () => {
    if (primeAudio()) playTone(240, .075, .11, 'triangle');
  };

  const playLetterTick = (index) => {
    playTone(420 + (index % 6) * 28, .04, .05, 'sine');
  };

  const playProjectTick = (index) => {
    playTone(332 + (index % 5) * 24, .045, .048, 'triangle');
  };

  document.addEventListener('pointerdown', (event) => {
    const trigger = event.target.closest(
      '.navlinks a, .contact-links a, .bottom-nav-card, .menu-btn'
    );

    primeAudio();
    if (trigger) playClick();
  }, { capture: true, passive: true });

  const activeLink = document.querySelector('.navlinks a.active');
  const activeLabel = activeLink ? activeLink.querySelector('.pill-label') : null;
  const routeLabel = activeLabel ? activeLabel.textContent.trim().toUpperCase() : (activeLink ? activeLink.textContent.trim().toUpperCase() : 'INDEX');
  function closeMenu() {
    if (navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    links.forEach((link) => link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const isMobile = window.innerWidth <= 900;
      const current = window.location.pathname.split('/').pop() || 'index.html';
      if (isMobile && href === current) {
        event.preventDefault(); closeMenu(); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in-view'));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
    }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  const lightHero = document.querySelector('.home-page .hero-center-container');
  const desktopLight = window.matchMedia('(min-width: 901px) and (pointer: fine)');

  if (desktopLight.matches && !reduceMotion) {
    document.querySelectorAll('.work-item').forEach((project, index) => {
      project.addEventListener('pointerenter', () => {
        const now = performance.now();
        if (now - lastProjectTick < 72) return;
        lastProjectTick = now;
        if (audioContext?.state === 'running') playProjectTick(index);
      });
      project.addEventListener('pointerdown', playClick);
    });
  }

  if (lightHero && desktopLight.matches && !reduceMotion) {
    const heroLetters = [...lightHero.querySelectorAll('.hero-name .word > span')];
    heroLetters.forEach((letter) => {
      const character = letter.textContent;
      const shadow = document.createElement('span');
      shadow.className = 'glyph-shadow';
      shadow.setAttribute('aria-hidden', 'true');
      shadow.textContent = character;
      const front = document.createElement('span');
      front.className = 'glyph-front';
      front.textContent = character;
      letter.replaceChildren(shadow, front);
    });
    heroLetters.forEach((letter, index) => {
      letter.addEventListener('pointerenter', () => {
        const now = performance.now();
        if (now - lastLetterTick < 46) return;
        lastLetterTick = now;
        if (audioContext?.state === 'running') playLetterTick(index);
      });
    });
    let requested = false;
    let pointerX = .5;
    const applyLight = (rawX) => {
      const lightX = .5 + (rawX - .5) * .65;
      const heroBox = lightHero.getBoundingClientRect();
      const sourceX = heroBox.left + heroBox.width * lightX;
      lightHero.style.setProperty('--light-x', `${lightX * 100}%`);
      heroLetters.forEach((letter) => {
        const letterBox = letter.getBoundingClientRect();
        const letterX = letterBox.left + letterBox.width / 2;
        const distance = Math.abs(letterX - sourceX);
        const beamReach = Math.max(letterBox.width * .72, heroBox.width * .042);
        const rawInfluence = Math.max(0, 1 - distance / beamReach);
        const influence = rawInfluence > .1 ? Math.pow(rawInfluence, .78) : 0;
        const direction = Math.sign(letterX - sourceX) || 1;
        letter.classList.toggle('light-hit', influence > 0);
        letter.style.setProperty('--letter-shadow-x', `${direction * influence * 22}px`);
        letter.style.setProperty('--letter-shadow-y', `0px`);
        letter.style.setProperty('--letter-shadow-scale-x', `${1 + influence * .32}`);
        letter.style.setProperty('--letter-shadow-scale-y', `${1.02 + influence * .52}`);
        letter.style.setProperty('--letter-shadow-opacity', `${influence * .82}`);
        letter.style.setProperty('--letter-shadow-blur', `${.35 + influence * 1.45}px`);
        const front = letter.querySelector('.glyph-front');
        if (front) {
          front.style.setProperty('--active-shadow-x', `${direction * influence * 20}px`);
          front.style.setProperty('--active-shadow-y', `${-influence * 15}px`);
          front.style.setProperty('--active-shadow-blur', `${.8 + influence * 2.5}px`);
          front.style.setProperty('--active-shadow-alpha', `${influence * .84}`);
        }
      });
    };
    const queueLight = () => {
      if (requested) return;
      requested = true;
      requestAnimationFrame(() => { applyLight(pointerX); requested = false; });
    };
    lightHero.addEventListener('pointermove', (event) => {
      const box = lightHero.getBoundingClientRect();
      pointerX = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
      queueLight();
    });
    lightHero.addEventListener('pointerleave', () => { pointerX = .5; queueLight(); });
    applyLight(.5);
  }

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    let hidden = true;
    const placeCursor = (event) => { if (hidden) { cursor.style.opacity = '1'; hidden = false; } cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`; };
    document.addEventListener('mousemove', placeCursor, { passive: true });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; hidden = true; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; hidden = false; });
    document.addEventListener('mouseover', (event) => { if (event.target.closest('a, button, .hero-name span, .contact-links a, .sec-title, .contact-title')) cursor.classList.add('hover'); });
    document.addEventListener('mouseout', (event) => { if (event.target.closest('a, button, .hero-name span, .contact-links a, .sec-title, .contact-title')) cursor.classList.remove('hover'); });
  }
});
