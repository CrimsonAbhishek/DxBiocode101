import { z } from 'zod';

/* ─── Shared ─────────────────────────────────────────────────── */
const botCheck = z.string();

const phone = z
  .string()
  .min(7, 'Phone number is too short')
  .max(50, 'Phone number is too long');

const email = z.string().email('Please enter a valid email address');

/* ─── Quote Request ───────────────────────────────────────────── */
export const quoteSchema = z.object({
  name: z.string().min(2, 'Name is required').max(255),
  phone,
  email,
  organization: z.string().min(2, 'Organization is required').max(255),
  designation: z.string().max(255).optional().default(''),
  facility_type: z.string().max(100).optional().default(''),
  timeline: z.string().max(100).optional().default(''),
  message: z.string().max(2000).optional().default(''),
  items: z
    .array(
      z.object({
        product_name: z.string().min(1).max(255),
        quantity: z.number().int().min(1).max(999),
      })
    )
    .min(1, 'Cart is empty — please add at least one item'),
  _bot_check: botCheck,
});

export type QuotePayload = z.infer<typeof quoteSchema>;

/* ─── Contact Submission ───────────────────────────────────────── */
export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(255),
  phone,
  email,
  organization: z.string().max(255).optional().default(''),
  enquiry_type: z.string().max(100).optional().default(''),
  message: z.string().min(5, 'Message is required').max(2000),
  _bot_check: botCheck,
});

export type ContactPayload = z.infer<typeof contactSchema>;

/* ─── Training Booking ────────────────────────────────────────── */
export const trainingSchema = z.object({
  name: z.string().min(2, 'Name is required').max(255),
  email,
  phone,
  organization: z.string().min(2, 'Organization is required').max(255),
  location: z.string().max(255).optional().default(''),
  training_category: z.string().max(100).optional().default(''),
  message: z.string().max(2000).optional().default(''),
  _bot_check: botCheck,
});

export type TrainingPayload = z.infer<typeof trainingSchema>;

/* ─── Career Application ───────────────────────────────────────── */
export const careerSchema = z.object({
  first_name: z.string().min(2, 'First name is required').max(100),
  last_name: z.string().min(2, 'Last name is required').max(100),
  email,
  phone,
  position: z.string().min(2, 'Please select a position').max(255),
  experience: z.string().max(100).optional().default(''),
  cover_letter: z.string().max(10000).optional().default(''),
  resume_base64: z.string().min(100, 'Resume file is required'),
  resume_filename: z.string().min(1).max(255),
  resume_type: z.enum(
    [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ],
    { message: 'Only PDF or DOCX files are allowed' }
  ),
  _bot_check: botCheck,
});

export type CareerPayload = z.infer<typeof careerSchema>;
