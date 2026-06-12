<?php
// includes/admin-partials/header.php
// Usage: include with $page_title set
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data:;");

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
