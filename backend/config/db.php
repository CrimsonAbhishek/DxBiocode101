<?php
// ================================================================
// config/db.php — PDO MySQL Connection
// ================================================================
// NEVER commit real credentials. Set these on the server.
// On Hostinger: cPanel → MySQL Databases → get credentials.
// ================================================================

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: '');
define('DB_USER', getenv('DB_USER') ?: '');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');

function get_db(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        DB_HOST, DB_NAME, DB_CHARSET
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        // Log the real error; never expose it to the browser
        error_log('[DX BIOCODE DB] Connection failed: ' . $e->getMessage());
        http_response_code(500);
        die(json_encode(['success' => false, 'message' => 'Database unavailable. Please try again later.']));
    }

    return $pdo;
}
