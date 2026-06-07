import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_lib/db';
import { applicants } from '../drizzle/schema';
import { careerSchema } from './_lib/validate';
import { checkRateLimit } from './_lib/ratelimit';
import { cors, getIP, ok, fail } from './_lib/response';
import { uploadResume } from './_lib/storage';
import { sendCareerEmails } from './_lib/email';

export const config = {
  api: {
    bodyParser: {
      // 3MB file → ~4MB base64 + JSON overhead → 5MB limit is safe
      sizeLimit: '5mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── CORS + Preflight ──────────────────────────────────────────
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json(fail('Method not allowed', 'SERVER_ERROR'));
  }

  // ── Rate Limit: 5 applications per hour per IP ────────────────
  const ip = getIP(req);
  const { allowed } = checkRateLimit(ip, 5, 3600);
  if (!allowed) {
    return res.status(429).json(fail('Too many requests. Please try again later.', 'RATE_LIMITED'));
  }

  // ── Honeypot ──────────────────────────────────────────────────
  if (req.body?._bot_check !== '') {
    console.warn(`[careers] honeypot triggered from ${ip}`);
    return res.status(200).json(ok({ application_id: 'ignored' }));
  }

  // ── Zod validation ────────────────────────────────────────────
  const parsed = careerSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? 'Invalid input';
    return res.status(400).json(fail(message, 'VALIDATION_ERROR'));
  }

  const { _bot_check: _bc, resume_base64, resume_filename, resume_type, ...appData } = parsed.data;

  // ── Upload resume to Vercel Blob ──────────────────────────────
  let resumeUrl: string;
  try {
    resumeUrl = await uploadResume(resume_base64, resume_filename, resume_type);
  } catch (uploadError) {
    console.error('[careers] resume upload failed:', uploadError instanceof Error ? uploadError.message : uploadError);
    return res.status(500).json(fail('Unable to upload your resume. Please check the file and try again.', 'SERVER_ERROR'));
  }

  // ── Database insert ───────────────────────────────────────────
  let applicationId: string;
  try {
    const [row] = await db
      .insert(applicants)
      .values({
        firstName: appData.first_name,
        lastName: appData.last_name,
        email: appData.email,
        phone: appData.phone,
        position: appData.position,
        experience: appData.experience || null,
        resumeUrl,
        resumeFilename: resume_filename,
        coverLetter: appData.cover_letter || null,
        ipAddress: ip,
      })
      .returning({ id: applicants.id });

    applicationId = row.id;
  } catch (dbError) {
    console.error('[careers] DB insert failed:', dbError instanceof Error ? dbError.message : dbError);
    return res.status(500).json(fail('Unable to save your application. Please try again.', 'SERVER_ERROR'));
  }

  // ── Email notification ────────────────────────────────────────
  try {
    await sendCareerEmails({
      firstName: appData.first_name,
      lastName: appData.last_name,
      email: appData.email,
      phone: appData.phone,
      position: appData.position,
      experience: appData.experience ?? '',
      coverLetter: appData.cover_letter ?? '',
      resumeUrl,
      resumeFilename: resume_filename,
      applicationId,
    });
  } catch (emailError) {
    console.error('[careers] email failed (DB record saved):', emailError instanceof Error ? emailError.message : emailError);
  }

  return res.status(200).json(ok({ application_id: applicationId }));
}
