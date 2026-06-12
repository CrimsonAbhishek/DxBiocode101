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
function rate_limit_check(string $key, int $max = 3, int $window_sec = 300): bool {
    if (session_status() === PHP_SESSION_NONE) session_start();

    $now    = time();
    $bucket = 'rl_' . $key;

    // Initialize
    if (!isset($_SESSION[$bucket]) || !is_array($_SESSION[$bucket])) {
        $_SESSION[$bucket] = [];
    }

    // Remove expired entries
    $_SESSION[$bucket] = array_values(array_filter(
        $_SESSION[$bucket],
        fn(int $t): bool => ($now - $t) < $window_sec
    ));

    if (count($_SESSION[$bucket]) >= $max) {
        return false; // Rate limited
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
