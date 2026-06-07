/**
 * Simple in-memory rate limiter.
 *
 * Works per serverless instance (not globally across all Vercel instances).
 * For the expected submission volume (< 500/month), this is perfectly adequate.
 * Upgrade to Upstash Redis if you ever need strict global rate limiting.
 */

interface Entry {
  count: number;
  resetAt: number; // Unix ms
}

const store = new Map<string, Entry>();

/**
 * Check whether an IP is within the allowed rate limit.
 *
 * @param ip          - The requester's IP address.
 * @param limit       - Maximum requests allowed within the window.
 * @param windowSecs  - Rolling window size in seconds.
 */
export function checkRateLimit(
  ip: string,
  limit: number,
  windowSecs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = windowSecs * 1_000;

  // Probabilistic cleanup: clear expired entries ~10% of requests
  // to prevent unbounded memory growth without a full scan every time.
  if (Math.random() < 0.1) {
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) store.delete(key);
    }
  }

  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}
