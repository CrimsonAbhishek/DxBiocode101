import type { VercelRequest, VercelResponse } from '@vercel/node';

/* ─── Allowed CORS origins ────────────────────────────────────── */
const ALLOWED_ORIGINS = [
  'https://dx-biocode-101.vercel.app',
  'https://dxbiocode.com',
  'https://www.dxbiocode.com',
  // local dev
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];

/* ─── Apply CORS headers + handle preflight ─────────────────────
   Returns true if the request was a preflight OPTIONS — caller
   should return immediately without processing the body.
────────────────────────────────────────────────────────────────── */
export function cors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin ?? '';

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

/* ─── Extract real IP (Vercel sets x-forwarded-for) ────────────── */
export function getIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0].trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

/* ─── Standard API response shapes ─────────────────────────────── */
export interface ApiSuccess<T = Record<string, unknown>> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code: 'VALIDATION_ERROR' | 'RATE_LIMITED' | 'SERVER_ERROR' | 'BOT_DETECTED';
}

export function ok<T extends Record<string, unknown>>(data: T): ApiSuccess<T> {
  return { success: true, data };
}

export function fail(
  message: string,
  code: ApiError['code'] = 'SERVER_ERROR'
): ApiError {
  return { success: false, error: message, code };
}
