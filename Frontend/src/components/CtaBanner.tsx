import React from 'react';
import { Link } from 'react-router-dom';

export const CtaBanner: React.FC = () => {
  return (
    <section className="cta-banner">
      <div className="cta-inner">
        <h2>Empower Your Diagnostics Today</h2>
        <p>
          Bring lab-quality testing directly to the bedside. Get in touch with our team for bulk pricing, demo requests, or distribution inquiries.
        </p>
        <div className="cta-actions">
          <Link to="/quote" className="btn-white">📋 Request a Quote</Link>
          <Link to="/contact" className="btn-outline-white">📞 Contact Sales</Link>
        </div>
      </div>
    </section>
  );
};
