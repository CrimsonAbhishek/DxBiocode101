import type { Metadata } from 'next';
import Link from 'next/link';
import FadeUp from '@/components/FadeUp';
import CtaBanner from '@/components/CtaBanner';
import CareersPageClient from './CareersPageClient';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join DX BIOCODE. Explore careers in medical diagnostics, engineering, sales, and more. Upload your resume and grow with a leader in POCT solutions.',
};

const CULTURE = [
  { icon: '🚀', title: 'Innovation First', desc: 'We push the boundaries of point-of-care diagnostics every day. Join a team that turns bold ideas into life-saving technology.' },
  { icon: '🤝', title: 'Collaborative Environment', desc: 'We believe in teamwork, open communication, and mutual respect. Every voice matters — from engineers to sales to support.' },
  { icon: '📈', title: 'Growth & Learning', desc: 'We invest in our people. Continuous learning, training programs, and mentorship opportunities are part of every role at DX BIOCODE.' },
  { icon: '🌍', title: 'Global Impact', desc: 'Our diagnostics reach clinics, hospitals, and homes across India and beyond. Your work directly contributes to better healthcare outcomes worldwide.' },
  { icon: '⚖️', title: 'Work-Life Balance', desc: 'We value your well-being. Flexible working arrangements, health benefits, and a supportive environment ensure you thrive inside and outside of work.' },
  { icon: '🏆', title: 'Recognition & Rewards', desc: 'Excellence is celebrated. Competitive compensation, performance incentives, and employee recognition programs are central to our culture.' },
];

const JOBS = [
  { dept: 'Sales & Business Development', title: 'Regional Sales Manager — Diagnostics', location: 'Chennai, Tamil Nadu', type: 'Full-Time', exp: '3+ Years Experience' },
  { dept: 'Research & Development', title: 'IVD Assay Development Scientist', location: 'Chennai, Tamil Nadu', type: 'Full-Time', exp: 'MSc / PhD in Life Sciences' },
  { dept: 'Technical Support', title: 'Field Service Engineer — POCT Instruments', location: 'Multiple Locations (India)', type: 'Full-Time', exp: 'B.Tech / Diploma Electronics / Biomedical' },
  { dept: 'Marketing', title: 'Digital Marketing & Brand Manager', location: 'Chennai, Tamil Nadu', type: 'Full-Time', exp: '2+ Years Experience' },
  { dept: 'Regulatory & Quality', title: 'Regulatory Affairs Specialist — IVD / CE Marking', location: 'Chennai, Tamil Nadu', type: 'Full-Time', exp: 'Life Sciences / Regulatory Background' },
];

export default function CareersPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link><span>/</span>Careers</div>
          <h1>Join Our Team</h1>
          <p>Be part of a mission-driven company pioneering India&apos;s diagnostic revolution. Grow your career at DX BIOCODE.</p>
        </div>
      </div>

      <main className="careers-main">
        {/* Culture */}
        <FadeUp>
          <div className="section-title-wrap">
            <span className="section-eyebrow">Why Work With Us</span>
            <h2 className="section-title">Our Culture &amp; Values</h2>
            <p className="section-sub">At DX BIOCODE, we believe that great technology is built by great people. Join a team where innovation meets purpose.</p>
          </div>
        </FadeUp>
        <div className="culture-grid">
          {CULTURE.map((c, i) => (
            <FadeUp key={c.title} delay={i * 0.08}>
              <div className="culture-card">
                <span className="culture-icon">{c.icon}</span>
                <div className="culture-title">{c.title}</div>
                <p className="culture-desc">{c.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Job Listings */}
        <FadeUp>
          <div className="section-title-wrap">
            <span className="section-eyebrow">Current Openings</span>
            <h2 className="section-title">Open Positions</h2>
            <p className="section-sub">Explore our current opportunities and find the role that fits your passion and expertise.</p>
          </div>
        </FadeUp>
        <div className="job-listing-grid">
          {JOBS.map((job, i) => (
            <FadeUp key={job.title} delay={i * 0.07}>
              <div className="job-card">
                <div className="job-info">
                  <div className="job-dept">{job.dept}</div>
                  <div className="job-title">{job.title}</div>
                  <div className="job-meta">
                    <span className="job-tag">📍 {job.location}</span>
                    <span className="job-tag">💼 {job.type}</span>
                    <span className="job-tag">🎓 {job.exp}</span>
                  </div>
                </div>
                <div className="job-apply-btn">
                  <a href="#apply" className="btn-primary" style={{ fontSize: 14, padding: '11px 22px' }}>Apply Now →</a>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Resume Upload */}
        <CareersPageClient />
      </main>

      <CtaBanner
        title="Ready to Make a Difference?"
        desc="Join DX BIOCODE and be part of transforming point-of-care diagnostics across India."
        primaryText="📄 Upload Resume"
        primaryHref="#apply"
        secondaryText="📞 Get in Touch"
        secondaryHref="/contact"
      />
    </>
  );
}
