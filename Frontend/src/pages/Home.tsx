import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FadeUp } from '../components/FadeUp';
import { TiltCard } from '../components/TiltCard';
import { StatCounter } from '../components/StatCounter';
import { useCartStore } from '../store/cartStore';

export const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (!heroRef.current) return;
    const colors = ['#3a7bd5', '#e91e8c', '#9b2fc8', '#5b99e8'];
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      const sz = Math.random() * 9 + 3;
      p.style.width = `${sz}px`;
      p.style.height = `${sz}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `-10px`;
      p.style.background = colors[i % colors.length];
      p.style.animationName = 'particleRise';
      p.style.animationTimingFunction = 'linear';
      p.style.animationIterationCount = 'infinite';
      p.style.animationDuration = `${(Math.random() * 14 + 9).toFixed(1)}s`;
      p.style.animationDelay = `${(Math.random() * 12).toFixed(1)}s`;
      
      heroRef.current.appendChild(p);
      particles.push(p);
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, []);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="hero" ref={heroRef}>
        <div className="hero-mesh"></div>
        <div className="hero-inner-wrapper">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="dot"></span>Point-of-Care Diagnostic Innovation
              </div>
              <h1>
                DX 101<br />
                <span>Immunofluorescence</span><br />
                Quantitative Analyzer
              </h1>
              <p className="hero-desc">
                India's first portable and handheld multi-parameter POCT device. Compact, user-friendly,
                and built for rapid quantitative results — in clinics, ICUs, ambulances, and beyond.
              </p>
              <div className="hero-tags">
                <span className="hero-tag">🏥 Point-of-Care Ready</span>
                <span className="hero-tag">⚡ Results in 3–15 min</span>
                <span className="hero-tag">📱 Android OS</span>
                <span className="hero-tag">🔋 Long Battery Life</span>
                <span className="hero-tag">☁️ Wi-Fi &amp; 4G</span>
              </div>
              <div className="hero-actions">
                <Link to="/products" className="btn-primary">🛒 Shop Products</Link>
                <Link to="/products#dx101" className="btn-secondary">📋 Specifications</Link>
              </div>
              <div className="hero-certifications">
                <span className="cert-badge">✅ CE Certified</span>
                <span className="cert-badge">✅ EU-IVD Compliant</span>
                <span className="cert-badge">🌡 10°C – 35°C</span>
                <span className="cert-badge">⚖ 400 g</span>
              </div>
            </div>
            <div className="hero-image-wrap">
              <div className="glow-orb"></div>
              <img
                src="/hero.webp"
                alt="DX 101 Immunofluorescence Quantitative Analyzer — handheld portable device"
                className="hero-img"
                width="420"
                height="364"
                style={{ zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          <div className="stat-item">
            <StatCounter targetText="50,000+" />
            <div className="stat-label">Test Results Storage</div>
          </div>
          <div className="stat-item">
            <StatCounter targetText="3–15 min" />
            <div className="stat-label">Results Turnaround Time</div>
          </div>
          <div className="stat-item">
            <StatCounter targetText="80+" />
            <div className="stat-label">Test Parameters Available</div>
          </div>
          <div className="stat-item">
            <StatCounter targetText="400 g" />
            <div className="stat-label">Ultra-Light &amp; Portable</div>
          </div>
        </div>
      </div>

      {/* ===== KEY FEATURES ===== */}
      <section className="key-features" id="features">
        <div className="features-layout">
          <FadeUp>
            <div className="section-title-wrap" style={{ textAlign: 'left', marginBottom: '32px' }}>
              <span className="section-eyebrow">Key Features</span>
              <h2 className="section-title" style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', lineHeight: 1.25 }}>
                Engineered for<br />Precision &amp; Portability
              </h2>
              <p className="section-sub" style={{ margin: '0', maxWidth: '100%' }}>
                A fast, compact analyzer delivering lab-grade quantitative IVD results wherever patients need care.
              </p>
            </div>
            <div className="features-list">
              <TiltCard className="feature-card">
                <div className="feature-icon">🤲</div>
                <div className="feature-text">
                  <h3>Portable &amp; Handheld</h3>
                  <p>Compact at 186 × 80 × 54 mm and weighing just 400 g. Fits in a lab coat pocket and works anywhere.</p>
                </div>
              </TiltCard>
              <TiltCard className="feature-card">
                <div className="feature-icon">⚗️</div>
                <div className="feature-text">
                  <h3>Quantitative Lab-Grade Results</h3>
                  <p>Instant quantitative results in 3–15 minutes with excellent correlation to CLIA reference methods.</p>
                </div>
              </TiltCard>
              <TiltCard className="feature-card">
                <div className="feature-icon">🔋</div>
                <div className="feature-text">
                  <h3>Long Battery Life</h3>
                  <p>Rechargeable lithium-ion battery with USB Type-C charging. Stays on through long shifts without interruption.</p>
                </div>
              </TiltCard>
              <TiltCard className="feature-card">
                <div className="feature-icon">📡</div>
                <div className="feature-text">
                  <h3>Full Connectivity</h3>
                  <p>Wi-Fi, 4G network, USB Type-C, Bluetooth thermal printer support, auto upload &amp; LIMS connectivity, and universal HL7 interface for seamless data sharing.</p>
                </div>
              </TiltCard>
              <TiltCard className="feature-card">
                <div className="feature-icon">💾</div>
                <div className="feature-text">
                  <h3>Massive Data Storage</h3>
                  <p>Stores nearly 50,000 test results onboard. Built-in QR/Barcode scanner for fast patient identification.</p>
                </div>
              </TiltCard>
              <TiltCard className="feature-card">
                <div className="feature-icon">🖥️</div>
                <div className="feature-text">
                  <h3>4.3 inch Touch Screen</h3>
                  <p>720 × 1280 LCD display running Android OS. Smooth operation with easy software updates over-the-air.</p>
                </div>
              </TiltCard>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="features-device-visual">
              <img
                src="/hero.webp"
                alt="DX 101 device front view"
                className="device-main-img"
                width="380"
                height="285"
                loading="lazy"
              />
              <div className="feature-steps">
                <div className="feature-step">
                  <div className="step-num">01</div>
                  <div className="step-label">Ultra-Fast<br />Test</div>
                </div>
                <div className="feature-step">
                  <div className="step-num">02</div>
                  <div className="step-label">Easy<br />Calibration</div>
                </div>
                <div className="feature-step">
                  <div className="step-num">03</div>
                  <div className="step-label">Multi-<br />parameter</div>
                </div>
                <div className="feature-step">
                  <div className="step-num">04</div>
                  <div className="step-label">Big<br />Memory</div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== FEATURED PRODUCT CTA BANNER ===== */}
      <section className="featured-product-banner">
        <div className="fpb-inner">
          <FadeUp>
            <div className="fpb-text">
              <span className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.6)' }}>Featured Product</span>
              <h2>DX 101 Immunofluorescence Quantitative Analyzer</h2>
              <p>
                India's first handheld, multi-parameter point-of-care diagnostic device. CE certified and EU-IVD compliant
                — built for precision at the point of care.
              </p>
              <div className="fpb-price-block">
                <span className="fpb-price-label">Category:</span>
                <span className="fpb-price">Diagnostic Equipment · POCT Analyzer</span>
              </div>
              <div className="fpb-actions">
                <button
                  className="btn-primary"
                  onClick={() =>
                    addToCart({
                      name: 'DX 101 Immunofluorescence Analyzer',
                      price: 'Contact for Pricing',
                      img: 'hero.webp',
                    })
                  }
                >
                  🛒 Add to Cart
                </button>
                <Link to="/products#dx101" className="btn-outline-white">View Details →</Link>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="fpb-img-wrap">
              <img
                src="/hero.webp"
                alt="DX 101 Analyzer"
                className="fpb-img"
                width="380"
                height="330"
                loading="lazy"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== APPLICATION SCENARIOS ===== */}
      <section className="applications" id="applications">
        <div className="applications-inner">
          <FadeUp>
            <div className="section-title-wrap">
              <span className="section-eyebrow">Application Scenarios</span>
              <h2 className="section-title">Built for Every Care Setting</h2>
              <p className="section-sub">From bustling emergency departments to remote home visits, DX 101 delivers reliable diagnostics wherever needed.</p>
            </div>
          </FadeUp>
          <div className="app-grid">
            <FadeUp delay={0.1}>
              <div className="app-card">
                <img src="/hospital_application.png" alt="Hospital ICU application scenario" width="300" height="400" loading="lazy" />
                <div className="app-card-overlay">
                  <div className="app-card-title">🏥 Hospital &amp; ICU</div>
                  <div className="app-card-desc">Rapid cardiac, coagulation, and inflammation markers for critical care units and emergency departments.</div>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="app-card">
                <img src="/ambulance_application.png" alt="Ambulance point-of-care testing" width="300" height="400" loading="lazy" />
                <div className="app-card-overlay">
                  <div className="app-card-title">🚑 Ambulance</div>
                  <div className="app-card-desc">Lightweight and battery-powered — enables diagnostic testing during patient transport.</div>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="app-card">
                <img src="/pharmacy_application.png" alt="Pharmacy point-of-care testing" width="300" height="400" loading="lazy" />
                <div className="app-card-overlay">
                  <div className="app-card-title">💊 Pharmacy &amp; Clinic</div>
                  <div className="app-card-desc">Thyroid, diabetes, vitamin, and fertility panels available at pharmacy level for faster patient outcomes.</div>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.4}>
              <div className="app-card">
                <img src="/remote_home_application.png" alt="Remote and home testing" width="300" height="400" loading="lazy" />
                <div className="app-card-overlay">
                  <div className="app-card-title">🏡 Remote &amp; Home Testing</div>
                  <div className="app-card-desc">Small blood volume, simple operation — ideal for community health workers and home care settings.</div>
                </div>
              </div>
            </FadeUp>
          </div>
          <FadeUp>
            <div className="app-icons-row">
              <div className="app-icon-chip"><span className="icon">🏥</span><span className="label">Clinic</span></div>
              <div className="app-icon-chip"><span className="icon">🚑</span><span className="label">Emergency</span></div>
              <div className="app-icon-chip"><span className="icon">🩺</span><span className="label">ICU</span></div>
              <div className="app-icon-chip"><span className="icon">🚐</span><span className="label">Ambulance</span></div>
              <div className="app-icon-chip"><span className="icon">🩸</span><span className="label">Blood Bank</span></div>
              <div className="app-icon-chip"><span className="icon">👨‍⚕️</span><span className="label">GP</span></div>
              <div className="app-icon-chip"><span className="icon">🏨</span><span className="label">Ward</span></div>
              <div className="app-icon-chip"><span className="icon">💊</span><span className="label">Pharmacy</span></div>
              <div className="app-icon-chip"><span className="icon">❤️</span><span className="label">CCU</span></div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== OPERATION GUIDE ===== */}
      <section className="how-it-works">
        <div className="how-inner">
          <FadeUp>
            <div className="section-title-wrap">
              <span className="section-eyebrow">Operation Guide</span>
              <h2 className="section-title">Simple 4-Step Operation</h2>
              <p className="section-sub">No complex setup, no specialized training required. DX 101 is designed for anyone.</p>
            </div>
          </FadeUp>
          <div className="steps-flow">
            <FadeUp delay={0.1}>
              <div className="step-flow-item">
                <div className="step-circle">💳</div>
                <div className="step-flow-title">Insert Test Card</div>
                <div className="step-flow-desc">Click Sample Test and insert the appropriate immunofluorescence test card.</div>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="step-flow-item">
                <div className="step-circle">📷</div>
                <div className="step-flow-title">Enter Patient Info</div>
                <div className="step-flow-desc">Enter or scan patient information using the built-in QR/Barcode scanner.</div>
              </div>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="step-flow-item">
                <div className="step-circle">🩸</div>
                <div className="step-flow-title">Add Sample</div>
                <div className="step-flow-desc">Add the sample (serum, plasma, whole blood, capillary blood, or urine) and tap Start.</div>
              </div>
            </FadeUp>
            <FadeUp delay={0.4}>
              <div className="step-flow-item">
                <div className="step-circle">📊</div>
                <div className="step-flow-title">Get Results</div>
                <div className="step-flow-desc">Receive accurate quantitative results on-screen within 3–15 minutes. Print or share instantly.</div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2>Ready to Transform Your Diagnostic Capability?</h2>
          <p>Contact DX BIOCODE today to request a demonstration, get a quote, or explore our full product range.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn-white">📞 Contact Us</Link>
            <Link to="/products" className="btn-outline-white">🛒 Browse Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
};
