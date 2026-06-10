import React from 'react';
import { Link } from 'react-router-dom';
import { getTestKitCategories } from '../utils/productUtils';

export const Footer: React.FC = () => {
  const categories = getTestKitCategories().slice(0, 5); // Take top 5 categories for footer

  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <img src="/logo.svg" alt="DX BIOCODE" className="logo-img footer-logo-img" width="144" height="64" />
            </Link>
            <p className="footer-tagline">
              Pioneering India's first portable and handheld multi-parameter point-of-care immunofluorescence diagnostic platform.
            </p>
            <div style={{ marginBottom: '24px' }}>
              <a href="/Dx 101 - Analyzer.pdf" download="Dx 101 - Analyzer.pdf" className="btn-brochure-footer">
                📥 Download Product PDF
              </a>
            </div>
            <div className="footer-contact-item">
              <span className="icon">📍</span>
              <span>
                27(38), First Floor, Madley Road,<br />
                T. Nagar, Chennai,<br />
                Tamil Nadu, India – 600017
              </span>
            </div>
            <div className="footer-contact-item">
              <span className="icon">💬</span>
              <a href="https://wa.me/918080885059" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>
                +91 8080885059
              </a>
            </div>
            <div className="footer-contact-item">
              <span className="icon">✉️</span>
              <a href="mailto:info@dxbiocode.com" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>
                info@dxbiocode.com
              </a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>Products</h4>
            <ul className="footer-links">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products/dx-101">DX 101 Analyzer</Link></li>
              <li><Link to="/products/test-kits">Test Kits Catalog</Link></li>
              <li><Link to="/products/dx-101#specs">Specifications</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Service</h4>
            <ul className="footer-links">
              <li><Link to="/service#overview">Overview</Link></li>
              <li><Link to="/service#training">Training</Link></li>
              <li><Link to="/service#support">Support</Link></li>
            </ul>
            <h4 style={{ marginTop: '24px' }}>Company</h4>
            <ul className="footer-links">
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/contact">Request a Demo</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Certifications</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <span className="ce-strip" style={{ fontSize: '12px' }}>✔ ISO 13485:2016</span>
              <span className="ce-strip" style={{ fontSize: '12px' }}>✔ ISO 9001:2015</span>
            </div>
            <h4>Test Categories</h4>
            <ul className="footer-links">
              {categories.map(cat => {
                const slug = cat.name.toLowerCase().replace(/ /g, '-');
                return (
                  <li key={cat.name}><Link to={`/products/test-kits/${slug}`}>{cat.name}</Link></li>
                );
              })}
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <span>© 2024 DX BIOCODE Pvt. Ltd. All rights reserved. | DX 101 Immunofluorescence Quantitative Analyzer</span>
          <div className="footer-social">
            <a href="https://www.linkedin.com/company/dxbiocode" className="social-btn" title="LinkedIn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">in</a>
            <a href="https://x.com" className="social-btn" title="Twitter/X" aria-label="Twitter" target="_blank" rel="noopener noreferrer">𝕏</a>
            <a href="https://www.youtube.com" className="social-btn" title="YouTube" aria-label="YouTube" target="_blank" rel="noopener noreferrer">▶</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
