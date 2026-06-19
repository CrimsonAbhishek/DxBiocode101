<?php
// ================================================================
// config/mail.php — SMTP Configuration (Hostinger)
// ================================================================
// Hostinger SMTP settings: hPanel → Email → Email Accounts
// Create a dedicated email: noreply@dxbiocode.com
// ================================================================

define('SMTP_HOST',       'smtp.hostinger.com');    // Hostinger SMTP host
define('SMTP_PORT',       465);                      // 465 = SSL | 587 = TLS
define('SMTP_ENCRYPTION', 'ssl');                    // 'ssl' or 'tls'
define('SMTP_USERNAME',   'noreply@dxbiocode.com'); // your Hostinger email
define('SMTP_PASSWORD',   'your_email_password');    // email account password

// Company contact details
define('COMPANY_NAME',    'DX BIOCODE');
define('COMPANY_EMAIL',   'info@dxbiocode.com');     // where to receive leads
define('COMPANY_PHONE',   '+91 8080885059');
define('COMPANY_WEBSITE', 'https://dxbiocode.com');

// Sender identity
define('MAIL_FROM_NAME',  'DX BIOCODE');
define('MAIL_FROM_ADDR',  'info@dxbiocode.com');
