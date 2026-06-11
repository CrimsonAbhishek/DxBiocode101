/**
 * Shared email data types — kept in a separate file to prevent the
 * circular dependency between:
 *   api/_lib/email.ts  (imports email template components)
 *   emails/*.tsx        (import these types for component props)
 *
 * Both sides now import from THIS file instead of from each other.
 */

export interface QuoteEmailData {
  name: string;
  phone: string;
  email: string;
  organization: string;
  designation: string;
  facilityType: string;
  timeline: string;
  message: string;
  items: Array<{ product_name: string; quantity: number }>;
  quoteId: string;
}

export interface CareerEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  coverLetter: string;
  resumeUrl: string;
  resumeFilename: string;
  applicationId: string;
}

export interface ContactEmailData {
  name: string;
  phone: string;
  email: string;
  organization: string;
  enquiryType: string;
  message: string;
  submissionId: string;
}

export interface TrainingEmailData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  location: string;
  trainingCategory: string;
  message: string;
  bookingId: string;
}
