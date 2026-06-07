/* shared.js — DX BIOCODE Shared JavaScript */
'use strict';

/* ====== SCROLL PROGRESS BAR ====== */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (total > 0) progressBar.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

/* ====== NAV GLASS BLUR ON SCROLL ====== */
const navEl = document.querySelector('nav');
if (navEl) {
  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ====== FADE-UP SCROLL ANIMATION ====== */
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
fadeEls.forEach(el => fadeObserver.observe(el));

/* ====== ACTIVE NAV HIGHLIGHT ====== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navSectionObserver.observe(s));

/* ====== MOBILE HAMBURGER MENU ====== */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const navOverlay = document.getElementById('nav-overlay');
function closeMobileNav() {
  hamburger && hamburger.classList.remove('open');
  mobileNav && mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
}
if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);
document.querySelectorAll('.mob-link, .mob-cta').forEach(a => a.addEventListener('click', closeMobileNav));

/* ====== SEARCH ====== */
const searchBtn = document.getElementById('nav-search-btn');
const searchBox = document.getElementById('nav-search-box');
const searchInput = document.getElementById('nav-search-input');
const searchResults = document.getElementById('search-results-dropdown');

const PRODUCTS_DB = [
  { name: 'DX 101 Immunofluorescence Quantitative Analyzer', category: 'POCT Analyzer', img: 'hero.webp', href: 'products.html#dx101' },
  { name: 'Cardiac Markers Test Panel', category: 'Test Consumables', img: 'hero.webp', href: 'products.html#test-menu' },
  { name: 'Thyroid Function Test Panel', category: 'Test Consumables', img: 'hero.webp', href: 'products.html#test-menu' },
  { name: 'Infectious Disease Panel', category: 'Test Consumables', img: 'hero.webp', href: 'products.html#test-menu' },
  { name: 'Fertility Panel', category: 'Test Consumables', img: 'hero.webp', href: 'products.html#test-menu' },
  { name: 'Tumor Markers Panel', category: 'Test Consumables', img: 'hero.webp', href: 'products.html#test-menu' },
];

if (searchBtn && searchBox) {
  searchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    searchBox.classList.toggle('open');
    if (searchBox.classList.contains('open')) searchInput.focus();
  });
  document.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target) && e.target !== searchBtn) {
      searchBox.classList.remove('open');
    }
  });
  searchInput && searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { searchResults.innerHTML = ''; return; }
    const matches = PRODUCTS_DB.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    if (!matches.length) {
      searchResults.innerHTML = '<div class="search-no-results">No products found</div>';
      return;
    }
    searchResults.innerHTML = matches.map(p => `
      <a href="${p.href}" class="search-result-item">
        <img src="${p.img}" alt="${p.name}" />
        <div>
          <div class="sri-name">${p.name}</div>
          <div class="sri-cat">${p.category}</div>
        </div>
      </a>`).join('');
  });
}

/* ====== CART ====== */
let cart = JSON.parse(localStorage.getItem('dx-cart') || '[]');

function saveCart() { localStorage.setItem('dx-cart', JSON.stringify(cart)); }

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = cart.length;
    badge.classList.add('bump');
    setTimeout(() => badge.classList.remove('bump'), 300);
  }
}

function renderCart() {
  const list = document.getElementById('cart-items-list');
  const emptyEl = document.getElementById('cart-empty');
  const footerEl = document.getElementById('cart-footer');
  if (!list) return;

  if (!cart.length) {
    list.innerHTML = '<div class="cart-empty" id="cart-empty"><div style="font-size:48px;margin-bottom:12px;">🛒</div><p>Your cart is empty</p><a href="products.html" class="btn-primary" style="margin-top:16px;font-size:14px;padding:10px 20px;">Browse Products</a></div>';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  list.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${idx})">✕</button>
    </div>`).join('');

  if (footerEl) footerEl.style.display = 'block';
  const totalEl = document.getElementById('cart-total-price');
  if (totalEl) totalEl.textContent = 'Contact for Pricing';
}

window.addToCart = function(name, price, img) {
  cart.push({ name, price, img });
  saveCart();
  updateCartBadge();
  renderCart();
  openCart();
};

window.removeFromCart = function(idx) {
  cart.splice(idx, 1);
  saveCart();
  updateCartBadge();
  renderCart();
};

function openCart() {
  const panel = document.getElementById('cart-panel');
  if (panel) { panel.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeCart() {
  const panel = document.getElementById('cart-panel');
  if (panel) { panel.classList.remove('open'); document.body.style.overflow = ''; }
}

const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartCloseBtn = document.getElementById('cart-close-btn');
if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);

updateCartBadge();
renderCart();

/* ====== BUTTON RIPPLE ====== */
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-white, .btn-outline-white').forEach(btn => {
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.addEventListener('click', function(e) {
    const r = this.getBoundingClientRect();
    const sz = Math.max(r.width, r.height) * 2;
    const span = document.createElement('span');
    span.className = 'ripple-span';
    span.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX-r.left-sz/2}px;top:${e.clientY-r.top-sz/2}px;`;
    this.appendChild(span);
    setTimeout(() => span.remove(), 700);
  });
});

/* ====== 3D CARD TILT ====== */
document.querySelectorAll('.feature-card, .test-cat-card, .product-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const r = this.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const base = this.classList.contains('feature-card') ? 'translateX(4px)' : '';
    this.style.transform = `${base} perspective(600px) rotateX(${(-y*10).toFixed(1)}deg) rotateY(${(x*10).toFixed(1)}deg) scale(1.025)`;
  });
  card.addEventListener('mouseleave', function() { this.style.transform = ''; });
});

/* ====== STAT COUNTER ====== */
function animateCounter(el) {
  const raw = el.dataset.raw || el.textContent;
  el.dataset.raw = raw;
  const m = raw.match(/([\d,]+)/);
  if (!m) return;
  const target = parseInt(m[1].replace(/,/g, ''));
  const before = raw.slice(0, raw.indexOf(m[0]));
  const after = raw.slice(raw.indexOf(m[0]) + m[0].length);
  const dur = 1800, t0 = performance.now();
  const tick = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const v = Math.round(eased * target);
    el.textContent = before + (target >= 1000 ? v.toLocaleString() : v) + after;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
}, { threshold: 0.7 });
document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));

/* ====== IMAGE PROTECTION ====== */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('contextmenu', e => e.preventDefault());
  img.addEventListener('dragstart', e => e.preventDefault());
});

/* ====== FORM VALIDATION HELPER ====== */
window.initContactForm = function(formId, statusId) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) { input.classList.add('invalid'); isValid = false; }
      else if (input.type === 'email' && !/\S+@\S+\.\S+/.test(input.value)) { input.classList.add('invalid'); isValid = false; }
      else input.classList.remove('invalid');
    });
    if (status) { status.className = 'form-status'; status.style.display = 'none'; }
    if (isValid) {
      const btn = form.querySelector('button[type="submit"]');
      const origText = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = '⌛ Sending...'; }
      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.innerHTML = origText; }
        if (status) { status.textContent = '🎉 Thank you! Your submission was received successfully.'; status.classList.add('success'); }
        form.reset();
      }, 1200);
    } else {
      if (status) { status.textContent = '❌ Please correct the errors before submitting.'; status.classList.add('error'); }
    }
  });
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', function() { if (this.value.trim()) this.classList.remove('invalid'); });
  });
};

/* ====== CONSOLE WARNING ====== */
if (typeof console !== 'undefined') {
  console.log('%c⚠️ Warning!', 'color:red;font-size:24px;font-weight:bold;');
  console.log('%cDo not paste any code here — it can compromise site security.', 'color:#1a2340;font-size:14px;');
}
