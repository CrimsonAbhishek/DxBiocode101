import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { uploadToR2 } from '@/lib/r2';

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  position: z.string().min(1),
  experience: z.string().optional(),
  cover_letter: z.string().optional(),
  resume_base64: z.string().min(1),
  resume_filename: z.string().min(1),
  resume_type: z.string(),
  _bot_check: z.string().optional(),
  website: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body._bot_check || body.website) return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });

    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
    const data = parsed.data;

    // Upload resume to Cloudflare R2
    const resumeBuffer = Buffer.from(data.resume_base64, 'base64');
    const key = `resumes/${Date.now()}-${data.first_name}-${data.last_name}-${data.resume_filename}`;
    let resumeUrl = '';
    try {
      resumeUrl = await uploadToR2(key, resumeBuffer, data.resume_type);
    } catch (uploadErr) {
      console.error('R2 upload error:', uploadErr);
      // Don't fail the whole request if R2 is not configured yet
    }

    const name = `${data.first_name} ${data.last_name}`;

    await resend.emails.send({
      from: 'DX BIOCODE Careers <info@dxbiocode.com>',
      to: ['crimsonabhishek@gmail.com'],
      replyTo: data.email,
      subject: `🚀 New Job Application: ${data.position} — ${name}`,
      html: `
        <h2>New Job Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Position:</strong> ${data.position}</p>
        <p><strong>Experience:</strong> ${data.experience || 'N/A'}</p>
        <p><strong>Cover Letter:</strong><br/>${data.cover_letter || 'N/A'}</p>
        ${resumeUrl ? `<p><strong>Resume:</strong> <a href="${resumeUrl}">${data.resume_filename}</a></p>` : ''}
      `,
      attachments: resumeUrl ? undefined : [
        {
          filename: data.resume_filename,
          content: data.resume_base64,
        },
      ],
    });

    // Confirmation
    await resend.emails.send({
      from: 'DX BIOCODE <info@dxbiocode.com>',
      to: [data.email],
      subject: 'Application received — DX BIOCODE',
      html: `
        <h2>Thank you, ${name}!</h2>
        <p>We have received your application for <strong>${data.position}</strong> and will review it carefully.</p>
        <p>If your profile matches our requirements, we will reach out within 5–7 business days.</p>
        <br/><p>Best regards,<br/>DX BIOCODE HR Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Careers API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
