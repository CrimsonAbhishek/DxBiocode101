'use client';
import Link from 'next/link';

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-inner">
        <div className="top-bar-contact">
          <span>💬 <a href="https://wa.me/918080885059" target="_blank" rel="noopener noreferrer">+91 8080885059</a></span>
          <span>✉️ <a href="mailto:info@dxbiocode.com">info@dxbiocode.com</a></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="ce-strip">✔ CE &amp; EU-IVD Approved</span>
          <span className="top-bar-badge">India&apos;s First Handheld Multi-Parameter POCT</span>
        </div>
      </div>
    </div>
  );
}
