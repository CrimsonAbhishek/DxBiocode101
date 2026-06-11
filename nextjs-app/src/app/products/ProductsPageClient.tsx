'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FadeUp from '@/components/FadeUp';
import TiltCard from '@/components/TiltCard';
import CertificationsSection from '@/components/CertificationsSection';
import { useCartStore } from '@/lib/CartStore';

interface TestCategory {
  icon: string;
  title: string;
  tests: string[];
}

interface SpecHighlight {
  val: string;
  unit: string;
  label: string;
}

interface Props {
  testCategories: TestCategory[];
  specHighlights: SpecHighlight[];
}

export default function ProductsPageClient({ testCategories, specHighlights }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'test-menu' | 'specs' | 'certifications'>('overview');
  const { addToCart, openCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      id: 'dx101',
      name: 'DX 101 Immunofluorescence Quantitative Analyzer',
      price: 'Request for Quote',
      img: '/hero.webp',
      category: 'POCT Analyzer',
    });
    openCart();
  };

  return (
    <>
      {/* Tab Bar */}
      <div className="tab-bar">
        <div className="tab-bar-inner">
          {(['overview', 'test-menu', 'specs', 'certifications'] as const).map(tab => (
            <button
              key={tab}
              className={`tab-btn${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' ? 'Overview' : tab === 'test-menu' ? 'Test Menu' : tab === 'specs' ? 'Specifications' : 'Certifications'}
            </button>
          ))}
        </div>
      </div>

      <div className="products-main">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Product Hero Card */}
            <FadeUp>
              <div className="product-hero-card" id="dx101">
                <div>
                  <span className="phc-badge">🇮🇳 India&apos;s First · Handheld · Multi-Parameter</span>
                  <h2 className="phc-title">DX 101 Immunofluorescence Quantitative Analyzer</h2>
                  <p className="phc-desc">
                    The DX 101 is a revolutionary handheld point-of-care testing (POCT) device that delivers 
                    quantitative immunofluorescence analysis for 50+ biomarkers — in just 8 minutes, 
                    from a 5µL finger-prick sample.
                  </p>
                  <div className="phc-tags">
                    <span className="phc-tag">⚡ 8-Min Results</span>
                    <span className="phc-tag">🤏 Truly Handheld</span>
                    <span className="phc-tag">🔬 Quantitative IFA</span>
                    <span className="phc-tag">📡 Wi-Fi + Bluetooth</span>
                    <span className="phc-tag">🌡️ Ambient Storage</span>
                    <span className="phc-tag">✔ CE Certified</span>
                  </div>
                  <div className="phc-actions">
                    <button className="btn-primary" onClick={handleAddToCart}>
                      🛒 Add to Quote
                    </button>
                    <a href="/Dx 101 - Analyzer.pdf" download className="btn-secondary">
                      📥 Download Brochure
                    </a>
                  </div>
                </div>
                <div className="phc-img-wrap">
                  <Image src="/hero.webp" alt="DX 101 Analyzer" className="phc-img" width={400} height={460} />
                </div>
              </div>
            </FadeUp>

            {/* Spec Highlights */}
            <FadeUp delay={0.1}>
              <div className="spec-highlights" style={{ marginBottom: 72 }}>
                {specHighlights.map(s => (
                  <TiltCard key={s.label} className="spec-hl-card">
                    <div className="spec-hl-val">{s.val}<span style={{ fontSize: 14 }}>{s.unit}</span></div>
                    <div className="spec-hl-key">{s.label}</div>
                  </TiltCard>
                ))}
              </div>
            </FadeUp>

            {/* Coming Soon */}
            <FadeUp delay={0.15}>
              <div className="section-title-wrap">
                <span className="section-eyebrow">Coming Soon</span>
                <h2 className="section-title">Expanding Product Line</h2>
              </div>
              <div className="coming-soon-grid">
                {[
                  { icon: '🔬', title: 'DX 201 Benchtop Analyzer', desc: 'High-throughput benchtop solution for hospital laboratories with automated sample processing and 80+ test parameters.' },
                  { icon: '💊', title: 'Expanded Drug Monitoring Panel', desc: 'Therapeutic drug monitoring for immunosuppressants, antibiotics, and cardiac drugs — at point of care.' },
                  { icon: '🧫', title: 'Microfluidic Cartridge Platform', desc: 'Next-generation microfluidic cartridges enabling multiplexed testing from a single drop of blood in 5 minutes.' },
                ].map(cs => (
                  <div key={cs.title} className="coming-soon-card">
                    <span className="cs-icon">{cs.icon}</span>
                    <div className="cs-title">{cs.title}</div>
                    <p className="cs-desc">{cs.desc}</p>
                    <span className="cs-badge">Coming 2025</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </>
        )}

        {/* TEST MENU TAB */}
        {activeTab === 'test-menu' && (
          <>
            <FadeUp>
              <div className="section-title-wrap" id="test-menu">
                <span className="section-eyebrow">Available Tests</span>
                <h2 className="section-title">Comprehensive Test Menu</h2>
                <p className="section-sub">50+ biomarkers across 10 clinical categories — all from a single platform.</p>
              </div>
            </FadeUp>
            <div className="test-categories-grid">
              {testCategories.map((cat, i) => (
                <FadeUp key={cat.title} delay={i * 0.05}>
                  <TiltCard className="test-cat-card">
                    <span className="test-cat-icon">{cat.icon}</span>
                    <div className="test-cat-title">{cat.title}</div>
                    <ul className="test-list">
                      {cat.tests.map(t => <li key={t}>{t}</li>)}
                    </ul>
                  </TiltCard>
                </FadeUp>
              ))}
            </div>
          </>
        )}

        {/* SPECS TAB */}
        {activeTab === 'specs' && (
          <FadeUp>
            <div className="specs-section" id="specs">
              <div className="section-title-wrap">
                <span className="section-eyebrow">Technical Details</span>
                <h2 className="section-title">Full Specifications</h2>
              </div>
              <div className="specs-layout">
                <div>
                  <div className="spec-group">
                    <div className="spec-group-title">⚙️ Core Performance</div>
                    <table className="spec-table">
                      <tbody>
                        {[
                          ['Technology', 'Immunofluorescence Quantitative Analysis (IFA)'],
                          ['Result Time', '8 minutes (from sample application)'],
                          ['Sample Volume', '5 µL (finger-prick capillary blood)'],
                          ['Sample Types', 'Whole blood, Serum, Plasma'],
                          ['Detection Range', 'Wide linear range for all panels'],
                          ['Accuracy (CV%)', '<5% CV (inter-assay precision)'],
                        ].map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                  <div className="spec-group">
                    <div className="spec-group-title">📱 Device</div>
                    <table className="spec-table">
                      <tbody>
                        {[
                          ['Display', '5-inch color touchscreen (IPS, 1080p)'],
                          ['Weight', '~200 g (with battery)'],
                          ['Dimensions', '155 × 75 × 28 mm'],
                          ['Battery', '3000 mAh Li-ion, 50+ tests per charge'],
                          ['Connectivity', 'Wi-Fi 802.11 b/g/n, Bluetooth 5.0, LIMS auto upload (universal HL7 interface)'],
                          ['Operating Temp.', '15°C – 30°C'],
                        ].map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                  <div className="spec-group">
                    <div className="spec-group-title">🧪 Test Cartridges</div>
                    <table className="spec-table">
                      <tbody>
                        {[
                          ['Storage Temp.', '2°C – 30°C (ambient capable)'],
                          ['Shelf Life', '18 months from manufacture date'],
                          ['Cartridge Format', 'Single-use, sealed microfluidic'],
                          ['Calibration', 'Barcode-based auto-calibration (no manual cal.)'],
                          ['QC', 'Built-in internal QC per cartridge'],
                        ].map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="specs-device-wrap">
                  <Image src="/hero.webp" alt="DX 101 Device" className="specs-img" width={400} height={460} />
                  <div className="spec-highlights">
                    {specHighlights.map(s => (
                      <TiltCard key={s.label} className="spec-hl-card">
                        <div className="spec-hl-val">{s.val}<span style={{ fontSize: 14 }}>{s.unit}</span></div>
                        <div className="spec-hl-key">{s.label}</div>
                      </TiltCard>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <div style={{ marginTop: -60, marginLeft: -24, marginRight: -24 }}>
            <CertificationsSection />
          </div>
        )}
      </div>
    </>
  );
}
