import type { Metadata } from 'next';
import Link from 'next/link';
import FadeUp from '@/components/FadeUp';
import CtaBanner from '@/components/CtaBanner';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'DX BIOCODE Pvt. Ltd. — Pioneering India\'s first handheld multi-parameter POCT analyzer. Our story, mission, and values.',
};

const VALUES = [
  { icon: '🔬', title: 'Innovation', desc: 'We push the boundaries of point-of-care diagnostics, turning bold scientific ideas into life-changing technology.' },
  { icon: '🎯', title: 'Accuracy', desc: 'We never compromise on diagnostic precision. Every result must be quantitatively accurate and clinically reliable.' },
  { icon: '🌍', title: 'Accessibility', desc: 'We believe quality diagnostics should reach every corner of India — from urban hospitals to remote villages.' },
  { icon: '🤝', title: 'Partnership', desc: 'We build long-term, trust-based partnerships with distributors, clinicians, and healthcare institutions.' },
  { icon: '⚖️', title: 'Integrity', desc: 'We operate with complete transparency and honesty — in our science, our business, and our relationships.' },
  { icon: '💡', title: 'Patient First', desc: 'Every product decision is guided by one principle: how does this improve outcomes for the patient?' },
];

export default function AboutPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link><span>/</span>About Us</div>
          <h1>About DX BIOCODE</h1>
          <p>Pioneering India&apos;s diagnostic revolution — one innovation at a time.</p>
        </div>
      </div>

      <main className="about-main">
        {/* Company Story */}
        <div className="about-grid">
          <FadeUp>
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                DX BIOCODE Pvt. Ltd. was founded with a singular mission: to democratize access to advanced diagnostic technology across India. We saw a critical gap — the country&apos;s vast healthcare network needed rapid, accurate, multi-parameter diagnostics that could work outside the lab.
              </p>
              <p>
                The result was the DX 101 Immunofluorescence Quantitative Analyzer — India&apos;s first genuinely handheld, multi-parameter POCT device. Housed at 27(38), First Floor, Madley Road, T. Nagar, Chennai, our team of diagnostic scientists, biomedical engineers, and clinical specialists worked for years to build a platform that could deliver hospital-grade accuracy in the palm of a hand.
              </p>
              <p>
                Today, with CE and EU-IVD certifications and a growing network of healthcare partners, DX BIOCODE is at the forefront of transforming point-of-care diagnostics across India and beyond.
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
                <span className="ce-strip">✔ CE Certified</span>
                <span className="ce-strip">✔ EU-IVD Compliant</span>
                <span className="ce-strip">🇮🇳 Made in India</span>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div style={{ background: 'linear-gradient(135deg,#0a1628,#1e3f8a)', borderRadius: 'var(--radius-lg)', padding: 48, position: 'relative', overflow: 'hidden', color: 'white' }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle,rgba(233,30,140,.12),transparent 70%)' }} />
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, marginBottom: 24, position: 'relative', zIndex: 1, letterSpacing: -0.5 }}>Our Mission</h3>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', marginBottom: 28, position: 'relative', zIndex: 1 }}>
                To make quantitative immunofluorescence diagnostics accessible at every point of care — empowering clinicians with the information they need, when and where they need it.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, position: 'relative', zIndex: 1 }}>
                {[
                  { num: '50+', label: 'Test Parameters' },
                  { num: '8 min', label: 'Result Time' },
                  { num: '200 g', label: 'Device Weight' },
                  { num: '>99%', label: 'Accuracy' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 12px', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{s.num}</div>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Values */}
        <div className="values-section">
          <FadeUp>
            <div className="section-title-wrap">
              <span className="section-eyebrow">What We Stand For</span>
              <h2 className="section-title">Our Core Values</h2>
            </div>
          </FadeUp>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.08}>
                <div className="value-card">
                  <span className="value-icon">{v.icon}</span>
                  <div className="value-title">{v.title}</div>
                  <p className="value-desc">{v.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* Location */}
        <FadeUp>
          <div style={{ background: '#f8f5ff', borderRadius: 'var(--radius-lg)', padding: 48, textAlign: 'center' }}>
            <span className="section-eyebrow">Find Us</span>
            <h2 className="section-title" style={{ marginTop: 8 }}>Our Office</h2>
            <p style={{ fontSize: 16, color: '#374151', maxWidth: 500, margin: '0 auto 24px' }}>
              27(38), First Floor, Madley Road, T. Nagar, Chennai, Tamil Nadu, India – 600017
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://wa.me/918080885059" target="_blank" rel="noopener noreferrer" className="btn-primary">💬 +91 8080885059</a>
              <a href="mailto:info@dxbiocode.com" className="btn-secondary">✉️ info@dxbiocode.com</a>
            </div>
          </div>
        </FadeUp>
      </main>

      <CtaBanner
        title="Ready to Partner with DX BIOCODE?"
        desc="Explore distribution opportunities, request a demo, or simply get in touch."
        primaryText="📞 Contact Us"
        primaryHref="/contact"
        secondaryText="📋 Request Quote"
        secondaryHref="/quote"
      />
    </>
  );
}
