# DX BIOCODE — Backend Setup Guide

This guide walks you through setting up the backend from zero to deployed.

---

## Architecture Overview

```
Frontend (Static HTML/CSS/JS)    →  Vercel CDN
Backend (TypeScript Functions)   →  Vercel Serverless Functions
Database                         →  Neon PostgreSQL (serverless)
File Storage                     →  Vercel Blob
Email                            →  Resend
```

**API Endpoints:**

| Endpoint | Form | Description |
|:---------|:-----|:------------|
| `POST /api/quotes` | Quote Request | Cart items + contact info |
| `POST /api/contact` | Contact Us | General enquiry |
| `POST /api/training` | Training Booking | Session request |
| `POST /api/careers` | Job Application | Applicant + base64 resume |

---

## Step 1 — Create Accounts (all free tiers)

### Neon (Database)
1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a new project → choose **AWS us-east-1**
3. Copy the **Pooled Connection String** (looks like `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`)

### Resend (Email)
1. Go to [resend.com](https://resend.com) → Sign Up
2. Create an **API Key** → copy it
3. Go to **Domains** → Add your domain (`dxbiocode.com`)
4. Add the 3 DNS records Resend shows you (TXT + 2 MX records) to your DNS provider
5. Wait for verification (~10 minutes)

> **No domain yet?** Use `onboarding@resend.dev` as `RESEND_FROM_EMAIL` temporarily.
> This only allows sending to your own email address for testing.

### Vercel Blob (File Storage)
1. Open your [Vercel project dashboard](https://vercel.com/dashboard)
2. Go to **Storage** tab → **Create** → **Blob**
3. Give it a name → click **Create**
4. Go to **.env.local** tab inside the Blob dashboard → copy `BLOB_READ_WRITE_TOKEN`

---

## Step 2 — Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

In Vercel dashboard: **Project → Settings → Environment Variables** → add all variables from `.env.example`.

---

## Step 3 — Install Dependencies

```bash
npm install
```

---

## Step 4 — Create the Database Tables

**Option A (Recommended): Drizzle Push**
```bash
# This reads drizzle/schema.ts and creates/updates tables automatically
npx drizzle-kit push
```

**Option B: Manual SQL**  
Open your Neon project → **SQL Editor** → paste the contents of `drizzle/migrations/0000_initial.sql` → Run.

---

## Step 5 — Deploy to Vercel

```bash
# Deploy (first time — follow the prompts to link your project)
npx vercel

# Subsequent deployments
npx vercel --prod
```

Or just push to your GitHub repo — Vercel auto-deploys on every push to `main`.

---

## Step 6 — Verify Everything Works

1. **Contact Form**: Fill in `contact.html` and submit → check Neon for a new row in `contact_submissions` → check your email for an internal alert
2. **Quote Form**: Add a product to cart → fill in `quote.html` → check `quote_requests` + `quote_items` tables → check email
3. **Training Form**: Fill in the training form on `service.html` → check `training_bookings` → check email
4. **Careers Form**: Upload a PDF resume on `careers.html` → check Vercel Blob Storage for the file → check `applicants` table → check HR email

---

## Security

| Protection | Mechanism |
|:-----------|:---------|
| Bot spam | Honeypot `_bot_check` hidden field — bots fill it, humans don't |
| Brute force | In-memory rate limiting (per serverless instance) |
| CORS | Allow-list of known origins only |
| File type | MIME type + extension double-check on upload |
| File size | 3MB frontend + 5MB backend hard limit |
| SQL injection | Drizzle ORM parameterized queries — no raw SQL |
| XSS | JSON-only API — no HTML rendered server-side |
| Headers | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` via `vercel.json` |

---

## Phase 2 Roadmap

- [ ] Admin dashboard (`/admin`) to view all leads, applications, bookings
- [ ] Analytics (Plausible or PostHog script on all pages)
- [ ] Upstash Redis for true global rate limiting across instances
- [ ] Email domain verification for branded sender address
- [ ] Webhook to CRM (HubSpot / Zoho) on quote submission
