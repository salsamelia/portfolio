/* ============================================================
   SALSA'S PAGE — main.js (Updated)
   ============================================================ */

/* ── Year ── */
document.querySelectorAll('#yr').forEach(el => el.textContent = new Date().getFullYear());

/* ── Theme ── */
const html = document.documentElement;
const saved = localStorage.getItem('sas-theme') || 'dark';
html.setAttribute('data-theme', saved);
syncIcons(saved);

function syncIcons(t) {
  document.querySelectorAll('#th-ic,#th-ic-m').forEach(el => {
    el.textContent = t === 'dark' ? '☀' : '☾';
  });
}
function toggleTheme() {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('sas-theme', next);
  syncIcons(next);
}
document.querySelectorAll('#th-btn,#th-btn-m').forEach(b => b.addEventListener('click', toggleTheme));

/* ── Header scroll ── */
const hdr = document.getElementById('hdr');
if (hdr) window.addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 30), { passive: true });

/* ── Hamburger ── */
const hbg = document.getElementById('hbg');
const mobMenu = document.getElementById('mob-menu');
if (hbg && mobMenu) {
  hbg.addEventListener('click', () => {
    const o = mobMenu.classList.toggle('open');
    hbg.classList.toggle('open', o);
  });
}

/* ── Custom Cursor ── */
const ring = document.getElementById('cur-ring');
const dot  = document.getElementById('cur-dot');
if (ring && dot && matchMedia('(pointer:fine)').matches) {
  let rx = -100, ry = -100, dx = -100, dy = -100, mx = -100, my = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
    dx += (mx - dx) * 0.6; dy += (my - dy) * 0.6;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    dot.style.left  = dx + 'px'; dot.style.top  = dy + 'px';
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', e => {
    const t = e.target;
    const ia = t.tagName==='A' || t.tagName==='BUTTON' ||
               t.closest('a') || t.closest('button') ||
               t.classList.contains('os-win') || t.closest('.os-win') ||
               t.classList.contains('exp-win') || t.closest('.exp-win');
    ring.classList.toggle('ptr', !!ia);
    dot.classList.toggle('ptr',  !!ia);
  });
  document.documentElement.addEventListener('mouseleave', () => { ring.style.opacity='0'; dot.style.opacity='0'; });
  document.documentElement.addEventListener('mouseenter', () => { ring.style.opacity=''; dot.style.opacity=''; });
}

/* ── Preloader (home only) ── */
(function() {
  const pl = document.getElementById('preloader');
  if (!pl) return;
  const isHome = !!document.querySelector('.pg-home');
  if (!isHome) { pl.style.display = 'none'; return; }

  const countEl = document.getElementById('pl-count');
  const barEl   = document.getElementById('pl-bar');
  const ca      = document.getElementById('curtain-a');
  const cb      = document.getElementById('curtain-b');
  let n = 0;
  const timer = setInterval(() => {
    n++;
    if (countEl) countEl.textContent = String(n).padStart(3, '0');
    if (barEl)   barEl.style.width = n + '%';
    if (n >= 100) {
      clearInterval(timer);
      setTimeout(() => { if (ca) ca.classList.add('rise'); }, 100);
      setTimeout(() => { if (cb) cb.classList.add('rise'); }, 250);
      setTimeout(() => {
        pl.classList.add('gone');
        setTimeout(() => pl.style.display = 'none', 450);
      }, 700);
    }
  }, 1800 / 100);
})();

/* ── Scroll Reveal ── */
(function() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const siblings = [...e.target.parentElement.querySelectorAll('.reveal:not(.in)')];
      const delay = Math.min(siblings.indexOf(e.target) * 65, 300);
      setTimeout(() => e.target.classList.add('in'), delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '-20px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ── Language bars ── */
(function() {
  const bars = document.querySelectorAll('.lang-fill');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.pct + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => obs.observe(b));
})();

/* ── Mouse parallax for hero photo ── */
(function() {
  const ph = document.getElementById('hero-photo');
  if (!ph) return;
  document.addEventListener('mousemove', e => {
    const x = ((e.clientX - innerWidth / 2) / innerWidth) * 14;
    const y = ((e.clientY - innerHeight / 2) / innerHeight) * 9;
    ph.style.transform = `translate(${x}px,${y}px)`;
  });
})();

/* ── Ticker duplicate ── */
(function() {
  const t = document.getElementById('ticker');
  if (!t) return;
  t.innerHTML += t.innerHTML;
})();

/* ================================================================
   OS WINDOWS — About page (click = highlight + expand in place)
================================================================ */
(function() {
  const wins = document.querySelectorAll('.os-win[data-win]');
  if (!wins.length) return;
  wins.forEach(win => {
    win.addEventListener('click', () => {
      const wasActive = win.classList.contains('active');
      wins.forEach(w => w.classList.remove('active'));
      if (!wasActive) win.classList.add('active');
    });
  });
})();

/* ================================================================
   EXPERIENCE WINDOWS — click = highlight + open modal
================================================================ */
(function() {
  const wins    = document.querySelectorAll('.exp-win[data-modal]');
  const overlay = document.getElementById('exp-overlay');
  const modal   = document.getElementById('exp-modal');
  const body    = document.getElementById('exp-modal-body');
  const closeBtn = document.getElementById('exp-close');
  if (!wins.length || !overlay || !modal || !body) return;

  wins.forEach(win => {
    win.addEventListener('click', () => {
      const id    = win.dataset.modal;
      const tmpl  = document.getElementById(id);
      if (!tmpl) return;

      wins.forEach(w => w.classList.remove('active'));
      win.classList.add('active');

      body.innerHTML = '';
      body.appendChild(tmpl.content.cloneNode(true));
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    wins.forEach(w => w.classList.remove('active'));
  }
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ================================================================
   HSCROLL PROGRESS BARS
================================================================ */
(function() {
  const sections = document.querySelectorAll('.exp-sec');
  sections.forEach(sec => {
    const track = sec.querySelector('.hscroll');
    const fill  = sec.querySelector('.hprogress-fill');
    if (!track || !fill) return;
    function update() {
      const max = track.scrollWidth - track.clientWidth;
      const pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
      fill.style.width = Math.max(20, pct) + '%';
    }
    update();
    track.addEventListener('scroll', update, { passive: true });
  });
})();

/* ================================================================
   LIGHTBOX — click modal images to enlarge
================================================================ */
(function() {
  // Inject lightbox DOM once
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.className = 'lightbox-overlay';
  lb.innerHTML = '<button class="lightbox-close" id="lb-close">✕ TUTUP</button><img class="lightbox-img" id="lb-img" src="" alt="">';
  document.body.appendChild(lb);

  const lbImg   = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');

  function openLb(src, alt) {
    lbImg.src = src; lbImg.alt = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  // Delegate: listen for clicks on .modal-img inside the modal body
  document.addEventListener('click', e => {
    const img = e.target.closest('.modal-img');
    if (!img) return;
    openLb(img.src, img.alt);
  });

  // Mark cards that have real images (not placeholders)
  function markImgCards() {
    document.querySelectorAll('.modal-img-card').forEach(card => {
      const img = card.querySelector('.modal-img');
      if (img) {
        card.classList.add('has-img');
        card.style.cursor = 'zoom-in';
      }
    });
  }

  // Re-check after modal opens (images injected via template)
  const expOverlay = document.getElementById('exp-overlay');
  if (expOverlay) {
    const obs = new MutationObserver(markImgCards);
    obs.observe(expOverlay, { childList: true, subtree: true });
  }
})();
