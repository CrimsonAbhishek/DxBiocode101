import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  location: z.string().optional(),
  organization: z.string().min(2),
  training_category: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
    const data = parsed.data;

    await resend.emails.send({
      from: 'DX BIOCODE Website <noreply@dxbiocode.com>',
      to: ['crimsonabhishek@gmail.com'],
      replyTo: data.email,
      subject: `📅 Training Request: ${data.training_category || 'General'} — ${data.name}`,
      html: `
        <h2>New Training Session Request</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
        <p><strong>Organization:</strong> ${data.organization}</p>
        <p><strong>Training Category:</strong> ${data.training_category || 'N/A'}</p>
        <p><strong>Message:</strong> ${data.message || 'N/A'}</p>
      `,
    });

    await resend.emails.send({
      from: 'DX BIOCODE <noreply@dxbiocode.com>',
      to: [data.email],
      subject: 'Training request received — DX BIOCODE',
      html: `<h2>Thank you, ${data.name}!</h2><p>We received your training session request and will get back to you within 24 hours to schedule your training.</p><br/><p>Best,<br/>DX BIOCODE Training Team</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Training API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
