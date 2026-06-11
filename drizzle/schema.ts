import { pgTable, uuid, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/* ──────────────────────────────────────────────
   Quote Requests
   Stores each "Request a Quote" form submission.
   One request → many items (quoteItems).
────────────────────────────────────────────── */
export const quoteRequests = pgTable('quote_requests', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  organization: varchar('organization', { length: 255 }).notNull(),
  designation: varchar('designation', { length: 255 }),
  facilityType: varchar('facility_type', { length: 100 }),
  timeline: varchar('timeline', { length: 100 }),
  message: text('message'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const quoteItems = pgTable('quote_items', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  quoteId: uuid('quote_id')
    .notNull()
    .references(() => quoteRequests.id, { onDelete: 'cascade' }),
  productName: varchar('product_name', { length: 255 }).notNull(),
  quantity: integer('quantity').default(1).notNull(),
});

/* ──────────────────────────────────────────────
   Career Applications
   Stores each application form submission.
   Resume is stored in Vercel Blob; URL is saved here.
────────────────────────────────────────────── */
export const applicants = pgTable('applicants', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  position: varchar('position', { length: 255 }).notNull(),
  experience: varchar('experience', { length: 100 }),
  resumeUrl: varchar('resume_url', { length: 1024 }).notNull(),
  resumeFilename: varchar('resume_filename', { length: 255 }),
  coverLetter: text('cover_letter'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/* ──────────────────────────────────────────────
   Contact Submissions
   Stores each "Contact Us" form submission.
────────────────────────────────────────────── */
export const contactSubmissions = pgTable('contact_submissions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  organization: varchar('organization', { length: 255 }),
  enquiryType: varchar('enquiry_type', { length: 100 }),
  message: text('message').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/* ──────────────────────────────────────────────
   Training Bookings
   Stores each "Book a Training Session" request.
────────────────────────────────────────────── */
export const trainingBookings = pgTable('training_bookings', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  organization: varchar('organization', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  trainingCategory: varchar('training_category', { length: 100 }),
  message: text('message'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/* ──────────────────────────────────────────────
   Type exports for use in API handlers
────────────────────────────────────────────── */
export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type NewQuoteRequest = typeof quoteRequests.$inferInsert;
export type QuoteItem = typeof quoteItems.$inferSelect;
export type NewQuoteItem = typeof quoteItems.$inferInsert;
export type Applicant = typeof applicants.$inferSelect;
export type NewApplicant = typeof applicants.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
export type TrainingBooking = typeof trainingBookings.$inferSelect;
export type NewTrainingBooking = typeof trainingBookings.$inferInsert;
