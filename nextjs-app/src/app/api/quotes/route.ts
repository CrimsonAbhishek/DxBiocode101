import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  organization: z.string().optional(),
  designation: z.string().optional(),
  facility_type: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(5),
  items: z.array(z.object({ product_name: z.string(), quantity: z.number().default(1) })).optional(),
  _bot_check: z.string().optional(),
  website: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot check
    if (body._bot_check || body.website) return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
    }
    const data = parsed.data;

    const itemsHtml = data.items?.length
      ? `<h3>Requested Products:</h3><ul>${data.items.map(i => `<li>${i.product_name} (Qty: ${i.quantity})</li>`).join('')}</ul>`
      : '';

    await resend.emails.send({
      from: 'DX BIOCODE Website <info@dxbiocode.com>',
      to: ['crimsonabhishek@gmail.com'],
      replyTo: data.email,
      subject: `📋 New Quote Request from ${data.name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Organization:</strong> ${data.organization || 'N/A'}</p>
        <p><strong>Designation:</strong> ${data.designation || 'N/A'}</p>
        <p><strong>Facility Type:</strong> ${data.facility_type || 'N/A'}</p>
        <p><strong>Purchase Timeline:</strong> ${data.timeline || 'N/A'}</p>
        <p><strong>Message:</strong> ${data.message}</p>
        ${itemsHtml}
      `,
    });

    // Confirmation to user
    await resend.emails.send({
      from: 'DX BIOCODE <info@dxbiocode.com>',
      to: [data.email],
      subject: 'We received your quote request — DX BIOCODE',
      html: `
        <h2>Thank you, ${data.name}!</h2>
        <p>We have received your quote request and will get back to you within 1–2 business days.</p>
        <p>If you have any urgent queries, please call us at <strong>+91 8080885059</strong>.</p>
        <br/><p>Best regards,<br/>DX BIOCODE Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Quote API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
