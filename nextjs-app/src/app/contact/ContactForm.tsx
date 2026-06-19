'use client';
import { useState } from 'react';

type FormStatus = { type: 'success' | 'error'; msg: string } | null;

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setStatus({ type: 'success', msg: '🎉 Message sent! We\'ll get back to you within 1 business day.' });
        form.reset();
      } else {
        setStatus({ type: 'error', msg: result.error || 'Something went wrong. Please email info@dxbiocode.com.' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Network error. Please email info@dxbiocode.com directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-form-wrap">
      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Send Us a Message</h3>
      <p style={{ fontSize: 13.5, color: '#6b7280', marginBottom: 24 }}>We&apos;ll get back to you within 1 business day</p>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        {/* Honeypot Field */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          style={{ display: 'none' }}
        />
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="form-name">Full Name *</label>
            <input id="form-name" name="name" type="text" placeholder="Dr. John Doe" required autoComplete="name" />
          </div>
          <div className="form-group">
            <label htmlFor="form-phone">Phone Number *</label>
            <input id="form-phone" name="phone" type="tel" placeholder="+91 98765 43210" required autoComplete="tel" />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="form-email">Email Address *</label>
          <input id="form-email" name="email" type="email" placeholder="john@hospital.com" required autoComplete="email" />
        </div>
        <div className="form-group">
          <label htmlFor="form-org">Organization / Clinic</label>
          <input id="form-org" name="organization" type="text" placeholder="City Hospital / Clinic Name" autoComplete="organization" />
        </div>
        <div className="form-group">
          <label htmlFor="form-enquiry">Enquiry Type</label>
          <select id="form-enquiry" name="enquiry_type">
            <option value="">Select enquiry type...</option>
            <option>Product Demo Request</option>
            <option>Pricing &amp; Quote</option>
            <option>Technical Support</option>
            <option>Partnership / Distribution</option>
            <option>General Information</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="form-msg">Your Message *</label>
          <textarea id="form-msg" name="message" rows={4} placeholder="I am interested in requesting a product demonstration..." required />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} disabled={submitting}>
          {submitting ? '⌛ Sending...' : '✉️ Send Message'}
        </button>
        {status && <div className={`form-status ${status.type}`}>{status.msg}</div>}
      </form>
    </div>
  );
}
