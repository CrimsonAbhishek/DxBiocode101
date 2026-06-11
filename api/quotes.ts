import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_lib/db';
import { quoteRequests, quoteItems } from '../drizzle/schema';
import { quoteSchema } from './_lib/validate';
import { checkRateLimit } from './_lib/ratelimit';
import { cors, getIP, ok, fail } from './_lib/response';
import { sendQuoteEmails } from './_lib/email';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── CORS + Preflight ──────────────────────────────────────────
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json(fail('Method not allowed', 'SERVER_ERROR'));
  }

  // ── Rate Limit: 10 quote requests per hour per IP ─────────────
  const ip = getIP(req);
  const { allowed } = checkRateLimit(ip, 10, 3600);
  if (!allowed) {
    return res.status(429).json(fail('Too many requests. Please try again later.', 'RATE_LIMITED'));
  }

  // ── Honeypot check (silent success for bots) ──────────────────
  if (req.body?._bot_check !== '') {
    console.warn(`[quotes] honeypot triggered from ${ip}`);
    return res.status(200).json(ok({ quote_id: 'ignored' }));
  }

  // ── Zod validation ────────────────────────────────────────────
  const parsed = quoteSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? 'Invalid input';
    return res.status(400).json(fail(message, 'VALIDATION_ERROR'));
  }

  const { items, _bot_check: _bc, ...quoteData } = parsed.data;

  // ── Database insert ───────────────────────────────────────────
  let quoteId: string;
  try {
    const [insertedQuote] = await db
      .insert(quoteRequests)
      .values({
        name: quoteData.name,
        phone: quoteData.phone,
        email: quoteData.email,
        organization: quoteData.organization,
        designation: quoteData.designation || null,
        facilityType: quoteData.facility_type || null,
        timeline: quoteData.timeline || null,
        message: quoteData.message || null,
        ipAddress: ip,
      })
      .returning({ id: quoteRequests.id });

    quoteId = insertedQuote.id;

    if (items.length > 0) {
      await db.insert(quoteItems).values(
        items.map((item) => ({
          quoteId,
          productName: item.product_name,
          quantity: item.quantity,
        }))
      );
    }
  } catch (dbError) {
    console.error('[quotes] DB insert failed:', dbError instanceof Error ? dbError.message : dbError);
    return res.status(500).json(fail('Unable to save your request. Please try again.', 'SERVER_ERROR'));
  }

  // ── Email notification (non-blocking: DB save is the source of truth) ──
  try {
    await sendQuoteEmails({
      name: quoteData.name,
      phone: quoteData.phone,
      email: quoteData.email,
      organization: quoteData.organization,
      designation: quoteData.designation ?? '',
      facilityType: quoteData.facility_type ?? '',
      timeline: quoteData.timeline ?? '',
      message: quoteData.message ?? '',
      items,
      quoteId,
    });
  } catch (emailError) {
    // Email failure does NOT fail the request — record is already in DB
    console.error('[quotes] email failed (DB record saved):', emailError instanceof Error ? emailError.message : emailError);
  }

  return res.status(200).json(ok({ quote_id: quoteId }));
}
