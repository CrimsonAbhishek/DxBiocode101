<?php
// ================================================================
// admin/logout.php
// ================================================================

$base = dirname(__DIR__);
require_once $base . '/includes/auth.php';

logout_admin();
header('Location: /dxb-ops/login.php');
exit;
