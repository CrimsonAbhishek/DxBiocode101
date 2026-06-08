import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitContact } from '../api/client';
import { FadeUp } from '../components/FadeUp';

export const Contact: React.FC = () => {
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [enquiryType, setEnquiryType] = useState('');
  const [message, setMessage] = useState('');
  const [botCheck, setBotCheck] = useState('');

  // Status & UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = 'Please enter your name';
    if (!phone.trim()) tempErrors.phone = 'Please enter your phone';
    if (!email.trim()) {
      tempErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email';
    }
    if (!message.trim()) tempErrors.message = 'Please enter your message';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (botCheck) {
      // Quietly reject spam bots
      return;
    }

    if (!validate()) {
      setStatus({ type: 'error', text: '❌ Please correct the errors before submitting.' });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContact({
        name,
        phone,
        email,
        organization: organization || undefined,
        enquiryType: enquiryType || undefined,
        message,
        botCheck,
      });

      setStatus({
        type: 'success',
        text: '🎉 Thank you! Your submission was received. We will be in touch shortly.',
      });

      // Reset Form
      setName('');
      setPhone('');
      setEmail('');
      setOrganization('');
      setEnquiryType('');
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
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>Contact
          </div>
          <h1>Get in Touch</h1>
          <p>Ready to transform your diagnostic capability? We'd love to hear from you. Reach out for demos, quotes, or any queries.</p>
        </div>
      </div>

      {/* ===== CONTACT SECTION ===== */}
      <section className="contact-section" id="contact">
        <div className="contact-mesh"></div>
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
                    <span className="icon">📞</span>
                    <div>
                      <h4>Call Us</h4>
                      <a href="tel:+918080885059">+91 8080885059</a>
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
                  <a href="tel:+918080885059" className="quick-chip">📞 Call Now</a>
                  <a href="/Dx 101 - Analyzer.pdf" download className="quick-chip">📥 Brochure</a>
                </div>

                <div style={{ marginTop: '32px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span className="ce-strip">✔ CE Approved</span>
                  <span className="ce-strip">✔ EU-IVD Compliant</span>
                </div>
              </div>
            </FadeUp>

            {/* Right: Form */}
            <FadeUp delay={0.2}>
              <div className="contact-form-wrap">
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Send Us a Message</h3>
                <p style={{ fontSize: '13.5px', color: '#6b7280', marginBottom: '24px' }}>We'll get back to you within 1 business day</p>
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  {/* Honeypot Field for anti-spam (invisible to users) */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="form-bot-check">Leave this field blank</label>
                    <input
                      type="text"
                      id="form-bot-check"
                      value={botCheck}
                      onChange={(e) => setBotCheck(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="form-name">Full Name *</label>
                      <input
                        type="text"
                        id="form-name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (e.target.value.trim()) setErrors((prev) => ({ ...prev, name: '' }));
                        }}
                        className={errors.name ? 'invalid' : ''}
                        placeholder="Dr. John Doe"
                        required
                        autoComplete="name"
                      />
                      {errors.name && <span className="error-msg" style={{ display: 'block' }}>{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="form-phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="form-phone"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (e.target.value.trim()) setErrors((prev) => ({ ...prev, phone: '' }));
                        }}
                        className={errors.phone ? 'invalid' : ''}
                        placeholder="+91 98765 43210"
                        required
                        autoComplete="tel"
                      />
                      {errors.phone && <span className="error-msg" style={{ display: 'block' }}>{errors.phone}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-email">Email Address *</label>
                    <input
                      type="email"
                      id="form-email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (e.target.value.trim()) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className={errors.email ? 'invalid' : ''}
                      placeholder="john@hospital.com"
                      required
                      autoComplete="email"
                    />
                    {errors.email && <span className="error-msg" style={{ display: 'block' }}>{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-org">Organization / Clinic</label>
                    <input
                      type="text"
                      id="form-org"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="City Hospital / Clinic Name"
                      autoComplete="organization"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-enquiry">Enquiry Type</label>
                    <select
                      id="form-enquiry"
                      value={enquiryType}
                      onChange={(e) => setEnquiryType(e.target.value)}
                    >
                      <option value="">Select enquiry type...</option>
                      <option value="Product Demo Request">Product Demo Request</option>
                      <option value="Pricing &amp; Quote">Pricing &amp; Quote</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership / Distribution">Partnership / Distribution</option>
                      <option value="General Information">General Information</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-msg">Your Message *</label>
                    <textarea
                      id="form-msg"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (e.target.value.trim()) setErrors((prev) => ({ ...prev, message: '' }));
                      }}
                      className={errors.message ? 'invalid' : ''}
                      rows={4}
                      placeholder="I am interested in requesting a product demonstration..."
                      required
                    ></textarea>
                    {errors.message && <span className="error-msg" style={{ display: 'block' }}>{errors.message}</span>}
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={isSubmitting}>
                    {isSubmitting ? '⌛ Sending...' : '✉️ Send Message'}
                  </button>
                  {status && (
                    <div className={`form-status ${status.type}`} style={{ display: 'block' }}>
                      {status.text}
                    </div>
                  )}
                </form>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  );
};
