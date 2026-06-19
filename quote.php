<?php
// Inject real CSRF token before serving the page
require_once __DIR__ . '/backend/includes/csrf.php';
session_start();
$csrf_token = csrf_token();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/png" href="favicon.png" />
  <meta name="description" content="Request a customized quote for DX 101 Immunofluorescence Quantitative Analyzer and diagnostic test kits. Fast response within 1 business day." />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <meta property="og:title" content="Request a Quote | DX BIOCODE" />
  <meta property="og:description" content="Request a customized quote for DX 101 Immunofluorescence Quantitative Analyzer and diagnostic test kits." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://dxbiocode.com/quote.php" />
  <title>Request a Quote | DX BIOCODE</title>
  <!-- CSRF token for form submission -->
  <meta name="csrf-token" content="<?= htmlspecialchars($csrf_token) ?>" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" as="style" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" />
  <link rel="stylesheet" href="shared.css" />
  <style>
    .quote-section {
      position: relative; padding: 80px 24px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      overflow: hidden; border-bottom: 1px solid #e5e7eb;
    }
    .quote-mesh {
      position: absolute; inset: 0; pointer-events: none;
      background-image: linear-gradient(rgba(155,47,200,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(155,47,200,0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      mask-image: radial-gradient(ellipse at center, black 40%, transparent 90%);
    }
    .quote-inner  { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
    .quote-grid   { display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: start; }

    /* ── Left: cart panel ───────────────────────────────── */
    .quote-cart-panel {
      background: white; border: 1px solid #e5e7eb; border-radius: var(--radius-lg);
      padding: 32px; box-shadow: 0 4px 24px rgba(58,123,213,0.08);
    }
    .quote-cart-title  { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
    .quote-cart-desc   { font-size: 14px; color: #6b7280; margin-bottom: 24px; }
    .q-item-list       { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
    .q-item {
      display: flex; align-items: center; gap: 14px; padding: 14px 16px;
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md);
      transition: var(--transition);
    }
    .q-item:hover { border-color: rgba(155,47,200,0.2); background: #f1f5f9; }
    .q-item-img  { width: 52px; height: 52px; border-radius: var(--radius-sm); object-fit: cover; background: #e2e8f0; flex-shrink: 0; }
    .q-item-info { flex: 1; min-width: 0; }
    .q-item-name { font-size: 13.5px; font-weight: 700; color: #0f172a; margin-bottom: 3px;
                   overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .q-item-qty  { font-size: 12px; color: #9b2fc8; font-weight: 600; }
    .q-item-remove {
      background: transparent; border: none; font-size: 15px; color: #9ca3af;
      cursor: pointer; padding: 4px 8px; transition: var(--transition); flex-shrink: 0;
    }
    .q-item-remove:hover { color: #ef4444; }
    .q-empty-state { text-align: center; padding: 48px 24px; }
    .q-empty-icon  { font-size: 52px; margin-bottom: 14px; }
    .q-empty-text  { font-size: 16px; color: #374151; margin-bottom: 20px; font-weight: 500; }

    /* ── Right: form ────────────────────────────────────── */
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    /* ── Required badge ─────────────────────────────────── */
    .req { color: #e91e8c; font-weight: 700; }

    @media (max-width: 992px) {
      .quote-grid    { grid-template-columns: 1fr; gap: 48px; }
      .form-row-2    { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<!-- TOP BAR -->
<div class="top-bar">
  <div class="top-bar-inner">
    <div class="top-bar-contact">
      <span><a href="https://wa.me/918080885059" target="_blank" rel="noopener noreferrer"
               style="display:inline-flex;align-items:center;gap:6px;color:rgba(255,255,255,0.9);text-decoration:none;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366" style="flex-shrink:0;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Chat on WhatsApp</a></span>
      <span>✉️ <a href="mailto:info@dxbiocode.com">info@dxbiocode.com</a></span>
    </div>
    <div style="display:flex;align-items:center;gap:10px;">
      <span class="ce-strip">✔ CE &amp; EU-IVD Approved</span>
      <span class="top-bar-badge">India's First Handheld Multi-Parameter POCT</span>
    </div>
  </div>
</div>

<!-- NAVIGATION -->
<nav id="main-nav">
  <div class="nav-inner">
    <a href="index.html" class="logo"><img src="logo.svg" alt="DX BIOCODE" class="logo-img" width="180" height="80" /></a>
    <ul class="nav-links" id="desktop-nav">
      <li><a href="index.html">Home</a></li>
      <li class="nav-dropdown"><a href="products.html">Products ▾</a>
        <div class="nav-dropdown-menu">
          <a href="products.html">All Products</a>
          <a href="products.html#dx101">DX 101 Analyzer</a>
          <a href="products.html#test-kits">Test Kits</a>
        </div>
      </li>
      <li class="nav-dropdown"><a href="service.html">Service ▾</a>
        <div class="nav-dropdown-menu">
          <a href="service.html#overview">Overview</a>
          <a href="service.html#training">Training</a>
          <a href="service.html#support">Support</a>
        </div>
      </li>
      <li><a href="contact.php">Contact</a></li>
      <li><a href="careers.html">Careers</a></li>
      <li><a href="about.html">About Us</a></li>
    </ul>
    <div class="nav-actions">
      <div class="nav-search-wrap" id="nav-search-wrap">
        <button class="nav-search-btn" id="nav-search-btn" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <div class="nav-search-box" id="nav-search-box">
          <input type="search" id="nav-search-input" placeholder="Search products…" autocomplete="off" />
          <div class="search-results-dropdown" id="search-results-dropdown"></div>
        </div>
      </div>
      <button class="cart-btn" id="cart-btn" aria-label="Quote cart">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span class="cart-badge" id="cart-badge">0</span>
      </button>
      <button class="hamburger" id="hamburger" aria-label="Open menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>

<!-- Quote Drawer (shared.js) -->
<div class="cart-panel" id="cart-panel">
  <div class="cart-panel-overlay" id="cart-overlay"></div>
  <div class="cart-panel-drawer">
    <div class="cart-panel-header"><h3>📋 Request a Quote</h3><button class="cart-close-btn" id="cart-close-btn">✕</button></div>
    <div class="cart-items-list" id="cart-items-list"></div>
  </div>
</div>

<!-- Mobile Nav -->
<div class="mobile-nav" id="mobile-nav">
  <div class="mobile-nav-overlay" id="nav-overlay"></div>
  <div class="mobile-nav-drawer">
    <a href="index.html" class="mob-link">Home</a>
    <a href="products.html" class="mob-link">Products</a>
    <a href="service.html" class="mob-link">Service</a>
    <a href="contact.php" class="mob-link">Contact</a>
    <a href="careers.html" class="mob-link">Careers</a>
    <a href="about.html" class="mob-link">About Us</a>
    <a href="Dx%20101%20-%20Analyzer.pdf" download class="mob-brochure">📥 Download Brochure</a>
    <a href="quote.php" class="mob-cta active">Request Quote</a>
  </div>
</div>

<!-- PAGE HERO -->
<div class="page-hero">
  <div class="page-hero-inner">
    <div class="page-breadcrumb"><a href="index.html">Home</a><span>/</span>Request Quote</div>
    <h1>Request a Quote</h1>
    <p>Select your products and fill in your details. We'll respond with a customized quotation within 1 business day.</p>
  </div>
</div>

<!-- QUOTE SECTION -->
<section class="quote-section" id="quote">
  <div class="quote-mesh"></div>
  <div class="quote-inner">
    <div class="quote-grid">

      <!-- Left: Selected Products -->
      <div class="quote-cart-panel fade-up">
        <h2 class="quote-cart-title">Your Selected Products</h2>
        <p class="quote-cart-desc">Review the diagnostic items for your quotation request.</p>

        <div class="q-item-list" id="quote-items-container"></div>

        <div class="q-empty-state" id="quote-empty-container" style="display:none;">
          <div class="q-empty-icon">📋</div>
          <div class="q-empty-text">No products selected yet.</div>
          <a href="products.html" class="btn-primary" style="display:inline-flex;">Browse Products</a>
        </div>
      </div>

      <!-- Right: Simplified Quote Form -->
      <div class="contact-form-wrap fade-up fade-up-delay-2">
        <h3 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:6px;">Your Details</h3>
        <p style="font-size:13.5px;color:#6b7280;margin-bottom:24px;">We'll use this to prepare your custom quotation</p>

        <form class="contact-form" id="dx-quote-form" novalidate>

          <!-- Honeypot -->
          <input type="text" name="website" tabindex="-1" autocomplete="off" style="display:none;">

          <!-- Name + Email (required) -->
          <div class="form-row-2">
            <div class="form-group">
              <label for="q-name">Full Name <span class="req">*</span></label>
              <input type="text" id="q-name" placeholder="Dr. John Doe" required autocomplete="name" aria-describedby="q-name-error" />
              <span class="error-msg" id="q-name-error">This field is required.</span>
            </div>
            <div class="form-group">
              <label for="q-email">Email Address <span class="req">*</span></label>
              <input type="email" id="q-email" placeholder="john@hospital.com" required autocomplete="email" aria-describedby="q-email-error" />
              <span class="error-msg" id="q-email-error">Please enter a valid email address.</span>
            </div>
          </div>

          <!-- Phone + Company -->
          <div class="form-row-2">
            <div class="form-group">
              <label for="q-phone">Phone Number</label>
              <input type="tel" id="q-phone" placeholder="+91 98765 43210" autocomplete="tel" />
            </div>
            <div class="form-group">
              <label for="q-company">Company / Organization</label>
              <input type="text" id="q-company" placeholder="City Hospital" autocomplete="organization" />
            </div>
          </div>

          <!-- Facility Type + Country -->
          <div class="form-row-2">
            <div class="form-group">
              <label for="q-company-type">Facility Type</label>
              <select id="q-company-type">
                <option value="">Select facility type…</option>
                <option value="Hospital">Hospital</option>
                <option value="Clinic">Clinic</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Distributor">Distributor</option>
                <option value="Research Center">Research Center</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="q-country">Country</label>
              <input type="text" id="q-country" placeholder="India" autocomplete="country-name" />
            </div>
          </div>

          <!-- Message -->
          <div class="form-group">
            <label for="q-msg">Message / Requirements</label>
            <textarea id="q-msg" rows="4" placeholder="Specify panels, volumes, or any special requirements…" maxlength="2000" aria-describedby="q-msg-counter"></textarea>
            <div class="char-counter" id="q-msg-counter">0 / 2000 characters</div>
          </div>

          <div class="form-readiness" id="quote-form-readiness">Complete all required fields to continue.</div>
          <button type="submit" class="btn-primary" id="quote-submit-btn" disabled
                  style="width:100%;justify-content:center;margin-top:8px;">
            ✉️ Request Official Quotation
          </button>
          <div class="form-status" id="form-status"></div>
        </form>
      </div>

    </div>
  </div>
</section>

<!-- FOOTER -->
<footer id="footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="logo"><img src="logo.svg" alt="DX BIOCODE" class="logo-img footer-logo-img" width="144" height="64" /></a>
        <p class="footer-tagline">Pioneering India's first portable and handheld multi-parameter point-of-care immunofluorescence diagnostic platform.</p>
        <div style="margin-bottom:24px;"><a href="Dx%20101%20-%20Analyzer.pdf" download class="btn-brochure-footer">📥 Download Product PDF</a></div>
        <div class="footer-contact-item"><span class="icon">📍</span><span>27(38), First Floor, Madley Road,<br/>T. Nagar, Chennai, Tamil Nadu, India – 600017</span></div>
        <div class="footer-contact-item"><span class="icon">💬</span><a href="https://wa.me/918080885059" target="_blank" rel="noopener noreferrer" style="color:rgba(255,255,255,0.65);text-decoration:none;">+91 8080885059</a></div>
        <div class="footer-contact-item"><span class="icon">✉️</span><a href="mailto:info@dxbiocode.com" style="color:rgba(255,255,255,0.65);text-decoration:none;">info@dxbiocode.com</a></div>
      </div>
      <div class="footer-col">
        <h4>Products</h4>
        <ul class="footer-links">
          <li><a href="products.html">All Products</a></li>
          <li><a href="products.html#dx101">DX 101 Analyzer</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul class="footer-links">
          <li><a href="about.html">About Us</a></li>
          <li><a href="careers.html">Careers</a></li>
          <li><a href="contact.php">Contact Us</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Certifications</h4>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <span class="ce-strip" style="font-size:12px;">✔ CE Certified</span>
          <span class="ce-strip" style="font-size:12px;">✔ EU-IVD Compliant</span>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2024 DX BIOCODE Pvt. Ltd. All rights reserved.</span>
      <div class="footer-social">
        <a href="https://www.linkedin.com/company/dxbiocode" class="social-btn" target="_blank" rel="noopener">in</a>
        <a href="https://x.com" class="social-btn" target="_blank" rel="noopener">𝕏</a>
        <a href="https://www.youtube.com" class="social-btn" target="_blank" rel="noopener">▶</a>
      </div>
    </div>
  </div>
</footer>

<script src="shared.js"></script>
<script>
'use strict';

// ── Render cart items on left panel ──────────────────────────
function renderQuoteCartItems() {
  const container  = document.getElementById('quote-items-container');
  const emptyState = document.getElementById('quote-empty-container');
  const submitBtn  = document.getElementById('quote-submit-btn');
  const localCart  = JSON.parse(localStorage.getItem('dx-cart') || '[]');

  if (localCart.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  emptyState.style.display = 'none';
  if (submitBtn) submitBtn.disabled = false;

  container.innerHTML = localCart.map((item, idx) => `
    <div class="q-item">
      <img class="q-item-img" src="${item.img || 'placeholder.svg'}" alt="${item.name}" />
      <div class="q-item-info">
        <div class="q-item-name" title="${item.name}">${item.name}</div>
        <div class="q-item-qty">Qty: ${item.quantity || 1}</div>
      </div>
      <button class="q-item-remove" onclick="removeQuoteItem(${idx})" title="Remove">✕</button>
    </div>
  `).join('');
}

window.removeQuoteItem = function(idx) {
  const cart = JSON.parse(localStorage.getItem('dx-cart') || '[]');
  cart.splice(idx, 1);
  localStorage.setItem('dx-cart', JSON.stringify(cart));
  renderQuoteCartItems();
  if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
};

// ── Form submission & UX Enhancements ───────────────────────────
const form   = document.getElementById('dx-quote-form');
const status = document.getElementById('form-status');
const submitBtn = document.getElementById('quote-submit-btn');
const readiness = document.getElementById('quote-form-readiness');
const msgInput = document.getElementById('q-msg');
const msgCounter = document.getElementById('q-msg-counter');

if (form) {
  // 1. Smart Prefill - Country
  try {
    const countryInput = document.getElementById('q-country');
    if (countryInput && !countryInput.value) {
      const locale = navigator.language;
      if (locale && locale.includes('-')) {
        const countryCode = locale.split('-')[1];
        const regionNames = new Intl.DisplayNames([locale], {type: 'region'});
        countryInput.value = regionNames.of(countryCode) || '';
      }
    }
  } catch(e) {}

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

    // Also check cart
    const localCart = JSON.parse(localStorage.getItem('dx-cart') || '[]');
    if (localCart.length === 0) allValid = false;

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

  // Re-validate on cart change
  const originalRenderCart = window.renderQuoteCartItems;
  window.renderQuoteCartItems = function() {
    originalRenderCart();
    validateForm();
  };

  validateForm();

  // 4. Submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) return;

    if (status) { status.className = 'form-status'; status.style.display = 'none'; }

    const origText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '⌛ Submitting…'; }

    // Disable all inputs during submission
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(el => el.disabled = true);

    const localCart = JSON.parse(localStorage.getItem('dx-cart') || '[]');

    // 5. Phone Normalization
    let rawPhone = document.getElementById('q-phone').value.trim();
    let cleanPhone = rawPhone;
    if (rawPhone) {
      const isPlus = rawPhone.startsWith('+');
      cleanPhone = rawPhone.replace(/\D/g, '');
      if (isPlus) cleanPhone = '+' + cleanPhone;
    }

    const payload = {
      name:          document.getElementById('q-name').value.trim(),
      email:         document.getElementById('q-email').value.trim(),
      phone:         cleanPhone,
      organization:  document.getElementById('q-company').value.trim(),
      designation:   '',
      facility_type: document.getElementById('q-company-type').value,
      timeline:      '',
      message:       (document.getElementById('q-country').value.trim() ? "Country: " + document.getElementById('q-country').value.trim() + "\n" : "") + document.getElementById('q-msg').value.trim(),
      items:         localCart.map(item => ({ product_name: item.name, quantity: item.quantity || 1 })),
      _bot_check:    document.querySelector('input[name="website"]')?.value || '',
    };

    fetch('/api/quotes', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    .then(r => r.json().then(d => ({ ok: r.ok, status: r.status, data: d })))
    .then(res => {
      if (res.ok && res.data.success) {
        // 6. Success State
        form.innerHTML = `
          <div class="form-success-state">
            <div class="success-icon-wrap">✓</div>
            <h3 class="success-title">Thank you! Your quote request has been received.</h3>
            <p class="success-desc">Our team will review your requirements and contact you within <strong>1–2 business days</strong>.<br><br>If your request is urgent, you may also contact us directly via email or WhatsApp.</p>
            <button type="button" class="btn-secondary" onclick="window.location.reload()">Submit Another Request</button>
          </div>
        `;
        localStorage.removeItem('dx-cart');
        if (typeof window.renderCart === 'function') window.renderCart();
        if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
        originalRenderCart();
      } else {
        inputs.forEach(el => el.disabled = false);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = origText; }
        if (res.status === 429) {
          showStatus('⏳ Too many requests. Please wait a few minutes.', 'error');
        } else {
          let errMsg = 'Something went wrong. Email us at info@dxbiocode.com';
          if (res.data) {
            if (typeof res.data.message === 'string') errMsg = res.data.message;
            else if (res.data.message && typeof res.data.message === 'object' && res.data.message.message) errMsg = res.data.message.message;
            else if (typeof res.data.error === 'string') errMsg = res.data.error;
            else if (res.data.error && typeof res.data.error === 'object' && res.data.error.message) errMsg = res.data.error.message;
          }
          showStatus('❌ ' + errMsg, 'error');
        }
      }
    })
    .catch(() => {
      inputs.forEach(el => el.disabled = false);
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = origText; }
      showStatus('❌ Network error. Please email info@dxbiocode.com directly.', 'error');
    });
  });
}

function showStatus(msg, type) {
  if (!status) return;
  status.textContent  = msg;
  status.className    = 'form-status ' + type;
  status.style.display = 'block';
  status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

renderQuoteCartItems();
</script>
</body>
</html>
