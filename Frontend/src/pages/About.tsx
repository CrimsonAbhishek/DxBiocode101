import React from 'react';
import { Link } from 'react-router-dom';
import { FadeUp } from '../components/FadeUp';
import { TiltCard } from '../components/TiltCard';

export const About: React.FC = () => {
  return (
    <div>
      {/* ===== PAGE HERO ===== */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>About Us
          </div>
          <h1>About DX BIOCODE</h1>
          <p>Driven by innovation, dedicated to health. We are pioneering the future of point-of-care diagnostics in India.</p>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="about-main">
        <div className="about-grid">
          <FadeUp>
            <div className="about-text">
              <span className="section-eyebrow">Our Story</span>
              <h2>Innovating Healthcare Diagnostics</h2>
              <p>DX BIOCODE Pvt. Ltd. was founded with a singular vision: to make advanced, lab-grade diagnostics accessible anywhere, anytime. We recognized the critical need for rapid and reliable testing in emergency rooms, remote clinics, and ambulances across India.</p>
              <p>By engineering India's first handheld, multi-parameter immunofluorescence quantitative analyzer, we have empowered healthcare professionals to make life-saving decisions faster. Our flagship DX 101 device combines cutting-edge technology with user-centric design to deliver unparalleled point-of-care testing.</p>
              <p>We continue to expand our test menu and product offerings, driven by a commitment to quality, accuracy, and improved patient outcomes globally.</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="about-img-wrap">
              <div className="about-img" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '32px' }}>🏢</span>
                <span style={{ fontWeight: 600 }}>DX BIOCODE HQ &amp; R&amp;D Facility</span>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>Chennai, India</span>
              </div>
            </div>
          </FadeUp>
        </div>

        <div className="values-section">
          <FadeUp>
            <div className="section-title-wrap">
              <span className="section-eyebrow">Core Values</span>
              <h2 className="section-title">What Drives Us</h2>
            </div>
          </FadeUp>
          <div className="values-grid">
            <FadeUp delay={0.1}>
              <TiltCard className="value-card">
                <span className="value-icon">🎯</span>
                <h3 className="value-title">Precision &amp; Accuracy</h3>
                <p className="value-desc">We never compromise on the quality of our diagnostics. Our devices are rigorously tested to ensure correlation with top CLIA reference methods.</p>
              </TiltCard>
            </FadeUp>
            <FadeUp delay={0.2}>
              <TiltCard className="value-card">
                <span className="value-icon">🚀</span>
                <h3 className="value-title">Pioneering Innovation</h3>
                <p className="value-desc">As the creators of India's first handheld POCT of its kind, we continuously push the boundaries of what is possible in diagnostic technology.</p>
              </TiltCard>
            </FadeUp>
            <FadeUp delay={0.3}>
              <TiltCard className="value-card">
                <span className="value-icon">❤️</span>
                <h3 className="value-title">Patient-Centricity</h3>
                <p className="value-desc">Every feature we develop is aimed at reducing turnaround times, enabling faster clinical decisions, and ultimately saving lives.</p>
              </TiltCard>
            </FadeUp>
          </div>
        </div>
      </main>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2>Join Us in Transforming Diagnostics</h2>
          <p>Whether you're looking to integrate our technology into your healthcare facility or join our growing team, we'd love to connect.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn-white">📞 Contact Us</Link>
            <Link to="/careers" className="btn-outline-white">👥 View Careers</Link>
          </div>
        </div>
      </section>
    </div>
  );
};
