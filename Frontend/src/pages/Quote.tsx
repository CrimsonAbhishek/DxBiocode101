import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { submitQuote } from '../api/client';
import { FadeUp } from '../components/FadeUp';

export const Quote: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCartStore();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('');
  const [facilityType, setFacilityType] = useState('');
  const [timeline, setTimeline] = useState('');
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
    if (!organization.trim()) tempErrors.organization = 'Please enter your organization';
    if (!message.trim()) tempErrors.message = 'Please enter your message';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (botCheck) {
      return;
    }

    if (cart.length === 0) {
      setStatus({
        type: 'error',
        text: '❌ Your quote request list is empty. Please add items to request a quote.',
      });
      return;
    }

    if (!validate()) {
      setStatus({ type: 'error', text: '❌ Please correct the errors before submitting.' });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitQuote({
        name,
        phone,
        email,
        organization,
        designation: designation || undefined,
        facilityType: facilityType || undefined,
        timeline: timeline || undefined,
        message,
        items: cart.map((item) => ({
          product_name: item.name,
          quantity: 1,
        })),
        botCheck,
      });

      setStatus({
        type: 'success',
        text: '🎉 Thank you! Your Quote Request was submitted. We will contact you within 1–2 business days.',
      });

      // Clear the cart on successful submission
      clearCart();

      // Reset Form
      setName('');
      setPhone('');
      setEmail('');
      setOrganization('');
      setDesignation('');
      setFacilityType('');
      setTimeline('');
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
            <span>/</span>Request Quote
          </div>
          <h1>Request a Quote</h1>
          <p>Fill out the form below with your requirements, and our team will get back to you with a customized quotation within 1 business day.</p>
        </div>
      </div>

      {/* ===== QUOTE SECTION ===== */}
      <section className="quote-section" id="quote">
        <div className="quote-mesh"></div>
        <div className="quote-inner">
          <div className="quote-grid">
            {/* Left: Selected Products */}
            <FadeUp>
              <div className="quote-cart-panel">
                <h2 className="quote-cart-title">Your Selected Products</h2>
                <p className="quote-cart-desc">Review the list of items for which you are requesting a quote.</p>

                {cart.length === 0 ? (
                  <div className="q-empty-state" style={{ display: 'block' }}>
                    <div className="q-empty-icon">🛒</div>
                    <div className="q-empty-text">No products in your quote request list yet.</div>
                    <Link to="/products" className="btn-primary" style={{ display: 'inline-flex' }}>
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="q-item-list">
                    {cart.map((item, idx) => (
                      <div className="q-item" key={idx}>
                        <img src={item.img.startsWith('/') ? item.img : `/${item.img}`} alt={item.name} />
                        <div className="q-item-info">
                          <div className="q-item-name">{item.name}</div>
                          <div className="q-item-price">{item.price}</div>
                        </div>
                        <button
                          className="q-item-remove"
                          onClick={() => removeFromCart(idx)}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FadeUp>

            {/* Right: Quote Form */}
            <FadeUp delay={0.2}>
              <div className="contact-form-wrap">
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Quote Details</h3>
                <p style={{ fontSize: '13.5px', color: '#6b7280', marginBottom: '24px' }}>Please complete the form below to receive pricing details</p>
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  {/* Honeypot Field */}
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

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="form-org">Organization / Clinic *</label>
                      <input
                        type="text"
                        id="form-org"
                        value={organization}
                        onChange={(e) => {
                          setOrganization(e.target.value);
                          if (e.target.value.trim()) setErrors((prev) => ({ ...prev, organization: '' }));
                        }}
                        className={errors.organization ? 'invalid' : ''}
                        placeholder="City Hospital / Clinic Name"
                        required
                        autoComplete="organization"
                      />
                      {errors.organization && <span className="error-msg" style={{ display: 'block' }}>{errors.organization}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="form-designation">Designation / Role</label>
                      <input
                        type="text"
                        id="form-designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="Purchasing Manager / Cardiologist"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="form-facility">Facility Type</label>
                      <select
                        id="form-facility"
                        value={facilityType}
                        onChange={(e) => setFacilityType(e.target.value)}
                      >
                        <option value="">Select facility type...</option>
                        <option value="Multi-specialty Hospital">Multi-specialty Hospital</option>
                        <option value="Diagnostic Laboratory">Diagnostic Laboratory</option>
                        <option value="Private Clinic">Private Clinic</option>
                        <option value="Government Hospital/Primary Health Center">Government Hospital/Primary Health Center</option>
                        <option value="Pharmacy">Pharmacy</option>
                        <option value="Medical Equipment Distributor">Medical Equipment Distributor</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="form-timeline">Purchase Timeline</label>
                      <select
                        id="form-timeline"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                      >
                        <option value="">Select timeline...</option>
                        <option value="Immediate (Within 30 Days)">Immediate (Within 30 Days)</option>
                        <option value="1–3 Months">1–3 Months</option>
                        <option value="3–6 Months">3–6 Months</option>
                        <option value="Planning / Budgetary Quote Only">Planning / Budgetary Quote Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="form-msg">Specific Requirements or Message *</label>
                    <textarea
                      id="form-msg"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (e.target.value.trim()) setErrors((prev) => ({ ...prev, message: '' }));
                      }}
                      className={errors.message ? 'invalid' : ''}
                      rows={4}
                      placeholder="Please specify if you need details on specific panels (e.g. Cardiac, Thyroid, Infectious Panel) or if you have packaging questions..."
                      required
                    ></textarea>
                    {errors.message && <span className="error-msg" style={{ display: 'block' }}>{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                    disabled={isSubmitting || cart.length === 0}
                  >
                    {isSubmitting ? '⌛ Submitting Request...' : '✉️ Submit Quote Request'}
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
