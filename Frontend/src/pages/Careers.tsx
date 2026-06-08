import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { submitCareer } from '../api/client';
import { FadeUp } from '../components/FadeUp';
import { TiltCard } from '../components/TiltCard';

export const Careers: React.FC = () => {
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [botCheck, setBotCheck] = useState('');

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState(false);

  // Status & UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!firstName.trim()) tempErrors.firstName = 'First name is required';
    if (!lastName.trim()) tempErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Valid email required';
    }
    if (!phone.trim()) tempErrors.phone = 'Phone number is required';
    if (!position) tempErrors.position = 'Please select a position of interest';
    if (!file) tempErrors.file = 'Please attach your resume';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: 'File is too large. Max size is 5MB.' }));
        return;
      }
      setFile(selectedFile);
      setErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors((prev) => ({ ...prev, file: 'Only PDF, DOC or DOCX files are allowed.' }));
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: 'File is too large. Max size is 5MB.' }));
        return;
      }
      setFile(selectedFile);
      setErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (botCheck) {
      return;
    }

    if (!validate()) {
      setStatus({ type: 'error', text: '❌ Please correct the errors before submitting.' });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('position', position);
    if (experience) formData.append('experience', experience);
    if (coverLetter) formData.append('coverLetter', coverLetter);
    if (file) formData.append('resume', file);

    try {
      await submitCareer(formData);

      setStatus({
        type: 'success',
        text: '🎉 Application submitted! We will review it and reach out within 5–7 business days.',
      });

      // Reset
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setPosition('');
      setExperience('');
      setCoverLetter('');
      setFile(null);
    } catch (err: any) {
      setStatus({
        type: 'error',
        text: `❌ ${err.message || 'Something went wrong.'} Please email info@dxbiocode.com directly.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {/* ===== PAGE HERO ===== */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>Careers
          </div>
          <h1>Join Our Team</h1>
          <p>Be part of a mission-driven company pioneering India's diagnostic revolution. Grow your career at DX BIOCODE.</p>
        </div>
      </div>

      {/* ===== CAREERS CONTENT ===== */}
      <main className="careers-main">
        {/* Company Culture */}
        <div className="section-title-wrap">
          <span className="section-eyebrow">Why Work With Us</span>
          <h2 className="section-title">Our Culture &amp; Values</h2>
          <p className="section-sub">At DX BIOCODE, we believe that great technology is built by great people. Join a team where innovation meets purpose.</p>
        </div>

        <div className="culture-grid">
          <TiltCard className="culture-card">
            <span className="culture-icon">🚀</span>
            <div className="culture-title">Innovation First</div>
            <p className="culture-desc">We push the boundaries of point-of-care diagnostics every day. Join a team that turns bold ideas into life-saving technology.</p>
          </TiltCard>
          <TiltCard className="culture-card">
            <span className="culture-icon">🤝</span>
            <div className="culture-title">Collaborative Environment</div>
            <p className="culture-desc">We believe in teamwork, open communication, and mutual respect. Every voice matters — from engineers to sales to support.</p>
          </TiltCard>
          <TiltCard className="culture-card">
            <span className="culture-icon">📈</span>
            <div className="culture-title">Growth &amp; Learning</div>
            <p className="culture-desc">We invest in our people. Continuous learning, training programs, and mentorship opportunities are part of every role at DX BIOCODE.</p>
          </TiltCard>
          <TiltCard className="culture-card">
            <span className="culture-icon">🌍</span>
            <div className="culture-title">Global Impact</div>
            <p className="culture-desc">Our diagnostics reach clinics, hospitals, and homes across India and beyond. Your work directly contributes to better healthcare outcomes worldwide.</p>
          </TiltCard>
          <TiltCard className="culture-card">
            <span className="culture-icon">⚖️</span>
            <div className="culture-title">Work-Life Balance</div>
            <p className="culture-desc">We value your well-being. Flexible working arrangements, health benefits, and a supportive environment ensure you thrive inside and outside of work.</p>
          </TiltCard>
          <TiltCard className="culture-card">
            <span className="culture-icon">🏆</span>
            <div className="culture-title">Recognition &amp; Rewards</div>
            <p className="culture-desc">Excellence is celebrated. Competitive compensation, performance incentives, and employee recognition programs are central to our culture.</p>
          </TiltCard>
        </div>

        {/* Current Openings */}
        <div className="section-title-wrap">
          <span className="section-eyebrow">Current Openings</span>
          <h2 className="section-title">Open Positions</h2>
          <p className="section-sub">Explore our current opportunities and find the role that fits your passion and expertise.</p>
        </div>

        <div className="job-listing-grid">
          {[
            {
              dept: 'Sales & Business Development',
              title: 'Regional Sales Manager — Diagnostics',
              tags: ['📍 Chennai, Tamil Nadu', '💼 Full-Time', '🎓 3+ Years Experience'],
            },
            {
              dept: 'Research & Development',
              title: 'IVD Assay Development Scientist',
              tags: ['📍 Chennai, Tamil Nadu', '💼 Full-Time', '🎓 MSc / PhD in Life Sciences'],
            },
            {
              dept: 'Technical Support',
              title: 'Field Service Engineer — POCT Instruments',
              tags: ['📍 Multiple Locations (India)', '💼 Full-Time', '🎓 B.Tech / Diploma Electronics / Biomedical'],
            },
            {
              dept: 'Marketing',
              title: 'Digital Marketing & Brand Manager',
              tags: ['📍 Chennai, Tamil Nadu', '💼 Full-Time', '🎓 2+ Years Experience'],
            },
            {
              dept: 'Regulatory & Quality',
              title: 'Regulatory Affairs Specialist — IVD / CE Marking',
              tags: ['📍 Chennai, Tamil Nadu', '💼 Full-Time', '🎓 Life Sciences / Regulatory Background'],
            },
          ].map((job, idx) => (
            <FadeUp key={idx} delay={idx * 0.1}>
              <div className="job-card">
                <div className="job-info">
                  <div className="job-dept">{job.dept}</div>
                  <div className="job-title">{job.title}</div>
                  <div className="job-meta">
                    {job.tags.map((t, i) => (
                      <span key={i} className="job-tag">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="job-apply-btn">
                  <a href="#apply" className="btn-primary" style={{ fontSize: '14px', padding: '11px 22px' }}>
                    Apply Now →
                  </a>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Resume Upload Section */}
        <div className="resume-section" id="apply">
          <div className="resume-grid">
            <FadeUp>
              <div className="resume-info">
                <h2>Don't See Your Role? Send Us Your Resume</h2>
                <p>We're always looking for talented, passionate individuals to join our growing team. Upload your resume and tell us about yourself — we'll reach out when the right opportunity arises.</p>
                <div className="resume-perks">
                  <div className="resume-perk"><span>✅</span> Your resume will be kept on file for 6 months</div>
                  <div className="resume-perk"><span>🔒</span> Your data is secure and confidential</div>
                  <div className="resume-perk"><span>📧</span> We'll notify you of matching openings</div>
                  <div className="resume-perk"><span>🤝</span> Open to freshers and experienced professionals</div>
                  <div className="resume-perk"><span>📍</span> Opportunities across India and remote roles</div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="resume-form-wrap">
                <h3>Upload Your Resume</h3>
                <p>Fill in your details and attach your CV / resume</p>
                <form className="resume-form" onSubmit={handleSubmit} noValidate>
                  {/* Honeypot Field */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="form-bot-check-careers">Leave this field blank</label>
                    <input
                      type="text"
                      id="form-bot-check-careers"
                      value={botCheck}
                      onChange={(e) => setBotCheck(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="r-fname">First Name *</label>
                      <input
                        type="text"
                        id="r-fname"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (e.target.value.trim()) setErrors((prev) => ({ ...prev, firstName: '' }));
                        }}
                        className={errors.firstName ? 'invalid' : ''}
                        placeholder="First name"
                        required
                        autoComplete="given-name"
                      />
                      {errors.firstName && <span className="error-msg" style={{ display: 'block' }}>{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="r-lname">Last Name *</label>
                      <input
                        type="text"
                        id="r-lname"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (e.target.value.trim()) setErrors((prev) => ({ ...prev, lastName: '' }));
                        }}
                        className={errors.lastName ? 'invalid' : ''}
                        placeholder="Last name"
                        required
                        autoComplete="family-name"
                      />
                      {errors.lastName && <span className="error-msg" style={{ display: 'block' }}>{errors.lastName}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="r-email">Email Address *</label>
                    <input
                      type="email"
                      id="r-email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (e.target.value.trim()) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className={errors.email ? 'invalid' : ''}
                      placeholder="you@email.com"
                      required
                      autoComplete="email"
                    />
                    {errors.email && <span className="error-msg" style={{ display: 'block' }}>{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="r-phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="r-phone"
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
                  <div className="form-group">
                    <label htmlFor="r-position">Position of Interest *</label>
                    <select
                      id="r-position"
                      value={position}
                      onChange={(e) => {
                        setPosition(e.target.value);
                        if (e.target.value) setErrors((prev) => ({ ...prev, position: '' }));
                      }}
                      className={errors.position ? 'invalid' : ''}
                      required
                    >
                      <option value="">Select a department...</option>
                      <option value="Sales &amp; Business Development">Sales &amp; Business Development</option>
                      <option value="Research &amp; Development">Research &amp; Development</option>
                      <option value="Technical Support / Field Service">Technical Support / Field Service</option>
                      <option value="Marketing &amp; Communications">Marketing &amp; Communications</option>
                      <option value="Regulatory &amp; Quality">Regulatory &amp; Quality</option>
                      <option value="Operations &amp; Supply Chain">Operations &amp; Supply Chain</option>
                      <option value="Finance &amp; Administration">Finance &amp; Administration</option>
                      <option value="Other / Open to Suggestions">Other / Open to Suggestions</option>
                    </select>
                    {errors.position && <span className="error-msg" style={{ display: 'block' }}>{errors.position}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="r-experience">Years of Experience</label>
                    <select
                      id="r-experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    >
                      <option value="">Select experience level...</option>
                      <option value="Fresher (0–1 year)">Fresher (0–1 year)</option>
                      <option value="Junior (1–3 years)">Junior (1–3 years)</option>
                      <option value="Mid-level (3–6 years)">Mid-level (3–6 years)</option>
                      <option value="Senior (6–10 years)">Senior (6–10 years)</option>
                      <option value="Lead / Manager (10+ years)">Lead / Manager (10+ years)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Resume / CV *</label>
                    <div
                      className={`file-upload-area ${isDragOver ? 'drag-over' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                    >
                      <input
                        type="file"
                        id="r-resume"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                      />
                      <span className="file-upload-icon">📄</span>
                      <div className="file-upload-text">Click to upload or drag &amp; drop your resume</div>
                      <div className="file-upload-hint">PDF, DOC or DOCX · Max 5MB</div>
                      {file && <div className="file-selected-name">✓ {file.name}</div>}
                    </div>
                    {errors.file && <span className="error-msg" style={{ display: 'block' }}>{errors.file}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="r-cover">Cover Letter / Message</label>
                    <textarea
                      id="r-cover"
                      rows={3}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Tell us about yourself, your experience, and why you want to join DX BIOCODE..."
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isSubmitting}>
                    {isSubmitting ? '⌛ Uploading & Submitting...' : '🚀 Submit Application'}
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
      </main>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2>Ready to Make a Difference?</h2>
          <p>Join DX BIOCODE and be part of transforming point-of-care diagnostics across India.</p>
          <div className="cta-actions">
            <a href="#apply" className="btn-white">📄 Upload Resume</a>
            <Link to="/contact" className="btn-outline-white">📞 Get in Touch</Link>
          </div>
        </div>
      </section>
    </div>
  );
};
