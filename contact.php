<?php
require_once __DIR__ . '/includes/csrf.php';
session_start();
$csrf_token = csrf_token();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/png" href="favicon.png" />
  <meta name="description" content="Contact DX BIOCODE — request a product demo, get a quote, or reach our technical support team. We're here to help." />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <meta property="og:title" content="Contact Us | DX BIOCODE" />
  <meta property="og:description" content="Contact DX BIOCODE — request a product demo, get a quote, or reach our technical support team." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://dxbiocode.com/contact.php" />
  <title>Contact Us | DX BIOCODE</title>
  <meta name="csrf-token" content="<?= htmlspecialchars($csrf_token) ?>" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" as="style" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" />
  <link rel="stylesheet" href="shared.css" />
  <style>
    .contact-section { position: relative; padding: 80px 24px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); overflow: hidden; border-bottom: 1px solid #e5e7eb; }
    .contact-mesh { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(rgba(155,47,200,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(155,47,200,0.03) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(ellipse at center, black 40%, transparent 90%); }
    .contact-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
    .contact-grid  { display: grid; grid-template-columns: 1fr 1.1fr; gap: 64px; align-items: start; }
    .contact-title { font-size: clamp(28px, 3.5vw, 42px); font-weight: 800; color: #0f172a; letter-spacing: -1px; line-height: 1.15; margin-bottom: 16px; }
    .contact-desc  { font-size: 16px; color: #374151; line-height: 1.7; margin-bottom: 36px; }
    .contact-details { display: flex; flex-direction: column; gap: 24px; }
    .c-detail-item { display: flex; gap: 16px; align-items: flex-start; }
    .c-detail-item .icon { font-size: 20px; color: #9b2fc8; width: 40px; height: 40px; background: linear-gradient(135deg,rgba(58,123,213,0.12),rgba(155,47,200,.10)); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .c-detail-item h4 { font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; }
    .c-detail-item a, .c-detail-item span { font-size: 15px; color: #374151; text-decoration: none; transition: var(--transition); }
    .c-detail-item a:hover { color: #3a7bd5; }
    .quick-contact { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 36px; }
    .quick-chip { display: inline-flex; align-items: center; gap: 8px; background: white; border: 1px solid #e5e7eb; border-radius: var(--radius-sm); padding: 10px 18px; font-size: 14px; font-weight: 600; color: #374151; text-decoration: none; transition: var(--transition); box-shadow: 0 2px 12px rgba(58,123,213,0.08); }
    .quick-chip:hover { border-color: #3a7bd5; color: #3a7bd5; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(58,123,213,0.14); }
    @media (max-width: 992px) { .contact-grid { grid-template-columns: 1fr; gap: 48px; } }
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
      <li><a href="contact.php" class="active">Contact</a></li>
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

<!-- Quote Drawer -->
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
    <a href="contact.php" class="mob-cta active">Contact Us</a>
  </div>
</div>

<!-- PAGE HERO -->
<div class="page-hero">
  <div class="page-hero-inner">
    <div class="page-breadcrumb"><a href="index.html">Home</a><span>/</span>Contact</div>
    <h1>Get in Touch</h1>
    <p>Ready to transform your diagnostic capability? We'd love to hear from you. Reach out for demos, quotes, or any queries.</p>
  </div>
</div>

<!-- CONTACT SECTION -->
<section class="contact-section" id="contact">
  <div class="contact-mesh"></div>
  <div class="contact-inner">
    <div class="contact-grid">

      <!-- Left: Info -->
      <div class="contact-info fade-up">
        <span class="section-eyebrow">Get in Touch</span>
        <h2 class="contact-title">Ready to Transform Your Diagnostic Capability?</h2>
        <p class="contact-desc">Contact DX BIOCODE today to request a demonstration, get a quote, or learn more about the DX 101. Our team typically responds within 1 business day.</p>
        <div class="contact-details">
          <div class="c-detail-item">
            <span class="icon">✉️</span>
            <div><h4>Email Us</h4><a href="mailto:info@dxbiocode.com">info@dxbiocode.com</a></div>
          </div>
          <div class="c-detail-item">
            <span class="icon">💬</span>
            <div><h4>WhatsApp Us</h4><a href="https://wa.me/918080885059" target="_blank" rel="noopener noreferrer">+91 8080885059</a></div>
          </div>
          <div class="c-detail-item">
            <span class="icon">📍</span>
            <div><h4>Our Location</h4><span>27(38), First Floor, Madley Road, T. Nagar, Chennai, Tamil Nadu – 600017</span></div>
          </div>
        </div>
        <div class="quick-contact">
          <a href="mailto:info@dxbiocode.com" class="quick-chip">✉️ Send Email</a>
          <a href="https://wa.me/918080885059" target="_blank" rel="noopener noreferrer" class="quick-chip">💬 WhatsApp Us</a>
          <a href="Dx%20101%20-%20Analyzer.pdf" download class="quick-chip">📥 Brochure</a>
        </div>
        <div style="margin-top:32px;display:flex;gap:10px;flex-wrap:wrap;">
          <span class="ce-strip">✔ CE Approved</span>
          <span class="ce-strip">✔ EU-IVD Compliant</span>
        </div>
      </div>

      <!-- Right: Form -->
      <div class="contact-form-wrap fade-up fade-up-delay-2">
        <h3 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:6px;">Send Us a Message</h3>
        <p style="font-size:13.5px;color:#6b7280;margin-bottom:24px;">We'll get back to you within 1 business day</p>
        <form class="contact-form" id="dx-contact-form" novalidate>
          <!-- Honeypot -->
          <div style="display:none;" aria-hidden="true">
            <input type="text" id="form-bot-check" name="bot-check" tabindex="-1" autocomplete="off" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="form-name">Full Name *</label>
              <input type="text" id="form-name" name="name" placeholder="Dr. John Doe" required autocomplete="name" />
              <span class="error-msg">Please enter your name</span>
            </div>
            <div class="form-group">
              <label for="form-phone">Phone Number</label>
              <input type="tel" id="form-phone" name="phone" placeholder="+91 98765 43210" autocomplete="tel" />
            </div>
          </div>
          <div class="form-group">
            <label for="form-email">Email Address *</label>
            <input type="email" id="form-email" name="email" placeholder="john@hospital.com" required autocomplete="email" />
            <span class="error-msg">Please enter a valid email</span>
          </div>
          <div class="form-group">
            <label for="form-org">Organization / Clinic</label>
            <input type="text" id="form-org" name="organization" placeholder="City Hospital / Clinic Name" autocomplete="organization" />
          </div>
          <div class="form-group">
            <label for="form-enquiry">Enquiry Type</label>
            <select id="form-enquiry" name="enquiry_type">
              <option value="">Select enquiry type...</option>
              <option>Product Demo Request</option>
              <option>Pricing &amp; Quote</option>
              <option>Technical Support</option>
              <option>Partnership / Distribution</option>
              <option>General Information</option>
            </select>
          </div>
          <div class="form-group">
            <label for="form-msg">Your Message *</label>
            <textarea id="form-msg" name="message" rows="4" placeholder="I am interested in requesting a product demonstration..." required></textarea>
            <span class="error-msg">Please enter your message</span>
          </div>
          <button type="submit" class="btn-primary" style="width:100%;justify-content:center;margin-top:10px;">
            ✉️ Send Message
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
  // Pass CSRF token to the contact form handler
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  initContactForm('dx-contact-form', 'form-status', '/api/submit-contact.php', csrfToken);
</script>
</body>
</html>
