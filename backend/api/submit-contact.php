<?php
// ================================================================
// api/submit-contact.php — Contact Form Handler
// ================================================================

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['success' => false, 'message' => 'Method not allowed.']));
}

if (isset($_SERVER['CONTENT_LENGTH']) && (int)$_SERVER['CONTENT_LENGTH'] > 102400) {
    http_response_code(413);
    die(json_encode(['success' => false, 'message' => 'Payload too large (max 100KB).']));
}

$base = dirname(__DIR__);
require_once $base . '/includes/csrf.php';
require_once $base . '/includes/rate-limit.php';
require_once $base . '/config/db.php';
require_once $base . '/includes/mailer.php';

session_start();

// ── 1. Rate limiting ──────────────────────────────────────────
rate_limit_or_die('contact', 3, 300); // 3 per 5 minutes

// ── 2. Parse body ─────────────────────────────────────────────
$content_type = $_SERVER['CONTENT_TYPE'] ?? '';
if (str_contains($content_type, 'application/json')) {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
} else {
    $body = $_POST;
}

// ── 3. Honeypot check ─────────────────────────────────────────
if (!empty($body['website'])) {
    http_response_code(400);
    exit;
}

// ── 4. CSRF ───────────────────────────────────────────────────
$_POST = $body;
csrf_verify();

// ── 4. Validate ───────────────────────────────────────────────
$errors = [];

$name    = trim($body['name']    ?? '');
$email   = trim($body['email']   ?? '');
$phone   = trim($body['phone']   ?? '');
$subject = trim($body['subject'] ?? '');
$message = trim($body['message'] ?? '');

if (empty($name) || mb_strlen($name) < 2 || mb_strlen($name) > 100) {
    $errors[] = 'Name must be between 2 and 100 characters.';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}
if (empty($message) || mb_strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters.';
}
if (mb_strlen($message) > 2000) {
    $errors[] = 'Message is too long (max 2000 characters).';
}
if (!empty($phone) && !preg_match('/^[\+\d\s\-\(\)]{7,30}$/', $phone)) {
    $errors[] = 'Phone number format is invalid.';
}

if (!empty($errors)) {
    http_response_code(422);
    die(json_encode(['success' => false, 'message' => implode(' ', $errors)]));
}

// ── 5. Save to database ───────────────────────────────────────
$db = get_db();

$stmt = $db->prepare("
    INSERT INTO contact_requests (name, email, phone, subject, message, ip_address)
    VALUES (:name, :email, :phone, :subject, :message, :ip)
");

$stmt->execute([
    ':name'    => $name,
    ':email'   => $email,
    ':phone'   => $phone ?: null,
    ':subject' => $subject ?: null,
    ':message' => $message,
    ':ip'      => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
]);

// ── 6. Send emails ────────────────────────────────────────────
$data = compact('name', 'email', 'phone', 'subject', 'message');

send_mail(
    COMPANY_EMAIL,
    COMPANY_NAME,
    '✉️ New Contact Request — ' . $name,
    email_contact_company($data)
);

send_mail(
    $email,
    $name,
    "We've received your message — DX BIOCODE",
    email_contact_customer($data)
);

// ── 7. Respond ────────────────────────────────────────────────
echo json_encode([
    'success' => true,
    'message' => "Thank you, {$name}! We've received your message and will respond within 24 business hours.",
]);
