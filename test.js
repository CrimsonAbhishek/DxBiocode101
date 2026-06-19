const fs = require('fs');
const { JSDOM } = require('jsdom');

async function runTests() {
  const sharedJsCode = fs.readFileSync('shared.js', 'utf8');

  // Test Contact Form
  let html = fs.readFileSync('contact.html', 'utf8');
  let dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/" });
  let window = dom.window;
  let document = window.document;

  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  
  // Polyfill fetch for mock testing
  window.fetch = async (url, options) => {
    return {
      ok: true,
      json: async () => ({ success: true })
    };
  };
  
  // Inject script
  const scriptEl = document.createElement("script");
  scriptEl.textContent = sharedJsCode;
  document.body.appendChild(scriptEl);

  window.initContactForm('dx-contact-form', 'form-status', '/api/contact');
  
  const form = document.getElementById('dx-contact-form');
  const btn = form.querySelector('button[type="submit"]');

  console.log("=== CONTACT FORM VALIDATION ===");
  // Test empty submission
  console.log("Submit button disabled initially:", btn.disabled);
  
  // Set invalid email
  const emailInput = document.getElementById('form-email');
  emailInput.value = "invalid-email";
  emailInput.dispatchEvent(new window.Event('input'));
  console.log("Email invalid state after bad input:", emailInput.classList.contains('invalid'));
  console.log("Submit button with invalid email disabled:", btn.disabled);

  // Set valid inputs
  document.getElementById('form-name').value = "Test User";
  document.getElementById('form-name').dispatchEvent(new window.Event('input'));
  document.getElementById('form-phone').value = "1234567890";
  document.getElementById('form-phone').dispatchEvent(new window.Event('input'));
  emailInput.value = "test@example.com";
  emailInput.dispatchEvent(new window.Event('input'));
  document.getElementById('form-msg').value = "Test message";
  document.getElementById('form-msg').dispatchEvent(new window.Event('input'));

  console.log("Submit button with valid data disabled:", btn.disabled);
  
  // Simulate submission
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  
  // Wait a tick for fetch mock
  await new Promise(r => setTimeout(r, 100));
  
  console.log("Contact Form Success State shown:", form.innerHTML.includes("Message Sent Successfully!"));


  // Test Quote Form
  console.log("\n=== QUOTE FORM VALIDATION ===");
  html = fs.readFileSync('quote.html', 'utf8');
  
  // Inject mock before quote script runs
  html = html.replace('<script src="shared.js"></script>', `
    <script>
      window.IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} };
      window.fetch = async () => ({ ok: true, json: async () => ({ success: true }) });
      localStorage.setItem('dx-cart', JSON.stringify([{name: "Test Kit", price: "$10", quantity: 1}]));
      ${sharedJsCode}
    </script>
  `);
  
  dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/" });
  window = dom.window;
  document = window.document;

  const quoteForm = document.getElementById('dx-quote-form');
  
  document.getElementById('form-name').value = "Test";
  document.getElementById('form-name').dispatchEvent(new window.Event('input'));
  document.getElementById('form-phone').value = "123";
  document.getElementById('form-phone').dispatchEvent(new window.Event('input'));
  document.getElementById('form-email').value = "a@a.com";
  document.getElementById('form-email').dispatchEvent(new window.Event('input'));
  document.getElementById('form-org').value = "Org";
  document.getElementById('form-org').dispatchEvent(new window.Event('input'));
  document.getElementById('form-msg').value = "Msg";
  document.getElementById('form-msg').dispatchEvent(new window.Event('input'));
  
  quoteForm.dispatchEvent(new window.Event('submit', { cancelable: true }));
  await new Promise(r => setTimeout(r, 100));
  console.log("Quote Form Success State shown:", quoteForm.innerHTML.includes("Your Quote Request was submitted"));


  // Test ARIA properties
  console.log("\n=== ARIA & NAVIGATION ===");
  const mobileNav = document.getElementById('mobile-nav');
  const hamburger = document.getElementById('hamburger');
  hamburger.click();
  console.log("Hamburger aria-expanded when open:", hamburger.getAttribute('aria-expanded'));
  
  const cartBtn = document.getElementById('cart-btn');
  const cartPanel = document.getElementById('cart-panel');
  cartBtn.click();
  console.log("Cart aria-expanded when open:", cartBtn.getAttribute('aria-expanded'));
  console.log("Cart Panel aria-hidden when open:", cartPanel.getAttribute('aria-hidden'));

  // Test Phase 2: Global Search Modal
  console.log("\n=== GLOBAL PRODUCT SEARCH MODAL ===");
  const searchBtn = document.getElementById('nav-search-btn');
  const searchBox = document.getElementById('nav-search-box');
  const searchInput = document.getElementById('nav-search-input');
  
  searchBtn.click();
  console.log("Search Box modal open class added:", searchBox.classList.contains('open'));
  console.log("Search Box moved to body:", searchBox.parentNode === document.body);
  
  searchInput.value = "Cardiac";
  searchInput.dispatchEvent(new window.Event('input'));
  const searchResults = document.getElementById('search-results-dropdown');
  console.log("Search results populated:", searchResults.children.length > 0);

  const searchCloseBtn = document.getElementById('search-close-btn');
  searchCloseBtn.click();
  console.log("Search Box modal open class removed:", !searchBox.classList.contains('open'));

  // Test Phase 2: Automated JSON-LD
  console.log("\n=== AUTOMATED JSON-LD GENERATION ===");
  const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
  console.log("JSON-LD script tag injected:", !!jsonLdScript);
  if (jsonLdScript) {
    const schemas = JSON.parse(jsonLdScript.text);
    console.log("JSON-LD valid JSON:", Array.isArray(schemas));
    console.log("MedicalOrganization Schema present:", schemas.some(s => s['@type'] === 'MedicalOrganization'));
  }
}

runTests().catch(console.error);
