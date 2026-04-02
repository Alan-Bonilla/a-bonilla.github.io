/* ================================================================
   ALAN BONILLA SANTOS — Portfolio JavaScript
   Handles: Starfield, Typewriter, Scroll Reveal, Skill Bars,
            Modal System, Nav Scroll State, Mobile Menu, Form
   ================================================================ */

// ── STARFIELD CANVAS ──────────────────────────────────────────────
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.a += s.twinkleSpeed * s.twinkleDir;
      if (s.a > 1 || s.a < 0.1) s.twinkleDir *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${s.a * 0.8})`;
      ctx.fill();

      // Very faint cyan tint for some
      if (s.r > 1.1) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${s.a * 0.04})`;
        ctx.fill();
      }

      // Slow drift
      s.y += s.speed * 0.1;
      if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
    }
    animId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    createStars(200);
    cancelAnimationFrame(animId);
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    createStars(200);
  });

  init();
})();


// ── TYPEWRITER ────────────────────────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Mechanical Engineering Student',
    'Aerospace Systems Researcher',
    'Adaptive Optics Developer',
    'Rocket Propulsion Enthusiast',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false, pauseTimer = null;

  function tick() {
    const phrase = phrases[phraseIdx];
    if (deleting) {
      el.textContent = phrase.slice(0, charIdx--);
      if (charIdx < 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        pauseTimer = setTimeout(tick, 500);
        return;
      }
      setTimeout(tick, 40);
    } else {
      el.textContent = phrase.slice(0, charIdx++);
      if (charIdx > phrase.length) {
        deleting = true;
        pauseTimer = setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 65);
    }
  }

  setTimeout(tick, 1200);
})();


// ── NAVBAR SCROLL STATE ───────────────────────────────────────────
(function initNavScroll() {
  const nav = document.getElementById('navbar');
  function update() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();


// ── MOBILE NAV TOGGLE ─────────────────────────────────────────────
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();


// ── SCROLL REVEAL ─────────────────────────────────────────────────
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
})();


// ── SKILL BAR ANIMATION ───────────────────────────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const w = bar.dataset.width || 0;
        // Small delay so reveal animation finishes first
        setTimeout(() => { bar.style.width = w + '%'; }, 400);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(b => observer.observe(b));
})();


// ── MODAL SYSTEM ──────────────────────────────────────────────────
function openModal(id) {
  const overlay = document.getElementById('modal-' + id);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const overlay = document.getElementById('modal-' + id);
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(event, id) {
  if (event.target === event.currentTarget) closeModal(id);
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(el => {
      el.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});


// ── CONTACT FORM (demo handler) ────────────────────────────────────
// To connect to real email: use Formspree.io or EmailJS
// Replace this function with your preferred service
function handleFormSubmit() {
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const message = document.getElementById('fmessage').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  // ── Formspree integration (uncomment & replace YOUR_FORM_ID) ──
  // fetch('https://formspree.io/f/YOUR_FORM_ID', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, email, subject, message }),
  // }).then(() => {
  //   showToast('Message sent! I\'ll be in touch soon.', 'success');
  //   clearForm();
  // }).catch(() => showToast('Error sending message.', 'error'));

  // Demo feedback:
  showToast('Message received! (Connect Formspree to enable email delivery)', 'success');
  clearForm();
}

function clearForm() {
  ['fname','femail','fsubject','fmessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Toast notification
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem;
    background: ${type === 'success' ? 'rgba(0,200,255,0.15)' : 'rgba(255,71,87,0.15)'};
    border: 1px solid ${type === 'success' ? 'rgba(0,200,255,0.4)' : 'rgba(255,71,87,0.4)'};
    color: ${type === 'success' ? '#00c8ff' : '#ff4757'};
    padding: 1rem 1.5rem; border-radius: 8px;
    font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;
    backdrop-filter: blur(12px);
    z-index: 99999; max-width: 360px;
    animation: toastIn 0.3s ease;
  `;
  document.body.appendChild(toast);

  // Inject keyframe if not present
  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
      @keyframes toastIn {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}


// ── ACTIVE NAV LINK HIGHLIGHTING ──────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function setActive() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--cyan)'
        : '';
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();
