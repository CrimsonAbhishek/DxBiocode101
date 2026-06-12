<?php
// ================================================================
// includes/csrf.php — CSRF Token Protection
// ================================================================

function csrf_start(): void {
    if (session_status() === PHP_SESSION_NONE) session_start();
}

function csrf_token(): string {
    csrf_start();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_field(): string {
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(csrf_token()) . '">';
}

function csrf_verify(): void {
    csrf_start();
    $submitted = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $stored    = $_SESSION['csrf_token'] ?? '';

    if (!$submitted || !$stored || !hash_equals($stored, $submitted)) {
        http_response_code(403);
        die(json_encode(['success' => false, 'message' => 'Invalid request. Please refresh and try again.']));
    }

    // Rotate token after use to prevent replay
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
