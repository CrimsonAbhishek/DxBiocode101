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

let PRODUCTS_DB = [
  { name: 'DX 101 Immunofluorescence Quantitative Analyzer', category: 'POCT Analyzer', img: '/hero.webp', href: '/products.html#dx101' },
  { name: 'Cardiac Markers Test Panel', category: 'Test Consumables', img: '/hero.webp', href: '/products.html#test-menu' },
  { name: 'Thyroid Function Test Panel', category: 'Test Consumables', img: '/hero.webp', href: '/products.html#test-menu' },
  { name: 'Infectious Disease Panel', category: 'Test Consumables', img: '/hero.webp', href: '/products.html#test-menu' },
  { name: 'Fertility Panel', category: 'Test Consumables', img: '/hero.webp', href: '/products.html#test-menu' },
  { name: 'Tumor Markers Panel', category: 'Test Consumables', img: '/hero.webp', href: '/products.html#test-menu' },
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
      <h3 style="font-family:'Space Grotesk',sans-serif; font-size:16px; font-weight:800; color:var(--text-dark); display:flex; align-items:center; gap:6px; margin:0;">📋 Request a Quote</h3>
      <div style="display:flex; align-items:center; gap:8px;">
        ${cart.length ? `<button onclick="clearQuoteCart()" style="background:none; border:none; color:var(--accent-pink); font-size:10.5px; font-weight:700; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; padding:4px 6px;">✕ Clear All</button>` : ''}
        <button class="cart-close-btn" id="cart-close-btn" style="position:static; margin:0; padding:4px 8px; font-size:16px;">✕</button>
      </div>
    `;
    const closeBtn = document.getElementById('cart-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
  }

  if (!cart.length) {
    list.innerHTML = `<div class="cart-empty" id="cart-empty" style="text-align:center; padding:48px 24px;">
      <div style="font-size:48px;margin-bottom:12px;">📋</div>
      <p style="font-size:14.5px; color:var(--text-light); margin-bottom:16px;">Your quote request is empty</p>
      <a href="/products.html" class="btn-primary" style="font-size:13px; padding:10px 20px; text-decoration:none; display:inline-flex; justify-content:center;">Browse Products</a>
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

  // Group items by category (using PRODUCT_MAP for metadata lookup)
  const groups = {};
  cart.forEach((item, idx) => {
    const info = PRODUCT_MAP[item.name] || {};
    const category = info.category || "Other Products";
    if (!groups[category]) groups[category] = [];
    groups[category].push({ item, originalIndex: idx });
  });

  let listHtml = '';
  let hasTestKit = false;
  let hasAnalyzer = false;

  for (const [category, groupItems] of Object.entries(groups)) {
    const style = categoryColors[category] || { bg: "#f1f5f9", border: "#e2e8f0", color: "#475569" };
    
    listHtml += `
      <div class="quote-category-group">
        <div class="quote-category-header" style="color: ${style.color}; background: ${style.bg}; border-left: 3px solid ${style.color};">
          ${category}
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${groupItems.map(g => {
            const item = g.item;
            const idx = g.originalIndex;
            const info = PRODUCT_MAP[item.name] || {};
            
            if (info.type === 'test-kit') hasTestKit = true;
            if (info.slug === 'dx-101') hasAnalyzer = true;

            return `
              <div class="quote-item">
                <img src="${item.img}" alt="${item.name}" class="quote-item-img" />
                <div class="quote-item-info">
                  <div class="quote-item-name" title="${item.name}">${item.name}</div>
                  <span class="quote-item-badge" style="background: ${style.bg}; border: 1px solid ${style.border}; color: ${style.color};">${category}</span>
                  
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-top:2px;">
                    <!-- Quantity Controls -->
                    <div style="display:flex; align-items:center; gap:8px;">
                      <button class="quote-qty-btn" onclick="updateQty(${idx}, -1)">-</button>
                      <span class="quote-qty-val">${item.quantity || 1}</span>
                      <button class="quote-qty-btn" onclick="updateQty(${idx}, 1)">+</button>
                    </div>
                    <button class="quote-remove-btn" onclick="removeFromCart(${idx})">✕</button>
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

  // Calculate Summary metrics
  const totalProducts = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const uniqueCategories = new Set(cart.map(item => {
    const info = PRODUCT_MAP[item.name] || {};
    return info.category || "General";
  }));
  const totalCategories = uniqueCategories.size;

  // Analyzer Recommendation Card (if test kit selected but analyzer is missing)
  let recommendationCardHtml = '';
  if (hasTestKit && !hasAnalyzer) {
    let dx101Img = '/hero.webp';
    recommendationCardHtml = `
      <div class="analyzer-recommendation" style="background: var(--brand-gradient-soft); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; position: relative; overflow: hidden; border-left: 3px solid var(--blue-primary);">
        <img src="${dx101Img}" alt="DX 101" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; box-shadow: var(--shadow-sm); border:1px solid #cbd5e1;" />
        <div style="flex: 1; min-width: 0; display:flex; flex-direction:column; gap:2px;">
          <div style="font-size: 10.5px; font-weight: 800; color: var(--blue-primary); text-transform: uppercase; letter-spacing: 0.5px; line-height:1;">Recommended Analyzer</div>
          <div style="font-size: 12px; font-weight: 700; color: var(--text-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">DX 101 POCT Analyzer</div>
          <p style="font-size: 10px; color: var(--text-light); margin: 0; line-height: 1.2;">Required to run the selected fast test kits.</p>
        </div>
        <button onclick="addAnalyzerRecommendation()" style="background: var(--brand-gradient); color: white; border: none; border-radius: 4px; padding: 6px 10px; font-size: 10px; font-weight: 700; cursor: pointer; white-space: nowrap; box-shadow: 0 2px 6px rgba(155, 47, 200, 0.2);">+ Add</button>
      </div>
    `;
  }

  // Update Footer with B2B Quote summary and custom CTA link (pathing handled correctly)
  if (footerEl) {
    footerEl.style.display = 'block';
    
    let quotePath = 'quote.html';
    if (window.location.pathname.includes('/products/')) {
      quotePath = '../../quote.html';
    }

    footerEl.innerHTML = `
      ${recommendationCardHtml}
      
      <!-- Quote Summary -->
      <div class="quote-summary" style="background:#fafafa; border:1px solid #e5e7eb; border-radius:var(--radius-sm); padding:12px; display:flex; flex-direction:column; gap:6px; margin-bottom:12px; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; font-size:12.5px; color:var(--text-light); font-weight:500;">
          <span>Total Products:</span>
          <strong style="color:var(--text-dark);">${totalProducts}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:12.5px; color:var(--text-light); font-weight:500;">
          <span>Clinical Categories:</span>
          <strong style="color:var(--text-dark);">${totalCategories}</strong>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <a href="${quotePath}" class="btn-primary" style="width:100%; justify-content:center; text-align:center; display:flex; padding:12px; font-weight:700; font-size:13px; border-radius:var(--radius-sm); box-shadow:0 4px 15px rgba(155,47,200,0.25); text-decoration:none;">Get Pricing for Selected Products</a>
    `;
  }
}

window.addToCart = function(name, price, img) {
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

window.removeFromCart = function(idx) {
  cart.splice(idx, 1);
  saveCart();
  updateCartBadge();
  renderCart();
};

window.updateQty = function(idx, change) {
  const item = cart[idx];
  if (item) {
    item.quantity = (item.quantity || 1) + change;
    if (item.quantity <= 0) {
      cart.splice(idx, 1);
    }
    saveCart();
    updateCartBadge();
    renderCart();
  }
};

window.clearQuoteCart = function() {
  if (confirm("Are you sure you want to clear your quote request?")) {
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();
  }
};

window.addAnalyzerRecommendation = function() {
  window.addToCart("DX 101 Immunofluorescence Quantitative Analyzer", "Contact for Pricing", "/hero.webp");
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
document.querySelectorAll('.feature-card, .test-cat-card, .product-card, .cert-card').forEach(card => {
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

/* ====== FORM VALIDATION HELPER ======
   Pass an endpoint URL as 3rd argument to enable real API submission.
   Without it, falls back to the original mock (backward compat).
   Requires form inputs to have `name` attributes for payload building.
====================================== */
window.initContactForm = function(formId, statusId, endpoint) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // ── Validate required fields ───────────────────────────────
    let isValid = true;
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) { input.classList.add('invalid'); isValid = false; }
      else if (input.type === 'email' && !/\S+@\S+\.\S+/.test(input.value)) { input.classList.add('invalid'); isValid = false; }
      else input.classList.remove('invalid');
    });

    if (status) { status.className = 'form-status'; status.style.display = 'none'; }

    if (!isValid) {
      if (status) { status.textContent = '❌ Please correct the errors before submitting.'; status.classList.add('error'); status.style.display = 'block'; }
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const origText = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = '⌛ Sending...'; }

    if (endpoint) {
      // ── Real API submission ──────────────────────────────────
      try {
        // Collect form data via name attributes
        const payload = {};
        form.querySelectorAll('input:not([type="file"]), textarea, select').forEach(el => {
          if (el.name === 'bot-check') {
            payload['_bot_check'] = el.value;
          } else if (el.name) {
            payload[el.name] = el.value;
          }
        });
        // Ensure honeypot is always present
        if (!('_bot_check' in payload)) payload['_bot_check'] = '';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (btn) { btn.disabled = false; btn.innerHTML = origText; }

        if (response.ok && result.success) {
          if (status) {
            status.textContent = '🎉 Thank you! Your submission was received. We will be in touch shortly.';
            status.classList.add('success');
            status.style.display = 'block';
          }
          form.reset();
        } else if (response.status === 429) {
          if (status) {
            status.textContent = '⏳ Too many requests. Please try again in an hour.';
            status.classList.add('error');
            status.style.display = 'block';
          }
        } else {
          const errMsg = result.error || 'Something went wrong.';
          if (status) {
            status.textContent = `❌ ${errMsg} Please email info@dxbiocode.com directly.`;
            status.classList.add('error');
            status.style.display = 'block';
          }
        }
      } catch (_err) {
        if (btn) { btn.disabled = false; btn.innerHTML = origText; }
        if (status) {
          status.textContent = '❌ Network error. Please email info@dxbiocode.com directly.';
          status.classList.add('error');
          status.style.display = 'block';
        }
      }
    } else {
      // ── Mock submission (no endpoint provided) ───────────────
      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.innerHTML = origText; }
        if (status) {
          status.textContent = '🎉 Thank you! Your submission was received successfully.';
          status.classList.add('success');
          status.style.display = 'block';
        }
        form.reset();
      }, 1200);
    }
  });

  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', function() { if (this.value.trim()) this.classList.remove('invalid'); });
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
(function() {
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
        catalogGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px; font-weight: 500;">No test kits match your search criteria.</div>';
        return;
      }

      catalogGrid.innerHTML = kits.map(kit => {
        const style = getCategoryStyle(kit.category);
        const specs = kit.specifications || {};
        const sampleType = specs['Sample Type'] || specs['Sample'] || specs['Sample Types'] || 'Serum/Plasma/Whole Blood';
        const testTime = specs['Test Time'] || '15 min';

        return `
          <a href="/products/${kit.slug}/" class="related-card" style="display: flex; flex-direction: column; height: 100%; border: 1px solid var(--border); border-radius: var(--radius-md); text-decoration: none; overflow: hidden; background: white; padding: 0;">
            <div class="related-card-img-wrap" style="aspect-ratio: 1.6; background: var(--section-bg); border-bottom: 1px solid var(--border); overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative;">
              <img src="/placeholder.svg" alt="${kit.name}" class="related-card-img" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            
            <div class="related-card-content" style="padding: 24px; display: flex; flex-direction: column; gap: 14px; flex-grow: 1;">
              <span class="kit-badge" style="background: ${style.bg}; border: 1px solid ${style.border}; color: ${style.color}; padding: 4px 10px; border-radius: 50px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; align-self: flex-start;">${kit.category}</span>
              
              <h4 class="related-card-title" style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: var(--text-dark); margin: 0; line-height: 1.35; letter-spacing: -0.3px;">${kit.name}</h4>
              
              <!-- Dynamic Metadata details (Task 3) -->
              <div class="card-details" style="display: flex; flex-direction: column; gap: 8px; margin: 4px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; padding: 12px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12.5px;">
                  <span style="color: var(--text-light); font-weight: 500;">🩸 Sample Type</span>
                  <span style="color: var(--text-dark); font-weight: 600; text-align: right; max-width: 65%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${sampleType}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12.5px;">
                  <span style="color: var(--text-light); font-weight: 500;">⏱️ Test Time</span>
                  <span style="color: var(--text-dark); font-weight: 600;">${testTime}</span>
                </div>
              </div>
              
              <!-- CTA Button replacement (Task 5) -->
              <span class="card-cta-btn" style="display: inline-flex; align-items: center; justify-content: center; background: var(--brand-gradient); color: white; padding: 10px 16px; border-radius: var(--radius-sm); font-size: 12.5px; font-weight: 700; transition: all 0.25s ease; margin-top: auto; text-align: center; box-shadow: 0 2px 8px rgba(155, 47, 200, 0.15); width: 100%;">View Details →</span>
            </div>
          </a>
        `;
      }).join('');
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
        pillButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-category');
        filterCatalog();
      });
    });

    catalogSearch.addEventListener('input', filterCatalog);
  }
})();


/* ====== CONSOLE WARNING ====== */
if (typeof console !== 'undefined') {
  console.log('%c⚠️ Warning!', 'color:red;font-size:24px;font-weight:bold;');
  console.log('%cDo not paste any code here — it can compromise site security.', 'color:#1a2340;font-size:14px;');
}
