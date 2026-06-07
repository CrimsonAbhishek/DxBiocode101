-- DX BIOCODE — Initial Database Migration
-- Run this SQL directly in the Neon Console (SQL Editor) to create all tables.
-- Alternatively, run: npm run db:push  (pushes schema automatically from drizzle/schema.ts)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Quote Requests ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "quote_requests" (
  "id"            uuid          PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name"          varchar(255)  NOT NULL,
  "phone"         varchar(50)   NOT NULL,
  "email"         varchar(255)  NOT NULL,
  "organization"  varchar(255)  NOT NULL,
  "designation"   varchar(255),
  "facility_type" varchar(100),
  "timeline"      varchar(100),
  "message"       text,
  "ip_address"    varchar(45),
  "created_at"    timestamp     DEFAULT now() NOT NULL
);

-- ── Quote Items (child of quote_requests) ────────────────────────
CREATE TABLE IF NOT EXISTS "quote_items" (
  "id"           uuid         PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "quote_id"     uuid         NOT NULL,
  "product_name" varchar(255) NOT NULL,
  "quantity"     integer      DEFAULT 1 NOT NULL,
  CONSTRAINT "quote_items_quote_id_fk"
    FOREIGN KEY ("quote_id")
    REFERENCES "quote_requests"("id")
    ON DELETE CASCADE
);

-- ── Applicants ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "applicants" (
  "id"               uuid         PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "first_name"       varchar(100) NOT NULL,
  "last_name"        varchar(100) NOT NULL,
  "email"            varchar(255) NOT NULL,
  "phone"            varchar(50)  NOT NULL,
  "position"         varchar(255) NOT NULL,
  "experience"       varchar(100),
  "resume_url"       varchar(1024) NOT NULL,
  "resume_filename"  varchar(255),
  "cover_letter"     text,
  "ip_address"       varchar(45),
  "created_at"       timestamp    DEFAULT now() NOT NULL
);

-- ── Contact Submissions ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "contact_submissions" (
  "id"           uuid         PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name"         varchar(255) NOT NULL,
  "phone"        varchar(50)  NOT NULL,
  "email"        varchar(255) NOT NULL,
  "organization" varchar(255),
  "enquiry_type" varchar(100),
  "message"      text         NOT NULL,
  "ip_address"   varchar(45),
  "created_at"   timestamp    DEFAULT now() NOT NULL
);

-- ── Training Bookings ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "training_bookings" (
  "id"                uuid         PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name"              varchar(255) NOT NULL,
  "email"             varchar(255) NOT NULL,
  "phone"             varchar(50)  NOT NULL,
  "organization"      varchar(255) NOT NULL,
  "location"          varchar(255),
  "training_category" varchar(100),
  "message"           text,
  "ip_address"        varchar(45),
  "created_at"        timestamp    DEFAULT now() NOT NULL
);
