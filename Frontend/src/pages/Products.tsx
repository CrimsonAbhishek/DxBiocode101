import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { TiltCard } from '../components/TiltCard';
import { CertificationsSection } from '../components/CertificationsSection';

export const Products: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const tabBarRef = useRef<HTMLDivElement>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const hash = location.hash.substring(1);
    const validTabs = ['overview', 'applications', 'test-menu', 'specs', 'certifications'];
    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash);
      setTimeout(() => {
        if (tabBarRef.current) {
          window.scrollTo({
            top: tabBarRef.current.offsetTop - 90,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, [location.hash]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  const handleAddToCart = () => {
    addToCart({
      name: 'DX 101 Immunofluorescence Analyzer',
      price: 'Contact for Pricing',
      img: 'hero.webp',
    });
  };

  return (
    <div>
      {/* ===== PAGE HERO ===== */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>Products
          </div>
          <h1>Our Products</h1>
          <p>Advanced point-of-care diagnostic equipment engineered for precision, speed, and reliability in any clinical setting.</p>
        </div>
      </div>

      {/* ===== MAIN PRODUCTS CONTENT ===== */}
      <main className="products-main">
        {/* Featured Product: DX 101 */}
        <div id="dx101" className="product-hero-card">
          <div className="fade-up">
            <span className="phc-badge">⭐ Flagship Product · India's First</span>
            <h2 className="phc-title">DX 101 Immunofluorescence Quantitative Analyzer</h2>
            <p className="phc-desc">
              India's first portable and handheld multi-parameter POCT device. Compact, user-friendly, and built for rapid quantitative results — in clinics, ICUs, ambulances, and beyond. CE certified and EU-IVD compliant.
            </p>
            <div className="phc-tags">
              <span className="phc-tag">🏥 Point-of-Care Ready</span>
              <span className="phc-tag">⚡ Results in 3–15 min</span>
              <span className="phc-tag">📱 Android OS</span>
              <span className="phc-tag">☁️ Wi-Fi &amp; 4G</span>
              <span className="phc-tag">🔋 Long Battery Life</span>
              <span className="phc-tag">💾 50,000 Results Storage</span>
              <span className="phc-tag">⚖ 400 g Lightweight</span>
            </div>
            <div className="phc-actions">
              <button className="btn-primary" onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
              <Link to="/contact" className="btn-secondary">📞 Request Demo</Link>
              <a href="/Dx 101 - Analyzer.pdf" download className="btn-secondary">
                📥 Brochure
              </a>
            </div>
          </div>
          <div className="phc-img-wrap">
            <img src="/hero.webp" alt="DX 101 Immunofluorescence Quantitative Analyzer" className="phc-img" width="360" height="312" />
          </div>
        </div>

        {/* PRODUCT TAB BAR */}
        <div className="tab-bar" ref={tabBarRef} style={{ top: '80px', marginBottom: '64px' }}>
          <div className="tab-bar-inner">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => handleTabChange('applications')}
            >
              Applications
            </button>
            <button
              className={`tab-btn ${activeTab === 'test-menu' ? 'active' : ''}`}
              onClick={() => handleTabChange('test-menu')}
            >
              Test Menu
            </button>
            <button
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => handleTabChange('specs')}
            >
              Specifications
            </button>
            <button
              className={`tab-btn ${activeTab === 'certifications' ? 'active' : ''}`}
              onClick={() => handleTabChange('certifications')}
            >
              Certifications
            </button>
          </div>
        </div>

        {/* Overview Tab Panel */}
        {activeTab === 'overview' && (
          <div className="tab-panel active">
            <div style={{ marginBottom: '72px' }}>
              <div className="section-title-wrap">
                <span className="section-eyebrow">Product Capabilities</span>
                <h2 className="section-title">Engineered for Precision &amp; Portability</h2>
                <p className="section-sub">A fast, compact analyzer delivering lab-grade quantitative IVD results wherever patients need care.</p>
              </div>

              <div className="features-simplified-grid">
                <TiltCard className="feature-card feature-card-center">
                  <div className="feature-icon">🤲</div>
                  <div className="feature-text">
                    <h3>Portable &amp; Handheld</h3>
                    <p>Compact at 186 × 80 × 54 mm and weighing just 400 g. Fits in a lab coat pocket and works anywhere.</p>
                  </div>
                </TiltCard>
                <TiltCard className="feature-card feature-card-center">
                  <div className="feature-icon">⚗️</div>
                  <div className="feature-text">
                    <h3>Quantitative Results</h3>
                    <p>Instant quantitative results in 3–15 minutes with excellent correlation to CLIA reference methods.</p>
                  </div>
                </TiltCard>
                <TiltCard className="feature-card feature-card-center">
                  <div className="feature-icon">🔋</div>
                  <div className="feature-text">
                    <h3>Long Battery Life</h3>
                    <p>Rechargeable lithium-ion battery with USB Type-C charging. Stays on through long shifts.</p>
                  </div>
                </TiltCard>
                <TiltCard className="feature-card feature-card-center">
                  <div className="feature-icon">📡</div>
                  <div className="feature-text">
                    <h3>Full Connectivity</h3>
                    <p>Wi-Fi, 4G network, USB Type-C, Bluetooth thermal printer support, auto upload &amp; LIMS connectivity, and universal HL7 interface for data sharing.</p>
                  </div>
                </TiltCard>
                <TiltCard className="feature-card feature-card-center">
                  <div className="feature-icon">💾</div>
                  <div className="feature-text">
                    <h3>Massive Data Storage</h3>
                    <p>Stores nearly 50,000 test results onboard. Built-in QR/Barcode scanner for patient identification.</p>
                  </div>
                </TiltCard>
                <TiltCard className="feature-card feature-card-center">
                  <div className="feature-icon">🖥️</div>
                  <div className="feature-text">
                    <h3>5-inch Touch Screen</h3>
                    <p>720 × 1280 LCD display running Android OS. Smooth operation with easy software updates OTA.</p>
                  </div>
                </TiltCard>
              </div>
            </div>

            {/* Operation Guide */}
            <div className="how-it-works" style={{ padding: '64px 0', borderTop: '2px solid #e5e7eb', marginBottom: '32px', background: 'none' }}>
              <div className="how-inner">
                <div className="section-title-wrap">
                  <span className="section-eyebrow">Operation Guide</span>
                  <h2 className="section-title">Simple 4-Step Operation</h2>
                  <p className="section-sub">No complex setup, no specialized training required. DX 101 is designed for anyone.</p>
                </div>
                <div className="steps-flow">
                  <div className="step-flow-item">
                    <div className="step-circle">💳</div>
                    <div className="step-flow-title">Insert Test Card</div>
                    <div className="step-flow-desc">Click Sample Test and insert the appropriate immunofluorescence test card.</div>
                  </div>
                  <div className="step-flow-item">
                    <div className="step-circle">📷</div>
                    <div className="step-flow-title">Enter Patient Info</div>
                    <div className="step-flow-desc">Enter or scan patient information using the built-in QR/Barcode scanner.</div>
                  </div>
                  <div className="step-flow-item">
                    <div className="step-circle">🩸</div>
                    <div className="step-flow-title">Add Sample</div>
                    <div className="step-flow-desc">Add the sample (serum, plasma, whole blood, capillary blood, or urine) and tap Start.</div>
                  </div>
                  <div className="step-flow-item">
                    <div className="step-circle">📊</div>
                    <div className="step-flow-title">Get Results</div>
                    <div className="step-flow-desc">Receive accurate quantitative results on-screen within 3–15 minutes. Print or share instantly.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab Panel */}
        {activeTab === 'applications' && (
          <div className="tab-panel active">
            <div className="section-title-wrap">
              <span className="section-eyebrow">Application Scenarios</span>
              <h2 className="section-title">Built for Every Care Setting</h2>
              <p className="section-sub">From bustling emergency departments to remote home visits, DX 101 delivers reliable diagnostics wherever needed.</p>
            </div>
            <div className="app-grid" style={{ marginBottom: '64px' }}>
              <div className="app-card">
                <img src="/hospital_application.png" alt="Hospital ICU application scenario" width="300" height="400" loading="lazy" />
                <div className="app-card-overlay">
                  <div className="app-card-title">🏥 Hospital &amp; ICU</div>
                  <div className="app-card-desc">Rapid cardiac, coagulation, and inflammation markers for critical care units and emergency departments.</div>
                </div>
              </div>
              <div className="app-card">
                <img src="/ambulance_application.png" alt="Ambulance point-of-care testing" width="300" height="400" loading="lazy" />
                <div className="app-card-overlay">
                  <div className="app-card-title">🚑 Ambulance</div>
                  <div className="app-card-desc">Lightweight and battery-powered — enables diagnostic testing during patient transport.</div>
                </div>
              </div>
              <div className="app-card">
                <img src="/pharmacy_application.png" alt="Pharmacy point-of-care testing" width="300" height="400" loading="lazy" />
                <div className="app-card-overlay">
                  <div className="app-card-title">💊 Pharmacy &amp; Clinic</div>
                  <div className="app-card-desc">Thyroid, diabetes, vitamin, and fertility panels available at pharmacy level for faster patient outcomes.</div>
                </div>
              </div>
              <div className="app-card">
                <img src="/remote_home_application.png" alt="Remote and home testing" width="300" height="400" loading="lazy" />
                <div className="app-card-overlay">
                  <div className="app-card-title">🏡 Remote &amp; Home Testing</div>
                  <div className="app-card-desc">Small blood volume, simple operation — ideal for community health workers and home care settings.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Menu Tab Panel */}
        {activeTab === 'test-menu' && (
          <div className="tab-panel active">
            <div className="section-title-wrap">
              <span className="section-eyebrow">Test Menu</span>
              <h2 className="section-title">Comprehensive Multi-Parameter Testing</h2>
              <p className="section-sub">Over 80 assay parameters across 12 major clinical categories — all from a single handheld device.</p>
            </div>
            <div className="test-categories-grid">
              <TiltCard className="test-cat-card">
                <span className="test-cat-icon">❤️</span>
                <div className="test-cat-title">Cardiac Markers</div>
                <ul className="test-list">
                  <li>cTnI / hs-cTnI</li>
                  <li>TnT</li>
                  <li>CK-MB</li>
                  <li>BNP / NT-proBNP</li>
                  <li>H-FABP</li>
                  <li>ST2</li>
                  <li>CK-MB / cTnI / Myo</li>
                  <li>CK-MB / cTnI / H-FABP</li>
                </ul>
              </TiltCard>
              <TiltCard className="test-cat-card">
                <span className="test-cat-icon">🩺</span>
                <div className="test-cat-title">Thyroid Function</div>
                <ul className="test-list">
                  <li>TSH</li>
                  <li>T3 / T4</li>
                  <li>fT3 / fT4</li>
                </ul>
                <div className="test-cat-title" style={{ marginTop: '14px' }}>Coagulation</div>
                <ul className="test-list">
                  <li>D-Dimer</li>
                </ul>
                <div className="test-cat-title" style={{ marginTop: '14px' }}>Diabetes</div>
                <ul className="test-list">
                  <li>HbA1c</li>
                </ul>
              </TiltCard>
              <TiltCard className="test-cat-card">
                <span className="test-cat-icon">🔬</span>
                <div className="test-cat-title">Inflammation</div>
                <ul className="test-list">
                  <li>SAA</li>
                  <li>IL-6</li>
                  <li>PCT</li>
                  <li>CRP / hs-CRP</li>
                  <li>Calprotectin</li>
                </ul>
                <div className="test-cat-title" style={{ marginTop: '14px' }}>Renal Function</div>
                <ul className="test-list">
                  <li>CysC</li>
                  <li>mAlb / β2-MG / NGAL</li>
                </ul>
              </TiltCard>
              <TiltCard className="test-cat-card">
                <span className="test-cat-icon">🦠</span>
                <div className="test-cat-title">Infectious Diseases</div>
                <ul className="test-list">
                  <li>Anti-HCV / Anti-TP</li>
                  <li>Anti-HIV / HBsAg</li>
                  <li>Anti-HBs</li>
                  <li>SARS-CoV-2 Ag</li>
                  <li>H. pylori Ag/Ab</li>
                  <li>Influenza A/B</li>
                  <li>Dengue NS1/IgG/IgM</li>
                  <li>RSV/Influenza A/B</li>
                </ul>
              </TiltCard>
              <TiltCard className="test-cat-card">
                <span className="test-cat-icon">🌸</span>
                <div className="test-cat-title">Fertility</div>
                <ul className="test-list">
                  <li>HCG+β / LH / FSH</li>
                  <li>AMH / PRL</li>
                  <li>Progesterone</li>
                  <li>Estradiol</li>
                  <li>Testosterone</li>
                </ul>
              </TiltCard>
              <TiltCard className="test-cat-card">
                <span className="test-cat-icon">🏷️</span>
                <div className="test-cat-title">Tumor Markers</div>
                <ul className="test-list">
                  <li>tPSA / fPSA</li>
                  <li>AFP / CEA</li>
                  <li>CA125 / CA19-9 / CA15-3</li>
                  <li>PG I / PG II</li>
                </ul>
              </TiltCard>
              <TiltCard className="test-cat-card">
                <span className="test-cat-icon">☀️</span>
                <div className="test-cat-title">Vitamins</div>
                <ul className="test-list">
                  <li>25-OH Vitamin D</li>
                  <li>Folate</li>
                  <li>Vitamin B12</li>
                </ul>
                <div className="test-cat-title" style={{ marginTop: '14px' }}>Metabolic</div>
                <ul className="test-list">
                  <li>Osteocalcin</li>
                </ul>
              </TiltCard>
              <TiltCard className="test-cat-card">
                <span className="test-cat-icon">🧬</span>
                <div className="test-cat-title">Rheumatology</div>
                <ul className="test-list">
                  <li>RF</li>
                  <li>ASO</li>
                  <li>Anti-CCP</li>
                </ul>
                <div className="test-cat-title" style={{ marginTop: '14px' }}>Other Tests</div>
                <ul className="test-list">
                  <li>Cortisol</li>
                  <li>Total IgE</li>
                  <li>Ferritin</li>
                </ul>
              </TiltCard>
              <TiltCard className="test-cat-card">
                <span className="test-cat-icon">🩸</span>
                <div className="test-cat-title">Sample Types</div>
                <ul className="test-list">
                  <li>Serum</li>
                  <li>Plasma</li>
                  <li>Whole Blood</li>
                  <li>Capillary Blood</li>
                  <li>Urine</li>
                </ul>
                <div style={{ marginTop: '12px', fontSize: '11.5px', color: '#6b7280', lineHeight: 1.5 }}>
                  Volume: <strong style={{ color: '#3a7bd5' }}>10–200 µL</strong> depending on assay
                </div>
              </TiltCard>
              <TiltCard className="test-cat-card" style={{ gridColumn: 'span 2' }}>
                <span className="test-cat-icon">🌐</span>
                <div className="test-cat-title">Languages Supported</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  <span style={{ background: '#eaf0fb', color: '#3a7bd5', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>🇬🇧 English</span>
                  <span style={{ background: '#eaf0fb', color: '#3a7bd5', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>🇩🇪 German</span>
                  <span style={{ background: '#eaf0fb', color: '#3a7bd5', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>🇮🇳 Hindi</span>
                  <span style={{ background: '#eaf0fb', color: '#3a7bd5', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>🇮🇳 Tamil</span>
                  <span style={{ background: '#eaf0fb', color: '#3a7bd5', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>+ Customizable</span>
                </div>
              </TiltCard>
            </div>
          </div>
        )}

        {/* Specifications Tab Panel */}
        {activeTab === 'specs' && (
          <div className="tab-panel active">
            <div className="section-title-wrap">
              <span className="section-eyebrow">Technical Specifications</span>
              <h2 className="section-title">Built to Perform</h2>
              <p className="section-sub">Precision-engineered specifications meeting the demands of modern point-of-care diagnostics.</p>
            </div>
            <div className="specs-layout">
              <div>
                <div className="spec-group">
                  <div className="spec-group-title">📐 Physical</div>
                  <table className="spec-table">
                    <tbody>
                      <tr><td>Dimensions</td><td>186 mm × 80 mm × 54 mm</td></tr>
                      <tr><td>Weight</td><td>400 g</td></tr>
                      <tr><td>Display</td><td>5-inch LCD Touch Screen, 720 × 1280</td></tr>
                      <tr><td>Operating System</td><td>Android — smooth, OTA-updatable</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="spec-group">
                  <div className="spec-group-title">⚡ Power &amp; Connectivity</div>
                  <table className="spec-table">
                    <tbody>
                      <tr><td>Battery</td><td>Rechargeable Li-ion, long-lasting</td></tr>
                      <tr><td>Charging Port</td><td>USB Type-C</td></tr>
                      <tr><td>Wireless</td><td>Wi-Fi &amp; 4G network communication</td></tr>
                      <tr><td>Printer</td><td>Bluetooth thermal printer support</td></tr>
                      <tr><td>LIMS/LIS</td><td>Auto upload &amp; LIMS connectivity, universal HL7 interface</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="spec-group">
                  <div className="spec-group-title">🌡 Working Environment</div>
                  <table className="spec-table">
                    <tbody>
                      <tr><td>Temperature</td><td>10°C – 35°C</td></tr>
                      <tr><td>Relative Humidity</td><td>≤ 70%</td></tr>
                      <tr><td>Air Pressure</td><td>70.0 kPa – 106.0 kPa</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="spec-group">
                  <div className="spec-group-title">🎯 Performance</div>
                  <table className="spec-table">
                    <tbody>
                      <tr><td>Results Time</td><td>3 – 15 minutes</td></tr>
                      <tr><td>Repeatability (CV)</td><td>≤ 2% within 100–15,000 mV</td></tr>
                      <tr><td>Repeatability (low)</td><td>≤ 10% within 0–100 mV</td></tr>
                      <tr><td>Accuracy</td><td>Good correlation with CLIA methods; reduced temperature influence</td></tr>
                      <tr><td>Data Storage</td><td>~50,000 test results</td></tr>
                      <tr><td>Scanner</td><td>QR / Barcode built-in</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="spec-group">
                  <div className="spec-group-title">🩸 Sampling</div>
                  <table className="spec-table">
                    <tbody>
                      <tr><td>Sample Types</td><td>Serum, Plasma, Whole Blood, Capillary Blood, Urine</td></tr>
                      <tr><td>Sample Volume</td><td>10 – 200 µL (assay-dependent)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="specs-device-wrap">
                <img src="/hero.webp" alt="DX 101 device technical view" className="specs-img" width="420" height="364" loading="lazy" />
                <div className="spec-highlights">
                  <div className="spec-hl-card"><div className="spec-hl-val">5"</div><div className="spec-hl-key">Touch Screen</div></div>
                  <div className="spec-hl-card"><div className="spec-hl-val">400g</div><div className="spec-hl-key">Ultra Light</div></div>
                  <div className="spec-hl-card"><div className="spec-hl-val">USB-C</div><div className="spec-hl-key">Fast Charging</div></div>
                  <div className="spec-hl-card"><div className="spec-hl-val">50K</div><div className="spec-hl-key">Result Storage</div></div>
                  <div className="spec-hl-card"><div className="spec-hl-val">4G</div><div className="spec-hl-key">Connectivity</div></div>
                  <div className="spec-hl-card"><div className="spec-hl-val">CV≤2%</div><div className="spec-hl-key">Repeatability</div></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certifications Tab Panel */}
        {activeTab === 'certifications' && (
          <div className="tab-panel active">
            <CertificationsSection />
          </div>
        )}

        {/* Coming Soon Products */}
        <div style={{ padding: '64px 0', borderTop: '2px solid #e5e7eb' }}>
          <div className="section-title-wrap">
            <span className="section-eyebrow">Expanding Portfolio</span>
            <h2 className="section-title">More Products Coming Soon</h2>
            <p className="section-sub">DX BIOCODE is continuously expanding its range of diagnostic equipment for every healthcare need.</p>
          </div>
          <div className="coming-soon-grid">
            <div className="coming-soon-card">
              <span className="cs-icon">🔬</span>
              <div className="cs-title">Benchtop POCT Analyzer</div>
              <p className="cs-desc">High-throughput immunofluorescence analyzer for laboratory settings with expanded test menu and automated loading.</p>
              <span className="cs-badge">Coming Soon</span>
            </div>
            <div className="coming-soon-card">
              <span className="cs-icon">💉</span>
              <div className="cs-title">Specialty Test Panels</div>
              <p className="cs-desc">Dedicated rapid test panels for neonatal screening, drug abuse testing, and advanced oncology markers.</p>
              <span className="cs-badge">Coming Soon</span>
            </div>
            <div className="coming-soon-card">
              <span className="cs-icon">📡</span>
              <div className="cs-title">Telemedicine Integration Kit</div>
              <p className="cs-desc">Seamlessly connect DX 101 to telehealth platforms with cloud-based result management and remote monitoring.</p>
              <span className="cs-badge">Coming Soon</span>
            </div>
          </div>
        </div>
      </main>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2>Interested in a Product Demonstration?</h2>
          <p>Contact our team to schedule a live demo, get a quote, or discuss custom requirements for your facility.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn-white">📞 Contact Us</Link>
            <a href="/Dx 101 - Analyzer.pdf" download className="btn-outline-white">📥 Download Brochure</a>
          </div>
        </div>
      </section>
    </div>
  );
};
