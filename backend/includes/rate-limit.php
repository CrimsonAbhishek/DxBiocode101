<?php
// ================================================================
// includes/rate-limit.php — Session-Based Rate Limiting
// ================================================================
// Stores submission timestamps in the session.
// Works on shared hosting without Redis/APCu.
// ================================================================

/**
 * Check and record a rate-limited action.
 *
 * @param  string $key        Unique identifier per action (e.g. 'quote', 'contact')
 * @param  int    $max        Maximum allowed submissions in the window
 * @param  int    $window_sec Time window in seconds
 * @return bool   true = allowed, false = blocked
 */
function get_client_ip(): string {
    // Simplest approach, ignoring proxies for shared hosting since reverse proxy headers can be spoofed if not careful.
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

function rate_limit_check(string $key, int $max = 3, int $window_sec = 300): bool {
    // IP-based database tracking for public forms
    if ($key === 'quote' || $key === 'contact') {
        require_once dirname(__DIR__) . '/config/db.php';
        $db = get_db();
        $table = ($key === 'quote') ? 'quote_requests' : 'contact_requests';
        $ip = get_client_ip();
        $ts = time() - $window_sec;
        
        $stmt = $db->prepare("SELECT COUNT(*) FROM {$table} WHERE ip_address = :ip AND created_at > FROM_UNIXTIME(:ts)");
        $stmt->bindValue(':ip', $ip);
        $stmt->bindValue(':ts', $ts, PDO::PARAM_INT);
        $stmt->execute();
        $count = (int)$stmt->fetchColumn();
        
        return $count < $max;
    }

    // Session-backed tracking for admin login
    if (session_status() === PHP_SESSION_NONE) session_start();
    $now    = time();
    $bucket = 'rl_' . $key;

    if (!isset($_SESSION[$bucket]) || !is_array($_SESSION[$bucket])) {
        $_SESSION[$bucket] = [];
    }

    $_SESSION[$bucket] = array_values(array_filter(
        $_SESSION[$bucket],
        fn(int $t): bool => ($now - $t) < $window_sec
    ));

    if (count($_SESSION[$bucket]) >= $max) {
        return false;
    }

    $_SESSION[$bucket][] = $now;
    return true;
}

/**
 * Abort with 429 if rate limited.
 */
function rate_limit_or_die(string $key, int $max = 3, int $window_sec = 300): void {
    if (!rate_limit_check($key, $max, $window_sec)) {
        http_response_code(429);
        die(json_encode([
            'success' => false,
            'message' => 'Too many requests. Please wait a few minutes and try again.',
        ]));
    }
}
