/* ================================================================
   ALAN BONILLA SANTOS — Portfolio JavaScript v2
   Starfield · Typewriter · Scroll Reveal · Nav · Modals · Gallery · Form
   ================================================================ */

// ── STARFIELD ──────────────────────────────────────────────────────
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
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.3 + 0.05,
        twSpeed: Math.random() * 0.015 + 0.005,
        twDir: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.a += s.twSpeed * s.twDir;
      if (s.a > 1 || s.a < 0.1) s.twDir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${s.a * 0.8})`;
      ctx.fill();
      if (s.r > 1.1) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${s.a * 0.04})`;
        ctx.fill();
      }
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

  window.addEventListener('resize', () => { resize(); createStars(200); });
  init();
})();


// ── TYPEWRITER ─────────────────────────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'Mechanical Engineering Student',
    'Adaptive Optics Researcher',
    'Rocket Propulsion Engineer',
    'Biomedical Imaging Developer',
    'NSF CELL-MET Researcher',
  ];
  let pi = 0, ci = 0, del = false;

  function tick() {
    const phrase = phrases[pi];
    if (del) {
      el.textContent = phrase.slice(0, ci--);
      if (ci < 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 500); return; }
      setTimeout(tick, 40);
    } else {
      el.textContent = phrase.slice(0, ci++);
      if (ci > phrase.length) { del = true; setTimeout(tick, 2200); return; }
      setTimeout(tick, 65);
    }
  }
  setTimeout(tick, 1200);
})();


// ── NAVBAR SCROLL STATE ────────────────────────────────────────────
(function initNavScroll() {
  const nav = document.getElementById('navbar');
  function update() { nav.classList.toggle('scrolled', window.scrollY > 60); }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();


// ── MOBILE NAV ─────────────────────────────────────────────────────
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
})();


// ── SCROLL REVEAL ──────────────────────────────────────────────────
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(i => observer.observe(i));
})();


// ── GALLERY SWITCHER ───────────────────────────────────────────────
// Allows thumbnail clicks to update the main gallery image
function setGalleryMain(galleryId, src, caption) {
  // Find nearest project-feature containing the gallery
  const thumbEl = event.target.closest('.thumb');
  if (!thumbEl) return;
  const galleryEl = thumbEl.closest('.pf-gallery');
  if (!galleryEl) return;

  const mainImg  = galleryEl.querySelector('.gallery-main img');
  const mainCap  = galleryEl.querySelector('.gallery-caption');

  if (mainImg) {
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = src;
      mainImg.alt = caption;
      mainImg.style.opacity = '1';
    }, 150);
  }
  if (mainCap) mainCap.textContent = caption;
}


// ── MODAL SYSTEM ───────────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById('modal-' + id);
  if (!el) return;
  el.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const el = document.getElementById('modal-' + id);
  if (!el) return;
  el.classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(event, id) {
  if (event.target === event.currentTarget) closeModal(id);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(el => {
      el.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});


// ── CONTACT FORM ───────────────────────────────────────────────────
// To wire up real email delivery, uncomment the Formspree block below
// and replace YOUR_FORM_ID with your Formspree form ID
function handleFormSubmit() {
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const message = document.getElementById('fmessage').value.trim();

  if (!name || !email || !message) { showToast('Please fill in all required fields.', 'error'); return; }
  if (!isValidEmail(email)) { showToast('Please enter a valid email address.', 'error'); return; }

  // ── Formspree (uncomment to enable) ──
  // fetch('https://formspree.io/f/YOUR_FORM_ID', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, email, subject, message }),
  // })
  // .then(() => { showToast('Message sent! I\'ll be in touch soon.', 'success'); clearForm(); })
  // .catch(() => showToast('Error sending message. Email me directly!', 'error'));

  showToast('Message received! Connect Formspree to enable email delivery.', 'success');
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

function showToast(msg, type = 'success') {
  const existing = document.querySelector('.portfolio-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'portfolio-toast';
  toast.textContent = msg;
  const isOk = type === 'success';
  toast.style.cssText = `
    position:fixed;bottom:2rem;right:2rem;
    background:${isOk ? 'rgba(0,200,255,0.15)' : 'rgba(255,71,87,0.15)'};
    border:1px solid ${isOk ? 'rgba(0,200,255,0.4)' : 'rgba(255,71,87,0.4)'};
    color:${isOk ? '#00c8ff' : '#ff4757'};
    padding:1rem 1.5rem;border-radius:8px;
    font-family:'JetBrains Mono',monospace;font-size:.8rem;
    backdrop-filter:blur(12px);z-index:99999;max-width:380px;
    animation:toastIn .3s ease;
  `;
  document.body.appendChild(toast);
  if (!document.getElementById('toast-kf')) {
    const s = document.createElement('style');
    s.id = 'toast-kf';
    s.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(s);
  }
  setTimeout(() => { toast.style.opacity='0'; toast.style.transition='opacity .3s ease'; setTimeout(()=>toast.remove(),300); }, 4000);
}


// ── ACTIVE NAV LINK ────────────────────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  function setActive() {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current ? 'var(--cyan)' : '';
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();
