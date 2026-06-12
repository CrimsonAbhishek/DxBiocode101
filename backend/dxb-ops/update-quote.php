<?php
// ================================================================
// dxb-ops/update-quote.php — AJAX Quote Status & Notes Update
// ================================================================

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$base = dirname(__DIR__);
require_once $base . '/includes/auth.php';
require_once $base . '/config/db.php';

// Must be authenticated
if (!is_authenticated()) {
    http_response_code(401);
    die(json_encode(['success' => false, 'message' => 'Unauthorized.']));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['success' => false, 'message' => 'Method not allowed.']));
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];
$id   = (int)($body['id'] ?? 0);

if ($id <= 0) {
    http_response_code(422);
    die(json_encode(['success' => false, 'message' => 'Invalid ID.']));
}

$db = get_db();

// Handle status update
if (isset($body['status'])) {
    $status = trim($body['status']);
    $valid_statuses = ['new', 'contacted', 'quoted', 'closed'];

    if (!in_array($status, $valid_statuses)) {
        http_response_code(422);
        die(json_encode(['success' => false, 'message' => 'Invalid status.']));
    }

    $stmt = $db->prepare("UPDATE quote_requests SET status = :status WHERE id = :id");
    $stmt->execute([':status' => $status, ':id' => $id]);
}

// Handle notes update
if (isset($body['internal_notes'])) {
    $notes = trim($body['internal_notes']);
    $stmt = $db->prepare("UPDATE quote_requests SET internal_notes = :notes WHERE id = :id");
    $stmt->execute([':notes' => $notes, ':id' => $id]);
}

echo json_encode(['success' => true, 'message' => 'Updated successfully.']);
