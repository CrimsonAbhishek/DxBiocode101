import React from 'react';
import { TiltCard } from './TiltCard';
import { FadeUp } from './FadeUp';

const CERTS = [
  {
    icon: '📋',
    tag: 'Quality Management',
    title: 'ISO 9001:2015',
    desc: 'International standard certifying organization-wide quality management, client focus, and continuous operational optimization.',
  },
  {
    icon: '🩺',
    tag: 'Medical Device Standard',
    title: 'ISO 13485:2016',
    desc: 'Specific global quality management standard verifying safety and manufacturing compliance for diagnostic medical devices.',
  },
  {
    icon: '✈️',
    tag: 'Global Export',
    title: 'FSC Certified',
    desc: 'Free Sales Certificate validates that the device is legally manufactured and commercially sold without restrictions globally.',
  },
  {
    icon: '🇪🇺',
    tag: 'European Conformity',
    title: 'CE Mark',
    desc: 'Confirms that the device meets health, safety, and environmental protection standards within the European Economic Area.',
  },
  {
    icon: '🛡️',
    tag: 'Regulatory Approved',
    title: 'NMPA Compliant',
    desc: 'Evaluates safety and efficacy, certifying the device for clinical diagnostic applications.',
  },
  {
    icon: '🌐',
    tag: 'Global Unified Audit',
    title: 'MDSAP Audit',
    desc: 'Single regulatory audit satisfying requirements for USA (FDA), Canada (HC), Brazil (ANVISA), Australia (TGA), and Japan (MHLW).',
  },
  {
    icon: '🩸',
    tag: 'Diabetes Standard',
    title: 'NGSP Standard',
    desc: 'Standardizes HbA1c testing parameters, ensuring direct correlation to the landmark DCCT clinical trials.',
  },
  {
    icon: '🧪',
    tag: 'Clinical Chemistry',
    title: 'IFCC Standardized',
    desc: 'Standardized calibration metrics aligned with the International Federation of Clinical Chemistry for global lab compatibility.',
  },
  {
    icon: '🔬',
    tag: 'In Vitro Diagnostics',
    title: 'IVD Approved',
    desc: 'Certified for analyzing clinical samples (blood, plasma, urine) outside the body to deliver accurate quantitative values.',
  },
];

export const CertificationsSection: React.FC = () => {
  return (
    <div className="certs-section-wrap">
      <div className="section-title-wrap">
        <span className="section-eyebrow">Certifications</span>
        <h2 className="section-title">International Clinical Standards</h2>
        <p className="section-sub">
          DX BIOCODE devices are manufactured and certified to meet the most rigorous international clinical and regulatory standards.
        </p>
      </div>

      <div className="certs-grid">
        {CERTS.map((c, i) => (
          <FadeUp key={i} delay={(i % 3) * 0.1}>
            <TiltCard className="cert-card">
              <div className="cert-badge-wrap">{c.icon}</div>
              <span className="cert-tag">{c.tag}</span>
              <h3>{c.title}</h3>
              <p className="cert-desc">{c.desc}</p>
            </TiltCard>
          </FadeUp>
        ))}
      </div>
    </div>
  );
};
