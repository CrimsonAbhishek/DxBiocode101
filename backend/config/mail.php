<?php
// ================================================================
// config/mail.php — SMTP Configuration (Hostinger)
// ================================================================
// Hostinger SMTP settings: hPanel → Email → Email Accounts
// Create a dedicated email: noreply@dxbiocode.com
// ================================================================

define('SMTP_HOST',       getenv('SMTP_HOST') ?: 'smtp.hostinger.com');
define('SMTP_PORT',       getenv('SMTP_PORT') ?: 465);
define('SMTP_ENCRYPTION', getenv('SMTP_ENCRYPTION') ?: 'ssl');
define('SMTP_USERNAME',   getenv('SMTP_USERNAME') ?: 'noreply@dxbiocode.com');
define('SMTP_PASSWORD',   getenv('SMTP_PASSWORD') ?: '');

// Company contact details
define('COMPANY_NAME',    'DX BIOCODE');
define('COMPANY_EMAIL',   'info@dxbiocode.com');     // where to receive leads
define('COMPANY_PHONE',   '+91 8080885059');
define('COMPANY_WEBSITE', 'https://dxbiocode.com');

// Sender identity
define('MAIL_FROM_NAME',  'DX BIOCODE');
define('MAIL_FROM_ADDR',  'info@dxbiocode.com');
