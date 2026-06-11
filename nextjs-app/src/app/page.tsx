import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import FadeUp from '@/components/FadeUp';
import StatCounter from '@/components/StatCounter';
import TiltCard from '@/components/TiltCard';
import CtaBanner from '@/components/CtaBanner';
import CertificationsSection from '@/components/CertificationsSection';

export const metadata: Metadata = {
  title: 'Home — India\'s First Handheld POCT Analyzer',
  description: 'DX BIOCODE pioneering India\'s first handheld multi-parameter immunofluorescence POCT diagnostic analyzer. CE & EU-IVD certified.',
};

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-mesh" />
        <div className="hero-inner-wrapper" style={{ width: '100%' }}>
          <div className="hero-inner">
            <div className="hero-text">
              <div className="hero-badge">
                <span className="dot" />
                India&apos;s First Handheld POCT
              </div>
              <h1>
                Revolutionizing<br/>
                <span>Point-of-Care</span><br/>
                Diagnostics
              </h1>
              <p className="hero-desc">
                The DX 101 Immunofluorescence Quantitative Analyzer delivers hospital-grade 
                accuracy in a handheld device — enabling rapid, multi-parameter testing 
                at the point of care across India.
              </p>
              <div className="hero-tags">
                <span className="hero-tag">⚡ 8-Minute Results</span>
                <span className="hero-tag">📊 Multi-Parameter</span>
                <span className="hero-tag">🔬 Quantitative IFA</span>
                <span className="hero-tag">📡 Wireless Connectivity</span>
                <span className="hero-tag">🌡️ Ambient Storage</span>
              </div>
              <div className="hero-actions">
                <Link href="/quote" className="btn-primary">Get a Quote →</Link>
                <Link href="/products" className="btn-secondary">Explore Products</Link>
              </div>

            </div>
            <div className="hero-image-wrap">
              <Image
                src="/hero.webp"
                alt="DX 101 Immunofluorescence Quantitative Analyzer"
                className="hero-img"
                width={500}
                height={580}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          <StatCounter target={50} suffix="+" label="Test Parameters" />
          <StatCounter target={8} suffix=" min" label="Result Time" />
          <StatCounter target={99} suffix="%" label="Accuracy Rate" />
          <StatCounter target={5} suffix="+" label="Application Areas" />
        </div>
      </div>

      {/* ===== KEY FEATURES ===== */}
      <section className="key-features" id="features">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeUp>
            <div className="section-title-wrap">
              <span className="section-eyebrow">Core Technology</span>
              <h2 className="section-title">Why DX 101 Stands Apart</h2>
              <p className="section-sub">
                Built on advanced immunofluorescence quantitative analysis — delivering lab-grade results in a handheld form factor.
              </p>
            </div>
          </FadeUp>

          <div className="features-simplified-grid">
            {[
              { icon: '⚡', title: 'Rapid Results in 8 Minutes', desc: 'From sample to result in under 8 minutes — enabling critical clinical decisions at the bedside, ICU, or field.' },
              { icon: '📊', title: 'Multi-Parameter Analysis', desc: 'Simultaneously test for cardiac, thyroid, infection, fertility, and tumor markers from a single finger-prick sample.' },
              { icon: '🔬', title: 'Quantitative IFA Technology', desc: 'Proprietary immunofluorescence technology delivering precise quantitative readings with hospital-grade accuracy.' },
              { icon: '📡', title: 'Wireless & Cloud Ready', desc: 'Wi-Fi, 4G, and Bluetooth connectivity with cloud data management, LIS/LIMS connectivity (universal HL7 interface) with auto upload, and real-time reporting.' },
              { icon: '🌡️', title: 'Ambient Storage Test Kits', desc: 'No cold chain required — reagent cartridges store at ambient temperature for simplified logistics and field deployment.' },
              { icon: '🤏', title: 'Truly Handheld', desc: 'The world\'s first genuinely pocket-sized multi-parameter POCT analyzer — weighing just 200g with battery operation.' },
            ].map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.08}>
                <TiltCard className="feature-card feature-card-center">
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-text">
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </TiltCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== APPLICATION SCENARIOS ===== */}
      <section className="applications" id="applications">
        <div className="applications-inner">
          <FadeUp>
            <div className="section-title-wrap">
              <span className="section-eyebrow">Application Scenarios</span>
              <h2 className="section-title">Where DX 101 Makes a Difference</h2>
              <p className="section-sub">
                From urban hospitals to remote clinics — the DX 101 adapts to every care setting.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="app-grid">
              {[
                { img: '/hospital_application.png', title: 'Hospital & ICU', desc: 'Rapid cardiac and critical care markers at bedside — reducing transfer time and lab bottlenecks.' },
                { img: '/ambulance_application.png', title: 'Emergency & Ambulance', desc: 'Pre-hospital triage with quantitative results en route to the hospital.' },
                { img: '/pharmacy_application.png', title: 'Clinic & Pharmacy', desc: 'Point-of-sale diagnostics enabling GPs and pharmacists to deliver immediate results.' },
                { img: '/remote_home_application.png', title: 'Remote & Home Care', desc: 'Battery-operated wireless device reaches patients in rural India and home-care settings.' },
              ].map((app) => (
                <div key={app.title} className="app-card">
                  <Image src={app.img} alt={app.title} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
                  <div className="app-card-overlay">
                    <div className="app-card-title">{app.title}</div>
                    <div className="app-card-desc">{app.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="app-icons-row">
              {['❤️ Cardiac', '🦋 Thyroid', '🦠 Infectious', '🧬 Fertility', '🎯 Tumor Markers', '⚕️ Critical Care', '🏥 Emergency', '🌿 Metabolic'].map(label => (
                <div key={label} className="app-icon-chip">
                  <span className="icon">{label.split(' ')[0]}</span>
                  <span className="label">{label.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== CERTIFICATIONS ===== */}
      <CertificationsSection />

      {/* ===== CTA BANNER ===== */}
      <CtaBanner
        title="Ready to Transform Your Diagnostics?"
        desc="Request a demo or quote for the DX 101 Analyzer today. Our team responds within 1 business day."
        primaryText="📋 Request a Quote"
        primaryHref="/quote"
        secondaryText="📞 Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
