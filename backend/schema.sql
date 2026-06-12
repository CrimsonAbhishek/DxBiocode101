-- ================================================================
-- DX BIOCODE — MySQL Schema v2
-- Run in phpMyAdmin: Database > SQL tab
-- Encoding: utf8mb4_unicode_ci
-- ================================================================

SET NAMES utf8mb4;
SET time_zone = '+05:30';

-- ----------------------------------------------------------------
-- Table: admins
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id`            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(50)      NOT NULL UNIQUE,
  `password_hash` VARCHAR(255)     NOT NULL,
  `created_at`    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- Table: quote_requests
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `quote_requests` (
  `id`              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  `name`            VARCHAR(100)     NOT NULL,
  `company`         VARCHAR(200)     DEFAULT NULL,
  `company_type`    ENUM('Hospital','Clinic','Laboratory','Distributor','Research Center','Other')
                                     DEFAULT NULL,
  `email`           VARCHAR(150)     NOT NULL,
  `phone`           VARCHAR(30)      DEFAULT NULL,
  `country`         VARCHAR(100)     DEFAULT NULL,
  `message`         TEXT             DEFAULT NULL,
  `products_json`   JSON             DEFAULT NULL COMMENT 'Array of {product, quantity}',
  `product_count`   INT UNSIGNED     NOT NULL DEFAULT 0,
  `status`          ENUM('new','contacted','quoted','closed') NOT NULL DEFAULT 'new',
  `internal_notes`  TEXT             DEFAULT NULL COMMENT 'Admin-only, never shown to customer',
  `created_at`      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status`        (`status`),
  INDEX `idx_email`         (`email`),
  INDEX `idx_company_type`  (`company_type`),
  INDEX `idx_created_at`    (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- Table: contact_requests
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_requests` (
  `id`          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100)     NOT NULL,
  `email`       VARCHAR(150)     NOT NULL,
  `phone`       VARCHAR(30)      DEFAULT NULL,
  `subject`     VARCHAR(200)     DEFAULT NULL,
  `message`     TEXT             NOT NULL,
  `created_at`  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email`      (`email`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
