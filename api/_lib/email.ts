import React from 'react';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import type { QuoteEmailData, CareerEmailData, ContactEmailData, TrainingEmailData } from './types';

import QuoteInternalEmail from '../../emails/QuoteInternal';
import QuoteConfirmationEmail from '../../emails/QuoteConfirmation';
import CareerInternalEmail from '../../emails/CareerInternal';
import CareerConfirmationEmail from '../../emails/CareerConfirmation';
import ContactInternalEmail from '../../emails/ContactInternal';
import ContactConfirmationEmail from '../../emails/ContactConfirmation';
import TrainingInternalEmail from '../../emails/TrainingInternal';
import TrainingConfirmationEmail from '../../emails/TrainingConfirmation';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.RESEND_FROM_EMAIL ?? 'DX BIOCODE <info@dxbiocode.com>';
const TO_INTERNAL = process.env.RESEND_TO_EMAIL ?? 'info@dxbiocode.com';

// Re-export types so callers can import from either location
export type { QuoteEmailData, CareerEmailData, ContactEmailData, TrainingEmailData } from './types';

/* ─── Helpers ──────────────────────────────────────────────────── */
/** Mask email for safe logging — e.g. jo***@hospital.com */
function maskEmail(e: string): string {
  return e.replace(/(.{2})(.*)(@.*)/, '$1***$3');
}

async function send(args: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY is not set. Bypassing email to ${maskEmail(args.to)}: "${args.subject}"`);
    return;
  }
  const { error } = await resend.emails.send({
    from: FROM,
    to: args.to,
    subject: args.subject,
    html: args.html,
    ...(args.replyTo ? { reply_to: args.replyTo } : {}),
  });
  if (error) throw new Error(error.message);
}

/* ─── Quote emails ─────────────────────────────────────────────── */
export async function sendQuoteEmails(data: QuoteEmailData): Promise<void> {
  const internalHtml = await render(React.createElement(QuoteInternalEmail, data));
  const confirmHtml = await render(React.createElement(QuoteConfirmationEmail, data));

  await Promise.allSettled([
    send({
      to: TO_INTERNAL,
      subject: `New DX BIOCODE Quote Request — ${data.name}`,
      html: internalHtml,
      replyTo: data.email,
    }),
    send({
      to: data.email,
      subject: 'Your Quote Request Has Been Received — DX BIOCODE',
      html: confirmHtml,
    }),
  ]);

  console.log(`[email] quote emails sent to internal + ${maskEmail(data.email)}`);
}

/* ─── Career emails ────────────────────────────────────────────── */
export async function sendCareerEmails(data: CareerEmailData): Promise<void> {
  const internalHtml = await render(React.createElement(CareerInternalEmail, data));
  const confirmHtml = await render(React.createElement(CareerConfirmationEmail, data));

  await Promise.allSettled([
    send({
      to: TO_INTERNAL,
      subject: `New DX BIOCODE Career Application — ${data.firstName} ${data.lastName}`,
      html: internalHtml,
      replyTo: data.email,
    }),
    send({
      to: data.email,
      subject: 'Application Received — DX BIOCODE',
      html: confirmHtml,
    }),
  ]);

  console.log(`[email] career emails sent to internal + ${maskEmail(data.email)}`);
}

/* ─── Contact emails ────────────────────────────────────────────── */
export async function sendContactEmails(data: ContactEmailData): Promise<void> {
  const internalHtml = await render(React.createElement(ContactInternalEmail, data));
  const confirmHtml = await render(React.createElement(ContactConfirmationEmail, data));

  await Promise.allSettled([
    send({
      to: TO_INTERNAL,
      subject: `New DX BIOCODE Contact Enquiry — ${data.name}`,
      html: internalHtml,
      replyTo: data.email,
    }),
    send({
      to: data.email,
      subject: 'Message Received — DX BIOCODE',
      html: confirmHtml,
    }),
  ]);

  console.log(`[email] contact emails sent to internal + ${maskEmail(data.email)}`);
}

/* ─── Training emails ───────────────────────────────────────────── */
export async function sendTrainingEmails(data: TrainingEmailData): Promise<void> {
  const internalHtml = await render(React.createElement(TrainingInternalEmail, data));
  const confirmHtml = await render(React.createElement(TrainingConfirmationEmail, data));

  await Promise.allSettled([
    send({
      to: TO_INTERNAL,
      subject: `New DX BIOCODE Training Request — ${data.name}`,
      html: internalHtml,
      replyTo: data.email,
    }),
    send({
      to: data.email,
      subject: 'Training Request Received — DX BIOCODE',
      html: confirmHtml,
    }),
  ]);

  console.log(`[email] training emails sent to internal + ${maskEmail(data.email)}`);
}
