-- DX BIOCODE Database Schema
-- Run: mysql -u root -p dxbiocode < schema.sql

CREATE DATABASE IF NOT EXISTS dxbiocode
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE dxbiocode;

-- ── Quote Requests ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(120)  NOT NULL,
  email           VARCHAR(200)  NOT NULL,
  phone           VARCHAR(30)   NOT NULL,
  organization    VARCHAR(200),
  designation     VARCHAR(120),
  facility_type   VARCHAR(100),
  timeline        VARCHAR(100),
  message         TEXT          NOT NULL,
  items_json      JSON,                         -- Stores cart item array
  status          ENUM('new','in_progress','quoted','closed') DEFAULT 'new',
  created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email      (email),
  INDEX idx_status     (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Contact Enquiries ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(120)  NOT NULL,
  email           VARCHAR(200)  NOT NULL,
  phone           VARCHAR(30)   NOT NULL,
  organization    VARCHAR(200),
  enquiry_type    VARCHAR(100),
  message         TEXT          NOT NULL,
  status          ENUM('new','read','replied') DEFAULT 'new',
  created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email      (email),
  INDEX idx_status     (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Training Requests ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS training_requests (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(120)  NOT NULL,
  email             VARCHAR(200)  NOT NULL,
  phone             VARCHAR(30)   NOT NULL,
  location          VARCHAR(200),
  organization      VARCHAR(200)  NOT NULL,
  training_category VARCHAR(150),
  message           TEXT,
  status            ENUM('new','scheduled','completed','cancelled') DEFAULT 'new',
  created_at        DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email      (email),
  INDEX idx_status     (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Career Applications ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS career_applications (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  first_name       VARCHAR(80)   NOT NULL,
  last_name        VARCHAR(80)   NOT NULL,
  email            VARCHAR(200)  NOT NULL,
  phone            VARCHAR(30)   NOT NULL,
  position         VARCHAR(200)  NOT NULL,
  experience       VARCHAR(100),
  cover_letter     TEXT,
  resume_url       VARCHAR(500),    -- Cloudflare R2 public URL
  resume_filename  VARCHAR(255),
  status           ENUM('received','reviewing','shortlisted','rejected','hired') DEFAULT 'received',
  created_at       DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email      (email),
  INDEX idx_position   (position),
  INDEX idx_status     (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
