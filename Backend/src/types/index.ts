// Shared TypeScript types for DX BIOCODE Backend

export interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  designation?: string;
  facilityType?: string;
  timeline?: string;
  message: string;
  items?: Array<{ product_name: string; quantity: number }>;
}

export interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  enquiryType?: string;
  message: string;
}

export interface TrainingRequest {
  name: string;
  email: string;
  phone: string;
  location?: string;
  organization: string;
  trainingCategory?: string;
  message?: string;
}

export interface CareerApplication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience?: string;
  coverLetter?: string;
  resumeUrl?: string;
  resumeFilename?: string;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// DB row types
export interface QuoteRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  organization: string | null;
  designation: string | null;
  facility_type: string | null;
  timeline: string | null;
  message: string;
  items_json: string | null;
  created_at: Date;
}

export interface ContactRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  organization: string | null;
  enquiry_type: string | null;
  message: string;
  created_at: Date;
}

export interface TrainingRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string | null;
  organization: string;
  training_category: string | null;
  message: string | null;
  created_at: Date;
}

export interface CareerRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  experience: string | null;
  cover_letter: string | null;
  resume_url: string | null;
  resume_filename: string | null;
  created_at: Date;
}
