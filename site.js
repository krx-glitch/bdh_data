(function () {
  const menuIcon = '<span class="material-symbols-outlined text-4xl" aria-hidden="true">menu</span>';
  const closeIcon = '<span class="material-symbols-outlined text-4xl" aria-hidden="true">close</span>';

  function setupMobileMenu() {
    const button = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!button || !menu) return;

    button.setAttribute('type', 'button');
    button.setAttribute('aria-controls', 'mobile-menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation menu');

    const setOpen = (open) => {
      menu.classList.toggle('translate-x-full', !open);
      document.body.classList.toggle('menu-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      button.innerHTML = open ? closeIcon : menuIcon;
    };

    button.addEventListener('click', () => {
      setOpen(button.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  function hardenExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', Array.from(rel).join(' '));
    });
  }

  function setupAdmissionsPrefill() {
    const form = document.querySelector('form[data-admissions-form]');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const selectedCourse = params.get('course');
    const groupSize = params.get('group');
    const courseField = form.querySelector('[name="course"]');
    const groupField = form.querySelector('[name="group_size"]');
    const nextField = form.querySelector('[name="_next"]');

    if (selectedCourse && courseField) {
      const option = Array.from(courseField.options).find((entry) => entry.value === selectedCourse);
      if (option) courseField.value = selectedCourse;
    }

    if (groupSize && groupField) {
      groupField.value = groupSize;
    }

    if (nextField && window.location.protocol !== 'file:') {
      nextField.value = new URL('thank-you.html', window.location.href).href;
    }
  }

  function setupModalEscape() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && typeof window.closeVibeModal === 'function') {
        window.closeVibeModal();
      }
    });
  }

  /* =========================================================
     MOTION REVEALS — scroll-triggered entrance animations
     ========================================================= */
  function setupMotionReveals() {
    // Standard fade-up reveals
    const targets = document.querySelectorAll('main section, .glass-card, .site-card-button, .site-card-link');
    targets.forEach((target) => target.classList.add('motion-reveal'));

    // Kinetic text shimmer on headings
    const headings = document.querySelectorAll('h1, h2');
    headings.forEach((heading) => heading.classList.add('kinetic-text'));

    // Stagger reveal for grids
    const grids = document.querySelectorAll('.grid');
    grids.forEach((grid) => grid.classList.add('stagger-reveal'));

    // Directional slide reveals
    document.querySelectorAll('.order-1, .order-2, [class*="md:order-1"]').forEach((el, i) => {
      el.classList.add(i % 2 === 0 ? 'motion-slide-left' : 'motion-slide-right');
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('motion-in'));
      grids.forEach((grid) => grid.classList.add('stagger-in'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('motion-in');
          if (entry.target.classList.contains('stagger-reveal')) {
            entry.target.classList.add('stagger-in');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    targets.forEach((target) => observer.observe(target));

    // Observe stagger grids separately
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('stagger-in');
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.1 });

    grids.forEach((grid) => staggerObserver.observe(grid));

    // Observe directional reveals
    const slideTargets = document.querySelectorAll('.motion-slide-left, .motion-slide-right, .motion-scale');
    slideTargets.forEach((target) => observer.observe(target));
  }

  /* =========================================================
     SCROLL PROGRESS BAR
     ========================================================= */
  function setupScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);

    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      bar.style.transform = `scaleX(${progress})`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* =========================================================
     FLOATING PARTICLE SYSTEM
     ========================================================= */
  function setupParticleSystem() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0, height = 0, dpr = 1, frameId = 0;
    const pointer = { x: 0.5, y: 0.5 };

    const PARTICLE_COUNT = Math.min(60, Math.floor(window.innerWidth / 25));
    const particles = [];

    const colors = [
      'rgba(240, 90, 40, 0.6)',
      'rgba(232, 36, 94, 0.5)',
      'rgba(107, 45, 134, 0.4)',
      'rgba(0, 244, 254, 0.3)',
      'rgba(255, 177, 195, 0.35)',
    ];

    function createParticle() {
      return {
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.3 - 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      };
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      const mouseX = pointer.x * width;
      const mouseY = pointer.y * height;

      particles.forEach((p) => {
        p.pulse += p.pulseSpeed;
        const pulseFactor = 0.5 + Math.sin(p.pulse) * 0.5;

        // Subtle mouse repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const currentSize = p.size * (0.7 + pulseFactor * 0.3);

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * pulseFactor;
        ctx.fill();

        // Draw a subtle glow around each particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * pulseFactor * 0.1;
        ctx.fill();
      });

      // Draw connection lines between nearby particles
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(240, 90, 40, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      frameId = requestAnimationFrame(drawParticles);
    }

    resize();
    frameId = requestAnimationFrame(drawParticles);

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', (e) => {
      pointer.x = e.clientX / Math.max(width, 1);
      pointer.y = e.clientY / Math.max(height, 1);
    }, { passive: true });

    prefersReducedMotion.addEventListener('change', (event) => {
      if (event.matches) {
        cancelAnimationFrame(frameId);
        canvas.remove();
      }
    });
  }

  /* =========================================================
     MAGNETIC HOVER — elements attracted to cursor
     ========================================================= */
  function setupMagneticHover() {
    const elements = document.querySelectorAll('.interactive-3d, .magnetic-hover');

    elements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;

        el.style.transform = `perspective(800px) translateY(-8px) rotateX(${deltaY * -8}deg) rotateY(${deltaX * 8}deg) scale(1.02)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* =========================================================
     RIPPLE CLICK EFFECT — material-style ripple on buttons
     ========================================================= */
  function setupRippleEffect() {
    const buttons = document.querySelectorAll('button, .site-card-button, .site-card-link');

    buttons.forEach((btn) => {
      btn.classList.add('ripple-effect');

      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  }

  /* =========================================================
     TEXT SCRAMBLE — hero text scramble entrance effect
     ========================================================= */
  function setupTextScramble() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*';
    const heroH1 = document.querySelector('h1');
    if (!heroH1 || !heroH1.closest('.hero-gradient, [class*="min-h-"]')) return;

    const originalText = heroH1.textContent.trim();
    const span = heroH1.querySelector('span');
    if (!span) return;

    const targetText = span.textContent.trim();
    let iteration = 0;
    const maxIterations = targetText.length;

    function scramble() {
      span.textContent = targetText
        .split('')
        .map((char, index) => {
          if (index < iteration) return targetText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration < maxIterations) {
        iteration += 1 / 2;
        requestAnimationFrame(() => setTimeout(scramble, 40));
      } else {
        span.textContent = targetText;
      }
    }

    // Delay to let the page render first
    setTimeout(scramble, 800);
  }

  /* =========================================================
     PARALLAX SCROLL — multi-speed scroll layers
     ========================================================= */
  function setupParallaxScroll() {
    const hero = document.querySelector('section[class*="min-h-screen"], section[class*="min-h-"]');
    if (!hero) return;

    const heroImg = hero.querySelector('img');
    const heroContent = hero.querySelector('[class*="relative z-10"]');
    const blurs = hero.querySelectorAll('[class*="blur-"]');

    if (!heroImg && !heroContent) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;

      if (scrollY < viewportH * 1.5) {
        if (heroImg) {
          heroImg.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0002})`;
        }
        if (heroContent) {
          heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
          heroContent.style.opacity = Math.max(0, 1 - scrollY / (viewportH * 0.8));
        }
        blurs.forEach((blur, i) => {
          const speed = 0.08 + i * 0.04;
          blur.style.transform = `translateY(${scrollY * speed}px)`;
        });
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* =========================================================
     MORPHING BLOB INJECTOR — add blob bg to key sections
     ========================================================= */
  function injectMorphBlobs() {
    const sections = document.querySelectorAll('main > section');
    if (sections.length < 2) return;

    // Add blobs to sections that don't already have them
    [0, 1, 2].forEach((index) => {
      const section = sections[index];
      if (!section) return;

      // Only add to sections with relative or no explicit positioning
      const style = getComputedStyle(section);
      if (style.position === 'static') {
        section.style.position = 'relative';
      }
      section.style.overflow = section.style.overflow || 'hidden';

      const blob = document.createElement('div');
      blob.className = `morph-blob morph-blob-${index + 1}`;
      blob.setAttribute('aria-hidden', 'true');
      section.prepend(blob);
    });
  }

  /* =========================================================
     ANIMATED COUNTER — count up numbers on scroll
     ========================================================= */
  function setupAnimatedCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count-to'), 10);
          const duration = parseInt(el.getAttribute('data-count-duration') || '2000', 10);
          const suffix = el.getAttribute('data-count-suffix') || '';
          const startTime = performance.now();

          el.classList.add('counting');

          function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased) + suffix;

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = target + suffix;
              el.classList.remove('counting');
            }
          }

          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((c) => observer.observe(c));
  }

  /* =========================================================
     SHIMMER EFFECT ON GLASS CARDS
     ========================================================= */
  function setupShimmerCards() {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card) => card.classList.add('shimmer-line'));
  }

  /* =========================================================
     ANIMATED UNDERLINES ON NAV LINKS
     ========================================================= */
  function setupAnimatedUnderlines() {
    const navLinks = document.querySelectorAll('nav a:not([class*="border-b"])');
    navLinks.forEach((link) => link.classList.add('animated-underline'));
  }

  /* =========================================================
     PULSE BORDER ON HOVER FOR FEATURED CARDS
     ========================================================= */
  function setupPulseBorders() {
    const featuredCards = document.querySelectorAll('.site-card-button, .glow-card');
    featuredCards.forEach((card) => card.classList.add('pulse-border'));
  }

  /* =========================================================
     FLOATING GLOW ORBS — inject into hero section
     ========================================================= */
  function injectGlowOrbs() {
    const hero = document.querySelector('section[class*="min-h-screen"], section[class*="min-h-"]');
    if (!hero) return;

    const orbConfigs = [
      { size: 12, x: '15%', y: '25%', color: 'rgba(240, 90, 40, 0.4)', delay: '0s', duration: '5s' },
      { size: 8, x: '75%', y: '35%', color: 'rgba(232, 36, 94, 0.35)', delay: '-2s', duration: '7s' },
      { size: 6, x: '55%', y: '70%', color: 'rgba(0, 244, 254, 0.3)', delay: '-4s', duration: '6s' },
      { size: 10, x: '85%', y: '60%', color: 'rgba(107, 45, 134, 0.3)', delay: '-1s', duration: '8s' },
      { size: 5, x: '30%', y: '80%', color: 'rgba(255, 177, 195, 0.25)', delay: '-3s', duration: '5.5s' },
    ];

    orbConfigs.forEach((cfg) => {
      const orb = document.createElement('div');
      orb.className = 'glow-orb';
      orb.setAttribute('aria-hidden', 'true');
      orb.style.cssText = `
        width: ${cfg.size}px;
        height: ${cfg.size}px;
        left: ${cfg.x};
        top: ${cfg.y};
        background: ${cfg.color};
        animation-delay: ${cfg.delay};
        animation-duration: ${cfg.duration};
      `;
      hero.appendChild(orb);
    });
  }

  /* =========================================================
     NAV HIDE / SHOW ON SCROLL
     ========================================================= */
  function setupNavScrollBehavior() {
    const nav = document.querySelector('nav, header');
    if (!nav) return;

    let lastScrollY = 0;
    let ticking = false;

    function update() {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        if (scrollY > lastScrollY + 5) {
          // Scrolling down — hide nav
          nav.style.transform = 'translateY(-100%)';
          nav.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
        } else if (scrollY < lastScrollY - 5) {
          // Scrolling up — show nav
          nav.style.transform = 'translateY(0)';
        }
      } else {
        nav.style.transform = 'translateY(0)';
      }
      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* =========================================================
     FLUID MOTION — existing ribbon canvas animation
     ========================================================= */
  function setupFluidMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches || !document.body) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'fluid-motion-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    document.body.classList.add('motion-ready');

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const pointer = { x: 0.5, y: 0.5 };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;

    const ribbons = [
      { base: 0.18, amp: 38, speed: 0.00046, width: 1.2, colors: ['rgba(240, 90, 40, 0)', 'rgba(240, 90, 40, 0.72)', 'rgba(232, 36, 94, 0)'] },
      { base: 0.34, amp: 52, speed: -0.00034, width: 1.1, colors: ['rgba(0, 244, 254, 0)', 'rgba(0, 244, 254, 0.38)', 'rgba(240, 90, 40, 0)'] },
      { base: 0.56, amp: 44, speed: 0.00028, width: 1.3, colors: ['rgba(232, 36, 94, 0)', 'rgba(232, 36, 94, 0.54)', 'rgba(107, 45, 134, 0)'] },
      { base: 0.76, amp: 34, speed: -0.00042, width: 1.0, colors: ['rgba(240, 90, 40, 0)', 'rgba(255, 177, 195, 0.35)', 'rgba(0, 244, 254, 0)'] }
    ];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawRibbon(ribbon, index, time) {
      const gradient = context.createLinearGradient(0, height * ribbon.base - 120, width, height * ribbon.base + 120);
      gradient.addColorStop(0, ribbon.colors[0]);
      gradient.addColorStop(0.52, ribbon.colors[1]);
      gradient.addColorStop(1, ribbon.colors[2]);

      const pointerPull = (pointer.y - 0.5) * 44;
      const scrollPull = (window.scrollY || 0) * 0.018;

      context.beginPath();
      for (let x = -80; x <= width + 80; x += 18) {
        const waveA = Math.sin(x * 0.0065 + time * ribbon.speed + index * 1.7) * ribbon.amp;
        const waveB = Math.cos(x * 0.014 - time * ribbon.speed * 0.72 + index) * ribbon.amp * 0.34;
        const drift = Math.sin(time * 0.00022 + index) * 24;
        const y = height * ribbon.base + waveA + waveB + drift + pointerPull + scrollPull;
        if (x === -80) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      context.strokeStyle = gradient;
      context.lineWidth = ribbon.width;
      context.shadowBlur = 18;
      context.shadowColor = ribbon.colors[1];
      context.stroke();

      context.beginPath();
      for (let x = -80; x <= width + 80; x += 24) {
        const waveA = Math.sin(x * 0.008 + time * ribbon.speed * 1.2 + index) * ribbon.amp * 0.42;
        const waveB = Math.cos(x * 0.016 + time * ribbon.speed * 0.6) * ribbon.amp * 0.18;
        const y = height * ribbon.base + waveA + waveB + pointerPull * 0.35 + scrollPull * 0.3;
        if (x === -80) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      context.strokeStyle = ribbon.colors[1].replace(/0\.\d+\)/, '0.18)');
      context.lineWidth = ribbon.width * 5;
      context.shadowBlur = 0;
      context.stroke();
    }

    function draw(time) {
      window.__fluidMotionFrames = (window.__fluidMotionFrames || 0) + 1;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      ribbons.forEach((ribbon, index) => drawRibbon(ribbon, index, time));

      context.globalCompositeOperation = 'source-over';
      frameId = window.requestAnimationFrame(draw);
    }

    function updatePointer(event) {
      pointer.x = event.clientX / Math.max(width, 1);
      pointer.y = event.clientY / Math.max(height, 1);
    }

    resize();
    setupMotionReveals();
    frameId = window.requestAnimationFrame(draw);

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', updatePointer, { passive: true });
    prefersReducedMotion.addEventListener('change', (event) => {
      if (event.matches) {
        window.cancelAnimationFrame(frameId);
        canvas.remove();
      }
    });
  }

  /* =========================================================
     INIT — wire everything up on DOM ready
     ========================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    hardenExternalLinks();
    setupAdmissionsPrefill();
    setupModalEscape();

    const isCompactScreen = window.matchMedia('(max-width: 767px)').matches;
    if (!isCompactScreen) setupFluidMotion();

    setupScrollProgress();
    if (!isCompactScreen) {
      setupParticleSystem();
      setupParallaxScroll();
      injectMorphBlobs();
      injectGlowOrbs();
      setupMagneticHover();
    }
    setupTextScramble();
    setupRippleEffect();
    setupAnimatedCounters();
    setupShimmerCards();
    setupAnimatedUnderlines();
    setupPulseBorders();
    setupNavScrollBehavior();
  });
})();
