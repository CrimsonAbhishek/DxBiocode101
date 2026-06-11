'use client';
import { useRef, useState } from 'react';
import FadeUp from '@/components/FadeUp';

type FormStatus = { type: 'success' | 'error'; msg: string } | null;

export default function CareersPageClient() {
  const [status, setStatus] = useState<FormStatus>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); uploadRef.current?.classList.add('drag-over'); };
  const handleDragLeave = () => uploadRef.current?.classList.remove('drag-over');
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    uploadRef.current?.classList.remove('drag-over');
    if (e.dataTransfer.files.length && fileRef.current) {
      const dt = e.dataTransfer;
      fileRef.current.files = dt.files;
      setFileName(dt.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const form = e.currentTarget;
    const file = fileRef.current?.files?.[0];
    if (!file) { setStatus({ type: 'error', msg: '❌ Please attach your resume (PDF or DOCX).' }); setSubmitting(false); return; }
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowed.includes(file.type)) { setStatus({ type: 'error', msg: '❌ Only PDF or DOCX files are accepted.' }); setSubmitting(false); return; }
    if (file.size > 3 * 1024 * 1024) { setStatus({ type: 'error', msg: '❌ File is too large. Maximum size is 3MB.' }); setSubmitting(false); return; }

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = evt => resolve((evt.target!.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const data = Object.fromEntries(new FormData(form));
      const payload = { ...data, resume_base64: base64, resume_filename: file.name, resume_type: file.type };
      const res = await fetch('/api/careers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (res.ok && result.success) {
        setStatus({ type: 'success', msg: '🎉 Application submitted! We will review it and reach out within 5–7 business days.' });
        form.reset();
        setFileName('');
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
    <div className="resume-section" id="apply">
      <div className="resume-grid">
        <FadeUp>
          <div className="resume-info">
            <h2>Don&apos;t See Your Role? Send Us Your Resume</h2>
            <p>We&apos;re always looking for talented, passionate individuals to join our growing team. Upload your resume and tell us about yourself — we&apos;ll reach out when the right opportunity arises.</p>
            <div className="resume-perks">
              <div className="resume-perk"><span>✅</span> Your resume will be kept on file for 6 months</div>
              <div className="resume-perk"><span>🔒</span> Your data is secure and confidential</div>
              <div className="resume-perk"><span>📧</span> We&apos;ll notify you of matching openings</div>
              <div className="resume-perk"><span>🤝</span> Open to freshers and experienced professionals</div>
              <div className="resume-perk"><span>📍</span> Opportunities across India and remote roles</div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="resume-form-wrap">
            <h3>Upload Your Resume</h3>
            <p>Fill in your details and attach your CV / resume</p>
            <form className="resume-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="r-fname">First Name *</label>
                  <input id="r-fname" name="first_name" type="text" placeholder="First name" required autoComplete="given-name" />
                </div>
                <div className="form-group">
                  <label htmlFor="r-lname">Last Name *</label>
                  <input id="r-lname" name="last_name" type="text" placeholder="Last name" required autoComplete="family-name" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="r-email">Email Address *</label>
                <input id="r-email" name="email" type="email" placeholder="you@email.com" required autoComplete="email" />
              </div>
              <div className="form-group">
                <label htmlFor="r-phone">Phone Number *</label>
                <input id="r-phone" name="phone" type="tel" placeholder="+91 98765 43210" required autoComplete="tel" />
              </div>
              <div className="form-group">
                <label htmlFor="r-position">Position of Interest *</label>
                <select id="r-position" name="position" required>
                  <option value="">Select a department...</option>
                  <option>Sales &amp; Business Development</option>
                  <option>Research &amp; Development</option>
                  <option>Technical Support / Field Service</option>
                  <option>Marketing &amp; Communications</option>
                  <option>Regulatory &amp; Quality</option>
                  <option>Operations &amp; Supply Chain</option>
                  <option>Finance &amp; Administration</option>
                  <option>Other / Open to Suggestions</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="r-experience">Years of Experience</label>
                <select id="r-experience" name="experience">
                  <option value="">Select experience level...</option>
                  <option>Fresher (0–1 year)</option>
                  <option>Junior (1–3 years)</option>
                  <option>Mid-level (3–6 years)</option>
                  <option>Senior (6–10 years)</option>
                  <option>Lead / Manager (10+ years)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Resume / CV *</label>
                <div
                  ref={uploadRef}
                  className="file-upload-area"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input type="file" ref={fileRef} accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                  <span className="file-upload-icon">📄</span>
                  <div className="file-upload-text">Click to upload or drag &amp; drop your resume</div>
                  <div className="file-upload-hint">PDF, DOC or DOCX · Max 3MB</div>
                  {fileName && <div className="file-selected-name">✓ {fileName}</div>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="r-cover">Cover Letter / Message</label>
                <textarea id="r-cover" name="cover_letter" rows={3} placeholder="Tell us about yourself, your experience, and why you want to join DX BIOCODE..." />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                {submitting ? '⌛ Uploading & Submitting...' : '🚀 Submit Application'}
              </button>
              {status && <div className={`form-status ${status.type}`}>{status.msg}</div>}
            </form>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
