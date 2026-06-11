import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBanner from '@/components/CtaBanner';
import FadeUp from '@/components/FadeUp';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact DX BIOCODE — request a product demo, get a quote, or reach our technical support team. We\'re here to help.',
};

export default function ContactPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link><span>/</span>Contact</div>
          <h1>Get in Touch</h1>
          <p>Ready to transform your diagnostic capability? We&apos;d love to hear from you. Reach out for demos, quotes, or any queries.</p>
        </div>
      </div>

      <section className="contact-section" id="contact">
        <div className="contact-mesh" />
        <div className="contact-inner">
          <div className="contact-grid">
            {/* Left: Info */}
            <FadeUp>
              <div className="contact-info">
                <span className="section-eyebrow">Get in Touch</span>
                <h2 className="contact-title">Ready to Transform Your Diagnostic Capability?</h2>
                <p className="contact-desc">
                  Contact DX BIOCODE today to request a demonstration, get a quote, or learn more about the DX 101 Immunofluorescence Quantitative Analyzer. Our team typically responds within 1 business day.
                </p>
                <div className="contact-details">
                  <div className="c-detail-item">
                    <span className="icon">✉️</span>
                    <div>
                      <h4>Email Us</h4>
                      <a href="mailto:info@dxbiocode.com">info@dxbiocode.com</a>
                    </div>
                  </div>
                  <div className="c-detail-item">
                    <span className="icon">💬</span>
                    <div>
                      <h4>WhatsApp Us</h4>
                      <a href="https://wa.me/918080885059" target="_blank" rel="noopener noreferrer">+91 8080885059</a>
                    </div>
                  </div>
                  <div className="c-detail-item">
                    <span className="icon">📍</span>
                    <div>
                      <h4>Our Location</h4>
                      <span>27(38), First Floor, Madley Road, T. Nagar, Chennai, Tamil Nadu – 600017</span>
                    </div>
                  </div>
                </div>
                <div className="quick-contact">
                  <a href="mailto:info@dxbiocode.com" className="quick-chip">✉️ Send Email</a>
                  <a href="https://wa.me/918080885059" target="_blank" rel="noopener noreferrer" className="quick-chip">💬 WhatsApp Us</a>
                  <a href="/Dx 101 - Analyzer.pdf" download className="quick-chip">📥 Brochure</a>
                </div>
                <div style={{ marginTop: 32, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span className="ce-strip">✔ CE Approved</span>
                  <span className="ce-strip">✔ EU-IVD Compliant</span>
                </div>
              </div>
            </FadeUp>

            {/* Right: Form */}
            <FadeUp delay={0.15}>
              <ContactForm />
            </FadeUp>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Have a Product Question?"
        desc="Browse our full product catalog or request a custom quote for your facility."
        primaryText="🛒 Browse Products"
        primaryHref="/products"
        secondaryText="📋 Request Quote"
        secondaryHref="/quote"
      />
    </>
  );
}
