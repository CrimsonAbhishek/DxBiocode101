<?php
// ================================================================
// includes/mailer.php — PHPMailer SMTP Wrapper
// ================================================================

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Adjust path depending on whether you use Composer or manual install
$vendor = dirname(__DIR__) . '/vendor/autoload.php';
if (!file_exists($vendor)) {
    error_log('[DX BIOCODE MAIL] vendor/autoload.php not found. Run: composer install');
    return;
}
require_once $vendor;
require_once dirname(__DIR__) . '/config/mail.php';

/**
 * Send an email via Hostinger SMTP using PHPMailer.
 *
 * @param  string       $to_email    Recipient email
 * @param  string       $to_name     Recipient name
 * @param  string       $subject     Email subject
 * @param  string       $html_body   HTML email body
 * @param  string|null  $text_body   Plain-text fallback (auto-generated if null)
 * @return bool
 */
function send_mail(
    string  $to_email,
    string  $to_name,
    string  $subject,
    string  $html_body,
    ?string $text_body = null
): bool {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USERNAME;
        $mail->Password   = SMTP_PASSWORD;
        $mail->Port       = SMTP_PORT;

        if (SMTP_ENCRYPTION === 'ssl') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } else {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        }

        // Sender
        $mail->setFrom(MAIL_FROM_ADDR, MAIL_FROM_NAME);
        $mail->addReplyTo(COMPANY_EMAIL, COMPANY_NAME);

        // Recipient
        $mail->addAddress($to_email, $to_name);

        // Content
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = $subject;
        $mail->Body    = $html_body;
        $mail->AltBody = $text_body ?? strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $html_body));

        $mail->send();
        return true;

    } catch (Exception $e) {
        error_log('[DX BIOCODE MAIL] Failed to send to ' . $to_email . ': ' . $mail->ErrorInfo);
        return false;
    }
}

// ----------------------------------------------------------------
// Email Templates
// ----------------------------------------------------------------

/**
 * Wrap content in the branded DX BIOCODE email shell.
 */
function email_shell(string $content): string {
    return <<<HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>DX BIOCODE</title>
    </head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#3a7bd5 0%,#9b2fc8 55%,#e91e8c 100%);padding:28px 32px;text-align:center;">
                <p style="margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">DX BIOCODE</p>
                <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.75);letter-spacing:1px;text-transform:uppercase;">India's First Handheld Multi-Parameter POCT</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                {$content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
                <p style="margin:0;font-size:11.5px;color:#94a3b8;">
                  DX BIOCODE &nbsp;|&nbsp; <a href="mailto:info@dxbiocode.com" style="color:#3a7bd5;text-decoration:none;">info@dxbiocode.com</a>
                  &nbsp;|&nbsp; <a href="https://dxbiocode.com" style="color:#3a7bd5;text-decoration:none;">dxbiocode.com</a>
                </p>
                <p style="margin:6px 0 0;font-size:10.5px;color:#cbd5e1;">
                  CE &amp; EU-IVD Approved &nbsp;·&nbsp; +91 8080885059
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
    HTML;
}

/**
 * Build the "company notification" email for a quote request.
 */
function email_quote_company(array $data, array $products): string {
    $products_html = '';
    foreach ($products as $p) {
        $name = htmlspecialchars($p['product'] ?? '');
        $qty  = (int)($p['quantity'] ?? 1);
        $products_html .= "<tr>
            <td style='padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13.5px;color:#374151;'>{$name}</td>
            <td style='padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13.5px;color:#374151;text-align:center;font-weight:600;'>{$qty}</td>
          </tr>";
    }

    $name         = htmlspecialchars($data['name']);
    $company      = htmlspecialchars($data['company'] ?? '—');
    $company_type = htmlspecialchars($data['company_type'] ?? '—');
    $email        = htmlspecialchars($data['email']);
    $phone        = htmlspecialchars($data['phone'] ?? '—');
    $country      = htmlspecialchars($data['country'] ?? '—');
    $message      = nl2br(htmlspecialchars($data['message'] ?? ''));
    $time         = date('d M Y, H:i T');

    $content = <<<HTML
    <h2 style="margin:0 0 4px;font-size:20px;font-weight:800;color:#0f172a;">New Quote Request</h2>
    <p style="margin:0 0 24px;font-size:13px;color:#64748b;">Received on {$time}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <tr style="background:#f8fafc;">
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;width:35%;">Name</td>
        <td style="padding:10px 16px;font-size:13.5px;color:#0f172a;">{$name}</td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;width:35%;">Company / Facility</td>
        <td style="padding:10px 16px;font-size:13.5px;color:#0f172a;">{$company}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;background:#f8fafc;">Facility Type</td>
        <td style="padding:10px 16px;font-size:13.5px;color:#0f172a;">{$company_type}</td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Email</td>
        <td style="padding:10px 16px;font-size:13.5px;color:#3a7bd5;"><a href="mailto:{$email}" style="color:#3a7bd5;">{$email}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;background:#f8fafc;">Phone</td>
        <td style="padding:10px 16px;font-size:13.5px;color:#0f172a;">{$phone}</td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Country</td>
        <td style="padding:10px 16px;font-size:13.5px;color:#0f172a;">{$country}</td>
      </tr>
    </table>

    <h3 style="margin:0 0 12px;font-size:14px;font-weight:700;color:#0f172a;">Products Requested</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <tr style="background:#f8fafc;">
        <th style="padding:8px 12px;font-size:11.5px;color:#64748b;text-align:left;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Product</th>
        <th style="padding:8px 12px;font-size:11.5px;color:#64748b;text-align:center;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
      </tr>
      {$products_html}
    </table>

    {$message ? "<h3 style='margin:0 0 8px;font-size:14px;font-weight:700;color:#0f172a;'>Message</h3><p style='margin:0 0 24px;font-size:13.5px;color:#374151;line-height:1.7;background:#f8fafc;padding:16px;border-radius:8px;border-left:3px solid #3a7bd5;'>{$message}</p>" : ''}

    <a href="https://dxbiocode.com/dxb-ops/quotes.php" style="display:inline-block;background:linear-gradient(135deg,#3a7bd5,#9b2fc8);color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:13.5px;">View in Admin Panel →</a>
    HTML;

    return email_shell($content);
}

/**
 * Build the customer confirmation email for a quote request.
 */
function email_quote_customer(array $data): string {
    $name = htmlspecialchars($data['name']);
    $content = <<<HTML
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#0f172a;">Thank you, {$name}!</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7;">
      We've received your quote request. Our team will review your selection and get back to you within <strong>1–2 business days</strong>.
    </p>

    <div style="background:linear-gradient(135deg,#f0f4ff,#f5f0ff);border:1px solid #e0d9f9;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#3a7bd5;text-transform:uppercase;letter-spacing:0.5px;">What happens next?</p>
      <ol style="margin:0;padding-left:20px;font-size:13.5px;color:#374151;line-height:2;">
        <li>Our team reviews your product selection</li>
        <li>We prepare a custom quotation for your facility</li>
        <li>You receive pricing within 1–2 business days</li>
        <li>We schedule a demo if needed</li>
      </ol>
    </div>

    <p style="margin:0 0 8px;font-size:13.5px;color:#374151;">Have an urgent need? Contact us directly:</p>
    <p style="margin:0 0 24px;">
      <a href="https://wa.me/918080885059" style="color:#25d366;font-weight:700;text-decoration:none;">💬 Chat on WhatsApp</a>
      &nbsp;&nbsp;
      <a href="mailto:info@dxbiocode.com" style="color:#3a7bd5;font-weight:700;text-decoration:none;">✉️ info@dxbiocode.com</a>
    </p>

    <a href="https://dxbiocode.com/products.html" style="display:inline-block;background:linear-gradient(135deg,#3a7bd5,#9b2fc8);color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:13.5px;">Browse More Products →</a>
    HTML;

    return email_shell($content);
}

/**
 * Build the "company notification" email for a contact form submission.
 */
function email_contact_company(array $data): string {
    $name    = htmlspecialchars($data['name']);
    $email   = htmlspecialchars($data['email']);
    $phone   = htmlspecialchars($data['phone'] ?? '—');
    $subject = htmlspecialchars($data['subject'] ?? 'General Inquiry');
    $message = nl2br(htmlspecialchars($data['message']));
    $time    = date('d M Y, H:i T');

    $content = <<<HTML
    <h2 style="margin:0 0 4px;font-size:20px;font-weight:800;color:#0f172a;">New Contact Request</h2>
    <p style="margin:0 0 24px;font-size:13px;color:#64748b;">Received on {$time}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <tr style="background:#f8fafc;">
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;width:35%;">Name</td>
        <td style="padding:10px 16px;font-size:13.5px;color:#0f172a;">{$name}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;background:#f8fafc;">Email</td>
        <td style="padding:10px 16px;font-size:13.5px;color:#3a7bd5;"><a href="mailto:{$email}" style="color:#3a7bd5;">{$email}</a></td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Phone</td>
        <td style="padding:10px 16px;font-size:13.5px;color:#0f172a;">{$phone}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;background:#f8fafc;">Subject</td>
        <td style="padding:10px 16px;font-size:13.5px;color:#0f172a;">{$subject}</td>
      </tr>
    </table>

    <h3 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0f172a;">Message</h3>
    <p style="margin:0 0 24px;font-size:13.5px;color:#374151;line-height:1.7;background:#f8fafc;padding:16px;border-radius:8px;border-left:3px solid #3a7bd5;">{$message}</p>

    <a href="https://dxbiocode.com/dxb-ops/contacts.php" style="display:inline-block;background:linear-gradient(135deg,#3a7bd5,#9b2fc8);color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:13.5px;">View in Admin Panel →</a>
    HTML;

    return email_shell($content);
}

/**
 * Build the customer confirmation email for a contact form submission.
 */
function email_contact_customer(array $data): string {
    $name = htmlspecialchars($data['name']);
    $content = <<<HTML
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#0f172a;">We've received your message, {$name}!</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7;">
      Thank you for reaching out to DX BIOCODE. Our team will respond within <strong>24 business hours</strong>.
    </p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:13.5px;color:#166534;line-height:1.7;">
        ✅ Your message has been saved and forwarded to our team.<br>
        We'll be in touch shortly via the email address you provided.
      </p>
    </div>

    <p style="margin:0 0 8px;font-size:13.5px;color:#374151;">In a hurry? Reach us directly:</p>
    <p style="margin:0 0 24px;">
      <a href="https://wa.me/918080885059" style="color:#25d366;font-weight:700;text-decoration:none;">💬 Chat on WhatsApp</a>
      &nbsp;&nbsp;
      <a href="mailto:info@dxbiocode.com" style="color:#3a7bd5;font-weight:700;text-decoration:none;">✉️ info@dxbiocode.com</a>
    </p>

    <a href="https://dxbiocode.com" style="display:inline-block;background:linear-gradient(135deg,#3a7bd5,#9b2fc8);color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:13.5px;">Visit DX BIOCODE →</a>
    HTML;

    return email_shell($content);
}
