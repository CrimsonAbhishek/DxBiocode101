<?php
// includes/admin-partials/header.php
// Usage: include with $page_title set
function set_header($name, $value) {
  $h = 'header';
  $h($name . ': ' . $value);
}

set_header('X-Content-Type-Options', 'nosniff');
set_header('X-Frame-Options', 'SAMEORIGIN');
set_header('Referrer-Policy', 'strict-origin-when-cross-origin');
set_header('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; script-src 'self' 'unsafe-inline'; frame-ancestors 'none';");
set_header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
set_header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

require_once dirname(__DIR__) . '/../includes/csrf.php';
$csrf_token = csrf_token();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= htmlspecialchars($page_title ?? 'Admin') ?> — DX BIOCODE Admin</title>
  <link rel="stylesheet" href="/dxb-ops/assets/admin.css" />
  <meta name="robots" content="noindex, nofollow" />
  <meta name="csrf-token" content="<?= htmlspecialchars($csrf_token) ?>" />
</head>
<body>
<div class="admin-layout">
