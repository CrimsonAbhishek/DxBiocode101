'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <Image src="/logo.svg" alt="DX BIOCODE" className="logo-img footer-logo-img" width={144} height={64} />
            </Link>
            <p className="footer-tagline">
              Pioneering India&apos;s first portable and handheld multi-parameter point-of-care immunofluorescence diagnostic platform.
            </p>
            <div style={{ marginBottom: 24 }}>
              <a href="/Dx 101 - Analyzer.pdf" download className="btn-brochure-footer">📥 Download Product PDF</a>
            </div>
            <div className="footer-contact-item">
              <span className="icon">📍</span>
              <span>27(38), First Floor, Madley Road,<br/>T. Nagar, Chennai, Tamil Nadu, India – 600017</span>
            </div>
            <div className="footer-contact-item">
              <span className="icon">💬</span>
              <a href="https://wa.me/918080885059" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>+91 8080885059</a>
            </div>
            <div className="footer-contact-item">
              <span className="icon">✉️</span>
              <a href="mailto:info@dxbiocode.com" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>info@dxbiocode.com</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Products</h4>
            <ul className="footer-links">
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/products#dx101">DX 101 Analyzer</Link></li>
              <li><Link href="/products#test-menu">Test Menu</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Service</h4>
            <ul className="footer-links">
              <li><Link href="/service#overview">Overview</Link></li>
              <li><Link href="/service#training">Training</Link></li>
              <li><Link href="/service#support">Support</Link></li>
            </ul>
            <h4 style={{ marginTop: 24 }}>Company</h4>
            <ul className="footer-links">
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Certifications</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="ce-strip" style={{ fontSize: 12 }}>✔ CE Certified</span>
              <span className="ce-strip" style={{ fontSize: 12 }}>✔ EU-IVD Compliant</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2024 DX BIOCODE Pvt. Ltd. All rights reserved.</span>
          <div className="footer-social">
            <a href="https://www.linkedin.com/company/dxbiocode" className="social-btn" target="_blank" rel="noopener noreferrer">in</a>
            <a href="https://x.com" className="social-btn" target="_blank" rel="noopener noreferrer">𝕏</a>
            <a href="https://www.youtube.com" className="social-btn" target="_blank" rel="noopener noreferrer">▶</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
