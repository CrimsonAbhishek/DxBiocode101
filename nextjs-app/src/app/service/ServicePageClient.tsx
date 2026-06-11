'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FadeUp from '@/components/FadeUp';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'training', label: 'Training' },
  { id: 'support', label: 'Support' },
] as const;

type Tab = (typeof TABS)[number]['id'];

const STRENGTHS = [
  { icon: '⚡', title: 'Rapid Customer Response', desc: 'In IVD, time is of utmost importance. Through our extensive global customer service network and comprehensive technical support system, we respond promptly to your requests and queries — providing quality service in a timely manner.' },
  { icon: '🔧', title: 'Professional Troubleshooting', desc: 'All our technical support specialists have undergone rigorous training and are constantly upgrading their skills to satisfy emerging customer demands — from machine troubleshooting to test kit result queries, we never compromise on quality.' },
  { icon: '🎯', title: 'Personalized Service', desc: 'Our technical support specialists are not just tech-savvy but also keen to fulfil on-demand market needs. We strive to provide personalized service tailored to specific customer requests — whenever help is needed, we are here.' },
  { icon: '🔄', title: 'Continuous Follow-up', desc: 'We take excellent care of our customers even after the technical support service is complete. After each issue or query is addressed, our technical support team always follows up to ensure customer satisfaction.' },
  { icon: '🌏', title: 'Multi-Language Support', desc: 'Our team communicates in multiple languages — including English, Hindi, Tamil, and more — to accommodate customers from different backgrounds and ensure nothing is lost in translation.' },
  { icon: '📊', title: 'Capabilities & Expertise', desc: 'With years of experience in IVD diagnostics, our team brings deep clinical knowledge combined with technological expertise — ensuring you receive well-rounded support across device, assay, and workflow levels.' },
];

type FormStatus = { type: 'success' | 'error'; msg: string } | null;

export default function ServicePageClient() {
  const [tab, setTab] = useState<Tab>('overview');
  const [formStatus, setFormStatus] = useState<FormStatus>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleTrainingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFormStatus(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('/api/training', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await res.json();
      if (res.ok && result.success) {
        setFormStatus({ type: 'success', msg: '🎉 Training request submitted! We\'ll get back to you within 24 hours.' });
        form.reset();
      } else {
        setFormStatus({ type: 'error', msg: result.error || 'Something went wrong. Please email info@dxbiocode.com.' });
      }
    } catch {
      setFormStatus({ type: 'error', msg: 'Network error. Please email info@dxbiocode.com.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Tab Bar */}
      <div className="tab-bar">
        <div className="tab-bar-inner">
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="service-content">

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div id="overview">
            <FadeUp>
              <div className="section-title-wrap">
                <span className="section-eyebrow">Service Overview</span>
                <h2 className="section-title">Direction of Our Service</h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="overview-intro">
                At DX BIOCODE, we are committed to delivering not just industry-leading diagnostic equipment, but a comprehensive service experience that empowers our partners to deliver better patient outcomes. Our highly skilled experts are well-versed in the entire product line and adept at capturing emerging market demands.
                <br/><br/>
                No matter where you are and what you need, we strive to offer top-notch solutions and service — <strong>that is our commitment.</strong>
              </p>
            </FadeUp>

            <div className="service-directions">
              {[
                { img: '/hospital_application.png', title: '🛠 Technical Support Center', desc: 'Our dedicated technical support team resolves issues rapidly, ensuring your diagnostic workflows are never interrupted. We provide expert remote and on-site assistance.' },
                { img: '/ambulance_application.png', title: '🎓 Training Center', desc: 'We offer structured training sessions for distributors and healthcare professionals, covering device operation, calibration, SOP adherence, and clinical interpretation.', reverse: true },
                { img: '/pharmacy_application.png', title: '💬 Customer Care Center', desc: 'Our customer care team is always on hand to provide professional consulting and flexible solutions, communicating in multiple languages to serve diverse customer needs.' },
                { img: '/remote_home_application.png', title: '🤝 Partnerships & Prospects', desc: 'We actively collaborate with distributors, hospital networks, and healthcare institutions — sharing market insights and building long-term, mutually beneficial partnerships.', reverse: true },
              ].map((d, i) => (
                <FadeUp key={d.title} delay={i * 0.1}>
                  <div className="direction-item" style={d.reverse ? { direction: 'rtl' } : {}}>
                    <Image src={d.img} alt={d.title} className="direction-img" width={280} height={200} style={{ direction: 'ltr' }} />
                    <div className="direction-text" style={{ direction: 'ltr' }}>
                      <h3>{d.title}</h3>
                      <p>{d.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp>
              <div className="section-title-wrap" style={{ marginBottom: 32 }}>
                <span className="section-eyebrow">Our Strengths</span>
                <h2 className="section-title">Why Choose DX BIOCODE Service?</h2>
              </div>
            </FadeUp>
            <div className="strengths-grid">
              {STRENGTHS.map((s, i) => (
                <FadeUp key={s.title} delay={i * 0.07}>
                  <div className="strength-card">
                    <span className="strength-icon">{s.icon}</span>
                    <div className="strength-title">{s.title}</div>
                    <p className="strength-desc">{s.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        )}

        {/* TRAINING TAB */}
        {tab === 'training' && (
          <div id="training">
            <FadeUp>
              <div className="section-title-wrap">
                <span className="section-eyebrow">Training Programs</span>
                <h2 className="section-title">Standardized Training for Excellence</h2>
                <p className="section-sub">We provide our distributors and healthcare professionals standardized training sessions aimed at facilitating high-quality service and solutions.</p>
              </div>
            </FadeUp>
            <div className="training-grid">
              <FadeUp>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>Our training sessions will enhance your understanding from the following aspects:</h3>
                  <ul className="training-points">
                    <li>Basic structural and mechanical components of the DX 101 Analyzer</li>
                    <li>Standard Operating Procedures (SOP) for consistent results</li>
                    <li>Basic troubleshooting and calibration protocols</li>
                    <li>Interpretation of results and corresponding clinical implications</li>
                    <li>QC management and quality assurance practices</li>
                    <li>Data management, connectivity, and reporting features</li>
                  </ul>
                  <div className="brochure-download">
                    <h3>📘 Brochure Download</h3>
                    <p>Download the comprehensive DX 101 product brochure for detailed specifications, test menu, and clinical applications.</p>
                    <a href="/Dx 101 - Analyzer.pdf" download="Dx 101 - Analyzer.pdf" className="btn-primary">📥 Download Brochure</a>
                  </div>
                </div>
              </FadeUp>

              {/* Training Form */}
              <FadeUp delay={0.15}>
                <div className="message-form-card">
                  <h3>📅 Book a Training Session</h3>
                  <p>Fill out the form below and our team will get back to you within 24 hours to schedule your training.</p>
                  <form className="contact-form" onSubmit={handleTrainingSubmit} noValidate>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="t-name">Full Name *</label>
                        <input id="t-name" name="name" type="text" placeholder="Dr. Jane Doe" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="t-location">Location *</label>
                        <input id="t-location" name="location" type="text" placeholder="City, State" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="t-email">Email Address *</label>
                      <input id="t-email" name="email" type="email" placeholder="you@hospital.com" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="t-phone">Phone *</label>
                      <input id="t-phone" name="phone" type="tel" placeholder="+91 98765 43210" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="t-org">Organization / Institution *</label>
                      <input id="t-org" name="organization" type="text" placeholder="City Hospital" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="t-category">Training Category</label>
                      <select id="t-category" name="training_category">
                        <option value="">Select a category...</option>
                        <option>Device Operation &amp; Setup</option>
                        <option>Clinical Interpretation</option>
                        <option>Troubleshooting &amp; Calibration</option>
                        <option>Data Management &amp; Connectivity</option>
                        <option>Full Comprehensive Training</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="t-msg">Leave Your Message</label>
                      <textarea id="t-msg" name="message" rows={3} placeholder="Any specific training requirements or questions..." />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                      {submitting ? '⌛ Submitting...' : '📅 Submit Training Request'}
                    </button>
                    {formStatus && (
                      <div className={`form-status ${formStatus.type}`}>{formStatus.msg}</div>
                    )}
                  </form>
                </div>
              </FadeUp>
            </div>
          </div>
        )}

        {/* SUPPORT TAB */}
        {tab === 'support' && (
          <div id="support">
            <FadeUp>
              <div className="section-title-wrap">
                <span className="section-eyebrow">Technical Support</span>
                <h2 className="section-title">World-Class Technical Support</h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="support-intro">
                Our highly skilled technical support experts are not only well-versed in the entire product line but are also astute in capturing emerging market demands around the globe.<br/><br/>
                No matter where you are and what you need, we strive to offer you top-notch solutions and service — <strong>that is our commitment.</strong>
              </div>
            </FadeUp>
            <div className="section-title-wrap" style={{ margin: '48px 0 24px', textAlign: 'left' }}>
              <span className="section-eyebrow">Our Strengths</span>
              <h2 className="section-title" style={{ fontSize: 'clamp(20px,2.5vw,28px)' }}>What Makes Our Support Exceptional</h2>
            </div>
            <div className="support-strengths">
              {[
                { icon: '⚡', title: 'Rapid Customer Response', desc: 'In IVD, time is of utmost importance. Through our extensive global customer service network and comprehensive technical support system, our technical support team can respond promptly to your requests and queries — providing quality service in a timely manner.' },
                { icon: '🔧', title: 'Professional Troubleshooting Support', desc: 'All our technical support specialists have undergone rigorous training and are constantly upgrading their skills to satisfy emerging customer demands. From machine troubleshooting to test kit result queries, our team is multi-lingual and highly capable.' },
                { icon: '🎯', title: 'Personalized Service', desc: 'Our technical support specialists are not just tech-savvy but are also keen to fulfil on-demand market needs. As such, we strive to provide personalized service that is tailored to specific customer requests. Whenever service is needed, we are here to help.' },
                { icon: '🔄', title: 'Continuous Follow-up', desc: 'We take excellent care of our customers even after the technical support service is complete. After each issue or query is addressed, our technical support team always follows up to ensure complete customer satisfaction — because your success is our priority.' },
              ].map((s, i) => (
                <FadeUp key={s.title} delay={i * 0.1}>
                  <div className="support-strength">
                    <div className="support-strength-icon">{s.icon}</div>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
            <FadeUp delay={0.2}>
              <div style={{ background: 'linear-gradient(135deg,#0a1628,#1e3f8a)', borderRadius: 'var(--radius-lg)', padding: 48, marginTop: 48, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle,rgba(233,30,140,.12),transparent 70%)' }} />
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,.85)', marginBottom: 24, lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
                  Leave your message here should you be interested in any of our product offerings — we will get back to you in minimal delay.
                </p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                  <Link href="/contact" className="btn-white">✉️ Send Us a Message</Link>
                  <a href="https://wa.me/918080885059" target="_blank" rel="noopener noreferrer" className="btn-outline-white">💬 WhatsApp Us</a>
                </div>
              </div>
            </FadeUp>
          </div>
        )}
      </div>
    </>
  );
}
