<?php
// ================================================================
// api/submit-quote.php — Quote Form Handler (v2)
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
rate_limit_or_die('quote', 3, 300);

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

// ── 4. CSRF verification ─────────────────────────────────────
$_POST = $body;
csrf_verify();

// ── 5. Input validation ───────────────────────────────────────
$errors = [];

$name         = trim($body['name']         ?? '');
$company      = trim($body['company']      ?? '');
$company_type = trim($body['company_type'] ?? '');
$email        = trim($body['email']        ?? '');
$phone        = trim($body['phone']        ?? '');
$country      = trim($body['country']      ?? '');
$message      = trim($body['message']      ?? '');
$products_raw = $body['products']          ?? [];

$valid_company_types = ['Hospital', 'Clinic', 'Laboratory', 'Distributor', 'Research Center', 'Other'];

if (empty($name) || mb_strlen($name) < 2 || mb_strlen($name) > 100) {
    $errors[] = 'Name must be between 2 and 100 characters.';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 150) {
    $errors[] = 'A valid email address is required.';
}
if (!empty($phone) && !preg_match('/^[\+\d\s\-\(\)]{7,30}$/', $phone)) {
    $errors[] = 'Phone number format is invalid.';
}
if (!empty($company_type) && !in_array($company_type, $valid_company_types)) {
    $company_type = ''; // Silently reset invalid enum values
}
if (mb_strlen($company) > 200)  $errors[] = 'Company name is too long.';
if (mb_strlen($message) > 2000) $errors[] = 'Message is too long (max 2000 characters).';

// Sanitize products
$products      = [];
$product_count = 0;
if (is_array($products_raw)) {
    if (count($products_raw) > 50) {
        $errors[] = 'Too many products requested (max 50).';
    } else {
        foreach ($products_raw as $p) {
        $prod_name = trim($p['product'] ?? $p['name'] ?? '');
        $prod_qty  = max(1, (int)($p['quantity'] ?? 1));
        if (!empty($prod_name) && mb_strlen($prod_name) <= 200) {
            $products[]     = ['product' => $prod_name, 'quantity' => $prod_qty];
            $product_count += $prod_qty;
        }
    }
}
if (empty($products)) {
    $errors[] = 'Please select at least one product.';
}

if (!empty($errors)) {
    http_response_code(422);
    die(json_encode(['success' => false, 'message' => implode(' ', $errors)]));
}

// ── 6. Save to database ───────────────────────────────────────
$db = get_db();

$stmt = $db->prepare("
    INSERT INTO quote_requests
      (name, company, company_type, email, phone, country, message, products_json, product_count, status, ip_address)
    VALUES
      (:name, :company, :company_type, :email, :phone, :country, :message, :products_json, :product_count, 'new', :ip)
");

$stmt->execute([
    ':name'          => $name,
    ':company'       => $company       ?: null,
    ':company_type'  => $company_type  ?: null,
    ':email'         => $email,
    ':phone'         => $phone         ?: null,
    ':country'       => $country       ?: null,
    ':message'       => $message       ?: null,
    ':products_json' => json_encode($products, JSON_UNESCAPED_UNICODE),
    ':product_count' => $product_count,
    ':ip'            => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
]);

// ── 7. Send emails ────────────────────────────────────────────
$data = compact('name', 'company', 'company_type', 'email', 'phone', 'country', 'message');

send_mail(
    COMPANY_EMAIL,
    COMPANY_NAME,
    '📋 New Quote Request — ' . $name . ($company ? " ({$company})" : ''),
    email_quote_company($data, $products)
);

send_mail(
    $email,
    $name,
    'We received your quote request — DX BIOCODE',
    email_quote_customer($data)
);

// ── 8. Respond ────────────────────────────────────────────────
echo json_encode([
    'success' => true,
    'message' => "Thank you, {$name}! Your quote request has been received. We'll be in touch within 1–2 business days.",
]);
