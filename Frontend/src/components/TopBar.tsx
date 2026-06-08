import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <div className="top-bar" id="top">
      <div className="top-bar-inner">
        <div className="top-bar-contact">
          <span>📞 <a href="tel:+918080885059">+91 8080885059</a></span>
          <span>✉️ <a href="mailto:info@dxbiocode.com">info@dxbiocode.com</a></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="ce-strip">✔ CE &amp; EU-IVD Approved</span>
          <span className="top-bar-badge">India's First Handheld Multi-Parameter POCT</span>
        </div>
      </div>
    </div>
  );
};
