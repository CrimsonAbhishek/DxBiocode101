<?php
// includes/admin-partials/header.php
// Usage: include with $page_title set
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= htmlspecialchars($page_title ?? 'Admin') ?> — DX BIOCODE Admin</title>
  <link rel="stylesheet" href="/admin/assets/admin.css" />
  <meta name="robots" content="noindex, nofollow" />
</head>
<body>
<div class="admin-layout">
