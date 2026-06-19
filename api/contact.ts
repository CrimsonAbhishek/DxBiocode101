import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_lib/db';
import { contactSubmissions } from '../drizzle/schema';
import { contactSchema } from './_lib/validate';
import { checkRateLimit } from './_lib/ratelimit';
import { cors, getIP, ok, fail } from './_lib/response';
import { sendContactEmails } from './_lib/email';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '512kb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── CORS + Preflight ──────────────────────────────────────────
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json(fail('Method not allowed', 'SERVER_ERROR'));
  }

  // ── Rate Limit: 20 contact submissions per hour per IP ────────
  const ip = getIP(req);
  const { allowed } = checkRateLimit(ip, 20, 3600);
  if (!allowed) {
    return res.status(429).json(fail('Too many requests. Please try again later.', 'RATE_LIMITED'));
  }

  // ── Honeypot ──────────────────────────────────────────────────
  if (req.body?._bot_check !== '') {
    console.warn(`[contact] honeypot triggered from ${ip}`);
    return res.status(200).json(ok({}));
  }

  // ── Zod validation ────────────────────────────────────────────
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? 'Invalid input';
    return res.status(400).json(fail(message, 'VALIDATION_ERROR'));
  }

  const { _bot_check: _bc, ...data } = parsed.data;

  // ── Database insert ───────────────────────────────────────────
  let submissionId: string = 'mock-sub-id-' + Math.random().toString(36).substring(2, 9);
  try {
    if (db) {
      const [row] = await db
        .insert(contactSubmissions)
        .values({
          name: data.name,
          phone: data.phone,
          email: data.email,
          organization: data.organization || null,
          enquiryType: data.enquiry_type || null,
          message: data.message,
          ipAddress: ip,
        })
        .returning({ id: contactSubmissions.id });

      submissionId = row.id;
    } else {
      console.warn('[contact] db is null. Bypassing database logging.');
    }
  } catch (dbError) {
    console.error('[contact] DB insert failed:', dbError instanceof Error ? dbError.message : dbError);
    return res.status(500).json(fail('Unable to save your message. Please try again.', 'SERVER_ERROR'));
  }

  // ── Email notification ────────────────────────────────────────
  try {
    await sendContactEmails({
      name: data.name,
      phone: data.phone,
      email: data.email,
      organization: data.organization ?? '',
      enquiryType: data.enquiry_type ?? '',
      message: data.message,
      submissionId,
    });
  } catch (emailError) {
    console.error('[contact] email failed (DB record saved):', emailError instanceof Error ? emailError.message : emailError);
  }

  return res.status(200).json(ok({ submission_id: submissionId }));
}
