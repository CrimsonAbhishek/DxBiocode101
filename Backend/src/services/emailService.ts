import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.RESEND_API_KEY || 're_mock_key_for_local_development';
const resend = new Resend(apiKey);
const FROM = process.env.RESEND_FROM_EMAIL ?? 'DX BIOCODE <noreply@dxbiocode.com>';
const TO_INTERNAL = process.env.RESEND_TO_EMAIL ?? 'crimsonabhishek@gmail.com';

function maskEmail(e: string): string {
  return e.replace(/(.{2})(.*)(@.*)/, '$1***$3');
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[email-simulation] To: ${to} | Subject: ${subject}`);
    return;
  }
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

// ─── Quote Emails ────────────────────────────────────────────────
export async function sendQuoteEmails(data: {
  name: string; email: string; phone: string; organization?: string;
  designation?: string; facilityType?: string; timeline?: string;
  message: string; items?: Array<{ product_name: string; quantity: number }>;
}): Promise<void> {
  const itemsHtml = data.items?.length
    ? `<h3 style="color:#3a7bd5">Requested Products:</h3><ul>${data.items.map(i => `<li><strong>${i.product_name}</strong> — Qty: ${i.quantity}</li>`).join('')}</ul>`
    : '';

  const internalHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#3a7bd5,#9b2fc8,#e91e8c);padding:24px 28px">
        <h1 style="color:white;margin:0;font-size:22px">📋 New Quote Request</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px">DX BIOCODE — Lead Notification</p>
      </div>
      <div style="padding:28px">
        <table style="width:100%;border-collapse:collapse">
          ${[
            ['Name', data.name], ['Email', data.email], ['Phone', data.phone],
            ['Organization', data.organization || 'N/A'], ['Designation', data.designation || 'N/A'],
            ['Facility Type', data.facilityType || 'N/A'], ['Purchase Timeline', data.timeline || 'N/A'],
          ].map(([k, v]) => `<tr><td style="padding:10px 12px;font-weight:600;color:#0f172a;width:40%;border-bottom:1px solid #e5e7eb">${k}</td><td style="padding:10px 12px;color:#374151;border-bottom:1px solid #e5e7eb">${v}</td></tr>`).join('')}
        </table>
        <div style="margin-top:20px;padding:16px;background:#f8f5ff;border-left:4px solid #9b2fc8;border-radius:0 8px 8px 0">
          <strong style="color:#0f172a">Message:</strong>
          <p style="color:#374151;margin:8px 0 0">${data.message}</p>
        </div>
        ${itemsHtml}
      </div>
      <div style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280">
        DX BIOCODE Pvt. Ltd. • Chennai, Tamil Nadu • +91 8080885059
      </div>
    </div>`;

  const confirmHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#3a7bd5,#9b2fc8);padding:32px 28px;text-align:center">
        <h1 style="color:white;margin:0;font-size:24px">✅ Quote Request Received</h1>
      </div>
      <div style="padding:32px 28px">
        <p style="font-size:16px;color:#0f172a">Dear <strong>${data.name}</strong>,</p>
        <p style="color:#374151;line-height:1.7">Thank you for your interest in the <strong>DX 101 Immunofluorescence Quantitative Analyzer</strong>. We have received your quote request and our team will contact you within <strong>1–2 business days</strong>.</p>
        <p style="color:#374151;line-height:1.7">For urgent queries, please call us directly at <strong>+91 8080885059</strong>.</p>
        <div style="margin:28px 0;text-align:center">
          <a href="https://dxbiocode.com/products" style="background:linear-gradient(135deg,#3a7bd5,#9b2fc8);color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block">Browse Products</a>
        </div>
      </div>
      <div style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;text-align:center">
        DX BIOCODE Pvt. Ltd. • 27(38) Madley Road, T. Nagar, Chennai – 600017 • info@dxbiocode.com
      </div>
    </div>`;

  await Promise.allSettled([
    sendEmail(TO_INTERNAL, `📋 New Quote Request — ${data.organization || data.name}`, internalHtml),
    sendEmail(data.email, 'Quote Request Received — DX BIOCODE', confirmHtml),
  ]);
  console.log(`[email] quote → internal + ${maskEmail(data.email)}`);
}

// ─── Contact Emails ──────────────────────────────────────────────
export async function sendContactEmails(data: {
  name: string; email: string; phone: string; organization?: string;
  enquiryType?: string; message: string;
}): Promise<void> {
  const internalHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#3a7bd5,#9b2fc8,#e91e8c);padding:24px 28px">
        <h1 style="color:white;margin:0;font-size:22px">📨 New Contact Enquiry</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px">${data.enquiryType || 'General Enquiry'}</p>
      </div>
      <div style="padding:28px">
        <table style="width:100%;border-collapse:collapse">
          ${[['Name', data.name],['Email', data.email],['Phone', data.phone],['Organization', data.organization||'N/A'],['Enquiry Type', data.enquiryType||'N/A']].map(([k,v])=>`<tr><td style="padding:10px 12px;font-weight:600;color:#0f172a;width:40%;border-bottom:1px solid #e5e7eb">${k}</td><td style="padding:10px 12px;color:#374151;border-bottom:1px solid #e5e7eb">${v}</td></tr>`).join('')}
        </table>
        <div style="margin-top:20px;padding:16px;background:#f8f5ff;border-left:4px solid #9b2fc8;border-radius:0 8px 8px 0">
          <strong style="color:#0f172a">Message:</strong><p style="color:#374151;margin:8px 0 0">${data.message}</p>
        </div>
      </div>
    </div>`;

  const confirmHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#3a7bd5,#9b2fc8);padding:32px 28px;text-align:center">
        <h1 style="color:white;margin:0;font-size:22px">✅ Message Received</h1>
      </div>
      <div style="padding:32px 28px">
        <p style="font-size:16px;color:#0f172a">Dear <strong>${data.name}</strong>,</p>
        <p style="color:#374151;line-height:1.7">Thank you for reaching out to DX BIOCODE. We have received your message and will respond within <strong>1 business day</strong>.</p>
        <p style="color:#374151">Questions? Call us: <strong>+91 8080885059</strong></p>
      </div>
      <div style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;text-align:center">
        DX BIOCODE Pvt. Ltd. • Chennai, Tamil Nadu • info@dxbiocode.com
      </div>
    </div>`;

  await Promise.allSettled([
    sendEmail(TO_INTERNAL, `📨 Contact: ${data.enquiryType||'General'} — ${data.name}`, internalHtml),
    sendEmail(data.email, 'Message Received — DX BIOCODE', confirmHtml),
  ]);
  console.log(`[email] contact → internal + ${maskEmail(data.email)}`);
}

// ─── Training Emails ─────────────────────────────────────────────
export async function sendTrainingEmails(data: {
  name: string; email: string; phone: string; location?: string;
  organization: string; trainingCategory?: string; message?: string;
}): Promise<void> {
  const internalHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#3a7bd5,#9b2fc8,#e91e8c);padding:24px 28px">
        <h1 style="color:white;margin:0;font-size:22px">🎓 Training Request</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px">${data.trainingCategory||'General Training'}</p>
      </div>
      <div style="padding:28px">
        <table style="width:100%;border-collapse:collapse">
          ${[['Name',data.name],['Email',data.email],['Phone',data.phone],['Location',data.location||'N/A'],['Organization',data.organization],['Category',data.trainingCategory||'N/A']].map(([k,v])=>`<tr><td style="padding:10px 12px;font-weight:600;color:#0f172a;width:40%;border-bottom:1px solid #e5e7eb">${k}</td><td style="padding:10px 12px;color:#374151;border-bottom:1px solid #e5e7eb">${v}</td></tr>`).join('')}
        </table>
        ${data.message ? `<div style="margin-top:20px;padding:16px;background:#f8f5ff;border-left:4px solid #9b2fc8;border-radius:0 8px 8px 0"><strong>Message:</strong><p style="color:#374151;margin:8px 0 0">${data.message}</p></div>` : ''}
      </div>
    </div>`;

  const confirmHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#3a7bd5,#9b2fc8);padding:32px 28px;text-align:center">
        <h1 style="color:white;margin:0;font-size:22px">✅ Training Request Received</h1>
      </div>
      <div style="padding:32px 28px">
        <p style="font-size:16px;color:#0f172a">Dear <strong>${data.name}</strong>,</p>
        <p style="color:#374151;line-height:1.7">We received your training session request for <strong>${data.trainingCategory||'DX 101 Training'}</strong>. Our team will reach out within <strong>24 hours</strong> to schedule your session.</p>
      </div>
      <div style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;text-align:center">
        DX BIOCODE Pvt. Ltd. • Chennai, Tamil Nadu • info@dxbiocode.com
      </div>
    </div>`;

  await Promise.allSettled([
    sendEmail(TO_INTERNAL, `🎓 Training: ${data.trainingCategory||'General'} — ${data.name}`, internalHtml),
    sendEmail(data.email, 'Training Request Received — DX BIOCODE', confirmHtml),
  ]);
  console.log(`[email] training → internal + ${maskEmail(data.email)}`);
}

// ─── Career Emails ───────────────────────────────────────────────
export async function sendCareerEmails(data: {
  firstName: string; lastName: string; email: string; phone: string;
  position: string; experience?: string; coverLetter?: string; resumeUrl?: string; resumeFilename?: string;
}): Promise<void> {
  const internalHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#3a7bd5,#9b2fc8,#e91e8c);padding:24px 28px">
        <h1 style="color:white;margin:0;font-size:22px">🚀 New Job Application</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px">${data.position}</p>
      </div>
      <div style="padding:28px">
        <table style="width:100%;border-collapse:collapse">
          ${[['Name',`${data.firstName} ${data.lastName}`],['Email',data.email],['Phone',data.phone],['Position',data.position],['Experience',data.experience||'N/A']].map(([k,v])=>`<tr><td style="padding:10px 12px;font-weight:600;color:#0f172a;width:40%;border-bottom:1px solid #e5e7eb">${k}</td><td style="padding:10px 12px;color:#374151;border-bottom:1px solid #e5e7eb">${v}</td></tr>`).join('')}
        </table>
        ${data.resumeUrl ? `<div style="margin-top:20px"><a href="${data.resumeUrl}" style="background:linear-gradient(135deg,#3a7bd5,#9b2fc8);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">📄 Download Resume: ${data.resumeFilename}</a></div>` : ''}
        ${data.coverLetter ? `<div style="margin-top:20px;padding:16px;background:#f8f5ff;border-left:4px solid #9b2fc8;border-radius:0 8px 8px 0"><strong>Cover Letter:</strong><p style="color:#374151;margin:8px 0 0">${data.coverLetter}</p></div>` : ''}
      </div>
    </div>`;

  const confirmHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#3a7bd5,#9b2fc8);padding:32px 28px;text-align:center">
        <h1 style="color:white;margin:0;font-size:22px">✅ Application Received!</h1>
      </div>
      <div style="padding:32px 28px">
        <p style="font-size:16px;color:#0f172a">Dear <strong>${data.firstName}</strong>,</p>
        <p style="color:#374151;line-height:1.7">Thank you for applying for the <strong>${data.position}</strong> role at DX BIOCODE. We have received your application and will review it carefully. If your profile matches, we will reach out within <strong>5–7 business days</strong>.</p>
      </div>
      <div style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;text-align:center">
        DX BIOCODE Pvt. Ltd. • Chennai, Tamil Nadu • info@dxbiocode.com
      </div>
    </div>`;

  await Promise.allSettled([
    sendEmail(TO_INTERNAL, `🚀 Application: ${data.position} — ${data.firstName} ${data.lastName}`, internalHtml),
    sendEmail(data.email, 'Application Received — DX BIOCODE', confirmHtml),
  ]);
  console.log(`[email] career → internal + ${maskEmail(data.email)}`);
}
