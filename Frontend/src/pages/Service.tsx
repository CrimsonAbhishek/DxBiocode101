import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { submitTraining } from '../api/client';
import { TiltCard } from '../components/TiltCard';

export const Service: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [locationVal, setLocationVal] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  // Status & UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const hash = location.hash.substring(1);
    const validTabs = ['overview', 'training', 'support'];
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

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = 'Name is required';
    if (!locationVal.trim()) tempErrors.location = 'Location is required';
    if (!email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Valid email is required';
    }
    if (!phone.trim()) tempErrors.phone = 'Phone number is required';
    if (!organization.trim()) tempErrors.organization = 'Organization is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!validate()) {
      setStatus({ type: 'error', text: '❌ Please correct the errors before submitting.' });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitTraining({
        name,
        location: locationVal,
        email,
        phone,
        organization,
        trainingCategory: category || undefined,
        message,
        botCheck: '', // Bot honeypot
      });

      setStatus({
        type: 'success',
        text: '🎉 Thank you! Your training request was received. We will be in touch shortly.',
      });

      // Reset Form
      setName('');
      setLocationVal('');
      setEmail('');
      setPhone('');
      setOrganization('');
      setCategory('');
      setMessage('');
    } catch (err: any) {
      setStatus({
        type: 'error',
        text: `❌ ${err.message || 'Something went wrong.'} Please email info@dxbiocode.com directly.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* ===== PAGE HERO ===== */}
      <div className="page-hero" id="service-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>Service
          </div>
          <h1 id="page-hero-title">Our Service</h1>
          <p id="page-hero-desc">Comprehensive support, training, and technical assistance — because your success is our commitment.</p>
        </div>
      </div>

      {/* ===== TAB BAR ===== */}
      <div className="tab-bar" ref={tabBarRef}>
        <div className="tab-bar-inner">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'training' ? 'active' : ''}`}
            onClick={() => handleTabChange('training')}
          >
            Training
          </button>
          <button
            className={`tab-btn ${activeTab === 'support' ? 'active' : ''}`}
            onClick={() => handleTabChange('support')}
          >
            Support
          </button>
        </div>
      </div>

      {/* ===== SERVICE CONTENT ===== */}
      <div className="service-content">
        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <div className="tab-panel active">
            <div className="section-title-wrap">
              <span className="section-eyebrow">Service Overview</span>
              <h2 className="section-title">Direction of Our Service</h2>
            </div>
            <p className="overview-intro">
              At DX BIOCODE, we are committed to delivering not just industry-leading diagnostic equipment, but a comprehensive service experience that empowers our partners to deliver better patient outcomes. Our highly skilled experts are well-versed in the entire product line and adept at capturing emerging market demands.
              <br /><br />
              No matter where you are and what you need, we strive to offer top-notch solutions and service — <strong>that is our commitment.</strong>
            </p>

            {/* Direction of Service Grid */}
            <div className="service-directions">
              <div className="direction-item">
                <img src="/hospital_application.png" alt="Technical Support Center" className="direction-img" loading="lazy" />
                <div className="direction-text">
                  <h3>🛠 Technical Support Center</h3>
                  <p>Our dedicated technical support team resolves issues rapidly, ensuring your diagnostic workflows are never interrupted. We provide expert remote and on-site assistance.</p>
                </div>
              </div>
              <div className="direction-item reverse">
                <div className="direction-text">
                  <h3>🎓 Training Center</h3>
                  <p>We offer structured training sessions for distributors and healthcare professionals, covering device operation, calibration, SOP adherence, and clinical interpretation.</p>
                </div>
                <img src="/ambulance_application.png" alt="Training Center" className="direction-img" loading="lazy" />
              </div>
              <div className="direction-item">
                <img src="/pharmacy_application.png" alt="Customer Care Center" className="direction-img" loading="lazy" />
                <div className="direction-text">
                  <h3>💬 Customer Care Center</h3>
                  <p>Our customer care team is always on hand to provide professional consulting and flexible solutions, communicating in multiple languages to serve diverse customer needs.</p>
                </div>
              </div>
              <div className="direction-item reverse">
                <div className="direction-text">
                  <h3>🤝 Partnerships &amp; Prospects</h3>
                  <p>We actively collaborate with distributors, hospital networks, and healthcare institutions — sharing market insights and building long-term, mutually beneficial partnerships.</p>
                </div>
                <img src="/remote_home_application.png" alt="Partnerships" className="direction-img" loading="lazy" />
              </div>
            </div>

            {/* Service Strengths */}
            <div className="section-title-wrap" style={{ marginBottom: '32px' }}>
              <span className="section-eyebrow">Our Strengths</span>
              <h2 className="section-title">Why Choose DX BIOCODE Service?</h2>
            </div>
            <div className="strengths-grid">
              <TiltCard className="strength-card">
                <span className="strength-icon">⚡</span>
                <div className="strength-title">Rapid Customer Response</div>
                <p className="strength-desc">In IVD, time is of utmost importance. Through our extensive global customer service network and comprehensive technical support system, we respond promptly to your requests and queries — providing quality service in a timely manner.</p>
              </TiltCard>
              <TiltCard className="strength-card">
                <span className="strength-icon">🔧</span>
                <div className="strength-title">Professional Troubleshooting Support</div>
                <p className="strength-desc">All our technical support specialists have undergone rigorous training and are constantly upgrading their skills to satisfy emerging customer demands — from machine troubleshooting to test kit result queries, we never compromise on quality.</p>
              </TiltCard>
              <TiltCard className="strength-card">
                <span className="strength-icon">🎯</span>
                <div className="strength-title">Personalized Service</div>
                <p className="strength-desc">Our technical support specialists are not just tech-savvy but also keen to fulfil on-demand market needs. We strive to provide personalized service tailored to specific customer requests — whenever help is needed, we are here.</p>
              </TiltCard>
              <TiltCard className="strength-card">
                <span className="strength-icon">🔄</span>
                <div className="strength-title">Continuous Follow-up</div>
                <p className="strength-desc">We take excellent care of our customers even after the technical support service is complete. After each issue or query is addressed, our technical support team always follows up to ensure customer satisfaction.</p>
              </TiltCard>
              <TiltCard className="strength-card">
                <span className="strength-icon">🌏</span>
                <div className="strength-title">Multi-Language Support</div>
                <p className="strength-desc">Our team communicates in multiple languages — including English, Hindi, Tamil, and more — to accommodate customers from different backgrounds and ensure nothing is lost in translation.</p>
              </TiltCard>
              <TiltCard className="strength-card">
                <span className="strength-icon">📊</span>
                <div className="strength-title">Capabilities &amp; Expertise</div>
                <p className="strength-desc">With years of experience in IVD diagnostics, our team brings deep clinical knowledge combined with technological expertise — ensuring you receive well-rounded support across device, assay, and workflow levels.</p>
              </TiltCard>
            </div>
          </div>
        )}

        {/* ===== TRAINING TAB ===== */}
        {activeTab === 'training' && (
          <div className="tab-panel active">
            <div className="section-title-wrap">
              <span className="section-eyebrow">Training Programs</span>
              <h2 className="section-title">Standardized Training for Excellence</h2>
              <p className="section-sub">We provide our distributors and healthcare professionals standardized training sessions aimed at facilitating high-quality service and solutions. Each training session is tailored to customer requests and is extraordinarily informative.</p>
            </div>

            <div className="training-grid">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>Our training sessions will enhance your understanding from the following aspects:</h3>
                <ul className="training-points">
                  <li>Basic structural and mechanical components of the DX 101 Analyzer</li>
                  <li>Standard Operating Procedures (SOP) for consistent results</li>
                  <li>Basic troubleshooting and calibration protocols</li>
                  <li>Interpretation of results and corresponding clinical implications</li>
                  <li>QC management and quality assurance practices</li>
                  <li>Data management, auto upload &amp; LIMS connectivity (universal HL7 interface), and reporting features</li>
                </ul>
                <div className="brochure-download">
                  <h3>📘 Brochure Download</h3>
                  <p>Download the comprehensive DX 101 product brochure for detailed specifications, test menu, and clinical applications.</p>
                  <a href="/Dx 101 - Analyzer.pdf" download="Dx 101 - Analyzer.pdf" className="btn-primary">📥 Download Brochure</a>
                </div>
              </div>

              {/* Training Request Form */}
              <div className="message-form-card">
                <h3>📅 Book a Training Session</h3>
                <p>Fill out the form below and our team will get back to you within 24 hours to schedule your training.</p>
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="t-name">Full Name *</label>
                      <input
                        type="text"
                        id="t-name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (e.target.value.trim()) setErrors((prev) => ({ ...prev, name: '' }));
                        }}
                        className={errors.name ? 'invalid' : ''}
                        placeholder="Dr. Jane Doe"
                        required
                      />
                      {errors.name && <span className="error-msg" style={{ display: 'block' }}>{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="t-location">Location *</label>
                      <input
                        type="text"
                        id="t-location"
                        value={locationVal}
                        onChange={(e) => {
                          setLocationVal(e.target.value);
                          if (e.target.value.trim()) setErrors((prev) => ({ ...prev, location: '' }));
                        }}
                        className={errors.location ? 'invalid' : ''}
                        placeholder="City, State"
                        required
                      />
                      {errors.location && <span className="error-msg" style={{ display: 'block' }}>{errors.location}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="t-email">Email Address *</label>
                    <input
                      type="email"
                      id="t-email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (e.target.value.trim()) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className={errors.email ? 'invalid' : ''}
                      placeholder="you@hospital.com"
                      required
                    />
                    {errors.email && <span className="error-msg" style={{ display: 'block' }}>{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="t-phone">Phone *</label>
                    <input
                      type="tel"
                      id="t-phone"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (e.target.value.trim()) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      className={errors.phone ? 'invalid' : ''}
                      placeholder="+91 98765 43210"
                      required
                    />
                    {errors.phone && <span className="error-msg" style={{ display: 'block' }}>{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="t-org">Organization / Institution *</label>
                    <input
                      type="text"
                      id="t-org"
                      value={organization}
                      onChange={(e) => {
                        setOrganization(e.target.value);
                        if (e.target.value.trim()) setErrors((prev) => ({ ...prev, organization: '' }));
                      }}
                      className={errors.organization ? 'invalid' : ''}
                      placeholder="City Hospital"
                      required
                    />
                    {errors.organization && <span className="error-msg" style={{ display: 'block' }}>{errors.organization}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="t-category">Training Category</label>
                    <select
                      id="t-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select a category...</option>
                      <option value="Device Operation &amp; Setup">Device Operation &amp; Setup</option>
                      <option value="Clinical Interpretation">Clinical Interpretation</option>
                      <option value="Troubleshooting &amp; Calibration">Troubleshooting &amp; Calibration</option>
                      <option value="Data Management &amp; Connectivity">Data Management &amp; Connectivity</option>
                      <option value="Full Comprehensive Training">Full Comprehensive Training</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="t-msg">Leave Your Message</label>
                    <textarea
                      id="t-msg"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Any specific training requirements or questions..."
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isSubmitting}>
                    {isSubmitting ? '⌛ Sending...' : '📅 Submit Training Request'}
                  </button>
                  {status && (
                    <div className={`form-status ${status.type}`} style={{ display: 'block' }}>
                      {status.text}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ===== SUPPORT TAB ===== */}
        {activeTab === 'support' && (
          <div className="tab-panel active">
            <div className="section-title-wrap">
              <span className="section-eyebrow">Technical Support</span>
              <h2 className="section-title">World-Class Technical Support</h2>
            </div>

            <div className="support-intro">
              Our highly skilled technical support experts are not only well-versed in the entire product line but are also astute in capturing emerging market demands around the globe.
              <br /><br />
              No matter where you are and what you need, we strive to offer you top-notch solutions and service — <strong>that is our commitment.</strong>
            </div>

            <div className="section-title-wrap" style={{ margin: '48px 0 24px', textAlign: 'left' }}>
              <span className="section-eyebrow">Our Strengths</span>
              <h2 className="section-title" style={{ fontSize: 'clamp(20px,2.5vw,28px)' }}>What Makes Our Support Exceptional</h2>
            </div>

            <div className="support-strengths">
              <div className="support-strength">
                <div className="support-strength-icon">⚡</div>
                <div>
                  <h3>Rapid Customer Response</h3>
                  <p>In IVD, time is of utmost importance, and DX BIOCODE understands that. Through our extensive global customer service network and comprehensive technical support system, our technical support team can respond promptly to your requests and queries — providing quality service in a timely manner.</p>
                </div>
              </div>
              <div className="support-strength">
                <div className="support-strength-icon">🔧</div>
                <div>
                  <h3>Professional Troubleshooting Support</h3>
                  <p>All our technical support specialists have undergone rigorous training and are constantly upgrading their skills to satisfy emerging customer demands. From machine troubleshooting to test kit result queries, our team is multi-lingual and highly capable — ensuring you always receive the best technical support service, regardless of your background.</p>
                </div>
              </div>
              <div className="support-strength">
                <div className="support-strength-icon">🎯</div>
                <div>
                  <h3>Personalized Service</h3>
                  <p>Our technical support specialists are not just tech-savvy but are also keen to fulfil on-demand market needs. As such, we strive to provide personalized service that is tailored to specific customer requests. Whenever service is needed, we are here to help — no matter the complexity of the request.</p>
                </div>
              </div>
              <div className="support-strength">
                <div className="support-strength-icon">🔄</div>
                <div>
                  <h3>Continuous Follow-up</h3>
                  <p>We take excellent care of our customers even after the technical support service is complete. After each issue or query is addressed, our technical support team always follows up to ensure complete customer satisfaction — because your success is our priority.</p>
                </div>
              </div>
            </div>

            {/* Support Contact Card */}
            <div style={{ background: 'linear-gradient(135deg,#0a1628,#1e3f8a)', borderRadius: 'var(--radius-lg)', padding: '48px', marginTop: '48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle,rgba(233,30,140,.12),transparent 70%)' }}></div>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.85)', marginBottom: '24px', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
                Leave your message here should you be interested in any of our product offerings — we will get back to you in minimal delay.
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                <Link to="/contact" className="btn-white">✉️ Send Us a Message</Link>
                <a href="tel:+918080885059" className="btn-outline-white">📞 Call Now</a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2>Need Immediate Assistance?</h2>
          <p>Our support team is ready to help. Reach out to us via phone, email, or our contact form.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn-white">📞 Contact Support</Link>
            <Link to="/products" className="btn-outline-white">🛒 Browse Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
};
