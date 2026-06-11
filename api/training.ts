import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_lib/db';
import { trainingBookings } from '../drizzle/schema';
import { trainingSchema } from './_lib/validate';
import { checkRateLimit } from './_lib/ratelimit';
import { cors, getIP, ok, fail } from './_lib/response';
import { sendTrainingEmails } from './_lib/email';

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

  // ── Rate Limit: 10 training bookings per hour per IP ──────────
  const ip = getIP(req);
  const { allowed } = checkRateLimit(ip, 10, 3600);
  if (!allowed) {
    return res.status(429).json(fail('Too many requests. Please try again later.', 'RATE_LIMITED'));
  }

  // ── Honeypot ──────────────────────────────────────────────────
  if (req.body?._bot_check !== '') {
    console.warn(`[training] honeypot triggered from ${ip}`);
    return res.status(200).json(ok({}));
  }

  // ── Zod validation ────────────────────────────────────────────
  const parsed = trainingSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? 'Invalid input';
    return res.status(400).json(fail(message, 'VALIDATION_ERROR'));
  }

  const { _bot_check: _bc, ...data } = parsed.data;

  // ── Database insert ───────────────────────────────────────────
  let bookingId: string;
  try {
    const [row] = await db
      .insert(trainingBookings)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        organization: data.organization,
        location: data.location || null,
        trainingCategory: data.training_category || null,
        message: data.message || null,
        ipAddress: ip,
      })
      .returning({ id: trainingBookings.id });

    bookingId = row.id;
  } catch (dbError) {
    console.error('[training] DB insert failed:', dbError instanceof Error ? dbError.message : dbError);
    return res.status(500).json(fail('Unable to save your booking. Please try again.', 'SERVER_ERROR'));
  }

  // ── Email notification ────────────────────────────────────────
  try {
    await sendTrainingEmails({
      name: data.name,
      email: data.email,
      phone: data.phone,
      organization: data.organization,
      location: data.location ?? '',
      trainingCategory: data.training_category ?? '',
      message: data.message ?? '',
      bookingId,
    });
  } catch (emailError) {
    console.error('[training] email failed (DB record saved):', emailError instanceof Error ? emailError.message : emailError);
  }

  return res.status(200).json(ok({ booking_id: bookingId }));
}
