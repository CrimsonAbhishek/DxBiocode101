# DX BIOCODE Backend — Hostinger Deployment Guide

## Prerequisites
- Hostinger Business/Premium hosting plan
- A MySQL database created in hPanel
- An email account created in hPanel (e.g. `noreply@dxbiocode.com`)

---

## Step 1 — Create the MySQL Database

1. Log in to **hPanel** → **Databases** → **MySQL Databases**
2. Create a new database: e.g. `u123456789_dxbiocode`
3. Create a database user with a strong password
4. Grant all privileges to that user on the database
5. Note down:
   - Host: `localhost`
   - Database name: `u123456789_dxbiocode`
   - Username: `u123456789_admin`
   - Password: (what you set)

---

## Step 2 — Run the SQL Schema

1. hPanel → **Databases** → **phpMyAdmin** → select your database
2. Click the **SQL** tab
3. Paste the contents of `backend/schema.sql`
4. Click **Go**

You should now have 3 tables: `admins`, `quote_requests`, `contact_requests`.

---

## Step 3 — Configure Credentials

Edit `backend/config/db.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'u123456789_dxbiocode');   // your DB name
define('DB_USER', 'u123456789_admin');        // your DB user
define('DB_PASS', 'YourStrongPassword');      // your DB password
```

Edit `backend/config/mail.php`:
```php
define('SMTP_HOST',     'smtp.hostinger.com');
define('SMTP_PORT',     465);
define('SMTP_USERNAME', 'noreply@dxbiocode.com');
define('SMTP_PASSWORD', 'YourEmailPassword');
define('COMPANY_EMAIL', 'info@dxbiocode.com');
```

---

## Step 4 — Install PHPMailer

SSH into your Hostinger account, then:
```bash
cd public_html
composer install --no-dev
```

**If Composer is not available on your plan**, manually install PHPMailer:
1. Download PHPMailer from https://github.com/PHPMailer/PHPMailer/releases
2. Unzip and upload the `src/` folder as `public_html/vendor/phpmailer/phpmailer/src/`
3. Also upload the PHPMailer autoloader or update `includes/mailer.php` to require files manually

---

## Step 5 — Upload Files to Hostinger

Upload the following to your `public_html/` root (matching your existing structure):

```
public_html/
├── api/
│   ├── submit-quote.php
│   └── submit-contact.php
├── admin/
│   ├── assets/admin.css
│   ├── partials/
│   │   ├── header.php
│   │   └── sidebar.php
│   ├── login.php
│   ├── dashboard.php
│   ├── quotes.php
│   ├── contacts.php
│   ├── update-status.php
│   └── logout.php
├── config/
│   ├── .htaccess         ← IMPORTANT: protects credentials
│   ├── db.php
│   └── mail.php
├── includes/
│   ├── .htaccess         ← IMPORTANT: protects includes
│   ├── auth.php
│   ├── csrf.php
│   ├── rate-limit.php
│   └── mailer.php
├── setup/
│   └── create-admin.php  ← DELETE after use
├── vendor/               ← PHPMailer
└── (all existing .html, .css, .js files untouched)
```

Use **hPanel File Manager** or **FTP** (FileZilla).

---

## Step 6 — Create the Admin Account

1. Visit: `https://dxbiocode.com/setup/create-admin.php`
2. Enter:
   - Username (e.g. `admin`)
   - Password (minimum 10 characters, use a password manager)
   - Confirm password
   - Setup Secret: `dxbiocode-setup-2024`
3. Click **Create Admin**
4. **⚠️ IMMEDIATELY DELETE** `setup/create-admin.php` from the server

---

## Step 7 — Verify Everything Works

### Test the admin login
Visit `https://dxbiocode.com/admin/login.php` and sign in.

### Test the quote form
1. Go to `https://dxbiocode.com/products.html`
2. Add a test kit to the quote
3. Click "Request Official Quotation →"
4. Fill in the form and submit
5. Check:
   - Database: phpMyAdmin → `quote_requests` table has a new row
   - Company email (`info@dxbiocode.com`) received notification
   - Your test email address received confirmation

### Test the contact form
1. Go to `https://dxbiocode.com/contact.html`
2. Fill in and submit the form
3. Check: database row + both emails received

---

## Step 8 — Enable HTTPS (if not already)

hPanel → **SSL** → Enable **Let's Encrypt** SSL for your domain.

---

## Maintenance Notes

### Changing the admin password
No UI for this yet. Use phpMyAdmin:
```sql
UPDATE admins
SET password_hash = '$2y$12$...'   -- generate with PHP: password_hash('newpass', PASSWORD_BCRYPT)
WHERE username = 'admin';
```

Or re-run `create-admin.php` (re-upload it, use it, delete it again).

### Backing up submissions
hPanel → **Databases** → **phpMyAdmin** → **Export** → Quick → SQL format → Go.

### Log files
PHP errors go to `public_html/error_log` on Hostinger (view in File Manager).

---

## Security Checklist

- [x] `config/` directory protected by `.htaccess`
- [x] `includes/` directory protected by `.htaccess`
- [x] Prepared statements used everywhere (no SQL injection)
- [x] CSRF tokens on all forms
- [x] Rate limiting on form endpoints
- [x] Admin session with idle timeout (1 hour)
- [x] Session ID regenerated on login (prevents session fixation)
- [x] Passwords stored with `password_hash()` (bcrypt, cost 12)
- [x] All output escaped with `htmlspecialchars()`
- [x] Honeypot field on both forms (bot trap)
- [x] `noindex, nofollow` on all admin pages
- [ ] TODO: Set up `public_html/.htaccess` to redirect HTTP → HTTPS
- [ ] TODO: Delete `setup/create-admin.php` after first use

---

## SMTP Troubleshooting

If emails are not sending:
1. Check PHP error log (`public_html/error_log`)
2. Look for `[DX BIOCODE MAIL]` entries
3. Verify in hPanel that the email account (`noreply@dxbiocode.com`) exists
4. Try port 587 with `tls` if 465/ssl doesn't work:
   ```php
   define('SMTP_PORT',       587);
   define('SMTP_ENCRYPTION', 'tls');
   ```

---

## Folder Size Reference

The entire backend adds approximately:
- PHP files: ~60 KB
- PHPMailer vendor: ~500 KB
- Total: < 1 MB

Well within Hostinger's storage limits.
