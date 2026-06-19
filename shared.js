/* shared.js — DX BIOCODE Shared JavaScript */
'use strict';

/* ====== HTML ESCAPE HELPER (XSS Protection) ====== */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
    const isOpen = mobileNav.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}
if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);
document.querySelectorAll('.mob-link, .mob-cta').forEach(a => a.addEventListener('click', closeMobileNav));

/* ====== SEARCH ====== */
const searchBtn = document.getElementById('nav-search-btn');
let searchBox = document.getElementById('nav-search-box');
let searchInput = document.getElementById('nav-search-input');
let searchResults = document.getElementById('search-results-dropdown');

let PRODUCTS_DB = [
  { name: 'DX 101 Immunofluorescence Quantitative Analyzer', category: 'POCT Analyzer', img: '/hero.webp', href: '/products.html#dx101' },
  { name: 'Cardiac Markers Test Panel', category: 'Test Consumables', img: '/hero.webp', href: '/index.html#test-menu' },
  { name: 'Thyroid Function Test Panel', category: 'Test Consumables', img: '/hero.webp', href: '/index.html#test-menu' },
  { name: 'Infectious Disease Panel', category: 'Test Consumables', img: '/hero.webp', href: '/index.html#test-menu' },
  { name: 'Fertility Panel', category: 'Test Consumables', img: '/hero.webp', href: '/index.html#test-menu' },
  { name: 'Tumor Markers Panel', category: 'Test Consumables', img: '/hero.webp', href: '/index.html#test-menu' },
];

let PRODUCT_MAP = {};

fetch('/data/index.json')
  .then(r => r.json())
  .then(data => {
    if (Array.isArray(data)) {
      data.forEach(p => {
        PRODUCT_MAP[p.name] = p;
      });
      PRODUCTS_DB = data.map(p => ({
        name: p.name,
        category: p.category,
        img: p.type === 'analyzer' ? '/hero.webp' : '/placeholder.svg',
        href: `/products/${p.slug}/`
      }));
      // Call renderCart again to update categorizations/badges asynchronously
      renderCart();
    }
  })
  .catch(e => console.warn('Could not load products search database dynamically. Using static fallback.', e));


if (searchBtn && searchBox) {
  // Upgrade to Global Search Modal (Phase 2)
  document.body.appendChild(searchBox);
  
  searchBox.innerHTML = `
    <div class="search-modal-content" onclick="event.stopPropagation()">
      <div class="search-modal-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" style="margin-left: 12px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="search" id="nav-search-input" placeholder="Search for test kits, analyzers, or categories..." autocomplete="off" />
        <button class="search-close-btn" id="search-close-btn">ESC</button>
      </div>
      <div class="search-results-dropdown" id="search-results-dropdown"></div>
    </div>
  `;
  
  searchInput = document.getElementById('nav-search-input');
  searchResults = document.getElementById('search-results-dropdown');
  const searchCloseBtn = document.getElementById('search-close-btn');

  const closeSearch = () => {
    searchBox.classList.remove('open');
    searchBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openSearch = (e) => {
    e.stopPropagation();
    searchBox.classList.add('open');
    searchBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 100);
  };

  searchBtn.addEventListener('click', openSearch);
  searchBox.addEventListener('click', closeSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchBox.classList.contains('open')) {
      closeSearch();
    }
  });

  searchInput && searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { searchResults.innerHTML = ''; return; }
    const matches = PRODUCTS_DB.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    if (!matches.length) {
      searchResults.innerHTML = '';
      const noResults = document.createElement('div');
      noResults.className = 'search-no-results';
      noResults.textContent = 'No products found for "' + q + '"';
      searchResults.appendChild(noResults);
      return;
    }
    searchResults.innerHTML = '';
    matches.forEach(p => {
      const a = document.createElement('a');
      a.href = p.href || '#';
      a.className = 'search-result-item';

      const img = document.createElement('img');
      img.src = p.img || '/placeholder.svg';
      img.alt = p.name || '';
      a.appendChild(img);

      const infoDiv = document.createElement('div');

      const nameDiv = document.createElement('div');
      nameDiv.className = 'sri-name';
      nameDiv.textContent = p.name || '';
      infoDiv.appendChild(nameDiv);

      const catDiv = document.createElement('div');
      catDiv.className = 'sri-cat';
      catDiv.textContent = p.category || '';
      infoDiv.appendChild(catDiv);

      a.appendChild(infoDiv);
      searchResults.appendChild(a);
    });
  });
}

/* ====== CART ====== */
let cart = JSON.parse(localStorage.getItem('dx-cart') || '[]');

// Standardize cart items to prevent legacy objects without quantity
cart = cart.map(item => {
  if (item.quantity === undefined) item.quantity = 1;
  return item;
});

function saveCart() { localStorage.setItem('dx-cart', JSON.stringify(cart)); }

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    badge.textContent = totalCount;
    badge.classList.add('bump');
    setTimeout(() => badge.classList.remove('bump'), 300);
  }
}

function renderCart() {
  const list = document.getElementById('cart-items-list');
  const footerEl = document.getElementById('cart-footer');
  if (!list) return;

  // Dynamically update the header
  const header = document.querySelector('.cart-panel-header');
  if (header) {
    header.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:2px;">
        <h3 style="font-family:'Space Grotesk',sans-serif; font-size:16px; font-weight:800; color:var(--text-dark); margin:0; display:flex; align-items:center; gap:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="color:var(--blue-primary)"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
          Request a Quote
        </h3>
        <p style="font-size:10.5px; color:var(--text-light); margin:0;">Configure your diagnostic kit selection</p>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        ${cart.length ? `<button onclick="clearQuoteCart()" style="background:none; border:none; color:var(--text-light); font-size:10.5px; font-weight:600; cursor:pointer; padding:4px 8px; border-radius:6px; transition:color 0.2s, background 0.2s;" onmouseover="this.style.color='#ef4444';this.style.background='#fef2f2'" onmouseout="this.style.color='var(--text-light)';this.style.background='none'">Clear all</button>` : ''}
        <button class="cart-close-btn" id="cart-close-btn" style="position:static; margin:0; padding:6px 10px; font-size:16px;">✕</button>
      </div>
    `;
    const closeBtn = document.getElementById('cart-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
  }

  if (!cart.length) {
    list.innerHTML = `<div class="cart-empty" id="cart-empty" style="text-align:center; padding:56px 24px;">
      <div style="width:60px; height:60px; background:var(--brand-gradient-soft); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:28px; border:1px solid var(--border-subtle);">📋</div>
      <p style="font-size:14px; font-weight:600; color:var(--text-dark); margin-bottom:4px;">No products selected yet</p>
      <p style="font-size:12.5px; color:var(--text-light); margin-bottom:20px;">Add diagnostic test kits to build your quote</p>
      <a href="/products.html" class="btn-primary" style="font-size:13px; padding:10px 20px; text-decoration:none; display:inline-flex; justify-content:center;">Browse Products →</a>
    </div>`;
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  // Category Colors Map
  const categoryColors = {
    "Cardiac Markers": { bg: "#fff1f2", border: "#fecdd3", color: "#e11d48" },
    "Thyroid Function": { bg: "#fff7ed", border: "#ffedd5", color: "#ea580c" },
    "Inflammation": { bg: "#f5f3ff", border: "#ddd6fe", color: "#7c3aed" },
    "Infectious Diseases": { bg: "#ecfdf5", border: "#a7f3d0", color: "#059669" },
    "Fertility": { bg: "#fdf2f8", border: "#fce7f3", color: "#db2777" },
    "Tumor Markers": { bg: "#f0fdfa", border: "#ccfbf1", color: "#0d9488" },
    "Renal Function": { bg: "#eff6ff", border: "#dbeafe", color: "#2563eb" },
    "Rheumatology": { bg: "#fffbeb", border: "#fef3c7", color: "#d97706" },
    "Diabetes": { bg: "#faf5ff", border: "#f3e8ff", color: "#9333ea" },
    "Metabolic": { bg: "#f0fdf4", border: "#dcfce7", color: "#16a34a" },
    "Other Tests": { bg: "#f8fafc", border: "#e2e8f0", color: "#475569" }
  };

  const categoryIcons = {
    "Cardiac Markers": "❤️",
    "Thyroid Function": "🩺",
    "Inflammation": "🔥",
    "Infectious Diseases": "🦠",
    "Fertility": "🌸",
    "Tumor Markers": "🏷️",
    "Renal Function": "🫘",
    "Rheumatology": "🧬",
    "Diabetes": "🩸",
    "Metabolic": "⚗️",
    "Other Tests": "🔬"
  };

  // Group items by category
  const groups = {};
  let hasTestKit = false;
  let hasAnalyzer = false;

  cart.forEach((item, idx) => {
    const info = PRODUCT_MAP[item.name] || {};
    const category = info.category || "Other Products";
    if (!groups[category]) groups[category] = [];
    groups[category].push({ item, originalIndex: idx, info });
    if (info.type === 'test-kit') hasTestKit = true;
    if (info.slug === 'dx-101') hasAnalyzer = true;
  });

  let listHtml = '';

  for (const [category, groupItems] of Object.entries(groups)) {
    const style = categoryColors[category] || { bg: "#f1f5f9", border: "#e2e8f0", color: "#475569" };
    const icon = categoryIcons[category] || "📦";
    const count = groupItems.reduce((s, g) => s + (g.item.quantity || 1), 0);

    listHtml += `
      <div class="quote-category-group" data-cat="${category}">
        <div class="quote-category-header" style="color:${style.color}; background:${style.bg}; border-left:3px solid ${style.color};" onclick="toggleCategory(this.closest('.quote-category-group'))">
          <span style="display:flex;align-items:center;gap:7px;">
            <span style="font-size:13px;">${icon}</span>
            <span>${category}</span>
            <span style="background:${style.color}; color:white; font-size:9px; font-weight:800; padding:1px 7px; border-radius:10px; opacity:0.85;">${count}</span>
          </span>
          <span class="quote-category-chevron">▼</span>
        </div>
        <div class="quote-category-items">
          ${groupItems.map(g => {
      const item = g.item;
      const idx = g.originalIndex;
      const info = g.info;
      const specs = info.specifications || {};
      const testTime = specs['Test Time'] || specs['Result Time'] || '3–15 min';

      return `
              <div class="quote-item adding" id="quote-item-${idx}">
                <img src="${item.img || '/placeholder.svg'}" alt="${item.name}" class="quote-item-img" />
                <div class="quote-item-info" style="flex:1; min-width:0;">
                  <div class="quote-item-name" title="${item.name}">${item.name}</div>
                  <div class="quote-item-spec">⏱ ${testTime}</div>
                  <span class="quote-item-badge" style="background:${style.bg}; border:1px solid ${style.border}; color:${style.color};">${category}</span>
                  <div class="quote-item-controls">
                    <div class="quote-qty-wrap">
                      <button class="quote-qty-btn" onclick="updateQty(${idx}, -1)">−</button>
                      <span class="quote-qty-val" id="qty-val-${idx}">${item.quantity || 1}</span>
                      <button class="quote-qty-btn" onclick="updateQty(${idx}, 1)">+</button>
                    </div>
                    <button class="quote-remove-btn" onclick="removeFromCart(${idx})" title="Remove">✕ Remove</button>
                  </div>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;
  }

  list.innerHTML = listHtml;

  // Remove the adding class after animation completes
  setTimeout(() => {
    list.querySelectorAll('.quote-item.adding').forEach(el => el.classList.remove('adding'));
  }, 400);

  // Summary metrics
  const totalProducts = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const uniqueCategories = new Set(cart.map(item => {
    const info = PRODUCT_MAP[item.name] || {};
    return info.category || "General";
  }));
  const totalCategories = uniqueCategories.size;

  // Recommended Analyzer Card
  let recommendationCardHtml = '';
  if (hasTestKit && !hasAnalyzer) {
    recommendationCardHtml = `
      <div class="analyzer-recommendation">
        <div class="analyzer-rec-label">Recommended Device</div>
        <div class="analyzer-rec-body">
          <img src="/hero.webp" alt="DX 101 Analyzer" class="analyzer-rec-img" />
          <div class="analyzer-rec-info">
            <div class="analyzer-rec-name">DX 101 Immunofluorescence Analyzer</div>
            <div class="analyzer-rec-desc">Required for running selected diagnostic test kits at the point of care.</div>
          </div>
        </div>
        <div class="analyzer-rec-actions">
          <a href="/products/dx-101/" class="analyzer-rec-btn-secondary" target="_blank">View Device</a>
          <button class="analyzer-rec-btn-primary" onclick="addAnalyzerRecommendation()">+ Add to Quote</button>
        </div>
      </div>
    `;
  }

  // Footer with summary + CTA
  if (footerEl) {
    footerEl.style.display = 'block';

    let quotePath = 'quote.html';
    if (window.location.pathname.includes('/products/')) {
      quotePath = '../../quote.html';
    }

    footerEl.innerHTML = `
      ${recommendationCardHtml}

      <!-- Quote Summary -->
      <div class="quote-summary-block">
        <div class="quote-summary-title">Quote Summary</div>
        <div class="quote-summary-row">
          <span class="quote-summary-label">📦 Products Selected</span>
          <span class="quote-summary-value">${escapeHtml(String(totalProducts))}</span>
        </div>
        <div class="quote-summary-row">
          <span class="quote-summary-label">🏷️ Categories Covered</span>
          <span class="quote-summary-value">${escapeHtml(String(totalCategories))}</span>
        </div>
        <div class="quote-summary-note">Custom pricing available based on volume and region.</div>
      </div>

      <!-- Primary CTA -->
      <a href="${escapeHtml(quotePath)}" class="quote-cta-btn">Request Official Quotation →</a>
    `;
  }
}

window.toggleCategory = function (groupEl) {
  groupEl.classList.toggle('collapsed');
};


window.addToCart = function (name, price, img) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ name, price, img, quantity: 1 });
  }
  saveCart();
  updateCartBadge();
  renderCart();
  openCart();
};

window.removeFromCart = function (idx) {
  const itemEl = document.getElementById('quote-item-' + idx);
  if (itemEl) {
    itemEl.classList.add('removing');
    setTimeout(() => {
      cart.splice(idx, 1);
      saveCart();
      updateCartBadge();
      renderCart();
    }, 280);
  } else {
    cart.splice(idx, 1);
    saveCart();
    updateCartBadge();
    renderCart();
  }
};

window.updateQty = function (idx, change) {
  const item = cart[idx];
  if (item) {
    item.quantity = (item.quantity || 1) + change;
    if (item.quantity <= 0) {
      window.removeFromCart(idx);
      return;
    }
    saveCart();
    updateCartBadge();
    // Animate just the qty value without full re-render for smoothness
    const qtyEl = document.getElementById('qty-val-' + idx);
    if (qtyEl) {
      qtyEl.textContent = item.quantity;
      qtyEl.classList.remove('qty-bump');
      void qtyEl.offsetWidth; // force reflow
      qtyEl.classList.add('qty-bump');
      setTimeout(() => qtyEl.classList.remove('qty-bump'), 260);
    } else {
      renderCart();
    }
  }
};


window.clearQuoteCart = function () {
  if (confirm("Are you sure you want to clear your quote request?")) {
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();
  }
};

window.addAnalyzerRecommendation = function () {
  window.addToCart("DX 101 Immunofluorescence Quantitative Analyzer", "Contact for Pricing", "/hero.webp");
};

function openCart() {
  const panel = document.getElementById('cart-panel');
  const btn = document.getElementById('cart-btn');
  if (panel) { panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  if (btn) btn.setAttribute('aria-expanded', 'true');
}
function closeCart() {
  const panel = document.getElementById('cart-panel');
  const btn = document.getElementById('cart-btn');
  if (panel) { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  if (btn) btn.setAttribute('aria-expanded', 'false');
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
  btn.addEventListener('click', function (e) {
    const r = this.getBoundingClientRect();
    const sz = Math.max(r.width, r.height) * 2;
    const span = document.createElement('span');
    span.className = 'ripple-span';
    span.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - r.left - sz / 2}px;top:${e.clientY - r.top - sz / 2}px;`;
    this.appendChild(span);
    setTimeout(() => span.remove(), 700);
  });
});

/* ====== 3D CARD TILT ====== */
document.querySelectorAll('.feature-card, .test-cat-card, .product-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const r = this.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const base = this.classList.contains('feature-card') ? 'translateX(4px)' : '';
    this.style.transform = `${base} perspective(600px) rotateX(${(-y * 10).toFixed(1)}deg) rotateY(${(x * 10).toFixed(1)}deg) scale(1.025)`;
  });
  card.addEventListener('mouseleave', function () { this.style.transform = ''; });
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

/* ====== FORM VALIDATION HELPER ======
   Pass an endpoint URL as 3rd argument to enable real API submission.
   Without it, falls back to the original mock (backward compat).
   Requires form inputs to have `name` attributes for payload building.
====================================== */
window.initContactForm = function (formId, statusId, endpoint, csrfToken = '') {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const readiness = document.getElementById('form-readiness');
  const msgInput = form.querySelector('textarea[name="message"]');
  const msgCounter = document.getElementById('msg-counter');

  // 1. Smart Prefill - Country (if country field exists)
  try {
    const countryInput = form.querySelector('input[name="country"]');
    if (countryInput && !countryInput.value) {
      const locale = navigator.language;
      if (locale && locale.includes('-')) {
        const countryCode = locale.split('-')[1];
        const regionNames = new Intl.DisplayNames([locale], { type: 'region' });
        countryInput.value = regionNames.of(countryCode) || '';
      }
    }
  } catch (e) { }

  // 2. Character Counter
  if (msgInput && msgCounter) {
    const updateCounter = () => {
      const len = msgInput.value.length;
      msgCounter.textContent = `${len} / 2000 characters`;
      msgCounter.classList.toggle('warning', len > 1800);
    };
    msgInput.addEventListener('input', updateCounter);
    updateCounter();
  }

  // 3. Real-time validation
  const validateForm = () => {
    let allValid = true;
    form.querySelectorAll('[required]').forEach(input => {
      let ok = input.value.trim() !== '';
      if (ok && input.type === 'email') {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      }
      if (!ok) allValid = false;
    });

    if (submitBtn) submitBtn.disabled = !allValid;
    if (readiness) {
      if (allValid) {
        readiness.textContent = 'Ready to submit.';
        readiness.classList.add('ready');
      } else {
        readiness.textContent = 'Complete all required fields to continue.';
        readiness.classList.remove('ready');
      }
    }
    return allValid;
  };

  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', () => {
      if (el.value.trim()) el.classList.remove('invalid');
      validateForm();
    });
    el.addEventListener('blur', () => {
      if (el.hasAttribute('required')) {
        let ok = el.value.trim() !== '';
        if (ok && el.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
        }
        el.classList.toggle('invalid', !ok);
      }
      validateForm();
    });
  });

  validateForm();

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    if (status) { status.className = 'form-status'; status.style.display = 'none'; }

    const origText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '⌛ Sending...'; }

    // Disable all inputs during submission
    const inputs = form.querySelectorAll('input, textarea, select, button');
    inputs.forEach(el => el.disabled = true);

    if (endpoint) {
      // ── Real API submission ──────────────────────────────────
      try {
        const payload = {};
        form.querySelectorAll('input:not([type="file"]), textarea, select').forEach(el => {
          if (el.name === 'phone') {
            // 5. Phone Normalization
            let rawPhone = el.value.trim();
            let cleanPhone = rawPhone;
            if (rawPhone) {
              const isPlus = rawPhone.startsWith('+');
              cleanPhone = rawPhone.replace(/\D/g, '');
              if (isPlus) cleanPhone = '+' + cleanPhone;
            }
            payload[el.name] = cleanPhone;
          } else if (el.name) {
            payload[el.name] = el.value;
          }
        });
        if (!('_bot_check' in payload)) payload['_bot_check'] = '';
        if (csrfToken) payload['csrf_token'] = csrfToken;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // 6. Success State
          form.innerHTML = `
            <div class="form-success-state" style="text-align: center; padding: 40px 20px;">
              <div class="success-icon-wrap" style="width: 64px; height: 64px; background: #eff6ff; color: #2563eb; font-size: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin: 0 auto 24px;">✓</div>
              <h3 class="success-title" style="font-size: 24px; color: #0f172a; margin-bottom: 12px; font-weight: 800;">Message Sent Successfully!</h3>
              <p class="success-desc" style="font-size: 15px; color: #475569; margin-bottom: 32px; line-height: 1.6;">Thank you for getting in touch. Our team has received your message and will contact you within <strong>1–2 business days</strong>.<br><br>For urgent matters, please use WhatsApp.</p>
              <button type="button" class="btn-primary" style="display: inline-flex;" onclick="window.location.reload()">Submit Another Message</button>
            </div>
          `;
        } else {
          inputs.forEach(el => el.disabled = false);
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = origText; }

          if (response.status === 429) {
            if (status) {
              status.textContent = '⏳ Too many requests. Please try again in an hour.';
              status.classList.add('error');
              status.style.display = 'block';
            }
          } else {
            let errMsg = 'Something went wrong.';
            if (result) {
              if (typeof result.error === 'string') errMsg = result.error;
              else if (result.error && typeof result.error === 'object' && result.error.message) errMsg = result.error.message;
              else if (typeof result.message === 'string') errMsg = result.message;
              else if (result.message && typeof result.message === 'object' && result.message.message) errMsg = result.message.message;
            }
            if (status) {
              status.textContent = `❌ ${errMsg} Please email info@dxbiocode.com directly.`;
              status.classList.add('error');
              status.style.display = 'block';
            }
          }
        }
      } catch (_err) {
        inputs.forEach(el => el.disabled = false);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = origText; }
        if (status) {
          status.textContent = '❌ Network error. Please email info@dxbiocode.com directly.';
          status.classList.add('error');
          status.style.display = 'block';
        }
      }
    } else {
      // ── Mock submission (no endpoint provided) ───────────────
      setTimeout(() => {
        form.innerHTML = `
          <div class="form-success-state" style="text-align: center; padding: 40px 20px;">
            <div class="success-icon-wrap" style="width: 64px; height: 64px; background: #eff6ff; color: #2563eb; font-size: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin: 0 auto 24px;">✓</div>
            <h3 class="success-title" style="font-size: 24px; color: #0f172a; margin-bottom: 12px; font-weight: 800;">Message Sent Successfully!</h3>
            <p class="success-desc" style="font-size: 15px; color: #475569; margin-bottom: 32px; line-height: 1.6;">Thank you for getting in touch. Our team has received your message and will contact you within <strong>1–2 business days</strong>.<br><br>For urgent matters, please use WhatsApp.</p>
            <button type="button" class="btn-primary" style="display: inline-flex;" onclick="window.location.reload()">Submit Another Message</button>
          </div>
        `;
      }, 1200);
    }
  });
};


/* ====== PRODUCTS PAGE TAB NAVIGATION ====== */
const tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
const tabPanels = document.querySelectorAll('.tab-panel');

if (tabButtons.length > 0 && tabPanels.length > 0) {
  function switchTab(tabId) {
    // Hide all panels
    tabPanels.forEach(panel => panel.classList.remove('active'));
    // Deactivate all buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Find target panel and button
    const targetPanel = document.getElementById(tabId);
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);

    if (targetPanel && targetBtn) {
      targetPanel.classList.add('active');
      targetBtn.classList.add('active');

      // Make all fade-up elements in the active panel visible immediately
      targetPanel.querySelectorAll('.fade-up').forEach(el => {
        el.classList.add('visible');
      });

      // Scroll to the tab bar smoothly
      const tabBar = document.querySelector('.tab-bar');
      if (tabBar) {
        window.scrollTo({
          top: tabBar.offsetTop - 90,
          behavior: 'smooth'
        });
      }
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId && document.getElementById(tabId) && document.getElementById(tabId).classList.contains('tab-panel')) {
        e.preventDefault();
        switchTab(tabId);
        // Update URL hash without jumping
        history.pushState(null, null, '#' + tabId);
      }
    });
  });

  // Handle direct hash navigation on page load
  window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash) && document.getElementById(hash).classList.contains('tab-panel')) {
      // Small timeout to ensure browser has settled
      setTimeout(() => switchTab(hash), 100);
    }
  });

  // Handle hashchange event (back button support)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash) && document.getElementById(hash).classList.contains('tab-panel')) {
      switchTab(hash);
    }
  });
}

/* ====== DYNAMIC TEST KITS CATALOG ====== */
(function () {
  const catalogGrid = document.getElementById('catalog-grid');
  const catalogSearch = document.getElementById('catalog-search');
  const pillButtons = document.querySelectorAll('.pill-btn');

  if (catalogGrid) {
    let allKits = [];
    let activeCategory = "";

    // Helper mapping for category-colored badges
    const categoryColors = {
      "Cardiac Markers": { bg: "#fff1f2", border: "#fecdd3", color: "#e11d48" }, // Red
      "Thyroid Function": { bg: "#fff7ed", border: "#ffedd5", color: "#ea580c" }, // Orange
      "Inflammation": { bg: "#f5f3ff", border: "#ddd6fe", color: "#7c3aed" }, // Violet
      "Infectious Diseases": { bg: "#ecfdf5", border: "#a7f3d0", color: "#059669" }, // Emerald
      "Fertility": { bg: "#fdf2f8", border: "#fce7f3", color: "#db2777" }, // Pink
      "Tumor Markers": { bg: "#f0fdfa", border: "#ccfbf1", color: "#0d9488" }, // Teal
      "Renal Function": { bg: "#eff6ff", border: "#dbeafe", color: "#2563eb" }, // Blue
      "Rheumatology": { bg: "#fffbeb", border: "#fef3c7", color: "#d97706" }, // Amber
      "Diabetes": { bg: "#faf5ff", border: "#f3e8ff", color: "#9333ea" }, // Purple
      "Metabolic": { bg: "#f0fdf4", border: "#dcfce7", color: "#16a34a" }, // Green
      "Other Tests": { bg: "#f8fafc", border: "#e2e8f0", color: "#475569" } // Slate
    };

    function getCategoryStyle(category) {
      return categoryColors[category] || { bg: "#f8fafc", border: "#e2e8f0", color: "#475569" };
    }

    fetch('/data/index.json')
      .then(res => res.json())
      .then(products => {
        // Filter out analyzer (dx-101) so we only display test kits
        allKits = products.filter(p => p.type !== 'analyzer');
        renderCatalog(allKits);
      })
      .catch(err => {
        console.error('Failed to load test kits catalog', err);
        catalogGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--accent-pink); font-weight: 600; padding: 40px;">Failed to load product catalog. Please refresh the page.</div>';
      });

    function renderCatalog(kits) {
      if (kits.length === 0) {
        catalogGrid.innerHTML = '';
        const emptyDiv = document.createElement('div');
        emptyDiv.style.cssText = 'grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px; font-weight: 500;';
        emptyDiv.textContent = 'No test kits match your search criteria.';
        catalogGrid.appendChild(emptyDiv);
        return;
      }

      catalogGrid.innerHTML = '';
      kits.forEach(kit => {
        const style = getCategoryStyle(kit.category);
        const specs = kit.specifications || {};
        const sampleType = specs['Sample Type'] || specs['Sample'] || specs['Sample Types'] || 'Serum/Plasma/Whole Blood';
        const testTime = specs['Test Time'] || '15 min';

        const a = document.createElement('a');
        a.href = `/products/${kit.slug}/`;
        a.className = 'related-card';
        a.style.cssText = 'display: flex; flex-direction: column; height: 100%; border: 1px solid var(--border); border-radius: var(--radius-md); text-decoration: none; overflow: hidden; background: white; padding: 0;';

        const imgWrap = document.createElement('div');
        imgWrap.className = 'related-card-img-wrap';
        imgWrap.style.cssText = 'aspect-ratio: 1.6; background: var(--section-bg); border-bottom: 1px solid var(--border); overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative;';

        const img = document.createElement('img');
        img.src = '/placeholder.svg';
        img.alt = kit.name || '';
        img.className = 'related-card-img';
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        imgWrap.appendChild(img);
        a.appendChild(imgWrap);

        const content = document.createElement('div');
        content.className = 'related-card-content';
        content.style.cssText = 'padding: 24px; display: flex; flex-direction: column; gap: 14px; flex-grow: 1;';

        const h4 = document.createElement('h4');
        h4.className = 'related-card-title';
        h4.style.cssText = "font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: var(--text-dark); margin: 0; line-height: 1.35; letter-spacing: -0.3px;";
        h4.textContent = kit.name || '';
        content.appendChild(h4);

        const badge = document.createElement('span');
        badge.className = 'kit-badge';
        badge.style.cssText = `background: ${style.bg}; border: 1px solid ${style.border}; color: ${style.color}; padding: 4px 10px; border-radius: 50px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; align-self: flex-start;`;
        badge.textContent = kit.category || '';
        content.appendChild(badge);

        const details = document.createElement('div');
        details.className = 'card-details';
        details.style.cssText = 'display: flex; flex-direction: column; gap: 8px; margin: 4px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; padding: 12px 0;';

        const row1 = document.createElement('div');
        row1.style.cssText = 'display: flex; justify-content: space-between; align-items: center; font-size: 12.5px;';
        const label1 = document.createElement('span');
        label1.style.cssText = 'color: var(--text-light); font-weight: 500;';
        label1.textContent = '🩸 Sample Type';
        const val1 = document.createElement('span');
        val1.style.cssText = 'color: var(--text-dark); font-weight: 600; text-align: right; max-width: 65%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
        val1.textContent = sampleType;
        row1.appendChild(label1);
        row1.appendChild(val1);
        details.appendChild(row1);

        const row2 = document.createElement('div');
        row2.style.cssText = 'display: flex; justify-content: space-between; align-items: center; font-size: 12.5px;';
        const label2 = document.createElement('span');
        label2.style.cssText = 'color: var(--text-light); font-weight: 500;';
        label2.textContent = '⏱️ Test Time';
        const val2 = document.createElement('span');
        val2.style.cssText = 'color: var(--text-dark); font-weight: 600;';
        val2.textContent = testTime;
        row2.appendChild(label2);
        row2.appendChild(val2);
        details.appendChild(row2);

        content.appendChild(details);

        const ctaBtn = document.createElement('span');
        ctaBtn.className = 'card-cta-btn';
        ctaBtn.style.cssText = 'display: inline-flex; align-items: center; justify-content: center; background: var(--brand-gradient); color: white; padding: 10px 16px; border-radius: var(--radius-sm); font-size: 12.5px; font-weight: 700; transition: all 0.25s ease; margin-top: auto; text-align: center; box-shadow: 0 2px 8px rgba(155, 47, 200, 0.15); width: 100%;';
        ctaBtn.textContent = 'View Details →';
        content.appendChild(ctaBtn);

        a.appendChild(content);
        catalogGrid.appendChild(a);
      });
    }

    function filterCatalog() {
      const q = catalogSearch.value.toLowerCase().trim();
      const cat = activeCategory;

      const filtered = allKits.filter(kit => {
        const matchesSearch = kit.name.toLowerCase().includes(q) ||
          kit.category.toLowerCase().includes(q) ||
          (kit.intendedUse && kit.intendedUse.toLowerCase().includes(q));
        const matchesCat = !cat || kit.category === cat;
        return matchesSearch && matchesCat;
      });

      renderCatalog(filtered);
    }

    pillButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        pillButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        activeCategory = btn.getAttribute('data-category');
        filterCatalog();
      });
    });

    catalogSearch.addEventListener('input', filterCatalog);
  }
})();


/* ====== AUTOMATED JSON-LD GENERATION (Phase 2) ====== */
(function generateJSONLD() {
  if (document.querySelector('script[type="application/ld+json"]')) return; // Already exists
  
  const isProductPage = window.location.pathname.includes('/products/');
  const title = document.title || 'DX BIOCODE';
  const desc = document.querySelector('meta[name="description"]')?.content || '';
  const url = window.location.href;
  const image = document.querySelector('meta[property="og:image"]')?.content || 'https://dxbiocode.com/hero.webp';

  const schemas = [];

  schemas.push({
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "DX BIOCODE",
    "url": "https://dxbiocode.com",
    "logo": "https://dxbiocode.com/logo.svg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8080885059",
      "contactType": "customer service",
      "email": "info@dxbiocode.com"
    }
  });

  if (isProductPage) {
    let productName = title.replace(' | DX BIOCODE', '').trim();
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": productName,
      "description": desc,
      "image": image,
      "brand": {
        "@type": "Brand",
        "name": "DX BIOCODE"
      }
    });
  } else {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": desc,
      "url": url
    });
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemas);
  document.head.appendChild(script);
})();


/* ====== CONSOLE WARNING ====== */
if (typeof console !== 'undefined') {
  console.log('%c⚠️ Warning!', 'color:red;font-size:24px;font-weight:bold;');
  console.log('%cDo not paste any code here — it can compromise site security.', 'color:#1a2340;font-size:14px;');
}
