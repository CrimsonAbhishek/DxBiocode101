<?php
// ================================================================
// includes/auth.php — Session Authentication
// ================================================================

define('ADMIN_SESSION_KEY', 'dx_admin_authenticated');
define('ADMIN_SESSION_USER', 'dx_admin_username');
define('SESSION_LIFETIME', 3600); // 1 hour

function session_start_secure(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'lifetime' => SESSION_LIFETIME,
            'path'     => '/',
            'secure'   => isset($_SERVER['HTTPS']),
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }
}

function is_authenticated(): bool {
    session_start_secure();
    if (empty($_SESSION[ADMIN_SESSION_KEY])) return false;

    // Expire idle sessions
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > SESSION_LIFETIME) {
        session_unset();
        session_destroy();
        return false;
    }
    $_SESSION['last_activity'] = time();
    return true;
}

function require_auth(): void {
    if (!is_authenticated()) {
        header('Location: /dxb-ops/login.php?timeout=1');
        exit;
    }
}

function login_admin(string $username): void {
    session_start_secure();
    session_regenerate_id(true); // Prevent session fixation
    $_SESSION[ADMIN_SESSION_KEY]  = true;
    $_SESSION[ADMIN_SESSION_USER] = $username;
    $_SESSION['last_activity']    = time();
    
    // Explicitly rotate CSRF token on authentication state change
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function logout_admin(): void {
    session_start_secure();
    session_unset();
    session_destroy();
}

function current_admin(): string {
    return $_SESSION[ADMIN_SESSION_USER] ?? 'Admin';
}
