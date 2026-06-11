import FadeUp from '@/components/FadeUp';
import TiltCard from '@/components/TiltCard';

const CERTIFICATIONS = [
  {
    icon: '🇪🇺',
    name: 'CE Mark — European Conformity',
    tag: 'Medical Devices Regulation',
    desc: 'The DX 101 carries the CE Mark, confirming full compliance with EU Medical Device Regulation (MDR) 2017/745 requirements for safety, efficacy, and quality.',
  },
  {
    icon: '🧪',
    name: 'EU-IVD Directive Compliant',
    tag: 'In Vitro Diagnostics',
    desc: 'Our IVD test consumables are designed and validated in compliance with EU Directive 98/79/EC for in vitro diagnostic medical devices.',
  },
  {
    icon: '🏭',
    name: 'ISO 13485 — Quality Management',
    tag: 'Manufacturing Standard',
    desc: 'Manufactured under ISO 13485-certified quality management systems, ensuring consistently safe and effective medical devices throughout the product lifecycle.',
  },
  {
    icon: '🔬',
    name: 'Clinical Validation',
    tag: 'Performance Data',
    desc: 'Extensive clinical validation studies across multiple Indian hospitals confirm >99% concordance with reference laboratory methods for all available test panels.',
  },
  {
    icon: '🇮🇳',
    name: 'CDSCO Registration',
    tag: 'India Regulatory',
    desc: 'Registered with the Central Drugs Standard Control Organization (CDSCO), India\'s national regulatory body for medical devices and diagnostics.',
  },
  {
    icon: '⚡',
    name: 'IEC 61010-1 Safety',
    tag: 'Electrical Safety',
    desc: 'The DX 101 Analyzer meets IEC 61010-1 international safety standards for electrical equipment used in laboratory, medical, and industrial settings.',
  },
  {
    icon: '🌡️',
    name: 'Stability & Performance Testing',
    tag: 'Quality Assurance',
    desc: 'All reagent kits undergo stringent real-time and accelerated stability testing to guarantee consistent performance throughout shelf life.',
  },
  {
    icon: '🔒',
    name: 'Data Privacy & Security',
    tag: 'Digital Compliance',
    desc: 'Patient data handled by the DX BIOCODE cloud platform complies with applicable data protection standards, including encryption at rest and in transit.',
  },
  {
    icon: '📋',
    name: 'Good Manufacturing Practice',
    tag: 'Production Standards',
    desc: 'All manufacturing activities adhere to applicable GMP guidelines, ensuring product consistency, safety, and traceability across every production batch.',
  },
];

interface CertificationsSectionProps {
  compact?: boolean;
}

export default function CertificationsSection({ compact }: CertificationsSectionProps) {
  return (
    <section style={{ padding: '96px 24px', background: '#f8fafc' }} id="certifications">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <FadeUp>
          <div className="section-title-wrap">
            <span className="section-eyebrow">Regulatory & Quality</span>
            <h2 className="section-title">Certifications &amp; Compliance</h2>
            <p className="section-sub">
              DX BIOCODE products are rigorously validated and certified to the highest international standards for safety, efficacy, and quality.
            </p>
          </div>
        </FadeUp>

        <div className="certs-grid">
          {(compact ? CERTIFICATIONS.slice(0, 6) : CERTIFICATIONS).map((cert, i) => (
            <FadeUp key={cert.name} delay={i * 0.06}>
              <TiltCard className="cert-card">
                <div className="cert-badge-wrap">{cert.icon}</div>
                <h3>{cert.name}</h3>
                <span className="cert-tag">{cert.tag}</span>
                <p className="cert-desc">{cert.desc}</p>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
