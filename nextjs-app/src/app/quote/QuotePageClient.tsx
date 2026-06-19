'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/CartStore';

type FormStatus = { type: 'success' | 'error'; msg: string } | null;

export default function QuotePageClient() {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const [status, setStatus] = useState<FormStatus>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const form = e.currentTarget;
    if (cart.length === 0) {
      setStatus({ type: 'error', msg: '❌ Your quote request list is empty. Please add items from the Products page.' });
      setSubmitting(false);
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    const payload = {
      ...data,
      items: cart.map(item => ({ product_name: item.name, quantity: 1 })),
    };
    try {
      const res = await fetch('/api/quotes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (res.ok && result.success) {
        setStatus({ type: 'success', msg: '🎉 Thank you! Your Quote Request was submitted. We will contact you within 1–2 business days.' });
        clearCart();
        form.reset();
      } else if (res.status === 429) {
        setStatus({ type: 'error', msg: '⏳ Too many requests. Please try again later.' });
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
    <div className="quote-grid">
      {/* Left: Cart Items */}
      <div className="quote-cart-panel">
        <h2 className="quote-cart-title">Your Selected Products</h2>
        <p className="quote-cart-desc">Review the list of items for which you are requesting a quote.</p>

        {cart.length === 0 ? (
          <div className="q-empty-state">
            <div className="q-empty-icon">🛒</div>
            <div className="q-empty-text">No products in your quote request list yet.</div>
            <Link href="/products" className="btn-primary" style={{ display: 'inline-flex' }}>Browse Products</Link>
          </div>
        ) : (
          <div className="q-item-list">
            {cart.map(item => (
              <div key={item.id} className="q-item">
                <Image src={item.img} alt={item.name} width={64} height={64} style={{ objectFit: 'cover', borderRadius: 8, background: '#e2e8f0' }} />
                <div className="q-item-info">
                  <div className="q-item-name">{item.name}</div>
                  <div className="q-item-price">{item.price}</div>
                </div>
                <button className="q-item-remove" onClick={() => removeFromCart(item.id)} title="Remove item">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Quote Form */}
      <div className="contact-form-wrap">
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Quote Details</h3>
        <p style={{ fontSize: 13.5, color: '#6b7280', marginBottom: 24 }}>Please complete the form below to receive pricing details</p>
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
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="form-org">Organization / Clinic *</label>
              <input id="form-org" name="organization" type="text" placeholder="City Hospital / Clinic Name" required autoComplete="organization" />
            </div>
            <div className="form-group">
              <label htmlFor="form-designation">Designation / Role</label>
              <input id="form-designation" name="designation" type="text" placeholder="Purchasing Manager / Cardiologist" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="form-facility">Facility Type</label>
              <select id="form-facility" name="facility_type">
                <option value="">Select facility type...</option>
                <option>Multi-specialty Hospital</option>
                <option>Diagnostic Laboratory</option>
                <option>Private Clinic</option>
                <option>Government Hospital/Primary Health Center</option>
                <option>Pharmacy</option>
                <option>Medical Equipment Distributor</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="form-timeline">Purchase Timeline</label>
              <select id="form-timeline" name="timeline">
                <option value="">Select timeline...</option>
                <option>Immediate (Within 30 Days)</option>
                <option>1–3 Months</option>
                <option>3–6 Months</option>
                <option>Planning / Budgetary Quote Only</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="form-msg">Specific Requirements or Message *</label>
            <textarea id="form-msg" name="message" rows={4} placeholder="Please specify if you need details on specific panels (e.g. Cardiac, Thyroid, Infectious Panel) or if you have packaging questions..." required />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
            disabled={submitting || cart.length === 0}
          >
            {submitting ? '⌛ Submitting Request...' : '✉️ Submit Quote Request'}
          </button>
          {status && <div className={`form-status ${status.type}`}>{status.msg}</div>}
        </form>
      </div>
    </div>
  );
}
